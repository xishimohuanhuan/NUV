<template>
    <div>
        <div class="out-herader" @click="downHandle" v-show="type === 2"></div>
        <div
            class="drawer"
            @touchmove.prevent="domMove" 
            @touchend='endInfo' 
            @touchstart='startInfo'
            :class="{
                'move-all': type === 0,
                'move-80': type === 1,
                'default': type === 2,
                'show-all': type === 9.
            }"
            ref="drawerDOM"
        >
            <div>
                {{$t('otherWT.tPopW')}}
                <div v-show="type">
                    ==============
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: Number,
    },
    data() {
        return {
            startY : 0,
            startTime : 0,
            endTime: 0,
            endY:0,
            moveY: 0,
            moveLastTime: 0,
            changeTime: 0,
            direction: 0,
            transLateY: 0,
            flag: false,
        }
    },
    computed: {
        type() {
            return this.value;
        },
    },
    methods: {
        domMove(e) {
            this.endY = e.touches[0].pageY;
            let Y = this.endY - this.startY + this.transLateY; // 需要移动的距离
            if(Y <= 0){
                Y = 0;  // 超出上面
            }
            if(Y/(window.innerHeight-50) > 0.8){
                Y = (window.innerHeight - 50) * 0.8 // 超出下面
            }
            this.$refs.drawerDOM.style.transform = 'translateY('+Y+'px)';
            let nowTime = + new Date();
            let moveTime = nowTime - this.moveLastTime; // 移动时间
            let moveRange = this.endY - this.moveY; // 移动距离
            if(Math.abs(moveRange/moveTime) > 1){   // 大于某个速度时，记录下数据
                this.direction = moveRange/moveTime;    // 改变时移动方向
                this.changeTime = + new Date();     //  改变时的时间
            }
            this.moveLastTime = + new Date();
            this.moveY = this.endY;
        },
        startInfo(e) {
            this.startTime = +new Date();   // 触发时。。
            this.startY = e.touches[0].pageY;   // 
            this.transLateY = this.range();
            this.$refs.drawerDOM.style.transform = 'translateY('+this.transLateY+'px)';
            this.$emit('input', 9)
        },
        endInfo() {
            let now = + new Date();
            if((!!this.changeTime) && (now - this.changeTime <= 300)){  
                /* 
                    判断 滑动速度是否有超出标准速度
                    如果有超出，判断滑动结束时和超出标准速度时是否小于300ms
                    如果小于300毫秒，则忽略滑动距离，做出改变\|/
                */
                this.direction > 0 ? this.$emit('input',1) : this.$emit('input',2);                
            } else{
                let hh = window.innerHeight;
                let touchHeigth = this.range()
                if(touchHeigth/hh > 0.5){
                    this.$emit('input', 1)
                } else{
                    this.$emit('input', 2)
                }
            }
            this.changeTime = 0;
            this.direction = 0;
            this.endTime = +new Date();
        },
        downHandle() {
            this.$emit('input', 1)
        },
        range() {
            let reg = /\d+(\.\d+)?/g;
            let res = window.getComputedStyle(this.$refs.drawerDOM).transform.match(reg);
            return !res ? 0 : Number(res[5])
        },
    },
}
</script>

<style lang='less' scoped>
.out-herader{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background: #8888;
    z-index: 999;
}
.drawer{
    position: fixed;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    background: #ffffff;
    border: 2px solid #000;
    &.move-all{
        transition: all 0.5s;
        transform: translateY(100%) !important;
    }
    &.move-80{
        transition: all 0.5s;
        transform: translateY(80%) !important;
    }
    &.default{
        transition: all 0.5s;
        transform: translateY(0) !important;
    }
    &.show-all{
        transform: translateY(0);
    }
    @keyframes move{

    }
}
</style>