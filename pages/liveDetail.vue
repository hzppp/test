<template>
	<block v-if="liveObj">
		<view class="live-detail">
			<view class="pageTop-back-btn" @tap="navigateBack" :style="'top:' + height + 'px'"></view>
			<view class="banner">
				<image :src="liveObj.cover"></image>
			</view>
			<view class="main-container">
				<view class="prev">
					将于{{liveObj.startTime}}开始
				</view>
				<view class="title">
					{{liveObj.title}}
				</view>
				<view class="userinfo">
					<image class="avator" :src="liveObj.headPic"></image>
					<view class="name">
						{{liveObj.nickName}}
					</view>
				</view>
				<htmlParser :content="liveObj.summary" class="intro"></htmlParser>
			</view>
			<view class="fixed-bot">
				<button open-type="share" class="btns icon-share">
					<view class="icon"></view>分享
				</button>
			</view>
		</view>
	</block>
	<block v-else>
		<view class="live-detail">
			<view class=".pageTop-back-btn1" @tap="navigateBack" :style="'top:' + height + 'px'"></view>

			<view style="height:145rpx;"></view>
			<view class="none-icon"></view>
			<view class="none-text">暂无数据</view>
		</view>
	</block>



	</view>
</template>

<script>
	import mpHtml from '@/components/mp-html/mp-html'
	import api from '@/public/api/index'
	let app = getApp()
	export default {
		components: {
			htmlParser: mpHtml
		},
		mixins: [],
		data() {
			return {
				id: 0,
				title: '12312',
				liveObj: null,
				height: 0,
			}
		},
		async created() {
			let {
				bottom,
				height,
				left,
				right,
				top,
				width
			} = uni.getMenuButtonBoundingClientRect()
			this.height = height + top - 13;
			console.log('son==', this.height)
		},
		methods: {
			navigateBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			async getLiveDetail() {
				let {
					data
				} = await api.getLiveDetail({
					id: this.id
				})
				data.summary = data.summary.replaceAll('\n', '<br>')
				// console.log('预告1323===',data.summary)
				this.liveObj = data

			},
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: this.liveObj.title,
				path: '/pages/liveDetail?liveId=' + this.id
			}
		},
		onLoad(options) {
			this.id = options.liveId
			this.getLiveDetail()
			// console.log('app.globalData.currentLocation:', app.globalData.currentLocation)
		},
		onShow() {
			// console.log('app.globalData.wxUserInfo  show:', app.globalData.wxUserInfo)
		}
	}
</script>

<style lang="less">
	@import '@/static/less/public.less';

	.live-detail {
		padding-bottom: 128rpx;

		.pageTop-back-btn {
			width: 26rpx;
			height: 26rpx;
			border-left: 4rpx solid #fff;
			border-top: 4rpx solid #fff;
			position: absolute;
			left: 30rpx;
			top: 80rpx;
			-webkit-transform: translate(0%, -50%) rotate(-45deg);
			transform: translate(0%, -50%) rotate(-45deg);

			&::after {
				display: block;
				content: "";
				width: 180%;
				height: 180%;
				position: absolute;
				left: -40%;
				top: -40%;
				z-index: 9999;
			}
		}

		.pageTop-back-btn1 {
			width: 26rpx;
			height: 26rpx;
			border-left: 4rpx solid #000;
			border-top: 4rpx solid #000;
			.pa(30rpx, 50%);
			transform: translate(0%, -50%) rotate(-45deg);

			&.back-btn-white {
				color: #fff;
			}

			&:after {
				display: block;
				content: "";
				width: 180%;
				height: 180%;
				.pa(-40%, -40%);
				z-index: 9999;
			}
		}

		.banner,
		.banner image {
			width: 750rpx;
			height: 422rpx;
		}

		.main-container {
			padding: 0 60rpx;
			box-sizing: border-box;

			.prev {
				background: url('@{imgURL}live_prev.png') 0 0 no-repeat ;
				background-size: 140rpx 40rpx;
				padding-left: 156rpx;
				color: #fa843f;
				font-weight: 800;
				margin: 80rpx 0;
				line-height:40rpx ;
			}

			.title {
				
				font-size: 48rpx;
				font-weight: 800;
			}

			.userinfo {
				padding: 40rpx 0 24rpx;
				margin: 30rpx 0;
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

			.intro {
				color: #999999;
				line-height: 48rpx;
				font-size: 28rpx;
			}
		}

		.none-text {
			text-align: center;
		}

		.none-icon {
			.setbg(610rpx, 312rpx, 'articleList-none-data-icon2.png');
			margin: 215rpx auto 0;
		}

		.fixed-bot {
			position: fixed;
			width: 100%;
			left: 0;
			bottom: 41rpx;
			.dflex(center, center);

			.btns {
				width: 630rpx;
				height: 88rpx;
				line-height: 88rpx;
				background-color: #fff3ed;
				border-radius: 44rpx;
				color: #FA843F;

				.dflex(center, center);

				.icon {
					.setbg(48rpx, 48rpx, 'share_btn.png');
					margin-right: 18rpx;
				}
			}
		}
	}
</style>
