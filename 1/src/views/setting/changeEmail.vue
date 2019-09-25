<template>
    <div>
        <div class="setting-form">
            <ul>
                <li>
                    <h5>{{$t('setting.email.oldEmail')}}</h5>
                    <input 
                        type="email" 
                        readonly
                        v-model="oldEmailval" 
                    >
                </li>
                <li>
                    <h5 >{{$t('setting.email.emailVerifyCode')}}</h5>
                    <input 
                        type="number" 
                        :placeholder="$t('setting.email.pleaseEmailCode')" 
                        v-model="msgCodeOne" 
                        @input="inputCodeHandle"
                    >
                        <!-- @blur="blurCodeHandle(1)" -->
                    <span @click="getCode(4)">{{ sendTimer1 ? `${sendTimer1} s` : sendmsg1}}</span>
                </li>
                <li>
                    <h5>{{$t('setting.email.newEmail')}}</h5>
                    <input 
                        type="text" 
                        :placeholder="$t('setting.email.pleaseNewEmail')" 
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
                        v-model="msgCodeTwo" 
                        @input="inputCodeHandle"
                    >
                        <!-- @blur="blurCodeHandle(2)" -->
                    <span @click="getCode(5)">{{ sendTimer2 ? `${sendTimer2} s` : sendmsg2}}</span>
                </li>
            </ul>
            <div class="bottom-btn" :class="{disable: !veridate}">
                <button @click="postFormHandle">{{$t('setting.confirm')}}</button>
            </div>
            
        </div>
        <div class="lxa-poptip" style="">
            <h5>{{$t('setting.poptip')}}:</h5>
            <p>
                <span class="isInportent">*</span>
                <span>{{$t('setting.email.poptip3')}}</span>
            </p>
        </div>
        <toast 
            :showToastType="'operate'" 
            :toastContent="$t('setting.changeErr')" 
            :isShow = "toastShow"
            :showToastImgType="'warning'" 
            :toastTitle="$t('setting.error')" 
            :toastOperateTitle="$t('setting.IKonw')" 
            @handle-main-click="mainClick"/>
    </div>
</template>

