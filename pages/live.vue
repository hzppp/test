<template>
	<view>
		<!--    <button v-if="!haveUserInfoAuth" class="getUserInfo_name_info_mask_body" @tap="getWxUserInfoAuth"></button>-->
		<scroll-view scroll-y lower-threshold="200" class="live-list">
			<view class="live-item">
				<view class="top">
					<image class="avator" src="../static/images/1.png" mode=""></image>
					<view class="name">
						名称
					</view>
				</view>
				<view class="banner">
					<image class="bg" src="../static/images/7.png" mode=""></image>
					<view class="play"></view>
					<view class="status yellow">
						直播中
					</view>
				</view>
				<view class="title">
					欢迎来到我的直播间
				</view>
			</view>
			<view class="live-item">
				<view class="top">
					<image class="avator" src="../static/images/1.png" mode=""></image>
					<view class="name">
						名称
					</view>
				</view>
				<view class="banner">
					<image class="bg" src="../static/images/7.png" mode=""></image>
					<view class="play"></view>
					<view class="status blue">
						<view class="icon"></view> 12:00开始播放
					</view>
				</view>
				<view class="title">
					欢迎来到我的直播间
				</view>
			</view>
		</scroll-view>
		<viewTabBar :current="1"></viewTabBar>
	</view>
</template>

<script>
	import tabBar from '@/components/tabBar/tabBar'
	import shouquan from '@/units/shouquan'

	let app = getApp()
	export default {
		components: {
			viewTabBar: tabBar
		},
		mixins: [shouquan],
		onLoad() {
			console.log('app.globalData.currentLocation:', app.globalData.currentLocation)
		},
		onShow() {
			console.log('app.globalData.wxUserInfo  show:', app.globalData.wxUserInfo)
		}
	}
</script>

<style lang="less">
	@import '@/static/less/public.less';

	.live-list {
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		padding: 0 32rpx;
	}

	.live-item {
		border-bottom: 1px solid #ebebeb;

		.top {
			padding: 40rpx 0 24rpx;
			.dflex(center, flex-start);

			.avator {
				width: 64rpx;
				height: 64rpx;
			}

			.name {
				color: #666666;
				font-size: 28rpx;
				margin-left: 20rpx;
			}
		}

		.banner {
			// width: 100%;
			position: relative;
			border-radius: 20rpx;
			width: 686rpx;
			.bg {
				width: 686rpx;
				height: 388rpx;
			}

			.status {
				padding: 8rpx 13rpx;
				border-radius: 4rpx;
				padding-left: 35rpx;
				font-size: 24rpx;
				color: #ffffff;
				.pa(16rpx, 16rpx);
				.icon {
					width: 24rpx;
					height:24rpx;
					.pa(10rpx,14rpx);
				}
				&.yellow {
					background-color: #fa843f;

					.icon {
						.setbg(24rpx, 24rpx, 'livetimes.png')
					}
				}

				&.blue {
					background-color: #56a3f1;

					.icon {
						.setbg(24rpx, 24rpx, 'livetimes.png')
					}
				}

				&.red {
					background-color: #fd5248;

					.icon {
						.setbg(24rpx, 24rpx, 'livetimes.png')
					}
				}
			}
			.play{
				.pa(50%,50%);
				transform: translate(-50%,-50%);
				width: 100rpx;
				height: 100rpx;
				.setbg(100rpx, 100rpx, 'livePlay.png')
			}
			
		}
		.title{
			font-weight: 800;
			text-align: left;
			color: #333333;
			padding:18rpx 0 35rpx;
		}
	}
</style>
