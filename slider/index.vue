<template>
	<div class="slider" v-if='isShowS'>
		<div 
			:class="['slider-model',model ? '':'slider-model1']"
			@click="isShowS=false"
		></div>
		<div class="slider-box">
			<div class="slider-box-top">
				<img class="slider-box-bg" ref="bgimage" :src='"data:image/png;base64,"+renderData.background' alt="">
				<!-- <span class="slider-box-ref">刷新</span> -->
				<img 
					@touchmove='moveHandle'
					@touchstart='startHandle'
					@touchend='endHandle'
					ref="check"
					:style='{top: (renderData.y/1.55)+"%", left: left+"px"}' 
					class="slider-box-check" 
					:src='"data:image/png;base64,"+renderData.slider' alt="">
			</div>
					<!-- :src='"http://pic25.nipic.com/20121112/9252150_150552938000_2.jpg"' alt=""> -->
			<!-- <div class="slider-box-bottom">
				<div class="bottom-drag" :style='{width: left+"px"}'>
					<div 
						class="bottom-arrow"
						@touchmove='moveHandle'
						@touchstart='startHandle'
						@touchend='endHandle'
						:style='{left: left+"px"}'
						><img src="../../assets/img/home/menu.png" alt=""></div>
				</div>
				<p class="bottom-text">拖动滑块验证</p>
			</div> -->
			<div class="sliderContainer">
				<div 
					class="sliderMask" 
					:style='{width: left1+"px"}'
				>
					<div 
						class="slider1"
						@touchmove='moveHandle'
						@touchstart='startHandle'
						@touchend='endHandle'
						ref='slideimg'
						:style='{left: left1+"px"}'
					>
						<span class="sliderIcon"></span>
					</div>
				</div>
				<span class="sliderText">向右滑动填充拼图</span>
			</div>
			<!-- 刷新 取消 -->
			<div class="end-re">
				<img 
					src="../../assets/img/setting/canclee.png" 
					@click="isShowS=false" 
					alt=""
				>
				<img 
					src="../../assets/img/setting/relo.png" 
					alt=""
					@click="isReAjax"
				/>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			renderData: {},
			left: 0,
			left1: 0,
			beginX: 0,
			bgimageWidth: 0,
			checkWidth: 0,
			slideimgWidth:0,
			isShowS:true,
			// 
			// model:true
		}
	},
	props: {
		// 是否有膜
		model: {
			type: Boolean,
			default: true
		}
	},
	created() {
		this.getImageData();
	},
	mounted() {
		let bgimage = this.$refs.bgimage;
		let check = this.$refs.check;
		let slideimg = this.$refs.slideimg;
		// this.bgimageWidth = Number(window.getComputedStyle(bgimage).width.replace(/[^0-9\.]/g,'')) || 0;
		this.bgimageWidth = bgimage.offsetWidth || 0;
		// this.checkWidth = Number(window.getComputedStyle(check).width.replace(/[^0-9\.]/g,'')) || 0;
		this.checkWidth = check.offsetWidth || 0;
		// this.slideimgWidth = Number(window.getComputedStyle(slideimg).width.replace(/[^0-9\.]/g,'')) || 0;
		this.slideimgWidth = slideimg.offsetWidth || 0;
	},
	methods: {
		getImageData() {
			let {userId}= this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId')));
			let formDate = new FormData();
			formDate.append('id', userId);
			this.$axios({
				url: '/api/sliding/info',
				method: 'post',
				data: formDate,
				baseURL:'http://172.16.1.224:8086',
				withCredentials: true
			}).then(res => {
				if(res.data.code === 0) {
					this.renderData = res.data.data; 
				}
				console.log(this.renderData.x)
			})
		},
		moveHandle(e) {
			let moveX = e.touches[0].pageX-this.beginX;
			// 
			if(moveX < (this.bgimageWidth - this.checkWidth)) {
				if(moveX<=0){
					this.left = 0;
					this.left1 = 0;
					return;
				}
				this.left = moveX;
				this.left1 = moveX;
			}else if(moveX < (this.bgimageWidth - this.slideimgWidth)){
				// 小的滑块
				this.left1 = moveX;
			}
		},
		endHandle(e) {
			let bgimage = this.$refs.bgimage;
			// let width =  window.getComputedStyle(bgimage).width.replace(/[^0-9\.]/g,'');
			let width =  bgimage.offsetWidth;
			let ratio = Number(width)/310;
			let res = this.left/ratio;
			// 滑动的位置
			this.$emit('DataLen',res);
		},
		startHandle(e) {
			this.beginX = e.touches[0].pageX;
		},
		// 刷新
		isReAjax(){
			this.getImageData();
			// this.left = 0;
			// this.left1 = 0;
		}
	}
}
</script>

