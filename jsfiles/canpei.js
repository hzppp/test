export function dataInit(data) {
	return new Promise((relove, resject) => {
	
		let dataList = []
		for (let i in data.groupNameArray) {
			let detail = []
			for (let j in data.detailArray) {
				for (let o in data.detailArray[j].detail) {
					if (data.groupNameArray[i] == data.detailArray[j].detail[o].groupName) {
						detail.push(data.detailArray[j].detail[o].groupDetail)
						break;
					}
				}
			}
			dataList.push({
				name: data.groupNameArray[i],
				detail
			})
		}
		
		let difData={};
		for (let i in dataList) {
			let li = [];
			for (let k in dataList[i].detail) {
				let list = [],
					data = {
						key: "",
						value: ""
					};
				for (let j in dataList[i].detail[k]) {
					if (data.key != '') { //key值是否已经有了，有的话这次循环直接取value值就可以了
						data.value = dataList[i].detail[k][j]
						list.push(data);
						if(li[j]){
							li[j].push(data.value+'|'+data.key)
						}else{
							li[j] = [data.value+'|'+data.key]
						}
						data = {
							key: "",
							value: ""
						}
					}
					if (j % 2 == 0) { //偶数或者0=>key值
						data.key = dataList[i].detail[k][j]
					}
				}
				dataList[i].detail[k] = list;
			}
			
			for(let j in li){
				let newList = Array.from(new Set(li[j]));
				if(newList.length>=2){//去重后数量相同，说明规格不同
					difData[newList[0].split('|')[1]] = true
				}else{
					difData[newList[0].split('|')[1]] = false
				}
			}
		}
		
		relove({
			dataList,
			difData
		})
	})
}
