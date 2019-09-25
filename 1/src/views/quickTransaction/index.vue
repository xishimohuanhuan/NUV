<template>
  <div class="quick-trans">
    <div class="quick-trans-header">
      <div :class="[{'tab-item-selected': selectedTab==='buy'},'tab-item', 'tab-item-0']" @click="changeSelectTb('buy')">
        <span>{{$t('quickTrans.buy.title')}}</span>
      </div>
      <div :class="[{'tab-item-selected': selectedTab==='sell'},'tab-item', 'tab-item-0']" @click="changeSelectTb('sell')">
        <span>{{$t('quickTrans.sell.title')}}</span>
      </div>
      <span class="ctc-go" @click='gotologo'><a href="javascript:void(0)">{{$t('quickTrans.sell.freeTra')}}</a></span>
      <img @click="showMore = true" src="../../assets/img/quickTrans/more.png" alt=""/>
    </div>
    <div class="quick-trans-all">
      <div v-if="selectedTab==='buy'" class="quick-trans-item quick-trans-buy">
        <div class="quick-trans-body">
          <div class="quick-trans-type">
            <span @click="buy.selectedType = 'money'" :class="['trans-type', {'select-type': buy.selectedType === 'money'}]" v-text="$t('quickTrans.buy.moneyType')"></span> | <span @click="buy.selectedType = 'num'" :class="['trans-type', {'select-type': buy.selectedType === 'num'}]" v-text="$t('quickTrans.buy.numType')"></span>
          </div>
          <div class="quick-trans-info">
            <p class="trans-limit-price">
              <span v-text="$t('quickTrans.buy.unitPrice')"></span>
              <span v-text="unitPrice ? (unitPrice.toFixed(2) + ' CNY') : '--'"></span>
            </p>
            <p class="trans-limit-num">
              <span v-text="buy.selectedType === 'money' ? $t('quickTrans.buy.moneyLimit') : $t('quickTrans.buy.numLimit')"></span>
              <span v-text="limitNum.max ? (buy.selectedType === 'money' ? ((limitNum.min * unitPrice).toFixed(2) + '-' + (limitNum.max * unitPrice).toFixed(2) + ' CNY') : (limitNum.min.toFixed(2) + '-' + limitNum.max.toFixed(2) + ' USDT')) : '--'"></span>
            </p>
          </div>
          <div class="quick-trans-input">
            <input type="number" v-enter-number v-show="buy.selectedType === 'money'" :placeholder="$t('quickTrans.buy.inputMoneyPoptip')" v-model="buy.inputValueMoney" @focus="handleBuyFocus" @input="handleBuyInput"/>
            <input type="number" v-enter-number v-show="buy.selectedType === 'num'" :placeholder="$t('quickTrans.buy.inputNumPoptip')" v-model="buy.inputValueNum" @focus="handleBuyFocus" @input="handleBuyInput"/>
            <span v-text="buy.selectedType === 'money' ? $t('quickTrans.buy.moneyUnit') : $t('quickTrans.buy.numUnit')"></span>
          </div>
          <p class="p-Sele-Add" v-text="$t('quickTrans.buy.pleaseMeth')"></p>
          <div class="quick-trans-trench">
            <div v-show="payway.indexOf(item.type) !== -1" :class="['trench-item', {'trench-item-select': item.isBuySelected}]" v-for="(item, index) in quickTransTrench" :key="index" @click="handleChangeTrench(item, 'buy')">
              <img :src="item.imgSrc" alt="" />
            </div>
            <!-- 购买页面的可用余额 -->
            <div class="quick-trans-money">
              <span v-text="$t('quickTrans.sell.moneyPoptip')"></span>
              <p>
                <span>{{sell.money.toFixed(8)}} USDT</span>
              </p>
            </div>
          </div>
        </div>
        <div class="quick-trans-result">
          <!-- 成交单价 -->
          <div class="result-turnover">
              <span v-text="$t('quickTrans.buy.single')"></span>
              <span 
                v-text="buy.selectedType === 'money' ? 
                (buy.inputValueMoney ? unitPrice.toFixed(2) : '--') + ' CNY' :
                (buy.inputValueNum ? unitPrice.toFixed(2) : '--') + ' CNY'"
              ></span>
          </div>
          <div class="result-turnover">
            <span v-text="$t('quickTrans.buy.turnover')"></span>
            <span v-text="buy.selectedType === 'money' ? (buy.inputValueMoney ? Number(buy.inputValueMoney / unitPrice).toFixed(2) : '--') + ' USDT' : (buy.inputValueNum || '--') + ' USDT'"></span>
          </div>
          <div class="result-GMV">
            <span v-text="$t('quickTrans.buy.GMV')"></span>
            <span v-text="buy.selectedType === 'money' ? (buy.inputValueMoney ? Number(buy.inputValueMoney).toFixed(2) : '--') + ' CNY' : ((buy.inputValueNum * unitPrice) ? Number(buy.inputValueNum * unitPrice).toFixed(2) : '--') + ' CNY'"></span>
          </div>
        </div>
        <div class="quick-trans-footer">
          <div class="quick-buy-btn" v-text="$t('quickTrans.buy.btnTitle')" @click="handleBuy"></div>
          <p class="quick-buy-poptip" v-text="$t('quickTrans.buy.poptip')"></p>
          <p class="quick-buy-poptip" >{{$t('quickTrans.buy.popXin')}}</p>
          <p class="quick-buy-poptip" >{{$t('quickTrans.buy.popZhi')}}</p>
        </div>
      </div>
      <div v-if="selectedTab==='sell'" class="quick-trans-item quick-trans-sell">
        <div class="quick-trans-body">
          <div class="quick-trans-type">
            <span @click="sell.selectedType = 'money'" :class="['trans-type', {'select-type': sell.selectedType === 'money'}]" v-text="$t('quickTrans.sell.moneyType')"></span> | <span @click="sell.selectedType = 'num'" :class="['trans-type', {'select-type': sell.selectedType === 'num'}]" v-text="$t('quickTrans.sell.numType')"></span>
          </div>
          <div class="quick-trans-info">
            <p class="trans-limit-price">
              <span v-text="$t('quickTrans.sell.unitPrice')"></span>
              <span v-text="unitPrice ? (unitPrice.toFixed(2) + ' CNY') : '--'"></span>
            </p>
            <p class="trans-limit-num">
              <span v-text="sell.selectedType === 'money' ? $t('quickTrans.sell.moneyLimit') : $t('quickTrans.sell.numLimit')"></span>
              <span v-text="sellLimitNum.max ? (sell.selectedType === 'money' ? ((sellLimitNum.min * unitPrice).toFixed(2) + '-' + (sellLimitNum.max * unitPrice).toFixed(2) + ' CNY') : (sellLimitNum.min.toFixed(2) + '-' + sellLimitNum.max.toFixed(2) + ' USDT')) : '--'"></span>
            </p>
          </div>
          <div class="quick-trans-input">
            <input type="number" v-enter-number v-show="sell.selectedType === 'money'" :placeholder="$t('quickTrans.sell.inputMoneyPoptip')" v-model="sell.inputValueMoney" @focus="handleSellFocus" @input="handleSellInput"/>
            <input type="number" v-enter-number v-show="sell.selectedType === 'num'" :placeholder="$t('quickTrans.sell.inputNumPoptip')" v-model="sell.inputValueNum" @focus="handleSellFocus" @input="handleSellInput"/>
            <span v-text="sell.selectedType === 'money' ? $t('quickTrans.sell.moneyUnit') : $t('quickTrans.sell.numUnit')"></span>
          </div>
          <p class="p-Sele-Add" v-text="$t('quickTrans.buy.pleaseMethSe')"></p>
          <div class="quick-trans-trench">
            <div :class="['trench-item', {'trench-item-select': item.isSellSelected}]" v-for="(item, index) in quickTransTrench" :key="index" @click="handleChangeTrench(item, 'sell')" v-show="sellCanUsePayWay.indexOf(item.type) !== -1 || sellCanUsePayWay.length === 0">
              <img :src="item.imgSrc" alt="" />
            </div>
            <div class="quick-trans-money">
              <span v-text="$t('quickTrans.sell.moneyPoptip')"></span>
              <p>
                <span>{{sell.money.toFixed(8)}} USDT</span>
              </p>
            </div>
          </div>
        </div>
        <div class="quick-trans-result">
          <!-- 成交单价 -->
          <div class="result-turnover">
              <span v-text="$t('quickTrans.buy.single')"></span>
              <span 
                v-text="sell.selectedType === 'money' ?
                (sell.inputValueMoney ? unitPrice.toFixed(2) : '--') + ' CNY' : 
                (sell.inputValueNum ? unitPrice.toFixed(2) : '--') + ' CNY'"
              ></span>
          </div>
          <div class="result-turnover">
            <span v-text="$t('quickTrans.sell.turnover')"></span>
            <span v-text="sell.selectedType === 'money' ? (sell.inputValueMoney ? Number(sell.inputValueMoney / unitPrice).toFixed(2) : '--') + ' USDT' : (sell.inputValueNum || '--') + ' USDT'"></span>
          </div>
          <div class="result-GMV">
            <span v-text="$t('quickTrans.sell.GMV')"></span>
            <span v-text="sell.selectedType === 'money' ? (sell.inputValueMoney ? Number(sell.inputValueMoney).toFixed(2) : '--') + ' CNY' : ((sell.inputValueNum * unitPrice) ? Number(sell.inputValueNum * unitPrice).toFixed(2) : '--') + ' CNY'"></span>
          </div>
        </div>
        <div class="quick-trans-footer">
          <div class="quick-buy-btn" v-text="$t('quickTrans.sell.btnTitle')"  @click="handleSell"></div>
          <p class="quick-buy-poptip" v-text="$t('quickTrans.buy.poptip')"></p>
          <p class="quick-buy-poptip" >{{$t('quickTrans.buy.popXin')}}</p>
          <p class="quick-buy-poptip" >{{$t('quickTrans.buy.popZhi')}}</p>
        </div>
      </div>
    </div>
    <div class="more-shade" v-show="showMore" @click.self="showMore=false">
      <div class="more-content">
        <div class="more-item" @click="handleOrderRecord">
          <img src="../../assets/img/quickTrans/orderRecord.png" alt=""/>
          <span v-text="$t('quickTrans.more.orderRecord')"></span>
        </div>
        <div class="more-item" @click="handleBillingMethod">
          <img src="../../assets/img/quickTrans/billingMethod.png" alt=""/>
          <span v-text="$t('quickTrans.more.billingMethod')"></span>
        </div>
      </div>
    </div>
    <toast 
        :showToastType="'operate'" 
        :isShow = "realNameToast"
        :showToastImgType="'warning'"
        :toastContent="'你还未实名，请先实名认证'" 
        :toastOperateTitle="'去实名'" 
        :toastAssistOperateTitle="$t('userDrawer.cancel')" 
        @handle-main-click="realNameToast=false;$router.push('/setting/checkcode')" 
        @handle-assist-click="realNameToast=false"/>
    <toast v-show="toast.show" :showToastType="toast.type" :toastContent="toast.content" :showToastImgType="toast.imgType" :toastOperateTitle="toast.operateTitle" @handle-main-click="handleMainClick"/>
  </div>
