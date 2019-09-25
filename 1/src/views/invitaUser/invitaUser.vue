<template>
    <div class="invitaUser">
        <router-view></router-view>
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

<style lang='less' scoped>
.invitaUser{
    height: 100%;
}
</style>
