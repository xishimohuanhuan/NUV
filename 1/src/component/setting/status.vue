<template>
    <div class="status">
        <div class="status-img"><img :src="imgsrc" alt=""></div>
        <p class="status-title">{{$t(renderData.title)}}</p>
        <p class="status-item" v-for="item in renderData.body" :key="item.name">
            <span>{{$t(item.key)}}：</span>
            <span>{{item.val}}</span>
        </p>
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        renderData: Object
    },
    data() {
        return {
        }
    },
    computed: {
        imgsrc() {
            const IMG = {
                '3': require('../../assets/img/setting/load.png'),
                '1': require('../../assets/img/setting/succeed.png'),
                '0': require('../../assets/img/setting/fail.png'),
            }
            return IMG[this.renderData.status];
        }
    }
}
</script>

<style lang='less' scoped>
.status{
    &-img{
        img{
            width: 131px;
            height: auto;
            margin: 128px 0 72px;
        }
    }
    &-title{
        height: 34px;
        font-size: 34px;
        letter-spacing: 0px;
        color: #575757;
        margin-bottom: 41px; 
    }
    &-item{
        font-size: 28px;
        line-height: 48px;
    }
}

</style>
