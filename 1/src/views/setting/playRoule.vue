<template>
    <div class="lxa-status-box" >
        <img @click="goto(1)" src="../../assets/img/transaction/tuo.png" alt="">
        <img @click="goto(2)" src="../../assets/img/transaction/tut.png" alt="">
        <img @click="goto(3)" src="../../assets/img/transaction/tutr.png" alt="">
        <img @click="goto(4)" src="../../assets/img/transaction/tuf.png" alt="">
    </div>
</template>

<script>
export default {
    // beforeRouteEnter (to, from, next) {
    //     next(vm => {
    //         vm.$store.commit('changeNoMenu', false);
    //     });
    // },
    // beforeRouteLeave(to, from, next){
    //     this.$store.commit('changeNoMenu', true);
    //     next();
    // },
    created() {
        this.$store.commit('changeNoMenu', false);
    },
    methods:{
        goto(data){
            switch(data){
                case 1:
                    this.$router.push('/play/playChildren');
                break;
                case 2:
                    this.$router.push('/play/playChildrenT');
                break;
                case 3:
                    this.$router.push('/play/playChildrenTh/1');
                break;
                case 4:
                    this.$router.push('/play/playChildrenf');
                break;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.lxa-status-box{
    // height: 100%;
    // overflow: auto;
}
img{
    width: 670px;
    height: 230px;
    margin-bottom: 58px;
    border-radius: 20px;
}
img:nth-child(1){
    margin-top: 51px;
}
</style>
