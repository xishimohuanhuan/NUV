<template>
	<div class="invitaLogin" @touchstart='startInfo' @touchmove='pageMoveHandle'>
		<img @click="$router.push({path: '/home'})" class="img-gohome" src="../../assets/img/setting/baise_go.png" alt="">
		<ul>
			<li><img src="../../assets/img/invitaUser/c1.png" alt="">
				<div class="top-box">
					<div class="logo"><img src="../../assets/img/invitaUser/s1.png" alt=""></div>
					<p class="title">{{$t('invitauser.ad1')}}</p>
					<div class="from">
						<h4>APP{{$t('invitauser.download')}}</h4>
						<div class="btn">
							<a style="height:100%" 
								:class="{touchcolor:adinTouch}" 
								@touchstart='adinTouch=true' 
								@touchmove='adinTouch=true' 
								@touchend='adinTouch=false' 
								@click="androidDownload" 
							>Android{{$t('invitauser.download')}}</a>
						</div>
						<div class="btn">
							<a style="height:100%" 
								:class="{touchcolor:iosinTouch}" 
								@touchstart='iosinTouch=true' 
								@touchmove='iosinTouch=true' 
								@touchend='iosinTouch=false' 
								@click="iosDownload"
							>IOS{{$t('invitauser.download')}}</a>
							<p v-show="iostitle" class="ios-title">IOS {{$t('invitauser.placedeck')}}</p>
								<!-- href="https://download.megvii.com/iosapp/megvii/DemoFaceIDAllInOne.plist" -->
						</div>
						<!-- <div class="go-login"><span @click="goLogin">已有账户？点击登录</span></div> -->
					</div>
				</div>
			</li>
			<li>
				<img src="../../assets/img/invitaUser/c2.png" alt="">
				<div class="step-box">
					<!-- 安装步骤说明 -->
					<h3>{{$t('invitauser.steph')}}</h3>
					<div class="step-title">
						<div><img src="../../assets/img/invitaUser/ios.png" alt=""></div>
						<div>
							<!-- 企业级应用添加信任 -->
							<p>IOS {{$t('invitauser.stept1')}}</p>
							<!-- 安装APP后进行一下设置，否则无法使用 -->
							<p>{{$t('invitauser.stept2')}}</p>
						</div>
					</div>
					<ul>
						<li>
							<img src="../../assets/img/invitaUser/step1.png" alt="">
							<p>1.{{$t('invitauser.step1')}}</p>
						</li>
						<span class="none-box"></span>
						<li>
							<img src="../../assets/img/invitaUser/step2.png" alt="">
							<p>2.{{$t('invitauser.step2')}}</p>
						</li>
						<li>
							<img src="../../assets/img/invitaUser/step3.png" alt="">
							<p>3.{{$t('invitauser.step3')}}</p>
						</li>
						<span class="none-box"></span>
						<li>
							<img src="../../assets/img/invitaUser/step4.png" alt="">
							<p>4.{{$t('invitauser.step4')}}</p>
						</li>
					</ul>
				</div>
			</li>
		</ul>
		<!-- <div class="go-top" :class="isDown?'movedown':'moveup'">
			<img src="../../assets/img/invitaUser/gotop.png" alt="">
			<span>回到顶部</span>
		</div> -->
		<div v-show="drawerShow" @click="drawerShow=false" class="drawer">
			<img src="../../assets/img/invitaUser/t1.png" alt="">
		</div>
	</div>
</template>

