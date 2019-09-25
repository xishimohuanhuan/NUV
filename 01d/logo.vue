<template>
    <div id="phoneLogin">
        <!-- 用户注册 -->
        <headers  value="用户注册" @back="$goBack" @vlueClick="goRegister"></headers>

        <div class="scoller">
            <img class="banner" src="../../assets/img/quicklogin/LOGO.png" alt="">

            <!-- 手机邮箱切换 -->
            <div class="twoBtnEx">
                <span 
                    :class="isChanged===1 ? 'addBlod' : ''" 
                    @click="isChangedClick(1)"
                >手机登录</span>
                <span
                    :class="isChanged===2 ? 'addBlod' : ''"
                    @click="isChangedClick(2)"
                    v-if="!isOnlyCode"
                >邮箱登录</span>
            </div>

            <!-- 登录输入 -->
            <div class="wrap-inputEP">
                <!-- 手机号 -->
                <div class="inputPhone" v-if="isChanged===1">
                    <div class="input-main">
                        <div 
                            class="left"  
                            @click="goSerch"
                        >
                            <span>+{{countryItem.tel}}</span>
                            <span></span>
                        </div>
                        <input 
                            type="tel" 
                            placeholder="请输入您的手机账号"
                            v-model="phoneDataNumber"
                        />
                        <div class="flag-1">
                            <div :class="'iti-flag '+countryItem.short.toLowerCase()"></div>
                        </div>
                    </div>
                    <div class="line"></div>
                </div>
                <!-- 邮箱账号 -->
                <div 
                    class="PassWord-input email-inp" 
                    v-if="isChanged===2"
                >
                    <div class="pass-Goto">
                        <img src="../../assets/img/quicklogin/emil.png" alt="" />
                        <input 
                            type="email" 
                            placeholder="请输入您的邮箱账号" 
                            v-model="emailDataNumber"
                        />
                    </div>
                    <div class="line"></div>
                </div>
                <!-- 图形验证码 -->
                <!-- <div class="wrap-imgCode">
                    <div class="imgCode">
                        <img src="../../assets/img/quicklogin/num.png" alt=""/>
                        <input 
                            placeholder="请您输入图形验证码"
                            v-model="ImgCodeData"
                        />
                        <img 
                            class="testImg" 
                            @click="imgSrc=new Date().getTime()"
                            :src='$interfaceJavaUrl+"/user/login/getCode?t="+imgSrc' 
                            alt=""
                        >
                    </div>
                    <div class="line"></div>
                </div> -->
                <!-- 登录密码 -->
                <div class="PassWord-input" v-if="!isOnlyCode">
                    <div class="pass-Goto">
                        <img src="../../assets/img/quicklogin/lock.png" alt="" />
                        <input 
                            type="password" 
                            placeholder="请输入登录密码"
                            v-model="passDataNum"
                        />
                    </div>
                    <div class="line"></div>
                </div>
                <!-- 登录 -->
                <div 
                    class="btn-login"
                    @click="gotoNext"
                >登录</div>
                <!-- 其他 -->
                <div class="gotoOther">
                    <span 
                        v-text="isChanged===1 ? '验证码登录':''"
                        @click="gotoCode()"
                    ></span>
                    <span @click="gotoRemeber">忘记密码?</span>
                </div>
            </div>



            <div class="contentOther" v-if="false">
                <div class="flexFather">
                    <div class="row">
                        <div class="flex">
                            <div class="selectPhone Ft " style="width: 17%">
                                <span class="selectTitle" @click="goSerch">
                                    <span class="text">+{{countryItem.tel}}</span>
                                    <span class="triangle-up"></span>
                                </span>
                            </div>
                            <div class="Ft w80">
                                <input class="input" v-model="phoneNumber" type="tel"
                                    placeholder="请输入您的手机账号">
                            </div>
                            <!--<span class="country"></span>-->
                            <div class="Ft w10">
                                <div class="flag-box">
                                    <div :class="'iti-flag ' + countryItem.short.toLowerCase()"></div>
                                </div>
                            </div>
                        </div>
                        <div class="line"></div>
                    </div>
                    <div class="row middel positionR" style="margin-top:10px">
                        <div class="flex">
                            <div class="selectPhone " style="width: 15%">
                                <img class="num" src="../../assets/img/quicklogin/num.png" alt="">
                            </div>
                            <div class="w80">
                                <input class="input top14" v-model="testText" placeholder="请输入图形码">
                            </div>
                            <img class="testImg" @click="imgSrc=new Date().getTime()"
                                :src='$interfaceJavaUrl+"/user/login/getCode?t="+imgSrc' alt="">
                            <!--<img class="testImg" src='http://172.16.0.188:8002/user/login/getCode' alt="">-->
                        </div>
                        <div class="line positionLine" style="bottom: 12px"></div>
                    </div>
                    <div class="row middel " style="margin: 0;position: relative;top: -20px">
                        <div class="flex">
                            <span class="selectPhone line120 Ft " style="width: 14%">
                            <img class="phone" src="../../assets/img/quicklogin/phone.png" alt="">
                            </span>
                            <div class="Ft line120">

                                <input class="input" v-model="phoneReg" maxlength="4" type='number' placeholder="请输入验证码" @input="handleVerify">
                            </div>
                            <div class="Ft heiyan">
                                <a href="javascript:void(0)" class="testImgText r4em" @click="sendMessage">
                                <span>{{timesTex}}</span>
                                    <!--<span v-if="isTime">发送验证码</span>-->
                                    <!--<span v-else>{{times}}</span>-->

                                </a>
                            </div>

                        </div>
                        <div class="line topNone"></div>
                    </div>
                    <p class="bText">
                        <!--<radiou v-model="isRadiou" style="margin-right: 5px"></radiou>-->
                        <span style="vertical-align: super">
                    手机快捷{{titleList[titleType]}}及同意
                    <span class="testImgText" @click="$router.push('./protocol')">《QSQ用户协议》</span>
                    </span>
                    </p>
                    <button class="btnLogin" @click="login"> {{isLoginLoding ? titleLoadList[titleType] : titleList[titleType]}}</button>
                    <!-- <button class="btnLogin loginLoading" >登 录 中</button> -->
                    <!-- <p style="text-align: center;color: #9d9d9d;margin-top: 46px;"> 未注册|手机号验证后自动创建账号</p> -->
                </div>
            </div>
        </div>
        <toast :isShow="isShow" v-model="isShow" :showToastType="'normal'" :toastContent="text"/>
    </div>
