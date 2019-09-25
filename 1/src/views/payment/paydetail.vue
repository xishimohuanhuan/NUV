<template>
  <div>
    <!-- <headers title="确认支付" @back="$goBack" ></headers> -->
    <headers @back="$goBack" ></headers>
    <div class="pay-body">
      <div class="detail-Pay">
        <div class="top-PAy">
          <span>订单支付</span>
          <div>
            <p 
              v-show="orderDeType === '1'"
              v-text="orderDetStatus === 1 ? 
              overTime :
              $t(orderPoptip[orderDetStatus-1])"
            ></p>
            <img src="../../assets/img/payment/colrl.png" alt=""/>
          </div>
        </div>
        <p class="p-Word">
        请使用本人{{trueName !==false ?
        ' (*'+trueName +') ' :
        ''}}{{this.showtype==='1'?
        "银行卡" :
        (this.showtype==='2' ? '支付宝':'微信')}}向以下{{this.showtype==='1'?
        "银行卡" :
        (this.showtype==='2' ? '支付宝':'微信')}}自行转账
        </p>
      </div>
      <div v-if="['2','3'].includes(showtype)" class="showimg">
        <img :src="$imgJavaUrl + renderData.toPayImg" alt="">
        <p class="title">{{$t('paydetail.payforErqode')}}</p>
        <h5 class="price">{{$t('paydetail.payprice')}}{{renderData.totalMoney}} CNY</h5>
      </div>
      <div class="showyhk" v-show="['1'].includes(showtype)">
        <ul>
          <li v-for="item in statusData" :key="item.name">
            <div class="">{{item.key}}</div>
            <div class=""><span class="copy-btn" v-if='item.name === "toBankNum"' @click="copyBackCodeHandle(item.val)">复制</span>  {{item.val}}</div>
          </li>
        </ul>
        <p class="title">请通过以上银行卡信息，线下支付</p>
        <h5 class="price">{{$t('paydetail.payprice')}}{{renderData.totalMoney}} CNY</h5>
      </div>
    </div>
    <div class="lxa-poptip" v-show="false" style="">
      <p>{{$t('setting.poptip')}}:</p>
      <p>
          <span class="isInportent">*</span>
          <span>{{$t('orderDetailPop.poptip.poptip1')}}</span>
      </p>
      <p>
          <span class="isInportent">*</span>
          <span>{{$t('orderDetailPop.poptip.poptip2')}}</span>
      </p>
    </div>
    <div class="detail-footer">
      <div class="icon">
        <a :href="$customerService" class="header-right">
          <img src="../../assets/img/payment/service.png" alt />
          <!-- <p v-text="$t('orderRecord.detail.service')"></p> -->
        </a>
      </div>
      <div class="cancle" @click="cancleOrderHandle">取消订单</div>
      <div @click="handlePay" class="detail-btn">我已付款成功</div>
      <!-- <div class="detail-btn detail-btn-active" v-text="$t('orderRecord.detail.goPay')" ></div> -->
      <!-- <div @click="quickRelease" class="detail-btn detail-btn-active" >{{$t('paydetail.payquike')}}</div> -->
    </div>
    <toast :isShow="showToast" :showToastType="toast.type" :toastContent="toast.content" :toastTitle="toast.title" :toastOperateTitle="toast.confirm" :toastAssistOperateTitle="toast.assist" @handle-main-click="mainClick" @handle-assist-click="assistClick"/>
  </div>
</template>

