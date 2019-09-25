<template>
  <div>
    <div class="bar" @click="closepopup"></div>
      <div class="tabnav">
        <p
          v-for="(item,index) in tabs"
          :class="{'active-title':value==index}"
          @click="toggle(item)"
          :key="index"
        >{{ item.name }} <span v-show="false">?</span></p>
        <!-- <span v-show="(value==index)&&(index !== 2)">?</span> -->
      </div>
      <hr>
    <div class="popup-ctx">
      <ul>
        <li>
          <div class="bay-title">
            <p :class="this.itemData.traDiretion === 1 ? 'green' : 'red'">{{this.itemData.traDiretion | sideFilter}}</p>
            <p>{{this.itemData.oldSymbol | symbolFilter}}</p>
          </div>
        </li>
        <li v-show="value != 2">
          <div class="fixed-hight">
            <p class='t-left'>触发价格</p>
            <div class="input-box">
              <input type="text" 
                @paste.capture="inputBlanceHandle('triggerVal')"
                v-model="triggerVal" 
                @keyup="inputBlanceHandle('triggerVal')" 
                placeholder="请输入触发价格"><span class="input-coin">USDT</span></div>
          </div>
        </li>
        
        <li>
          <div class="two-btn">
            <p @click="changePriceHandle(1)" :class="{active: priceType===1}">限价</p>
            <p  @click="changePriceHandle(2)" :class="{active: priceType!==1}">市价</p>
          </div>
        </li>
        <li v-show="value == 2">
          <div class="fixed-hight">
            <div class="ping-title">
              <p>开仓均价(USDT)</p>
              <p>{{itemData.openj | toNumStrFilter(4)}}</p>
            </div>
            <div class="ping-title">
              <p>持仓量({{itemData.symbol}})</p>
              <p>{{itemData.positionsl | toNumStrFilter(4)}}</p>
            </div>
            <div class="ping-title">
              <p>可平量({{itemData.symbol}})</p>
              <p>{{itemData.unwindl | toNumStrFilter(4)}}</p>
            </div>
          </div>
        </li>
        <li>
          <p class='t-left'>执行价格</p>
          <div class="input-box">
            <input type="text" 
              @keyup="inputBlanceHandle('handlePrice')" 
              @paste.capture="inputBlanceHandle('handlePrice')" 
              v-model="handlePrice" 
              :readonly='priceType == 2' 
              :placeholder="priceType == 2 ? placeholderPirce :'请输入执行价格'"><span class="input-coin">USDT</span></div>
        </li>
        <li>
          <p class='t-left'>数量</p>
          <div class="input-box">
            <input type="text" 
              @keyup="inputBlanceHandle('inputAmount')" 
              @paste.capture="inputBlanceHandle('inputAmount')" 
              v-input-number 
              v-model="inputAmount" 
              :readonly='(priceType == 2)&&(value ==2)'
              placeholder="请输入数量"><span class="input-coin"> {{this.itemData.oldSymbol | sybFilter}}</span></div>
        </li>
        <li>
          <Slider @change='sliderChangeHandle' v-model="sliderVal" :disabled='(priceType == 2)&&(value ==2)' style="width:96%" :step="25" />
          <div class="slider-title">
            <span>0%</span>
            <span>&nbsp;25%</span>
            <span>&nbsp;50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
          <p class="t-left title-fiexd-hight">
            <span v-show="value !== 2">按{{priceType === 2?'触发':'执行'}}价格将收益：{{profitPrice | numFilter}} USDT</span>
          </p>
        </li>
        <li>
          <div @click="alterPopup" class="footer-btn">{{(priceType === 2&&value === 2) ? '市价全平' : '确认'+tabs[value].name}}</div>
        </li>
      </ul>
    </div>
    <!-- 撤销订单弹窗 -->
    <toast 
      :isShow="showToast"
      :showToastType="'operate'" 
      :toastContent="'是否'+popupTitle" 
      :toastTitle="tabs[value].name" 
      :toastOperateTitle="$t('holdShares.getit')" 
      :toastAssistOperateTitle="$t('holdShares.cancel')" 
      @handle-main-click="mainClick" 
      @handle-assist-click="showToast=false"
    />
  </div>
