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
    async login() {
        app.globalData.haveUserInfoAuth = false
        uni.setStorageSync('haveUserInfoAuth', false)
        app.globalData.wxUserInfo = null
        uni.setStorageSync('wxUserInfo', null)
        // if (app.globalData.loginJson) {
        //     return app.globalData.loginJson
        // }
        // let isSession = this.getSessionKey()
        let _data = {}
        let data1 = await this.uniLogin()//获取jscode
        console.log('uni.login()==================', data1)
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
        console.log(data)
        for (let ii in data.data) {
            let o = data.data[ii]
            data[ii] = o
            if (ii == 'id') {
                data['userId'] = o
            }
        }
        console.log('login-data=======', data)
        if (data.code == 1) {
            if (data.token) {//保存sessionKey
                this.setSessionKey(data.token)
            }
            app.globalData.loginJson = data
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
        let isSession = await this.checkSession()
        console.log('isSession', isSession,api)
        if (isSession) {
            let {code, data} = await api.getUser()
            console.log('ttttttt123', data)
            if (code == 1 && data) {
                app.globalData.haveUserInfoAuth = !!data.wxName
                uni.setStorageSync('haveUserInfoAuth', !!data.wxName)
                app.globalData.wxUserInfo = data
                uni.setStorageSync('wxUserInfo', data)
                uni.setStorageSync('userPhone', data.mobile)
            } else if (code == -4) {
                await this.login()
                let {code, data} = await api.getUser()
                if (code == 1 && data) {
                    app.globalData.haveUserInfoAuth = !!data.wxName
                    uni.setStorageSync('haveUserInfoAuth', !!data.wxName)
                    app.globalData.wxUserInfo = data
                    uni.setStorageSync('wxUserInfo', data)
                }
            }
            console.log('ttt1',app.globalData.haveUserInfoAuth)
        } else {
            await this.login()
            let {code, data} = await api.getUser()
            if (code == 1 && data) {
                app.globalData.haveUserInfoAuth = !!data.wxName
                uni.setStorageSync('haveUserInfoAuth', !!data.wxName)
                app.globalData.wxUserInfo = data
                uni.setStorageSync('wxUserInfo', data)
                console.log('ttt2',app.globalData.haveUserInfoAuth)
            }
        }
		// #ifdef MP-TOUTIAO
		app.globalData.haveUserInfoAuth = true;
        console.log('tttttttttttiao true')
		// #endif
    }
}
