import Vue from 'vue';
import './plugins/axios';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './i18n';
import 'mint-ui/lib/style.css';
import './commons/filter/filter';
import VueCookies from 'vue-cookies';
import bridge from '@/commons/bridge';
import dataConversion from '@/commons/dataConversion';
import 'swiper/dist/css/swiper.min.css';
import { clientEnv } from '@/commons/env/client';
import 'lib-flexible';
import './assets/scss/index.scss';
import toast from './component/toast';
import Toast from 'mint-ui/lib/toast';
import { longPress, touchMove } from './commons/listen/listen';
import 'vant/lib/index.css'
import {numPlus, numMinus, multipliedBy, dividedBy, toBignumber} from './commons/calfloat' 

Vue.config.productionTip = false;
Vue.prototype.$goBack = function () {
    if (sessionStorage.getItem('specialTreatment') === 'home') {
        sessionStorage.setItem('specialTreatment', null);
        location.href = location.origin + '/home';
    } else {
        window.history.go(-1)
    }
};
Vue.prototype.$goHomeCallback = function () {
    this.$router.push({name: 'home'});
    this.$needIosCallBack();
};

Vue.prototype.$Toast = Toast;
Vue.prototype.$bridge = bridge;
Vue.prototype.$dataConversion = dataConversion;
Vue.prototype.$interfaceJavaUrl = process.env.VUE_APP_JAVA_apiUrl;
Vue.prototype.$imgJavaUrl = process.env.VUE_APP_JAVA_IMG_URL;
Vue.prototype.$interfacePhpUrl = process.env.VUE_APP_PHP_apiUrl;
Vue.prototype.$phpUrl = process.env.VUE_APP_PHP_Url;
Vue.prototype.$simulateUrl = process.env.VUE_APP_Simulate_Url;
Vue.prototype.$interfaceTransfer = process.env.VUE_APP_Transfer_Url;    //才加的
Vue.prototype.$interfaceJavaWss = process.env.VUE_APP_JAVA_WSS;    //才加的
Vue.prototype.$interfaceGolangWss = process.env.VUE_APP_GOLANG_WSS;    //才加的
Vue.prototype.$lifeCheck = process.env.VUE_APP_LIFE_CHECK;    //才加的
Vue.prototype.$customerService = process.env.VUE_APP_CUSTOMER_SERVICE;    //才加的
Vue.prototype.$clientEnv = clientEnv;
Vue.prototype.$longPress = longPress;
Vue.prototype.$touchMove = touchMove;
Vue.prototype.$PRICE_UNIT = 'USDT'; //价格单位

Vue.prototype.$numPlus = numPlus; //加法
Vue.prototype.$numMinus = numMinus; //减法
Vue.prototype.$multipliedBy = multipliedBy; //乘以
Vue.prototype.$dividedBy = dividedBy; // 除以
Vue.prototype.$toBignumber = toBignumber; //返回一个bignumber实例


Vue.prototype.$getCookie = function (cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return decodeURIComponent(c.substring(name.length, c.length));
    }
    return "";
}

