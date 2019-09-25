<template>
    <div>
        <img src="../../assets/img/transaction/31.png" alt="">
        <img src="../../assets/img/transaction/32.png" alt="">
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
    div{
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
