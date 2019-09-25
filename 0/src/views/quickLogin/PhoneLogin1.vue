<template>
    <div id="PhoneLogin">
        <headers title="手机快捷登录" value="邮箱登录" @click.native="$goBack"></headers>
        <img class="banner" src="../../assets/img/quicklogin/LOGO.png" alt="">
        <div class="content">
            <div class="flexFather">
                <div class="row">
                    <div class="flex">
                <span class="selectPhone">
                    <span class="selectTitle">
                        <span class="text">+86</span>
                        <span class="triangle-up"></span>

                    </span>
                   <ul v-if="false">
                       <li>1</li>
                      <li>2</li>

                   </ul>
                </span>
                        <input class="input" type="tel" placeholder="请输入您的手机账号">
                        <span class="country"></span>
                    </div>
                    <div class="line"></div>
                </div>
                <div class="row middel">
                    <div class="flex">
                <span class="selectPhone">
                        <img class="num" src="../../assets/img/quicklogin/num.png" alt="">
                </span>
                        <input class="input" placeholder="请输入图形码">
                        <span class="testImg"></span>
                    </div>
                    <div class="line"></div>
                </div>
                <div class="row middel">
                    <div class="flex">
                <span class="selectPhone two">
                        <img class="phone" src="../../assets/img/quicklogin/phone.png" alt="">
                </span>
                        <input class="input" placeholder="请输入图形码">
                        <span class="testImgText">发送验证码</span>
                    </div>
                    <div class="line topNone"></div>
                </div>
                <p class="bText">
                    手机快捷登录及同意 <span class="testImgText">《GQG用户协议》</span>
                </p>
                <button class="btnLogin">登 录</button>
                <p class="grayText">未注册|手机号验证后自动创建账号</p>
            </div>
        </div>
    </div>
</template>

<script>
    import headers from '../../component/header'

    export default {
        name: "index",
        components: {
            headers,
        },
    }
</script>

<style lang="scss">
    $vm_base: 750;
    @function vw($px) {
        @return ($px / 750) * 100vw;
    }
    #PhoneLogin {
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

            .flexFather {
                font-size: vw(24);

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
                            vertical-align: -webkit-baseline-middle;
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
                        vertical-align: middle

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