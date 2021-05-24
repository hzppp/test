<template>
  <view>
		<web-view src="https://cdc.pcauto.com.cn/vue/hall/a/"></web-view>
		<!-- <web-view src="http://localhost:8080/"></web-view> -->
		<!-- <web-view src="http://localhost:8080/"></web-view> -->
<!--    <button v-if="!haveUserInfoAuth" class="getUserInfo_name_info_mask_body" @tap="getWxUserInfoAuth"></button>-->
    <!-- <viewTabBar :current="2"></viewTabBar> -->
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
