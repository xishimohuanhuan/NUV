<template>
    <div class="wrap">
        <Headers value='' @back="$goBack"></Headers>
        <div class="wrap-code">
            <img class="banner" src="../../assets/img/quicklogin/LOGO.png" alt="">
            <h1 
                class="code-title" 
                v-if="viewType!==6"
                v-text="viewType===5 ?
                    $t('logoNew.emaCodeSe') : 
                    (viewType==2 ?
                        $t('logoNew.emaCodeSe') : 
                        $t('logoNew.phonCodeSe'))"
            ></h1>
            <h1 
                class="code-title" 
                v-if="viewType===6"
            >{{$t('logoNew.imgCodeIde')}}</h1>
            <span 
                class="code-tip"
                v-if="viewType!==6"
                v-text="viewType===5 ?
                    $t('logoNew.plasLongCo1'):
                    (viewType==2 ?
                        $t('logoNew.plasLongCo1'):
                        $t('logoNew.plasLongCo2'))"
            ></span>
            <span 
                class="code-tip"
                v-if="viewType===6"
            >{{$t('logoNew.plasbttImC')}}</span>
            <!-- 短信验证码输入 -->
            <div v-if="viewType!==6">
                <BlockInput 
                    v-model="valphone" 
                    :valLength='4' 
                    :changeBlur='changeBlur'
                    ref='valphoneRef'
                    :focus='true'
                ></BlockInput>
                <div class="code-time" v-if="!isIfMess && timeSet>=0">
                    <span>{{$t('logoNew.verCoSen')}}(</span>
                    <span>{{timeSet+'s'}}</span>
                    <span>)</span>
                </div>
                <div 
                    class="code-time" 
                    v-else
                    @click="goQucilkHandle"
                >
                    <span>{{$t('logoNew.noeSenCodeCli')}}</span>
                    <span>{{$t('logoNew.replSendCo')}}</span>
                    <span></span>
                </div>
            </div>
            <!-- 图形验证码 -->
            <div 
                v-if="viewType===6"
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
                        :changeBlur='changeBlur'
                        :focus='true'
                        ref="imgCodeRef"
                    ></BlockInput>
                </div>
            </div>
            <!-- <div class="code-time" v-if="isIfMess && timeSet<=0">
                <span>没收到验证码?点击</span>
                <span @click="handleClickMess">{{isIfMess}}</span>
                <span></span>
            </div> -->
        </div>
        <slider :idValue='idValue' @moveEnd='moveEndHandle' ref="slider"></slider>
    </div>
</template>
<script>
import Headers from '../../component/header'
import BlockInput from '../../component/BlockInput'
import slider from '../../component/slider'
import {
        logoReauestSpeedy,
        getCodePhone,
        remmberPassEndAjax,
        sendMessagePicAjax,
        passwordLogoNew,
        sendVerifyCode
    } from './request.js'
