<template>
    <div>
        <div class="setting-form">
            <ul>
                <li v-if="false">
                    <h5 >{{$t('register.account')}}</h5>
                    <input 
                        type="text" 
						readonly
                        v-model="userName" 
                    >
                </li>
                <li>
                    <h5>{{$t('register.loginPassword')}}</h5>
                    <input 
                        type="password"
                        :placeholder="$t('register.pliceLoginPassword1')" 
                        v-model="password" 
                        @input="inputPasswordHandle"
                    >
                </li>
                <li>
                    <h5 >{{$t('register.confirmLoginPassword')}}</h5>
                    <input 
                        type="password" 
                        :placeholder="$t('register.pliceLoginPassword2')" 
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
            <!-- <p>
                <span class="isInportent">*</span>
                <span>{{$t('setting.password.poptip2')}}</span>
            </p> -->
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
import {emailRegister, registerByPhone} from './userRequest.js'
export default {
    data() {
        return {
            mobile: '',
            password: '',
            confirmPassword: '',
            passwordRule: false,
            emailCode: '',
            email: '',
            userid: '',
            userName: '',
            toastShow: false
        }
    },
    computed: {
        // countryItem() {
        //     return this.$store.state.countryItem;
        // },
        loading() {
            return this.$store.state.loading;
        },
        veridate() {
            return this.password && this.confirmPassword;
        },
    },
    methods: {
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
        postFormHandle() {
            if(this.loading) return;
            if(!this.veridate) return;
            this.testPasswordVal();
            if(!this.passwordRule) return;
            this.$store.commit('changeLoading', true);
            let {password, confirmPassword, emailCode, email,mobile} = this;
            let temp = sessionStorage.getItem('tempInfo') && JSON.parse(sessionStorage.getItem('tempInfo')).invit;
            let bkinfo = localStorage.getItem('bkinfo') && JSON.parse(localStorage.getItem('bkinfo')).bkinfo;
            let invit = temp || bkinfo;
            let params = {
                password,
                confirmPassword,
                invit,
                mobile,
                plat: 1,
                isAgent: '0',
                type: this.userid ? 1 : 2
            }
            // 是不是经纪人
            if((!temp) && bkinfo) {
                params.isAgent = '1'
            }
            // 手机号注册
            if(this.userid) {
                params.userId = this.userid;
                params.msgCode = this.emailCode;
                this.setPhonePass(params);
            } else { // 邮箱注册
                params.emailCode = this.emailCode;
                params.email = this.email;
                emailRegister(params).then(res => {
                    this.$store.commit('changeLoading', false);
                    if(res.data.status === 200) {
                        this.loginHandle(res);
                    } else {
                        this.$normalToast(res.data.msg);
                        window.history.go(-2);
                        // this.$router.push('/home');
                    }
                }).catch(() => {
                    this.$store.commit('changeLoading', false);
                    this.$normalToast(this.$t('register.networkError')); // 网络错误
                })
            }
        },
        setPhonePass(params) {
            registerByPhone(params).then(res => {
                this.$store.commit('changeLoading', false);
                if(res.data.status === 200) {
                    this.$normalToast(this.$t('register.setSuccess'));
                    setTimeout(() => {
                        let rout = sessionStorage.getItem('nextRoute');
                        if (rout) {
                            if(rout.includes('regist')) {
                                this.$router.push('/home');
                            } else{
                                this.$router.push(rout);
                            }
                        } else {
                            this.$router.push('/home');
                        }
                    },2000)
                } else {
                    switch(res.data.code) {
                        case "001": // 短信验证码错误
                            this.$normalToast(this.$t('register.timeOut'));  //操作超时，请稍后再试
                            break;
                        case "002": // 参数错误
                            this.$normalToast(this.$t('register.networkError')); // 网络错误
                            break;
                        default:
                            this.$normalToast(res.data.msg);
                    }
                }
            }).catch(() => {
                this.$store.commit('changeLoading', false);
                // this.$normalToast('网络错误');
                this.$normalToast(this.$t('register.networkError'));
            })
        },
        loginHandle(res) {
            // 登录过期存储
            if(!this.$getCookie("tLost")){
                this.$setCookie("tLost",res.data.data.date,15);
            }
            let obj = {
                phone: res.data.data.user.moble || res.data.data.user.email,
                userId: res.data.data.user.id,
                token: res.data.data.user.token,
            }
            localStorage.setItem('isAgent',res.data.data.isAgent)
            sessionStorage.setItem('LoginQick', JSON.stringify(obj));
            this.$setCookie('userId', JSON.stringify(obj), 1)  //登录成功
            this.$normalToast(this.$t('register.registSuccess'));  // 注册成功
            localStorage.setItem('longE', res.data.data.user.email);
            localStorage.removeItem('bkinfo');
            this.$axios({
                baseURL: this.$interfacePhpUrl,
                url: '/Ajax/getSession?userId=' + obj.userId + '&token=' + obj.token,
                method: 'get',
                withCredentials: false
            }).then((data) =>{
                if (data.data.code == 200) {
                    sessionStorage.setItem('sessionId', data.data.data);
                    sessionStorage.removeItem('tempoI');
                }
            });
            let rout = sessionStorage.getItem('nextRoute');
            if (rout) {
                if(rout.includes('regist')) {
                    this.$router.push('./home')
                } else{
                    this.$router.push(rout)
                }
            } else {
                this.$router.push('./home')
            }
        },
        testPasswordVal(again) {
            // 测试密码输入
            let execute = /^[0-9a-zA-Z]{6,16}$/;
            if(!execute.test(this.password)){
                this.$normalToast(this.$t('setting.password.passwordRule1'),1000);   //请输入大于6位小于16位字母或数字的密码
                this.passwordRule = false;
                return ;
            }
            if(this.password !== this.confirmPassword){
                this.$normalToast(this.$t('setting.password.passwordRule3'),1000);   //两次输入密码不一致
                this.passwordRule = false;
                return ;
            }
            this.passwordRule = true;
        },
        mainClick() {
            this.toastShow = false;
            location.reload();
        },
    },
    beforeRouteEnter(to, from, next) {
        let emailCode = to.params.code;
        let user = sessionStorage.getItem('tempInfo') && JSON.parse(sessionStorage.getItem('tempInfo'));
        next(vm => {
            let userid = vm.$getCookie('userId') && JSON.parse(decodeURIComponent(vm.$getCookie('userId'))).userId;
            vm.emailCode = emailCode;
            vm.email = user.email;
            vm.mobile = user.mobile;
            vm.userid = userid;
            if(vm.userid) {
                vm.userName = vm.mobile;
            } else {
                vm.userName = vm.email;
            }
        });
    },
    beforeRouteLeave(to, from, next) {
        this.$store.commit('changeLoading', false);
		next();
	},
}
</script>

<style lang='less' scoped>
@import url('./formInput.less');
</style>
