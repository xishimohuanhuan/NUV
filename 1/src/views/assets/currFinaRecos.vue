<template>
  <div class="curr-fina-recos">
    <headers title="" value="" @back="handleBack"></headers>
    <div class="curr-fina-recos-h">
      <!-- <div class="assets-item-part">
        <p>
          <span v-text="currInfo.name"></span>
        </p>
        <p v-text="$t('assets.info.freezing')"></p>
        <p v-text="currInfo.freezingQuantity"></p>
      </div>
      <div class="assets-item-part">
        <p v-text="'≈ ' + currInfo.value + ' CNY'"></p>
        <p v-text="$t('assets.info.canUse')"></p>
        <p v-text="currInfo.canUseMoney"></p>
      </div> -->
      <div class="recos-it-h">
        <p>
          <span v-text="currInfo.name"></span>
        </p>
        <p>
          <!-- <img src="../../assets/img/assets/turnRightList.png" alt/> -->
        </p>
      </div>
      <div class="recos-it-b">
        <div class="recos-it-b-it">
          <p v-text="$t('assets.info.canUse')"></p>
          <p>{{currInfo.canUseMoney}}</p>
        </div>
        <div class="recos-it-b-it">
          <p v-text="$t('assets.info.freezing')"></p>
          <p v-text="currInfo.freezingQuantity"></p>
        </div>
        <div class="recos-it-b-it">
          <p v-text="$t('assets.info.conversion')"></p>
          <p v-text="Number(currInfo.value).toFixed(8)"></p>
        </div>
      </div>
    </div>
    <div class="fina-recos">
      <p v-text="$t('assets.finaRecos.name')"></p>
      <div :class="['fina-recos-data', {'fina-recos-have-data': finaRecosData.length}]">
        <ul>
          <li class="recos-item" v-for="(item, index) in renderList" :key="index">
            <div class="recos-it-h">
              <p v-text="$t(item.title)"></p>
              <p>
                <span class="over-completed" v-text="$t('assets.finaRecos.over')"></span>
                <!-- <img src="../../assets/img/assets/turnRightList.png" alt/> -->
              </p>
            </div>
            <div class="recos-it-b">
              <div class="recos-it-b-it">
                <p v-text="$t('assets.finaRecos.type')"></p>
                <p v-text="$t(item.type)"></p>
              </div>
              <div class="recos-it-b-it">
                <p v-text="$t('assets.finaRecos.time')"></p>
                <p>{{item.time | date('hh:mm MM/dd')}}</p>
              </div>
              <div class="recos-it-b-it">
                <p v-text="$t('assets.finaRecos.num')"></p>
                <p v-text="item.num"></p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!-- <p class="no-other-data" v-show="finaRecosData.length">{{$t('assets.address.noOtherData')}}</p> -->
      <div v-show="!finaRecosData.length" class="no-address">
        <img src="../../assets/img/assets/noData.png" alt/>
        <p v-text="$t('assets.address.noData')"></p>
      </div>
    </div>
    <div class="fina-recos-footer">
      <div 
        @click="handleGo(item.linkTo, item.type,item.typeCc)"
        v-show="(item.type === currInfo.type) && ((item.linkTo.indexOf('transfer') !== -1 && currInfo.name === 'USDT') || (item.linkTo.indexOf('transfer') === -1))" 
        class="fina-recos-footer-it"
        v-for="(item, index) in quickHandle"
        :key="index"
      >
        <div class="img-box">
          <img :src="item.imgSrc" alt/>
        </div>
        <p v-text="$t(item.text)"></p>
      </div>
    </div>
  </div>
</template>

