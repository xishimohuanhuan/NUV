<template>
    <div class="body-box">
        <div class="lxa-status-box" v-show="!myLoding">
            <Status :renderData="statusData">
                <div class="lxa-bottom-btn">
                    <button @click="goChangePhone">{{$t('setting.tel.changeTel')}}</button>
                </div>
            </Status>
        </div>
    </div>
</template>

<script>
import {getUserInfo} from './userRequest.js'
import Status from '../../component/setting/status.vue'
export default {
    components: {
        Status,
    },
    data() {
        return {
            statusData: {
                title: '',
                status: 1,
                body: [
                    {
                        key: '',
                        name: '',
                        val: ''
                    },
                ]
            }
        }
    },
    computed: {
        myLoding() {
            return this.$store.state.loading;
        },
    },
    methods: {
        statusDataHandle(data){
            if(data.mobileStatus === 0) return;
            // 处理手机绑定信息
            const TITLE = {
                '1': 'setting.tel.statusData1',
            }
            const KEY = {
                '1': ['setting.tel.phoneNumber'],
            }
            const VAL = {
                '1': ['mobile'],
            }
            this.statusData.status = data.mobileStatus;
            this.statusData.title = TITLE[data.mobileStatus];
            this.statusData.body = KEY[data.mobileStatus].map((item, index) => {
                let key = item;
                let name =  VAL[data.mobileStatus][index];
                let val =  data[VAL[data.mobileStatus][index]];
                return {
                    key,
                    val,
                    name
                }
            })
            this.$store.commit('changeLoading', false);
        },
        goChangePhone() {
            this.$router.push('/setting/changephone')
        }
    },
    created() {
        this.$store.commit('changeNoMenu', false);
    },
    beforeRouteEnter(to, from, next) {
        let userInfo = to.params;
        let len = Object.keys(userInfo).length;
        next(vm => {
            // vm.$store.commit('changeNoMenu', false);
            vm.$store.commit('changeLoading', true);
            if(len){
                vm.statusDataHandle(userInfo);
            } else{
                // 如果路由中没有email,重新请求
                let {userId}= vm.$getCookie('userId') && JSON.parse(decodeURIComponent(vm.$getCookie('userId')));
                getUserInfo({userId})
                .then(res => {
                    if(res.status === 200){
                        vm.statusDataHandle(res.data.data);
                    }
                }).catch(() => {
                    vm.$store.commit('changeLoading', false);
                })
            }
        });
    },
    beforeRouteLeave(to, from, next){
        // this.$store.commit('changeNoMenu', true);
        this.$store.commit('changeLoading', false);
        next();
    },
}
</script>

<style scoped lang='less'>
.body-box{
    flex: 1;
}
</style>
