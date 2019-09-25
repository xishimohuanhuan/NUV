<template>
    <div>
        <div class="setting-form">
            <ul>
                <li>
                    <i @click="goSearch" class="select" >+{{countryItem.tel}}</i>
                    <input 
                        type="number" 
                        v-model="mobile" 
                        :placeholder="$t('otherWT.entPhAcc')"
                    >
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
                    <span @click="getCode(5)">{{ sendTimer ? `${sendTimer} s` : sendmsg2}}</span>
                </li>
            </ul>
            <div class="bottom-btn" :class="{disable: !veridate}">
                <button @click="postFormHandle">{{$t('setting.confirm')}}</button>
            </div>
        </div>
        <div v-show="false" class="lxa-poptip">
            <h5>{{$t('setting.poptip')}}:</h5>
            <p>
                <span class="isInportent">*</span>
                <span>{{$t('setting.email.poptip1')}}</span>
            </p>
            <p>
                <span class="isInportent">*</span>
                <span>{{$t('setting.email.poptip2')}}</span>
            </p>
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
import {getUserInfo, sendMobileCode, postBindMobile, queryTel} from './userRequest.js'

export default {
   data() {
        return {
            sendFlag2: false,
            mobile: '',
            mobileRule1: false,
            sendTimer: 0,
            codeNum: 4,
            moblepre:'',
            msgCodeTwo: '',
            pushTimer: null,
            toastShow: false
        }
    },
    computed: {
        sendmsg2: function(){
            return this.sendFlag2 ? this.$t('setting.sendAgain') : this.$t('setting.send')
        },
        countryItem() {
            return this.$store.state.countryItem;
        },
        veridate() {
            return this.mobile && this.msgCodeTwo;
        }
    },
    methods: {
        // 获取邮箱验证码
        getCode(type){
            let timer;
            if(this.sendTimer) return ;
            this.testmobile();
            if(!this.mobileRule1) return;
            timer = this.setPendingTime2(60); //设置发送时间
            let { userId } = this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId')));
                // return;
            let data = {
                userId,
                type,
                mobile: this.mobile,
                moblepre: this.countryItem.tel,
            }
            sendMobileCode(data)
            .then(res => {
                if(res.status === 200){
                    this.$normalToast(res.data.msg,1000);
                    if(res.data.msg === "手机号已被绑定") {
                        clearInterval(timer);
                        this.sendTimer = 0;
                    }
                    if(res.data.status === 200) {
                        this.codeNum = res.data.data[0];
                    }
                    if(res.data.status === 500){
                        clearInterval(timer);
                        this.sendTimer = 0;
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
        setPendingTime2(time) {
            this.sendTimer = time;
            this.sendFlag2 = true;
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
            this.testmobile();
            if(!this.mobileRule1) return;
            let { userId } = this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId')));
            let { msgCodeTwo} = this;
            let data = {
                userId,
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
            this.mobile=this.mobile.trim();
            let tel = this.countryItem.tel;
            if(tel === '86'){
                let execute = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
                if(!execute.test(this.mobile)){
                    this.$normalToast(this.$t('setting.tel.mobileRule1'),1000);
                    this.mobileRule1 = false;
                    return ;
                }
            }
            this.mobileRule1 = true;
        },
        inputCodeHandle(num=4){
            // 输入验证码
            this.msgCodeTwo=this.msgCodeTwo.trim().slice(0, num);
        },
        mainClick() {
            this.toastShow = false;
            location.reload();
        },
    },
    destroyed() {
        if(this.pushTimer) clearTimeout(this.pushTimer);
    },
    created() {
        this.$store.commit('changeNoMenu', false);
    },
}
</script>

<style lang='less' scoped>
@import url('./formInput.less');
</style>
