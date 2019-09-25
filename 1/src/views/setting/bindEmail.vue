<template>
    <div class="body-box">
        <div class="setting-form">
            <ul>
                <li>
                    <h5>{{$t('setting.email.emailAccount')}}</h5>
                    <input 
                        type="text" 
                        :placeholder="$t('setting.email.pleaseEmail')" 
                        v-model="emailVal"
                        @input="inputEmailHandle"
                    >
                        <!-- @blur="onblurHandle" -->
                </li>
                <li>
                    <h5 >{{$t('setting.email.emailVerifyCode')}}</h5>
                    <input 
                        type="number" 
                        :placeholder="$t('setting.email.pleaseEmailCode')" 
                        v-model="emailCode" 
                    >
                        <!-- @input="inputCodeHandle()" -->
                    <span @click="getCode()">{{ sendTimer ? `${sendTimer} s` : sendmsg}}</span>
                </li>
                <li v-if="false">
                    <h5>{{$t('setting.email.loginPassword')}}</h5>
                    <input 
                        type="password" 
                        :placeholder="$t('setting.email.pleaseSetPassword')" 
                        v-model="password"
                        @input="inputPasswordHandle"
                    >
                        <!-- @blur="testPasswordVal" -->
                </li>
            </ul>
            <div class="bottom-btn" :class="{disable: !veridate}">
                <button @click="postFormHandle">{{$t('setting.confirm')}}</button>
            </div>
        </div>
        <div class="lxa-poptip">
            <h5>{{$t('setting.poptip')}}:</h5>
            <!-- <p>
                <span class="isInportent">*</span>
                <span>{{$t('setting.email.poptip1')}}</span>
            </p>
            <p>
                <span class="isInportent">*</span>
                <span>{{$t('setting.email.poptip2')}}</span>
            </p> -->
            <p>
                <span class="isInportent">*</span>
                <span>{{$t('setting.email.poptip3')}}</span>
            </p>
        </div>
        <toast 
            :showToastType="'operate'" 
            :toastContent="$t('setting.bindErr')" 
            :isShow = "toastShow"
            :showToastImgType="'warning'" 
            :toastTitle="$t('setting.error')" 
            :toastOperateTitle="$t('setting.IKonw')" 
            @handle-main-click="mainClick"/>
    </div>
</template>

<script>
import { getEmailCode, postBindEmail, getUserInfo} from './userRequest.js'
export default {
    data() {
        return {
            sendFlag: false,
            emailVal: '',
            emailRule1: false,
            sendTimer: 0,
            emailCode: '',
            emailCodeRule1: false,
            password: '',
            pushTimer: null,
            toastShow: false,
            passwordRoule: false,
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
            // return this.emailVal && this.emailCode && this.password;
            return this.emailVal && this.emailCode;
        }
    },
    methods: {
        // 获取邮箱验证码
        getCode(){
            if(this.sendTimer) return ;
            this.testEmailVal();
            if(!this.emailRule1){ return ;}
            let timer = this.setPendingTime(60); //设置发送时间
            let { userId } = this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId')));
            let data = {
                userId,
                email: this.emailVal,
                type: 5
            }
            this.$store.commit('changeLoading', true);
            getEmailCode(data)
            .then(res => {
                this.$store.commit('changeLoading', false);
                if(res.status === 200){
                    this.$normalToast(res.data.msg);
                    if(res.data.status === 500){
                        clearInterval(timer);
                        this.sendTimer = 0;
                    }
                }
            }).catch( () => {})
        },
        inputEmailHandle() {
            this.emailVal = this.emailVal.trim();
        },
        setPendingTime(time) {
            this.sendTimer = time;
            this.sendFlag = true;
            let timer = setInterval(() => {
                this.sendTimer -= 1;
                if(this.sendTimer <= 0){
                    clearInterval(timer);
                    timer = null;
                }
            },1000);
            return timer;
        },
        postFormHandle() {
            if(!this.veridate) return;
            this.testEmailVal();    //测试邮箱
            if(!this.emailRule1){ return ;}
            // this.testPasswordVal(); // 测试登录密码
            // if(!this.passwordRoule) return;
            let { userId } = this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId')));
            let data = {
                userId,
                email: this.emailVal,
                msgCodeTwo: this.emailCode,
                // password: this.password
            }
            postBindEmail(data)
            .then(res => {
                if(res.status === 200){
                    if(res.data.status === 200){
                        this.$normalToast(`${res.data.msg},${this.$t('setting.towSecToSafe')}`);
                        this.pushTimer = setTimeout(() => {
                            this.$router.go(-1);
                        },2000)
                    } else {
                        this.$normalToast(`${res.data.msg}`);
                    }
                }else{
                    this.toastShow = true;
                }
            }).catch(() => {})
        },
        testPasswordVal(again) {
            // 测试密码输入
            // this.password = this.password.trim();
            // if(!this.password){
            //     this.$normalToast(this.$t('setting.password.passwordRule4'),1000);    //请设置交易密码
            //     this.passwordRoule = false;
            //     return ;
            // }
            // let execute = /^[0-9a-zA-Z]{6,16}$/;
            // if(!execute.test(this.password)){
            //     this.$normalToast(this.$t('setting.password.passwordRule1'),1000);   //请输入大于6位小于16位字母或数字的密码
            //     this.passwordRoule = false;
            //     return ;
            // }
            // this.passwordRoule = true;
        },
        inputPasswordHandle() {
            let reg = /[0-9a-zA-Z]$/;
            // let execute = /^[0-9a-zA-Z]{6,16}$/;
            if(!reg.test(this.password)) {
                this.password = this.password.slice(0,-1);
            }
        },
        testEmailVal() {
            // 测试邮箱输入
            this.emailVal=this.emailVal.trim();
            if(!this.emailVal){
                this.$normalToast(this.$t('setting.email.pleaseEmail'),1000);    //请输入有效邮箱
                this.emailRule1 = false;
                return ;
            }
            let execute = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
            if(!execute.test(this.emailVal)){
                this.$normalToast(this.$t('setting.email.emailRule1'),1000);
                this.emailRule1 = false;
                return ;
            }
            this.emailRule1 = true;
        },
        inputCodeHandle(){
            // 输入验证码
            this.emailCode=this.emailCode.trim();
            if(!this.emailCode){
                this.$normalToast(this.$t('setting.email.pleaseEmailCode'),1000);
                this.emailCodeRule1 = false;
                return ;
            }
            this.emailCodeRule1 = true;
        },
        onblurHandle(options){
            this.testEmailVal();
        },
        mainClick() {
            this.toastShow = false;
            location.reload();
        }
    },
    created() {
        this.$store.commit('changeNoMenu', false);
    },
    destroyed() {
        if(this.pushTimer) clearTimeout(this.pushTimer);
    },
    // beforeRouteLeave(to, from, next){
    //     this.$store.commit('changeNoMenu', true);
    //     next();
    // },
}
</script>

<style lang='less' scoped>
@import url('./formInput.less');
.body-box{
    flex: 1;
}
</style>
