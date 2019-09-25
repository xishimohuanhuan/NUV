<template>
    <div class="load-more-wrapper" @touchstart="touchStart($event)" @touchend="touchEnd($event)">
        <div class="inner">
            <slot></slot>
            <div v-show="showFooter">
                <div class="load-more" v-show="enableLoadMore">{{$t(loadMoreText)}}</div>  
                <div class="load-end" v-show="!enableLoadMore">{{$t('newZh.goToBottom')}}</div>  
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "LoadMore",
    props: {
        enableLoadMore: {
            type: Boolean,
            default: true
        },
        showFooter: {
            type: Boolean,
            default: true
        },
        onLoadMore: {
            type: Function,
            default: undefined,
            require: false
        }
    },
    data() {
        return {
            loadMoreText: "newZh.moreAdd",
            startX: 0,
            startY: 0,
            isLoading: false,
        }
    }, 
    methods: {
        touchStart(e) {
            this.startY = e.targetTouches[0].pageY;
            this.startX = e.targetTouches[0].pageX;  
        },
        scrollToEnd(e) {
            let scrollHeight = this.$el.scrollHeight; 
            let clientHeight = this.$el.clientHeight; 
            let scrollTop = this.$el.scrollTop;  
            if (scrollTop + clientHeight >= scrollHeight || this.enableLoadMore) {
                this.doLoadMore()  
            } 
        },
        touchEnd(e) {
            if (this.isLoading) {
                return;
            }

            let endX = e.changedTouches[0].pageX,
                    endY = e.changedTouches[0].pageY,
                    dy = this.startY - endY,
                    dx = endX - this.startX;
            if(Math.abs(dx) < 200 && Math.abs(dy) < 200) {
                return;
            }
            if (endY < this.startY) {
                this.scrollToEnd(e)
            }
        },
        doLoadMore() {
            this.isLoading = true
            this.loadMoreText = 'newZh.loadINg'
            this.onLoadMore(this.loadDone);
        },
        loadDone() {
            this.isLoading = false;
            this.loadMoreText = 'newZh.moreAdd'
        }
    }
}
</script>
<style lang="less" scoped>
.load-more-wrapper {
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    transition-duration: 300ms;
    .load-more, .load-end {
        color: #aea699;
        font-size: .26rem;
        margin: .3rem 0;
        text-align: center;
    }
}

</style>