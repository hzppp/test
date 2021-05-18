<template>
	<view>
		<!--    <button v-if="!haveUserInfoAuth" class="getUserInfo_name_info_mask_body" @tap="getWxUserInfoAuth"></button>-->
		<scroll-view scroll-y lower-threshold="200"  @scrolltolower="getList" class="live-list">
			<view class="live-item" v-for="(item,index) in liveList" :key="item.id" @tap="toLiveDet(item)">
				<view class="top">
					<image class="avator" :src="item.picUrl"></image>
					<view class="name">
						名字
					</view>
				</view>
				<view class="banner">
					<image class="bg" :src="item.picUrl"></image>
					<view class="play"></view>
					<view class="status blue" v-if="item.status==1">
						<view class="icon"></view> {{item.startTime}}开始播放
					</view>
					<view class="status yellow" v-if="item.status==2">
						
					</view>
					<view class="status green" v-if="item.status==3">
						
					</view>
				</view>
				<view class="title">
					{{item.title}}
				</view>
			</view>
		</scroll-view>
		<viewTabBar :current="1"></viewTabBar>
	</view>
</template>

<script>
	import tabBar from '@/components/tabBar/tabBar'
	// import shouquan from '@/units/shouquan'
	import api from '@/public/api/index'
/* pages_live/changanVerticalLiveRoom/changanVerticalLiveRoom
id 直播间id
type verticalLive为直播中 verticalPlayback为回放 */
	let app = getApp()
	export default {
		components: {
			viewTabBar: tabBar
		},
		data() {
			return {
				title: "直播",
				liveList: [
					
				],
				hasNext:true,
				pageNum: 1,
				pageSize:10,
				dealerGroupId:'',
			}
		},
		// mixins: [],
		onLoad() {
			// this.getList()
			this.liveList = [
				{
					id:1,
					picUrl:'https://profile.csdnimg.cn/3/E/3/3_caseywei',
					startTime:'2021-12-12 03:20',
					status:1,
					title:'欢迎来到我的欢迎来到我的直播间欢迎来到我的直播间直播间',
				},
				{
					id:2,
					picUrl:'https://profile.csdnimg.cn/3/E/3/3_caseywei',
					status:2,
					startTime:'2021-12-12 03:20',
					title:'欢迎来到我的欢迎来到我的直播间欢迎来到我的直播间直播间',
				},
				{
					id:3,
					picUrl:'https://profile.csdnimg.cn/3/E/3/3_caseywei',
					status:3,
					startTime:'2021-12-12 03:20',
					title:'欢迎来到我的欢迎来到我的直播间欢迎来到我的直播间直播间',
				},
			]
		},
		onShow() {
			// console.log('app.globalData.wxUserInfo  show:', app.globalData.wxUserInfo)
		},
		methods:{
			/* 获取列表 */
			async getList() {
				if (!this.hasNext) {
					return false;
				}
				let resData = await api.getLiveList({
					pageNum: this.pageNum,
					pageSize: this.pageSize
				})
				if (resData.hasNext) {
					this.pageNum++
				} else {
					this.hasNext = false
				}
				this.liveList = [...this.liveList,resData.rows]
				
			},
			toLiveDet(item){
				/* 直播预告 */
				if(item.status==1){
					uni.navigateTo({
						url:'/pages/liveDetail?liveId='+item.id
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
		margin:0 32rpx;
		border-bottom: 1px solid #ebebeb;

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
					.setbg(122rpx, 36rpx, 'live_tag1.png')
					// .icon {
					// 	.setbg(24rpx, 24rpx, 'livetimes.png')
					// }
				}
				&.green{
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
						margin-right:10rpx;
						.setbg(24rpx, 24rpx, 'livetimes.png');
						position: relative;
						top:2rpx;
					}
				}

				// &.red {
				// 	background-color: #fd5248;

				// 	.icon {
				// 		.setbg(24rpx, 24rpx, 'livetimes.png')
				// 	}
				// }
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
