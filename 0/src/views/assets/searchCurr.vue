<template>
  <div class="search-curr">
    <headers :title="$t('assetZhEn.seleCoin')" value="" @back="handleBack"></headers>
    <div class="search-box">
      <div class="search-data">
        <img src="../../assets/img/quotation/search.png" alt/>
        <input v-model="searchValue" :placeholder="$t('quotation.search.currencyName')" @input="searchResult"/>
      </div>
    </div>
    <div class="search-data-list">
      <ul>
        <li @click="handleChose(item.name)" :id="item.id" class="search-item" v-for="(item, index) in showCurrList" :key="index">
          <p v-text="item.name"></p>
          <p v-text="item.title"></p>
        </li>
      </ul>
    </div>
    <div class="quick-link">
      <ul>
        <li class="quick-link-item" v-for="(item, index) in quickList" :key="index">
          <a :href="'#'+item">{{item}}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import headers from '../../component/header'
export default {
  components: {
    headers
  },
  data() {
    let that = this;
    return {
      currList: [],
      searchValue: '',
      quickList: (function() {let list = [];for(let i = 'A'.charCodeAt(0); i < 'Z'.charCodeAt(0)+1;i++){list.push(String.fromCharCode(i));}return list;})(),
      showCurrList: [],
      curr: '',
      path: ''
    }
  },
  beforeRouteEnter (to, from, next) {
    // ...
    next(vm => {
      let key = vm.$route.params.coin,
        path = vm.$route.params.path;
      if (key && path && (vm.$getCookie('userId') && JSON.parse(decodeURIComponent(vm.$getCookie('userId'))).userId)) {
        vm.curr = key;
        vm.path = path;
        vm.getCoin();
        vm.$store.commit('changeNoMenu', false);
      } else 
        vm.$loginRoute('./home');
    })
  },
  beforeRouteLeave (to, from, next) {
    // ...
    this.$store.commit('changeNoMenu', true);
    next();
  },
  methods: {
    searchResult() {
      let that = this;
      if (that.searchValue.trim())
        that.showCurrList = (that.currList.filter(item => {return item.name.toLowerCase().indexOf(that.searchValue.toLowerCase()) !== -1}) || []).concat(that.currList.filter(item => {return item.title.indexOf(that.searchValue) !== -1}));
      else
        that.showCurrList = that.currList;
    },
    handleBack() {
      let that = this;
      that.$loginRoute(`/assets/${that.path}/${that.curr}`);
    },
    handleChose(key) {
      let that = this;
      that.$loginRoute(`/assets/${that.path}/${key}`);
    },
    getCoin() {
      let that = this;
      that.$axios({
        baseURL: that.$interfacePhpUrl,
        url: '/Ajax/coins',
        method: 'get',
        withCredentials: false
      }).then(function(data) {
        if (data.status == 200) {
          var result = data.data.data.coins.map(item => {
            return {
              name: item.name.toUpperCase(),
              title: item.title.split('(')[0].toUpperCase()
            }
          });
          result.sort((item, next) => {
            return item.name > next.name ? 1 : -1;
          });
          let arrData={
            // 'DXCK':that.path === 'withdrawMoney' ? 0 : 1, // 充币隐藏，提币显示
            // 'CGT':1,
            // 'NEWOS':1,
            // 'ZIL':1,
            // 'IOST':1,
            // 'DTA':1,
            // 'OCN':1,
            // 'GNT':1,
            // 'SOC':1,
            // 'CVC':1
          }
          result=result.filter(item=>{
            return arrData[item.name]===1 ?false : item;
          })
          //新增币种ID用于快速导航
          that.currList = result.map((item, index, arr) => {
            item['id'] = index > 0 ? (arr[index-1].name.charAt(0) == item.name.charAt(0) ? arr[index-1]['id'] + index : item.name.charAt(0)) : item.name.charAt(0);
            return item;
          });
          that.showCurrList = that.currList
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.search-curr {
  background-color: #f8f8f8;
  height: 100%;
  position: relative;
  .search-box {
    background-color: #f8f8f8;
    .search-data {
      display: inline-block;
      margin: 24px 0;
      width: 608px;
      height: 62px;
      line-height: 62px;
      border-radius: 25px;
      background-color: rgba(228, 228, 228, .4);
      text-align: left;
      & > img {
        margin-left: 33px;
        width: 36px;
        height: 36px;
        vertical-align: middle;
      }
      & > input {
        margin-left: 25px;
        width: 400px;
        // height: 25px;
        font-size: 24px;
        color: #999;
        vertical-align: middle;
        background-color: transparent;
        border: none;
        text-align: center;
      }
      & > input:focus {
        outline: none;
      }
    }
  }
  
  .search-data-list {
    position: absolute;
    top: 198px;
    left: 0;
    bottom: 0;
    padding: 0 20px;
    width: 100%;
    // height: 100%;
    overflow-y: auto;
    background-color: #fff;
    .search-item {
      display: flex;
      padding: 45px 0 40px;
      text-align: left;
      border-bottom: solid 1px #dcdcdc;
      & > p {
        flex-grow: 1;
        font-size: 28px;
        line-height: 28px;
        color: #545454;
      }
      & > p:nth-child(1) {
        flex-grow: 0;
        width: 245px;
        color: #3e80ca;
      }
    }
  }
  .quick-link {
    position: fixed;
    top: 180px;
    right: 16px;
    width: 24px;
    font-size: 24px;
    .quick-link-item {
      line-height: 40px;
      & > a {
        color: #393939;
        &:visited {
          color: #393939;
        }
      }
    }
  }
}
</style>
