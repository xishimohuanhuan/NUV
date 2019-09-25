<template>
    <div class="general-box" v-show='!isLoding'>
        <!-- <h2>概览</h2> -->
        <GeneralTop :notData='notData' :floatplo='floatplo'></GeneralTop>
        <div v-show="!ststusShow" class="general-body">
            <ul>
                <li>{{$t('transaction.general.holdCoin')}}</li>
                <li>{{$t('transaction.general.holeDeposit')}}</li>
                <li>{{$t('transaction.general.float')}}</li>
            </ul>
            <ul 
                class="coin-reader"
                :class="{bad: (item.floatplo < 0)}"
                v-for="(item) in renderDate"
                :key="item.id"
                @click="gotohold(item)"
            >
                <li class="left"><b>{{item.symbol | symbolFilter(0)}}</b><span>/</span><span>{{item.symbol | symbolFilter(1)}}</span></li>
                <li>{{$toNumStr(item.used_margin) || '--'}}</li>
                <li class="float" :class="(item.floatplo >= 0)?'auspicious':'red'"><span>{{( item.floatplo > 0 ? '+'+ $toNumStr(item.floatplo) : $toNumStr(item.floatplo)) || '--'}}</span></li>
            </ul>
        </div>
        <TransactionStatus v-model='ststusShow' @btnclick = 'btnclickHandle' className='transaction-status' :title='titleVal' :btnval='btnVal'></TransactionStatus>
    </div>
</template>

