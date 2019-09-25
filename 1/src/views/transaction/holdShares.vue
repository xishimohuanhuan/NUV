<template>
<!-- 持仓页面 -->
    <div class="holdSh-wrap" style="paddingBottom:20%;">
        <!-- 未登录显示的页面 -->
        <div class="holdSh-login" v-if="isLogin">
            <div class="holdSh-img"></div>
            <P class="holdSh-check" v-text="$t('holdShares.pleasecheck')"></P>
            <div class="holdSh-lobtn" @click="goLogin" v-text="$t('holdShares.login')"></div>
        </div>
        
        <div v-if=" !isLogin" >
            <!-- 没有具体产品数据显示的页面 -->
            <div class="holdSh-datano" v-if="dataDateil" > 
                <div class="holdSh-noimg"></div>
                <P class="holdSh-nodata" v-text="$t('holdShares.noholddata')"></P>
            </div>
            <!-- 数据显示 -->
            <div 
                class="holdSh-data" 
                v-if="showData"
            >
                <!-- 一键全平 -->
                <!-- 具体，一键全平 -->
                <div class="holdSh-data-flat" v-if='isPro!=="all"'>
                    <div class="holdSh-data-lwrop">
                        <div class="holdSh-data-left">
                            <!-- <div
                                class="holdSh-data-title"
                                v-text=" '【' + isTitle + $t('holdShares.warehouse') + '】' "
                            ></div> -->
                            <div
                                class="holdSh-data-title"
                                v-text="$t('holdShares.floatploUsdt') "
                            ></div>
                            <div :class="['addTopXia',(floadDataPirce >= 0) ? 'holdSh-data-range' : 'holdSh-data-red']">
                                {{floadDataPirce>=0 ? ('+'+$toNumStr(floadDataPirce,2)):$toNumStr(floadDataPirce,2)}}
                                <div :class="['holdSh-data-img',floadDataPirce>=0 ? 'class-img':'holdSh-data-imgLoss']"></div>
                            </div>
                        </div>
                        
                    </div>
                    <div 
                        class="holdSh-data-btnping"
                        v-text="$t('holdShares.keyflat')"
                        @click="oneClickHan"
                    ></div>
                </div>
                <!-- all,一键全平 -->
                <div class="holdSh-all-flat" v-if='isPro==="all"'>
                    <div class="holdSh-data-flat all-none">
                        <div class="holdSh-data-lwrop">
                            <div class="holdSh-data-left">
                                <div
                                    class="holdSh-data-title"
                                    v-text="'浮动总盈亏（USDT）'"
                                ></div>
                                <!-- <div :class="['addTopXia',allData.allProfit>=0 ? 'holdSh-data-range' : 'holdSh-data-red']" >
                                    {{allData.allProfit>=0 ? '+'+$toNumStr(allData.allProfit,2) : $toNumStr(allData.allProfit,2)}}
                                    <div :class="['holdSh-data-img',allData.allProfit>=0 ? 'class-img':'holdSh-data-imgLoss']"></div>
                                </div> -->
                                <div :class="['addTopXia',floadDataPirce >=0 ? 'holdSh-data-range' : 'holdSh-data-red']" >
                                    {{floadDataPirce >=0 ? '+'+$toNumStr(floadDataPirce,2) : $toNumStr(floadDataPirce,2)}}
                                    <div :class="['holdSh-data-img',floadDataPirce>=0 ? 'class-img':'holdSh-data-imgLoss']"></div>
                                </div>
                            </div>
                            
                        </div>
                        <div 
                            class="holdSh-data-btnping"
                            v-text="$t('holdShares.keyflat')"
                            @click="oneClickHan"
                        ></div>
                    </div>
                    <div class="all-data">
                        <div class="all-weiz">
                            <div>{{$t('holdShares.balanYe')}}(USDT)</div>
                            <div class="addLeftA" v-text='$toNumStr(allData.yueProfit,2)'></div>
                        </div>
                        <div class="all-weiz">
                            <div>{{$t('holdShares.balanMone')}}(USDT)</div>
                            <div class="addLeftA" v-text='$toNumStr(allData.holdProfit,2)'></div>
                        </div>
                        <div class="all-weiz">
                            <div>{{$t('holdShares.allLeve')}}</div>
                            <div class="addRight" v-text='$toNumStr(allData.allLeverage,2)+" X"'></div>
                        </div>
                    </div>
                </div>

                <!-- 持仓数据 -->
                <div 
                    class="holdSh-prodata"
                    v-for="(item , index) in datapro"
                    :key='index'
                >
                    <div class="holdSh-prodata-title">
                        <div class="holdSh-prodata-left">
                            <div 
                                :class="item.traDiretion===2 ? 'd-red':'col-mai'" 
                                v-text="item.traDiretion===2 ? $t('trading.fall'):$t('holdShares.buyup')"></div>
                            <div class="col-bra" v-text="item.symbol"></div>
                        </div>
                        <div class="holdSh-prodata-right" v-text="$t('holdShares.leverage') + ' '+item.leverage+'X'">
                        </div>
                    </div>

                    <div class="holdSh-prodata-zhong flex-hold">
                        <div class="holdSh-prodata-open">
                            <div class="tong-l" v-text="$t('holdShares.averagepri') +'(USDT)'"></div>
                            <div class="tong-y" v-text="$toNumStr(item.openj,2)" ></div>
                        </div>
                        <div class="holdSh-prodata-present">
                            <div class="tong-l" v-text="$t('holdShares.currentpri') +'(USDT)'"></div>
                            <div class="tong-y center" v-text="$toNumStr(item.currentpri,2)"></div>
                        </div>
                        <div class="holdSh-prodata-prlo">
                            <div class="tong-l" v-text="$t('holdShares.floatplo') +'(USDT)'"></div>
                            <div
                                :class="['tong-y', item.floatplo<0 ? 'add-red' : 'add-bl' ]" 
                                v-text="item.floatplo<0 ? $toNumStr(item.floatplo,2):'+'+$toNumStr(item.floatplo,2)"
                            ></div>
                        </div>
                    </div>

                    <div class="holdSh-prodata-xia flex-hold" >
                        <div class="holdSh-prodata-hold">
                            <div class="tong-l" v-text="$t('holdShares.positionsl') +'('+item.symbol +')'"> </div>
                            <div class="tong-y" v-text="$toNumStr(item.positionsl,2)"></div>
                        </div>
                        <div class="holdSh-prodata-ping">
                            <div class="tong-l" v-text="$t('holdShares.unwindl') +'('+item.symbol +')'"></div>
                            <div class="tong-y center" v-text="$toNumStr(item.unwindl,2)"></div>
                        </div>
                        <div class="holdSh-prodata-bao">
                            <div class="tong-l" v-text="$t('holdShares.marginj') +'(USDT)'"></div>
                            <div class="tong-y" v-text="$toNumStr(item.marginj,2)"></div>
                        </div>
                    </div>
                    <div v-if='isPro!=="all"' class="holdSh-prodata-xia flex-hold" >
                        <div class="holdSh-prodata-hold">
                            <div class="tong-l" v-text="$t('holdShares.marginjVal')"> </div>
                            <div class="tong-y">{{$sliceNum($dividedBy(allData.yueProfit, item.marginj)*100,2)}}%</div>
                        </div>
                        <div class="holdSh-prodata-ping">
                            <div class="tong-l">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{$t('holdShares.resTime')}}</div>
                            <div class="tong-y center">&nbsp;&nbsp;&nbsp;&nbsp;{{countdown | timeDown('hh:mm:ss')}}</div>
                            <!-- date('hh:mm:ss') -->
                        </div>
                        <div class="holdSh-prodata-bao">
                            <div class="tong-l" v-text="$t('holdShares.asset') +'(USDT)'"></div>
                            <div class="tong-y" v-if="$multipliedBy(funtrate.short_rate, 100) || $multipliedBy(funtrate.long_rate, 100)">{{item.traDiretion===1 ? $multipliedBy(funtrate.short_rate, 100):  $multipliedBy(funtrate.long_rate, 100)}}%</div>
                            <div class="tong-y" v-else>--</div>
                        </div>
                    </div>

                    <div class="holdSh-prodata-btn">
                        <div 
                            class="btn-pin" 
                            v-text="$t('trade.profit')"
                            @click="showprofitLossHandle(0,item)"
                        ></div>
                        <div 
                            class="btn-pin" 
                            v-text="$t('trade.loss')"
                            @click="showprofitLossHandle(1,item)"
                        ></div>
                        <div 
                            class="btn-pin" 
                            v-text="$t('holdShares.closeout')"
                            :class="item.traDiretion===2 ? 'bg-red':'bg-mai'" 
                            @click="showprofitLossHandle(2,item)"
                        ></div>
                        <!-- <div 
                            class="btn-qup" 
                            v-text="$t('holdShares.sjcloseout')"
                            @click="cityhanldIspopup(index)"
                        ></div> -->
                    </div>

                </div>

            </div>
        </div>
        <!-- 一键全平弹窗 -->
        <toast 
            :isShow="showToast"
            :showToastType="'operate'" 
            :toastContent="$t('holdShares.pdkeyflat')" 
            :showToastImgType="'warning'" 
            :toastTitle="$t('holdShares.keyflat')" 
            :toastOperateTitle="$t('holdShares.getit')" 
            :toastAssistOperateTitle="$t('holdShares.cancel')" 
            @handle-main-click="mainClick" 
            @handle-assist-click="showToast=false"
        />

        <!-- 全平弹框 -->
        <Popup v-model="ispopup" :close-on-click-overlay='false' >
            <div  class="pop-wrap">
                <div class="pop-ww">
                    <p>限价平仓</p>
                    <div class="pop-ti">
                        <div class="pop-title">
                            <div 
                                :class="['pop-uplo', showTaData.traDiretion===2 ?'popp-red':'popp-blue']"
                                v-text="showTaData.traDiretion===2 ?'买跌':'买涨'"
                            ></div>
                            <div class="pop-pp">{{showTaData.symbol}}</div>
                        </div>
                        <div class="zww"></div>
                    </div>
                    
                    <div class="pop-dateil">
                        <div class="pop-fl">
                            <div>开仓均价(USDT)</div>
                            <div class="pop-data">{{$toNumStr(showTaData.openj,2)}}</div>
                        </div>
                        <div class="pop-fl">
                            <div>{{'持仓量('+showTaData.symbol+')'}}</div>
                            <div class="pop-data">{{$toNumStr(showTaData.positionsl,2)}}</div>
                        </div>
                        <div class="pop-fl">
                            <div>{{'可平量('+showTaData.symbol+')'}}</div>
                            <div class="pop-data">{{$toNumStr(showTaData.unwindl,2)}}</div>
                        </div>
                    </div>

                    <div class="pop-input">
                        <div>平仓价格</div>
                        <input 
                            type="number" 
                            placeholder="请输入平仓价格"
                            v-model="popPrioce"
                            @input="inputBlanceHandle(1)"
                            v-enter-number
                        >
                    </div>
                    <div class="pop-input">
                        <div>平仓数量</div>
                        <input 
                            type="number" 
                            placeholder="请输入平仓数量"
                            v-model="popNumber"
                            @input="inputBlanceHandle(2)"
                            v-enter-number
                        >
                    </div>
                </div>
                <div class="pop-btnw">
                    <div class="pop-btn">
                        <div @click="ispopup=false">考虑一下</div>
                        <div @click="querenPing">确认平仓</div>
                    </div>
                </div>
            </div>
            
        </Popup>

        <!-- 判断是否有数据，全部持仓-->
        <TransactionStatus 
            v-model="isSHOW"
            className='gomain' 
            @btnclick= "gojymain" 
            :title="$t('trade.noHoldSharesDate')" 
            :btnval="$t('transaction.general.goTransaction')"
        ></TransactionStatus>
        <!-- all一健全平成功 -->
        <toast 
            :isShow="showall"
            :showToastType="'normal'" 
            :toastContent="$t('trade.submitSuccess')"
        />
        <!-- 一键全平失败 -->
        <toast 
            :isShow="showallWain"
            :showToastType="'operate'" 
            :toastContent="titleMass" 
            :showToastImgType="'warning'" 
            :toastTitle="''" 
            :toastOperateTitle="$t('poptip.quickTrans.iKnow')" 
            @handle-main-click="warnMainClick"
        />

        <!-- 止盈止损 -->
        <Popup 
            v-model="profitLoss"
            position='bottom'
            class="profit-loss"
        >
            <div class="postOut">
                <StopPopup 
                    @closepopup='profitLoss=false'
                    v-model='profitLossType'
                    @shijia='sjTestHandle'
                    @xianjia='xjTestHandle'
                    :index='stopPopupIndex'
                    :itemData='stopPopupData'
                    :symbol='showTaData.symbol'
                    :openAverage='showTaData.openj'
                    :handleAmount='showTaData.positionsl'
                    :canDoAmount='showTaData.unwindl'
                    ></StopPopup>
            </div>
        </Popup>
    </div>
