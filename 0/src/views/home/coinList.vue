<template>
    <div class="setting-box">
        <!-- <router-link to="/phoneLogin">原用户中心</router-link> -->
        <div class="setting">
            <img class="setting-goback" @click="goBack" src="../../assets/img/setting/arrow_left.png" alt="">
        </div>
        <div class="setting-body">
            <h2>{{$t(headTitleList[listType])}}</h2>
            <div class="coin-list">
				<div class="detail-list">
					<div 
						v-if='!renderList.length' 
						style='color:darkgray'
					>
						{{$t('newZh.noData')}}
					</div>
					<div 
						class="flex-row current-currency border-bom"
						v-for="(item,index) in renderList"
						:key="index"
						@click="viewMarketDetail(item.title, item.name, item.isContract, 'trade')"
					>
						<div class="flex-row padding-r10">
						<div class="add-type flex-col padding-l5 box-space">
							<p>{{item.title | tit(0)}}
							<span>/ {{item.title | tit(1)}}</span>
							</p>
							<span v-if="listType!==2">
							{{$t('marketData.volumn')+' '+item.volume.toFixed(2)}}
							</span>
						</div>
						</div>
						<div class="box1 flex-row">
						<div class="add-money box1 flex-col flex-right box-space">
							<p 
							:style="{color: item.change<0?'#e71e42':'#40d190'}"
							v-if='listType!==2'
							>{{ $dataConversion.toNonExponential(item.new_price) }}</p>
							<p 
							class="zhicang"
							:style="{color: '#adadad'}"
							v-if='listType===2'
							>{{item.volume.toFixed(2)}}￥</p>
							<span 
							:style="{color: '#adadad'}"
							v-if='listType!==2'
							>￥ {{ new Number(item.jia) }}</span>
							<span 
							:style="{color: '#adadad'}"
							v-if='listType===2'
							>{{$t('newZh.timeBus')}}</span>
						</div>
						<div 
							class="box-center padding-l20" 
							:style="{background: item.change<0?'#e71e42':'#40d190'}"
							>
							<div class="btn box-center">
							{{ item.change | priceChange }}</div>
						</div>
						</div>
					</div>
				</div>
			</div>
        </div>
    </div>
</template>

<script>
import service from './home.service'

export default {
    data() {
			return {
				listType: 0,
				perforData: [], // 涨幅榜
				coinList: [], // 币币行情
				cliDeal: [], // 成交榜
				transactionList: [], // 合约行情
				optionalList: [], // 自选币种
				headTitleList: ['newZh.perFo', 'newZh.coinCurr', 'newZh.dealList', 'newZh.listContra'],
				valueList: ['perforData', 'coinList', 'cliDeal', 'transactionList'],
				renderList: [],
				interval: null,
				languageList: {
					'zh-cn': 0,
					'zh-tw': 1,
					'en-us': 2
				},
			}
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
			vm.$store.commit('changeNoMenu', false);
			vm.listType = Number(to.params.type);
			let localData = localStorage.getItem('coinInfo');
			if(localData) {
				vm.TransactionDataHanding(JSON.parse(localData));
			}
			vm._$service = service(vm.axios);
			vm.getTransactionData();
			vm.interval = setInterval(function() {
				vm.getTransactionData();
			}, 5000);
        });
    },
    beforeRouteLeave(to, from, next){
		this.$store.commit('changeNoMenu', true);
		this.interval && clearInterval(this.interval);
		next();
	},
	filters: {
		tit(str, i) {
			if(!str) return '--;'
			return str.split('/')[i];
		},
		priceChange(num) {
			return num >= 0 ? '+' + num + '%' : num + '%';
		},
		// 去掉USDT
		takeOutData(val){
			let newVal=val.slice(0,4);
			return newVal;
		}
	},
    methods: {
		TransactionDataHanding(data) {
			data.assitsCoinArr.forEach(item => item.isContract = false);
			data.extendCoinArr.forEach(item => item.isContract = true);
			data.mainCoinArr.forEach(item => item.isContract = false);
			let _currencyMarketList = data.mainCoinArr.concat(data.assitsCoinArr);
			this.coinList = [..._currencyMarketList]; // 币币行情
			this.transactionList=[...data.extendCoinArr]; // 合约行情
			this.perforDataDeal(_currencyMarketList); // 涨幅榜
			this.perforDataDealUp(_currencyMarketList); // 成交榜
			this.renderList = [...this[this.valueList[this.listType]]];
		},
		// 涨幅榜数据处理
		perforDataDeal(data){
			let perforData1=data.filter(ite=>{
				return ite.change>=0;
			})
			let perforData2=data.filter(itt=>{
				return itt.change<0;
			})
			perforData1.sort((a,b)=>{
				return b.change-a.change;
			})
			perforData2.sort((a,b)=>{
				return b.change-a.change;
			})
			this.perforData=perforData1.concat(perforData2);
		},
		perforDataDealUp(data){
			this.cliDeal=data.sort((a,b)=>{
				return b.volume-a.volume;
			})
		},
		/**
		 * 获取交易数据
		 */
		async getTransactionData() {
			let data = await this._$service.queryTransactionData({});
			localStorage.setItem('coinInfo', JSON.stringify(data.data));
			this.TransactionDataHanding(data.data);
		},
		/**
		 * 查看币种K线详情
		 * @param {*} coinName 
		 */
		viewMarketDetail(coinTitle, coinName, isContract, path_temp) {
			let path = path_temp;
			if(isContract) {
				//  跳转合约K线
				path = 'contract';
			}
			let that = this,
				ua = window.navigator.userAgent,
				userId = (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId),
				select = that.optionalList.find(item => {return item.name === coinName}),
				collectId = select ? select.collectId : '';
			if (/Native_iOS/.test(ua)) {
				that.$bridge.setupWebViewJavascriptBridge(function (bridge) {
				bridge.callHandler('jumpToNativeKlineVc', {coinTitle:coinTitle, coinName:coinName, language: that.languageList[that.$i18n.locale], userId: userId, collectId: collectId, isCollected: !!collectId, isContract: isContract,sessionId: window.sessionStorage.getItem('sessionId')}, function(res) {});
				});
				// that.$store.state.bridge.callHandler('jumpToNativeKlineVc', {coinTitle:coinTitle, coinName:coinName, language: that.languageList[that.$i18n.locale], userId: userId, collectId: collectId, isCollected: !!collectId, isContract: isContract}, function(res) {});
				return;
			} else if (/Native_Android/.test(ua)) {
				prompt("cg://web/klinepage?" + JSON.stringify({coinTitle:coinTitle, coinName:coinName, language: that.languageList[that.$i18n.locale], userId: userId, collectId: collectId, isCollected: !!collectId, isContract: isContract, sessionId: window.sessionStorage.getItem('sessionId')}),"");
				return;
			}
			window.location.href = this.$phpUrl + '/' + path + '/kline/market/' + coinName + '?lang=' + this.$i18n.locale
		},
		/**
		 * 获取自选列表数据
		 */
		async getOptionalData() {
			let that = this,
				_userId = (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId);
			if (!_userId) {
				that.optionalList = [];
				that.optionalNameList = [];
				that.getTransactionData();
				return;
			}
			let data = await that._$service.queryOptionalData({
				userId: _userId,
				pageNum: 100,
				currentPage: 1
			});
			if (data.status === 200) {
				that.optionalList = (data.data.data ? data.data.data.list : []).map(item => {return {collectId: item.collectId, name: item.name, title: item.title,unit: item.unit, sort: item.sort}});
				that.optionalList.sort((cur, next) => {return cur.sort - next.sort});
				that.optionalNameList = that.optionalList.map(item => {return item.name});
			} else {
				that.optionalList = [];
				that.optionalNameList = [];
			}
			that.getTransactionData();
		},
		goBack() {
			this.$router.go(-1);
		},
    }
}
</script>

