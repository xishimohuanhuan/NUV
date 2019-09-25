<template>
<!-- 委托 -->
    <div class="entrust-wrap" style="paddingBottom:20%;">

        <div class="entrust-main">
            <div class="entrust-header">
                <div :class="['entrust-one',isCheck ? 'entrust-bl' : ''] " 
                    @click="hanldWT('open')"
                    v-text="$t('entrust.buyentr')"
                ></div>
                <div :class="['entrust-one',isCheck ? '' : 'entrust-bl'] "
                    @click="hanldWT('ping')" 
                    v-text="$t('entrust.sellentr')"
                ></div>
            </div>
            <div v-show="!isLogin && entrustproshow"> 
            <TouchRefresh :onLoadMore='onLoad'  
                :enableLoadMore='enableLoadMore' 
                :showFooter='showFooter'
            >
                <div 
                    class="entrustD-wrap" 
                    v-show="!isLogin && entrustproshow"
                    v-for="(item,index) in entrustpro"
                    :alt="item.id"
                    :key="item.id"
                    @click="goOrder(index)"
                >
                    <div class="entrustD-title">
                        <div class="entrustD-mz">
                            <div :class="['mz-one',( item.action===4 || item.side===2) ?'add-clo':'']">
                                {{item.side ===1  ? $t('entrust.buy') :$t('entrust.sell')}}
                            </div>
                            <div class="mz-two">{{item.symbol}}</div>
                        </div>
                        <div class="entrustD-xj">
                            <div v-show="item.action !==4">{{item.pingTYpe===1 ? $t('entrust.limtOrder'):$t('entrust.cityOrder')}}</div>
                            <div>{{item.state===3 ? $t('entrust.someDeal'):$t('entrust.denDeal')}}</div>
                            <img 
                                v-if='item.action!==4'
                                @click.stop="oneCancelORder(item.id)"
                                :src="cex" 
                                alt=""
                            >
                            <img 
                                v-if='item.action===4'
                                :src="feih" 
                                alt=""
                            >
                        </div>
                    </div>

                    <div class="entrustD-detail">
                        <div class="entrustD-o">
                            <div class="entrustD-l">{{item.action===4?$t('entrust.critPos'):$t('entrust.amouMon')}}{{"("+item.symbol+")"}}</div>
                            <div>{{$toNumStr(item.entrMa,2)}}</div>
                        </div>
                        <div class="entrustD-o">
                            <div >{{item.action===4 ? $t('entrust.stroPart'):$t('entrust.commiPrice')}}(USDT)</div>
                            <div>{{item.pingTYpe===1 ? $toNumStr(item.entrPrice,2):"--"}}</div>
                        </div>
                        <div class="entrustD-o">
                            <div class="entrustD-t">{{item.action===4?$t('entrust.critTime'):$t('entrust.weEntTime')}}</div>
                            <div>{{item.entrTime | date('yy-MM-dd hh:mm')}}</div>
                        </div>
                    </div>

                </div>
            </TouchRefresh>
            </div>
            <!-- </van-list> -->
        </div>
        <div class="entrust-login" v-if="isLogin" >
            <div class="entrust-img"></div>
            <P class="entrust-check" v-text="$t('holdShares.pleasecheck')"></P>
            <div class="entrust-lobtn" @click="goLogin" v-text="$t('holdShares.login')"></div>
        </div>

        <!-- 没有数据显示的页面 -->
        <div class="entrust-datano" v-if="!isLogin && !entrustproshow" > 
            <div class="entrust-noimg"></div>
            <P class="entrust-nodata" v-text="$t('entrust.noholddata')"></P>
        </div>
        
        <!-- 一键撤销 -->
        <toast 
            :isShow="allCancel"
            :showToastType="'operate'" 
            :toastContent="$t('entrust.pdkeyflat')" 
            :showToastImgType="'warning'" 
            :toastTitle="$t('entrust.allcancel')" 
            :toastOperateTitle="$t('holdShares.getit')" 
            :toastAssistOperateTitle="$t('holdShares.cancel')" 
            @handle-main-click="mainClick" 
            @handle-assist-click="allCancel=false"
        />
        <!-- 成功 -->
        <toast 
            :isShow="allCancelShow" 
            :showToastType="'normal'" 
            :toastContent="$t('entrust.revoSucc')"
        />
        <!-- 一键撤销失败 -->
        <toast 
            :isShow="cancelshowallWain"
            :showToastType="'operate'" 
            :toastContent="$t('entrust.undoFail')" 
            :showToastImgType="'warning'" 
            :toastTitle="''" 
            :toastOperateTitle="$t('entrust.meKon')" 
            @handle-main-click="cancelrnMainClick"
        />
    </div>
