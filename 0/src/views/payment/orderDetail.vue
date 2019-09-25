<template>
  <div class="order-detail">
    <headers @back="goBack" :title="$t('orderRecord.detail.title')"/>
    <div class="detail-header">
      <div class="header-left">
        <p class="p1" v-text="$t(orderStatus[orderDetail.status-1])"></p>
        <p 
          class="p2"
          v-if="orderDetail.type === '1' && !(orderDetail.payNum || orderDetail.payVoucher)" 
          v-text="orderDetail.status === 1 ? orderDetail.overTime : $t(orderPoptip[orderDetail.status-1])"
        ></p>
        <p 
          class="p2"
          v-if="orderDetail.type === '1' &&
          (orderDetail.payNum || orderDetail.payVoucher) &&
          orderDetail.status!==5 &&
          orderDetail.status!==3" 
          v-text="$t('orderRecord.detail.orderAddCoin')"
        ></p>
        <p 
          class="p2"
          v-if="orderDetail.type === '1' && orderDetail.status===5 && (orderDetail.payNum || orderDetail.payVoucher)" 
          v-text="$t('orderRecord.orderPoptip.overed')"
        ></p>
        <p 
          class="p2"
          v-if="orderDetail.type === '1' && orderDetail.status===3 && (orderDetail.payNum || orderDetail.payVoucher)" 
          v-text="$t('orderRecord.orderPoptip.canceled')"
        ></p>
      </div>
      <a href="http://p.qiao.baidu.com/cps/chatIndex?reqParam=%7B%22from%22%3A0%2C%22sessionid%22%3A%22%22%2C%22siteId%22%3A%2213192353%22%2C%22tid%22%3A%22-1%22%2C%22userId%22%3A%2226938869%22%2C%22ttype%22%3A1%2C%22siteConfig%22%3A%7B%22wsUrl%22%3A%22wss%3A%2F%2Fp.qiao.baidu.com%2Fcps%2Fwebsocket%22%2C%22eid%22%3A%2226938869%22%2C%22queuing%22%3A%22%22%2C%22session%22%3A%7B%22displayName%22%3A%22%E5%B8%83**%E6%9D%A5%22%2C%22headUrl%22%3A%22https%3A%2F%2Fss0.bdstatic.com%2F7Ls0a8Sm1A5BphGlnYG%2Fsys%2Fportraitn%2Fitem%2Fd496254535254238253833254534254238253831254536253943254141254536253944254135cc3e.jpg%22%2C%22status%22%3A0%2C%22uid%22%3A0%2C%22uname%22%3A%22%22%7D%2C%22siteId%22%3A%2213192353%22%2C%22online%22%3A%22true%22%2C%22webRoot%22%3A%22%2F%2Fp.qiao.baidu.com%2Fcps%2F%22%2C%22bid%22%3A%221053595348013192353%22%2C%22userId%22%3A%2226938869%22%2C%22isGray%22%3A%22false%22%2C%22invited%22%3A0%7D%2C%22config%22%3A%7B%22themeColor%22%3A%224d74fa%22%7D%7D" class="header-right">
        <img src="../../assets/img/payment/service.png" alt />
        <p v-text="$t('orderRecord.detail.service')"></p>
      </a>
    </div>
    <div class="detail-money">
      <span v-text="$t('orderRecord.detail.dealMoney')"></span>
      <span v-show="orderDetail.totalMoney">{{orderDetail.totalMoney}} CNY</span>
    </div>
    <div class="more-detail">
      <div class="more-item">
        <span v-text="$t('orderRecord.detail.unitPrice')"></span>
        <span v-show="orderDetail.price">{{orderDetail.price}} CNY/USDT</span>
      </div>
      <div class="more-item">
        <span v-text="$t('orderRecord.detail.num')"></span>
        <span v-show="orderDetail.num">{{orderDetail.num}} USDT</span>
      </div>
      <div v-show="orderDetail.payWay === '1'" class="more-item">
        <span v-text="$t('orderRecord.detail.bankAccount')"></span>
        <span>{{orderDetail.bankTitle}}</span>
      </div>
      <div v-show="orderDetail.payWay === '1'" class="more-item">
        <span v-text="$t('orderRecord.detail.bankBranche')"></span>
        <span>{{orderDetail.bankBranche}}</span>
      </div>
      <div v-show="orderDetail.payWay !== '1'" class="more-item">
        <span v-text="orderDetail.payWay === '3' ? $t('orderRecord.detail.wechat') : $t('orderRecord.detail.alipay')"></span>
        <span>{{orderDetail.card}}</span>
      </div>
      <div class="more-item">
        <span v-text="$t('orderRecord.detail.payee')"></span>
        <span v-show="orderDetail.username">{{orderDetail.username}}</span>
      </div>
      <div v-show="orderDetail.payWay === '1'" class="more-item">
        <span v-text="$t('orderRecord.detail.bankCardCode')"></span>
        <span v-show="orderDetail.card">{{orderDetail.card}}</span>
      </div>
      <div v-if="orderDetail.payWay !== '1'" class="more-item">
        <span v-text="$t('orderRecord.detail.collectionQrCode')"></span>
        <img v-if="orderDetail.collectionQrCode" @click="handleShow($imgJavaUrl + orderDetail.collectionQrCode)" :src="$imgJavaUrl + orderDetail.collectionQrCode"/>
      </div>
      <div class="more-item">
        <span v-text="$t('orderRecord.detail.orderId')"></span>
        <span v-show="orderDetail.number">{{orderDetail.number}}</span>
      </div>
      <div v-show="false" class="more-item">
        <span v-text="$t('orderRecord.detail.paymentReferenceNumber')"></span>
        <span>156226</span>
      </div>
      <div class="more-item">
        <span v-text="$t('orderRecord.detail.orderTime')"></span>
        <span v-show="orderDetail.createTime">{{orderDetail.createTime | date('yyyy-MM-dd hh:mm:ss')}}</span>
      </div>
      <!-- 支付方式 -->
      <div class="more-item" v-if="orderDetail.payNum && orderDetail.fromAccount">
        <span v-text="$t('orderRecord.detail.paMethod')"></span>
        <span 
          v-if="orderDetail.payNum==='1'" 
          v-text="$t('orderRecord.detail.cardAcco')"
        ></span>
        <span 
          v-if="orderDetail.payNum==='2'" 
          v-text="$t('orderRecord.detail.alipay')"
        ></span>
        <span 
          v-if="orderDetail.payNum==='3'" 
          v-text="$t('orderRecord.detail.wechat')"
        ></span>
      </div>
      <!-- 支付账号 -->
      <div class="more-item" v-if="orderDetail.payNum && orderDetail.fromAccount">
        <span v-text="$t('orderRecord.detail.payMessg')"></span>
        <span>{{orderDetail.fromAccount | filterAcco}}</span>
      </div>
      <div v-show="orderDetail.payVoucher" class="more-item">
        <span v-text="$t('orderRecord.detail.paymentVoucher0')"></span>
        <img v-if="orderDetail.payVoucher" @click="handleShow($imgJavaUrl + orderDetail.payVoucher)" :src="$imgJavaUrl + orderDetail.payVoucher"/>
      </div>
      <div v-show="orderDetail.voucher && orderDetail.type == '2'" class="more-item">
        <span v-text="$t('orderRecord.detail.paymentVoucher')"></span>
        <img v-if="orderDetail.voucher" @click="handleShow($imgJavaUrl + orderDetail.voucher)" :src="$imgJavaUrl + orderDetail.voucher"/>
      </div>
    </div>
    <div 
      class="reason-item" 
      v-show="orderDetail.cancleReason && 
        orderDetail.cancleReason !=='-1' &&
        orderDetail.cancleReason !=='-2'"
    >
      <p v-text="$t('orderRecord.detail.cancelRes')"></p>
      <p v-text="orderDetail.cancleReason"></p>
    </div>
    <div class="detail-footer">
      <div v-if="orderDetail.status === 1" class="detail-btn" v-text="$t('orderRecord.detail.cancel')" @click="handleCancel"></div>
      <div v-if="orderDetail.status === 1 && orderDetail.type === '1'" class="detail-btn detail-btn-active" v-text="$t('orderRecord.detail.goPay')" @click="handlePay"></div>
      <div v-if="orderDetail.status === 4 && orderDetail.type === '2'" class="detail-btn detail-btn-active" v-text="$t('orderRecord.detail.release')" @click="showDetailPopup = true"></div>
      <!-- 加速放币按钮 -->
      <div 
        v-if="orderDetail.status === 4 && orderDetail.type === '1' && !(orderDetail.payNum || orderDetail.payVoucher)" 
        class="detail-btn detail-btn-active"
        @click="showAddCion=true"
      >{{$t('otherWT.addCoinT')}}</div>
    </div>
    <div v-show="showDetailPopup" class="detail-shade">
      <div class="popup-detail">
        <div class="popup-detail-header">
          <span v-text="$t('orderRecord.detail.confirmRelease')"></span>
          <img src="../../assets/img/payment/close.png" alt @click="handleClosePopup"/>
        </div>
        <div class="popup-detail-poptip">
          <img src="../../assets/img/payment/poptip.png" alt />
          <span v-text="$t('orderRecord.detail.releasePoptip')"></span>
        </div>
        <div class="popup-detail-pd">
          <span v-text="$t('orderRecord.detail.dealPassword')"></span>
          <input :placeholder="$t('orderRecord.detail.dealPasswordPoptip')" type="password" v-model="password"/>
        </div>
        <div class="popup-detail-rd">
          <radiou v-model="readRadio" style="margin-right: 5px"></radiou>
          <p>
            {{$t('orderRecord.detail.releaseRadioFirst')}}<span>{{$t('orderRecord.detail.releaseRadioSecond')}}</span>{{$t('orderRecord.detail.releaseRadioThird')}}
          </p>
        </div>
        <div class="confirm" @click="handleRelease" v-text="$t('orderRecord.detail.releaseConfirm')"></div>
      </div>
    </div>
    <div v-show="showImg" class="detail-shade" @click.self="showImg=false">
      <img v-if="showImgSrc" :src="showImgSrc" alt/>
    </div>
    <toast :isShow="showToast" :showToastType="toast.type" :toastContent="toast.content" :toastTitle="toast.title" :toastOperateTitle="toast.confirm" :toastAssistOperateTitle="toast.assist" @handle-main-click="mainClick" @handle-assist-click="assistClick"/>
    <div class="recharge-poptip">
      <div v-show="(orderDetail.type === '1' && orderDetail.status == 1) || (orderDetail.type === '1' && orderDetail.status == 4) || (orderDetail.type !== '1' && orderDetail.status == 1) || (orderDetail.type !== '1' && orderDetail.status == 2) || (orderDetail.type !== '1' && orderDetail.status == 4)" class="recharge-poptip-head" v-text="$t('orderDetailPop.title')"></div>
      <div v-if="orderDetail.type === '1' && orderDetail.status == 1" class="recharge-poptip-item">
        
        {{$t('orderDetailPop.buy.unpaid.one')}}
      </div>
      <div v-if="orderDetail.type === '1' && orderDetail.status == 1" class="recharge-poptip-item">
        
        {{$t('orderDetailPop.buy.unpaid.two')}}
      </div>
      <div v-if="orderDetail.type === '1' && orderDetail.status == 1" class="recharge-poptip-item">
        
        {{$t('orderDetailPop.buy.unpaid.three')}}
      </div>
      <div v-if="orderDetail.type === '1' && orderDetail.status == 1" class="recharge-poptip-item">
        
        {{$t('orderDetailPop.buy.unpaid.four')}}
      </div>
      <div v-if="orderDetail.type === '1' && orderDetail.status == 4" class="recharge-poptip-item">
        
        {{$t('orderDetailPop.buy.toBeReleased.one')}}
      </div>
      <div v-if="orderDetail.type === '1' && orderDetail.status == 4" class="recharge-poptip-item">
        
        {{$t('orderDetailPop.buy.toBeReleased.two')}}
      </div>
      <div v-if="orderDetail.type !== '1' && orderDetail.status == 1" class="recharge-poptip-item">
        
        {{$t('orderDetailPop.sell.unpaid.one')}}
      </div>
      <div v-if="orderDetail.type !== '1' && orderDetail.status == 1" class="recharge-poptip-item">
        
        {{$t('orderDetailPop.sell.unpaid.two')}}
      </div>
      <div v-if="orderDetail.type !== '1' && orderDetail.status == 1" class="recharge-poptip-item">
        
        {{$t('orderDetailPop.sell.unpaid.three')}}
      </div>
      <div v-if="orderDetail.type !== '1' && orderDetail.status == 1" class="recharge-poptip-item">
        
        {{$t('orderDetailPop.sell.unpaid.four')}}
      </div>
      <div v-if="orderDetail.type !== '1' && orderDetail.status == 2" class="recharge-poptip-item">
        
        {{$t('orderDetailPop.sell.paying.one')}}
      </div>
      <div v-if="orderDetail.type !== '1' && orderDetail.status == 2" class="recharge-poptip-item">
        
        {{$t('orderDetailPop.sell.paying.two')}}
      </div>
      <div v-if="orderDetail.type !== '1' && orderDetail.status == 2" class="recharge-poptip-item">
        
        {{$t('orderDetailPop.sell.paying.three')}}
      </div>
      <div v-if="orderDetail.type !== '1' && orderDetail.status == 4" class="recharge-poptip-item">
        
        {{$t('orderDetailPop.sell.toBeReleased.one')}}
      </div>
      <div v-if="orderDetail.type !== '1' && orderDetail.status == 4" class="recharge-poptip-item">
        
        {{$t('orderDetailPop.sell.toBeReleased.two')}}
      </div>
      <div v-if="orderDetail.type !== '1' && orderDetail.status == 4" class="recharge-poptip-item">
        
        {{$t('orderDetailPop.sell.toBeReleased.three')}}
      </div>
    </div>
    <!-- 加速放币弹框 -->
    <Popup
      v-model="showAddCion"
      position="bottom"
    >
      <div class="top-popAdd">
        <div class="head-addP">
          <span>{{$t('otherWT.xzQuMet')}}</span>
          <!-- <img @click="showAddCion=false" src="../../assets/img/setting/cancel.png" alt=""> -->
        </div>
        <p>{{$t('otherWT.mesQjiaCoin')}}</p>
      </div>
      <div class="mass-pos" @click="checkOutShow=1">
        <div class="left-qwe">
          <!-- <img src="../../assets/img/orderRecord/addcoin.png" alt=""> -->
          <span>{{$t('otherWT.ordeOutPa')}}</span>
        </div>
        <div class="order-chec">
          <div v-show="checkOutShow===1"></div>
        </div>
      </div>
      <div class="mass-pos" @click="checkOutShow=2">
        <div class="left-qwe">
          <!-- <img class="imgTwo" src="../../assets/img/orderRecord/upload1.png" alt=""> -->
          <span>{{$t('otherWT.upPayke')}}</span>
        </div>
        <div class="order-chec">
          <div v-show="checkOutShow===2"></div>
        </div>
      </div>
      <div class="btn-poT">
        <div @click="showAddCion=false">{{$t('otherWT.addsssNot')}}</div>
        <div @click="gotoSpeed">{{$t('otherWT.xNexSte')}}</div>
      </div>
    </Popup>
  </div>
