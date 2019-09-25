<template>
    <div class="setting-box">
        <!-- <router-link to="/phoneLogin">原用户中心</router-link> -->
        <div class="setting">
            <img class="setting-goback" @click="goBack" src="../../assets/img/setting/arrow_left.png" alt="">
            <img @click="goRecord" v-if="showList" class='setting-img' src="../../assets/img/assets/records.png" alt="">
        </div>
        <div class="setting-body">
            <h2>{{$t(headTitle)}}</h2>
            <router-view></router-view>
        </div>
        <toast 
            :isShow='isShowIf'
            :showToastType="'operate'" 
            :toastContent="'确认放弃设置邮箱密码？'" 
            :showToastImgType="'warning'" 
            :toastTitle="''" 
            :toastOperateTitle="'确认'" 
            :toastAssistOperateTitle="'取消'" 
            @handle-main-click="mainClick" 
            @handle-assist-click="isShowIf=false"
        />
    </div>
</template>

<script>
export default {
    data() {
        return {
            headTitle: '',
            showList:false,
            isShowIf:false
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            let id = vm.$getCookie('userId') && JSON.parse(decodeURIComponent(vm.$getCookie('userId'))).userId;
            vm.headTitle = to.meta.title;
            vm.$store.commit('changeNoMenu', false);
            // vm.$loginRoute(`${to.path}`);   //路由拦截
            // console.log(vm.$route.path)
            if(vm.$route.path==='/setting/invitTransfer'){
                vm.showList=true;
            }else{
                vm.showList=false;
            }
        });
    },
    beforeRouteUpdate(to, from, next) {
        this.headTitle = to.meta.title
        if(to.path!=='/setting/invitTransfer'){
            this.showList=false;
        }else{
            this.showList=true;
        }
        next();
    },
    beforeRouteLeave(to, from, next){
        this.$store.commit('changeNoMenu', true);
        // 
        let topath = to.path;
        
        let link = ['/setPassWord', '/quickLogin', '/phoneLogin', '/loginRegister '];
        if(link.includes(topath)){
            this.$router.push('/home');
        }
        next();
    },
    methods: {
        goBack() {
            // 邮箱注册 不想设置密码
            if(this.$route.name==='setLoginPass' && (!this.$getCookie('userId') || !JSON.parse(decodeURIComponent(this.$getCookie('userId'))).userId)){
                this.isShowIf=true;
                return;
            }
            this.$needIosCallBack();
            if(this.$route.path==='/setting/invitation'){
                this.$router.push('/home');
                return;
            }
            if (sessionStorage.getItem('specialTreatment') === 'home') {
                sessionStorage.setItem('specialTreatment', null);
                location.href = location.origin + '/home';
                return;
            }
            // if (sessionStorage.getItem('specialTreatment') && JSON.parse(sessionStorage.getItem('specialTreatment')).msg) {
            //     sessionStorage.setItem('specialTreatment', null);
            //     location.href = location.origin + '/home';
            //     return;
            // }
            // 
            this.$router.go(-1);
        },
        //跳转到划转记录
        goRecord(){
            this.$router.push('/setting/invitRecord')
        },
        mainClick(){
            window.history.go(-2);
        }
    }
}
</script>

<style scoped lang='less'>
.setting-box{
    height: 100%;
    display: flex;
    flex-direction: column;
}
.setting{
    height: 80px;
    text-align: left;
    background: #fff;
    padding: 32px 26px 0;
    display: flex;
    justify-content: space-between;
    .setting-img{
        width: 36px;
        height: 42px;
    }
    &-goback{
        width: 19px;
        height: 33px;
        margin-left: 15px;
    }
}
.setting-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: scroll;
    overflow-x: hidden;
    h2{
        // padding: 60px 0 35px;
        padding: 0.8rem  0.346667rem 0.533333rem;
        background: #fff;
        // width: 184px;
        // height: 45px;
        text-align: left;
        // height: 120px;
        font-size: 45px;
        font-weight: bold;
        font-stretch: normal;
        box-sizing: content-box;
        letter-spacing: 0px;
        color: #202025;
    }

}

</style>
<style lang='less'>
.lxa-poptip{
    padding-top: 60px;
    height: 264px;
    font-size: 24px;
    font-weight: normal;
    line-height: 60px;
    letter-spacing: 0px;
    color: #979797;
    text-align: left;
    padding-left: 46px;
    margin-bottom: 100px;
    .isInportent{
        color: #f00;
    }
}
.lxa-status-box{
    border-top: 1px solid #dcdcdc;
    background: #fff;
    height: 100%;
}
.lxa-bottom-btn{
    height: 100px;
    width: 100%;
    background: #3e80ca;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 0;
    button{
        height: 100%;
        width: 100%;
        border: 0;
        outline: none;
        background: Transparent;
        font-size: 34px;
        letter-spacing: 0px;
        color: #ffffff;
    }
    &.disable {
        background: #dfdfdf;
    }
}
</style>
