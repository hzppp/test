<template>
  <view>
    <!--		<loading ref="loading"></loading>-->
    <!--		<view class="authorization" v-if="isUserInfoPage">-->
    <!--			<view class="authorization-pop">-->
    <!--				<button class="getUserInfo-btn" lang="zh_CN" @getuserinfo="getWxUserInfoButton" open-type="getUserInfo"></button>-->
    <!--			</view>-->
    <!--		</view>-->
  </view>
</template>

<script>
import login from '@/units/login'
import api from '@/public/api/index'
import distance from '@/units/distance'

let app = getApp()
export default {
  data() {
    return {}
  },
  async onLoad(options) {
    // this.$refs.loading.changeLoading(true);
    app.globalData.haveUserInfoAuth = uni.getStorageSync('haveUserInfoAuth')
    app.globalData.getUserData = uni.getStorageSync('getUserData')
    console.log('页面参数', options)
    // to=dynamicDetails-dynamicId=205扫码进来带参方式
    // options.scene = 'salesId=386-to=carShow-id=89-wxacode'
    var scene = decodeURIComponent(options.scene)
    // let iswxacode = scene.indexOf('-wxacode') > -1
    let scenecs = ['salesId', 'to', 'id', 'dynamicId', 'isArt', 'aid']
    if (scene) {
      for (let i in scenecs) {
        let iobj = scenecs[i]
        let value = this.GetQueryString(scene, iobj)
        if (value) {
          options[iobj] = value
        }
      }

    }
    if (options.salesId) {
      app.globalData.salesId = options.salesId
    }

    let isSession = await login.checkSession()
    console.log('isSession',isSession)
    if(isSession) {
      let {code, data} = await api.getUser()
      console.log('ttttttt123', data)
      if (code == 1 && data) {
        app.globalData.haveUserInfoAuth = true
        uni.setStorageSync('haveUserInfoAuth', true)
        app.globalData.getUserData = {rawData: {...data}}
        app.globalData.wxUserInfo = data
        uni.setStorageSync('wxUserInfo', data)
        uni.setStorageSync('getUserData', app.globalData.getUserData)
      }else if(code == -4){
        await this.handleLogin()
      }
    }else {
      await this.handleLogin()
    }

    await distance.getLocation()

    let cs = ''
    let url = '/pages/index'
    for (let i in options) {
      cs += `${i}=${options[i]}&`
    }
    if (options.to) {
      if (options.to == 'ddxq') {//动态详情页面
        options.to = 'dynamicDetails'
      } else if (options.to == 'xcsfq') {//新春送福气页面
        options.to = 'moneyActivity'
      }
      cs = cs.substr(0, cs.length - 1)
      url = `/pages/${options.to}?${cs}`
    }
    uni.reLaunch({url})
  },
  methods: {
    GetQueryString(str, name) {
      var reg = new RegExp("(^|-)" + name + "=([^-]*)(-|$)");
      var r = str.match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    },
    async handleLogin() {
      app.globalData.haveUserInfoAuth = false
      uni.setStorageSync('haveUserInfoAuth', false)
      app.globalData.getUserData = null
      app.globalData.wxUserInfo = null
      uni.setStorageSync('wxUserInfo', null)
      uni.setStorageSync('getUserData', null)
      let loginJson = await login.login() //请求登录 公共请求头写入token
      if (app.globalData.haveUserInfoAuth) { //保存用户信息
        console.log('decryptUserInfo', app.globalData.haveUserInfoAuth)
        let info = app.globalData.getUserData
        await api.saveWXuserInfo({
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        })
      }
    }
  }
}
</script>

<style lang="less">
</style>
