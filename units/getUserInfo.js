// getUserInfo
let app = getApp()
export default {
	data() {
		return {
			isUserInfoPage: false
		}
	},
	methods: {
		getWxUserInfoButton(e) {
			let {
				detail = {}
			} = e
			if (detail.errMsg.indexOf("ok") > -1) {
				console.log('成功授权,来源按钮')
				this.setWxUserInfo(detail)
			} else {
				console.log('拒绝授权,来源按钮')
			}
		},
		setWxUserInfo(info) { //把微信昵称头像赋值到app.js globalData
			app.globalData.wxUserInfo = info
		},
		async getWxUserInfo() {
			let that = this
			console.log('getWxUserInfo')
			return new Promise(async (resolve, reject) => {
				uni.getSetting({
					success(data) {
						console.log(data)
						let {
							authSetting = {}
						} = data
						let issq = authSetting['scope.userInfo']
						// let {loginJson={}}=app.globalData
						if (issq) { //已经授权
							uni.getUserInfo({
								lang: "zh_CN",
								success(u) {
									console.log('已经授权==============',u)
									that.setWxUserInfo(u)
									resolve(true)
								}
							})
						} else {
							app.globalData.isUserInfoPage = true //没有授权
							resolve(true)
						}
					}
				})

			})
		}
	},
}
