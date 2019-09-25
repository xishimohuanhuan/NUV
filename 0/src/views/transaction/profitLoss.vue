<template>
  <div class="page">
    <TouchRefresh :onLoadMore='onLoad' :enableLoadMore='enableLoadMore' :showFooter='showFooter'>
      <div class="box">
        <ul>
          <li v-for="item in renderData" :key="item.id">
            <div class="top">
              <div class="top-left">
                <span :class="item.ord_side === 2 ? 'green':'red'">{{item.ord_side | sideFilter}}</span>
                <span>{{item.symbol | sybFilter}}</span>
                <span>{{ item.type | planFilter}}</span></div>
              <div class="top-right">
                <span>{{ item.ord_type | typeFilter}}</span>
                <span>{{ item.status | statusFilter}}</span>
                <img @click="clickCancel(item)" :src="item.status === 1?cex: feih" alt="">
              </div>
            </div>
            <div class="ctx">
              <ul>
                <li>
                  <h5>数量(USDT)</h5>
                  <p>{{item.ord_amount}}</p>
                </li>
                <li>
                  <h5>触发价格(USDT)</h5>
                  <p>{{item.trigger_price}}</p>
                </li>
                <li>
                  <h5>执行价格(USDT)</h5>
                  <p>{{item.ord_type === 1 ? item.ord_price :'--'}}</p>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </TouchRefresh>
    <div class="holdSh-login" v-if="statusShow">
      <div class="holdSh-img"></div>
      <P class="holdSh-check" v-text="statusTitle"></P>
      <div class="holdSh-lobtn" @click="gojymain" v-show='!uid' v-text="$t('holdShares.login')"></div>
    </div>
    <!-- <TransactionStatus 
      v-model="statusShow"
      className='gomain' 
      @btnclick="gojymain" 
      :title='statusTitle' 
      :btnShow='false'
      :btnval='statusBtn'
    ></TransactionStatus> -->

    <!-- 撤销订单弹窗 -->
    <toast 
        :isShow="showToast"
        :showToastType="'operate'" 
        toastContent="是否撤销" 
        :showToastImgType="'warning'" 
        toastTitle="撤销" 
        :toastOperateTitle="$t('holdShares.getit')" 
        :toastAssistOperateTitle="$t('holdShares.cancel')" 
        @handle-main-click="mainClick" 
        @handle-assist-click="showToast=false"
    />
  </div>
</template>

<script>
import TouchRefresh from "@/component/TouchRefresh";
import TransactionStatus from '@/component/transaction/transactionStatus.vue'

import {
  getEntrustList,
  cancelRevocation
} from './request.js'
import feih from '../../assets/img/transaction/feih.png'
import cex from '../../assets/img/transaction/cex.png'
export default {
  components: {
    TouchRefresh,
    TransactionStatus
  },
  data() {
    return {
      symbol: 'XBTC',
      enableLoadMore: true,   // 是否加载结束
      finished: false,
      totalNum: 0,
      uid: '',
      page: 1,
      size: 15,
      feih:feih,
      cex:cex,
      showToast: false,
      orderOpts: {},
      renderData: []
      // renderData: [1,2,3,4,5,6,7,8,9,10,11,12,13]
    }
  },
  created() {
    this.$store.commit('changeLoading', true);
    this.uid = this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId'))).userId;
    if(this.uid) {
      this.getListHandle();
    } else{
      this.$store.commit('changeLoading', false);
    }
  },
  filters: {
    sideFilter(val) {
      let arr = ['买跌','买涨'];
      return arr[val-1];
    },
    planFilter(val) {
      let arr = ['止盈','止损'];
      return arr[val-1];
    },
    typeFilter(val) {
      let arr = ['限价单','市价单'];
      return arr[val-1];
    },
    actionFilter(val) {
      let arr = ['未触发','已触发'];
      return arr[val-1];
    },
    statusFilter(val) {
      let arr = ['未触发', '已触发', '已成交', '已过期', '已撤销', '已撤销']
      return arr[val-1];
    },
    sybFilter(val) {
      if(!val) return;
      return val.split('_')[0].toUpperCase();
    }
  },
  
  computed: {
    // 是否显示尾部加载或加载完成
    showFooter() {
      return !!(this.renderData.length)
    },
    // 是否显示没有数据提示
    statusShow() {
      return !(this.renderData.length) && (!this.loading);
    },
    statusTitle() {
      return this.uid ? '暂 无 记 录' : '请登录后查看'
    },
    statusBtn() {
      return this.uid ? '去开仓' : '去登录'
    },
    // vuex的 加载中
    loading() {
      return this.$store.state.loading
    }
  },
  methods: {
    // 撤销按钮
    clickCancel(item) {
      if(item.status !== 1) return;
      this.orderOpts = item;
      this.showToast = true;
    },
    // 确认撤销
    mainClick() {
      this.cancelHandle(this.orderOpts);
      this.showToast =false;
    },
    // 撤销处理
    cancelHandle(item) {
      cancelRevocation({id:item.id,uid:this.uid}).then(res => {
        if(res.data.status === 200)  {
          this.$normalToast('撤销成功',2000);
        } else {
          this.$normalToast('撤销失败',2000);
        }
        return ;
      }).catch(() => {
        this.$normalToast('撤销失败',2000);
        return ;
      }).then(() => {
        this.page = 1,
        this.renderData = [];
        this.getListHandle();
      })
    },
    // 获取列表处理
    getListHandle() {
      let params = {
        symbol,
        uid: this.uid,
        crentPage:this.page,
        pageSize:this.size
      };
      let symbol = this.$route.params.icon;
      if(symbol != 'all') {
        params.symbol = symbol;
      }
      getEntrustList(params).then(res => {
        this.$store.commit('changeLoading', false);
        if(res.data.status === 200) {
          if(res.data.data.data) {
            this.totalNum = res.data.total;
            this.renderData = this.renderData.concat(res.data.data.data);
            if(this.renderData.length < res.data.data.total ) {
              this.page += 1;
            } else {
              this.finished = true; // 没有更多
              this.enableLoadMore = false;
            }
          }
        } else {
          this.$normalToast('获取数据失败',2000);
        }
      }).catch(err =>{
        this.$normalToast('获取数据失败',2000);
        this.$store.commit('changeLoading', false);
      })
    },
    // 上拉加载
    onLoad(fn) {
      let rule = this.totalNum <= this.renderData.length && (this.renderData.length !==0);
      if(!rule) {
        this.finished = true; // 没有更多
        this.enableLoadMore = false;
        return ;
      }
      this.loadMoreHandle(fn);
    },
    loadMoreHandle(fn) {
      fn && fn();
    },
    gojymain() {
      if(this.uid) {
        this.$router.push('/transaction/all/holdShares')
      } else{
        this.$loginRoute(this.$route.path);
      }
    }
  },
  beforeRouteLeave(to, from, next){
    this.$store.commit('changeLoading', false);
    next();
  },
}
</script>