<script>
import headers from '../../component/header'
export default {
  components: {
    headers
  },
  computed: {
    renderList() {
      return this.finaRecosData.sort((a, b) => {
        return (+ new Date(b.time)) - (+ new Date(a.time))
      });
    }
  },
  data() {
    return {
      currInfo: {
        type: '',
        name: '',
        freezingQuantity: 0,
        value: 0,
        canUseMoney: 0
      },
      finaRecosData: [],
      quickHandle: [
        {
          imgSrc: require('../../assets/img/assets/changeIntoGray.png'),
          text: 'assets.quick.changeInto',
          linkTo: '/assets/recharge',
          type: 'coin',
          typeCc:true
        },
        {
          imgSrc: require('../../assets/img/assets/changeOutGray.png'),
          text: 'assets.quick.changeOut',
          linkTo: '/assets/withdrawMoney',
          type: 'coin',
          typeCc:false
        },
        {
          imgSrc: require('../../assets/img/assets/transferGray.png'),
          text: 'assets.quick.transfer',
          linkTo: '/assets/transfer',
          type: 'coin'
        },
        {
          imgSrc: require('../../assets/img/assets/transaction.png'),
          text: 'assets.quick.coinTransaction',
          linkTo: '/contract',
          type: 'coin'
        },
        {
          imgSrc: require('../../assets/img/assets/transferGray.png'),
          text: 'assets.quick.transfer',
          linkTo: '/assets/transfer',
          type: 'contract'
        },
        {
          imgSrc: require('../../assets/img/assets/transaction.png'),
          text: 'assets.quick.contractTransaction',
          linkTo: '/contract',
          type: 'contract'
        }
      ],
      //隐藏
      isDtall:true,
      recordStatus: ['assets.outRecDetail.status.audited','assets.outRecDetail.status.processing','assets.outRecDetail.status.completed','assets.outRecDetail.status.cancelled','assets.outRecDetail.status.failed']
    }
  },
  beforeRouteEnter (to, from, next) {
    // ...
    next(vm => {
      let curr = vm.$route.params.curr,
        type = vm.$route.params.type,
        info = JSON.parse(vm.$route.query.info);
        //隐藏
        if(window.location.pathname.indexOf("currFinaRecos")!==-1){
          vm.isDtall=false;
        }

      if (type && curr && info && (vm.$getCookie('userId') && JSON.parse(decodeURIComponent(vm.$getCookie('userId'))).userId)) {
        vm.currInfo.name = curr;
        vm.currInfo.type = type;
        vm.currInfo.freezingQuantity = info.freezingQuantity;
        vm.currInfo.value = info.value;
        vm.currInfo.canUseMoney = info.canUseMoney;
        vm.finaRecosData = [];
        vm.getIntoRecord();
        vm.getOutRecord();
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
    handleGo(path, type,ischang) {
      // if(ischang && this.currInfo.name==="DXCK"){
      //   return;
      // }
      let that = this;
      if(path === '/contract' && type==="contract"){
        that.$router.push('/transaction/xbtc_usdt/main');
        return;
      }
      // 跳转到币币
      if(path === '/contract' && type==="coin"){
        let icon = localStorage.getItem('trade_symbol');
        icon = icon ? JSON.parse(icon) : 'btc_usdt'
        that.$router.push('/trade/'+icon+'/foo');
        return;
      }
      if (path.indexOf('transfer') !== -1) {
        that.$router.push({path: path+'/USDT', query: {info: JSON.stringify(that.currInfo),type}});
        return;
      }
      that.$loginRoute(path + `/${that.currInfo.name}`);
    },
    handleBack() {
      let that = this;
      sessionStorage.setItem("transferstatus",this.$route.query.type);
      that.$loginRoute('/assets');
    },
    getIntoRecord() {
      let that = this;
      that.$axios({
        baseURL: that.$interfacePhpUrl,
        url: '/finance/in_list',
        method: 'get',
        params: {
          coin: that.currInfo.name.toLowerCase(),
          userId: (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId),
          token:(that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).token),
          page: 1,
          size: 1000
        },
        withCredentials: false
      }).then(function(data) {
        if(data.status == 200) {
          let result = data.data.map(item => {
            let dataTime = item.time.replace(/\-/g, '/');
            return {
              title: 'assets.finaRecos.into',
              type: 'assets.finaRecos.intoPlatform',
              time: (new Date(dataTime)).getTime(),
              num: item.mum
            }
          })
          that.finaRecosData = that.finaRecosData.concat(result);
        }
      })
    },
    getOutRecord() {
      let that = this;
      that.$axios({
        baseURL: that.$interfacePhpUrl,
        url: '/finance/out_list',
        method: 'get',
        params: {
          coin: that.currInfo.name.toLowerCase(),
          userId: (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId),
          token:(that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).token),
          page: 1,
          size: 1000
        },
        withCredentials: false
      }).then(function(data) {
        if(data.status == 200) {
          let result = data.data.map(item => {
            let dataTime = item.time.replace(/\-/g, '/');
            return {
              title: 'assets.finaRecos.out',
              type: 'assets.finaRecos.outPlatform',
              time: (new Date(dataTime)).getTime(),
              num: item.num
            }
          })
          that.finaRecosData = that.finaRecosData.concat(result);
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.curr-fina-recos {
  background-color: #fff;
  // padding-bottom: 80%;
  flex: 1;
  .curr-fina-recos-h {
    margin: 0 25px;
    padding: 37px 0 40px;
    border-bottom: solid 1px #dcdcdc;
    .assets-item-part {
      flex-grow: 1;
      text-align: left;
      & > p:nth-child(1) {
        margin-bottom: 40px;
        font-size: 34px;
        line-height: 34px;
        color: #3e80ca;
      }
      & > p:nth-child(2) {
        margin-bottom: 25px;
        font-size: 22px;
        line-height: 22px;
        color: #cacaca;
      }
      & > p:nth-child(3) {
        font-size: 28px;
        line-height: 28px;
        color: #8d8d8d;
      }
      .can-choose {
        position: relative;
      }
      .can-choose:after {
        content: "";
        position: absolute;
        top: 18px;
        right: -30px;
        width: 0;
        height: 0;
        border: solid 10px transparent;
        border-top-color: #545454;
      }
    }
    .assets-item-part:nth-child(2) {
      text-align: right;
      & > p:nth-child(1) {
        color: #8d8d8d;
        & > span {
          vertical-align: middle;
        }
        & > img {
          margin-left: 22px;
          vertical-align: middle;
        }
      }
      & > p:nth-child(2) {
        margin-bottom: 25px;
        font-size: 22px;
        line-height: 22px;
        color: #cacaca;
      }
      & > p:nth-child(3) {
        font-size: 28px;
        line-height: 28px;
        color: #3e80ca;
      }
    }
    .recos-it-h {
      display: flex;
      width: 100%;
      margin-bottom: 43px;
      font-size: 34px;
      line-height: 34px;
      color: #3e80ca;
      & > p {
        flex-grow: 1;
        text-align: left;
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
        text-align: left;
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
        text-align: left;
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
          // color: #3e80ca;
        }
      }
    }
  }
  .fina-recos {
    & > p {
      padding: 46px 26px;
      font-size: 45px;
      line-height: 45px;
      text-align: left;
      color: #202025;
      font-weight: bold;
    }
    .fina-recos-data {
      overflow: scroll;
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
    .fina-recos-have-data {
      padding-bottom: 200px;
    }
  }
  .fina-recos-footer {
    display: flex;
    align-items: center;
    position: fixed;
    justify-content:space-around;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 200px;
    background-color: #fff;
    .fina-recos-footer-it {
      .img-box {
        display: inline-block;
        width: 79px;
        height: 79px;
        line-height: 70px;
        box-shadow: 0px 1px 6px 0px 
          rgba(178, 178, 178, 0.75);
        border-radius: 10px;
        border: solid 1px #cecece;
        & > img {
          width: 49px;
          height: auto;
          vertical-align: middle;
        }
      }
      & > p {
        margin-top: 12px;
        font-size: 22px;
        line-height: 22px;
        color: #6c6c6c;
        letter-spacing: 4px;
      }
    }
  }
}
</style>
