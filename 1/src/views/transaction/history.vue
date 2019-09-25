    <template>
    <div class="transaction-history">
        <div class="history-header">
            <div class="leftbox" @click="goBack">
                <img src="../../assets/img/transaction/arrow_left.png">
                <!-- <span class="history-coin">{{orderRecordType | symbolFilter}}</span> -->
            </div>
            <div class="rightbox">
                <img @click="changeHandle" src="../../assets/img/transaction/choose.png">
                <!-- <img @click="changeHandle" v-show="orderType === 'history'" src="../../assets/img/transaction/choose.png"> -->
            </div>
        </div>
            <!-- <div class="line" v-show="popupShow"></div> -->
        <div v-show="popupShow" class="order-filter">
              <!-- 弹窗标题 -->
              <h2 class="h-title">{{orderType === 'funding' ? $t('trade.funding') : $t('trade.historyRecords')}}</h2>

          <div class="order-record-filter">
            <!-- <p>{{$route.name === 'tradeHistory' ? '币币币种' : $t('transaction.transactionCion')}}</p> -->
            <p>{{orderType === 'funding' ? $t('trade.type') : $t('trade.coin')}}</p>
            <div class="order-record-type">
              <div
								v-for='item in coinTitle'
								:key='item.symbol'
                :class="['order-record-item', {'order-record-active': orderRecordType === item.symbol}, {'mini': item.mini}]" 
                @click="orderRecordType=item.symbol;"
                v-text="item.title"
                >
              </div>
            </div>
            <!-- <p v-text="$t('orderRecord.dealType.title')"></p>
            <div class="order-record-status">
              <div 
								v-for='item in orderSide'
								:key='item.side'
                :class="['order-record-item', {'order-record-active': orderRecordStatus === item.side}]"
                @click="orderRecordStatus=item.side;"
                v-text="$t(item.title)"
            	></div>
            </div> -->
            <!-- <p v-text="$t('transaction.transactionDirection')"></p>
            <div class="order-record-status">
              <div
								v-for='item in orderAction'
								:key='item.active'
								:class="['order-record-item', {'order-record-active': orderRecordDirection === item.active}]"
								@click="orderRecordDirection=item.active;"
								v-text="$t(item.title)"
							></div>
            </div> -->
          </div>
          <div class="filter-footer">
            <div class="filter-item" v-text="$t('orderRecord.cancel')" @click="cancleHandle"></div>
            <div class="filter-item filter-item-active" v-text="$t('orderRecord.confirm')" @click="getOrderRecordListTest()"></div>
          </div>
          <!-- <div class="filter-footer">
            <div class="filter-item" v-text="$t('orderRecord.cancel')" @click="cancleHandle"></div>
            <div class="filter-item filter-item-active" :class="{disable: (!orderRecordType || !orderRecordStatus || !orderRecordDirection)}" v-text="$t('orderRecord.confirm')" @click="getOrderRecordList()"></div>
          </div> -->
        </div>
        <div class="popup-bottom" v-show="popupShow" @click="cancleHandle"></div>
        <div class="history-body">
          <TouchRefresh :onLoadMore='onLoad' :enableLoadMore='enableLoadMore' :showFooter='showFooter'>
              <div class="history-body">
              <h2 class="h-title">
                <span @click="orderTypeChange('history')" :class="{active: orderType === 'funding'}">
                  {{$t('trade.historyRecords')}}
                </span>
                <span 
                  v-show="!($route.name === 'tradeHistory')"
                  @click="orderTypeChange('funding')"
                  :class="{active: orderType === 'history'}">{{$t('trade.funding')}}</span>
              </h2>
                    <div class="ul-box">
                      <ul ref="sDom">
                        <li v-show="orderType === 'history'" v-for="item in renderTotals" @click='gotoOrder(item.id)' :key="item.id">
                            <div class="top"> 
                                  <!-- <p>{{item.updated_at !==0?new Date(item.updated_at) : new Date(item.created_at)}}</p> -->
                                <h4>
                                    <div>
                                        <span :class="{denger: filterDenger([item.side, item.action], $route.name)}">
                                          {{[item.side, item.action] | sideStatus($route.name)}}
                                        </span>
                                        <span>{{item.symbol | sybFilter}}</span>
                                    </div>
                                    <div>
                                        <span>{{item.state === 1 ? $t('trade.finished'): $t('trade.cancel')}}</span>
                                        <img src="../../assets/img/transaction/arrow_right.png" alt="">
                                    </div>
                                </h4>
                                <!-- <span>{{(item.updated_at) || (item.created_at) | date('yyyy-MM-dd hh:mm:ss')}}</span> -->
                                <ul>
                                    <li v-if="[1,3].includes(item.state)">
                                        <h5>{{$t('trade.volume')}}({{item.symbol | sybFilter}})</h5>
                                        <p>{{item.filled_amount}}</p>
                                    </li>
                                    <li v-if="[2,4].includes(item.state)">
                                        <h5 >{{$t('trade.cancelVal')}}({{item.symbol | sybFilter}})</h5>
                                        <!-- <p>{{item.amount-item.filled_amount}}</p> -->
                                        <p>{{$numMinus(item.amount, item.filled_amount)}}</p>
                                    </li>
                                    <li v-if="[1,3].includes(item.state)">
                                        <H5>{{$t('trade.volumePrice')}}(USDT)</H5>
                                        <p>{{$toNumStr(item.filled_value / item.filled_amount) || 0}}</p>
                                    </li>
                                    <li v-if="[2,4].includes(item.state)">
                                        <H5>{{$t('entrust.commiPrice')}}(USDT)</H5>
                                        <p>{{$toNumStr(item.price) || 0}}</p>
                                    </li>
                                    <li v-if="item.action !== 0 && ([1,3].includes(item.state))">
                                        <h5 >{{$t('trade.profitEnd')}}(USDT)</h5>
                                        <p :class="{denger: item.profit <0}">{{item.profit | toNonExponential}}</p>
                                    </li>
                                    <li v-if="item.action === 0 && ([1,3].includes(item.state))">
                                        <h5 >{{$t('trade.fee')}}({{symbolFilterPair(item.symbol, item.side)}})</h5>
                                        <p class="normal">{{$toNumStr(item.fee, 4)}}</p>
                                    </li>
                                    <li v-if="[2,4].includes(item.state)">
                                        <h5 >{{$t('trade.cancelTime')}}</h5>
                                        <p class="normal">{{(item.updated_at || item.created_at) | date('MM-dd hh:mm')}}</p>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li v-show="orderType === 'funding'" v-for="item in renderFunding" @click='gotoOrder(item.id)' :key="item.id">
                            <div class="top">
                                  <!-- <p>{{item.updated_at !==0?new Date(item.updated_at) : new Date(item.created_at)}}</p> -->
                                <h4>
                                    <div>
                                        <span class="funding-blue">{{item.event| fundingStatusFilter}}</span>
                                        <!-- <span>{{item.symbol | sybFilter}}</span> -->
                                    </div>
                                    <div></div>
                                </h4>
                                <ul>
                                    <li>
                                        <h5 >{{$t('trade.time')}}</h5>
                                        <p class="normal">{{item.created_at | date('hh:mm MM/dd')}}</p>
                                    </li>
                                    <li>
                                        <h5 >{{$t('trade.fee')}}(USDT)</h5>
                                        <p>{{item.fee | toNonExponential | numFil}}</p>
                                    </li>
                                    <li>
                                        <h5 >{{item.event| amoutFilter}}(USDT)</h5>
                                        <p :class="{denger: item.amount <0}"><span v-show="markFilter(item.event)">{{(item.amount > 0) ?'+':''}}</span>{{item.amount |toNonExponential | numFil}}</p>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                    </div>

                  <!-- <div class="foot-oding" v-show="renderData.length && !getLoading">
                    <Loading v-show="!everyNoData"></Loading><span v-show="!everyNoData">加载中....</span>
                    <span v-show="everyNoData">到底了！</span>
                  </div> -->
                <div v-show="nodataShow && !getLoading" class="no-data">
                  <img src="../../assets/img/assets/noData.png" alt/>
                  <p v-text="$t('assets.address.noData')"></p>
                </div>
              </div>
            </TouchRefresh>
        </div>
    </div>
