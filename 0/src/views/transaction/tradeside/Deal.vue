<template>
	<div class="trade-side">
		<div class="top-box">
      <!-- 左侧交易 -->
      <div class="left-trading">
        <!-- 限价交易盒子 -->
        <div class="astrict">
          <!-- 第一个输入框 -->
          <div class="inputbox-one border-one" :class="priceType == 2 ? 'check-disabled' : ''">
						<div class="check-price-type" @click="checkPriceHandle">{{typelist[priceType-1].name}}</div>
            <input
              type="text"
              class="lbox"
              data-keyboard='keyboard'
              ref="input1"
              v-model="fixedPrice"
              :placeholder="msg"
            	@focus="checkLogin"
              @keyup="inputBlanceHandle('fixedPrice')"
              @input="inputBlanceHandle('fixedPrice')"
              @paste.capture="inputBlanceHandle('fixedPrice',true)"
              :disabled="priceType == 2"
            >
            <p class="black">{{coins[1]}}</p>
          </div>
        </div>

        <!-- 第二个输入框 -->
        <div class="inputbox-two border-one">
          <input
            type="text"
            class="lbox"
            v-model="tradeNum"
            data-keyboard='keyboard'
            @paste.capture="inputBlanceHandle('tradeNum')"
            @keyup="inputBlanceHandle('tradeNum')"
            @input="inputBlanceHandle('tradeNum')"
            @focus="checkLogin"
            :placeholder="numTips"
          >
          <p class="black">{{(priceType === 2 && this.tradeSide === 'tradebuy') ? coins[1] : coins[0]}}</p>
        </div>
        <!-- 选择百分比 -->
        <div class="percent border-one">
          <p
            class="price-name"
            v-for="(item,index) in percents"
            :key="index"
            :class="{active1:percent==index}"
            @click="checkPercent(item, index)"
          >{{item.name}}</p>
        </div>
				<!-- 杠杆倍数 -->
        <div v-show="false" class="multiple">
          <div class="mult_title">
            <p>
              杠杆倍数
              <img :src="title" class="ask">
            </p>
            <p class="num">X 50</p>
          </div>
          <Slider v-model="sliderVal" class="bar" :step="10" :min="1"/>
          <div class="show_mult">
            <p>X 1</p>
            <p>X 100</p>
          </div>
        </div>
        <!-- 保证金 -->
        <div class="cash_deposit flex_layout mt30">
          <p class="titles">{{$t('assets.info.canUse')}}({{coins[1]}})</p>
          <p class="money black">{{buyavailable.xnb | toNumStrFilter(4) | toNonExponential}}</p>
        </div>
        <!-- 手续费 -->
        <div class="charge flex_layout mt30">
          <p class="titles">
            {{$t('assets.info.canUse')}}({{coins[0]}})
            <!-- <img :src="title" class="ask"> -->
          </p>
          <p class="money black">{{sellavailable.xnb | toNumStrFilter(4) |toNonExponential}}</p>
        </div>
        <div class="btn-box">
          <button class="submit" :style="(coinName === 'dxck_usdt') ? 'background: #ccc' : ''" @click="submitHandle" :class="{bgc:tradeSide=='tradebuy'}">
            <!-- {{!!userId ? (tradeSide === 'tradebuy' ? '买入' : '卖出'): '登录'}} -->
            {{(tradeSide === 'tradebuy' ? $t('entrust.buy') : $t('entrust.sell'))}}
          </button>
        </div>
      </div>
      <!-- 右侧指数 -->
      <div class="rigtht-exponent">
        <div class="index-price-one">
          <div class="data-title">
            <p>{{$t('trade.price')}}</p>
            <p>{{$t('setting.invitTransfer.recoNum')}}</p>
          </div>
          <!-- 卖入的数组 -->
          <ul class="buy-dataList dataList">
            <li v-for="(item,index) in asksList" :key="index" @click="getval(item)">
              <div class="price">{{item.price | toNonExponential}}</div>
              <div class="num">{{item.num | toNonExponential}}</div>
              <span
                class="bgcolor"
                :style="{backgroundColor:b_color,width:`${(item.num/bgList1[0].num)*100}%`}"
              ></span>
            </li>
          </ul>
          <!-- 中间指数标题 -->
          <div class="exponent">
            <p class="left_exponent" :style="{color:change>=0?'#40d190':'#e71e42'}">{{latestDeal|toNonExponential}}</p>
            <div class="rate-box">
              <Loading v-show="load"/>
              <p
                class="rate"
                :style="{color:change>=0?'#40d190':'#e71e42'}"
                v-show="!load"
              >{{change>=0?'+':''}}{{change}}%</p>
              <img v-if="false" :src="change>=0?rise:falls" v-show="!load">
            </div>
          </div>
          <!-- 下面买出数组 -->
          <ul class="sell-dataList dataList">
            <li v-for="(item,index) in bidsList" :key="index" @click="getval(item)">
              <div class="price">{{item.price | toNonExponential}}</div>
              <div class="num">{{item.num | toNonExponential}}</div>
              <span
                class="bgcolor"
                :style="{backgroundColor:s_color,width:`${(item.num/bgList2[0].num)*100}%`}"
              ></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 下单失败提示 -->
    <toast
      :isShow="unSuccessful"
      :showToastType="'operate'"
      :toastContent="orderErr"
      :showToastImgType="'warning'"
      :toastTitle="''"
      :toastOperateTitle="$t('poptip.quickTrans.iKnow')"
      @handle-main-click="unSuccessful = false"
    />
	</div>
