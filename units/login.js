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
        let data1 = await this.uniLogin()//获取jscode
        // console.log('uni.login()==================', data1)
        _data['code'] = data1.code


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
		if(  data.code == 1 &&data.data.resultCode==1 ){
			console.log('注册 ==' + phone + 'iv =' + iv)
			// 说明没有登录过长安 走注册流程
			if(phone && iv){
				// 有注册需要的参数，直接注册
				let bindToken =  data.data.bindToken
				let encryptedData = phone
				let  data1 = await api.userBind({bindToken,encryptedData,iv})
				console.log('注册参数=',{bindToken,encryptedData,iv},'注册结果=',data1)
				data['data'] = data1
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
		if (data.code == 1) {
		    if (data.token) {//保存sessionKey
		        this.setSessionKey(data.token)
				data['time'] =  new Date().getTime()
				uni.setStorageSync('loginData', data)
				app.globalData.loginJson = data
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
                uni.setStorageSync('userPhone', data.mobile)
            } else if (code == -4) {
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
                app.globalData.haveUserInfoAuth = !!data.wxName
                uni.setStorageSync('haveUserInfoAuth', !!data.wxName)
                app.globalData.wxUserInfo = data
                uni.setStorageSync('wxUserInfo', data)
               
            }
        }
    },
	async userBind(api,phone,iv) {
		console.log('api',api)
	     await this.login(api,phone,iv)
		let {code, data} = await api.getUser()
		if (code == 1 && data) {
		    app.globalData.haveUserInfoAuth = !!data.wxName
		    uni.setStorageSync('haveUserInfoAuth', !!data.wxName)
		    app.globalData.wxUserInfo = data
		    uni.setStorageSync('wxUserInfo', data)
		    console.log('用户信息2',app.globalData.haveUserInfoAuth)
		}
		return data
	
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
