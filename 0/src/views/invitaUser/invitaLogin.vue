<template>
	<div class="invitaLogin" @touchstart='startInfo' @touchmove='pageMoveHandle'>
		<ul ref="uldom">
			<li><img src="../../assets/img/invitaUser/s2.png" alt="">
				<div class="top-box">
					<div class="logo"><img src="../../assets/img/invitaUser/s1.png" alt=""></div>
					<p class="title">{{$t('invitauser.ad1')}}</p>
					<div class="from">
						<ul>
							<li>
								<img src="../../assets/img/invitaUser/user.png" alt="">
								<input type="number" @focus="isoldUser=false" v-model="phone" :placeholder="$t('invitauser.placephone')">
							</li>
							<li v-if="false">
								<img src="../../assets/img/invitaUser/yanzhen.png" alt="">
								<input type="text" v-model="sendmsg" :placeholder="$t('invitauser.placeimgcode')">
								<img class="code-img" 
									@click="imgSrc=new Date().getTime()" 
									:src='$interfaceJavaUrl+"/user/login/getCode?t="+imgSrc'
									alt="">
							</li>
							<li>
								<img src="../../assets/img/invitaUser/code.png" alt="">
								<input type="text" v-model="msgcode" @input="handleVerify" :placeholder="$t('invitauser.placecode')">
								<span @click="sendmsgHandle" class="send-code">{{timemsg || $t('invitauser.sendcode')}}</span>
							</li>
							<!-- <li>
								<img src="../../assets/img/invitaUser/yaoqin.png" alt="">
								<input type="text" placeholder="邀请码">
							</li> -->
						</ul>
						<div class="btn">
							<a style="height:100%" 
								:class="{touchcolor:inTouch}" 
								@touchstart='inTouch=true' 
								@touchmove='inTouch=true' 
								@touchend='inTouch=false' 
								@click="LoginHandle" 
							>{{$t('invitauser.login')}}</a>
						</div>
						<div class="go-login"><span @click="goSign">{{$t('invitauser.gosign')}}</span></div>
					</div>
				</div>
			</li>
			<li><img src="../../assets/img/invitaUser/s3.png" alt="">
				<article class="article">
					<h3>{{$t('invitauser.ad2')}}</h3>
				</article>
			</li>
			<li><img src="../../assets/img/invitaUser/s4.png" alt="">
				<article class="article">
					<h3>{{$t('invitauser.ad3')}} </h3>
					<p>{{$t('invitauser.ad4')}}</p>
				</article>
			</li>
			<li><img src="../../assets/img/invitaUser/s5.png" alt="">
				<article class="article">
					<h3>{{$t('invitauser.ad5')}}</h3>
					<p>{{$t('invitauser.ad6')}}</p>
				</article>
			</li>
		</ul>
		<div @click="goTopHandle" class="go-top" :class="isDown?'movedown':'moveup'">
			<img src="../../assets/img/invitaUser/gotop.png" alt="">
			<span>{{$t('invitauser.gotop')}}</span>
		</div>
		<slider :idValue='idValue' @moveEnd='endHandle' ref="slider"></slider>
	</div>
</template>

