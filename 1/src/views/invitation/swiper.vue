<!-- The ref attr used to find the swiper instance -->
<template>
  <div class="swiper-container">
    <swiper :options="swiperOption" class="swiper-container" ref="mySwiper">
      <!-- slides -->
      <swiper-slide class="swiper-slide d1" v-for="(ite,index) in imgData" :key="index">
        <img :src="ite.image" class="main-img">
      </swiper-slide>
      <!-- <swiper-slide class="swiper-slide  d2">
        <img src="@/assets/img/invitation/postor5.jpg" class="main-img">
      </swiper-slide>
      <swiper-slide  class="swiper-slide d3">
        <img src="@/assets/img/invitation/postor5.jpg" class="main-img">
      </swiper-slide>
      <swiper-slide  class="swiper-slide d4">
        <img src="@/assets/img/invitation/postor5.jpg" class="main-img">
      </swiper-slide>
      <swiper-slide  class="swiper-slide d5">
        <img src="@/assets/img/invitation/postor5.jpg" class="main-img">
      </swiper-slide>
      <swiper-slide  class="swiper-slide d6">
        <img src="@/assets/img/invitation/postor5.jpg" class="main-img">
      </swiper-slide> -->
    </swiper>
    <div>
      <div class="btn">
          <div class="btn-copy" @click="copyUrl">{{$t('setting.notInvitation.copyLink')}}</div>
          <div class="btn-copy" @click="shareHandle">分享海报</div>
          <textarea ref="selectTextarea" v-html="address" readonly class="select"></textarea>
          <a ref="selectA" class="select" href="javascript:void(0);">{{address}}</a>
      </div>
    </div>
    <!-- <div class="share"><h3 @click="shareHandle">点击分享</h3></div> -->
  </div>
</template>

