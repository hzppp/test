import toast from '@/units/showToast';
import request from '@/units/request.js';
export function getVsData(ids,rid){
	return new Promise((reolve,resject)=>{
		request({
			url:"getVSserials",
			data:{
				rid,
				leftSerialId:ids.split(",")[0],
				rightSerialId:ids.split(",")[1]
			},
			success:res=>{
				let data =res.data;
				reolve({
					...data,
					imagePklist:setArr(data.leftSerial.photo,data.rightSerial.photo),
					worthRead:setArr(data.leftSerial.worthRead,data.rightSerial.worthRead)
				})
			},
			fail:err=>{
				resject(err)
			}
		})
	})
}
// 数组交叉排序重组
function setArr(arr1,arr2){
	for (let i in arr2) {
		arr1.splice(2 * i + 1, 0, arr2[i])
	}
	return arr1;
}