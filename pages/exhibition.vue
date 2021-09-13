<template>
	<view>
		<web-view :src="webrul" @load="loadSuccessHandler"></web-view>
		<!-- <web-view src="http://localhost:8080/"></web-view> -->
		<!--    <button v-if="!haveUserInfoAuth" class="getUserInfo_name_info_mask_body" @tap="getWxUserInfoAuth"></button>-->
		<!-- <viewTabBar :current="2"></viewTabBar> -->
	</view>
</template>

<script>
	import tabBar from '@/components/tabBar/tabBar'
	import shouquan from '@/units/shouquan'
	import distance from '@/units/distance'
	import domain from '@/configs/interface';
	let app = getApp()
	export default {
		components: {
			viewTabBar: tabBar
		},
		mixins: [shouquan],
		data() {
			return {
				webrul: domain.getAPI('webUrl'),
				// webrul: 'http://localhost:8080/',
				sid:null
			}
		},
		onLoad(options) {
			this.sid  = options.sid;
			uni.showLoading({
				title: '正在加载...',
			})
			
			setTimeout(() => {
				uni.hideLoading()
			}, 5000)

			this.getcity()
		},
		onShow() {
		uni.setNavigationBarTitle({
		  title: '云展厅'
		})	
		},
		onShareAppMessage() {
			 let title = '长安云车展'
			 let path = `pages/exhibition`
			 let imageUrl = 'https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/vrCar.jpg'
			 return {
			 	title: title,
			 	path: path,
			 	imageUrl: imageUrl
			 }
		},
		methods: {
			async getcity() {
				await distance.getLocation()
				var cityCode = 1000000262
				var name = '重庆市'
                console.log(JSON.stringify(app.globalData.currentLocation.selectedCityData))
				if (app.globalData.currentLocation.selectedCityData) {
					cityCode = app.globalData.currentLocation.selectedCityData.cityId ? app.globalData.currentLocation.selectedCityData.cityId : 1000000262
					name = app.globalData.currentLocation.selectedCityData.city ? app.globalData.currentLocation.selectedCityData.city : '重庆市'
				}
				if(this.sid){
					this.webrul = this.webrul + '?cityId=' + cityCode + '&cityName=' + name + '&sid=' + this.sid 
				}else{
					this.webrul = this.webrul + '?cityId=' + cityCode + '&cityName=' + name 
				}
				if(app.globalData.wxUserInfo&&app.globalData.wxUserInfo.openId){
					let openId =  app.globalData.wxUserInfo.openId;
					this.webrul = this.webrul +  '&openId=' + openId
				}
				
				// #ifdef MP-WEIXIN
				 this.webrul = this.webrul +  '&app=wechat'
				// #endif

				// #ifdef MP-TOUTIAO
				 this.webrul = this.webrul + '&app=toutiao'
				// #endif
				
				console.log(this.webrul );
			},
			loadSuccessHandler(){
				uni.hideLoading()
				console.log('加载完成')
			}
		}

	}
</script>
<style>
</style>
