<template>
  <div class="into-detail">
    <headers @back="$goBack" :title="$t('orderRecord.detail.title')"/>
    <div class="detail-header">
      <div class="header-left">
        <p v-text="$t(recordStatus[orderDetail.status])"></p>
        <p v-text="$t(recordPopStatus[orderDetail.status])"></p>
      </div>
      <a :href="$customerService" class="header-right">
        <img src="../../assets/img/payment/service.png" alt />
        <p v-text="$t('assets.outRecDetail.contactMerchant')"></p>
      </a>
    </div>
    <div class="detail-money">
      <span v-text="$t('assets.outRecDetail.num')"></span>
      <span v-show="orderDetail.num">{{orderDetail.num | toNonExponential}} {{orderDetail.currency}}</span>
    </div>
    <div class="more-detail">
      <div class="more-item">
        <span v-text="$t('assets.outRecDetail.currency')"></span>
        <span v-show="orderDetail.currency">{{orderDetail.currency}}</span>
      </div>
      <div class="more-item">
        <span v-text="$t('assets.outRecDetail.address')"></span>
        <span v-show="orderDetail.address">{{orderDetail.address}}</span>
      </div>
      <div v-show="orderDetail.addressRemark" class="more-item">
        <span v-text="$t('assets.outRecDetail.addressRemark')"></span>
        <span>{{orderDetail.addressRemark}}</span>
      </div>
      <div class="more-item">
        <span v-text="$t('assets.outRecDetail.serviceCharge')"></span>
        <span>{{orderDetail.serviceCharge}}</span>
      </div>
      <!-- <div class="more-item">
        <span v-text="$t('assets.outRecDetail.orderId')"></span>
        <span>{{orderDetail.orderId}}</span>
      </div> -->
      <div class="more-item">
        <span v-text="$t('assets.outRecDetail.orderTime')"></span>
        <span>{{orderDetail.orderTime  | date('yyyy-MM-dd hh:mm:ss')}}</span>
      </div>
    </div>
    <div class="detail-footer">
      <div v-if="orderDetail.status == 0" class="detail-btn active-detail-btn" v-text="$t('assets.outRecDetail.cancel')" @click="handleCancel"></div>
    </div>
    <toast :isShow="toast.show" :showToastType="toast.type" :toastContent="toast.content" :toastTitle="toast.title" :toastOperateTitle="toast.confirm" :toastAssistOperateTitle="toast.assist" @handle-main-click="mainClick" @handle-assist-click="assistClick"/>
  </div>
</template>

<script>
import headers from '../../component/header';
import toast from '../../component/toast';
export default {
  components: {
    toast,
    headers
  },
  data() {
    return {
      orderDetail: {
        id: '',
        status: 0,
        num: 0,
        currency: '',
        address: '',
        addressRemark: '',
        serviceCharge: 0,
        orderId: '',
        orderTime: ''
      },
      toast: {
        show: false,
        type: '',
        content: '',
        title: '',
        confirm: '',
        assist: ''
      },
      recordStatus: ['assets.outRecDetail.status.audited','assets.outRecDetail.status.processing','assets.outRecDetail.status.completed','assets.outRecDetail.status.cancelled','assets.outRecDetail.status.failed'],
      recordPopStatus: ['assets.outRecDetail.statusPoptip.audited','assets.outRecDetail.statusPoptip.processing','assets.outRecDetail.statusPoptip.completed','assets.outRecDetail.statusPoptip.cancelled','assets.outRecDetail.statusPoptip.failed']
    }
  },
  beforeRouteEnter (to, from, next) {
    // ...
    next(vm => {
      let obj = JSON.parse(vm.$route.query.obj);
      if (obj && (vm.$getCookie('userId') && JSON.parse(decodeURIComponent(vm.$getCookie('userId'))).userId)) {
        vm.orderDetail = {
          id: obj.id,
          status: obj.status,
          num: obj.num,
          currency: obj.name,
          address: obj.address,
          addressRemark: obj.memo,
          serviceCharge: obj.serviceCharge,
          orderId: '',
          orderTime: (new Date(obj.time)).getTime()
        };
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
  filters:{
    toNonExponential(num) {
      num = parseFloat(num);
      var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
      return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
    }
  },
  methods: {
    mainClick() {

    },
    assistClick() {

    },
    handleCancel() {
      let that = this,
        formData = new FormData();
      formData.append('id', that.orderDetail.id);
      formData.append('userId', (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId));
      formData.append('token', (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).token));
      that.$axios({
        baseURL: that.$interfacePhpUrl,
        url: '/finance/back_out',
        method: 'post',
        data: formData,
        withCredentials: false
      }).then(function(data) {
        if (data.status == 200) {
          if (data.data.code == 1) {
            that.$normalToast(that.$t('assets.outRecDetail.cancelSuccess'), 1000);
            setTimeout(function() {
              that.$loginRoute(`/assets/outRecord/${that.orderDetail.currency}`);
            }, 1000);
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.into-detail {
  .detail-header {
    padding: 50px 23px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .header-left {
      text-align: left;
      & > p:first-child {
        margin-bottom: 12px;
        height: 45px;
        line-height: 45px;
        font-size: 45px;
        color: #262626;
      }
      & > p:last-child {
        height: 24px;
        line-height: 24px;
        font-size: 24px;
        color: #d87675;
      }
    }
    .header-right {
      & > img {
        width: 45px;
        height: 45px;
      }
      & > p {
        height: 24px;
        line-height: 24px;
        font-size: 24px;
        color: #3e80ca;
      }
    }
  }
  .detail-money {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: auto;
    padding: 0 32px;
    width: 698px;
    height: 105px;
    border-radius: 20px 20px 0 0;
    background-color: #3e80ca;
    font-size: 28px;
    color: #fff;
  }
  .detail-money::before {
    content: "";
    position: absolute;
    left: -20px;
    top: 85px;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background-color: #f8f8f8;
  }
  .detail-money::after {
    content: "";
    position: absolute;
    right: -20px;
    top: 85px;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background-color: #f8f8f8;
  }
  .more-detail {
    margin: 0 auto 112px;
    width: 698px;
    background-color: #fff;
    border-radius: 0 0 20px 20px;
    .more-item {
      display: flex;
      justify-content: space-between;
      padding: 30px;
      height: 28px;
      line-height: 28px;
      font-size: 28px;
      color: #a5a5a5;
      box-sizing: content-box;
      & > span:last-child {
        color: #363636;
        font-size: 22px;
      }
      & > img {
        width: 53px;
        height: 53px;
      }
    }
  }
  .detail-footer {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    line-height: 100px;
    color: #fff;
    font-size: 28px;
    .detail-btn {
      flex: 1;
      font-size: 34px;
      background-color: #b0b0b0;
      color: #fff;
    }
    .active-detail-btn {
      background-color: #3e80ca;
    }
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
      height: 560px;
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
