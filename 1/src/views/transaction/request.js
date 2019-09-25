import Vue from 'vue';
const vue = new Vue();

// 获取cookie
const getCookie = (cname) => {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return decodeURIComponent(c.substring(name.length, c.length));
    }
    return "";
}
// 发送下单日志
const sendLogAjax = (edata, type=0) => {
    if(typeof(edata) !== 'object') edata = {};
    let userId = !!getCookie('userId') && JSON.parse(getCookie('userId')).userId;
    let price = edata.price;
    let amount = edata.amount; 
    let symbol = edata.symbol;
    let data = {userId, price, symbol, amount, type};
    vue.$axios({
        data,
        url: '/user/invit/setOpenLog',
        // baseURL: 'http://172.16.1.234:8007',
        method: 'post'
    }).then( () => {}).catch(() => {})
}

// 获取所有币种信息
export const getCoinInfoNew = (data) => {
    return vue.$axios({
        url: '/Ajax/getCoinInfoNew',
        baseURL: vue.$phpUrl,
        method: 'get',
        data,
        withCredentials: false
    })
}

// 获取所有币种信息
export const getUsercoinBymarket = (params) => {
    return vue.$axios({
        params,
        url: '/Ajax/getUsercoinBymarket',
        baseURL: vue.$phpUrl,
        method: 'get',
        withCredentials: false
    })
}
// 下单(快捷)
export const quickOrder = (data) =>{
    sendLogAjax(data,data.action);
    return vue.$axios({
        url: '/wi/order',
        baseURL: vue.$interfaceTransfer,
        withCredentials: false,
        data:data,
        headers: { 'PHPSESSID': sessionStorage.getItem('sessionId') },
        method:'post'
    })
}
//下单pro
export const proOrder = (data) =>{
    sendLogAjax(data,data.action);
    return vue.$axios({
        url: '/wi/order',
        baseURL: vue.$interfaceTransfer,
        withCredentials: false,
        data:data,
        headers: { 'PHPSESSID': sessionStorage.getItem('sessionId') },
        method:'post'
    })
}
//持仓页面
export const getholdShares = (data) => {
    return vue.$axios({
        url: data ? '/wi/positions/'+data : '/wi/positions',
        baseURL: vue.$interfaceTransfer,
        headers: { 'PHPSESSID': sessionStorage.getItem('sessionId') },
        method: 'get',
        withCredentials: false
    })
}
//获取用户合约账户余额

export const getContractBalance = () => {
    return vue.$axios({
        url: '/wi/user/balance/future',
        baseURL: vue.$interfaceTransfer,
        headers: { 'PHPSESSID': sessionStorage.getItem('sessionId') },
        method: 'get',
        withCredentials: false
    })
}
//获取用户合约账户余额

export const getCoinBalance = () => {
    return vue.$axios({
        url: '/wi/user/balance/spot/list',
        baseURL: vue.$interfaceTransfer,
        headers: { 'PHPSESSID': sessionStorage.getItem('sessionId') },
        method: 'get',
        withCredentials: false
    })
}

//全部持仓，一键全平
export const handleKeyping = () => {
    sendLogAjax({}, 4);
    return vue.$axios({
        url: '/wi/positions/close/all',
        baseURL: vue.$interfaceTransfer,
        headers: { 'PHPSESSID': sessionStorage.getItem('sessionId') },
        method: 'post',
        withCredentials: false
    })
}

//具体交易对持仓，一键平仓
export const handleKeySymble = (data) => {
    sendLogAjax(data,1);
    return vue.$axios({
        url: '/wi/order',
        baseURL: vue.$interfaceTransfer,
        headers: { 'PHPSESSID': sessionStorage.getItem('sessionId') },
        method: 'post',
        data,
        withCredentials: false
    })
}

//查询委托数据，查询订单列表
export const getEntrustData = (data) =>{
    return vue.$axios({
        url: '/wi/orders/'+data.symbol+'/'+data.state,
        baseURL: vue.$interfaceTransfer,
        headers: {'PHPSESSID': sessionStorage.getItem('sessionId')},
        method: 'get',
        params: data.ps,
        withCredentials: false
    })
}

//获取资金费率
export const getFunding = (data) =>{
    return vue.$axios({
        url: '/wi/funding/'+data,
        baseURL: vue.$interfaceTransfer,
        headers: {'PHPSESSID': sessionStorage.getItem('sessionId')},
        method: 'get',
        withCredentials: false
    })
}
//获取资金流水
export const postFunddingList = (params) =>{
    return vue.$axios({
        params,
        url: '/wi/user/balance/log/future',
        baseURL: vue.$interfaceTransfer,
        headers: {'PHPSESSID': sessionStorage.getItem('sessionId')},
        method: 'get',
        withCredentials: false
    })
}

//查询委托数据，all全部的
export const getEntrustALLData = (data) =>{
    return vue.$axios({
        url: '/wi/future/orders/list/'+data.state,
        baseURL: vue.$interfaceTransfer,
        headers: {'PHPSESSID': sessionStorage.getItem('sessionId')},
        method: 'get',
        params: data.ps,
        withCredentials: false
    })
}

