<template>
    <div id="setPasswordd">
        <toast :isShow="isShow" v-model="isShow" :showToastType="'normal'" toastContent="text"/>
        <headers 
            @back="$goBack" 
            :title="$t('otherWT.setOrderPas')"
        ></headers>
        <img class="banner" src="../../assets/img/quicklogin/LOGO.png" alt="">
        <div class="content">
            <div class="flexFather">
                <div class="row middel">
                    <div class="flex">
                        <span class="selectPhone">
                            <img class="num" src="../../assets/img/quicklogin/lock.png" alt="">
                        </span>
                        <input 
                            class="input" 
                            maxlength="16" 
                            v-model="confirmPassword" 
                            type="password"
                            :placeholder="$t('otherWT.plasOrdPaEn')"
                        >
                    </div>
                    <div class="line"></div>
                </div>
                <div class="row middel">
                    <div class="flex">
                        <span class="selectPhone two">
                            <img class="phone" src="../../assets/img/quicklogin/lock.png" alt="">
                        </span>
                        <input 
                            class="input" 
                            maxlength="16" 
                            v-model="password" 
                            type="password" 
                            :placeholder="$t('otherWT.plasOrdPaEn')"
                        >
                        <!--<div class="eyeFather" @click="eye=!eye">-->
                        <!--<img v-if="eye" class="eye" src="../../assets/img/quicklogin/close.png" alt="">-->
                        <!--<img v-else class="eye" src="../../assets/img/quicklogin/open.png" alt="">-->
                        <!--</div>-->
                    </div>
                    <div class="line topNone"></div>
                </div>
                <button class="btnLogin" @click="submit">{{$t('otherWT.goTopp')}}</button>
                <!--<button class="btnLogin quickBtn" @click="goPhone">手机快捷登录</button>-->
                <p class="forget">
                    {{$t('otherWT.overMessAcc')}}
                </p>
            </div>
        </div>
        <toast 
            v-if="isShowTime" 
            showToastType="operate" 
            toastContent="请确认交易密码" 
            showToastImgType="'warning'"
            toastTitle="提示" 
            toastOperateTitle="确认修改" 
            toastAssistOperateTitle="取消" 
            @handle-main-click="setPayPassword"
            @handle-assist-click="assistClick"
        />
    </div>
</template>

<script>
    import headers from '../../component/header'

    export default {
        name: "index",
        data() {
            return {
                confirmPassword: '',
                password: '',
                isShow: false,
                isShowTime: false
            }
        },
        components: {
            headers,
        },
        methods: {
            assistClick() {
                this.isShowTime = false
            },
            clear() {
                this.confirmPassword = '';
                this.password = ''
            },
            submit() {
                if (!this.confirmPassword) {
                    this.$Toast(this.$t('otherWT.plasOrdPaEn'));
                    this.clear()
                    return
                }
                if (this.confirmPassword.length < 6 || this.password.length < 6 || this.password.length > 16 || this.confirmPassword.length > 16) {
                    this.$Toast(this.$t('otherWT.plEitoTp'));
                    this.clear()
                    return
                }
                if (!this.password) {
                    this.$Toast(this.$t('otherWT.plasNexOrd'));
                    this.clear()
                    return
                }
                if (this.confirmPassword != this.password) {
                    this.$Toast(this.$t('otherWT.twoEntpas'));
                    this.clear()
                    return
                }
                // this.isShowTime = true
                this.setPayPassword()
            },
            getSession(id, token) {
                let that = this;
                that.$axios({
                    baseURL: that.$interfacePhpUrl,
                    url: '/Ajax/getSession?userId=' + id + '&token=' + token,
                    method: 'get',
                    withCredentials: false
                }).then(function(data) {
                    if (data.data.code == 200) {
                        sessionStorage.setItem('sessionId', data.data.data);
                    }
                }).catch(() => {})
            },
            setPayPassword() {
                // this.isShowTime = false
                let params = {
                    'type': 1,
                    "confirmPassword": this.confirmPassword,
                    "password": this.password,
                    "userId": sessionStorage.getItem('userId') || (this.$getCookie('userId') && JSON.parse(this.$getCookie('userId')).userId)
                }
                this.$store.commit('changeLoading', true);
                this.$axios({
                    url: "/user/login/setPayPassword", data: params, method: 'post'
                }).then(res => {
                    this.$store.commit('changeLoading', false);
                    if (res.data.status == 200) {
                        this.getSession(res.data.data.user.id, res.data.data.user.token);
                    // if (res.data.status == 200) {
                        if (this.$route.query.urlrote) {
                            var href = sessionStorage.getItem('hreffullPath') + '&token=' + res.data.data.user.token + "&userName=" + this.$route.query.phone + '&userId=' + res.data.data.user.id
                            window.location.replace(href)
                        } else {
                            let obj = {
                                userId: res.data.data.user.id,
                                token: res.data.data.user.token,
                                istradeSet: true,
                                phone: this.$route.query.phone || (sessionStorage.getItem('LoginQick') && JSON.parse(sessionStorage.getItem('LoginQick')).phone)
                            };
                            sessionStorage.setItem('userId', res.data.data.user.id)
                            this.$setCookie('userId', JSON.stringify(obj), 1)
                            var rout = sessionStorage.getItem('nextRoute')
                            if (rout) {
                                this.$router.push(rout)
                            } else {
                                this.$router.push('./home')
                            }
                        }
                    } else {
                        this.$Toast({
                            message: res.data.msg,
                            duration: 3000
                        });
                    }
                }).catch(() => {
                    this.$store.commit('changeLoading', false);
                    this.$Toast({
                        message: '网络问题，请稍后重试',
                        duration: 2000
                    });
                })
            },
            forgetPwd() {
                this.$router.push('./findPassword')
            },
            goRegister() {
                this.$router.push('./loginRegister')
            },
            // goPhone(){
            //     this.$router.push('./phoneLogin')
            // },
        },
        beforeRouteEnter(to, from, next) {
            // ...
            var p = document.referrer
            next(vm => {
                vm.$store.commit('changeNoMenu', false);
            })
        },
        beforeRouteLeave(to, from, next) {
            // ...
            this.$store.commit('changeNoMenu', true);
            this.$store.commit('changeLoading', false);
            next();
        },
    }