Vue.prototype.$loginRoute = function (route) {
    if (route) {
        let Obj = this.$getCookie('userId')
        sessionStorage.setItem('nextRoute', route)
        if (Obj) {
            /* 
             * pathArr
             * 交易密码
             * 有的页面需要设置了交易密码才能进入
             * 定义为一个数组是为了方便查看和更改
             * 转为 String 为了进行模糊查询（如币种，id等不一样）
            */
           let pathArr = [
                '/assets/withdrawMoney/*',
                '/payment',
                '/quickTrans/sell'
            ].join('|');
            let pathREX = new RegExp(pathArr);
            //    istradeSet => 是否设置交易密码
            if (JSON.parse(Obj).istradeSet || (!pathREX.test(route))) {
                this.$router.push(route)
            } else {
                this.$store.commit('changeGlobalToast', true);
                // this.$router.push('/setPassWord')
            }

        } else {
            this.$router.push('/phoneLogin')
        }
    } else {
        this.$router.push('/phoneLogin')
        sessionStorage.setItem('nextRoute', '')
    }
};
Vue.prototype.$setCookie = function (cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires+';path=/';  //FIX: 改变cookie--path
};
Vue.prototype.$toNumStr = function (val, dig = 2) {
    if (val === null || val === undefined) return val;
    let n = Number(val);
    if (isNaN(n)) return false;
    let m = n.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
    let str =  n.toFixed(Math.max(0, (m[1] || '').length - m[2]));
    if(str.indexOf('.') === -1) return val;
    return Number(str.slice(0, str.indexOf('.') + dig + 1))
};
Vue.prototype.$sliceNum = function (val, dig = 4) {
    if (val === null || val === undefined) return val;
    if(!isFinite(val)) return '--'
    let n = String(val);
    if (isNaN(n)) return false;
    let index = n.indexOf('.');
    if(index === -1) return n;
    return n.slice(0,index+dig+1);
};
Vue.prototype.$normalToast = function (text, time = 2000) {
    let v_div = document.getElementById('zsx-normal-shade'),
        content = document.getElementById('zsx-normal-toast');
    if (!v_div) {
        v_div = document.createElement('div');
        v_div.setAttribute('id', 'zsx-normal-shade');
        v_div.setAttribute('class', 'zsx-toast-shade');
        // v_div.setAttribute('style', 'z-index: 9999');
        content = document.createElement('div');
        content.setAttribute('id', 'zsx-normal-toast');
        content.setAttribute('class', 'zsx-normal-toast');
        v_div.appendChild(content);
    }
    let v_display = v_div.style.display;
    if (!v_display || v_display == 'none') {
        content.innerText = text;
        v_div.setAttribute('style', 'display: block');
        setTimeout(function () {
            v_div.setAttribute('style', 'display: none');
        }, time)
    }
    document.body.appendChild(v_div);
}
Vue.prototype.$goTopHandle = function(dom) {
    let timer = null;
    cancelAnimationFrame(timer);
    timer = requestAnimationFrame(function fn(){
        var oTop = dom.scrollTop;
        if(oTop > 0){
                dom.scrollTo(0,oTop-50);
                timer = requestAnimationFrame(fn);
        }else{
                cancelAnimationFrame(timer);
        }    
    });
}
Vue.prototype.$needIosCallBack = function() {
    const arr = ['helpCenter', 'notice', 'article'];
    if(arr.includes(this.$route.name)) {
        this.$bridge.setupWebViewJavascriptBridge(function (bridge) {
            bridge.callHandler('routeGoback', null, function() { });
        });
        return true;
    }
}
Vue.use(VueCookies);
Vue.component('toast', toast);
// 新增 过滤数字指令
Vue.directive('enterNumber', {
    inserted: function (el) {
      el.addEventListener("keypress",function(e){
        e = e || window.event;
        let charcode = typeof e.charCode == 'number' ? e.charCode : e.keyCode;
        let re = /\d/;
        if(charcode == 46){
          if(el.value.includes('.')){
            e.preventDefault();
          }
          return;
        }else if(!re.test(String.fromCharCode(charcode)) && charcode > 9 && !e.ctrlKey){
          if(e.preventDefault){
            e.preventDefault();
          }else{
              e.returnValue = false;
          }
        }
      });
    }
  });
// 新增 过滤数字指令
Vue.directive('inputNumber', {
    inserted: function (el) {
        el.addEventListener("input",function(){
            // eslint-disable-next-line no-useless-escape            
            let re = /[^0-9\.?]/;
            el.value = el.value.replace(re,'')
      });
    }
  });

Vue.prototype.$getSession = function() {
    let that = this;
    return new Promise((resolve, reject) => {
        if ((that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId)) {
            let sessionId = sessionStorage.getItem('sessionId');
            if(!sessionId) {
                that.$axios({
                    baseURL: that.$interfacePhpUrl,
                    url: '/Ajax/getSession?userId=' + (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId) + '&token=' + (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).token),
                    method: 'get',
                    withCredentials: false
                }).then(function(data) {
                    if (data.data.code == 200) {
                        sessionStorage.setItem('sessionId', data.data.data);
                        resolve(true);
                    } else{
                        reject(false);
                    }
                })
            } else {
                reject(false);
            }
        } else {
            reject(false);
        }
    })
}
Vue.prototype.$overflowScrolling = (needTouch) => {
    if(needTouch) {
        document.body.className = 'ios-touch';
    } else{
        document.body.className = 'ios-auto';
    }
}

Vue.prototype.$inputKeybold = function() {
    // 手机软键盘出现时，使输入框出现在屏幕上
    if(window.navigator.userAgent.indexOf('Android') > -1 || window.navigator.userAgent.indexOf('Adr') > -1) {
        window.addEventListener("resize", function() {
            if(document.activeElement.getAttribute('data-keyboard')=="keyboard") {
                window.setTimeout(function() {
                    document.activeElement.scrollIntoView();
                },0);
            }
        })
    }
}

// 解决ios滑动不流畅问题
Vue.prototype.$overflowScrolling = (needTouch) => {
    if(needTouch) {
        document.body.className = 'ios-touch';
    } else{
        document.body.className = 'ios-auto';
    }
}


new Vue({
    router,
    store,
    i18n,
    render: function (h) {
        return h(App)
    }
}).$mount('#app');
