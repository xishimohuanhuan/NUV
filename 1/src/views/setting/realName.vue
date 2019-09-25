<template>
    <div class="body-box">
        <div class="setting-form">
            <ul>
                <li>
                    <h5>{{$t('setting.realName.realName')}}</h5>
                    <input 
                        type="text" 
                        :placeholder="$t('setting.realName.pleaseRealName')" 
                        v-model="realName" 
                        @input="realNameInput"
                        @blur="onblurHandle($event, 'realName')"
                    >
                </li>
                <li>
                    <h5 >{{$t('setting.realName.IDNumber')}}</h5>
                    <input 
                        type="text" 
                        :placeholder="$t('setting.realName.pleaseIDNumber')" 
                        v-model="IDNumber" 
                        @input="IDNumberInput"
                        @blur="onblurHandle($event, 'IDNumber')"
                    >
                </li>
            </ul>
            
        </div>
        <div class="box">
            <ul>
                <li v-for="item in uploadList" :key="item.name">
                    <div class="file">
                        <input type="file" @change="fileChange($event, item.name)" accept="image/*" name="" id="" />
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
                <span>{{$t('setting.realName.poptip1')}}</span>
            </p>
            <p>
                <span>{{$t('setting.realName.poptip2')}}</span>
            </p>
        </div>
        <toast 
            :isShow="showall"
            :showToastType="'normal'" 
            :toastContent="toasTitle"
        />
        <toast 
            :showToastType="'operate'" 
            :toastContent="$t('setting.postErr')" 
            :isShow = "toastShow"
            :showToastImgType="'warning'" 
            :toastTitle="$t('setting.error')" 
            :toastOperateTitle="$t('setting.IKonw')" 
            @handle-main-click="mainClick"/>
    </div>
</template>

