import api from '@/public/api/index'
import login from '@/units/login'
const app = getApp()
export default {
    data() {
        return {
            haveUserInfoAuth: false
        }
    },
    onLoad() {
        this.getStorageUserInfo()
    },
    onShow() {
        this.getStorageUserInfo()
    },
    methods: {
        getStorageUserInfo() {
            let userAuth = uni.getStorageSync('haveUserInfoAuth')
            if (userAuth) {
                app.globalData.haveUserInfoAuth = userAuth
                this.haveUserInfoAuth = app.globalData.haveUserInfoAuth
            }
        },
        getWxUserInfoAuth(callback,from="") {
            // console.log('getWxUserInfoAuth', e)
            if(app.globalData.hasAuthorized) return;
            app.globalData.hasAuthorized = true;

            // #ifdef MP-TOUTIAO
            console.log('#ifdef TOUTIAO')
            uni.getUserInfo({
                desc: '完善信息',
				withCredentials:true,
                success: async (res) => {
					console.log('res',res)
                    let info = res
                    await api.saveWXuserInfo({
                        encryptedData: info.encryptedData,
                        iv: info.iv,
                        rawData: info.rawData,
                        signature: info.signature
                    }).then(async sRes=> {
                        console.log('saveWXuserInfo',sRes)
                        const {data,code} = sRes
                        if(code == 1) {
							if(data.nickName){
								data['wxName']=data.nickName
							}
							if(data.avatarUrl){
								data['wxHead']=data.avatarUrl
							}
							
						    app.globalData.haveUserInfoAuth = !!data.wxName
							uni.setStorageSync('haveUserInfoAuth', !!data.wxName)
							app.globalData.wxUserInfo = data
							uni.setStorageSync('wxUserInfo', data)
							this.haveUserInfoAuth = !!data.wxName
                         
							callback()
                        }
                        if(code == -4) {  //如果未登录 则重新登录 并执行原逻辑
                            console.log('如果未登录 则重新登录 并执行原逻辑')
                            await login.login()
                            await api.saveWXuserInfo({
                                encryptedData: info.encryptedData,
                                iv: info.iv,
                                rawData: info.rawData,
                                signature: info.signature
                            }).then(async sRes=> {
                                console.log('sssres',sRes)
                                let {data,code} = sRes
                                if(code == 1) {
									if(data.nickName){
										data['wxName']=data.nickName
									}
									if(data.avatarUrl){
										data['wxHead']=data.avatarUrl
									}
                                   app.globalData.haveUserInfoAuth = !!data.wxName
                                   uni.setStorageSync('haveUserInfoAuth', !!data.wxName)
                                   app.globalData.wxUserInfo = data
                                   uni.setStorageSync('wxUserInfo', data)
                                   this.haveUserInfoAuth = !!data.wxName
									callback()
                                }
                            })
                        }
						app.globalData.hasAuthorized = false;
                    })
					
                },
                fail: (res) => {
                    //拒绝授权
					uni.showToast({
						title:'后续如需授权用户信息，请到设置打开相关权限',
						icon:'none'
					})
					
                    console.log('拒绝授权', res)
                    uni.setStorageSync('haveUserInfoAuth',false)
                    app.globalData.haveUserInfoAuth = false
                    this.haveUserInfoAuth = false
                    uni.setStorageSync('wxUserInfo',null)
                    app.globalData.wxUserInfo = null
                    app.globalData.hasAuthorized = false;
                }
            })
            // #endif

			// #ifdef MP-WEIXIN
            console.log('#ifdef MP-WEIXIN')
            if(from == 'myPage'){
                this.$gdp('YCZ_loginClick')
            }
            uni.getUserProfile({
                desc: '完善信息',
                success: async (res) => {
					console.log('res',res)
                    // 申请使用微信昵称、头像，点击允许触发
                    this.$gdp( 'YCZ_nicknameHeadPortraitGrantPermissions')

                    let info = res
                    await api.saveWXuserInfo({
                        encryptedData: info.encryptedData,
                        iv: info.iv,
                        rawData: info.rawData,
                        signature: info.signature
                    }).then(async sRes=> {
                        console.log('saveWXuserInfo',sRes)
                        const {data,code} = sRes
                        if(code == 1) {
                            console.log("登陆成功时触发")
                            //登陆成功时触发
			                this.$gdp('YCZ_loginSuccess')
                            uni.setStorageSync('haveUserInfoAuth',true)
                            app.globalData.haveUserInfoAuth = true
                            this.haveUserInfoAuth = true
                            uni.setStorageSync('wxUserInfo',data)
                            app.globalData.wxUserInfo = data
                        }
                        if(code == -4) {  //如果未登录 则重新登录 并执行原逻辑
                            console.log('如果未登录 则重新登录 并执行原逻辑')
                            await login.login()
                            await api.saveWXuserInfo({
                                encryptedData: info.encryptedData,
                                iv: info.iv,
                                rawData: info.rawData,
                                signature: info.signature
                            }).then(async sRes=> {
                                console.log('sssres',sRes)
                                let {data,code} = sRes
                                if(code == 1) {
                                    uni.setStorageSync('haveUserInfoAuth',true)
                                    app.globalData.haveUserInfoAuth = !!sRes.wxName
                                    this.haveUserInfoAuth = !!sRes.wxName
                                    uni.setStorageSync('wxUserInfo',data)
                                    app.globalData.wxUserInfo = data
                                }
                            })
                        }
                        app.globalData.hasAuthorized = false;
                    })
                },
                fail: (res) => {
                    //拒绝授权
                    console.log('拒绝授权', res)
                    uni.setStorageSync('haveUserInfoAuth',false)
                    app.globalData.haveUserInfoAuth = false
                    this.haveUserInfoAuth = false
                    uni.setStorageSync('wxUserInfo',null)
                    app.globalData.wxUserInfo = null
                    app.globalData.hasAuthorized = false;
                }
            })
            // #endif
		}
    }
}
