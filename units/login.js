import domain from '@/configs/interface';
import request from "@/units/request.js"
import toast from '@/units/showToast.js';
let app = getApp()
export default {
    loginNumber: true,
    getSessionKey() {
        return uni.getStorageSync('session-3rd')
    },
    removeSessionKey() {
		app.globalData.loginJson = null
        uni.setStorageSync('session-3rd', '')
		uni.setStorageSync('loginData','')
    },
    setSessionKey(sessionKey) {
        uni.setStorageSync('session-3rd', sessionKey)
    },
    checkSession() {//判断是否存在session已经登录是否有效
        return new Promise((resolve, reject) => {
            uni.checkSession({
				success: () => {
					resolve(true)
				},
				fail: () => {
					this.removeSessionKey()
					resolve(false)
				},
				complete: () => {

				}
			})
        })
    },
	// 微信登录
    uniLogin() {
        return new Promise((resolve, reject) => {
            uni.login({
                success: (res) => {
                    console.log('uni login', res)
                    resolve(res);
                },
                fail: (err) => {
                    console.log('uni login', err)
                    reject();
                }
            })
        })
    },
	// 自己系统登录
    async login(api,phone,iv) {
		// 先清空本地存储的用户信息
        app.globalData.haveUserInfoAuth = false
        uni.setStorageSync('haveUserInfoAuth', false)
        app.globalData.wxUserInfo = null
        uni.setStorageSync('wxUserInfo', null)
        // if (app.globalData.loginJson) {
        //     return app.globalData.loginJson
        // }
        // let isSession = this.getSessionKey()
		
		// 微信登录
        let _data = {}
        let data1 = {}
		try{
		 	data1 = await this.uniLogin()//获取jscode
		}catch(e){
		 	console.log('登录获取code失败')
		}
        console.log('uni.login()==================', data1)
        _data['code'] = data1.code
		
	    // #ifdef MP-TOUTIAO
	    _data['type'] = '2'
	    // #endif

		// #ifdef MP-WEIXIN
	    _data['type'] = '1'
	    // #endif
        if (app.globalData.salesId) {
            _data.salesId = app.globalData.salesId
        }
        let {data} = await request({
            url: domain.getAPI('login'),
            method: 'POST',
            data: {
                ..._data
            }
        })
		console.log('登录返回',data)
		if(data.code == 1 &&data.data.resultCode==1 ){
			// console.log('注册 ==' + phone + 'iv =' + iv)
			// 说明没有登录过长安 走注册流程
			if(phone && iv){
				// // 有注册需要的参数，直接注册
				// let bindToken =  data.data.bindToken
				// let encryptedData = phone
				// let  data1 = await api.userBind({bindToken,encryptedData,iv})
				// console.log('注册参数=',{bindToken,encryptedData,iv},'注册结果=',data1)
				// data['data'] = data1
			}else{
	     		// return 1
			}
		}
		// 说明之前有注册过，直接登录
		for (let ii in data.data) {
		    let o = data.data[ii]
		    data[ii] = o
		    if (ii == 'id') {
		        data['userId'] = o
		    }
		}
		console.log('自己系统登录login-data' , data)	
		uni.setStorageSync('bindToken', data.bindToken)
		if (data.code == 1) {
			
		    if (data.token) {//保存sessionKey
		        this.setSessionKey(data.token)
				data['time'] =  new Date().getTime()
				uni.setStorageSync('loginData', data)
				app.globalData.loginJson = data
		    }else if(data.data.token){
				this.setSessionKey(data.data.token)
				data.data['time'] =  new Date().getTime()
				uni.setStorageSync('loginData', data.data)
				app.globalData.loginJson = data.data
			}
		} else {
		    this.removeSessionKey()
		    if (this.loginNumber) {//重登一次
		        this.loginNumber = false
		        let d = await this.login()
		        return d;
		    }
		}
		return data;

    },
    async checkLogin(api) {
		
		//yuchen 测试 
		// this.removeSessionKey()
	   // this.setSessionKey("iICOV95KmScezeQn3P8iFg1euncuqrxX")
		
		await this.checkExpireTime(api)
		// 先判断微信  session 是否有效
        let isSession = await this.checkSession()
        console.log('微信登录状态', isSession)
        if (isSession) {
            let {code, data} = await api.getUser()
            console.log('获取用户信息1', data,code)
            if (code == 1 && data) {
                app.globalData.haveUserInfoAuth = !!data.wxName
                uni.setStorageSync('haveUserInfoAuth', !!data.wxName)
                app.globalData.wxUserInfo = data
                uni.setStorageSync('wxUserInfo', data)
                uni.setStorageSync('userPhone', data.oauthMobile)
            } else if (code == -4) {
			  this.removeSessionKey()
			  let d  = await this.login()
			  if (d ==1 ){
				  return 1;
			  }
                let {code, data} = await api.getUser()
				   console.log('获取用户信息2', data,code)
                if (code == 1 && data) {
                    app.globalData.haveUserInfoAuth = !!data.wxName
                    uni.setStorageSync('haveUserInfoAuth', !!data.wxName)
                    app.globalData.wxUserInfo = data
                    uni.setStorageSync('wxUserInfo', data)
				    uni.setStorageSync('userPhone', data.oauthMobile)
                }
            }
            console.log('用户信息1',app.globalData.haveUserInfoAuth)
        } else {
           let d = await this.login()
		   if (d ==1 ){
		   	  return 1;
		   }
            let {code, data} = await api.getUser()
			 console.log('用户信息2',data)
            if (code == 1 && data) {
				// #ifdef MP-WEIXIN
				gioGlobal.gio('setUserId', data.cacOpenId);
				// #endif
                app.globalData.haveUserInfoAuth = !!data.wxName
                uni.setStorageSync('haveUserInfoAuth', !!data.wxName)
                app.globalData.wxUserInfo = data
                uni.setStorageSync('wxUserInfo', data)
                uni.setStorageSync('userPhone', data.oauthMobile)
            }
        }
    },
	
	async checkOauthMobile(api){
		let wxUserInfo = uni.getStorageSync('wxUserInfo')
			console.log('用户取消授权了，要重新登录',wxUserInfo)
		if(wxUserInfo && wxUserInfo.mobile && (wxUserInfo.oauthMobile  != wxUserInfo.mobile)  && !wxUserInfo.oauthMobile){
			console.log('用户取消授权了，要重新登录')
			let d = await this.login()
			if (d ==1 ){
				return 1;
			}
			 let {code, data} = await api.getUser()
			   console.log('用户信息2',data)
			 if (code == 1 && data) {
				// #ifdef MP-WEIXIN
				 gioGlobal.gio('setUserId', data.cacOpenId);
				// #endif
				app.globalData.haveUserInfoAuth = !!data.wxName
				uni.setStorageSync('haveUserInfoAuth', !!data.wxName)
				app.globalData.wxUserInfo = data
				uni.setStorageSync('wxUserInfo', data)
				uni.setStorageSync('userPhone', data.oauthMobile)
			 }
		}
	
	
		
	},
	

	async userBind(api,phone,iv) {
		if(phone && iv){
			// 有注册需要的参数，直接注册
			let bindToken =  uni.getStorageSync('bindToken')
			console.log('写入的bindToken',bindToken);
			let encryptedData = phone
			let  data1 = await api.userBind({bindToken,encryptedData,iv})
			console.log('注册参数=',{bindToken,encryptedData,iv},'注册结果=',data1)
			if (data1.code == 1) {
			    if (data1.token) {//保存sessionKey
			        this.setSessionKey(data1.token)
					data1['time'] =  new Date().getTime()
					uni.setStorageSync('loginData', data1)
					app.globalData.loginJson = data1
			    }else if(data1.data.token){
					this.setSessionKey(data1.data.token)
					data1.data['time'] =  new Date().getTime()
					uni.setStorageSync('loginData', data1.data)
					app.globalData.loginJson = data1.data
				}
			} 
			
			let {code, data} = await api.getUser()
			if (code == 1 && data) {
				// #ifdef MP-WEIXIN
				gioGlobal.gio('setUserId', data.cacOpenId);
				// #endif
			    app.globalData.haveUserInfoAuth = !!data.wxName
			    uni.setStorageSync('haveUserInfoAuth', !!data.wxName)
			    app.globalData.wxUserInfo = data
			    uni.setStorageSync('wxUserInfo', data)
			    uni.setStorageSync('userPhone', data.oauthMobile)
			    console.log('用户信息2',app.globalData.haveUserInfoAuth)
			}
			return data
			
		  }
	},
	// 刷新token
	async checkExpireTime(api){
		 let logindata = uni.getStorageSync('loginData')
		 if(logindata){
			let time = new Date().getTime()
			 console.log('logindata',logindata,'time= ',time,time - logindata.time)
			if(logindata.expireTime > 0 && (time - logindata.time > (logindata.expireTime * 1000 - 10 * 60 * 1000))){
			let refreshToken= logindata.refreshToken
			let data = await api.refreshToken({refreshToken})
			console.log('刷新用户token' , data)
			if (data.code == 1) {
			    if (data.token) {//保存sessionKey
			        this.setSessionKey(data.token)
			    }
				data['time'] =  new Date().getTime()
				uni.setStorageSync('loginData', data)
			   app.globalData.loginJson = data
			} 		
			} 
		 }
	}
	
	
	}
