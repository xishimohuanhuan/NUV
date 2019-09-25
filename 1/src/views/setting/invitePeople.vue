<template>
    <div class="invitPeo">
        <div class="invit-detail" >
            <!-- <van-collapse v-model="activeName" ref='asdas'  accordion>
                <van-collapse-item title-class='onestari'  title="标题1" name="1">
                    <div class="asd" >12312</div>
                </van-collapse-item>
                <van-collapse-item title="标题2" name="2">内容</van-collapse-item>
                <van-collapse-item title="标题3" name="3">内容</van-collapse-item>
            </van-collapse> -->
            <List
                v-model="loading"
                :finished="finished"
                :finished-text="$t('otherWT.notMoreda')"
                :offset="5"
                :error.sync="error"
                error-text=""
                @load="onLoad"
            >
            <div class="invit-wrap" v-for="ite in child1" :key="ite.uid">
                <div :class="['invit-title',addclaev===ite.uid ? 'add'+addclaev :'']" :id="'id'+ite.uid" @click="invitNum(ite.uid)">
                    <div class="invit-hea">
                        <div class="invit-right">
                            <p>{{$t('setting.notInvitation.rankOne')}}</p>
                        </div>
                         <p>邀请人数：{{ite.total_children_num}}</p>
                        <img :class="ite.indexNUm ?'imgTra':''"  src="../../assets/img/setting/xia.png" alt="">
                    </div>
                    <div class="invit-botto">
                        <div class="invit-bm1">
                            <div>{{$t('setting.notInvitation.invitNum')}}</div>
                            <div>{{$t('setting.notInvitation.invitTime')}}</div>
                            <div>{{$t('setting.notInvitation.moenyJ')}}(USDT)</div>
                        </div>
                        <div class="invit-bm1">
                            <div class="add-col">{{ite.mobile}}</div>
                            <div class="add-c">{{ite.time|date('hh:mm MM/dd')}}</div>
                            <div class="add-c">{{ite.availComm}}</div>
                        </div>
                    </div>
                </div>
                <ul v-show='child2[ite.uid]'>
                    <div :class="['title-two',ite.indexNUm ? '' :'title-two1']">{{$t('setting.notInvitation.rankTwo')}}</div>
                    <!-- 判断是否是最后一条 -->
                    <li 
                        :class="[ite.indexNUm ?'ove-out' :'ove-outnone',ite.indexNUm ? 'ove-outla':'']"
                        v-for="(item,index) in child2[ite.uid]"
                        :key="index"
                    >
                        <div class="two-detail" >
                            <div class="invit-bm1">
                                <div>{{$t('setting.notInvitation.invitNum')}}</div>
                                <div>{{$t('setting.notInvitation.invitTime')}}</div>
                                <div>{{$t('setting.notInvitation.moenyJ')}}(USDT)</div>
                            </div>
                            <div class="invit-bm1">
                                <div class="add-col">{{item.mobile}}</div>
                                <div class="add-c">{{item.time|date('hh:mm MM/dd')}}</div>
                                <div class="add-c">{{item.availComm}}</div>
                            </div>
                        </div>
                    </li>
                    <!-- <li :class="indexNUm===ite.userid ?'ove-out' :'ove-outnone'">
                        <div class="two-detail">
                            <div class="invit-bm1">
                                <div>邀请账号</div>
                                <div>时间</div>
                                <div>佣金(USDT)</div>
                            </div>
                            <div class="invit-bm1">
                                <div class="add-col">1231**123</div>
                                <div class="add-c">123123123</div>
                                <div class="add-c">12.232</div>
                            </div>
                        </div>
                    </li>
                    <li :class="[indexNUm===ite.userid ?'ove-out' :'ove-outnone',indexNUm ? 'ove-outla':'']">
                        <div class="two-detail">
                            <div class="invit-bm1">
                                <div>邀请账号</div>
                                <div>时间</div>
                                <div>佣金(USDT)</div>
                            </div>
                            <div class="invit-bm1">
                                <div class="add-col">1231**123</div>
                                <div class="add-c">123123123</div>
                                <div class="add-c">12.232</div>
                            </div>
                        </div>
                    </li> -->
                    <div :class="ite.indexNUm ? 'two-most' :'two-most1'" v-show="finished2[ite.uid]">
                        <span @click="hanldMoreCli(ite.uid)">{{$t('otherWT.hanCliMoe')}}</span>
                        <img @click="hanldMoreCli(ite.uid)" src="../../assets/img/setting/loadMost.png" alt="">
                    </div>
                </ul>
            </div>
            </List>
            <!-- <div class="invit-wrap">
                <div class="invit-title" @click="invitNum(2)">
                    <div class="invit-hea">
                        <div class="invit-right">一级</div>
                        <img :class="indexNUm===2 ?'imgTra':''"  src="../../assets/img/setting/xia.png" alt="">
                    </div>
                    <div class="invit-botto">
                        <div class="invit-bm1">
                            <div>邀请账号</div>
                            <div>时间</div>
                            <div>佣金(USDT)</div>
                        </div>
                        <div class="invit-bm1">
                            <div class="add-col">1231**123</div>
                            <div class="add-c">123123123</div>
                            <div class="add-c">12.232</div>
                        </div>
                    </div>
                </div>
                <ul>
                    <div  :class="['title-two',indexNUm===2 ? '' :'title-two1']">二级</div>
                    <li :class="indexNUm===2 ?'ove-out' :'ove-outnone'">
                        
                        <div class="two-detail">
                            <div class="invit-bm1">
                                <div>邀请账号</div>
                                <div>时间</div>
                                <div>佣金(USDT)</div>
                            </div>
                            <div class="invit-bm1">
                                <div class="add-col">1231**123</div>
                                <div class="add-c">123123123</div>
                                <div class="add-c">12.232</div>
                            </div>
                        </div>
                    </li>
                    <li :class="indexNUm===2 ?'ove-out' :'ove-outnone'">
                        <div class="two-detail">
                            <div class="invit-bm1">
                                <div>邀请账号</div>
                                <div>时间</div>
                                <div>佣金(USDT)</div>
                            </div>
                            <div class="invit-bm1">
                                <div class="add-col">1231**123</div>
                                <div class="add-c">123123123</div>
                                <div class="add-c">12.232</div>
                            </div>
                        </div>
                    </li>
                    <li :class="indexNUm===2 ?'ove-out' :'ove-outnone'">
                        <div class="two-detail">
                            <div class="invit-bm1">
                                <div>邀请账号</div>
                                <div>时间</div>
                                <div>佣金(USDT)</div>
                            </div>
                            <div class="invit-bm1">
                                <div class="add-col">1231**123</div>
                                <div class="add-c">123123123</div>
                                <div class="add-c">12.232</div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div> -->
        </div>
        <!-- 弹框 -->
        <toast :isShow="isShow12" v-model="isShow12" :showToastType="'normal'" :toastContent="toastWord"/>
        <!-- 没有数据 -->
        <div v-show="moDataShow" class="no-data">
            <img src="../../assets/img/assets/noData.png" alt/>
            <p v-text="noWebAns ?$t('otherWT.webErQua'):$t('assets.address.noData')"></p>
        </div>
    </div>