<script>
import {getUserInfo, getEmailCode, postBindEmail} from './userRequest.js'
export default {
    data() {
        return {
            sendFlag1: false,
            sendFlag2: false,
            emailVal: '',
            oldEmailval: '',
            emailRule1: false,
            sendTimer1: 0,
            sendTimer2: 0,
            msgCodeOne: '',
            msgCodeTwo: '',
            emailCodeRule1: false,
            msgCodeOneRule1: false,
            emsgCodeTwoRule1: false,
            pushTimer: null,
            toastShow: false
        }
    },
    computed: {
        sendmsg1: function(){
            return this.sendFlag1 ? this.$t('setting.sendAgain') : this.$t('setting.send')
        },
        sendmsg2: function(){
            return this.sendFlag2 ? this.$t('setting.sendAgain') : this.$t('setting.send')
        },
        veridate() {
            return this.oldEmailval && this.msgCodeOne && this.emailVal && this.msgCodeTwo;
        }
    },
    methods: {
        // 获取邮箱验证码
        getCode(type){
            let timer1,timer2;
            if(type == 5){
                if(this.sendTimer2) return ;
                this.testEmailVal();
                if(!this.emailRule1) return ;
                timer2 = this.setPendingTime2(60); //设置发送时间
            }else {
                if(this.sendTimer1) return ;
                if(!this.oldEmailval) return ;
                timer1 = this.setPendingTime1(60); //设置发送时间
            }
            let { userId } = this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId')));
            let data = {
                userId,
                type,
                email: type === 4 ? this.oldEmailval : this.emailVal
            }
            getEmailCode(data)
            .then(res => {
                if(res.status === 200){
                    this.$normalToast(res.data.msg, 1000);
                    if(res.data.status === 500){
                        clearInterval(type == 4 ? timer1 : timer2);
                        type == 4 ? this.sendTimer1 = 0 : this.sendTimer2 = 0;
                    }
                }
            }).catch( () => {
                this.$normalToast(this.$t('setting.sendErr'),1000);
            })
        },
        setPendingTime1(time) {
            this.sendTimer1 = time;
            this.sendFlag1 = true;
            let timer = setInterval(() => {
                this.sendTimer1 -= 1;
                if(this.sendTimer1 <= 0){
                    clearInterval(timer);
                    timer = null;
                }
            },1000);
            return timer;
        },
        setPendingTime2(time) {
            this.sendTimer2 = time;
            this.sendFlag2 = true;
            let timer = setInterval(() => {
                this.sendTimer2 -= 1;
                if(this.sendTimer2 <= 0){
                    clearInterval(timer);
                    timer = null;
                }
            },1000);
            return timer;
        },
        postFormHandle() {
            if(!this.veridate) return;
            this.testEmailVal();
            if(!this.emailRule1) return ;
            let { userId } = this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId')));
            let { msgCodeTwo, msgCodeOne} = this;
            let data = {
                userId,
                msgCodeOne,
                msgCodeTwo,
                email: this.emailVal
            }
            postBindEmail(data)
            .then(res => {
                if(res.status === 200){
                    if(res.data.status === 200) {
                        this.$normalToast(`${res.data.msg},${this.$t('setting.towSecToSafe')}`);
                        this.pushTimer = setTimeout(() => {
                            this.$router.go(-2);
                        },2000)
                    } else {
                        this.$normalToast(`${res.data.msg}`);
                        // this.toastShow = true;
                    }
                }else{
                    // 
                    this.toastShow = true;
                }
            }).catch(() => {
                // 
                this.toastShow = true;
            })
        },
        mainClick() {
            this.toastShow = false;
            location.reload();
        },
        inputEmailHandle(){
            this.emailVal=this.emailVal.trim();
        },
        testEmailVal() {
            // 测试邮箱输入
            this.emailVal=this.emailVal.trim();
            // if(!this.emailVal){
            //     this.$normalToast(this.$t('setting.email.pleaseEmail'),1000);    //请输入邮箱邮箱
            //     this.emailRule1 = false;
            //     return ;
            // }
            let execute = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            if(!execute.test(this.emailVal)){
                this.$normalToast(this.$t('setting.email.emailRule1'),1000); // 请输入有效邮箱
                this.emailRule1 = false;
                return ;
            }
            if(this.emailVal === this.oldEmailval){
                this.$normalToast(this.$t('setting.email.emailUsed'),1000);  // 该邮箱已绑定
                this.emailRule1 = false;
                return ;
            }
            this.emailRule1 = true;
        },
        inputCodeHandle(){
            // 输入验证码
            this.msgCodeOne=this.msgCodeOne.trim();
            this.msgCodeTwo=this.msgCodeTwo.trim();
            if(!(this.msgCodeOne && this.msgCodeTwo)){
                this.emailCodeRule1 = false;
                return ;
            }
            this.emailCodeRule1 = true;
        },
        blurCodeHandle(type) {
            if(type == 2){
                if(!this.msgCodeTwo){
                    this.$normalToast(this.$t('setting.email.pleaseEmailCode'),1000);
                    return ;
                }
            }
            if(!this.msgCodeOne){
                this.$normalToast(this.$t('setting.email.pleaseEmailCode'),1000);
                return ;
            }
        },
        onblurHandle(){
            this.testEmailVal();
        }
    },
    destroyed() {
        if(this.pushTimer) clearTimeout(this.pushTimer);
    },
    created() {
        this.$store.commit('changeNoMenu', false);
    },
    beforeRouteEnter(to, from, next) {
        let userInfo = to.params
        next(vm => {
            // vm.$store.commit('changeNoMenu', false);
            if(userInfo.email){
                vm.oldEmailval = userInfo.email;
            } else{
                // 如果路由中没有email,重新请求
                let {userId}= vm.$getCookie('userId') && JSON.parse(decodeURIComponent(vm.$getCookie('userId')));
                getUserInfo({userId})
                .then(res => {
                    if(res.status === 200){
                        vm.oldEmailval = res.data.data.email;
                    }
                })
            }
        });
    },
    // beforeRouteLeave(to, from, next){
    //     this.$store.commit('changeNoMenu', true);
    //     next();
    // },
}
</script>

<style lang='less' scoped>
@import url('./formInput.less');
</style>
