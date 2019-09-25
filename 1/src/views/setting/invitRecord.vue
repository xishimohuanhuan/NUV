<template>
    <div :class="moDataShow? '':'rec-wrap'">
        <List
            v-model="loading"
            :finished="finished"
            :finished-text="$t('otherWT.notMoreda')"
            :offset="5"
            :error.sync="error"
            error-text=""
            @load="onLoad"
        >
        <div 
            class="record" 
            v-for="ite in recordData"
            :key="ite.id"
        >
            <div class="record-title">
                <div class="reco-left">
                    <span>{{$t('setting.invitTransfer.tranCoin')}}</span>
                    <span>USDT</span>
                </div>
                <div :class="['reco-right',ite.action==='0'? 'acRed':'']">
                    <span></span>
                    <span v-if="ite.action==='1'">{{$t('setting.invitTransfer.doneHave')}}</span>
                    <span v-if="ite.action==='2'">{{$t('setting.invitTransfer.haveRe')}}</span>
                    <span v-if="ite.action==='0'">{{$t('setting.invitTransfer.toAudi')}}</span>
                </div>
            </div>
            <div class="record-m">
                <span>{{$t('setting.invitTransfer.recoTime')}}</span>
                <span>{{$t('setting.invitTransfer.recoNum')}}</span>
            </div>
            <div class="record-time">
                <span>{{ite.time | date('hh:mm MM/dd')}}</span>
                <span v-text="ite.amount"></span>
            </div>
            <div class="rec-p" v-if="ite.action==='2'">
                <p>{{$t('setting.invitTransfer.refuRe')}}</p>
                <p v-text="ite.reason"></p>
            </div>
        </div>
        <!-- <div class="record">
            <div class="record-title">
                <div class="reco-left">
                    <span>佣金转至币币</span>
                    <span>USDT</span>
                </div>
                <div class="reco-right">
                    <span></span>
                    <span>已完成</span>
                </div>
            </div>
            <div class="record-m">
                <span>时间</span>
                <span>数量</span>
            </div>
            <div class="record-time">
                <span>12313</span>
                <span>12</span>
            </div>
        </div> -->
        </List>
        <!-- 没有数据 -->
        <div v-show="moDataShow" class="no-data">
            <img src="../../assets/img/assets/noData.png" alt/>
            <p v-text="noWebAns ?$t('otherWT.webErQua'):$t('assets.address.noData')"></p>
        </div>
    </div>
</template>
<script>
import { List } from 'vant';
import {
    invitTransRecords
} from './userRequest.js'
export default {
    components: {
        List
    },
    data(){
        return{
            loading:false,
            finished: false,
            error: false,
            recordData:[],
            currentPage:1,
            pageNum:10,
            // 没有数据
            moDataShow:false,
            noWebAns:false
        }
    },
    created(){
        // this.getDataRecird()
    },
    destroyed(){
        // this.$store.commit('changeLoading', false);
    },
    methods:{
        getDataRecird(){
            let data={
                userId:JSON.parse(decodeURIComponent(this.$getCookie('userId'))).userId,
                coinname:'usdt',
                currentPage:this.currentPage,
                pageNum:this.pageNum,
            }
            this.loading=true;
            // this.$store.commit('changeLoading', true);
            invitTransRecords(data).then(res=>{
                // this.$store.commit('changeLoading', false);
                if(res.data.status===200 && res.data.data.list.length>0){
                    this.recordData=this.recordData.concat(res.data.data.list);
                    if(Math.ceil(res.data.data.total/this.pageNum)===this.currentPage){
                        this.finished=true;
                    }else{
                        this.currentPage++;
                    }
                    this.loading=false;
                }else{
                    this.loading=false;
                    this.error = true;
                    this.moDataShow=true;
                }
            }).catch(err=>{
                this.noWebAns=true,
                this.loading=false;
                this.error=true;
                this.moDataShow=true;
            })
        },
        onLoad(){
            this.getDataRecird();
        }
    }
}
</script>
<style lang="scss" scoped>
    .rec-wrap{
        background-color: white;
    }
    .record{
        border-bottom: 1px solid rgb(220,220,220);
        margin-left: 16px;
        margin-right: 16px;
        font-size: 28px;
        margin-top: 32px;
        .record-title{
            display: flex;
            justify-content: space-between;
            margin-left: 10px;
            font-size: 34px;
            .reco-left{
                color: rgb(62,128,202);
                font-weight: 600;
                span:nth-child(2){
                    color: rgb(84,84,84);
                }
            }
            .reco-right{
                color: rgb(213,213,213);
                font-size: 28px;
                display: flex;
                align-items: center;
                span:nth-child(1){
                    background-color: rgb(213,213,213);
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    margin-right: 10px;
                }
            }
            .acRed{
                color: rgb(62,128,202);
                span:nth-child(1){
                    background-color: red;
                }
            }
        }
        .record-m{
            display: flex;
            justify-content: space-between;
            margin-left: 10px;
            margin-top: 40px;
            font-size: 22px;
            color: rgb(202,202,202);
        }
        .record-time{
            display: flex;
            justify-content: space-between;
            color: rgb(141,141,141);
            font-size: 28px;
            margin-top: 25px;
            margin-left: 10px;
            margin-bottom: 28px;
        }
        .rec-p{
            color: rgb(202,202,202);
            text-align: left;
            
            margin-bottom: 30px;
            margin-left: 10px;
            p:nth-child(2){
                color: rgb(141,141,141);
                font-size: 28px;
                margin-top: 20px;
            }
        }
    }
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
