<template>
  <view>
<!--    <button v-if="!haveUserInfoAuth" class="getUserInfo_name_info_mask_body" @tap="getWxUserInfoAuth"></button>-->
    <view>直播</view>
    <viewTabBar :current="1"></viewTabBar>
  </view>
</template>

<script>
import tabBar from '@/components/tabBar/tabBar'
import shouquan from '@/units/shouquan'

let app = getApp()
  export default {
    components: {viewTabBar:tabBar},
    mixins: [shouquan],
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
