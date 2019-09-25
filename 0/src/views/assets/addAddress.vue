<template>
  <div class="add-address">
    <headers title="" value="" @back="$goBack"></headers>
    <div class="address-header">
      <span v-text=" $t('assets.address.add0') + name + $t('assets.address.title')"></span>
    </div>
    <div class="address-list">
      <div class="address-item">
        <span v-text="$t('assets.address.walletName')"></span>
        <input :placeholder="$t('assets.address.walletNamePoptip')" v-model="walletName" />
      </div>
      <div class="address-item">
        <span v-text="$t('assets.address.add')"></span>
        <input :placeholder="$t('assets.address.add')" v-model="address" />
        <img 
          @click="handleScanning" 
          :style="{visibility: (!$clientEnv.isNativeiOS && !$clientEnv.isNativeAndroid)? 'hidden' : 'visible'}" 
          src="../../assets/img/assets/scanning.png" alt />
      </div>
    </div>
    <div 
      @click="handleAdd" 
      :class="['address-enter', {'acitve-address-enter': walletName.trim() && address.trim()}]" 
      v-text="$t('assets.address.enter')"></div>
    <div class="address-unbind-shade" v-show="showBind">
      <div class="address-unbind">
        <div class="address-unbind-h">
          <span v-text="$t('assets.address.enterAdd')"></span>
          <img @click="showBind=false" src="../../assets/img/assets/close.png" alt/>
        </div>
        <div class="address-unbind-item">
          <span v-text="$t('assets.safeVeirfy.password')"></span>
          <input type="password" :placeholder="$t('assets.safeVeirfy.passwordPoptip')" v-model="password"/>
        </div>
        <div 
          @click="enterAdd" 
          :class="['address-unbind-enter', {'active-address-unbind-enter': password.trim()}]" 
          v-text="$t('assets.safeVeirfy.enter')"></div>
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
      name: '',
      walletName: '',
      address: '',
      showBind: false,
      password: ''
    }
  },
  beforeRouteEnter (to, from, next) {
    // ...
    next(vm => {
      let key = vm.$route.params.key;
      if (key && (vm.$getCookie('userId') && JSON.parse(decodeURIComponent(vm.$getCookie('userId'))).userId)) {
        vm.name = key;
        vm.$store.commit('changeNoMenu', false);
      } else
        vm.$loginRoute('./home');
    })
  },
  beforeRouteLeave (to, from, next) {
    // ...
    this.$store.commit('changeNoMenu', true);
    next();
  },
  methods: {
    handleAdd() {
      let that = this;
      if (that.walletName.trim() && that.address.trim()) {
        that.showBind = true;
      }
    },
    enterAdd() {
      let that = this;
      if (that.password.trim()) {
        let formData = new FormData();
        formData.append('coin', that.name.toLowerCase());
        formData.append('name', that.walletName);
        formData.append('address', that.address);
        formData.append('pwd', that.password);
        formData.append('userId', (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId));
        formData.append('token', (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).token));
        that.$axios({
          baseURL: that.$interfacePhpUrl,
          url: '/finance/up_wallet',
          method: 'post',
          data: formData,
          withCredentials: false
        }).then(function(data) {
          if(data.status == 200) {
            that.showBind = false;
            if (data.data.code == 1) {
              that.$normalToast(that.$t('assets.address.addSuccess'), 1000);
              setTimeout(function() {
                that.$loginRoute(`/assets/addressList/${that.name}`);
              }, 1000);
            } else {
              that.$normalToast(data.data.message, 1000);
            }
          }
          that.password = '';
        })
      }
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
    }
  }
}
</script>

<style lang="scss" scoped>
.add-address {
  .address-header {
    padding: 50px 22px 40px;
    text-align: left;
    color: #202025;
    font-size: 45px;
    line-height: 45px;
    font-weight: bold;
    background-color: #fff;
    border-bottom: solid 1px #dcdcdc;
  }
  .address-list {
    padding: 0 16px;
    background-color: #fff;
    .address-item {
      display: flex;
      align-items: center;
      height: 97px;
      border-bottom: solid 1px #dcdcdc;
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
        width: 47px;
        height: 43px;
        vertical-align: middle;
      }
    }
  }
  .address-enter {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    line-height: 100px;
    font-size: 34px;
    color: #fff;
    background-color: #bfbfbf;
  }
  .acitve-address-enter {
    background-color: #3e80ca;
  }
  .address-unbind-shade {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(67, 67, 67, 0.6);
    z-index: 1200;
    .address-unbind {
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 0 15px;
      width: 100%;
      height: 450px;
      background-color: #fff;
      .address-unbind-h {
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
      .address-unbind-item {
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
      .address-unbind-enter {
        margin: 50px 70px 0;
        width: 580px;
        height: 90px;
        line-height: 90px;
        background-color: #bfbfbf;
        border-radius: 10px;
        font-size: 34px;
        color: #fff;
      }
      .active-address-unbind-enter {
        background-color: #3e80ca;
      }
    }
  }
}
</style>
