<template>
  <div id="pro">
    <div class="top-box">
      <!-- 左侧交易 -->
      <div class="left-trading">
        <!-- 限价交易盒子 -->
        <div class="astrict">
          <!-- 第一个输入框 -->
          <div class="inputbox-one border-one" id="inputbox1" :class="checkPrice ? 'check-disabled' : ''">
						<div class="check-price-type" @click="tog">{{typelist[checkPrice].name}}</div>
						<!-- <div class="shu"></div> -->
            <input
              type="text"
              class="lbox"
              data-keyboard='keyboard'
              v-model="fixedPrice"
              ref="input1"
              :placeholder="msg"
              @focus="checkLogin"
              @keyup="inputBlanceHandle('fixedPrice')"
              @input="inputBlanceHandle('fixedPrice')"
              @paste.capture="inputBlanceHandle('fixedPrice',true)"
              :disabled="checkPrice == 1"
            >
            <p class="black">USDT</p>
          </div>
        </div>

        <!-- 第二个输入框 -->
        <div class="inputbox-two border-one">
          <input
            type="text"
            class="lbox"
            data-keyboard='keyboard'
            v-model="buy_nums"
            ref="input2"
            @focus="checkLogin"
            @keyup="inputBlanceHandle('buy_nums')"
            @input="inputBlanceHandle('buy_nums')"
            @paste.capture="inputBlanceHandle('buy_nums',true)"
            :placeholder="numTips"
          >
          <p class="black">{{coin}}</p>
        </div>
        <!-- 选择百分比 -->
        <div class="percent border-one">
          <p
            class="price-name"
            v-for="(item,index) in percents"
            :key="index"
            :class="{active1:istrue1==index}"
            @click="percent_toggle(item)"
          >{{item.name}}</p>
        </div>
				<!-- 杠杆倍数 -->
        <div class="multiple">
          <div class="mult_title">
            <p>
              {{$t('trade.leverageVal')}}
              <img :src="title" class="ask" @click="leverHelp">
            </p>
            <p class="num">X {{value==0?1:value}}</p>
          </div>
          <Slider v-model="value" class="bar" @change="changeval(value)" :step="10" :min="1"/>
          <div class="show_mult">
            <p>X 1</p>
            <p>X 100</p>
          </div>
        </div>
        <!-- 保证金 -->
        <div class="cash_deposit flex_layout mt30">
          <p class="titles">{{$t('holdShares.marginj')}}</p>
          <p class="money black">{{cashDeposit | toNumStrFilter(2)}}</p>
        </div>
        <!-- 手续费 -->
        <div class="charge flex_layout mt30">
          <p class="titles">
            {{$t('assets.intoRecDetail.serviceCharge')}}
            <img :src="title" class="ask" @click="chargeHelp">
          </p>
          <p class="money black">{{cashProcedures | toNumStrFilter(6)}}</p>
        </div>
      </div>
      <!-- 右侧指数 -->
      <div class="rigtht-exponent">
        <div class="index-price-one">
          <div class="data-title">
            <p>{{$t('trade.price')}}</p>
            <p>{{$t('orderRecord.detail.num')}}</p>
          </div>
          <!-- 卖入的数组 -->
          <ul class="buy-dataList dataList">
            <li v-for="(item,index) in asksList" v-show="bidsListLength" :key="index" @click="getval(item)">
              <div class="price">{{item.price}}</div>
              <div class="num">{{item.num}}</div>
              <span
                class="bgcolor"
                :style="{backgroundColor:b_color,width:`${(item.num/aaa[0].num)*100}%`}"
              ></span>
            </li>
          </ul>
          <!-- 中间指数标题 -->
          <div class="exponent">
            <p class="left_exponent" :style="{color:change>0?'#40d190':'#e71e42'}">{{latestDeal}}</p>
            <div class="rate-box">
              <Loading v-show="load"/>
              <p
                class="rate"
                :style="{color:change>0?'#40d190':'#e71e42'}"
                v-show="!load"
              >{{change>=0?'+':''}}{{change}}%</p>
              <img v-if="false" :src="change>=0?rise:falls" v-show="!load">
            </div>
          </div>
          <!-- 下面买出数组 -->
          <ul class="sell-dataList dataList">
            <li v-for="(item,index) in bidsList" v-show="asksListLength" :key="index" @click="getval(item)">
              <div class="price">{{item.price}}</div>
              <div class="num">{{item.num}}</div>
              <span
                class="bgcolor"
                :style="{backgroundColor:s_color,width:`${(item.num/bbb[0].num)*100}%`}"
              ></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="btn-box">
			<button class="submit" @click="affirm(1)" :disabled="isDisable">
				{{$t('trading.rose')}}
				<img :src="rose">
			</button>
			<button class="submit " @click="affirm(2)" :disabled="isDisable">
				{{$t('trading.fall')}}
				<img :src="fall">
			</button>
		</div>
    <!-- 下单成功提示 -->
    <toast :isShow="success" :showToastType="'normal'" :toastContent="$t('trade.submitSuccess')"/>
    <!-- 下单失败提示 -->
    <toast
      :isShow="unSuccessful"
      :showToastType="'operate'"
      :toastContent="orderErr"
      :showToastImgType="'warning'"
      :toastTitle="''"
      :toastOperateTitle="$t('poptip.quickTrans.iKnow')"
      @handle-main-click="warnMainClick"
    />
    <toast
      :isShow="isShow"
      :showToastType="'operate'"
      :toastContent="$t('trade.highRisk')"
      :showToastImgType="'warning'"
      :toastTitle="$t('trade.warn')"
      :toastOperateTitle="$t('poptip.quickTrans.iKnow')"
      @handle-main-click="isShow=false"
    />
    <!-- <toast :isShow="isShow" :showToastType="'normal'" :toastContent="'警告,您当前的杠杆倍数超过30倍!' "/> -->
    <!-- 表单验证弹框 -->
    <toast :isShow="chekValShow" :showToastType="'normal'" :toastContent="$t('trade.rightPrice')+'!' "/>
    <!-- 数量错误提示 -->
    <toast :isShow="numErr" :showToastType="'normal'" :toastContent="$t('quickTrans.sell.inputNumPoptip')+'!' "/>
    <!-- 单笔数量限制提示 -->
    <toast :isShow="limitErr" :showToastType="'normal'" :toastContent="$t('trade.limitMun')+'!' "/>
    <!-- 实名认证的弹框 -->
    <!-- <toast
      v-show="authShow"
      :showToastType="'operate'"
      :toastContent="'亲爱的投资者,您当前账户未实名认证或者审核中请认证通过后进行交易'"
      :showToastImgType="'warning'"
      :toastTitle="'实名认证'"
      :toastOperateTitle="'去认证'"
      :toastAssistOperateTitle="'我知道了'"
      @handle-main-click="goAuth"
      @handle-assist-click="authShow=false"
    />-->

    <toast
      v-show="balanceErr"
      :showToastType="'operate'"
      :toastContent="$t('trade.lessAmount')+'!'"
      :isShow="balanceErr"
      :showToastImgType="'warning'"
      :toastTitle="$t('newZh.notsuff')"
      :toastOperateTitle="$t('trade.nowRecharge')"
      :toastAssistOperateTitle="$t('trade.notRecharge')"
      @handle-main-click="goPay"
      @handle-assist-click="balanceErr=false"
    />
    <!-- 杠杆修改失败提示 -->
    <toast
      :isShow="leverShow"
      :showToastType="'operate'"
      :toastContent="leverErrCode"
      :showToastImgType="'warning'"
      :toastTitle="$t('trade.warn')"
      :toastOperateTitle="$t('poptip.quickTrans.iKnow')"
      @handle-main-click="leverShow=false"
    />
    <!-- 杠杆帮助框 -->
    <toast
      v-show="help"
      :showToastType="'operate'"
      :toastContent="helpCont"
      :showToastImgType="''"
      :toastTitle="helpTitle"
      :toastOperateTitle="$t('poptip.quickTrans.iKnow')"
      @handle-main-click="help = false;"
    />
    <!-- 修改杠杆提示有持仓 -->
    <toast 
      v-show="isHelp"
      :showToastType="'operate'" 
      :toastContent="valDataMess" 
      :showToastImgType="'warning'" 
      :toastTitle="''" 
      :toastOperateTitle="'确认'" 
      :toastAssistOperateTitle="'取消'" 
      @handle-main-click="HelpmainClick" 
      @handle-assist-click="isHelpCancel"
    />
  </div>
