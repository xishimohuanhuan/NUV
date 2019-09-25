<template>
    <div class="not-box">
        <div class="play">
            <img class="play-goback" @click="goBack" src="../../assets/img/setting/baise_go.png" alt="">
            <p v-text="$t('setting.notInvitation.titleInv')"></p>
            <img @click="twoCodeShow=true" src="../../assets/img/setting/twocode.png" alt="">
        </div>
        <div class="main">
            <div class="header-mas">
                <div class="h-num">
                    <div class="h-phone">
                        <span>{{userinfo.phone||'---'}}</span>
                    </div>
                    <div @click="gotoPeople">{{count ? count :'0'}}</div>
                </div>
                <div class="h-man">
                    <div class="h-deng">
                        <div v-text="$t('setting.notInvitation.Vlevel')"></div>
                        <img :src='"../../assets/img/setting/"+(extUser.usergrade ?extUser.usergrade:"V1")+".png"' alt="">
                    </div>
                    <div class="h-goman" 
                        @click="gotoPeople" 
                    >{{$t('setting.notInvitation.invitMou')}}<span class="span-cosi"></span></div>
                </div>
                <div class="h-price">
                    <!-- <span @click="gotoComm">{{extUser.allComm | serTwo}}</span> -->
                    <span @click="gotoComm">{{extUser.allComm ? $sliceNum(extUser.allComm) : '---' }}</span>
                    <span @click="gotoPeopleTran">{{extUser.availComm ? $sliceNum(extUser.availComm) : '---' }}</span>
                </div>  
                <div class="h-gosome">
                    <div class="h-goleft" @click="gotoComm">
                        <span>{{$t('setting.notInvitation.allReve')}}(USDT)</span>
                        <span class="span-cosi"></span>
                    </div>
                    <div class="h-goright" @click="gotoPeopleTran">
                        <span>{{$t('setting.notInvitation.surePrice')}}(USDT)</span>
                        <span class="span-cosi"></span>
                    </div>
                </div>   
            </div>
        </div>
        <div class="notive">
            <div class="notive-wrap">
                <img src="../../assets/img/setting/notive.png" alt="">
                <ul>
                    <li v-for="(item,ind) in notiveData" :key="ind" :class="{anim: animate}" ref="scro-item">
                        <span>{{item.mobile |filtPhone}}</span>
                        <span>{{$t('setting.notInvitation.getRew')}}{{item.amount |filteNUm}} USDT</span>
                    </li>
                </ul>
            </div>
        </div>
        <img class="banner" src="../../assets/img/setting/01.png" alt="">
        <div class="inviList">
            <p class="invi-title">{{$t('setting.notInvitation.invitTopLi')}}</p>
            <img src="../../assets/img/setting/listtop.png" alt="">
            <div 
                :class="['wrapttt','top-'+item.top]"
                v-for="item in topData"
                :key="item.top"
            >
                <p >{{item.phone|filtPhone}}</p>
                <p>{{item.type}}</p>
                <p>{{item.price|filteNUm}}</p>
            </div>
        </div>
        <div class="list-wrap">
            <div class="list-hea">{{$t('setting.notInvitation.recommRew')}}</div>
            <div class="tab">
                <div class="tab-hea">
                    <div class="th-1">{{$t('setting.notInvitation.rankJ')}}</div>
                    <div class="th-1">{{$t('setting.notInvitation.rankOne')}}</div>
                    <div class="th-1">{{$t('setting.notInvitation.rankTwo')}}</div>
                    <!-- <div class="th-1">{{$t('setting.notInvitation.moenyJ')}}</div> -->
                </div>
                <div class="tab-hea" v-for="(ite,ind) in gradeComms" :key="ind">
                    <div class="th-1">{{ite.usergrade}}</div>
                    <div class="th-1">{{ite.firstcomm*10000/100}}%</div>
                    <div class="th-1">{{ite.secondcomm*10000/100}}%</div>
                    <!-- <div class="th-1">{{ite.exaComm}}</div> -->
                </div>              
                <!-- <div class="tab-hea">
                    <div class="th-1">v2</div>
                    <div class="th-1">42%</div>
                    <div class="th-1">4%</div>
                    <div class="th-1">34535</div>
                </div>
                <div class="tab-hea">
                    <div class="th-1">V3</div>
                    <div class="th-1">41%</div>
                    <div class="th-1">4%</div>
                    <div class="th-1">3453s5</div>         
                </div> -->
            </div>
        </div>
        <div class="wordEx">
            <p class="word-title">{{$t('setting.notInvitation.ruleInvit')}}</p>
            <p class="word-det">{{$t('setting.notInvitation.ruleOne')}}</p>
            <p class="word-det">{{$t('setting.notInvitation.ruleTwo')}}</p>
            <p class="word-det">{{$t('setting.notInvitation.ruleThre')}}</p>
        </div>
        <div class="btmRim">
            <div class="btn-head"></div>
            <div class="btn">
                <div class="btn-copy" @click="handleNum(address)">{{$t('setting.notInvitation.copyLink')}}</div>
                <!-- <div class="btn-copy" @click="isShowSwiper ? showPost=true :''">{{$t('setting.notInvitation.onlyPoster')}}</div> -->
                <div class="btn-copy" @click="isShowSwiperHandle">{{$t('setting.notInvitation.onlyPoster')}}</div>
                <textarea ref="selectTextarea" v-html="address" readonly class="select"></textarea>
                <a ref="selectA" class="select" href="javascript:void(0);">{{address}}</a>
            </div>
        </div>
        <!-- 弹框 -->
        <!-- <div v-show="showPost && isShowSwiper"> -->
        <Popup 
            v-model="showPost"
            position='bottom'
        >
            <div class="postOut">
                <div class="post-bt" @click="showPost=false"></div>
                <div class="post-main">
                    <!-- 轮播图 -->
                    <!-- <Swiper :address="address" :qrCodeImg="qrCodeImg"></Swiper> -->
                    <div class="swiper-container" v-if="imgData.length">
                        <swiper :options="swiperOption" class="swiper-container" ref="mySwiper">
                            <swiper-slide class="swiper-slide d1" v-for="(ite,index) in imgData" :key="index">
                                <img :src="ite.image" class="main-img">
                            </swiper-slide>
                        </swiper>
                        <div>
                            <div class="btn">
                                <div class="btn-copy" @click="handleNum(address)">{{$t('setting.notInvitation.copyLink')}}</div>
                                <div class="btn-copy" @click="shareHandle">{{$t("newZh.sharePoster")}}</div>
                                <textarea ref="selectTextarea" v-html="address" readonly class="select"></textarea>
                                <a ref="selectA" class="select" href="javascript:void(0);">{{address}}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Popup>
        <!-- </div> -->
        <!-- 二维码弹框 -->
        <Popup 
            v-model="twoCodeShow"
        >
            <div class="two-hea">
                <span></span>
                <span>{{$t('setting.notInvitation.invitCode')}}</span>
                <img @click="twoCodeShow=false" src="../../assets/img/setting/cancel.png" alt="">
            </div>
            <div class="div-code">
                <img class="code-pop" ref="qrCodeImg" :src="qrCodeImg" alt="">
            </div>
            <div class="showNum">{{invitNum}}</div>
            <div class="down">
                <div class="download"> 
                    <textarea ref="selectTextare" v-html="invitNum" readonly class="select"></textarea>
                    <a ref="selectB" class="select" href="javascript:void(0);">{{invitNum}}</a>
                    <a href="javascript:void(0);" class="go-photo" @click="handleNum(invitNum)" >{{$t('setting.notInvitation.copyM')}}</a>
                </div>
                <div class="download">
                    <a href="javascript:void(0);" class="go-photo" @click="handleSave">{{$t('setting.notInvitation.copyImg')}}</a>
                </div>
            </div>
        </Popup>
    </div>
