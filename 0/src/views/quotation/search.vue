<template>
  <div class="search-currency">
    <div class="common-header">
      <img src="../../assets/img/common/previous_page.png" alt="" @click="$router.push({name: 'quotation'});$store.commit('changeNoMenu', true);"/>
      <div class="search-data">
        <img src="../../assets/img/quotation/search.png" alt/>
        <input v-model="searchValue" :placeholder="$t('quotation.search.currencyName')" @input="searchResult"/>
      </div>
    </div>
    <div class="data-list" v-if="isLoading">
      <ul v-show="showList.length">
        <li class="data-list-item" v-for="(item, index) in showList" :key="index">
          <p>{{item.title | tit(0)}}
            <span>/ {{item.title | tit(1)}}</span>
          </p>
          <div class="collection-icon" @click.prevent="changeCollection(item)">
            <img :src="item.collection ? require('../../assets/img/quotation/overCollection.png') : require('../../assets/img/quotation/noCollection.png')" alt/>
          </div>
        </li>
      </ul>
      <div v-show="!showList.length" class="no-search-data">
        <img src="../../assets/img/quotation/no-data-search.png" alt/>
        <p>{{$t('quotation.search.noDataSearch')}}</p>
      </div>
    </div>
  </div>
</template>
  
<script>
import service from './quotation.service';
export default {
  data() {
    return {
      currencyList: [],
      searchValue: '',
      showList: [],
      nameList: [],
      optionalList: [],
      optionalNameList: [],
      isLoading: false
    }
  },
  beforeRouteEnter (to, from, next) {
    // ...
    next(vm => {
      vm.getOptionalData();
      vm.$store.commit('changeNoMenu', false);
    })
  },
  beforeRouteLeave (to, from, next) {
    // ...
    this.$store.commit('changeNoMenu', true);
    next();
  },
  filters: {
    tit(str, i) {
      return str.split('/')[i]
    },
    priceChange(num) {
      return num >= 0 ? '+' + num + '%' : num + '%'
    }
  },
  methods: {
    /**
     * 根据关键字搜索数据
     */
    searchResult() {
      let that = this;
      that.showList = that.currencyList.filter(item => {return item.title.toLocaleLowerCase().indexOf(that.searchValue.toLocaleLowerCase()) !== -1})
    },
    /**
     * 获取自选列表数据
     */
    async getOptionalData(key= true) {
      let that = this,
        _$service = service(that.$axios),
        _userId = (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId);
      that.searchValue = '';
      if (key) {
        that.isLoading = false;
        that.$store.commit('changeLoading', !that.isLoading);
      }
      if (!_userId) {
        that.optionalList = [];
        return;
      }
      let data = await _$service.queryOptionalData({
        userId: _userId,
        pageNum: 100,
        currentPage: 1
      });
      if (data.status === 200) {
        that.optionalList = (data.data.data ? data.data.data.list : []).map(item => {return {collectId: item.collectId, name: item.name, title: item.title,unit: item.unit}});
        that.optionalNameList = that.optionalList.map(item => {return item.name});
      } else {
        that.optionalList = [];
      }
      that.getList();
    },
    /**
     * 获取数据列表
     */
    async getList() {
      let that = this,
        _$service = service(that.$axios);
      let data = await _$service.queryTransactionData({});
      that.currencyList = ([].concat(data.data.extendCoinArr, data.data.mainCoinArr, data.data.assitsCoinArr)).map(item => {return {title: item.title,name: item.name, collection: false, unit: item.unit}});
      that.nameList = that.currencyList.map(item => {return item.name});
      that.nameList.sort();
      let result = [];
      for (let i = 0; i < that.nameList.length; i++) {
        result[i] = that.currencyList.find(item => {return item.name === that.nameList[i]});
      }
      for (let item of result) {
        let res = that.optionalList.find(opt => {return opt.name === item.name});
        if (res) {
          item.collection = true;
          item.collectId = res.collectId;
        } else {
          item.collectId = '';
        }
      }
      that.currencyList = result;
      that.showList = result;
      // console.log(that.showList)
      // let arrData={
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
      //   that.showList=that.showList.filter(item=>{
      //     return arrData[item.name]===1 ?false : item;
      //   })
      //   console.log(111,that.showList)
      that.isLoading = true;
      that.$store.commit('changeLoading', !that.isLoading);
    },
    /**
     * 根据是否添加自选状态，调用事件
     * @param {*} item 当前选中的项
     */
    changeCollection(item) {
      let that = this;
      if (item.collection) {
        that.delOptionalByInfo(item.collectId);
      } else {
        that.addOptionalByInfo(item.title, item.name, item.unit);
      }
      item.collection = !item.collection;
    },
    /**
     * 删除自选
     * @param {*} collectId 自选唯一编码
     */
    async delOptionalByInfo(collectId) {
      let that = this,
        _$service = service(that.$axios),
        _userId = (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId);
      let data = await _$service.delOptional({
        userId: _userId,
        collectId: collectId
      })
      if (data.status == 200) {
        if (data.data.status == 200) {
          that.$normalToast(that.$t('quotation.delOptionalSuccess'), 1000);
        }
      }
    },
    /**
     * 添加自选
     * @param {*} title 币种标题
     * @param {*} name 币种名称
     * @param {*} unit 币种标识
     */
    async addOptionalByInfo(title, name, unit) {
      let that = this,
        _$service = service(that.$axios),
        _userId = (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId);
      let data = await _$service.addOptional({
        userId: _userId,
        title: title,
        name: name,
        unit: unit
      });
      if (data.status == 200) {
        if (data.data.status == 200) {
          that.$normalToast(that.$t('quotation.addOptionalSuccess'), 1000);
          that.getOptionalData(false);
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search-currency {
  .data-list {
    margin: 80px 0 100px;
    padding: 0 35px;
    border-top: solid 1px #dcdcdc;
    background-color: #fff;
    .data-list-item {
      display: flex;
      padding: 35px 0 35px 0;
      border-bottom: solid 1px #dcdcdc;
      font-size: 34px;
      color: #505050;
      .collection-icon {
        width: 100px;
        & > img {
          width: 36px;
          height: 34px;
        }
      }
      & > p {
        flex-grow: 1;
        text-align: left;
        & > span {
          font-size: 24px;
          color: #adadad;
        }
      }
    }
    .no-search-data {
      position: fixed;
      top: 0;
      left: 0;
      padding-top: 40%;
      width: 100%;
      height: 100%;
      background-color: #fff;
      z-index: 100;
      & > img {
        width: 164px;
        height: 160px;
      }
    }
  }
}
</style>

