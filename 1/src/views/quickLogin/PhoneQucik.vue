<template>
<div class="regist">
    <Headers  
        :value="(viewType!==4 && viewType!==5) ? $t('logoNew.userReg'):''" 
        @back="$goBack" 
        @vlueClick="goRegister"
    ></Headers>
    <div class="regist-center">
        <div class="banner">
            <img src="../../assets/img/quicklogin/LOGO.png" alt="">
        </div>
        <div class="box">
            <h1>
                <span v-if="viewType===3" class="active">{{$t('logoNew.phonQuciLog')}}</span>
                <span v-if="viewType===4" class="active">{{$t('logoNew.phonSetPasas')}}</span>
                <span v-if="viewType===5" class="active">{{$t('logoNew.emaSetPasas')}}</span>
            </h1>
            <ul>
                <li>
                    <div v-if="viewType===5" class="input-box">
                        <div class="icon">
                            <img class="iconE" src="../../assets/img/quicklogin/email1.png" alt="">
                        </div>
                        <div class="input">
                            <input 
                                type="text"
                                v-model="emailInputData"
                                @input="inputTrimEm"
                                :placeholder="$t('logoNew.plasYouEnAcc')"
                            >
                        </div>
                    </div>
                    <div v-if="viewType!==5" class="input-box">
                        <div class="select" @click="goSerch">+{{countryItem.tel}}</div>
                        <div class="input">
                            <input
                                type="text"
                                v-model="phoneNumber"
                                @input="inputTrim"
                                :placeholder="$t('logoNew.plasYouPhAcc')"
                            >
                        </div>
                        <div class="flag-img">
                            <div 
                                class="country" 
                                :class="'iti-flag ' + countryItem.short.toLowerCase()"
                            ></div>
                        </div>
                    </div>
                    <div class="line"></div>
                </li>
                <li>
                    <div class="btn" @click="gotoNextMess">
                        <input 
                            type="button" 
                            v-if="viewType===3 ||viewType===4 ||viewType===5"
                            :value="$t('logoNew.nextBB')"
                        />
                        <input 
                            type="button" 
                            v-else
                            :value="$t('logoNew.insCert')"
                        />
                    </div>
                </li>
                <li>
                    <div 
                        class="gotoOther" 
                        v-if="viewType===3"
                    >
                        <span 
                            @click="$router.push('/phoneLogin')"
                        >{{$t('logoNew.pasLogoN')}}</span>
                        <span @click="gotoRe">
                            {{$t('logoNew.forThPass')}}?
                        </span>
                    </div>
                </li>
            </ul>
        </div>
        <div class="bottom" v-if="viewType===3">
            <p>{{$t('logoNew.phonQuciAnd')}}
                <a 
                    href="javacript:void(0)" 
                    @click="$router.push('/protocol')"
                >{{$t('logoNew.QsqUser')}}</a>
            》</p>
        </div>
    </div>
