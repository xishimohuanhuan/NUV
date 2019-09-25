<template>
    <div id="register">

        <headers title="邮箱找回密码" @back="$goBack"></headers>
        <div class="scoller">
        <img class="banner" src="../../assets/img/quicklogin/LOGO.png" alt="">
        <div class="content">
            <div class="flexFather">
                <div class="row">
                    <div class="flex">
                <span class="selectPhone">
                   <img class="user" src="../../assets/img/quicklogin/user.png" alt="">
                </span>
                        <input class="input" type="tel" placeholder="请输入您的手机账号">

                    </div>
                    <div class="line"></div>
                </div>
                <div class="row middel positionR">
                    <table></table>
                    <div class="flex">
                <span class="selectPhone">
                        <img class="num" src="../../assets/img/quicklogin/num.png" alt="">
                </span>
                        <input class="input top14"  placeholder="请输入图形码">
                        <span class="testImg"></span>
                    </div>
                    <div class="line positionLine"></div>
                </div>
                <div class="row middel ">
                    <div class="flex">
                <span class="selectPhone two">
                        <img class="phone" src="../../assets/img/quicklogin/emil.png" alt="">
                </span>
                        <input class="input" placeholder="请输入验证码">
                        <span class="testImgText">发送验证码</span>
                    </div>
                    <div class="line topNone"></div>
                </div>
                <div class="row middel ">
                    <div class="flex">
                <span class="selectPhone two">
                        <img class="phone lock" src="../../assets/img/quicklogin/lock.png" alt="">
                </span>
                        <input class="input" placeholder="请设置新的登录密码">
                    </div>
                    <div class="line topNone"></div>
                </div>
                <button class="btnLogin">登 录</button>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
    import headers from '../../component/header'
    import radiou from '../../component/radiou'

    export default {
        name: "index",
        components: {
            headers,radiou,
        },
        data(){
            return{
                isRadiou:false
            }
        }
    }
</script>

<style lang="scss">
    $vm_base: 750;
    @function vw($px) {
        @return ($px / 750) * 100vw;
    }

    #register {
        background: #fff;
        height: 100%;
        .scoller{
            overflow: auto;
            height: 100%;
        }
.top14{
    margin-top: vw(30);
    width:vw(240);
    padding-right:vw(5)

}

        .positionR {
            position: relative;
            height: vw(120);
            .positionLine {
                position: absolute;
                bottom: 0;
            }
        }

        .user {
            width: vw(31);
            height: vw(31);
        }

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
                    margin-top: vw(83);
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
                        .phone.lock{
                            width: vw(28);
                            height: vw(36);
                        }
                    }

                    .testImg {
                        position: absolute;
                        right: 0;
                        width: vw(230);
                        height: vw(92);
                        background: red;
                        display: inline-block;
                    }

                    .phone {
                        width: vw(36);
                        height: vw(26);
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
                        color: #8d8d8d;
                    }

                    .selectPhone {
                        height: vw(21);
                        /*padding-right: vw(15);*/
                        width: vw(80);
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