</template>

<script>
import feih from '../../assets/img/transaction/feih.png'
import cex from '../../assets/img/transaction/cex.png'
import TouchRefresh from "@/component/TouchRefresh";
import { List } from 'vant'
import {
        getEntrustData,
        allOrderCancel,
        sigerAllOrderCancel,
        getEntrustALLData
    } from './request.js'
export default {
    components: {
        List,
        TouchRefresh
    },
    data(){
        return{
            enableLoadMore: true,   // 是否加载结束
            isTopBo:true,
            //loading
            loadingShow:false,
            //撤销失败
            cancelshowallWain:false,
            //加载更多
            bastAllMach:false,
            showCancel:false,
            // 登录就不显示，显示
            isLogin: true,
            feih,
            cex,
            //存的一个撤销状态
            isOnlyCancel:false,
            //改变按钮状态
            isCheck:true,
            //控制全部撤销的弹框
            allCancel:false,
            //显示数据页面
            entrustproshow:true,
            //渲染页面的数据
            entrustpro:[
                // {
                //     //交易对
                //     symbol:"XBTC",
                //     //交易方向买涨
                //     side:0,
                //     //交易方式,限价，市价
                //     pingTYpe:0,
                //     //委托量
                //     entrMa:"123.34",
                //     //委托价
                //     entrPrice:'5323.45',
                //     //委托时间
                //     entrTime:'19-01-04 12:22'
                // }
            ],
            //页码
            page:1,
            loadfn: null,
            size:20,
            dataToOrder:[],
            //成功弹框
            allCancelShow:false,
            //定时器
            timeOut:'',
            //存的是开仓。平仓
            handleCLick:'open',
            //加载更多的数据
            newData:[],
            finished: false,
            loading: false,
            errorT:false,
            dataNewMore:[]
        }
    },
    created(){
        //判断是否登录
        if( this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId'))).userId ){
            //登录，将登录提示隐藏
            this.isLogin=false;
            //登录成功后请求渲染数据
             //默认请求的数据,开仓委托
            this.hanldWT('open');
        }
    },
    computed:{
        showFooter() {
            return !!(this.entrustproshow)
        },  // 是否显示尾部加载或加载完成
    },
    destroyed(){
        clearTimeout(this.timeOut);
        this.$store.commit('changeLoading', false);
    },
    methods:{
        //加载更多
        onLoad(fn) {
            this.loadfn = fn;
            if(!this.enableLoadMore) return;
            this.pushDataLast(this.handleCLick)
        },
        // 去登录页面
        goLogin(){
            let path = this.$route.path;
            this.$loginRoute(path);
        },
        // 点击请求数据
        hanldWT(data){
            this.entrustpro=[]
            this.enableLoadMore= true;
            this.page=1;
            this.newData=[];
            this.dataNewMore=[];
            this.handleCLick=data;
            this.errorT=false;
            this.loading=true;
            if(this.$route.params.icon==="all"){
                this.finished=false;
            }
            // this.finished=false;
            //判断按钮的样式
            if(data==='ping'){
                this.isCheck=false;
            }else{
                this.isCheck=true;
            }
            this.getDataOrders(data);
        },
        
        //去订单详情
        goOrder(ind){
            // this.$router.push('/trade/'+this.dataToOrder[ind].symbol+'/order?id='+this.dataToOrder[ind].id)
            this.$router.push({
                path: '/trade/'+this.dataToOrder[ind].symbol+'/order',
                query: this.dataToOrder[ind]
            })
        },
        //请求订单数据
        getDataOrders(dataQ){
            if(this.$route.params.icon==="all"){
                let allData={
                    state:0,
                    ps:{
                        page:this.page,
                        size:this.size
                    }
                }
                getEntrustALLData(allData).then(res=>{
                    this.loading = false;
                    // console.log(this.page)
                    // console.log(res)
                    if(res.data.status===200 && res.data.data.length>0){
                        // console.log( this.page,"11___________")
                        if(res.data.data.length===this.size){
                            // console.log(this.page,"_______")
                            this.page=this.page+1;
                            this.bastAllMach=true;
                            this.loadfn && this.loadfn()
                            // this.isTopBo=false;
                        }else if(res.data.data.length<this.size){
                            this.finished=true;
                            // this.isTopBo=false;
                            this.enableLoadMore = false;
                            this.bastAllMach=false;
                        }
                        this.entrustproshow=true;
                        //对数据进行处理
                        this.processingData(res.data.data,dataQ);
                    }else if(res.data.status===200 && res.data.data===null){
                        this.enableLoadMore = false;
                    }else{
                        this.enableLoadMore = false;
                        this.loading = false; 
                        this.entrustproshow=false;
                    }
                    this.loadingShow=false;
                    // this.$store.commit('changeLoading', false);
                }).catch(err=>{
                    this.enableLoadMore = false;
                    this.loading = false;  
                    this.errorT=true;
                    this.entrustproshow=false;                
                })
            }else{
                let data={
                    symbol:this.$route.params.icon,
                    state:0,
                    ps:{
                        page:this.page,
                        size:this.size
                    }
                }
                getEntrustData(data).then(res =>{
                    if(res.data.status===200){
                        // console.log(this.page,"11_________00")
                        if(res.data.data.total<this.size){this.isTopBo=false;}
                        if(res.data.data.total>0){
                            if(this.page===Math.ceil(res.data.data.total/this.size)){
                                this.finished=true;
                                this.enableLoadMore = false;
                                this.bastAllMach=false;
                            }else{
                                
                                this.page=this.page+1;
                                this.bastAllMach=true;
                                this.loadfn && this.loadfn()
                            }
                            this.entrustproshow=true;
                            //对数据进行处理
                            this.processingData(res.data.data.list,dataQ);
                        }else{
                            this.entrustproshow=false;
                            this.enableLoadMore = false;

                            // console.log(this.page,"_________00")
                        }
                        // this.entrustproshow=true;
                        
                    }else{
                        this.enableLoadMore = false;
                        this.entrustproshow=false;
                    }
                    this.loading=false;
                    this.loadingShow=false;
                    // this.$store.commit('changeLoading', false);
                }).catch(()=>{})
            }
        },
        //对请求回来的数据进行处理
        processingData(data,daa){
            // console.log(data,daa)
            //买入委托
            if(daa==='open'){
                let dataF=data.filter(item=>{
                    return item.side===1 && (item.state===0 ||item.state===3) && (item.amount !==item.filled_amount);
                })
                // console.log(dataF)
                //判断请求回来的数据是否小于10条
                if(dataF.length<6 && this.dataNewMore.length<6 && this.bastAllMach===true){
                    // this.entrustpro=this.newData.concat(this.entrustpro)
                    this.dataNewMore=this.dataNewMore.concat(dataF)
                    this.getDataOrders(this.handleCLick)
                }else{
                    this.dataNewMore=this.dataNewMore.concat(dataF)
                    this.dataToEnd(this.dataNewMore);
                }

                // this.dataToEnd(this.dataNewMore);
                
            }else if(daa==='ping'){
                //卖出委托
                let dataF=data.filter(item=>{
                    return (item.side===2 || item.action===4) && (item.state===0 || item.state===3);
                })
                //判断请求回来的数据是否小于10条
                if(dataF.length<6 && this.dataNewMore.length<6&&this.bastAllMach===true){
                    this.dataNewMore=this.dataNewMore.concat(dataF)
                    // console.log(this.dataNewMore)
                    this.getDataOrders(this.handleCLick)
                    // this.enableLoadMore = true;
                    // return;
                }else{
                    // if(this.enableLoadMore ===false) return;
                    this.dataNewMore=this.dataNewMore.concat(dataF)
                    this.dataToEnd(this.dataNewMore);
                }
                // this.dataToEnd(this.dataNewMore);
                // this.dataToEnd(dataF);
            }
        },
        //委托最后的数据处理
        dataToEnd(data){
            let dataproHEz=[];
            let dataTOPRO=[];
            for(let i=0;i<data.length;i++){
                dataTOPRO.push(data[i]);
                let jubuData={
                    //订单id
                    id:data[i].id,
                    //交易对
                    symbol:data[i].symbol.split('_')[0].toUpperCase(),
                    //交易方向买涨
                    side: data[i].side,
                    //交易方式,限价，市价
                    pingTYpe:data[i].type,
                    //委托量
                    entrMa:data[i].amount,
                    //委托价
                    entrPrice:data[i].price,
                    //委托时间
                    entrTime:new Date(data[i].created_at).getTime(),
                    //订单状态3.部分成交
                    state:data[i].state,
                    //开仓平仓强平
                    action:data[i].action
                }
                dataproHEz.push(jubuData)
            }
            this.entrustpro=dataproHEz;
            if(!this.entrustpro.length){
                this.loading=false;
                this.finished=true;
            }
            if(this.newData.length>0){
                this.entrustpro=this.newData.concat(this.entrustpro)
            }
            this.dataToOrder=dataTOPRO;
            this.showCancel=this.entrustpro.some(ite=>ite.action!==4);
            if(!this.entrustpro.length){
                this.entrustproshow=false;
            }
        },
        //加载更多
        pushDataLast(){
            // console.log(1111)
            this.loadingShow=true;
            // this.newData=this.entrustpro;
            this.getDataOrders(this.handleCLick)
        },
        onePingCang(){
            if(!this.showCancel){
                return;
            }
            this.isOnlyCancel="allCan";
            this.allCancel=true;
            // this.isOnlyCancel=false;
        },
        //撤销弹框确认按钮
        mainClick(){
            // console.log(this.isOnlyCancel)
            // return;
            if(this.isOnlyCancel==='allCan'){
                let actionSe= this.handleCLick==='open' ? 0 : 1;
                //全部委托页面
                if(this.$route.params.icon==='all'){
                    allOrderCancel(actionSe).then(res=>{
                        if(res.data.status===200){
                            //撤销成功
                            this.successData();
                        }else{
                            //撤销失败
                            this.allCancel=false;
                            this.cancelshowallWain=true;
                        }
                    })
                }else{
                    // let dataFilter=this.entrustpro.filter(ite=> ite.action !==4)
                    // let dataID=this.entrustpro.map(item => item.id);
                    // let str='';
                    // if(dataID.length===0){
                    //     str=dataID[0]
                    // }else if(dataID.length>0){
                    //     str=dataID.join(',')
                    // }
                    // // console.log(str)
                    // this.getEndDataDeal(str);
                    allOrderCancel(actionSe,{symbol:this.$route.params.icon}).then(res=>{
                        // console.log(res)
                        if(res.data.status===200){
                            //撤销成功
                            this.successData();
                        }else{
                            //撤销失败
                            this.allCancel=false;
                            this.cancelshowallWain=true;
                        }
                    })
                }
            }else if(this.isOnlyCancel){
                //单个委托页面
                this.getEndDataDeal(this.isOnlyCancel);
            }
        },
        //处理撤销请求的结果
        getEndDataDeal(data){
            this.$store.commit('changeLoading', false);
            sigerAllOrderCancel(data).then(res=>{
                if(res.data.status===200){
                   //委托撤销成功
                    this.successData();
                }else{
                     //撤销失败
                    this.allCancel=false;
                    this.cancelshowallWain=true;
                }
                this.$store.commit('changeLoading', false);
            })
        },
        //数据请求成功
        successData(){
             //委托撤销成功
            this.allCancel=false;
            this.allCancelShow=true;
            let _this=this;
            this.timeOut=setTimeout(()=>{
                _this.allCancelShow=false;
                this.hanldWT(this.handleCLick);
            },1000)
            // console.log("112_____123")
            //重新请求数据，局部刷新
            
        },
        //撤销失败
        cancelrnMainClick(){
            this.cancelshowallWain=false;
            this.hanldWT(this.handleCLick);
        },
        //单个委托订单的撤销
        oneCancelORder(ind){
            this.isOnlyCancel=ind;
            this.mainClick()
        }
    }

}
</script>

