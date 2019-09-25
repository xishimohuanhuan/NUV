<template>
  <div class="transfer">
    <div class="common-header">
      <img src="../../assets/img/common/previous_page.png" alt="" @click="goBackContract"/>
      <img class="recharge-img" src="../../assets/img/assets/records.png" alt="" @click="handleTrans"/>
    </div>
    <div class="transfer-header">
      <span v-text="$t('assets.transfer.title')"></span>
    </div>
    <div class="transfer-item">
      <div class="transfer-item-img">
        <ul>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <div class="transfer-item-header">
        <p v-text="$t('assets.transfer.from')"></p>
        <p v-text="$t('assets.transfer.to')"></p>
      </div>
      <div class="transfer-item-body">
        <p v-text="$t(showTrans.from)"></p>
        <p v-text="$t(showTrans.to)"></p>
      </div>
      <div @click="handleChaTrans" class="transfer-item-operat">
        <img src="../../assets/img/assets/transferIcon.png" alt/>
      </div>
    </div>
    <div class="assets-item">
      <!-- <div class="assets-item-part">
        <p>
          <span v-text="name"></span>
        </p>
        <p v-text="$t('assets.info.freezing')"></p>
        <p v-text="freezingQuantity"></p>
      </div>
      <div class="assets-item-part">
        <p>
          <span v-text="'≈ ' + value ? value || '-- CNY' : '' + ' CNY'"></span>
        </p>
        <p v-text="$t('assets.info.canUse')"></p>
        <p v-text="canUseMoney || 0"></p>
      </div> -->
      <div class="recos-it-h">
        <p>
          <span v-text="name"></span>
        </p>
        <p>
          <img src="../../assets/img/assets/turnRightList.png" alt/>
        </p>
      </div>
      <div class="recos-it-b">
        <div class="recos-it-b-it">
          <p v-text="$t('assets.info.canUse')"></p>
          <p>{{canUseMoney || 0}}</p>
        </div>
        <div class="recos-it-b-it">
          <p v-text="$t('assets.info.freezing')"></p>
          <p>{{(freezingQuantity || 0) | NumToFixed}}</p>
        </div>
        <div class="recos-it-b-it">
          <p v-text="$t('assets.info.conversion')"></p>
          <p>{{(value || 0) | NumToFixed}}</p>
        </div>
      </div>
    </div>
    <div class="transfer-info">
      <span v-text="$t('assets.transfer.num')"></span>
      <input @input="handleVerify" @blur="handleMinNum" :placeholder="$t('assets.transfer.numPoptip')" v-model="transferNum" type="number"/>
      <span @click="handleTransAll" v-text="$t('assets.transfer.all')"></span>
    </div>
    <div class="min-num">{{$t('assets.transfer.minNum')}}0.0001 {{name}}</div>
    <div @click="handleTransfer" :class="['transfer-enter', {'acitve-transfer-enter': Number(transferNum)}]" v-text="$t('assets.transfer.enter')"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      freezingQuantity: 0,
      value: 0,
      canUseMoney: 0,
      transferNum: '',
      transType: ['coinToCont', 'contToCoin'],
      showTrans: {
        from: 'assets.transfer.cionAccount',
        to: 'assets.transfer.contractAccount',
        type: 'coinToCont'
      }
    }
  },
  filters: {
    NumToFixed(val, curr){
      let dadd=0;
      if(typeof val==='number'){
        let da=val.toString().split('.');
        if(da.length===2 && da[1].length>4){
          da[1]=da[1].slice(0,4)
          let daa=da.join('.')
          daa=Number(daa)
          dadd=daa;
        }else{
          dadd=val
        }
      }else if(typeof val==='string'){
        let da=val.split('.');
        if(da.length===2 && da[1].length>4){
          da[1]=da[1].slice(0,4)
          let daa=da.join('.')
          dadd=daa;
        }else{
          dadd=val;
        }
      }else{
        dadd=val;
      }
    return curr= dadd;
    },
  },
  beforeRouteEnter (to, from, next) {
    // ...
    next(vm => {
      let key = vm.$route.params.key,
        usdt = JSON.parse(vm.$route.query.info),
        type = vm.$route.query.type;
      if (key && (vm.$getCookie('userId') && JSON.parse(decodeURIComponent(vm.$getCookie('userId'))).userId)) {
        vm.name = key;
        if (usdt) {
          vm.freezingQuantity = usdt.freezingQuantity;
          vm.value = usdt.value;
          vm.canUseMoney = usdt.canUseMoney;
          if (type === 'coin') {
            vm.getUserIcon();
          } else {
            vm.handleChaTrans();
          }
        }
        vm.$store.commit('changeNoMenu', false);
      } else
        vm.$loginRoute('./home');
    })
  },
  beforeRouteLeave (to, from, next) {
    // ...
    this.$store.commit('changeNoMenu', true);
    next(() => {
      let params = to.params;
      let type = this.showTrans.type;
      to.params = {
        ...params,
        type
      }
    });
  },
  methods: {
    handleTrans() {
      let that = this;
      that.$loginRoute(`/assets/transferRecord/${that.name}`);
    },
    handleChaTrans() {
      let that = this,
        temp = that.showTrans.from;
        that.transferNum = '';
      that.showTrans.from = that.showTrans.to;
      that.showTrans.to = temp;
      if (that.showTrans.from.indexOf('cionAccount') !== -1) {
        that.showTrans.type = that.transType[0];
        that.getUserIcon();
      } else {
        that.showTrans.type = that.transType[1];
        that.getFuture();
      }
    },
    handleTransAll() {
      let that = this;
      that.transferNum = that.canUseMoney;
    },
    getUserIcon() {
      let that = this;
      if ((that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId)) {
        that.$axios({
          // baseURL: that.$interfacePhpUrl,
          // url: `/Ajax/getUsercoin?userId=${(that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId)}&token=${(that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).token)}`,
          // method: 'get',
          // withCredentials: false
          params: {
            userId: (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId),
            token:(that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).token)
          },
          baseURL: that.$interfaceTransfer,
          url: '/wi/user/balance/spot/list',
          method: 'get',
          headers: {'PHPSESSID': sessionStorage.getItem('sessionId')},
          withCredentials: false

        }).then(function(data) {
          if (data.status == 200) {
            let _data = data.data,
            result = _data.user_coin.map(item => {return {
              name: item.name.toUpperCase(),
              freezingQuantity: item.xnbd,
              value: item.zh,
              canUseMoney: that.$sliceNum(item.xnb)
            }}),
            resu = result.find(item => {return item.name === 'USDT'});
            // 
            that.freezingQuantity = resu.freezingQuantity;
            that.value = resu.value;
            that.canUseMoney = resu.canUseMoney;
          }
        })
      }
    },
    getFuture() {
      let that = this;
      that.$axios({
        baseURL:  that.$interfaceTransfer,  //'http://cgex.lan.com:8081/',
        url: '/wi/user/balance/future',
        method: 'get',
        headers: {'PHPSESSID': sessionStorage.getItem('sessionId')},
        withCredentials: false
      }).then(function(data) {
        if(data.status == 200) {
          let _data = data.data.data;
          if(_data){
            let result = _data.map(item => {return {
              name: 'USDT',
              freezingQuantity: (item.frozen || 0) + (item.long || 0) + (item.short || 0),
              value: item.amount,
              canUseMoney: that.$sliceNum(item.available),
              cny: that.$sliceNum(item.cny)
            }});
            that.freezingQuantity = result[0].freezingQuantity;
            that.value = result[0].value;
            that.canUseMoney = result[0].canUseMoney || 0;
            that.value = result[0].cny;
          }else{
            that.freezingQuantity = 0;
            that.value = 0;
            that.canUseMoney = 0;
          }
          
          // that.getZhRmb(result[0].value || 0);
        }
      })
    },
    handleVerify() {
      let that = this;
      if (Number(that.transferNum) > Number(that.canUseMoney)) {
        that.transferNum = that.canUseMoney;
      }
      if(Number(that.transferNum)<0){
        that.transferNum=0;
      }
    },
    handleMinNum() {
      // let that = this;
      // if (that.transferNum < 0.0001) {
      //   that.$normalToast(that.$t('assets.transfer.moreThanNum'));
      // }
    },
    handleTransfer() {
      let that = this;
      if(!Number(that.transferNum)) return;
      // if(!(Number(that.transferNum) >= 0.0001)) return;
      if (Number(that.transferNum) < 0.0001) {
        that.$normalToast(that.$t('assets.transfer.moreThanNum'));
        return;
      }
      let formData = new FormData();
      formData.append('sessid', sessionStorage.getItem('sessionId'));
      formData.append('from', that.showTrans.type === 'coinToCont' ? 0 : 1);
      formData.append('to', that.showTrans.type === 'coinToCont' ? 1 : 0);
      formData.append('currency', 'usdt');
      formData.append('amount', that.transferNum);
      that.$axios({
        baseURL: that.$interfaceTransfer, //'http://10.0.0.186:8081/',
        url: '/wi/user/balance/transfer',
        method: 'post',
        headers: {'PHPSESSID': sessionStorage.getItem('sessionId')},
        data: formData,
        withCredentials: false
      }).then(function(data) {
        if (data.data.status == 200) {
          that.$normalToast(that.$t('assets.transfer.success'), 1000);
          that.$loginRoute(`/assets/transferRecord/${that.name}`);
        } else {
          that.$normalToast(that.$t('newZh.notsuff'), 1000);
        }
      })
    },
    getZhRmb(vnum) {
      let that = this;
      let zhvchange = sessionStorage.getItem('zhvchange') || '';
      if(zhvchange) {
        that.value = zhvchange * vnum;
      }
      that.axios({
        baseURL: that.$interfacePhpUrl,
        url: '/Ajax/calculation',
        method: 'get',
        params: {num: vnum, coin: 'USDT'},
        withCredentials: false
      }).then(function(data) {
        if (data.status == 200) {
          if(zhvchange) {
            that.value = zhvchange * vnum;
          } else{
            that.value = data.data.data;
          }
        }
      })
    },
    //返回上一个页面 事件 
    goBackContract(){
      //将该页面的标志存储
      sessionStorage.setItem("transferstatus",this.$route.query.type);
      //判断返回上一页
      if (sessionStorage.getItem('specialTreatment') === 'home') {
        sessionStorage.setItem('specialTreatment', null);
        location.href = location.origin + '/home';
      } else {
        window.history.go(-1);
      }
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
    }
  }
}
</script>