</template>

<script>
import { getHistoryOrders, getCoinInfoNew, postFunddingList } from "./request.js";
import { Loading, List  } from 'vant';
import TouchRefresh from "@/component/TouchRefresh";

export default {
  components:{
    Loading,
    List,
    TouchRefresh
  },
  data() {
    let that = this;
    return {
      popupShow: false,
      orderType: 'history',
      event: null, // 资金流水事件
      orderRecordType: '',  //币种交易对
      orderRecordStatus: '',  // 交易方向
			orderRecordDirection:'',  // 操作类型
      oldOrderRecordType: '',
      oldOrderRecordStatus: '',
			oldOrderRecordDirection:'',
      renderData: [],
      loadmore: false,  //加载更多
      finished: false,  // 没有更多数据
      page: 1,  //获取订单页数
      size: 10, //获取条数
      fundPage: 1,
      coinIsEnd: false, // 某种币种是否没有订单
      everyNoData: false,   // 所有币种都没有数据了
      enableLoadMore: true,   // 是否加载结束
      renderFunding: [],
      fundTotal: -1,
      coinTitle: [
        {title: 'XBTC', symbol: 'xbtc_usdt', total: null, page: 1, size: 20, isEnd: false},
        {title: 'XETH', symbol: 'xeth_usdt', total: null, page: 1, size: 20, isEnd: false},
        {title: 'XEOS', symbol: 'xeos_usdt', total: null, page: 1, size: 20, isEnd: false},
        {title: 'XXRP', symbol: 'xxrp_usdt', total: null, page: 1, size: 20, isEnd: false},
        {title: 'XLTC', symbol: 'xltc_usdt', total: null, page: 1, size: 20, isEnd: false},
        {title: 'XBCH', symbol: 'xbch_usdt', total: null, page: 1, size: 20, isEnd: false},
        {title: 'XETC', symbol: 'xetc_usdt', total: null, page: 1, size: 20, isEnd: false},
        {title: 'XTRX', symbol: 'xtrx_usdt', total: null, page: 1, size: 20, isEnd: false},
        {title: that.$t('transaction.history.all'), symbol: 'all', total: null, page: 1, size: 20, isEnd: false}
      ],
      coinTitle1: [
        {title: 'XBTC', symbol: 'xbtc_usdt', total: null, page: 1, size: 20, isEnd: false},
        {title: 'XETH', symbol: 'xeth_usdt', total: null, page: 1, size: 20, isEnd: false},
        {title: 'XEOS', symbol: 'xeos_usdt', total: null, page: 1, size: 20, isEnd: false},
        {title: 'XXRP', symbol: 'xxrp_usdt', total: null, page: 1, size: 20, isEnd: false},
        {title: 'XLTC', symbol: 'xltc_usdt', total: null, page: 1, size: 20, isEnd: false},
        {title: 'XBCH', symbol: 'xbch_usdt', total: null, page: 1, size: 20, isEnd: false},
        {title: 'XETC', symbol: 'xetc_usdt', total: null, page: 1, size: 20, isEnd: false},
        {title: 'XTRX', symbol: 'xtrx_usdt', total: null, page: 1, size: 20, isEnd: false},
        {title: that.$t('transaction.history.all'), symbol: 'all', total: null, page: 1, size: 20, isEnd: false}
      ],
      coinTitle2: [
        {title: 'BTC', symbol: 'btc_usdt', total: null, page: 1, size: 20, isEnd: false},
        {title: 'ETH', symbol: 'eth_usdt', total: null, page: 1, size: 20, isEnd: false},
        {title: 'EOS', symbol: 'eos_usdt', total: null, page: 1, size: 20, isEnd: false},
        {title: 'LTC', symbol: 'ltc_usdt', total: null, page: 1, size: 20, isEnd: false},
        {title: 'OMG', symbol: 'omg_usdt', total: null, page: 1, size: 20, isEnd: false},
        {title: 'IOST', symbol: 'iost_usdt', total: null, page: 1, size: 20, isEnd: false},
      ],
      coinTitle3: [
        {title: '充值', symbol: 1, total: null, page: 1, size: 20, isEnd: false},
        {title: '扣款', symbol: 2, total: null, page: 1, size: 20, isEnd: false},
        {title: '转入', symbol: 3, total: null, page: 1, size: 20, isEnd: false},
        {title: '转出', symbol: 4, total: null, page: 1, size: 20, isEnd: false},
        {title: '入金', symbol: 5, total: null, page: 1, size: 20, isEnd: false},
        {title: '提现', symbol: 6, total: null, page: 1, size: 20, isEnd: false},
        {title: '买涨开仓', symbol: 201, total: null, page: 1, size: 20, isEnd: false},
        {title: '买跌开仓', symbol: 202, total: null, page: 1, size: 20, isEnd: false},
        {title: '买涨平仓', symbol: 204, total: null, page: 1, size: 20, isEnd: false},
        {title: '买跌平仓', symbol: 205, total: null, page: 1, size: 20, isEnd: false},
        {title: '资金费', symbol: 9, total: null, page: 1, size: 20, isEnd: false},
        {title: that.$t('transaction.history.all'), symbol: null, total: null, page: 1, size: 20, isEnd: false},
      ],
      coinTitle_temp: [],
      orderRecordType_temp: '',
      orderSide: [
        {title: '买涨', side: 1},
        {title: '买跌', side: 2},
        {title: '全部', side: '0'},
      ],
      orderAction: [
        {title: '开仓', active: '0'},
        {title: '平仓', active: 1},
        {title: '爆仓', active: 4},
        {title: '全部', active: 9}						
      ],
    }
  },
  computed: {
    renderTotals() {
    // console.log(this.renderData)
      return this.renderData.sort((a,b) => {
        let time1 = a.updated_at || a.created_at;
        let time2 = b.updated_at || b.created_at;
        return time2-time1;
      })
    },
    nodataShow() {
      if(this.orderType === 'funding') {
        return !this.renderFunding.length
      }
      return !this.renderData.length;
    },
    totalNum() {
      let res = 0;
      this.coinTitle.forEach(item => {
        res += item.total
      })
      return res;
    },
    getLoading() {
      return this.$store.state.loading
    },
    showFooter() {
      // return !!(this.renderData.length)
      if(this.orderType === 'funding') {
        return !!this.renderFunding.length
      }
      return !!this.renderData.length;
    },  // 是否显示尾部加载或加载完成
  },
  filters: {
    sideFilter(val) {
      switch (val) {
        case 1:
          return '买涨'
        case 2:
          return '买跌'
        default:
          return ''
      }
    },
    languagei18n(val, vm) {
      return vm.$t(val);
    },
    numFil(val) {
      if(!Number(val)) return '--';
      return val;
    },
    actionFilter(val) {
      switch (val[0]) {
        case 0:
          return '开仓'
        case 1:
          return '平仓'
        case 4:
          return '爆仓'
        default:
          return ''
      }
    },
    sideStatus(arr,name) {   //[side, action]
      if(name === 'tradeHistory') {
        return arr[0] === 1 ? '买入' : '卖出'
      }
      if(arr[1] === 0) {  // 开仓
        switch (arr[0]) {
          case 1: // 买涨开仓
            return '买涨-开仓';
          case 2: // 买涨平仓
            return '买跌-开仓';
          default:
            return '--'
        }
      } else if(arr[1] === 1){    // 平仓
        switch (arr[0]) {
          case 1: // 买跌平仓
            return '买跌-平仓';
          case 2: // 买涨平仓
            return '买涨-平仓';
          default:
            return '--'
        }
      } else if(arr[1] === 4){    // 爆仓
        switch (arr[0]) {
          case 1: // 买跌开仓
            return '买跌-爆仓';
          case 2: // 买跌平仓
            return '买涨-爆仓';
          default:
            return '--'
        }
      } else {
        return '--'
      }
    },
    symbolFilter(val) {
      if(!val) return;
      return val.split('_').join('/').toUpperCase();
    },
    sybFilter(val) {
      if(!val) return;
      return val.split('_')[0].toUpperCase();
    },
    amoutFilter(val) {
      let status = {
        '1': '金额',
        '2': '金额',
        '3': '金额',
        '4': '金额',
        '5': '金额',
        '6': '金额',
        '9': '盈亏',
        '101': '盈亏',
        '102': '盈亏',
        '201': '盈亏',
        '202': '盈亏',
        '205': '盈亏',
        '204': '盈亏',
      }
      return status[val] || '--';
    },
    balanceFilter(val) {
      let status = {
        '1': '余额',
        '2': '余额',
        '3': '余额',
        '4': '余额',
        '5': '余额',
        '6': '余额',
        '9': '交易金额',
        '101': '交易金额',
        '102': '交易金额',
        '201': '交易金额',
        '202': '交易金额',
        '205': '交易金额',
        '204': '交易金额',
      }
      return status[val] || '--';
    },
    
    fundingStatusFilter(val) {
      let status = {
        '1': '充值',
        '2': '扣款',
        '3': '转入',
        '4': '转出',
        '5': '入金',
        '6': '提现',
        '9': '资金费',
        '101': '买入',
        '102': '卖出',
        '201': '买涨开仓',
        '202': '买跌开仓',
        '205': '买跌平仓',
        '204': '买涨平仓',
      }
      return status[val] || '--';
    }
  },
  methods:{
    goBack() {
      this.$router.go(-1)
    },
    symbolFilterPair(val, side) {
      if(!val) return '--';
      let index = 1;
      if(this.$route.name === 'tradeHistory' && side === 1) {
        index = 0;
      }
      return val.toUpperCase().split('_')[index];
    },
    orderTypeChange(type) {
      if(this.orderType === type) return;
      this.orderType = type;
      if(type === 'funding') {
        this.coinTitle_temp = [...this.coinTitle];
        this.orderRecordType_temp = this.orderRecordType;
        this.coinTitle = [...this.coinTitle3];
        this.orderRecordType = this.event;
      } else {
        this.coinTitle = [...this.coinTitle_temp];
        this.event = this.orderRecordType;
        this.orderRecordType = this.orderRecordType_temp;
      }
      this.enableLoadMore = true;
      this.fn && this.fn();
      this.oldOrderRecordType = this.orderRecordType;
      if(this.renderFunding.length && this.renderTotals.length) {
        return ;
      }
      if(this.orderType === 'funding') {
        this.postFundingData();
        return;
      }
    },
    markFilter(val) {
      let status = {
        '1': false,
        '2': false,
        '3': false,
        '4': false,
        '5': true,
        '6': true,
        '7': true,
        '8': true,
        '9': true,
      }
      return status[val] || false;
    },
    postFundingData(load,fn) {
      if((this.fundTotal !== -1) && (this.fundTotal <= this.renderFunding.length)) {
        this.enableLoadMore = false;
        return ;
      }
      this.$store.commit('changeLoading', true);
      postFunddingList({event: this.orderRecordType, page: this.fundPage, size: 20}).then(res => {
        this.$store.commit('changeLoading', false);
        if(res.data.status === 200) {
          this.fundTotal = res.data.data.total;
          if(load && res.data.data.list) {
            this.renderFunding = this.renderFunding.concat(res.data.data.list);
          } else{
            this.renderFunding = res.data.data.list || [];
          }
          if(res.data.data.total <= this.renderFunding.length) {
            this.enableLoadMore = false;
          } else {
            this.fundPage = this.fundPage + 1;
            fn&&fn();
          }
        }
      }).catch(() => {
        this.enableLoadMore = false;
        this.$store.commit('changeLoading', false);
      }).finally(() => {
        this.$store.commit('changeLoading', false);
      })
    },
    filterDenger(arr, name) {
      if(name === 'tradeHistory') {
        return arr[0] === 1 ? false : true
      }
      // 买涨买跌颜色
      if(arr[1] === 0) {  // 开仓
          switch (arr[0]) {
              case 1: // 买涨开仓
                  return  false;
              case 2: // 买涨平仓
                  return  true;
              default:
                  return false
          }
      } else if(arr[1] === 1){    // 平仓
          switch (arr[0]) {
              case 1: // 买跌平仓
                  return  true;
              case 2: // 买涨平仓
                  return  false;
              default:
                  return true
          }
      } else if(arr[1] === 4){    // 爆仓
          switch (arr[0]) {
              case 1: // 买跌开仓
                  return  true;
              case 2: // 买跌平仓
                  return  true;
              default:
                  return true
          }
      } else {
          return '--'
      }
    },
    changeHandle() {
      // if(this.orderType === 'funding') return;
      this.popupShow = !this.popupShow;
    },
    onLoadMoreHandle() {
    },
    onLoad(fn){
      this.fn = fn;
      if(this.orderType === 'funding') {
        this.postFundingData(true,fn);
        return;
      }
      if(this.orderRecordType ==='all') {
        // console.log(this.totalNum, this.renderData.length)
        if(this.totalNum <= this.renderData.length && (this.renderData.length !==0) ) {
          this.finished = true; // 没有更多
          this.loadmore = false;
          this.enableLoadMore = false;
          return ;
        }
        this.loadAddMoreHandle(fn);
      } else {
        let temp = null;
        this.coinTitle.forEach(item => {
          if(item.symbol === this.orderRecordType) {
            temp = item;
          }
        })
        // console.log(temp.total, this.renderData.length)

        if(temp.total <= this.renderData.length && (this.renderData.length !==0) ) {
          this.finished = true; // 没有更多
          this.loadmore = false;
          this.enableLoadMore = false;
          return ;
        }
        this.page += 1;
        this.axiosCoinHanlde(this.orderRecordType).then( res => {
          this.loadmore = false;
          if(res.data.status === 200) {
            temp.total = res.data.data.total;
            this.renderData.push(...(res.data.data.list || []));
            this.renderSortHandle() //排序
            fn && fn()
          }
        }).catch(() => {
          this.loadmore = false;
          this.finished = true; // 没有更多
          // this.enableLoadMore = false;
        })
      }
    },
    renderSortHandle() {
      return;
      this.renderData.sort((a,b) => {
        let time1 = a.updated_at || a.created_at;
        let time2 = b.updated_at || b.created_at;
        return time1-time2;
      })
      // this.renderData.map(item => {
      //   let time1 = item.updated_at || b.created_at;
      //   console.log(item)
      // })
    },
    getOrderRecordListTest() {
      this.popupShow=false;
        if(this.oldOrderRecordType === this.orderRecordType) {
          // 一样的
          return;
        }
        
      this.oldOrderRecordType = this.orderRecordType;
      this.loading = true;
      if(this.orderRecordType === 'all') {
        this.page = 1;  //每次选择从第一页请求数据
        this.renderData = [];
        this.axiosAllHanlde(true);
      } else if(this.orderType === 'funding') {
        this.fundPage = 1;
        this.fundTotal = -1;
        this.enableLoadMore = true;
        this.postFundingData(false, this.fn);
      } else {
        this.renderData = [];
        this.page = 1;  //每次选择从第一页请求数据
        this.$store.commit('changeLoading', true);
        this.axiosCoinHanlde(this.orderRecordType).then( res => {
          this.$store.commit('changeLoading', false);
          if(res.data.status === 200) {
            this.renderData = res.data.data.list || [];
            this.renderSortHandle() //排序
          }
        }).catch(() => {
          this.$store.commit('changeLoading', false);
        })
      }
    },
    async getOrderRecordList() {   
        // 筛选具体币种订单
        // if((!this.orderRecordType || !this.orderRecordStatus || !this.orderRecordDirection)) return;
        this.popupShow=false;
        this.oldOrderRecordType = this.orderRecordType
        this.oldOrderRecordStatus = this.orderRecordStatus
        this.oldOrderRecordDirection = this.orderRecordDirection
        let res = await this.axiosCoinHanlde(this.orderRecordType);
        if(res.data.status === 200) {
          this.everyNoData = true;
          if(!(res.data.data.list)) return;
          this.renderData = res.data.data.list.filter(item => {
            if(this.orderRecordStatus == 0) { // 选择交易类型全部
              return item.action == this.orderRecordDirection;
            }
            if(this.orderRecordDirection == 9) {  // 选择交易方向全部
              return item.side == this.orderRecordStatus;
            }
            return (item.action == this.orderRecordDirection) &&  (item.side == this.orderRecordStatus);
          })
        } else {
          this.renderData = []
        }
    },
    cancleHandle() {
        // 取消筛选
        this.popupShow=false;
        this.orderRecordType = this.oldOrderRecordType
        this.orderRecordStatus = this.oldOrderRecordStatus
        this.orderRecordDirection = this.oldOrderRecordDirection
    },
    gotoOrder(id) {
      if(this.orderType === 'funding') return;
      let icon =  this.$route.params.icon;
      let name = this.$route.name;
      if(name === 'tradeHistory') {
        this.$router.push(`/trade/${icon}/order?id=${id}`);
        return ;
      }
      // let name = actionCoin ? actionCoin.name : 'xbtc_usdt';
      this.$router.push(`/transaction/${icon}/order?id=${id}`);
    },
    axiosCoinHanlde(symbol) {
      return getHistoryOrders(symbol,{page:this.page,size:this.size});
    },
    axiosAllHanlde(frist) {  // 选择加载全部
      this.$store.commit('changeLoading', true);
      this.coinTitle.map(item => {
        // if(item.isEnd) return;
        if(item.symbol === 'all') return;
        if(!frist && item.isEnd) return;
        item.page = 1;
        // item.size = 1;
        return getHistoryOrders(item.symbol,{page: item.page,size:item.size}).then(res => {
          this.$store.commit('changeLoading', false);
          if(res.data.status === 200) {
            item.total = res.data.data.total;
            this.renderData.push(...res.data.data.list);
            this.renderSortHandle();  //排序
            if(res.data.data.total <= item.page*item.size){
              item.isEnd = true;
            } else {
              item.page += 1;
            }
          }
        }).catch(() => {
          this.$store.commit('changeLoading', false);              
        })
      })
      // return Promise.all(axiosA)
    },
    // 初次进入页面加载
    loadListHandle(type) {
      if(this.orderRecordType === 'all') {
        this.axiosAllHanlde();
      } else {
        this.$store.commit('changeLoading', true);
        this.axiosCoinHanlde(this.orderRecordType).then( res => {
          this.$store.commit('changeLoading', false);
          if(res.data.status === 200) {
            let temp = this.coinTitle.filter(item => item.symbol == this.orderRecordType);
            temp[0].total = res.data.data.total;
            this.renderData = res.data.data.list || [];
            this.renderSortHandle();  //排序
          }
        }).catch(() => {
          this.$store.commit('changeLoading', false);
        })
      }
    },
    loadAddMoreHandle(fn) {
      this.loadAddMore().then(res => {
        this.loadmore = false;
        fn && fn()
      }).catch(() => {
        this.loadmore = false;
        fn && fn()
      })
    },
    loadAddMore() { // 加载更多
      let arr = this.coinTitle.map((item, index) => {
        if(item.isEnd || item.symbol === 'all') return;
        let historyList =  getHistoryOrders(item.symbol,{page: item.page,size:item.size}).then(res => {
          if(res.data.status === 200) {
            item.total = res.data.data.total;
            this.renderData.push(...res.data.data.list);
            this.renderSortHandle();  //排序
            if(res.data.data.total <= item.page*item.size){
              item.isEnd = true;
            } else {
              item.page += 1;
            }
          }
        }).catch(() => {})
        return historyList;
      })
      // console.log()
      return Promise.all(arr)
    },
	},
  beforeRouteEnter(to, from, next){
      next(vm => {
          if(to.name === 'tradeHistory') {
            let coinInfo = localStorage.getItem('coinInfo');
            if(coinInfo) {
              let arr = JSON.parse(coinInfo) || [];
              let coinArr = arr.assitsCoinArr.concat(arr.mainCoinArr);
              vm.coinTitle2 = coinArr.map(item => {
                let temp = {
                  title: item.name.split('_')[0].toUpperCase(),
                  symbol: item.name,
                  total: null,
                  page: 1,
                  size: 20,
                  isEnd: false
                }
                if(temp.title === 'NEWOS' || temp.title === 'ETH') {
                  temp.title = item.name.replace('_', '/').toUpperCase();
                  temp.mini = true;
                }
                return temp;
              })
              vm.coinTitle2.push({title: '全部', symbol: 'all', total: null, page: 1, size: 20, isEnd: false})
            }
            vm.coinTitle = [...vm.coinTitle2];
          } else {
            vm.coinTitle = [...vm.coinTitle1];
          }
          vm.$store.commit('changeNoMenu', false);
          vm.orderRecordType = to.params.icon;
          vm.oldOrderRecordType = to.params.icon;
          vm.loadListHandle();
      })
  },
  beforeRouteLeave(to, from, next){
      this.$store.commit('changeNoMenu', true);
      this.$store.commit('changeLoading', false);
      next();
  },

}
</script>

