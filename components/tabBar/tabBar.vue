<template>
	<view class="tabbar" :style="{'padding-bottom': paddingBottomHeight + 'rpx'}">
		<view class="tabbar-item" :class="index == num   && 'mainMenu'" v-for="(item, index) in list" :key="index"
			@click="tabbarChange(item.path)">
			<image class="item-img" :src="item.icon_a" v-if="currentk == index"></image>
			<image class="item-img" :src="item.icon" v-else></image>
			<view class="item-name" :class="{'tabbarActive': currentk == index}" v-if="item.text">{{item.text}}
			</view>
		</view>
	</view>
</template>

<script>
	import api from '@/public/api/index'
	export default {
		name: "tabBar",
		props: ['current'],
		data() {
			return {
				paddingBottomHeight: 0, //苹果X以上手机底部适配高度
				num:2,
				currentk:0,
				list: [{
					text: '首页',
					icon: '/static/images/tab1_icon.png', //未选中图标
					icon_a: '/static/images/tab1_icon_c.png', //选中图片
					path: "index", //页面路径
				}, {
					text: '云展厅',
					icon: '/static/images/tab3_icon.png',
					icon_a: '/static/images/tab3_icon_c.png',
					path: 'exhibition',
				}, {
					text: '活动',
					icon: '/static/images/tab4_icon.png',
					icon_a: '/static/images/tab4_icon_c.png',
					path: "welfareActivity",
				}, {
					text: '我的',
					icon: '/static/images/tab5_icon.png',
					icon_a: '/static/images/tab5_icon_c.png',
					path: "mypage",
				}]
			};
		},
		created() {
			this.getLivePage();


			let that = this;
			uni.getSystemInfo({
				success: function(res) {
					console.log('getSystemInfo', res)
					let model = ['X', 'XR', 'XS', '11', '12', '13', '14', '15'];
					model.forEach(item => {
						//适配iphoneX以上的底部，给tabbar一定高度的padding-bottom
						if (res.model.indexOf(item) != -1 && res.model.indexOf('iPhone') != -1) {
							that.paddingBottomHeight = 40;
						}
					})
				}
			});
		},
		methods: {
			tabbarChange(path) {
				// this.$pageTo.toTab(path);
				//  云展厅先加上导航可以返回

				if (path == 'exhibition') {
					uni.navigateTo({
						url: '/pages/exhibition'
					})
		
					// let token = uni.getStorageSync('session-3rd')
					// if(token){
					// 	uni.navigateTo({
					// 		url: '/pages/exhibition'
					// 	})
					// }else{
					// 	uni.reLaunch({
					// 		url:'/pages/userBandv?path=exhibition'
					// 	})	
				    // }
				} else {
					
					// #ifdef MP-WEIXIN
					if(path=='welfareActivity'){
						//活动页面打开埋点
						let sourcePage = getCurrentPages().length>1?getCurrentPages()[getCurrentPages().length-2].route:"-"
						this.$gdp('YCZ_activityPageView', { "YCZ_sourcePage_var": sourcePage})
					}else if(path=='live'){
						//直播页面打开埋点
						this.$gdp('YCZ_livePageView')
					}
					// #endif
					
					if(path)
					uni.switchTab({
						url: path
					})
				}
			},
			async getLivePage() {
				let {
					data
				} = await api.getLivePage({});
				console.log(data)
				if (data && data.isHidden == 1) {
					console.log(123123)
					this.num = -1;

					if(this.current > 2){
					  this.currentk = this.current  - 1
					}else{
					  this.currentk = this.current
					}
					this.list = [{
						text: '首页',
						icon: '/static/images/tab1_icon.png', //未选中图标
						icon_a: '/static/images/tab1_icon_c.png', //选中图片
						path: "index", //页面路径
					}, {
						text: '云展厅',
						icon: '/static/images/tab3_icon.png',
						icon_a: '/static/images/tab3_icon_c.png',
						path: 'exhibition',
					}, {
						text: '活动',
						icon: '/static/images/tab4_icon.png',
						icon_a: '/static/images/tab4_icon_c.png',
						path: "welfareActivity",
					}, {
						text: '我的',
						icon: '/static/images/tab5_icon.png',
						icon_a: '/static/images/tab5_icon_c.png',
						path: "mypage",
					}];
				}else{
					this.list =[{
					text: '首页',
					icon: '/static/images/tab1_icon.png', //未选中图标
					icon_a: '/static/images/tab1_icon_c.png', //选中图片
					path: "index", //页面路径
				}, {
					text: '直播',
					icon: '/static/images/tab2_icon.png',
					icon_a: '/static/images/tab2_icon_c.png',
					path: "live",
				}, {
					text: '云展厅',
					icon: '/static/images/tab3_icon.png',
					icon_a: '/static/images/tab3_icon_c.png',
					path: 'exhibition',
				}, {
					text: '活动',
					icon: '/static/images/tab4_icon.png',
					icon_a: '/static/images/tab4_icon_c.png',
					path: "welfareActivity",
				}, {
					text: '我的',
					icon: '/static/images/tab5_icon.png',
					icon_a: '/static/images/tab5_icon_c.png',
					path: "mypage",
				}]
					  this.currentk = this.current
				}

			}


		}




	}
</script>
<style lang="scss" scoped>
	.tabbarActive {
		color: #FA8845 !important;
	}

	.tabbar {
		position: fixed;
		z-index: 8888;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 100rpx;
		background-color: #ffffff;
		display: flex;
		justify-content: space-around;
		align-items: center;

		.tabbar-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-end;
			height: 100rpx;

			.item-img {
				width: 48rpx;
				height: 48rpx;
				margin-bottom: 4rpx;
			}

			.item-name {
				font-size: 26rpx;
				color: #A3A3A3;
			}

			&.mainMenu {
				.item-img {
					width: 72rpx;
					height: 72rpx;
					margin-bottom: 4rpx;
				}
			}
		}
	}
</style>
