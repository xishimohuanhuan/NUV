<template>
    <div class="help">
        <div class="img-tuu">
            <img @click="goto(1)" src="../../../assets/img/transaction/tuo.png" alt="">
            <img @click="goto(2)" src="../../../assets/img/transaction/tut.png" alt="">
            <img @click="goto(3)" src="../../../assets/img/transaction/tutr.png" alt="">
        </div>
        <div class="help-goto" v-for='(ite,index) in listData' :key='index' @click="gotoDetail(ite)">
            <span v-text='ite.name'></span>
            <img src="../../../assets/img/setting/arrow_right.png" alt="">
        </div>
    </div>
</template>
<script>
import {getHelpData} from '../userRequest.js'
export default {
    data(){
        return{
            listData:[]
        }
    },
    created() {
        this.getListData();
    },
    methods:{
        gotoDetail(data){
            this.$router.push({
                path:'/helpDetail/'+data.id,
            });
        },
        // 获取帮助中心的列表
        getListData(){
            getHelpData({lang:'zh-cn'}).then(res=>{
                this.listData=res.data.data;
            })
        },
        goto(data){
            switch(data){
                case 1:
                    this.$router.push('/play/playChildren');
                break;
                case 2:
                    this.$router.push('/play/playChildrenT');
                break;
                case 3:
                    this.$router.push('/play/playChildrenTh/2');
                break;
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .help{
        border-top: 1px solid rgb(220,220,220);
        background-color: white;
        .help-goto{
            display: flex;
            justify-content: space-between;
            margin-right: 32px;
            margin-left: 28px;
            border-bottom: 1px solid rgb(220,220,220);
            padding: 46px 0;
        
            span{
                color: rgb(70,70,70);
                font-size: 28px;
            }
            img{
                height: 33px;
                width: 19px;
            }
        }
        .help-goto:nth-child(2){
            border-top: 1px solid rgb(220,220,220);
        }
        .help-goto:last-child{
            border: none;
        }
    }
    .img-tuu{
        img{
            width: 670px;
            height: 230px;
            margin-bottom: 58px;
            border-radius: 20px;
        }
        img:nth-child(1){
            margin-top: 51px;
        }
    }
</style>
