<template>
	<div class="block-input">
		<div class="input-box">
			<input :type="type" v-model="inputV" @input="inputHandle" ref="inputDom">
		</div>
		<div class="show-box" @click="inputFocus">
			<span v-for="(item,index) in valLength" :key="index">
				{{ type==='password' ? (inputV[index] && '●') : inputV[index]}}
			</span>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			inputV: '',
			inputArr: []
		}
	},
	props: {
		value: [String, Number],
		changeBlur: [Boolean],
		focus: {
			type: Boolean,
			default: true
		},
		type: {
			type: String,
			default: 'tel',
			// validator: function(val) {
			// 	const pool = ['text', 'password', 'tel']
			// 	return val === 'text' || val === 'password' || val === 'tel';
			// }
		},
		valLength: {
			type: Number,
			default: 6
		},
		verify: {
			type: [String, Function],
			default() {
				return 'pureNumber'
			}
		}
	},
	created() {
		this.inputV = this.value;
		if(process.env.NODE_ENV === 'development') {
			if(String(this.value).length > this.valLength) {
				typeof console !== 'undefined' && console.error(("[BlockInput] " + 'value的默认值长度不能大于valLength'));
			}
		}
	},
	watch: {
		changeBlur(val) {
			if(val) {
				this.$refs.inputDom.blur();
			}
		},
	},
	mounted() {
		if(this.focus) {
			this.inputFocus();
		}
	},
	methods: {
		inputHandle() {
			this.verifyHandle('inputV');
			this.$emit('input', this.inputV);
			if(this.inputV.length ===  this.valLength) {
				this.$emit('inputEnd', this.inputV);
			}
		},
		setValHandle(val) {
			/**
			 * 在父组件中更改输入框的值
			 * @param  {Number | String} val
			 * 在组件上绑定 ref：
			 * 		<BlockInput ref="blockInput" ></BlockInput>
			 * 在父组件使用： this.$refs.blockInput.setValHandle(val)
			 * 
			*/
			this.inputV = val;
		},
		verifyHandle(value) {
			if(this.verify === 'pureNumber') {
				this[value] = String(this[value]).replace( /[^0-9]/g,'');
			}
			this[value] = this[value].slice(0, this.valLength);
		},
		inputFocus() {
			this.$refs.inputDom.focus();
		}
	}
}
</script>

<style lang='less' scoped>
.block-input{
	position: relative;
	height: 90px;
	width: 100%;
	.input-box, .show-box{
		position: absolute;
		width: 100%;
		height: 100%;
		// border: 1px solid pink;
		display: flex;
		justify-content: space-between;
		align-items: center;
		// background: #fff;
	}
	.input-box{
		z-index: -9;
	}
	.input-box input {
		// background: #312682;
		width: 100%;
		height: 100%;
		// z-index: 1;
		opacity: 0;
		color: transparent;
		text-indent: -999px;
		margin-left: -100%;
	}
	.show-box span{
		border-radius: 10px;
		border: solid 1PX #d2d2d2;
		width: 89px;
		height: 90px;
		display: block;
		line-height: 89px;
		text-align: center;
	}
}
</style>
