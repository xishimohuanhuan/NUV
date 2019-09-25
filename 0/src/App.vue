<template>
  <div id="app">
    <router-view/>
    <loading />
    <div v-if="timeDown">
            <!-- toastContent="<p style='text-align:left'>为了给用户带来更好的交易体验， QSQ交易所将于2019年8月21日 11:00-18:00对币币和合约交易功能模块进行升级，优化系统交易模式，非常抱歉给您带来不便，敬请谅解。</p>"  -->
        <toast 
            :isShow="toastShow"
            :showToastType="'operate'" 
            :showToastImgType="'warning'" 
            :toastTitle="''" 
            :toastOperateTitle="$t('poptip.quickTrans.iKnow')" 
            @handle-main-click="toastShow = false"
        ><p class="toast-box">为给用户带来更好的交易体验，QSQ交易所将于<span class="red">2019年8月21日 11:00-18:00</span>进行系统升级维护，期间用户将暂时无法进行交易，升级成功后会在服务重启后恢复。非常抱歉给您带来不便，敬请谅解。</p></toast>
    </div>
  </div>
</template>

<script>
import loading from '@/component/loading';
export default {
  components: {
    loading
  },
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      scroll_start: 0,
      isRouterAlive: true,
      timeDown: false,
      toastShow: true
    }
  },
  created(){
    if(localStorage.getItem("wainS")===null){
      localStorage.setItem("wainS",this.$store.state.isOpen)
    }
    this.timeDownHandel();
  },
  mounted() {
    let that = this;
    // window.addEventListener("touchstart",function(event){
    //   that.scroll_start = event.targetTouches[0].clientY;//设置起点为触摸时的点
    // });
    // window.addEventListener('touchmove', function(event) {
    //   if (event.changedTouches[0].clientY-that.scroll_start > 0) {
    //     window.addEventListener('touchmove', this.stopScrolling, { passive: false });
    //   }
    // }, { passive: false });
    that.monitorCallback();
    that.getSession();
    that.getSymbolInfo();
    if(window.navigator.userAgent.indexOf('Android') > -1 || window.navigator.userAgent.indexOf('Adr') > -1) {
        window.addEventListener("resize", function() {
            if(document.activeElement.getAttribute('data-keyboard')=="keyboard") {
              document.activeElement.parentNode.scrollIntoView({block: "start", inline: "nearest", behavior: "smooth"});
                window.setTimeout(function() {
                },0);
            }
        })
    }
  },
  methods: {
    stopScrolling() {
      event.preventDefault();
      event.stopPropagation();
    },
    timeDownHandel() {
      let endTime = new Date(2019,7,21,11);
      let timeshow = localStorage.getItem('timeshow');
      if(endTime > new Date() && !timeshow ) {
        this.timeDown = true;
        localStorage.setItem('timeshow', new Date());
      }
    },
    /**
     * 监听原生事件回调
     * ios APP
     */
    monitorCallback() {
      let that = this;
      that.$bridge.setupWebViewJavascriptBridge(function (bridge) {
        bridge.registerHandler('clickSell', function(option, responseCallback) {
          that.$store.commit('changeNoMenu', true);
          if(option.isContract) { // 合约币种买跌
            that.$router.push({ path: `/transaction/${option.coinName}/main?type=fall&lang=${that.$i18n.locale}`});
            // that.$router.push({ path: `/transaction/${option.coinName}/main`, query: { type: 'fall&lang=' + that.$i18n.locale }});
          } else {
            // 币币
            that.$router.push({ path: `/trade/${option.coinName}/tradesell?lang=${that.$i18n.locale}`});
          }
        });
        bridge.registerHandler('clickBuy', function(option, responseCallback) {
          that.$store.commit('changeNoMenu', true);
           if(option.isContract) {  // 合约币种买涨
            that.$router.push({ path: `/transaction/${option.coinName}/main?type=rose&lang=${that.$i18n.locale}`});
          } else {
            // 币币
            that.$router.push({ path: `/trade/${option.coinName}/tradebuy?lang=${that.$i18n.locale}`});
          }
        });
        bridge.registerHandler('klineVcDismissCallback', function(coinName, responseCallback) {
          that.$store.commit('changeNoMenu', true);
        });
        bridge.registerHandler('quickLogin', function(responseCallback) {
          that.$router.push({ name: 'phoneLogin'});
        });
        bridge.registerHandler('refreshH5', function(responseCallback) {
          location.reload();
        });
      });
    },
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      })
    },
    getSymbolInfo() {
      this.$axios({
          baseURL: this.$interfaceTransfer,
          url:'/wi/symbols',
          method:"get",
          withCredentials: false,
          headers: {'PHPSESSID': sessionStorage.getItem('sessionId')},
        }).then(res => {
        if(res.data.status === 200) {
          localStorage.setItem('symbolsInfo', JSON.stringify(res.data.data));
        }
      })
    },
    getSession() {
      let that = this;
      if ((that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId)) {
        that.$axios({
          baseURL: that.$interfacePhpUrl,
          url: '/Ajax/getSession?userId=' + (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId) + '&token=' + (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).token),
          method: 'get',
          withCredentials: false
        }).then(function(data) {
          if (data.data.code == 200) {
            sessionStorage.setItem('sessionId', data.data.data);
          } else {
            // var timer = setInterval(() => {
            //   this.getSession();
            //   timer && clearTimeout(timer);
            // }, 2000)
          }
        }).catch(() => {
          // setInterval(() => {
          //   this.getSession();
          // }, 2000)
        })
      }
    }
  }
}
</script>


<style>
#app {
  font-family: 'Microsoft Yahei', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}
button, input, textarea{
  line-height: normal
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
.ios-touch{
  -webkit-overflow-scrolling : touch;
}
.red{
  color: #f00;
}
.ios-auto{
  -webkit-overflow-scrolling : auto;
}
.toast-box{
  font-size: 28px;
  padding: 0 24px;
  text-align: left;
  /* text-indent: 2em; */
}
</style>