</template>

<script>
    import headers from '../../component/header'
    // import radiou from '../../component/radiou'
    import {
        getCodePhone,
        passwordLogoNew
    } from './request.js'
    export default {
        name: "index",
        components: {
            headers,
        },
        data() {

            return {
                imgSrc: new Date().getTime(),
                phoneNumber: '',
                testText: '',
                phoneReg: '',
                isShow: false,
                // isRadiou: false,
                text: '',
                isTime: true,
                fullPath: "",
                timesTex: "发送验证码",
                // 登录页面的登录按钮的loading效果
                isLoginLoding: false,
                titleList: ['登录', '注册'],
                titleLoadList: ['登 录 中', '注 册 中'],
                titleType: 0,

                // 选中的是 1 手机 2 邮箱 
                isChanged:1,
                isOnlyCode:false,
                // 手机号
                phoneDataNumber:'',
                // 邮箱
                emailDataNumber:'',
                // 密码
                passDataNum:'',
                // 防抖
                ingRequest:false
            }
        },
        computed: {
            countryItem() {
                return this.$store.state.countryItem
            }
        },
        beforeRouteEnter(to, from, next) {
            // console.log(obj,'obj')
            // if(obj.bkinfo){
            //     localStorage
            // }
            var p = document.referrer
            next(vm => {
                if(to.name === 'loginRegister') {
                    vm.titleType = 1;
                }
                let query = vm.getLocationSearch();
                if(query.bkinfo) {
                    let bkinfo = JSON.stringify(query);
                    sessionStorage.setItem('specialTreatment', 'home');
                    localStorage.setItem('bkinfo', bkinfo);
                } else {
                    let bkinfo = localStorage.getItem('bkinfo') && JSON.parse(localStorage.getItem('bkinfo'));
                    if(bkinfo) {
                        let path = location.pathname;
                        vm.$router.replace({path,query:{bkinfo: bkinfo.bkinfo}});
                    }
                }
                //判断是否登录
                if( vm.$getCookie('userId') && JSON.parse(decodeURIComponent(vm.$getCookie('userId'))).userId ){
                    //登录就调到首页
                    vm.$loginRoute('./home');
                }
                vm.fullPath = p;
                vm.$store.commit('changeNoMenu', false);
            })
        },
        beforeRouteLeave(to, from, next) {
            // ...
            this.$store.commit('changeNoMenu', true);
            next();
        },

        methods: {

            testPhoneReg(value) {
                let reg = /^[0-9]{6,16}$/;
                if (reg.test(value)) {
                    return true
                } else {
                    return false
                }
            },
            getLocationSearch() {
                let href = location.search.slice(1);
                let arr = href.split('&');
                let obj = {}
                for(let i=0;i<arr.length;i++) {
                    let item = arr[i].split('=');
                    obj[item[0]] = item[1]
                }
                return obj;
            },
            handleVerify() {
                let that = this;
                that.phoneReg = that.phoneReg.slice(0,4);
            },
            sendMessage() { //获取手机验证码
                if (typeof (this.timesTex) == 'number') {
                    return
                }
                if (!this.phoneNumber) {
                    this.isShow = true
                    setTimeout(function () {
                    },)
                    this.text = '请输入手机号'
                    return
                }
                if (!this.testText) {
                    this.isShow = true
                    setTimeout(function () {
                    },)
                    this.text = '请输入图形验证码'
                    return
                }
                this.timesTex = 60;
                var time = setInterval(function () {
                    if (typeof (this.timesTex) == 'number') {
                        this.timesTex--;
                        if (this.timesTex == 0) {
                            this.timesTex = '重新获取'
                            clearInterval(time)
                        }
                    }else{
                        clearInterval(time)
                    }

                }.bind(this), 1000)
                let params = {
                    "mobile": this.phoneNumber,
                    'picCode': this.testText,
                    'moblepre': '+' + this.countryItem.tel
                }
                let dateTime = + new Date();
                this.$axios({
                    url: `user/login/sendMessage?time=${dateTime}`, data: params, method: 'post'
                }).then(res => {
                    if (res.data.status == 200) {
                        // this.phoneReg = res.data.data
                    } else {
                        this.timesTex = '重新获取'
                        this.imgSrc = new Date().getTime()
                        this.$Toast({
                            message: res.data.msg,
                            duration: 3000
                        });
                    }
                })
            },
            getSession(id, token) {
                let that = this;
                return that.$axios({
                    baseURL: that.$interfacePhpUrl,
                    url: '/Ajax/getSession?userId=' + id + '&token=' + token,
                    method: 'get',
                    withCredentials: false
                })
            },
            login() {
                if (this.phoneNumber) {
                    if (!this.testPhoneReg(this.phoneNumber)) {
                        this.isShow = true
                        this.text = '请输入正确的手机号码'
                        return
                    } else {
                        if (!this.testText) {
                            this.isShow = true
                            this.text = '请输入图形验证码'
                            return
                        } else if (!this.phoneReg) {
                            this.isShow = true
                            this.text = '请输入手机验证码'
                            return
                        } else {
                            this.isShow = false
                        }
                    }
                } else {
                    this.isShow = true
                    this.text = '请输入手机号码'
                    return
                }
                // if (!this.isRadiou) {
                //     this.isShow = true
                //     this.text = '请阅读用户协议'
                // }
                if (this.isShow) {
                    return
                }
                let params = {
                    "mobile": this.phoneNumber,
                    'msgCode': this.phoneReg,
                    'moblepre': '+' + this.countryItem.tel,
                    'plat': 1
                }
                let invit = location.search.split('=')[1] || '';
                if (invit)
                    params['invit'] = invit;
                console.log(invit,'invit')
                //判断是否还在登录中，不向下执行
                if(this.isLoginLoding) return;
                //改为登录中
                this.isLoginLoding = true;
                this.$axios({
                    url: "/user/login/loginByPhone", data: params, method: 'post'
                }).then(res => {
                    if (res.data.status == 200) {
                        // 判断是否是经纪人0 不是
                        localStorage.setItem('isAgent',res.data.data.isAgent)
                        localStorage.removeItem('bkinfo');
                        // 实名认证的名字
                        if(res.data.data.user.truename && res.data.data.user.idcardauth===1){
                            localStorage.setItem('isName',res.data.data.user.truename);
                        }else{
                            localStorage.removeItem('isName');
                        }
                        // if (typeof (res.data.data.data) == 'object') {//判断新用户
                        // console.log(res)
                        if (!!res.data.data.data) {//判断新用户
                            let obj = {
                                userId: res.data.data.data.userId,
                                // token: res.data.data.data.token,
                                phone: this.phoneNumber
                            };
                            res.data.data.setPayPwd != 1 && (obj[token] = res.data.data.data.token);
                            sessionStorage.setItem('LoginQick', JSON.stringify(obj));
                            
                            sessionStorage.setItem('userId', res.data.data.data.userId)
                            // this.$setCookie('userId', JSON.stringify(obj), 1)
                            // this.getSession();
                            if (this.$route.query.urlrote) {//如果是老项目跳转登录
                                var href = this.fullPath + '&userName=' + username
                                sessionStorage.setItem('hreffullPath', href)
                                setTimeout(function () {
                                    this.$router.push({
                                        path: '/setPassWord',
                                        query: {urlrote: this.$route.query.urlrote, phone: this.phoneNumber}
                                    })
                                }.bind(this), 100)
                            } else {
                                this.$router.push({path: '/setPassWord', query: {phone: this.phoneNumber}})
                            }

                        } else {
                            let obj1 = {
                                phone: this.phoneNumber,
                                userId: res.data.data.user.id,
                                token: res.data.data.user.token,
                                istradeSet: !!res.data.data.payPassword
                            }
                            let username = res.data.data.user.username;
                            // res.data.data.setPayPwd != 1 && (obj1[token] = res.data.data.user.token);
                            sessionStorage.setItem('LoginQick', JSON.stringify(obj1))
                            var token = obj1.token;
                            var userId = obj1.userId;
                            this.getSession(userId, token).then((data) =>{
                                if (data.data.code == 200) {
                                    sessionStorage.setItem('sessionId', data.data.data);
                                    this.$setCookie('userId', JSON.stringify(obj1), 1)  //登录成功
                                    if (this.$route.query.urlrote) {
                                        var href = this.fullPath + '&token=' + token + '&userName=' + username + "&userId=" + userId;
                                        sessionStorage.setItem('hreffullPath', href)
                                        setTimeout(function () {
                                            window.location.replace(href)
                                        }.bind(this), 100)

                                    } else {
                                        var rout = sessionStorage.getItem('nextRoute')
                                        if (rout) {
                                            if(rout.includes('Login')) {
                                                this.$router.push('./home')
                                            } else{
                                                this.$router.push(rout)
                                            }
                                        } else {
                                            this.$router.push('./home')
                                        }
                                    }
                                } else {
                                    this.isLoginLoding = false;
                                    this.$Toast({
                                        message: this.titleList[this.titleType]+"失败",
                                        duration: 3000
                                    });
                                }
                            });
                        }
                    } else {
                        this.isLoginLoding = false;
                        this.$Toast({
                            message: res.data.msg,
                            duration: 3000
                        });
                    }

                }).catch(err =>{
                    //错误处理
                    console.log(err,'err')
                    this.isLoginLoding = false;
                    this.$Toast({
                        message: this.titleList[this.titleType]+"失败",
                        duration: 3000
                    });
                })
            },
            goEmil() {
                // this.$router.push('./QuickLogin')
                this.$Toast({
                    message: '手机版暂不支持邮箱登录',
                    duration: 3000
                });
            },
            goSerch() {
                this.$router.push('./search')
            },
            // 去注册
            goRegister(){
                // /loginRegister
                this.$router.push('./loginRegister');
            },
            isChangedClick(type){
                this.isChanged=type;
            },
            gotoNext(){
                if(this.ingRequest){
                    this.$normalToast('正在请求...');
                    return;
                }
                if(this.isChanged===1){
                    if(!this.phoneDataNumber || !this.testPhoneReg(this.phoneDataNumber)){
                        this.$normalToast('请输入有效的手机号');
                        return;
                    }
                    if(!this.passDataNum){
                        this.$normalToast('请输入登录密码');
                        return;
                    }
                    // mobile：手机号
                    // password：密码
                    // type： 1通过手机号登陆 2通过邮箱登陆1通过手机号登陆 2通过邮箱登陆
                    let data={
                        mobile:this.phoneDataNumber,
                        password:this.passDataNum,
                        type:1
                    }
                    this.AjaxLogoPhone(data);
                    return;
                }
                if(this.isChanged===2){
                    if(!this.emailDataNumber){
                        this.$normalToast('请输入登录邮箱');
                        return;
                    }
                    if(!this.passDataNum){
                        this.$normalToast('请输入登录密码');
                        return;
                    }
                    let data={
                        email:this.emailDataNumber,
                        password:this.passDataNum,
                        type:'2'
                    }
                    this.AjaxLogoPhone(data);
                    return;
                }
            },
            // 登录
            AjaxLogoPhone(data){
                this.ingRequest=true;
                passwordLogoNew(data).then(res=>{
                    if (res.data.status == 200) {
                        // 判断是否是经纪人0 不是
                        localStorage.setItem('isAgent',res.data.data.isAgent)
                        localStorage.removeItem('bkinfo');
                        // 实名认证的名字
                        if(res.data.data.user.truename && res.data.data.user.idcardauth===1){
                            localStorage.setItem('isName',res.data.data.user.truename);
                        }else{
                            localStorage.removeItem('isName');
                        }
                        let obj1 = {
                            phone: this.phoneNumber,
                            userId: res.data.data.user.id,
                            token: res.data.data.user.token,
                            istradeSet: !!res.data.data.payPassword
                        }
                        let username = res.data.data.user.username;
                        sessionStorage.setItem('LoginQick', JSON.stringify(obj1))
                        var token = obj1.token;
                        var userId = obj1.userId;
                        this.getSession(userId, token).then((data) =>{
                            this.ingRequest=false;
                            if (data.data.code == 200) {
                                sessionStorage.setItem('sessionId', data.data.data);
                                this.$setCookie('userId', JSON.stringify(obj1), 1)  //登录成功
                                this.$normalToast('登录成功');
                                this.$router.push('/home');
                            } else {
                                this.$normalToast('登录失败');
                            }
                        }).catch(err=>{
                            this.ingRequest=false;
                            this.$normalToast('网络问题,请稍后再试');
                        })
                        return;
                    } 
                    this.ingRequest=false;
                    if (res.data.code === '001'){
                        // 跳转到图形验证码
                        // this.$Toast({
                        //     message: res.data.msg,
                        //     duration: 3000
                        // });
                        if(this.isChanged===1){
                            sessionStorage.setItem('logoNN',JSON.stringify({
                                PH:this.phoneDataNumber,
                                PA:this.passDataNum,
                                PE:false
                            }));
                            this.$router.push('/PhoneCode/6');
                        }
                        if(this.isChanged===2){
                            sessionStorage.setItem('logoNN',JSON.stringify({
                                PH:false,
                                PA:this.passDataNum,
                                PE:this.emailDataNumber
                            }));
                            this.$router.push('/PhoneCode/6');
                        }
                    }
                    if (res.data.code === '002'){
                        this.$normalToast('密码未设置');
                    }
                    if (res.data.code === '003'){
                        this.$normalToast('密码错误');
                    }
                    if(res.data.status == 500){
                        this.$normalToast('用户不存在，请先注册');
                    }
                }).catch(err=>{
                    this.ingRequest=false;
                    this.$normalToast('网络问题,请稍后再试');
                })
            },
            gotoCode(){
                this.$router.push('./PhoneQucik/3');
            },
            // 忘记密码
            gotoRemeber(){
                if(this.isChanged===1){
                    this.$router.push('./PhoneQucik/4');
                }
                if(this.isChanged===2){
                    this.$router.push('./PhoneQucik/5');
                }
            }
        },

    }
