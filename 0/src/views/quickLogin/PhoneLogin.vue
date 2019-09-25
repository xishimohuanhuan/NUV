<template>
    <div class="regist">
        <headers  :value="$t('logoNew.userReg')" @back="$goBack" @vlueClick="goRegister"></headers>
		<div class="regist-center">
			<div class="banner"><img src="../../assets/img/quicklogin/LOGO.png" alt=""></div>
			<div class="box">
				<h1>
                    <span 
                        :class="{active: isChanged===1}" 
                        @click="isChangedClick(1)"
                    >{{$t('logoNew.phLoTit')}}</span>
                    <span
                        :class="{active: isChanged===2}"
                        @click="isChangedClick(2)"
                    >{{$t('logoNew.emaLoTit')}}</span>
				</h1>
				<ul>
					<li>
                        <!-- 邮箱账号 -->
						<div v-if="isChanged===2" class="input-box">
							<div class="icon">
                                <img class="iconE" src="../../assets/img/quicklogin/email1.png" alt="">
                            </div>
							<div class="input">
                                <input 
                                    type="text"  
                                    v-model="emailDataNumber"
                                    :placeholder="$t('logoNew.plasYouEnAcc')"
                                    @input="inputTrimEm"
                                >
                            </div>
						</div>
                        <!-- 手机号 -->
						<div v-if="isChanged===1" class="input-box">
							<div class="select" @click="goSerch">+{{countryItem.tel}}</div>
							<div class="input">
                                <input 
                                    type="tel"  
                                    v-model="phoneDataNumber" 
                                    :placeholder="$t('logoNew.plasYouPhAcc')"
                                    @input="inputTrim"
                                >
                            </div>
							<div class="flag-img">
								<div class="country" :class="'iti-flag ' + countryItem.short.toLowerCase()"></div>
							</div>
						</div>
						<div class="line"></div>
					</li>
					<li>
						<div class="input-box" v-if="!isOnlyCode">
							<div class="icon">
                                <img src="../../assets/img/quicklogin/lock.png" alt="" />
                            </div>
							<div class="input">
                                <input 
                                    type="password"  
                                    :placeholder="$t('logoNew.PlaLogPass')"
                                    v-model="passDataNum"
                                    @input="inputTrimPas"
                                >
                            </div>
						</div>
						<div class="line"></div>
					</li>
					<li>
						<div class="btn" @click="gotoNext">
							<input type="button" :value="$t('logoNew.logo11')" />
						</div>
					</li>
				</ul>
			</div>
            <!-- 其他 -->
            <div class="gotoOther">
                <span 
                    v-text="isChanged===1 ? $t('logoNew.codeLoLin'):''"
                    @click="gotoCode()"
                ></span>
                <span @click="gotoRemeber">{{$t('logoNew.remmPassc')}}</span>
            </div>
		</div>
        <slider :idValue='idValue' @moveEnd='moveEndHandle' ref="slider"></slider>
	</div>
    
</template>

