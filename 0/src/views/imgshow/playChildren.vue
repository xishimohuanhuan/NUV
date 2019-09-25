<template>
    <div class="imgTu">
        <img src="../../assets/img/transaction/01.png" alt="">
        <img src="../../assets/img/transaction/02.png" alt="">
        <img src="../../assets/img/transaction/03.png" alt="">
    </div>
</template>
<script>
export default {
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.$store.commit('changeNoMenu', false);
        });
    },
    beforeRouteLeave(to, from, next){
        this.$store.commit('changeNoMenu', true);
        next();
    },
}
</script>
<style lang="scss" scoped>
    .imgTu{
        width: 100%;
        height: 100%;
        min-height: 2000px;
        overflow: auto;
        img{
            display: block;
            height: auto;
            width: 100%;
        }
        
    }
</style>
