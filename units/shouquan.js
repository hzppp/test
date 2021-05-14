import api from '@/public/api/index'

const app = getApp()
export default {
    data() {
        return {
            haveUserInfoAuth: false
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
            let userAuth = uni.getStorageSync('haveUserInfoAuth')
            if (userAuth) {
                app.globalData.haveUserInfoAuth = userAuth
                this.haveUserInfoAuth = app.globalData.haveUserInfoAuth
            }
        },
        getWxUserInfoAuth(e) {
            console.log('getWxUserInfoAuth', e)
            wx.getUserProfile({
                desc: '完善信息',
                success: (res) => {
                    console.log('成功授权', res)
                    uni.setStorageSync('haveUserInfoAuth',true)
                    app.globalData.haveUserInfoAuth = true
                    this.haveUserInfoAuth = true
                    uni.setStorageSync('wxUserInfo',res.userInfo)
                    app.globalData.wxUserInfo = res.userInfo
                    //成功授权
                },
                fail: (res) => {
                    //拒绝授权
                    console.log('拒绝授权', res)
                    uni.setStorageSync('haveUserInfoAuth',false)
                    app.globalData.haveUserInfoAuth = false
                    this.haveUserInfoAuth = false
                    uni.setStorageSync('wxUserInfo',null)
                    app.globalData.wxUserInfo = null
                }
            })
        }
    }
}
