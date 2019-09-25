<template>
    <div>
        <Headers  
            value="" 
            @back="$goBack" 
            @vlueClick="goRegister"
        ></Headers>
        <p 
            class="p-title" 
            v-if="viewType===7"
        >{{$t('logoNew.setLogoPas')}}</p>
        <p 
            class="p-title" 
            v-if="viewType===9"
        >{{$t('logoNew.changeLogoPas')}}</p>
        <p 
            class="p-title" 
            v-if="viewType===4 ||viewType===5"
        >{{$t('logoNew.logoPASS')}}</p>
        <div class="setting-form">
            <ul>
                <li v-if="viewType!==4 && viewType!==5">
                    <h5>{{$t('logoNew.accoZh')}}</h5>
                    <div>{{disablePassword}}</div>
                </li>
                <li v-if="viewType!==4 && viewType!==5">
                    <h5>{{$t('logoNew.veriCode')}}</h5>
                    <input
                        :placeholder="$t('logoNew.PlaEntCode')" 
                        v-model="messPassword" 
                    >
                    <div 
                        class="addCC"
                        @click="handleMess"
                        v-if='timeSet===60'
                    >{{timeSet===60 ? isWordMessa : ''}}</div>
                    <div 
                        class="addCC"
                        v-if='timeSet<60'
                        v-text='timeSet+"s"'
                    ></div>
                </li>
                <li>
                    <h5>{{$t('logoNew.LogoPAsIn')}}</h5>
                    <input 
                        type="password"
                        :placeholder="$t('logoNew.PlasEnterInpu')"
                        v-model="password" 
                        @input="inputChange"
                    >
                </li>
                <li>
                    <h5 >{{$t('logoNew.confPASS')}}</h5>
                    <input 
                        type="password" 
                        :placeholder="$t('logoNew.plasEntinpAga')" 
                        v-model="confirmPassword"
                        @input="inputChangeTwo"
                    >
                </li>
            </ul>
            <div 
                class="bottom-btn" 
                :class="(password && confirmPassword) ? '' : 'disable'"
            >
                <button @click="counHandle">{{$t('setting.confirm')}}</button>
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
                <span>{{$t('logoNew.wordLongPass')}}</span>
            </p>
            <p>
                <span class="isInportent">*</span>
                <span>{{$t('logoNew.wordLongPass1')}}</span>
            </p>
        </div>
    </div>
</template>

<script>
import Headers from '../../component/header'
import {
        sendCodeMess,
        settingPass,
        remmberPassEndAjax
    } from './request.js'