<script>
import {
    getInvitPoster
} from './request.js'
  export default {
    name: 'carrousel',
    data() {
      return {
        swiperOption: {
            // some swiper options/callbacks
            // 所有的参数同 swiper 官方 api 参数
            // ...
            slidesPerView: "auto",
            centeredSlides: !0,
            watchSlidesProgress: !0,
            observer:true,
            observeParents:true,
            on: {
                progress: function(){
                    // 滑动门事件效果
                    let a = this;
                    var b, c, d,s;
                    let es = null;
                    for (b = 0; b < a.slides.length; b++){
                        c = a.slides[b],
                        d = c.progress,
												es = c.style,
                        es.opacity = 1 - Math.min(Math.abs(d / 2), 1);
                        s = Math.abs(Math.abs(d)-2)*0.2+0.6;
                        es.webkitTransform = 
                        es.MsTransform = 
                        es.msTransform = 
                        es.MozTransform = 
                        es.OTransform = 
                        es.transform = "translate3d("+(40 * d)+"px,0px,0px) scale("+s+")"
                        // es.transform = "translate3d("+(20 * d)+"px," + -Math.abs(40 * d) + "px,0px)"
										}
                },
                setTransition: function (b) {
                    // 动画延迟
                    let a = this;
                    let es = null;
                    for (var c = 0; c < a.slides.length; c++){
                        es = a.slides[c].style,
                        es.webkitTransitionDuration = 
                        es.MsTransitionDuration = 
                        es.msTransitionDuration = 
                        es.MozTransitionDuration = 
                        es.OTransitionDuration = 
                        es.transitionDuration = b + "ms" 
                    }
                }
            },
        },
        imgData:[],
        base64Img:[],
        dataImg1:[],
        lenImg:0,
        dataNum:0
      }
    },
    props: {
      address: String,
      qrCodeImg:String
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper
      }
    },
    created(){
      this.getPosterData()
    },
    methods: {
    // 获取海报
      getPosterData(){
          let userId=JSON.parse(decodeURIComponent(this.$getCookie('userId'))).userId;
          getInvitPoster({userId}).then(res=>{
            if(res.data.status===200){
              // this.imgData=res.data.data;
              this.dataImg1=res.data.data;
              this.lenImg=res.data.data.length;
              this.drawAndShareImage(this.dataNum)
            }
          })
      },
      drawAndShareImage(ia){
        let _this=this;
        // this.imgData=ddaa
        // for(let ia=0;ia<ddaa.length;ia++){
            let canvas = document.createElement("canvas");
            canvas.width = 750;
            canvas.height = 1334;
            let context = canvas.getContext("2d");
            context.rect(0 , 0 , canvas.width , canvas.height);
            context.fillStyle = "#fff";
            context.fill();
            let myImage = new Image();
            myImage.crossOrigin = 'Anonymous';
            myImage.src = this.dataImg1[ia].image;    //背景图片  你自己本地的图片或者在线图片
            myImage.onload = function(){
              context.drawImage(myImage , 0 , 0 , 750 , 1334);
              // context.font = "60px Courier New";
              _this.getImgTwo(context,canvas,_this.dataImg1[ia],ia);
          }
        // }
      },
      getImgTwo(context,canvas,ddaa,ia){
        let _this=this;
        let myImage2 = new Image();
        myImage2.crossOrigin = 'Anonymous';
        myImage2.src = _this.qrCodeImg;   //你自己本地的图片或者在线图片
        myImage2.onload = function(){
          context.drawImage(myImage2 , 277 , 983 , 198 , 198);
          let base64 = canvas.toDataURL("image/png");  //"image/png" 这里注意一下
          ddaa.image=base64;
          _this.base64Img.push(ddaa)
          // 上一张图片合成完成才能合成下一张 
          if(ia<_this.lenImg-1){
            _this.dataNum++;
            _this.drawAndShareImage(_this.dataNum);
          }
          if(ia===(_this.lenImg-1)){
            _this.imgData= _this.base64Img;
          }
        }
      },
      shareHandle() {
        let that = this;
        let newData=that.imgData[that.swiper.activeIndex].image.slice(22);
        // return;
        if(!that.imgData.length) return;
        if (that.$clientEnv.isNativeiOS) {
            that.$bridge.setupWebViewJavascriptBridge(function (bridge) {
            // bridge.callHandler('showShareActivity', {url:that.imgData[that.swiper.activeIndex].image}, function(res) {
            bridge.callHandler('showShareActivity', {url:newData}, function(res) {
                that.$normalToast(res ? that.$t('invitauser.invitationSuccess') : that.$t('invitauser.invitationFail'), 1000);
            });
            });
        } else if (that.$clientEnv.isNativeAndroid) {
            // let res = prompt("cg://web/shareData?" + JSON.stringify({data:that.imgData[that.swiper.activeIndex].image}),"");
            // let res = prompt("cg://web/shareData?"+newData,"");
                let res=window.AndroidJs.shareData(newData);
            // that.$normalToast(res ? that.$t('invitauser.invitationSuccess') : that.$t('invitauser.invitationFail'), 1000);
        } else {
            let base64 = null;
            let img = new Image();
            img.onload = (res) =>{
                let cvs = document.createElement("canvas"),
                ctx = cvs.getContext('2d');
                cvs.width = img.width;
                cvs.height = img.height;
                ctx.drawImage(img, 0, 0, cvs.width, cvs.height);
                base64 = cvs.toDataURL('image/jpeg', .9);
                let a = document.createElement('a');
                a.style.display = 'none';
                document.body.appendChild(a);
                a.download = 'hb'+ (+new Date());
                a.href = base64;
                a.click();
                document.body.removeChild(a);
            }
            img.setAttribute('crossOrigin', 'anonymous');
            img.src = that.imgData[that.swiper.activeIndex].image;
        }
      },
      testshareHandle() {
        let arr = [];
        arr = this.imgData.map(item => item.image)
        if (this.$clientEnv.isNativeAndroid) {
            let res = prompt("cg://web/showShareActivity?" + JSON.stringify(arr),"");
            // that.$normalToast(res == 1 ? that.$t('assets.recharge.saveSuccess') : that.$t('assets.recharge.saveFail'), 1000);
        }
      },
      //复制链接 
      copyUrl(){
          this.copyBackCodeHandle(this.address);
      },
      // 复制链接
      copyBackCodeHandle(value){
        let that = this;
        if (that.$clientEnv.ios) {
          var a = document.createElement('a');
          a.style.position = 'absolute';
          a.style.top = '-9999px';
          a.style.left = '-9999px';
          a.innerText = value;
          document.body.append(a);
          var range = document.createRange();
          range.selectNode(a);
          window.getSelection().removeAllRanges();
          window.getSelection().addRange(range);
          var msg = document.execCommand('copy') ? that.$t('appDownload.copySuccessful') : that.$t('appDownload.copyUnsuccessful');
          that.$normalToast(msg, 1000);
          document.body.removeChild(a);
        } else {
          var textarea = document.createElement('textarea');
          textarea.style.position = 'absolute';
          textarea.style.top = '-9999px';
          textarea.style.left = '-9999px';
          textarea.readOnly = true;
          textarea.innerText = value;
          document.body.append(textarea);
          textarea.select();
          var msg = document.execCommand('copy') ? that.$t('appDownload.copySuccessful') : that.$t('appDownload.copyUnsuccessful');
          that.$normalToast(msg, 1000);
          document.body.removeChild(textarea);
        }
      },
    },
    mounted() {
      // current swiper instance
      // 然后你就可以使用当前上下文内的swiper对象去做你想做的事了
    }
  }
</script>
<style scoped>
.swiper-container{
    width:100%;
    -webkit-perspective:1200px;
    -moz-perspective:1200px;
    -ms-perspective:1200px;
    perspective:1200px
}
.swiper-slide{
    width:80%;
    -webkit-transform-style:preserve-3d;
    -moz-transform-style:preserve-3d;
    -ms-transform-style:preserve-3d;
    transform-style:preserve-3d
}
.swiper-slide .main-img{
    width:85%;
    margin:0 auto;
    display:block
}
.share{
  margin-top: 48px;
}
.share h3{
  width: 60%;
  border-radius: 5px;
  background: #3e80ca;
  color: #fff;
  font-size: 34px;
  margin: 0 auto;
  height: 80px;
  line-height: 80px;
}
.btn{
    display: flex;
    margin-left: 24px;
    margin-right: 24px;
    margin-top: 88px;
    color: white;
    font-size: 34px;
}
.btn .select{
    position: absolute;
    z-index: -10;
    opacity: 0;
    height: 10px;
    width: 10px;
}
.btn .btn-copy{
    height: 85px;
    flex: 1;
    background-color: rgb(136,156,172);
    line-height: 85px;
}
.btn .btn-copy:nth-child(2){
    background-color: rgb(62,128,202);
}
</style>
