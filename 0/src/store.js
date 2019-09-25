import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    noMenu: true,
    lang: 'zh-cn',
    loading: false,
    test:0,
    idcardauth: 2,
    transactionHeader: 1,
    phoneChange: false,
    boomWarning: false,
    countryItem:{
      en: "China",
      name: "中国",
      short: "CN",
      tel: "86"
    },
    actionCoin: localStorage.getItem("actionIcon") ?JSON.parse(localStorage.getItem("actionIcon")) : {},
    bridge: null,
    isbuy:null,
    globalToast: false,
    // show:null,
    //爆仓预警
    isOpen: localStorage.getItem("wainS")===null ? true :localStorage.getItem("wainS")
  },
  mutations: {
    testMethods(state,status){
      state.test=status
    },
    countryItems(state, status) {
      state.countryItem = status;
    },
    changeNoMenu(state, status) {
      state.noMenu = status;
    },
    changeLang(state, lang) {
      state.lang = lang;
    },
    changeLoading(state, status) {
      state.loading = status;
    },
    changeIDcardauth(state, status) {
      state.idcardauth = status;
    },
    changetransactionHeader(state, status) {
      state.transactionHeader = status;
    },
    setBridge(state, item) {
      state.bridge = item;
    },
    changeBuy(state,val){
      state.isbuy = val
    },
    changeActionCoin(state, val){
      state.actionCoin = val
    },
    //爆仓预警
    ifOpen(state,status){
      state.isOpen = status
    },
    // 爆仓预警提示灯
    boomWarningChange(state,status){
      state.boomWarning = status
    },
    changeGlobalToast(state,status){
      state.globalToast = status
    },
    phoneChangeHandle(state, status) {
      state.phoneChange = status;
    }
  },
  actions: {

  }
})
