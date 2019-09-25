<template>
    <div id="quickLogin">
        <headers title="邮箱登录" value="注册" @vlueClick="goRegister" @back="$goBack"></headers>
        <img class="banner" src="../../assets/img/quicklogin/LOGO.png" alt="">
        <div class="content">
            <div class="flexFather">
                <div class="row middel">
                    <div class="flex">
                <span class="selectPhone">
                        <img class="num" src="../../assets/img/quicklogin/emil.png" alt="">
                </span>
                        <input class="input" placeholder="请输入您邮箱账户">
                    </div>
                    <div class="line"></div>
                </div>
                <div class="row middel">
                    <div class="flex">
                <span class="selectPhone two">
                        <img class="phone" src="../../assets/img/quicklogin/lock.png" alt="">
                </span>
                        <input class="input" :type="eye?'password':'text'" placeholder="请输入登录密码">
                        <div class="eyeFather" @click="eye=!eye">
                            <img v-if="eye" class="eye" src="../../assets/img/quicklogin/close.png" alt="">
                            <img v-else class="eye" src="../../assets/img/quicklogin/open.png" alt="">
                        </div>
                    </div>
                    <div class="line topNone"></div>
                </div>
                <button class="btnLogin">登 录</button>
                <button class="btnLogin quickBtn" @click="goPhone">手机快捷登录</button>
                <p class="forget" @click="forgetPwd">
                    忘记密码？
                </p>

            </div>
        </div>
    </div>
</template>

<script>
    import headers from '../../component/header'

    export default {
        name: "index",
        data() {
            return {
                eye: true
            }
        },
        components: {
            headers,
        },
        methods:{
            forgetPwd(){
                this.$router.push('./findPassword')
            },
            goRegister(){
                this.$router.push('./loginRegister')
            },
            goPhone(){
                this.$router.push('./phoneLogin')
            },
        },
    }
</script>
<style lang="scss">
    $vm_base: 750;
    @function vw($px) {
        @return ($px / 750) * 100vw;
    }

    #quickLogin {
        background: #fff;
        height: 100%;

        .line {
            width: 100%;
            height: vw(8);
            border: solid 1px #b5b5b5;
            border-top: none;
            margin-top: vw(25);
        }

        .content {
            padding: 0 vw(85);

            .eyeFather {
                line-height: vw(90);

                .eye {
                    width: vw(36);
                    height: vw(17);
                    line-height: vw(120);
                }
            }

            .flexFather {
                font-size: vw(24);

                .forget {
                    font-size: vw(26);
                    line-height: vw(120);
                    color: #3e80ca;
                    text-align: left;
                }

                .btnLogin {
                    height: vw(89);
                    width: 100%;
                    background-color: #3e80ca;
                    border-radius: vw(10);
                    border: none;
                    outline: none;
                    color: #fff;
                    font-size: vw(34);
                    margin: vw(45) 0;
                }
                .quickBtn {
                    background-color: #ffffff;
                    color: #3e80ca;
                    border: solid vw(2) #3e80ca;
                    margin-top: 0
                }
                .btnLogin :active {
                }

                .grayText {
                    color: #9d9d9d
                }

                .testImgText {
                    font-family: MicrosoftYaHei;
                    font-size: vw(26);
                    font-weight: normal;
                    font-stretch: normal;
                    line-height: vw(120);
                    color: #3e80ca;
                }

                .middel {
                    margin: vw(20) 0;

                    .topNone {
                        margin-top: 0;
                    }

                    .selectPhone {
                        height: 100%;
                        line-height: vw(92);
                    }

                    .two {
                        height: 100% !important;

                        .phone {
                            vertical-align: sub;
                        }
                    }

                    .testImg {
                        width: vw(230);
                        height: vw(92);
                        background: red;
                        display: inline-block;
                    }

                    .phone {
                        width: vw(27);
                        height: vw(36);
                        vertical-align: middle
                    }

                    .num {
                        width: vw(35);
                        height: vw(27);
                        vertical-align: top

                    }
                }

                .flex {
                    display: flex;
                    padding: 0 vw(8);

                    .input {
                        border: none;
                        outline: none;
                        flex: 2;
                        color: #8d8d8d;
                    }

                    .selectPhone {
                        height: vw(21);
                        /*padding-right: vw(15);*/
                        width: vw(101);
                        text-align: center;
                    }

                    .country {
                        display: inline-block;
                        width: vw(51);
                        height: vw(34);
                        background: red;
                        float: right
                    }

                    .selectTitle {
                        font-family: MicrosoftYaHei;
                        font-size: vw(26);
                        font-weight: normal;
                        font-stretch: normal;
                        line-height: vw(120);
                        color: #3e80ca;
                        position: relative;
                        bottom: vw(18);

                        .text {
                            position: relative;
                            bottom: vw(26);
                            margin-right: 5px;
                        }
                    }

                    .triangle-up {
                        width: 0;
                        height: 0;
                        border-left: vw(9) solid transparent;
                        border-right: vw(9) solid transparent;
                        border-top: vw(14) solid #3e80ca;
                    }
                }
            }

        }

        .banner {
            width: vw(472);
            height: vw(149);
            margin: vw(62) auto vw(91) auto;
        }
    }
</style>