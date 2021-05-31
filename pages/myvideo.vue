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
				webrul: '',
				// webrul: 'http://localhost:8080/',
				sid:null
			}
		},
		onLoad(options) {
			this.sid  = options.sid;
			uni.showLoading({
				title: '正在加载...'
			})
			this.getcity()
		},
		methods: {
			async getcity() {
				let openId =  app.globalData.wxUserInfo.openId;
				this.webrul = 'https://dvideo.e2cysd.com/h5/index.html?openid=' + openId  + '#/login'
				
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
