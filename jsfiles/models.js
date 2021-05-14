import toast from '@/units/showToast';
import request from '@/units/request.js';
import ContrastCar from "@/units/ContrastCar.js";
import store from "@/store/index";
// 获取车品牌数据
export function getBrands(data={}) {
	return new Promise((reolve, resject) => {
		request({
			url: "getBrands",
			data,
			success: res => {
				let hotBrands = res.data.hotBrands;
				let brandsAll = res.data.brands;
				reolve({
					hotBrands,
					brandsAll,
					anchorPos:getBrandsIndex(brandsAll),
					serialGroups:res.data.serialGroups?res.data.serialGroups:[]
				})
			},
			fail: err => {
				toast("网络异常")
				resject(err)
			}
		})
	})
}
// 获取锚点
function getBrandsIndex(brands) {
	var arr = [];
	brands.sections.forEach(function(v, index) {
		var item = {};
		item.key = item.value = v.index;
		arr.push(item);
	})
	return arr;
}
// 获取已添加的车型数据
export function getAddedData(compare) {
	return new Promise((reolve, resject) => {
		var data;
		if (compare) {
			data = ContrastCar.get();
		} else {
			data = store.state.selectCars
		}
		reolve(data)
	})
}
export function getModelListBySerialId(serialId) {
	return new Promise((reolve, resject) => {
		request({
			url: "getModelListBySerialId",
			data: {
				serialId
			},
			success: res => {
				console.log(res)
				let yearArr = [];
				let sections = res.data.sections;
				for (let i = 0; i < sections.length; i++) { //筛选年款
					for (let j = 0; j < sections[i].data.length; j++) {
						yearArr.push(sections[i].data[j].yearTitle);
					}
				}
				yearArr = [...new Set(yearArr)]; //去掉重复年款
				let modelObj = {};
				let newModels = [];

				for (let i = 0; i < yearArr.length; i++) { //将车型按年款分类
					let cars = [];
					for (let j = 0; j < sections.length; j++) {
						for (let k = 0; k < sections[j].data.length; k++) {
							if (yearArr[i] == sections[j].data[k].yearTitle && sections[j].data[k].state != '停售') {
								cars.push(sections[j].data[k]);
							}
						}
					}
					if (cars.length != 0) {
						modelObj = {
							year: parseInt(yearArr[i]),
							cars: cars
						};
						newModels.push(modelObj);
					}
				}
				newModels.sort(compare('year'));

				let stopObj = {};
				let carStopSale = [];

				for (let i = 0; i < sections.length; i++) { //将停售车型筛选出来
					let data = [];
					for (let j = 0; j < sections[i].data.length; j++) {
						if (sections[i].data[j].state == '停售') {
							data.push(sections[i].data[j])
						}
					}
					if (data.length != 0) {
						stopObj = {
							title: sections[i].title,
							data: data
						};
						carStopSale.push(stopObj);
					}
				}

				let stopYearArr = [];
				for (let i = 0; i < carStopSale.length; i++) { //筛选停售车型年款
					for (let j = 0; j < carStopSale[i].data.length; j++) {
						stopYearArr.push(carStopSale[i].data[j].yearTitle);
					}
				}
				stopYearArr = [...new Set(stopYearArr)]; //去掉重复年款

				reolve({
					carSale: newModels,
					carStopSale: carStopSale,
					carStopSaleAll: carStopSale,
					stopYearArr: stopYearArr
				})
			},
			fail: () => {
				toast("网络异常")
			}
		})
	})
}
export function filterStopYear(carStopSaleAll, index, year) {
	return new Promise(reolve => {
		let newCarStop = [];
		let carStopObj = {};

		//console.log(carStopSaleAll)
		if (year == '全部年款') {
			newCarStop = carStopSaleAll;
		} else {
			for (let i = 0; i < carStopSaleAll.length; i++) {
				let data = [];
				for (let j = 0; j < carStopSaleAll[i].data.length; j++) {
					if (carStopSaleAll[i].data[j].yearTitle == year) {
						data.push(carStopSaleAll[i].data[j]);
					}
				}
				carStopObj = {
					title: carStopSaleAll[i].title,
					data: data
				};
				newCarStop.push(carStopObj);
			}
		}
		reolve({
			stopYearCur: index,
			year: year,
			carStopSale: newCarStop
		})
	})
}
//比较函数
function compare(property) {
	return function(obj1, obj2) {
		var value1 = obj1[property];
		var value2 = obj2[property];
		return value2 - value1; // 降序
	}
}
