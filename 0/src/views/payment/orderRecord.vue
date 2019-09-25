<template>
  <div class="order-record" ref="order-record" @scroll="handleScroll">
    <div class="common-header">
      <img src="../../assets/img/common/previous_page.png" alt="" @click="$router.push({path: '/quickTrans/buy'});$store.commit('changeNoMenu', true);"/>
      <img class="order-record-img" src="../../assets/img/payment/filter.png" alt="" @click="showFilter=!showFilter"/>
    </div>
    <div class="common-header-h" v-bind:class="{'order-record-shade': showFilter}">
      <div class="order-record-title">
        <p v-text="$t('orderRecord.title')"></p>
        <div v-show="showFilter" class="order-filter">
          <div class="order-record-filter">
            <p v-text="$t('orderRecord.dealType.title')"></p>
            <div class="order-record-type">
              <div :class="['order-record-item', {'order-record-active': orderRecordType === 'buy'}]" @click="orderRecordType='buy';" v-text="$t('orderRecord.dealType.buy')"></div>
              <div :class="['order-record-item', {'order-record-active': orderRecordType === 'sell'}]" @click="orderRecordType='sell';" v-text="$t('orderRecord.dealType.sell')"></div>
              <div :class="['order-record-item', {'order-record-active': orderRecordType === 'all'}]" @click="orderRecordType='all';" v-text="$t('orderRecord.dealType.all')"></div>
            </div>
            <p v-text="$t('orderRecord.orderStatus.title')"></p>
            <div class="order-record-status">
              <div :class="['order-record-item', {'order-record-active': orderRecordStatus === 'unpaid'}]" @click="orderRecordStatus='unpaid';" v-text="$t('orderRecord.orderStatus.unpaid')"></div>
              <div :class="['order-record-item', {'order-record-active': orderRecordStatus === 'toBeReleased'}]" @click="orderRecordStatus='toBeReleased';" v-text="$t('orderRecord.orderStatus.toBeReleased')"></div>
              <div :class="['order-record-item', {'order-record-active': orderRecordStatus === 'overed'}]" @click="orderRecordStatus='overed';" v-text="$t('orderRecord.orderStatus.overed')"></div>
              <div :class="['order-record-item', {'order-record-active': orderRecordStatus === 'canceled'}]" @click="orderRecordStatus='canceled';" v-text="$t('orderRecord.orderStatus.canceled')"></div>
              <div :class="['order-record-item', {'order-record-active': orderRecordStatus === 'paymenting'}]" @click="orderRecordStatus='paymenting';" v-text="$t('orderRecord.orderStatus.paymenting')"></div>
              <div :class="['order-record-item', {'order-record-active': orderRecordStatus === 'all'}]" @click="orderRecordStatus='all';" v-text="$t('orderRecord.orderStatus.all')"></div>
            </div>
          </div>
          <div class="filter-footer">
            <div class="filter-item" v-text="$t('orderRecord.cancel')" @click="showFilter=false;"></div>
            <div class="filter-item filter-item-active" v-text="$t('orderRecord.confirm')" @click="chengeBtnClick"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="orderRecordList.length" class="all-order-record">
      <div class="order-record-item" :style="{border: (index === orderRecordList.length -1) ? 'none' : ''}" v-for="(item, index) in orderRecordList" :key="index" @click="handleDetail(item.orderId)">
        <div class="order-record-top">
          <div class="top-left">
            <span v-text="item.type === 'buy' ? $t('orderRecord.item.buy') : $t('orderRecord.item.sell')"></span>
            <span v-text="item.currency"></span>
          </div>
          <div class="top-right">
            <img :src="(item.status === 'canceled' || item.status === 'overed') ? require('../../assets/img/payment/overRead.png') : require('../../assets/img/payment/notRead.png')" alt />
            <span v-text="$t(orderStatus[item.statusOld-1])"></span>
            <img src="../../assets/img/payment/turnRightList.png" alt />
          </div>
        </div>
        <div class="order-record-info">
          <div class="info-top">
            <span v-text="$t('orderRecord.item.time')"></span>
            <span v-text="$t('orderRecord.item.num') + '(' + item.currency + ')'"></span>
            <span v-text="$t('orderRecord.item.totalAmount') + '(CNY)'"></span>
          </div>
          <div class="info-bottom">
            <span>{{item.time | date('hh:mm MM/dd')}}</span>
            <span v-text="item.num"></span>
            <span v-text="item.totalAmount"></span>
          </div>
        </div>
        <!-- <div class="order-record-username" v-text="item.userName"></div> -->
      </div>
      <div>
        <load-more v-show="loadingStatus === 1" :tip="$t('load.ing')"></load-more>
        <load-more v-show="loadingStatus === 2" :show-loading="false" :tip="$t('load.noMore')" background-color="#fbf9fe"></load-more>
      </div>
    </div>
    <div v-show="!orderRecordList.length" class="no-detail">
      <img src="../../assets/img/assets/noData.png" alt/>
      <p>{{$t('poptip.orderRecord.noDetail')}}</p>
    </div>
  </div>
