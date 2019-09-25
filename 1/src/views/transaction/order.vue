<template>
    <div class="transaction-order">
        <div class="detail-header">
            <h2>{{[1,2,4].includes(renderData.state) ?([2,4].includes(renderData.state) ? '已撤销' : '已成交' ): '等待成交'}}</h2>
            <p>{{[renderData.state,renderData.action, renderData.side, renderData.type] | titleStatus($route.name)}}</p>
        </div>
        <div class="detail-money">
            <span>{{$t('trade.coin')}}</span>
            <span>{{renderData.symbol | symbolFilter }}</span>
        </div>
        <ul class="more-detail">
            <li v-show='[0,1,2,3,4].includes(renderData.state)'>
                <div>{{$t('trade.order.tradeType')}}</div>
                <div class="item-val">
                    <span>{{[renderData.side, renderData.action] | sideStatus($route.name, that)}}</span>
                    <!-- <span>{{item}}</span> -->
                </div>
            </li>
            <li v-show='[0,1,2,3,4].includes(renderData.state)'>
                <div>{{$t('trade.order.orderType')}}</div>
                <div class="item-val">
                    <span>{{renderData.type | typeStatus}}</span>
                    <!-- <span>{{item}}</span> -->
                </div>
            </li>
            <!-- <li v-show='((renderData.state === 2) && (renderData.type===2))'> -->
            <li v-show='[2,4].includes(renderData.state)'>
                <div>{{$t('trade.cancelVal')}}</div>
                <div class="item-val">
                    <span>{{$numMinus(renderData.amount, renderData.filled_amount)}}</span>
                    <!-- <span>{{renderData.amount-renderData.filled_amount | toNumStrFilter(8)}}</span> -->
                    <span>{{renderData.symbol | symbolFilter12(0) }}</span>
                </div>
            </li>
            <!-- <li v-show='[0,3].includes(renderData.state) && !((renderData.state === 2) && (renderData.type===2))'> -->
            <li v-show='[0,3].includes(renderData.state) && !([2,4].includes(renderData.state))'>
                <div>{{$t('entrust.amouMon')}}</div>
                <div class="item-val">
                    <span>{{renderData.amount}}</span>
                    <span>{{renderData.symbol | symbolFilter12(0) }}</span>
                </div>
            </li>
            <!-- <li v-show='[0,3].includes(renderData.state) && !((renderData.state === 2) && (renderData.type===2))'> -->
            <li v-show='[0,3,2,4].includes(renderData.state)'>
                <div>{{$t('entrust.commiPrice')}}</div>
                <div class="item-val">
                    <span>{{$toNumStr(renderData.price)}}</span>
                    <span>{{renderData.symbol | symbolFilter12(1) }}</span>
                </div>
            </li>
            <!-- <li v-show='((renderData.state === 2) && (renderData.type===2))'> -->
            <!-- <li v-show='([2,4].includes(renderData.state))'>
                <div>委托价</div>
                <div class="item-val">
                    <span>{{$toNumStr(renderData.price)}}</span>
                    <span>USDT</span>
                </div>
            </li> -->
            <!-- <li v-show='[0,1,2,3,4].includes(renderData.state) && !((renderData.state === 2) && (renderData.type===2))'> -->
            <li v-show='[0,1,3].includes(renderData.state)'>
                <div>{{$t('trade.volume')}}</div>
                <div class="item-val">
                    <span>{{renderData.filled_amount}}</span>
                    <span>{{renderData.symbol | symbolFilter12(0) }}</span>
                </div>
            </li>
            <li v-show='[2,4].includes(renderData.state) && !!Number(renderData.filled_amount)'>
                <div>{{$t('trade.volume')}}</div>
                <div class="item-val">
                    <span>{{renderData.filled_amount}}</span>
                    <span>{{renderData.symbol | symbolFilter12(0) }}</span>
                </div>
            </li>
            <li v-show='[2,4].includes(renderData.state) && !!Number(renderData.filled_value)'>
                <div>{{$t('trade.order.GMV')}}</div>
                <div class="item-val">
                    <span>{{$toNumStr(renderData.filled_value)}}</span>
                    <span>{{renderData.symbol | symbolFilter12(1) }}</span>
                </div>
            </li>
            <li v-show='[2,4].includes(renderData.state) && !!Number(renderData.profit)'>
                <div>{{$t('trade.order.ProfitLoss')}}</div>
                <div class="item-val">
                    <span>{{renderData.profit}}</span>
                    <span>{{renderData.symbol | symbolFilter12(1) }}</span>
                </div>
            </li>
            <!-- <li v-show='[1,2,4].includes(renderData.state) && !((renderData.state === 2) && (renderData.type===2))'> -->
            <li v-show='[1].includes(renderData.state)'>
                <div>{{$t('trade.volumePrice')}}</div>
                <div class="item-val">
                    <span>{{$toNumStr(renderData.filled_value / renderData.filled_amount)}}</span>
                    <span>{{renderData.symbol | symbolFilter12(1) }}</span>
                </div>
            </li>
            <!-- <li v-show='[1,2,4].includes(renderData.state) && !((renderData.state === 2) && (renderData.type===2))'> -->
            <li v-show='[1].includes(renderData.state)'>
                <div>{{$t('trade.order.GMV')}}</div>
                <div class="item-val">
                    <span>{{$toNumStr(renderData.filled_value)}}</span>
                    <span>{{renderData.symbol | symbolFilter12(1) }}</span>
                </div>
            </li>
            <!-- <li v-show='[1,2].includes(renderData.state) && [1,4].includes(renderData.action) && !((renderData.state === 2) && (renderData.type===2))'> -->
            <li v-show='[1].includes(renderData.state) && [1,4].includes(renderData.action)'>
                <div>{{$t('trade.order.ProfitLoss')}}</div>
                <div class="item-val">
                    <span>{{renderData.profit}}</span>
                    <span>{{'USDT'}}</span>
                </div>
            </li>
            <!-- <li v-show='[1,2,4].includes(renderData.state)'>
                <div>手续费</div>
                <div class="item-val">
                    <span>{{renderData.fee}}</span>
                    <span>USDT</span>
                </div>
            </li> -->
            <!-- <li v-show='[0,1,2,3,4].includes(renderData.state) && !((renderData.state === 2) && (renderData.type===2))'> -->
            <li v-show='[0,1,3].includes(renderData.state)'>
                <div>{{$t('trade.fee')}}</div>
                <div class="item-val">
                    <span>{{$toNumStr(renderData.fee,8)}}</span>
                    <span>{{symbolFilterPair(renderData.symbol, renderData.side)}}</span>
                </div>
            </li>
            <!-- <li v-show='[1,2,4].includes(renderData.state) && !((renderData.state === 2) && (renderData.type===2))'> -->
            <li v-show='[1].includes(renderData.state)'>
                <div>{{$t('trade.order.GMT')}}</div>
                <div class="item-val">
                    <span>{{(renderData.updated_at) || (renderData.created_at) | date('yyyy-MM-dd hh:mm:ss')}}</span>
                    <!-- <span>USDT</span> -->
                </div>
            </li>
            <!-- <li v-show='[0,3].includes(renderData.state) && !((renderData.state === 2) && (renderData.type===2))'> -->
            <li v-show='[0,3].includes(renderData.state)'>
                <div>{{$t('entrust.weEntTime')}}</div>
                <div class="item-val">
                    <span>{{renderData.created_at | date('yyyy-MM-dd hh:mm:ss')}}</span>
                    <!-- <span>USDT</span> -->
                </div>
            </li>
            <!-- <li v-show='((renderData.state === 2) && (renderData.type===2))'> -->
            <li v-show='[2,4].includes(renderData.state)'>
                <div>{{$t('trade.cancelTime')}}</div>
                <div class="item-val">
                    <span>{{(renderData.updated_at) || (renderData.created_at) | date('yyyy-MM-dd hh:mm:ss')}}</span>
                    <!-- <span>USDT</span> -->
                </div>
            </li>
        </ul>
        <div class="lxa-bottom-btn" v-show='[0,3].includes(renderData.state)'>
            <button @click="postFormHandle">{{$t('transaction.order.cancleOrder')}}</button>
        </div>
    </div>
