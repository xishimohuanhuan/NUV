import service from './home.service'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import Swipe from 'mint-ui/lib/swipe'
import SwipeItem from 'mint-ui/lib/swipe-item'
import Button from 'mint-ui/lib/button'
// import 'mint-ui/lib/swipe'
import UserDrawer from './userDrawer.vue'
import { Tab, Tabs } from 'vant';

export default {
  components: {
    swiper,
    swiperSlide,
    UserDrawer,
    SwipeItem,
    Swipe,
    Button,
    Tab,
    Tabs
  },
  data() {
    return {
      isLoading: false,
      isActive: false,
      bannerList: [],
      spotContractList: [],
      currencyMarketList: [],
      // 币币 成交数据
      currencyMarketListNew: [],
      mainList: [],
      cardList: [],
      noticeList: [],
      animate: true,
      popup: false,
      timer1s:null,
      // tabTitle: ['币币行情', '合约行情', '涨幅榜', '成交榜'],
      tabTitle: [ '涨幅榜', '成交榜' , '合约行情', '币币行情'],
      marketSwiperOption: {
        notNextTick: true,
        loop: false,
        slidesPerView: "auto",
        centeredSlides: true,
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true //修改swiper的父元素时，自动初始化swiper
      },
      noticeSwiperOption: {
        notNextTick: true,
        direction: 'vertical', // 垂直切换选项
        loop: true,
        speed: 900,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        spaceBetween: 10,
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true //修改swiper的父元素时，自动初始化swiper
      },
      scrollEvent: null,
      languageList: {
        'zh-cn': 0,
        'zh-tw': 1,
        'en-us': 2
      },
      interval: null,
      optionalList: [],
      optionalNameList: [],
      // 选中
      CheckEdDetail:1,
      // 涨幅榜
      perforData:[],
      numDataImg:1,
      numDataImg1:1,
      // 成交榜
      cliDeal:[],
      // 永续合约两个数据
      dataTwoSub:[],
      // 合约  盈利
      prioData:[],
      // 盈利
      dataNUMath:1,
      timerq:null,
      activeNew:0,
      // 选中的序号
      nameChan:0,
      // 合约行情
      transactionDate:[],
      wrapData:{
        // 涨幅榜
        perforData1:[],
        currencyMarketListNew1:[],
        cliDeal1:[],
      },
      realNameToast: false,
      idcardauth: null,
    }
  },
  beforeRouteEnter (to, from, next) {
    // ...
    next(vm => {
      let userId = decodeURIComponent(vm.$getCookie('userId')) && JSON.parse(decodeURIComponent(vm.$getCookie('userId')));
      // 永续合约图片显示
      vm.numDataImg=Math.ceil(Math.random()*6);
      if(vm.numDataImg===6){
        vm.numDataImg1=vm.numDataImg-1;
      }else{
        vm.numDataImg1=vm.numDataImg+1;
      }
      vm._$service = service(vm.axios);
      let localData = localStorage.getItem('coinInfo');
      if(localData) {
        vm.TransactionDataHanding(JSON.parse(localData));
      }
      vm.getUserInfo({userId: userId.userId});
      vm.getBanner();
      vm.getNoticeDetail();
      vm.getOptionalData();
      vm.prioDataDeal();
      vm.interval = setInterval(function() {
        vm.getTransactionData();
      }, 5000);
      vm.$store.commit('changeNoMenu', true);
    });
  },
  beforeRouteLeave (to, from, next) {
    clearInterval(this.interval);
    clearInterval(this.timerq);
    clearInterval(this.timer1s);
    this.interval = null;
    next();
  },
  filters: {
    tit(str, i) {
      return str.split('/')[i];
    },
    priceChange(num) {
      return num >= 0 ? '+' + num + '%' : num + '%';
    },
    // 去掉USDT
    takeOutData(val){
      let newVal=val.slice(0,4);
      return newVal;
    }
  },
  // watch: {
  //   'perforData.length'(val){
  //     this.touchHanldeExch1(0,val)
  //   }
  // },
  methods: {
    alterDrawerHandle() {
      this.popup = true //现在不用判断是否登录
      //  判断登录
      /* if (decodeURIComponent(this.$getCookie('userId')) && JSON.parse(decodeURIComponent(this.$getCookie('userId'))).userId) {
        this.popup = true
      } else{
            this.$router.push('./phoneLogin');
      } */
    },
    testClick(e){
      if(this.isActive){
        if((e.target.className)!='active'){
          this.isActive=false
        }
      }
    },
    /**
     * 获取自选列表数据
     */
    async getOptionalData() {
      let that = this,
        _userId = (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId);
      if (!_userId) {
        that.optionalList = [];
        that.optionalNameList = [];
        that.getTransactionData();
        return;
      }
      let data = await that._$service.queryOptionalData({
        userId: _userId,
        pageNum: 100,
        currentPage: 1
      });
      if (data.status === 200) {
        that.optionalList = (data.data.data ? data.data.data.list : []).map(item => {return {collectId: item.collectId, name: item.name, title: item.title,unit: item.unit, sort: item.sort}});
        that.optionalList.sort((cur, next) => {return cur.sort - next.sort});
        that.optionalNameList = that.optionalList.map(item => {return item.name});
      } else {
        that.optionalList = [];
        that.optionalNameList = [];
      }
      that.getTransactionData();
    },
    /**
     * 获取首页公告详情
     */
    async getNoticeDetail() {
      let data = await this._$service.queryArticleType({
        "type": 1
      });
      this.noticeList = data.data.data.map(function (item) {
        return {
          id: item.id,
          detail: item.title,
          type: item.type
        }
      });
      this.$nextTick(() => {
        if (this.scrollEvent) {
          clearInterval(this.scrollEvent);
          this.scrollEvent = null;
        }
        this.scrollEvent = setInterval(this.scroll, 3500);
      })
    },
    scroll() {
      let that = this,
        con1 = that.$refs['scroll-item'];
      if (con1 && con1.length > 0) {
        con1[0].style.marginTop = '32px';
        that.animate = !that.animate;
        that.timer1s=setTimeout(function() {
          that.noticeList.push(that.noticeList[0]);
          that.noticeList.shift();
          con1[0].style.marginTop = '0px';
          that.animate = !that.animate;
        }, 10)
      }
    },
    /**
     * 改变应用语言配置
     * @param {*} lang 
     */
    changeLanguage(lang) {
      this.isActive = !this.isActive;
      this.$i18n.locale = lang;
      this.$cookies.set("think_language", lang);
      this.getBanner();
      this.getNoticeDetail();
    },
    viewSimulatedTransaction() {
      let Obj =decodeURIComponent(this.$getCookie('userId'))
      if (Obj) {
        let userId = JSON.parse(Obj).userId;
        let userName = JSON.parse(Obj).phone;
        let token = JSON.parse(Obj).token;
        if(token&&userName&&userId){
          window.location.href = this.$simulateUrl+'/index/index/market/xeth_usdt?normal=1&cgpid=5&demo_cg='+userName+'&token='+token+'&userId='+userId;
        }else{
          this.$router.push('./setPassWord')
        }
      } else {
        // this.$router.push('./phoneLogin')
        this.$loginRoute('/home')

      }
    },
    /**
     * 获取广告牌信息
     */
    async getBanner() {
      let data = await this._$service.queryBanner({
        "position": 9,  // coinlot banner图
        "status": 1
      });
      let imgUrl = this.$imgJavaUrl;
      this.bannerList = data.data.data.map(function (item) {
        return {
          url: item.url,
          img: imgUrl + item.img
        }
      })
    },
    /**
     * 获取交易数据
     */
    async getTransactionData() {
      let data = await this._$service.queryTransactionData({});
      localStorage.setItem('coinInfo', JSON.stringify(data.data));
      this.TransactionDataHanding(data.data);
      // data.data.assitsCoinArr.forEach(item => item.isContract = false);
      // data.data.extendCoinArr.forEach(item => item.isContract = true);
      // data.data.mainCoinArr.forEach(item => item.isContract = false);
      // let _currencyMarketList = this.getArrOfLength(data.data.mainCoinArr.concat(data.data.assitsCoinArr), 12);
      // this.currencyMarketList = this.resetArr(_currencyMarketList, 6);
      // this.spotContractList = this.resetArr(data.data.extendCoinArr, 3);
    },
    TransactionDataHanding(data) {
      if(typeof data !== 'object') return;
      data.assitsCoinArr.forEach(item => item.isContract = false);
      data.extendCoinArr.forEach(item => item.isContract = true);
      data.mainCoinArr.forEach(item => item.isContract = false);
      // let _currencyMarketList = this.getArrOfLength(data.mainCoinArr.concat(data.assitsCoinArr), 19);
      let _currencyMarketList = data.mainCoinArr.concat(data.assitsCoinArr)
      this.currencyMarketList = this.resetArr(_currencyMarketList, 6);
      this.spotContractList = this.resetArr(data.extendCoinArr, 3);
      this.currencyMarketListNew=[..._currencyMarketList];
      this.wrapData.currencyMarketListNew1=this.currencyMarketListNew.slice(0,3);
      this.transactionDate=data.extendCoinArr;
      this.perforDataDeal(_currencyMarketList);
      this.perforDataDealUp(_currencyMarketList);
      this.perforDataDealTwo(data.extendCoinArr);
    },
    /**
     * 跳转广告牌详情
     * @param {*} url 
     */
    viewBanner(url) {
      window.location.href = url;
    },
    /**
     * 跳转公告详情
     * @param {*} event 
     */
    viewNotice(event) {
      this.$store.commit('changeNoMenu', false);
      this.$router.push({
        name: 'notice',
        query: {
          id: event.target.dataset.id ? event.target.dataset.id : this.noticeList[0].id,
          type: event.target.dataset.type ? event.target.dataset.type : this.noticeList[0].type
        }
      });
    },
    /**
     * 查看币种K线详情
     * @param {*} coinName 
     */
    viewMarketDetail(coinTitle, coinName, isContract, path_temp) {
      let path = path_temp;
      if(isContract) {
        //  跳转合约K线
        path = 'contract';
      }
      let that = this,
        ua = window.navigator.userAgent,
        userId = (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId),
        select = that.optionalList.find(item => {return item.name === coinName}),
        collectId = select ? select.collectId : '';
      if (/Native_iOS/.test(ua)) {
        that.$bridge.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler('jumpToNativeKlineVc', {coinTitle:coinTitle, coinName:coinName, language: that.languageList[that.$i18n.locale], userId: userId, collectId: collectId, isCollected: !!collectId, isContract: isContract,sessionId: window.sessionStorage.getItem('sessionId')}, function(res) {});
        });
        // that.$store.state.bridge.callHandler('jumpToNativeKlineVc', {coinTitle:coinTitle, coinName:coinName, language: that.languageList[that.$i18n.locale], userId: userId, collectId: collectId, isCollected: !!collectId, isContract: isContract}, function(res) {});
        return;
      } else if (/Native_Android/.test(ua)) {
        prompt("cg://web/klinepage?" + JSON.stringify({coinTitle:coinTitle, coinName:coinName, language: that.languageList[that.$i18n.locale], userId: userId, collectId: collectId, isCollected: !!collectId, isContract: isContract, sessionId: window.sessionStorage.getItem('sessionId')}),"");
        return;
      }
      window.location.href = this.$phpUrl + '/' + path + '/kline/market/' + coinName + '?lang=' + this.$i18n.locale
    },
    // 重置数组（n个一组）
    resetArr(data, n = 3) {
      let arr = [];
      for (var i = 0; i < data.length; i += n) {
        arr.push(data.slice(i, i + n));
      }
      return arr
    },
    /**
     * 获取指定长度数组
     * @param {*} data
     * @param {*} n
     */
    getArrOfLength(data, n = 12) {
      let arr = [];
      for (var i = 0; i < n; i++) {
        arr.push(data[i]);
      }
      return arr;
    },
    /**
     * 增加千分位
     *@param{string}str 转换对象
     *@param{int}num 保留小数
     */
    addcommafy(s, n) {
      s = this.toNonExponential(s)
      n = n > 0 && n <= 20 ? n : 2;
      s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
      if (isNaN(s) || ((s + "").replace(/\s/g, "")) == "") {
        return "";
      }
      var l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
      var t = "";
      for (var i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "" : "");
      }
      return t.split("").reverse().join("") + "." + r;
    },
    //将科学计数法转换为小数
    toNonExponential(num) {
      num = parseFloat(num);
      var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
      if(!m) return num;
      return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
    },
    // 选择选项卡
    setCheckED(data){
      this.CheckEdDetail=data;
    },
    // 涨幅榜数据处理
    perforDataDeal(data){
      let perforData1=data.filter(ite=>{
        return ite.change>=0;
      })
      let perforData2=data.filter(itt=>{
        return itt.change<0;
      })
      perforData1.sort((a,b)=>{
        return b.change-a.change;
      })
      perforData2.sort((a,b)=>{
        return b.change-a.change;
      })
      this.perforData=perforData1.concat(perforData2);
      this.wrapData.perforData1=this.perforData.slice(0,3);
    },
    perforDataDealUp(data){
      this.cliDeal=data.sort((a,b)=>{
        return b.volume-a.volume;
      })
      this.wrapData.cliDeal1=this.cliDeal.slice(0,3)
    },
    perforDataDealTwo(data){
      this.dataTwoSub=data.filter(ite=>{
        return ite.title==='XBTC/USDT' || ite.title==='XETH/USDT' || ite.title==='XEOS/USDT';
      })
      this.dataTwoSub=this.dataTwoSub.slice(0,3);
    },
    // 合约 盈利
    prioDataDeal(){
      this._$service.queryGenerte().then(data=>{
        this.prioData=data.data.map(item=>{
          return {phone:item.split('&')[0],
                    price:item.split('&')[1]
                  };
        });
        this.dealDataAni();
      });
    },
    // 线下轮播
    dealDataAni(){
      this.prioData=this.prioData.concat(this.prioData.slice(0,3));
      clearInterval(this.timerq);
      this.timerq=setInterval(() => {
        this.$refs.ulTop.style.transitionProperty='all';
        this.$refs.ulTop.style.transitionDuration='0.8s';
        this.$refs.ulTop.style.top='-'+this.dataNUMath*1.146667+'rem';
        this.dataNUMath=this.dataNUMath+1;
        if(this.dataNUMath===this.prioData.length-1){
          this.$refs.ulTop.style.transitionDuration='0s';
          this.$refs.ulTop.style.top='0';
          this.dataNUMath=1;
        }
      }, 2000);
    },
    // 修改涨幅榜的高度
    // touchHanldeExch(name){
    //   this.nameChan=name;
    //   if(name===0){
    //     this.$nextTick().then( ()=>{
    //       let domEl=document.getElementsByClassName('van-tabs__track')[0];
    //       let domEl1=document.getElementsByClassName('detail-list')[0];
    //       domEl.style.minHeight='6rem';
    //       domEl.style.height=50+Number(window.getComputedStyle(domEl1).height.replace(/[^0-9\.]/g,''))+'px';
    //     })
    //   }else if(name===2){
    //     this.$nextTick().then( ()=>{
    //       let domEl=document.getElementsByClassName('van-tabs__track')[0];
    //       let domEl1=document.getElementsByClassName('detail-list')[2];
    //       domEl.style.minHeight='6rem';
    //       domEl.style.height=50+Number(window.getComputedStyle(domEl1).height.replace(/[^0-9\.]/g,''))+'px';
    //     })
    //   }else{
    //     this.$nextTick().then(()=>{
    //       let domEl=document.getElementsByClassName('van-tabs__track')[0];
    //       domEl.style.height='auto';
    //     })
    //   }
    // },
    touchHanldeExch1(da,dad){
      if(this.nameChan===0){
        this.touchHanldeExch(da,dad)
      }
    },
    // 原生就是实现高度变化的
    moveHei(num,num1,dom){
      let num2=0;
      setInterval(()=>{
        
        num2=num+10;
        if(num>num1-num2){

        }else{
          dom.style.height=num1-num2+'px';
        }
      },100)
    },
    // 跳到注册页面
    gotoRegister(){
      let isLogin = decodeURIComponent(this.$getCookie('userId'));
        if(isLogin){
          this.$normalToast(this.$t('newZh.youLoad'),2000);
          return;
        }
      this.$router.push('/loginRegister');
    },
    // 跳转到帮助中心
    gotoNewMen(){
      this.$router.push('/setting/helpCenter');
    },
    gotoAddSei(){
      this.$router.push('/setting/playRoule');
      // location.href='http://lifeh5.shumaidata.com/index.html#/?appid=HnVHy7Ny5qrxK2py'
    },
    goKuangji() {
      let userId = decodeURIComponent(this.$getCookie('userId')) && JSON.parse(decodeURIComponent(this.$getCookie('userId')));
      if(!userId){
        this.$router.push('/phoneLogin');
        return;
      }
      if(this.idcardauth) {
        this.realNameLink(this.idcardauth, userId.userId);
      } else {
        this.getUserInfo({userId: userId.userId}).then(res => {
          this.realNameLink(res, userId.userId);
        })
      } 
      // this.$normalToast('正在建设中',2000);
      // location.href='http://gqg.com'      
    },
    realNameLink(idcardauth, userId) {
      if(idcardauth == '1') {
        this.$store.commit('changeLoading', true);
        location.href = 'https://mine.gqg.com?uid='+userId;
      } else {
         this.realNameToast = true;
        // this.$router.push('/lifecheck');
      }
    },
    getUserInfo(data) {
      return this.$axios({
        data,
        url: `/user/getUserInfo`,
        method: 'post',
      }).then(res => {
        if(res.status === 200){
          if(res.data.status === 200){
            // 判断实名认证是否成功
            // sessionStorage.setItem('idcardauth', res.data.data.idcardauth);
            this.idcardauth = res.data.data.idcardauth+''
            return res.data.data.idcardauth+'';
          }
        }
      })
    },
    gotoAllData(data){
      let type=0;
      // 涨幅榜
      if(data==='perforData1'){
        type=0;
      }
      // 成交榜
      if(data==='cliDeal1'){
        type=2;
      }
      // 币币行情
      if(data==='currencyMarketListNew1'){
        type=1;
      }
      // 合约行情
      if(data==='cantrat'){
        type=3
      }
      this.$router.push('/coinList/'+type);
    }
  }
}