<script>
import {sendMobileCode, loginByPhone} from '../../api' 
import slider from '../../component/slider'
export default {
	components: {
		slider
	},
	data(){
		return {
			inTouch:false,
			imgSrc: new Date().getTime(),
			endY: 0,
			startY: 0,
			isDown:false,
			phone: '',
			sendmsg: '',
			msgcode: '',
			timemsg: 0,
			isnewUser: false,
			downTimer: null,
			idValue: ''
		}
	},
	methods: {
		endHandle(res) {
			this.sendmsgPost(this.phone, res);
			this.countdown();
		},
		// 登录按钮方法
		LoginHandle() {
			// 是老用户提示登录
			if(this.isoldUser) {
				this.$normalToast(this.$t('logoNew.accNoReg'),1000);
				return;
			}
			if(!this.testphone()) return;
			// if(!this.testsendmsg()) return;
			if(!this.testmsgcode()) return;
			this.loginPostHandle().then(res =>{
				//判断新用户
				if(res.data.status === 200) {
					this.$normalToast(this.$t('logoNew.sccuLoMa'),1000);
					setTimeout(() => {
						this.$router.push('/invitaUser/invitadownload');
					},1001)
				} else {
					this.$normalToast(res.data.msg,1000);
				}
			}).catch(() => {
				this.$normalToast(this.$t('logoNew.failLome'),2000);
				this.imgSrc = new Date().getTime();
				this.timemsg = 0;
				clearInterval(this.downTimer);
			})
		},
		// 登录请求
		loginPostHandle() {
			let data = {
				mobile: this.phone,
				msgCode: this.msgcode,
				moblepre: '+86',
			}
			return loginByPhone(data);
		},
		// 去登录
		goSign() {
			this.$router.push('/invitaUser/invitaSign')
		},
		// ios复制验证码会复制两次
		handleVerify() {
			this.msgcode = this.msgcode.slice(0,4);
		},
		// 发送验证码按钮
		sendmsgHandle(){
			if((this.timemsg>0)) return;
			if(!this.testphone()) return;
			// if(!this.testsendmsg()) return;
			this.idValue = this.phone;
			this.$refs.slider.refresh(this.idValue);
			// this.countdown();
			// this.sendmsgPost();
		},
		// 发送验证码
		sendmsgPost(id, x){
			let data = {
				id,
				picCode: x,
				mobile: this.phone,
				type: 2,
				moblepre: '+86',
			}
			sendMobileCode(data)
			.then(res => {
				if(res.status === 200){
					if(res.data.status === 200) {
						this.$normalToast(this.$t('otherWT.senSCyu'),1000);
						this.codeNum1 = res.data.data[0]
						return ;
					}
					if(res.data.code === '002'){
						this.$normalToast(this.$t('logoNew.accNoReg'),1000);
						this.isoldUser = true;
						this.timemsg=0;
					}else {
						this.$normalToast(res.data.msg,1000);
						this.imgSrc = new Date().getTime();
						this.timemsg = 0;
						clearInterval(this.downTimer);
					}
				}
			}).catch( err => {
				this.$normalToast(this.$t('setting.sendErr'),2000);
				this.imgSrc = new Date().getTime();
				this.timemsg = 0;
				clearInterval(this.downTimer);
			})
		},
		// 倒计时
		countdown(){
			if((this.timemsg>0)) return;
			this.timemsg = 60;
			this.downTimer = setInterval(() => {
				if(Number(this.timemsg)<=0){
					// this.timemsg = '发送验证码';
					clearInterval(this.downTimer);
					return;
				}
				this.timemsg -= 1;
			},1000)
		},
		// 回到顶部
		goTopHandle() {
			let dom = this.$refs.uldom;
			this.$goTopHandle(dom);
		},
		testphone(){
			let reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/;
			if(!reg.test(this.phone)){
				// this.telTitle = '请输入正确的手机号';
				this.$normalToast(this.$t('setting.tel.mobileRule1'),1000);
				return;
			}
			return true;
		},
		testsendmsg(){
			if(!this.sendmsg.trim()){
				// this.telTitle = '请输入正确的手机号';
				this.$normalToast(this.$t('register.placePic'),1000);
				return;
			}
			return true;
		},
		testmsgcode(){
			if(!this.msgcode.trim()){
				this.$normalToast(this.$t('otherWT.plaPhCoe'),1000);
				return;
			}
			return true;
		},
		// 显示回到顶部显示隐藏
		pageMoveHandle(e) {
			this.endY = e.touches[0].pageY;
			let move = this.startY - this.endY;
			move >= 0 ? (this.isDown = true) : (this.isDown = false)
		},
		startInfo(e) {
			this.startY = e.touches[0].pageY;   // 
		},
	}
}
</script>

<style lang='less' scoped>
.invitaLogin{
	position: relative;
	height: 100%;
	&>ul{
		position: relative;
		overflow: auto;
		height: 100%;
		&>li{
			background:pink;
			position: relative;
			img{
					width: 100%;
					display: block;
			}
			.article{
				position: absolute;
				z-index: 1;
				top: 0;
				width: 100%;
				h3{
					margin: 68px auto 42px;
					font-size: 45px;
					font-weight: normal;
					color: #ffffff;
				}
				p{
					font-size: 34px;
					color: #ffffff;
				}
			}
		}
	}
	.top-box{
		// height: 200px;
		// background: #6666;
		position: absolute;
		z-index: 1;
		width: 100%;
		top: 16px;
		.logo{
			width: 169px;
			height: 191px;
			margin: 20px auto;
		}
		.title{
			font-size: 34px;
			color: #ffffff;
			text-shadow: 3px 4px 5px rgba(0,0,0, 0.75);
		}
		.from{
			margin-top: 36px;
			&>ul{
				&>li{
					width: 579px;
					margin: 0 auto 36px;
					height: 97px;
					background-color: #ffffff;
					background: rgba(255, 255, 255, 0.25);
					border-radius: 5px;
					// opacity: 0.25;
					position: relative;
					input{
						position: absolute;
						left: 100px;
						top: 0;
						bottom: 0;
						margin: auto;
						background-color: rgba(255,255,255, 0);
						border: 0;
						outline: 0;
						color: #ffffff;
						&::-webkit-input-placeholder{
							color: #fff;
						}
					}
					img{
						// width: 42px;
						height: 100%;
						width: auto;
						padding: 26px 23px;
					}
				}
			}
			.btn{
				text-align: center;
				margin: 0 auto;
				width: 580px;
				height: 97px;
				border-radius: 44px;
				background: #ffffff;
				a{
					font-size: 34px;
					height: 100%;
					line-height: 97px;
					border-radius: 44px;
					color: #2f43b2;
					display: block;
				}
				.touchcolor{
					background: #efefef;
				}
			}
			.code-img{
				position: absolute;
				right: 0;
				top: 0;
				height: 100%;
				padding: 0;
				width: 230px;
			}
			.send-code{
				height: 100%;
				font-size: 26px;
				width: 150px;
				line-height: 97px;
				color: #2f43b2;
				position: absolute;
				right: 6px;
				top: 0;
			}
			.go-login{
				padding-top: 36px;
				font-size: 24px;
				color: #ffffff;
			}
		}
	}
	.go-top{
		position: absolute;
		bottom: 156px;
		right: 40px;
		// opacity: 0.7;
		color: #fff;
		img{
			display: block;
			width: 78px;
			margin: 0 auto 24px;
		}
	}
	.moveup{
		opacity: 0.1;
		transition: opacity 0.8s;		
	}
	.movedown{
		opacity: 1;
		transition: opacity 0.8s;	
	}
}
</style>
