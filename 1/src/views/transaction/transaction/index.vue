<template>
  <div class="transaction-box">
    <div class="transaction">
      <DrawerLeft v-model="drawerShow" ></DrawerLeft>
      <Header @click="test" :showHeader='showHeader' :tabs='tabs' :coin='coinType' :coinTitle='coinTitle' :tabbarActive='2' :tabbarType='tabbarType'/>
      <div class="transaction-info">
        <router-view></router-view>
      </div>
    </div>
    <!-- 爆仓预警弹窗 -->
    <toast 
      :showToastType="'operate'" 
      :showToastImgType="'boom'" 
      :toastTitle="$t('trade.boomWarn')" 
      :isShow='toastShow'
      :toastOperateTitle="$t('trade.goLook')" 
      @handle-main-click="mainClick" 
      :toastAssistOperateTitle="$t('poptip.quickTrans.iKnow')" 
      @handle-assist-click="toastShow = false"
    >
      <span class="boom-toast" slot='pcontent'>{{$t('trade.bombWarnTitle')}}</span>
      <!-- <ul class='transaction-boom'>
        <li v-for='(item,index) in 3' :key='index'>
          <span>{{index}}</span><span>XBTC</span><span>131232 USDT</span>
        </li>
      </ul> -->
    </toast>
    <!-- 第一次登录时合约提示信息 -->
      <!-- :="'温馨提示您，CG交易所永续合约交易为 全仓模式，请时刻关注您的资产余额。'" -->
    <toast
      :showToastType="'operate'"
      :isShow='countTip'
      :showToastImgType="'warning'"
      :toastTitle="$t('trade.ImportantTips')"
      :toastOperateTitle="$t('poptip.quickTrans.iKnow')"
      @handle-main-click="countTipHandle"
    ><span slot='pcontent'>{{$t('trade.sustainable')}} <span style="color:red">{{$t('trade.fullModel')}}</span>{{$t('trade.followBalance')}}</span></toast>
    <!-- 合约爆仓提示 -->
    <toast
      :showToastType="'operate'"
      :showToastImgType="'warning'"
      :isShow='boomed'
      :toastTitle="$t('trade.bombedTitle')"
      :toastOperateTitle="$t('poptip.quickTrans.iKnow')"
      @handle-main-click="boomed = !boomed"
    >
      <span class="boom-toast" slot='pcontent'>
        {{$t('trade.GQGplatform')}}
        <span style="color:red">{{$t('trade.allsustainable')}}</span>
        {{$t('trade.bombed')}}
      </span>
    </toast>
  </div>
</template>

<script>

