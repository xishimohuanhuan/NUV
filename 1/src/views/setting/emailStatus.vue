<template>
    <div class="body-box">
        <div class="lxa-status-box" v-show="!myLoding">
            <Status :renderData="statusData">
                <div class="lxa-bottom-btn">
                    <button @click="goChangeEmail">{{$t('setting.email.changeEmail')}}</button>
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
            if(data.emailStatus === 0) return;
            // 处理邮箱绑定信息
            const TITLE = {
                '1': 'setting.email.statusData1',
            }
            const KEY = {
                '1': ['setting.email.bindEmail'],
            }
            const VAL = {
                '1': ['email'],
            }
            this.statusData.status = data.emailStatus;
            this.statusData.title = TITLE[data.emailStatus];
            this.statusData.body = KEY[data.emailStatus].map((item, index) => {
                let key = item;
                let name =  VAL[data.emailStatus][index];
                let val =  data[VAL[data.emailStatus][index]];
                return {
                    key,
                    val,
                    name
                }
            })
            this.$store.commit('changeLoading', false);
        },
        goChangeEmail() {
            this.$router.push('/setting/changeEmail')
        },
    },
    created() {
        this.$store.commit('changeNoMenu', false);
    },
    beforeRouteEnter(to, from, next) {
        let userInfo = to.params;
        let len = Object.keys(userInfo).length;
        next(vm => {
            vm.$store.commit('changeLoading', true);
            vm.$store.commit('changeNoMenu', false);
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
        this.$store.commit('changeLoading', false);
        // this.$store.commit('changeNoMenu', true);
        next();
    },
}
</script>

<style scoped lang='less'>
.body-box{
    flex: 1;
}
</style>