</template>

<script>
const COUNT_DOWN = [4, 12, 20] // 结算时间具体时辰

import TransactionStatus from '@/component/transaction/transactionStatus.vue'
import StopPopup from './stopPopup.vue'
import {
        getholdShares,
        handleKeyping,
        handleKeySymble,
        getUserBalanceFuture,
        getFunding,
        getSymbols
    } from './request.js'
import { constants } from 'crypto';
import { Popup } from 'vant'
export default {
    components:{
        TransactionStatus,
        StopPopup,
        Popup: Popup
    },
    data(){
        let that = this;
        return{
            stopPopupData: {},
            stopPopupIndex: '',
            profitLoss: false,  //止盈止损弹窗
            profitLossType: 0,  //显示止盈止损
            titleMass: that.$t('setting.postErr'),
            //失败弹框
            showallWain:false,
            //显示具体产品，没有数据的页面
            dataDateil:false,
            //全部持仓，没有数据，显示去交易
            isSHOW:false,
            //显示具体币种
            showData:false,
            //提示成功弹框显示
            showall:false,
            // 登录就不显示
            isLogin:  true,
            //页面是all，具体种类
            isPro:this.$route.params.icon,
            //
            isTitle:'XBTC',
            //产品的涨幅
            proRange:"+1000110.32",
            //一键全平弹框隐藏
            showToast:false,
            //显示全仓弹框
            ispopup:false,
            countdown: '--',
            funtrate: {},
            //请求回来的产品数据
            allData:{
                // //全仓盈亏
                // allProfit:"",
                // //全部保证金余额
                // yueProfit:'',
                // //持仓保证金
                // holdProfit:'',
                // //全仓杠杆
                // allLeverage:''
            },
            datapro:[
                // {
                //     //交易方向
                //     "traDiretion":2,
                //     //交易对
                //     "symbol":"XBTC",
                //     //杠杆
                //     "leverage":"20",
                //     // 开仓均价
                //     "openj":"123132.32",
                //     // 当前价
                //     "currentpri":"223434.23",
                //     //浮动盈亏
                //     "floatplo":"-12332.45",
                //     //持仓量
                //     "positionsl":"23453.23",
                //     //平仓量
                //     "unwindl":"3453.23",
                //     //保证金
                //     "marginj":"53435.33"
                // }
            ],
            //平仓弹框的数据
            popupData:{},
            showTaData:{},
            //平仓弹框，平仓价格
            popPrioce:'',
            //平仓弹框，平仓数量
            popNumber:'',
            //全部的浮动盈亏
            floadDataPirce:0,
            //轮循
            timeER:'',
            timeList: null,
            timeSucc:'',
            symbolDataMa:false,
            flagTwo:true,
            countdownTimer: null,
        }
    },
    watch:{
        popPrioce(val){
            Number(val)
        },
        profitLoss(val) {
            if(val) {
                this.$overflowScrolling(false);
            } else {
                setTimeout(() => {
                    this.$overflowScrolling(true);
                }, 300)
            }
        }

    },
    created(){
        //判断是否登录
        if( this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId'))).userId ){
            //登录，将登录提示隐藏
            this.isLogin=false;
            this.$store.commit('changeLoading', true);
            //判断该页面的是不是全部all
            if(this.$route.params.icon==="all"){
                // this.getAllHoldData();
                // //轮循
                // this.timeER=setInterval(()=>{
                //     // console.log(1)
                //     // this.getDatahold();
                //     //获取持仓页面的全部，all
                //     this.getAllHoldData();
                // },5000)
            }else{
                 //将没数据页面显示
                // let symbol=JSON.parse(localStorage.getItem("actionIcon"));
                // this.isTitle=symbol.title.split("/")[0];
                getFunding(this.$route.params.icon).then(res => {
                    this.funtrate = res.data.data;
                }).catch(() => {})
                this.countdownHandle();
                this.isTitle=this.$route.params.icon.split("_")[0].toUpperCase();
                // 初始化websocket接口
                this.initWebSocket(this.$interfaceGolangWss);
            }
            this.getAllHoldData();
            //轮循
            this.timeER=setInterval(()=>{
                // console.log(1)
                // this.getDatahold();
                //获取持仓页面的全部，all
                this.getAllHoldData();
            },5000)
            //进入叶明请求数据
            this.getDatahold();
            this.timeList = setInterval(() => {
                this.getDatahold();
            },5000)
            // this.getAllHoldData();
            // 倒计时
        }
        
    },
    destroyed(){
        clearInterval(this.timeER);
        this.timeList && clearInterval(this.timeList);
        this.$store.commit('changeLoading', false);
        this.countdownTimer &&  clearInterval(this.countdownTimer);
        if(this.websock) {
            this.websock.close(); //离开路由之后断开websocket连接
        }
    },
    methods:{
        sjTestHandle(data, unwindl) {
            if(unwindl===0){
                this.titleMass=this.$t('trade.holdSharesValZero')
                this.showallWain=true;
                return;
            }
            this.shiPricePing(data)
        },
        countdownHandle() {
            if(this.countdownTimer) {
                clearInterval(this.countdownTimer);
            }
            let date = new Date(),
                newHour = date.getHours(),
                endHour,
                resDate;
            for(let i=0,len = COUNT_DOWN.length; i<len;i++ ) {
                if((COUNT_DOWN[i] <= newHour) && (newHour < COUNT_DOWN[i+1])) {
                    endHour = COUNT_DOWN[i+1];
                    break;
                }
            }
            if(endHour === undefined) {
                endHour = COUNT_DOWN[0];
                let day = new Date().getDate();
                resDate = date.setDate(day+1); //过了20：00就算第二天的时间
            }
            // XXX: 转换为截至结算时间,如当日的 20:00:00
            // resDate = date.setHours(15);
            // resDate = date.setMinutes(38);
            resDate = date.setHours(endHour);
            resDate = date.setMinutes(0);
            resDate = date.setSeconds(0);
            resDate = date.setMilliseconds(0); //
            resDate = resDate -  new Date();
            this.countdownTimer =  setInterval(() =>{
                resDate = resDate-1000;
                if(resDate <= 0) {
                    getFunding(this.$route.params.icon).then(res => {
                        this.funtrate = res.data.data;
                    }).catch(() => {})
                    this.countdownHandle();
                    return;
                }
                this.countdown = resDate;
            },1000)
        },
        xjTestHandle(opts,item) {
            // return;
            this.querenPing(opts,item.unwindl)
        },
        showprofitLossHandle(index,opts) {
            this.stopPopupIndex = index;
            this.stopPopupData = opts;
            this.profitLoss = true;
            this.$overflowScrolling(false);
            this.profitLossType = index;
        },
        //一键全平按钮
        oneClickHan(){
            this.showToast=true;
            if(this.datapro.length>1){
                this.flagTwo=true;
            }
        },
        //平仓失败
        warnMainClick(){
            this.showallWain=false;
            // window.location.reload();
            if(this.$route.params.icon==="all"){
                    this.getAllHoldData();
            }else{
                this.isTitle=this.$route.params.icon.split("_")[0].toUpperCase();
            }
            this.getDatahold();
            
        },
        // 去登录页面
        goLogin(){
            let path = this.$route.path;
            this.$loginRoute(path);
        },
        //错误处理
        makeCuoMassage(data, params={}){
            // console.log(params,data);
            let limitPrice = this.getlimitPrice(params);
            switch (data) {
                case "ERR_BALANCE_NOT_ENOUGH":
                    this.titleMass = this.$t('trade.LevelableLess');    //可平量不足，请确认操作
                    this.showallWain=true;
                    break;
                case "ERR_BUY_PRICE_LESS_LIMIT":
                    this.titleMass = this.$t('trade.priceLiss'); // 买入价低于下限
                    this.showallWain=true;
                    break;
                case "ERR_BUY_AMOUNT_LESS_LIMIT":
                    this.titleMass = this.$t('trade.amountLiss');  // 单笔交易量低于下限
                    this.showallWain=true;
                    break;
                case "ERR_BUY_PRICE_OVER_LIMIT":
                    this.titleMass = this.$t('trade.buyPriceOver'); // 买入价超过上限
                    this.showallWain=true;
                    break;
                case "ERR_BUY_AMOUNT_OVER_LIMI":
                    this.titleMass = this.$t('trade.amountOver');  // 单笔交易量超过上限
                    this.showallWain=true;
                    break;
                case "ERR_SELL_AMOUNT_LESS_LIMIT":
                    this.titleMass = this.$t('trade.amountLiss');  // 单笔交易量低于下限
                    this.showallWain=true;
                    break;
                case "ERR_SELL_AMOUNT_OVER_LIMIT":
                    this.titleMass = this.$t('trade.amountOver') + (limitPrice['ERR_SELL_AMOUNT_OVER_LIMIT'] ||'');  // 单笔交易量超过上限
                    this.showallWain=true;
                    break;
                case "ERR_SELL_PRICE_OVER_LIMIT":
                    this.titleMass = this.$t('trade.sellPriceOver');  // 卖出价超过上限
                    this.showallWain=true;
                    break;
                case "ERR_WRONG_EVENT":
                    this.titleMass = this.$t('trade.handleErr'); // 操作失败，请稍后重试
                    this.showallWain=true;
                    break;
                case "ERR_SELL_PRICE_LESS_LIMIT":
                    this.titleMass = this.$t('trade.sellPriceLiss')+(limitPrice['ERR_SELL_PRICE_LESS_LIMIT'] || ''); // 卖出价低于下限
                    this.showallWain=true;
                    break;
                default:
                    this.titleMass = this.$t('trade.handleErr'); // 操作失败，请稍后重试
                    this.showallWain=true;
                    break;
            }
        },
        getlimitPrice(params) {
            let symbolsInfo = localStorage.getItem('symbolsInfo') ? JSON.parse(localStorage.getItem('symbolsInfo')) : [];
            let coinsInfo = localStorage.getItem('coinInfo') ? JSON.parse(localStorage.getItem('coinInfo')) : [];
            let symbolInfo = symbolsInfo.filter(item => (item.symbol === params.symbol));
            let coinInfo = [...coinsInfo.assitsCoinArr, ...coinsInfo.extendCoinArr, ...coinsInfo.mainCoinArr].filter(item => (item.name === params.symbol));
            let limit1 = {}, limit2 = {};
            if(coinInfo.length && symbolInfo.length) {
                return {
                    ERR_SELL_AMOUNT_LESS_LIMIT: symbolInfo[0].l_min_amount,
                    ERR_SELL_AMOUNT_OVER_LIMIT:  symbolInfo[0].l_max_amount,
                    ERR_BUY_AMOUNT_LESS_LIMIT: params.side === 1 ? symbolInfo[0].m_min_sell_amount : symbolInfo[0].l_min_amount,
                    ERR_BUY_PRICE_OVER_LIMIT: this.$toNumStr(symbolInfo[0].l_buy_price_rate * coinInfo[0].new_price, 4),
                    ERR_SELL_PRICE_LESS_LIMIT: this.$toNumStr(symbolInfo[0].l_sell_price_rate * coinInfo[0].new_price, 4),
                    ERR_BUY_AMOUNT_OVER_LIMIT: params.type === 1 ? this.$toNumStr(symbolInfo[0].m_max_buy_value/params.price, 4) : symbolInfo[0].m_max_buy_value
                }
            }
            return {}
        },
        // 平仓输入框限制
        inputBlanceHandle(type,e){
            if(type === 1) {    //平仓价格输入框
                let temp = this.popPrioce;
                let dioLeng = temp.split('.')
                if(dioLeng[1] && dioLeng[1].length > 4) {
                    this.popPrioce = this.popPrioce.slice(0,-1);
                }
            }
            if(type === 2) {    //平仓数量输入框
                let temp = this.popNumber;
                let dioLeng = temp.split('.')
                if(dioLeng[1] && dioLeng[1].length > 4) {
                    this.popNumber = this.popNumber.slice(0,-1);
                }
            }
        },
        //确认全平
        mainClick(){
            //全部持仓，全平
            if(this.$route.params.icon==="all"){
                this.$store.commit('changeLoading', true);
                handleKeyping().then(res=>{
                    if(res.data.status===200){
                        //all全部平仓成功
                        this.showall=true;
                        this.timeSucc=setTimeout(()=>{
                            this.showall=false;
                        },1000)
                        this.getDatahold();
                        this.getAllHoldData();
                    }else{
                        this.showallWain=true;
                         //一键全平失败
                        // this.makeCuoMassage(res.data.data)
                    }
                    this.showToast=false;
                    this.$store.commit('changeLoading', false);
                }).catch(()=>{})
            }else{
                //交易对，具体平仓
                this.pingHandleCang('sAll')
            }
        },
        //平仓
        pingHandleCang(data){
            //交易对的全平
            if(data==="sAll"){
                let len =this.datapro.length;
                for(let i=0; i<this.datapro.length;i++){
                    let dataProD={
                        symbol:this.$route.params.icon,
                        side:this.datapro[i].traDiretion===1 ? 2 :1,
                        type:2,
                        action:1,
                        amount:this.datapro[i].positionsl,
                        source:2
                    }
                    //发送交易对的一键全平
                    if(len===2){
                        //第一次不请求数据
                        this.shiPricePing(dataProD,len,i);
                    }else{
                        this.shiPricePing(dataProD);
                    }
                }
            }
        },
        //市价平仓
        shiPricePing(data,dd,ind){
            // console.log("_",dd,ind)
            handleKeySymble(data).then(res=>{
                if(res.data.status===200){
                    this.profitLoss = false;
                    if(!ind){
                        //平仓成功
                        this.showall=true;
                        this.timeSucc=setTimeout(()=>{
                                this.showall=false;
                        },1000)
                    }
                    if(dd!==2){
                        this.getDatahold();
                    }
                }else{
                    if(dd){
                        this.flagTwo=false;
                    }else{
                        this.makeCuoMassage(res.data.data, data)
                        // this.showallWain=true;
                    }
                }
                if(ind===1 && this.flagTwo===true){
                    //平仓成功
                    this.showall=true;
                    this.timeSucc=setTimeout(()=>{
                            this.showall=false;
                    },1000)
                    this.getDatahold();
                }else if(ind===1 && this.flagTwo===false){
                    this.titleMass= this.$t('trade.unwinfail') //'部分合约币种持仓可平量超过其一键全平可平范围，请自行手动平仓'
                    this.showallWain=true;
                    // this.getDatahold();
                }
                this.ispopup=false;
                this.showToast=false;
                // this.$store.commit('changeLoading', false);
            }).catch(err=>{
                this.showToast=false;
                this.showallWain=true;
            })
        },
        //跳转到交易页面,默认
        gojymain() {
            this.$router.push('/transaction/xbtc_usdt/main');
        },
        //得到全部持仓
        getAllHoldData(){
            // this.$store.commit('changeLoading', true);
            getUserBalanceFuture().then(res=>{
                if(res.data.status===200){
                    // console.log(res.data.data[0])
                    this.allData={
                        //全仓盈亏
                        allProfit:res.data.data[0].profit || 0,
                        //全部保证金余额
                        yueProfit:res.data.data[0].margin,
                        //持仓保证金
                        holdProfit:(res.data.data[0].short || 0)+(res.data.data[0].long || 0),
                        //全仓杠杆
                        allLeverage:res.data.data[0].leverage
                    }
                }
            }).catch().then(() => {
                this.$store.commit('changeLoading', false);
            })
        },
        //请求的得到数据
        getDatahold(){
            let dataParama='';
            if(this.isPro!=='all'){
                dataParama=this.isPro
            }
            // this.$store.commit('changeLoading', true);
            getholdShares(dataParama).then(res =>{
                this.$store.commit('changeLoading', false);
                if(res.data.status===200){
                    let dataF=res.data.data;
                    if(res.data.data && dataF.length){
                        let price=0;
                        let arr={};
                        let pushData=dataF.map(item=>{
                            price=this.$numPlus(price,((item.side===1 ?
                                    this.$numMinus(this.$multipliedBy(item.market_price,item.amount),this.$multipliedBy(item.price,item.amount)) :
                                    this.$numMinus(this.$multipliedBy(item.price,item.amount),this.$multipliedBy(item.market_price,item.amount))) || 0));
                            if(!arr[item.symbol]){
                                arr[item.symbol]=item.symbol
                            }
                            return{
                                //交易方向
                                "traDiretion":item.side,
                                //交易对
                                "symbol":item.symbol.split("_")[0].toUpperCase(),
                                //杠杆
                                "leverage":item.leverage,
                                // 开仓均价
                                "openj":item.price,
                                // 指数价
                                // "currentpri":item.cur_price,
                                // 当前价
                                "currentpri":item.market_price,
                                //浮动盈亏
                                // "floatplo":item.open_profit || 0,
                                "floatplo":(item.side===1 ?
                                    this.$numMinus(this.$multipliedBy(item.market_price,item.amount),this.$multipliedBy(item.price,item.amount)) :
                                    this.$numMinus(this.$multipliedBy(item.price,item.amount),this.$multipliedBy(item.market_price,item.amount))) || 0,
                                //持仓量
                                "positionsl":item.amount,
                                //可平量
                                "unwindl":((item.amount*100)-((item.frozen ?item.frozen : 0)*100))*0.01,
                                //保证金
                                "marginj":item.used_margin,
                                // 交易对
                                "oldSymbol": item.symbol
                            }
                        })
                        //改交易对的全部浮动盈亏
                        this.floadDataPirce=price;
                        this.datapro=pushData;
                        //请求成功，显示渲染页面
                        this.showData=true;
                        this.symbolDataMa=arr;
                        if(this.$route.params.icon==='all'){
                            this.initWebSocket(this.$interfaceGolangWss);
                        }
                        return ;
                    }                
                }
                this.timeER && clearInterval(this.timeER);
                this.timeList && clearInterval(this.timeList);
                //请求回来的数据为空
                if(this.$route.params.icon==="all"){
                    //全部持仓没有数据
                    this.isSHOW=true;
                }else{
                    //其他没有数据
                    this.dataDateil=true;
                }
                this.showData=false;
                this.$store.commit('changeLoading', false);
                return;
            }).catch(err=>{
                //请求错误处理
                this.$store.commit('changeLoading', false);
            })
        },
        //平仓，对数据进行处理,限价
        hanldIspopup(ind){
            this.ispopup=true;
            this.popupData={
                symbol:this.datapro[ind].symbol.toLowerCase()+'_usdt',
                side:this.datapro[ind].traDiretion===1 ? 2 :1,
                type:1,
                action:1,
                price:Number(this.popPrioce),
                amount:Number(this.popNumber),
                source:2
            }
            this.showTaData=this.datapro[ind];
            //给输入框里面附数据
            this.popPrioce=this.$toNumStr(this.datapro[ind].currentpri);
            this.popNumber=this.$toNumStr(this.datapro[ind].unwindl);
        },
        //限价平仓
        querenPing(paramsData,unwindl){
            // start
            // console.log(Number(this.popPrioce))
            // return;
            if(!Number(paramsData.price) || (Number(paramsData.price)<0)) {    // 未输入平仓价格
                this.$normalToast(this.$t('trade.noZeroPricePing'),1000);   // noZeroPricePing
                return ;
            }
            // if(isNaN(Number(this.popPrioce.trim()))) {    // 未输入平仓价格
            //     this.$normalToast('请输入正确的平仓价格',1000);  
            //     return ;
            // }
            if(!Number(paramsData.amount) || (Number(paramsData.amount)<0)) {    // 未输入平仓价格数量
                this.$normalToast(this.$t('trade.noZeroNumPing'),1000); // 请输入大于0的平仓数量
                return ;
            }
            if(Number(paramsData.amount)>unwindl) {    // 未输入平仓价格数量
                this.$normalToast(this.$t('trade.moreThanAmount')+'!!',1000);
                return ;
            }
            // if(isNaN(Number(this.popNumber.trim()))) {    // 未输入平仓价格
            //     this.$normalToast('请输入正确的平仓数量',1000);
            //     return ;
            // }
            // end
            // paramsData.price=Number(popPrioce);
            // paramsData.amount=Number(popNumber);
            this.shiPricePing(paramsData)
        },
        //单个持仓的市价平仓
        cityhanldIspopup(ind, amount){
            let pupDataCity={
                symbol:this.datapro[ind].symbol.toLowerCase()+'_usdt',
                side:this.datapro[ind].traDiretion===1 ? 2 :1,
                type:2,
                action:1,
                amount:amount || this.datapro[ind].positionsl,
                source:2
            };
            if(this.datapro[ind].unwindl===0){
                this.titleMass='合约币种持仓可平量为0'
                this.showallWain=true;
                return;
            }
            this.shiPricePing(pupDataCity);
        },
        initWebSocket(wsurl) {
            return ; // 使用轮询查询数据
            this.websock = new WebSocket(wsurl);
            this.websock.onopen = this.websocketonopen; //连接成功
            this.websock.onmessage = this.websocketonmessage; //广播成功
            this.websock.onerror = this.websocketonerror; //连接断开，失败
            this.websock.onclose = this.websocketclose; //连接关闭
        }, //初始化weosocket
        websocketonopen() {
            // this.heatBeat();
            if(this.$route.params.icon==="all"){
                // console.log(this.symbolDataMa)
                for(let key in this.symbolDataMa){
                    this.websocketsend({ event: "subscribe", channel:this.symbolDataMa[key]+".ticker" });
                }
                return;
            }
            this.websocketsend({ event: "subscribe", channel:this.$route.params.icon+".ticker" });
        }, //连接成功
        websocketonerror() {
        }, //连接失败
        websocketclose() {
        }, //各种问题导致的 连接关闭
        //数据接收
        websocketonmessage(data) {
            var resdata = JSON.parse(data.data);
            // console.log(data.data)
            if(this.$route.params.icon==="all"){
                for(let i=0;i< this.datapro.length;i++){
                    // console.log("1_2",this.datapro[i])
                    if(resdata["type"].split("_")[0].toUpperCase() === this.datapro[i].symbol){
                        // console.log("11+++++",resdata["type"].split("_")[0].toUpperCase())
                        if(this.datapro[i].traDiretion===1){
                            this.datapro[i].floatplo=resdata["data"][0]*this.datapro[i].positionsl-this.datapro[i].openj*this.datapro[i].positionsl;
                        }else if(this.datapro[i].traDiretion===2){
                            this.datapro[i].floatplo=this.datapro[i].openj*this.datapro[i].positionsl-resdata["data"][0]*this.datapro[i].positionsl;
                        }
                        this.datapro[i].currentpri=resdata["data"][0];
                    } 
                }
                let allDataCangcang=0;
                for(let i=0;i<this.datapro.length;i++){
                    allDataCangcang=allDataCangcang+this.datapro[i].floatplo
                }
                this.allData.allProfit=allDataCangcang;
                return;
            }
            if (resdata["type"] === this.$route.params.icon+".ticker") {
                //得到websocket数据进行处理
                this.datapro=this.datapro.map(item=>{
                    if(item.traDiretion===1){
                        item.floatplo=resdata["data"][0]*item.positionsl-item.openj*item.positionsl;
                    }else if(item.traDiretion===2){
                        item.floatplo=item.openj*item.positionsl-resdata["data"][0]*item.positionsl;
                    }
                    item.currentpri=resdata["data"][0];
                    return item;
                })
                // console.log(this.datapro)
                let allDataCangcang=0;
                for(let i=0;i<this.datapro.length;i++){
                    allDataCangcang=allDataCangcang+this.datapro[i].floatplo
                }
                this.floadDataPirce=allDataCangcang;
                // console.log(resdata["data"][0])
            }
        },
        //数据发送
        websocketsend(data) {
        this.websock.send(JSON.stringify(data));
        }
    },
}
</script>
<style>
.toast{
    z-index: 2100 !important;
}
</style>

