<template>
	<div style="height:100%; position:relative">
		<headers @back="$goBack"></headers>
		<div class="liveCheck-container">
			<div class="liveCheck-header">
				<div class="liveCheck-header-box">
					<img src="../../assets/img/lifeCheck/pic1.png" class="liveCheck-header-img">
					<p class="liveCheck-header-p">平视镜头</p>
				</div>
				<div class="liveCheck-header-box">
					<img src="../../assets/img/lifeCheck/pic2.png" class="liveCheck-header-img">
					<p class="liveCheck-header-p">光线明亮</p></div>
				<div class="liveCheck-header-box">
					<img src="../../assets/img/lifeCheck/pic3.png" class="liveCheck-header-img">
					<p class="liveCheck-header-p">少于5M</p>
				</div>
			</div>
				<div class="liveCheck-content">
					<p class="liveCheck-content-title">录制一段带有<span class="liveCheck-content-tip">{{motions.name}}</span>的视频</p>
					<p class="liveCheck-content-action">请勿戴帽子，动作幅度不要过大</p>
				<div class="liveCheck-content-bg">
					<img src="../../assets/img/lifeCheck/act_5.4621d41.gif" class="liveCheck-content-gif">
				</div>
			</div> 
    <div class="liveCheck-bottton">
			<input type="file" capture="user" @change="chnageFile" accept="video/*" class="liveCheck-bottton-file">
				<p> 开始录制</p>
			</div>
		</div>
		<div v-if='loading' class="liveCheck-progress">
			<Loading type='component' :loading='loading'></Loading>
		</div>
		<toast 
			:showToastType="'operate'" 
			:toastContent="checkRes[resType].msg"
			:isShow="toastShow"
			:showToastImgType="checkRes[resType].type" 
			:toastTitle="checkRes[resType].title" 
			:toastOperateTitle="checkRes[resType].btnTitle" 
			@handle-main-click="mainClick(resType)"/>
	</div>
</template>

<script>
import headers from '../../component/header';
import Loading from '../../component/loading/index.vue';
import {getRealAuthInfo, getappid, getpassed, lifeCheck, userLifeCheck} from './userRequest.js';
import { uploadQiniuVideo } from '../../commons/qiniuUpload';
import myProgress from '../../component/progress';

