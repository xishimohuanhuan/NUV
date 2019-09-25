<template>
    <div class="wrap">
        <Headers value='' @back="$goBack"></Headers>
        <div class="wrap-code">
            <img class="banner" src="../../assets/img/quicklogin/LOGO.png" alt="">
            <div 
                class="code-title" 
                v-if="(viewType===0 || viewType === 1)"
            >{{typeArr[viewType]+$t('register.verifyCode')}}</div> <!-- 验证码 -->
            <div 
                class="code-title" 
                v-if="(viewType===2 || viewType === 3)"
            >{{$t('register.pic')+$t('register.verifyCode')}}</div> <!-- 图形验证码 -->
            <span 
                class="code-tip"
                v-if="(viewType===0 || viewType === 1)"
            >{{$t('register.placeVerifyCode').replace('XXX', typeArr[viewType])}}</span>  <!-- 请输入您XXX收到的4位数验证码 -->
            <span 
                class="code-tip"
                v-if="(viewType===2 || viewType === 3)"
            >{{$t('register.placePic')}}</span>
            <!-- 短信验证码输入 -->
            <div v-if="(viewType===0 || viewType === 1)">
                <BlockInput 
                    v-model="valphone" 
                    :valLength='4' 
                    type='tel'
                    :changeBlur='changeBlur'
					@inputEnd="inputEndHandle"
                    ref="valphone"
                    :focus='true'
                ></BlockInput>
                <div class="code-time" v-if="!isIfMess && timeSet>=0">
                    <span>{{$t('register.picSended')}}(</span>
                    <span>{{timeSet+'s'}}</span>
                    <span>)</span>
                </div>
                <div class="code-time" v-else>
                    <span>{{$t('register.codeNotSend')}}</span> <!-- 没收到验证码?点击 -->
                    <span @click="handleClickMess">{{isIfMess}}</span>
                    <span></span>
                </div>
            </div>
            <!-- 图形验证码 -->
            <div 
                v-if="(viewType===2 || viewType === 3)"
                class="wrap-img"
            >
                <img 
                    class="testImg" 
                    @click="imgSrc=new Date().getTime()"
                    :src='$interfaceJavaUrl+"/user/login/getCode?t="+imgSrc' 
                    alt=""
                >
                <div>
                    <BlockInput 
                        v-model="imgCodeData" 
                        :valLength='4' 
                        type='tel'
                        :changeBlur='changeBlur'
                        @inputEnd="inputEndHandle"
                        ref="imgCodeData"
                        :focus='true'
                    ></BlockInput>
                </div>
            </div>            
        </div>
    </div>
</template>
<script>
import Headers from '../../component/header'
import BlockInput from '../../component/BlockInput'
import {
        getCodePhone,
        sendEmailPic,
        logoReauestSpeedy,
        sendMessagePicAjax,
        registerByPhone,
        emailRegister
    } from './request.js'
