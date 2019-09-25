<template>
  <div class="transaction-box">
      <DrawerLeft v-model="drawerShow" ></DrawerLeft>
    <div class="transaction">
      <Header 
        @click="test" 
        :showHeader='showHeader' 
        :tabs='tabs' 
        :coin='coinType' 
        :coinTitle='coinTitle'
        type='trade' 
        :tabbarActive='2' 
        :tabbarType='tabbarType'/>
      <div class="transaction-info">
        <router-view></router-view>
      </div>
    </div>
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
      countTip: false,
      tabs:[
          {name: that.$t('entrust.buy'),path:'/tradebuy' ,id: 'tradebuy'}, // 买入
          {name: that.$t('entrust.sell'),path:'/tradesell' ,id: 'tradesell'}, // 卖出
          {name: that.$t('trade.entr'),path:'/tradeentrust' ,id: 'tradeentrust'}, // 委托
          {name: that.$t('trade.history'),path:'/history' ,id: 'history'}, // 历史
        ],
    }
  },
  watch: {
    '$route' (to) {
      this.changeHander(to);
    },
  },
  computed: {
    coinType() {
      return  this.$route.params.icon
    } 
  },
  methods: {
    test() {
      this.drawerShow = true;
    },
    countTipHandle() {
      this.countTip = false;
      localStorage.setItem('countTip', true)
    },
    changeHander(to) {
      let status = 0;
      if(to.name === 'tradeOrder'){
        status = 4;
        this.tabbarType = false;
      } else if(to.name === 'tradeHistory'){
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
  },
  beforeRouteEnter(to, from, next) {
    next( vm => {
      vm.userId = vm.$getCookie('userId') && JSON.parse(decodeURIComponent(vm.$getCookie('userId'))).userId;
      vm.coinTitle = to.params.icon.toUpperCase().replace('_', '/');
      vm.changeHander(to);
      localStorage.setItem('trade_symbol',JSON.stringify(to.params.icon));
    })
  },
  beforeRouteUpdate(to, from, next) {
    this.coinTitle = to.params.icon.toUpperCase().replace('_', '/');
    if(!to.redirectedFrom || (!to.redirectedFrom.includes('foo'))) {
      next();
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('changeLoading', false);
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