<template>
  <div class="app-download">
    <div class="common-header">
      <img src="../../assets/img/common/previous_page.png" alt="" @click="$goBack"/>
    </div>
    <div class="download-header" v-text="$t('appDownload.header')"></div>
    <div class="download-content">
      <p>
        <img src="../../assets/img/appDownload/android.png" alt />
        <span v-text="$t('appDownload.android')"></span>
      </p>
      <div class="download-info">
        <img src="../../assets/img/appDownload/ewmAll.jpg" alt/>
        <div class="download-link">
          <div class="download-button dbta" data-clipboard-target="#ANDROID" @click="handleCopy('ANDROID')" v-text="$t('appDownload.copy')"></div>
          <div class="download-button" @click="handleDownload('ANDROID')" v-text="$t('appDownload.download')"></div>
        </div>
      </div>
    </div>
    <div class="download-content">
      <p>
        <img src="../../assets/img/appDownload/ios.png" alt />
        <span v-text="$t('appDownload.ios')"></span>
      </p>
      <div class="download-info">
        <img src="../../assets/img/appDownload/ewmAll.jpg" alt/>
        <div class="download-link">
          <div class="download-button dbti" data-clipboard-target="#IOS" @click="handleCopy('IOS')" v-text="$t('appDownload.copy')"></div>
          <div class="download-button" @click="handleDownload('IOS')" v-text="$t('appDownload.download')"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      androidLink: 'http://p8cfr.yq65.zj-dige.cn/XkqJf4',
      iosLink: 'http://p8cfr.yq65.zj-dige.cn/XkqJf4'
    }
  },
  beforeRouteEnter (to, from, next) {
    // ...
    next(vm => {
      vm.$store.commit('changeNoMenu', false);
    })
  },
  beforeRouteLeave (to, from, next) {
    // ...
    this.$store.commit('changeNoMenu', true);
    next();
  },
  methods: {
    handleDownload(type) {
      let that = this,
        a = document.createElement('a');
      a.href = type === 'IOS' ? that.iosLink : that.androidLink;
      a.click();
    },
    handleCopy(type) {
      let that = this;
      if (that.$clientEnv.ios) {
        var a = document.createElement('a');
        a.style.position = 'absolute';
        a.style.top = '-9999px';
        a.style.left = '-9999px';
        a.innerText = type === 'IOS' ? that.iosLink : that.androidLink;
        document.body.append(a);
        var range = document.createRange();
        range.selectNode(a);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);

        // const input = document.createElement('input');
        // input.setAttribute('readonly', 'readonly');
        // input.setAttribute('value', 'hello world');
        // document.body.appendChild(input);
        // input.setSelectionRange(0, 9999);
        var msg = document.execCommand('copy') ? that.$t('appDownload.copySuccessful') : that.$t('appDownload.copyUnsuccessful');
        that.$normalToast(msg, 1000);
        document.body.removeChild(a);
      } else {
        var textarea = document.createElement('textarea');
        textarea.style.position = 'absolute';
        textarea.style.top = '-9999px';
        textarea.style.left = '-9999px';
        textarea.readOnly = true;
        textarea.innerText = type === 'IOS' ? that.iosLink : that.androidLink;
        document.body.append(textarea);
        textarea.select();
        var msg = document.execCommand('copy') ? that.$t('appDownload.copySuccessful') : that.$t('appDownload.copyUnsuccessful');
        that.$normalToast(msg, 1000);
        document.body.removeChild(textarea);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-download {
  .download-header {
    padding: 160px 0 36px 25px;
    height: 45px;
    line-height: 45px;
    font-size: 45px;
    color: #202025;
    text-align: left;
    background-color: #fff;
    box-sizing: content-box;
    border-bottom: solid 1px #dcdcdc;
    font-weight: bold;
  }
  .download-content {
    padding-bottom: 135px;
    background-color: #fff;
    & > p {
      padding: 70px 0 45px 40px;
      height: 33px;
      line-height: 33px;
      color: #464646;
      text-align: left;
      box-sizing: content-box;
      & > img {
        width: 33px;
        height: 33px;
        vertical-align: middle;
      }
      & > span {
        vertical-align: middle;
      }
    }
    .download-info {
      padding: 0 35px;
      display: flex;
      justify-content: space-between;
      & > img {
        width: 285px;
      	height: 285px;
      }
      .download-link {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .download-button {
          width: 285px;
          height: 59px;
          line-height: 59px;
          background-color: #3e80ca;
          border-radius: 5px;
          text-align: center;
          font-size: 24px;
          color: #fff;
        }
      }
    }
  }
  .download-content:last-child {
    border-top: solid 1px #dcdcdc;
  }
}
</style>