<style lang="scss" scoped>
.transfer {
  .transfer-header {
    padding: 120px 22px 40px;
    text-align: left;
    color: #202025;
    font-size: 45px;
    line-height: 45px;
    font-weight: bold;
    background-color: #fff;
    border-bottom: solid 1px #dcdcdc;
  }
  .transfer-item {
    display: flex;
    height: 150px;
    text-align: left;
    background-color: #fff;
    .transfer-item-img {
      display: inline-block;
      width: 12px;
      padding: 30px 0 30px 24px;
      box-sizing: content-box;
      background-color: #fff;
      vertical-align: middle;
      & > ul {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 90px;
        & > li {
          margin-top: 11px;
          width: 7px;
          height: 7px;
          border-radius: 7px;
          background-color: #d2d2d2;
        }
        & > li:first-child {
          margin-top: 0;
          width: 12px;
          height: 12px;
          border-radius: 12px;
          background-color: #3e80ca;
        }
        & > li:last-child {
          width: 12px;
          height: 12px;
          border-radius: 12px;
          background-color: #d87675;
        }
      }
    }
    .transfer-item-header {
      display: inline-flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 30px 17px 30px 40px;
      width: 80px;
      height: 150px;
      font-size: 22px;
      color: #b6b6b6;
      vertical-align: middle;
      background-color: #fff;
    }
    .transfer-item-body {
      flex-grow: 1;
      display: inline-flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 30px 17px 30px 40px;
      height: 150px;
      font-size: 28px;
      color: #575757;
      vertical-align: middle;
      background-color: #fff;
    }
    .transfer-item-operat {
      display: inline-block;
      width: 120px;
      height: 150px;
      line-height: 170px;
      background-color: #f8f8f8;
      vertical-align: middle;
      text-align: center;
      & > img {
        width: 42px;
        height: 44px;
      }
    }
  }
  .assets-item {
    margin-top: 24px;
    padding: 37px 25px 40px;
    border-bottom: solid 1px #dcdcdc;
    background-color: #fff;
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
          width: 11px;
          height: 19px;
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
  .transfer-info {
    display: flex;
    padding: 36px 25px;
    background-color: #fff;
    & > span:nth-child(1) {
      margin-right: 88px;
      font-size: 26px;
      color: #575757;
    }
    & > span:nth-child(3) {
      font-size: 26px;
      color: #3e80ca;
    }
    & > input {
      flex-grow: 1;
      font-size: 24px;
      color: #aaa;
      border: none;
    }
    & > input:focus {
      outline: none;
    }
  }
  .transfer-enter {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    line-height: 100px;
    font-size: 34px;
    color: #fff;
    background-color: #bfbfbf;
  }
  .acitve-transfer-enter {
    background-color: #3e80ca;
  }
  .min-num{
    padding: 15px 24px;
    height: 24px;
    line-height: 24px;
    font-size: 24px;
    color: #aaa;
    text-align: left;
  }
}
</style>