<script>
export default {
	data(){
		let that = this;
		return {
			inTouch:false,
			adinTouch: false,
			iosinTouch: false,
			imgSrc: new Date().getTime(),
			endY: 0,
			startY: 0,
			iostitle: false,
			isDown:false,
			drawerShow: false,
			// androidUrl: 'https://m.coinlot.io/ajax/downLoading',
			// androidUrl: 'https://m.coinlot.io/coinlot_signed.ipa',
			// androidUrl: 'https://m.coinlot.io/cgandroid_1.apk',
			androidUrl:  that.$imgJavaUrl+ '/app/gqg-1.0.3.apk',
			iosUrl: 'itms-services://?action=download-manifest&url=https://ts.gqg.com/gqg-plist/manifest-gqg.plist',
		}
	},
	created() {
		this.getVersion();
	},
	methods:{
		signHandle() {
			this.drawerShow = true;
		},
		// 安卓下载
		androidDownload() {
			if(!this.devTest()) return;
			if(this.$clientEnv.ios) return;
			this.downloadHandle(this.androidUrl);
		},
		// ios下载
		iosDownload() {
			if(!this.devTest()) return;
			if(this.$clientEnv.android) return;
			this.downloadHandle(this.iosUrl);
			this.iostitle = true;
		},
		// app环境监测
		devTest() {
			if(this.$clientEnv.weixin && this.$clientEnv.android) {
				this.drawerShow = true;
				return;
			}
			return true;
		},
		downloadHandle(url) {
			try {
				let a = document.createElement('a');
				a.style.display = 'none';
				document.body.appendChild(a);
				a.download;
				a.href = url;
				a.click();
				document.body.removeChild(a);
			} catch (error) {
			}
		},
		pageMoveHandle(e) {
			this.endY = e.touches[0].pageY;
			let move = this.startY - this.endY;
			move >= 0 ? (this.isDown = true) : (this.isDown = false)
		},
		startInfo(e) {
			this.startY = e.touches[0].pageY;   // 
		},
		getVersion() {
			this.$axios({
        url: '/Ajax/getEdition',
        baseURL: this.$phpUrl,
        method: 'get',
        withCredentials: false
    	}).then(res => {
				if(res.status === 200 && res.data.k === 'apk') {
					this.androidUrl = res.data.url;
				}
			})
		}
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
			width: 199px;
			height: 225px;
			margin: 20px auto;
		}
		.title{
			font-size: 34px;
			color: #ffffff;
			text-shadow: 3px 4px 5px rgba(0,0,0, 0.75);
		}
		.from{
			margin-top: 36px;
			h4{
					width: 187px;
					height: 44px;
					font-size: 45px;
					line-height: 32px;
					color: #ffffff;
					font-weight: normal;
					margin: 100px auto 80px;
			}
			.btn{
				text-align: center;
				margin: 0 auto 52px;
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
				// &:nth-last-child(2) {
				// 	background: #1360b7;
				// 	a{
				// 		color: #fefeff;
				// 	}
				// }
				.touchcolor{
					background: #efefef;
				}
			}
		}
	}
	.step-box{
		// height: 200px;
		// background: #6666;
		position: absolute;
		z-index: 1;
		color: #ffffff;
		width: 100%;
		top: 0;
		h3{
			margin: 68px auto 42px;
			font-size: 45px;
			font-weight: normal;
			color: #ffffff;
		}
		.step-title{
			display: flex;
			justify-content: center;
			align-items: center;
			&>div{
				&:nth-child(1){
					width: 60px;
					height: 74px;
					margin-right: 28px;
				}
				&:nth-child(2){
					text-align: left;
				}
			}
		}
		&>ul{
			display: flex;
			justify-content: center;
			flex-wrap: wrap;
			.none-box{
				width: 44px;
				display: block;
			}
			&>li{
				width: 40%;
				margin-top: 64px;
				text-align: left;
				p{
					width: 273px;
					height: 23px;
					margin: 32px auto 15px;
					font-size: 22px;
					color: #ffffff;
				}
				&:nth-child(3n){
					text-align: right;
				}
			}
		}
	}
	// .go-top{
	// 	position: absolute;
	// 	bottom: 156px;
	// 	right: 40px;
	// 	// opacity: 0.7;
	// 	color: #fff;
	// 	img{
	// 		display: block;
	// 		width: 78px;
	// 		margin: 0 auto 24px;
	// 	}
	// }
	// .moveup{
	// 	opacity: 0.1;
	// 	transition: opacity 0.8s;		
	// }
	// .movedown{
	// 	opacity: 1;
	// 	transition: opacity 0.8s;	
	// }
	.drawer{
		position: absolute;
		width: 100%;
		height: 100%;
		background: rgba(62,62,62, 0.6);
		z-index: 10;
		top: 0;
		left: 0;
		img{
			height: 400px;
			width: auto;
			position: absolute;
			right: 0;
			top: 0;
		}
	}
	.ios-title{
		color: #fff;
		padding-top: 24px;
	}
}
.img-gohome{
	height: 33px;
	width: 19px;
	position: fixed;
	top:30px;
	z-index: 1000;
	left: 40px;;
}
</style>
