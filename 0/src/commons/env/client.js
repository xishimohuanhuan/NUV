
let _ua = window.navigator.userAgent;

//判断是否微信登陆
export function isWeiXin() {
    return /MicroMessenger/i.test(_ua);
}

//是否为移动终端;
export function isApp() {
    return _ua.toLowerCase().match(/(ipod|iphone|android|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|wince)/i) != null;
}

//是否为android终端 
export function isAndroid() {
    return _ua.indexOf('Android') > -1 || _ua.indexOf('Adr') > -1;
}

//是否为ios终端
export function isiOS() {
    return !!_ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
}

//原生iOS
export function isNativeiOS() {
    return /Native_iOS/.test(_ua);
}

export function isNativeAndroid() {
    return /Native_Android/.test(_ua);
}

//判断QQ浏览器
export function isQQBrowser() {
    return /MQQbrowser/i.test(_ua);
}

//判断原生版本
export function nativeVersion() {
    if(isNativeiOS() || isNativeAndroid()) {
        // eslint-disable-next-line no-useless-escape
        let res = _ua.match(/Native_V[\d+][\.\d+]*/);
        // eslint-disable-next-line no-useless-escape
        if(res && /[\d+][\.\d+]*/.test(res[0].split('Native_V')[1])) {
            return res[0].split('Native_V')[1];
        }
    }
    return ''
}

let clientEnv = {
    android: isAndroid(),
    weixin: isWeiXin(),
    ios: isiOS(),
    QQBrowser: isQQBrowser(),
    isApp: isApp(),
    isNativeiOS: isNativeiOS(),
    isNativeAndroid: isNativeAndroid(),
    version: nativeVersion()
}

export { clientEnv };