</template>

<script>
import {getinvitmessage,getinvitchildt} from './userRequest.js'
import {inviteList} from '../invitation/request'
import { List } from 'vant'
export default {
    components: {
        List
    },
    data(){
        return{
            // 没有数据
            moDataShow:false,
            noWebAns:false,
            loading:false,
            finished: false,
            finished2:{},
            error:false,
            // 下拉
            // indexNUm:'',
            // 一级数据
            child1:[],
            // 二级数据
            child2:{},
            isShow12:false,
            toastWord:this.$t('otherWT.requsErr'),
            currentPage:1,
            pageNum:5,
            currentPage1:1,
            pageNum1:10,
            // 下一页 二级
            nextNum:{},
            addclaev:'',
            timeer21:null,
            limit: 20,
            offset: ''
        }
    },
    created(){
    },
    destroyed(){
        clearTimeout(this.timeer21);
    },
    filters:{
        // 滚动通知的电话号码
        filtPhone(val){
            let da=val;
            let hea=val.slice(0,3);
            let foot=val.slice(8,11);
            da=hea+'****'+foot;
            return da;
        },
    },
    methods:{
        invitNum(data){
            // console.log(data);
            // console.log('click', this.child1)
            // return
            this.child1.map(ite=>{
                if(ite.uid===data){
                    if(ite.indexNUm){
                        ite.indexNUm=false;
                    }else{
                        this.getDataOne(data);
                    }
                }
                return ite;
            })
        },
        //获取数据一级，邀请人的具体信息
        getDataOne(intodata){
            if(intodata){
                // 二级数据
                this.addclaev=intodata;
                if(this.child2[intodata]){
                    this.child1.map(ite=>{
                        if(ite.uid===intodata){
                            ite.indexNUm=true;
                        }
                        return ite;
                    })
                    return;
                }
                this.requsetdata(intodata);
            }else{
                // 一级数据
                let data={
                    userId: JSON.parse(decodeURIComponent(this.$getCookie('userId'))).userId,
                    coinname: 'usdt',
                    limit: this.limit,
                    offset: this.offset,
                }
                this.loading=true;

                inviteList(data).then(res=>{
                    if(res.data.status===200 && res.data.data.children_list){
                        res.data.data.children_list.map(ite=>{
                            ite.indexNUm=false;
                            return ite;
                        })
                        this.child1=this.child1.concat(res.data.data.children_list);
                        if(this.child1.length >= res.data.data.children_num){
                            this.finished=true;
                        }else{
                            this.offset = this.child1.length;
                        }
                        this.loading=false;
                    }else{
                        this.loading=false;
                        this.error=true;
                        this.moDataShow=true;
                    }
                }).catch(err=>{
                    // 报错
                    this.loading=false;
                    this.error=true;
                    this.noWebAns=true;
                    this.moDataShow=true;
                })
                
            }
        },
        // 二级加载数据  请求
        requsetdata(intodata){
            if(!this.nextNum[intodata]){
                this.nextNum[intodata]=''
            }

                let data={
                    child:intodata,
                    offset:this.nextNum[intodata],
                    limit:this.pageNum,
                }
                inviteList(data).then(res=>{
                    if(res.data.status===200 && res.data.data.children_list.length>0){                         
                        if(this.child2[intodata]){
                            this.child2[intodata]=this.child2[intodata].concat(res.data.data.children_list);  
                        }else{

                            this.$set(this.child2,intodata,res.data.data.children_list)
                            clearTimeout(this.timeer21);
                            this.timeer21=setTimeout(() => {
                                this.child1.map(ite=>{
                                if(ite.uid===intodata){
                                    ite.indexNUm=true;
                                }
                                return ite;
                                
                            })
                            }, 10);
                                this.$nextTick(() =>{
                                let hewi=document.getElementsByClassName("add"+this.addclaev)[0].getBoundingClientRect().top
                            })
                        }
                        if(this.child2[intodata].length >= res.data.data.children_num) {
                            this.finished2[intodata]=false;
                        }else{
                            this.finished2[intodata]=true;
                            this.nextNum[intodata] = this.child2[intodata].length;
                        }
                    }
                    if(res.data.status===400){
                        this.isShow12=true;
                        this.toastWord=this.$t('otherWT.notPPj');
                    }
                }).catch(err=>{
                    this.isShow12=true;
                    this.toastWord=this.$t('otherWT.notPPj');
                })
                
            
        },
        // 二级加载更多
        hanldMoreCli(dat){
            this.requsetdata(dat);
        },
        onLoad(){
            this.getDataOne();
        }
    }
}
</script>