<style lang="scss" scoped >
 
    .holdSh-login{
        position: absolute;
        width: 300px;
        height: 300px;
        top: 30%;
        left: 30%;
    }
    .holdSh-img{
        width: 200px;
        height: 200px;
        background: url("../../assets/img/transaction/norecord.png") no-repeat;
        background-size: 100% 100%;
        margin-left: 20%;
    }
    .holdSh-check{
        font-size: 28px;
        color:rgb(169,169,169);
        margin-top: 31px;
    }
    .holdSh-lobtn{
        width: 165px;
        height: 55px;
        font-size: 24px;
        background-color: rgb(62,128,202);
        color:rgb(255,255,255);
        line-height: 55px;
        border-radius: 11px;
        margin-top: 29px;
        margin-left: 20%;
    }

    // 没有数据显示的样式
    .holdSh-datano{
        position: absolute;
        top: 30%;
        left: 35%;
    }
    .holdSh-noimg{
        width: 200px;
        height: 200px;
        background: url("../../assets/img/transaction/norecord.png") no-repeat;
        background-size: 100% 100%;
        margin-left: 15%;
    }
    .holdSh-nodata{
        font-size: 28px;
        color:rgb(169,169,169);
        line-height: 47px;
        margin-top: 31px;
    }
    .holdSh-wrap{
        background-color: rgb(255,255,255);
    }
    .holdSh-data{
        padding-top: 10px;
        width: 705px;
        // height: 1700px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        
    }
    .holdSh-data-flat{
        height: 144px;
        border-bottom: 1px solid rgb(220,220,220);
    }
    .holdSh-data-lwrop{
        float: left;
        display: flex;
        margin-top: 26px;
    }
    .holdSh-data-left{
        min-width: 135px;
    }
    .holdSh-data-title{
        text-align: left;
        margin-bottom: 15px;
        font-size: 22px;
        color: rgb(71,71,71);
    }
    .addTopXia{
        display: flex;
    }
    .holdSh-data-range{
        text-align: left;
        font-size: 34px;
        color: rgb(133,191,133);
    }
    .holdSh-data-red{
        text-align: left;
        font-size: 34px;
        color:rgb(216,118,117);
    }
    .holdSh-data-img{
        // margin-top: 22%;
        margin-left: 30px;
        width: 40px;
        height: 33px;
    }
    .class-img{
        background: url("../../assets/img/transaction/goup.png") no-repeat;
        background-size: 100% 100%;
    }
    .holdSh-data-imgLoss{
        background: url("../../assets/img/transaction/drop.png") no-repeat;
        background-size: 100% 100%;
    }
    .holdSh-data-btnping{
        float: right;
        width: 165px;
        height: 55px;
        border-radius: 5px;
        border: 2px solid rgb(62,128,202);
        line-height: 53px;
        color: rgb(62,128,202);
        font-size: 24px;
        margin-top: 40px;
    }
    .holdSh-prodata{
        // height: 415px;
        border-bottom: 1px solid #dcdcdc;
    }
    .holdSh-prodata-title{
        display: flex;
        justify-content: space-between;
        margin-top: 24px;
        color: rgb(84,84,84);
        .holdSh-prodata-left{
            display: flex;
            height: 38px;
            line-height: 34px;
            font-size: 34px;
            .col-mai{
                color: rgb(133,191,133);
            }
            .d-red{
                color:rgb(216,118,117);
            }
            .col-bra{
                margin-left: 17px;
            }
        }
        .holdSh-prodata-right{
            font-size: 24px;
        }
    }
    .flex-hold{
        display: flex;
        justify-content: space-between;
        margin-top: 12px;
    }

    .tong-l{
        font-size: 22px;
        color: rgb(202,202,202);
        text-align: left;
    }
    .tong-y{
        font-size: 28px;
        color: rgb(141,141,141);
        text-align: left;
        margin-top: 8px;
        &.center{
            text-align: center;
        }
    }
    .holdSh-prodata-bao .tong-y{
        text-align: right;
    }
    .holdSh-prodata-prlo .tong-y{
        text-align: right;
    }
    .add-red{
        color: rgb(216,118,117);
    }
    .add-bl{
        color: rgb(133,191,133);
    }
    .holdSh-prodata-btn{
        display: flex;
        justify-content: space-between;
        height: 75px;
        // line-height: 75px;
        margin-top: 20px;
        .btn-pin{
            // width: 50%;
            width: 165px;
            height: 55px;
            line-height: 55px;
            border: 1px solid rgb(62,128,202);
            font-size: 28px;
            border-radius: 5px;
            color: rgb(62,128,202);
        }
        .bg-red{
            background: rgb(216,118,117);
            color: #fff;
            border: 0;
        }
        .bg-mai{
            background: rgb(133,191,133);
            color: #fff;
            border: 0;
        }
        .btn-qup{
            width: 50%;
            background-color: rgb(216,118,117);
            font-size: 28px;
            color: rgb(255,255,255);
        }
    }
    .pop-wrap{
        width: 584px;
        height: 770px;
        position: relative;
        .pop-ww{
            width: 560px;
            margin: 0 auto;
            p{
            font-size: 34px;
            margin-top: 59px;
            }
        }
        
    }
    .pop-ti{
        border-bottom: 1px solid rgb(220,220,220);
        .zww{
            height: 28px;
        }
    }
    .pop-title{
        height: 35px;
        display: flex;
        justify-content: space-between;
        font-size: 34px;
        margin-top: 47px;
        color: rgb(84,84,84);
        line-height: 35px;
        .pop-uplo{
            margin-left: 20px;
        }
        .pop-pp{
            margin-right: 20px;
        }
        .popp-red{
            color: rgb(216,118,117);
        }
        .popp-blue{
            color: rgb(133,191,133);
        }
    }
    .pop-dateil{
        height: 223px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        color: rgb(165,165,165);
        font-size: 24px;
        border-bottom: 1px solid rgb(220,220,220);
        .pop-fl{
            display: flex; 
            justify-content: space-between;
            margin:0 20px;
            .pop-data{
                font-size: 28px;
                color: rgb(54,54,54);
            }
        }
    }
    .pop-input{
        height: 99px;
        display: flex;
        font-size: 28px;
        color: rgb(87,87,87);
        line-height: 99px;
        border-bottom: 1px solid rgb(220,220,220);
        div{
            margin-left: 20px;
        }
        input{
            text-align: right;
            width: 70%;
            padding-left: 80px;
            border:none;
            height:90%;
        }
    }
    .pop-btn{
        height: 110px;
        display: flex;
        justify-content: space-between;
        font-size: 34px;
        div{
            flex: 1;
            height: 100%;
            line-height: 98px;
            background-color: rgb(62,128,202);
            color: rgb(255,255,255);
        }
        div:nth-child(1){
            background-color: rgb(246,246,246);
            color: rgb(78,78,78);
        }
    }
    
    .van-popup{
        border-radius: 20px;
    }
    .pop-btnw{
        width: 584px;
        position: absolute;
        bottom: 0;
    }
    .gomain{
        margin-top: 30%;
    }
    .holdSh-all-flat .all-none{
        border:none;
    }
    .all-data{
        display: flex;
        justify-content: space-between;
    }
    .all-weiz{
        height: 81px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        // align-items: flex-start;
        font-size: 24px;
        color:rgb(165,165,165);
        div:nth-child(2){
            color:rgb(84,84,84);
        }
    }
    .holdSh-all-flat{
        border-bottom: 1px solid rgb(220,220,220);
        height: 263px;
    }
    .addRight{
        text-align: right;
    }
    .addLeftA{
        text-align: left;
    }
    .profit-loss{
        border-radius: 30px 30px 0 0;
    }
</style>
