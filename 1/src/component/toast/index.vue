/**
 * 公共弹窗
 * 弹窗类型一共四种
 * 普通提示弹窗;showToastType:normal
 * 带有操作的提示弹窗;showToastType:operate
 * 弹窗页面;showToastType:page
 * 弹窗类容;toastContent:字符串
 * 弹窗图片类型一共四种(包括不包含警示图片)
 * 警告类型图片;showToastImgType:warning;
 * 错误类型图片;showToastImgType:error;
 * 正确类型图片;showToastImgType:success;
 * 使用案例 
 * 普通提示弹窗 <toast :showToastType="'normal'" :toastContent="'弹窗内容'"/>
 * 带有两个操作按钮的弹窗 <toast :showToastType="'operate'" :toastContent="'弹窗内容'" :showToastImgType="'warning'" :toastTitle="'弹窗标题'" :toastOperateTitle="'主操作'" :toastAssistOperateTitle="'辅助操作'" @handle-main-click="mainClick" @handle-assist-click="assistClick"/>
 * 只带一个操作按钮的弹窗 <toast :showToastType="'operate'" :toastContent="'弹窗内容'" :showToastImgType="'warning'" :toastTitle="'弹窗标题'" :toastOperateTitle="'我知道了'" @handle-main-click="mainClick"/>
 * 带有两个操作按钮的弹窗页面 <toast :showToastType="'page'" :toastContent="'弹窗内容'" :showToastImgType="'warning'" :toastTitle="'操作失败'" :toastOperateTitle="'推荐操作'" @handle-main-click="mainClick" :toastAssistOperateTitle="'辅助操作'" @handle-assist-click="assistClick"/>
 */
<template>
  <div :class="['toast', {'toast-shade': showToastType === 'operate'}]" v-show="isShow">
    <!-- 普通提示弹窗 -->
    <div v-show="showToastType === 'normal'" class="normal-toast">
      {{toastContent}}
    </div>
    <!-- 带有操作的弹窗 -->
    <div v-show="showToastType === 'operate'" class="operate-toast">
      <img v-show="toastImgUrl" :src="toastImgUrl" alt="" />
      <p class="operate-toast-header" v-text="toastTitle"></p>
      <p class="operate-toast-content" v-html="toastContent"></p>
      <!-- 可接受slot='pcontent' 的插槽-->
      <p class="operate-toast-content"><slot name="pcontent"></slot></p>  
      <div class="operate-toast-slot"><slot></slot></div>
      <div class="operate-toast-footer-nullbox"></div>
      <div class="operate-toast-footer">
        <span v-show="toastAssistOperateTitle" @click="handleAssistClick" class="operate-toast-btn" v-text="toastAssistOperateTitle"></span>
        <span v-show="toastOperateTitle" @click="handleMainClick" class="operate-toast-btn operate-toast-main-btn" v-text="toastOperateTitle"></span>
      </div>
    </div>
    <!-- 弹窗页面 -->
    <div v-show="showToastType === 'page'" class="page-toast">
      <img v-show="toastImgUrl" :src="toastImgUrl" alt="" />
      <p class="page-toast-header" v-text="toastTitle"></p>
      <p class="page-toast-content" v-html="toastContent"></p>
      <div class="page-toast-footer">
        <span v-show="toastOperateTitle" @click="handleMainClick" class="page-toast-btn page-toast-main-btn" v-text="toastOperateTitle"></span>
        <span v-show="toastAssistOperateTitle" @click="handleAssistClick" class="page-toast-btn" v-text="toastAssistOperateTitle"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showToastType: {
      type: String,
      default: ''
    },
    showToastImgType: {
      type: String,
      default: ''
    },
    toastContent: {
      type: String,
      default: ''
    },
      isShow: {
          type: Boolean,
          default: true
      },
    toastTitle: {
      type: String,
      default: ''
    },
    toastOperateTitle: {
      type: String,
      default: ''
    },
    toastAssistOperateTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      toastImgUrl: '',
        time:2000,
        isShow1:this.isShow,
    }
  },



    
  watch:{
    isShow(val){
      if(val){
        this.$overflowScrolling(false);
        setTimeout(function(){
          this.$emit('input',false)
        }.bind(this),this.time)
      } else {
        let name = this.$route.name;
        const needDoArr = ['main', 'holdShares', 'entrust', 'tradeentrust', 'profitLoss'];
        if(!needDoArr.includes(name)) {
          setTimeout(() => {
            this.$overflowScrolling(false);
          },0)
        }
      }
    },
  },
  mounted() {
    let that = this;
    // if (that.showToastType==='normal'){
    //     setTimeout(()=> {
    //         that.toastContent = '';
    //     }, 3000)
    // }
    switch(that.showToastImgType) {
      case 'warning':
        that.toastImgUrl = require('../../assets/img/toast/warning.png');
        break;
      case 'error':
        that.toastImgUrl = require('../../assets/img/toast/error.png');
        break;
      case 'success':
        that.toastImgUrl = require('../../assets/img/toast/success.png');
        break;
      case 'boom':
        that.toastImgUrl = require('../../assets/img/toast/boom.gif');
        break;
      default:
        that.toastImgUrl = '';
        break;
    }
  },
  methods: {
    handleAssistClick() {
      this.$emit('handle-assist-click');
    },
    handleMainClick() {
      this.$emit('handle-main-click');
    }
  }
}
</script>

