export default {
  /**
   * 将科学计数法转换为小数
   * @param {*} num 
   */
  toNonExponential(num) {
    num = parseFloat(num);
    var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
    return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
  }
}