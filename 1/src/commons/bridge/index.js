/* 
  原生通信
*/

function setupWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(window.WebViewJavascriptBridge)
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback)
  }
  document.addEventListener(
    'WebViewJavascriptBridgeReady',
    function () {
      WebViewJavascriptBridge.init(function (message, responseCallback) {
        responseCallback(data);
      });
      callback(WebViewJavascriptBridge)
    },
    false
  );
  window.WVJBCallbacks = [callback];
  let WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'https://__bridge_loaded__';
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(() => {
    document.documentElement.removeChild(WVJBIframe)
  }, 0)
}

export default {
  callhandler(name, data, callback) {
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler(name, data, callback)
    })
  },
  setupWebViewJavascriptBridge: setupWebViewJavascriptBridge
}