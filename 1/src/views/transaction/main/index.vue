<template>
  <div id="trading">
    <div class="header">
      <!-- 已登录(无当前币种持仓),显示的具体可用资产 -->
      <div class="assets" v-show="!(isLogin && isHoldAPosition)">
        <!-- available可用  charge 充值 -->
        <div class="available">
          <p>{{$t('transaction.general.usedAssets')}}（USDT）</p>
          <p v-text="isLogin? available:'--'"></p>
        </div>
        <div class="charge">
          <span @click="goPay">{{$t('transaction.general.transferOne')}}</span>
        </div>
      </div>
      <!-- 已登录,且有当前持仓 -->
      <div class="assets floating" v-show="(isLogin && isHoldAPosition)">
        <!-- available可用  charge 充值 -->
        <div class="available">
          <p>{{$t('holdShares.floatplo')}}(USDT)</p>
          <div class="iconbox">
            <p
              v-text="profit=== undefined ? 0:(profit>=0?`+${profit}`:`${profit}`)"
              :style="{color:profit>=0 ||profit===undefined?'#85bf85':'#d87675'}"
            > 
              <img :src="profit<0? goup:drop" v-show="profit">
            </p>
            <span :style="{color:profit>=0 ||profit===undefined?'#85bf85':'#d87675'}">({{yieldrate|toNumStrFilter(2)}}%)</span>
            <img :src="profit>=0 ||profit===undefined? goup:drop" v-show="profit"> 
          </div>
        </div>
        <div class="charge">
          <span @click="showToast=true">{{$t('holdShares.keyflat')}}</span>
        </div>
      </div>
    </div>
    <div class="ee"></div>
    <!-- k线走势图 -->
    <div class="center">
      <XChart></XChart>
    </div>

    <!-- 盘口数据 -->
    <!-- 尾部盒子 -->
    <div v-if="false" class="footer">
      <div class="dishbox">
        <div class="dish">
          <!-- 买入背景 -->
          <div class="bBgc">
            <div class="buy">{{buynum}}</div>
            <span
              class="bgc"
              :style="{backgroundColor:b_color,width:this.buynum > this.sellnum ? 1 *100+'%':this.buynum/this.sellnum *100+'%'}"
            ></span>
          </div>
          <p class="num" v-text="$t('trading.tradingNums')"></p>
          <div class="sBgc">
            <div class="sell">{{sellnum}}</div>
            <span
              class="bgc"
              :style="{backgroundColor:s_color,width:this.buynum < this.sellnum ? 1 *100+'%':this.sellnum/this.buynum *100+'%'}"
            ></span>
          </div>
        </div>
        <div class="dishPrice">
          <div class="buy_price">{{buy_dishprice}}</div>
          <p class="num" v-text="$t('trading.bestPrice')"></p>
          <div class="sell_price">{{sell_dishprice}}</div>
        </div>
      </div>
      <!-- 下部 -->
      <div class="tradingLayer">
        <div class="bar"></div>
        <div class="trading">
          <div class="tra-buy" @click="handle('rose')">
            <p v-text="$t('trading.rose')"></p>
            <img :src="rose">
          </div>
          <div class="tra-sell" @click="handle('fall')">
            <p v-text="$t('trading.fall')"></p>
            <img :src="fall">
          </div>
        </div>
      </div>
    </div>
    <!-- 交易盒子-操作合并 -->
    <div class="deal-box">
      <Deal
        :bidsList="bidsList"
        :asksList="asksList"
        :indexPrice="indexPrice"
        :availables="available"
        :symbols="symbols"
        :firstBuyPrice="buy_dishprice"
        :firstSellPrice="sell_dishprice"
        :latestDeal="latestDeal"
        :coinName="coinName"
        :m_max_sell_amount="m_max_sell_amount"
        :m_min_sell_amount="m_min_sell_amount"
        :l_min_amount="l_min_amount"
        :l_max_amount="l_max_amount"
        :asyncleverage="leverage"
      ></Deal>
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
    <!-- all一健全平成功 -->
    <toast :isShow="showall" :showToastType="'normal'" :toastContent="$t('trade.submitSuccess')"/>
    <!-- 一键全平失败 -->
    <toast
      :isShow="showallWain"
      :showToastType="'operate'"
      :toastContent="flatErr"
      :showToastImgType="'warning'"
      :toastTitle="$t('trade.submitErr')"
      :toastOperateTitle="$t('poptip.quickTrans.iKnow')"
      @handle-main-click="warnMainClick"
    />
  </div>
</template>