<style lang='less' scoped>
.transaction-history{
		position: relative;
		display:flex;
		height: 100%;
		flex-direction: column;
    .history-header{
        height: 80px;
        padding: 20px;
        display: flex;
        
        justify-content: space-between;
        .leftbox{
            // padding-left: 19px;
            .history-coin{
                font-size: 34px;
                color: #202025;
                font-weight: bold;
                vertical-align: middle;
                padding-left: 24px;
            }
            img {
                width: 19px;
                height: auto;
                vertical-align: middle;
            }
        }
        .rightbox{
            img {
                margin-left: 50px;
                width: 36px;
                height: auto;
                vertical-align: middle;
            }
        }
    }
    h2{
        // border: 1px solid red;
        // height: 44px;
        font-size: 45px;
        color: #202025;
        text-align: left;
        padding: 0 26px 40px;
				margin: 60px  0 0;
        border-bottom: 1px solid #dcdcdc;
        position: relative;
        z-index: 102;
        span{
          margin-right: 20px;
        }
        span.active{
          // font-weight: normal;
          font-size: 32px;
          color: #898989;
        }
    }
        
    .history-body{
				flex: 1;
				overflow-y: scroll;
        // border: 1px solid #000;
        .ul-box>ul{
          // overflow-y: scroll;
          height: auto;
            &>li{
                height: 222px;
                // border: 1px solid #dcdcdc;
                border-bottom: 1px solid #dcdcdc;
								margin: 0 24px;
								display:flex;
								flex-direction: column;
								// align-items: center;
                justify-content: center;
                // padding: 24px;y			
								.top{
									width: 100%;
								}								
                h4{
                    height: 71px;
                    text-align: left;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    // border-bottom: 1px solid #dcdcdc;
                    span{
                        font-size: 34px;
                        color: #85bf85;
                        padding-right: 28px;
                        vertical-align: middle;
                        &:nth-child(2){
                            color: #545454;
                        }
                    }
                    .funding-blue {
                      color: #3e80ca;
                    }
                    img{
                        width: 11px;
                        height: auto;
                    }
                    div:last-child{
                      span{
                         font-size: 28px;
                         color: #d5d5d5;
                      }
                    }
                }
                ul{
                    height: 70px;
                    display: flex;
                    justify-content: center;
										margin-top: 36px;
                    li{
										// align-items: center;									
                        flex: 1;
                        text-align: left;
                        display: flex;
                        flex-direction: column;
												justify-content: space-between;
                        font-size: 28px;
                        &:last-child{
														text-align: right;
														p{
															color: #85bf85;
														}
                        }
                        h5{
                            color: #cacaca;
                            font-weight: normal;                            
                        }
                        p {
                            white-space: nowrap;
                            color: #8d8d8d;
                        }
                        .normal {
                            color: #8d8d8d !important;
                        }
                    }
                }
                .denger{
                    color: #d87675 !important;
                }
            }
        }
        .foot-oding{
          margin-top: 10px;
          display: flex;
          justify-content: center;
          vertical-align: middle;
        }
    }
    // .line{
    //     border-top: 1px solid #6d6d6d;
    //     position: absolute;
    //     font-size: 0;
    //     height: 0;
    //     width: 730px;
    //     margin: 0 15px;
    //     z-index: 1001;
    //     top: 265px;
    //   }
    .order-filter {
      position: absolute;
      background-color: #fff;
      z-index: 200;
      top: 80px;
      text-align: left;
      max-height: 962px;
      overflow-y: auto;
      // padding-top: 190px;
      .order-record-filter {
        margin: 0 15px;
        padding: 50px 10px 90px;
        // border-top: solid 1PX #6d6d6d;
        box-sizing: content-box;
        & > p {
          height: 33px;
          line-height: 33px;
          font-size: 34px;
        }
        .order-record-type, .order-record-status {
          margin-bottom: 45px;
          .order-record-item {
            margin: 45px 40px 0 0;
            display: inline-block;
            width: 199px;
            height: 71px;
            line-height: 71px;
            border-radius: 10px;
            border: solid 1PX #a0a0a0;
            font-size: 28px;
            color: #575757;
            text-align: center;
          }
          .order-record-item:nth-child(3n+3) {
            margin: 0;
          }
          .order-record-active {
            border-color: #3e80ca;
            color: #3e80ca;
          }
          .mini{
            font-size: 24px;
          }
        }
      }
      .filter-footer {
        display: flex;
        text-align: center;
        .filter-item {
          height: 100px;
          line-height: 100px;
          flex: 1;
          background-color: #f8f8f8;
          color: #a6a6a6;
          font-size: 34px;
        }
        .filter-item-active {
          background-color: #3e80ca;
          color: #fff;
        }
      }
    }
    .popup-bottom{
        position: fixed;
        background: rgba(20, 20, 25,.5) ;
        bottom: 0;
        height: 80%;
        width: 100%;
        overflow: hidden;
        z-index: 199;
    }
}
.disable {
  background: #dfdfdf !important;
}
</style>
<style>
.van-list__loading-icon{
  width: 50px !important;
  height:50px !important;
}
.van-list__loading-text{
  font-size: 32px;
}
</style>
