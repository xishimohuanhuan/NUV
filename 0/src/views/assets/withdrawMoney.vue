<template>
  <div class="recharge">
    <div class="common-header">
      <img src="../../assets/img/common/previous_page.png" alt="" @click="handleBack"/>
      <img class="recharge-img" src="../../assets/img/assets/records.png" alt="" @click="handleGo"/>
    </div>
    <div class="recharge-header">
      <span v-text="$t('assets.withdrawMoney.title')"></span>
    </div>
    <div class="recharge-curr">
      <div @click="handleCoin" class="recharge-curr-it">
        <span v-text="curr" class="can-choose"></span>
      </div>
      <div class="recharge-curr-it">
        <p v-text="$t('assets.withdrawMoney.canUse')"></p>
        <p v-text="canUseMoney || '0'"></p>
      </div>
    </div>
    <div class="withdraw-money-info">
      <div class="out-address">
        <span v-text="$t('assets.withdrawMoney.outAddress')"></span>
        <input :placeholder="$t('assets.withdrawMoney.outAddressPop')" @input="handleNot($event)" @compositionstart="handleComStart" @compositionend="handleComEnd" v-model="address"/>
        <!-- :style="{visibility: (!$clientEnv.isNativeiOS && !$clientEnv.isNativeAndroid)? 'hidden' : 'visible'}"  -->
        <img @click="handleScanning" :style="{visibility: (!$clientEnv.isNativeiOS && !$clientEnv.isNativeAndroid)? 'hidden' : 'visible'}" src="../../assets/img/assets/scanning.png" alt/>
        <img @click="handleWallet" src="../../assets/img/assets/walletAddress.png" alt/>
      </div>
      <div v-show="curr === 'EOS' || curr === 'XRP'" class="out-address">
        <span v-text="$t('assets.withdrawMoney.outAddressRemark')"></span>
        <input :placeholder="$t('assets.withdrawMoney.outAddressRemarkPop')" v-model="MEMOAddress"/>
      </div>
      <div class="out-address">
        <span v-text="$t('assets.withdrawMoney.outNum')"></span>
        <input @input="handleVerify" :placeholder="$t('assets.withdrawMoney.outNumPop')" v-model="num" type="number"/>
        <span @click="handleAllOut" v-text="$t('assets.withdrawMoney.outAll')"></span>
      </div>
      <div class="out-address">
        <span v-text="$t('assets.withdrawMoney.serviceCharge')"></span>
        <input v-model="serviceCharge" readonly/>
      </div>
    </div>
    <p class="out-poptip" v-show="range.from" v-text="$t('assets.withdrawMoney.chargeRange')+': '+range.from+' ~ '+range.to+' '+curr"></p>
    <div class="recharge-poptip">
      <div class="recharge-poptip-item" v-text="$t('assets.withdrawMoney.poptip.title')"></div>
      <div class="recharge-poptip-item">
        <span>*</span>
        <span>{{$t('assets.withdrawMoney.poptip.second')}}</span>
      </div>
      <div class="recharge-poptip-item">
        <span>*</span>
        <span>{{$t('assets.withdrawMoney.poptip.third')}}</span>
      </div>
    </div>
    <div class="out-footer">
      <div class="out-info">
        <span v-text="$t('assets.withdrawMoney.received')"></span>
        <span v-text="(Number(receivedMoney).toFixed(8)) +' '+curr"></span>
      </div>
      <div @click="handleOut" :class="['out-submit',{'active-out-submit': num && address && (((curr === 'EOS' || curr === 'XRP') && MEMOAddress) || (curr !== 'EOS' && curr !== 'XRP'))}]" v-text="$t('assets.withdrawMoney.submit')"></div>
    </div>
    <div class="safe-veirfy-shade" v-show="showSafeVeirfy">
      <div class="safe-veirfy">
        <div class="safe-verify-h">
          <span v-text="$t('assets.safeVeirfy.title')"></span>
          <img @click="showSafeVeirfy=false" src="../../assets/img/assets/close.png" alt/>
        </div>
        <div class="safe-verify-item">
          <span v-text="phoneNumber"></span>
          <input :placeholder="sendType === 1 ? $t('assets.safeVeirfy.SMSHint') : $t('assets.safeVeirfy.SMSHintEmail')" v-model="SMSCode" type="number"/>
          <span @click="handleSendCode" v-text="interval ? countDown + 'S' : $t('assets.safeVeirfy.send')"></span>
        </div>
        <div class="safe-verify-item">
          <span v-text="$t('assets.safeVeirfy.password')"></span>
          <input type="password" :placeholder="$t('assets.safeVeirfy.passwordPoptip')" v-model="password"/>
        </div>
        <div @click="handleEnterOut" :class="['safe-verify-enter', {'active-safe-verify-enter': password && SMSCode}]" v-text="$t('assets.safeVeirfy.enter')"></div>
      </div>
    </div>
    <toast :isShow="toast.show" :showToastType="toast.type" :toastContent="$t(toast.content)" :toastTitle="$t(toast.title)" :toastOperateTitle="$t(toast.confirm)" :toastAssistOperateTitle="$t(toast.assist)" @handle-main-click="mainClick" @handle-assist-click="assistClick"/>
  </div>