<script>
import GeneralTop from './contentTop.vue'
import TransactionStatus from '@/component/transaction/transactionStatus.vue'
import { getholdShares } from "../request.js";
export default {
    components: {
        GeneralTop,
        TransactionStatus
    },
    data() {
        return{
            ststusShow: true,
            userId: '',
            isLoding: false,
            titleVal: 'transaction.general.noTransactionData',
            btnVal: 'transaction.general.goTransaction',
            renderDate: [],
            timer: null,
            notData: false,
            floatplo: 0,
        }
    },
    filters: {
        symbolFilter(val, n) {
            return val.split('_')[n].toUpperCase();
        }
    },
    beforeRouteEnter(to, from, next){
        next( vm => {
            vm.userId = vm.$getCookie('userId') && JSON.parse(decodeURIComponent(vm.$getCookie('userId'))).userId;
            if(!vm.userId) {
                vm.titleVal = 'transaction.general.pleasecheck',
                vm.btnVal = 'transaction.general.login'
            } else{
                vm.isLoding = true;
                vm.$store.commit('changeLoading', true);
                vm.getPositionHandle();
                vm.timer = setInterval(() => {
                    vm.getPositionHandle();
                }, 5000);
            }
        })
    },
    beforeRouteLeave(to, from, next){
        this.$store.commit('changeLoading', false);
        // this.getPositionHandle();
        clearInterval(this.timer);
        next();
    },
    methods: {
        getPositionHandle() {
            // 获取订单，处理单币种信息
            getholdShares().then(res => {
                if(res.data.status === 200) {
                    let tempDataList = res.data.data || [];
                    this.renderDate = res.data.data || [];
                    if(!res.data.data.length) {
                        this.isLoding = false;
                        this.$store.commit('changeLoading', false);
                        this.changeTitle();
                        this.timer && clearInterval(this.timer);
                        this.notData = true;
                        return;
                    }
                    let arr = [];
                    this.floatplo = 0;
                    tempDataList.forEach(item => {
                        item.floatplo = (item.side===1 ?
                                    this.$numMinus(this.$multipliedBy(item.market_price,item.amount),this.$multipliedBy(item.price,item.amount)) :
                                    this.$numMinus(this.$multipliedBy(item.price,item.amount),this.$multipliedBy(item.market_price,item.amount))) || 0;
                        this.floatplo += item.floatplo;
                        // 数组对象去重
                        if(arr.length === 0) {
                            arr.push(item);
                            return;
                        }
                        let flag = false;
                        arr.map(itemsub => {
                            if(itemsub.symbol === item.symbol) {
                                itemsub.used_margin += item.used_margin;
                                itemsub.open_profit || (itemsub.open_profit = 0);
                                itemsub.open_profit += item.open_profit || 0;
                                itemsub.floatplo += item.floatplo || 0;
                                flag = true;
                            }
                        })
                        if(!flag) {
                            arr.push(item);
                        }
                    })
                    // 数组对象去重
                    // tempDataList.map( item => {
                    //     if(arr.length === 0) {
                    //         arr.push(item);
                    //         return;
                    //     }
                    //     let flag = false;
                    //     arr.map(itemsub => {
                    //         if(itemsub.symbol === item.symbol) {
                    //             itemsub.used_margin += item.used_margin;
                    //             itemsub.open_profit || (itemsub.open_profit = 0);
                    //             itemsub.open_profit += item.open_profit || 0;
                    //             itemsub.floatplo += item.floatplo || 0;
                    //             flag = true;
                    //         }
                    //     })
                    //     if(!flag) {
                    //         arr.push(item);
                    //     }
                    // })
                    this.renderDate = arr.sort((a, b) => {
                        return a.open_profit - b.open_profit;
                    })
                }
                this.isLoding = false;
                this.$store.commit('changeLoading', false);
                this.changeTitle();
            }).catch( err => {
                this.isLoding = false;
                this.$store.commit('changeLoading', false);
                this.changeTitle();
            })
        },
        btnclickHandle() {
            // 点击按钮跳转
            let path = this.$route.path;
            if(!this.userId) {
                this.$loginRoute(path)
            } else {
                let actionCoin =  this.$store.state.actionCoin;
                let name = actionCoin ? actionCoin.name : 'xbtc_usdt'
                this.$router.push(`/transaction/${name}/main`);
            }
        },
        changeTitle() {
            // 改变提示信息
            if(this.renderDate.length === 0) {
                this.titleVal = 'transaction.general.noTransactionData',
                this.btnVal = 'transaction.general.goTransaction'
            } else{
                this.ststusShow = false;
            }
        },
        gotohold(item) {
            // 跳转具体币种的持仓页面
            // localStorage.setItem('actionIcon',JSON.stringify(item));
            // this.$store.commit('changeActionCoin', item);
            this.$router.push(`/transaction/${item.symbol}/holdShares`);
        }
    }
}
</script>

<style lang='less' scoped>
.general-box{
    overflow-y: auto;
    padding-bottom: 100px;
}
.general-body{
    ul{
        padding: 0 24px;
        height: 70px;
        display: flex;
        justify-content: center;
        // margin-top: 36px;
        line-height: 70px;
        li{
            flex: 1;
            text-align: left;
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
            }
            p{
                color: #545454;
            }
        }
    }
    .coin-reader{
        height: 112px;
        padding:  0 22px;
        overflow-y: auto;
        // background: #fce3e0;
        li{
            height: 112px;
            line-height: 112px;
            // border-bottom: 1px solid red;
            // border-top: 1px solid #0f0;
            &:nth-child(1){
                flex: 3;
            }
            &:nth-child(2){
                flex: 3;
            }
            &:nth-child(4){
                flex: 2;
            }
            &.float{
                font-size: 34px;
            }
            &.red{
                color: #d87675 !important;
            }
            &.left{
                b{
                    font-size: 34px;
                    color: #505050;
                    vertical-align: middle;
                }
                span{
                    font-size: 24px;
                    color: #adadad;
                    margin-left: 5px;
                    vertical-align: middle;
                }
                
            }
            &.auspicious{
                font-size: 34px;
                color: #85bf85;
            }
        }
        &.bad{
            background: #fce3e0;
            li.float{
                color: #d87675;
            }
        }
    }
}
.transaction-status{
    margin-top: 32px;
}
</style>