export default {
    components:{
        Headers
    },
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
            toastShow: false,
            // 7 没有密码设置 4忘记密码手机 5忘记密码邮箱 9 已经设置密码
            viewType:'',
            disablePassword:'',
            messPassword:'',
            timeSet:60,
            isWordMessa:this.$t('logoNew.sendCod'),
            isFlagSend:false,
            ingAjax:false,
            timer:null,
            timers:null
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.$store.commit('changeNoMenu', false);
            vm.viewType=Number(vm.$route.params.type);
            if(vm.$getCookie('userId') && JSON.parse(decodeURIComponent(vm.$getCookie('userId'))).userId){
                vm.diffOrien();
            }
        })
    },
    beforeRouteLeave(to, from, next) {
        // ...
        this.$store.commit('changeNoMenu', true);
        this.$store.commit('changeLoading', false);
        clearTimeout(this.timer);
        clearInterval(this.timers);
        next();
    },
    methods:{
        goRegister(){

        },
        // 入口
        diffOrien(){
            // 设置密码
            if(this.viewType===7 || this.viewType===9){
                this.disablePassword=JSON.parse(sessionStorage.getItem('iSssword')).p;
            }
        },
        // 发送验证码
        handleMess(){
            this.timeSet=60;
            clearInterval(this.timers);
            this.timers=setInterval(()=>{
                this.timeSet--;
                if(this.timeSet<0){
                    this.isWordMessa=this.$t('logoNew.replSendCo');
                    this.timeSet=60;
                    clearInterval(this.timers);
                    return;
                }
            },1000);
            let name=JSON.parse(decodeURIComponent(this.$getCookie('userId'))).userId;
            sendCodeMess(name).then(res=>{
                if(res.data.status===200){
                    this.$normalToast(res.data.msg);
                }
            })
        },
        // 登录密码
        inputChange(){
            if(!(/^[A-Za-z0-9]{1,16}$/g.test(this.password))){
                this.password=this.password.slice(0,this.password.length-1);
                this.$normalToast(this.$t('logoNew.plasSixToT'),1000);
            }
        },
        // 再次输入密码
        inputChangeTwo(){
            if(!(/^[A-Za-z0-9]{1,16}$/g.test(this.confirmPassword))){
                this.confirmPassword=this.confirmPassword.slice(0,this.confirmPassword.length-1);
                this.$normalToast(this.$t('logoNew.plasSixToT'),1000);
            }
        },
        // 确认
        counHandle(){
            if(this.ingAjax){
                this.$normalToast(this.$t('logoNew.repusetIng'));
                return;
            }
            if(!this.password || !this.confirmPassword){
                return;
            }
            if( this.password.length<6 || this.password.length>16){
                this.$normalToast(this.$t('logoNew.plasSixToT'),1000);
                return;
            }
            // 设置密码
            if(this.viewType===7 || this.viewType===9){
                if(!this.messPassword){
                    this.$normalToast(this.$t('logoNew.PlaEntCode'));
                    return;
                }
                if(this.password !==this.confirmPassword){
                    this.$normalToast(this.$t('logoNew.setPassNot'));
                    return;
                }
                let data ={
                    userId:JSON.parse(decodeURIComponent(this.$getCookie('userId'))).userId,
                    password:this.password,
                    confirmPassword:this.confirmPassword,
                    msgCode:this.messPassword
                }
                this.AjaxSettingPass(data);
            }
            // 手机忘记密码
            if(this.viewType===4){
                if(this.password !==this.confirmPassword){
                    this.$normalToast(this.$t('logoNew.setPassNot'));
                    return;
                }
                let data ={
                    type:1,
                    password:this.password,
                    confirmPassword:this.confirmPassword,
                    msgCode:sessionStorage.getItem('remCodeNext'),
                    mobile:sessionStorage.getItem('remPaPh')
                }
                this.remmberPassEndAjaxMeth(data)
            }
            if(this.viewType===5){
                if(this.password !==this.confirmPassword){
                    this.$normalToast(this.$t('logoNew.setPassNot'));
                    return;
                }
                let data ={
                    type:2,
                    password:this.password,
                    confirmPassword:this.confirmPassword,
                    msgCode:sessionStorage.getItem('remCodeNext'),
                    email:sessionStorage.getItem('remPaPh')
                }
                this.remmberPassEndAjaxMeth(data)
            }
        },
        // 设置密码
        AjaxSettingPass(data,data1){
            this.ingAjax=true;
            this.$store.commit('changeLoading', true);
            settingPass(data).then(res=>{
                if(res.data.status===200){
                    this.$normalToast(this.$t('logoNew.setSucc'));
                    if(this.viewType===7 || this.viewType===9){
                        setTimeout(() => {
                            if(this.$route.query.rout) {
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
                                return;
                            }
                            this.timer=setTimeout(() => {
                                window.history.go(-1);
                            }, 2000);
                        })
                    }
                }else{
                    this.$normalToast(res.data.msg);
                }
                this.$store.commit('changeLoading', false);
                this.ingAjax=false;
            }).catch(err=>{
                this.$store.commit('changeLoading', false);
                this.$normalToast(this.$t('logoNew.errCode'));
                this.ingAjax=false;
            })
        },
        // 忘记密码
        remmberPassEndAjaxMeth(data){
            this.ingAjax=true;
            this.$store.commit('changeLoading', true);
            remmberPassEndAjax(data).then(res=>{
                this.$store.commit('changeLoading', false);
                if(res.data.status===200){
                    this.$normalToast(this.$t('logoNew.sccuLogoPas'),);
                    setTimeout(()=>{
                        this.$router.push('/phoneLogin');
                    },1000);
                }else{
                    this.$normalToast(res.data.msg);
                    window.history.go(-2);
                }
                sessionStorage.removeItem('remCodeNext');
                sessionStorage.removeItem('remPaPh');
                this.ingAjax=false;
            }).catch(err=>{
                this.$store.commit('changeLoading', false);
                this.$normalToast(this.$t('logoNew.errCode'),);
                this.ingAjax=false;
            })
        }
    }
}
</script>

<style lang='less' scoped>
@import "../../component/IntlTelInput/intl.css";
.p-title{
    background-color: white;
    font-size: 45px;
    font-weight: 600;
    padding: 50px 27px 30px 27px;
    text-align: left;
}
.setting-form{
    ul{
        border-top: 1px solid #dcdcdc;
        padding: 0 27px;
        background: #fff;
        li{
            height: 97px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #dcdcdc;
            &:last-child{
                border: 0;
            }
            h5{
                font-size: 28px;
                font-weight: normal;
                font-stretch: normal;
                letter-spacing: 0px;
                color: #575757;
                width: 200px;
                text-align: left;
            }
            div{
                font-size: 24px;
                letter-spacing: 0px;
                color: #333333;
            }
            input{
                border: 0;
                outline: 0;
                font-size: 24px;
                letter-spacing: 0px;
                color: #333333;
                flex: 1;
                margin-right: 20px;
            }
            span{
                font-size: 24px;
                letter-spacing: 0px;
                color: #3e80ca; 
            }
            .addCC{
                color: #3e80ca; 
            }
        }
    }
    .bottom-btn{
        height: 100px;
        width: 100%;
        background: #3e80ca;
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        bottom: 0;
        z-index: 99;
        button{
            height: 100%;
            width: 100%;
            border: 0;
            outline: none;
            background: Transparent;
            font-size: 34px;
            letter-spacing: 0px;
            color: #ffffff;
        }
    }
    .disable {
        background: #dfdfdf;
    }
    .test{
        width:50px;
        border: 1px solid red;
        height: 20px;
    }
}
.lxa-poptip{
    padding-top: 60px;
    height: 264px;
    font-size: 24px;
    font-weight: normal;
    line-height: 60px;
    letter-spacing: 0px;
    color: #979797;
    text-align: left;
    padding-left: 46px;
    margin-bottom: 100px;
    .isInportent{
        color: #f00;
    }
}
</style>
