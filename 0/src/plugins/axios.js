"use strict";

import Vue from 'vue';
import axios from "axios";

// import qs from 'qs';
// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL ='http://172.16.0.188:8002/';
axios.defaults.baseURL = process.env.VUE_APP_JAVA_apiUrl || '';

axios.defaults.timeout = 10 * 60 * 1000;
axios.defaults.withCredentials = true;
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.headers.get['Accept'] = "application/json";


let config = {
  // baseURL: process.env.VUE_APP_baseURL || process.env.VUE_APP_apiUrl || "",
  // timeout: 60 * 1000 // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};


const _axios = axios.create(config);
let axiosPromiseArr=[];
_axios.interceptors.request.use(
  function(config) {
    // 在发送请求设置cancel token
    config.cancelToken = new axios.CancelToken(cancel => {
      axiosPromiseArr.push({cancel})
      Vue.prototype.$axiosPromiseArr=axiosPromiseArr;
    })
    // Do something before request is sent
    let cookieItem = document.cookie.split(';'),
      lang = 'zh-cn',
      userId = '';
    for (let item of cookieItem) {
      let itemArray = item.split('=');
      if(itemArray.length > 0 && itemArray[0].trim() === 'think_language') {
        lang = itemArray[1];
      }
      if(itemArray.length > 0 && itemArray[0].trim() === 'userId') {
        userId = itemArray[1] ? JSON.parse(decodeURIComponent(itemArray[1])).userId : '';
      }
    }
    if (!config.data) {
      config.data = {};
    }
    if (!config.params) {
      config.params = {};
    }
    if (config.method === 'post') {
      config.data["lang"] = lang;
    } else if (config.method === 'get') {
      config.params["lang"] = lang;
    }
    return config;
  },
  function(error) {
    if(_axios.isCancel(error)) {
      // console.log('请求取消')
      
    }else {
        // Toast({
        //     message: '连接服务器失败，请稍后再试！',
        //     duration: 2000,
        //     className: 'globalMsg'
        // });
        // return Promise.reject(error);
    }
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
      if(response.data.status==200){
      }else {
          // Toast({
          //     message: response.data.msg,
          //     duration: 3000
          // });
      }
    // Do something with response data
    return response;
  },
  function(error) {

    // Do something with response error
    return Promise.reject(error);
  }
);

Plugin.install = function(Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
  });
};

Vue.use(Plugin)

export default Plugin;