<style lang='less' scoped>
.slider{
	&-model{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0,0,0,.1);
		z-index: 9999;
	}
	&-model1{
		background: rgba(0,0,0,0);
	}
	&-box{
		position: fixed;
		z-index: 10000;
		width: 550px;
		height: 475px;
		background-color: #fff;
		top: 20%;
		right: 0;
		left: 0;
		margin: auto;
		border-radius: 15px;
		overflow: hidden;
		&-top{
			position: relative;
			width: 100%;
			height: 280px;
		}
		&-bg{
			width: 100%;
			height: auto;
		}
		&-ref{
			position: absolute;
			top: 10px;
			right: 10px;;
		}
		&-check{
			position: absolute;
			width: 20%;
			height: auto;
			top: 0;
			left: 0;
		}
		&-bottom{
			width: 100% ;
			height: 80px;
			background: #ccc;
			position: relative;
			.bottom{
				&-drag{
					height: 100%;
					background: #0f0;
				}
				&-arrow{
					width: 60px;
					height: 100%;
					position: absolute;
					top: 0;
					bottom: 0;
					margin: auto;
					box-shadow: 0 0 3px rgba(0,0,0,.3);
					img{
						height: 100%;
						width: auto;
						padding: 20%;
						padding-left: 0;
					}
				}
				&-text{
					color: #333;
					line-height: 80px;
					font-size: 38px;
				}
			}
		}
		.end-re{
			margin-top: 25px;
			display: flex;
			justify-content: space-between;
			margin-left: 20px;
			margin-right: 20px;
			img{
				height: 50px;
				width: auto;
			}
		}
	}
}
.sliderContainer {
	position: relative;
	text-align: center;
	width: 550px;
	height: 90px;
	line-height: 90px;
	// margin-top: 15px;
	background: #f7f9fa;
	color: #45494c;
	border: 1PX solid #e4e7eb;
	border-left: none;
	border-right: none;
	border-radius: 3px;
}

.sliderContainer_active .slider1 {
	height: 88px;
	top: -1px;
	border: 1px solid #1991FA;
}

.sliderContainer_active .sliderMask {
	height: 88px;
	border-width: 1px;
}

.sliderContainer_success .slider1 {
	height: 88px;
	top: -1px;
	border: 1px solid #52CCBA;
	background-color: #52CCBA !important;
}

.sliderContainer_success .sliderMask {
	height: 88px;
	border: 1px solid #52CCBA;
	background-color: #D2F4EF;
}

.sliderContainer_success .sliderIcon {
	background-position: 0 0 !important;
}

.sliderContainer_fail .slider1 {
	height: 88px;
	top: -1px;
	border: 1px solid #f57a7a;
	background-color: #f57a7a !important;
}

.sliderContainer_fail .sliderMask {
	height: 88px;
	border: 1px solid #f57a7a;
	background-color: #fce1e1;
}

.sliderContainer_fail .sliderIcon {
	top: 14px;
	background-position: 0 -82px !important;
}

.sliderContainer_active .sliderText,
.sliderContainer_success .sliderText,
.sliderContainer_fail .sliderText {
	display: none;
}

.sliderMask {
	position: absolute;
	left: 0;
	top: 0;
	height: 90px;
	border: 0 solid #1991FA;
	background: #D1E9FE;
	// margin-left: calc(20% - 70px);
}

.slider1 {
	position: absolute;
	top: 0;
	left: 10px;
	width: 90px;
	height: 90px;
	background: #fff;
	box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
	cursor: pointer;
	transition: background .2s linear;
}

.slider1:hover {
	// background: #1991FA;
}

.slider1:hover .sliderIcon {
	// background-position: 0 -13px;
}

.sliderIcon {
	display: inline-block;
	width: 100%;
	height: 100%;
	background: url('../../assets/img/setting/goimg.png') no-repeat;
	background-size: 100% 100%;
}
</style>
