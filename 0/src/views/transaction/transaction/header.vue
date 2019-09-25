<template>
  <div class="tr-box">
    <div class="transaction-herder-box" v-if="showHeader !== 3">
      <div id="header" :class="showHeader === 3 || showHeader === 4 ? '' : 'border-b'">
        <div class="top" v-if="showHeader === 1">
          <div class="leftbox">
            <img @click="topLeftHandle" src="../../../assets/img/transaction/swtich.png">
            <span>{{coinTitle || 'BTC/USDT'}}</span>
          </div>
          <div class="rightbox">
            <img @click="goklinHandle" src="../../../assets/img/transaction/kline.png">
            <img @click="addCollectHandle" v-if='!isCollect' src="../../../assets/img/transaction/collection.png">
            <img @click="removeCollectHandle" v-else src="../../../assets/img/quotation/overCollection.png">
            <img v-show="false" @click="goHistory" src="../../../assets/img/transaction/optional.png">
          </div>
        </div>
        <div class="top" v-if="showHeader === 2">
          <div class="leftbox">
            <img @click="topLeftHandle" src="../../../assets/img/transaction/swtich.png">
            <span>{{'全部'}}</span>
          </div>
          <div class="rightbox">
            <span @click="$router.push('/setting/playRoule')">{{$t('userDrawer.menu.playRoule')}}</span>
            <img v-show="false"  @click="goHistory" src="../../../assets/img/transaction/optional.png">
          </div>
        </div>
        <div class="top goBack" v-if="showHeader === 3 || showHeader === 4">
          <div class="leftbox" @click="goBack">
            <img src="../../../assets/img/transaction/arrow_left.png">
          </div>
          <div v-if="showHeader === 3" class="history-coin">USDT</div>
          <div v-if="showHeader === 4" class="title">{{$t('orderRecord.detail.title')}}</div>
          <div v-if="showHeader === 3" class="rightbox">
            <img src="../../../assets/img/transaction/choose.png">
          </div>
        </div>
        <div v-if="tabbarType" class="tabbar">
          <p v-for="(item) in tabsRender" @click="toggle(item)" :key="item.id" :class="{active:item.id==active}">
            {{item.name}}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {addCollect, getUserCollect, delCollect,getCoinInfoNew} from '../request.js'
