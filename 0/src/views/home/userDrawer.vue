<template>
    <transition name="fade">
    <div v-show="value" class="popup"  @touchstart.stop="" @touchmove.stop="" @click="closePopupHandle">
        
        <div class="popup-body" @click.stop="">
            <div class="body-header">
                <div v-if="userLogin" class="body-header-box">
                    <div class="avatar">
                        <img 
                            :src="avatarDefault" alt="">
                    </div>
                    <div class="msg">
                        <div class="tel">{{!userInfo ? '': userInfo.userName}}</div>
                        <div class="user-msg">
                            <img src="../../assets/img/home/user_identification1.png" alt="">
                            <span>{{$t(idcardauthFilter)}}</span>
                        </div>
                    </div>
                </div>
                <div    
                    v-else
                    @click="toLoginPage"
                    class="noUserLogin">
                    <h2>{{$t('userDrawer.needLogin')}}</h2>
                    <p>{{$t('userDrawer.welcome')}}</p>
                </div>
            </div>
            <div class="body-content">
                <div class="body-content-top">
                    <ul>
                        <li 
                            v-for="item in todoList" 
                            :key="item.query"
                            @click="goQuickTrans(item)">
                            <img :src="item.img" alt="">
                            <span>{{$t(item.title)}}</span>
                        </li>
                    </ul>
                </div>
                <div class="body-content-menu">
                    <ul>
                        <!-- 渲染侧边菜单链接 -->
                        <li 
                            v-for="item in renderList"
                            :key="item.url"
                            @click="goMenuRouter(item)">
                            <img :src="item.img" alt="" :class="{narrow: item.narrow}">
                            <span>{{$t(item.title)}}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="body-footer">
                <toast 
                    :showToastType="'operate'" 
                    :isShow = "toastShow"
                    :showToastImgType="'warning'"
                    :toastContent="$t('userDrawer.toastContent')" 
                    :toastOperateTitle="$t('userDrawer.confirm')" 
                    :toastAssistOperateTitle="$t('userDrawer.cancel')" 
                    @handle-main-click="mainClick" 
                    @handle-assist-click="assistClick"/>
                <div class="go-out"><span @click="logoffHandle">{{userLogin ? $t('userDrawer.logout') : $t('userDrawer.login')}}</span></div>
                <div class="version">{{$t('userDrawer.version')}}<span class="version-number">v{{version}}</span></div>
            </div>
        </div>
    </div>
    </transition>
</template>