// 全部撤销。all
export const allOrderCancel = (action,data) =>{
    sendLogAjax(data,3);
    return vue.$axios({
        url: '/wi/future/orders/cancel/'+action,
        baseURL: vue.$interfaceTransfer,
        headers: {'PHPSESSID': sessionStorage.getItem('sessionId')},
        method: 'post',
        params: data,
        withCredentials: false
    })
}
//单币种的全部撤销
// export const AllOneOrderCancel = (data) =>{
//     return vue.$axios({
//         url: '/wi/orders/cancel',
//         baseURL: vue.$interfaceTransfer,
//         headers: {'PHPSESSID': sessionStorage.getItem('sessionId')},
//         method: 'post',
//         data,
//         withCredentials: false
//     })
// }
//单币种撤销
export const sigerAllOrderCancel = (data) =>{
    sendLogAjax(data,2);
    return vue.$axios({
        url: '/wi/order/'+data+'/cancel',
        baseURL: vue.$interfaceTransfer,
        headers: {'PHPSESSID': sessionStorage.getItem('sessionId')},
        method: 'post',
        withCredentials: false
    })
}

// 获取用户币种信息
export const getUserCollect = (data) => {
    return vue.$axios({
        url: '/user/collect/getCollect',
        method: 'get',
        params: data,
    })
}
// 获取用户信息
export const getUserBalanceFuture = (data) => {
    return vue.$axios({
        url: '/wi/user/balance/future',
        method: 'get',
        params: data,
        baseURL: vue.$interfaceTransfer,
        headers: {'PHPSESSID': sessionStorage.getItem('sessionId')},
        withCredentials: false
        // withCredentials: false
    })
}
// 获取历史订单
export const getHistoryOrders = (data,params) => {
    return vue.$axios({
        url: data ? '/wi/orders/'+data +'/-1' : '/wi/orders',
        method: 'get',
        params,
        baseURL: vue.$interfaceTransfer,
        headers: {'PHPSESSID': sessionStorage.getItem('sessionId')},
        withCredentials: false
        // withCredentials: false
    })
}
// 获取具体订单
export const getSymbleOrders = (data) => {
    return vue.$axios({
        url: '/wi/order/'+data,
        method: 'get',
        baseURL: vue.$interfaceTransfer,
        headers: {'PHPSESSID': sessionStorage.getItem('sessionId')},
        withCredentials: false
        // withCredentials: false
    })
}
// 添加自选
export const addCollect = (data) => {
    return vue.$axios({
        url: '/user/collect/addCollect',
        method: 'post',
        data,
        // withCredentials: false
    })
}
// 取消自选
export const delCollect = (data) => {
    return vue.$axios({
        url: '/user/collect/delCollect',
        method: 'post',
        data,
        // withCredentials: false
    })
}
// 取消自选
export const getTradesList = (symbol,data) => {
    return vue.$axios({
        baseURL: vue.$interfaceTransfer,
        url: '/wi/candle/'+symbol+'/M1',
        method: 'get',
        params: data,
        withCredentials: false
    })
}
// 获取用户是否实名认证

export const getRealAuthinfo = (data) => {
    return vue.$axios({
        url: '/user/realAuthInfo',
        method: 'post',
        data,
    })
}

//调整用户杠杆

export const changeLeverage = (data) =>{
    return vue.$axios({
        baseURL: vue.$interfaceTransfer,
        url:'/wi/user/set/leverage',
        method:"post",
        data,
        withCredentials: false,
        headers: {'PHPSESSID': sessionStorage.getItem('sessionId')},
    })
}

// 获取可用交易对

export const getSymbols = () =>{
    return vue.$axios({
        baseURL: vue.$interfaceTransfer,
        url:'/wi/symbols',
        method:"get",
        withCredentials: false,
        headers: {'PHPSESSID': sessionStorage.getItem('sessionId')},
    })
}

// 止盈止损
/* 
{
    "id":"不必填-委托单ID",
    "uid":"用户ID-必填",
    "symbol":"交易队",
    "type":"委托类型-必填", 止盈1，止损2
    "trigger_price":"触发价格",
    "ord_type":"订单类型",
    "ord_side":"订单方向",
    "ord_price":"委托价格",
    "ord_amount":"委托数量",
    "end_time":"截止时间 ms",
    "order_action":"订单交易类型"	2卖出
}
*/
export const entrustAdd = (data) =>{
    return vue.$axios({
        url:'/wi/entrust/add',
        method:"post",
        data,
        baseURL: vue.$interfaceTransfer,
        headers: {'PHPSESSID': sessionStorage.getItem('sessionId')},
        withCredentials: false
    })
}
// 撤销止盈止损单
export const cancelRevocation = (params) =>{
    return vue.$axios({
        url:'/wi/entrust/revocation',
        method:"get",
        params,
        baseURL: vue.$interfaceTransfer,
        headers: {'PHPSESSID': sessionStorage.getItem('sessionId')},
        withCredentials: false
    })
}
// 撤销止盈止损单
export const getEntrustList = (params) =>{
    return vue.$axios({
        url:'/wi/entrust/list',
        method:"get",
        params,
        baseURL: vue.$interfaceTransfer,
        headers: {'PHPSESSID': sessionStorage.getItem('sessionId')},
        withCredentials: false
    })
}