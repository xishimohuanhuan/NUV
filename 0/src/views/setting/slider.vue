<template>
	<div>
		<div class="captcha" :style="{width: options.width}">
			<canvas ref="canvasCtx"></canvas>
			<i ref="refreshIcon">刷新</i>
			<canvas ref="blockCtx" class="block"></canvas>
			<div class="sliderContainer">
				<div class="sliderbg" ref="sliderbg"></div>
				<div class="sliderMask" ref="sliderMask">
					<div class="slider" ref="slider">
						<i ref="sliderIcon">&lt;</i>
					</div>
				</div>
				<span class="sliderText" ref="text"></span>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			options: {
				width: 280,     // canvas宽度
        height: 155,    // canvas高度
        PI: Math.PI,
        sliderL: 42,    // 滑块边长
        sliderR: 9,     // 滑块半径
        offset: 5,      // 容错偏差
        loadingText: '正在加载中...',
        failedText: '再试一次',
        barText: '向右滑动填充拼图',
        repeatIcon: 'fa fa-repeat',
				maxLoadCount: 3,
				canvas: null,
				block: null,
				sliderContainer: null,
				refreshIcon: null,
				slider: null,
				sliderMask: null,
				sliderIcon: null,
				text: null,
				canvasCtx: null,
				blockCtx: null,
        localImages: function () {
            return 'images/Pic' + Math.round(Math.random() * 4) + '.jpg';
        }
			}
		}
	},
	props: {
		option: {
			type: Object,
			default() {
				return {}
			}
		}
	},
	created() {
		// this.initImg();
	},
	mounted() {
		this.canvas =  this.$refs.canvasCtx;
		this.block =  this.$refs.blockCtx;
		this.sliderContainer =  this.$refs.sliderbg;
		this.refreshIcon =  this.$refs.refreshIcon;
		this.slider =  this.$refs.slider;
		this.sliderMask =  this.$refs.sliderMask;
		this.sliderIcon =  this.$refs.sliderIcon;
		this.text =  this.$refs.text;
		this.canvasCtx =  this.$refs.canvasCtx.getContext('2d');
		this.blockCtx =  this.$refs.blockCtx.getContext('2d');
		this.initImg();

	},
	methods: {
		initImg() {
			let that = this;
			let L = this.options.sliderL + this.options.sliderR * 2 + 3; // 滑块实际边长
			let drawImg = function (ctx, operation) {
				let l = that.options.sliderL;
				let r = that.options.sliderR;
				let PI = that.options.PI;
				let x = that.x;
				let y = that.y;
				ctx.beginPath();
				ctx.moveTo(x, y);
				ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI);
				ctx.lineTo(x + l, y);
				ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI);
				ctx.lineTo(x + l, y + l);
				ctx.lineTo(x, y + l);
				ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true);
				ctx.lineTo(x, y);
				ctx.lineWidth = 2;
				ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
				ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
				ctx.stroke();
				ctx[operation]();
				ctx.globalCompositeOperation = 'destination-over';
			};
			let getRandomNumberByRange = function (start, end) {
				return Math.round(Math.random() * (end - start) + start);
			};
			let img = new Image();
			img.crossOrigin = "Anonymous";
			let loadCount = 0;
			img.onload = function () {
				that.x = getRandomNumberByRange(L + 10, that.options.width - (L + 10));
				that.y = getRandomNumberByRange(10 + that.options.sliderR * 2, that.options.height - (L + 10));
				drawImg(that.canvasCtx, 'fill');
				drawImg(that.blockCtx, 'clip');
				that.canvasCtx.drawImage(img, 0, 0, that.options.width - 2, that.options.height);
				that.blockCtx.drawImage(img, 0, 0, that.options.width - 2, that.options.height);
				let y = that.y - that.options.sliderR * 2 - 1;
				let ImageData = that.blockCtx.getImageData(that.x - 3, y, L, L);
				that.block.width = L;
				that.blockCtx.putImageData(ImageData, 0, y);
				that.text.innerText = '向右滑动填充拼图';
			};
			img.onerror = function () {
				loadCount++;
				if (window.location.protocol === 'file:') {
					loadCount = that.options.maxLoadCount;
					console.error("can't load pic resource file from File protocal. Please try http or https");
				}
				if (loadCount >= that.options.maxLoadCount) {
					that.text.text('加载失败').addClass('text-danger');
					return;
				}
				img.src = that.options.localImages();
			};
			img.setSrc = function () {
				let src = '';
				loadCount = 0;
				if (!src || src === '') src = 'https://picsum.photos/' + that.options.width + '/' + that.options.height + '/?image=' + Math.round(Math.random() * 20);
				img.src = src;
			};
			img.setSrc();
			this.text.innerText = this.options.loadingText;
			this.img = img;
		}
		
	}
}
</script>

<style lang='less' scoped>
.captcha {
	position: relative;
}
.block {
  position: absolute;
  left: 0;
  top: 0;
}

.sliderContainer {
  position: relative;
  text-align: center;
  line-height: 40px;
  background: #f7f9fa;
  color: #45494c;
  border-radius: 2px;
}

.sliderbg {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  background-color: #f7f9fa;
  height: 40px;
  border-radius: 2px;
  border: 1px solid #e6e8eb;
}

.sliderContainer_active .slider {
  top: -1px;
  border: 1px solid #1991FA;
}

.sliderContainer_active .sliderMask {
  border-width: 1px 0 1px 1px;
}

.sliderContainer_success .slider {
  top: -1px;
  border: 1px solid #52CCBA;
  background-color: #52CCBA !important;
}

.sliderContainer_success .sliderMask {
  border: 1px solid #52CCBA;
  border-width: 1px 0 1px 1px;
  background-color: #D2F4EF;
}

.sliderContainer_fail .slider {
  top: -1px;
  border: 1px solid #f57a7a;
  background-color: #f57a7a !important;
}

.sliderContainer_fail .sliderMask {
  border: 1px solid #f57a7a;
  background-color: #fce1e1;
  border-width: 1px 0 1px 1px;
}

.sliderContainer_active .sliderText, .sliderContainer_success .sliderText, .sliderContainer_fail .sliderText {
  display: none;
}

.sliderMask {
  position: absolute;
  left: 0;
  top: 0;
  height: 40px;
  border: 0 solid #1991FA;
  background: #D1E9FE;
  border-radius: 2px;
}

.slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  background: #fff;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: background .2s linear;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slider:hover {
  background: #1991FA;
}

.slider:hover .sliderIcon {
  background-position: 0 -13px;
}

.sliderText {
  position: relative;
}

.sliderIcon {

}

.refreshIcon {
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
  margin: 6px;
  color: rgba(0,0,0,.25);
  font-size: 1rem;
  z-index: 5;
  transition: color .3s linear;
}

  .refreshIcon:hover {
    color: #6c757d;
  }

</style>
