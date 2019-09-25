import Vue from 'vue';

const vm  = new Vue();
function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}

Vue.filter('date', (dateTime, fmt = 'yyyy-MM-dd') => {
  let date = dateTime;
  if (isFinite(date)) {
    date = new Date(date);
  }
  if (!(date instanceof Date)) {
    return date;
  }
  if(date.getFullYear() <= 1999) {
    date = new Date(dateTime * 1000);// 判断毫秒还是秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
});
Vue.filter('timeDown', (date, fmt = 'hh:mm:ss') => {
  if (!isFinite(date)) {
    return '--';
  }
  const DAY = 1000*60*60*24,
        HOUR = 1000*60*60,
        MINUTE = 1000*60,
        SECOND = 1000;
  let day = Math.floor(date/DAY),
      hour = Math.floor((date - day*DAY)/HOUR),
      min =Math.floor((date - hour*HOUR)/MINUTE),
      sec =Math.floor((date - min*MINUTE)/SECOND);
  let o = {
    'd+': day,
    'h+': hour,
    'm+': min,
    's+': sec,
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
});
Vue.filter('interceptCharacters', (str, num) => {
  return (str || '').substr(0, num) + '...';
})
Vue.filter('toNumStrFilter', (val, dig = 2) => {
  if (val === null || val === undefined) return val;
    let n = Number(val);
    if (isNaN(n)) return false;
    if (!isFinite(n)) return '--';
    let m = n.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
    let str =  n.toFixed(Math.max(0, (m[1] || '').length - m[2]));
    if(str.indexOf('.') === -1) return val;
    return Number(str.slice(0, str.indexOf('.') + dig + 1))
})
Vue.filter('retainDecimal', (num, dig) => {
  dig = dig || 2
  if (num === undefined || num === null) return num;
  if (isNaN(num)) return false;
  return Number(String(num).slice(0, String(num).indexOf('.') + dig + 1))
});
Vue.filter('processingData', (data, dig) => {
  // console.log(data);
  // dig = dig || 3
  // if (num === undefined || num === null) return num;
  // if (isNaN(num)) return false;
  // return Number(String(num).slice(0, String(num).indexOf('.') + dig + 1))

});
Vue.filter('toNonExponential', (num) => {
  num = parseFloat(num);
  if(isNaN(num)) return '--';
  if (!isFinite(num)) return '--'
  var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
  return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));

});
