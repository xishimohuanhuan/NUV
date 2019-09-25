<template>
    <div>
        <div class="ctx-top">
            <h2>{{$t('setting.invitation.invitationQR')}}</h2>
            <div class="qr-img">
                <img ref="qrCodeImg" :src='qrCodeImg' alt="">
            </div>
            <div class="download">
                <a href="javascript:void(0);" @click="handleSave">{{$t('setting.invitation.keepQR')}}</a>
            </div>
            <div class="title">{{$t('setting.invitation.inviteFrend')}}</div>
        </div>
        <div class="ctx-center">
            <h2>{{$t('setting.invitation.invitationLink')}}</h2>
            <div class="invitation-link">
                <div class="link-box"><span>{{address}}</span></div>
                <textarea ref="selectTextarea" v-html="address" readonly class="select"></textarea>
                <a ref="selectA" class="select" href="javascript:void(0);">{{address}}</a>
                <div class="btn" @click="copyUrl"><a href="javascript:void(0);">{{$t('setting.invitation.copy')}}</a></div>
            </div>
        </div>
        <div class="lxa-poptip">
            <h5>{{$t('setting.poptip')}}:</h5>
            <p>
                <span class="isInportent">*</span>
                <span>{{$t('setting.invitation.poptip1')}}</span>
            </p>
            <p>
                <span class="isInportent">*</span>
                <span>{{$t('setting.invitation.poptip2')}}</span>
            </p>
            <p>
                <span class="isInportent">*</span>
                <span>{{$t('setting.invitation.poptip3')}}</span>
            </p>
            <p>
                <span class="isInportent">*</span>
                <span>{{$t('setting.invitation.poptip4')}}</span>
            </p>
        </div>
    </div>
</template>

<script>
import {getInvitation} from './userRequest.js'
export default {
    data() {
        return{
            url: 'https://www.love85g.com/majiang/copy/index.html',
            qrCodeImg: '',
            userID: '',
            base64: '',
            address: ''
        }
    },
    methods: {
        copyUrl(){
            if (this.$clientEnv.isNativeiOS) {
                let range = document.createRange(this.$refs.selectA);
                range.selectNode(a);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
                let msg = document.execCommand('copy') ? this.$t('appDownload.copySuccessful') : this.$t('appDownload.copyUnsuccessful');
                this.$normalToast(msg, 1000);
            } else {
                this.$refs.selectTextarea.select();
                let msg = document.execCommand('copy') ? this.$t('appDownload.copySuccessful') : this.$t('appDownload.copyUnsuccessful');
                this.$normalToast(msg, 1000);
            }
        },
        // 将base64的图片转成二进制对象
        toBlob(basestr, type){
            let text = window.atob(basestr.split(",")[1]);
            let buffer = new Uint8Array(text.length);
            for (let i = 0; i < text.length; i++) {
                buffer[i] = text.charCodeAt(i);
            }
            let blob = new Blob(buffer, {type});
            return blob;
        },
        handleSave() {
            let that = this;
            if (that.$clientEnv.isNativeiOS) {
                that.$bridge.setupWebViewJavascriptBridge(function (bridge) {
                bridge.callHandler('downloadImage', {url: that.qrCodeImg}, function(res) {
                    that.$normalToast(res ? that.$t('assets.recharge.saveSuccess') : that.$t('assets.recharge.saveFail'), 1000);
                });
                });
            } else if (that.$clientEnv.isNativeAndroid) {
                let res = prompt("cg://web/downloadImage?" + JSON.stringify({url: that.qrCodeImg}),"");
                that.$normalToast(res == 1 ? that.$t('assets.recharge.saveSuccess') : that.$t('assets.recharge.saveFail'), 1000);
            } else {
                let a = document.createElement('a');
                a.style.display = 'none';
                document.body.appendChild(a);
                a.download = 'ewm'+ (+new Date()) + '.jpg';
                a.href = that.base64;
                a.click();
                document.body.removeChild(a);
            }
        }
    },
    created() {
        this.$store.commit('changeNoMenu', false);
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            // vm.$store.commit('changeNoMenu', false);
            let userId = vm.$getCookie('userId') && JSON.parse(decodeURIComponent(vm.$getCookie('userId'))).userId;
            vm.qrCodeImg = vm.$interfaceJavaUrl+"/user/generalize/ewm?userId="+userId;//vm.$interfaceJavaUrl
            vm.$nextTick(function() {
                let img = new Image();
                img.onload = function(res) {
                    let cvs = document.createElement("canvas"),
                    ctx = cvs.getContext('2d');
                    cvs.width = img.width;
                    cvs.height = img.height;
                    ctx.drawImage(img, 0, 0, cvs.width, cvs.height);
                    vm.base64 = cvs.toDataURL('image/jpeg', .9);
                }
                img.setAttribute('crossOrigin', 'anonymous');
                img.src = vm.$interfaceJavaUrl +'/user/generalize/ewm?userId=' + userId;
            })
            vm.userID = userId;
            getInvitation(userId)
            .then( res => {
                vm.address = res.headers.address;
            })
        });
    },
    // beforeRouteLeave(to, from, next){
    //     this.$store.commit('changeNoMenu', true);
    //     next();
    // },
}
</script>

<style lang='less' scoped>
h2{
    padding: 31px 26px 37px;
    width: 100%;
    text-align: left;
    font-size: 34px;
    height: 33px;;
    letter-spacing: 0px;
    color: #545454;
}
a{
    color: #fff
}
.ctx{
    &-top{
        height: 569px;
        border-top: 1px solid #dcdcdc;
        background: #fff;
        .qr-img{
            height: 276px;
            margin-top: 37px;
            img{
                width: 276px;
                height: 276px;
            }
        }
        .download{
            background: #3e80ca;
            width: 319px;
            margin: 42px auto 0;
            height: 59px;
            line-height: 59px;
            border-radius: 5px; 
        }
        .title{
            margin: 29px 0;
            height: 28px;
            font-size: 28px;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #575757;
        }
    }
    &-center{
        height: 179px;
        border: 0;
        margin-top: 20px;
        background: #fff;
        .invitation-link{
            padding: 35px 26px;
            text-align: left;
            position: relative;
            .link-box, .btn{
                float: left;
                width: 489px;
                height: 59px;
                line-height: 59px;
                text-align: center;
                text-overflow :ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }.link-box{
                text-align: left;
            }
            .select{
                position: absolute;
                z-index: -10;
            }
            .btn{
                float: right;
                width: 136px;
                background-color: #3e80ca;
                border-radius: 5px;
            }
        }
    }
}
</style>