</script>

<style lang="scss">

    $vm_base: 750;
    @function vw($px) {
        @return ($px / 750) * 100vw;
    }

    @import "../../component/IntlTelInput/intl.css";
    .mint-toast {
        background-color: rgba(67, 67, 67, 0.6) !important;
    }

    .iti-flag {
        float: right;
        margin: 1px 22px 0 0
    }

    .mint-toast-text {
        font-size: 26px !important;
        line-height: 60px !important;
        /*font-size: vw(26) !important;*/
        /*line-height: vw(60) !important;*/

    }

    #phoneLogin {
        background: #fff;
        height: 100%;
        .r4em {
            width: 135px !important;
            display: block;
        }


        input {
            font-size: 26px
        }

        span.selectPhone.two {
            width: 90px !important;
            /*width: vw(270) !important;*/

        }

        .flag-box {
            transform: scale(1.5);
        }

        .scoller {
            overflow: auto;
            height: calc(100% - 90px);
            background: #fff;
        }

        .triangle-up {
            width: 0;
            height: 0;
            border-left: 9px solid transparent;
            border-right: 9px solid transparent;
            /*border-left: vw(9) solid transparent;*/
            /*border-right: vw(9) solid transparent;*/
            border-top: 14px solid #3e80ca;
            /*border-top: vw(14) solid #3e80ca;*/
        }

        .top14 {
            margin-top: 30px;
            width: 240px;
            padding-right: 5px
            /*margin-top: vw(30);*/
            /*width: vw(240);*/
            /*padding-right: vw(5)*/

        }

        .positionR {
            position: relative;
            height: 120px;
            /*height: vw(120);*/

            .positionLine {
                position: absolute;
                bottom: 0;
            }
        }

        .user {
            /*width: vw(31);*/
            /*width: vw(31);*/
            height: 31px;
            height: 31px;
        }

        // .line {
        //     width: 100%;
        //     height: 8px;
        //     /*height: vw(8);*/
        //     border: solid 1px #b5b5b5;
        //     border-top: none;
        //     margin-top: 10px;
        //     /*margin-top: vw(25);*/
        // }

        .content, .contentOther {
            padding: 0 85px;
            /*padding: 0 vw(85);*/
            .Ft {
                float: left;
            }

            .w80 {
                width: 90%;
                margin-top: 1%;
            }

            .w10 {
                width: 15%;
            }

            .flexFather {
                font-size: 24px;
                /*font-size: vw(24);*/

                .btnLogin {
                    height: 89px;
                    /*height: vw(89);*/
                    width: 100%;
                    background-color: #3e80ca;
                    border-radius: 10px;
                    /*border-radius: vw(10);*/
                    border: none;
                    outline: none;
                    color: #fff;
                    font-size: 34px;
                    /*font-size: vw(34);*/
                }
                .loginLoading{
                    background-color: #3e80ca;
                }
                .grayText {
                    color: #9d9d9d
                }

                .line120 {
                    // line-height: 120px !important;
                    height: 80px;
                    line-height: 100px;
                }

                .testImgText {
                    font-family: MicrosoftYaHei;
                    font-size: 26px;
                    /*font-size: vw(26);*/
                    font-weight: normal;
                    font-stretch: normal;
                    line-height: 100px;
                    /*line-height: vw(120);*/
                    color: #3e80ca;
                    width: 550px;
                    /*width: vw(550);*/

                }

                .middel {
                    margin: 30px 0;
                    /*margin: vw(20) 0;*/
                    .topNone {
                        margin-top: 10px;
                    }

                    .selectPhone {
                        width: 10%;
                        display: block !important;
                        height: 100%;
                        line-height: 92px;
                        /*line-height: vw(92);*/
                    }


                    .two {
                        height: 100% !important;

                        .phone {
                            vertical-align: -webkit-baseline-middle;
                        }

                        .phone.lock {
                            width: 28px;
                            /*width: vw(28);*/
                            height: 36px;
                            /*height: vw(36);*/
                        }
                    }

                    .testImg {
                        position: absolute;
                        right: 0;
                        width: 230px;
                        /*width: vw(230);*/
                        height: 92px;
                        /*height: vw(92);*/
                        display: inline-block;
                    }

                    .phone {
                        width: 27px;
                        /*width: vw(27);*/
                        height: 36px;
                        /*height: vw(36);*/
                        vertical-align: text-top;
                    }

                    .num {
                        /*width: vw(35);*/
                        /*height: vw(27);*/
                        width: 35px;
                        height: 27px;
                        vertical-align: middle
                    }
                }

                .flex {
                    display: flex;
                    padding: 0 8px;
                    /*padding: 0 vw(8);*/

                    .input {
                        border: none;
                        outline: none;
                        color: #8d8d8d;
                        width: 100%;
                    }

                    .selectPhone {
                        height: 21px;
                        /*height: vw(21);*/
                        width: 90px;
                        /*width: vw(90);*/
                        text-align: center;
                        margin-right: 12px;
                        /*margin-right: vw(12);*/
                    }

                    .country {
                        display: inline-block;
                        width: 51px;
                        height: 34px;
                        /*width: vw(51);*/
                        /*height: vw(34);*/
                        background: red;
                        float: right
                    }

                    .selectTitle {
                        font-family: MicrosoftYaHei;
                        font-size: 26px;
                        /*font-size: vw(26);*/
                        font-weight: normal;
                        font-stretch: normal;
                        line-height: 120px;
                        /*line-height: vw(120);*/
                        color: #3e80ca;
                        position: relative;
                        bottom: 18px;
                        /*bottom: vw(18);*/
                        display: flex;

                        .text {
                            position: relative;
                            bottom: 22px;
                            /*bottom: vw(22);*/
                            margin-right: 5px;
                        }

                        .triangle-up {
                            width: 0;
                            height: 0;
                            border-left: 9px solid transparent;
                            border-right: 9px solid transparent;
                            border-top: 14px solid #3e80ca;
                            margin-top: 30px;
                            /*border-left: vw(9) solid transparent;*/
                            /*border-right: vw(9) solid transparent;*/
                            /*border-top: vw(14) solid #3e80ca;*/
                            /*margin-top: vw(30);*/

                        }
                    }
                    .heiyan{
                        height: 80px;
                    }

                }
            }

        }

        .banner {
            width: 174px;
            height: 175px;
            margin: 36px auto 86px auto;
            /*width: vw(472);*/
            /*height: vw(149);*/
            /*margin: vw(62) auto vw(91) auto;*/
        }
    }
    .line {
        width: 100%;
        height: 8px;
        border: solid 1px #b5b5b5;
        border-top: none;
        margin-top: 10px;
    }

    .twoBtnEx{
        margin:0 82px;
        display: flex;
        color: #818181;
        font-size: 30px;
        align-items: flex-end;
        padding-bottom: 24px;
        border-bottom: 1px solid #dcdcdc;
        span:nth-child(1){
            margin-right: 48px;
        }
        span.addBlod{
            font-size: 45px;
            font-weight: 600;
            color: #202025;
        }
    }
    .wrap-inputEP{
        margin:0 82px;
        .inputPhone{
            margin-top: 60px;
            .input-main{
                display: flex;
                align-items: center;
                height: 50px;
                padding: 0 8px;
                .left{
                    font-family: MicrosoftYaHei;
                    font-size: 26px;
                    font-weight: normal;
                    font-stretch: normal;
                    line-height: 50px;
                    color: #3e80ca;
                    display: flex;
                    align-items: center;
                    width: 92px;
                    span:nth-child(2){
                        width: 0;
                        height: 0;
                        border-left: 9px solid transparent;
                        border-right: 9px solid transparent;
                        border-top: 14px solid #3e80ca;
                        margin-left: 5px;
                    }
                }
                input{
                    flex: 1;
                    border: none;
                    font-size: 26px;
                    margin-left: 15px;
                }
            }
            .flag-1{
                transform: scale(1.5);
            }
            .iti-flag {
                float: right;
                margin: 2px 22px 0 0;
            }
        }
        .PassWord-input{
            margin-top: 56px;
            .pass-Goto{
                display: flex;
                img{
                    width: 28px;
                    height: 36px; 
                    margin: 0 55px 0 34px;
                }
                input{
                    flex: 1;
                    border: none;
                }
            }
        }
        .email-inp{
            margin-top: 60px;
            .pass-Goto{
                height: 50px;
                align-items: center;
                img{
                    width: 36px;
                    height: 26px; 
                    margin: 0 45px 0 34px;
                }
            }
        }
        .btn-login{
            background-color: #3e80ca;
            color: white;
            height: 89px;
            border-radius: 5px;
            font-size: 34px;
            letter-spacing: 5px;
            line-height: 89px;
            margin-top: 56px;
        }
        .gotoOther{
            display: flex;
            justify-content: space-between;
            color: #3e80ca;
            margin-top: 49px;
            font-size: 26px;
        }
        .wrap-imgCode{
            .imgCode{
                position: relative;
                top: 15px;
                display: flex;
                align-items: center;
                height: 92px;
                img:nth-child(1){
                    height: 36px;
                    width: auto;
                    margin-left: 20px;
                    margin-right: 45px;
                }
                input{
                    border: none;
                }
                img:nth-child(3){
                    position: absolute;
                    right: 0;
                    width: 230px;
                    height: 92px;
                    display: inline-block;
                }
            }
            .line{
                margin-top: 15px;
            }
        }
    }
</style>