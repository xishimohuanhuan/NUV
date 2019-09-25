<template>
  <div class="detail">
    <div class="detail-header">
      <img src="../../../assets/img/common/previous_page.png" alt="" @click="$goHomeCallback()"/>
      <span>{{noticeDetail.title | interceptCharacters(5)}}</span>
    </div>
    <div class="notice-detail">
      <div class="notice-header">
        <p class="notice-title" v-text="noticeDetail.title"></p>
        <p class="notice-time">{{ noticeDetail.addtime | date('hh:mm MM/dd')}}</p>
      </div>
      <div class="notice-body" v-html="noticeDetail.content || $t('notice.noNoticeDetail')"></div>
    </div>
  </div>
</template>

<script>
import service from './article.service'
export default {
  data() {
    return {
      service: null,
      noticeDetail: {}
    }
  },
  beforeRouteEnter (to, from, next) {
    // ...
    next(vm => {
      vm.$store.commit('changeNoMenu', false);
      let id = to.params.id;
      if (id) {
        vm.getArticleDetail(id);
      } else {
        vm.$router.push({name: 'home'});
      }
    });
  },
  mounted() {
    let that = this;
    that.$service = service(that.axios);
  },
  methods: {
    async getArticleDetail(id) {
      let data = await this.$service.queryNoticeDetail({id: id});
      this.noticeDetail = data.data.data;
    }
  }
}
</script>

<style>
.detail .notice-detail .notice-body img {
  width: 100%;
  height: 100%;
}
</style>

<style lang="scss" scoped>
p{
  word-wrap: break-word;
}
.detail {
  // padding: 80px 0;
  overflow: hidden;
  // min-height: 120%;
  height: 100%;
  position: relative;
  .detail-header{
    position: absolute;
    top: 0;
    width: 100%;
    height: 80px;
    line-height: 80px;
    font-size: 34px;
    color: #202025;
    text-align: center;
    background-color: #fff;
    z-index: 1000;
    & > img {
      position: absolute;
      top: 30%;
      width: 19px;
      height: 33px;
    }
    & > img:first-child {
      left: 41px;
    }
  }
  .notice-detail {
    margin-top: 40px;
    padding: 40px;
    text-align: left;
    background-color: #fff;
    overflow: scroll;
    height: 100%;
    .notice-header {
      padding-bottom: 30px;
      border-bottom: solid 1PX #dcdcdc;
      .notice-title {
        font-size: 40px;
        font-weight: bold;
        color: #202025;
      }
      .notice-time {
        margin-top: 10px;
        font-size: 30px;
        color: #989898;
      }
    }
    .notice-body {
      margin-top: 55px;
    }
  }
}
</style>

<style>
.notice .notice-detail .notice-body img {
  width: 100%;
  height: 100%;
}
</style>

