<template>
  <view>
    <view>直播</view>
    <viewTabBar :current="1"></viewTabBar>
  </view>
</template>

<script>
import tabBar from '@/components/tabBar/tabBar'

let app = getApp()
  export default {
    components: {viewTabBar:tabBar},
    onLoad() {
      console.log('app.globalData.currentLocation:',app.globalData.currentLocation)
    },
    onShow() {
      console.log('app.globalData.wxUserInfo  show:',app.globalData.wxUserInfo)
    }
  }
</script>

<style>
</style>
