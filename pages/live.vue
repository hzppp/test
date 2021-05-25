<template>
	<view>
		<!--    <button v-if="!haveUserInfoAuth" class="getUserInfo_name_info_mask_body" @tap="getWxUserInfoAuth"></button>-->
		<block v-if="nothing">
			<scroll-view scroll-y lower-threshold="200" @scrolltolower="getList" class="live-list">
				<view class="live-item" v-for="(item,index) in liveList" :key="item.id" @tap="toLiveDet(item)">
					<!-- <view class="top">
						<image class="avator" :src="item.headPic"></image>
						<view class="name">
							{{item.nickName}}
						</view>
					</view> -->
					<view class="banner">
						<image class="bg" :src="item.cover"></image>
						<view class="play"></view>

						<view class="icon1 iconB" v-if="item.status == 1">
							<image :src="liveIcon[item.status-1]" class="iconK"></image>{{item.status | formatStatus}}
						</view>
						<view class="icon1" v-if="item.status == 2 && item.startTime">
							<image :src="liveIcon[item.status-1]" class="iconK"></image>{{item.startTime}}开播
						</view>
						<view class="icon1" v-if="item.status == 3">
							<image :src="liveIcon[item.status-1]" class="iconK"></image>{{item.status | formatStatus}}
						</view>
						<!-- <view class="status blue" v-if="item.status==0 || item.status==2">
						<view class="icon1"></view> {{item.startTime}}开始播放
					</view>
					
					<view class="icon1 status yellow" v-if="item.status==1"> 
		
					</view>
					<view class="icon1  status green" v-if="item.status==3">
		
					</view> -->
					</view>
					<view class="title">
						{{item.title}}
					</view>
				</view>
			</scroll-view>
		</block>
		<block v-else>
			<view class="live-detail">
				<view style="height:145rpx;"></view>
				<view class="none-icon"></view>
				<view class="none-text">暂无数据</view>
			</view>
		</block>
		<viewTabBar :current="1"></viewTabBar>
	</view>
</template>

