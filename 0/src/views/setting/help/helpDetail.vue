<template>
    <div :class="moDataShow ? '': 'help-wrap'">
        <div class="setting">
            <img class="setting-goback" @click="goBack"  src="../../../assets/img/setting/arrow_left.png" alt="">
        </div>
        <div class="setting-body">
            <h2>{{title}}</h2>
        </div>
        <div class="dec-wrap" v-for='ite in listData' :key='ite.id'>
            <div class="title" @click="hanldGOData(ite.id)">
                <span v-text="ite.title"></span>
                <img :class="isCheck===ite.id? 'addTr':''" src="../../../assets/img/setting/arrow_left.png" alt="">
            </div>
            <div :class="isCheck===ite.id ? 'drop':'dropNone'" v-show='ite.content' v-html="ite.content">
                <!-- qweqwe<br/>
                qweqwe<br/>
                qweqwe<br/>
                qweqwe<br/>
                qweqwe<br/>
                qweqwe<br/>
                qweqwe<br/>
                qweqwe<br/> -->
            </div>
        </div>
        <!-- 没有数据 -->
        <div v-show="moDataShow" class="no-data">
            <img src="../../../assets/img/assets/noData.png" alt/>
            <p v-text="noWebAns ? $t('otherWT.webErQua') : $t('assets.address.noData')"></p>
        </div>
    </div>
</template>
<script>
import {getHelpDataDta,getHelpArticle} from '../userRequest.js'
export default {
    data(){
        return{
            isCheck:false,
            title:'',
            listData:[],
            moDataShow:false,
            noWebAns:false,
            timer1:null
        }
    },
    created(){
        this.getData();
        this.$store.commit('changeNoMenu', false);
    },
    destroyed(){
        this.$store.commit('changeNoMenu', true);
        clearTimeout(this.timer1);
    },
    methods:{
        goBack() {
            this.$router.go(-1);
        },
        //获取数据
        getData(){
            let data={
                typeId: Number(this.$route.params.key),
                // lang:'zh-cn',
                pageNum:100,
                currentPage:1
            }
            getHelpDataDta(data).then(res=>{
                this.title=res.data.data.name;
                this.listData=res.data.data.list;
                if(res.data.status===200 && !res.data.data.list.length>0){
                    this.moDataShow=true;
                }
            }).catch(err=>{
                this.moDataShow=true;
                this.noWebAns=true;
            })
        },
        //获取数据，下拉
        hanldGOData(data){
            if(this.isCheck===data){
                this.isCheck=false;
                return;
            }
            let das=this.listData.filter(ite=>{
                if(ite.id===data && ite.content){
                    return ite ;
                }
            })
            if(das.length>0){
                this.isCheck=data;
                return;
            }
            getHelpArticle({id:data}).then(res=>{
                if(res.data.status){
                    this.listData.map(item=>{
                        if(item.id===data){
                            if(res.data.data.content){
                                item.content=res.data.data.content;
                                clearTimeout(this.timer1);
                                this.timer1=setTimeout(()=>{
                                    this.isCheck=data;
                                },10)
                            }
                        }
                        return item;
                    })
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.help-wrap{
    background-color: white;
    border-top: 1px solid rgb(220,220,220);
    .dec-wrap{
        .title{
            color: rgb(70,70,70);
            font-size: 28px;
            display: flex;
            justify-content: space-between;
            margin-left: 28px;
            margin-right: 25px;
            align-items: center;
            padding-top: 45px;
            padding-bottom: 47px;
            border-bottom: 1px solid rgb(220,220,220);
            img{
                width: 19px;
                height: 33px;
                transform:rotate(-90deg);
                transition:all 0.15s;
            }
            img.addTr{
                transform:rotate(90deg);
                transition:all 0.15s;
            }
        }
        .drop{
            max-height: 10000px;
            overflow: hidden;
            padding: 20px 0;
            transition:all 10s;
            border-bottom: 1px solid rgb(220,220,220);
            margin-left: 28px;
            margin-right: 25px;
            transition:padding 0.15s;
        }
        .dropNone{
            max-height: 0;
            overflow: hidden;
            padding: 0;
            transition:all 10s;
            border-bottom: 0px solid rgb(220,220,220);
            margin-left: 28px;
            margin-right: 25px;
            transition:padding 0.15s;
        }
    }
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
    .setting-goback{
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
    border-bottom: 1px solid rgb(220,220,220);
    h2{
        padding: 0.8rem  0.346667rem 0.533333rem;
        background: #fff;
        text-align: left;
        font-size: 45px;
        font-weight: bold;
        font-stretch: normal;
        box-sizing: content-box;
        letter-spacing: 0px;
        color: #202025;
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