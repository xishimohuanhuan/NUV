<template>
  <div class="binding-payment">
    <headers @back="goBack" :title="headerTitle"/>
    <div v-show="paymentWay !== 'bank'" class="binding-way">
      <div class="binding-item">
        <span v-text="$t(`payment.${paymentWay}.userName`)"></span>
        <input :disabled="isBinding" :placeholder="$t(`payment.${paymentWay}.userNamePoptip`)" v-model="showWay.username"/>
      </div>
      <div class="binding-item">
        <span v-text="$t(`payment.${paymentWay}.account`)"></span>
        <input :disabled="isBinding" :placeholder="$t(`payment.${paymentWay}.accountPoptip`)" v-model="showWay.account"/>
      </div>
    </div>
    <div v-show="paymentWay !== 'bank'" class="binding-way">
      <div class="binding-code">
        <p v-text="$t(`payment.${paymentWay}.gatheringCode`)"></p>
        <div class="upload-code-img">
          <img ref="percent" v-show="!percent" @click="handleUploadImg" :src="!isBinding ? (showWay.showCodeImg || require('../../assets/img/payment/QRCode.png')) : showWay.showCodeImg" alt/>
          <div v-show="percent" class="custom-progress">
            <my-progress :percent="percent"/>
          </div>
          <p v-show="!isBinding" v-text="$t('payment.uploadCodeImg')"></p>
        </div>
      </div>
    </div>
    <p class="bank-more-poptip" v-show="paymentWay === 'bank'" v-text="$t('payment.bank.morePoptip')"></p>
    <div v-show="paymentWay === 'bank'" class="binding-way">
      <div class="binding-item">
        <span v-text="$t(`payment.bank.userName`)"></span>
        <input :disabled="isBinding" :placeholder="$t(`payment.bank.userNamePoptip`)" v-model="showWay.username"/>
      </div>
      <div class="binding-item">
        <span v-text="$t(`payment.bank.cardCode`)"></span>
        <input :disabled="isBinding" :placeholder="$t(`payment.bank.cardCodePoptip`)" v-model="showWay.account" @blur="verifyAccount"/>
      </div>
      <div class="binding-item">
        <span v-text="$t(`payment.bank.bankOfDeposit`)"></span>
        <!-- <input :placeholder="$t(`payment.bank.bankOfDepositPoptip`)" v-model="showWay.openBank"/> -->
        <img v-show="showWay.openBankImg" :src="showWay.openBankImg" alt />
      </div>
      <div class="binding-item">
        <span v-text="$t(`payment.bank.accountOpeningBranch`)"></span>
        <input :disabled="isBinding" :placeholder="$t(`payment.bank.accountOpeningBranchPoptip`)" v-model="showWay.openDetailBank"/>
      </div>
    </div>
    <div class="binding-way">
      <!-- <div class="binding-verify-code">
        <span v-text="$t('payment.verifyCodeName')"></span>
        <input :placeholder="$t('payment.verifyCodePoptip')" v-model="showWay.verifyCode"/>
        <span v-text="$t('payment.sendVerifyCode')"></span>  
      </div> -->
      <div v-show="!isBinding" class="binding-item">
        <span v-text="$t('payment.verifyPassWord')"></span>
        <input :disabled="isBinding" type="password" :placeholder="$t('payment.verifyPassWordPoptip')" v-model="showWay.verifyCode"/>
      </div>
    </div>
    <p class="friendship-poptip" v-text="$t('payment.friendshipPoptip')"></p>
    <div class="binding-footer" v-text="isBinding ? $t('payment.unbundle') : $t('payment.setting')" @click="handleOperate"></div>
    <input v-show="false" accept="image/*" type="file" ref="uploadImg"/>
    <div v-show="showDetailPopup" class="detail-shade">
      <div class="popup-detail">
        <div class="popup-detail-header">
          <span v-text="$t('payment.confirmUnbinding')"></span>
          <img src="../../assets/img/payment/close.png" alt @click="handleClosePopup"/>
        </div>
        <div class="popup-detail-pd">
          <span v-text="$t('orderRecord.detail.dealPassword')"></span>
          <input :placeholder="$t('orderRecord.detail.dealPasswordPoptip')" type="password" v-model="showWay.verifyCode"/>
        </div>
        <div class="confirm" @click="unBinding" v-text="$t('orderRecord.detail.releaseConfirm')"></div>
      </div>
    </div>
    <img :src="imgsrc" alt ref="imgsrc"/>
  </div>
</template>

