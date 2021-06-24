/**
 * 时间格式化函数
 */
export default function timeFormat(time, flag) {
	let t = new Date(time.replace(/-/g,'/'));

	let month = t.getMonth() + 1;
	let date = t.getDate();
	let hour = t.getHours();
	let min = t.getMinutes();
	let sec = t.getSeconds();
	if (month < 10) {
		month = '0' + month;
	}
	if (date < 10) {
		date = '0' + date;
	}
	if (hour < 10) {
		hour = '0' + hour;
	}
	if (min < 10) {
		min = '0' + min;
	}
	if (sec < 10) {
		sec = '0' + sec;
	}

	let createTime = t.getFullYear() + '-' + month + '-' + date + ' ' + hour + ':' + min;
	let createTime2 = t.getFullYear() + '-' + month + '-' + date;
	let createTime3 = t.getFullYear() + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec;
	let createTime4 = t.getFullYear() + '.' + month + '.' + date + ' ' + hour + ':' + min;
	let createTime5 = t.getFullYear() + '.' + month + '.' + date + ' ' + hour + ':' + min + ':' + sec;
	if (flag == 'time3') {
		return createTime3;
	}else if (flag == 'time') {
		return createTime;
	}else if(flag == 'time4'){
		return createTime4
	}else if(flag =='time5'){
		return createTime5
	}else{
		return createTime2;
	}

}