export default {
    components:{
        Headers,
        BlockInput,
    },
    data(){
        return{
            valphone:'',
            // 倒计时
            timeSet:60,
            // 重新发送验证码
            isIfMess:'',
            // 1 手机登录 2  邮箱登录  3 手机快捷登录
            // 4 手机忘记密码  5 手机忘记密码 6 图形验证码页面
            viewType:'', 
            // 是否失去焦点
            changeBlur:false,
            // 图形验证码图片
            imgSrc: new Date().getTime(),
            // 图形验证码数据
            imgCodeData:'',
            // 0 => 手机  1 => 邮箱
            way: '',
            timergo:null,
            timers:null     
        }
    },
    computed: {
        countryItem() {
            return this.$store.state.countryItem;
        },
        loading() {
            return this.$store.state.loading;
        },
    },
    created(){
        this.typeArr = [this.$t('register.phone'), this.$t('register.email')];
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.$store.commit('changeNoMenu', false);
            vm.viewType=Number(vm.$route.params.type);
            vm.way = Number(to.query.way);
        })
    },
    beforeRouteUpdate (to, from, next) {
        this.dataInit(to);
        if((this.viewType===0) || (this.viewType===1)){
            this.setTimetCode();
        }
        next();
    },

    destroyed() {
        this.$store.commit('changeNoMenu', true);
        this.$store.commit('changeLoading', false);
        clearTimeout(this.timergo);
        clearInterval(this.timers);
        // 取消请求
        if(this.$axiosPromiseArr){
            this.$axiosPromiseArr.forEach((ele, index) => {
                ele.cancel('001');
                delete this.$axiosPromiseArr[index];
            })
        }
    },
    methods:{
        // 重新倒计时获取验证码
        setTimetCode(){
            this.isIfMess='';
            this.timeSet=60;
            this.timers=setInterval(()=>{
                if(this.timeSet<=0){
                    this.isIfMess=this.$t('register.resend');
                    clearInterval(this.timers);
                    return;
                }
                this.timeSet--;
            },1000);
        },
        async inputEndHandle(v) {
            if(this.loading) return;
            if(this.timergo) return;
            this.$store.commit('changeLoading', true);
            let res;
            let params;
            let temp = sessionStorage.getItem('tempInfo') && JSON.parse(sessionStorage.getItem('tempInfo'));
            let { email, mobile, invit } = temp;
            try {
                switch(this.viewType) {
                    case 0:
                        params = this.getMobileParams(mobile,invit);
                        res = await registerByPhone(params);
                        this.loginHnalde(res);
                        break;
                    case 1:
                        params = this.getEmailParams(email,invit);
                        res = await emailRegister(params);
                        this.loginHnalde(res);
                        break;
                    case 2:
                        params = this.getPicMobileParams(mobile);
                        res = await sendMessagePicAjax(params);
                        this.sendCodeHandle(res);
                        break;
                    case 3:
                        params = this.getPicEmailParams(email);
                        res = await sendEmailPic(params);
                        this.sendCodeHandle(res);
                        break;
                    default:
                        this.$store.commit('changeLoading', false);
                        break;
                }
            } catch(err) {
                this.$store.commit('changeLoading', false);
                if(err.message==='001'){
                    return;
                }
				this.$normalToast(this.$t('register.networkError'),2000);
            }
            // this.loginHnalde(res);
        },
        handleClickMess() {
            this.$router.replace(`/registCode/${this.viewType+2}?way=${this.viewType}`);
            // this.$router.go(-1);
        },
        sendCodeHandle(res) {
            this.$store.commit('changeLoading', false);
            if(res.data.status === 200) {
                this.$router.replace('/registCode/'+this.way);
                return ;
            }
            if(res.data.status === 500 || res.data.status === 400) {
                this.$normalToast(res.data.msg);
                this.dataInit(this.$route);
                return;
            }
            if(res.data.msg) {
                this.$normalToast(res.data.msg);
                this.timergo=setTimeout(()=>{
                    window.history.go(-1);
                },2000)
            }
        },
        loginHnalde(res) {
            this.$store.commit('changeLoading', false);
            if(res.data.status === 200) {
                this.storeData(res);
                return ;
            }
            switch(res.data.code) {
                case '001':
                    this.$normalToast(res.data.msg);
                    this.dataInit(this.$route);
                    break;
                // case '002':
                //     this.$normalToast(res.data.msg);
                //     this.dataInit(this.$route);
                //     break;
                default: 
                    this.$normalToast(res.data.msg);
                    this.timergo=setTimeout(()=>{
                        window.history.go(-1);
                    },2000)
            }
        },
        storeData(res) {
            // 邮箱注册
            if(this.viewType === 1) {
                this.$router.push('/setting/setLoginPass/'+this.valphone);
                return ;
            }
            // 登录过期存储
            if(!this.$getCookie("tLost")){
                this.$setCookie("tLost",res.data.data.date,15);
            }
            // 存userId和token
            let obj = {
                phone: res.data.data.user.moble,
                userId: res.data.data.user.id,
                token: res.data.data.user.token,
            }
            localStorage.setItem('isAgent',res.data.data.isAgent);
            sessionStorage.setItem('LoginQick', JSON.stringify(obj));
            this.$setCookie('userId', JSON.stringify(obj), 1);  //注册成功
            this.$normalToast(this.$t('register.registSuccess')); // 注册成功
            localStorage.removeItem('bkinfo');
            localStorage.setItem('longP',obj.phone);
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
            // /ChangePassword/7
            sessionStorage.setItem('specialTreatment', 'home');
            this.$router.push('/setting/setLoginPass/'+this.valphone);
        },
        dataInit(path) {
            // 短信/邮箱验证码图片
            this.valphone = '';
            this.$refs.valphone && this.$refs.valphone.setValHandle('');
            // 图形验证码图片
            this.imgCodeData = '';
            this.$refs.imgCodeData && this.$refs.imgCodeData.setValHandle('');
            // 0 => 手机  1 => 邮箱
            this.viewType=Number(path.params.type);
            this.imgSrc = new Date().getTime();
            
        },
        getEmailParams(email,invit) {
            let bkinfo = localStorage.getItem('bkinfo') && JSON.parse(localStorage.getItem('bkinfo')).bkinfo;
            let params = {
                email,
                isAgent: '0',
                emailCode: this.valphone,
                type: 2,
            }
            if (invit || bkinfo){
                params.invit = invit || bkinfo;
            }
            if(bkinfo) {
                params.isAgent = '1';
            }
            return params;
        },
        getMobileParams(mobile,invit) {
            let bkinfo = localStorage.getItem('bkinfo') && JSON.parse(localStorage.getItem('bkinfo')).bkinfo;
            let params = {
                mobile,
                plat: 1,
                type: 1,
                isAgent: '0',
                msgCode: this.valphone,
                moblepre: '+' + this.countryItem.tel,
            }
            if (invit || bkinfo){
                params.invit = invit || bkinfo;
            }
            if((!invit)&&bkinfo) {
                params.isAgent = '1';
            }
            return params;
        },
        getPicEmailParams(email) {
            return {
                email,
                picCode: this.imgCodeData,
                type: 1,
            }
        },
        getPicMobileParams(mobile) {
            return {
                mobile,
                picCode: this.imgCodeData,
                type: 2,
            }
        },
        // 图形验证码发送
        overCodeRespo(){
            this.$router.push('/PhoneCode/5');
        },
        // 登录成功 密码登录
    }
}
</script>
<style lang='scss' scoped>
.wrap{
    background-color: white;
    flex: 1;
    .banner {
        width: 174px;
        height: 174px;
        margin: 62px auto 89px auto;
    }
    .wrap-code{
        margin: 0 77px;
        .code-title{
            font-size: 45px;
            color: #202025;
            font-weight: 600;
            text-align: left;
            border-bottom: 1PX solid #dcdcdc;
            padding-bottom: 24px;
        }
        .code-tip{
            color: #929292;
            display:block;
            text-align: left;
            margin-top: 25px;
            margin-bottom: 55px;
        }
        .code-time{
            margin-top: 50px;
            color: #a2a2a2;
            font-size: 28px;
            span:nth-child(2){
                color: #3e80ca;
            }
        }
        .wrap-img{
            display: flex;
            align-items: center;
            .testImg {
                width: 200px;
                height: 80px;
                display: inline-block;
                margin-right: 5px;
            }
            div{
                flex: 1;
            }
        }
    }
}
</style>