<script>
import headers from '../../component/header'
export default {
  components:{
    headers
  },
  data() {
    return {
      showtype: '',
      orderId: '',
      userId: '',
      statusData: [],
      renderData: {},
      showToast: false,
      toast: {
        type: '',
        content: '',
        title: '',
        confirm: '',
        assist: '',
        method: ''
      },
      // 倒计时
      overTime:'',
      interval:null,
      orderDetStatus:0,
      orderDeType:'',
      trueName:false,
      orderPoptip: ['', 'orderRecord.orderPoptip.paymenting', 'orderRecord.orderPoptip.canceled', 'orderRecord.orderPoptip.toBeReleased', 'orderRecord.orderPoptip.overed']
    }
  },
  created(){
    this.trueName=localStorage.getItem('isName') ? localStorage.getItem('isName').slice(1) : false;
    this.$store.commit('changeNoMenu', false);
    this.orderId =  this.$route.query.id;
    this.userId = this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId'))).userId
    this.getorderdetail();
  },

  methods: {
    quickRelease() {
      let that = this;
      that.$loginRoute('/uploadVoucher/'+that.orderId);
    },
    cancleOrderHandle() {
      let that = this;
      that.toast = {
        type: 'operate',
        content: that.$t('poptip.orderDetail.cancelPoptip.content').replace('次', that.renderData.cancleCount+'次'),
        title: that.$t('poptip.orderDetail.cancelPoptip.title'),
        confirm: that.$t('poptip.orderDetail.cancelPoptip.enter'),
        assist: that.$t('poptip.orderDetail.cancelPoptip.cancel'),
        method: '3'
      };
      that.showToast = true;
    },
    // 复制银行卡号
    copyBackCodeHandle(value){
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
    getorderdetail() {
      this.$axios({
        url: 'version/api/trade/getOrderDetail',
        params: {orderId: this.orderId, userId: this.userId},
        method: 'get'
      }).then(res => {
        this.showtype = res.data.data.payWay
        this.renderData = res.data.data;
        this.dataHandle(res.data.data)
      }).catch(() => {})
    },
    mainClick() {
      this.showToast = false;
      if(!this.toastFlag){
        this.changeOrderStatus(this.toast.method);
      }
      this.toastFlag = false;
    },
    handlePay() {
      let that = this;
      that.toast = {
        type: 'operate',
        content: that.$t('poptip.orderDetail.confirmPay.content'),
        title: that.$t('poptip.orderDetail.confirmPay.title'),
        confirm: that.$t('poptip.orderDetail.confirmPay.cancelTitle'),
        assist: that.$t('poptip.orderDetail.confirmPay.cancel'),
        method: '4'
      };
      that.showToast = true;
    },
    assistClick() {
      this.showToast = false;
    },
    changeOrderStatus(status) {
      let that = this,
        opt = {
          orderId: that.orderId,
          orderStatus: status,
          userId: (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId),
          payPassword: that.password||'',
          payVoucher: that.uploadSrc
        },
        _status = status;
      
      that.$axios({
        url: 'version/api/trade/updateOrderStatus',
        method: 'post',
        data: opt
      }).then(function(res) {
        if (res.data.status === 200) {
          that.toastFlag = true;
          if (res.data.code === '001') {
            that.$Toast(that.$t('poptip.orderDetail.notExists'));
            return;
          } else if (res.data.code === '002') {
            that.$Toast(that.$t('poptip.orderDetail.updateError'));
            return;
          } else if (res.data.code === '003') {
            // that.$Toast(that.$t('poptip.orderDetail.cancel'));
            that.toast = {
              type: 'operate',
              content: that.$t('poptip.orderDetail.cancel'),
              title: '',
              confirm: that.$t('poptip.orderDetail.iKnow'),
              assist: '',
              method: '6'
            };
            that.showToast = true;
            return;
          } else if (res.data.code === '004') {
            // that.$normalToast(that.$t('poptip.orderDetail.notCancel'));
            that.toast = {
              type: 'operate',
              content: that.$t('poptip.orderDetail.notCancel'),
              title: '',
              confirm: that.$t('poptip.orderDetail.iKnow'),
              assist: '',
              method: '6'
            };
            that.showToast = true;
            return;
          } else if (res.data.code === '005') {
            that.$normalToast(that.$t('poptip.orderDetail.passwordError'));
            return;
          } else if (res.data.code === '006') {
            that.$normalToast(that.$t('poptip.orderDetail.updatedStatus'));
            that.showDetailPopup = false;
            that.getDetail();
            return;
          }
          that.toastFlag = false;
          if (_status === '3') {
            that.$Toast(that.$t('poptip.orderDetail.cancelsuccess'));
          } else if (_status === '4') {
            that.$Toast(that.$t('poptip.orderDetail.overPayOrder'));
          } else if (_status === '5') {
            that.$Toast(that.$t('poptip.orderDetail.releaseSuccess'));
            that.showDetailPopup = false;
          }
          that.$loginRoute('/orderDetail/' + that.orderId);
        }
      })
    },
    dataHandle(data) {
      this.orderDetStatus=parseInt(data.orderStatus);
      this.orderDeType=data.orderType;
      // 倒计时
      this.overTime=(data.updateTime > data.currentTime ? 
        this.turnCountDown(data.updateTime - data.currentTime) :
        this.$t('poptip.orderDetail.overTime'));
      if (data.updateTime > data.currentTime && data.orderStatus === '1' && !this.interval) {
        this.interval = setInterval(() =>{
          data.currentTime += 1000;
          this.overTime = this.turnCountDown(data.updateTime - data.currentTime);
        }, 1000);
      }
      const TITLE = [
        this.$t('paydetail.payway'),
        this.$t('paydetail.payforuser'),
        this.$t('paydetail.backnum'),
        this.$t('paydetail.backname'),
        this.$t('paydetail.backnamesub'),
      ];
      const KEY = [
        'payWay',
        'toBankName',
        'toBankNum',
        'toBank',
        'toBankBranche'
      ];
      this.statusData = TITLE.map((item, index) => {
        let key = item;
        let val = index === 0 ? this.$t('paydetail.backcart') : data[KEY[index]];
        let name = KEY[index];
        return {
          key,
          val,
          name
        }
      })
    },
    // 倒计时的处理
    turnCountDown(val) {
      let m = parseInt(val / (60 * 1000)),
        s = parseInt((val - m * 60 * 1000) / 1000);
      if (val > 0) {
        return m + this.$t('poptip.orderDetail.minute') + ' ' + s + this.$t('poptip.orderDetail.second');
      } else {
        this.getorderdetail();
        clearInterval(this.interval);
        this.interval = null;
        return this.$t('poptip.orderDetail.overTime');
      }
    },
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('changeNoMenu', true);
    clearInterval(this.interval);
    next();
  },
}
</script>

<style lang='less' scoped>
.pay-body{
  // background: #fff;
  .title{
    font-size: 28px;
    padding: 40px 0;
    color: #b0b0b0;
  }
  .price{
    font-size: 34px;
    padding-bottom: 40px;
    color: #202025;
  }
  .showimg{
    padding-top: 20px;
    margin: 0 auto;
    background: #fff;
    width: 100%;
    // height: 200px;
    img{
      width: 491px;
    }
  }
  .showyhk{
    // margin-top: 34px;
    background: #fff;
    &>ul{
      // background: #f8f8f8;
      &>li{
        display: flex;
        justify-content: space-between;
        height: 117px;
        margin: 0 30px;
        align-items: center;
        border-bottom: 1px solid #dcdcdc;
        color: #575757;
        font-size: 28px;
        .copy-btn{
          background: #3e80ca;
          color: #fff;
          padding: 5px 18px;
          margin-right: 8px;
        }
      }
    }
  }
}
.lxa-poptip{
    padding-top: 60px;
    height: 264px;
    font-size: 24px;
    font-weight: normal;
    line-height: 60px;
    letter-spacing: 0px;
    color: #929292;
    text-align: left;
    padding-left: 30px;
    margin-bottom: 100px;
    .isInportent{
        color: #f00;
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
    z-index: 1000;
    .icon{
      width: 12%;
      background: #fff;
      border-right: 1px solid #efefef;
      a{
        width: 80px;
        height: 100%;
        img{
          width: 45px;
          height: auto;
          vertical-align: middle;
        }
      }
    }
    .cancle{
      width: 34%;
      background: #fff;
      color: #3e80ca;
    }
    .detail-btn {
      flex: 1;
      background-color: #3e80ca;
      color: white;
      font-size: 34px;
    }
    .detail-btn-active {
      font-size: 34px;
      background-color: #3e80ca;
      color: #fff;
    }
  }
  .detail-Pay{
    display: flex;
    flex-direction: column;
    background: white;
    border-bottom:1px solid rgb(220,220,220);
    padding-top: 20px;
    .top-PAy{
      display: flex;
      justify-content: space-between;
      text-align: center;
      margin: 0 30px;
      margin-bottom: 30px;
      span{
        font-size: 45px;
        font-weight: 600;
      }
      div{
        color: rgb(216,118,117);
        font-size: 24px;
        display: flex;
        align-items: center;
        img{
          height: 26px;
          width: 26px;
          margin-left: 14px;
        }
      }
    }
    .p-Word{
      color: rgb(216,118,117);
      font-size: 24px;
      text-align: left;
      margin: 0 30px;
      margin-bottom: 30px;
    }
  }
</style>
