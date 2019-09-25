<template>
  <div class="recharge">
    <div class="common-header">
      <img src="../../assets/img/common/previous_page.png" alt="" @click="handleBack"/>
      <img class="recharge-img" src="../../assets/img/assets/records.png" alt="" @click="handleRec"/>
    </div>
    <div class="recharge-header">
      <span v-text="$t('assets.recharge.title')"></span>
    </div>
    <div class="recharge-curr">
      <div class="recharge-curr-it" @click="handleCoin">
        <span v-text="curr" class="can-choose"></span>
      </div>
      <div class="recharge-curr-it">
        <p v-text="$t('assets.recharge.canUse')"></p>
        <p v-text="canUseMoney || '--'"></p>
      </div>
    </div>
    <div v-show="address" class="address-info">
      <div class="address-info-item">
        <p v-text="$t('assets.recharge.intoAddress')"></p>
        <div class="address-info">
          <span ref="address" class="copy-text" v-text="address"></span>
          <span></span>
          <div class="copy-button" v-text="$t('assets.recharge.copy')" @click="handleCopy(address)"></div>
        </div>
      </div>
      <div v-show="MEMOAddress" class="address-info-item">
        <p v-text="$t('assets.recharge.MEMOAddress')"></p>
        <div class="address-info">
          <span ref="address" v-text="MEMOAddress"></span>
          <div class="copy-button" v-text="$t('assets.recharge.copy')" @click="handleCopy(MEMOAddress)"></div>
        </div>
      </div>
      <div v-show="address" class="save-QR-code">
        <!-- <div class="QR-img" id="qrcode" ref="qrcode"></div> -->
        <img ref="QR-img" class="QR-img" v-show="address" alt/>
        <br/>
        <div @click="handleSave" class="save-button" v-text="$t('assets.recharge.save')"></div>
      </div>
    </div>
    <div class="recharge-poptip">
      <div class="recharge-poptip-item" v-text="$t('assets.recharge.poptip.title')">

      </div>
      <div v-if="coinData=== 'USDT'" class="recharge-poptip-item">
        <span>*</span>
        <div class="newspan">{{$t('assetZhEn.coinMethod')}}</div>
      </div>
      <div class="recharge-poptip-item">
        <!-- <div class="rech-span"> -->
          <span>*</span>
          <div class="newspan eos-box" v-if='coinData==="EOS"'>
            {{$t('assetZhEn.coinMethod1')}} 
            <span @touchstart.stop="memoTitleShow=!memoTitleShow" class="memo">memo。</span>
            <div @touchstart.stop v-show="memoTitleShow" class="memo-title">
              {{$t('assetZhEn.coinMethod2')}}
            </div>
          </div>
          <div class="newspan" v-else>{{($t('assets.recharge.poptip.first')+coinData+$t('assets.recharge.poptip.first1'))}}</div>
        <!-- </div> -->
      </div>
      
      <div class="recharge-poptip-item">
        <span>*</span>
        <div class="newspan">
          {{coinData==="EOS"? $t('assetZhEn.coinMethod3'):$t('assets.recharge.poptip.second')}}
        </div>
      </div>
      <div class="recharge-poptip-item">
        <span>*</span>
        <div class="newspan">
          {{coinData==="EOS"? $t('assetZhEn.coinMethod4'):($t('assets.recharge.poptip.third1')+ coinData + $t('assets.recharge.poptip.third12'))}}
        </div>
      </div>
      <!-- <div class="recharge-poptip-item" v-if='coinData==="EOS"'>
        <span></span>
        <span style="margin-left:10px;">非EOS资产将不可找回。</span>
      </div> -->
      <div class="recharge-poptip-item">
        <span>*</span>
        <div class="newspan">{{coinData==="EOS"? $t('assetZhEn.coinMethod5'):$t('assets.recharge.poptip.fouth')}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      curr: '',
      type: 'normal',
      canUseMoney: 0,
      address: '',
      MEMOAddress: '',
      base64: '',
      memoTitleShow: false,
      coinData:"---"
    }
  },
  mounted() {
    document.addEventListener('touchstart',this.closememoTitle)
  },
  beforeDestroy() {
    document.removeEventListener('touchstart',this.closememoTitle)
  },
  beforeRouteEnter (to, from, next) {
    // ...
    next(vm => {
      let key = vm.$route.params.key;
      vm.coinData=key;
      if (key && (vm.$getCookie('userId') && JSON.parse(decodeURIComponent(vm.$getCookie('userId'))).userId)) {
        vm.curr = key;
        vm.getCoinInfo();
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
    closememoTitle (e) {
      this.memoTitleShow = false;
    },
    handleCopy(value) {
      let that = this;
      if (that.$clientEnv.ios) {
        var a = document.createElement('a');
        a.style.position = 'absolute';
        a.style.top = '-9999px';
        a.style.left = '-9999px';
        a.innerText = value;
        document.body.append(a);
        var range = document.createRange();
        range.selectNode(a);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        var msg = document.execCommand('copy') ? that.$t('appDownload.copySuccessful') : that.$t('appDownload.copyUnsuccessful');
        that.$normalToast(msg, 1000);
        document.body.removeChild(a);
      } else {
        var textarea = document.createElement('textarea');
        textarea.style.position = 'absolute';
        textarea.style.top = '-9999px';
        textarea.style.left = '-9999px';
        textarea.readOnly = true;
        textarea.innerText = value;
        document.body.append(textarea);
        textarea.select();
        var msg = document.execCommand('copy') ? that.$t('appDownload.copySuccessful') : that.$t('appDownload.copyUnsuccessful');
        that.$normalToast(msg, 1000);
        document.body.removeChild(textarea);
      }
    },
    handleRec() {
      let that = this;
      that.$loginRoute(`/assets/intoRecord/${that.curr}`);
    },
    handleCoin() {
      let that = this;
      that.$loginRoute(`/assets/searchCurr/recharge/${that.curr}`);
    },
    getCoinInfo() {
      let that = this;
      that.$axios({
        baseURL: that.$interfacePhpUrl,
        url: '/finance/in_address',
        method: 'get',
        params: {
          coin: that.curr.toLowerCase(),
          userId: (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId),
          token:(that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).token)
        },
        withCredentials: false
      }).then(function(data) {
        if(data.status == 200) {
          if (!data.data.data.needTag) {
            that.type = 'normal';
            that.canUseMoney = parseFloat(data.data.data.avail);
            that.address = data.data.data.address;
            that.MEMOAddress = '';
          } else {
            that.type = 'special';
            that.canUseMoney = parseFloat(data.data.data.avail);
            that.address = data.data.data.official;
            that.MEMOAddress = data.data.data.address;
          }
          that.$nextTick(function() {
            let img = new Image();
            img.onload = function(res) {
              let cvs = document.createElement("canvas"),
              ctx = cvs.getContext('2d');
              cvs.width = img.width;
              cvs.height = img.height;
              ctx.drawImage(img, 0, 0, cvs.width, cvs.height);
              that.base64 = cvs.toDataURL('image/jpeg', .9);
            }
            img.setAttribute('crossOrigin', 'anonymous');
            img.src = that.$interfaceJavaUrl+'/user/finance/qrCode?address=' + that.address;
            that.$refs['QR-img'].src = that.$interfaceJavaUrl+'/user/finance/qrCode?address=' + that.address;
          })
        }
      })
    },
    handleBack() {
      let that = this;
      that.$loginRoute('/assets');
    },
    handleSave() {
      let that = this;
      if (that.$clientEnv.isNativeiOS) {
        that.$bridge.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler('downloadImage', {url: that.$interfaceJavaUrl+'/user/finance/qrCode?address='+that.address}, function(res) {
            that.$normalToast(res ? that.$t('assets.recharge.saveSuccess') : that.$t('assets.recharge.saveFail'), 1000);
          });
        });
      } else if (that.$clientEnv.isNativeAndroid) {
        let res = prompt("cg://web/downloadImage?" + JSON.stringify({url: that.$interfaceJavaUrl+'/user/finance/qrCode?address='+that.address}),"");
        that.$normalToast(res == 1 ? that.$t('assets.recharge.saveSuccess') : that.$t('assets.recharge.saveFail'), 1000);
      } else {
        let a = document.createElement('a');
        a.style.display = 'none';
        document.body.appendChild(a);
        a.download = that.address;
        a.href = that.base64;
        a.click();
        document.body.removeChild(a);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.eos-box{
  position: relative;
  .memo{
    color: #3e80ca;
  }
  .memo-title{
    box-sizing: border-box;
    position: absolute ;
    z-index: 1;
    background: #fff;
    border: 1px solid #dcdcdc;
    padding: 24px;
    top: 120%;
    border-radius: 5px;
    &::after{
      border: 12px solid #dcdcdc00;
      border-bottom: 12px solid #dcdcdc;
      position: absolute;
      content: '';
      right: 48px;
      top: -24px;
    }
    &::before{
      border: 12px solid #dcdcdc00;
      border-bottom: 12px solid #ffffff;
      position: absolute;
      content: '';
      right: 48px;
      top: -21px;
      z-index: 1;
    }
  }

}
.recharge {
  background-color: #f8f8f8;
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
  .address-info {
    margin-top: 22px;
    padding: 10px 24px 0;
    background-color: #fff;
    .address-info-item {
      padding: 60px 0 27px;
      border-bottom: solid 1px #dcdcdc;
      & > p {
        margin-bottom: 46px;
        font-size: 34px;
        line-height: 34px;
        font-weight: bold;
        color: #545454;
        text-align: left;
      }
      .address-info {
        display: flex;
        align-items: center;
        text-align: left;
        padding: 0;
        & > span {
          flex-grow: 1;
          font-size: 24px;
        }
        .copy-text{
          display: inline-block;
          width: 489px;
          height: 59px;
          line-height: 59px;
          text-align: left;
          text-overflow :ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        .copy-button {
          width: 136px;
          height: 59px;
          line-height: 59px;
          background-color: #3e80ca;
          border-radius: 5px;
          font-size: 24px;
          color: #fff;
          text-align: center;
        }
      }
    }
    .save-QR-code {
      padding: 54px 0 33px;
      .QR-img {
        display: inline-block;
        width: 319px;
        height: 321px;
      }
      .save-button {
        display: inline-block;
        margin-top: 36px;
        width: 319px;
        height: 59px;
        line-height: 59px;
        background-color: #3e80ca;
        border-radius: 5px;
        color:#fff;
        font-size: 24px;
      }
    }
  }
  .recharge-poptip {
    padding: 50px 40px;
    text-align: left;
    background-color: #f8f8f8;
    .recharge-poptip-item {
      // height: 60px;
      line-height: 36px;
      font-size: 24px;
      padding-bottom: 10px;
      // white-space: nowrap;
      // white-space: pre-wrap;

      display: flex;
      & > span {
        padding-right: 10px;
        color: red;
        position: relative;
        top: 6px;
      }
      & > .newspan {
        // color: #525252;
        display: inline-block;
        color: #979797;
      }
    }
  }
}
</style>
