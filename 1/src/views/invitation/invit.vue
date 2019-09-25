<template>
    <!-- 是否成为邀请人 -->
    <div class="wrap-invit">
        <div class="toast1">
            <p>{{$t('setting.notInvitation.beConG')}}</p>
            <div class="btn">
                <span @click="gotoNext(false)">{{$t('setting.notInvitation.noIn')}}</span>
                <span @click="gotoNext(true)">{{$t('setting.notInvitation.yesIn')}}</span>
            </div>
        </div>
        <!-- 成功弹框 -->
        <toast :isShow="isShow" v-model="isShow" :showToastType="'normal'" :toastContent="$t('setting.notInvitation.becomInviTer')"/>
        <toast :isShow="isShowlo" v-model="isShowlo" :showToastType="'normal'" :toastContent="$t('setting.notInvitation.becomLower')"/>
    </div>
    
</template>
<script>
import {getinvitPeople} from './request.js'
import { setTimeout } from 'timers';
export default {
    data(){
        return{
            isLoading:false,
            isShow:false,
            isShowlo:false,
            timer:null
        }
    },
    created(){
        this.$store.commit('changeNoMenu', false);
    },
    destroyed(){
        clearTimeout(this.timer);
        // this.$store.commit('changeNoMenu', false);
    },
    methods:{
        gotoNext(data){
            if(data){
                //成为邀请人
                if(this.isLoading){
                    return;
                }
                this.isLoading=true;
                let userId=JSON.parse(decodeURIComponent(this.$getCookie('userId'))).userId;
                getinvitPeople({userId}).then(res=>{
                    if(res.data.status===200){
                        this.isShow=true;
                        this.timer=setTimeout(()=>{
                            this.isShow=false;
                            this.$router.push('/notInvitation');
                        },1000)
                    }else{
                        this.isShowlo=true;
                        this.timer=setTimeout(()=>{
                            this.isShowlo=false;
                        },1000)
                    }
                }).finally(res=>{
                    this.isLoading=false;
                })
            }else{
                //退出
                this.$router.push('/home')
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .wrap-invit{
        background-color: rgba(98, 98, 98, 0.3);
        width: 100%;
        height: 100%;
    }
    .toast1{
        // display: none;
        width: 584px;
        height: 350px;
        background-color: white;
        border-radius: 15px;
        position: absolute;
        top: 30%;
        left: 0;
        right: 0;
        margin: auto;
        p{
            font-size: 32px;
            width: 100%;
            height: 70%;
            // text-align: center;
            line-height: 250px;
            color: #888;
        }
        .btn{
            display: flex;
            justify-content: space-between;
            height: 30%;
            overflow: hidden;
            border-radius:0 0 15px 15px;
            span{
                flex: 1;
                background-color: #3e80ca;
                color: white;
                line-height: 100px;
                font-size: 34px;
            }
            span:nth-child(1){
                background-color:  #f6f6f6;
                color: black;
            }
        }
    }
</style>
