import service from './notice.service';

export default {
  data() {
    return {
      pageNum: 5,
      currentPage: 1,
      totalCount: 0,
      totalPage: 0,
      typeId: 0,
      noticeId: 0,
      noticeList: [],
      noticeDetail: {},
      noticeListShow: false
    }
  },
  beforeRouteEnter (to, from, next) {
    // ...
    next(vm => {
      vm.$store.commit('changeNoMenu', false);
    });
  },
  beforeRouteLeave (to, from, next) {
    // ...
    this.$store.commit('changeNoMenu', true);
    next();
  },
  mounted() {
    if (!this.$router.currentRoute.query.id || !this.$router.currentRoute.query.type) {
      this.$router.push({ name: 'home' });
      return;
    }
    this.typeId = this.$router.currentRoute.query.type;
    this.noticeId = this.$router.currentRoute.query.id;
    this._$service = service(this.axios);
    this.getNoticeList();
    this.getNoticeDetail();
  },
  methods: {
    async getNoticeList() {
      let data = await this._$service.queryNoticeList({pageNum: this.pageNum, currentPage: this.currentPage, typeId: this.typeId});
      try {
        this.noticeList = data.data.data.items.map(function(item) {
          return {
            id: item.id,
            title: item.title,
            addTime: item.addtime
          }
        });
        this.totalCount = data.data.data.totalCount;
        this.totalPage = data.data.data.totalPageCount;
      } catch(e) {
      }
    },
    async getNoticeDetail(id) {
      id && (this.noticeId = id);
      let data = await this._$service.queryNoticeDetail({id: id || this.noticeId});
      this.noticeDetail = {
        title: data.data.data.title,
        addTime: data.data.data.addtime,
        content: data.data.data.content
      }
      this.noticeListShow = false;
    },
    prePage() {
      if (this.currentPage <= 1) {
        return;
      }
      this.currentPage -= 1;
      this.getNoticeList();
    },
    nextPage() {
      if (this.currentPage >= this.totalPage) {
        return;
      }
      this.currentPage += 1;
      this.getNoticeList();
    }
  }
}