<template>
    <div>
        <div class="img-pla" v-if='isNEw==="1"'>
            <img src="../../assets/img/transaction/21.png" alt="">
            <img src="../../assets/img/transaction/22.png" alt="">
        </div>
        <div class="img-pla" v-if='isNEw==="2"'>
            <img src="../../assets/img/transaction/31.1.png" alt="">
            <img src="../../assets/img/transaction/32.1.png" alt="">
            <img src="../../assets/img/transaction/33.1.png" alt="">
        </div>
        <div v-if='isNEw==="2"' @click="goOne" class="btn-one">{{$t("newZh.preImme")}}</div>
    </div>
</template>
<script>
import { constants } from 'crypto';
export default {
    data(){
        return{
            isNEw:'1'
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.$store.commit('changeNoMenu', false);
            vm.isNEw=vm.$route.params.key;
        });
    },
    beforeRouteLeave(to, from, next){
        this.$store.commit('changeNoMenu', true);
        next();
    },
    methods:{
        goOne(){
            this.$router.push('/quickTrans/buy');
        }
    }
}
</script>
<style lang="scss" scoped>
    div.img-pla{
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
    .btn-one{
        position: fixed;
        bottom: 0;
        cursor: pointer;
        background-color: white;
        width: 100%;
        height: 100px;
        line-height: 100px;
        color: #3e80ca;
        font-size: 34px;
    }
</style>
