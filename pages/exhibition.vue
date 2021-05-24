<template>
	<view>
		<web-view :src="webrul"></web-view>
		<!-- <web-view src="http://localhost:8080/"></web-view> -->
		<!--    <button v-if="!haveUserInfoAuth" class="getUserInfo_name_info_mask_body" @tap="getWxUserInfoAuth"></button>-->
		<!-- <viewTabBar :current="2"></viewTabBar> -->
	</view>
</template>

<script>
	import tabBar from '@/components/tabBar/tabBar'
	import shouquan from '@/units/shouquan'
	import distance from '@/units/distance'
	let app = getApp()
	export default {
		components: {
			viewTabBar: tabBar
		},
		mixins: [shouquan],
		data() {
			return {
				webrul: 'https://cdc.pcauto.com.cn/vue/hall/a/'
			}
		},
		onLoad() {
			this.getcity()
		},
		methods: {
			async getcity() {
				await distance.getLocation()
				var cityCode = 50000
				var name = '重庆市'
				
				if (app.globalData.currentLocation.selectedCityData) {
					cityCode = app.globalData.currentLocation.selectedCityData.pro ? app.globalData.currentLocation.selectedCityData.pro : 500000
					name = app.globalData.currentLocation.selectedCityData.city ? app.globalData.currentLocation.selectedCityData.city : '重庆市'
				}
				this.webrul = this.webrul + '?cityId=' + cityCode + '&cityName=' + name
				console.log(this.webrul );
			}
		}

	}
</script>
<style>
</style>
