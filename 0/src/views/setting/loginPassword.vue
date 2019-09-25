<template>
	<div>
		登录密码
		<div class="input-keyboard">
			<span>{{val}}</span>
			<BlockInput v-model="val" :valLength='6' type='password'></BlockInput>
		</div>
	</div>
</template>

<script>
import BlockInput from '../../component/BlockInput'
export default {
	components: {
		BlockInput
	},
	data() {
		return {
			val: '',
		}
	}
}
</script>

<style lang='less' scopde>

</style>
