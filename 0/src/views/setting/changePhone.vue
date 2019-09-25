<template>
    <div>
        <div class="setting-form">
            <ul>
                <li>
                    <h5>{{$t('setting.tel.oldTel')}}</h5>
                    <input 
                        type="number" 
                        v-model="oldMoBile"
                        readonly
                    >
                    <div :class="'iti-flag ' + oldMoBileErea"></div>
                </li>
                <li>
                    <h5 >{{$t('setting.tel.telVerifyCode')}}</h5>
                    <input 
                        type="number" 
                        :placeholder="$t('setting.tel.pleaseTelCode')" 
                        v-model="msgCodeOne" 
                        @input="inputCodeHandle()"
                    >
                        <!-- @blur="blurCodeHandle1" -->
                    <span @click="getCode(4)">{{ sendTimer1 ? `${sendTimer1} s` : sendmsg1}}</span>
                </li>
                <li>
                    <i @click="goSearch" class="select" >+{{countryItem.tel}}</i>
                    <input 
                        type="number" 
                        v-model="mobile" 
                        :placeholder="$t('setting.tel.pleaseNewTel')"
                    >
                        <!-- @blur="onblurHandle" -->
                    <div :class="'iti-flag ' + countryItem.short.toLowerCase()"></div>
                </li>
                <li>
                    <h5 >{{$t('setting.tel.telVerifyCode')}}</h5>
                    <input 
                        type="number" 
                        :placeholder="$t('setting.tel.pleaseTelCode')" 
                        v-model="msgCodeTwo" 
                        @input="inputCodeHandle()"
                    >
                        <!-- @blur="blurCodeHandle2" -->
                    <span @click="getCode(5)">{{ sendTimer2 ? `${sendTimer2} s` : sendmsg2}}</span>
                </li>
            </ul>
            <div class="bottom-btn" :class="{disable: !veridate}">
                <button @click="postFormHandle">{{$t('setting.confirm')}}</button>
            </div>
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
import {getUserInfo, sendMobileCode, postBindMobile, queryTel} from './userRequest.js'