<script>
    import headers from '../../component/header'
    import slider from '../../component/slider'
    import {
        getCodePhone,
        passwordLogoNew,
        sendVerifyCode
    } from './request.js'
    export default {
        components: {
            headers,
            slider
        },
        data() {
            return {
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
                ingRequest:false,
                idValue: ''
            }
        },
        computed: {
            countryItem() {
                return this.$store.state.countryItem
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                //判断是否登录
                if( vm.$getCookie('userId') && JSON.parse(decodeURIComponent(vm.$getCookie('userId'))).userId ){
                    //登录就调到首页
                    vm.$loginRoute('/home');
                }
                vm.phoneDataNumber=localStorage.getItem('longP') || '';
                vm.emailDataNumber=localStorage.getItem('longE') || '';
                vm.$store.commit('changeNoMenu', false);
            })
        },
        beforeRouteLeave(to, from, next) {
            // ...
            this.$store.commit('changeNoMenu', true);
            this.$store.commit('changeLoading', false);
            next();
        },
        methods: {
            // input的验证 手机
            inputTrim(){
                this.phoneDataNumber=this.phoneDataNumber.replace(/(^\s*)|(\s*$)/g, ""); 
            },
            // 邮箱 验证
            inputTrimEm(){
                this.emailDataNumber=this.emailDataNumber.replace(/(^\s*)|(\s*$)/g, "");
            },
            // 密码 验证
            inputTrimPas(){
                this.passDataNum=this.passDataNum.replace(/(^\s*)|(\s*$)/g, "");
            },
            // 验证手机号输入
            verifyMobile(data) {
                data=data.trim();
                let tel = this.countryItem.tel;
                if(tel === '86'){
                    let execute = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
                    if(!execute.test(data)){
                        this.$normalToast(this.$t('setting.tel.mobileRule1'),1000);
                        return ;
                    }
                }
                return true;
            },
            // 验证邮箱输入
            verifyEmailVal(data) {
                data=data.trim();
                let execute = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
                if(!execute.test(data)){
                    this.$normalToast(this.$t('setting.email.emailRule1'),1000);
                    return ;
                }
                return true;
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
            moveEndHandle(res) {
                if(this.isChanged===1){
                    this.getCodeAjax(this.idValue, res);
                    return;
                }
                if(this.isChanged===2){
                    this.emailSendVerifyCod(this.idValue, res);
                    return;
                }
            },
            gotoNext(){
                if(this.ingRequest){
                    this.$normalToast(this.$t('logoNew.repusetIng'));
                    return;
                }
                if(this.isChanged===1){
                    if(!this.phoneDataNumber || !this.verifyMobile(this.phoneDataNumber)){
                        this.$normalToast(this.$t('logoNew.plasAblaPhon'));
                        return;
                    }
                    if(!this.passDataNum){
                        this.$normalToast(this.$t('logoNew.plasLogoPP'));
                        return;
                    }
                    // mobile：手机号
                    // password：密码
                    // type： 1通过手机号登陆 2通过邮箱登陆1通过手机号登陆 2通过邮箱登陆
                    let data={
                        mobile:this.phoneDataNumber,
                        password:this.passDataNum,
                        token:this.$getCookie("tLost") || 0,
                        type:1
                    }
                    this.AjaxLogoPhone(data);
                    return;
                }
                if(this.isChanged===2){
                    if(!this.emailDataNumber || !this.verifyEmailVal(this.emailDataNumber)){
                        this.$normalToast(this.$t('logoNew.plasAbleEmP'));
                        return;
                    }
                    if(!this.passDataNum){
                        this.$normalToast(this.$t('logoNew.plasLogoPP'));
                        return;
                    }
                    let data={
                        email:this.emailDataNumber,
                        password:this.passDataNum,
                        token:this.$getCookie("tLost") || 0,
                        type:2
                    }
                    this.AjaxLogoPhone(data);
                    return;
                }
            },
            // 登录
            AjaxLogoPhone(data){
                this.ingRequest=true;
                this.$store.commit('changeLoading', true);
                passwordLogoNew(data).then(res=>{
                    // 存手机号码 邮箱
                    if(this.isChanged===1){
                        localStorage.setItem('longP',this.phoneDataNumber);
                    }else{
                        localStorage.setItem('longE',this.emailDataNumber);
                    }
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
                        let obj1 = {
                            phone: this.isChanged===1 ? this.phoneDataNumber :this.emailDataNumber,
                            userId: res.data.data.user.id,
                            token: res.data.data.user.token,
                            istradeSet: !!res.data.data.user.paypassword
                        }
                        let username = res.data.data.user.username;
                        sessionStorage.setItem('LoginQick', JSON.stringify(obj1))
                        var token = obj1.token;
                        var userId = obj1.userId;
                        this.getSession(userId, token).then((data) =>{
                            this.ingRequest=false;
                            this.$store.commit('changeLoading', false);
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
                                },2000)
                            } else {
                                this.$normalToast(this.$t('logoNew.failLome'));
                            }
                        }).catch(err=>{
                            this.ingRequest=false;
                            this.$normalToast(this.$t('logoNew.errCode'));
                            this.$store.commit('changeLoading', false);
                        })
                        return;
                    }
                    this.$store.commit('changeLoading', false);
                    this.ingRequest=false;
                    if (res.data.code === '001'){
                        // 跳转到图形验证码
                        if(this.isChanged===1){
                            sessionStorage.setItem('logoNN',JSON.stringify({
                                PH:this.phoneDataNumber,
                                PA:this.passDataNum,
                                PE:false
                            }));
                            this.idValue = this.phoneDataNumber;
                            this.$refs.slider.refresh(this.idValue);
                            // this.$router.push('/PhoneCode/6');
                        }
                        if(this.isChanged===2){
                            sessionStorage.setItem('logoNN',JSON.stringify({
                                PH:false,
                                PA:this.passDataNum,
                                PE:this.emailDataNumber
                            }));
                            this.idValue = this.emailDataNumber;
                            this.$refs.slider.refresh(this.idValue);
                            // this.$router.push('/PhoneCode/6');
                        }
                    }
                    if (res.data.code === '002'){
                        this.$normalToast(this.$t('logoNew.notSetPas'));
                    }
                    if (res.data.code === '003'){
                        this.$normalToast(this.$t('logoNew.passwro'));
                    }
                    if(res.data.status == 500){
                        this.$normalToast(this.$t('logoNew.useExiPlReg'));
                    }
                }).catch(err=>{
                    this.$store.commit('changeLoading', false);
                    this.ingRequest=false;
                    this.$normalToast(this.$t('logoNew.errCode'));
                })
            },
            // 获取邮箱验证码
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
                        this.$router.push('/PhoneCode/2');
                        this.setTimetCode();
                    }else{
                        this.changeBlur=false;
                        this.imgCodeData='';
                        // this.$refs.imgCodeRef && this.$refs.imgCodeRef.setValHandle('');
                        this.$normalToast(res.data.msg);
                        // this.imgSrc=new Date().getTime();
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
             // 快捷登录获取短信
            getCodeAjax(id, code){
                let params = {
                    "mobile": this.phoneDataNumber,
                    "id": id,
                    'picCode': code,
                    'moblepre': '+' + this.$store.state.countryItem.tel,
                    'type':2,
                    "time":+ new Date()
                }
                this.$store.commit('changeLoading', true);
                this.ingRequest=true;
                getCodePhone(params).then(res=>{
                    this.$store.commit('changeLoading', false);
                    this.ingRequest=false;
                    if(res.data.code==='002'){
                        this.$normalToast(this.$t('logoNew.useExiPlReg'),2500); //用户不存在
                        window.history.go(-1);
                        return;
                    }
                    if(res.data.status===200){
                        this.$normalToast(this.$t('logoNew.sccHQ')); // 获取成功
                        this.$router.push('/PhoneCode/3');
                        sessionStorage.setItem('tempoI',[localStorage.getItem('longP'),this.imgCodeData,this.$store.state.countryItem.tel])
                    }else{
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

<style lang='less' scoped>
@import "../../component/IntlTelInput/intl.css";
input{
	border: none;
	outline: none;
	background: transparent;
	width: 100%;
	height: 100%;
}
.line {
	width: 100%;
	height: 8px;
	border: solid 1px #b5b5b5;
	border-top: none;
	margin-top: 25px;
}
.regist{
	flex: 1;
	background: #ffffff;
	&-center{
		.banner{
			margin-top: 36px;
			img{
				width: 174px;
				height: 175px;
			}
		}
		.box{
			padding: 0 85px;
			text-align: left;
			margin-top: 80px;
			h1{
				height: 45px;
				line-height: 45px;
				padding-bottom: 69px;
				color: #818181;
				font-size: 30px;
				border-bottom: 1px solid #dcdcdc;
				span{
					margin-right: 48px;
				}
				.active{
					font-size: 45px;
					color: #202025;
				}
			}
			&>ul{
				margin-top: 80px;
				&>li{
					margin-top: 56px;
				}
			}
			.input-box{
				display: flex;
				justify-content: space-around;
				align-items: center;
				padding: 0 8px;
				.flag-img{
					transform: scale(1.5);
					margin-right: 10px;
				}
				.icon{
					width: 96px;
					height: 36px;
					// text-align: center;
					img{
						margin-left: 12px;
						width: auto;
						height: 100%;
                    }
                    .iconE{
                        height: 26px;
                    }
				}
				.regist-img{
					position: relative;
					width: 230px;
					height: 36px;
					img{
						width: 230px;
						height: 92px;
						position: absolute;
						bottom: -20px;
					}
				}
				.select{
					font-size: 26px;
					font-style: normal;
					letter-spacing: 0px;
					color: #3e80ca;
					position: relative;
					height: 36px;
					min-width: 96px;
					&::after{
						display: inline-block;
						content: '';
						margin: 1px 10px;
						width: 0;
						height: 0;
						border-left: 9px solid transparent;
						border-right: 9px solid transparent;
						border-top: 14px solid #3e80ca;
					}
				}
				.input{
					flex: 1;
					padding-right: 20px;
				}
			}
			.btn{
				width: 579px;
				height: 89px;
				background-color: #3e80ca;
				border-radius: 10px;
				font-size: 34px;
				color: #ffffff;
			}
		}
	}
}
.gotoOther{
    padding: 0 85px;
    display: flex;
    justify-content: space-between;
    color: #3e80ca;
    margin-top: 49px;
    font-size: 26px;
}
</style>