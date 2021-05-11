
import domain from '@/configs/interface';
import request from "@/units/request.js"
import toast from '@/units/showToast.js';
let app = getApp()
export default {
    loginNumber:true,
    getSessionKey() {
        return uni.getStorageSync('session-3rd')
    },
    removeSessionKey() {
        uni.setStorageSync('session-3rd', '')
    },
    setSessionKey(sessionKey) {
        uni.setStorageSync('session-3rd', sessionKey)
    },
    async checkSession() {//判断是否存在session已经登录是否有效
        return new Promise( async (resolve, reject)=>{
            let s=this.getSessionKey()
            uni.checkSession().then(res=>{
                if(s){
                    resolve(true)
                }else{
                    this.removeSessionKey()
                    resolve(false)
                }
            }).catch(err=>{
                this.removeSessionKey()
                resolve(false)
            })
        })
    },
	uniLogin(){
		return new Promise((resolve, reject) => {
			uni.login({
				success: (res) => {
					resolve(res);
				},
				fail: (err) => {
					reject();
				}
			})
		})
	},
    async login(){
        console.log('loginloginloginloginlogin')
		console.log('getApp=============',getApp())
        if(app.globalData.loginJson){
            return app.globalData.loginJson
        }
        // let isSession=await this.checkSession()
        let isSession = this.getSessionKey()
        let _data = {}
        if(!isSession) {
            let data = await this.uniLogin()//获取jscode
			console.log('uni.login()==================',data)
            _data['code'] = data.code
        }

        if(app.globalData.salesId){
            _data.salesId = app.globalData.salesId
        }
        let {data} = await request({
			url: domain.getAPI('login'),
			method: 'POST',
			data:{
				..._data
			}
		})
		console.log(data)
        for(let ii in data.data){
            let o = data.data[ii]
            data[ii] = o
            if(ii == 'id'){
                data['userId'] = o
            }
        }
        console.log('login-data=======',data)
        if(data.code == 1){
            if(data.token){//保存sessionKey
                this.setSessionKey(data.token)
            }
            app.globalData.loginJson = data
        }else{
            this.removeSessionKey()
            if(this.loginNumber){//重登一次
                this.loginNumber = false
                let d = await this.login()
                return d;
            }
        }
        return data; 
    }
}