</template>

<script>
import { Popup } from 'vant';

import headers from '../../component/header';
import radiou from '../../component/radiou';
import toast from '../../component/toast';

export default {
  components: {
    headers,
    radiou,
    toast,
    Popup
  },
  data() {
    return {
      // 加速放币弹框
      showAddCion:false,
      checkOutShow:1,
      showImg: false,
      showImgSrc: '',
      showDetailPopup: false,
      password: '',
      readRadio: false,
      orderId: '',
      gopayFlag: false,
      orderDetail: {
        overTime: '',
        status: 0,
        totalMoney: 0,
        price: 0,
        num: 0,
        bankTitle: '',
        username: '',
        card: '',
        id: '',
        number: '',
        createTime: '',
        payWay: '',
        collectionQrCode: ''
      },
      interval: null,
      showToast: false,
      toast: {
        type: '',
        content: '',
        title: '',
        confirm: '',
        assist: '',
        method: ''
      },
      showPayPopup: false,
      orderStatus: ['orderRecord.orderStatus.unpaid', 'orderRecord.orderStatus.paymenting', 'orderRecord.orderStatus.canceled', 'orderRecord.orderStatus.toBeReleased', 'orderRecord.orderStatus.overed'],
      orderPoptip: ['', 'orderRecord.orderPoptip.paymenting', 'orderRecord.orderPoptip.canceled', 'orderRecord.orderPoptip.toBeReleased', 'orderRecord.orderPoptip.overed']
    }
  },
  beforeRouteEnter (to, from, next) {
    // ...
    next(vm => {
      if (decodeURIComponent(vm.$getCookie('userId')) && JSON.parse(decodeURIComponent(vm.$getCookie('userId'))).userId) {
        vm.$store.commit('changeNoMenu', false);
        vm.orderId = to.params.orderId;
        if (!vm.orderId) {
          vm.$router.push({name: 'home'});
          return;
        }
        vm.getDetail();
      } else {
        vm.$loginRoute('/orderDetail');
      }
    })
  },
  beforeRouteLeave (to, from, next) {
    // ...
    this.$store.commit('changeNoMenu', true);
    clearInterval(this.interval);
    this.interval = null;
    next();
  },
  filters:{
    // 支付账号
    filterAcco(val){
      let newData='';
      if(val && val.length>13){
        newData=val.slice(0,5)+'***'+val.slice(val.length-5);
      }else{
        newData=val;
      }
      return newData;
    }
  },
  methods: {
    handleCancel() {
      let that = this;
      that.toast = {
        type: 'operate',
        content: that.$t('poptip.orderDetail.cancelPoptip.content').replace('次', that.orderDetail.cancleCount+'次'),
        title: that.$t('poptip.orderDetail.cancelPoptip.title'),
        confirm: that.$t('poptip.orderDetail.cancelPoptip.enter'),
        assist: that.$t('poptip.orderDetail.cancelPoptip.cancel'),
        method: '3'
      };
      that.showToast = true;
    },
    mainClick() {
      this.showToast = false;
      if (this.toast.method === '6') {
        this.getDetail();
      }
      this.changeOrderStatus(this.toast.method);
    },
    assistClick() {
      this.showToast = false;
    },
    getorderdetailstatus() {
      let that = this;
      if(this.gopayFlag) return;
      this.gopayFlag = true;
      this.$axios({
        url: 'version/api/trade/getOrderDetail',
        params: {orderId: this.orderId, userId: decodeURIComponent(this.$getCookie('userId')) && JSON.parse(decodeURIComponent(this.$getCookie('userId'))).userId},
        method: 'get'
      }).then(res => {
        this.gopayFlag = false;
        let status = res.data.data.orderStatus;
        if(res.data.data.orderStatus !== '1'){
          that.toast = {
            type: 'operate',
            content: that.$t(that.orderPoptip[res.data.data.orderStatus-1]),
            title: '',
            confirm: that.$t('poptip.orderDetail.iKnow'),
            assist: '',
            method: '6'
          };
          that.showToast = true;
          return;
        } else {
          that.$loginRoute('/paydetail?id='+that.orderDetail.id);
        }
      }).catch(() => {
        this.gopayFlag = false;
        that.toast = {
            type: 'operate',
            content: that.$t('otherWT.orderqueFa'),
            title: '',
            confirm: that.$t('poptip.orderDetail.iKnow'),
            assist: '',
            method: '6'
          };
          that.showToast = true;
      })
    },
    handleShow(url) {
      let that = this;
      that.showImg = true;
      that.showImgSrc = url;
    },
    handlePay() {
      let that = this;
      this.getorderdetailstatus();
    },
    changeOrderStatus(status) {
      if (status === '6') {
        return;
      }
      let that = this,
        opt = {
          orderId: that.orderDetail.id,
          orderStatus: status,
          check:0,
          userId: (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId),
          payPassword: that.password||''
        },
        _status = status;
      if(status === '5') {
        opt.check = 1;  // 用户端释放币
      }
      that.$axios({
        url: 'version/api/trade/updateOrderStatus',
        method: 'post',
        data: opt
      }).then(function(res) {
        if (res.data.status === 200) {
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
          if (_status === '3') {
            that.$Toast(that.$t('poptip.orderDetail.cancelsuccess'));
          } else if (_status === '4') {
            that.$Toast(that.$t('poptip.orderDetail.overPayOrder'));
          } else if (_status === '5') {
            that.$Toast(that.$t('poptip.orderDetail.releaseSuccess'));
            that.showDetailPopup = false;
          }
          that.getDetail();
        }
      })
    },
    goBack() {
      this.$router.push({path: '/orderRecord'});
    },
    turnCountDown(val) {
      let m = parseInt(val / (60 * 1000)),
        s = parseInt((val - m * 60 * 1000) / 1000);
      if (val > 0) {
        return m + this.$t('poptip.orderDetail.minute') + ' ' + s + this.$t('poptip.orderDetail.second');
      } else {
        this.getDetail();
        clearInterval(this.interval);
        this.interval = null;
        return this.$t('poptip.orderDetail.overTime');
      }
    },
    getDetail() {
      let that = this;
      that.$axios({
        url: 'version/api/trade/getOrderDetail',
        params: {orderId: that.orderId, userId: (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId)},
        method: 'get'
      }).then(function(res) {
        let _data = res.data;
        if (_data.code === '001') {
          that.$loginRoute('/home');
          return;
        }
        if (_data.status === 200) {
          that.orderDetail = {
            overTime: (_data.data.updateTime > _data.data.currentTime ? that.turnCountDown(_data.data.updateTime - _data.data.currentTime) : that.$t('poptip.orderDetail.overTime')),
            status: parseInt(_data.data.orderStatus),
            totalMoney: _data.data.totalMoney,
            price: _data.data.usdtPrice,
            num: _data.data.usdtNum,
            bankTitle: _data.data.toBank,
            bankBranche: _data.data.toBankBranche,
            username: _data.data.payWay === '1' ? _data.data.toBankName : _data.data.toName,
            card: _data.data.toBankNum || _data.data.toAccount,
            id: _data.data.orderId,
            number: _data.data.orderNum,
            createTime: _data.data.createTime,
            payWay: _data.data.payWay,
            collectionQrCode: _data.data.toPayImg,
            type: _data.data.orderType,
            cancleCount: _data.data.cancleCount,
            currentTime: _data.data.currentTime,
            cancleReason: _data.data.cancleReason,
            voucher: _data.data.voucher,
            payVoucher: _data.data.payVoucher,
            // 已经加速
            payNum:_data.data.payNum,
            fromName:_data.data.fromName,
            fromAccount:_data.data.fromAccount,
          }
          if (_data.data.updateTime > _data.data.currentTime && _data.data.orderStatus === '1' && !that.interval) {
            that.interval = setInterval(function() {
              that.orderDetail.currentTime += 1000;
              that.orderDetail.overTime = that.turnCountDown(_data.data.updateTime - that.orderDetail.currentTime);
            }, 1000);
          }
        }
      })
    },
    handleClosePopup() {
      this.showDetailPopup = false;
      this.password = "";
    },
    handleRelease() {
      let that = this;
      if (!that.password.trim()) {
        that.$Toast(that.$t('poptip.orderDetail.enterPassword'));
        return;
      }
      if (!that.readRadio) {
        that.$Toast(that.$t('poptip.orderDetail.enterPoptip'));
        return;
      }
      that.changeOrderStatus('5');
    },
    // 加速到下一步
    gotoSpeed(){
      this.$loginRoute('/uploadVoucher/'+this.orderId+'/'+this.checkOutShow+'/'+ this.orderDetail.payWay);
    }
  }
}
</script>

