<template>
	<view>
		<pageTopCity ref="pagetop" :background="'#fff'" :titleys="'#000'" :btnys="''" :title.sync="title"
			:isShowBackBtn="'false'"></pageTopCity>
		<view style="font-size: 26rpx;margin-bottom: 20rpx;margin-left: 20rpx; color: #AFB3B6;"> 点击跳转长安汽车小程序观看直播 </view>
		<block v-if="liveList.length">
			<scroll-view scroll-y lower-threshold="200"  class="live-list">
				<view class="live-item" v-for="(item,index) in liveList" :key="index" @tap="toLiveDet(item)">
					<view class="banner">
						<image class="bg" :src="item.pic" mode="aspectFill"></image>
						<view v-if="item.state == 'live'" class="icon1 iconB">
							<image :src="liveIcon[0]" class="iconK"></image>直播中
						</view>
						<view v-else-if="item.state == 'playback'" class="icon1">
							<image :src="liveIcon[2]" class="iconK"></image>回放
						</view>
						<view v-else class="icon1">
							<image :src="liveIcon[1]" class="iconK"></image>{{item.begin_time| timeFim}}开播
						</view>
					</view>
					<view class="title">
						{{item.name}}
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
	import api from '@/public/api/index'
	import pageTopCity from '@/components/pageTopCity/pageTopCity'
	let app = getApp()

	export default {
		components: {
			viewTabBar: tabBar,
			'pageTopCity': pageTopCity,
		},
		data() {
			return {
				title: "直播",
				liveList: [],
				hasNext: true,
				pageNum: 1,
				pageSize: 10,
				total:0,
				dealerGroupId: '',
				liveIcon: [
					'https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/play_icon_3x.png',
					'https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/willplay_icon_3x.png',
					'https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/replay_icon_3x.png'
				],
			}
		},
		filters:{
			timeFim(time){
				var json_date = new Date(time);
				
				//最准确的方式：
				var year=json_date.getFullYear();//年
				if (year< 1900) year = year + 1900;
				var month = json_date.getMonth() + 1;//月
				if (month < 10) month = '0' + month;
				var day = json_date.getDate();//日
				if (day < 10) day = '0' + day;
				var hour = json_date.getHours();//小时
				if (hour < 10) hour = '0' + hour;
				var minute = json_date.getMinutes();//分钟
				if (minute < 10) minute = '0' + minute;
				var second = json_date.getSeconds();//秒
				if (second < 10) second = '0' + second;
				return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
			}
		},
		onLoad() {
			this.getList()
		},
		async onPullDownRefresh() {
			
			uni.showLoading({
				title: '正在加载...'
			})
			this.pageNum = 1
			this.hasNext = true
			this.getList()
			setTimeout(() => {
				uni.hideLoading()
				uni.stopPullDownRefresh()
			}, 300)
			
		},
		async onReachBottom(){
			this.getList()
		},
		onShow() {

		},
		methods: {
			
			/* 获取列表 */
			async getList() {
				if (!this.hasNext) {
					return false;
				}
				let  data = await api.getLiveList({
					page: this.pageNum,
					num: this.pageSize,
					'where[0][k]':'types',
					'where[0][v]':'live',
					'where[1][k]':'state',
					'where[1][v]':'end',
					'desc[0]':'begin_time',
					'where[1][op]':'!=',
					
				})
				
				if (!data) {
					this.hasNext = false;
					return;
				}
				
				const {total, num, page} = data.ext;
				if(this.pageNum == 1){
				   this.total = total;	
				   this.liveList = []
				}
				this.hasNext = this.total - (num * page) > 0;
				
				data.datas.forEach(function(item) {
				// 直播预告”状态判定方式:
				// types字段值为:live
				// state字段值为:live
				// begin_time字段值：大于当前系统时间
				
				// “正在直播”状态判定方式:
				// types字段值为:live
				// state字段值为:live
				// begin_time字段值：小于当前系统时间
				
				// “回放”状态判定方式:
				// types字段值为:live
				// state字段值为:playback
				// begin_time字段值：小于当前系统时间  new Date(endtime.replace(/-/g, '/')).getTime()
				let time = new Date().getTime() 
				let begin_time = new Date(item.begin_time).getTime()
				let j = begin_time - time
				if (item.state == "live" && j > 0) {
					// console.log('begin_time22',item.state ,begin_time,time,j)
					item.state = 'willLive'
				}										
				})
				this.liveList = [...this.liveList, ...data.datas];

				if (this.hasNext) {
					this.pageNum++;
				}
			},
	
			toLiveDet(item) {
				wx.aldstat.sendEvent('直播点击')
				
				// 点击某个直播间时触发埋点
				
				this.$gdp('YCZ_livePositionClick',{'YCZ_liveID_var':item.id,'YCZ_liveName_var':item.name})
				
				
				if (item) {
					console.log('直播路径','/pages/loading/loading?sharePage=/pages/index/live/liveDetail/liveDetail&index=2&channel=2111171&id=' + item.id)
					// #ifndef MP-WEIXIN
					this.$toast('请在微信搜索本小程序参与')
					// #endif

					 // #ifdef MP-WEIXIN
					uni.navigateToMiniProgram({
						appId: 'wx0cd552d51ce3cfc0',
						path: '/pages/loading/loading?sharePage=/pages/index/live/liveDetail/liveDetail&index=2&channel=2111171&id=' + item.id,
						extraData: {},
						// envVersion: 'trial',
						success(res) {
							// 打开成功 
							
							this.$gdp( 'YCZ_allowButtonClick',{'YCZ_liveID_var':item.id,'YCZ_liveName_var':item.name})
							
						},
						fail(res){
							
							this.$gdp('YCZ_cancelButtonClick',{'YCZ_liveID_var':item.id,'YCZ_liveName_var':item.name})
							
						}
					})
				    // #endif
				}
			}
		}
	}
</script>

<style lang="less">
	@import '@/static/less/public.less';

	.live-list {
		// position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 45rpx;
		padding: 0 0 100rpx;
		/*  #ifndef  MP-WEIXIN */
		padding: 0 0 0rpx;
		/*  #endif  */	
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
