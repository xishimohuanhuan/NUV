<template>
    <div class="body-box">
        <div class="setting-form">
            <ul>
                <li>
                    <h5>{{$t('setting.realName.mobile')}}</h5>
                    <input 
                        type="tel" 
                        :placeholder="$t('setting.realName.pleaseMobile')" 
                        v-model="mobile" 
                        readonly
                    >
                </li>
                <li>
                    <h5>{{$t('setting.realName.realName')}}</h5>
                    <input 
                        type="text" 
                        :placeholder="$t('setting.realName.pleaseRealName')" 
                        v-model="realName" 
                        @input="realNameInput"
                    >
                </li>
                <li>
                    <h5 >{{$t('setting.realName.IDNumber')}}</h5>
                    <input 
                        type="text" 
                        :placeholder="$t('setting.realName.pleaseIDNumber')" 
                        v-model="IDNumber" 
                        @input="IDNumberInput"
                    >
                </li>
            </ul>
        </div>
        <div class="box">
            <ul>
                <li v-for="item in uploadList" :key="item.name">
                    <div class="file">
                        <input type="file" ref="face" @change="fileChange($event, item.name)" accept="image/*" name="" id="" />
                        <div class="add-bg">
                            <img src="../../assets/img/setting/add_file.png" alt="">
                            <p>{{$t(item.title)}}</p>
                        </div>
                    </div>
                    <div class="file-bg">
                        <div class="myProgress" v-show="!!item.percent">
                            <myProgress :percent="item.percent"/>
                        </div>
                        <img :ref="item.name" :src="item.img" alt="">
                    </div>
                </li>
            </ul>
        </div>
        <div class="lxa-bottom-btn" :class="{disable: !veridate}">
            <button @click="postFormHandle">{{$t('setting.submitAudit')}}</button>
        </div>
        <div class="lxa-poptip" style="">
            <h5>{{$t('setting.poptip')}}:</h5>
            <p>
                <span class="isInportent">*</span>
                <span>{{$t('setting.realName.poptip3')}}</span>
            </p>
            <p>
                <span class="isInportent">*</span>
                <span>{{$t('setting.realName.poptip4')}}</span>
            </p>
            <p>
                <span>图片保证五官清晰可见，尽量传正脸照片不要旋转，不能有刘海，背光不能太强.</span>
            </p>
        </div>
        <div v-if='loading' class="liveCheck-progress">
			<Loading type='component' :loading='loading'></Loading>
		</div>
        <toast 
            :isShow="showall"
            :showToastType="'normal'" 
            :toastContent="toasTitle"
        />
    </div>
</template>