export default {
	components: {
		headers,
		Loading,
		myProgress
	},
	data() {
		return {
			val: '',
			fontSize: '',
			toastShow: false,
			loading: false,
			motionsList: [{
				type: "BLINK",
				name: "眨眼"
			}, {
				type: "MOUTH",
				name: "张嘴"
			}, {
				type: "NOD",
				name: "点头"
			}, {
				type: "YAW",
				name: "摇头"
			}],
			motions: {
				type: "BLINK",
				name: "眨眼"
			},
			complexityList: [{
				type: "0",
				name: "简单模式"
			}, {
				type: "1",
				name: "正常模式"
			}, {
				type: "2",
				name: "困难模式"
			}, {
				type: "3",
				name: "地狱模式"
			}],
			complexity: {
				type: "1",
				name: "正常模式"
			},
			checkRes: [{
				msg: '验证失败，请重试',
				title: '失败',
				btnTitle: '我知道了',
				type: 'warning'
			}, {
				msg: '网络错误，请稍后重试',
				title: '失败',
				btnTitle: '我知道了',
				type: 'warning'
			}, {
				msg: '验证成功，请点击下一步',
				title: '成功',
				btnTitle: '下一步',
				type: 'success'
			}, {
				msg: '图形验证码错误或失效',
				title: '失败',
				btnTitle: '我知道了',
				type: 'warning'
			}, {
				msg: '操作频繁，请稍后再试',
				title: '失败',
				btnTitle: '我知道了',
				type: 'warning'
			}],
			resType: 0, //0 => 验证失败  1 => 网络错误  2 => 验证成功  3 => 图形验证码错误  2 => 操作频繁
			appId: {},
			imageId: '',
			code: ''
		}
	},
	created() {
		this.getAppId();
	},
	mounted() {
		this.chnageMotion();
	},
	methods: {
		chnageFile(e) {
			let file = e.target.files[0];
			if(file) {
				if (file.size > 5 * 1024 * 1024 ) {
					this.$Toast(this.$t('setting.realName.IDCartRule5'));
					return;
				}
				this.loading = true;
				this.uploadVideoQiniu(file);
			}
		},
		getAppId() {
			return getappid().then(res => {
				if(res.data.status === 200) {
					this.appId = {
					    appid: res.data.data.appid,
					    timestamp: res.data.data.timestamp,
					    sign: res.data.data.sign,
					}
					return res.data.data;
				}
			}).catch(err => {
				console.log(err);
			})
		},
		mainClick(type) {
			this.toastShow = false;
			switch(type) {
				case 0:
					// this.chnageMotion();
					this.$router.replace('/setting/checkcode');
					break;
				case 1:
					// this.chnageMotion();
					this.$router.replace('/setting/checkcode');
					break;
				case 2:
					this.$router.replace('/setting/realNameCheck?imageId='+this.imageId);
					break;
				case 3:
					this.$router.replace('/setting/checkcode');
					break;
				case 4:
					this.$router.replace('/setting/checkcode');
					break;
				default:
					break;
			}
		},
		async uploadVideoQiniu(file) {
			let observable = null;
			try {
				observable = await uploadQiniuVideo(file);
			} catch{
				this.checkResHandle(1); // 检测失败
				return ;
			}
			let next = (response) =>{
			}
			let error = (err) => {
					
			}
			let complete = (res) => {
				this.postCheckInfo(res.hash);
			}
			let subscription  = observable.subscribe(next, error, complete);
		},
		postCheckInfo(hash) {
			let {userId}= this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId')));
			let formData = new FormData();
			formData.append('userId', userId);
			formData.append('url', this.$imgJavaUrl+hash);
			formData.append('motions', this.motions.type);
			formData.append('complexity', this.complexity.type);
			formData.append('picCode', this.code);
			userLifeCheck(formData).then(res => {
				if(res.data.status === 200) {
					this.checkResHandle(2); // 检测成功
				} else if(res.data.code === '500') {
					this.checkResHandle(3); // 短信验证码错误
				} else if(res.data.code === '002') {
					this.checkResHandle(4); // 操作频繁
				} else {
					this.checkResHandle(0); // 检测失败
				}
			}).catch(() => {
				this.checkResHandle(1); // 网络错误
			})
		},
		async uploadVideoHandle(file){
			let filename = file.name;
			let appId = this.appId;
			try {
				if(!appId.sign) {
					appId = await this.getAppId();
				}
				this.postFile(file, appId.appid, appId.timestamp, appId.sign).then( res => {
					if(res.passed) {
						this.imageId = res.imageId;
						this.postCheck(res.passed);
					} else {
						this.checkResHandle(0); // 检测失败
					}
				});
			} catch(e) {
				this.checkResHandle(1); // 检测失败
			}
		},
		postCheck(passed) {
			let {userId}= this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId')));
			let params = {
				userId,
				hasPass: passed,
			};
			getpassed(params).then(res => {
				this.loading = false;
				if(res.data.status === 200) {
					this.checkResHandle(2); // 检测成功
				} else {
					this.checkResHandle(0); // 失败
				}
			}).catch(() => {
				this.checkResHandle(1); // 检测成功
			})
		},
		postFile(file, appid, timestamp, sign) {
			let formData = new FormData();
			formData.append('file', file);
			formData.append('appid', appid);
			formData.append('timestamp', timestamp);
			formData.append('sign', sign);
			formData.append('motions', this.motions.type);
			formData.append('complexity', this.complexity.type);
			return this.$axios({
				url: '/life/check',
				baseURL: this.$lifeCheck,
				method: 'post',
				data: formData,
			}).then(res => {
				if(res.data.code === 200) {
					return {
						passed: res.data.data.passed,
						imageId: res.data.data.feature_image_id,
					}
				} else {
					this.$normalToast(res.data.msg, 1500);
				}
			}).catch(() => {
				this.checkResHandle(1);
			})
		},
		checkResHandle(resType=0) {
			this.loading = false;
			this.toastShow = true;
			this.resType = resType;
		},
		// 随机一个动作
		chnageMotion() {
			let motion = Math.round(3 * Math.random());
			this.motions = this.motionsList[motion];
		}
	},
	beforeRouteEnter (to, from, next) {
		document.getElementsByTagName('html')[0].className = 'life';
		next(vm => {
			vm.$store.commit('changeNoMenu', false);
			vm.code = to.query.code;
			let user = vm.$getCookie('userId') && JSON.parse(decodeURIComponent(vm.$getCookie('userId')));
			getRealAuthInfo({id: user.userId}).then( res => {
				if((res.data.status !==200 ) || (res.data.data.idcardauth === 1) || (res.data.data.idcardauth === 3)) {
					vm.$router.go(-1);
					return;
				}
			})
		});
	},
	beforeRouteLeave(to, from, next){
		document.getElementsByTagName('html')[0].className = '';
		this.$store.commit('changeNoMenu', true);
		next();
	},
}
</script>

<style lang='less' scopde>
.liveCheck{
	&-container{
		width: 100%;
		height: 100%;
		background: #fff;
	}
	&-header{
		display: flex;
    justify-content: space-around;
    padding: 80px 0;
		box-shadow: 0 2.67px 16px #eee;
		&-box{
			&>img{
				width: 120px;
				height: 120px;
				margin: 25px auto
			}
			&>p{
				font-size: 24px;
				color: #999;
				text-align: center;
			}
		}
	}
	&-content{
		&-title{
			font-size: 40px;
			color: #999;
			margin-top: 60px;
			text-align: center;
		}
		&-tip{
			color: #005fff;
			font-weight: 700;
			font-size: 50px;
		}
		&-action{
			font-size: 32px;
			color: #999;
			text-align: center;
			padding-top: 30px;
		}
		&-bg{
			width: 100%;
			height: 730px;
			margin: 40px auto;
			background-image: url(../../assets/img/lifeCheck/living@2x.bff0a84.png);
			background-repeat: no-repeat;
			background-size: 100%;
			padding-top: 160px;
			position: relative;
		}
		&-gif{
			width: 300px;
			height: auto;
			margin: auto;
			display: block;
		}
	}
	&-bottton{
		position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #005fff;
    color: #fff;
    font-size: 32px;
    padding: 40px;
    box-sizing: border-box;
		text-align: center;
		&-file{
			position: absolute;
			display: block;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			opacity: 0;
		}
	}
	&-progress{
		position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, .2);
			z-index: 1200;
		&-box{
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			margin: auto;
			width: 300px;
			height: 300px;
		}
	}
}

</style>
