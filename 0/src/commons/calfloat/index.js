import BigNumber  from 'bignumber.js';
/**
 * 计算浮点型数  0.1+0.2 ?== 0.3;
 * @param  {Number} num1
 * @param  {Number} num2
 * @return {Number} 
 */
const numPlus = (num1, num2) => {
	let n =  new BigNumber(num1);
	let m = new BigNumber(num2);
	return n.plus(m).toNumber();
};
const numMinus = (num1, num2) => {
	let n =  new BigNumber(num1);
	let m = new BigNumber(num2);
	return n.minus(m).toNumber();
};
const multipliedBy = (num1, num2) => {
	let n =  new BigNumber(num1);
	let m = new BigNumber(num2);
	return n.multipliedBy(m).toNumber();
};
const dividedBy = (num1, num2) => {
	let n =  new BigNumber(num1);
	let m = new BigNumber(num2);
	return n.dividedBy(m).toNumber();
};
const toBignumber = (num1) => {
  return	new BigNumber(num1);
};
export {numPlus, numMinus, multipliedBy, dividedBy, toBignumber}