<script>
// .统计合约交易买卖盘的数量
import XChart from "@/component/charts.vue";
// 导入图标路径
import Deal from './Deal.vue'
import fall from "../../../assets/img/transaction/fall.png";
import rose from "@/assets/img/transaction/rose.png";
import goup from "@/assets/img/transaction/goup.png";
import drop from "@/assets/img/transaction/drop.png";
// 导入请求方法
import {
  getSymbols,
  getholdShares,
  getContractBalance,
  handleKeySymble
} from "../request.js";
var flag = false;
import { Popup } from 'vant'
export default {
  created() {
    if (
      this.$getCookie("userId") &&
      JSON.parse(decodeURIComponent(this.$getCookie("userId"))).userId
    ) {
      this.isLogin = true;
    }
    this.getSymbol();

    // 一进来就刷新
    this.$store.commit("changeLoading", true);

    this.getAvailable();
    // 获取是否有用户登录

    // 初始化websocket接口
    this.initWebSocket(this.$interfaceGolangWss);

    // 获取用户选择的当前币种
    this.coinName = this.$route.params.icon;
    this.coin = this.coinName.substr(0, 4).toUpperCase();
    this.getHoldAPosition(this.coinName);
    let temp = this.$route.query.type;
    if (temp === "rose") {
      this.show = true;
      this.$store.commit("changeBuy", temp);
    }
    if (temp === "fall") {
      this.show = true;
      this.$store.commit("changeBuy", temp);
    }
    // 获取sessionID
    this.$getSession().then(res => {
      if(res) {
        this.getAvailable();
      }
    }).catch(() => {});
  },
  data() {
    return {
      yieldrate:0, //收益率
      coin: null,
      // 全平失败提示
      flatErr: "",
      // 当前币种名称
      coinName: "xbtc_usdt",
      // 最大或者最小购买限制
      // 交易对信息
      symbols: [],
      shows: null,
      istrue: 0,
      tabname: "快速下单",
      tabs: [
        {
          name: "快速下单",
          id: 0
        },
        {
          name: "专业下单",
          id: 1
        }
      ],
      showall: false,
      showallWain: false,
      //一键全平弹框隐藏
      showToast: false,
      // 买入颜色
      b_color: "#e8f7e8",
      s_color: "#f8e5e3",
      // 涨的icon
      goup,
      leverage: '', // 杠杆倍数
      // 跌的icon
      drop,
      // isHoldAPosition 当前是否持仓当前币种xbct-usdt
      isHoldAPosition: false,
      //指数盈亏
      profit:'',
      // 是否登录
      isLogin: false,
      fall,
      rose,
      show: false,
      state: null,
      //本页的所有动态数据
      available: "---",
      // 买入数量
      buynum: "---",
      // 卖出数量
      sellnum: "---",
      // 买入百分比
      bPercent: "80%",
      sPercent: "60%",
      // 最优盘口价 买卖盘一价格
      buy_dishprice: "---",
      sell_dishprice: "---",
      // ----websock字段
      websock: null,
      //买单数组
      bidsList: [],
      // 卖单深度数组
      asksList: [],
      indexPrice: "",
      //最新成交价格
      latestDeal: null,
      // 用户当前币种持仓数组
      currentData: [],
      l_max_amount: null, //限价单，单笔最大挂单量
      l_min_amount: null, //限价单，单笔最小挂单量
      m_max_sell_amount: null, //市价单，卖出最大数量
      m_min_sell_amount: null, //市价单，卖出最小数量
      datas: []
    };
  },
  methods: {
    initWebSocket(wsurl) {
      // let wsurl = "你的websockt url";
      this.websock = new WebSocket(wsurl);
      this.websock.onopen = this.websocketonopen; //连接成功
      this.websock.onmessage = this.websocketonmessage; //广播成功
      this.websock.onerror = this.websocketonerror; //连接断开，失败
      this.websock.onclose = this.websocketclose; //连接关闭
    }, //初始化weosocket
    websocketonopen() {
      // console.log("连接成功");
      this.websocketsend({
        event: "subscribe",
        channel: `${this.coinName}.ticker`
      });
      this.websocketsend({
        event: "subscribe",
        channel: `${this.coinName}.deep`
      });
      this.websocketsend({
        event: "subscribe",
        channel: `${this.coinName}.index`
      });
    }, //连接成功
    websocketonerror() {
      // console.log("连接失败");
    }, //连接失败
    websocketclose() {
      // console.log("断开连接");
    }, //各种问题导致的 连接关闭
    //数据接收
    websocketonmessage(data) {
      var resdata = JSON.parse(data.data);
      if (resdata["type"] === `${this.coinName}.deep`) {
        this.buySellNums(resdata["data"]);
        this.getFiveDeep(resdata["data"]);
      }
      if (resdata["type"] === `${this.coinName}.ticker`) {
        //最新成交
        this.latestDeal = resdata["data"][0];
        let profitz = 0;
        let profitd = 0;
        let sum=0;
        this.datas.forEach(e => {
         
          if (e.side === 1) {
            
            profitz += e.amount * (this.latestDeal - e.price);
            sum+=e.used_margin
          }
          if (e.side === 2) {
            profitd += e.amount * (e.price - this.latestDeal);
            sum+=e.used_margin
          }
          this.profit = Math.ceil((profitz + profitd) * 100) / 100;
          // 收益率 （浮动盈亏 / 买卖保证金）%
          var res = Math.ceil((this.profit/sum)*100)/100 || 0;
          this.yieldrate = res*100
        });
        // 买一价
        this.buy_dishprice = resdata["data"][2];
        // sessionStorage.buy_dishprice = resdata["data"][2];
        //卖一价
        this.sell_dishprice = resdata["data"][4];
        // sessionStorage.sell_dishprice = resdata["data"][4];
      }
      // 指数价
      if (resdata["type"] === `${this.coinName}.index`) {
        this.indexPrice = resdata["data"].price;
      }
      this.$store.commit("changeLoading", false);
    },
    //数据发送
    websocketsend(data) {
      this.websock.send(JSON.stringify(data));
    },
    // 检测用户选择的币种的最大值和最小值

    getSymbol() {
      getSymbols().then(res => {
        if (res.status === 200) {
          this.symbols = res.data.data;
          res.data.data.forEach(e => {
            if (this.coinName === e.symbol) {
              this.l_max_amount = e.l_max_amount;
              this.l_min_amount = e.l_min_amount;
              this.m_max_sell_amount = e.m_max_sell_amount;
              this.m_min_sell_amount = e.m_min_sell_amount;
              return;
            }
          });
        }
      });
    },
    // 一键充值
    goPay() {
      this.$router.push("/quickTrans/buy");
    },
    // 点击小横挑开启弹窗
    // open() {
    //   this.show = true;
    // },
    // 点击小横挑关闭弹窗
    close() {
      this.show = false;
    },
    toggle(item) {
      this.istrue = item.id;
      this.tabname = item.name;
    },
    // 保留两位小数的方法
    retainDecimal(num) {
      try {
        if (!isNaN(num) && num) {
          return Math.floor(num * 100) / 100;
        }
      } catch (error) {
        // console.log(error);
      }
    },
    // 计算合约交易买卖盘的数量  买卖十档
    buySellNums(obj) {
      // {asks: Array(46), bids: Array(56)}
      let bSum = 0;
      let sSum = 0;
      // console.log(obj)
      if (obj.bids && obj.asks) {
        var bidsList = obj.bids.filter((c, index) => index < 20);
        var asksList = obj.asks.filter((c, index) => index < 20);
        for (let i = 0; i < bidsList.length; i++) {
          if (i % 2 != 0) {
            bSum += bidsList[i];
          }
        }
        for (let i = 0; i < asksList.length; i++) {
          if (i % 2 != 0) {
            sSum += asksList[i];
          }
        }
        this.buynum = Math.ceil(bSum);
        this.sellnum = Math.ceil(sSum);
      }
    },
    //处理卖盘
    f1(name) {
      return function(o1, o2) {
        var value1 = o1[name];
        var value2 = o2[name];

        if (value1 < value2) {
          return 1;
        } else if (value1 > value2) {
          return -1;
        } else {
          return 0;
        }
      };
    },
    //獲取盘口深度 ,前五档的.
    getFiveDeep(obj) {
      if (obj.bids && obj.asks) {
        var b = obj.bids.filter((c, index) => index < 10);
        var a = obj.asks.filter((c, index) => index < 10);
        var bpricelist = [];
        var bnumlist = [];
        var buylist = [];
        var selllist = [];
        var spricelist = [];
        var snumlist = [];
        for (let i = 0; i < b.length; i++) {
          if (i % 2 != 0) {
            bnumlist.push(b[i]);
          } else {
            bpricelist.push(b[i]);
          }
        }
        for (let i = 0; i < a.length; i++) {
          if (i % 2 != 0) {
            snumlist.push(a[i]);
          } else {
            spricelist.push(a[i]);
          }
        }
        for (var x in bpricelist) {
          let item = { price: bpricelist[x], num: bnumlist[x] };
          buylist.push(item);
        }
        for (var x in spricelist) {
          let item = { price: spricelist[x], num: snumlist[x] };
          selllist.push(item);
        }
      }
      this.bidsList = buylist;
      this.asksList = selllist;
      var oldlist = this.asksList;

      try {
        this.asksList = oldlist.sort(this.f1("price"));
      } catch (error) {
        // console.log(error, "可能是sort方法出问题了");
      }
    },
    //请求的得到数据
    //一键全平
    mainClick() {
      //当前用户的持仓币种
      this.currentData.forEach(e => {
        var flag = false;
        let obj = {
          amount: e.amount,
          side: e.side === 1 ? 2 : 1,
          symbol: e.symbol,
          type: 2,
          action: 1,
          source: 2,
          price: e.side === 1 ? this.sell_dishprice : this.buy_dishprice
        };
        handleKeySymble(obj).then(res => {
          this.showToast = false;
          if (res.data.status === 200) {
            flag = true;
            if (flag) {
              this.showall = true;
              setTimeout(() => {
                this.showall = false;
                this.isHoldAPosition = false;
              }, 2000);
              return;
            }
          }
          if (res.data.status === 400 && flag === false) {
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
            case "ERR_BUY_AMOUNT_OVER_LIMI":
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
            case "ERR_BROKER_CAN_NOT_TRADING":
              this.orderErr = this.$t('trade.brokerNotTrading'); // 经纪人不能交易
              break;
            default:
              this.orderErr = this.$t('trade.handleErr'); // 操作失败，请稍后重试
          }
            this.showallWain = true;
            // this.flatErr = `${this.coin}持仓可平量超过一键全平可平范围（${
            //   this.m_min_sell_amount
            // }~${this.m_max_sell_amount}${this.coin}），请自行手动平仓`;
            return;
          }
        });
      });
    },
    // 平仓失败
    warnMainClick() {
      this.showallWain = false;
      // window.location.reload();
    },

    // 获取登录当前币种持仓
    getHoldAPosition(coinName) {
      //买涨 指数盈亏
      if (this.isLogin) {
        getholdShares(coinName)
          .then(res => {
            let profitz = 0;
            let profitd = 0;
            if (res.data.status === 200) {
              this.currentData = res.data.data;
              this.currentData.forEach(e => {
                var obj = {
                  price: e.price,
                  amount: e.amount,
                  side: e.side,
                  used_margin:e.used_margin,
                };
                this.datas.push(obj);
              });
              if (res.data.data.length > 0) {
                this.isHoldAPosition = true;
                return;
              } else {
                this.isHoldAPosition = false;
                return;
              }
            }
          })
          .catch(function() {});
      }
    },

    // 获取已登录但是没有持有xbtc显示的可用资产
    getAvailable() {
      let that = this;
      getContractBalance().then(res => {
        try {
          if (res.data.status === 200 && res.data.data.length > 0) {
            if (res.data.data[0].available) {
              that.available = that.retainDecimal(res.data.data[0].available);
            } else {
              that.available = 0;
            }
            //所用的杠杆
            // console.log(res.data,'用户的杠杆')
            window.localStorage.leverage = res.data.data[0].leverage;
            this.leverage = res.data.data[0].leverage;
          }
        } catch (error) {}
      });
    },
    handle(val) {
      this.show = flag;
      this.show = !this.show;
      this.$store.commit("changeBuy", val);
    }
  },
  components: {
    XChart,
    // updrawer,
    Deal,
    Popup
  },
  destroyed() {
    this.websock.close(); //离开路由之后断开websocket连接
    this.$store.commit("changeLoading", false);
  },
  beforeRouteUpdate(to, from, next) {
    this.coinName = to.params.icon;
    this.getHoldAPosition(this.coinName);
    this.getAvailable();
    this.getSymbol();
    this.websock.close();
    this.initWebSocket(this.$interfaceGolangWss);
    (this.datas = []), next();
  }
};
</script>