<script>
import Status from '../../component/setting/status.vue'
import myProgress from '../../component/progress';
import { cutDownIMG } from '../../commons/cutDown'
import {getRealAuthInfo, uploadImg, postBindMobile, postRealAuth, getToken} from './userRequest.js'
import { uploadQiniu } from '../../commons/qiniuUpload'
export default {
    components: {
        Status,
        myProgress
    },
    data() {
        return {
            toasTitle:'请上传正确的图片格式(png,jpg,bmp,gif)',
            showall:false,
            timer1:null,
            IDNumber: '',
            realName: '',
            toastShow: false,
            uploadList: [
                {
                    val: '',
                    title: 'setting.realName.faceCard',
                    img: require('../../assets/img/setting/07.png'),
                    name: 'idcardimg1',
                    percent: 0
                },
                {
                    val: '',
                    title: 'setting.realName.backCard',
                    img: require('../../assets/img/setting/08.png'),
                    name: 'idcardimg2',
                    percent: 0
                },
                {
                    val: '',
                    title: 'setting.realName.holdCard',
                    img: require('../../assets/img/setting/06.png'),
                    name: 'idcardimg3',
                    percent: 0
                },
            ],
            statusData: {
                title: '',
                status: 2,
                body: [
                    {
                        key: '',
                        name: '',
                        val: ''
                    },
                ]
            }
        }
    },
    computed: {
        sendmsg: function(){
            return this.sendFlag ? this.$t('setting.sendAgain') : this.$t('setting.send')
        },
        countryItem() {
            return this.$store.state.countryItem;
        },
        veridate() {
            return this.IDNumber && this.realName && this.uploadListRule1;
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
    created() {
        this.$store.commit('changeNoMenu', false);
    },
    beforeRouteEnter (to, from, next) {
        next( vm => {
            // vm.$store.commit('changeNoMenu', false);            
            let id = vm.$getCookie('userId') && JSON.parse(decodeURIComponent(vm.$getCookie('userId'))).userId;
            getRealAuthInfo({id})
            .then( res => {
                vm.statusDataHandle(res.data.data);
            })
        })
    },
    // beforeRouteLeave(to, from, next){
    //     this.$store.commit('changeNoMenu', true);
    //     next();
    // },
    methods: {
        goRealName(){
            this.statusData.status = 2;
        },
        statusDataHandle(data){
            if((data.idcardauth === 1) || (data.idcardauth === 3)) {
                // 如果有提交信息，则直接跳转
                this.$router.replace('/setting/realNameStatus')
                return;
            }
            // 处理实名认证信息
            const TITLE = {
                '0': 'setting.realName.statusData0',
                '1': 'setting.realName.statusData1',
                '3': 'setting.realName.statusData3'
            }
            const KEY = {
                '0': ['setting.realName.name', 'setting.realName.idCard'],
                '1': ['setting.realName.name', 'setting.realName.idCard'],
                '3': ['setting.realName.reason']
            }
            const VAL = {
                '0': ['truename', 'idcard'],
                '1': ['truename', 'idcard'],
                '3': ['idcardinfo']
            }
            this.statusData.status = data.idcardauth;
            this.statusData.title = TITLE[data.idcardauth];
            this.statusData.body = KEY[data.idcardauth].map((item, index) => {
                let key = item;
                let name =  VAL[data.idcardauth][index];
                let val = data[VAL[data.idcardauth][index]];
                return {
                    key,
                    val,
                    name
                }
            })
        },
        postFormHandle(){
            if(!this.veridate) return;
            if(!this.testRealName()) return;
            if(!this.testIDNumber()) return;
            this.postRealName();    
        },
        postRealName(){
            let id = this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId'))).userId;
            let idcard = this.IDNumber;
            let truename = this.realName;
            let data = {
                id,
                idcard,
                truename,
            }
            this.uploadList.map(item => {
                data[item.name] = item.val;
            })
            postRealAuth(data)
            .then(res => {
                if(res.status == 200){
                    localStorage.setItem('isName1',this.realName);
                    if(res.data.status === 200) {
                        this.$Toast(`${this.$t(res.data.msg)},\n${this.$t('setting.towSecRef')}`);
                        this.pushTimer = setTimeout(() => {
                            this.$router.replace('/setting/realNameStatus');
                        },2000)
                    } else {
                        this.$Toast(`${this.$t(res.data.msg)}`);
                    }
                } else {
                    this.toastShow = true;
                }
            })
        },
        fileChange(e, name){
            let file = e.target.files[0];
            if (file.size > 10 * 1024 * 1024) {
                this.$Toast(this.$t('setting.realName.IDCartRule4'));
                return;
            }
            // 上传正确的图片格式
            let imgName=[
                'png',
                'PNG',
                'jpg',
                'JPG',
                'bmp',
                'BMP',
                'gif',
                'GIF',
                'jpeg',
                'JPEG'
            ]
            if(file){
                let str1=file.name.split('.');
                let letn=str1.length;
                let geImg=str1[letn-1];
                let isFlase=imgName.indexOf(geImg);
                if(isFlase!==-1){
                    this.uploadImgHandle(file, name);
                }else{
                    this.showall=true;
                    this.timer1=setTimeout(()=>{
                        this.showall=false;
                    },2000)
                }
            }
            
        },
        uploadProgress(percent, name){
            this.uploadList = this.uploadList.map(item => {
                if(item.name === name){
                    item.percent = percent;
                }
                return item;
            })
        },
        async uploadImgHandle(file, name){
            let filename = file.name;
            
            let observable = await uploadQiniu(file, filename);
            let next = (response) =>{
                let total = response.total;
                let percent = Math.floor(total.percent)
                this.uploadProgress(percent, name);
            }
            let error = (err) => {
                
            }
            let complete = (res) => {
                
                this.replaceImg(file, name, res.hash);
            }
            let subscription  = observable.subscribe(next, error, complete);
        },
        replaceImg(file, name, val){
            this.uploadList = this.uploadList.map(item => {
                if(item.name === name){
                    item.img = URL.createObjectURL(file);
                    item.val = val;
                    item.percent = 0;
                }
                return item;
            })
        },
        getUserId() {
            let {userId}= this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId')));
            if(!userId) return;
        },
        realNameInput() {
            if(this.realName.length>16){
                this.realName=this.realName.slice(0,15)
            }
            // let execute = /^[\u4e00-\u9fa5]|[A-Za-z]$/g;
            // let res = execute.test(this.realName);
            // if(!res){
            //     this.realName = this.realName.slice(0,-1);
            // }
            this.realName = this.realName.replace(/[^A-Za-z\u4e00-\u9fa5]/g,'')
        },
        IDNumberInput() {
            this.IDNumber = this.IDNumber.replace( /[^A-Za-z0-9]/g,'')
            this.IDNumber = this.IDNumber.slice(0,20).trim();
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
        onChangeHandle(e, type){
            if(!type && this.realName.length>16){
                this.realName=this.realName.slice(0,15)
            }
            this.IDNumber = this.IDNumber.slice(0,20).trim();
            let execute = /^[\u4e00-\u9fa5]|[A-Za-z]$/g;
            let res = this.realName.match(execute);
            if(!res){
                this.realName = this.realName.slice(0,-1);
            }
        },
        mainClick() {
            this.toastShow = false;
            location.reload();
        },
        onblurHandle(e, type){
            return;
            if(type === 'realName'){
                this.testRealName();
                return ;
            }
            this.testIDNumber();
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
</style>