import Header from './header.vue'
import {getCoinInfoNew, getUserCollect} from '../request.js'
import DrawerLeft from './drawerLeft.vue'
export default {
  components:{
    Header,
    DrawerLeft,
  },
  data() {
    let that = this;
    return {
      drawerShow: false,
      showHeader: 1,
      tabbarType: true,
      coinTitle: '',
      userId: '',
      wsTimer: null,
      toastShow: false,
      boomed: false,  // 已经爆了
      countTip: false,
      ws: null,
      wsTimerReload: null,
      tabs:[
          {name: that.$t('trade.holdShares'),path:'/holdShares' ,id: 'holdShares'},
          {name: that.$t('trade.entrust'),path:'/entrust' ,id: 'entrust'},
          {name: that.$t('trade.profitLoss'),path:'/profitLoss' ,id: 'profitLoss'},
          {name: that.$t('trade.history'),path:'/history' ,id: 'history'},
        ],
    }
  },
  computed: {
    coinType() {
      return  this.$route.params.icon
    } 
  },
  watch: {
    '$route' (to) {
        this.changeHander(to);
      },
      boomed(val) {
        if(val) {
          let timer = setTimeout(() => {
            this.boomed = false;
            clearTimeout(timer)
          }, 5000)
        }
      },
      drawerShow(val) {
        if(val) {
          this.$overflowScrolling(false);
        } else {
          setTimeout(() => {
              this.$overflowScrolling(true);
          }, 300)
        }
      },
      toastShow(val) {
        if(val) {
          let timer = setTimeout(() => {
            this.toastShow = false;
            clearTimeout(timer)
          }, 5000)
        }
      },
  },
  methods: {
    test() {
      this.drawerShow = true;
    },
    mainClick() {
      // 报仓预警查看
      this.toastShow = false;
      this.$router.push('/transaction/all/general');
    },
    webSocketHandle() {
      let that = this;
      this.ws = new WebSocket(this.$interfaceJavaWss+'/user/websocket/'+this.userId);
      that.ws.onopen = function() {
        clearInterval(that.wsTimerReload);
        that.wsTimer = setInterval(() =>{
          that.ws.send('ping'); // 发送爆仓预警消息
        }, 30000)
      }
      this.ws.onmessage =(e) => {
        // console.log(e.data,'21212121爆仓预警')
        // this.ws.send(this.userId+'_8080') // 发送爆仓预警消息
        let needWain = (localStorage.getItem('wainS') === 'true') // 系统设置需要爆仓
        switch (Number(e.data)) {
          case 1:
            this.ws.send(this.userId+'_'+e.data) // 发送爆仓预警消息
            if(needWain) {
              if(this.boomed) {
                let timer =  setTimeout(() => {
                  this.toastShow = true;
                  clearTimeout(timer);
                }, 5000)
              } else {
                this.toastShow = true;
              }
            }
            this.$store.commit('boomWarningChange', true);
            break;
          case 2:
            this.ws.send(this.userId+'_'+e.data) // 发送爆仓预警消息
            if(needWain) {
              if(this.boomed) {
                let timer =  setTimeout(() => {
                  this.toastShow = true;
                  clearTimeout(timer);
                }, 5000)
              } else {
                this.toastShow = true;
              }
            }
            this.$store.commit('boomWarningChange', true);
            break;
          case 3:
            this.ws.send(this.userId+'_'+e.data) // 发送爆仓预警消息
            if(needWain) {
              if(this.toastShow) {
                let timer =  setTimeout(() => {
                  // this.toastShow = true;
                  this.boomed = true;
                  clearTimeout(timer);
                }, 5000)
              } else {
                this.boomed = true;
              }
            }
            this.$store.commit('boomWarningChange', false);
            break;
          case 4:
            this.ws.send(this.userId+'_'+e.data) // 发送爆仓预警消息
            this.$store.commit('boomWarningChange', false);
            break;
          default:
            break;
        }
      }
      that.ws.onclose = function() {
        that.wsTimer && clearInterval(that.wsTimer);
      }
    },
    getUserCoinInfo() {
      let pageNum = 100,
          currentPage = 1,
          userId = this.userId,
          data = {userId, pageNum, currentPage};
      getUserCollect(data)
      .then(res => {
        // 获取用户自选币种，并判断当前币种是否自选
        if(res.data.status === 200) {
          let name = this.$route.params.icon;
          let item = this.filterCoinHandle(res.data.data.list, name);
          if(!item) return;
          // localStorage.setItem('actionIcon',JSON.stringify(item));
          // this.$store.commit('changeActionCoin', item);
        }
      }).catch(() => {})
    },
    filterCoinHandle(arr, name = 'xbtc_usdt') {
      if(!(arr instanceof Array)) return arr; //如果不是数组，返回原数据
      return arr.filter( item => {
        return item.name === name
      })[0]
    },
    usdtNewHandle(){
        // 获取合约币种信息
      getCoinInfoNew({})
      .then(res => {
        let name = this.$route.params.icon;
        localStorage.setItem('coinInfo', JSON.stringify(res.data));
        let item =  this.filterCoinHandle(res.data.extendCoinArr, name);
        localStorage.setItem('change',item.change)
        // if(!item) return;
        // localStorage.setItem('actionIcon',JSON.stringify(item));
        // this.$store.commit('changeActionCoin', item);
        if(this.userId) {
          // 如果用户登录，获取用户自选币种
          this.getUserCoinInfo();
        }
      }).catch(() => {})
    },
    changeHander(to) {
      let status = 0;
      if(to.name === 'transactionOrder'){
        status = 4;
        this.tabbarType = false;
      } else if(to.name === 'transactionHistory'){
        status = 3;
        this.tabbarType = false;
      } else if(to.params.icon === 'all') {
        status = 2;
        this.tabbarType = true;
      } else {
        this.tabbarType = true;
        status = 1;
      }
      this.showHeader = status;
    },
    countTipHandle() {
      this.countTip = false;
      localStorage.setItem('countTip', true)
    },
  },
  beforeRouteEnter(to, from, next) {
    next( vm => {
      vm.userId = vm.$getCookie('userId') && JSON.parse(decodeURIComponent(vm.$getCookie('userId'))).userId;
      vm.usdtNewHandle();
      vm.changeHander(to);
      vm.coinTitle = to.params.icon.toUpperCase().replace('_', '/');
      if(vm.userId) {
        vm.countTip = !(localStorage.getItem('countTip'));
        vm.webSocketHandle();
        vm.wsTimerReload = setInterval(() => {
          if(vm.ws && (vm.ws.readyState !== 1)) {
            vm.ws.close();
            vm.webSocketHandle();
          }
        }, 3000)
      }
    })
  },
  beforeRouteUpdate(to, from, next) {
    this.coinTitle = to.params.icon.toUpperCase().replace('_', '/');
    setTimeout(() => {
      this.$overflowScrolling(true);
    }, 300)
    if(!to.redirectedFrom || (!to.redirectedFrom.includes('foo'))) {
      next();
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('changeLoading', false);
    this.ws && this.ws.close();
    clearInterval(this.wsTimer);
    this.wsTimerReload && clearInterval(this.wsTimerReload)
    setTimeout(() => {
      this.$overflowScrolling(true);
    }, 300)
    next();
  }
}
</script>

<style lang='less' scoped>
.transaction-box{
  height: auto;
  max-height: 100%;
  overflow: hidden;
  background: #fff;
  flex: 1;
  display: flex;
  flex-direction: column;
  // padding-bottom: 100px;
  // padding-bottom: 300%;
  // box-sizing: border-box;
}
.transaction{
  overflow: auto;
  display: flex;
  flex: 1;
  flex-direction: column;
  height: auto;
  max-height: 100%;
  // XXX 订单记录，未知原因超出一部分 ， 暂时找不出原因
  overflow-x: hidden;
  &-info{
    overflow-y: auto;
    flex: 1;
  }
}
.transaction-boom{
  li{
    span{
      border-top:1px solid red;
      // border:1px solid red;
      border-left:1px solid red;
      padding: 10px 38px;
      display: inline-block;
      &:first-child{
        padding: 10px 18px;
      }
      &:last-child{
        border-right:1px solid red;
      }
    }
    &:last-child{
      span{
        border-bottom:1px solid red;
      }
    }
  }
}
.boom-toast {
  font-size: 24px;
  text-align: left !important;
}

</style>
<style lang='less'>
.no-data {
    padding-top: 135px;
    & > img {
      width: 135px;
      height: 129px;
    }
    & > p {
      margin-top: 25px;
      font-size: 24px;
      color: #575757;
    }
  }
  .lxa-bottom-btn{
    height: 100px;
    width: 100%;
    background: #3e80ca;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 0;
    button{
        height: 100%;
        width: 100%;
        border: 0;
        outline: none;
        background: Transparent;
        font-size: 34px;
        letter-spacing: 0px;
        color: #ffffff;
    }
    &.disable {
        background: #dfdfdf;
    }
}
</style>