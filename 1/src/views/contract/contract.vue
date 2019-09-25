<template>
  <iframe ref="ifr" :height="height" width="100%" scrolling="no" :src="iframeSrc" frameborder="0"></iframe>
</template>

<script>
export default {
  data() {
    return {
      iframeSrc: "",
      height: window.innerHeight,
      lang: "zh-cn"
    };
  },
  beforeRouteEnter(to, from, next) {
    // ...
    next(vm => {
      let icon = localStorage.getItem('trade_symbol');
      icon = icon ? JSON.parse(icon) : 'btc_usdt'
      vm.$router.push('/trade/'+icon+'/foo');
      return ;
      //  新版币币交易
      var Obj=decodeURIComponent(vm.$getCookie('userId'))
      var param
      if(Obj){
        let token = JSON.parse(Obj).token;
        let phone = JSON.parse(Obj).phone;
        let userId = JSON.parse(Obj).userId;
        if(!token) {
          vm.$router.push({
            path: '/setPassWord',
            query: {urlrote: 1, phone: phone}
          })
          return
        }

        param= '&normal=1&cgpid=3&token='+token+'&userName='+phone+'&userId='+userId

      }else{
        param= '&normal=1&cgpid=3'
      }
      if (!from.query.key) {
        window.location.href =
          vm.$phpUrl + "/trade/index/market/btc_usdt?lang=" +
          vm.$i18n.locale + param; // 'http://cgex.lan.com:8081/wi/positions/xbtc_usdt https://m.cg.net/contract/index/
        return;
      }

      window.location.href = vm.$phpUrl + "/trade/index/" + from.query.key + param;
    });
  }
};
</script>
