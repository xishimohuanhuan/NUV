/**
 * 匹配数组中的值
 * @param srouce
 * @param macthArr
 */
export function match(srouce = '', macthArr) {
  for (let i = 0, len = macthArr.length; i < len; i++) {
    if (macthArr[i] == srouce) {
      return true;
    }
    if (srouce.test && srouce.test(macthArr[i])) {
      return true;
    }
  }
  return false;
}

//获取cookie、
export function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return (arr[2]);
  else
    return null;
}

//设置cookie
export function setCookie(c_name, value, expiredays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
}

//删除cookie
export function delCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1*60*60);
  var cval = getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