<script>
const md5 = require('md5');
import myProgress from '../../component/progress';
import Loading from '../../component/loading/index.vue';
import { cutDownIMG } from '../../commons/cutDown'
import {mobile_threeCheck, idCardAuthCheck} from './userRequest.js'
import { uploadQiniu } from '../../commons/qiniuUpload';
import Compressor from 'compressorjs';
export default {
    components: {
        myProgress,
        Loading
    },
    data() {
        return {
            toasTitle:'请上传正确的图片格式(png,jpg,bmp,gif)',
            showall:false,
            timer1:null,
            IDNumber: '',
            mobile: '',
            realName: '',
            threeLink: true,
            loading: false,
            pushTimer: null,
            uploadList: [
                {
                    val: '',
                    title: 'setting.realName.faceImg',
                    img: require('../../assets/img/setting/10.jpg'),
                    name: 'idcardimg1',
                    percent: 0
                },
            ],
            compressorFile: null,
            appId: {}
        }
    },
    computed: {
        countryItem() {
            return this.$store.state.countryItem;
        },
        veridate() {
            return this.IDNumber && this.realName && this.mobile && this.uploadListRule1;;
        },
        IDNumberRule1() {
            let en = this.countryItem.en;
            if(en === 'China'){
                let execute = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
                return execute.test(this.IDNumber);
            }
            let execute = /^[A-Za-z0-9]{4,40}$/;
            return execute.test(this.IDNumber);
        },
        realNameRule1(){
            let execute =  /^[\u4e00-\u9fa5]|[A-Za-z]$/g
            return execute.test(this.realName);
        },
        uploadListRule1() {
            return this.uploadList.every(item => {
                return item.val.length > 0;
            })
        },
    },
    destroyed() {
        clearTimeout(this.timer1);
        if(this.pushTimer) clearTimeout(this.pushTimer);
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            let user = vm.$getCookie('userId') && JSON.parse(decodeURIComponent(vm.$getCookie('userId')));
            vm.mobile = user.phone; 
        })
    },
    beforeRouteLeave (to, from, next) {
        this.loading = false;
        next();
    },
    methods: {
        // 显示图片
        showImg(file, name){
            this.compressorFile = file;
            this.uploadList = this.uploadList.map(item => {
                if(item.name === name){
                    item.img = URL.createObjectURL(file);
                    item.val = file.type;
                }
                return item;
            })
        },
        postFormHandle(){
            if(!this.veridate) return;
            if(!this.verifyMobile()) return;
            if(!this.testRealName()) return;
            if(!this.testIDNumber()) return;
            this.submitPostHandle();
            // this.postRealName();
            // this.face_id_cardCompare(true)
        },
        fileChange(e, name){
            let that = this;
            let file = e.target.files[0];
            if(file) {
                if (!window.FileReader) {
                    // 判断是否支持FileReader
                    this.$normalToast('您的设备不支持图片上传，请更新系统版本后重试',1500);
                    return;
                } else if (!/^image\//.test(file.type)) {
                    // 是否是图片
                    this.$normalToast('只能选择图片',1500);
                    return;
                } else if ((file.size / 1024 / 1024) > 10) {    // 10M
                    this.$normalToast('图片太大，请重新选择',1500);
                    return;
                } else if(file.size < 500 * 1024) {
                    this.showImg(file, name);
                    return;
                } else {
                    this.photoCompress(file, {quality: 0.6, width: 800}, (res) => {
                        var file = this.convertBase64UrlToBlob(res);
                        if(file.size > 500 * 1024) {
                        console.log(file.size);
                            this.$normalToast('图片太大，请重新选择',1500);
                            return;
                        }
                        this.showImg(file, name);
                    })
                }
            }
        },
        selAndShowImg(file) {
            if (file === undefined || file === null) {
                return;
            }
            if (!window.FileReader) {
                // 判断是否支持FileReader
                this.$normalToast('您的设备不支持图片上传，请更新系统版本后重试',1500);
                return;
            } else if (!/^image\//.test(file.type)) {
                // 是否是图片
                this.$normalToast('只能选择图片',1500);
                return;
            } else if ((file.size / 1000 / 1000) > 10) {    // 10M
                this.$normalToast('图片太大，请重新选择',1500);
                return;
            }
            var reader = new FileReader();
            reader.readAsDataURL(file);
        },
        photoCompress(file, option, func) {
            var that = this;
            var ready = new FileReader();
            /* 开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,
            则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容 */
            ready.readAsDataURL(file);
            ready.onload = function() {
                var re = this.result;
                that.canvasDataURL(re, option, func);
            }
        },
        canvasDataURL(path, option, func) {
            var img = new Image();
            img.src = path;
            img.onload = function() {
                var that = this;
                // 默认按比例压缩
                var w = that.width,
                    h = that.height,
                    scale = w / h;
                w = option.width || w;
                h = option.height || (w / scale);
                var quality = 0.7;  // 默认图片质量为0.7
                //生成canvas
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                // 创建属性节点
                var anw = document.createAttribute('width');
                anw.nodeValue = w;
                var anh = document.createAttribute('height');
                anh.nodeValue = h;
                canvas.setAttributeNode(anw);
                canvas.setAttributeNode(anh);
                ctx.drawImage(that, 0, 0, w, h);
                // 图像质量
                if(option.quality && option.quality <= 1 && option.quality > 0){
                    quality = option.quality;
                }
                // quality值越小，所绘制出的图像越模糊
                var base64 = canvas.toDataURL('image/jpeg', quality);
                // 回调函数返回base64的值
                func(base64);
            }
        },
        convertBase64UrlToBlob(urlData) {
            var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            console.log(arr[0].match(/:(.*?);/))
            return new Blob([u8arr], { type : mime });
        },
        // 运营商3要素验证
        mobileThreeCheck() {
            let userId = this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId'))).userId;
            let {mobile, IDNumber, realName} = this;
            let formData = new FormData();
            formData.append('userId', userId);
            formData.append('moble', mobile);
            formData.append('idCard', IDNumber);
            formData.append('trueName', realName);
            return mobile_threeCheck(formData).then(res => {
                if(res.data.status === 200) {
                    return true;
                } else if(res.data.msg) {
                    this.$normalToast(res.data.msg, 1500);
                } else {
                    this.$normalToast('姓名、身份证号、手机号比对失败', 1500);
                }
                this.loading = false;
            }).catch(() => {
                this.loading = false;
                this.$normalToast('姓名、身份证号、手机号比对请求失败', 1500);
            })
        },
        // 人脸身份证比对
        face_id_cardCompare(mobileCheck) {
            console.log(mobileCheck)
            if(!mobileCheck) {
                return ;
            }
            let userId = this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId'))).userId;
            let file = this.compressorFile;
            let {mobile, IDNumber, realName} = this;
            let formData = new FormData();
            formData.append('userId', userId);
            formData.append('idCard', IDNumber);
            formData.append('trueName', realName);
            formData.append('file', file);
            idCardAuthCheck(formData).then(res => {
                this.loading = false;
                if(res.data.status === 200) {
                    this.$normalToast('实名成功');
                    this.pushTimer = setTimeout(() => {
                        this.$router.replace('/setting/realNameStatus');
                    },2000)
                } else if(res.data.msg) {
                    this.$normalToast(res.data.msg);
                } else {
                    this.$normalToast('实名失败');
                }
            }).catch(() => {
                this.loading = false;
                this.$normalToast('实名认证请求失败');
            })
        },

        async submitPostHandle() {
            this.loading = true;
            try{
                let mobileCheck = await this.mobileThreeCheck();
                this.face_id_cardCompare(mobileCheck);
            } catch(err) {
                this.loading = false;
            }
        },
        realNameInput() {
            if(this.realName.length>16){
                this.realName=this.realName.slice(0,15)
            }
            this.realName = this.realName.replace(/[^A-Za-z\u4e00-\u9fa5]/g,'')
        },
        IDNumberInput() {
            this.IDNumber = this.IDNumber.replace( /[^A-Za-z0-9]/g,'')
            this.IDNumber = this.IDNumber.slice(0,20).trim();
        },
        verifyMobile() {
            this.mobile=this.mobile.trim();
            let tel = this.countryItem.tel;
            if(tel === '86'){
                let execute = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
                if(!execute.test(this.mobile)){
                    this.$normalToast(this.$t('setting.tel.mobileRule1'),1000);
                    return ;
                }
            }
            return true;
        },
        testRealName() {
            // 测试真实姓名输入
            this.realName=this.realName.trim();
            if(!this.realName){
                this.$normalToast(this.$t('setting.realName.pleaseRealName'),1000);    //请输入真实姓名
                return ;
            }
            return true;
        },
        testIDNumber() {
            // 测试身份证输入
            this.IDNumber=this.IDNumber.trim();
            if(!this.IDNumber){
                this.$normalToast(this.$t('setting.realName.pleaseIDNumber'),1000);    //请输入邮箱邮箱
                return ;
            }
            let execute = /^[A-Za-z0-9]{4,40}$/;
            if(!execute.test(this.IDNumber)){
                this.$normalToast(this.$t('setting.realName.IDNumberRule1'),1000); // 请输入有效身份证号
                return ;
            }
            let en = this.countryItem.en;
            if(en === 'China'){
                let execute = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
                if(!execute.test(this.IDNumber)){
                    this.$normalToast(this.$t('setting.realName.IDNumberRule1'),1000); // 请输入有效身份证号
                    return ;
                }
            }
            return true;
        },
    },
    
}
</script>