export default {
    components:{
        Headers,
        BlockInput,
        slider
    },
    data(){
        return{
            valphone:'',
            // 倒计时
            timeSet:60,
            isIfMess:'',
            // 1 手机登录 2  邮箱登录  3 手机快捷登录
            // 4 手机忘记密码  5 邮箱忘记密码 6 图形验证码页面
            viewType:'', 
            // 是否失去焦点
            changeBlur:false,
            // 图形验证码图片
            imgSrc: new Date().getTime(),
            // 图形验证码数据
            imgCodeData:'',
            timergo:null,
            // 正在请求数据
            ingRequest:false,
            timers:null,
            idValue: ''
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            //判断是否登录
            if( vm.$getCookie('userId') && JSON.parse(decodeURIComponent(vm.$getCookie('userId'))).userId ){
                //登录就调到首页
                vm.$loginRoute('/home');
            }
            vm.$store.commit('changeNoMenu', false);
            vm.viewType=Number(vm.$route.params.type);
            if(vm.viewType!==6){
                vm.setTimetCode();
                return;
            }
        })
    },
    beforeRouteUpdate (to, from, next) {
        this.viewType=Number(to.params.type);
        this.dataInit();
        if(this.viewType!==6){
            this.setTimetCode();
        }else{
            this.imgSrc=new Date().getTime();
        }
        next();
    },
    destroyed() {
        // 取消请求
        if(this.$axiosPromiseArr){
            this.$axiosPromiseArr.forEach((ele, index) => {
                ele.cancel('001');
                delete this.$axiosPromiseArr[index];
            })
        }
        this.$store.commit('changeNoMenu', true);
        this.$store.commit('changeLoading', false);
        clearTimeout(this.timergo);
        clearInterval(this.timers);
    },
    watch:{
        // 短信验证码
        valphone(val){
            if(val.length>=4){
                this.middleSwi();
            }
        },
        // 图形验证码
        imgCodeData(val){
            if(val.length>=4){
                this.overCodeRespo();
            }
        }
    },
    methods:{
        // 清空
        dataInit(path){
            // 清除图形验证码
            this.imgCodeData='';
            this.$refs.imgCodeRef && this.$refs.imgCodeRef.setValHandle('');
            // 清除验证码
            this.valphone='';
            this.$refs.valphoneRef && this.$refs.valphoneRef.setValHandle('');
        },
        // 重新发送
        goQucilkHandle(){
            if(this.ingRequest){
                this.$normalToast(this.$t('logoNew.repusetIng'));
                return;
            }
            if(this.viewType===4 || this.viewType===3 || this.viewType===1){
                this.idValue = localStorage.getItem('longP');
            }
            if(this.viewType===5 || this.viewType===2){
                this.idValue = localStorage.getItem('longE');
            }
            this.$refs.slider.refresh(this.idValue);
        },
        moveEndHandle(res) {
            this.overCodeRespo(this.idValue, res);
        },
        // 重新倒计时获取验证码
        setTimetCode(){
            this.isIfMess='';
            this.timeSet=5;
            clearInterval(this.timers);
            this.timers=setInterval(()=>{
                if(this.timeSet<=0){
                    this.isIfMess=this.$t('logoNew.replSendCo');
                    clearInterval(this.timers);
                    return;
                }
                this.timeSet--;
            },1000);
        },
        middleSwi(){
            this.changeBlur=true;
            if(this.ingRequest){
                this.$normalToast(this.$t('logoNew.repusetIng'));
                return;
            }
            if(this.viewType===1){
                let data={
                    type:1,
                    msgCode:this.valphone,
                    password:JSON.parse(sessionStorage.getItem('logoNN')).PA,
                    mobile: JSON.parse(sessionStorage.getItem('logoNN')).PH,
                    token:this.$getCookie("tLost") || 0,
                }
                this.logoPhoneAjax(data);
                return;
            }
            if(this.viewType===2){
                let data={
                    type:2,
                    msgCode:this.valphone,
                    password:JSON.parse(sessionStorage.getItem('logoNN')).PA,
                    email: JSON.parse(sessionStorage.getItem('logoNN')).PE,
                    token:this.$getCookie("tLost") || 0,
                }
                this.logoPhoneAjax(data);
                return;
            }
            if(this.viewType===3){
                this.overRespose();
                return;
            }
            if(this.viewType===4){
                let data={
                    type:1,
                    msgCode:this.valphone,
                    mobile:sessionStorage.getItem('remPaPh')
                }
                this.remmberPasswordAjax(data);
                return;
            }
            if(this.viewType===5){
                let data={
                    type:2,
                    msgCode:this.valphone,
                    email:sessionStorage.getItem('remPaPh')
                }
                this.remmberPasswordAjax(data);
            }
        },
        // 输入完成就发送请求 快捷登录
        overRespose(){
            this.ingRequest=true;
            this.$store.commit('changeLoading', true);
            let data1=sessionStorage.getItem('tempoI').split(',');
            let params = {
                "mobile": data1[0],
                'msgCode': this.valphone,
                'moblepre': '+' + data1[2],
                'token':this.$getCookie("tLost") || 0,
                'plat': 1
            }
            logoReauestSpeedy(params).then(res=>{
                if(res.data.status===200){
                    // 登录过期存储
                    if(!this.$getCookie("tLost")){
                        this.$setCookie("tLost",res.data.data.date,15);
                    }
                    // 判断是否是经纪人 0不是
                    localStorage.setItem('isAgent',res.data.data.isAgent);
                    // 实名认证的名字
                    if(res.data.data.user.truename && res.data.data.user.idcardauth===1){
                        localStorage.setItem('isName',res.data.data.user.truename);
                    }else{
                        localStorage.removeItem('isName');
                    }
                    // 存userId和token
                    let obj1 = {
                        phone: data1[0],
                        userId: res.data.data.user.id,
                        token: res.data.data.user.token,
                        istradeSet: !!res.data.data.user.paypassword
                    }
                    sessionStorage.setItem('LoginQick', JSON.stringify(obj1));
                    // 获取sessionId
                    var token = obj1.token;
                    var userId = obj1.userId;
                    this.$axios({
                        baseURL: this.$interfacePhpUrl,
                        url: '/Ajax/getSession?userId=' + userId + '&token=' + token,
                        method: 'get',
                        withCredentials: false
                    }).then((data) =>{
                        this.ingRequest=false;
                        this.$store.commit('changeLoading', false);
                        if (data.data.code == 200) {
                            this.$normalToast(this.$t('logoNew.succCg'));
                            sessionStorage.setItem('sessionId', data.data.data);
                            this.$setCookie('userId', JSON.stringify(obj1), 1)  //登录成功
                            sessionStorage.removeItem('tempoI');
                            // 跳转指定页面
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
                            },2000);
                        } else {
                            this.$Toast({
                                message: this.$t('logoNew.failLome'),
                                duration: 3000
                            });
                            this.timergo=setTimeout(()=>{
                                window.history.go(-2);
                            },2000)
                        }
                    }).catch(err=>{
                        this.ingRequest=false;
                        this.$store.commit('changeLoading', false);
                        if(err.message==='001'){
                            return;
                        }
                        this.$normalToast(this.$t('logoNew.errCode'));
                    })
                }else{
                    this.valphone='';
                    this.$refs.valphoneRef && this.$refs.valphoneRef.setValHandle('');
                    this.changeBlur=false;
                    this.ingRequest=false;
                    this.$store.commit('changeLoading', false);
                    this.$normalToast(this.$t('logoNew.messCoED'));
                }
            }).catch(err=>{
                this.ingRequest=false;
                this.$store.commit('changeLoading', false);
                if(err.message==='001'){
                    return;
                }
                this.$normalToast(this.$t('logoNew.errCode'));
            })
        },
        // 图形验证码发送
        overCodeRespo(id, x){
            let type = this.$route.params.type;
            
            if(this.ingRequest){
                this.$normalToast(this.$t('logoNew.repusetIng'));
                return;
            }
            // 3 快捷登录，图形验证码
            if(type==='3'){
                this.getCodeAjax(id, x);
                return;
            }
            // 4 手机忘记密码，图形验证码
            if(type==='4'){
                this.getCodeAjaxRemm(id, x);
                return;
            }
            // 5 邮箱忘记密码，图形验证码
            if(type==='5'){
                this.emailCodeAjax(id,x);
                return;
            }
            //  登录过期输入图形验证码 手机
            if(JSON.parse(sessionStorage.getItem('logoNN')).PH && !JSON.parse(sessionStorage.getItem('logoNN')).PE){
                id=JSON.parse(sessionStorage.getItem('logoNN')).PH
                this.phoneMethodAjax(id, x);
            }
            // 邮箱
            if(!JSON.parse(sessionStorage.getItem('logoNN')).PH && JSON.parse(sessionStorage.getItem('logoNN')).PE){
                id=JSON.parse(sessionStorage.getItem('logoNN')).PE;
                this.emailSendVerifyCod(id,x);
            }
        },
        // 邮箱忘记密码
        emailCodeAjax(id,x){
            let data={
                id,
                type:2,
                email:localStorage.getItem('longE'),
                picCode:x
            }
            this.$store.commit('changeLoading', true);
            this.ingRequest=true;
            sendVerifyCode(data).then(res=>{
                this.ingRequest=false;
                this.$store.commit('changeLoading', false);
                if(res.data.status===200){
                    this.$normalToast(this.$t('logoNew.succCg'));
                    // this.$router.push('/PhoneCode/5');
                    sessionStorage.setItem('remPaPh',localStorage.getItem('longE'));
                    this.setTimetCode();
                }else{
                    this.changeBlur=false;
                    this.$normalToast(res.data.msg);
                    this.imgSrc=new Date().getTime();
                }
            }).catch(err=>{
                this.$store.commit('changeLoading', false);
                this.ingRequest=false;
                if(err.message==='001'){
                    return;
                }
                this.$normalToast(this.$t('logoNew.errCode'));
            })
        },
        // 手机忘记密码
        getCodeAjaxRemm(id, x){
            let data={
                id,
                mobile:localStorage.getItem('longP'),
                picCode:x,
                type:1
            }
            this.$store.commit('changeLoading', true);
            this.ingRequest=true;
            sendMessagePicAjax(data).then(res=>{
                this.$store.commit('changeLoading', false);
                this.ingRequest=false;
                this.changeBlur=false;
                this.imgCodeData='';
                this.$refs.imgCodeRef && this.$refs.imgCodeRef.setValHandle('');
                if(res.data.code==='001'){
                    this.$normalToast(this.$t('logoNew.accNoReg'));
                    window.history.go(-1);
                    return
                }
                if(res.data.code==='002'){
                    this.$normalToast(this.$t('logoNew.accnoSePass'),3000);
                    window.history.go(-1);
                    return;
                }
                if(res.data.code==='003'){
                    this.$normalToast(this.$t('logoNew.imgCodeErrOr'));
                    this.imgSrc=new Date().getTime();
                    return;
                }
                if(res.data.status===200){
                    this.$normalToast(this.$t('logoNew.succCg'));
                    // this.$router.push('/PhoneCode/4');
                    sessionStorage.setItem('remPaPh',localStorage.getItem('longP'));
                    this.setTimetCode();
                    return;
                }else{
                    this.$normalToast(res.data.msg);
                }
            }).catch(err=>{
                this.ingRequest=false;
                this.$store.commit('changeLoading', false);
                if(err.message==='001'){
                    return;
                }
                this.$normalToast(this.$t('logoNew.errCode'));
            })
        },
        // 快捷登录获取短信
        getCodeAjax(id, x){
            let params = {
                "mobile": localStorage.getItem('longP'),
                'picCode': x,
                'id': id,
                'moblepre': '+' + this.$store.state.countryItem.tel,
                'type':2,
                "time":+ new Date()
            }
            this.$store.commit('changeLoading', true);
            this.ingRequest=true;
            getCodePhone(params).then(res=>{
                this.$store.commit('changeLoading', false);
                this.ingRequest=false;
                this.changeBlur=false;
                this.imgCodeData='';
                this.$refs.imgCodeRef && this.$refs.imgCodeRef.setValHandle('');
                if(res.data.code==='002'){
                    this.$normalToast(this.$t('logoNew.useExiPlReg'),2500);
                    // window.history.go(-1);
                    return;
                }
                if(res.data.status===200){
                    this.$normalToast(this.$t('logoNew.sccHQ'));
                    // this.$router.push('/PhoneCode/3');
                    sessionStorage.setItem('tempoI',[localStorage.getItem('longP'),this.imgCodeData,this.$store.state.countryItem.tel]);
                    this.setTimetCode();
                }else{
                    this.imgSrc=new Date().getTime();
                    this.$normalToast(res.data.msg);
                }
            }).catch(err=>{
                this.$store.commit('changeLoading', false);
                this.ingRequest=false;
                if(err.message==='001'){
                    return;
                }
                this.$normalToast(this.$t('logoNew.errCode'));
            })
        },
        // 手机密码登录
        phoneMethodAjax(id, x){
            let data={
                id,
                mobile:JSON.parse(sessionStorage.getItem('logoNN')).PH,
                picCode: x,
                type:0
            }
            this.$store.commit('changeLoading', true);
            this.ingRequest=true;
            sendMessagePicAjax(data).then(res=>{
                this.ingRequest=false;
                this.$store.commit('changeLoading', false);
                if(res.data.status===200){
                    sessionStorage.setItem('ImgTTNN',this.imgCodeData);
                    this.$normalToast(this.$t('logoNew.sccHQ'));
                    // this.$router.push('/PhoneCode/1');
                    this.setTimetCode();
                    return;
                }
                this.changeBlur=false;
                this.imgCodeData='';
                this.$refs.imgCodeRef && this.$refs.imgCodeRef.setValHandle('');
                this.imgSrc=new Date().getTime();
                if(res.data,code ==='003'){
                    this.$normalToast(this.$t('logoNew.imgCodeErrOr'));
                }else{
                    this.$normalToast(res.data.msg);
                }
            }).catch(err=>{
                this.imgCodeData='';
                this.$refs.imgCodeRef && this.$refs.imgCodeRef.setValHandle('');
                this.$store.commit('changeLoading', false);
                this.ingRequest=false;
                if(err.message==='001'){
                    return;
                }
                this.$normalToast(this.$t('logoNew.errCode'));
            })
        },
        emailSendVerifyCod(id,x){
            let data={
                id,
                type:0,
                email:JSON.parse(sessionStorage.getItem('logoNN')).PE,
                picCode:x
            }
            this.$store.commit('changeLoading', true);
            this.ingRequest=true;
            sendVerifyCode(data).then(res=>{
                this.$store.commit('changeLoading', false);
                this.ingRequest=false;
                if(res.data.status===200){
                    this.$normalToast(this.$t('logoNew.sccHQ'));
                    // this.$router.push('/PhoneCode/2');
                    this.setTimetCode();
                }else{
                    this.changeBlur=false;
                    this.imgCodeData='';
                    this.$refs.imgCodeRef && this.$refs.imgCodeRef.setValHandle('');
                    this.$normalToast(res.data.msg);
                    this.imgSrc=new Date().getTime();
                }
            }).catch(err=>{
                this.$store.commit('changeLoading', false);
                this.ingRequest=false;
                this.changeBlur=false;
                if(err.message==='001'){
                    return;
                }
                this.$normalToast(this.$t('logoNew.errCode'));
                // window.history.go(-1);
            })
        },
        // 忘记密码，判断验证码
        remmberPasswordAjax(data){
            this.ingRequest=true;
            this.$store.commit('changeLoading', true);
            remmberPassEndAjax(data).then(res=>{
                this.ingRequest=false;
                this.$store.commit('changeLoading', false);
                if(res.data.status===200){
                    sessionStorage.setItem('remCodeNext',this.valphone);
                    this.$router.push('/ChangePassword/'+this.viewType);
                }else{
                    this.$normalToast(res.data.msg);
                    this.changeBlur=false;
                }
            }).catch(err=>{
                this.ingRequest=false;
                this.$store.commit('changeLoading', false);
                if(err.message==='001'){
                    return;
                }
                this.$normalToast(this.$t('logoNew.errCode'));
            })
        },
        // 登录密码
        logoPhoneAjax(data){
            this.ingRequest=true;
            this.$store.commit('changeLoading', true);
            passwordLogoNew(data).then(res=>{
                if (res.data.status == 200) {
                    // 登录过期存储
                    if(!this.$getCookie("tLost")){
                        this.$setCookie("tLost",res.data.data.date,15);
                    }
                    // 判断是否是经纪人0 不是
                    localStorage.setItem('isAgent',res.data.data.isAgent)
                    localStorage.removeItem('bkinfo');
                    // 实名认证的名字
                    if(res.data.data.user.truename && res.data.data.user.idcardauth===1){
                        localStorage.setItem('isName',res.data.data.user.truename);
                    }else{
                        localStorage.removeItem('isName');
                    }
                    let obj1;
                    if(this.viewType===1){
                        obj1 = {
                            phone: JSON.parse(sessionStorage.getItem('logoNN')).PH,
                            userId: res.data.data.user.id,
                            token: res.data.data.user.token,
                            istradeSet: !!res.data.data.user.paypassword
                        }
                    }else{
                        obj1 = {
                            phone: JSON.parse(sessionStorage.getItem('logoNN')).PE,
                            userId: res.data.data.user.id,
                            token: res.data.data.user.token,
                            istradeSet: !!res.data.data.user.paypassword
                        }
                    }
                    sessionStorage.setItem('LoginQick', JSON.stringify(obj1))
                    var token = obj1.token;
                    var userId = obj1.userId;
                    this.$axios({
                        baseURL: this.$interfacePhpUrl,
                        url: '/Ajax/getSession?userId=' + userId + '&token=' + token,
                        method: 'get',
                        withCredentials: false
                    }).then((data) =>{
                        this.$store.commit('changeLoading', false);
                        this.ingRequest=false;
                        if (data.data.code == 200) {
                            sessionStorage.setItem('sessionId', data.data.data);
                            this.$setCookie('userId', JSON.stringify(obj1), 1)  //登录成功
                            this.$normalToast(this.$t('logoNew.sccuLoMa'));
                            // 跳转指定页面
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
                            },2000);
                        } else {
                            this.$normalToast(this.$t('logoNew.failLome'));
                            window.history.go(-2);
                        }
                    }).catch(err=>{
                        this.$store.commit('changeLoading', false);
                        this.ingRequest=false;
                        if(err.message==='001'){
                            return;
                        }
                        this.$normalToast(this.$t('logoNew.errCode'));
                        window.history.go(-2);
                    })
                } else {
                    this.changeBlur=false;
                    this.valphone='';
                    this.$refs.valphoneRef && this.$refs.valphoneRef.setValHandle('');
                    this.$store.commit('changeLoading', false);
                    this.ingRequest=false;
                    this.$Toast({
                        message: res.data.msg,
                        duration: 3000
                    });
                }
            }).catch(err=>{
                this.$store.commit('changeLoading', false);
                this.ingRequest=false;
                if(err.message==='001'){
                    return;
                }
                this.$normalToast(this.$t('logoNew.errCode'));
            })
        }
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
            font-weight: bold;
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