<style lang="scss" scoped>
.order-detail {
  .detail-header {
    padding: 50px 23px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .header-left {
      text-align: left;
      & > .p1{
        margin-bottom: 12px;
        height: 45px;
        line-height: 45px;
        font-size: 45px;
        color: #262626;
      }
      & > .p2 {
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
    margin: 0 auto 10px;
    padding-bottom: 10px;
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
      }
      & > img {
        // width: 53px;
        width: auto;
        height: 53px;
      }
    }
  }
  .reason-item {
    margin: 20px;
    padding: 20px;
    background-color: #fff;
    border-radius: 20px;
    text-align: left;
    & > p:first-child {
      font-size: 28px;
      color: #a5a5a5;
      margin-bottom: 10px;
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
    font-size: 34px;
    z-index: 1000;
    .detail-btn {
      flex: 1;
      background-color: #fff;
      color: #b0b0b0;
    }
    .detail-btn-active {
      background-color: #3e80ca;
      color: #fff;
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
  .recharge-poptip {
    padding: 0 40px 110px;
    text-align: left;
    background-color: #f8f8f8;
    color: #929292;
    font-size: 24px;
    .recharge-poptip-head {
      padding: 18px 0;
    }
    .recharge-poptip-item {
      position: relative;
      padding: 3px 0;
      text-indent: 1em;
      line-height: 50px;
    }
    .recharge-poptip-item:before {
      content: "*";
      position: absolute;
      left: -20px;
      top: 7px;
      text-align: left;
      color: red;
    }
  }
}
.top-popAdd{
  display: flex;
  flex-direction: column;
  margin-left: 27px;
  margin-right: 46px;
  padding-top: 46px;
  color: rgb(32,32,37);
  .head-addP{
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 34px;
    img{
      width: 34px;
      height: 34px;
    }
  }
  p{
    color: rgb(216,118,117);
    text-align: left;
    font-size: 24px;
    margin-top: 29px;
    margin-bottom: 37px;
  }
}
.mass-pos{
  height: 129px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 16px;
  color: rgb(109,109,109);
  font-size: 34px;
  border-top: 2px solid rgb(220,220,220);
  .left-qwe{
    display: flex;
    align-items: center;
    margin-left: 11px;
    img{
      width: 36px;
      height: 42px;
      margin-right: 37px;
    }
    .imgTwo{
      width: 43px;
      height: 38px;
    }
  }
  .order-chec{
    width: 34px;
    height: 34px;
    border: 2px solid rgb(62,128,202);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    div{
      width: 22px;
      height: 22px;
      background-color: rgb(62,128,202);
      border-radius: 50%;
    }
  }
}
.btn-poT{
  height: 100px;
  display: flex;
  justify-content: space-between;
  div{
    flex: 1;
    background-color: rgb(248,248,248);
    font-size: 34px;
    color: rgb(166,166,166);
    line-height: 100px;
  }
  div:nth-child(2){
    background-color: rgb(62,128,202);
    color: white;
  }
}
</style>
