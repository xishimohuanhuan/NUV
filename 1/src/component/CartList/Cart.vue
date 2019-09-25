<template>
    <div>
        <!-- 卡片 -->
        <div class="cart">
            <div v-for="(item,index) in renderList" :key="index" class="cart-item">
                <div class="item-title">{{item.title}}</div>
                <div class="item-center"></div>
                <div class="item-val">{{item.val}}</div>
            </div>
        </div>
    </div>
</template>

<script>
/* 
*/
export default {
    data() {
        return {
            renderList: [
                {
                    title: '邀请账号',
                    val: '213546121',
                    color: '',
                },
                {
                    title: '邀请账号',
                    val: '213546121',
                    color: '',
                },
                {
                    title: '邀请账号',
                    val: '213546121',
                    color: '',
                },
            ]
        }
    }
}
</script>

<style lang='less' scoped>
.cart{
    width: 750px;
	height: 140px;
    background-color: pink;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .item-center{
        height: 26px;
    }
}
</style>