</template>

<script>
import { getSymbleOrders ,sigerAllOrderCancel} from "./request.js";
export default {
    data() {
        let that = this;
        return {
            that,
            renderData: {},
            orderStatus: 1,
            orderId:''
        }
    },
    filters: {
        sideStatus(arr, name, that) {   //[side, action]
            if(name === 'tradeOrder') {
                return arr[0] === 1 ? that.$t('entrust.buy') : that.$t('entrust.sell');
            }
            if(arr[1] === 0) {  // 开仓
                switch (arr[0]) {
                    case 1: // 买涨开仓
                        return that.$t('trade.event.event5');
                    case 2: // 买涨平仓
                        return that.$t('trade.event.event6');
                    default:
                        return '--'
                }
            } else if(arr[1] === 1){    // 平仓
                switch (arr[0]) {
                    case 1: // 买跌平仓
                        return that.$t('trade.event.event8');
                    case 2: // 买涨平仓
                        return that.$t('trade.event.event7');
                    default:
                        return '--'
                }
            } else if(arr[1] === 4){    // 爆仓
                switch (arr[0]) {
                    case 1: // 买跌开仓
                        return that.$t('trade.event.event11');
                    case 2: // 买跌平仓
                        return that.$t('trade.event.event10');
                    default:
                        return '--'
                }
            } else {
                return '--'
            }
        },
        typeStatus(val) {
            if(val === 1) return '限价单'
            if(val === 2) return '市价单'
        },
        titleStatus(arr, name) {  //[state, action, side,type]
            if(name === 'tradeOrder') {
                if([1,2,4].includes(arr[0])) {  // 已完成
                    if([2,4].includes(arr[0])) {
                        return '订单已撤销完成'
                    } else {
                        switch (arr[2]) {
                            case 1: // 买涨开仓
                                return '订单已买入成功';
                            case 2: // 买涨平仓
                                return '订单已卖出完成';
                            default:
                                return '--'
                        }
                    }
                } else if([0,3].includes(arr[0])){    // 委托中
                    if(arr[0] === 3) {
                        return '订单下单成功，部分已成交'
                    } else if(arr[0] === 0){
                        return '订单下单成功，等待成交'
                    } else {
                        return '--'
                    }
                } else {
                    return '--'
                }
            }
            if([1,2,4].includes(arr[0])) {  // 已完成
                if([2,4].includes(arr[0])) {
                    return '订单已撤销成功'
                } else {
                    switch (arr[1]) {
                        case 0: // 买涨开仓
                            return '订单已开仓成功';
                        case 1: // 买涨平仓
                            return '订单已平仓结算完成';
                        case 4: // 买跌爆仓 
                            return '订单已爆仓结算完成';
                        default:
                            return '--'
                    }
                }
            } else if([0,3].includes(arr[0])){    // 委托中
                if(arr[2] === 1) {  // ，买涨
                    switch (arr[1]) {
                        case 0: // 买涨开仓
                            return '买涨开仓委托中';
                        case 1: // 买跌平仓
                            return '买跌平仓委托中';
                        // case 4: // 买跌爆仓
                        //     return '买跌爆仓';
                        default:
                            return '--'
                    }
                } else if(arr[2] === 2){    // 买跌
                    switch (arr[1]) {
                        case 0: // 买跌开仓
                            return '买跌开仓委托中';
                        case 1: // 买涨平仓
                            return '买涨平仓委托中';
                        // case 4: // 买跌爆仓
                        //     return '买跌爆仓';
                        default:
                            return '--'
                    }
                } else {
                    return '--'
                }
            } else {
                return '--'
            }
        },
        symbolFilter(val) {
            if(!val) return;
            return val.split('_').join('/').toUpperCase();
        },
        symbolFilter12(val,index) {
            // console.log(val,"==__")
            if(!val) return;
            // return val.split('_')[0].toUpperCase();
            return val.toUpperCase().split('_')[index];
        },
        showLine(val) {
            if(val) return val;
            if(!val) return '--';
        }
    },
    methods: {
        getSymbleOrderHandle(cancel) {
            getSymbleOrders(this.orderId).then(res => {
                if(res.data.status === 200) {
                    this.renderData = res.data.data;
                } else if(cancel){
                    this.$router.go(-1);
                } else {
                    this.renderData = {...this.$route.query};
                }
            })
        },
        // 撤销委托单
        postFormHandle() {
            this.$store.commit('changeLoading', true);
            sigerAllOrderCancel(this.orderId).then(res =>{
                this.$store.commit('changeLoading', false);
                if(res.data.status === 200) {
                    this.$normalToast('成功');
                    this.getSymbleOrderHandle(true);
                }
            }).catch(() => {
                this.$store.commit('changeLoading', false);
            })
        },
        symbolFilterPair(val, side) {
            if(!val) return '--';
            let index = 1;
            if(this.$route.name === 'tradeOrder' && side===1) {
                index = 0;
            }
            return val.toUpperCase().split('_')[index];
        },
    },
    beforeRouteEnter(to, from, next){
        next(vm => {
            vm.$store.commit('changeNoMenu', false);
            vm.orderId = vm.$route.query.id;
            if(!vm.orderId) {
                vm.$router.go(-1);
            } else {
                vm.getSymbleOrderHandle();
            }
        })
    },
    beforeRouteLeave(to, from, next){
        this.$store.commit('changeNoMenu', true);
        this.$store.commit('changeLoading', false);
        next();
    },
}
</script>

