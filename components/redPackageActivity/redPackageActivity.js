import domain from '@/configs/interface';
import request from '@/units/request.js'
import toast from '@/units/showToast.js'

// 获取用户开红包状态
export function getRedPacketStatus(activityId){
	return new Promise((resolve, reject) => {
		request({
			url: domain.getAPI('redPacketStatus'),
			header: {
				'content-type': 'application/x-www-form-urlencoded', // 默认值"
				'Cookie': domain.COMID + "=" + uni.getStorageSync(domain.COMID)
			},
			data:{
				activityId: activityId,
				t: new Date().getTime(),
			},
			success: (res)=>{
				if (res.statusCode == 200) {
					if (res.data && res.data.constructor == Object) {
						resolve(res.data);
					} else {
						reject()
						toast("网络异常，清稍后再试！redS1");
					}
				} else {
					reject()
					toast("网络异常，清稍后再试！redS2");
				}
			},
			fail(err) {
				reject(err)
				toast("网络异常，清稍后再试！redS3");
			}
		})
	})
}
// 获取当日的红包雨活动
export function getRedPacketToday(activityId){
	return new Promise((resolve, reject) => {
		request({
			url: domain.getAPI('redPacketToday'),
			header: {
				'content-type': 'application/x-www-form-urlencoded', // 默认值"
				'Cookie': domain.COMID + "=" + uni.getStorageSync(domain.COMID)
			},
			data:{
				liveRoomId: activityId,
				t: new Date().getTime(),
			},
			success: (res)=>{
				if (res.statusCode == 200) {
					if (res.data && res.data.constructor == Object) {
						resolve(res.data);
					} else {
						reject()
						toast("网络异常，清稍后再试！redt1");
					}
				} else {
					reject()
					toast("网络异常，清稍后再试！redt2");
				}
			},
			fail(err) {
				reject(err)
				toast("网络异常，清稍后再试！redt3");
			}
		})
	})
}
// 获取红包金额
export function getRedPacketAmount(){
	return new Promise((resolve, reject) => {
		request({
			url: domain.getAPI('redPacketAmount')+'?t='+new Date().getTime(),
			header: {
				'content-type': 'application/x-www-form-urlencoded', // 默认值"
				'Cookie': domain.COMID + "=" + uni.getStorageSync(domain.COMID)
			},
			success: (res)=>{
				if (res.statusCode == 200) {
					if (res.data && res.data.constructor == Object) {
						resolve(res.data);
					} else {
						reject()
						toast("网络异常，清稍后再试！reda1");
					}
				} else {
					reject()
					toast("网络异常，清稍后再试！reda2");
				}
			},
			fail(err) {
				reject(err)
				toast("网络异常，清稍后再试！reda3");
			}
		})
	})
}
// 开红包
export function getRedPacketOpen(activityId,openId,scene = 0){//scene== 0:小程序、1:App、2:H5
	return new Promise((resolve, reject) => {
		request({
			url: domain.getAPI('redPacketOpen'),
			method:"POST",
			header: {
				'content-type': 'application/json', // 默认值"
				'Cookie': domain.COMID + "=" + uni.getStorageSync(domain.COMID)
			},
			data:{
				activityId: activityId,
				openId: openId,
				scene: scene,
				t: new Date().getTime(),
			},
			success: (res)=>{
				if (res.statusCode == 200) {
					if (res.data && res.data.constructor == Object) {
						resolve(res.data);
					} else {
						reject()
						toast("网络异常，清稍后再试！redo1");
					}
				} else {
					reject()
					toast("网络异常，清稍后再试！redo2");
				}
			},
			fail(err) {
				reject(err)
				toast("网络异常，清稍后再试！redo3");
			}
		})
	})
}
// 获取红包记录
export function getRedPacketRecord(pageNo, pageSize = 10){
	return new Promise((resolve, reject) => {
		request({
			url: domain.getAPI('redPacketRecord'),
			header: {
				'content-type': 'application/x-www-form-urlencoded', // 默认值"
				'Cookie': domain.COMID + "=" + uni.getStorageSync(domain.COMID)
			},
			data:{
				pageNo: pageNo,
				pageSize: pageSize,
				t: new Date().getTime(),
			},
			success: (res)=>{
				if (res.statusCode == 200) {
					if (res.data && res.data.constructor == Object) {
						resolve(res.data);
					} else {
						reject()
						toast("网络异常，清稍后再试！redr1");
					}
				} else {
					reject()
					toast("网络异常，清稍后再试！redr2");
				}
			},
			fail(err) {
				reject(err)
				toast("网络异常，清稍后再试！redr3");
			}
		})
	})
}
/**
 * 时间格式化函数
 */
function formateXs(k) {
	if (k.toString().length > 2) {
		return k
	}
	let l = "00" + k;
	return l.substring(l.length - 2)
}
export function RedPacketTimeFormat(d1,d2) {
	var o = d2 - d1;
	var day = formateXs(Math.floor(o / 86400000));
	var n = day * 86400000;
	var hour = formateXs(Math.floor((o - n) / 3600000));
	var k = hour * 3600000;
	var min = formateXs(Math.floor((o - n - k) / 60000));
	var p = min * 60000;
	var sec = formateXs(Math.floor((o - n - k - p) / 1000));

	let createTime ={
		hour: hour.toString().split(''),
		minute: min.toString().split(''),
		second: sec.toString().split('')
	} ;
	
	return createTime;
}
