<template>
  <div class="info-record">
    <headers title="" value="" @back="$goBack"></headers>
    <p class="info-record-h" v-text="$t('assets.transfer.record.title')"></p>
    <div class="info-record-data">
      <ul>
        <li class="recos-item" v-for="(item, index) in recordList" :key="index">
          <div class="recos-it-h">
            <p>
              <span v-text="item.type === 3 ? $t('assets.transfer.record.type1') : $t('assets.transfer.record.type0')"></span>
              <span v-text="item.name"></span>
            </p>
            <p>
              <span v-text="$t('assets.transfer.record.status')"></span>
              <!-- <img src="../../assets/img/assets/turnRightList.png" alt/> -->
            </p>
          </div>
          <div class="recos-it-b">
            <div class="recos-it-b-it">
              <p v-text="$t('assets.transfer.record.time')"></p>
              <p>{{item.time | date('hh:mm MM/dd')}}</p>
            </div>
            <div class="recos-it-b-it">
              <p v-text="$t('assets.transfer.record.num')"></p>
              <p v-text="$sliceNum(item.num,8)"></p>
            </div>
            <div class="recos-it-b-it">
              <p v-text="$t('assets.transfer.record.received')"></p>
              <p v-text="$sliceNum(item.receivedMoney,8)"></p>
            </div>
          </div>
        </li>
      </ul>
    </div>
      <!-- <p class="no-other-data" v-show="recordList.length">{{$t('assets.address.noOtherData')}}</p> -->
    <div v-show="!recordList.length" class="no-address">
      <img src="../../assets/img/assets/noData.png" alt/>
      <p v-text="$t('assets.address.noData')"></p>
    </div>
  </div>
</template>

<script>
import headers from '../../component/header';
export default {
  components: {
    headers
  },
  data() {
    return {
      curr: '',
      recordList: []
    }
  },
  beforeRouteEnter (to, from, next) {
    // ...
    next(vm => {
      let key = vm.$route.params.key;
      if (key && (vm.$getCookie('userId') && JSON.parse(decodeURIComponent(vm.$getCookie('userId'))).userId)) {
        vm.curr = key;
        vm.getRecordList();
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
    getRecordList() {
      let that = this;
      that.$axios({
        url: '/user/finance/financeRecords',
        params: {
          userId: (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId),
          coin: that.curr,
          pageNum: 1000,
          currentPage: 1
        }
      }).then(function(data) {
        if (data.data.status == 200) {
          that.recordList = data.data.data.list.map(item => {
            // let dataTime = item.time.replace(/\-/g, '/')
            return {
              name: item.coin.toUpperCase(),
              time: (new Date(item.createdAt)).getTime(),
              num: that.toNonExponential(item.amount),
              receivedMoney: that.toNonExponential(item.amount),
              type: item.event,
            }
          })
        }
      })
    },
    /**
     * 将科学计数法转换为小数
     * @param {*} num 
     */
    toNonExponential(num) {
      num = parseFloat(parseFloat(num).toFixed(8));
      var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
      if(!m) return num;
      return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
    },
  }
}
</script>

<style lang="scss" scoped>
.info-record {
  background: #fff;
  // padding-bottom: 120%;
  flex: 1;
  .info-record-h {
    padding: 50px 26px;
    font-size: 45px;
    color: #202025;
    text-align: left;
    font-weight: bold;
    background-color: #fff;
    border-bottom: 1px solid #dcdcdc;
  }
  .info-record-data {
    overflow: scroll;
    background-color: #fff;
    .recos-item {
      margin: 0 25px;
      padding: 34px 0;
      text-align: left;
      border-bottom: solid 1px #dcdcdc;
      .recos-it-h {
        display: flex;
        margin-bottom: 43px;
        font-size: 34px;
        line-height: 34px;
        color: #3e80ca;
        & > p {
          flex-grow: 1;
          & > img {
            margin-left: 19px;
            vertical-align: middle;
            width: 11px;
            height: 19px;
          }
          & > span:nth-child(2) {
            color: #545454;
          }
        }
        & > P:nth-child(2) {
          text-align: right;
        }
      }
      .recos-it-b {
        display: flex;
        .recos-it-b-it {
          flex-grow: 1;
          & > p {
            font-size: 22px;
            line-height: 22px;
            color: #cacaca;
          }
          & > p:nth-child(2) {
            margin-top: 30px;
            font-size: 28px;
            line-height: 28px;
            color: #8d8d8d;
          }
        }
        .recos-it-b-it:nth-child(2) {
          text-align: center;
        }
        .recos-it-b-it:nth-child(3) {
          text-align: right;
          & > p:nth-child(2) {
            color: #3e80ca;
          }
        }
      }
    }
  }
  .no-address {
    padding-top: 135px;
    & > img {
      width: 135px;
	    height: 129px;
    }
    & > p {
      margin-top: 25px;
      font-size: 24px;
      color: #575757;
    }
  }
}
</style>
