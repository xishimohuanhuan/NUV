import service from './quotation.service';
export default {
  data() {
    return {
      refreshText: '',
      refreshImg: '',
      selectedTab: 'CT',
      tabList: {
        OP: {
          market: 'normal',
          newPrice: 'normal',
          change: 'normal'
        },
        CT: {
          market: 'normal',
          newPrice: 'normal',
          change: 'normal'
        },
        MX: {
          market: 'normal',
          newPrice: 'normal',
          change: 'normal'
        },
        TSXV: {
          market: 'normal',
          newPrice: 'normal',
          change: 'normal'
        }
      },
      showQuotationList: [],
      quotationList: {},
      orderTypeList: ['normal', 'ascending', 'descending'],
      orderFunctionList: {
        normal: null,
        ascending: {
          market: function(a, b) { return a.title.localeCompare(b.title) },
          newPrice: function(a, b) { return a.new_price - b.new_price },
          change: function(a, b) { return a.change - b.change }
        },
        descending: {
          market: function(a, b) { return b.title.localeCompare(a.title) },
          newPrice: function(a, b) { return b.new_price - a.new_price },
          change: function(a, b) { return b.change - a.change }
        }
      },
      orderTypeImg: {
        normal: require('../../assets/img/quotation/orderNormal.png'),
        ascending: require('../../assets/img/quotation/orderAscending.png'),
        descending: require('../../assets/img/quotation/orderDescending.png')
      },
      languageList: {
        'zh-cn': 0,
        'zh-tw': 1,
        'en-us': 2
      },
      isLoading: false,
      selectedItem: {
        title: '',
        name: '',
        unit: ''
      },
      optionalList: [],
      optionalNameList: [],
      interval: null
    }
  },
  filters: {
    tit(str, i) {
      return str.split('/')[i]
    },
    priceChange(num) {
      return num >= 0 ? '+' + num + '%' : num + '%'
    }
  },
  beforeRouteEnter (to, from, next) {
    // ...
    next(vm => {
      vm.$store.commit('changeNoMenu', true);
      vm._$service = service(vm.axios);
      vm.getOptionalData();
      let localeData = localStorage.getItem('coinInfo');
      if(localeData) {
        vm.renderDataHanding(JSON.parse(localeData));
      }
      vm.interval = setInterval(function() {
        vm.getTransactionData();
      }, 10000);
      vm.init();
    });
  },
  beforeRouteLeave (to, from, next) {
    // ...
    clearInterval(this.interval);
    this.interval = null;
    this.isLoading = true;
    this.$store.commit('changeLoading', !this.isLoading);
    next();
  },
  methods: {
    /**
     * 新增手势滑动事件
     */
    init() {
      let that = this;
      that.$touchMove(that.$refs['dataContainer'], that.handleMove, that.viewCurrencyDetail);
    },
    /**
     * 手势滑动回调事件
     * @param {*} ele 触发元素标识
     * @param {*} direction 移动方向 1:收起抽屉，0：保持不变，-1：弹出抽屉
     */
    handleMove(ele, direction) {
      let that = this,
        move = (direction === -1 ? -23 : 0),
        _style = `transition: transform .3s;transform: translateX(${move}%)`;
      ele && that.$refs[ele][0].setAttribute('style', _style);
    },
    /**
     * 获取自选列表数据
     */
    async getOptionalData(reflush = true) {
      let that = this,
        _userId = (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId);
      if (reflush) {
        that.isLoading = false;
        that.$store.commit('changeLoading', !that.isLoading);
      }
      if (!_userId) {
        that.optionalList = [];
        that.optionalNameList = [];
        that.getTransactionData();
        return;
      }
      let data = await that._$service.queryOptionalData({
        userId: Number(_userId),
        pageNum: 100,
        currentPage: 1
      });
      if (data.status === 200) {
        
        that.optionalList = (data.data.data ? data.data.data.list : []).map(item => {return {collectId: item.collectId, name: item.name, title: item.title,unit: item.unit, sort: item.sort}});
        that.optionalNameList = that.optionalList.map(item => {return item.name});
      } else {
        that.optionalList = [];
        that.optionalNameList = [];
      }
      that.getTransactionData();
    },
    /**
     * 根据标识调用事件
     * @param {*} key DEL：删除自选；TOP：置顶自选；ADD：添加自选
     * @param {*} item 选中的项
     */
    modifyOptional(key, item, event) {
      let that = this;
      if (key === 'DEL') {
        that.delOptionalByInfo(item.name);
      } else if (key === 'TOP') {
        that.topOptionalByInfo(item.name);
      } else {
        that.addOptionalByInfo(item.title, item.name, item.unit);
      }
    },
    /**
     * 置顶自选
     * @param {*} name 
     */
    async topOptionalByInfo(name) {
      let that = this,
        _userId = (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId),
        collectId = that.optionalList.find(item => {return item.name === name}).collectId;
      let data = await that._$service.topOptional({
        userId: _userId,
        collectId: collectId
      })
      if (data.status == 200) {
        if (data.data.status == 200) {
          that.selectedItem = {
            title: '',
            name: '',
            unit: ''
          };
          that.$refs[name][0].setAttribute('style', 'transition: transform .3s;transform: translateX(0)');
          setTimeout(function() {
            that.$refs[name][0].setAttribute('style', '');
            that.$normalToast(that.$t('quotation.topOptionalSuccess'), 1000);
            that.getOptionalData(false);
          }, 300);
        }
      }
    },
    /**
     * 删除自选
     */
    async delOptionalByInfo(name) {
      let that = this,
        _userId = (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId),
        collectId = that.optionalList.find(item => {return item.name === name}).collectId;
      let data = await that._$service.delOptional({
        userId: _userId,
        collectId: collectId
      })
      if (data.status == 200) {
        if (data.data.status == 200) {
          that.selectedItem = {
            title: '',
            name: '',
            unit: ''
          };
          that.$refs[name][0].setAttribute('style', 'transition: transform .3s;transform: translateX(0)');
          setTimeout(function() {
            that.$refs[name][0].setAttribute('style', '');
            that.$normalToast(that.$t('quotation.delOptionalSuccess'), 1000);
            that.getOptionalData(false);
          }, 300);
        }
      }
    },
    /**
     * 添加自选
     */
    async addOptionalByInfo(title, name, unit) {
      let that = this,
        _userId = (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId);
      if (!_userId) {
        var eleList = this.$refs['dataContainer'].querySelectorAll('[data-main=main]');
        for (let item of eleList) {
          let _style = item.getAttribute('style');
          if (_style) {
            item.setAttribute('style', '');
          }
        }
        that.$loginRoute('./quotation');
        return;
      }
      let data = await that._$service.addOptional({
        userId: _userId,
        title: title,
        name: name,
        unit: unit
      });
      if (data.status == 200) {
        if (data.data.status == 200) {
          that.$normalToast(that.$t('quotation.addOptionalSuccess'), 1000);
          that.selectedItem = {
            title: '',
            name: '',
            unit: ''
          };
          that.$refs[name][0].setAttribute('style', 'transition: transform .3s;transform: translateX(0)');
          setTimeout(function() {
            that.$refs[name][0].setAttribute('style', '');
          }, 300);
        } else {
          that.$normalToast(that.$t('quotation.overOptional'), 1000);
          that.selectedItem = {
            title: '',
            name: '',
            unit: ''
          };
          that.$refs[name][0].setAttribute('style', 'transition: transform .3s;transform: translateX(0)');
          setTimeout(function() {
            that.$refs[name][0].setAttribute('style', '');
          }, 300);
        }
      }
    },
    /**
     * 获取行情数据
     */
    async getTransactionData() {
      let that = this,
      data = await that._$service.queryTransactionData({});
      localStorage.setItem('coinInfo', JSON.stringify(data.data));
      that.renderDataHanding(data.data);
    },
    /**
     * 列表渲染数据处理
     * @param {*} key 
     */
    renderDataHanding(data) {
      let that = this;
      that.quotationList = {
        CT: data.extendCoinArr,
        MX: data.mainCoinArr,
        TSXV: data.assitsCoinArr
      };

      that.quotationList['CT'].forEach(item => item.isContract = true);
      that.quotationList['MX'].forEach(item => item.isContract = false);
      that.quotationList['TSXV'].forEach(item => item.isContract = false);

      let res = [];
      if (!that.optionalNameList.length) {
        that.quotationList['OP'] = [];
      } else {
        res = [].concat(data.extendCoinArr, data.mainCoinArr, data.assitsCoinArr);
        let res1 = [];
        for (let i = 0; i < that.optionalNameList.length; i++) {
          res1[i] = res.find(item => {return item.name === that.optionalNameList[i]});
        }
        that.quotationList['OP'] = res1;
      }

      var keyList = that.tabList[that.selectedTab],
        key = '';
      for (let item in keyList) {
        if (keyList[item] !== 'normal') {
          key = item;
        }
      }
      var func = that.orderFunctionList[that.tabList[that.selectedTab][key]],
        result = [].concat(that.quotationList[that.selectedTab]);
      if (key) {
        if (func) {
          result.sort(func[key]);
        }
      }
      // if(that.selectedTab==="MX"){
      //   let arrData={
      //     'cgt_eth':1,
      //     'cgt_usdt':1,
      //     'newos_usdt':1,
      //     'newos_eth':1,
      //     'zil_usdt':1,
      //     'zil_eth':1,
      //     'iost_usdt':1,
      //     'iost_eth':1,
      //     'dta_usdt':1,
      //     'dta_eth':1,
      //     'ocn_usdt':1,
      //     'ocn_eth':1,
      //     'gnt_usdt':1,
      //     'gnt_eth':1,
      //     'soc_usdt':1,
      //     'soc_eth':1,
      //     'cvc_usdt':1,
      //     'cvc_eth':1
      //   }
      // }
      that.showQuotationList = result;
      this.showQuotationList = this.showQuotationList.filter(item => {
        return !item.name.includes('cgt_') && !item.name.includes('newos_');
      })


      that.isLoading = true;
      this.$store.commit('changeLoading', !that.isLoading);
    },
    /**
     * 改变排序方式
     * @param {*} key
     */
    changeOrder(key) {
      var selectTabItem = this.tabList[this.selectedTab],
        index = this.orderTypeList.indexOf(selectTabItem[key]);
      index = (index + 1 >= this.orderTypeList.length) ? 0 : index + 1;
      for (let _key in selectTabItem) {
        if (_key === key) {
          selectTabItem[_key] = this.orderTypeList[index];
        } else {
          selectTabItem[_key] = this.orderTypeList[0];
        }
      }
      var func = this.orderFunctionList[selectTabItem[key]],
        result = [].concat(this.quotationList[this.selectedTab]);
      if (func) {
        result.sort(func[key]);
      }
      this.showQuotationList = result;
    },
    /**
     * 根据key改变数据
     * @param {*} key 
     */
    changeSelectTb(key) {
      if (this.isLoading) {
        this.selectedTab = key;
        this.showQuotationList = this.quotationList[this.selectedTab];
        this.selectedItem = {
          title: '',
          name: '',
          unit: ''
        };
        var eleList = this.$refs['dataContainer'].querySelectorAll('[data-main=main]');
        for (let item of eleList) {
          let _style = item.getAttribute('style');
          if (_style) {
            item.setAttribute('style', 'transition: transform .3s;transform: translateX(0)');
            setTimeout(function() {
              item.setAttribute('style', '');
            }, 300);
          }
        }
        let localeData = localStorage.getItem('coinInfo');
        if(localeData) {
          this.renderDataHanding(JSON.parse(localeData));
        }
        this.getOptionalData(false);
      }
    },
    /**
     * 跳转到币种搜索页面
     */
    handleSearch() {
      var eleList = this.$refs['dataContainer'].querySelectorAll('[data-main=main]');
      for (let item of eleList) {
        let _style = item.getAttribute('style');
        if (_style) {
          item.setAttribute('style', 'transition: transform .3s;transform: translateX(0)');
          setTimeout(function() {
            item.setAttribute('style', '');
          }, 300);
        }
      }
      this.$loginRoute('./quotation/search');
    },
    /**
     * 查看币种K线详情
     * @param {*} coinName 
     */
    viewCurrencyDetail(coinName) {
      let that = this,
        ua = window.navigator.userAgent,
        userId = (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId),
        select = that.optionalList.find(item => {return item.name === coinName}),
        item = that.quotationList[that.selectedTab].find(item => {return item.name === coinName}),
        coinTitle = item ? item.title : '',
        isContract = item ? item.isContract : false,
        collectId = select ? select.collectId : '';
        
      if (/Native_iOS/.test(ua) && coinTitle) {
        
        that.$bridge.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler('jumpToNativeKlineVc', {coinTitle:coinTitle, coinName:coinName, language: that.languageList[that.$i18n.locale], userId: userId, collectId: collectId, isCollected: !!collectId, isContract: isContract, sessionId: window.sessionStorage.getItem('sessionId')}, function(res) {});
        });
        // that.$store.state.bridge.callHandler('jumpToNativeKlineVc', {coinTitle:coinTitle, coinName:coinName, language: that.languageList[that.$i18n.locale], userId: userId, collectId: collectId, isCollected: !!collectId, isContract: isContract}, function(res) {});
        return;
      } else if (/Native_Android/.test(ua)) {
        prompt("cg://web/klinepage?" + JSON.stringify({coinTitle:coinTitle, coinName:coinName, language: that.languageList[that.$i18n.locale], userId: userId, collectId: collectId, isCollected: !!collectId, isContract: isContract, sessionId: window.sessionStorage.getItem('sessionId')}),"");
        return;
      }
      window.location.href = this.$phpUrl + '/' + (item.isContract ? 'contract' : 'trade') + '/kline/market/' + coinName + '?lang=' + this.$i18n.locale
    },
    /**
     * 显示添加自选
     * @param {*} coinTitle 
     * @param {*} coinName 
     */
    showAddOptional(coinTitle, coinName, unit) {
      let that = this;
      that.selectedItem.title = coinTitle;
      that.selectedItem.name = coinName;
      that.selectedItem.unit = unit;
    }
  }
}