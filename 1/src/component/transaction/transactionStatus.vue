<template>
    <div v-if="value" class="genner-status" :class="className">
        <div class="status-no-val"><img src="../../assets/img/transaction/norecord.png" alt=""></div>
        <div class="status-title"><p>{{$t(title)}}</p></div>
        <div v-if="btnShow" class="status-btn" @click="btnClick"><p class="btn"><a href="javascript:void(0)">{{$t(btnval)}}</a></p></div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            status: 1,
        }
    },
    props: {
        title: {
            type: String,   // 图片下的提示，必需
            required: true
        },
        btnval: {
            type: String,   // 按钮的值， 必需
            required: true
        },
        value: {
            type: Boolean,  // 是否显示，用v-modle绑定，默认显示
            default: true
        },
        btnShow: {
            type: Boolean,  // 是否显示按钮，用v-modle绑定，默认显示
            default: true
        },
        className: String
    },
    methods: {
        btnClick() {
            // 按钮的点击事件，在父组件中绑定 btnclick事件
            this.$emit('btnclick')
        }
    }
}
</script>

<style lang='less' scoped>
.genner-status{
    text-align: left;
    .status-no-val{
        margin-left: 282px;
        img{
            width: 200px;
            height: auto;
        }
    }
    .status-title{
        margin: 31px 281px;
        font-size: 28px;
        color: #a9a9a9;
    }
    .status-btn p{
        margin-left: 283px;
        text-align: center;
        line-height: 55px;
        width: 165px;
        height: 55px;
        background-color: #3e80ca;
        border-radius: 5px;
        a{
            color: #fff;
            font-size: 24px;
        }
    }

}
</style>