</template>

<script>
import {
  entrustAdd
} from './request.js'
const END_TIME = 1000 * 60 * 60 * 24 * 7; // 止盈止损周期
import { Slider } from 'vant';

export default {
  components: {
    Slider
  },
  data() {
    return {
      sliderVal: 100, //滑块值
      priceType: 2, // 1为限价，2位市价
      handlePrice: '', //执行价
      inputAmount: '',  // 数量
      triggerVal: '', //触发价
      uid: '',
      showToast: false,
      parmasAmount: '',
      tabs: [
        {
          name: "止盈",
          id: 0
        },
        {
          name: "止损",
          id: 1
        },
        {
          name: "平仓",
          id: 2
        },
      ],
    }
  },
  created() {
    this.uid = this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId'))).userId;
    this.sliderVal = 100;
      if(this.priceType === 2) {
        this.handlePrice = ''
      } else{
        this.handlePrice = this.itemData.currentpri
      }
      this.inputAmount = Number(this.itemData.unwindl.toFixed(4));  // 数量
      this.triggerVal = this.itemData.currentpri;
  },
  filters: {
    sideFilter(val) {
      let arr = ['买涨', '买跌'];
      return arr[val-1];
    },
    symbolFilter(val) {
      if(!val) return;
      return val.split('_').join('/').toUpperCase();
    },
    numFilter(val) {
      return Number(val.toFixed(4));
    },
    sybFilter(val) {
      if(!val) return;
      return val.split('_')[0].toUpperCase();
    },
  },
  props: {
    itemData: [Object],
    index: [Number, String],
    value: [Number, String],
    symbol:[Number, String],  // 交易币种
    openAverage:[Number, String], // 开仓均价
    handleAmount:[Number, String],  //持仓量
    canDoAmount:[Number, String], //  可平量
  },
  watch: {
    priceType(val) {
      if(val === 2) {
        this.handlePrice = ''
        if(this.value === 2) {
          this.sliderVal = 100;
          this.inputAmount = Number(this.itemData.unwindl.toFixed(4));  // 数量
        }
      } else {
        this.handlePrice = this.itemData.currentpri
      }
      // console.log(val,'==')
      // this.parmasAmount = val === 1 ? this.handlePrice : this.itemData.currentpri;
    },
    value(val) {
      if(val ===2 && this.priceType === 2) {
        this.sliderVal = 100;
        this.inputAmount = Number(this.itemData.unwindl.toFixed(4));  // 数量
      }
    },
    itemData(val) {
      this.sliderVal = 100;
      if(this.priceType === 2) {
        this.handlePrice = ''
        // this.parmasAmount = this.handlePrice;
      } else{
        this.handlePrice = this.itemData.currentpri;
        //  this.parmasAmount = this.itemData.currentpri;
      }
      this.inputAmount = Number(this.itemData.unwindl.toFixed(4));  // 数量
      this.triggerVal = this.itemData.currentpri;
    }
  },
  computed: {
    // parmasAmount() {
    //   console.log(this.priceType,'com')
    //   return this.priceType === 2 ? this.handlePrice : this.itemData.currentpri;
    // },
    placeholderPirce() {
       return this.priceType === 2 ? '以触发时最优价执行' : '以当前最优价执行';
    },
    profitPrice() {
      let priceTemp = this.handlePrice || this.triggerVal;
      if(this.itemData.traDiretion === 2) {
        return (this.itemData.openj - priceTemp) * Number(this.inputAmount); // 买跌收益
      }
      return (priceTemp - this.itemData.openj) * Number(this.inputAmount); // 买涨收益
    },
    popupTitle() {
      if(this.value === 2) {
        let arr = ['限价平仓', '市价全平']
        return arr[this.priceType-1];
      }
      return '委托' + this.tabs[this.value].name;
    }
  },
  methods: {
    mainClick() {
      this.showToast = false;
      this.confirmBtnHandle();
    },
    alterPopup() {
      this.showToast = true;
    },
    confirmBtnHandle() {
      let opts = this.$data;
      switch(this.value) {
        case 0: {
          this.zhiyingHandle();
          break;
        } case 1: {
          this.zhiyingHandle();
          break;
        } case 2: {
          let opts = {
            symbol:this.itemData.oldSymbol,
            side:this.itemData.traDiretion===1 ? 2 :1,
            amount:Number(this.inputAmount),
            source:2,
            action:1,
            type: this.priceType
          }
          if(this.priceType === 2) {
            // 市价
            // opts.type = 2;
            // this.$emit('shijia',opts,0);
            this.$emit('shijia',opts,this.itemData.unwindl);
          }
          if(this.priceType === 1) {
            // opts.type = 1;
            opts.price = Number(this.handlePrice);
            this.$emit('xianjia',opts,this.itemData);
          }
          break;
        } default: {
          // console.log(222)
        }
      }
    },
    // 止盈止损操作
    zhiyingHandle() {
      if(!this.testTriggerVal()) return;
      if(!this.testhandlePrice()) return;
      if(!this.testinputAmount()) return;
      if(!this.inputAmountIsBig()) return;
      let data = {
        uid: Number(this.uid),
        id: null,
        symbol:this.itemData.oldSymbol,
        type:this.tabs[this.value].id+1,  //止盈1，止损2
        trigger_price: Number(this.triggerVal),
        ord_type: this.priceType,
        ord_side: this.itemData.traDiretion ===1 ? 2 :1,
        ord_price: Number(this.parmasAmount),
        ord_amount: Number(this.inputAmount),
        end_time: (+new Date()) + END_TIME,
        order_action: 1
      }
      entrustAdd(data).then(res =>{
        if(res.data.status === 200) {
          this.$normalToast(this.tabs[this.value].name+'成功',2000);
          this.$emit('closepopup',false);
        } else if(res.data.status === 400) {
          if(typeof res.data.data === 'object') {
            this.$normalToast('同样触发价格不能添加相同数据',2000);
          } else {
            this.$normalToast(this.tabs[this.value].name+'失败',2000);
          }
          this.$emit('closepopup',false);
        } else  {
          this.$normalToast(this.tabs[this.value].name+'失败',2000);
          this.$emit('closepopup',false);
        }
      }).catch(err => {
        this.$emit('closepopup',false);1
        if(!err.response) {
          this.$normalToast('发生未知错误',2000);          
          return ;
        }
        this.$normalToast(this.tabs[this.value].name+'失败',2000);
      })
    },
    toggle(item) {
      this.tabname = item.name;
      this.$emit('input', item.id);
    },
    sliderChangeHandle() {
      // if(this.sliderVal === 100) {
      //   this.inputAmount = this.itemData.unwindl;
      //   return;
      // }
      this.inputAmount = Number(((this.itemData.unwindl * this.sliderVal)/100).toFixed(4))
    },
    changePriceHandle(type) {
      this.priceType = type;
    },
    closepopup() {
      this.$emit('closepopup',false)
    },
    // 触发价格
    testTriggerVal() {
      if(!Number(this.triggerVal) || (Number(this.triggerVal)<0)) {
        this.$normalToast('请输入大于0的触发价格',1000);
        return ;
      }
      return true;
    },
    // 执行价格
    testhandlePrice() {
      if(this.priceType === 1) {
        this.parmasAmount = this.handlePrice;
      } else{
         this.parmasAmount = this.itemData.currentpri;
      }
      if(!Number(this.parmasAmount) || (Number(this.parmasAmount)<0)) {
        this.$normalToast('请输入大于0执行价格',1000);
        return ;
      }
      return true;
    },
    // 输入数量
    testinputAmount() {
      if(!Number(this.inputAmount) || (Number(this.inputAmount)<0)) {
        this.$normalToast('请输入'+this.tabs[this.value].name+'数量',1000);
        return ;
      }
      return true;
    },
    // 平仓输入框限制
    inputBlanceHandle(value){
      let temp = this[value];
      this[value] = String(this[value]).replace( /[^0-9\.?]/g,'');
      let dioLeng = temp.split('.')
      if(dioLeng[1] && dioLeng[1].length > 4) {
        let len = dioLeng[0].length + 5;
        this[value] = this[value].slice(0,len);
      }
    },
    // 超出数量
    inputAmountIsBig() {
      if((Number(this.inputAmount)>this.itemData.unwindl)) {
        this.$normalToast('超过可平量!!',1000);
        return ;
      }
      return true;
    },
  }
}
</script>

