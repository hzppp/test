import domain from '@/configs/interface';
import request from "@/units/request.js"

let app = getApp()

module.exports = {
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
				cityId: regionId,
				size: size,
				pageNum: pageNum
			}
		})
		return data
	},
	getActivityUser:async (params) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getActivityUser'),
			data: params
		})
		return data
	},
	/* 直播列表 */
	getLiveList:async (params) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getLiveList'),
			data: params
		})
		return data;
	},
	/* 直播详情 */
	getLiveDetail:async(params)=>{
		let {
			data
		} = await request({
			url: domain.getAPI('getLiveDetail'),
			data: params
		})
		console.log('直播详情===',data)
		return data;
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
			url: domain.getAPI('getActivityContent'),
			data: {
				id: id
			}
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
				cityId: regionId
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
		// if(!app.globalData.pocketUserInfo){
		// 	await module.exports.getPocketUserInfo();
		// 	// await this.getPocketUserInfo()
		// }
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
	getUserOupons: async (param) => {
		let {
			data
		} = await request({
			url: domain.getAPI('getUserOupons'),
			data:param
		})
		return data
	},
	/* 优惠券详情 */
	userOuponsDet:async (param) => {
		let {
			data
		} = await request({
			url: domain.getAPI('userOuponsDet'),
			data:param
		})
		return data
	},
	/* 优惠券核销 */
	doCouponVerifiy:async (param) => {
		let {
			data
		} = await request({
			url: domain.getAPI('doCouponVerifiy'),
			data:param
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
        // if (!app.globalData.pocketUserInfo) {
        //     await module.exports.getPocketUserInfo();
        //     // await this.getPocketUserInfo()
        // }
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
                fail: () => {
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
    // 获取文章内容
    getArticleContent: async (id) => {
        let {
            data
        } = await request({
            url: domain.getAPI('getArticleContent'),
            data: {
                id
            }
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
                fail: () => {
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
                fail: () => {
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
    mallIndex: async (para) => {
        let {data} = await request({
            url: domain.getAPI('mallIndex'),
            data: para
        })
        return data
    },
    mallRecord: async (para) => {
        let {data} = await request({
            url: domain.getAPI('mallRecord'),
            data: para
        })
        return data
    },
    mallGoodDetail: async (para) => {
        let {data} = await request({
            url: domain.getAPI('mallGoodDetail'),
            data: para
        })
        return data
    },
    mallCreateOrder: async (para) => {
        let {data} = await request({
            url: domain.getAPI('mallCreateOrder'),
            method: "POST",
            data: para
        })
        return data
    },
    //获取城市
    fetchAllCityList: async (para) => {
        let {data} = await request({
            url: domain.getAPI('allCityList'),
            method: "GET",
            data: para
        })
        return data
    },
    // 请求所有的省份
    fetchProvinceList: async () => {
        let {data} = await request({
            url: domain.getAPI('fetchProvinceList'),
            method: "GET",
        })
        return data
    },
    // 根据省份id请求城市
    fetchCityListByProvinceId: async (para) => {
        let {data} = await request({
            url: domain.getAPI('fetchCityListByProvinceId'),
            method: "GET",
            data: para
        })
        return data
    },
    // 根据城市id请求地区
    fetchDistrictListByCityId: async (para) => {
        let {data} = await request({
            url: domain.getAPI('fetchDistrictListByCityId'),
            method: "GET",
            data: para
        })
        return data
    },
    //获取经销商列表
    fetchDealersList: async (para) => {
        let {data} = await request({
            url: domain.getAPI('fetchdealersList'),
            method: "GET",
            data: para
        })
        return data
    },
    // 根据城市id请求经销商
    fetchDealerListByCityId: async (para) => {
        let {data} = await request({
            url: domain.getAPI('fetchDealerListByCityId'),
            method: "GET",
            data: para
        })
        return data
    },
	// 获取车系
	fetchSerialList: async (para) => {
		let {data} = await request({
		    url: domain.getAPI('fetchSerialList'),
		    method: "GET",
		    data: para
		})
		return data
	},
    // 获取首页数据
    getHomepageData: async (para) => {
        let {data} = await request({
            url: domain.getAPI('getHomepageData'),
            method: "GET",
            data:para
        })
		return data
    },
	// 根据城市id请求经销商
	fetchDealerListByCityId: async(para) => {
		let {data} = await request({
			url:domain.getAPI('fetchDealerListByCityId'),
			method: "GET",
			data: para
		})
		return data
	},
	// 获取车型对比数据
	fetchCarSerialContrast: async(para) => {
		let {data} = await request({
			url:domain.getAPI('fetchCarSerialContrast'),
			method: "GET",
			data: para
		})
		return data
	},
	// 获取车系详情
	fetchSerialDetail: async(para) => {
		let {data} = await request({
			url:domain.getAPI('fetchSerialDetail'),
			method: "GET",
			data: para
		})
		return data
	},
	// 获取车型列表
	fetchModelsList: async(para) => {
		let {data} = await request({
			url:domain.getAPI('fetchModelsList'),
			method: "GET",
			data: para
		})
		return data
	},
	// 获取车型列表
	fetchSerialScreenList: async(para) => {
		let {data} = await request({
			url:domain.getAPI('fetchSerialScreenList'),
			method: "GET",
			data: para
		})
		return data
	},
    //获取验证码
	fetchCode: async(para) => {
		let {data} = await request({
			url:domain.getAPI('fetchCode'),
			method: "POST",
			data: para,
            header: {
                "Content-Type":"application/x-www-form-urlencoded"
            }
		})
		return data
	},
    //预约试驾
	postYuYueDrive: async(para) => {
		let {data} = await request({
			url:domain.getAPI('postYuYueDrive'),
			method: "POST",
			data: para,
		})
		return data
	},
       	// 计算器获取车型
	getCalcModel: async(para) => {
		let {data} = await request({
            url:domain.getAPI('calcModel'),
            method: "GET",
			data: para
		})
		return data
    },
	//获取验证码
	fetchCode: async(para) => {
			let {data} = await request({
					url:domain.getAPI('fetchCode'),
					method: "POST",
					data: para,
		header: {
			"Content-Type":"application/x-www-form-urlencoded"
		}
			})
			return data
	},
}