<style lang="scss" scoped>
.invitPeo{
    width: 100%;
}
.invit-detail{
    width: 100%;
    .invit-wrap{
        .invit-title{
            height: 210px;
            background-color: white;
            width: 100%;
            border-bottom: 1px solid #f8f8f8;
            .invit-hea{
                font-size: 24px;
                font-weight: 600;
                color: black;
                display: flex;
                justify-content: space-between;
                margin-left: 25px;
                margin-right: 21px;
                align-items: center;
                padding-top: 25px;
                img{
                    width: 29px;
                    height: 17px; 
                    transform:rotate(0deg);
                    transition:all .15s;
                }
                .imgTra{
                    transform:rotate(180deg);
                    transition:all .15s;
                }
            }
            .invit-botto{
                margin-left: 25px;
                margin-right: 21px;
                margin-top: 35px;
                .invit-bm1{
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
        }
        ul{
            .title-two{
                    text-align: left;
                    margin-left: 25px;
                    color: rgb(128,128,128);
                    font-size: 22px;
                    height: 50px;
                    transition:all .2s;
                    line-height: 80px;

            }
            .title-two1{
                height: 0px;
                transition:all .2s;
                overflow: hidden;
            }
            .ove-out{
                height: 142px;
                border-bottom:1px solid rgb(220,220,220);
                transition:all .2s;
            }
            .ove-outla{
                border-bottom:none;
            }
            .ove-outnone{
                height: 0;
                overflow: hidden;
                border-bottom:0px solid rgb(220,220,220);
                transition:all .2s;
            }
            li{
                box-sizing:border-box;
                .two-detail{
                    margin-left: 25px;
                    margin-right: 21px;
                    margin-top: 15px;
                    .invit-bm1{
                        display: flex;
                        text-align: left;
                        align-items: center;
                        padding-top: 20px;
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
            }
            .two-most{
                height: 100px;
                transition:all .2s;
                display: flex;
                flex-direction: column;
                font-size: 22px;
                color: rgb(141,141,141);
                span{
                    margin-top: 5px;
                    margin-bottom: 5px;
                }
                img{
                    width: 32px;
                    height: 32px;
                    margin: 0% auto;
                    opacity: 1;
                    transition:all .1s;
                }
            }
            .two-most1{
                overflow: hidden;
                opacity: 0;
                height: 0px;
                transition:all .2s;
                img{
                    opacity: 0;
                    transition:all .1s;
                }
            }
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