<style lang="scss" scoped>
    .entrust-wrap{
        background-color: rgb(255,255,255);
    }
    .entrust-login{
        position: absolute;
        width: 300px;
        height: 300px;
        top: 30%;
        left: 30%;
    }
    .entrust-img{
        width: 200px;
        height: 200px;
        background: url("../../assets/img/transaction/norecord.png") no-repeat;
        background-size: 100% 100%;
        margin-left: 20%;
    }
    .entrust-check{
        font-size: 28px;
        color:rgb(169,169,169);
        margin-top: 31px;
    }
    .entrust-lobtn{
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
    .entrust-datano{
        position: absolute;
        top: 30%;
        left: 35%;
    }
    .entrust-noimg{
        width: 200px;
        height: 200px;
        background: url("../../assets/img/transaction/norecord.png") no-repeat;
        background-size: 100% 100%;
        margin-left: 15%;
    }
    .entrust-nodata{
        font-size: 28px;
        color:rgb(169,169,169);
        line-height: 47px;
        margin-top: 31px;
    }
    
    .entrust-main{
        width: 704px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
    }
    .entrust-header{
        height: 120px;
        display: flex;
        align-items: center;
        border-bottom:1px solid rgb(220,220,220);
        .entrust-right{
            flex: 1;
            text-align: right;
            display: flex;
            justify-content: flex-end;
            font-size: 24px;
            color: rgb(53,53,53);
            line-height: 55px;
            img{
                margin-left: 19px;
                width: 33px;
                height: 40px;
            }
        }
    }
    .entrust-one{
        width: 164px;
        height: 55px;
        border: 2px solid rgb(220,220,220);
        border-radius: 5px;
        line-height: 55px;
        color: rgb(165,165,165);
        font-size: 24px;
        margin-right: 26px;
    }
    .entrust-bl{
        border: 2px solid rgb(62,128,202);
        color: rgb(62,128,202);
    }
    .entrustD-wrap{
        height: 222px;
        border-bottom: 1px solid rgb(220,220,220);
        display: flex;
        flex-direction: column;
        .entrustD-title{
            height: 40px;
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
        }
        .entrustD-detail{
            height: 75px;
            display: flex;
            justify-content: space-between;
            margin-top: 45px;
            .entrustD-o{
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .entrustD-t{
                    text-align: right;
                }
                .entrustD-l{
                    text-align: left;
                }
                div:nth-child(1){
                    color: rgb(202,202,202);
                    font-size: 22px;
                }
                div:nth-child(2){
                    color: rgb(141,141,141);
                    font-size: 28px;
                }
            }
        }
    }
    .entrustD-mz div{
        height: 40px;
        float: left;
        margin-right: 20px;
        line-height: 40px;
        font-size: 34px;
    }
    .entrustD-mz .mz-one{
        color: rgb(133,191,133);
    }
    .entrustD-mz .add-clo{
        color: rgb(216,118,117);
    }
    .entrustD-mz .mz-two{
        color: rgb(84,84,84);
        
    }
    .entrustD-xj div{
        margin-left: 40px;
        float: left;  
        font-size: 24px;
        color: rgb(84,84,84);
    }
    .entrustD-xj img{
        width: 33px;
        height: 40px;
        margin-left: 19px;
        float: left;  
    }
    .allGengduo{
        width: 100%;
        height: 40px;
    }
</style>
