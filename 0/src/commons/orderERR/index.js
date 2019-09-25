// TODO
const language = {
	'zh-cn': {
		ERR_SERVER_ERROR:               '服务器内部错误',
		ERR_PARAMS_ERROR:               '参数错误',
		ERR_NO_PERMISSION:              '无权限',
		ERR_NOT_FOUND:                  '记录未找到',
		ERR_ALLREADY_PROCESSED:         '已处理过',

		ERR_NOT_JSON:                   '所传的数据不是json格式',
		ERR_WRONG_EVENT:                '错误的事件类型',
		ERR_WRONG_CHANNEL:              '错误的通道',

		ERR_SYMBOL_NOT_FOUND:           '交易对不存在',
		ERR_SELL_AMOUNT_OVER_LIMIT:     '单笔交易量超过上限',
		ERR_SELL_PRICE_OVER_LIMIT:      '卖出价超过上限',
		ERR_SELL_AMOUNT_LESS_LIMIT:     '单笔交易量低于下限',
		ERR_SELL_PRICE_LESS_LIMIT:      '卖出价低于下限',

		ERR_BUY_AMOUNT_OVER_LIMIT:      '单笔交易量超过上限',
		ERR_BUY_PRICE_OVER_LIMIT:       '买入价超过上限',
		ERR_BUY_AMOUNT_LESS_LIMIT:      '买单，单笔交易额低于下限',
		ERR_BUY_PRICE_LESS_LIMIT:       '买入从低于下限ERR_SYMBOL_NOT_FOUND',

		ERR_BALANCE_NOT_ENOUGH:         '余额不足',
		ERR_FROZEN_NOT_ENOUGH:          '冻结的额度不足，系统故障',
		ERR_POSITION_NOT_ENOUGH:        '仓位不足',
		ERR_COIN_NOT_FOUND:             '币种不存在',
		ERR_TAKER_AVAILABLE_NOT_ENOUGH: 'taker的可用余额不足',
		ERR_MAKER_AVAILABLE_NOT_ENOUGH: 'maker的可用余额不足',
		ERR_TAKER_ALREADY_FINISHED:     'taker已完成',
		ERR_MAKER_ALREADY_FINISHED:     'maker已完成',
		ERR_ORDER_ALREADY_ADDED:        '订单已经提交过',
		ERR_ORDER_NOT_FOUND:            '订单不存在',
		ERR_DEAL_NOT_FOUND:             '成效明细不存在',
		ERR_SERVICES_NOT_AVAILABLE:     '服务不可能',
		ERR_BAD_SYMBOL:                 '无效的交易对',
		ERR_SERVER_OVERLOAD:            '服务器过载',
		ERR_VALUE_TO_SMALL:             '数值过小',
		ERR_BAD_ACCOUNT_TYPE:           '账户类型不正确',
		ERR_NOT_SUPPORT:                '暂不支持的',

		ERR_ALREADY_HAS_BROKER:         '已存在上级代理',
		ERR_CURRENT_RATE_OVER_PARENT:   '当前用户的对冲比例不能高于上级代理的对冲比例',
		ERR_DUPLICATE_ENTRY:            '重复添加',
		ERR_BROKER_CAN_NOT_TRADING:     '代理用户不可进行交易',
		ERR_BROKER_HAS_ORDER:           '升级为代理用户时，用户不可有持仓和挂单',
		ERR_HAS_ORDER_OR_POSITION:      '有挂单或持仓',
		ERR_BAD_LEVERAGE:               '错误的杠杆比例',
		ERR_PARENT_NOT_BROKER:          '上级不是代理',
	},
}

const getCookie = function (cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
			var c = ca[i].trim();
			if (c.indexOf(name) == 0) return decodeURIComponent(c.substring(name.length, c.length));
	}
	return "";
}
const OrrderERR = function(msg) {
	let lang = getCookie('think_language') || 'zh-cn';
	return language[lang][msg];
}

export default OrrderERR;