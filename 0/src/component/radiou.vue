<template>
    <div id="radiou" @click="changeRadiou">
        <div class="main">
            <img v-if="ischange" src="../assets/img/common/active.png" alt="">
        </div>
    </div>
</template>

<script>
    export default {
        methods:{
            changeRadiou(){
                this.ischange=!this.ischange;
                this.$emit('input',this.ischange)
            }
        },
        data(){
            return{
                ischange:false
            }
        }
    }
</script>

<style lang="scss">
#radiou{
    display: inline-block;
    .main{
        width: 40px;
        height: 40px;
        background: url("../assets/img/common/radiou .png");
        background-size: contain;
        margin-top: 2px;
    }
}
</style>