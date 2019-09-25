<template>
	<div class="regist">
    <Headers :value="$t('register.regLo')" @back="$goBack" @vlueClick="gologin"></Headers>
		<div class="regist-center">
			<div class="banner"><img src="../../assets/img/quicklogin/LOGO.png" alt=""></div>
			<div class="box">
				<h1>
					<span @click="changeTypeHandle(0)" :class="{active: type===0}">{{$t('register.phone')+$t('register.regist')}}</span> <!-- 手机注册 -->
					<span @click="changeTypeHandle(1)" :class="{active: type===1}">{{$t('register.email')+$t('register.regist')}}</span> <!-- 邮箱注册 -->
				</h1>
				<ul>
					<li>
						<div v-if="type===1" class="input-box">
							<div class="icon"><img class="iconE" src="../../assets/img/quicklogin/email1.png" alt=""></div>
							<div class="input"><input type="text"  v-model="email" :placeholder="$t('register.placeEmail')"></div> <!-- 请输入您的邮箱账号 --> 
						</div>
						<div v-else class="input-box">
							<div class="select" @click="goSearch">+{{countryItem.tel}}</div>
							<div class="input"><input type="tel" v-model="mobile" :placeholder="$t('register.placePhone')"></div> <!-- 请输入您的手机账号 -->  
							<div class="flag-img">
								<div class="country" :class="'iti-flag ' + countryItem.short.toLowerCase()"></div>
							</div>
						</div>
						<div class="line"></div>
					</li>
					<li v-if="false">
						<div class="input-box">
							<div class="icon"><img src="../../assets/img/quicklogin/num.png" alt=""></div>
							<div class="input"><input type="text" :placeholder="$t('register.placePic')"></div> <!-- 请输入图形验证码 -->
							<div class="regist-img"><img @click="imgSrc=new Date().getTime()" :src='$interfaceJavaUrl+"/user/login/getCode?t="+imgSrc' alt=""></div>
						</div>
						<div class="line"></div>
					</li>
					<li>
						<div class="input-box">
							<div class="icon"><img src="../../assets/img/quicklogin/invit.png" alt=""></div>
							<div class="input"><input type="text" :readonly="isAgent" v-model="invit" :placeholder="$t('register.placeInvit')"></div> <!--  请输入您的邀请码 (选填) --> 
						</div>
						<div class="line"></div>
					</li>
					<li>
						<div class="btn" @click="registHandle">
							<input type="button" :value="$t('register.verify')" />  <!-- 验证 -->
						</div>
					</li>
				</ul>
			</div>
			<div class="bottom">
				<p>{{$t('register.registAndAgree')}}《<a href="javacript:void(0)" @click="$router.push('./protocol')">GQG{{$t('register.userProtocol')}}</a>》</p> <!-- 注册及同意GQG用户协议 --> 
			</div>
		</div>
		<slider :idValue='idValue' @moveEnd='endHandle' ref="slider"></slider>
	</div>
</template>