<script>
export default {
    data() {
        return {
            userLogin: false,
            userInfo: null,
            toastShow:  false,
            version: '1.5.3',
            avatarDefault: require('../../assets/img/home/defaultAvatar.png'),
            invitation: {
                img: require('../../assets/img/home/invitation1.png'),
                title: 'userDrawer.menu.invitation',
                url: '/setting/invitation'
            },
            todoList: [
                {
                    img: require('../../assets/img/home/transferFundsTo1.png'),
                    title: 'userDrawer.transferFundsTo',
                    url: '/quickTrans/buy',
                },
                {
                    img: require('../../assets/img/home/capitalTurnsOut1.png'),
                    title: 'userDrawer.capitalTurnsOut',
                    url: '/quickTrans/sell',
                }
            ],
            renderList: [
                {
                    img: require('../../assets/img/home/safe_setting1.png'),
                    title: 'userDrawer.menu.safeSetting',
                    url: '/setting/safeSetting',
                    narrow: true
                },
                {
                    img: require('../../assets/img/home/setting1.png'),
                    title: 'userDrawer.menu.systemSetting',
                    url: '/setting/systemSetting'
                },
                {
                    img: require('../../assets/img/home/help.png'),
                    title: 'userDrawer.menu.hlepCenter',
                    url: '/setting/helpCenter',
                    notLogo:true
                },
                {
                    img: require('../../assets/img/home/service1.png'),
                    title: 'userDrawer.menu.contactService',
                    url: '/setting/contactService',
                    isOrtherUrl: 'http://p.qiao.baidu.com/cps/chatIndex?reqParam=%7B%22from%22%3A0%2C%22sessionid%22%3A%22%22%2C%22siteId%22%3A%2213192353%22%2C%22tid%22%3A%22-1%22%2C%22userId%22%3A%2226938869%22%2C%22ttype%22%3A1%2C%22siteConfig%22%3A%7B%22wsUrl%22%3A%22wss%3A%2F%2Fp.qiao.baidu.com%2Fcps%2Fwebsocket%22%2C%22eid%22%3A%2226938869%22%2C%22queuing%22%3A%22%22%2C%22session%22%3A%7B%22displayName%22%3A%22%E5%B8%83**%E6%9D%A5%22%2C%22headUrl%22%3A%22https%3A%2F%2Fss0.bdstatic.com%2F7Ls0a8Sm1A5BphGlnYG%2Fsys%2Fportraitn%2Fitem%2Fd496254535254238253833254534254238253831254536253943254141254536253944254135cc3e.jpg%22%2C%22status%22%3A0%2C%22uid%22%3A0%2C%22uname%22%3A%22%22%7D%2C%22siteId%22%3A%2213192353%22%2C%22online%22%3A%22true%22%2C%22webRoot%22%3A%22%2F%2Fp.qiao.baidu.com%2Fcps%2F%22%2C%22bid%22%3A%221053595348013192353%22%2C%22userId%22%3A%2226938869%22%2C%22isGray%22%3A%22false%22%2C%22invited%22%3A0%7D%2C%22config%22%3A%7B%22themeColor%22%3A%224d74fa%22%7D%7D'
                },
                {
                    img: require('../../assets/img/home/invitation1.png'),
                    title: 'userDrawer.menu.invitation',
                    url: '/invitBlank'//'/notInvitation'//'/setting/invitation'
                },
            ],
        }
    },
    computed: {
        idcardauthFilter() {        
            if (!this.userInfo) return '';
            let idcarDauth =  {
                '0': 'setting.realName.uncertified',  // 审核未通过
                '1': 'setting.realName.certified',  //  审核通过
                '2': 'setting.realName.unUpload',  //  未上传
                '3': 'setting.realName.certifiedLoding',  //  待审核
            };
            return idcarDauth[this.$store.state.idcardauth]
        },
        phoneChange() {
            return this.$store.state.phoneChange
        }
    },
    props: {
        popupShow: {
            type: Boolean,
            default: true
        },
        value: {
            type: Boolean,default: false
        }
    },
    watch: {
        userInfo: function() {
            if(this.userInfo && this.userInfo.headIcon){
                this.avatarDefault =  this.$imgJavaUrl + this.userInfo.headIcon;    // 设置用户头像
            }
        },
        value(val) {
            if(val) {
                this.$overflowScrolling(false);
                let isLogin = decodeURIComponent(this.$getCookie('userId'));
                this.userLogin = !!isLogin;
                if(isLogin) {
                    let {userId}= JSON.parse(isLogin);
                    this.getUserInfo({userId});
                }
            } else {
                setTimeout(() => {
                    this.$overflowScrolling(true);
                }, 500)
            }
        }
    },
    created() {
        if(this.$clientEnv.version) {
            this.version = this.$clientEnv.version;
        }
    },
    beforeMount() {
        // this.renderList = [...this.menu];
        let isLogin = decodeURIComponent(this.$getCookie('userId'));
        this.userLogin = !!isLogin;
        if(!isLogin) return;
        let {userId}= JSON.parse(isLogin);
        this.getUserInfo({userId});
    },
    beforeUpdate() {
        let isLogin = decodeURIComponent(this.$getCookie('userId'));
        this.userLogin = !!isLogin;
        if(this.userLogin && !this.userInfo){
            let {userId}= JSON.parse(isLogin);
            this.getUserInfo({userId});
        } else if(this.userLogin && this.phoneChange){
            let {userId}= JSON.parse(isLogin);
            this.getUserInfo({userId});
            this.$store.commit('phoneChangeHandle', false);
        }
    },
    methods: {
        logoffHandle(){
            if(!this.userLogin){
                this.toLoginPage();
                return ;
            }
            //  退出登录提示框
            this.toastShow = !this.toastShow
        },
        delCookie(name) {
            let exp = new Date();
            // alter(exp)
            exp.setTime(exp.getTime() - 1000*60*60*24);
            let cval = this.$getCookie(name);
            if (cval != null)
                document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        },
        toLoginPage() {
            this.$emit('input', false);
            // this.$router.push('./phoneLogin');
            this.$loginRoute('/home')
            return ;
        },
        goMenuRouter(option){
            this.$emit('input', false);
            if(option.isOrtherUrl){
                location.href = option.isOrtherUrl;
                return ;
            }
            if(option.notLogo){
                this.$router.push(option.url)
                return;
            }
            this.$loginRoute(`${option.url}`);
        },
        goQuickTrans(option){
            this.$emit('input', false);
            this.$router.push(option.url);
        },
        closePopupHandle(){
            this.$emit('input', false)
        },
        logoutHandle() {
            this.$setCookie('userId', '');
            // delCookie('userId');    // 删除cookie，退出登录
            for(let i=0;i<10;i++) {
                this.delCookie('userId');    // 删除cookie，退出登录
            }
            // alert('退出登录')
            sessionStorage.removeItem('LoginQick', '');
            sessionStorage.removeItem('nextRoute', '');
            sessionStorage.removeItem('sessionId', '');
            sessionStorage.removeItem('userId', '');
            this.userLogin = false;
            this.userInfo = null;
            this.$axios({
                url: '/ajax/logout',
                baseURL: this.$interfacePhpUrl,
                method: 'get',
                withCredentials: false
            })
        },
        assistClick() {
            // 取消退出登录
            this.toastShow = false;
            return;
        },
        pushInvitation() {
            this.menu.push(this.invitation);
        },
        getUserInfo(data) {
            this.$axios({
                data,
                url: `/user/getUserInfo`,
                method: 'post',
            }).then(res => {
                if(res.status === 200){
                    if(res.data.status === 200){
                        // 判断实名认证是否成功
                        if(!localStorage.getItem('isName') && res.data.data.idcardauth===1 && localStorage.getItem('isName1')){
                            localStorage.setItem('isName',localStorage.getItem('isName1'));
                            localStorage.removeItem('isName1');
                        }
                        if(localStorage.getItem('isName') && localStorage.getItem('isName1')){
                            localStorage.removeItem('isName1');
                        }
                        if(res.data.data.idcardauth===0){
                            localStorage.removeItem('isName1');
                        }
                        this.userInfo = res.data.data;
                        this.$store.commit('changeIDcardauth', res.data.data.idcardauth);
                        if(res.data.data.brokerStatus){
                            // this.renderList = [...this.menu, this.invitation];    //如果是经纪人，xxxx
                        } else{
                            // this.renderList = [...this.menu];
                        }
                    } else{
                        this.$normalToast(res.data.msg);
                    }
                }
            })
        },
        mainClick() {
            // 确认退出登录
            this.logoutHandle();
            this.toastShow = false;
            this.$emit('input', false);
            // this.renderList = [...this.menu];
        }
    }
}
</script>