</template>

<script>
import { debounce } from "@/commons/public.js";
import fall from "@/assets/img/transaction/fall.png";
import falls from "@/assets/img/transaction/falls.png";
import rose from "@/assets/img/transaction/rose.png";
import rise from "@/assets/img/transaction/rise.png";
import title from "@/assets/img/transaction/title.png";
import {
  getRealAuthinfo,
  proOrder,
  quickOrder,
  changeLeverage,
  getCoinInfoNew,
  getholdShares
} from "../request.js";
//引入弹窗组件
import toast from "@/component/toast";
import { constants } from "crypto";
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
			// affirmShake: false,
      disabled: false,
      msg: that.$t('trade.marketPrice'),
      orderErr: null,
      maker_fee: null, //maker的手续费
      help: false, //帮助
      helpTitle: "",
      helpCont: "",
      isDisable: false,
      load: false,
      leverShow: false,
      leverErrCode: null,
      // 涨跌幅
      change: null,
      // 下单失败提示
      unSuccessful: false,
      // 下单成功提示
      success: false,
      coin: null,
      //余额提示框
      balanceErr: false,
      limitErr: false, //单笔数量限制提示
      coinName: null,
      // authShow: false, //显示实名
      // 限价或者市价的标志
      checkPrice: 1, // 0 => 限价，1 => 市价
      Procedures: 0, //手续费
      //用户百分比
      percentage: 0.25,
      // 表单验证提示
      chekValShow: false,
      // 用户杠杆:
      leverage: null,
      asyncleverageChange: false,
      // 输入框填充数据数据，用来做输入缓存
      inputPrice: "",
      // 上传数据
      uploadPrice: "",
      b_color: "#fce3e0",
      s_color: "#def2de",
      bg_width: "30%",
      value: 1,
      buy_nums: 0,
      istrue: -1,
      istrue1: -1,
      flag: false,
      isShow: false,
      isbuy: null,
      timer: null,
      // 交易类型
      istrue2: 0,
      // 是否登录
      isLogin: false,
      postOrderLoad: false,
			latestDealFlag: false,
      type_name: that.$t('trade.limitTrade'),
      typelist: [
        { name: that.$t('entrust.limtOrder'), id: 0, msg: that.$t('trade.placePrice') }, 
        { name: that.$t('entrust.cityOrder'), id: 1, msg: that.$t('trade.marketPrice') }
      ],
      //当前价格
      //数量错误提示
      numErr: false, // 价格名称数组
      price_name: [
        { name: "对手价", id: 0 },
        { name: "买一价", id: 1 },
        { name: "卖一价", id: 2 }
      ],
      // 百分比数量数组
      percents: [
        { name: "25%", id: 0 },
        { name: "50%", id: 1 },
        { name: "75%", id: 2 },
        { name: "100%", id: 3 }
      ],
      //限价选择的价格
      fixedPrice: '',
      isHelp:false,
      valDataMess:'当前有持仓，确认将杠杆调1-10',
      // 是否调节杠杆
      isGoNext:true
    };
  },
  created() {
    //判断是否登录
    if (
      this.$getCookie("userId") &&
      JSON.parse(decodeURIComponent(this.$getCookie("userId"))).userId
    ) {
      //登录，将登录提示隐藏
      this.isLogin = true;
      //获取用户使用的杠杆.全局变量
      // console.log("用户登录");
      this.leverage = Number(window.localStorage.leverage);
      if(!this.leverage) {
        this.asyncleverageChange = true;
      } else {
        this.value = this.leverage;
      }
    } else {
      // console.log(this.isLogin, "用户未登录");
    }
    this.load = true;
    this.usdtNewHandle();
    this.timer = setInterval(() => {
      this.usdtNewHandle();
    }, 5000)
    //获取用户选择的币种名称
    this.coinName = this.$route.params.icon;
    this.coin = this.coinName.substr(0, 4).toUpperCase();
    this.getMinAndMax();
    this.checkPrice === 0
      ? (this.buy_nums = this.l_min_amount)
      : (this.buy_nums = this.m_min_sell_amount);
  },
  filters: {
    testHandle(val, _this) {
      if (val) return val;
      return _this.cashDeposit;
    }
  },

  computed: {
    symbol() {
      // console.log(this.$store.state.actionCoin.name, 123);
      // return this.$route.params.icon;
      return this.$store.state.actionCoin
        ? this.$store.state.actionCoin.name
        : this.$route.params.icon;
    },
    numTips() {
      if(this.l_min_amount && this.l_max_amount) {
        return this.$t('trade.SingleLimit')+this.l_min_amount+'~'+this.l_max_amount
      }
      return this.$t('trade.placeNum')
    },
    asksListLength() {
      return this.asksList.length;
    },
    bidsListLength() {
      return this.bidsList.length;
    },
    //计算背景数量宽度
    aaa() {
      let b = JSON.parse(JSON.stringify(this.asksList));
      return b.sort(function(a, b) {
        return b["num"] - a["num"];
      });
    },
    bbb() {
      let b = JSON.parse(JSON.stringify(this.bidsList));
      return b.sort(function(a, b) {
        return b["num"] - a["num"];
      });
    },
    // 判断是卖还是买
    getBuyName() {
      return this.$store.state.isbuy;
    },
    //计算保证金
    cashDeposit() {
      //限价交易
      if (this.checkPrice === 0) {
        return (this.buy_nums * this.fixedPrice) / this.value;
      }
      //市价交易的情况
      if (this.checkPrice === 1) {
        return (this.buy_nums * this.latestDeal) / this.value;
      }
    },
    //计算手续费
    cashProcedures() {   
      //限价交易
      //手续费=M%*购买数量*购买价格
      if (this.checkPrice === 0) {
        let bignum = this.$toBignumber(this.maker_fee || 0);
        // console.log(bignum.multipliedBy(this.buy_nums || 0).multipliedBy(this.fixedPrice || 0).toNumber())
				// console.log(this.maker_fee, this.buy_nums, this.fixedPrice)
        // return this.maker_fee * this.buy_nums * this.fixedPrice;
        return bignum.multipliedBy(this.buy_nums || 0).multipliedBy(this.fixedPrice || 0) || 0;
      }
      //市价交易盒子
      if (this.checkPrice === 1) {
        if (this.firstBuyPrice === 0 || this.firstSellPrice === 0) {
          return 0;
        }
        return (
          this.maker_fee *
          this.buy_nums *
          (this.getBuyName === "rose"
            ? this.firstBuyPrice
            : this.firstSellPrice)
        ) || 0;
      }
    }
  },
  methods: {
    // 平仓输入框限制
    inputFocos() {
      this.checkLogin();
    },
    // 检测用户选择的币种的最大值和最小值
    getMinAndMax() {
      this.symbols.forEach(e => {
        if (this.coinName === e.symbol) {
					this.maker_fee = e.maker_fee;
          return;
        }
      });
		},
		// 杠杆倍数问号
    leverHelp() {
      this.helpCont = this.$t('trade.bombRuleHelp') + ": 1.10.20.30.40.50...100.";
      this.helpTitle = this.$t('trade.leverageVal');
      this.help = true;
		},
		// 手续费问号
    chargeHelp() {
      let fee = this.$multipliedBy(this.maker_fee, 10000) || 2.5;
      this.helpCont = this.$t('trade.makerFee')+ fee;
      this.helpTitle = this.$t('assets.intoRecDetail.serviceCharge');
      this.help = true;
		},
		// 检测登录
    checkLogin() {
      if (this.isLogin) {
        return;
      }
      let path = this.$route.path;
      this.$loginRoute(path);
    },
    showMenu() {
      this.$store.commit('changeNoMenu', true);
    },
    // 获取币种涨跌
    usdtNewHandle() {
      // 获取合约币种信息
      getCoinInfoNew()
        .then(res => {
          let name = this.$route.params.icon;
          let item = this.filterCoinHandle(res.data.extendCoinArr, name);
          this.change = item.change;
          if (!item) return;
          this.load = false;
        })
        .catch(() => {});
    },
    filterCoinHandle(arr, name = "xbtc_usdt") {
      if (!(arr instanceof Array)) return arr; //如果不是数组，返回原数据
      return arr.filter(item => {
        return item.name === name;
      })[0];
    },
    // 修改杠杆
    changeval(value) {
      this.checkLogin();
      this.isGoNext=value;
      if (value === this.leverage || (isNaN(value))) {
        // console.log("用户选择的杠杆和本身的一致");
        return;
      } else {
        // 判断是否有持仓
        this.getholdSharesAjax(value);
      }
    },
    // 判断是否有持仓
    getholdSharesAjax(value){
      getholdShares().then(res=>{
        if(res.data.status===200){
        // 存在持仓 或者 杠杆倍数大于100（特会）
          if(res.data.data.length>0 || this.leverage > 100){
            this.valDataMess= '确认将杠杆调到'+value+'X，请注意仓位保证金';
            this.isHelp=true;
            return;
          }
          this.leavChange(value, this.leverage);
        }
      }).catch(err=>{
        this.$normalToast('网络问题,请稍后再试');
      });
    },
    // 调节杠杆
    leavChange(value, oldLeverage){
      changeLeverage({ leverage: value === 0 ? 1 : value }).then(res => {
          // console.log(res.data);
          if (res.data.status === 400) {
            if (res.data.data === "ERR_HAS_ORDER_OR_POSITION") {
              this.leverErrCode =
                this.$t('trade.dontChangeleverage');
              this.leverShow = true;
              this.value = this.leverage;
              return;
            } else {
              this.leverErrCode = this.$t('trade.changeFail');
              this.leverShow = true;
              this.value = this.leverage;
              return;
            }
          } else if (res.data.status === 403) {
            let path = this.$route.path;
            this.$loginRoute(path);
            this.value = this.leverage;
          } else if (res.data.status === 200){
            // 修改成功的逻辑
            localStorage.setItem('leverage',value);
            this.leverage = value;
            let leverFlag = window.sessionStorage.leverFlag;
            if ( value > oldLeverage && (value > 20) && !leverFlag){
              this.isShow = true;
              window.sessionStorage.leverFlag = true;
            } else {
              this.$normalToast('成功');
            }
            // if (leverFlag) {
            //   return;
            // } else {
            //   if (value > 20 && this.isLogin) {
            //     this.isShow = true;
            //     window.localStorage.leverFlag = true;
            //   }
            // }
            if(this.istrue1!==-1){
              this.percent_toggle(this.percents[this.istrue1]);
            }
          }
        }).catch(err=>{
          this.$normalToast('网络问题,请稍后再试');
        });
    },
    // 提示弹框 有持仓
    HelpmainClick(){
      this.isHelp=false;
      this.leavChange(this.isGoNext);
    },
    // 取消 调节杠杆
    isHelpCancel(){
      this.value=this.leverage;
      this.isHelp=false;
    },
    // 确认用户选择的杠杆是否是用户之前的全仓杠杆
    getLeverage() {
      if (this.value === this.leverage) {
        return true;
      } else {
        this.value = this.leverage;
        return false;
      }
    },
    // 去充值
    goPay() {
      this.$router.push("/quickTrans/buy");
    },
    // 检测用户是否输入超过单笔限额
    checkSingleQuota() {
      if (this.checkPrice === 0) {
        if (Number(this.buy_nums) > Number(this.l_max_amount)) {
          this.$normalToast(this.$t('trade.limitMun'), 2000);
          return false;
        }
      }
      if (this.checkPrice === 1) {
        if (Number(this.buy_nums) > Number(this.m_max_sell_amount)) {
          this.$normalToast(this.$t('trade.limitMun'), 2000);
          return false;
        }
      }
      return true;
    },
    // 检测用户是否输入购买数量
    checknum() {
      if (this.buy_nums && this.buy_nums > 0) {
        return true;
      } else {
				this.$normalToast(this.$t('poptip.quickTrans.enterBuyNum'), 2000);
        return false;
      }
    },
    // 检测用户是否输入限价单价格
    checkInputPrice() {
      if(this.checkPrice === 0) {
        this.fixedPrice
        if(!Number(this.fixedPrice)) {
          if(Number(this.fixedPrice) === 0) {
            this.$normalToast(this.$t('trade.placePriceMore'), 2000);
            return false;
          }
          this.$normalToast(this.$t('trade.placePrice'), 2000);
          return false;
        }
      }
      return true;
    },
    //检测用户是否实名
    // getRealAuth() {
    //   let userId =
    //     this.$getCookie("userId") &&
    //     JSON.parse(decodeURIComponent(this.$getCookie("userId"))).userId;
    //   return getRealAuthinfo({ id: userId }).then(res => {
    //     var data = res.data.data;
    //     if (res.data.status === 200) {
    //       // idcardauth===2 未实名
    //       if (data.idcardauth === 1) {
    //         return true;
    //       }
    //       return false;
    //     } else {
    //       // console.log("请求状态码错误");
    //     }
    //   });
    // },
    // // 去实名
    // goAuth() {
    //   this.$loginRoute("/setting/realname");
    // },
    // 登录
    mainClick() {
      this.$router.push("/phoneLogin");
    },
    // 余额弹出函数

    //当前余额是否充足
    availableAmple() {
      //当前价格*用户购买的数量和用户的可用余额比较
      return this.cashDeposit > this.availables ? false : true;
    },
    //确认下单
    affirm(side) {
			if(!this.isLogin){
				let path = this.$route.path;
				this.$loginRoute(path);
        return; //没有登录就结束
			}
			if(!this.checkInputPrice()) return;
			if(!this.checknum()) return;
      if(!this.checkSingleQuota()) return;
      if(!this.availableAmple()) {
        this.balanceErr = true;
        return;
      }
      if(this.postOrderLoad) return;
      this.postOrderLoad = true;
      this.agree(side);
    },
    // 下单失败
    warnMainClick() {
      this.unSuccessful = false;
    },
    // 再次确认下单
    agree(side) {
      //  side 交易方向 1.买入 2.卖出
      if(!side){
        this.postOrderLoad = false;
        return;
      } 
      let data = {
        side,
        symbol: this.coinName,
        type: this.checkPrice === 0 ? 1 : 2,
        action: 0,
        amount: Number(this.buy_nums),
        source: 2
			};
      if(this.checkPrice === 0) {
        data.price = this.fixedPrice;
      }
			this.postOrderHandle(data);
		},
		postOrderHandle(data) {
			proOrder(data).then(res => {
        this.postOrderLoad = false;
        if (res.data.status === 200) {
          this.success = true;
          setTimeout(() => {
            this.success = false;
            window.location.reload();
          }, 1000);
        } else {
          switch (res.data.data) {
            case "ERR_BALANCE_NOT_ENOUGH":
              this.orderErr = this.$t('trade.runningLow'); // 余额不足，请确认操作账户余额充足
              break;
            case "ERR_BUY_PRICE_LESS_LIMIT":
              this.orderErr = this.$t('trade.priceLiss'); // 买入价低于下限
              break;
            case "ERR_SELL_AMOUNT_LESS_LIMIT":
              this.orderErr = this.$t('trade.amountLiss');  // 单笔交易量低于下限
              break;
            case "ERR_BUY_AMOUNT_LESS_LIMIT":
              this.orderErr = this.$t('trade.amountLiss');  // 单笔交易量低于下限
              break;
            case "ERR_BUY_PRICE_OVER_LIMIT":
              this.orderErr = this.$t('trade.buyPriceOver'); // 买入价超过上限
              break;
            case "ERR_BUY_AMOUNT_OVER_LIMIT":
              this.orderErr = this.$t('trade.amountOver'); // 单笔交易量超过上限
              break;
            case "ERR_SELL_PRICE_OVER_LIMIT":
              this.orderErr = this.$t('trade.sellPriceOver');  // 卖出价超过上限
              break;
            case "ERR_WRONG_EVENT":
              this.orderErr = this.$t('trade.handleErr'); // 操作失败，请稍后重试
              break;
            case "ERR_SELL_PRICE_LESS_LIMIT":
              this.orderErr = this.$t('trade.sellPriceLiss'); // 卖出价低于下限
              break;
            case "ERR_POSITION_NOT_ENOUGH":
              this.orderErr = '仓位不足, 请稍后重试'; // 仓位不足
              break;
            case "ERR_BROKER_CAN_NOT_TRADING":
              this.orderErr = this.$t('trade.brokerNotTrading'); // 经纪人不能交易
              break;
            default:
              this.orderErr = this.$t('trade.handleErr'); // 操作失败，请稍后重试
          }
          this.unSuccessful = true;
        }
      }).catch(() => {
        this.postOrderLoad = false;
      });
		},

    // 百分比填充
    // 检测用户输入的类型 2.百分比填充

    // ☆按百分比填充购买数量公式：购买数量=（M%*可用余额*杠杆N）/ 价格（P）
    getPercentage(m) {
      // 限价情况
      if (!Number(this.availables)) {
        // 余额请求失败
        return 0;
      }
      if (this.checkPrice === 0) {
        let res = (m * this.availables * this.value) / this.fixedPrice;
        let temp = String(res);
        let dioLeng = temp.split(".");
        if (dioLeng[1] && dioLeng[1].length > 4) {
          res = dioLeng[0]+'.'+String(dioLeng[1]).replace( /\./g,'').slice(0,4)
        }
        
        return res;
      }
      if (this.checkPrice === 1) {
        let res = (m * this.availables * this.value) / this.latestDeal;
        let temp = String(res);
        let dioLeng = temp.split(".");
        if (dioLeng[1] && dioLeng[1].length > 4) {
          res = dioLeng[0]+'.'+String(dioLeng[1]).replace( /\./g,'').slice(0,4)
        }
        return res;
      }

    },

    chekVal() {
      //检测用户输入的是正整数or 正浮点数
      var rule = "^[0-9]+([.]{1}[0-9]+){0,1}";
      var reg = new RegExp(rule);
      if (this.checkPrice === 1) {
        return true;
      }
      if (reg.test(this.fixedPrice) && this.checkPrice === 0) {
        return true;
        // this.chekValShow = false;
      } else {
				this.$normalToast(this.$t('trade.rightPrice'), 1500);
        return false;
      }
    },
    //获取当前的价格
    getval(val) {
			if(this.checkPrice === 1) return; // 市价单
      this.istrue = -1;
      this.fixedPrice = val.price;
      this.disabled = false;
    },
    // 交易类型选择
    tog() {
			this.checkLogin();
			let check = this.checkPrice == 1 ? 0 : 1;
      this.istrue2 = this.typelist[check].id;
      this.type_name = this.typelist[check].name;
			this.checkPrice = this.typelist[check].id;
			this.msg = this.typelist[check].msg;
			// 缓存输入数据
			if(this.checkPrice == 0) {
				this.fixedPrice = this.inputPrice;
			} else {
				this.inputPrice = this.fixedPrice;
				this.fixedPrice = '';
			}
    },
    // 输入框输入限制
    inputBlanceHandle: function(value, load){
      if(value === 'buy_nums') {
        this.istrue1 = -1;
      }
      if(load) {
        setTimeout(()=> {
          this[value] = String(this[value]).replace( /[^0-9\.?]/g,'');
          let dioLeng = this[value].split('.');
          if(dioLeng.length < 2) return;
          this[value] = dioLeng[0]+'.'+String(dioLeng[1]).replace( /\./g,'').slice(0,4);
        },100)
      } else{
        this[value] = String(this[value]).replace( /[^0-9\.?]/g,'');
        let dioLeng = this[value].split('.');
        if(dioLeng.length < 2) return;
        this[value] = dioLeng[0]+'.'+String(dioLeng[1]).replace( /\./g,'').slice(0,4);
      }
    },
    percent_toggle(item) {
      this.checkLogin();
      if (this.isLogin) {
        if (Number(this.availables) < 0) {
          // 可以余额未负
          this.orderErr = this.$t('trade.runningLow');
          this.unSuccessful = true;
          return;
        }
        if (!Number(this.fixedPrice) && this.checkPrice == 0) {
          // 可以未输入价格
          this.checkPrice == 0 ? this.orderErr = this.$t('trade.noZeroPrice') : this.orderErr = this.$t('trade.placePrice');
          this.unSuccessful = true;
          return;
        }
        if (!this.latestDeal) {
          return ;
        }
        this.istrue1 = item.id;
        switch (this.istrue1) {
          case 0:
            this.percentage = 0.25;
            this.buy_nums = this.getPercentage(this.percentage);
            break;
          case 1:
            this.percentage = 0.5;
            this.buy_nums = this.getPercentage(this.percentage);
            break;
          case 2:
            this.percentage = 0.75;
            this.buy_nums = this.getPercentage(this.percentage);
            break;
          case 3:
            this.percentage = 1;
            this.buy_nums = this.getPercentage(this.percentage);
            break;
            // default:
            this.percentage = 0.25;
            this.buy_nums = this.getPercentage(this.percentage);
        }
      }
    },
  },
  watch: {
    // checkPrice(val) {
    //   if (val === 0) {
    //     this.buy_nums = this.l_min_amount;
    //   }
    //   if (val === 1) {
    //     this.buy_nums = this.m_min_sell_amount;
    //   }
		// },
		latestDeal(val) {
			if(!this.latestDealFlag) {
				this.fixedPrice = val;
        this.latestDealFlag = true;
        if(this.checkPrice === 1) {
          this.inputPrice = this.fixedPrice;
          this.fixedPrice = '';
        }
			}
    },
    asyncleverage(val) {
      this.leverage = val;
      this.value = this.leverage;
    },
    $route(to) {
      this.coinName = to.params.icon;
      this.latestDealFlag = false;
      this.coin = this.coinName.substr(0, 4).toUpperCase();
      this.usdtNewHandle();
      this.getMinAndMax();
      this.buy_nums = '';
      this.istrue1 = -1;
      // this.checkPrice === 0
      //   ? (this.buy_nums = this.l_min_amount)
      //   : (this.buy_nums = this.m_min_sell_amount);
    },
    value(val) {
      if (val === 0) {
        // val=1
        this.value = 1;
      }
		},
		symbols(val) {
			if(Array.isArray(val)) {
				this.symbols.forEach(e => {
					if (this.coinName === e.symbol) {
						this.maker_fee = e.maker_fee;
						return;
					}
				});
			}
		}
  },
  props: [
    "bidsList",
    "asksList",
    "indexPrice",
    "asyncleverage",
    "availables",
    "firstBuyPrice",
    "firstSellPrice",
    "symbols",
    "latestDeal",
    "m_max_sell_amount",
    "m_min_sell_amount",
    "l_min_amount",
    "l_max_amount"
  ],
  beforeDestroy() {
    this.timer && clearInterval(this.timer)
  }
};
</script>