<script>
import Headers from '../../component/header'
import slider from '../../component/slider'
import { 
	emailRegister,
	passwordLogoNew,
	sendMessagePicAjax,
	sendEmailPic 
} from './request.js'
export default {
	components: {
		Headers,
		slider
	},
	data() {
		return {
			type: 0, // 0 => 手机， 1 =>邮箱
			defaultInvit: false,
			email: '',
			mobile: '',
			invit: '',
			imgSrc: new Date().getTime(),
			isAgent: false,
			idValue: ''
		}
	},
	computed: {
		countryItem() {
			return this.$store.state.countryItem
		},
		loading() {
			return this.$store.state.loading;
		},
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			vm.$store.commit('changeNoMenu', false);
			let query = vm.$route.query;
			if(query.bkinfo) {
				let bkinfo = JSON.stringify(query);
				sessionStorage.setItem('specialTreatment', 'home');
				localStorage.setItem('bkinfo', bkinfo);
				vm.isAgent=true;
			} else {
				let bkinfo = localStorage.getItem('bkinfo') && JSON.parse(localStorage.getItem('bkinfo'));
				if(bkinfo) {
					let path = location.pathname;
					vm.$router.replace({path,query:{bkinfo: bkinfo.bkinfo}});
				}
			}
		})
	},
	methods: {
		endHandle(res) {
			if(this.type===0){
				this.sendMsgHandle(this.idValue, res);
				return;
			}
			if(this.type===1){
				this.sendEmailCodeA(this.idValue, res);
				return;
			}
		},
		// 发送邮箱验证码
		sendEmailCodeA(id,x){
			let params={
				id,
				email:this.email,
                picCode: x,
				type: 1
			}
			this.$store.commit('changeLoading', true);
			sendEmailPic(params).then(res=>{
				this.$store.commit('changeLoading', false);
				if(res.data.status === 200) {
					this.$normalToast('发送成功');
					this.$router.push('/registCode/1');
					return ;
				}
				if(res.data.status === 500 || res.data.status === 400) {
					this.$normalToast(res.data.msg);
					return;
				}
			}).catch(err=>{
				this.$store.commit('changeLoading', false);
			})
		},
		sendMsgHandle(id, x) {
			let params = {
				id,
				mobile: this.mobile,
				picCode: x,
				type: 2,
			}
			this.$store.commit('changeLoading', true);
			sendMessagePicAjax(params).then(res => {
				this.sendCodeHandle(res);
			}).catch(() => {
				this.$store.commit('changeLoading', false);
				if(err.message==='001'){
					return;
				}
				this.$normalToast(this.$t('register.networkError'),2000);
			})
		},
		sendCodeHandle(res) {
			this.$store.commit('changeLoading', false);
			if(res.data.status === 200) {
				this.$router.push('/registCode/0');
				return ;
			}
			if(res.data.status === 500 || res.data.status === 400) {
				this.$normalToast(res.data.msg);
				this.dataInit(this.$route);
				return;
			}
			if(res.data.msg) {
				this.$normalToast(res.data.msg);
			}
		},
		gologin() {
			this.$router.push('/phoneLogin')
		},
		changeTypeHandle(type) {
			this.type = type;
		},
		registHandle() {
			if(this.type === 0) {
				if(!this.verifyMobile()) return ;
			} else {
				if(!this.verifyEmailVal()) return ;
			}
			let parms = {
				mobile: this.mobile,
				email: this.email,
				type: Number(this.type) + 1,
				password: '0'
			}
			if(this.loading) return;
			this.$store.commit('changeLoading', true);
			passwordLogoNew(parms).then(res => {
				this.$store.commit('changeLoading', false);
				if((res.data.status === 500) && (res.data.code === null)) {
					window.sessionStorage.setItem('tempInfo',JSON.stringify({mobile:this.mobile, email: this.email, invit: this.invit}));
					if(this.type===0){
						this.idValue = this.mobile;
					}
					if(this.type===1){
						this.idValue = this.email;
					}
					this.$refs.slider.refresh(this.idValue);
					// this.$router.push(`/registCode/${this.type+2}?way=${this.type}`);
				} else {
					this.$normalToast(this.$t('register.hasAccount'),2000);
				}
			}).catch(err => {
				console.log(err)
				this.$store.commit('changeLoading', false);
				if(err.message==='001'){
					return;
				}
				this.$normalToast(this.$t('register.networkError'),2000);
			})
		},
		// 选择电话号码
		goSearch() {
			this.$router.push('/search');
		},
		// 验证邮箱输入
		verifyEmailVal() {
			this.email=this.email.trim();
			if(!this.email){
				this.$normalToast(this.$t('setting.email.pleaseEmail'),1000);    //请输入有效邮箱
				return ;
			}
			let execute = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
			if(!execute.test(this.email)){
				this.$normalToast(this.$t('setting.email.emailRule1'),1000);
				return ;
			}
			return true;
		},
		// 验证手机号输入
		verifyMobile() {
			this.mobile=this.mobile.trim();
			let tel = this.countryItem.tel;
			if(tel === '86'){
				let execute = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
				if(!execute.test(this.mobile)){
					this.$normalToast(this.$t('setting.tel.mobileRule1'),1000);
					return ;
				}
			}
			return true;
		},
	},
	beforeRouteLeave(to, from, next) {
		this.$store.commit('changeNoMenu', true);
		this.$store.commit('changeLoading', false);
		// 取消请求
        if(this.$axiosPromiseArr){
            this.$axiosPromiseArr.forEach((ele, index) => {
                ele.cancel('001');
                delete this.$axiosPromiseArr[index];
            })
        }
		next();
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
				.country{
					// transform: scale(1.2)
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
		.bottom{
			margin-top: 260px;
			a{
				color: #3e80ca;
			}
		}
	}
}
</style>