<style lang='less' scoped>
.red{
  color: #d87675;
}
.green{
  color: #85bf85;
}
.bg-blue{
  background: #3e80ca;
  color: #fff;
}
.font-blue{
  color: #3e80ca;
}
.wenhao{
  border: 1px solid #ccc;
  font-size: 12px;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: inline-block;
}
.bar {
  margin: 0 auto;
  margin-top: 50px;
  width: 100px;
  height: 10px;
  background-color: #e5e5e5;
  border-radius: 3px;
  align-self: center;
}
.tabnav {
  padding: 20px;
  margin-top: 94px;
  margin-top: 30px;
  display: flex;
  justify-content: left;
  font-size: 30px;
  color: #818181;
  align-items: baseline;
  p{
    margin-right: 70px;
    position: relative;
    span{
      position: absolute;
      right: -32px;
      font-size: 12px;
      border: 1px solid #3e80ca;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      top: 0;
      line-height: 24px;
      color: #3e80ca;
    }
  }
  .active-title {
    color: #202025;
    font-size: 45px;
    height: 45px;
    line-height: 45px;
    // span {
    //   display: block;
    // }
  }
}
hr {
  // margin-top: 34px;
  margin-top: 25px;
  height: 1px;
  border: solid 1px #dcdcdc;
}
.t-left{
  text-align: left;
  color: #a5a5a5;
}
.input-box{
  width: 700px;
  height: 70px;
  margin-top: 28px;
	background-color: #ffffff;
	border-radius: 10px;
  border: solid 1px #dcdcdc;
  // transform: scale(0.5);
  display: flex;
  box-sizing: border-box;
  padding: 2px 28px;
  input{
    border: 0;
    outline: none;
    flex: 1;
  }
  .input-coin{
    line-height: 70px;
  }
}

.popup-ctx{
  min-height: 500px;
  padding: 0 24px;
  box-sizing: border-box;
  &>ul{
    &>li{
      margin: 36px 0;
    }
  }
  .bay-title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    p{
      font-size: 34px;
      font-weight: 500;
    }
  }
  .two-btn{
    display: flex;
    justify-content: center;
    align-items: center;
    p{
      // width: 49%;
      flex: 1;
      box-sizing: border-box;
      border: 1px solid #3e80ca;
      height: 75px;
      line-height: 75px;
      color: #3e80ca;
      &:first-child{
        border-right: 0;
      }
    }
    .active{
      background:#3e80ca;
      color: #fff;
    }
  }
  .slider-title{
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .footer-btn{
    background: #3e80ca;
    color: #fff;
    height: 85px;
    line-height: 85px;
    font-size: 34px;
  }
  .ping-title {
    display: flex;
    justify-content: space-between;
    &:nth-child(2) {
      padding: 17px 0;
    }
  }
  .fixed-hight{
    height: 135px;
  }
  .title-fiexd-hight{
    height: 24px;
  }
}
</style>