<style lang="less" scoped>
#pro {
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
    background-color: #40d190 !important;
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
    font-size: 28px;
    color: #474747;
  }
  .titles {
    font-size: 24px;
    // color: #a5a5a5;
    color: #474747;
  }
  .mt30 {
    margin-top: 10px;
  }
  .top-box {
    flex: 1;
    display: flex;
    justify-content: space-between;
    overflow-x: hidden;
    height: 475px;
    .left-trading {
      flex: 1;
      margin-right: 5px;
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
        border: solid 1px #999999;
        border-radius: 10px;
        height: 71px;
        // margin-top: 30px;
        // padding: 10px;
        padding-right: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
				box-sizing: border-box;
				.shu{
					display: block;
					width: 0;
					height: 100%;
					margin: 8px;
					border-left: 2px solid #dcdcdc;
				}
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
        border: solid 1px #999999;
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
        width: 60%;
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
          // height: 276px;
          height: 190px;
          // background-color: #f8f8f8;
          // margin-top: 25px;
          padding: 10px 20px 10px 20px;
          li {
            display: flex;
            justify-content: space-between;
            font-size: 22px;
            z-index: 10;
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
		margin-right: 20px;
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
			margin-top: 14px;
			&:first-child{
				background-color: #40d190;				
			}
			img {
				width: 41px;
				height: 35px;
				margin-left: 18px;
			}
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