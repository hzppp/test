<template>
	<view class="activity">
		<button v-if="isUserInfoPage" class="getUserInfo_name_info_mask_body" lang="zh_CN" @getuserinfo="getWxUserInfoButton"
		 open-type="getUserInfo"></button>
		<share-pop ref="shareSuccess"></share-pop>
		<page-top :background="'#fff'" :titleys="'#000'" :btnys="''" :title="'活动详情'"></page-top>
		<form-pop ref="formpop"></form-pop>
		<view class="title">{{content.name}}</view>
		<view class="date">
			离活动结束还剩<view class="db">{{artDownDate[0]}}</view>天<view class="db">{{artDownDate[1]}}</view>时<view class="db">{{artDownDate[2]}}</view>分<view class="db">{{artDownDate[3]}}</view>秒
		</view>

		<view class="content">
			<image class="content-image" :src="content.detailPic" mode="widthFix" lazy-load="false"></image>
		</view>
		<view class="zw"></view>
		<view class="operation-list">
			<view class="type-a">				
				<button :class="'share-btn ' + (content.shareStatus == 0 ? 'share-tip':'')" hover-class="none" open-type="share">分享好友</button>
				<button class="enroll-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" v-if="!phone">报名活动</button>
				<button class="enroll-btn" @tap="formShow" v-else>报名活动</button>
			</view>
			<!-- <view class="type-b">
				<button :class="'share-btn ' + (content.shareStatus == 0 ? 'share-tip':'')" hover-class="none" open-type="share">分享好友</button>
			</view> -->
			<!-- <view class="type-c">
				<button class="over-btn" hover-class="none">活动已结束</button>
			</view> -->
		</view>
	</view>
</template>

<script>
	import login from '@/units/login'
	import api from '@/public/api/index'
	import shouquan from '@/units/shouquan'

	import formpop from '@/components/formpop/formpop'
	import pageTop from '@/components/pageTop/pageTop'
	import shareSuccess from '@/components/shareSuccess/shareSuccess'

	let app = getApp()
	const ctx = uni.createCanvasContext('myCanvas')
	export default {
		components: {
			'form-pop': formpop,
			'page-top': pageTop,
			'share-pop': shareSuccess
		},
		data() {
			return {
				phone: false,
				// title:"",
				artDownDate: [],
				activityId: '',
				content: ""
			}
		},
		mixins: [shouquan],
		async onLoad(options) {
			if (app.Interval) {
				clearInterval(app.Interval)
				console.log('----------------', this.Interval)
			}
			await login.login()
			let pocketUserInfo = await api.getPocketUserInfo()
			this.activityId = options.id
			let {
				data
			} = await api.getActivityContent(this.activityId)
			// this.title = data.name
			app.Interval = setInterval(() => {
				this.downDate(data.endTime)
			}, 1000)

			this.phone = app.globalData.pocketUserInfo.phone
			console.log(this.phone)
			this.content = data
			api.visitActivity(data.id)
		},
		onShareAppMessage() {
			let title = this.content.name
			let path = `pages/authorization?to=activity&id=${this.content.id}`
			if (app.globalData.salesId) {
				path += `&salesId=${app.globalData.salesId}`
			}
			api.shareActivity(this.content.id).then(res => {
				console.log(res)
				if (res.data > 0) {
					// setTimeout(()=>{
					//     this.$invoke('share-pop','shareSuccessShow',res.data,'转发成功')
					// },800)
					this.content.shareStatus = 1
				}
			})
			let imageUrl = this.content.sharePic || this.content.detailPic
			return {
				title: title,
				path: path,
				imageUrl: imageUrl
			}
		},
		methods: {
			formShow() {
				this.$refs.formpop.formShow('form', 'activity', this.content, '完善资料')
				// this.$invoke('form-pop', 'formShow', 'form', 'activity', this.content)
			},
			async getPhoneNumber(e) {
				let {
					detail = {}
				} = e
				if (detail.iv) {
					let {
						data
					} = await api.decryptPhone(detail.encryptedData, detail.iv)
					app.globalData.pocketUserInfo.phone = data.phoneNumber
					this.phone = data.phoneNumber
					
					this.$refs.formpop.formShow('form', 'activity', this.content)
					// this.$invoke('formpop', 'formShow', 'form', 'activity', this.content)
				} else {
					uni.showToast({
						title: '需要授权后才能报名',
						icon: 'none',
						duration: 1500
					})
				}

			},
			downDate(endtime) {
				let time = new Date().getTime()
				let j = endtime - time
				let tt = 1000 * 60 * 60
				let days = parseInt(j / (tt * 24))
				let hours = parseInt((j % (tt * 24)) / (tt))
				let minutes = parseInt((j % (tt)) / (1000 * 60))
				let ss = Math.floor(j / 1000 % 60)
				let v = [this.add0(days), this.add0(hours), this.add0(minutes), ss]
				this.artDownDate = v
			},
			// +0
			add0(number) {
				return number > 9 ? number : '0' + number
			}
		}
	}
</script>

<style lang="less">
	@import '@/static/less/public.less';

	.title {
		line-height: 65rpx;
		padding: 30rpx 32rpx;
		font-size: 48rpx;
		color: #333;
		font-weight: bold;
	}

	.date {
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		color: #999;
		padding: 0 32rpx 40rpx;

		.db {
			display: inline-block;
			vertical-align: top;
			background: #fa8845;
			height: 40rpx;
			padding: 0 12rpx;
			color: #fff;
			font-weight: bold;
			margin: 0 5rpx;
			border-radius: 4rpx;
		}
	}

	.content {
		font-size: 0;
	}

	.content-image {
		width: 750rpx;
	}

	.fixys {
		height: 100rpx;
		font-size: 32rpx;
		height: 100rpx;
		line-height: 100rpx;
		color: #fff;
		vertical-align: top;
		display: inline-block;
	}

	.zw {
		height: 100rpx;
	}

	.operation-list {
			position: fixed;
			z-index: 1;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 104rpx;
			font-size: 32rpx;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
			.type-a {
				display: flex;
				justify-content: space-between;
				padding: 0 32rpx;
				box-sizing: border-box;
				.share-btn {
					width: 236rpx;
					height: 88rpx;
					color: #fa8845;
					border: 2rpx solid #fa8845;
					border-radius: 44rpx;
					box-sizing: border-box;
				}
				.enroll-btn {
					width: 420rpx;
					height: 88rpx;
					color: #ffffff;
					background-color: #fa8845;
					border-radius: 44rpx;
				}			
			}
			.type-b {
				padding: 0 32rpx;
				box-sizing: border-box;
				.share-btn {
					width: 686rpx;
					height: 88rpx;
					color: #ffffff;
					background-color: #fa8845;
					border-radius: 44rpx;
				}
			}
			.type-c {
				padding: 0 32rpx;
				box-sizing: border-box;
				.over-btn {
					width: 686rpx;
					height: 88rpx;
					color: #ffffff;
					background-color: #cccccc;
					border-radius: 44rpx;
				}
			}
		}
</style>