</template>

<script>
import toast from '../../component/toast';
export default {
  components: {
    toast
  },
  data() {
    let that = this;
    return {
      curr: '',
      type: 'normal',
      canUseMoney: 0,
      address: '',
      MEMOAddress: '',
      num: '',
      serviceCharge: '',
      range: {
        from: '',
        to: ''
      },
      phoneNumber: (function() {let res = (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).phone);return res.substr(0,2)+'***'+res.substr(8,3)})(),
      sendType: 1, // 短信验证码类型  1 => 手机  2 => 邮箱
      SMSCode: '',
      password: '',
      showSafeVeirfy: false,
      interval: null,
      countDown: 60,
      realNameAuth: 0,
      toast: {
        show: false,
        type: 'operate',
        content: '',
        title: '',
        confirm: '',
        assist: '',
        method: 0
      },
      startInput: false
    }
  },
  computed: {
    receivedMoney() {
      let that = this;
      return that.num - that.serviceCharge > 0 ? (that.num - that.serviceCharge) : 0;
    },
    loading() {
      return this.$store.state.loading
    }
  },
  filters: {
    NumToFixed(val, curr){
      return (parseFloat(val).toFixed(8))+' '+curr
    }
  },
  created() {
    let phone = this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId'))).phone;
    let execute = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    this.sendType = execute.test(phone) ? 2 : 1;
  },
  beforeRouteEnter (to, from, next) {
    // ...
    next(vm => {
      let key = vm.$route.params.key,
        address = vm.$route.query.address;
      if (key && (vm.$getCookie('userId') && JSON.parse(decodeURIComponent(vm.$getCookie('userId'))).userId)) {
        vm.curr = key;
        vm.address = address;
        vm.realNameAuthentication();
        vm.getCanUseInfo();
        vm.$store.commit('changeNoMenu', false);
      } else
        vm.$loginRoute('./home');
    })
  },
  beforeRouteLeave (to, from, next) {
    // ...
    this.$store.commit('changeNoMenu', true);
    this.$store.commit('changeLoading', false);
    next();
  },
  methods: {
    handleNot() {
      let that = this;
      if (!that.startInput)
        that.address = that.address.replace(/\s/g, '');
    },
    handleComStart() {
      let that = this;
      that.startInput = true;
    },
    handleComEnd() {
      let that = this;
      that.startInput = false; 
    },
    mainClick() {
      let that = this;
      that.toast.show = false;
      if (that.toast.method == 2) {
        that.$loginRoute('/setting/realname');
      }
    },
    assistClick() {
      let that = this;
      that.toast.show = false;
    },
    realNameAuthentication() {
      let that = this;
      that.$axios({
        url: '/user/realAuthInfo',
        method: 'post',
        data: {id: (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId)}
      }).then(function(data) {
        if (data.status == 200) {
          that.realNameAuth = data.data.data.idcardauth;
        }
      })
    },
    handleEnterOut() {
      if(this.loading) return; // 防抖
      let that = this,
        formData = new FormData();
      if (that.SMSCode && that.password) {
        that.$store.commit('changeLoading', true);
        formData.append('coin', that.curr.toLowerCase());
        formData.append('addr', that.address);
        formData.append('num', that.num);
        formData.append('verify', that.SMSCode);
        formData.append('mobile_verify', that.SMSCode);
        formData.append('pwd', that.password);
        formData.append('sessid', sessionStorage.getItem('sessionId'));
        formData.append('userId', (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId));
        formData.append('token', (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).token));
        if(that.MEMOAddress) {
          formData.append('comment', that.MEMOAddress);
        }
        that.$axios({
          baseURL: that.$interfacePhpUrl,
          url: '/finance/up_out?lang=zh-cn',
          method: 'post',
          data: formData,
          withCredentials: false
        }).then(function(data) {
          that.$store.commit('changeLoading', false);
          if(data.status == 200) {
            that.$normalToast(data.data.message, 1000);
            if(data.data.code === 0){

            }else {
              that.showSafeVeirfy = false;
              that.SMSCode = '';
              that.password = '';
              that.$loginRoute(`/assets/outRecord/${that.curr}`);
            }
            
          }
        }).then(err => {
          that.$store.commit('changeLoading', false);
        })
      }
    },
    handleSendCode() {
      let that = this;
      if(that.loading) return; // 防抖
      if (!that.interval && that.num && that.address) {
        that.$store.commit('changeLoading', true);
        that.$axios({
          baseURL: that.$interfacePhpUrl,
          url: '/Verify/myzc',
          method: 'get',
          params: {
            coin: that.curr.toLowerCase(),
            sessid: sessionStorage.getItem('sessionId'),
            userId: (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId),
            token:(that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).token),
            type: that.sendType,
          },
          withCredentials: false
        }).then(function(data) {
          that.$store.commit('changeLoading', false);
          if(data.status == 200) {
            if (data.data.code != 1) {
              that.$normalToast(data.data.message, 1000);
              return;
            }
            that.interval = setInterval(function() {
              if (that.countDown > 0)
                that.countDown--
              else {
                clearInterval(that.interval);
                that.interval = null;
                that.countDown = 60;
              }
            }, 1000)
          }
        }).catch(() => {
          that.$store.commit('changeLoading', false);
        })
      }
    },
    handleOut() {
      this.handleVerifyOut()
      let that = this;
      if (that.num && that.address && (((that.curr === 'EOS' || that.curr === 'XRP') && that.MEMOAddress) || (that.curr !== 'EOS' && that.curr !== 'XRP'))) {
        switch(that.realNameAuth) {
          case 3:
            that.toast.show = true;
            that.toast.content = 'assets.realNameAuth.inAudit';
            that.toast.title = 'assets.realNameAuth.title';
            that.toast.confirm = 'assets.realNameAuth.iKnow';
            that.toast.method = 1;
          break;
          case 2:
            that.toast.show = true;
            that.toast.content = 'assets.realNameAuth.uncertified';
            that.toast.title = 'assets.realNameAuth.title';
            that.toast.confirm = 'assets.realNameAuth.deCertification';
            that.toast.assist = 'assets.realNameAuth.cancel';
            that.toast.method = 2;
          break;
          case 0:
            that.toast.show = true;
            that.toast.content = 'assets.realNameAuth.reCertification';
            that.toast.title = 'assets.realNameAuth.title';
            that.toast.confirm = 'assets.realNameAuth.deCertification';
            that.toast.assist = 'assets.realNameAuth.cancel';
            that.toast.method = 2;
          break;
        }
        if (that.realNameAuth != 1) {
          return;
        }
        that.showSafeVeirfy = true
      }
    },
    handleVerify() {
      let that = this,
      res = Number(that.canUseMoney) > Number(that.range.to) ? Number(that.range.to) : Number(that.canUseMoney);
      if (Number(that.num) > res) {
        that.num = res;
      }
    },
    handleVerifyOut() {
      let that = this;
      if (that.num && Number(that.num) < that.range.from) {
        that.num = '';
        that.$normalToast(that.$t('assets.withdrawMoney.outMoneyTooSmall'), 1000)
      }
    },
    handleGo() {
      let that = this;
      that.$loginRoute(`/assets/outRecord/${that.curr}`);
    },
    handleCoin() {
      let that = this;
      that.$loginRoute(`/assets/searchCurr/withdrawMoney/${that.curr}`);
    },
    handleBack() {
      let that = this;
      that.$loginRoute('/assets');
    },
    getCanUseInfo() {
      let that = this;
      that.$axios({
        baseURL: that.$interfacePhpUrl,
        url: '/finance/out_address',
        method: 'get',
        params: {
          coin: that.curr.toLowerCase(),
          userId: (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId),
          token:(that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).token)
        },
        withCredentials: false
      }).then(function(data) {
        if(data.status == 200) {
          that.canUseMoney = that.toNonExponential(parseFloat(data.data.data.avail));
          that.serviceCharge = parseFloat(data.data.data.fee);
          that.range.from = parseFloat(data.data.data.min_num);
          that.range.to = parseFloat(data.data.data.max_num);
        }
      })
    },
    handleWallet() {
      let that = this;
      that.$loginRoute(`/assets/addressList/${that.curr}`);
    },
    handleAllOut() {
      let that = this;
      that.num = that.canUseMoney > that.range.to ? that.range.to : that.canUseMoney;
    },
    handleScanning() {
      let that = this;
      if (that.$clientEnv.isNativeiOS) {
        that.$bridge.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler('scanQRCode', {url: that.$interfaceJavaUrl+'/user/finance/qrCode?address='+that.address}, function(res) {
            that.address = res;
          });
        });
      } else if (that.$clientEnv.isNativeAndroid) {
        let result = prompt("cg://web/scanQRCode?" + JSON.stringify({url: that.$interfaceJavaUrl+'/user/finance/qrCode?address='+that.address}),"");
        that.address = result;
      }
    },
    /**
     * 将科学计数法转换为小数
     * @param {*} num 
     */
    toNonExponential(num) {
      num = parseFloat(parseFloat(num).toFixed(8));
      var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
      if(!m) return num;
      return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
    }
  }
}
</script>

