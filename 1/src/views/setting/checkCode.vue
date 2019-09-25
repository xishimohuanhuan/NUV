<template>
    <div class="box">
        <div class="box-info">
            <p class="title">请输入下发图形验证码</p>
            <div class="block">
                <img 
                    class="testImg" 
                    @click="imgSrc=new Date().getTime()"
                    :src='$interfaceJavaUrl+"/user/login/getCode?t="+imgSrc' 
                    alt=""
                >
                <BlockInput 
                    v-model="valphone" 
                    :valLength='4' 
                    type='tel'
                    :changeBlur='changeBlur'
                    @inputEnd="inputEndHandle"
                    ref="valphone"
                    :focus='true'
                ></BlockInput>
            </div>
        </div>
    </div>
</template>

<script>
import BlockInput from '../../component/BlockInput'
import { getCheckCode } from './userRequest.js'
export default {
    components:{
        BlockInput,
    },
    data() {
        return {
            valphone: '',
            // 是否失去焦点
            changeBlur:false,
            imgSrc: new Date().getTime(),
        }
    },
    methods: {
        inputEndHandle(code) {
            this.$router.replace('/lifeCheck?code='+code);
        }
    }
}
</script>

<style lang="less" scoped>
.box{
    border-top: 1px solid #dcdcdc;
    padding-top: 80px;
    flex: 1;
    background: #fff;
    &-info{
        width: 88%;
        margin: 0 auto;
    }
    .title{
        text-align: left;
    }
    .block{
        margin-top: 48px;
        display: flex;
        img{
            margin-right: 12px;
            width: 320px;
            height: 80px;
        }
    }
}
</style>