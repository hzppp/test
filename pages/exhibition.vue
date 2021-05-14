<template>
  <view>
    <button v-if="!haveUserInfoAuth" class="getUserInfo_name_info_mask_body" @tap="getWxUserInfoAuth"></button>
    exhibition 云展馆
    <viewTabBar :current="2"></viewTabBar>
  </view>
</template>

<script>
import tabBar from '@/components/tabBar/tabBar'
import shouquan from '@/units/shouquan'

export default {
  components: {viewTabBar: tabBar},
  mixins: [shouquan],
}
</script>
<style>
</style>