export default {
    data(){
      let that = this;
        return{
        isCollect: false,
        userId: '',
        collectfalg: false,
        active: that.$route.name,
        coinTitle: '',
        collectId: '',
        addTabs1: [{name: that.$t('trade.transaction'),path:'/main' ,id: 'main'}],
        addTabs2: [{name: that.$t('trade.general'),path:'/general' ,id: 'general'}],
        languageList: {
          'zh-cn': 0,
          'zh-tw': 1,
          'en-us': 2
        },
      }
    },
    props: {
      /* 
        @头部显示
        1: 具体币种，右边有三个图标
        2：全部持仓，右边是玩法规则
        3：历史记录筛选
        4：订单详情
      */
      showHeader: Number,
      tabbarActive: Number,
      tabbarType: Boolean,
      coin: String,
      tabs: Array,
      type: String, // 区分币币交易和 合约交易
      // coinTitle: String,
    },
    watch: {
    '$route' (to) {
        this.active = to.name;
        this.coinTitle = to.params.icon.toUpperCase().replace('_', '/');
      },
      coinTitle(val) {
        this.getUserCoinInfo()
      }
    },
    computed: {
      tabsRender() {
        if(this.type === 'trade') {
          return this.tabs
        }
        if(this.coin === 'all') {
          return this.addTabs2.concat(this.tabs)
        }
        return this.addTabs1.concat(this.tabs)
      },
      actionCoinSrore() {
        return this.$store.state.actionCoin || {}
      }
    },
    beforeMount() {
      // this.getUserCoinInfo();
    },
    created() {
      let userId = this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId'))).userId;
      this.userId = userId;
      this.coinTitle = this.$route.params.icon.toUpperCase().replace('_', '/');
    },
    methods:{
        toggle(toggle){
          let icon = this.$route.params.icon;
          this.active=toggle.id;
          let to_roter = toggle.path;
          if(this.type === 'trade') {
            if(toggle.id === "history") {
              this.$loginRoute(`/trade/${icon}${to_roter}`);
            } else {
              this.$router.push(`/trade/${icon}${to_roter}`);
            }
          } else {
            if(toggle.id === "history") {
              this.$loginRoute(`/transaction/${icon}${to_roter}`);
            } else {
              this.$router.push(`/transaction/${icon}${to_roter}`);
            }
          }
        },
        topLeftHandle() {
          this.$emit('click')
        },
        goBack() {
          this.$router.go(-1)
        },
        filterCoinHandle(arr, name = 'xbtc_usdt') {
          if(!(arr instanceof Array)) return arr; //如果不是数组，返回原数据
          return arr.filter( item => {
            return item.name === name
          })[0]
        },
        getUserCoinInfo() {
          if(!this.userId) return;
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
              if(item) {
                this.collectfalg = false;
                this.isCollect = !!(item.collectId);
                this.collectId = item.collectId;
              } else {
                // 没有自选币种
                this.usdtNewHandle();
                this.isCollect = false;
              }
            }
          }).catch(err => {
              this.collectfalg = false;
          })
        },
        // 获取合约币种
        usdtNewHandle(){
            getCoinInfoNew({})
            .then(res => {
                localStorage.setItem('coinInfo', JSON.stringify(res.data));
                let arr = res.data.extendCoinArr;
                let item = this.filterCoinHandle(arr, name);
                this.collectfalg = false
                if(!item) return;
                // this.collectfalg = false;
            })
        },
        // 去历史记录
        goHistory() {
          if(!this.userId) {
            this.$loginRoute(this.$route.path)
            return;
          }
          let icon = this.$route.params.icon;
          this.$router.push(`/transaction/${icon}/history`);
        },
        // 添加自选
        addCollectHandle() {
          if(!this.userId) {
            // this.$normalToast(this.$t('transaction.pleasecheck'),1000);
            this.$loginRoute(this.$route.path)
            return;
          }
          if(this.collectfalg) return;
          this.collectfalg = true;
          let userId = this.userId,
             title = this.coinTitle,
             name = this.$route.params.icon,
             unit = this.$PRICE_UNIT;
          // let { title, name, unit } = this.actionCoinSrore // 解构赋值
          let data = {  // 对象简写
            userId,
            title,
            name,
            unit
          }
          addCollect(data)
          .then(res => {
            if(res.data.status === 200 || res.data.code === '000') {
              this.$normalToast(this.$t('quotation.addOptionalSuccess'),1000);
              this.isCollect = true;
              this.getUserCoinInfo()
            } else{
              this.$normalToast(this.$t('quotation.addOptionalErr'),1000);
              this.collectfalg = false;
            }
          }).catch(() => {
            this.collectfalg = false;
          })
        },
        goklinHandle() {
          // 跳k线 
          // let path = 'transaction/xbtc_usdt/main' //this.$route.path
          this.viewMarketDetail(this.coinTitle, this.$route.params.icon, true, 'contract')
        },
        viewMarketDetail(coinTitle='XBTC/USDT', coinName='xbtc_usdt', isContract, path) {
          let that = this,
            ua = window.navigator.userAgent,
            userId = (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId),
            // select = that.optionalList.find(item => {return item.name === coinName}),
            collectId = that.collectId;
          if (/Native_iOS/.test(ua)) {
            that.$bridge.setupWebViewJavascriptBridge(function (bridge) {
              bridge.callHandler('jumpToNativeKlineVc', {
                coinTitle:coinTitle, 
                coinName:coinName, 
                language: that.languageList[that.$i18n.locale], 
                userId: userId, 
                collectId: collectId, 
                isCollected: !!collectId, 
                isContract: true,
                sessionId: window.sessionStorage.getItem('sessionId')}, function(res) {});
            });
            // that.$store.state.bridge.callHandler('jumpToNativeKlineVc', {coinTitle:coinTitle, coinName:coinName, language: that.languageList[that.$i18n.locale], userId: userId, collectId: collectId, isCollected: !!collectId, isContract: isContract}, function(res) {});
            return;
          } else if (/Native_Android/.test(ua)) {
            prompt("cg://web/klinepage?" + JSON.stringify({coinTitle:coinTitle, coinName:coinName, language: that.languageList[that.$i18n.locale], userId: userId, collectId: collectId, isCollected: !!collectId, isContract: true, sessionId: window.sessionStorage.getItem('sessionId')}),"");
            return;
          }
          window.location.href = this.$phpUrl + '/' + path + '/kline/market/' + coinName + '?lang=' + this.$i18n.locale
        },
        removeCollectHandle() {
          // return ;
          if(this.collectfalg) return;
          this.collectfalg = true;
          let userId = this.userId,
              collectId  = this.collectId,
              data = {
                collectId,
                userId
              }
          delCollect(data)
          .then(res => {
            if(res.data.status === 200 || res.data.code === '000') {
              this.$normalToast(this.$t('quotation.delOptionalSuccess'),1000);
              this.isCollect = false;
              this.collectfalg = false;
            } else {
              this.$normalToast(this.$t('quotation.delOptionalErr'),1000);
              this.collectfalg = false;
            }
          }).catch(() =>{
              this.collectfalg = false;
          })
        }
  }
};
</script>