<style lang="less" scoped>
#trading {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 100px;
  .header {
    margin-bottom: 0;
    height: 128px;
    .assets {
      // height: 135px;
      height: 80%;
      width: 100%;
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #fff;
      // border-bottom: 1px solid #dcdcdc;
      .available {
        p {
          font-size: 34px;
          color: #343434;
          text-align: left;
          line-height: 57px;
          &:first-child {
            margin-top: 30px;
            font-size: 22px;
            line-height: 38px;
          }
        }
      }
      .charge {
        width: 165px;
        height: 55px;
        background-color: #3e80ca;
        border-radius: 5px;
        margin-top: 35px;
        span {
          color: #fff;
          font-size: 24px;
          line-height: 55px;
        }
      }
    }

    .floating {
      .iconbox {
        // margin-top: 20px;
        display: flex;
        align-items: baseline;
        p,span {
          color: #85bf85;
          font-size: 34px !important;
        }
        img {
          margin-left: 30px;
          width: 40px;
          height: 33px;
          align-self: center;
          margin-top: 3px;

        }
      }
      .charge {
        background-color: #fff;
        border: 2px solid #3e80ca;
        span {
          color: #3e80ca;
          font-size: 24px;
          line-height: 55px;
        }
      }
    }
  }
  .center {
    flex: 1;
  }
  // 资产盒子
  .footer {
    height: 360px;
    //盘口盒子
    .dishbox {
      background-color: #fff;
      padding: 30px 20px 50px 20px;
      display: flex;
      flex-direction: column;
      // transform: translateY(-120px);
      // height: 200px;
      .dish {
        display: flex;
        justify-content: center;
        align-items: center;
        .bBgc {
          width: 100%;
          position: relative;
          z-index: 3;
          .buy {
            width: 100%;
            // padding-left: 10%;
            // padding-right: 10%;
            font-size: 24px;
            color: #85bf85;
            z-index: 3;
            text-align: right;
            margin-top: 6px;
          }
          .bgc {
            height: 34px;
            width: 100px;
            background-color: pink;
            position: absolute;
            top: 0;
            right: 0;
            z-index: -1;
          }
        }
        // 中间文字
        .num {
          width: 50%;
          font-size: 22px;
          color: #1a1a1a;
          margin: 0 15px 0 15px;
        }
        .sBgc {
          width: 100%;
          position: relative;

          z-index: 3;
          .sell {
            width: 100%;
            font-size: 24px;
            color: #d87675;
            z-index: 3;
            text-align: left;
            margin-top: 6px;
          }
          .bgc {
            height: 34px;
            position: absolute;
            top: 0;
            left: 0;
            z-index: -1;
          }
        }
      }
      .dishPrice {
        margin-top: 45px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .buy_price {
          flex: 1;
          height: 28px;
          font-size: 34px;
          line-height: 42px;
          text-align: left;
          color: #85bf85;
        }
        .num {
          font-size: 22px;
          height: 23px;
          color: #1a1a1a;
          width: 220px;
        }
        .sell_price {
          flex: 1;
          height: 28px;
          text-align: right;
          font-size: 34px;
          line-height: 42px;
          color: #d87675;
        }
      }
    }
    //购买浮层
    .tradingLayer {
      background-color: #fff;
      height: 196px;
      width: 100%;
      padding: 20px;
      // background-color: pink;
      box-shadow: 0px -8px 7px 1px rgba(229, 229, 229, 0.75);
      border-radius: 30px 30px 0 0;
      display: flex;
      flex-direction: column;
      .bar {
        margin-top: 13px;
        width: 99px;
        height: 10px !important;
        background-color: #e5e5e5;
        border-radius: 3px;
        align-self: center;
      }
      .trading {
        height: 85px;
        width: 100%;
        margin: 30px 0 30px 0;
        display: flex;

        .tra-buy {
          flex: 1;
          background-color: #85bf85;
          color: #fff;
          font-size: 34px;
          line-height: 70px;
          display: flex;
          justify-content: center;
          img {
            width: 40px;
            height: 33px;
            align-self: center;
            margin-left: 19px;
            margin-bottom: 5px;
          }
        }
        .tra-sell {
          flex: 1;
          background-color: #d87675;
          font-size: 34px;
          line-height: 70px;
          color: #fff;
          display: flex;
          justify-content: center;
          img {
            width: 40px;
            height: 33px;
            align-self: center;
            margin-left: 19px;
            margin-bottom: 5px;
          }
        }
      }
    }
  }
  .deal-box{
    height: 600px;
    // background: pink;
  }

  #ant {
    position: absolute;
    bottom: 100px;
    .active {
      color: #202025;
      font-size: 45px;
      height: 45px;
      line-height: 45px;
    }
    .diy {
      border-radius: 30px 30px 0 0;
      display: flex;
      flex-direction: column;
      .bar {
        margin-top: 50px;
        width: 100px;
        height: 10px;
        background-color: #e5e5e5;
        border-radius: 3px;
        align-self: center;
      }
      .tabnav {
        padding: 20px;
        margin-top: 94px;
        margin-top: 30px;
        display: flex;
        justify-content: left;
        font-size: 30px;
        color: #818181;
        p:first-child {
          margin-right: 70px;
        }
      }
      hr {
        // margin-top: 34px;
        margin-top: 25px;
        height: 1px;
        border: solid 1px #dcdcdc;
      }
      .content {
        padding: 20px;
        .boxone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
</style>