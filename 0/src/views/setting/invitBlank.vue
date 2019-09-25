<template>
    <iframe ref="ifr" :height="height" width="100%" scrolling="no" :src="iframeSrc" frameborder="0"></iframe>
</template>

<script>
import {getinvitBlank} from './userRequest.js'
export default {
    data() {
        return {
        iframeSrc: "",
        height: window.innerHeight,
        lang: "zh-cn"
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            // 从上一页面要跳转会首页
            if(from.fullPath!=='/home'){
                vm.$router.push('/home')
                return;
            }
            // bug...
            if(localStorage.getItem('isAgent')==0 || localStorage.getItem('isAgent')==='undefined'){
                // if(localStorage.getItem('isAgent')==0){
                vm.$store.commit('changeLoading', true);
                let userId=JSON.parse(decodeURIComponent(vm.$getCookie('userId'))).userId;
                getinvitBlank({userId:userId,coin:'usdt'}).then(res=>{
                    vm.$store.commit('changeLoading', false);
                    //判断是否有邀请数据
                    if(res.data.status===400 && res.data.code==='001'){
                        // 没有邀请数据
                        vm.$router.push('/invit')
                        return;
                    }
                    if(res.data.status===200){
                        // 有邀请数据
                        vm.$router.push('/notInvitation')
                        return;
                    }
                })
                
            }else if(localStorage.getItem('isAgent')==1){
                // 挑经济人页面
                vm.$router.push('/setting/invitation')
            }else{
                vm.$router.push('/notInvitation')
            }
        });
    },
    destroyed() {
        this.$store.commit('changeLoading', false);
    },
};
</script>
