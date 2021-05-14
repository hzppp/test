import api from '@/public/api/index'

const app = getApp()
export default {
    data() {
        return {
            withoutUserInfoAuth: false
        }
    },
    onLoad() {
        console.log('mixins shouquan')
        this.getStorageUserInfo()
    },
    onShow() {
        this.getStorageUserInfo()
    },
    methods: {
        getStorageUserInfo() {
            let userAuth = uni.getStorageSync('withoutUserInfoAuth')
            if (userAuth) {
                app.globalData.withoutUserInfoAuth = userAuth
                this.withoutUserInfoAuth = app.globalData.withoutUserInfoAuth
            }
        },
        getWxUserInfoAuth(e) {
            console.log('getWxUserInfoAuth', e)
            wx.getUserProfile({
                desc: '完善信息',
                success: (res) => {
                    console.log('成功授权', res)
                    uni.setStorageSync('withoutUserInfoAuth',true)
                    app.globalData.withoutUserInfoAuth = true
                    uni.setStorageSync('wxUserInfo',res.userInfo)
                    app.globalData.wxUserInfo = res.userInfo
                    //成功授权
                },
                fail: (res) => {
                    //拒绝授权
                    console.log('拒绝授权', res)
                    uni.setStorageSync('withoutUserInfoAuth',false)
                    app.globalData.withoutUserInfoAuth = false
                    uni.setStorageSync('wxUserInfo',null)
                    app.globalData.wxUserInfo = null
                }
            })
        }
    }
}