</script>
<style lang="scss">
    $vm_base: 750;
    @function vw($px) {
        @return ($px / 750) * 100vw;
    }
    .mint-toast-text{
        font-size: 26px !important;
    }
    #setPasswordd {
        background: #fff;
        height: 100%;

        input {
            font-size: 26px;
        }

        .line {
            width: 100%;
            height: 8px;
            border: solid 1px #b5b5b5;
            border-top: none;
            margin-top: 25px;
        }

        .content {
            padding: 0 85px;

            .eyeFather {
                line-height: 90px;

                .eye {
                    width: 36px;
                    height: 17px;
                    line-height: 120px;
                }
            }

            .flexFather {
                font-size: 24px;

                .forget {
                    font-family: MicrosoftYaHei;
                    font-size: 24px;
                    font-weight: normal;
                    font-stretch: normal;
                    line-height: 120px;
                    color: #9d9d9d;
                    text-align: center;
                }

                .btnLogin {
                    height: 89px;
                    width: 100%;
                    background-color: #3e80ca;
                    border-radius: 10px;
                    border: none;
                    outline: none;
                    color: #fff;
                    font-size: 34px;
                    margin: 45px 0;
                }

                .quickBtn {
                    background-color: #ffffff;
                    color: #3e80ca;
                    border: solid 2px #3e80ca;
                    margin-top: 0
                }

                .btnLogin :active {
                }

                .grayText {
                    color: #9d9d9d
                }

                .testImgText {
                    font-family: MicrosoftYaHei;
                    font-size: 26px;
                    font-weight: normal;
                    font-stretch: normal;
                    line-height: 120px;
                    color: #3e80ca;
                }

                .middel {
                    margin: 20px 0;

                    .topNone {
                        margin-top: 0;
                    }

                    .selectPhone {
                        height: 100%;
                        line-height: 92px;
                    }

                    .two {
                        height: 100% !important;

                        .phone {
                            vertical-align: sub;
                        }
                    }

                    .testImg {
                        width: vw(230);
                        height: 92px;
                        background: red;
                        display: inline-block;
                    }

                    .phone {
                        width: 27px;
                        height: 36px;
                        vertical-align: middle
                    }

                    .num {
                        width: 27px;
                        height: 36px;
                        vertical-align: top

                    }
                }

                .flex {
                    display: flex;
                    padding: 0 8px;

                    .input {
                        border: none;
                        outline: none;
                        flex: 2;
                        color: #8d8d8d;
                    }

                    .selectPhone {
                        height: 21px;
                        /*padding-right: vw(15);*/
                        width: 101px;
                        text-align: center;
                    }

                    .country {
                        display: inline-block;
                        width: 51px;
                        height: 34px;
                        background: red;
                        float: right
                    }

                    .selectTitle {
                        font-family: MicrosoftYaHei;
                        font-size: 26px;
                        font-weight: normal;
                        font-stretch: normal;
                        line-height: 120px;
                        color: #3e80ca;
                        position: relative;
                        bottom: 18px;

                        .text {
                            position: relative;
                            bottom: 26px;
                            margin-right: 5px;
                        }
                    }

                    .triangle-up {
                        width: 0;
                        height: 0;
                        border-left: 9px solid transparent;
                        border-right: 9px solid transparent;
                        border-top: 14px solid #3e80ca;
                    }
                }
            }

        }

        .banner {
            width: 174px;
            height: 174px;
            margin: 62px auto 91px auto;
        }
    }
</style>