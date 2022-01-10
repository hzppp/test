export const checkPhone = function(val) {
	//校验手机  
	var pattern = /(^[0-9]{3,4}\-[0-9]{5,8}$)|(^0{0,1}1[0-9]{10}$)/;
	if (pattern.test(val)) {
		return true;
	} else {
		return false;
	}
};
export const checkName = function(val) {
	//校验姓名  
	var pattern = /^[\u4e00-\u9fa5a-zA-Z\s]{1,20}$/;
	if (pattern.test(val)) {
		return true;
	} else {
		return false;
	}
};
export const trim = function(str) {
	//去除两边空格
	return str.replace(/(^\s*)|(\s*$)/g, "");
};
export const getYesterDayDate = function() {
	//获取昨日
	const date = new Date(new Date().getTime() - 3600 * 1000 * 24 * 1)
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();
	month = month > 9 ? month : '0' + month;
	day = day > 9 ? day : '0' + day;
	return `${year}-${month}-${day}`;
};