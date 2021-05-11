import domain from '@/configs/interface';
import request from "@/units/request.js"

let app = getApp()

module.exports = {
	// 获取车型基础信息
	getModelData: async (id) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getModelData'),
			method: 'GET',
			data: {
				mid: id
			}
		})
		console.log(data)
		if (!data.baseParameter) {
			return data
		}
		let dataList1 = data.baseParameter
		let modelAllData = []
		for (let i = 0, len = dataList1.length; i < len; i++) {
			if (i % 2 === 1) {
				modelAllData.push({
					name: dataList1[i - 1],
					value: dataList1[i]
				})
			}
		}
		//拼接数据（坑爹接口）
		let basedetail = data.detail
		//排量
		modelAllData.push({
			name: basedetail[1].groupDetail[2],
			value: basedetail[1].groupDetail[3]
		})
		//驱动方式
		modelAllData.push({
			name: basedetail[4].groupDetail[0],
			value: basedetail[4].groupDetail[1]
		})
		//燃料形式
		modelAllData.push({
			name: basedetail[1].groupDetail[32],
			value: basedetail[1].groupDetail[33]
		})
		let size = [] //长宽高轴
		let xx = ''
		for (let i in modelAllData) {
			let obj = modelAllData[i]
			if (obj.name == '长×宽×高(mm)') {
				console.log(obj)
				xx = obj.value + '×'
			}
			if (obj.name == '轴距(mm)') {
				xx += obj.value
			}
		}
		if (xx.indexOf('×') > -1) {
			size = xx.split('×')
		}
		return {
			modelAllData: modelAllData,
			modelName: data.modelName,
			shortName: data.shortName,
			size: size
		}
	},
	// 外观
	getModelParamEquip: async (id) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getModelParamEquip') + id + '/model_param_equip',
			method: 'GET',
			data: {}
		})
		return data
	},
	getProvince: async (from = '') => {
		let url = domain.getAPI('getProvince')
		if (from != 'form') {
			url = domain.getAPI('getProvinceCentral')
		}
		let {
			data
		} = await request({
			url: url,
			data: {}
		})
		return data
	},
	getRegionByProvince: async (provinceId) => {
		console.log('provinceId', provinceId)
		let name = 'province_' + provinceId
		if (app.globalData[name]) {
			return app.globalData[name]
		} else {
			let {
				data
			} = await request({
				url: domain.getAPI('getRegionByProvince'),
				data: {
					provinceId: provinceId
				}
			})
			if (data.code == 1) {
				app.globalData[name] = data
			}
			return data
		}
	},
	getRegion: async () => {
		let {
			data
		} = await request({
			url: domain.getAPI('getRegion'),
		})

		return data
	},
	// zb string ${longitude},${latitude}
	getIpAreaCoord: async (zb) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getIpAreaCoord'),
			data: {
				resp_enc: "utf-8",
				level: 2,
				json: true,
				coords: zb
			}
		})
		console.log(data)
		app.globalData.currentLocation.realPositionSF = data
		if (data.proCode == '330000' || data.proCode == '350000') {

		} else {
			data = {
				"pro": "浙江省",
				"proCode": "330000",
				"city": "杭州市",
				"cityCode": "330100",
				"region": "",
				"regionCode": "",
				"error": ""
			}
			console.log('---------------------')
		}
		return data

	},
	getAreaInfo: async (regionId) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getAreaByRegion'),
			data: {
				regionId: regionId
			}
		})
		return data
	},
	getRegionIpArea: async (cityCode) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getRegionIpArea'),
			data: {
				m: "getCityById",
				encode: "utf8",
				cityCode: cityCode
			}
		})
		return data
	},
	// 活动
	getactivity: async (regionId, size = 3, pageNum = 1) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getactivity'),
			data: {
				regionId: regionId,
				size: size,
				pageNum: pageNum
			}
		})
		return data
	},
	// 获取车系列表
	getAutoSerialList: async () => {
		if (app.globalData.showVehicle) {
			return app.globalData.showVehicle
		}
		let {
			data
		} = await request({
			url: domain.getAPI('getAutoSerialList'),
			data: {}
		})
		if (data.code == 1) {
			app.globalData.showVehicle = data
		}
		return data
	},
	// 获取价格
	getAutoPrice: async (regionId, serialGroupId) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getAutoPrice'),
			data: {
				regionId: regionId,
				serialGroupId: serialGroupId
			}
		})
		return data
	},
	// 获取活动内容
	getActivityContent: async (id) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getActivityContent') + id,
			data: {}
		})
		return data
	},
	getWelfare: async (regionId, pageSize, pageNum) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getWelfare'),
			data: {
				pageNum: pageNum,
				pageSize: pageSize,
				regionId: regionId
			}
		})
		return data
	},
	// 用户留资
	submitClue: async (cs) => {
		let {
			data
		} = await request({
			url: domain.getAPI('submitClue'),
			method: "POST",
			data: cs
		})
		return data
	},

	// 获取用户信息
	getPocketUserInfo: async (isupdata = false) => {
		if (app.globalData.pocketUserInfo && !isupdata) {
			return app.globalData.pocketUserInfo
		}
		let {
			data
		} = await request({
			url: domain.getAPI('getPocketUserInfo'),
		})
		// data.data.phone = null
		if (data.code == 1) {
			app.globalData.pocketUserInfo = data.data
			// console.log(app.globalData)
			if (data.data.salesId && data.data.salesId != 0 && !app.globalData.salesId) {
				// app.globalData.salesId = data.data.salesId
			}
		}
		return data
	},
	// 记录活动访问
	visitActivity: async (activityId) => {
		let {
			data
		} = await request({
			url: domain.getAPI('visitActivity'),
			method: "POST",
			data: {
				activityId: activityId
			}
		})
		return data
	},
	// 保存用户信息
	saveWXuserInfo: async (data) => {
		await request({
			url: domain.getAPI('saveWXuserInfo'),
			data
		})
		// 新增获取用户信息
		if(!app.globalData.pocketUserInfo){
			await module.exports.getPocketUserInfo();
			// await this.getPocketUserInfo()
		}
	},
	// 手机号解密
	decryptPhone: async (encryptedData, iv) => {
		let {
			data
		} = await request({
			url: domain.getAPI('decryptPhone'),
			data: {
				encryptedData: encryptedData,
				iv: iv
			}
		})
		return data
	},
	// 获取用户领取的优惠券
	getUserOupons: async () => {
		let {
			data
		} = await request({
			url: domain.getAPI('getUserOupons'),
		})
		return data
	},
	// getPanosInfo2 获取vr看车图片
	getPanosInfo2: async (sgId, bId = 2) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getPanosInfo2'),
			data: {
				type: 3,
				bId: bId,
				sgId: sgId
			}
		})
		return data
	},

	// vehicleOupons 车型展厅，获取优惠券
	vehicleOupons: async (regionId, serialGroupId) => {
		let {
			data
		} = await request({
			url: domain.getAPI('vehicleOupons'),
			data: {
				regionId: regionId,
				serialGroupId: serialGroupId
			}
		})
		return data
	},
	// 获取附近经销商
	getDealers: async (rid, pageNum = 1, pageSize = 10) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getDealers'),
			data: {
				aq: 1,
				manuId: 2,
				rid: rid, //城市id
				pageNum: pageNum,
				pageSize: pageSize
			}
		})
		return data
	},
	// /interface/sales/get_sales_list.jsp
	getSalesList: async (cs) => {
		cs.dealerType = 1
		let {
			data
		} = await request({
			url: domain.getAPI('getSalesList'),
			data: cs
		})
		return data
	},
	// 获取车型
	getModelListBySerialId: async (id) => {
		// magearHost
		let {
			data
		} = await request({
			url: domain.getAPI('getModelListBySerialId'),
			data: {
				v: 4,
				serialId: id
			}
		})
		return data
	},
	getpreClue: async (cs) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getpreClue'),
			data: {
				...cs
			}
		})
		return data
	},
	// 提交formid
	saveFormId: async (formId) => {
		let {
			data
		} = await request({
			url: domain.getAPI('DOMAIN'),
			method: "POST",
			data: {
				formId
			}
		})
		return data
	},
	// 获取经销商
	getFormDealer: async (d) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getFormDealer'),
			data: d
		})
		return data
	},
	// 我的页面
	// 获得用户基础信息
	getUser: async () => {
		let {
			data
		} = await request({
			url: domain.getAPI('getUser'),
		})
		if (data.data) {
			if (data.data.unReadNum > 0) {
				uni.showTabBarRedDot({
					index: 4
				})
			} else {

				uni.hideTabBarRedDot({
					index: 4
				})
			}
		}
		return data
	},
	// 获取上传upc 的参数
	// uploadUPC:async (url) =>{
	//     let {data} = await wx.uploadFile({
	//         url: `https://upc.pcauto.com.cn/upload_quick.jsp?referer=http://play10.pcauto.com.cn/&application=autopocket&keepSrc=yes&readExif=no`,
	//         filePath: url,
	//         name: 'file',
	//         method:"POST"
	//     })
	//     return data
	// },
	// 上传驾驶证
	uploadLicencePic: async (url) => {
		let {
			data
		} = await request({
			url: domain.getAPI('uploadLicencePic'),
			data: {
				'url': url
			}
		})
		return data
	},
	//获得用户个人信息
	detailedMessage: async () => {
		let {
			data
		} = await request({
			url: domain.getAPI('detailedMessage'),
		})
		return data
	},
	//提交用户个人信息
	userMessageEntering: async (message) => {
		let {
			data
		} = await request({
			url: domain.getAPI('userMessageEntering'),
			data: {
				carNum: message.carNum,
				mobile: message.mobile,
				model: message.model,
				name: message.name,
				nickName: message.nickName,
				regionId: message.regionId,
				vin: message.vin,
				picUrl: message.picUrl,
				address: message.address
			},
			method: "POST"
		})
		return data
	},
	// 车驾信息认证
	Carapprove: async (message) => {
		let {
			data
		} = await request({
			url: domain.getAPI('Carapprove'),
			data: {
				"carNum": message.carNum,
				"model": message.model,
				"name": message.name,
				"picUrl": message.picUrl,
				"vin": message.vin,
				"sgId": message.sgId,
				"sgName": message.sgName
			},
			method: "POST"
		})
		return data
	},
	//上传到 UPC
	uploadPhoto: async (data, tempFilePath) => {
		const {
			dataSign,
			sessionKey,
			curTime
		} = data.data
		// let {
		// 	data1
		// } = await uni.uploadFile({
		// 	url: domain.getAPI('uploadPhoto'),
		// 	filePath: tempFilePath,
		// 	name: 'fileData',
		// 	header: {
		// 		dataSign,
		// 		sessionKey,
		// 		curTime
		// 	}
		// })
		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url: domain.getAPI('uploadPhoto'),
				filePath: tempFilePath,
				name: 'fileData',
				header: {
					dataSign,
					sessionKey,
					curTime
				},
				success: (res) => {
					resolve(res)
				},
				fail:() => {
					reject();
				}
			})
		}) 
	},
	// 获取文章列表
	getArticleList: async (d) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getArticleList'),
			data: d
		})
		return data
	},
	// 获取动态列表
	getDynamicList: async (d) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getDynamicList'),
			data: d
		})
		return data
	},
	// 获取主题列表
	getThemeList: async (d) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getThemeList'),
			data: d
		})
		return data
	},
	// 点赞
	like: async (d) => {

		// const header = {"content-type": "application/x-www-form-urlencoded"}
		let {
			data
		} = await request({
			url: domain.getAPI('like'),
			method: "POST",
			// header,
			data: d
		})
		return data
	},
	// 发布动态
	putDynamic: async (d) => {
		const header = {
			"content-type": "application/x-www-form-urlencoded"
		}
		let {
			data
		} = await request({
			url: domain.getAPI('putDynamic'),
			method: "POST",
			// header,
			data: d
		})
		return data
	},
	// 获取评论列表
	// dynamicId:id,page:1,pageSize:10
	getCommentList: async (d) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getCommentList'),
			data: d
		})
		return data
	},
	// 发表评论
	publishComment: async (d) => {
		let {
			data
		} = await request({
			url: domain.getAPI('publishComment'),
			method: "POST",
			data: d
		})
		return data
	},
	// 获取动态详情
	getDynamicDetails: async (dynamicId, likeSize = 10) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getDynamicDetails') + dynamicId,
			data: {
				likeSize
			}
		})
		return data
	},
	// 
	getThemeData: async (themeId) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getThemeData') + themeId,
		})
		return data
	},
	// 获取文章内容
	getArticleContent: async (articleId, type) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getArticleContent'),
			data: {
				articleId,
				type
			}
		})
		return data
	},
	getAllTheme: async (d) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getAllTheme'),
			data: d
		})
		return data
	},
	// 上传图片到upc
	uploadUPC: async (data) => {
		// return await uni.uploadFile({
		// 	url: domain.getAPI('uploadUPC'),
		// 	filePath: data,
		// 	name: 'file',
		// 	method: "POST"
		// })
		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url: domain.getAPI('uploadUPC'),
				filePath: data,
				name: 'file',
				method: "POST",
				success: (res) => {
					resolve(res)
				},
				fail:() => {
					reject();
				}
			})
		}) 
	},
	// 获取未读消息
	getUserMessage: async (page, pageSize) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getUserMessage'),
			data: {
				page,
				pageSize
			}
		})
		return data
	},
	// 检查图片是否合法
	checkImage: (file) => {
		let session3rd = uni.getStorageSync('session-3rd')
		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url: domain.getAPI('checkImage'),
				filePath: file,
				header: {
					token: session3rd
				},
				name: 'file',
				method: "POST",
				success: (res) => {
					resolve(res)
				},
				fail:() => {
					reject();
				}
			})
		}) 
	},
	// 获取签到数据
	getsignIn: async () => {
		let {
			data
		} = await request({
			url: domain.getAPI('getsignIn')
		})
		return data
	},
	// 签到
	submitSignIn: async () => {
		let {
			data
		} = await request({
			url: domain.getAPI('submitSignIn'),
			method: "POST"
		})
		return data
	},
	// 获取众享币数
	getCredits: async () => {
		let {
			data
		} = await request({
			url: domain.getAPI('getCredits')
		})
		return data
	},
	// 获取任务列表
	getTaskList: async () => {
		let {
			data
		} = await request({
			url: domain.getAPI('getTaskList')
		})
		return data
	},
	// 获取众享币详情
	getRecord: async (page, pageSize) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getRecord'),
			data: {
				page,
				pageSize
			}
		})
		return data
	},
	// 获取积分商城链接
	getMallLink: async (redirect) => {
		if (redirect) {
			var {
				data
			} = await request({
				url: domain.getAPI('getMallLink'),
				data: redirect
			})
		} else {
			var {
				data
			} = await request({
				url: domain.getAPI('getMallLink'),
			})
		}

		return data
	},
	// 获取积分商城链接
	getNotify: async () => {
		let {
			data
		} = await request({
			url: domain.getAPI('getNotify')
		})
		return data
	},
	// 获取兑换记录链接
	getPrizeRecord: async () => {
		let {
			data
		} = await request({
			url: domain.getAPI('getPrizeRecord')
		})
		return data
	},
	// 活动分享 
	shareActivity: async (id) => {
		let {
			data
		} = await request({
			url: domain.getAPI('shareActivity') + `${id}/share`
		})
		return data
	},
	// 文章分享 
	shareArticle: async (articleId, type) => {
		let {
			data
		} = await request({
			url: domain.getAPI('shareArticle'),
			data: {
				articleId,
				type
			}
		})
		return data
	},
	//获取签到活动数据
	getSignInActData: async (id) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getSignInActData') + id
		})
		return data
	},
	getCode: async (dynamicId) => { //获取二维码
		let cs = `?sceneId=gh_dd83231d4d16&scene=to=dynamicDetails-dynamicId=${dynamicId}`
		// let data = await uni.downloadFile({
		// 	url: domain.getAPI('getCode') + cs,
		// })
		return new Promise((resolve, reject) => {
			uni.downloadFile({
				url: domain.getAPI('getCode') + cs,
				success: (res) => {
					resolve(res)
				},
				fail:() => {
					reject();
				}
			})
		}) 
	},
	getSalesId: async () => {
		let {
			data
		} = await request({
			url: domain.getAPI('getSalesId')
		})
		return data
	},
	getH5URL: async (url) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getH5URL'),
			data: {
				url
			}
		})
		return data
	},
	// 我的关注
	getMyFocus: async (page, pageSize = 10) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getMyFocus'),
			data: {
				page,
				pageSize
			}
		})
		return data
	},
	// 我的粉丝
	getMyFans: async (page, pageSize = 10) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getMyFans'),
			data: {
				page,
				pageSize
			}
		})
		return data
	},
	// +关注
	addFocus: async (toUserId) => {
		let {
			data
		} = await request({
			url: domain.getAPI('addFocus'),
			data: {
				toUserId
			}
		})
		return data
	},
	// 取消关注
	cancelFocus: async (toUserId) => {
		let {
			data
		} = await request({
			url: domain.getAPI('cancelFocus'),
			data: {
				toUserId
			}
		})
		return data
	},
	// 获取用户信息-个人主页
	getUserInfo: async (userId) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getUserInfo'),
			data: {
				userId
			}
		})
		return data
	},
	// 获取个人动态
	getUserDynamicList: async (userId, page, pageSize = 10) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getUserDynamicList'),
			data: {
				userId,
				page,
				pageSize
			}
		})
		return data
	},
	// 删除动态
	deleteDynamic: async (dynamicId, userId) => {
		let {
			data
		} = await request({
			url: domain.getAPI('deleteDynamic'),
			data: {
				dynamicId,
				userId
			}
		})
		return data
	},
	// 获取设定车系
	getVehicle: async () => {
		let {
			data
		} = await request({
			url: domain.getAPI('getVehicle')
		})
		return data
	},
	// 获取推荐动态
	getTJdynamic: async (page, pageSize) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getTJdynamic'),
			data: {
				page,
				pageSize
			}
		})
		return data
	},
	// 获取关注动态
	getFocusDynamic: async (page, pageSize) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getFocusDynamic'),
			data: {
				page,
				pageSize
			}
		})
		return data
	},
	// 获取文章详情
	getDynamicArticle: async (articleId) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getDynamicArticle') + articleId
		})
		return data
	},
	// 动态被访问
	visitDynamic: async (dynamicId) => {
		let {
			data
		} = await request({
			url: domain.getAPI('visitDynamic'),
			method: "PUT",
			data: {
				dynamicId
			}
		})
		return data
	},
	getVehicleExhibitionSalesInfo: async (paramter) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getVehicleExhibitionSalesInfo'),
			data: paramter
		})
		return data
	},
	mallIndex:async(para)=>{
		let {data} = await request({
			url:domain.getAPI('mallIndex'),
			data:para
		})
		return data
	},
	mallRecord:async(para)=>{
		let {data} = await request({
			url:domain.getAPI('mallRecord'),
			data:para
		})
		return data
	},
	mallGoodDetail:async(para)=>{
		let {data} = await request({
			url:domain.getAPI('mallGoodDetail'),
			data:para
		})
		return data
	},
	mallCreateOrder:async(para)=>{
		let {data} = await request({
			url:domain.getAPI('mallCreateOrder'),
			method: "POST",
			data:para
		})
		return data
	},
}
