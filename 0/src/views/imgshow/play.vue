<template>
    <div class="play-box">
        <div class="play" @click="goBack">
            <img class="play-goback" src="../../assets/img/setting/baise_go.png" alt="">
        </div>
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    methods:{
        goBack() {
            this.$router.go(-1);
        }
    }
}
</script>
<style lang="scss" scoped>
.play{
    position: fixed;
    z-index: 999;
    left: 0px;
    top:0px;
    padding: 26px 30px 20px 32px;
}
.play-goback{
    width: 19px;
    height: auto;
}
</style>