</template>

<script>
import { LoadMore } from 'vux'
export default {
  components: {
    LoadMore
  },
  data() {
    return {
      orderRecordType: 'all',
      orderRecordStatus: 'all',
      showFilter: false,
      orderRecordList: [],
      page: {
        currency: 1,
        total: 10,
        noMore: false
      },
      typeDesc: ['buy', 'sell'],
      statusDesc: ['unpaid', 'paymenting', 'canceled', 'toBeReleased', 'overed'],
      loadingStatus: 0,
      isLoading: false,
      orderStatus: ['orderRecord.orderStatus.unpaid', 'orderRecord.orderStatus.paymenting', 'orderRecord.orderStatus.canceled', 'orderRecord.orderStatus.toBeReleased', 'orderRecord.orderStatus.overed']
    }
  },
  beforeRouteEnter (to, from, next) {
    // ...
    next(vm => {
      if (decodeURIComponent(vm.$getCookie('userId')) && JSON.parse(decodeURIComponent(vm.$getCookie('userId'))).userId) {
        vm.$store.commit('changeNoMenu', false);
        vm.getOrderRecordList();
      } else {
        vm.$loginRoute('./orderRecord');
      }
    })
  },
  beforeRouteLeave (to, from, next) {
    // ...
    this.$store.commit('changeNoMenu', true);
    next();
  },
  methods: {
    handleDetail(id) {
      this.$loginRoute('./orderDetail/' + id);
    },
    handleScroll () {
      let that = this,
        scroll = that.$refs['order-record'],
        scrollTop = scroll.scrollTop,
        scrollHeight = scroll.scrollHeight,
        clientHeight = scroll.clientHeight;
      if (clientHeight + scrollTop === scrollHeight) {
        scroll.scrollTop -= 1;
        if (that.page.noMore) {
          that.loadingStatus = 2;
          setTimeout(function() {
            that.loadingStatus = 0;
          }, 2000);
        } else {
          that.loadingStatus = 1;
          that.page.currency += 1;
          that.getOrderRecordList();
        }
      }
    },
    getOrderRecordList() {
      let that = this,
        opt = {
          userId: (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId),
          page: that.page.currency,
          records: that.page.total
        };
      if (!that.isLoading) {
        that.isLoading = true;
        opt.orderType = that.typeDesc.indexOf(that.orderRecordType) === -1 ? "" : (that.typeDesc.indexOf(that.orderRecordType) + 1);
        opt.orderStatus = that.statusDesc.indexOf(that.orderRecordStatus) === -1 ? "" : (that.statusDesc.indexOf(that.orderRecordStatus) + 1);
        that.$axios({
          url: 'version/api/trade/getUserOrder',
          method: 'get',
          params: opt
        }).then(function(res) {
          let _data = res.data;
          if (_data.status === 200) {
            that.page.currency === 1 && (that.orderRecordList = []);
            if (_data.data !== '[]') {
              let result = _data.data.map(item => {
                return {
                  type: (item.orderType === '1' ? 'buy' : 'sell'),
                  currency: item.coinType.toUpperCase(),
                  status: that.statusDesc[parseInt(item.orderStatus)-1],
                  statusOld: parseInt(item.orderStatus),
                  time: item.createTime,
                  num: item.usdtNum,
                  totalAmount: item.totalMoney,
                  orderId: item.orderId
                }
              })
              if (_data.data.length < that.page.total) {
                that.page.noMore = true;
              }
              that.orderRecordList = that.orderRecordList.concat(result);
              that.loadingStatus = 0;
              that.isLoading = false;
              return;
            }
            that.isLoading = false;
            that.page.noMore = true;
          }
        })
      }
    },
    // 订单筛选
    chengeBtnClick(){
      this.page.currency=1;
      this.page.noMore=false;
      this.getOrderRecordList();
      this.showFilter=false;
    }
  }
}
</script>