</template>

<script>
import {
  getRealAuthinfo,
  proOrder,
  quickOrder,
  changeLeverage,
  getCoinInfoNew,
  getUsercoinBymarket
} from "../request.js";
import fall from "@/assets/img/transaction/fall.png";
import falls from "@/assets/img/transaction/falls.png";
import rose from "@/assets/img/transaction/rose.png";
import rise from "@/assets/img/transaction/rise.png";
import title from "@/assets/img/transaction/title.png";
import { Slider, Loading } from 'vant';

export default {
	components: {
		Slider,
		Loading
	},
	data() {
    let that = this;
		return {
			title,
      rise,
      fall,
      rose,
      falls,
      percent: -1,
      fixedPrice: '',
			b_color: "#fce3e0",
			s_color: "#def2de",
			change: '',
			load: true,
      sliderVal: 1,
      priceType: 2, // 1.限价单 2.市价单
      tradeNum: '',
      msg: that.$t('trade.marketPrice'),
      unSuccessful: false,
      orderErr: '',
      submitLoading: false,
      userId: '',
      available: {}, // 可以btc/usdt
      timer: null,
      inputPrice: '', //输入数量缓存
      sideList: [{ name: that.$t('entrust.buy')}, { name: that.$t('entrust.sell')}],
      // typelist: [{ name: "限价单", id: 1, msg: '请输入价格' }, { name: "市价单", id: 2, msg: '市场最优价' }],
      typelist: [
        { name: that.$t('entrust.limtOrder'), id: 1, msg: that.$t('trade.placePrice') }, 
        { name: that.$t('entrust.cityOrder'), id: 2, msg: that.$t('trade.marketPrice') }
      ],
			// 百分比数量数组
      percents: [
        { name: "25%", id: 0, value: 0.25 },
        { name: "50%", id: 1, value: 0.5 },
        { name: "75%", id: 2, value: 0.75 },
        { name: "100%", id: 3, value: 1 }
      ],
		}
	},
	props: [
    "bidsList",
		"asksList",
    "latestDeal",
    "tradeSide",
    "coinName",
    "m_max_sell_amount",
    "m_min_sell_amount",
    "m_min_buy_value",
    "l_min_amount",
    "l_max_amount",
    "symbolsInfo",
    "sellavailable",
    "buyavailable"
	],
	computed: {
		//计算背景数量宽度
    bgList1() {
      let b = JSON.parse(JSON.stringify(this.asksList));
      return b.sort(function(a, b) {
        return b["num"] - a["num"];
      });
    },
    numTips() {
      if(this.minNum) {
        if(this.priceType == 2 && this.tradeSide === 'tradebuy') {
          return this.$t('trade.placeTradeValue')
        }
        return this.$t('trade.min')+(this.tradeSide === 'tradebuy' ? this.$t('entrust.buy') : this.$t('entrust.sell'))+this.$t('setting.invitTransfer.recoNum')+this.minNum;
      }
      return '';
    },
    minNum() {
      // 买入卖出，
      // 市价限价
      // 数量金额

      // 市价
      if(this.priceType == 2) {
        // // 买入
        // if(this.tradeSide === 'tradebuy') {
        //   return this.$dividedBy(this.m_min_buy_value/this.latestDeal);
        // }
        // 卖出
        return this.m_min_sell_amount;
      }
      // 限价
      if(this.priceType == 1) {
        return this.l_min_amount;
      }
      return '';
    },
		bgList2() {
      let b = JSON.parse(JSON.stringify(this.bidsList));
      return b.sort(function(a, b) {
        return b["num"] - a["num"];
      });
    },
    coins() {
      return this.coinName.toUpperCase().split('_');
    },
    side() {
      return this.tradeSide === 'tradebuy' ? 1 : 2 // 1买入  2卖出
    }
  },
  watch: {
    bidsList(val) {
			if(!this.latestDealFlag) {
        if(this.tradeSide === 'tradebuy') {
          this.fixedPrice = this.asksList[0].price;
        } else {
          this.fixedPrice = this.bidsList[4].price; 
        }
        if(this.fixedPrice < 0.0001) {
          this.fixedPrice = 0.0001;
        }
        this.latestDealFlag = true;
        if(this.priceType === 2) {
          this.inputPrice = this.fixedPrice;
          this.fixedPrice = '';
        }
			}
    },
    coinName() {
      this.latestDealFlag = false;
      this.tradeNum = '';
      this.percent = -1;
    },
    tradeSide() {
      this.computedNum();
    },
    sellavailable() {
      this.computedNum();
    },
  },
  created() {
    this.userId = (this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId'))).userId);
    this.usdtNewHandle();
    this.timer = setInterval(() => {
      this.usdtNewHandle();
    }, 5000)
    // if(this.userId) {
    //   // 获取sessionID
    //   // this.getUsercoinUsed();
    //   this.$getSession().then(res => {
    //     if(res) {
    //       // this.getUsercoinUsed();
    //     }
    //   }).catch(err => {console.log(err,'err')});
    // }
  },
	methods: {
    submitHandle() {
      if(!this.userId) {
        this.checkLogin();
        return;
      }
      if(this.coinName === 'dxck_usdt') return ;
      if(this.submitLoading) return;
      this.submitLoading = true;
      let params = {
        symbol: this.coinName,
        type: this.priceType,
        side: this.side,
        source: 2
      };
      if(!this.checkTradeInfo()) return;
      switch (this.priceType) {
        case 1:
          params.price = this.fixedPrice;
          params.amount = Number(this.tradeNum);
          break;
        case 2:
          if(this.tradeSide === 'tradebuy') {
            params.price = Number(this.tradeNum); // 市价买入， 传交易额
          } else {
            params.amount = Number(this.tradeNum);
          }
          break;
        default:
        this.submitLoading = false;
          return;
      }
      this.postOrderHandle(params);
    },
    checkPercent(item, index) {
      if(!this.userId) {
        this.checkLogin();
        return;
      }
      if(!this.fixedPrice && (this.priceType === 1) && this.side === 1) {
        this.$normalToast(`${this.$t('trade.place')}${this.side === 1 ? this.$t('entrust.buy') : this.$t('entrust.sell')}${this.$t('trade.price')}`,2000);
        return ;
      }
      this.percent = index;
      this.computedNum(true);
    },
    computedNum(needTip) {
      if(this.percent === -1) return ; // 没有选择百分比
      if(this.side === 1) {
        if(!this.fixedPrice && (this.priceType === 1) && needTip) {
          this.$normalToast(`${this.$t('trade.place')}${this.side === 1 ? this.$t('entrust.buy') : this.$t('entrust.sell')}${this.$t('trade.price')}`,1500);
          return ;
        }
        if(this.priceType === 2) {
          this.tradeNum = this.$multipliedBy(this.buyavailable.xnb || 0, this.percents[this.percent].value);
        } else{
          this.tradeNum = this.$multipliedBy(this.$dividedBy(this.buyavailable.xnb, this.fixedPrice || this.latestDeal) || 0, this.percents[this.percent].value);
        }
        if(Number(this.tradeNum)) {
          this.tradeNum =  Number(Number(this.tradeNum).toFixed(6));
        }
        // this.inputBlanceHandle('tradeNum', true);
      } else {
        this.tradeNum = this.$multipliedBy(this.sellavailable.xnb || 0, this.percents[this.percent].value);
      }
      this.inputBlanceHandle('tradeNum', true, true); // name ascyn ischeck
    },
    postOrderHandle(params) {
      this.$store.commit("changeLoading", true);
      proOrder(params).then(res => {
        this.submitLoading = false;
        this.$store.commit("changeLoading", false);
        this.$emit('orderSuccess')
        if (res.data.status === 200) {
          this.success = true;
          this.$normalToast(`${this.side === 1 ? this.$t('entrust.buy') : this.$t('entrust.sell')}成功`,2000);
        } else {
          this.OrderErrHandle(res.data.data, params);
        }
      }).catch(err => {
        this.submitLoading = false;
        this.OrderErrHandle();
        this.$store.commit("changeLoading", false);
      })
    },
    OrderErrHandle(msg, params={}) {
      let limitPrice = this.getlimitPrice(params);
      switch (msg) {
        case "ERR_BALANCE_NOT_ENOUGH":
          this.orderErr = this.$t('trade.runningLow'); // 余额不足，请确认操作账户余额充足
          break;
        case "ERR_BUY_PRICE_LESS_LIMIT":
          this.orderErr = this.$t('trade.priceLiss'); // 买入价低于下限
          break;
        case "ERR_SELL_AMOUNT_LESS_LIMIT":
          this.orderErr = this.$t('trade.amountLiss')+(limitPrice['ERR_SELL_AMOUNT_LESS_LIMIT'] || '');  // 单笔交易量低于下限
          break;
        case "ERR_SELL_AMOUNT_OVER_LIMIT":
          this.orderErr = this.$t('trade.amountOver')+(limitPrice['ERR_SELL_AMOUNT_OVER_LIMIT'] || '');  // 单笔交易量超过上限
          break;
        case "ERR_BUY_AMOUNT_LESS_LIMIT":
          this.orderErr = this.$t('trade.amountLiss')+(limitPrice['ERR_BUY_AMOUNT_LESS_LIMIT'] || '');  // 单笔交易量低于下限
          break;
        case "ERR_BUY_PRICE_OVER_LIMIT":
          this.orderErr = this.$t('trade.buyPriceOver')+(limitPrice['ERR_BUY_PRICE_OVER_LIMIT'] || ''); // 买入价超过上限
          break;
        case "ERR_BUY_AMOUNT_OVER_LIMIT":
          // 限价 ? 单笔交易量超过上限 : 单笔交易量超过上限
          this.orderErr = (params.type === 1 ? this.$t('trade.amountOver'):this.$t('trade.quotaOver'))+(limitPrice['ERR_BUY_AMOUNT_OVER_LIMIT'] || ''); 
          break;
        case "ERR_SELL_PRICE_LESS_LIMIT":
          this.orderErr = this.$t('trade.sellPriceLiss')+(limitPrice['ERR_SELL_PRICE_LESS_LIMIT'] || ''); // 卖出价低于下限
          break;
        case "ERR_SELL_PRICE_OVER_LIMIT":
          this.orderErr = this.$t('trade.sellPriceOver');  // 卖出价超过上限
          break;
        case "ERR_FROZEN_NOT_ENOUGH":
          this.orderErr = '冻结的额度不足，系统故障'; // 冻结的额度不足，系统故障
          break;
        case "ERR_ORDER_ALREADY_ADDED":
          this.orderErr = '订单已经提交过'; // 订单已经提交过
          break;
        case "ERR_POSITION_NOT_ENOUGH":
          this.orderErr = '仓位不足, 请稍后重试'; // 仓位不足
          break;
        case "ERR_WRONG_EVENT":
          this.orderErr = this.$t('trade.handleErr'); // 操作失败，请稍后重试
          break;
        case "ERR_BROKER_CAN_NOT_TRADING":
          this.orderErr = this.$t('trade.brokerNotTrading'); // 经纪人不能交易
          break;
        default:
          this.orderErr = this.$t('trade.handleErr'); // 操作失败，请稍后重试
      }
      this.unSuccessful = true;
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
    checkTradeInfo() {
      // 价格输入
      if(!this.fixedPrice && (this.priceType === 1)) {
        this.$normalToast(`${this.$t('trade.place')}${this.side === 1 ? this.$t('entrust.buy') : this.$t('entrust.sell')}${this.$t('trade.price')}`,1500);
        this.submitLoading = false;
        return ;
      }
      // 价格输入
      if(!Number(this.fixedPrice) && (this.priceType === 1)) {
        this.$normalToast(`${this.$t('trade.placeMoreZero')}${this.side === 1 ? this.$t('entrust.buy') : this.$t('entrust.sell')}${this.$t('trade.price')}`,1500);
        this.submitLoading = false;
        return ;
      }
      // 数量输入
      if(!this.tradeNum) {
        this.$normalToast(`${this.$t('trade.place')}${this.side === 1 ? this.$t('entrust.buy') : this.$t('entrust.sell')}${this.$t('setting.invitTransfer.recoNum')}`,1500);
        this.submitLoading = false;
        return ;
      }
      // 数量输入
      if(!Number(this.tradeNum) && Number(this.tradeNum)<=0) {
        this.$normalToast(`${this.$t('trade.placeMoreZero')}${this.$t('setting.invitTransfer.recoNum')}`,1500);
        this.submitLoading = false;
        return ;
      }
      return true;
    },
    //获取当前的价格
    getval(val) {
			if(this.priceType === 2) return; // 市价单
      this.fixedPrice = val.price;
      if(this.fixedPrice < 0.0001) {
        this.fixedPrice = 0.0001;
      }
    },
		usdtNewHandle() {
      // 获取合约币种信息
      getCoinInfoNew()
        .then(res => {
          let name = this.$route.params.icon;
          let item = this.filterCoinHandle(res.data.assitsCoinArr.concat(res.data.mainCoinArr), name);
          this.change = item.change;
          if (!item) return;
          this.load = false;
        })
        .catch(err => {
          // console.log(err, "errrr");
        });
    },
    getUsercoinUsed() {
      let params = {
        userId: this.userId,
        token: (this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId'))).token),
        market: this.coinName,
      }
      getUsercoinBymarket(params).then(res => {
        this.available = res.data;
        if(this.side === 1) {
          if(!this.fixedPrice && (this.priceType === 1)) {
            return ;
          }
          this.tradeNum = this.$multipliedBy(this.$dividedBy(this.available.cny, this.fixedPrice) || 0, this.percents[this.percent].value);
          this.inputBlanceHandle('tradeNum', true);
        } else {
          this.tradeNum = this.$multipliedBy(this.available.xnb || 0, this.percents[this.percent].value);
        }
      }).catch(() => {})
    },
    // 交易类型选择
    checkPriceHandle() {
      let check = this.priceType == 2 ? 0 : 1;
      this.priceType = this.typelist[check].id;
      this.msg = this.typelist[check].msg;
      // 缓存输入数据
			if(this.priceType == 1) {
				this.fixedPrice = this.inputPrice;
			} else {
				this.inputPrice = this.fixedPrice;
				this.fixedPrice = '';
      }
      this.computedNum();
    },
    // 检测登录
    checkLogin() {
      let path = this.$route.path;
      this.$loginRoute(path);
    },
     // 输入框输入限制
    inputBlanceHandle(value, sync, ischeck) {
      if((value === 'tradeNum') && (!ischeck)) {
        this.percent = -1;
      }
      if(sync) {
        this[value] = String(this[value]).replace( /[^0-9\.?]/g,'');
        let dioLeng = this[value].split('.');
        if(dioLeng.length < 2) return;
        this[value] = dioLeng[0]+'.'+String(dioLeng[1]).replace( /\./g,'').slice(0,4);
        return;
      }
      setTimeout(()=> {
        this[value] = String(this[value]).replace( /[^0-9\.?]/g,'');
        let dioLeng = this[value].split('.');
        if(dioLeng.length < 2) return;
        this[value] = dioLeng[0]+'.'+String(dioLeng[1]).replace( /\./g,'').slice(0,4);
      },100)
    },
		filterCoinHandle(arr, name = "xbtc_usdt") {
      if (!(arr instanceof Array)) return arr; //如果不是数组，返回原数据
      return arr.filter(item => {
        return item.name === name;
      })[0];
    },
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer)
  },
  
}
</script>

<style lang="less" scoped>
.trade-side {
  padding: 0 0 20px 20px;
  display: flex;
  flex-direction: column;
  // height: 953px;
  .ask {
    margin-left: 10px;
    width: 24px;
    height: 24px;
    vertical-align: middle;
    margin-bottom: 4px;
  }
  .bgc {
    background-color: #40d190;
  }
  .xz {
    transition: all 1s;
    transform: rotate(180deg);
  }
  // 交易类型激活类
  .deal_active {
    background-color: #0088f1 !important;
    color: #fff !important;
  }
  .active {
    border: 2px solid #3e80ca !important;
    color: #3e80ca !important;
    box-sizing: border-box;
  }
  .active1 {
    border: 2px solid #3e80ca;
    color: #3e80ca !important;
    border-radius: 10px;
    box-sizing: border-box;
  }
  .flex_layout {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .black {
    display: inline-block;
    font-size: 28px;
    color: #474747;
    // width: 100px;
  }
  .titles {
    font-size: 24px;
    // color: #a5a5a5;
    color: #474747;
  }
  .mt30 {
    margin-top: 24px;
  }
  .top-box {
    flex: 1;
    display: flex;
    justify-content: space-between;
    overflow-x: hidden;
    height: 100%;
    .left-trading {
      flex: 1;
      margin-right: 5px;
      height: 100%;
      .tra-title {
        margin-top: 20px;
        font-size: 22px;
        color: #474747;
        display: flex;
        justify-content: left;
        position: relative;
        span {
          margin: 0;
          height: 0;
          border-width: 15px 15px 0;
          border-style: solid;
          border-color: #a0a0a0 transparent transparent;
          margin-top: 10px;
          margin-left: 15px;
        }
        .sel {
          width: 130px;
          border-radius: 5px;
          position: absolute;
          top: 35px;
          left: 10px;
          // box-shadow: 3px 1px 1px 1px #ccc;
          border: 1px solid #ccc;
          & li {
            // height: 50px;
            line-height: 47px;
            font-size: 22px;
            border-radius: 5px;
            background-color: #fff;
          }
        }
      }
      .inputbox-one {
        border: solid 1px #afadad;
        border-radius: 10px;
        height: 71px;
        // margin-top: 30px;
        // padding: 10px;
        padding-right: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
				box-sizing: border-box;
				.check-price-type{
					width: 110px;
          height: 100%;
          background-color: #3e80ca;
          color: white;
          border-radius: 5px;
          line-height: 71px;
					&::after {
						content: '';
						width: 0;
						height: 0;
						display: inline-block;
						border: 8px solid transparent;
						border-top: 8px solid white;
						margin-left: 8px ;
						position: relative;
						top: 4px;
					}
				}
        .lbox {
          background: transparent;
          height: 100%;
          outline: none;
					border: none;
          width: 180px;
          margin-left: 12px;
					// flex: 1;
        }
      }
      
      .inputbox-two {
        border: solid 1px #afadad;
        border-radius: 10px;
        height: 70px;
        margin-top: 24px;
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        .lbox {
          // margin-top: 1.5px;
          height: 100%;
          outline: none;
          border: none;
          width: 240px;
        }
      }
      @media screen and (-webkit-min-device-pixel-ratio: 1) {
          .inputbox-two { border: 1px solid #afadad }
      }
      @media screen and (-webkit-min-device-pixel-ratio: 2) {
          .inputbox-two { border: 1PX solid #afadad }
      }
      .name {
        margin-top: 23px;
        display: flex;
        justify-content: space-between;
        p {
          flex: 1;
          border: solid 2px #dcdcdc;
          border-radius: 10px;
          height: 45px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a5a5a5;
          &:nth-child(2) {
            margin-left: 10px;
            margin-right: 10px;
          }
        }
      }
      // 市价交易单独样式
      .bazaar {
        .msg {
          margin-top: 30px;
          border: 1px solid #a5a5a5;
          color: #a5a5a5;
          line-height: 70px;
          box-sizing: border-box;
        }
      }
      .multiple {
        margin-top: 26px;
        margin-bottom: 26px;
        height: 100px;
        display: flex;
        flex-direction: column;
        // padding-left: 12px;
        // padding-right: 12px;
        .mult_title {
          display: flex;
          justify-content: space-between;
          color: #474747;
          .num {
            color: #3e80ca;
          }
        }
        .bar {
          margin: 17px 0 17px 12px;
          // margin-bottom: 17px;
        }
        .show_mult {
          display: flex;
          justify-content: space-between;
        }
      }
      .money {
        width: 50%;
        text-align: right;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      //   百分比
      .percent {
        margin-top: 25px;
        display: flex;
        height: 50px;
        border-radius: 10px;
        border: 1px solid#999999;
        box-sizing: border-box;
        p {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 22px;
          color: #d7d7d7;
        }
      }
      .lowest-buy-num {
        font-size: 22px;
        color: #a5a5a5;
        // margin-top: 23px;
      }
    }
    // 右侧
    .rigtht-exponent {
      // flex: 1;
      width: 310px;
      margin-left: 5px;
      height: 100%;
      // margin-top: 10px;
      .index-price-one {
        //标题盒子
        .title-box {
          display: flex;
          align-items: baseline;
          p {
            font-size: 22px;
            color: #a5a5a5;
          }
          .price {
            font-size: 34px;
            color: #3e80ca;
            margin-left: 20px;
          }
        }
        //价格和数量
        .data-title {
          display: flex;
          justify-content: space-between;
          font-size: 22px;
          color: #a5a5a5;
          // margin-top: 22px;
          margin: 0 20px;
        }
        // 买跌数组
        .dataList {
          height: 190px;
          // background-color: #f8f8f8;
          // margin-top: 25px;
          padding: 10px 20px 10px 20px;
          li {
            display: flex;
            justify-content: space-between;
            font-size: 22px;
            z-index: 999;
						position: relative;
						height: 28px;
            // background-color: rgba(252, 227, 224,0.6);
            &:not(:first-child) {
              margin-top: 8px;
            }
            .price {
              color: #e71e42;
              z-index: 3;
            }
            .num {
              color: #595959;
              z-index: 3;
            }
            .bgcolor {
              width: 80%;
              background-color: #f8f8f8;
              position: absolute;
              right: 0;
              height: 24px;
              z-index: 2;
            }
          }
        }
        .sell-dataList {
          margin-top: 0px;
          .price {
            color: #40d190 !important;
          }
        }
        // 指数
        .exponent {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 0 20px 0 20px;
          line-height: 60px;
          height: 60px;
          // margin-top: 35px;
          // margin-bottom: 35px;
          .left_exponent {
            font-size: 34px;
            color: #e71e42;
            width: 145px;
            // background: pink;
            overflow: hidden;
            text-overflow: clip;
            text-align: left;
            white-space: nowrap;
          }
          .rate-box {
            display: flex;
            justify-content: space-between;
            // align-items: baseline;

            img {
              width: 32px;
              height: 37px;
              margin-left: 12px;
              align-self: center;
            }
          }
        }
      }
    }
  }
  .btn-box{
		display: flex;
		// margin-right: 20px;
		.submit {
			width: 100%;
			border: 0;
			background-color: transparent;
			outline: none;
			height: 85px;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #e71e42;
			color: #fff;
			font-size: 34px;
			// margin-right: 20px;
			margin-bottom: 14px;
			margin-top: 22px;
			img {
				width: 41px;
				height: 35px;
				margin-left: 18px;
      }
		}
    .bgc {
      background-color: #40d190;
    }
	}
	.check-disabled {
		background: white;
	}
}
@media screen and (-webkit-min-device-pixel-ratio: 1) {
  .border-one { border: 1px solid #afadad !important}
  .active1 { border: 1px solid #3e80ca !important}
}
@media screen and (-webkit-min-device-pixel-ratio: 2) {
  .border-one { border: 1PX solid #afadad !important}
  .active1 { border: 1PX solid #3e80ca !important}
}
</style>
