<template>
    <div id="headers">
        <img  v-if="isBack"   @click="back" class="goBack img" src="../assets/img/common/previous_page.png" alt="">
        <span class="title">{{title}}</span>
        <span class="rightTitle" @click="valueclick">{{value}}</span>
    </div>
</template>

<script>
    export default {
        methods:{
            valueclick(){
                this.$emit('vlueClick')
            },
            back(){
                this.$emit('back')
            },
        },
        props: {
            isBack: {
                type: Boolean,
                default: true
            },
            title:{
                type:String,
                default:''
            },
            value:{
                type:String,
                default:''
            }
        },
        name: "header.vue"
    }
</script>

<style lang="scss">
    #headers {
        background: #fff;
        height: 88px;
        width: 100%;
        text-align: left;
        line-height: 88px;
        padding-left: 41px;
        padding-right: 21px;
        position: sticky;
        top: 0;
        z-index: 1000;
        .img{
            position: absolute;
            top:25px;
            left:41px
        }
        .rightTitle {
            font-family: MicrosoftYaHei;
            font-size: 28px;
            font-weight: normal;
            font-stretch: normal;
            color: #3e80ca;
            float: right;
            margin-right: 30px;

        }
        .title {
            display: inline-block;
            transform: translateX(-50%);
            font-family: MicrosoftYaHei;
            font-size: 34px;
            font-weight: normal;
            font-stretch: normal;
            position: absolute;
            left:50%;
            color: #202025;
        }

        .goBack {
            width: 19px;
            height: 33px;
        }
    }
</style>