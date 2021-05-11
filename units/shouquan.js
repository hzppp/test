
import api from '@/public/api/index'
const app = getApp()
export default {
  data() {
  	return {
  		isUserInfoPage: false
  	}
  },
  onLoad(){
    this.isUserInfoPage = app.globalData.isUserInfoPage
  },
  onShow(){
    this.isUserInfoPage = app.globalData.isUserInfoPage
  },
  methods: {
    getWxUserInfoButton(e) {
        let {
            detail={}
        }=e
		console.log('getWxUserInfoButton============',detail)
        if (detail.errMsg.indexOf("ok")>-1) {
            console.log('成功授权,来源按钮')
            // this.setWxUserInfo(detail)
            app.globalData.wxUserInfo = detail
            this.isUserInfoPage = false
            app.globalData.isUserInfoPage = false
            let info = app.globalData.wxUserInfo
            api.saveWXuserInfo({
                encryptedData:info.encryptedData,
                iv:info.iv,
                rawData:info.rawData,
                signature:info.signature
            })
        }else{
            console.log('拒绝授权,来源按钮')
        }
    }
  }
}