</template>

<script>
export default {
  data() {
    let that = this;
    return {
      timerSert:null,
      flagDataWeb:false,
      // websocked 数据
      dataWeb:null,
      userId:false,
      wsTimer:null,
      ws: null,
      timerN:null,
      wsTimerReload: null,
      selFlag:false,
      selectedTab: 'buy',
      isOTC:"",
      idcardauth: '', //是否实名
      realNameToast: false,
      buy: {
        selectedType: 'money',
        inputValueMoney: '',
        inputValueNum: '',
        turnover: 0,
        GMV: 0
      },
      sell: {
        selectedType: 'money',
        inputValueMoney: '',
        inputValueNum: '',
        turnover: 0,
        GMV: 0,
        money: 0
      },
      quickTransTrench: [
        {
          imgSrc: require('../../assets/img/quickTrans/alipay.png'),
          isBuySelected: false,
          isSellSelected: false,
          type: 2
        },
        {
          imgSrc: require('../../assets/img/quickTrans/bankcard.png'),
          isBuySelected: false,
          isSellSelected: false,
          type: 1
        },
        {
          imgSrc: require('../../assets/img/quickTrans/wechat.png'),
          isBuySelected: false,
          isSellSelected: false,
          type: 3
        }
      ],
      showMore: false,
      isOpenQuickTrade: false,
      unitPrice: 0,
      limitNum: {
        max: 0,
        min: 0
      },
      sellLimitNum: {
        max: 0,
        min: 0
      },
      payway: '',
      canUsePayWay: [],
      sellCanUsePayWay: [],
      toast: {
        show: false,
        type: 'operate',
        content: that.$t('poptip.quickTrans.notEnabled'),
        imgType: '',
        operateTitle: that.$t('poptip.quickTrans.iKnow'),
        flag: 0
      },
      loading: false
    }
  },
  created(){
    var Obj=decodeURIComponent(this.$getCookie('userId'));
    let phone, userId, token;
    if(Obj) {
      this.istradeSet = JSON.parse(Obj).istradeSet;
      token = JSON.parse(Obj).token;
      phone = JSON.parse(Obj).phone;
      userId = JSON.parse(Obj).userId;
      this.isOTC=this.$phpUrl+'otc/?userId='+userId+'&token='+token+"&phone="+phone;
    }
  },
  beforeRouteEnter (to, from, next) {
    // ...
    next(vm => {
      let way = vm.$route.params.way;
      vm.changeSelectTb(way, true);
      vm.getTradeStatus();
      vm.webSocketHandle();
      vm.wsTimerReload = setInterval(() => {  // 重连
        // clearTimeout(vm.wsTimerReload);
          if(vm.ws && (vm.ws.readyState !== 1)) {
            vm.ws.close();
            vm.webSocketHandle();
          }
        }, 3000)
      if (decodeURIComponent(vm.$getCookie('userId')) && JSON.parse(decodeURIComponent(vm.$getCookie('userId'))).userId) {
        vm.getUserUsdt();
        vm.getUserPaymentWayList();
        let userId = decodeURIComponent(vm.$getCookie('userId')) && JSON.parse(decodeURIComponent(vm.$getCookie('userId')));
        vm.getUserInfo({userId: userId.userId});
      }
    })
  },
  beforeRouteLeave (to, from, next) {
    // ...
    this.showMore = false;
    this.$overflowScrolling(true);
    clearInterval(this.timerN)
    this.wsTimerReload && clearInterval(this.wsTimerReload)
    this.ws && this.ws.close();
    clearInterval(this.wsTimer);
    clearTimeout(this.timerSert);
    next();
  },
  watch: {
    showMore(val){
      if(val) {
        this.$overflowScrolling(false);
      } else {
        setTimeout(() => {
            this.$overflowScrolling(true);
        }, 300)
      }
    }
  },
  methods: {
    gotologo(){
      if( this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId'))).userId && this.istradeSet ){
        let isBuySelected =  this.quickTransTrench.some(item => item.isSellSelected);
        if(!isBuySelected) {
          this.$normalToast('请先绑定收款方式');
          setTimeout(() => {
            this.$router.push('/payment');
          },2000)
          return;
        }
        location.href = this.isOTC;
      }else{
        let path = '/quickTrans/sell';
        this.$loginRoute(path);
      }
    },
    getUserPaymentWayList() {
      let that = this;
      that.$axios({
        url: '/user/getUserBankList',
        method: 'get',
        params: {userId: (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId)}
      }).then(function(res) {
        let data = res.data;
        if (data.status === 200) {
          data.msg === '001' && (data.data = []);
          that.sellCanUsePayWay = data.data.map(item => {return item.type});
          for (let item of that.quickTransTrench) {
            if (item.type === that.sellCanUsePayWay[0]) {
              item.isSellSelected = true;
              return;
            }
          }
        }
      })
    },
    getUserInfo(data) {
      return this.$axios({
        data,
        url: `/user/getUserInfo`,
        method: 'post',
      }).then(res => {
        if(res.status === 200){
          if(res.data.status === 200){
            // 判断实名认证是否成功
            // sessionStorage.setItem('idcardauth', res.data.data.idcardauth);
            this.idcardauth = res.data.data.idcardauth+''
            return res.data.data.idcardauth+'';
          }
        }
      })
    },
    checkRealName() {
      let userId = decodeURIComponent(this.$getCookie('userId')) && JSON.parse(decodeURIComponent(this.$getCookie('userId')));
      if(this.idcardauth) {
        this.realNameLink(this.idcardauth, userId.userId);
      } else {
        this.getUserInfo({userId: userId.userId}).then(res => {
          this.realNameLink(res, userId.userId);
        })
      } 
      // this.$normalToast('正在建设中',2000);
      // location.href='http://gqg.com'      
    },
    realNameLink(idcardauth, userId) {
      if(idcardauth == '1') {
        return true;
      } else {
         this.realNameToast = true;
      }
    },
    changeSelectTb(key,enter) {
      if(!enter) {
        this.$loginRoute('/quickTrans/'+key);
        if(this.$store.state.globalToast) return; // 未设置交易密码
      }
      this.selectedTab = key;
      this.getTradeStatus(key);
      if(this.flagDataWeb){
        this.dataHanldChul();
      }
    },
    handleChangeTrench(item, type) {
      if (!(decodeURIComponent(this.$getCookie('userId')) && JSON.parse(decodeURIComponent(this.$getCookie('userId'))).userId)) {
        this.$loginRoute('./quickTrans');
        return;
      }
      if (type === 'buy') {
        let preItem = this.quickTransTrench.find((option) => {return option.isBuySelected});
        preItem.isBuySelected = false;
        item.isBuySelected = true;
      } else {
        if (this.sellCanUsePayWay.length) {
          let preItem = this.quickTransTrench.find((option) => {return option.isSellSelected});
          preItem.isSellSelected = false;
          item.isSellSelected = true;
        } else {
          this.$loginRoute('/payment');
        }
      }
    },
    handleOrderRecord() {
      this.$loginRoute('/orderRecord');
    },
    handleBillingMethod() {
      this.$loginRoute('/payment');
    },
    getTradeStatus(key1) {
      let that = this;
      that.loading = false;
      that.$axios({
        url: 'version/api/trade/getTradeStatus', method: 'get',params:{type: (that.selectedTab==="buy" ? 1 : 2)}
      }).then(function(data) {
        that.isOpenQuickTrade = !!data.data.data.switch;
        // that.unitPrice = data.data.data.price || 0;
        that.limitNum.min = data.data.data.limitFrom || 0;
        that.limitNum.max = data.data.data.limitTo || 0;
        that.sellLimitNum.min = data.data.data.saleLimitF || 0;
        that.sellLimitNum.max = data.data.data.saleLimitT || 0;
        that.payway = data.data.data.payWay || '';
        that.quickTransTrench.forEach(element => {
          element.isBuySelected = false;
        });
        if (that.payway.trim()) {
          let pay = that.payway.substr(0,1);
          that.quickTransTrench.find(item => {return item.type == pay}).isBuySelected = true;
        }
        that.loading = true;
        if(key1){
          // 单价轮循
          // clearInterval(that.timerN);
          // that.timerN=setInterval(()=>{
          //   that.getAjaxData();
          // },30000);
        }
      })
    },
    getUserUsdt() {
      let that = this;
      that.$axios({
        url: '/user/getUserUsdt',
        method:'get',
        params: {userId: (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId)}
      }).then(function(res) {
        if (res.data.status === 200) {
          that.sell.money = res.data.data.amount;
        } else {
          that.sell.money = 0;
        }
      })
    },
    handleMainClick() {
      this.toast.show = false;
      if (this.toast.flag === 1) {
        this.$loginRoute('/payment');
        return;
      }
      this.$router.push({path: '/home'});
    },
    handleBuyInput() {
      let that = this;
      if (that.buy.selectedType === 'money') {
        if(!/^\d+\.?\d{0,2}$/.test(that.buy.inputValueMoney)) {
          that.buy.inputValueMoney = that.buy.inputValueMoney.substring(0,that.buy.inputValueMoney.length-1);
        } else if (that.buy.inputValueMoney > (parseInt(that.limitNum.max * that.unitPrice*100))/100) {
          that.buy.inputValueMoney = (parseInt(that.limitNum.max * that.unitPrice*100))/100;
        }
      } else {
        if(!/^\d+\.?\d{0,2}$/.test(that.buy.inputValueNum)) {
          that.buy.inputValueNum = that.buy.inputValueNum.substring(0,that.buy.inputValueNum.length-1);
        } else if (that.buy.inputValueNum > that.limitNum.max) {
          that.buy.inputValueNum = that.limitNum.max;
        }
      }
    },
    handleSellInput() {
      let that = this;
      if (that.sell.selectedType === 'money') {
        if(!/^\d+\.?\d{0,2}$/.test(that.sell.inputValueMoney)) {
          that.sell.inputValueMoney = that.sell.inputValueMoney.substring(0,that.sell.inputValueMoney.length-1);
        } else if (that.sell.inputValueMoney > (parseInt(that.sellLimitNum.max * that.unitPrice*100))/100 ) {
          that.sell.inputValueMoney = (parseInt(that.sellLimitNum.max * that.unitPrice*100))/100
        }
      } else {
        if(!/^\d+\.?\d{0,2}$/.test(that.sell.inputValueNum)) {
          that.sell.inputValueNum = that.sell.inputValueNum.substring(0,that.sell.inputValueNum.length-1);
        } else if (that.sell.inputValueNum > that.sellLimitNum.max) {
          that.sell.inputValueNum = that.sellLimitNum.max;
        }
      }
    },
    handleBuyFocus() {
      this.$loginRoute('/quickTrans/buy');
    },
    handleSellFocus() {
      this.$loginRoute('/quickTrans/sell');
    },
    handleBuyBlur() {
      let that = this;
      if (that.buy.selectedType === 'money' && that.buy.inputValueMoney || that.buy.selectedType === 'num' && that.buy.inputValueNum) {
        if (that.buy.selectedType === 'money') {
          if (!(that.buy.inputValueMoney >= (parseInt(that.limitNum.min * that.unitPrice*100))/100 && that.buy.inputValueMoney <= that.limitNum.max * that.unitPrice)) {
            that.$normalToast(that.$t('poptip.quickTrans.inputError1'));
            that.buy.inputValueMoney = '';
            return false;
          }
          return true;
        } else {
          if (!(that.buy.inputValueNum >= that.limitNum.min && that.buy.inputValueNum <= that.limitNum.max)) {
            that.$normalToast(that.$t('poptip.quickTrans.inputError2'));
            that.buy.inputValueNum = '';
            return false;
          }
          return true;
        }
      }
    },
    handleSellBlur() {
      let that = this;
      if (that.sell.selectedType === 'money' && that.sell.inputValueMoney || that.sell.selectedType === 'num' && that.sell.inputValueNum) {
        if (that.sell.selectedType === 'money') {
          if (!(that.sell.inputValueMoney >= (parseInt(that.sellLimitNum.min * that.unitPrice*100))/100 && that.sell.inputValueMoney <= that.sellLimitNum.max * that.unitPrice)) {
            that.$normalToast(that.$t('poptip.quickTrans.inputError1'));
            that.sell.inputValueMoney = '';
            return false;
          }
          if (that.sell.inputValueMoney > that.sell.money * that.unitPrice) {
            that.$normalToast(that.$t('poptip.quickTrans.noMoreMoney'));
            that.sell.inputValueMoney = '';
            return false;
          }
          return true;
        } else {
          if (!(that.sell.inputValueNum >= that.sellLimitNum.min && that.sell.inputValueNum <= that.sellLimitNum.max)) {
            that.$normalToast(that.$t('poptip.quickTrans.inputError2'));
            that.sell.inputValueNum = '';
            return false;
          }
          if (that.sell.inputValueNum > that.sell.money) {
            that.$normalToast(that.$t('poptip.quickTrans.noMoreMoney'));
            that.sell.inputValueNum = '';
            return false;
          }
          return true;
        }
      }
    },
    handleBuy(){
      if(!this.loading) return;
      let that = this,
        opt = null;
      if (!that.isOpenQuickTrade) {
        that.toast.show = true;
        return;
      }
      if (decodeURIComponent(that.$getCookie('userId')) && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId) {
        if (that.buy.selectedType === 'money') {
          if (!that.buy.inputValueMoney) {
            that.$normalToast(that.$t('poptip.quickTrans.enterBuyMoney'));
            return;
          }
          opt = {
            orderType: 1,
            totalMoney: parseFloat(that.buy.inputValueMoney),
            usdtPrice: parseFloat(that.unitPrice),
            userId: (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId)
          };
        } else {
          if (!that.buy.inputValueNum) {
            that.$normalToast(that.$t('poptip.quickTrans.enterBuyNum'));
            return;
          }
          opt = {
            orderType: 1,
            usdtNum: parseFloat(that.buy.inputValueNum),
            usdtPrice: parseFloat(that.unitPrice),
            userId: (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId)
          }
        }
        let selectItem = this.quickTransTrench.find((option) => {return option.isBuySelected});
        if (selectItem) {
          opt.payWay = selectItem.type;
        } else {
          that.$normalToast(that.$t('poptip.quickTrans.choosePayway'));
          return;
        }
        let result = that.handleBuyBlur();
        if (!result) {
          return false;
        }
        that.buy.inputValueNum = '';
        that.buy.inputValueMoney = '';
        that.$axios({
          url: 'version/api/trade/createUsdtOrder',
          data: opt,
          method: 'post'
        }).then(function(res) {
          if (res.data.status === 200) {
            if(res.data.code==="011"){
              that.$normalToast(that.$t('poptip.quickTrans.priceNew'));
              that.timerSert=setTimeout(()=>{
                window.location.reload();
              },2000);
            }
            switch(res.data.code) {
              case '001':
                that.$normalToast(that.$t('poptip.quickTrans.close'));
                break;
              case '002':
                that.$normalToast(that.$t('poptip.quickTrans.creOrderFail'));
                break;
              case '003':
                that.$normalToast(that.$t('poptip.quickTrans.orderNumTooMuch'));
                break;
              case '004':
                that.$normalToast(that.$t('poptip.quickTrans.canUseMoney'));
                break;
              case '005':
                that.$normalToast(that.$t('poptip.quickTrans.orderMatchError'));
                break;
              case '006':
                that.$normalToast(that.$t('poptip.quickTrans.buyOrderTooMuch').replace('个', res.data.msg+'个'));
                break;
              case '007':
                that.$normalToast(that.$t('poptip.quickTrans.sellOrderTooMuch').replace('个', res.data.msg+'个'));
                break;
              case '008':
                that.$normalToast(that.$t('poptip.quickTrans.cancelOrderTooMuch').replace('个', res.data.msg+'个'));
                break;
              case '009':
                that.$normalToast(that.$t('poptip.quickTrans.noMoreMoney'));
                break;
              case '010':
                that.$normalToast(that.$t('poptip.quickTrans.close'));
                break;
            }
            if (res.data.data)
              that.$loginRoute('/orderDetail/'+res.data.data);
          }
        })
      } else {
        that.$loginRoute('/quickTrans/buy');
      }
    },
    handleSell() {
      let that = this,
        opt = null;
      if (!that.isOpenQuickTrade) {
        that.toast.show = true;
        return;
      }
      if (decodeURIComponent(that.$getCookie('userId')) && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId) {
        this.checkRealName();
        if(this.idcardauth !== '1') {
          return;
        }
        if (that.sell.selectedType === 'money') {
          if (!that.sell.inputValueMoney) {
            that.$normalToast(that.$t('poptip.quickTrans.enterSellMoney'));
            return;
          }
          opt = {
            orderType: 2,
            totalMoney: parseFloat(that.sell.inputValueMoney),
            usdtPrice: parseFloat(that.unitPrice),
            userId: (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId)
          };
        } else {
          if (!that.sell.inputValueNum) {
            that.$normalToast(that.$t('poptip.quickTrans.enterSellNum'));
            return;
          }
          opt = {
            orderType: 2,
            usdtNum: parseFloat(that.sell.inputValueNum),
            usdtPrice: parseFloat(that.unitPrice),
            userId: (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId)
          }
        }
        let selectItem = this.quickTransTrench.find((option) => {return option.isSellSelected});
        opt.payWay = "2";
        if (selectItem) {
          opt.payWay = selectItem.type;
        } else {
          that.$normalToast(that.$t('poptip.quickTrans.choosePayway'));
          return;
        }
        let result = that.handleSellBlur();
        if (!result) {
          return false;
        }
        that.sell.inputValueNum = '';
        that.sell.inputValueMoney = '';
        that.$axios({
          url: 'version/api/trade/createUsdtOrder',
          data: opt,
          method: 'post'
        }).then(function(res) {
          if (res.data.status === 200) {
            that.sell.inputValueMoney = '';
            that.sell.inputValueNum = '';
            if(res.data.code==="011"){
              that.$normalToast(that.$t('poptip.quickTrans.priceNew'));
              that.timerSert=setTimeout(()=>{
                window.location.reload();
              },2000)
            }
            switch(res.data.code) {
              case '001':
                that.$normalToast(that.$t('poptip.quickTrans.close'));
                break;
              case '002':
                that.$normalToast(that.$t('poptip.quickTrans.creOrderFail'));
                break;
              case '003':
                that.$normalToast(that.$t('poptip.quickTrans.orderNumTooMuch'));
                break;
              case '004':
                that.$normalToast(that.$t('poptip.quickTrans.canUseMoney'));
                break;
              case '005':
                that.$normalToast(that.$t('poptip.quickTrans.orderMatchError'));
                break;
              case '006':
                that.$normalToast(that.$t('poptip.quickTrans.buyOrderTooMuch').replace('个', res.data.msg+'个'));
                break;
              case '007':
                that.$normalToast(that.$t('poptip.quickTrans.sellOrderTooMuch').replace('个', res.data.msg+'个'));
                break;
              case '008':
                that.$normalToast(that.$t('poptip.quickTrans.cancelOrderTooMuch').replace('个', res.data.msg+'个'));
                break;
              case '009':
                that.$normalToast(that.$t('poptip.quickTrans.noMoreMoney'));
                break;
              case '010':
                that.$normalToast(that.$t('poptip.quickTrans.close'));
                break;
            }
            if (res.data.data)
              that.$loginRoute('/orderDetail/'+res.data.data);
          }
        })
      } else {
        that.$loginRoute('/quickTrans/buy');
      }
    },
    // webSoket 获取单价
    webSocketHandle() {
      let that = this;
      let userId='';
      if(this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId'))).userId){
        userId=this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId'))).userId;
      }else{
        // 随机数生成
        userId=(new Date().getTime())+"";
        for(let i=0;i<4;i++){
          userId=userId+Math.floor(Math.random()*10);
        }
        userId=Number(userId);
      }
      this.ws = new WebSocket(that.$interfaceJavaWss+'/user/websocket/'+userId);
      that.ws.onopen = function() {
        that.ws.send(userId+',price') // 发送爆仓预警消息
        clearInterval(that.wsTimerReload);
        clearInterval(that.wsTimer);
        that.wsTimer=setInterval(() =>{
          that.ws.send('ping') // 发送爆仓预警消息
        }, 30000)
      }
      this.ws.onerror = function(e) {
      }
      this.ws.onclose = function() {
        that.wsTimer && clearInterval(that.wsTimer);
      }
      this.ws.onmessage =(e) => {
        // this.ws.send(userId+',price') // 发送爆仓预警消息
        if(e.data!=="连接成功"){
          this.flagDataWeb=true;
          this.dataWeb=JSON.parse(e.data);
          this.dataHanldChul()
        }
      }
    },
    // 数据处理 webSocket
    dataHanldChul(){
      // 系统数据 购买
      if(this.dataWeb.system_or_last==="1" && this.selectedTab==="buy"){
        this.unitPrice=Number(this.dataWeb.system_sale_price);
        // return;
      }
      // 系统数据 卖出
      if(this.dataWeb.system_or_last==="1" && this.selectedTab==="sell"){
        this.unitPrice=Number(this.dataWeb.system_buy_price);
        // return;
      }
      // 市场数据 购买
      if(this.dataWeb.system_or_last==="2" && this.selectedTab==="buy"){
        this.unitPrice=Number(this.dataWeb.last_sale_price);
        // return;
      }
      // 市场数据 卖出
      if(this.dataWeb.system_or_last==="2" && this.selectedTab==="sell"){
        this.unitPrice=Number(this.dataWeb.last_buy_price);
        // return;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.quick-trans {
  .quick-trans-header {
    position: relative;
    height: 90px;
    line-height: 90px;
    padding: 0 34px;
    background-color: #fff;
    border-bottom: solid 1PX #dcdcdc;
    text-align: left;
    .tab-item {
      display: inline-block;
      padding-right: 50px;
      font-size: 30px;
      padding-bottom: 25px;
      color: #818181;
    }
    .tab-item-selected {
      font-size: 45px;
      color: #202025;
      font-weight: bold;
    }
    .ctc-go{
      color: #818181;
      font-size: 30px;
      a{
        color:#818181;
      }
    }
    & > img {
      position: absolute;
      right: 34px;
      top: 41.5px;
      width: 37px;
      height: 7px;
      vertical-align: middle;
    }
  }
  .quick-trans-all {
    padding-bottom: 100px;
    .quick-trans-item {
      .quick-trans-body {
        padding-bottom: 35px;
        background-color: #fff;
        .quick-trans-type {
          padding: 60px 0;
          height: 31px;
          line-height: 31px;
          font-size: 28px;
          color: #242424;
          box-sizing: content-box;
          .trans-type {
            color: #949494;
            margin-right: 20px;
            margin-left: 20px;
          }
          .select-type {
            color: #3e80ca;
            font-weight: bold;
          }
        }
        .quick-trans-info {
          padding: 15px 32px;
          height: 28px;
          text-align: left;
          overflow: hidden;
          box-sizing: content-box;
          .trans-limit-price {
            display: inline-block;
            height: 28px;
            line-height: 28px;
            font-size: 28px;
            color: #5f5f5f;
            & > span:last-child {
              color: #3e80ca;
            }
          }
          .trans-limit-num {
            display: inline-block;
            float: right;
            height: 23px;
            line-height: 30px;
            font-size: 22px;
            color: #929292;
          }
        }
        .quick-trans-input {
          margin: 35px 28px;
          padding: 0 32px;
          height: 103px;
          line-height: 103px;
          border: solid 1px #e5e5e5;
          text-align: left;
          overflow: hidden;
          font-size: 28px;
          & > input {
            width: 500px;
            height: 36px;
            line-height: 36px;
            color: #aaa;
            outline: none;
            border: none;
            font-size: 28px;
          }
          & > span {
            float: right;
            color: #575757;
          }
        }
        .quick-trans-trench {
          padding: 0 32px;
          text-align: left;
          height: 94px;
          .trench-item {
            display: inline-block;
            margin-right: 23px;
            width: 93px;
            height: 94px;
            line-height: 88px;
            border-radius: 10px;
            border: solid 1PX #a0a0a0;
            text-align: center;
            & > img {
              width: 60px;
              height: 60px;
              vertical-align: middle;
            }
          }
          .trench-item-select {
            position: relative;
            border: solid 2px #3e80ca;
          }
          .trench-item-select:before {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            width: 38px;
            height: 30px;
            background-image: url('../../assets/img/quickTrans/quickTransSelect.png');
            background-size: 38px 30px;
          }
          .quick-trans-money {
            display: inline-block;
            float: right;
            padding-top: 22px;
            height: 94px;
            font-size: 28px;
            & > span {
              display: inline-block;
              height: 28px;
              line-height: 28px;
              color: #3f3f3f;
            }
            & > p {
              margin-top: 12px;
              height: 28px;
              line-height: 28px;
              color: #3e80ca;
              text-align: right;
              & > span {
                color: #3f3f3f;
              }
            }
          }
        }
      }
      .quick-trans-result {
        margin: 24px 0 38px;
        padding: 39px 32px 48px;
        background-color: #fff;
        text-align: left;
        .result-turnover {
          margin-bottom: 66px;
          height: 28px;
          line-height: 28px;
          font-size: 28px;
          color: #5f5f5f;
          & > span:last-child {
            float: right;
            color: #242424;
          }
        }
        .result-GMV {
          height: 28px;
          line-height: 28px;
          font-size: 28px;
          color: #5f5f5f;
          & > span:last-child {
            float: right;
            color: #3e80ca;
          }
        }
      }
      .quick-trans-footer {
        padding: 0 32px;
        .quick-buy-btn {
          margin-bottom: 45px;
          height: 89px;
          line-height: 89px;
          border-radius: 10px;
          background-color: #3e80ca;
          font-size: 34px;
          color: #fff;
        }
        .quick-buy-poptip {
          height: 24px;
          line-height: 24px;
          font-size: 24px;
          color: #929292;
          text-align: left;
          margin-bottom: 25px;
        }
      }
    }
  }
  .more-shade {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(98, 98, 98, 0.3);
    z-index: 1000;
    .more-content {
      position: absolute;
      right: 71px;
      top: 47.5px;
      padding: 0 20px;
      width: auto;
      height: 249px;
      border-radius: 5px;
      background-color: #fff;
      .more-item {
        padding: 0 14px;
        height: 123px;
        line-height: 123px;
        border-bottom: solid 1PX #ebebeb;
        font-size: 34px;
        color: #949ba5;
        & > img {
          width: 39px;
          height: 41px;
          vertical-align: middle;
        }
        & > span {
          margin-left: 34px;
        }
      }
      .more-item:last-child {
        border: none;
      }
    }
  }
}
.p-Sele-Add{
  text-align: left;
  margin-left: 32px;
  font-size: 22px;
  color: #929292;
  margin-bottom: 20px;
}
</style>
