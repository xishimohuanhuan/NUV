<template>
    <div>
        <div class="gotoAcco">
            <div class="acco-wrap">
                <div class="box-span">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div class="box-span">
                    <span>{{$t('setting.invitTransfer.toCh')}}</span>
                    <span>{{$t('setting.invitTransfer.goD')}}</span>
                </div>
                <div class="box-span">
                    <span>{{$t('setting.invitTransfer.commAcco')}}</span>
                    <span>{{$t('setting.invitTransfer.coinAcco')}}</span>
                </div>
            </div>
        </div>
        <div class="two-title">
            <div class="start">USDT</div>
            <div class="start-left">
                <span>{{$t('setting.invitTransfer.allIncom')}}</span>
                <span>{{$t('setting.invitTransfer.withComm')}}</span>
            </div>
            <div class="start-bom">
                <span>{{allComm||"0"}}</span>
                <span>{{availComm||"0"}}</span>
            </div>
            <div class="input-go">
                <span class="span-left">{{$t('setting.invitTransfer.conNumber')}}</span>
                <input 
                    type="number" 
                    :placeholder="$t('setting.invitTransfer.plaseTran')"
                    v-model="prioceData"
                    @input="inputBlanceHandle()"
                    v-enter-number
                >
                <span class="span-right" @click="hanldAllComm">{{$t('setting.invitTransfer.allTran')}}</span> 
            </div>
            <p class="tips" v-if="inspect">{{inspect}}{{$t('setting.invitTransfer.notSubj')}}</p>
        </div>
        <div class="btn" @click="hanldClick">{{$t('setting.invitTransfer.sureQR')}}</div>
        <!-- 弹框 -->
        <toast :isShow="isShow1" v-model="isShow1" :showToastType="'normal'" :toastContent="toastWord"/>
    </div>
</template>
<script>
import {
    getinvitBlank,
    invitTransferGoTo
} from './userRequest.js'
export default {
    data(){
        return{
            // 可提现佣金
            availComm:"---",
            // 总佣金
            allComm:"---",
            // 输入框的值
            prioceData:'',
            // 弹框的显示
            isShow1:false,
            // 弹框的类容
            toastWord:this.$t('otherWT.enTheCorr'),
            // 划转审核
            inspect:false
        }
    },
    created(){
        this.getDataComm();
    },
    destroyed(){
        this.$store.commit('changeLoading', false);
    },
    methods:{
        // 获取数据
        getDataComm(){
            let data={
                userId:JSON.parse(decodeURIComponent(this.$getCookie('userId'))).userId,
                coin:"usdt"
            }
            this.$store.commit('changeLoading', true);
            getinvitBlank(data).then(res=>{
                this.$store.commit('changeLoading', false);
                if(res.data.status===200){
                    this.availComm=res.data.data.extUser.availComm;
                    this.allComm=res.data.data.extUser.allComm;
                    if(res.data.data.extUser.inspect>0){
                        this.inspect=res.data.data.extUser.inspect;
                    }else{
                        this.inspect=false;
                    }
                }
            })
        },
        // 表单的处理
        inputBlanceHandle(){
            let temp = Number(this.prioceData);
            if(temp>this.availComm){
                this.prioceData=this.availComm;
            }
        },
        // 全部划转
        hanldAllComm(){
            this.prioceData=this.availComm;
        },
        // 全部划转
        hanldClick(){
            if(!this.prioceData){
                // 请输入正确的转换数量
                this.toastWord=this.$t('otherWT.enTheCorr');
                this.isShow1=true;
                return;
            }
            if(Number(this.prioceData)<=0){
                // 请输入大于0转换数量
                this.toastWord=this.$t('otherWT.enrDDZeeDa');
                this.isShow1=true;
                return;
            }
            if(Number(this.prioceData)>this.availComm){
                this.toastWord=this.$t('otherWT.traMauBi');
                this.isShow1=true;
                return;
            }
            let data={
                userId:JSON.parse(decodeURIComponent(this.$getCookie('userId'))).userId,
                amount:Number(this.prioceData)
            }
            invitTransferGoTo(data).then(res=>{
                if(res.data.status){
                    //划转成功
                    this.toastWord=this.$t('otherWT.traSccuu');
                    this.isShow1=true;
                    this.getDataComm();
                    this.prioceData='';
                }else{
                    // 划转失败
                    this.toastWord=this.$t('otherWT.traeFaa');
                    this.isShow1=true;
                    window.location.reload();
                }
            }).catch(err=>{
                this.toastWord=this.$t('logoNew.errCode');
                this.isShow1=true;
                window.location.reload();
            })
        }
    },
    destroyed() {
    },
}
</script>
<style lang="scss" scoped>
    .gotoAcco{
        width: 100%;
        height: 151px;
        border-top: 1px solid rgb(220,220,220);
        background-color: white;
        .acco-wrap{
            display: flex;
            height: 97px;
            margin-top: 26px;
            margin-left: 25px;
            color: rgb(87,87,87);
            font-size: 28px;
            .box-span{
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            .box-span:nth-child(1){
                align-items: center;
                margin-top: 5px;
                margin-bottom: 5px;
                margin-right: 17px;
                span{
                    display: inline-block;
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background-color: rgb(210,210,210);
                }
                span:nth-child(1){
                    width: 12px;
                    height: 12px;
                    background-color: rgb(62,128,202);
                    border-radius: 50%;
                }
                span:nth-child(5){
                    width: 12px;
                    height: 12px;
                    background-color: rgb(216,118,117);
                    border-radius: 50%;
                }
            }
            .box-span:nth-child(2){
                color: rgb(182,182,182);
                font-size: 22px;
                margin-right: 39px;
            }
        }
    }
    .two-title{
        background-color: white;
        margin-top: 24px;
        overflow: hidden;
        .start{
            color: rgb(62,128,202);
            font-size: 34px;
            text-align: left;
            margin-top: 36px;
            margin-left: 27px;
            font-weight: 600;
        }
        .start-left{
            display: flex;
            justify-content: space-between;
            color: rgb(202,202,202);
            font-size: 22px;
            margin-left: 23px;
            margin-right: 13px; 
            margin-top: 40px;                          
        }
        .start-bom{
            display: flex;
            justify-content: space-between;
            margin-left: 23px;
            margin-right: 13px;
            margin-top: 25px;
            font-size: 28px;
            color: rgb(141,141,141);
            span:nth-child(2){
                color: rgb(62,128,202);
            }
        }
        .input-go{
            border-top: 1px solid rgb(220,220,220);
            margin-left: 16px;
            margin-right: 16px;
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
            font-size: 26px;
            align-items: center;
            padding-top: 39px;
            padding-bottom: 36px;
            .span-left{
                color: rgb(87,87,87);
                margin-left: 5px;
            }
            input{
                flex: 1;
                margin-left:88px;
                border: none; 
            }
            .span-right{
                color: rgb(62,128,202);
                margin-left: 10px;
                font-size: 24px;
            }
        }
        .tips{
            color: rgb(141,141,141);
            padding-bottom: 10px;
            text-align: left;
            margin-left: 20%;
        }
    }
    .btn{
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 100px;
        background-color: rgb(62,128,202);
        color: white;
        line-height: 100px;
        font-size: 34px;
    }
</style>
