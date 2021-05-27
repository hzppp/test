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
import distance from '@/units/distance'
import api from '@/public/api/index'


let app = getApp()
export default {
  data() {
    return {}
  },
  async onLoad(options) {
    // this.$refs.loading.changeLoading(true);
    app.globalData.haveUserInfoAuth = uni.getStorageSync('haveUserInfoAuth')
    console.log('页面参数', options,api)
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

    await login.checkLogin(api)

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
    }
  }
}
</script>

<style lang="less">
</style>
