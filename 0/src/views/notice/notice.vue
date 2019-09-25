<template>
  <div class="notice">
    <div class="detail-header">
      <img src="../../assets/img/common/previous_page.png" alt="" @click="$goHomeCallback();$store.commit('changeNoMenu', true);"/>
      {{$t('notice.noticeDetail')}}
    </div>
    <div class="notice-bidy">
      <div :class="[{'notice-list-open': !noticeListShow, 'notice-list-close': noticeListShow},'more-notice']" @click="noticeListShow=!noticeListShow">
        <p v-text="$t('notice.viewMoreNotice')+'('+totalCount+')'"></p>
      </div>
      <div class="notice-list" v-show="noticeListShow">
        <ul>
          <li style="display: flex" v-for="(item, index) in noticeList" :key="index" @click="getNoticeDetail(item.id)">
            <p  style="width: 50%" :style="{color: item.id == noticeId ? '#52c1df': '#202025'}" class="ellipsis" v-text="item.title"></p>
            <span style="width: 50%">{{ item.addTime | date('hh:ss MM/dd') }}</span>
          </li>
          <li v-show="!totalPage">{{$t('notice.noNoticeList')}}</li>
        </ul>
        <div class="operate-list" v-show="totalPage">
          <span v-text="currentPage+'/'+totalPage"></span>
          <div class="operate-block">
            <img @click="prePage" :src="[currentPage <= 1 ? require('../../assets/img/notice/pre_page_disabled.png') : require('../../assets/img/notice/pre_page.png')]" alt=""/>
            <img @click="nextPage" :src="[currentPage >= totalPage ? require('../../assets/img/notice/next_page_disabled.png') : require('../../assets/img/notice/next_page.png')]" alt=""/>
          </div>
        </div>
      </div>
      <div class="notice-detail">
        <div class="notice-header">
          <p class="notice-title" v-text="noticeDetail.title"></p>
          <p class="notice-time">{{ noticeDetail.addTime | date('hh:mm MM/dd')}}</p>
        </div>
        <div class="notice-body" v-html="noticeDetail.content || $t('notice.noNoticeDetail')"></div>
      </div>
    </div>
  </div>
</template>

<script>
import notice from './notice';
export default {
  ...notice
}
</script>

<style lang="scss" >
@import "./notice.scss";
</style>

<style>
.notice .notice-detail .notice-body img {
  width: 100%;
  height: 100%;
}

</style>