export default {
   data() {
        return {
            sendFlag1: false,
            sendFlag2: false,
            mobile: '',
            codeNum1: 6,
            codeNum2: 6,
            oldMoBile: '',
            oldMoBilepre: '',
            oldMoBileErea: '',
            mobileRule1: false,
            sendTimer1: 0,
            sendTimer2: 0,
            moblepre:'',
            msgCodeOne: '',
            msgCodeTwo: '',
            telCodeRule1: false,
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
        countryItem() {
            return this.$store.state.countryItem;
        },
        veridate() {
            return this.oldMoBile && this.msgCodeOne && this.mobile && this.msgCodeTwo;
        }
    },
    methods: {
        // 获取邮箱验证码
        getCode(type){
            let timer1,timer2;
            if(type == 5){
                if(this.sendTimer2) return ;
                this.testmobile();
                if(!this.mobileRule1) return;
                timer2 = this.setPendingTime2(60); //设置发送时间
            }else {
                if(!this.oldMoBile) return;
                if(this.sendTimer1) return ;
                timer1 = this.setPendingTime1(60); //设置发送时间
            }
            let { userId } = this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId')));
                // return;
            let data = {
                userId,
                type,
                mobile: type === 4 ? this.oldMoBile : this.mobile,
                moblepre: type === 4 ? this.oldMoBilepre : this.countryItem.tel,
            }
            sendMobileCode(data)
            .then(res => {
                if(res.status === 200){
                    this.$normalToast(res.data.msg,1000);
                    if(res.data.msg === "手机号已被绑定") {
                        this.sendTimer2 = 1;
                    }
                    if(res.data.status === 200) {
                        type == 4 ? this.codeNum1 = res.data.data[0] : this.codeNum2 = res.data.data[0]
                    }
                    if(res.data.status === 500){
                        clearInterval(type == 4 ? timer1 : timer2);
                        type == 4 ? this.sendTimer1 = 0 : this.sendTimer2 = 0;
                    }
                }
            }).catch( err => {
                this.$normalToast(this.$t('setting.sendErr'),1000);
            })
        },
        goSearch() {
            // 选择电话号码
            this.$router.push('/search');
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
            // this.blurCodeHandle1();
            // this.blurCodeHandle2();
            this.testmobile();
            if(!this.mobileRule1) return;
            let { userId } = this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId')));
            let { msgCodeTwo, msgCodeOne} = this;
            let data = {
                userId,
                msgCodeOne,
                msgCodeTwo,
                mobile: this.mobile,
                moblepre: '+'+this.countryItem.tel
            }
            postBindMobile(data)
            .then(res => {
                if(res.status === 200){
                    if(res.data.status === 200) {
                        this.$normalToast(`${res.data.msg},${this.$t('setting.towSecToSafe')}`);
                        this.pushTimer = setTimeout(() => {
                            this.$store.commit('phoneChangeHandle', true);
                            this.$router.go(-2);
                        },2000)
                    } else{
                        this.$normalToast(`${res.data.msg}`);
                    }
                }else{
                    this.toastShow = true;
                }
            }).catch(() => {
                this.toastShow = true;
            })
        },
        testmobile() {
            // 测试手机号输入
            this.mobile=this.mobile.trim();
            // if(!this.mobile){
            //     this.$normalToast(this.$t('setting.tel.pleaseNewTel'),1000);    //请输入新手机号
            //     this.mobileRule1 = false;
            //     return ;
            // }
            let tel = this.countryItem.tel;
            if(tel === '86'){
                let execute = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
                if(!execute.test(this.mobile)){
                    this.$normalToast(this.$t('setting.tel.mobileRule1'),1000);
                    this.mobileRule1 = false;
                    return ;
                }
            }
            if(this.mobile === this.oldMoBile){
                this.$normalToast(this.$t('setting.tel.mobileUsed'),1000);
                this.mobileRule1 = false;
                return ;
            }
            this.mobileRule1 = true;
        },
        inputCodeHandle(num=4){
            // 输入验证码
            this.msgCodeOne=this.msgCodeOne.trim().slice(0, this.codeNum1);
            this.msgCodeTwo=this.msgCodeTwo.trim().slice(0, this.codeNum2);
            if(!(this.msgCodeOne && this.msgCodeTwo)){
                this.telCodeRule1 = false;
                return ;
            }
            this.telCodeRule1 = true;
        },
        mainClick() {
            this.toastShow = false;
            location.reload();
        },
        blurCodeHandle1() {
            if(!this.msgCodeOne){
                this.$normalToast(this.$t('setting.tel.pleaseTelCode'),1000);
                return ;
            }
        },
        blurCodeHandle2() {
            if(!this.msgCodeTwo){
                this.$normalToast(this.$t('setting.tel.pleaseTelCode'),1000);
                return ;
            }
        },
        onblurHandle(){
            this.testmobile();
        }
    },
    destroyed() {
        if(this.pushTimer) clearTimeout(this.pushTimer);
    },
    created() {
        this.$store.commit('changeNoMenu', false);
    },
    beforeRouteEnter(to, from, next) {
        let userInfo = to.params;
        next(vm => {
            // vm.$store.commit('changeNoMenu', false);
            if(userInfo.mobile){
                vm.oldMoBile = userInfo.mobile;
                vm.moblepre = userInfo.moblepre;
                let tel = userInfo.moblepre.slice(1)
                vm.oldMoBileErea = queryTel(tel).short.toLowerCase();
            } else{
                // 如果路由中没有mobile,重新请求
                let {userId}= vm.$getCookie('userId') && JSON.parse(decodeURIComponent(vm.$getCookie('userId')));
                getUserInfo({userId})
                .then(res => {
                    if(res.status === 200){
                        vm.oldMoBile = res.data.data.mobile;
                        vm.moblepre = res.data.data.moblepre;
                        let tel = res.data.data.moblepre.slice(1);
                        vm.oldMoBilepre = tel;
                        vm.oldMoBileErea = queryTel(tel).short.toLowerCase();   //查询手机号小旗子
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
