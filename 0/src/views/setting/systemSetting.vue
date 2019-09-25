<template>
    <div>
        <div class="system-menu">
            <div class="system-menu-title">{{$t('setting.upwarning')}}</div>
            <div class="system-menu-sub swit">
                <van-switch
                    v-model="isChecked"
                    size="24px"
                    active-color="rgb(133,191,133)"
                    inactive-color="#ccc"
                    @change = 'changeHandle'
                />
            </div>
        </div>

        <div class="system-menu">
            <div class="system-menu-title">{{$t('setting.languageDefault')}}</div>
            <div class="system-menu-sub">{{$t('setting.chinese')}}</div>
        </div>
        <div class="system-menu">
            <div class="system-menu-title">{{$t('setting.priceMethod')}}</div>
            <div class="system-menu-sub">USDT</div>
        </div>
    </div>
</template>

<script>
import { Switch } from 'vant'
export default {
    components: {
        vanSwitch: Switch
    },
    data(){
        return{
            //爆仓预警开关
            isChecked: true,
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            // vm.$store.commit('changeNoMenu', false);
            //从localStorage里面，控制爆仓预警
            if( localStorage.getItem("wainS")==="false"){
                vm.isChecked=  false;
                vm.$store.commit('ifOpen', false);
            }else if(localStorage.getItem("wainS")==="true"){
                vm.isChecked=  true;
                vm.$store.commit('ifOpen', true);
            }else{
                vm.$store.commit('ifOpen', true);
            }
        });
    },
    created() {
        this.$store.commit('changeNoMenu', false);
    },
    // beforeRouteLeave(to, from, next){
    //     this.$store.commit('changeNoMenu', true);
    //     next();
    // },
    methods: {
        //爆仓预警的change事件
        changeHandle(val) {
            //将状态啊永久存储
            localStorage.setItem("wainS",val)
        }
    }
}
</script>

<style lang='less' scoped>
.system-menu{
    height: 120px;
    background: #fff;
    margin-top: 30px;
    padding: 0 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28px;
	line-height: 60px;
	letter-spacing: 0px;
    color: #464646;
    &-sub{
        color: #3e80ca;
        padding-right: 75px;
    }
    .swit{
        margin-top:2%;
    }
}
.upwaining{
    width: 85px;
    height: 53px;
    background-color: rgb(133,191,133);
    border-radius: 50px;
    div{
        width: 46px;
        height: 46px;
        background-color: rgba(219,219,219,0.75);
        border-radius: 50%;
        
    }
}
</style>