<style lang='less' scoped>
.red{
  color: #d87675;
}
.green{
  color: #85bf85;
}
.page{
  padding-bottom: 100px;
}
.gomain{
  margin-top: 28%;
}
.box{
  &>ul{
    &>li{
      border-bottom: 1px solid #dcdcdc;    
      margin: 0 24px;
      padding: 44px 0;
    }
  }
}
.top{
  display: flex;
  justify-content: space-between;
  align-items: center;
  &-left{
    font-size: 34px;
    // font-weight: 600;
    span{
      margin-right: 20px;
      &:nth-child(2) {
        color: #545454;
      }
      &:nth-child(3) {
        color: #3e80ca;
      }
    }
  }
  &-right{
    font-size: 24px;
    span,img{
      vertical-align: middle;
      margin-left: 26px;      
    }
    img{
      width: 33px;
      height: 40px;
    }
  }
}
.ctx{
  &>ul{
    display: flex;
    justify-content: center;
    margin-top: 34px;
    &>li{
      height: 81px;
      flex: 1;
      text-align: left;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 24px;
      white-space: nowrap;
      &:nth-child(1){
        flex: 4;
      }
      &:nth-child(2){
        flex: 4;
      }
      &:nth-child(3){
        flex: 2;
      }
      &:last-child{
        text-align: right;
      }
      h5{
        color: #cacaca;
        font-weight: normal;
        font-size: 24px;
      }
      p{
        color: #8d8d8d;
      }
      &:last-child{
        p{
          color: #3e80ca;
        }
      }
    }
  }
}
.holdSh-login{
        position: absolute;
        width: 300px;
        height: 300px;
        top: 30%;
        left: 30%;
    }
    .holdSh-img{
        width: 200px;
        height: 200px;
        background: url("../../assets/img/transaction/norecord.png") no-repeat;
        background-size: 100% 100%;
        margin-left: 20%;
    }
    .holdSh-check{
        font-size: 28px;
        color:rgb(169,169,169);
        margin-top: 31px;
    }
    .holdSh-lobtn{
        width: 165px;
        height: 55px;
        font-size: 24px;
        background-color: rgb(62,128,202);
        color:rgb(255,255,255);
        line-height: 55px;
        border-radius: 11px;
        margin-top: 29px;
        margin-left: 20%;
    }

    // 没有数据显示的样式
    .holdSh-datano{
        position: absolute;
        top: 30%;
        left: 35%;
    }
    .holdSh-noimg{
        width: 200px;
        height: 200px;
        background: url("../../assets/img/transaction/norecord.png") no-repeat;
        background-size: 100% 100%;
        margin-left: 15%;
    }
    .holdSh-nodata{
        font-size: 28px;
        color:rgb(169,169,169);
        line-height: 47px;
        margin-top: 31px;
    }
</style>