<script>
	import tabBar from '@/components/tabBar/tabBar'
	// import shouquan from '@/units/shouquan'
	import api from '@/public/api/index'

	let app = getApp()
	export default {
		components: {
			viewTabBar: tabBar
		},
		data() {
			return {
				title: "直播",
				liveList: [],
				hasNext: true,
				pageNum: 1,
				pageSize: 10,
				dealerGroupId: '',
				nothing: 1,
				liveIcon: ['https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/play_icon_3x.png',
					'https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/willplay_icon_3x.png',
					'https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/replay_icon_3x.png'
				],
			}
		},
		// mixins: [],
		onLoad() {
			// this.getList()
		},
		onShow() {
			this.pageNum = 1
			this.hasNext = true
			this.liveList = []
			this.getList()
		},
		filters: {
			formatStatus(status) {
				// <!--contentType 1文章资讯，2活动，3直播-->
				// <!--status 当为直播类型时 1直播中  2预告  3回放-->
				switch (status) {
					case 1: {
						return '直播中'
						break;
					}
					case 3: {
						return '回放'
						break;
					}
				}
			},
		},
		methods: {
			/* 获取列表 */
			async getList() {
				if (!this.hasNext) {
					return false;
				}
				let {
					data
				} = await api.getLiveList({
					pageNum: this.pageNum,
					pageSize: this.pageSize
				})
				if (data.hasNext) {
					this.pageNum++
				} else {
					this.hasNext = false
				}
				data.rows.forEach((item, index) => {
					item.startTime = item.startTime.substring(0, 16)
				})
				this.liveList = [...this.liveList, ...data.rows]
				console.log(this.liveList.length, data.rows.length);
				if (data.rows.length == 0) {
					this.nothing = 0
				} else {
					this.nothing = 1
				}
			},

			toLiveDet(item) {
				if (item.status == 2 || item.status == 0) {
					/* 直播预告 */
					uni.navigateTo({
						url: '/pages/liveDetail?liveId=' + item.id
					})
				} else if (item.status == 1) {
					/* 直播中 */
					uni.navigateToMiniProgram({
						appId: 'wxa860d5a996074dbb',
						path: '/pages_live/changanVerticalLiveRoom/changanVerticalLiveRoom?type=verticalLive&id=' +
							item.roomId + '&sourceId=' + item.id,
						extraData: {},
						envVersion: 'trial',
						success(res) {
							// 打开成功 
						}
					})
				} else if (item.status == 3) {
					//回放
					uni.navigateToMiniProgram({
						appId: 'wxa860d5a996074dbb',
						path: '/pages_live/changanVerticalLiveRoom/changanVerticalLiveRoom?type=verticalPlayback&id=' +
							item.playId + '&sourceId=' + item.id,
						extraData: {},
						envVersion: 'trial',
						success(res) {
							// 打开成功
						}
					})
				}
			}
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
		padding: 0 0 100rpx;
		box-sizing: border-box;
	}

	.live-item {
		margin: 0 32rpx;
		border-bottom: 1px solid #ebebeb;

		&:last-child {
			border-bottom: none;
		}

		.top {
			padding: 40rpx 0 24rpx;
			.dflex(center, flex-start);

			.avator {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
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
			width: 686rpx;

			.bg {
				width: 686rpx;
				height: 388rpx;
				border-radius: 20rpx;
			}

			.status {
				padding: 8rpx 13rpx;
				border-radius: 4rpx;
				padding-left: 35rpx;
				font-size: 24rpx;
				color: #ffffff;
				.pa(-5rpx, -2rpx);
				z-index: 3;

				// .icon {
				// 	width: 24rpx;
				// 	height:24rpx;
				// 	.pa(10rpx,14rpx);
				// }
				&.yellow {
					// background-color: #fa843f;
					.setbg(122rpx, 36rpx, 'live_tag1.png') // .icon {
					// 	.setbg(24rpx, 24rpx, 'livetimes.png')
					// }
				}

				&.green {
					// background-color: #33CE99;
					.setbg(104rpx, 36rpx, 'live_tag2.png')
				}

				&.blue {
					background-color: #56a3f1;
					border-top-left-radius: 20rpx;
					border-top-right-radius: 8rpx;
					border-bottom-right-radius: 8rpx;
					// .setbg(152rpx,  36rpx, 'live_tag3.png')
					// .dflex(center,center);

					.icon {
						display: inline-block;
						margin-right: 10rpx;
						.setbg(24rpx, 24rpx, 'livetimes.png');
						position: relative;
						top: 2rpx;
					}
				}

				// &.red {
				// 	background-color: #fd5248;

				// 	.icon {
				// 		.setbg(24rpx, 24rpx, 'livetimes.png')
				// 	}
				// }
			}

			.play {
				.pa(50%, 50%);
				transform: translate(-50%, -50%);
				width: 100rpx;
				height: 100rpx;
				.setbg(100rpx, 100rpx, 'livePlay.png')
			}

		}

		.title {
			font-weight: 800;
			text-align: left;
			color: #333333;
			padding: 18rpx 0 35rpx;
			display: inline-block;
			white-space: nowrap;
			width: 100%;
			overflow: hidden;
			text-overflow: ellipsis;

		}


	}

	.none-text {
		width: -2rpx;
		text-align: center;
	}

	.none-icon {
		.setbg(610rpx, 312rpx, 'articleList-none-data-icon2.png');
		margin: 215rpx auto 0;
	}

	.icon1 {
		position: absolute;
		height: 40rpx;
		left: 24rpx;
		top: 20rpx;
		background: rgba(0, 0, 0, .3);
		box-sizing: border-box;
		padding: 5rpx 14rpx 5rpx 10rpx;
		color: #fff;
		border-radius: 12rpx;
		font-size: 24rpx;

		.iconK {
			width: 32rpx;
			height: 32rpx;
			vertical-align: bottom;
			margin-right: 8rpx;
		}

		&.iconB {
			padding-left: 48rpx;

			.iconK {
				position: absolute;
				left: -4rpx;
				top: 0;
				width: 40rpx;
				height: 40rpx;
				vertical-align: bottom;
			}
		}
	}
</style>