<style scoped lang='less'>
.setting-box{
    height: 100%;
    display: flex;
    flex-direction: column;
}
.setting{
    height: 80px;
    text-align: left;
    background: #fff;
    padding: 32px 26px 0;
    display: flex;
    justify-content: space-between;
    .setting-img{
        width: 36px;
        height: 42px;
    }
    &-goback{
        width: 19px;
        height: 33px;
        margin-left: 15px;
    }
}
.setting-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: scroll;
    overflow-x: hidden;
    h2{
        // padding: 60px 0 35px;
        padding: 0.8rem  0.346667rem 0.533333rem;
        background: #fff;
        // width: 184px;
        // height: 45px;
        text-align: left;
        // height: 120px;
        font-size: 45px;
        font-weight: bold;
        font-stretch: normal;
        box-sizing: content-box;
        letter-spacing: 0px;
        color: #202025;
	}
	.coin-list {
		flex: 1;
		background: #ffffff;
		border-top: 1px solid #dcdcdc;
	}

}
.detail-list{
	margin: 30px 40px  0 40px;
	.current-currency {
		margin-bottom: 30px;
		padding-bottom: 30px;
		border-bottom: solid 1px #dcdcdc;
		> div {
		.add-type {
			text-align: left;
			margin: auto;
			& > p {
			height: 34px;
			line-height: 34px;
			font-size: 34px;
			font-weight: bold;
			color: #505050;
			& > span {
				font-size: 24px;
				font-weight: normal;
				color: #adadad;
			}
			}
			& > span {
			margin-top: 14px;
			font-size: 24px;
			color: #adadad;
			}
		}
		.add-type,.add-money {
			font-size: 34px;
			> span {
			font-size: 24px;
			}
			.box-center {
			font-size: 24px;
			}
		}
		}
		.add-money {
		padding-right: 33px;
		.zhicang{
			margin-bottom: 5px;
		}
		}
		.box1 .padding-l20{
		font-size: 28px;
		width: 150px;
		height: 70px;
		border-radius: 5px;
		padding-left: 0;
		margin-top: 6px;
		.btn{
			color: white;
		}
		}
	}
	}
@media screen and (-webkit-min-device-pixel-ratio: 1) {
  .border-one { border: 1px solid #dcdcdc !important}
  .border-bom { border-bottom: 1px solid #dcdcdc !important}
}
@media screen and (-webkit-min-device-pixel-ratio: 2) {
  .border-one { border: 1PX solid #dcdcdc !important}
  .border-bom { border-bottom: 1PX solid #dcdcdc !important}
}
</style>