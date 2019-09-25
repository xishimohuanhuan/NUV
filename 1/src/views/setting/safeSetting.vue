<template>
    <div class="safeSetting">
        <ul class="safeSetting-ul">
            <li class="safeSetting-ul-li" v-for="item in menu" :key="item.menu" @click="gotoRouter(item)">
                <div class="safeSetting-ul-li-item" :class="{needShowTitle: item.needShow}">
                    <div class="left">
                        <img :src="item.menuImg" alt="">
                        <span>{{$t(item.menuTitel)}}</span>
                    </div>
                    <div class="right">
                        <span :class="{active: item.status == 1}">{{item.setStatus}}</span>
                        <img src="../../assets/img/setting/arrow_right.png" alt="">
                    </div>
                </div>
                <div class="showTitle" v-show="item.needShow">{{item.needShow}}</div>
            </li>
        </ul>
    </div>
</template>

<script>
import {getUserInfo} from './userRequest.js'
export default {
    data() {
        return {
            menu: [
                {
                    menuImg: require('../../assets/img/setting/real_name.png'),
                    menuTitel: 'setting.safeSetting.realName',
                    changeRouter: 'realNameStatus',
                    bindRouter: 'checkCode',
                    isSetting: false,
                    needShow: '',
                    status: '',
                    setStatus: '',
                },
                {
                    menuImg: require('../../assets/img/setting/password.png'),
                    menuTitel: 'setting.safeSetting.dealPassword',
                    changeRouter: 'dealpassword',
                    bindRouter: 'dealpassword',
                    isSetting: false,
                    needShow: '',
                    status: '',
                    setStatus: ''
                },
                {
                    menuImg: require('../../assets/img/setting/phone.png'),
                    menuTitel: 'register.loginPassword', // 登录密码
                    changeRouter: '/ChangePassword',
                    bindRouter: '/ChangePassword', 
                    isSetting: false,
                    needShow: '',
                    status: '',
                    setStatus: '',
                    isOther:true
                },
                {
                    menuImg: require('../../assets/img/setting/phone.png'),
                    menuTitel: 'setting.safeSetting.phoneBind',
                    changeRouter: 'phoneStatus',
                    bindRouter: 'bindPhone',
                    isSetting: false,
                    needShow: '',
                    status: '',
                    setStatus: ''
                },
                // {
                //     menuImg: require('../../assets/img/setting/email.png'),
                //     menuTitel: 'setting.safeSetting.emailVerify',
                //     changeRouter: 'emailStatus',
                //     bindRouter: 'bindemail',
                //     isSetting: false,
                //     needShow: '',
                //     status: '',
                //     setStatus: ''
                // },
            ],
            arrow_rigth: require('../../assets/img/setting/real_name.png'),
            userStatus: [],
            userInfo: {},
        }
    },
    computed: {
        idcardauthFilter() {        
            if (!this.userInfo) return '';
            let idcarDauth =  {
                '0': 'setting.realName.uncertified',  //  待审核
                '1': 'setting.realName.certified',  //  审核通过
                '2': 'setting.realName.unUpload',  //  未上传
                '3': 'setting.realName.certifiedLoding',  //  审核未通过
            };
            return idcarDauth[this.userInfo.idcardauth]
        },
        dealpasswordFilter() {        
            if (!this.userInfo) return '';
            let dealpassword =  {
                '1': 'setting.password.passwordSetted',  //  已设置
                '0': 'setting.password.passwordUnSetted',  //  未设置
            };
            return dealpassword[this.userInfo.payPwdStatus]
        },
        ealpassword(){
            if (!this.userInfo) return '';
            let deaassword;
            if(this.userInfo.password===1){
                deaassword='setting.password.passwordSetted';  //  已设置
            }else{
                deaassword='setting.password.passwordUnSetted';  //  未设置
            }
            return deaassword;
        },
        mobileFilter() {        
            if (!this.userInfo) return '';
            let dealpassword =  {
                '1': 'setting.tel.bound',  //  已绑定
                '0': 'setting.tel.Unbound',  //  未绑定
            };
            return dealpassword[this.userInfo.mobileStatus]
        },
        emailFilter() {        
            if (!this.userInfo) return '';
            let dealpassword =  {
                '1': 'setting.email.bound',  //  已绑定
                '0': 'setting.email.Unbound',  //  未绑定
            };
            return dealpassword[this.userInfo.emailStatus]
        }
    },
    methods: {
        gotoRouter(option) {
            if(option.isOther){
                if(this.userInfo.password){
                    this.$router.push(option.changeRouter+'/9'); //修改
                }else{
                    this.$router.push(option.changeRouter+'/7'); //设置
                }
                return;
            }
            let name = option.isSetting ? option.changeRouter : option.bindRouter;
            this.$router.push({
                name,
                params: this.userInfo
            })
        },
        setUserStatus(res) {
            // 设置状态
            this.menu = this.menu.map((item, index) => {
                let setStatus = '';
                let isSetting = false;
                let needShow = false;
                let status = '';
                switch(index){
                    case 0: 
                        setStatus = this.$t(this.idcardauthFilter);
                        isSetting = res.idcardauth == 2 ? false : true;
                        needShow = false;
                        status = res.idcardauth
                        break;
                    case 1: 
                        setStatus = this.$t(this.dealpasswordFilter);
                        isSetting = res.payPwdStatus == 1 ? true : false;
                        needShow = false;
                        status = res.payPwdStatus
                        break;
                    case 2: 
                        setStatus = (res.password === 1 ? '已设置' : '未设置');
                        isSetting = !!res.password;
                        needShow = false;
                        status = !!res.password;
                        break;
                    case 3: 
                        setStatus = this.$t(this.mobileFilter);
                        isSetting = res.mobileStatus == 1 ? true : false;
                        needShow = res.mobileStatus == 0 ? false : res.mobile.replace(res.mobile.substring(4,8), "****");
                        status = res.mobileStatus
                        break;
                    case 4: 
                        setStatus = this.$t(this.emailFilter);
                        isSetting = res.emailStatus == 1 ? true : false;
                        needShow = res.emailStatus == 0 ? false : res.email.replace(res.email.substring(4,8), "****");
                        status = res.emailStatus
                        break;
                    default :
                        break;
                }
                return {...item, setStatus, isSetting, needShow,status};
            })
        },
        async setMenuData() {
            // 设置菜单数据
            let {userId}= this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId')));
            if(!userId) return;
            let res = await getUserInfo({userId});
            if(res.status === 200){
                this.userInfo = res.data.data;
                this.$store.commit('changeIDcardauth', res.data.data.idcardauth);
                this.setUserStatus(this.userInfo);
                // 设置密码 1 已经设置密码
                if(res.data.data.password===1){
                    sessionStorage.setItem('iSssword',JSON.stringify({p:res.data.data.userName,pas:1}));
                }else{
                    sessionStorage.setItem('iSssword',JSON.stringify({p:res.data.data.userName,pas:0}));
                }
            }
        }
    },
    created() {
        this.$store.commit('changeNoMenu', false);
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            // vm.$store.commit('changeNoMenu', false);
            vm.setMenuData();
        });
    },
    // beforeRouteLeave(to, from, next){
    //     this.$store.commit('changeNoMenu', true);
    //     next();
    // },
}
</script>

<style lang='less' scoped>
.safeSetting{
    &-ul{
        &-li{
            width: 100%;
            background: #fff;
            margin-top: 30px;

            &-item{
                height: 120px;
                width: 100%;
                padding: 26px;
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                align-items: center;
                font-size: 30px;
            }
            span,img{
                vertical-align: middle;
            }
            .needShowTitle{
                height: 113px;
            }
            .showTitle{
                padding: 26px;
                width: 100%;
                height: 113px;
                display: flex;
                align-items: center;
                text-align: left;
                border-top: 1px solid #dcdcdc;
                font-size: 34px;
                letter-spacing: 0px;
                color: #464646;
            }
            .left{
                img{
                    height: auto;
                    width: 60px;
                    margin-right: 46px;
                }
            }
            .right{
                color: #d87675;
                img{
                    height: auto;
                    width: 19px;
                    margin-left: 47px;
                }
            }
            .active{
                color: #3e80ca;
            }
        }
    }
}
</style>
