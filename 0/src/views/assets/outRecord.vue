<template>
  <div class="info-record">
    <headers title="" value="" @back="$goBack"></headers>
    <p class="info-record-h" v-text="$t('assets.recharge.record.outTitle')"></p>
    <div class="info-record-data">
      <ul>
        <li @click="handleGo(item)" class="recos-item" v-for="(item, index) in recordList" :key="index">
          <div class="recos-it-h">
            <p>
              <span v-text="$t('assets.recharge.record.out')"></span>
              <span v-text="item.name"></span>
            </p>
            <p>
              <span :class="{'normal-order': item.status != 2, 'over-completed': item.status == 2}" v-text="$t(recordStatus[item.status])"></span>
              <img src="../../assets/img/assets/turnRightList.png" alt/>
            </p>
          </div>
          <div class="recos-it-b">
            <div class="recos-it-b-it">
              <p v-text="$t('assets.recharge.record.time')"></p>
              <p>{{item.time | date('hh:mm MM/dd')}}</p>
            </div>
            <div class="recos-it-b-it">
              <p v-text="$t('assets.recharge.record.num')"></p>
              <p >{{Number(item.num).toFixed(8)}}</p>
            </div>
            <div class="recos-it-b-it">
              <p v-text="$t('assets.recharge.record.serviceCharge')"></p>
              <p v-text="Number(item.serviceCharge).toFixed(8)"></p>
            </div>
            <!-- <div class="recos-it-b-it">
              <p v-text="$t('assets.recharge.record.received')"></p>
              <p v-text="item.receivedMoney"></p>
            </div> -->
          </div>
          <div class="recos-it-h">
            <div class="recos-it-b-it">
              <p v-text="$t('assets.recharge.record.address')"></p>
              <p v-text="item.address"></p>
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
      name: '',
      recordList: [],
      recordStatus: ['assets.outRecDetail.status.audited','assets.outRecDetail.status.processing','assets.outRecDetail.status.completed','assets.outRecDetail.status.cancelled','assets.outRecDetail.status.failed']
    }
  },
  beforeRouteEnter (to, from, next) {
    // ...
    next(vm => {
      let key = vm.$route.params.key;
      if (key && (vm.$getCookie('userId') && JSON.parse(decodeURIComponent(vm.$getCookie('userId'))).userId)) {
        vm.name = key;
        vm.getOutList();
        vm.$store.commit('changeNoMenu', false);
      } else
        vm.$loginRoute('/home');
    })
  },
  beforeRouteLeave (to, from, next) {
    // ...
    this.$store.commit('changeNoMenu', true);
    next();
  },
  methods: {
    handleGo(key) {
      let that = this;
      that.$router.push({path: '/assets/outRecDetail', query: {obj: JSON.stringify(key)}});
    },
    getOutList() {
      let that = this;
      that.$axios({
        baseURL: that.$interfacePhpUrl,
        url: '/finance/out_list',
        method: 'get',
        params: {
          coin: that.name.toLowerCase(),
          page: 1,
          size: 100,
          userId: (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId),
          token:(that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).token)
        },
        withCredentials: false
      }).then(function(data) {
        if (data.status == 200) {
          that.recordList = data.data.map(item => {
            let dataTime = item.time.replace(/\-/g, '/')
            return {
              id: item.id,
              name: item.coinname.toUpperCase(),
              status: (item.status == -1 || item.status == -2) ? 1 : (item.status == 0 ? 0 : 2), // -1||-2:正在处理中；0：待审核；其它：已完成
              time: new Date(dataTime).getTime(),
              num: parseFloat(item.num),
              receivedMoney: parseFloat(item.mum),
              address: item.username,
              serviceCharge: parseFloat(item.fee),
              memo: item.comment
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.info-record {
  background: #fff;
  padding-bottom: 100%;
  .info-record-h {
    padding: 50px 26px;
    font-size: 45px;
    color: #202025;
    text-align: left;
    font-weight: bold;
    background-color: #fff;
    border-bottom: 1px solid #dcdcdc;
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
  .info-record-data {
    overflow: scroll;
    background-color: #fff;
    .recos-item {
      margin: 0 25px;
      padding: 34px 0 0;
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
        }
        & > P:nth-child(2) {
          text-align: right;
        }
        .over-completed {
          position: relative;
          color: #d5d5d5;
        }
        .over-completed::before {
          content: "";
          position: absolute;
          top: 45%;
          left: -20px;
          width: 12px;
          height: 12px;
          border-radius: 6px;
          background-color: #d5d5d5;
        }
        .normal-order {
          position: relative;
          color: #3e80ca;
        }
        .normal-order::before {
          content: "";
          position: absolute;
          top: 45%;
          left: -20px;
          width: 12px;
          height: 12px;
          border-radius: 6px;
          background-color: #d87675;
        }
        .recos-it-b-it {
          margin-top: 33px;
          flex-grow: 1;
          & > p {
            font-size: 22px;
            line-height: 22px;
            color: #cacaca;
          }
          & > p:nth-child(2) {
            margin-top: 30px;
            font-size: 24px;
            line-height: 24px;
            color: #8d8d8d;
          }
        }
        .recos-it-b-it:nth-child(2) {
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
           & > p:nth-child(2) {
            color: #3e80ca;
          }
        }
        .recos-it-b-it:nth-child(3) {
          text-align: right;
          & > p:nth-child(2) {
            // color: #3e80ca;
          }
        }
      }
    }
  }
}
</style>
