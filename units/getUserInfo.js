// getUserInfo
let app = getApp()
export default {
	data() {
		return {
			haveUserInfoAuth: false
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
			console.log('getWxUserInfo----------')
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
							let u = uni.getStorageSync('wxUserInfo')
							that.setWxUserInfo(u)
						} else {
							app.globalData.haveUserInfoAuth = true //没有授权
							uni.getStorageSync('haveUserInfoAuth',true)
							resolve(true)
						}
					}
				})

			})
		}
	},
}
