<template>
  <div class="payment">
    <headers @back="goBack"/>
    <div class="payment-title" v-text="$t('payment.title')"></div>
    <div class="payment-item">
      <div class="payment-item-way" @click="handleBinding('bank', bank.activated, bank)">
        <div class="payment-item-left">
          <img src="../../assets/img/payment/bank.png" alt=""/>
          <span v-text="$t('payment.bank.name')"></span>
        </div>
        <div class="payment-item-right">
          <span :style="{color: bank.activated ? '#3e80ca' : '#d87675'}" v-text="bank.activated ? $t('payment.activated') : $t('payment.notBound')"></span>
          <img src="../../assets/img/payment/turnRight.png" alt=""/>
        </div>
      </div>
      <div v-show="bank.activated" class="payment-item-info">
        <p v-text="bank.name"></p>
        <p v-text="bank.account"></p>
      </div>
    </div>
    <div class="payment-item">
      <div class="payment-item-way" @click="handleBinding('alipay', alipay.activated, alipay)">
        <div class="payment-item-left">
          <img src="../../assets/img/payment/alipay.png" alt=""/>
          <span v-text="$t('payment.alipay.name')"></span>
        </div>
        <div class="payment-item-right">
          <span :style="{color: alipay.activated ? '#3e80ca' : '#d87675'}" v-text="alipay.activated ? $t('payment.activated') : $t('payment.notBound')"></span>
          <img src="../../assets/img/payment/turnRight.png" alt=""/>
        </div>
      </div>
      <div v-show="alipay.activated" class="payment-item-info">
        <p v-text="alipay.name"></p>
        <p v-text="alipay.account"></p>
      </div>
    </div>
    <div class="payment-item">
      <div class="payment-item-way" @click="handleBinding('wechat', wechat.activated, wechat)">
        <div class="payment-item-left">
          <img src="../../assets/img/payment/wechat.png" alt=""/>
          <span v-text="$t('payment.wechat.name')"></span>
        </div>
        <div class="payment-item-right">
          <span :style="{color: wechat.activated ? '#3e80ca' : '#d87675'}" v-text="wechat.activated ? $t('payment.activated') : $t('payment.notBound')"></span>
          <img src="../../assets/img/payment/turnRight.png" alt=""/>
        </div>
      </div>
      <div v-show="wechat.activated" class="payment-item-info">
        <p v-text="wechat.name"></p>
        <p v-text="wechat.account"></p>
      </div>
    </div>
  </div>
</template>

<script>
import headers from '../../component/header';
export default {
  components: {
    headers
  },
  data() {
    return {
      bank: {
        account: '',
        name: '',
        addr: '',
        activated: false,
        img: ''
      },
      alipay: {
        account: '',
        name: '',
        activated: false,
        img: ''
      },
      wechat: {
        account: '',
        name: '',
        activated: false,
        img: ''
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    // ...
    next(vm => {
      if (JSON.parse(decodeURIComponent(vm.$getCookie('userId'))).userId) {
        vm.getUserPaymentWayList();
        vm.$store.commit('changeNoMenu', false);
      } else {
        vm.$loginRoute('./payment');
      }
    })
  },
  beforeRouteLeave (to, from, next) {
    // ...
    this.$store.commit('changeNoMenu', true);
    next();
  },
  methods: {
    goBack() {
      this.$router.push({path: '/quickTrans/buy'});
    },
    handleBinding(key, bool, obj) {
      this.$router.push({path: `/binding/${key}`, query: {isBinding: bool, obj: JSON.stringify(obj)}});
    },
    getUserPaymentWayList() {
      let that = this;
      that.$axios({
        url: '/user/getUserBankList?userId=' + JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId,
        method: 'get'
      }).then(function(res) {
        let data = res.data;
        if (data.status === 200) {
          that.bank = {
            account: '',
            name: '',
            addr: '',
            activated: false,
            img: ''
          };
          that.alipay = {
            account: '',
            name: '',
            activated: false,
            img: ''
          };
          that.wechat = {
            account: '',
            name: '',
            activated: false,
            img: ''
          };
          for (let item of data.data) {
            switch(item.type) {
              case 1:
                that.bank.activated = true;
                that.bank.name = item.name;
                that.bank.account = item.bankcard;
                that.bank.img = item.img;
                that.bank.addr = item.bankaddr;
                that.bank.id = item.id;
                break;
              case 2:
                that.alipay.activated = true;
                that.alipay.name = item.name;
                that.alipay.account = item.bankcard;
                that.alipay.img = item.img;
                that.alipay.id = item.id;
                break;
              case 3:
                that.wechat.activated = true;
                that.wechat.name = item.name;
                that.wechat.account = item.bankcard;
                that.wechat.img = item.img;
                that.wechat.id = item.id;
                break;
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.payment {
  .payment-title {
    padding: 50px 25px 35px;
    height: 45px;
    line-height: 45px;
    font-size: 45px;
    font-weight: boldl;
    color: #202025;
    background-color: #fff;
    box-sizing: content-box;
    text-align: left;
  }
  .payment-item {
    margin-top: 27px;
    text-align: left;
    overflow: hidden;
    background-color: #fff;
    .payment-item-way {
    padding: 0 30px;
      height: 113px;
      line-height: 113px;
      .payment-item-left {
        display: inline-block;
        font-size: 28px;
        color: #464646;
        & > img {
          margin-right: 46px;
          width: 62px;
          height: 62px;
          vertical-align: middle;
        }
      }
      .payment-item-right {
        display: inline-block;
        float: right;
        color: #d87675;
        font-size: 28px;
        & > img {
          margin-left: 47px;
          width: 19px;
          height: 33px;
          vertical-align: middle;
        }
      }
    }
    .payment-item-info {
      margin: 0 16px;
      padding: 0 11px 30px;
      border-top: solid 1PX #dcdcdc;
      & > p {
        margin-top: 36px;
        height: 28px;
        line-height: 28px;
        font-size: 28px;
        color: #858585;
      }
      & > p:last-child {
        height: 34px;
        line-height: 34px;
        font-size: 34px;
        color: #464646;
      }
    }
  }
}
</style>
