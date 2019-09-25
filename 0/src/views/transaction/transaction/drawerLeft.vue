<template>
    <transition name="fade">
    <div v-show="value" class="popup" @touchstart.stop="" @touchmove.stop="" @click="closePopupHandle">        
        <div class="popup-body" @click.stop="">
            <div class="popup-body-header">
                <h3 @click="transactionChangeHandle(1)" :class="{action: transactionType===1}">{{$t('assets.quick.contractTransaction')}}</h3>
                <!-- <h3 @click="transactionChangeHandle(2)" :class="{action: transactionType===2}">{{$t('assets.quick.coinTransaction')}}</h3> -->
            </div>
            <div class="popup-body-content">
                <div class="content-top" @click="toGeneralHandle">
                    <h5>{{$t('transaction.allHold')}}</h5>
                    <div>
                        <img src="../../../assets/img/transaction/quanchicang.png" alt="">
                    </div>
                </div>
                <div class="content-usdt">
                    <p @click="changeCoinTypeHandle(1)" :class="{chooseType: chooseType === 1}">{{$t('quotation.optional')}}</p>
                    <p @click="changeCoinTypeHandle('USDT')" :class="{chooseType: chooseType === 'USDT'}">USDT</p>
                    <p></p>
                    <p></p>
                    <p></p>
                </div>
                <div class="content-title">
                    <p>{{$t('transaction.tradeCion')}}</p>
                    <p>{{$t('transaction.newPrice')}}(USDT)</p>
                </div>
            </div>
            <ul class="content-coin" v-if='(renderCoin.length !== 0)'>
                <li 
                    @click="changeCoinHandle(item)"
                    :class="{coinActive: item.name == icon}"
                    v-for="item in renderCoin"
                    :key="item.name">
                    <div class="coin-type">
                        <span>{{item.title}}</span>
                        <!-- <span>{{item.name}}</span> -->
                        <span v-show="holdList.includes(item.name)" class="tag"></span>
                    </div>
                    <div class="coin-price">{{isNaN(String(item.new_price)) ? '--' : item.new_price}}</div>
                </li>
            </ul>
            <div class='loading' v-if="loading">
                <Loading size='28px' type="spinner" />
            </div>
            <div class="no-data" v-if='(renderCoin.length === 0) && !loading'>
                <img src="../../../assets/img/assets/noData.png" alt/>
                <p v-text="$t('assets.address.noData')"></p>
            </div>
        </div>
    </div>
    </transition>
</template>

