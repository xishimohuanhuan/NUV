<template>
    <div class="body-box">
        <div v-show="boxshow" class="lxa-status-box">
            <Status :renderData="statusData">
                <div class="lxa-bottom-btn" v-if="statusData.status === 0">
                    <button @click="goRealName">{{$t('setting.realName.certifyAgain')}}</button>
                </div>
            </Status>
        </div>
    </div>
</template>

<script>
import {getUserInfo, getRealAuthInfo} from './userRequest.js'
import Status from '../../component/setting/status.vue'
export default {
    components: {
        Status,
    },
    data() {
        return {
            boxshow: false,
            statusData: {
                title: '',
                status: '',
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
    methods: {
        statusDataHandle(data){
            if(data.idcardauth === 2) return;
            // 处理实名认证信息
            const TITLE = {
                '0': 'setting.realName.statusData0',
                '1': 'setting.realName.statusData1',
                '3': 'setting.realName.statusData3'
            }
            const KEY = {
                '3': ['setting.realName.name', 'setting.realName.idCard'],
                '1': ['setting.realName.name', 'setting.realName.idCard'],
                '0': ['setting.realName.reason']
            }
            const VAL = {
                '3': ['truename', 'idcard'],
                '1': ['truename', 'idcard'],
                '0': ['idcardinfo']
            }
            this.statusData.status = data.idcardauth;
            this.statusData.title = TITLE[data.idcardauth];
            this.statusData.body = KEY[data.idcardauth].map((item, index) => {
                let key = item;
                let name =  VAL[data.idcardauth][index];
                let val = data[VAL[data.idcardauth][index]];
                return {
                    key,
                    val,
                    name
                }
            })
            this.$store.commit('changeLoading', false);
        },
        goRealName() {
            this.$router.push('/setting/checkcode');
        }
    },
    created() {
        this.$store.commit('changeNoMenu', false);
    },
    beforeRouteEnter (to, from, next) {
        next( vm => {
            vm.$store.commit('changeLoading', true);
            // vm.$store.commit('changeNoMenu', false);
            let id = vm.$getCookie('userId') && JSON.parse(decodeURIComponent(vm.$getCookie('userId'))).userId;
            getRealAuthInfo({id})
            .then( res => {
                vm.statusDataHandle(res.data.data);
                vm.boxshow = true;
            }).catch(() => {
                vm.$store.commit('changeLoading', false);                
            })
        })
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