</div>
</template>
<script>
import Headers from '../../component/header'
export default {
    components: {
        Headers,
    },
    data(){
        return{
            // 1 手机登录 2  邮箱登录  3 手机快捷登录
            // 4 手机忘记密码  5 邮箱忘记密码 6 图形验证码页面
            viewType:'',
            // 手机号码
            phoneNumber:'',
            // 邮箱
            emailInputData:'',
            // 正在请求数据
            ingRequest:false
        }
    },
    created(){
        //判断是否登录
        if( this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId'))).userId ){
            //登录就调到首页
            this.$loginRoute('/home');
        }
        this.$store.commit('changeNoMenu', false);
        this.viewType=Number(this.$route.params.type);
        this.phoneNumber=localStorage.getItem('longP') || '';
        this.emailInputData=localStorage.getItem('longE') || '';
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.$store.commit('changeNoMenu', false);
        })
    },
    beforeRouteUpdate (to, from, next) {
        this.viewType=Number(to.params.type);
        next();
    },
    destroyed(){
        this.$store.commit('changeNoMenu', true);
    },
    computed: {
        countryItem() {
            return this.$store.state.countryItem
        }
    },
    methods:{
        // input的验证 手机
        inputTrim(){
            this.phoneNumber=this.phoneNumber.replace(/(^\s*)|(\s*$)/g, ""); 
        },
        // 邮箱 验证
        inputTrimEm(){
            this.emailInputData=this.emailInputData.replace(/(^\s*)|(\s*$)/g, "");
        },
        goRegister(){
            this.$router.push('/loginRegister');
        },
        goSerch() {
            this.$router.push('/search')
        },
        // 忘记密码
        gotoRe(){
            this.$router.push('/PhoneQucik/4')
        },
        // 验证手机号输入
        verifyMobile(data) {
            data=data.trim();
            let tel = this.countryItem.tel;
            if(tel === '86'){
                let execute = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
                if(!execute.test(data)){
                    this.$normalToast(this.$t('setting.tel.mobileRule1'),1000);
                    return ;
                }
            }
            return true;
        },
        // 验证邮箱输入
        verifyEmailVal(data) {
            data=data.trim();
            let execute = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
            if(!execute.test(data)){
                this.$normalToast(this.$t('setting.email.emailRule1'),1000);
                return ;
            }
            return true;
        },
        // 验证登录
        gotoNextMess(){
            // 防抖
            if(this.ingRequest){
                this.$normalToast(this.$t('logoNew.repusetIng'));
                return;
            }
            // 手机快捷登录
            if(this.viewType===3){
                // 手机号码验证
                if(!this.phoneNumber || !this.verifyMobile(this.phoneNumber)){
                    this.$normalToast(this.$t('logoNew.plasAblaPhon'));
                    return;
                }
                // 存手机号码
                localStorage.setItem('longP',this.phoneNumber);
                this.$router.push('/PhoneCode/6?to=3');
                return;
            }
            // 4 手机忘记密码登录
            if(this.viewType===4){
                // 手机号码验证
                if(!this.phoneNumber || !this.verifyMobile(this.phoneNumber)){
                    this.$normalToast(this.$t('logoNew.plasAblaPhon'));
                    return;
                }
                localStorage.setItem('longP',this.phoneNumber);
                this.$router.push('/PhoneCode/6?to=4');
                return;
            }
            // 忘记密码 邮箱
            if(this.viewType===5){
                if(!this.emailInputData || !this.verifyEmailVal(this.emailInputData)){
                    this.$normalToast(this.$t('logoNew.plasUseEmAb'));
                    return;
                }
                localStorage.setItem('longE',this.emailInputData);
                this.$router.push('/PhoneCode/6?to=5');
                return;
            }
        }
    }
}
</script>
<style lang='less' scoped>
@import "../../component/IntlTelInput/intl.css";
input{
	border: none;
	outline: none;
	background: transparent;
	width: 100%;
	height: 100%;
}
.line {
	width: 100%;
	height: 8px;
	border: solid 1px #b5b5b5;
	border-top: none;
	margin-top: 25px;
}
.regist{
	flex: 1;
	background: #ffffff;
	&-center{
		.banner{
			margin-top: 36px;
			img{
				width: 174px;
				height: 175px;
			}
		}
		.box{
			padding: 0 85px;
			text-align: left;
			margin-top: 80px;
			h1{
				height: 45px;
				line-height: 45px;
				padding-bottom: 69px;
				color: #818181;
				font-size: 30px;
				border-bottom: 1px solid #dcdcdc;
				span{
					margin-right: 48px;
				}
				.active{
					font-size: 45px;
					color: #202025;
				}
			}
			&>ul{
				margin-top: 80px;
				&>li{
					margin-top: 56px;
				}
			}
			.input-box{
				display: flex;
				justify-content: space-around;
				align-items: center;
				padding: 0 8px;
				.flag-img{
					transform: scale(1.5);
					margin-right: 10px;
				}
				.icon{
					width: 96px;
					height: 36px;
					// text-align: center;
					img{
						margin-left: 12px;
						width: auto;
						height: 100%;
                    }
                    .iconE{
                        height: 26px;
                    }
				}
				.regist-img{
					position: relative;
					width: 230px;
					height: 36px;
					img{
						width: 230px;
						height: 92px;
						position: absolute;
						bottom: -20px;
					}
				}
				.select{
					font-size: 26px;
					font-style: normal;
					letter-spacing: 0px;
					color: #3e80ca;
					position: relative;
					height: 36px;
					min-width: 96px;
					&::after{
						display: inline-block;
						content: '';
						margin: 1px 10px;
						width: 0;
						height: 0;
						border-left: 9px solid transparent;
						border-right: 9px solid transparent;
						border-top: 14px solid #3e80ca;
					}
				}
				.input{
					flex: 1;
					padding-right: 20px;
				}
			}
			.btn{
				width: 579px;
				height: 89px;
				background-color: #3e80ca;
				border-radius: 10px;
				font-size: 34px;
				color: #ffffff;
			}
        }
        .bottom{
			margin-top: 260px;
			a{
				color: #3e80ca;
			}
		}
	}
}
.gotoOther{
    display: flex;
    justify-content: space-between;
    color: #3e80ca;
    margin-top: 49px;
    font-size: 26px;
}
</style>