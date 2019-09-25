<template>
  <div class="safeSetting">
    <ul class="safeSetting-ul">
      <li
        class="safeSetting-ul-li"
        v-for="item in menu"
        :key="item.menu"
        @click="clickHandel(item)"
      >
        <div class="safeSetting-ul-li-item" :class="{needShowTitle: item.needShow}">
          <div class="left">
            <img :src="item.menuImg" alt />
            <span>{{$t(item.menuTitel)}}</span>
          </div>
          <div class="right">
            <span :class="{active: item.status == 1}">{{item.setStatus}}</span>
            <img src="../../assets/img/setting/arrow_right.png" alt />
          </div>
        </div>
        <div class="showTitle" v-show="item.needShow">{{item.needShow}}</div>
      </li>
    </ul>
    <!-- 二维码弹框 -->
    <Popup v-model="twoCodeShowCom">
      <div class="wrapTwo">
        <img src="../../assets/img/setting/twoComm.jpg" alt />
        <!-- <div class="locImg" @click="handleSave">保存至相册</div> -->
      </div>
    </Popup>
  </div>
</template>

<script>
import { getUserInfo } from "./userRequest.js";
import weiImg from "../../assets/img/setting/twoComm.jpg";
import { Popup } from "vant";
import { constants } from "crypto";
var t1;
export default {
  components: {
    Popup
  },
  data() {
    return {
      menu: [
        {
          menuImg: require("../../assets/img/setting/weixin.png"),
          menuTitel: "setting.safeSetting.weixin",
          changeRouter: "realNameStatus",
          bindRouter: "realname",
          isSetting: false,
          needShow: "",
          status: "",
          setStatus: this.$t('otherWT.monTogFor')
        },
        {
          menuImg: require("../../assets/img/setting/weibo.png"),
          menuTitel: "setting.safeSetting.weibo",
          changeRouter: "dealpassword",
          bindRouter: "dealpassword",
          isSetting: false,
          needShow: "",
          urlScheme:
            "sinaweibo://userinfo?uid=7255898519&jumpfrom=weibocom&type=uid&value=7255898519&fid=1005057255898519&uicode=10000011&v_p=42&luicode=10000011&lfid=1005057255898519",
          url: "https://weibo.com/u/7255898519",
          status: 1,
          setStatus: this.$t('otherWT.qsOrd')
        },
        {
          menuImg: require("../../assets/img/setting/twitter.png"),
          menuTitel: "setting.safeSetting.twitter",
          changeRouter: "bindPhone",
          bindRouter: "bindPhone",
          isSetting: false,
          needShow: "",
          urlScheme: "twitter://user?screen_name=GQGGLOBAL",
          url: "https://twitter.com/GlobalQsq",
          status: 1,
          setStatus: "@GQG EX"
        },
        {
          menuImg: require("../../assets/img/setting/telegram.png"),
          menuTitel: "setting.safeSetting.telegram",
          changeRouter: "emailStatus",
          bindRouter: "bindemail",
          isSetting: false,
          needShow: "",
          url: "https://t.me/GQGGLOBAL",
          urlScheme: "tg://resolve?domain=GQGGLOBAL",
          status: 1,
          setStatus: "GQG.com"
        }
      ],
      arrow_rigth: require("../../assets/img/setting/real_name.png"),
      userStatus: [],
      userInfo: {},
      twoCodeShowCom: false,
      qrCodeImg: require("../../assets/img/setting/twoComm.jpg")
    };
  },
  methods: {

    // 复制
    copyBackCodeHandle(value){
      let that = this;
      if (that.$clientEnv.ios) {
        var a = document.createElement('a');
        a.style.position = 'absolute';
        a.style.top = '-9999px';
        a.style.left = '-9999px';
        a.innerText = value;
        document.body.append(a);
        var range = document.createRange();
        range.selectNode(a);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        var msg = document.execCommand('copy') ? that.$t('appDownload.copySuccessful') : that.$t('appDownload.copyUnsuccessful');
        that.$normalToast(msg, 1000);
        document.body.removeChild(a);
      } else {
        var textarea = document.createElement('textarea');
        textarea.style.position = 'absolute';
        textarea.style.top = '-9999px';
        textarea.style.left = '-9999px';
        textarea.readOnly = true;
        textarea.innerText = value;
        document.body.append(textarea);
        textarea.select();
        var msg = document.execCommand('copy') ? that.$t('appDownload.copySuccessful') : that.$t('appDownload.copyUnsuccessful');
        that.$normalToast(msg, 1000);
        document.body.removeChild(textarea);
      }
    },
    // 没找应用就跳转到对应官网
    // gouccn(url) {
    //   t1 = setTimeout(function() {
    //     let hidden =
    //       window.document.hidden ||
    //       window.document.mozHidden ||
    //       window.document.msHidden ||
    //       window.document.webkitHidden;
    //     if (typeof hidden == "undefined" || hidden == false) {
    //       window.location.href = url;
    //     }
    //   }, 2500);
    // },

    clickHandel(item) {
      switch (item.bindRouter) {
        case "realname": //微信
          this.twoCodeShowCom = true;
          break;
        case "bindPhone": //twitter
        this.copyBackCodeHandle(item.url)
          // window.location.href = item.urlScheme;
          // this.gouccn(item.url);
          break;

        case "dealpassword": //微博
          // window.location.href = item.urlScheme;
          // this.gouccn(item.url);
          this.copyBackCodeHandle(item.url)
          break;

        case "bindemail": //telegram
          // window.location.href = item.urlScheme;
          // this.gouccn(item.url);
          this.copyBackCodeHandle(item.url)
          break;
      }
    },

    handleSave() {
      let that = this;
      if (that.$clientEnv.isNativeiOS) {
        that.$bridge.setupWebViewJavascriptBridge(function(bridge) {
          bridge.callHandler("downloadImage", { url: that.qrCodeImg }, function(
            res
          ) {
            that.$normalToast(
              res
                ? that.$t("assets.recharge.saveSuccess")
                : that.$t("assets.recharge.saveFail"),
              1000
            );
          });
        });
      } else if (that.$clientEnv.isNativeAndroid) {
        let res = prompt(
          "cg://web/downloadImage?" + JSON.stringify({ url: that.qrCodeImg }),
          ""
        );
        that.$normalToast(
          res == 1
            ? that.$t("assets.recharge.saveSuccess")
            : that.$t("assets.recharge.saveFail"),
          1000
        );
      } else {
        let a = document.createElement("a");
        a.style.display = "none";
        document.body.appendChild(a);
        a.download = "ewm" + +new Date() + ".jpg";
        a.href = that.base64;
        a.click();
        document.body.removeChild(a);
      }
    }
  },
  created() {
    this.$store.commit("changeNoMenu", false);
  },
  destroyed() {
    clearInterval(t1);
  }
};
</script>

<style lang='less' scoped>
.safeSetting {
  &-ul {
    &-li {
      width: 100%;
      background: #fff;
      margin-top: 30px;

      &-item {
        height: 120px;
        width: 100%;
        padding: 26px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        align-items: center;
        font-size: 30px;
      }
      span,
      img {
        vertical-align: middle;
      }
      .needShowTitle {
        height: 113px;
      }
      .showTitle {
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
      .left {
        img {
          height: auto;
          width: 60px;
          margin-right: 46px;
        }
      }
      .right {
        color: #a0a0a0;
        font-size: 28px;
        img {
          height: auto;
          width: 19px;
          margin-left: 47px;
        }
      }
      .active {
        color: #3e80ca;
      }
    }
  }
  .van-popup {
    border-radius: 15px;
  }
  .wrapTwo {
    font-size: 34px;
    color: rgb(6, 122, 254);
    img {
      height: 430px;
      width: 430px;
    }
    .locImg {
      height: 50px;
      line-height: 40px;
    }
  }
}
</style>