<script>
import {getCoinInfoNew, getUserCollect, getholdShares} from '../request.js'
import { Loading } from 'vant';
export default {
    components: {
        Loading
    },
    props: {
        popupShow: {
            type: Boolean,
            default: true,
        },
        value: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            transactionType: 1,
            chooseType: 1,
            coinActive: true,
            userId: '',
            timer: null,
            userCollect: [],
            renderCoin: [],
            timer1: null,
            icon: '',
            holdList: [],
            coinList: [],
            loading: true,
            noCollectFalg: true,
        }
    },
    created() {
        this.icon = this.$route.params.icon;
        this.userId = this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId'))).userId;
        if(!this.userId) {
            this.chooseType = 'USDT'
        }
        this.usdtNewHandle(true);
        this.getUserColletHandle(true);
        this.getholdSharesHandle();
        // this.coinTypeFilter();
	},
    watch: {
        value(val) {
            this.icon = this.$route.params.icon;
            if(val) {
                this.doLoopXHR();
                this.$overflowScrolling(false);
            } else {
                clearInterval(this.timer1);
                setTimeout(() => {
                    this.$overflowScrolling(true);
                }, 500)
            }
        }
    },
    methods: {
        closePopupHandle(){
            this.$emit('input', false)
        },
        toGeneralHandle() {
            this.$router.push('/transaction/all/general');
            this.closePopupHandle();
		},
        doLoopXHR() {
            if(this.chooseType === 1) {
                this.getUserColletHandle();
            } else {
                this.usdtNewHandle();
            }
            this.timer1 = setInterval(() => {
                if(this.chooseType === 1) {
                    this.getUserColletHandle();
                } else {
                    this.usdtNewHandle();
                }
            }, 10000);
        },
        changeCoinHandle(item) {
            let icon = item.name;
            this.closePopupHandle();
            if(!item) return;
            localStorage.setItem('actionIcon',JSON.stringify(item));
            this.$store.commit('changeActionCoin', item);
            this.$router.push(`/transaction/${icon}/main`);
            // location.reload()
        },
        changeCoinTypeHandle(type){
            if(type === 1) {
                if(!this.userId) {
                    this.$loginRoute(this.$route.path)
                    return;
                }
            }
            this.chooseType = type;
            this.coinTypeFilter();
        },
        transactionChangeHandle(type){
            return ;
            if(type === 2) {
                let key = 'btc_usdt';
                let icon = this.$route.params.icon || '--';
                this.$router.push(`/transaction/${icon}/Contract?key=${key}`);
                this.closePopupHandle();
            } else{
                this.getUserColletHandle()
            }
        },
        // 获取币币币种信息
        usdtNewHandle(frist){
            let coinInfo = localStorage.getItem('coinInfo');
            if(coinInfo) {
                coinInfo = JSON.parse(coinInfo) || {};
                this.coinList = coinInfo.extendCoinArr;
                this.coinTypeFilter();
            }
            getCoinInfoNew({})
            .then(res => {
                if(res.status === 200) {
                    localStorage.setItem('coinInfo', JSON.stringify(res.data));
                    this.coinList = res.data.extendCoinArr;
                    this.coinTypeFilter();
                }
            }).catch(() => {})
        },
        coinTypeFilter() {
            if(this.chooseType === 1) {
                // 自选
                this.renderCoin = this.userCollect.concat([]);
                if(this.noCollectFalg) {
                    this.loading = true;
                }
            } else {
                this.renderCoin = this.coinList.filter(item => {
                    return item.unit === this.chooseType;
                })
                if(this.coinList.length === 0) {
                    this.loading = false;
                }
            }
        },
        // 获取用户持仓币种
        getholdSharesHandle() {
            getholdShares().then(res => {
                if(res.data.status === 200) {
                    let arrlist = res.data.data || []
                    // 数组对象去重
                    this.holdList = arrlist.map( item => {
                        return item.symbol
                    })
                }
            })
        },
        // 获取用户收藏列表
        getUserColletHandle(frist){
            if(!this.userId) {
                return ;
            }
            let userId = this.userId,
                pageNum = 100,
                currentPage = 1,
                data = {userId, pageNum, currentPage};
            getUserCollect(data)
            .then(res => {
                if(res.data.status === 200) {
                    this.noCollectFalg = false;
                    this.userCollect = res.data.data.list.filter(item => (item.block === 1));
                    this.coinTypeFilter();
                }
                if(this.chooseType === 1) {
                    this.loading = false;
                }
            }).catch(() => {
                if(this.chooseType === 1) {
                    this.loading = false;
                }
            })
        }
    },
    destroyed() {
       this.timer1 && clearInterval(this.timer1);
    }
}
</script>

<style scoped lang='less'>
    .popup{
        position: fixed;
        width: 200%;
        height: 100%;
        background: rgba(62, 62, 62, 0.3);
        z-index: 9999;
        transform:translateZ(1px);
        -webkit-overflow-scrolling: touch;
        .popup-body{
            display: flex;
            flex-direction: column;
            width: 450px;
            height: 100%;
            position: relative;
            background: #fff;
            &-header{
                height: 188px;
                border-bottom: 1px solid #ebebeb;
                display: flex;
                justify-content: space-between;
                padding: 0 69px 0 22px;
                align-items: flex-end;
                h3{
                    padding-bottom: 34px;
                    font-size: 30px;
                    color: #818181;
                }
                .action{
                    font-size: 45px;
                    font-weight: bold;
                    color: #202025;
                }

            }
            &-content{
                padding: 0 26px;
                // transform: translateY(-100px);
                .content-top{
                    height: 118px;
                    border-bottom: 1px solid #ebebeb;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    h5{
                        font-size: 28px;
                        color: #535353;
                    }
                    img{
                        width: 41px;
                        height: auto;
                    }
                }
                .content-usdt{
                    display: flex;
										align-items: center;
										justify-content: space-between;
                    height: 83px;
                    p{
                        // padding-right: 80px;
                        font-size: 24px;
                    }
                    p.chooseType{
                        font-size: 24px;
	                    color: #3e80ca;
                    }
                }
                .content-title{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 83px;
                    font-size: 22px;
                    color: #b4b4b4;
                }
            }
            .content-coin{
                overflow-y: auto;
                flex: 1;
                li{
                    display: flex;
                    height: 100px;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom:  1px solid #ebebeb;
                    padding: 0 27px;
                    .coin-type{
                        vertical-align: middle;
                    }
                    .tag{
                        display: inline-block;
                        font-size: 0;
                        border: 6px solid #3e80ca;
                        border-radius: 50%;
                        font-style: normal;
                        position: relative;
                        top: -2px;
                    }
                }
                .coinActive{
                    background-color: #3e80ca;
                    color: #fff;
                    .tag{
                        border: 6px solid #fff;                        
                    }
                }
            }
        }
    }
    .loading{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 200px;
        // flex: 1;
    }
    .fade-enter-active, .fade-leave-active {
    transition: all .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        background-color: rgba(8, 8, 8, 0);
        /* opacity: 0; */
        transform: translateX(-30%);
    }
</style>