<style lang='less' scoped>
@import url('./formInput.less');

.box{
    padding: 0 73px;
    &>ul{
        &>li{
            display: flex;
            justify-content: space-between;
            margin-top: 44px; 
            .file-bg{
                position: relative;
                margin: 0 auto;
                overflow: hidden;
                .myProgress{
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    bottom: 50%;
                    right: 50;
                    margin: -60px;
                    width: 120px;
                    height: 120px;
                }
                img{
                    width: 100%;
                    height: auto;
                }
            }
        }
    }
    .file, .file-bg{
        width: 278px;
        height: 189px;
    }
    .file{
        position: relative;
        background: #fff;
        input{
            opacity: 0;
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            border: 1px red solid;
            z-index: 1;
        }
        .add-bg{
            margin: 0 auto;
            img{
               width: 62px;
               height: auto;
               margin: 58px 0 10px;
            }
        }
    }
    .prompt{
        text-align: left;
        margin-top: 62px;
        font-size: 24px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 60px;
        letter-spacing: 0px;
        white-space: nowrap;
        color: #525252;
        text-indent: 0;
        h5{
            font-weight: normal;
        }
        .redStar::before{
            content: '*';
            color: red;
            text-indent: 0;
            padding-right: 0.5em;
        }
    }
    
}
.body-box{
    flex: 1;
}
.liveCheck-progress {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .2);
    z-index: 1200;
}
.threeLink{
    // padding: 0 20px;
}
</style>
