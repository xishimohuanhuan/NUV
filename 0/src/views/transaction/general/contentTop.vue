<template>
    <div class="general-top-box">
        <div class="general-top-header">
            <div class="general-top-header-assets">
                <div class="used"><span>{{$t('transaction.general.usedAssets')}} USDT</span>
                    <!-- <img src="../../../assets/img/transaction/title.png" alt=""> -->
                </div>
                <div class="used warning"><span>{{($toNumStr(renderData.available)) || '--'}}</span>
                    <img v-show="warningShow" src="../../../assets/img/transaction/warning.png" alt="">
                </div>
                <!-- <div>1231.4641</div> -->
            </div>
            <!-- <div class="general-top-header-waring">预警</div> -->
            <div class="general-top-header-btn" @click='goBuyHandle'>
                <a href="javascript:void(0)">{{$t('transaction.general.transferOne')}}</a>
            </div>
        </div>
        <span class="border"></span>
        <div class="general-top-ctx">
            <ul>
                <li>
                    <h5>{{$t('transaction.general.marginjVal')}}
                        <img src="../../../assets/img/transaction/title.png" @click="tipsShow" class="ask">
                    </h5>
                    <p v-if="!!marginjVal && isFinite(marginjVal)">{{marginjVal | toNumStrFilter}}%</p>
                    <p v-else>--</p>
                    <!-- <p>{{ renderData.margin+'=='+(renderData.short + renderData.long)*100 || '--'}}%</p> -->
                </li>
                <li>
                    <H5>{{$t('transaction.general.warehouseleverage')}}</H5>
                    <p>{{renderData.leverage ? 'X'+renderData.leverage : '--' }}</p>
                </li>
                <li class="float">
                    <H5>{{$t('transaction.general.floatplo')}}(USDT)</H5>
                    <p :class="{auspicious: floatplo>=0}">
                        <span>{{$toNumStr(floatplo) >0 ? '+'+$toNumStr(floatplo) : $toNumStr(floatplo) || '--'}}</span>
                        <img v-show="floatplo>0" src="../../../assets/img/transaction/goup.png" alt="">
                        <img v-show="floatplo<0" src="../../../assets/img/transaction/drop.png" alt="">
                    </p>
                </li>
            </ul>
            <ul>
                <li>
                    <h5>{{$t('transaction.general.holeDeposit')}}(USDT)</h5>
                    <p>{{((renderData.short || renderData.long) ? $toNumStr((renderData.short || 0) + (renderData.long || 0)) : '--')}}</p>
                </li>
                <li>
                    <h5>{{$t('transaction.general.entrustDeposit')}}</h5>
                    <p>{{$toNumStr(renderData.frozen) || '--'}}</p>
                </li>
                <li>
                    <h5>{{$t('transaction.general.moneyDeposit')}}(USDT)</h5>
                    <p>{{$toNumStr(renderData.margin) || '--'}}</p>
                </li>
            </ul>
        </div>
        <!-- 提示框 -->
        <toast
            v-show="help"
            :showToastType="'operate'"
            :toastContent="helpCont"
            :showToastImgType="''"
            :toastTitle="helpTitle"
            :toastOperateTitle="$t('poptip.quickTrans.iKnow')"
            @handle-main-click="help = false;"
        />
    </div>
</template>

<script>
import { getUserBalanceFuture } from "../request.js";
export default {
    data() {
        return {
            renderData: {},
            timer:null,
            helpCont: '',
            helpTitle: '',
            help: false,
        }
    },
    props: {
        notData: Boolean,
        floatplo: Number,
    },
    watch: {
        notData(val) {
            if(val) {
                this.timer && clearInterval(this.timer)
            }
        }
    },
    created(){
        this.getUserFutureHandle();
        this.timer = setInterval(() => {
            this.getUserFutureHandle();
        },5000)
    },
    computed: {
        warningShow() {
            return this.$store.state.boomWarning
        },
        marginjVal() {
            let posit = ((this.renderData.short || 0) + (this.renderData.long || 0));
            return this.renderData.margin  / posit * 100;
        }
    },
    destroyed() {
        this.timer && clearInterval(this.timer)
    },
    methods: {
        goBuyHandle() {
            // 一键充值
            this.$router.push('/quickTrans/buy')
        },
        tipsShow() {
            this.helpCont = this.$t('trade.bombRule');
            this.helpTitle = this.$t('transaction.general.marginjVal');
            this.help = true;
        },
        getUserFutureHandle() {
            getUserBalanceFuture()
            .then(res => {
                if(res.data.status === 200) {
                    this.renderData = res.data.data[0];
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
.ask {
    margin-left: 10px;
    width: 24px;
    height: 24px;
    vertical-align: middle;
    margin-bottom: 4px;
}
.general-top{
    &-box{
        padding: 0 24px;
        // margin: 26px 0 0;
        padding-bottom: 30px;
    }
    &-header{
        // height: 75px;
        display: flex;
        position: relative;
        width: 100%;
        height: 168px;
        justify-content: space-between;
        align-items: center;
        &-assets{
            text-align: left;
            .used{
                font-size: 22px;
                color: #474747;
                span, img{
                    vertical-align: middle;
                }
                img{
                    width: 24px;
                    height: auto;
                    margin-left: 17px;
                }
                &.warning{
                    height: 44px;
                    line-height: 44px;
                    font-size: 34px;
                    color: #343434;
                    span{
                        vertical-align: sub;
                    }
                    img{
                        width: 33px;
                        height: auto;
                        margin-left: 24px;
                    }
                }
            }
        }
        // &-waring{
        //     position: absolute;
        //     bottom: 0;
        //     left: 260px;
        // }
        &-btn{
            width: 165px;
            height: 55px;
            background-color: #3e80ca;
            border-radius: 5px;
            margin-top: 17px;
            a{
                color: #fff;
                font-size: 24px;
                line-height: 55px;
            }
        }
    }
    &-ctx{
        border-bottom: 1px solid #dcdcdc;
        padding-bottom: 44px;
        ul{
            height: 81px;
            display: flex;
            justify-content: center;
            margin-top: 36px;
            li{
                flex: 1;
                text-align: left;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                font-size: 24px;
                white-space: nowrap;
                &:nth-child(1){
                    flex: 3;
                }
                &:nth-child(2){
                    flex: 3;
                }
                &:nth-child(3){
                    flex: 2;
                }
                &:last-child{
                    text-align: right;
                }
                h5{
                    color: #a5a5a5;
                    font-weight: normal;
                    font-size: 24px;
                }
                p{
                    color: #545454;
                    
                }
                &.float{
                    p{
                        font-size: 34px;
                        color: #d87675;
                        &.auspicious{
                            color: #85bf85
                        }
                        img{
                            width: 40px;
                        }
                    }
                }
            }
        }
    }
}
.border{
    // margin: 20px 0 0;
    position: absolute;
    width: 100%;
    left: 0;
    font-size: none;
    border: none;
    transform: scaleY(0.5);
    border-bottom: 1px solid #dcdcdc;
}
</style>