<style lang="scss" scoped>
.toast {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  .normal-toast {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    padding: 30px 80px;
    width: fit-content;
    height: 26px;
    line-height: 26px;
    font-size: 26px;
    color: #fff;
    box-sizing: content-box;
    border-radius: 10px;
    background-color: rgba(67, 67, 67, 0.6);
  }
  .operate-toast {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    padding-top: 38px;
    width: 584px;
    height: fit-content;
    background-color: #fff;
    border-radius: 25px;
    overflow: hidden;
    & > img {
      width: 102px;
      height: 102px;
    }
    .operate-toast-header {
      margin: 20px 0 60px;
      height: auto;
      line-height: 32px;
      font-size: 34px;
      color: #2d2d2d;
      font-weight: bold;
    }
    .operate-toast-content {
      margin-bottom: 40px;
      padding: 0 100px;
      font-size: 32px;
      color: #888;
    }
    .operate-toast-slot{
      margin-bottom: 40px;
    }
    .operate-toast-footer-nullbox{
      width: 100%;
      margin-top: 82px;
      height: 95px;
    }
    .operate-toast-footer {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 98px;
      line-height: 98px;
      display: flex;
      .operate-toast-btn {
        display: block;
        flex: 1;
        background-color: #f6f6f6;
        color: #4e4e4e;
        font-size: 34px;
      }
      .operate-toast-main-btn {
        background-color: #3e80ca;
        color: #fff;
        overflow: hidden;
      }
    }
  }
  .page-toast {
    position: absolute;
    top: 0;
    left: 0;
    padding: 190px 80px 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    & > img {
      width: 138px;
      height: 138px;
    }
    .page-toast-header {
      margin: 54px 0 43px;
      height: 33px;
      line-height: 33px;
      font-size: 34px;
      color: #2d2d2d;
    }
    .page-toast-content {
      margin-bottom: 90px;
      font-size: 24px;
      color: #888;
    }
    .page-toast-footer {
      width: 100%;
      .page-toast-btn {
        display: block;
        width: 100%;
        height: 90px;
        line-height: 90px;
        background-color: #f6f6f6;
        color: #4e4e4e;
        font-size: 34px;
        border-radius: 10px;
      }
      .page-toast-main-btn {
        margin-bottom: 40px;
        background-color: #3e80ca;
        color: #fff;
      }
    }
  }
}
.toast-shade {
  background-color: rgba(98, 98, 98, 0.3);
}
</style>
