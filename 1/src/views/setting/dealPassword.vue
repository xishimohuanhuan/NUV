<template>
    <div>
        <div class="setting-form">
            <ul>
                <li>
                    <h5 >{{mobile | mobileShow}}</h5>
                    <input 
                        type="number" 
                        :placeholder="$t('setting.tel.pleaseTelCode')" 
                        v-model="mobileCode" 
                        @input="inputCodeHandle"
                    >
                    <span @click="getCode()">{{ sendTimer ? `${sendTimer} s` : sendmsg}}</span>
                </li>
                <li>
                    <h5>{{$t('setting.password.newPassword')}}</h5>
                    <input 
                        type="password"
                        :placeholder="$t('setting.password.pleaseNewPassword')" 
                        v-model="password" 
                        @input="inputPasswordHandle"
                    >
                        <!-- @blur="onblurHandle" -->
                </li>
                <li>
                    <h5 >{{$t('setting.password.newPassword')}}</h5>
                    <input 
                        type="password" 
                        :placeholder="$t('setting.password.pleaseNewconfirmPassword')" 
                        v-model="confirmPassword"
                        @input="inputPasswordHandle"
                    >
                        <!-- @blur="onblurHandle(1)" -->
                </li>
            </ul>
            <div class="bottom-btn" :class="{disable: !veridate}">
                <button @click="postFormHandle">{{$t('setting.confirm')}}</button>
            </div>
        </div>
        <div class="lxa-poptip">
            <h5>{{$t('setting.poptip')}}:</h5>
            <p>
                <span class="isInportent">*</span>
                <span>{{$t('setting.password.poptip1')}}</span>
            </p>
            <p>
                <span class="isInportent">*</span>
                <span>{{$t('setting.password.poptip2')}}</span>
            </p>
            <p>
                <span class="isInportent">*</span>
                <span>{{$t('setting.password.poptip3')}}</span>
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
import {getUserInfo, sendMobileCode, updatePayPassword, sendPwdMsgCode} from './userRequest.js'
export default {
    data() {
        return {
            sendFlag: false,
            mobile: '',
            password: '',
            confirmPassword: '',
            sendTimer: 0,
            mobileCode: '',
            passwordRule: false,
            codeNum1: 6,
            mobileCodeRule: false,
            pushTimer: null,
            toastShow: false
        }
    },
    filters: {
        mobileShow(val) {
            return val.replace(val.slice(3,-3),'***')
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
            return this.mobileCode && this.password && this.confirmPassword;
        },
        // passwordRule() {
        //     return this.password && (this.password === this.confirmPassword)
        // }
    },
    methods: {
        // 获取邮箱验证码
        getCode(){
            if(!this.mobile) return ;
            if(this.sendTimer) return ;
            let timer = this.setPendingTime(60); //设置发送时间
            let { userId } = this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId')));
            let data = {
                userId,
            }
            sendPwdMsgCode(data)
            .then(res => {
                if(res.status === 200){
                    this.$normalToast(res.data.msg,1000);
                    if(res.data.status === 200) {
                        this.codeNum1 = res.data.data[0];
                    }
                    if(res.data.status === 500){
                        clearInterval(timer);
                        this.sendTimer = 0;
                    }
                }
            }).catch( () => {
                this.$normalToast(this.$t('setting.sendErr'),1000);
            })
        },
        inputPasswordHandle() {
            let reg = /[0-9a-zA-Z]$/;
            // let execute = /^[0-9a-zA-Z]{6,16}$/;
            if(!reg.test(this.password)) {
                this.password = this.password.slice(0,-1);
            }
            if(!reg.test(this.confirmPassword)) {
                this.confirmPassword = this.confirmPassword.slice(0,-1);                
            }

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
            this.testPasswordVal();
            if(!this.passwordRule) return;
            let { userId } = this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId')));
            let data = {
                userId,
                password: this.password,
                confirmPassword: this.confirmPassword,
                msgCode: this.mobileCode
            }
            updatePayPassword(data)
            .then(res => {
                if(res.status === 200){
                    if(res.data.status === 200) {
                        let userInfo = this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId')));
                        userInfo.istradeSet = true;
                        this.$setCookie('userId', JSON.stringify(userInfo),1);
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
            }).catch(() => {
                this.toastShow = true;
            })
        },
        testPasswordVal(again) {
            // 测试密码输入
            // this.password = this.password.trim();
            // this.confirmPassword = this.confirmPassword.trim();
            // if(!this.password){
            //     this.$normalToast(this.$t('setting.password.passwordRule4'),1000);    //请设置交易密码
            //     this.password = '';
            //     this.confirmPassword = '';
            //     return ;
            // }
            let execute = /^[0-9a-zA-Z]{6,16}$/;
            if(!execute.test(this.password)){
                this.$normalToast(this.$t('setting.password.passwordRule1'),1000);   //请输入大于6位小于16位字母或数字的密码
                // this.password = '';
                // this.confirmPassword = '';
                this.passwordRule = false;
                return ;
            }
            // if(!again) return;  // 如果不是确认密码，则不做下面的效验
            // if(!this.confirmPassword){
            //     this.$normalToast(this.$t('setting.password.passwordRule2'),1000);    //请再次输入交易密码
            //     this.password = '';
            //     this.confirmPassword = '';
            //     return ;
            // }
            // if(!execute.test(this.confirmPassword)){
            //     this.$normalToast(this.$t('setting.password.passwordRule1'),1000);   //请输入大于6位小于16位字母或数字的密码
            //     this.password = '';
            //     this.confirmPassword = '';
            //     return ;
            // }
            if(this.password !== this.confirmPassword){
                this.$normalToast(this.$t('setting.password.passwordRule3'),1000);   //两次输入交易密码不一致
                // this.password = '';
                // this.confirmPassword = '';
                this.passwordRule = false;
                return ;
            }
            this.passwordRule = true;
        },
        inputCodeHandle(){
            // 输入验证码
            // this.mobileCode=this.mobileCode.trim().slice(0, this.codeNum1);
            // if(!this.mobileCode){
            //     this.$normalToast(this.$t('setting.password.passwordRule0'),1000);
            //     this.mobileCodeRule = false;
            //     return ;
            // }
            // this.mobileCodeRule = true;
        },
        mainClick() {
            this.toastShow = false;
            location.reload();
        },
        // onblurHandle(type){
        //     if(type == 1){
        //         this.testPasswordVal(true);
        //         return;
        //     }
        //     this.testPasswordVal();
        // }
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
                vm.mobile = userInfo.userName;
            } else{
                // 如果路由中没有email,重新请求
                let {userId}= vm.$getCookie('userId') && JSON.parse(decodeURIComponent(vm.$getCookie('userId')));
                getUserInfo({userId})
                .then(res => {
                    if(res.status === 200){
                        vm.mobile = res.data.data.userName;
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