<style lang="scss" scoped>
.order-record {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: scroll;
  .common-header-h{
    border-bottom: 1px solid #dcdcdc;
  }
  .order-record-shade {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.6);
    z-index: 900;
  }
  .order-record-title{
    position: relative;
    padding-top: 80px;
    height: auto;
    background-color: #fff;
    text-align: left;
    & > p {
      margin: 50px 26px 0;
      padding-bottom: 50px;
      height: 45px;
      line-height: 45px;
      color: #202025;
      font-size: 45px;
      box-sizing: content-box;
    }
    .order-filter {
      position: absolute;
      background-color: #fff;
      z-index: 1000;
      .order-record-filter {
        margin: 0 15px;
        padding: 50px 10px 90px;
        // border-top: solid 1PX #6d6d6d;
        box-sizing: content-box;
        & > p {
          height: 33px;
          line-height: 33px;
          font-size: 34px;
        }
        .order-record-type, .order-record-status {
          margin-bottom: 45px;
          .order-record-item {
            margin: 45px 40px 0 0;
            display: inline-block;
            width: 199px;
            height: 71px;
            line-height: 71px;
            border-radius: 10px;
            border: solid 1PX #a0a0a0;
            font-size: 28px;
            color: #575757;
            text-align: center;
          }
          .order-record-item:nth-child(3n+3) {
            margin: 0;
          }
          .order-record-active {
            border-color: #3e80ca;
            color: #3e80ca;
          }
        }
      }
      .filter-footer {
        display: flex;
        text-align: center;
        .filter-item {
          height: 100px;
          line-height: 100px;
          flex: 1;
          background-color: #f8f8f8;
          color: #a6a6a6;
          font-size: 34px;
        }
        .filter-item-active {
          background-color: #3e80ca;
          color: #fff;
        }
      }
    }
  }
  .all-order-record {
    background-color: #fff;
    text-align: left;
    .order-record-item {
      margin: 0 16px;
      padding: 30px 11px;
      border-bottom: solid 1PX #dcdcdc;
      .order-record-top {
        margin-bottom: 42px;
        display: flex;
        justify-content: space-between;
        .top-left {
          height: 35px;
          line-height: 35px;
          font-size: 34px;
          color: #545454;
          font-weight: bold;
          & > span:first-child {
            color: #3e80ca;
          }
        }
        .top-right {
          & > img:first-child {
            margin-right: 15px;
            width: 12px;
            height: 12px;
            vertical-align: middle;
          }
          & > span {
            margin-right: 18px;
            height: 28px;
            line-height: 28px;
            font-size: 28px;
            color: #3e80ca;
            vertical-align: middle;
          }
          & > img:last-child {
            width: 11px;
            height: 19px;
            vertical-align: middle;
          }
        }  
      }
      .order-record-info {
        margin-bottom: 30px;
        .info-top {
          display: flex;
          margin-bottom: 30px;
          height: 22px;
          line-height: 22px;
          font-size: 22px;
          color: #cacaca;
          & > span {
            flex: 1;
          }
          & > span:last-child {
            text-align: right;
          }
        }
        .info-bottom {
          display: flex;
          font-size: 28px;
          color: #8d8d8d;
          height: 26px;
          line-height: 26px;
          & > span {
            flex: 1;
          }
          & > span:last-child {
            text-align: right;
            color: #3e80ca;
          }
        }
      }
      .order-record-username {
        height: 24px;
        line-height: 24px;
        font-size: 24px;
        color: #1f1f1f;
      }
    }
  }
  .no-detail {
    position: relative;
    padding-top: 300px;
    height: 100%;
    background-color: #fff;
    & > img {
      width: 151px;
      height: 144px;
    }
    & > p {
      margin-top: 23px;
      height: 26px;
      line-height: 26px;
      font-size: 26px;
      color: #797979;
    }
  }
}
</style>
