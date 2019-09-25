<template>
  <div id="trading">
    <div class="header">
      <!-- 已登录(无当前币种持仓),显示的具体可用资产 -->
      <div class="assets">
        <!-- available可用  charge 充值 -->
        <div class="available">
          <p>总资产（USDT）</p>
          <p v-text="isLogin? available:'--'"></p>
        </div>
        <div class="charge">
          <span @click="goPay">查看详情</span>
        </div>
      </div>
    </div>
    <!-- k线走势图 -->
    <div class="center">
      <XChart></XChart>
    </div>
    <!-- 交易盒子-操作合并 -->
    <div class="deal-box">
      <Deal
        :bidsList="bidsList"
        :asksList="asksList"
        :indexPrice="indexPrice"
        :availables="available"
        :buyavailable="buyavailable"
        :sellavailable="sellavailable"
        :symbols="symbols"
        :firstBuyPrice="buy_dishprice"
        :firstSellPrice="sell_dishprice"
        :latestDeal="latestDeal"
        :coinName="coinName"
        :m_max_sell_amount="m_max_sell_amount"
        :m_min_sell_amount="m_min_sell_amount"
        :l_min_amount="l_min_amount"
        :l_max_amount="l_max_amount"
        :symbolsInfo="symbolsInfo"
        :m_min_buy_value="m_min_buy_value"
        :tradeSide='tradeSide'
        @orderSuccess='refreshHandle'
      ></Deal>
    </div>
    <!-- 一键全平弹窗 -->
  </div>
</template>

<script>
// .统计合约交易买卖盘的数量
import XChart from "@/component/charts.vue";
import Deal from './Deal.vue'
import fall from "../../../assets/img/transaction/fall.png";
import rose from "@/assets/img/transaction/rose.png";
import goup from "@/assets/img/transaction/goup.png";
import drop from "@/assets/img/transaction/drop.png";
// 导入请求方法
import {
  getSymbols,
  getholdShares,
  getCoinBalance,
  handleKeySymble
} from "../request.js";
var flag = false;

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
    this.initWebSocket("wss://i.qsq.com/wi/ws");

    // 获取用户选择的当前币种
    this.coinName = this.$route.params.icon;
    this.getHoldAPosition(this.coinName);
    let temp = this.$route.query.type;
    if (temp === "rose") {
      this.$store.commit("changeBuy", temp);
    }
    if (temp === "fall") {
      this.$store.commit("changeBuy", temp);
    }
    // 获取sessionID
    this.$getSession().then(res => {
      if(res) {
        this.getAvailable();
      }
    }).catch(err => {});
  },
  data() {
    return {
      buyavailable: '', // 买入交易币种
      sellavailable: '', // 卖出交易币种
      yieldrate:null, //收益率
      // 全平失败提示
      flatErr: "",
      // 当前币种名称
      coinName: "xbtc_usdt",
      // 最大或者最小购买限制
      // 交易对信息
      symbols: [],
      //一键全平弹框隐藏
      showToast: false,
      // 涨的icon
      goup,
      // 跌的icon
      drop,
      //指数盈亏
      profit:'',
      // 是否登录
      isLogin: false,
      fall,
      rose,
      //本页的所有动态数据
      available: "---",
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
      tradeSide: '',
      // 用户当前币种持仓数组
      currentData: [],
      l_max_amount: null, //限价单，单笔最大挂单量
      l_min_amount: null, //限价单，单笔最小挂单量
      m_max_sell_amount: null, //市价单，卖出最大数量
      m_min_sell_amount: null, //市价单，卖出最小数量
      m_min_buy_value: null, //市价单，买入最小数量
      datas: [],
      symbolsInfo: {},
    };
  },
  methods: {
    refreshHandle() {
      this.$store.commit("changeLoading", true);
      this.getSymbol();
      this.getAvailable();
    },
    initWebSocket(wsurl) {
      // console.log("启动中");
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
          var res = Math.ceil((this.profit/sum)*100)/100
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
              this.symbolsInfo = e;
              return;
            }
          });
        }
      });
    },
    // 一键充值
    goPay() {
      this.$loginRoute("/assets");
    },

    // 点击小横挑关闭弹窗
    close() {
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

    // 获取登录当前币种持仓
    getHoldAPosition(coinName) {
      return ; // 币币没有持仓
      //买涨 指数盈亏
      if (this.isLogin) {
        getholdShares(coinName)
          .then(res => {
            let profitz = 0;
            let profitd = 0;
            if (res.data.status === 200) {
              this.currentData = res.data.data;
              // console.log(this.currentData, "当前用户持仓");
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
          .catch(function(error) {
            // console.log(error);
          });
      } else {
        // console.log("还未登录");
      }
    },

    // 获取已登录但是没有持有xbtc显示的可用资产
    getAvailable() {
      getCoinBalance().then(res => {
        this.$store.commit("changeLoading", false);
        if(res.status === 200) {
          this.available = res.data.zj;
          Array.from(res.data.user_coin, (item) => {
            if(item.name === this.coinName.split('_')[0]) {
              this.sellavailable = item;
            }
            if(item.name === this.coinName.split('_')[1]) {
              this.buyavailable = item;
            }
          });
        }
      }).catch(err =>{
        this.$store.commit("changeLoading", false);
        // console.log(err,'err')
      });
    },
    handle(val) {
      this.$store.commit("changeBuy", val);
    }
  },
  components: {
    XChart,
    Deal,
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
    this.initWebSocket("wss://i.qsq.com/wi/ws");
    this.datas = [];
    next();
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.tradeSide = vm.$route.name;
    })
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
            font-size: 22px;
            margin-top: 30px;
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
  .deal-box{
    height: 500px;
    // background: pink;
  }

}
</style>