<style lang="scss" scoped>
.recharge {
  background-color: #f8f8f8;
  position: relative;
  .recharge-header {
    padding: 120px 22px 40px;
    text-align: left;
    color: #202025;
    font-size: 45px;
    line-height: 45px;
    font-weight: bold;
    background-color: #fff;
    border-bottom: solid 1px #dcdcdc;
  }
  .recharge-curr {
    display: flex;
    align-items: center;
    padding: 25px;
    background-color: #fff;
    text-align: left;
    font-size: 34px;
    color: #3e80ca;
    .recharge-curr-it {
      flex-grow: 1;
      .can-choose {
        position: relative;
      }
      .can-choose:after {
        content: "";
        position: absolute;
        top: 18px;
        right: -30px;
        width: 0;
        height: 0;
        border: solid 10px transparent;
        border-top-color: #545454;
      }
    }
    .recharge-curr-it:nth-child(2) {
      text-align: right;
      & > p:nth-child(1) {
        font-size: 22px;
        line-height: 22px;
        color: #cacaca;
        margin-bottom: 30px;
      }
      & > p:nth-child(2) {
        font-size: 28px;
        line-height: 28px;
      }
    }
  }
  .withdraw-money-info {
    padding: 0 16px;
    background-color: #fff;
    .out-address {
      display: flex;
      align-items: center;
      height: 97px;
      line-height: 97px;
      border-top: solid 1px #dcdcdc;
      text-align: left;
      & > span:nth-child(1) {
        margin-left: 5px;
        display: inline-block;
        width: 190px;
        font-size: 28px;
        color: #575757;
        vertical-align: middle;
      }
      & > span:nth-child(3) {
        padding-right: 5px;
        display: inline-block;
        width: 140px;
        font-size: 24px;
        color: #3e80ca;
        vertical-align: middle;
        text-align: right;
      }
      & > input {
        flex-grow: 1;
        border: none;
        font-size: 24px;
        color: #aaa;
        vertical-align: middle;
      }
      & > input:focus {
        outline: none;
      }
      & > img:nth-child(3) {
        margin-left: 20px;
        width: 47px;
        height: 43px;
        vertical-align: middle;
      }
      & > img:nth-child(4) {
        margin-left: 40px;
        width: 46px;
        height: 45px;
        vertical-align: middle;
      }
    }
  }
  .out-poptip {
    padding: 15px 24px;
    height: 24px;
    line-height: 24px;
    font-size: 24px;
    color: #aaa;
    text-align: left;
  }
  .out-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 190px;
    .out-info {
      display: flex;
      align-items: center;
      padding: 0 26px;
      height: 90px;
      background-color: #fff;
      & > span {
        flex-grow: 1;
        text-align: left;
        font-size: 28px;
        color: #575757;
      }
      & > span:nth-child(2) {
        text-align: right;
        color: #101010;
        font-weight: bold;
      }
    }
    .out-submit {
      height: 100px;
      line-height: 100px;
      font-size: 34px;
      color: #fff;
      background-color: #bfbfbf;
    }
    .active-out-submit {
      background-color: #3e80ca;
    }
  }
  .recharge-poptip {
    padding: 50px 40px;
    text-align: left;
    background-color: #f8f8f8;
    .recharge-poptip-item {
      line-height: 60px;
      font-size: 24px;
      & > span {
        color: red;
      }
      & > span:nth-child(2) {
        color: #525252;
      }
    }
    .recharge-poptip-item:nth-child(3) {
      height: 120px;
      line-height: 60px;
      white-space: pre-wrap;
    }
  }
  .safe-veirfy-shade {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(67, 67, 67, 0.6);
    z-index: 1200;
    .safe-veirfy {
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 0 15px;
      width: 100%;
      height: 580px;
      background-color: #fff;
      .safe-verify-h {
        display: flex;
        padding: 79px 25px 32px;
        border-bottom: solid 1px #dcdcdc;
        & > span {
          flex-grow: 1;
          height: 50px;
          line-height: 50px;
          color: #262626;
          font-size: 50px;
          vertical-align: middle;
          text-align: left;
        }
        & > img {
          width: 31px;
          height: 31px;
          vertical-align: middle;
        }
      }
      .safe-verify-item {
        height: 120px;
        line-height: 120px;
        border-bottom: solid 1px #dcdcdc;
        text-align: left;
        & > span:nth-child(1) {
          display: inline-block;
          margin-left: 30px;
          width: 170px;
          font-size: 28px;
          color: #575757;
        }
        & > span:nth-child(3) {
          display: inline-block;
          width: 60px;
          font-size: 24px;
          color: #3e80ca;
        }
        & > input {
          width: 440px;
          font-size: 24px;
          color: #aaa;
          border: none;
        }
        & > input:focus {
          outline: none;
        }
      }
      .safe-verify-enter {
        margin: 50px 70px 0;
        width: 580px;
        height: 90px;
        line-height: 90px;
        background-color: #bfbfbf;
        border-radius: 10px;
        font-size: 34px;
        color: #fff;
      }
      .active-safe-verify-enter {
        background-color: #3e80ca;
      }
    }
  }
}
</style>
