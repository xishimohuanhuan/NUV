<template>
  <div class="assets">
    <!-- 总资产折合 -->
    <div class="allMoeny">
      <div class="ass-top">
        <span>{{$t('assetZhEn.totalCon')+'(USDT)'}}</span>
        <img 
          :src="selectItem.status ?
            require('../../assets/img/assets/showAssets.png') : 
            require('../../assets/img/assets/hideAssets.png')"
          alt=""
          @click="handleShow"
        />
      </div>
      <div class="ass-bott">
        <span v-text="selectItem.status ? ($sliceNum(allDataUsdt.money,8) || '--') : '**********'"></span>
        <span>{{selectItem.status ? ('≈ '+($sliceNum(allDataUsdt.cny) || '--')+' CNY') : '**********'}}</span>
      </div>
    </div>
    <!-- 账户切换 -->
    <div class="assets-header1 border-one1">
      <div class="assH-wrap">
        <span 
        @click="handleChangeItem('coin',1)" 
        :class="{'active-header': selectItem.name === 'coin'}"
      >
        {{$t('assets.coinAccount')}}
      </span>
      </div>
      <div class="assH-wrap">
        <span 
          @click="handleChangeItem('contract')" 
          :class="{'active-header': selectItem.name === 'contract'}"
        >
          {{$t('assets.contractAccount')}}
        </span>
      </div>
    </div>
    <!-- 资产估值 -->
    <div class="assM-wrap">
      <span class="assM-data">
        {{(selectItem.name === 'coin' ? $t('assetZhEn.currTotalVal') : $t('assetZhEn.valConAsset'))+'(USDT)'}}
      </span>
      <div class="assM-Mo">
        <div class="assM-box">
          <span v-text="selectItem.status ? $sliceNum(selectItem.money,8) || '--' : '**********'"></span>
        </div>
        <div class="assM-box">
          <span v-text="selectItem.status ? ('≈ '+($sliceNum(selectItem.aboutMoney) || '--' )+'CNY') : '**********'"></span>
        </div>
      </div>
    </div>
    <!-- 充值提现 -->
    <div 
      class="assJ-wrap" 
      v-if="selectItem.name === 'coin'"
    >
      <div class="assJ-b">
        <img 
          src="../../assets/img/assets/changeInto.png" 
          alt=""
          @click="handleGo(quickList[0].linkTo,quickList[0].type)"
        />
        <div @click="handleGo(quickList[0].linkTo,quickList[0].type)">{{$t('assetZhEn.payUp')}}</div>
      </div>
      <span></span>
      <div class="assJ-b">
        <img 
          src="../../assets/img/assets/changeOut.png" 
          alt=""
          @click="handleGo(quickList[1].linkTo,quickList[1].type)"
        />
        <div  @click="handleGo(quickList[1].linkTo,quickList[1].type)">{{$t('assetZhEn.withM')}}</div>
      </div>
    </div>
    <div class="noContrant"></div>
    <!-- 资金划转 -->
    <div class="assT-wrap">
      <div class="assT-title">
        <div class="assT-tBox">
          <div class="assT-Box1">
            <span>{{$t('assetZhEn.fundTrans')}}</span>
          </div>
          <div class="assT-Box1">
            <span>{{$t('assetZhEn.handCharFor')}}</span>
          </div>
        </div>
        <img 
          src="../../assets/img/assets/records.png" 
          alt=""
          @click="handleTrans"
        >
      </div>
      <div class="assT-tra">
        <div class="assT-span">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div class="assT-wrod">
          <span>{{$t('assetZhEn.fromAss')}}</span>
          <span>{{$t('assetZhEn.toAss')}}</span>
        </div>
        <!-- <div class="assT-goto" v-if="selectItem.name === 'coin'"> -->
        <div 
          class="assT-goto" 
          :style="{display: selectItem.name === 'coin' ? 'block':'none'}"
        >
          <div :class="['assT-zc',falseToCoin ? 'gotoTop':'gotoBottom']">
            <span>{{$t('assetZhEn.cionCurAss')}}</span>
            <span>{{dataTranf.coin}} (USDT)</span>
          </div>
          <div :class="['assT-zc',falseToCoin ? 'gotoBottom':'gotoTop']">
            <span>{{$t('assetZhEn.contractAss')}}</span>
            <span>{{dataTranf.contract}} (USDT)</span>
          </div>
        </div>
        <div class="assT-goto" v-if="selectItem.name === 'contract'">
          <div :class="['assT-zc',falseToCoin1 ? 'gotoTop':'gotoBottom']">
            <span>{{$t('assetZhEn.contractAss')}}</span>
            <span>{{dataTranf.contract}} (USDT)</span>
          </div>
          <div :class="['assT-zc',falseToCoin1 ? 'gotoBottom':'gotoTop']">
            <span>{{$t('assetZhEn.cionCurAss')}}</span>
            <span>{{dataTranf.coin}} (USDT)</span>
          </div>
        </div>
        <img @click="handleChangeTra" src="../../assets/img/assets/coll.png" alt="">
      </div>
      <div class="assT-input border-one2">
        <input 
          v-if="selectItem.name === 'coin'"
          type="number"
          :placeholder="$t('assetZhEn.enterQuan')"
          v-model="transferNum"
          @input="handleVerify"
        >
        <input 
        v-if="selectItem.name === 'contract'"
          type="number"
          :placeholder="$t('assetZhEn.enterQuan')"
          v-model="transferNum1"
          @input="handleVerify"
        >
        <span @click="transferAll">{{$t('assetZhEn.allQuan')}}</span>
        <span @click="yesGoToTransfer">{{$t('assetZhEn.sureQuan')}}</span>
      </div>
    </div>
    <div class="noContrant"></div>
    <!-- 隐藏xiao币种 -->
    <div class="assNO-wrap" >
        <span class="assNO-title">
          {{selectItem.name === 'coin' ?
            $t('assetZhEn.coinPurse') :
            $t('assetZhEn.contrPurse')}}
        </span>
        <div v-if="selectItem.name === 'coin'">
          <img 
            @click="handleFilter" 
            :src="selectItem.hide ?
            require('../../assets/img/assets/overChoose.png') :
            require('../../assets/img/assets/noChoose.png')"
            alt=""
          >
          <span>{{$t('assetZhEn.hideSmCoin')}}</span>
        </div>
    </div>
    <!-- 确认提交弹框 -->
    <toast 
      v-if="istrueShow"
      :showToastType="'operate'" 
      :toastContent="wordIsMain" 
      :showToastImgType="'warning'" 
      :toastTitle="$t('assetZhEn.confTran')" 
      :toastOperateTitle="$t('assetZhEn.sureQuan')" 
      :toastAssistOperateTitle="$t('assetZhEn.cancelCoin')" 
      @handle-main-click="mainClickTransfer" 
      @handle-assist-click="istrueShow=false"
    />

    <div class="assets-header" v-if='false'>
      <span @click="handleChangeItem('coin')" :class="{'active-header': selectItem.name === 'coin'}">{{$t('assets.coinAccount')}}</span>
      <span @click="handleChangeItem('contract')" :class="{'active-header': selectItem.name === 'contract'}">{{$t('assets.contractAccount')}}</span>
    </div>
    <div class="assets-value" v-if="false">
      <p v-show="selectItem.name === 'coin'">
        <span v-text="$t('assets.coinAccountPoptip')"></span>
        <img @click="handleShow"  :src="selectItem.status ? require('../../assets/img/assets/showAssets.png') : require('../../assets/img/assets/hideAssets.png')" alt />
      </p>
      <p v-show="selectItem.name === 'contract'">
        <span class="assets-contract" v-text="$t('assets.contractAccountPoptip')"></span>
        <img @click="handleShow"  :src="selectItem.status ? require('../../assets/img/assets/showAssets.png') : require('../../assets/img/assets/hideAssets.png')" alt />
      </p>
      <p v-text="selectItem.status ? ($sliceNum(selectItem.money) || '--') : '**********'"></p>
      <p>
        <span>{{selectItem.status ? ('≈ '+($sliceNum(selectItem.aboutMoney) || '--')+' CNY') : '**********'}}</span>
        <span @click="showPoptip=!showPoptip" v-if="selectItem.status">?</span>
        <span v-show="showPoptip" v-if="selectItem.status">{{$t('assets.coinAccountPoptipTitle')}}</span>
      </p>
    </div>
    <div class="assets-quick" v-if="false">
      <div v-show="item.type === selectItem.name" class="quick-item" v-for="(item, index) in quickList" :key="index">
        <div  class="assets-text">
          <img @click="handleGo(item.linkTo,item.type)" :src="item.imgSrc" alt/>
          <p @click="handleGo(item.linkTo,item.type)" v-text="$t(item.text)"></p>
        </div>
      </div>
    </div>
    <div class="assets-list">
      <!-- <div v-if="selectItem.name === 'contract'" style="height:15px;"></div> -->
      <div v-if="false" style="height:15px;"></div>
      <!-- <div v-if="selectItem.name === 'coin'" class="assets-search" > -->
      <div v-if="false" class="assets-search" >
        <div  class="assets-search-item">
          <img @click="handleFilter" :src="selectItem.hide ? require('../../assets/img/assets/overChoose.png') : require('../../assets/img/assets/noChoose.png')" alt/>
          <span v-text="$t('assets.list.hide')"></span>
        </div>
        <div class="assets-search-item border-one">
          <img src="../../assets/img/assets/search.png" alt/>
          <input @input="handleSearch" v-model="searchCurrency" :placeholder="$t('assets.list.search')"/>
        </div>
      </div>
      <div :class="['assets-data', {'assets-data-contract': selectItem.name === 'contract'}]">
        <ul>
          <li
            class="assets-item"
            v-for="(item, index) in showAssetsData"
            :key="index"
            @click="handleInfo(selectItem.name, item.name, item)"
          >
            <!-- <div class="assets-item-part">
              <p v-text="item.name"></p>
              <p v-text="$t('assets.info.freezing')"></p>
              <p v-text="item.freezingQuantity"></p>
            </div>
            <div class="assets-item-part">
              <p>
                <span v-text="'≈ ' + item.value + ' CNY'"></span>
                <img src="../../assets/img/assets/turnRightList.png" alt/>
              </p>
              <p v-text="$t('assets.info.canUse')"></p>
              <p v-text="item.canUseMoney"></p>
            </div> -->
            <div class="recos-it-h">
              <p>
                <span class="recos-it-title" v-text="item.name"></span>
              </p>
              <p>
                <img src="../../assets/img/assets/turnRightList.png" alt/>
              </p>
            </div>
            <div class="recos-it-b">
              <div class="recos-it-b-it">
                <p v-text="$t('assets.info.canUse')"></p>
                <p>{{$sliceNum(item.canUseMoney,8) || '0'}}</p>
              </div>
              <div class="recos-it-b-it">
                <p v-text="$t('assets.info.freezing')"></p>
                <p v-text="$sliceNum(item.freezingQuantity)"></p>
              </div>
              <div class="recos-it-b-it">
                <p v-text="$t('assets.info.conversion')"></p>
                <p v-text="$sliceNum(item.value)"></p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div v-show="!showAssetsData.length && !getLoading" class="no-data">
        <img src="../../assets/img/assets/noData.png" alt/>
        <p v-text="$t('assets.address.noData')"></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      change: '', // 汇率
      selectItem: {
        name: 'coin',
        status: true,
        money: 0,
        aboutMoney: 0,
        hide: false
      },
      showPoptip: false,
      accountInfo: {
        coin: {
          name: 'coin',
          status: sessionStorage.getItem('coinStatus') ? (sessionStorage.getItem('coinStatus') == 'true') : true,
          money: 0,
          aboutMoney: 0,
          hide: sessionStorage.getItem('coinHide') ? (sessionStorage.getItem('coinHide') == 'true') : false
        },
        contract: {
          name: 'contract',
          status: sessionStorage.getItem('contractStatus') ? (sessionStorage.getItem('contractStatus') == 'true') : true,
          money: 0,
          aboutMoney: 0,
          hide: sessionStorage.getItem('contractHide') ? (sessionStorage.getItem('contractHide') == 'true') : true
        }
      },
      quickList: [
        {
          imgSrc: require('../../assets/img/assets/changeInto.png'),
          text: 'assets.quick.changeInto',
          linkTo: '/assets/recharge',
          type: 'coin'
        },
        {
          imgSrc: require('../../assets/img/assets/changeOut.png'),
          text: 'assets.quick.changeOut',
          linkTo: '/assets/withdrawMoney',
          type: 'coin'
        },
        {
          imgSrc: require('../../assets/img/assets/transfer.png'),
          text: 'assets.quick.transfer',
          linkTo: '/assets/transfer',
          type: 'coin'
        },
        {
          imgSrc: require('../../assets/img/assets/transfer.png'),
          text: 'assets.quick.transfer',
          linkTo: '/assets/transfer',
          type: 'contract'
        },
        {
          imgSrc: require('../../assets/img/assets/contractTransaction.png'),
          text: 'assets.quick.contractTransaction',
          linkTo: '/contract',
          type: 'contract'
        }
      ],
      searchCurrency: '',
      assetsData: [],
      showAssetsData: [],
      usdtData: {},
      getLoading: false,
      dataFuture:{
        amount:0,
        cny:0,
        available:0
      },
      allDataUsdt:{
        money:0,
        cny:0,
        available:0
      },
      allDataUsdt1:{
        money:0,
        cny:0,
        available:0
      },
      allDataUsdt2:{
        money:0,
        cny:0
      },
      dataTranf:{
        coin:0,
        contract:0,
      },
      // 划转方向
      falseToCoin:true,
      falseToCoin1:true,
      // 币币划转data
      transferNum:'',
      // 合约划转data
      transferNum1:'',
      istrueShow:false,
      wordIsMain:'',
      transferNumN:'',
      timerq:null,
      timerw:null
    }
  },
  created() {
    // 获取sessionID
    this.$getSession().then(res => {
      if(res) {
        //判断是否存在sessionStorage
        if(sessionStorage.getItem("transferstatus")){
          if(sessionStorage.getItem("transferstatus")==="coin"){
            //如果为coin就调用该方法
            this.handleChangeItem('coin',1);
          }else{
            //如果为contract就调用该方法
            this.handleChangeItem('contract',2);
          }
        }else{
          this.getUserIcon(1);
        }
      }
    }).catch(() => {});
    this.change = sessionStorage.getItem('zhvchange') || '';
  },
  beforeRouteEnter (to, from, next) {
    // ...
    next(vm => {
      if ((vm.$getCookie('userId') && JSON.parse(decodeURIComponent(vm.$getCookie('userId'))).userId)) {
        vm.selectItem = {
          name: sessionStorage.getItem("transferstatus") || 'coin',
          status: sessionStorage.getItem('coinStatus') ? (sessionStorage.getItem('coinStatus') == 'true') : true,
          hide: sessionStorage.getItem('coinHide') ? (sessionStorage.getItem('coinHide') == 'true') : false
        };

        //判断是否存在sessionStorage
        if(sessionStorage.getItem("transferstatus")){
          if(sessionStorage.getItem("transferstatus")==="coin"){
            //如果为coin就调用该方法
            vm.handleChangeItem('coin',1);
          }else{
            //如果为contract就调用该方法
            vm.handleChangeItem('contract',2);
          }
        }else{
          vm.getUserIcon(1);
        }

      } else {
        let arr = ['phoneLogin']
        if(arr.includes(from.name)) {
          vm.$router.go(-1);
        } else {
          vm.$loginRoute('/assets');
        }
      }
    })
  },
  destroyed(){
    clearTimeout(this.timerq);
    clearTimeout(this.timerw);
  },
  methods: {
    handleGo(path,type) {
      let that = this;
      if(path === '/contract'){
        that.$router.push('/transaction/xbtc_usdt/main');
        return;
      }
      if (path.indexOf('transfer') !== -1) {
        that.$router.push({path: path+'/USDT', query: {info: JSON.stringify(that.usdtData),type}});
        return;
      }
      that.$loginRoute(path+'/BTC');
    },
    handleChangeItem(key,type) {
      let that = this;
      that.selectItem.name = key;
      that.showAssetsData = [];
      //修改显示隐藏，将问号提示隐藏
      if(that.selectItem.status){
        that.showPoptip=false;
      }
      // sessionStorage.removeItem("transferstatus");
      if (key == 'coin') {
        // that.selectItem.status = that.accountInfo.coin.status;
        that.selectItem.money = that.accountInfo.coin.money;
        that.selectItem.aboutMoney = that.accountInfo.coin.aboutMoney;
        that.selectItem.hide = that.accountInfo.coin.hide;
        this.falseToCoin=true;
        // this.falseToCoin1=true;
        that.transferNum='';
        that.getUserIcon(type);
      } else{
        // that.selectItem.status = that.accountInfo.contract.status;
        that.selectItem.money = that.accountInfo.contract.money;
        that.selectItem.aboutMoney = that.accountInfo.contract.aboutMoney;
        that.selectItem.hide = that.accountInfo.contract.hide;
        // this.falseToCoin=true
        this.falseToCoin1=true;
        that.transferNum1='';
        that.getFuture(type);
      }
    },
    handleShow() {
      let that = this;
      that.selectItem.status = !that.selectItem.status;
      //修改显示隐藏，将提示隐藏
      if(that.selectItem.status){
        that.showPoptip=false;
      }
      if (that.selectItem.name == 'coin') {
        that.accountInfo.coin.status = that.selectItem.status;
        sessionStorage.setItem('coinStatus', that.accountInfo.coin.status);
      } else {
        that.accountInfo.contract.status = that.selectItem.status;
        sessionStorage.setItem('contractStatus', that.accountInfo.contract.status);
      }
    },
    handleFilter() {
      let that = this;
      that.selectItem.hide = !that.selectItem.hide;
      if (that.selectItem.name == 'coin') {
        that.accountInfo.coin.hide = that.selectItem.hide;
        // sessionStorage.setItem('coinHide', that.accountInfo.coin.hide);
      } else {
        that.accountInfo.contract.hide = that.selectItem.hide;
        sessionStorage.setItem('contractHide', that.accountInfo.contract.hide);
      }
      if (that.selectItem.hide){
        that.showAssetsData = that.assetsData.filter(item => {return item.canUseMoney >= 0.0001});
      }else{
        that.showAssetsData = that.assetsData;
        //过滤
          // let arrData={
          //   'CGT':1,
          //   'NEWOS':1,
          //   'ZIL':1,
          //   'IOST':1,
          //   'DTA':1,
          //   'OCN':1,
          //   'GNT':1,
          //   'SOC':1,
          //   'CVC':1
          // }
          // that.showAssetsData=that.showAssetsData.filter(item=>{
          //   return arrData[item.name]===1 ? false : item;
          // })
      }
    },
    handleSearch() {
      let that = this;
      if (that.searchCurrency.trim()){
        that.showAssetsData = that.assetsData.filter(item => {return item.name.toLowerCase().indexOf(that.searchCurrency.toLowerCase()) !== -1});
        if (that.selectItem.hide){
          that.showAssetsData = that.showAssetsData.filter(item => {return item.canUseMoney >= 0.0001});
        }
      }
      else{
        // this.handleFilter()
        // that.showAssetsData = that.assetsData;
        if (that.selectItem.hide){
          that.showAssetsData = that.assetsData.filter(item => {return item.canUseMoney >= 0.0001});
        }else{
          that.showAssetsData = that.assetsData;
        }
      }
    },
    handleInfo(type, key, ite) {
      let that = this;
      // that.$loginRoute('./assets/currFinaRecos/'+key);
      that.$router.push({path: `/assets/${type}/currFinaRecos/${key}`, query:{info: JSON.stringify(ite), type}});
    },
    getUserIcon(type) {
      let that = this;
      if (!that.getLoading) {
        if ((that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId)) {
          that.$axios({
            // baseURL: that.$interfacePhpUrl,
            // url: '/Ajax/getUsercoin',
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
              let _data = data.data;
              // 总数据处理
              that.allDataUsdt1={
                money:_data.zj || 0,
                cny:_data.rmb || 0,
              }
              let usdtDataFind = _data.user_coin.find(item => {return item.name === 'usdt'});
              that.dataTranf.coin=usdtDataFind.xnb;
              if(type===2){
                that.allDataUsdt={
                  money:that.allDataUsdt1.money+that.allDataUsdt2.money,
                  cny:that.allDataUsdt1.cny+that.allDataUsdt2.cny,
                }
                return;
              }
              that.change = data.data.change;
              sessionStorage.setItem('zhvchange',data.data.change)
              that.assetsData = _data.user_coin.map(item => {return {
                name: item.name.toUpperCase(),
                freezingQuantity: item.xnbd,
                value: that.toNonExponential(item.zh || 0),
                canUseMoney: that.toNonExponential(item.xnb || 0)
              }})
               //过滤
              let arrData={
                "XBTC":1,
                // 'DXCK':1,
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
              that.assetsData=that.assetsData.filter(item=>{
                return arrData[item.name]===1 ? false : item;
              })
              that.assetsData.sort((it, ne) => {return it.canUseMoney > ne.canUseMoney ? -1 : 1});
              that.showAssetsData = that.assetsData;
              that.usdtData = that.showAssetsData.find(item => {return item.name === 'USDT'});
              that.dataTranf.coin=that.usdtData.canUseMoney;
              if (that.selectItem.hide) {
                that.showAssetsData = that.assetsData.filter(item => {return item.canUseMoney >= 0.0001});
              }
              that.accountInfo.coin.money = that.toNonExponential(_data.zj || 0);
              that.accountInfo.coin.aboutMoney = that.toNonExponential(_data.rmb||0);
              that.selectItem.money = (_data.zj || 0);
              that.selectItem.aboutMoney = _data.rmb;
              that.getFuture(type);
            }
          })
        } else {
          that.$loginRoute('/phoneLogin');
        }
        sessionStorage.removeItem("transferstatus")
      }
    },
    getFuture(type) {
      let that = this;
      if (!that.getLoading) {
        if ((that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId)) {
          that.$axios({
            baseURL: that.$interfaceTransfer,
            url: '/wi/user/balance/future',
            method: 'get',
            headers: {'PHPSESSID': sessionStorage.getItem('sessionId')},
            withCredentials: false
          }).then(function(data) {
            if(data.status == 200) {
              let _data = data.data.data;
              // 可以划转的合约资产
              let DataAllAcc;
              // 处理总资产
              if(_data){
                that.dataFuture={
                  amount: _data[0].amount || 0,
                  cny: _data[0].cny||0,
                  available:_data[0].available || 0
                };
                if(_data[0].profit && _data[0].profit<0){

                  DataAllAcc=that.$numPlus(that.$numMinus(that.$numMinus((_data[0].amount||0) ,(_data[0].frozen || 0)) , (_data[0].long || 0)) ,(_data[0].profit || 0));
                }else{
                  DataAllAcc=that.$numMinus(that.$numMinus(that.$numMinus((_data[0].amount||0) ,(_data[0].frozen || 0)) , (_data[0].long || 0)) , (_data[0].short || 0));
                }
              }else if(_data===null){
                that.dataFuture={
                  amount:0,
                  cny:0,
                  available:0
                };
                DataAllAcc=0;
              }
              that.allDataUsdt2={
                money:that.dataFuture.amount,
                cny:that.dataFuture.cny,
                available:that.dataFuture.available,
              }
              if(DataAllAcc<0.00000001 && DataAllAcc>0){
                DataAllAcc=0;
              }
              that.dataTranf.contract=that.toNonExponential(DataAllAcc,8);
              if(type===1){
                that.allDataUsdt={
                  money:that.allDataUsdt1.money+that.allDataUsdt2.money,
                  cny:that.allDataUsdt1.cny+that.allDataUsdt2.cny,
                }
                return;
              }

              that.assetsData = _data.map(item => {return {
                name: 'USDT',
                freezingQuantity: (item.frozen || 0) + (item.long || 0) + (item.short || 0),
                value: item.amount || 0,
                canUseMoney: that.toNonExponential(item.available || 0)
              }});
              that.showAssetsData = that.assetsData;
              that.usdtData = {
                canUseMoney: _data[0].amount,
                freezingQuantity: 0,
                name: 'USDT',
                value: _data[0].amount
              };
              that.accountInfo.contract.money = that.toNonExponential(_data[0].amount||0);
              that.selectItem.money = that.toNonExponential(_data[0].amount);
              // that.getZhRmb(_data[0].amount||0);
              that.selectItem.aboutMoney = that.toNonExponential(_data[0].cny||0);
              that.accountInfo.contract.aboutMoney = that.toNonExponential(_data[0].cny||0);
              that.showAssetsData[0].value =  that.toNonExponential(_data[0].cny||0);
              if(type===2){
                that.getUserIcon(2);
              }
            }
          })
        } else {
          that.$loginRoute('/phoneLogin');
        }
        //移除本地存储，管理页面的跳转
        sessionStorage.removeItem("transferstatus")
      }
    },
    getZhRmb(vnum) {
      let that = this;
      let zhv = Number(this.change) || '';
      that.selectItem.aboutMoney = vnum * zhv;
      that.accountInfo.contract.aboutMoney = vnum * zhv;
      that.showAssetsData[0].value =  vnum * zhv;
      that.axios({
        baseURL: that.$interfacePhpUrl,
        url: '/Ajax/calculation',
        method: 'get',
        params: {num: vnum, coin: 'USDT'},
        withCredentials: false
      }).then(function(data) { 
        if (data.status == 200) {
          that.selectItem.aboutMoney = vnum * zhv;
          that.accountInfo.contract.aboutMoney = vnum * zhv;
          that.showAssetsData[0].value =  vnum * zhv;
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
    // 划转记录
    handleTrans() {
      let that = this;
      that.$loginRoute(`/assets/transferRecord/USDT`);
    },
    // 切换划转方向
    handleChangeTra(){
      if(this.selectItem.name==='coin'){
        this.falseToCoin= !this.falseToCoin;
        this.transferNum=''
      }else if(this.selectItem.name==='contract'){
        this.falseToCoin1= !this.falseToCoin1;
        this.transferNum1=''
      }
    },
    // 全部
    transferAll(){
      let that = this;
      if(this.selectItem.name==='coin'){
        if(that.falseToCoin){
          that.transferNum=that.dataTranf.coin;
          return;
        }
        that.transferNum=that.dataTranf.contract;
        return;
      }
      if(this.selectItem.name==='contract'){
        if(that.falseToCoin1){
          that.transferNum1=that.dataTranf.contract;
          return;
        }
        that.transferNum1=that.dataTranf.coin;
        return;
      }
    },
    // input 的input事件
    handleVerify() {
      let that = this;
      if(this.selectItem.name==='coin'){
        if(!that.transferNum){
          that.$normalToast(that.$t('assetZhEn.enterValiQuan'), 1000);
          that.transferNum='';
          return;
        }
        if(Number(that.transferNum)<0){
          that.transferNum=0;
          return;
        }
        if(!that.falseToCoin){
          if (Number(that.transferNum) > Number(that.dataTranf.contract)) {
            that.transferNum = that.dataTranf.contract;
          }
          if(Number(that.transferNum) && that.transferNum.split('.').length>=2){
            if(that.transferNum.split('.')[1].length>8){
              that.transferNum=that.transferNum.split('.')[0]+'.'+that.transferNum.split('.')[1].slice(0,8);
            }
          }
          return;
        }
        if (Number(that.transferNum) > Number(that.dataTranf.coin)) {
          that.transferNum = that.dataTranf.coin;
        }
        if(Number(that.transferNum)&&that.transferNum.split('.').length>=2){
          if(that.transferNum.split('.')[1].length>8){
            that.transferNum=that.transferNum.split('.')[0]+'.'+that.transferNum.split('.')[1].slice(0,8);
          }
        }
        return;
      }

      if(this.selectItem.name==='contract'){
        if(!that.transferNum1){
          that.$normalToast(that.$t('assetZhEn.enterValiQuan'), 1000);
          that.transferNum1='';
          return;
        }
        if(Number(that.transferNum1)<0){
          that.transferNum1=0;
          return;
        }
        if(!that.falseToCoin1){
          if (Number(that.transferNum1) > Number(that.dataTranf.coin)) {
            that.transferNum1 = Number(that.dataTranf.coin);
            return;
          }
          if(Number(that.transferNum1) && that.transferNum1.split('.').length>=2){
            if(that.transferNum1.split('.')[1].length>8){
              that.transferNum1=that.transferNum1.split('.')[0]+'.'+that.transferNum1.split('.')[1].slice(0,8)
            }
          }
          return;
        }
        if (Number(that.transferNum1) > Number(that.dataTranf.contract)) {
          that.transferNum1 = that.dataTranf.contract;
        }
        if(Number(that.transferNum1)&&that.transferNum1.split('.').length>=2){
          if(that.transferNum1.split('.')[1].length>8){
            that.transferNum1=that.transferNum1.split('.')[0]+'.'+that.transferNum1.split('.')[1].slice(0,8);
          }
        }
      }
    },
    // 确认划转
    yesGoToTransfer(){
      if(this.selectItem.name==='coin'){
        if(!this.transferNum || !Number(this.transferNum) || Number(this.transferNum)<0){
          this.$normalToast(this.$t('assetZhEn.enterValiQuan'), 1000);
          return;
        }
        if(this.falseToCoin){
          if(Number(this.transferNum)>Number(this.dataTranf.coin)){
            this.$normalToast(this.$t('assetZhEn.inputQuanti'), 1000);
            return;
          }
          this.wordIsMain=this.$t('assetZhEn.coinToContra')+'<br/><p style="color:#3e80ca">'+this.transferNum+" USDT</p>";
        }else{
          if(Number(this.transferNum)>Number(this.dataTranf.contract)){
            this.$normalToast(this.$t('assetZhEn.inputQuanti'), 1000);
            return;
          }
          this.wordIsMain=this.$t('assetZhEn.contraToCoin')+'<br/><p style="color:#3e80ca">'+this.transferNum+" USDT</p>";
        }
      }
      if(this.selectItem.name==='contract'){
        if(!this.transferNum1 || Number(this.transferNum1)<=0){
          this.$normalToast(this.$t('assetZhEn.enterValiQuan'), 1000);
          return;
        }
        if(this.falseToCoin1){
          if(Number(this.transferNum1)>Number(this.dataTranf.contract)){
            this.$normalToast(this.$t('assetZhEn.inputQuanti'), 1000);
            return;
          }
          this.wordIsMain=this.$t('assetZhEn.contraToCoin')+'<br/><p style="color:#3e80ca">'+this.transferNum1+" USDT</p>";
        }else{
          if(Number(this.transferNum1)>Number(this.dataTranf.coin)){
            this.$normalToast(this.$t('assetZhEn.inputQuanti'), 1000);
            return;
          }
          this.wordIsMain=this.$t('assetZhEn.coinToContra')+'<br/><p style="color:#3e80ca">'+this.transferNum1+" USDT</p>";
        }
      }
      this.istrueShow=true;
    },
    // 划转请求
    mainClickTransfer(){
      let that = this;
      let typeTra=true;
      this.istrueShow=false;
      if(this.selectItem.name==='coin'){
        that.transferNumN=this.transferNum
        if(!this.falseToCoin){
          typeTra=false;
        }else{
          typeTra=true;
        }
      }
      if(this.selectItem.name==='contract'){
        that.transferNumN=this.transferNum1
        if(this.falseToCoin1){
          typeTra=false;
        }else{
          typeTra=true;
        }
      }
      if(!Number(that.transferNumN)) return;
      if (Number(that.transferNumN) < 0.00000001) {
        that.$normalToast(that.$t('assets.transfer.moreThanNum'));
        return;
      }
      let formData = new FormData();
      formData.append('sessid', sessionStorage.getItem('sessionId'));
      formData.append('from',typeTra? 0: 1);
      formData.append('to',typeTra ? 1:0);
      formData.append('currency', 'usdt');
      formData.append('amount', that.transferNumN);
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
          that.$loginRoute(`/assets/transferRecord/USDT`);
        } else {
          that.$normalToast(that.$t('newZh.notsuff'), 2000);
          that.timerw=setTimeout(()=>{
            location.reload();
          },2000);
          
        }
      }).catch(err=>{
          that.$normalToast(that.$t('assetZhEn.netProTry'), 2000);
          that.timerq=setTimeout(()=>{
            location.reload();
          },2000)
          
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.assets {
  background-color: white;
  .assets-header {
    display: flex;
    align-items: center;
    padding: 28px 40px;
    text-align: left;
    background-color: #3e80ca;
    color: #e0dfdf;
    font-size: 30px;
    border-bottom: solid 1px #dcdcdc;
    .active-header {
      font-weight: bold;
      color: #fff;
      font-size: 45px;
    }
    & > span {
      margin-right: 50px;
    }
  }
  .assets-value {
    padding: 28px 40px;
    height: 260px;
    text-align: left;
    color: #f4f4f4;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    background-color: #3e80ca;
    & > p {
      line-height: 55px;
      & > span {
        margin-right: 25px;
        vertical-align: middle;
      }
      & > img {
        width: 37px;
        height: 23px;
        vertical-align: middle;
      }
    }
    & > p:nth-child(1) {
      font-size: 28px;
      & > span {
        margin-right: 25px;
      }
      & > img {
        width: 37px;
        height: 23px;
      }
    }
    & > p:nth-child(3) {
      font-size: 45px;
    }
    & > p:nth-child(4) {
      font-size: 24px;
      & > span:nth-child(2) {
        display: inline-block;
        width: 28px;
        height: 28px;
        border-radius: 17px;
        line-height: 28px;
        text-align: center;
        font-size: 24px;
        color: #3e80ca;
        background-color: #dcdcdc;
        vertical-align: middle;
      }
      & > span:nth-child(3) {
        font-size: 24px;
      }
    }
    .assets-contract{
      font-size: 28px;
    }
  }
  .assets-quick {
    display: flex;
    align-items: center;
    height: 190px;
    font-size: 28px;
    color: #3d3d3d;
    background-color: #fff;
    .quick-item {
      flex-grow: 1;
      &>.assets-text > img {
        height: 49px;
        padding-left:35px;
        padding-right:35px;
      }
      &>.assets-text > p {
        margin-top: 27px;
        padding-left:35px;
        padding-right:35px;
      }
      .assets-text{
        display: flex;
        align-items: center;
        flex-direction:column;

      }
    }
  }
  .assets-list {
    .assets-search {
      display: flex;
      align-items: center;
      padding: 0 20px;
      height: 80px;
      line-height: 80px;
      .assets-search-item {
        flex-grow: 1;
        text-align: left;
        font-size: 28px;
        & > span {
          color: #575757;
          margin-left: 23px;
          vertical-align: middle;
        }
        & > input {
          font-size: 24px;
          vertical-align: middle;
        }
        text-align: left;
        & > img {
          width: 40px;
          height: 40px;
          vertical-align: middle;
        }
      }
      .assets-search-item:nth-child(2) {
        flex-grow: 0;
        width: 230px;
        height: 57px;
        line-height: 57px;
        padding: 0 28px;
        text-align: left;
        border-radius: 10px;
        border: solid 1px #3e80ca;
        // box-sizing: content-box;
        & > img {
          width: 36px;
          height: 36px;
          vertical-align: middle;
          position: relative;
          top: -2px;
        }
        & > input {
          width: 125px;
          padding-left: 8px;
          background-color: #f8f8f8;
          text-align: center;
          border: none;
          vertical-align: middle;
          position: relative;
          top: -2px;
        }
        & > input:focus {
          outline: none;
        }
      }
    }
    .assets-data {
      width: 100%;
      overflow: scroll;
      padding-bottom: 100px; 
      .assets-item {
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
          .recos-it-title{
            font-weight: bold;
          }
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
          .recos-it-b-it:nth-child(1) {
            flex: 1;
          }
          .recos-it-b-it:nth-child(2) {
            text-align: left;
            width: 28%;
            margin-left: 20px;
            overflow: hidden;
          }
          .recos-it-b-it:nth-child(3) {
            flex: 1;
            text-align: right;
            & > p:nth-child(2) {
              // color: #3e80ca;
            }
          }
        }
      }
    }
    .assets-data-contract {
      top: 530px;
    }
    .no-data {
      padding-top: 135px;
      padding-bottom: 130px;
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
}
.allMoeny{
  height: 250px;
  background-color: #3e80ca;
  color: white;
  overflow: hidden;
  .ass-top{
    font-size: 28px;
    display: flex;
    justify-content: space-between;
    margin: 90px 28px 0 40px;
    align-items: center;
    img{
      height: 23px;
      width: 37px;
    }
  }
  .ass-bott{
    display: flex;
    align-items: center;
    margin-top: 30px;
    span:nth-child(1){
      margin-left: 40px;
      font-size: 45px;
    }
    span:nth-child(2){
      margin-left: 40px;
      font-size: 24px;
      position: relative;
      top: 10px;
    }
  }
}
.assets-header1 {
  display: flex;
  align-items: center;
  padding: 28px 29px;
  color: #979797;
  font-size: 30px;
  border-bottom: solid 1px #dcdcdc;
  .assH-wrap{
    height: 60px;
    margin-right: 40px;
    span{
      line-height: 60px;
      text-align: left;
    }
    .active-header {
      font-weight: bold;
      color: #202025;
      font-size: 45px;
    }
  }
}
.assM-wrap{
  height: 169px;
  padding-left: 29px;
  display: flex;
  flex-direction: column;
  color: #9b9b9b;
  font-size: 28px;
  .assM-data{
    text-align: left;
    margin-top: 27px;
  }
  .assM-Mo{
    display: flex;
    margin-top: 20px;
    height: 50px;
    .assM-box:nth-child(2){
      font-size: 24px;
      position: relative;
      top: 18px;
    }
    .assM-box:nth-child(1){
      color: #4a4a4a;
      font-size: 45px;
      margin-right: 40px;
    }
  }
}
.assJ-wrap{
  height: 102px;
  display: flex;
  align-items: center;
  // border-bottom: 1px solid #dcdcdc;
  .assJ-b{
    flex: 1;
    display: flex;
    align-items: center;
    margin-left: 98px;
    color: #3d3d3d;
    font-size: 24px;
    img{
      height: 49px;
      height: 49px;
      margin-right: 50px;
    }
    div{
      letter-spacing:10px;
    }
  }
  span{
    width: 1PX;
    background-color: #dcdcdc;
    height: 67px;
  }
}
.noContrant{
  height: 30px;
  width: 100%;
  background-color: #f8f8f8;
}
.assT-wrap{
  height: 328px;
  padding: 0 29px;
  .assT-title{
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    .assT-tBox{
      display: flex;
      color: #505050;
      font-size: 34px;
      .assT-Box1{
        font-weight: 600;
      }
      .assT-Box1:nth-child(2){
        font-weight: 400;
        color: #888888;
        font-size: 22px;
        display: flex;
        margin-left: 27px;
        span{
          line-height: 250%;
        }
      }
    }
    img{
      height: 42px;
      width: 36px;
    }
  }
  .assT-tra{
    height: 98px;
    display: flex;
    margin-top: 40px;
    position: relative;
    .assT-span{
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      margin-right: 17px;
      align-items: center;
      span{
        height: 8px;
        width: 8px;
        background-color: #d2d2d2;
        border-radius: 50%;
        display: block;
      }
      span:nth-child(1){
        height: 12px;
        width: 12px;
        background-color: #3e80ca;
        border-radius: 50%;
        display: block;
      }
      span:nth-child(5){
        height: 12px;
        width: 12px;
        background-color: #d87675;
        border-radius: 50%;
        display: block;
      }
    }
    .assT-wrod{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: #b6b6b6;
      font-size: 22px;
      margin-right: 42px;
    }
    .assT-goto{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      color: #575757;
      font-size: 28px;
      position: relative;
      .assT-zc{
        display: flex;
        justify-content: space-between;
        align-items: center;
        span:nth-child(2){
          font-size: 22px;
        }
      }
      .gotoTop{
        position: absolute;
        top:0px;
        width: 100%;
        transition: top 0.5s;
      }
      .gotoBottom{
        position: absolute;
        width: 100%;
        top:60px;
        transition: top 0.5s;
      }
    }
    img{
      height: 45px;
      width: 45px;
      top: 0;
      bottom: 0;
      margin: auto;
      margin-left: 79px;
      margin-right: 10px;
    }
  }
  .assT-input{
    height: 81px;
    padding: 0 0 0 29px;
    border: 1px solid #9b9b9b;
    border-radius: 5px;
    margin-top: 39px;
    color: #3e80ca;
    font-size: 26px;
    display: flex;
    align-items: center;
    input{
      border: none;
      flex: 1;
      color: #aaaaaa;
      font-size: 24px;
    }
    span:nth-child(2){
      width: 100px;
      height:100%;
      line-height: 81px;
      text-align: center;
    }
    span:nth-child(3){
      width: 123px;
      height:100%;
      line-height: 81px;
      text-align: center;
      font-size: 24px;
      background-color: #ddf3ff;
      border-radius: 5px;
    }
  }
}
.assNO-wrap{
  color: #505050;
  font-size: 22px;
  color: #575757;
  display: flex;justify-content: space-between;
  padding: 10px 27px 0 27px;
  .assNO-title{
    font-size: 34px;
    font-weight: 600;
    color: #505050;
  }
  div{
    display: flex;
    align-items: center;
    img{
      height: 40px;
      width: 40px;
      margin-right: 26px;
    }
  }
}
@media screen and (-webkit-min-device-pixel-ratio: 1) {
  .border-one { border: 1px solid #dcdcdc !important}
  .border-one1 { border-bottom: 1px solid #dcdcdc !important}
  .border-one2 { border: 1px solid #9b9b9b !important}
}
@media screen and (-webkit-min-device-pixel-ratio: 2) {
  .border-one { border: 1PX solid #dcdcdc !important}
  .border-one1 { border-bottom: 1PX solid #dcdcdc !important}
  .border-one2 { border: 1PX solid #9b9b9b !important}
}
</style>