</template>
    
<script>
// import Popup from 'vant/lib/popup'
// import 'vant/lib/popup/style'
import { Popup } from 'vant'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

// import Swiper from './swiper.vue'
import {
    getInvitationinfo,
    getInvitNotive,
    getInvitPoster,
} from './request.js'
export default {
    components:{
        // Swiper
        Popup,
        swiper,
        swiperSlide
    },
    data(){
        return{
            //通知滚动
            notiveData:[],
            topData:[],
            animate: true,
            timer:null,
            timer1:null,
            // 海报弹框
            showPost:false,
            //二维码
            twoCodeShow:false,
            // 二维码地址
            qrCodeImg:'',
            base64:'',
            userID:'',
            // 链接地址
            address:'',
            // 邀请号码
            invitNum:'---',
            userinfo:{},
            //邀请人信息
            extUser:{},
            //邀请人数
            count:'',
            // 推荐奖励
            gradeComms:[],
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
            dataNum:0,
            isShowSwiper:false,
            handleSwiTime:false
        }
    },
    mounted() {
        // this.showPost = false;
    },
    computed: {
        swiper() {
            return this.$refs.mySwiper.swiper
        }
    },
    filters:{
        // 滚动通知的电话号码
        filtPhone(val){
            let da=val;
            let hea=val.slice(0,3);
            let foot=val.slice(8,11);
            da=hea+'****'+foot;
            return da;
        },
        // 滚动通知里面的奖励
        filteNUm(val){
            let newDa=val;
            newDa=val.toFixed(2);
            return newDa;
        },
        // 保留四位
        serTwo(val){
            let newDas=val;
            if(val){
                newDas=parseInt(val*10000)/10000
            }
            return newDas;
        }
    },
    created(){
        this.timer1=setInterval(this.scroll, 2000);
        this.$store.commit('changeNoMenu', false);
        this.getuserinfo()
        this.getinfo()
        this.getNotive()
    },
    beforeRouteLeave(to, from, next){
        this.$store.commit('changeNoMenu', true);
        this.$store.commit('changeLoading', false);
        next();
    },
    destroyed(){
        this.timer=null;
        clearInterval(this.timer1)
    },
    methods:{
        // 生成二维码
        getTwoCodeData(da){
            // 二维码
            this.qrCodeImg = this.$interfaceJavaUrl+"/user/finance/qrCode?address="+location.origin+"/invitaUser/invitaSign?invit="+da;
            // 复制链接地址
            this.address = location.origin+"/invitaUser/invitaSign?invit="+da;
            this.getPosterData();
            this.$nextTick((da)=> {
                let img = new Image();
                img.onload = (res) =>{
                    let cvs = document.createElement("canvas"),
                    ctx = cvs.getContext('2d');
                    cvs.width = img.width;
                    cvs.height = img.height;
                    ctx.drawImage(img, 0, 0, cvs.width, cvs.height);
                    this.base64 = cvs.toDataURL('image/jpeg', .9);
                }
                img.setAttribute('crossOrigin', 'anonymous');
                img.src = this.qrCodeImg;
            })
        },
        //获取当前用户邀请的详细信息
        async getinfo(){
            // let userId= this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId'))).userId;
            if(!this.userinfo) return;
            let userId = this.userinfo.userId;
            let res = await getInvitationinfo(userId,'usdt')
            if(res.data.status===200){
                this.extUser = res.data.data.extUser
                this.count = res.data.data.count
                this.gradeComms=res.data.data.gradeComms;
                this.invitNum=res.data.data.extUser.invitCode;
                // console.log(res.data.data.extUser.invitCode,this.invitNum)
                this.getTwoCodeData(this.invitNum);
            }
        },
        getNotive(){
            getInvitNotive().then(res=>{
                if(res.data.status===200){
                    this.notiveData=res.data.data;
                    res.data.data.sort((a,b)=>{
                        return (b.amount-a.amount);
                    })
                    let topTh=res.data.data.slice(0,3)
                    this.topData[0]={
                        top:1,
                        phone:topTh[0].mobile,
                        type:"USDT",
                        price:topTh[0].amount
                    }
                    this.topData[1]={
                        top:2,
                        phone:topTh[1].mobile,
                        type:"USDT",
                        price:topTh[1].amount
                    }
                    this.topData[2]={
                        top:3,
                        phone:topTh[2].mobile,
                        type:"USDT",
                        price:topTh[2].amount
                    }
                }
            })
        },
        //登陆获取用户的手机
        getuserinfo(){
            this.userinfo = this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId')))
        },
        //跳转到佣金划转页面
        gotoPeopleTran(){
            this.$router.push('/setting/invitTransfer');
        },
        //跳转到返佣资金
        gotoComm(){
            this.$router.push('/setting/invitCommission');
        },
        goBack() {
            // this.$router.go(-1);
            this.$router.push('/home');
        },
        //去邀请人数
        gotoPeople(){
            this.$router.push('/setting/invitePeople');
        },
        //广播的滚动
        scroll() {
            let that = this,
                con1 = that.$refs['scro-item'];
            if (con1 && con1.length > 0) {
                con1[0].style.marginTop = '24px';
                that.animate = !that.animate;
                clearTimeout(this.timer);
                this.timer=setTimeout(function() {
                    that.notiveData.push(that.notiveData[0]);
                    that.notiveData.shift();
                    con1[0].style.marginTop = '0px';
                    that.animate = !that.animate;
                }, 10)
            }
        },
        // 保存至相册
        handleSave() {
            let that = this;
            if (that.$clientEnv.isNativeiOS) {
                that.$bridge.setupWebViewJavascriptBridge(function (bridge) {
                bridge.callHandler('downloadImage', {url: that.qrCodeImg}, function(res) {
                    that.$normalToast(res ? that.$t('assets.recharge.saveSuccess') : that.$t('assets.recharge.saveFail'), 1000);
                });
                });
            } else if (that.$clientEnv.isNativeAndroid) {
                let res = prompt("cg://web/downloadImage?" + JSON.stringify({url: that.qrCodeImg}),"");
                that.$normalToast(res == 1 ? that.$t('assets.recharge.saveSuccess') : that.$t('assets.recharge.saveFail'), 1000);
            } else {
                let a = document.createElement('a');
                a.style.display = 'none';
                document.body.appendChild(a);
                a.download = 'ewm'+ (+new Date()) + '.jpg';
                a.href = that.base64;
                a.click();
                document.body.removeChild(a);
            }
        },
        //复制邀请码，号码
        handleNum(value){
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
        //复制链接 
        // copyUrl(){
        //     if (this.$clientEnv.isNativeiOS) {
        //         let range = document.createRange(this.$refs.selectA);
        //         range.selectNode(a);
        //         window.getSelection().removeAllRanges();
        //         window.getSelection().addRange(range);
        //         let msg = document.execCommand('copy') ? this.$t('appDownload.copySuccessful') : this.$t('appDownload.copyUnsuccessful');
        //         this.$normalToast(msg, 1000);
        //     } else {
        //         this.$refs.selectTextarea.select();
        //         let msg = document.execCommand('copy') ? this.$t('appDownload.copySuccessful') : this.$t('appDownload.copyUnsuccessful');
        //         this.$normalToast(msg, 1000);
        //     }
        // },
        // 获取海报
        getPosterData(){
            this.$store.commit('changeLoading', true);
            let userId= this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId'))).userId;
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
                    _this.$store.commit('changeLoading', false);
                    if(_this.handleSwiTime){
                        _this.showPost=true;
                    }
                    _this.isShowSwiper=true;
                }
            }
        },
        shareHandle() {
            //  TODO:
            let that = this;
            let newData=that.imgData[that.swiper.activeIndex].image.slice(22);
            // return;
            if(!that.imgData.length) return;
            if (that.$clientEnv.isNativeiOS) {
                that.$bridge.setupWebViewJavascriptBridge(function (bridge) {
                bridge.callHandler('showShareActivity', {url:newData}, function(res) {
                    that.$normalToast(res ? that.$t('invitauser.invitationSuccess') : that.$t('invitauser.invitationFail'), 1000);
                });
                });
            } else if (that.$clientEnv.isNativeAndroid) {
                    let res=window.AndroidJs.shareData(newData);
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
        isShowSwiperHandle(){
            this.handleSwiTime=true;
            if(this.isShowSwiper){
                this.showPost=true;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .not-box{
        width: 100%;
    }
    .play{
        position: sticky;
        z-index: 100;
        left: 0;
        top: 0; 
        height:  84px;
        width: 100%;
        background-color: rgb(59,60,70);
        color: white;
        display: flex;
        align-items: center;
        font-size: 34px;
        justify-content: space-between;
        .play-goback{
            width: 19px;
            height: 30px;
            margin-left: 41px;
        }
        img{
            width: 37px;
            height: 37px;
            margin-right: 45px;
        }
    }
    .main{
        width: 750px;
        height: 314px;
        background-color: rgb(59,60,70);
        padding-top: 24px;
        .header-mas{
            width: 675px;
            height: 314px;
            border: 1px solid rebeccapurple;
            margin: 0 auto;
            border-radius: 10px;
            background: url('../../assets/img/setting/back.png') no-repeat;
            background-size: 100% 100%;
            color: rgb(61,61,61);
            .h-num{
                font-size: 34px;
                display: flex;
                justify-content: space-between;
                margin-top: 35px;
                div:nth-child(1){
                    margin-left: 44px;
                }
                div:nth-child(2){
                    margin-right: 49px;
                }
                // .h-phone{
                //     display: flex;
                //     align-items: center;
                //     img{
                //         width: 37px;
                //         height: 37px;
                //         margin-left: 20px;
                //     }
                // }
            }
            .h-man{
                display: flex;
                justify-content: space-between;
                margin-top: 16px;
                .h-deng{
                    display: flex;
                    margin-left: 45px;
                    color: white;
                    div{
                        width: 115px;
                        height: 39px;
                        background-color: rgb(59,60,70);
                        font-size: 22px;
                        border-radius: 7px;
                        margin-right: 17px;
                    }
                    img{
                        width: 43px;
                        height: 39px;
                    }
                }
                .h-goman{
                    font-size: 22px;
                    margin-right: 47px;
                    position: relative;
                    span{
                        position: absolute;
                        top: 10px;
                        left: 105px;
                    }
                }
            }
            .h-price{
                display: flex;
                justify-content: space-between;
                font-size: 45px;
                margin-top: 41px;
                span:nth-child(1){
                    margin-left: 47px; 
                }
                span:nth-child(2){
                    margin-right: 30px; 
                }
            }
            .h-gosome{
                display: flex;
                justify-content: space-between;
                color: rgb(61,61,61);
                font-size: 22px;
                .h-goleft{
                    margin-left: 42px;
                    position: relative;
                    .span-cosi{
                        position: absolute;
                        top: 13px;
                        left: 163px;
                    }
                }
                .h-goright{
                    margin-right: 50px;
                    position: relative;
                    .span-cosi{
                        position: absolute;
                        top: 13px;
                        left: 209px;
                    }
                }
            }
        }
    }
    .span-cosi{
        border-right: 7px solid transparent;
        border-top: 7px solid transparent;
        border-bottom: 7px solid transparent;
        border-left: 7px solid black;
    }
    .notive{
        width: 100%;
        height: 87px;
        z-index: 3;
        background-color: rgb(69,73,84);
        overflow: hidden;
        .notive-wrap{
            display: flex;
            color: white;
            margin-top: 31px;
            font-size: 24px;
            height: 34px;
            overflow: hidden;
            img{
                width: 29px;
                height: 34px;
                margin-right: 28px;
                margin-left: 111px;
            }
            ul{
                .anim {
                    transition: all 0.5s;
                }
                li{
                    span:nth-child(1){
                        margin-right: 90px;
                    }
                }
            }
        }
    }
    .banner{
        margin-top: 41px;
        width: 670px;
        border-radius: 10px;
        height: 200px;
    }
    .inviList{
        width: 670px;
        margin: 0 auto;
        margin-top: 83px;
        position: relative;
        .wrapttt{
            font-size: 22px;
            p:nth-child(1){
                color: rgb(62,128,202);
            }
            p:nth-child(2){
                color: rgb(169,169,169);
                margin: 5px 0;
            }
            p:nth-child(3){
                color: rgb(64,64,64);
                font-size: 34px;
                font-weight: 600;
            }
        }
        .invi-title{
            font-size: 34px;
            font-weight: 600;
            margin-bottom: 173px;
            text-align: left;
        }
        img{
            width: 651px;
            height: 266px;
            margin: 0 auto;
        }
        .top-1{
            position: absolute;
            top: 90px;
            left: 275px;
        }
        .top-2{
            position: absolute;
            top: 170px;
            left: 70px;
        }
        .top-3{
            position: absolute;
            top: 200px;
            left: 470px;
        }
    }
    .list-wrap{
        width: 100%;
        margin-top: 113px;
        overflow: hidden;
        
        .list-hea{
            text-align: left;
            margin-left: 40px;
            font-size: 34px;
            font-weight: 600;
        }
        .tab{
            margin-left: 24px;
            margin-right: 24px;
            padding-bottom: 48px;
            .tab-hea{
                display: flex;
                margin-top: 43px;
                color: rgb(141,141,141);
                font-size: 28px;
                .th-1{
                    width: 40%;
                    text-align: left;
                }
                .th-1:nth-child(3){
                    width: 20%;
                    text-align: center ;
                }
            }
            .tab-hea:nth-child(1){
                font-size: 22px;
                color: rgb(202,202,202);
            }
        }
    }
    .wordEx{
        // background-color: aqua;
        margin: 0 auto;
        // height: 400px;
        margin-top: 31px;
        margin-left: 27px;
        margin-right: 36px;
        padding-bottom: 264px;
        .word-title{
            font-size: 34px;
            text-align: left;
            font-weight: 600;
            color: rgb(57,57,57);
            padding-top: 50px;
        }
        .word-det{
            font-size: 24px;
            text-align: left;
            margin-top: 50px;
            color: rgb(87,87,87);
            line-height: 45px;
        }

    }
    .btmRim{
        width: 100%;
        height: 194px;
        position: fixed;
        bottom: 0;
        box-shadow: 0px -8px 7px 1px rgba(229, 229, 229, 0.75);
        background-color: white;
        border-radius: 30px 30px 0 0;
        .btn-head{
            width: 99px;
            height: 10px;
            background-color: rgb(229,229,229);
            margin: 0 auto;
            margin-top: 33px;
        }
        .btn{
            display: flex;
            margin-left: 24px;
            margin-right: 24px;
            margin-top: 29px;
            color: white;
            font-size: 34px;
            .select{
                position: absolute;
                z-index: -10;
                opacity: 0;
                height: 10px;
                width: 10px;
            }
            .btn-copy{
                height: 85px;
                flex: 1;
                background-color: rgb(136,156,172);
                line-height: 85px;
            }
            .btn-copy:nth-child(2){
                background-color: rgb(62,128,202);
            }
        }
    }
    .van-popup.van-popup--bottom{
        border-radius: 30px 30px 0 0;
        height: 1221px;
        width: 100%;
    }
    .postOut{
        height: 1221px;
        width: 100%;
        overflow: hidden;
        .post-bt{
            width: 99px;
            height: 10px;
            background-color: rgb(229,229,229);
            margin: 0 auto;
            margin-top: 33px;
            margin-bottom: 46px;
        }
        .post-main{
                height: 840px;
                width: 100%;
                // background-color: antiquewhite;
            }
    }
    .van-popup{
        width: 540px;
        height: 567px;
        border-radius: 30px;
        .two-hea{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-right: 32px;
            margin-left: 32px;
            font-size: 34px;
            color: rgb(2,2,2);
            margin-top: 33px;
            img{
                width: 28px;
                height: 28px; 
            }
        }
        .div-code{
            width: 100%;
            height: 373px;
            .code-pop{
                width: 336px;
                height: 336px;
                margin: 0 auto;
                margin-top: 25px;
            }
        }
        .showNum{
            border-bottom: 1px solid rgb(220,220,220);
            font-size: 30px;
            color: black;
            height: 45px;
        }
        .down{
            display: flex;
            justify-content: space-around;
            margin-top: 15px;
            .download{
                .go-photo{
                font-size: 34px;
                color: rgb(6,122,254);
                }
                .select{
                    position: absolute;
                    z-index: -10;
                    opacity: 0;
                    height: 10px;
                    width: 10px;
                }
            }
        }
    }
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
