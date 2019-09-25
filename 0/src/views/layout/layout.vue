<template>
    <div class="main-layout warp" ref="warpRef">
        <!-- 内容区域 -->
        <div class="main-content views">
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
        </div>

        <!-- 底部菜单 -->
        <footer ref="footer" :style="{top: top}" class="layout-nav-footer border-t" v-if="isCreatedMenu">
            <div class="circle"></div>
            <div class="ui-flex nav-boxs">
                <!--<router-link  @click="goRouter(item.path)" :title="item.title" class="flex__item nav-box" v-for="(item,key) in list" :key="key">-->
                <div :class="{critop: key===2}"  @click="goRouter(item.path,item.name)" :title="item.title" class="flex__item nav-box" v-for="(item,key) in list" :key="key">
                    <img class="tar-icon" :src="item.imgDefSrc" :alt="item.title" v-show="item.name !== activeName">
                    <img class="tar-icon" :src="item.imgActSrc" :alt="item.title" v-show="item.name === activeName">
                    <p class="nav-label" :style="{color: item.name !== activeName ? '' : '#3e80ca'}">{{$t(item.title)}}</p>
                </div>
            </div>
        </footer>
        <toast 
            :showToastType="'operate'" 
            :toastContent="$t('otherWT.assPasEnt')" 
            :showToastImgType="'warning'" 
            :isShow="globalToast"
            :toastOperateTitle="$t('otherWT.goSett')" 
            :toastAssistOperateTitle="$t('otherWT.qCan')" 
            @handle-main-click="mainClick" 
            @handle-assist-click="assistClick"/>
    </div>
</template>

<script>
export default {

    data() {
        const _this = this;
        return {
            activeName: _this.$route.name,
            top: '',
            list: [
                {
                    path: '/home',
                    name: 'home',
                    title: 'menu.home',
                    imgDefSrc: require('../../assets/img/home/home_n.png'),
                    imgActSrc: require('../../assets/img/home/home_s.png')
                },
                // {
                //     path: '/quotation',
                //     name: 'quotation',
                //     title: 'menu.market',
                //     imgDefSrc: require('../../assets/img/home/quotation_n.png'),
                //     imgActSrc: require('../../assets/img/home/quotation_s.png')
                // },
                {
                    path: '/trade/btc_usdt/foo',
                    name: 'trade',
                    title: 'menu.coin',
                    imgDefSrc: require('../../assets/img/home/coin_n.png'),
                    imgActSrc: require('../../assets/img/home/coin_s.png')
                },
                {
                    path: '/transaction/xbtc_usdt/foo',
                    name: 'transaction',
                    title: 'menu.contract',
                    imgDefSrc: require('../../assets/img/home/contract_n.png'),
                    imgActSrc: require('../../assets/img/home/contract_s.png')
                },
                {
                    path: '/quickTrans/buy',
                    name: 'quickTrans',
                    title: 'menu.legalTender',
                    imgDefSrc: require('../../assets/img/home/otc_n.png'),
                    imgActSrc: require('../../assets/img/home/otc_s.png')
                },
                {
                    path: '/assets',
                    name: 'assets',
                    title: 'menu.assets',
                    imgDefSrc: require('../../assets/img/home/assets_n.png'),
                    imgActSrc: require('../../assets/img/home/assets_s.png')
                }
            ],
        }
    },
    
    computed: {
        test(){
            return this.$store.state.test
        },
        isCreatedMenu() {
            return this.$store.state.noMenu
        },
        globalToast() {
            return this.$store.state.globalToast;
        },
    },
    watch:{
        test(){
            this.$nextTick(()=>{
                this.activeName ='user'
            })
        },
        '$route' (to) {
            // this.activeName = to.name;
            if(to.path.includes('transaction')){
                this.activeName = 'transaction';
            } else if(to.path.includes('trade')){
                this.activeName = 'trade';
            } else{
                this.activeName = to.name;
            }

        },
        globalToast(val) {
            
        }
    },
    mounted() {
        let footDom = this.$refs.footer;
        let height =  window.getComputedStyle(footDom).height.replace(/[^0-9\.]/g,'');
        let clientHeight = document.body.clientHeight;
        this.top = clientHeight-height+'px';
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if(to.path.includes('transaction')){
                vm.activeName = 'transaction';
            } else if(to.path.includes('trade')) {
                vm.activeName = 'trade';
            }
        })
    },
    mounted() {
        let footDom = this.$refs.footer;
        let height =  window.getComputedStyle(footDom).height.replace(/[^0-9\.]/g,'');
        let clientHeight = document.body.clientHeight;
        this.top = clientHeight-height+'px';
    },
    methods:{
        goRouter(e,name){
            if(e=='/user' || e == '/assets'){
                this.$loginRoute(e)
            } else if(name === 'transaction') { // 交易页面默认币种 
                let active = this.$store.state.actionCoin;
                if(active && active.name){
                    this.$router.push('/transaction/'+active.name+'/foo');
                } else {
                    this.$router.push(e)
                }
            }else if(name === 'trade') {
                let icon = localStorage.getItem('trade_symbol');
                icon = icon ? JSON.parse(icon) : 'btc_usdt'
                this.$router.push('/trade/'+icon+'/foo');
            } else {
                this.$router.push(e)
            }
        },
        mainClick() {
            this.$store.commit('changeGlobalToast', false);
            this.$router.push('/setPassWord');
        },
        assistClick() {
            this.$store.commit('changeGlobalToast', false);
        }
    },
}
</script>

<style lang="scss" scoped>
$vm_base: 750; 
@function vw($px) {
    @return ($px / 750) * 100vw;
}

.main-layout {
    overflow: hidden;
    .header {
        overflow: hidden;
        background: #ffffff;
    }
    .layout-nav-footer {
        position: fixed;
        box-shadow: 0px -2px 10px 0px 
		rgba(203, 203, 203, 0.75);
        z-index: 100;
        width: 100%;
        height: 100px;
        background-color: #fff;
        // bottom: 0;
        top: calc(100% - 100px);
        .circle{
            position: relative;
            &::before{
                content: '';
                position: absolute;
                top: -30px;
                left: 0;
                right: 0;
                margin: auto;
                height: 120px;
                width: 120px;
                border-top: 1PX solid #cecece;
                border-radius: 50%;
                background: #fff;
                box-shadow: 0px -2px 10px 0px 
                rgba(203, 203, 203, 0.75);
            }
        }
        .nav-boxs {
            align-items: center;
            height: inherit;
            position: relative;
            background: #fff;
            .nav-box {
                display: inline-block;
                min-width: 150px;
                position: relative;
                text-align: center;
            }
            
            .nav-label {
                font-size: 24px;
                color: #9fa1bf;
            }
            .tar-icon{
                height: 42px;
                width: 42px;
                display: inline-block;
                position: relative;
                margin: 0 auto 10px;
                text-align: center;
                top: 8px;
            }
            .router-link-exact-active,
            .router-link-active {
                .nav-label {
                    color: #3e80ca;
                }
            }
        }
        .critop{
            .tar-icon{
                height:60px;
                width: auto;
                top: 0;                
            }
            .nav-label {
                position: relative;
                top: -10px;                
            }
        }
    }
}
</style>


