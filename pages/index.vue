<template>
	<view class="index">
		首页
	</view>
</template>

<script>
	import login from '@/units/login'
	import api from '@/public/api/index'
	import shouquan from '@/units/shouquan'

	let app = getApp()
	export default {
		components: {
		},
		data() {
			return {
				
			}
		},
		mixins: [shouquan],
		watch: {
			indexCity: function(newVal) {
				console.log('indexCity===========', newVal)
			}
		},
		async onLoad(options) {

		},
		async onShow() {
		},
		onUnload() {},
		onShareAppMessage() {
			let title = '奥迪东海汇：轻松开启精彩车生活'
			let path = `pages/authorization?to=index`
			if (app.globalData.salesId) {
				path += `&salesId=${app.globalData.salesId}`
			}
			let imageUrl = 'https://www1.pcauto.com.cn/zt/gz20210125/audi/xcx/img/xcxshare.png'
			return {
				title: title,
				path: path,
				imageUrl: imageUrl
			}
		},
		methods: {
			

		}
	}
</script>

<style lang="less">
	@import '@/static/less/index.less';

</style>
