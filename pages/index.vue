<template>
	<view class="index">
<!--    <button v-if="!haveUserInfoAuth" class="getUserInfo_name_info_mask_body" @tap="getWxUserInfoAuth"></button>-->
    <!--    <getUserInfoAuth></getUserInfoAuth>-->
	<viewTabBar :current="0"></viewTabBar>
<!--		<button @tap="getUserInfo">获取用户信息授权</button>-->
		首页
    <view @tap="goArticlePage">
      跳转：文章页面
    </view>
	</view>
</template>

<script>
	import login from '@/units/login'
	import api from '@/public/api/index'
	import tabBar from '@/components/tabBar/tabBar'
  import shouquan from '@/units/shouquan'

  let app = getApp()
	export default {
		components: {viewTabBar:tabBar},
    mixins: [shouquan],
    data() {
			return {}
		},
		onShow() {
		  console.log('index_app.globalData.currentLocation',app.globalData.currentLocation)
		},
		watch: {
			indexCity: function(newVal) {
				console.log('indexCity===========', newVal)
			}
		},
		async onLoad(options) {
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
		  goArticlePage() {
        uni.navigateTo({
          url: `/pages/articleListPage`
        })
      },
			getUserInfo(e) {
				wx.getUserProfile({
					desc: '完善用户信息',
					success: (res) => {

					},
					complete: (res) => {

					}
				})
			}

		}
	}
</script>

<style lang="less">
	@import '@/static/less/index.less';
</style>