<style lang='less' scoped> 
.transaction-order{
    background-color: #f8f8f8; // #f8f8f8;
    overflow: hidden;
    height:100%;
    padding-bottom: 120%;
    .detail-header{
        text-align: left;
        padding: 0 32px;
        h2{
            font-size: 45px;
        }
        p{
            font-size: 24px;
            color: #d87675;
            padding: 13px 0;
        }
    }
    .detail-money {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: auto;
        padding: 0 30px;
        width: 698px;
        height: 105px;
        border-radius: 20px 20px 0 0;
        background-color: #3e80ca;
        font-size: 28px;
        color: #fff;
        &::before {
            content: "";
            position: absolute;
            left: -20px;
            top: 85px;
            width: 40px;
            height: 40px;
            border-radius: 20px;
            background-color: #f8f8f8;
        }
        &::after {
            content: "";
            position: absolute;
            right: -20px;
            top: 85px;
            width: 40px;
            height: 40px;
            border-radius: 20px;
            background-color: #f8f8f8;
        }
    }
    .more-detail{
        background: #fff;
        margin: 0 30px;
        border-radius: 0 0 20px 20px;
        li{
            display: flex;
            justify-content: space-between;
            padding: 0 30px;
            height: 88px;
            line-height: 88px;
            font-size: 28px;
            color: #a5a5a5;
            // border: 1px solid red;
            .item-val{
                color: #363636;
                display: flex;
                justify-content: space-between;
                & span:last-child{
                    margin-left: 5px;
                }
            }
            .auspicious{
                color: #85bf85;
            }
        }
    }
}
</style>