<style lang="less" scoped>
.tr-box{
  position: sticky;
  z-index: 100;
  left: 0;
  top: 0; 
  background-color: rgb(255,255,255);
}
.transaction-herder-box{
  // padding-bottom: 34px;
  background: #fff;
}
#header {
  //顶部栏
  // background: #f8f8f8;
  
  &.border-b {
    border-bottom: 1px solid #dcdcdc;
  }
  padding-bottom: 34px; 
  .top {
    height: 44px;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    .leftbox {
      width: 255px;
      display: flex;
      height: 44px;
      justify-content: space-between;
      align-items: center;
      img {
        width: 42px;
        height: 36px;
      }
      span {
        width: 198px;
        line-height: 44px;
        font-size: 34px;
        color: #202025;
        font-family: "微软雅黑";
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        text-align: left;
      }
    }
    .rightbox {
      // width: 215px;
      // display: flex;
      // justify-content: space-between;
      text-align: right;
      img {
        margin-left: 35px;
        width: 36px;
        height: auto;
        vertical-align: middle;
        &:last-child{
          width: 30px;
        }
      }
      span{
        color: #3e80ca;
        font-size: 28px;
        vertical-align: middle;
      }
    }
  }
  .goBack{
    position: relative;
    .leftbox{
      width: 50px;
      // position: absolute;
      z-index: 99;
      padding-left: 20px;
      img{
        width: 19px;
        height: auto;
        // padding: 0 10px;
      }
    }
    .title{
      text-align: center;
      position: absolute;
      flex: 1;
      width: 100%;
      font-size: 34px;
      color: #202025;
      // margin: 0 auto;
    }
    .history-coin{
      flex: 1;
      text-align: left;
      line-height: 44px;
      font-size: 34px;
      color: #202025;
      font-weight: bold;
    }
  }
  .active{
      color: #202025;
      font-size:45px;
      height: 45px;
      line-height: 45px
  }
  //路由切换
  .tabbar {
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 65px;
    // margin-bottom: 34px;
    // height: 30px;
    overflow-x: scroll;
    display: flex;
    font-size: 30px;
    align-items: flex-end;
    a {
      color: #818181;
    }
    p{
      margin-right: 57px;
      // margin: 0 57px 0 57px;
      &:last-child{
        margin-right: 0;
      }
    }
  }
  hr{
      border: solid 1px #dcdcdc;
  }

}
</style>