<style scoped lang='less'>
    .popup{
        position: fixed;
        width: 200%;
        height: 100%;
        background: rgba(62, 62, 62, 0.3);
        z-index: 9999;
        // -webkit-overflow-scrolling: none;
        .popup-body{
            -webkit-overflow-scrolling: touch;
            display: flex;
            flex-direction: column;
            width: 450px;
            height: 100%;
            background: #fff;
            .body-header{
                width: 100%;
                height: 237px;
                background: #f8f8f8;
                display: flex;
                justify-content:center;
                align-items: center;
                &-box{
                    display: flex;
                    width: 86%;
                    justify-content:space-around;
                    .avatar{
                        width: 124px;
                        height: 124px;
                        border-radius: 50%;
                        background: #f8f8f8;
                        // border: 1px solid #f00;
                        line-height: 124px;
                        img{
                            width: 100%;
                            height: auto;
                            border-radius: 50%; 
                        } 
                    }
                    .msg{
                        display: flex;
                        flex-direction: column;
                        justify-content: space-around;
                        .tel{
                            span{
                                color: #343434;
                                font-size: 28px;
                            }
                        }
                        .user-msg{
                            display: flex;
                            height: 43px;
                            justify-content: start;
                            img{
                                width: 43px;
                                height: 33px;
                            }
                            span{
                                font-size: 24px;
                                letter-spacing: 0px;
                                color: #d87675;
                                padding-left: 1em; 
                            }
                        }
                    }
                }
                .noUserLogin{
                text-align: left;
                padding-left: 43px;
                flex: 1;
                h2{
                    height: 44px;
                    font-size: 45px;
                    font-weight: normal;
                    letter-spacing: 0px;
                    color: #464646;
                }
                p{
                    height: 23px;
                    font-size: 24px;
                    font-weight: normal;
                    letter-spacing: 0px;
                    color: #343434;
                    padding-top: 31px;
                }
            }
            }
            .body-content{
                flex: 1;
                &-top{
                    width: 100%;
                    height: 192px;
                    padding: 0 30px;
                    border-bottom: 1px solid #ebebeb;
                    ul{
                        display: flex;
                        height: 100%;
                        justify-content: space-around;
                        align-items: center;
                        li{
                            display: flex;
                            height: 100px;
                            flex-direction: column;
                            align-items: center;
                            justify-content: space-between;
                            img{
                                width: 48px;
                                height: auto;
                            }
                        }
                    }
                }
                &-menu{
                    ul{
                        width: 100%;
                        li{
                            margin: 0 auto;
                            width: 370px;
                            height: 124px;
                            border-bottom: 1px solid #ebebeb;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            position: relative;
                            img{
                                position: absolute;
                                left: 12px;
                                width: 40px;
                                height: auto;
                            }
                            .narrow{
                                width: 38px;
                            }
                            span{
                                font-size: 30px;
                                font-weight: normal;
                                letter-spacing: 0px;
                            }
                        }
                    }
                }
            }
            .body-footer{
                width: 100%;
                height: 206px;
                .go-out{
                    margin-top: 56px;
                    font-size: 34px;
                    color: #3e80ca;
                }
                .version{
                    margin-top: 28px;
                    font-size: 24px;
                    color: #393939;
                    &-number{
                        padding-left: 20px; 
                    }
                }
            }
        }
    }
    .fade-enter-active, .fade-leave-active {
    transition: all .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        background-color: rgba(8, 8, 8, 0);
        /* opacity: 0; */
        transform: translateX(-30%);
    }
</style>
