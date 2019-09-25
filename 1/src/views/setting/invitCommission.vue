<template>
    <div 
        class="onscroll"
        ref="scroTop"
    >
        <List
            v-model="loading"
            :finished="finished"
            :finished-text="$t('otherWT.notMoreda')"
            :offset="5"
            :error.sync="error"
            error-text=""
            @load="onLoad"
        >
        <div class="comm-top" v-for='ite in dataInvit' :key="ite.id">
            <div class="invit-bm1">
                <div>{{$t('setting.notInvitation.invitNum')}}</div>
                <div>{{$t('setting.notInvitation.invitTime')}}</div>
                <div>{{$t('setting.notInvitation.commMon')}}(USDT)</div>
            </div>
            <div class="invit-bm1">
                <div class="add-col">{{ite.username|filtPhone}}</div>
                <div class="add-c">{{ite.time|date('hh:mm MM/dd')}}</div>
                <div class="add-c">{{ite.amount}}</div>
            </div>
        </div>
        <!-- <div class="comm-top">
            <div class="invit-bm1">
                <div>邀请账号</div>
                <div>时间</div>
                <div>返佣资金(USDT)</div>
            </div>
            <div class="invit-bm1">
                <div class="add-col">1231**123</div>
                <div class="add-c">123123123</div>
                <div class="add-c">12.232</div>
            </div>
        </div> -->
        <!-- <div class="upLoad" v-if="showBott">
            <div class="load-more1" v-if="isLoadingUp">上拉加载更多</div>
            <div class="load-more1">加载中 ...</div>
            <div class="load-more1">没有更多 ...</div>
        </div> -->
        </List>
        <div v-show="moDataShow" class="no-data">
            <img src="../../assets/img/assets/noData.png" alt/>
            <p v-text="noWebAns ? $t('otherWT.webErQua') : $t('assets.address.noData')"></p>
        </div>
    </div>
</template>
<script>
import { List } from 'vant';
import {invitCommissionData} from './userRequest.js'
import { setTimeout } from 'timers';
export default {
    components: {
        List
    },
    data(){
        return{
            loading:false,
            finished: false,
            error:false,
            dataInvit:[],
            // 页码
            currentPage:1,
            // 每页条数
            pageNum:10,
            // 没有数据
            moDataShow:false,
            // 网络问题
            noWebAns:false
        }
    },
    created(){
        // this.getDataRequ();
    },
    destroyed(){
        // this.$store.commit('changeLoading', false);
    },
    filters:{
        // 滚动通知的电话号码
        filtPhone(val){
            if(!val){
                return;
            }
            let da=val;
            let hea=val.slice(0,3);
            let foot=val.slice(8,11);
            da=hea+'****'+foot;
            return da;
        },
    },
    methods:{
        // 请求数据
        getDataRequ(){
            let data={
                    userId:JSON.parse(decodeURIComponent(this.$getCookie('userId'))).userId,
                    coinname:'usdt',
                    currentPage:this.currentPage,
                    pageNum:this.pageNum,
                }
            this.loading=true;
            // this.$store.commit('changeLoading', true);
            invitCommissionData(data).then(res=>{
                // this.$store.commit('changeLoading', false);
                if(res.data.status===200 && res.data.data.list.length>0){
                    this.dataInvit=this.dataInvit.concat(res.data.data.list);
                    if(Math.ceil(res.data.data.total/this.pageNum)===this.currentPage){
                        this.finished=true;
                    }else{
                        this.currentPage++;
                    }
                    this.loading=false;
                }else{
                    // this.loading=false;
                    // this.finished=true;
                    this.loading=false;
                    this.error=true;
                    this.moDataShow=true;
                }
                
            }).catch((err)=>{
                this.noWebAns=true,
                this.loading=false;
                this.error=true;
                this.moDataShow=true;
            })
        },
        onLoad(){
            this.getDataRequ();
        }
    }
    
}
</script>
<style lang="scss" scoped>

    .comm-top{
        background-color: white;
        overflow: hidden;
        border-bottom: 1px solid rgb(220,220,220);
        padding-top: 32px;
        padding-bottom: 35px;
        .invit-bm1{
            margin-left: 25px;
            margin-right: 21px;
            display: flex;
            text-align: left;
            align-items: center;
            margin-top: 20px;
            color: rgb(202,202,202);
            font-size: 22px;
            div:nth-child(1){
                width: 280px; 
            }
            div:nth-child(2){
                width: 280px; 
            }
            div:nth-child(2){
                flex: 1;
            }
            .add-col{
                font-size: 34px;
                color: rgb(62,128,202);
            }
            .add-c{
                color: rgb(141,141,141);
                font-size: 28px;
            }
        }
    }
    .comm-top:last-child{
        border-bottom: none;
    }
    .upLoad{
        background-color: white;
        color: rgb(141,141,141);
        padding: 20px 0;
        .load-more1{
            padding-bottom: 20px;
            text-align: center;
        }
    }
    // .onscroll{
    //     overflow: auto;
    // }
    .no-data {
        padding-top: 135px;
        & > img {
            width: 200px;
            // height: 129px;
            height: auto;
        }
        & > p {
            margin-top: 25px;
            font-size: 24px;
            color: #575757;
        }
    }
</style>