<script>
import myProgress from '../../component/progress';
import headers from '../../component/header';

export default {
  components: {
    headers,
    myProgress
  },
  inject: ['reload'],
  data() {
    return {
      headerTitle: '',
      paymentWay: '',
      flagClick: false,
      wechat: {
        username: '',
        account: '',
        codeImg: '',
        showCodeImg: '',
        verifyCode: ''
      },
      alipay: {
        username: '',
        account: '',
        codeImg: '',
        showCodeImg: '',
        verifyCode: ''
      },
      bank: {
        username: '',
        account: '',
        openBank: '',
        openBankImg: '',
        openDetailBank: '',
        verifyCode: ''
      },
      showWay: {},
      isBinding: false,
      showDetailPopup: false,
      percent: 0,
      imgsrc: ''
    }
  },
  beforeRouteEnter (to, from, next) {
    // ...
    next(vm => {
      if (decodeURIComponent(vm.$getCookie('userId')) && JSON.parse(decodeURIComponent(vm.$getCookie('userId'))).userId) {
        let way = to.params.way,
          obj = to.query.obj;
        !way && (vm.$loginRoute('./payment'));
        vm.isBinding = to.query.isBinding == true || to.query.isBinding == 'true';
        switch (way) {
          case 'bank':
            vm.headerTitle = vm.$t('poptip.bindingPayment.bankTitle');
            vm.showWay = vm.bank;
            if (vm.isBinding) {
              vm.showWay = {
                id: JSON.parse(obj).id,
                username: JSON.parse(obj).name,
                account: JSON.parse(obj).account,
                openBankImg: vm.$imgJavaUrl + JSON.parse(obj).img,
                openDetailBank: JSON.parse(obj).addr,
                verifyCode: ''
              }
            }
            break;
          case 'wechat':
            vm.headerTitle = vm.$t('poptip.bindingPayment.wechatTitle');
            vm.showWay = vm.wechat;
            if (vm.isBinding) {
              vm.showWay = {
                id: JSON.parse(obj).id,
                username: JSON.parse(obj).name,
                account: JSON.parse(obj).account,
                codeImg: JSON.parse(obj).img,
                showCodeImg: vm.$imgJavaUrl + JSON.parse(obj).img,
                verifyCode: ''
              }
            }
            break;
          case 'alipay':
            vm.headerTitle = vm.$t('poptip.bindingPayment.alipayTitle');
            vm.showWay = vm.alipay;
            if (vm.isBinding) {
              vm.showWay = {
                id: JSON.parse(obj).id,
                username: JSON.parse(obj).name,
                account: JSON.parse(obj).account,
                codeImg: JSON.parse(obj).img,
                showCodeImg: vm.$imgJavaUrl + JSON.parse(obj).img,
                verifyCode: ''
              }
            }
            break;
        }
        vm.paymentWay = way;
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
      this.$router.push({path: '/payment'});
    },
    verifyAccount() {
      let that = this;
      if (that.showWay.account.trim()) {
        that.$axios({
          baseURL: 'https://ccdcapi.alipay.com/',
          url: 'validateAndCacheCardInfo.json?_input_charset=utf-8&cardNo='+that.showWay.account+'&cardBinCheck=true'
        }).then(function(data) {
          let _data = data.data;
          if (_data.validated) {
            that.showWay.openBank = _data.bank;
            that.showWay.openBankImg = 'https://apimg.alipay.com/combo.png?d=cashier&t=' + _data.bank;
          } else {
            that.$Toast(that.$t('poptip.bindingPayment.bankCardError'));
          }
        })
      } else {
        that.showWay.account = that.showWay.account.trim();
      }
    },
    unBinding() {
      let that = this;
      that.showDetailPopup = false;
      that.$axios({
        url: '/user/unbindBank',
        data: {
          userid: JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId,
          id: that.showWay.id,
          payPassword: that.showWay.verifyCode
        },
        method: 'post'
      }).then(function(res) {
        if (res.data.status === 200) {
          that.$Toast(that.$t('poptip.bindingPayment.unbindingSuccess'));
          that.$router.push({name: 'payment'});
        } else {
          if (res.data.code === '002') {
            that.$Toast(that.$t('poptip.bindingPayment.passwordError'));
          }
        }
      })
    },
    handleClosePopup() {
      this.showDetailPopup = false;
    },
    handleOperate() {
      let that = this,
        result = true,
        opt = null;
      if (that.isBinding) {
        that.showDetailPopup = true;
      } else {
        switch(that.paymentWay) {
          case 'bank':
            !that.showWay.username.trim() && that.$Toast(that.$t('poptip.bindingPayment.enterUsername')) && (result = false);
            !that.showWay.account.trim() && that.$Toast(that.$t('poptip.bindingPayment.enterBankCard')) && (result = false);
            !that.showWay.openDetailBank.trim() && that.$Toast(that.$t('poptip.bindingPayment.enterOpenOtherBank')) && (result = false);
            !that.showWay.verifyCode.trim() && that.$Toast(that.$t('poptip.bindingPayment.enterPassword')) && (result = false);
            opt = {
              type: 1,
              userid: JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId,
              name: that.showWay.username,
              bankcard: that.showWay.account,
              bank: that.showWay.openBank,
              bankaddr: that.showWay.openDetailBank,
              payPassword: that.showWay.verifyCode
            };
            break;
          case 'wechat':
            !that.showWay.username.trim() && that.$Toast(that.$t('poptip.bindingPayment.enterWechatName')) && (result = false);
            !that.showWay.account.trim() && that.$Toast(that.$t('poptip.bindingPayment.enterWechatId')) && (result = false);
            !that.showWay.verifyCode.trim() && that.$Toast(that.$t('poptip.bindingPayment.enterPassword')) && (result = false);
            !that.showWay.codeImg.trim() && that.$Toast(that.$t('poptip.bindingPayment.uploadImg')) && (result = false);
            opt = {
              type: 3,
              userid: JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId,
              name: that.showWay.username,
              bankcard: that.showWay.account,
              payPassword: that.showWay.verifyCode,
              img: that.showWay.codeImg
            };
            break;
          case 'alipay':
            !that.showWay.username.trim() && that.$Toast(that.$t('poptip.bindingPayment.enterUsername')) && (result = false);
            !that.showWay.account.trim() && that.$Toast(that.$t('poptip.bindingPayment.enterAlipayId')) && (result = false);
            !that.showWay.verifyCode.trim() && that.$Toast(that.$t('poptip.bindingPayment.enterPassword')) && (result = false);
            !that.showWay.codeImg.trim() && that.$Toast(that.$t('poptip.bindingPayment.uploadImg')) && (result = false);
            opt = {
              type: 2,
              userid: JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId,
              name: that.showWay.username,
              bankcard: that.showWay.account,
              payPassword: that.showWay.verifyCode,
              img: that.showWay.codeImg
            };
            break;
        }
        if (result) {
          that.$axios({
            url: '/user/addUserBank',
            data: opt,
            method: 'post'
          }).then(function(res) {
            if (res.data.status === 200) {
              that.$Toast(that.$t('poptip.bindingPayment.bindingSuccess'));
              that.$router.push({name: 'payment'});
            } else {
              if (res.data.code === '001') {
                that.$Toast(that.$t('poptip.bindingPayment.notEnabledBank'));
              } else if (res.data.code === '002') {
                that.$Toast(that.$t('poptip.bindingPayment.passwordError'));
              }
            }
          })
        }
      }
    },
    handleUploadImg() {
      let that = this;
      if (!that.flagClick) {
        that.$refs['uploadImg'].onchange = function(event) {
          that.flagClick = true;
          let _file = event.target.files[0],
            formData = new FormData();
          
          formData.append('img', _file);
          if (_file && _file.type.indexOf('image')!== -1) {
            if (_file.size > 1 * 1000 * 1000) {
              that.$Toast(that.$t('poptip.bindingPayment.imageTooBig'));
              that.flagClick = false;
              return;
            }
            
            that.$axios({
              url: '/user/uploadImg',
              method: 'post',
              onUploadProgress:function(progressEvent){ //原生获取上传进度的事件
                if(progressEvent.lengthComputable){
                  //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
                  //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
                  that.percent = Math.floor(progressEvent.loaded / progressEvent.total * 90);
                }
              },
              data: formData,
              timeout: 10 * 60 * 1000
            }).then(function(res) {
              if (res.data.status === 200) {
                that.showWay.codeImg = res.data.data;
                that.showWay.showCodeImg = that.$imgJavaUrl + res.data.data;
                that.percent = 99;
                let img = new Image();
                img.onload = function() {
                  that.$refs['percent'].src = img.src;
                  that.percent = 0;
                }
                img.src = that.$imgJavaUrl + res.data.data;
                that.flagClick = false;
              }
            })
          } else {
            that.$Toast(that.$t('poptip.bindingPayment.uploadImageFile'));
            that.flagClick = false;
          }
        }
        that.$refs['uploadImg'].click();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.binding-payment {
  .binding-way {
    margin: 25px 0;
    background-color: #fff;
    .binding-item {
      margin: 0 14px;
      padding: 0 10px;
      height: 120px;
      line-height: 120px;
      text-align: left;
      font-size: 28px;
      color: #aaa;
      border-bottom: solid 1PX #dcdcdc;
      overflow: hidden;
      & > span {
        color: #575757;
      }
      & > input {
        position: relative;
        top: 45px;
        float: right;
        width: 500px;
        border: none;
        outline: none;
        font-size: 28px;
      }
      & > input:disabled {
        background-color: #fff;
      }
      & > img {
        margin-left: 76px;
        width: 180px;
        height: auto;
        vertical-align: middle;
      }
    }
    .binding-item:last-child {
      border-bottom: none;
    }
    .binding-code {
      margin-left: 24px;
      padding-top: 26px;
      & > p {
        padding-bottom: 40px;
        height: 28px;
        line-height: 28px;
        font-size: 28px;
        color: #575757;
        box-sizing: content-box;
        text-align: left;
      }
      .upload-code-img {
        position: relative;
        padding-bottom: 47px;
        & > img {
          width: auto;
          height: 120px;
        }
        & > p {
          margin-top: 48px;
          height: 34px;
          line-height: 34px;
          font-size: 34px;
          color: #3e80ca;
        }
        .custom-progress {
          display: inline-block;
          width: 120px;
          height: 120px;
        }
      }
    }
    .binding-verify-code {
      padding: 0 24px;
      height: 120px;
      line-height: 120px;
      font-size: 28px;
      color: #aaa;
      text-align: left;
      & > span:first-child {
        margin-right: 110px;
        color: #575757;
      }
      & > input {
        width: 340px;
        border: none;
        outline: none;
      }
      & > span:last-child {
        color: #3e80ca;
      }
    }
  }
  .friendship-poptip {
    margin: 33px 25px;
    height: 120px;
    line-height: 37px;
    font-size: 24px;
    color: #b5b5b5;
    text-align: left;
  }
  .binding-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    line-height: 100px;
    background-color: #3e80ca;
    color: #fff;
    font-size: 34px;
  }
  .bank-more-poptip {
    padding: 28px 24px 0;
    height: 27px;
    line-height: 27px;
    font-size: 28px;
    color: #d87675;
    text-align: left;
    box-sizing: content-box;
  }
  .detail-shade {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(98, 98, 98, .3);
    z-index: 1000;
    & > img {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      width: 627px;
      height: auto;
    }
    .popup-detail {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      width: 717px;
      height: 410px;
      background-color: #fff;
      border-radius: 25px;
      .popup-detail-header {
        margin: 29px 27px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        & > span {
          height: 50px;
          line-height: 50px;
          font-size: 50px;
          color: #262626;
          font-weight: bold;
        }
        & > img {
          width: 31px;
          height: 31px;
        }
      }
    }
    .popup-detail-poptip {
      margin: 0 30px;
      height: 25px;
      line-height: 25px;
      font-size: 24px;
      color: #d87675;
      text-align: left;
      & > img {
        margin-right: 19px;
        width: 34px;
        height: 34px;
        vertical-align: middle;
      }
      & > span {
        vertical-align: middle;
      }
    }
    .popup-detail-pd {
      margin: 45px 0;
      padding: 46px 30px;
      height: 28px;
      line-height: 28px;
      border: solid 1PX #dcdcdc;
      border-right-color: transparent;
      border-left-color: transparent;
      text-align: left;
      box-sizing: content-box;
      & > span {
        margin-right: 63px;
        font-size: 28px;
        color: #575757;
      }
      & > input {
        font-size: 24px;
        color: #aaa;
        border: none;
        outline: none;
      }
    }
    .popup-detail-rd {
      margin: 0 30px;
      height: 42px;
      line-height: 42px;
      font-size: 24px;
      color: #626262;
      text-align: left;
      & > p {
        margin-left: 10px;
        display: inline-block;
        vertical-align: super;
        & > span {
          color: #3e80ca;
        }
      }
    }
    .confirm {
      margin: 44px 70px;
      width: 579px;
      height: 89px;
      line-height: 89px;
      text-align: center;
      background-color: #3e80ca;
      color: #fff;
      border-radius: 10px;
      font-size: 34px;
    }
  }
}
</style>
