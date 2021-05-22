<template>
	<view class="activity">
<!--    <button v-if="!haveUserInfoAuth" class="getUserInfo_name_info_mask_body" @tap="getWxUserInfoAuth"></button>-->
    <share-pop ref="shareSuccess"></share-pop>
		<page-top :background="'#fff'" :titleys="'#000'" :btnys="''" :title="'活动详情'"></page-top>
		<form-pop ref="formpop"></form-pop>
		<view class="title">{{content.name}}</view>
		<view class="date">
			离活动结束还剩<view class="db">{{artDownDate[0]}}</view>天<view class="db">{{artDownDate[1]}}</view>时<view class="db">{{artDownDate[2]}}</view>分
			<!-- <view class="db">{{artDownDate[3]}}</view>秒 -->
		</view>

		<view class="content">
			<image class="content-image" :src="content.detailPic" mode="widthFix" lazy-load="false"></image>
		</view>
		<view class="serial-list">
			<view class="serial-item" v-for="(serialGroupItem, index) in content.serialGroupList" :key="index">
				<view class="name">{{serialGroupItem.name}}</view>
				<button class="see-car-btn" @tap="seeCarBtnClick(serialGroupItem)">3D看车 ></button>
				<image class="cover" :src="serialGroupItem.picCoverUrl" mode="aspectFill" lazy-load="true"></image>
			</view>
		</view>
		<view class="zw"></view>
		<view class="operation-list">
			<view class="type-c" v-if="artDownDate[0] <= 0 && artDownDate[1] <= 0 && artDownDate[2] <= 0 ">
				<button class="over-btn" hover-class="none">活动已结束</button>
			</view>
			<view class="type-a" v-else-if="content.needApply == 1">
				<button :class="'share-btn ' + (content.shareStatus == 0 ? 'share-tip':'')" hover-class="none" open-type="share">分享好友</button>
				<button class="enroll-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" v-if="!phone">报名活动</button>
				<button class="enroll-btn" @tap="formShow" v-else>报名活动</button>
			</view>
			<view class="type-b" v-else-if="content.needApply == 0">
				<button :class="'share-btn ' + (content.shareStatus == 0 ? 'share-tip':'')" hover-class="none" open-type="share">分享好友</button>
			</view>
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
				artDownDate: [],
				activityId: '',
				content: "",
			}
		},
		mixins: [shouquan],
		async onLoad(options) {
			if (app.Interval) {
				clearInterval(app.Interval)
				console.log('----------------', this.Interval)
			}
			// await login.login()
			this.activityId = options.id
			let {
				data={}
			} = await api.getActivityContent(this.activityId)
			this.downDate(data.endTime)
			app.Interval = setInterval(() => {
				this.downDate(data.endTime)
			}, 1000)
			this.phone = uni.getStorageSync('userPhone');
			this.content = data
		},
		onHide () {
			if (app.Interval) {
				clearInterval(app.Interval)
			}
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
				this.$refs.formpop.formShow('form', 'activity', this.content, '报名活动')
			},
			// 看车按钮被点击
			seeCarBtnClick (serialGroupItem) {
				uni.navigateTo({
					url: `/pages/exhibition?sid=${serialGroupItem.pcSerialGroupId}`
				})
			},
			async getPhoneNumber(e) {
			  console.log('eeeeee',e)
				let {
					detail = {}
				} = e
				if (detail.iv) {
					let {
						data
					} = await api.decryptPhone(detail.encryptedData, detail.iv)
					if (data && data.phoneNumber) {
						uni.setStorageSync('userPhone', data.phoneNumber)
						this.phone = data.phoneNumber
					}
				}
				this.$refs.formpop.formShow('form', 'activity', this.content)
			},
			downDate(endtime) {
				let time = new Date().getTime()
				endtime = new Date(endtime.replace(/-/g, '/')).getTime()
				let j = endtime - time
				let tt = 1000 * 60 * 60
				let days = parseInt(j / (tt * 24))
				let hours = parseInt((j % (tt * 24)) / (tt))
				let minutes = parseInt((j % (tt)) / (1000 * 60))
				let ss = Math.floor(j / 1000 % 60)
				if (days < 0) {
					days = 0
				}
				if (hours < 0) {
					hours = 0
				}
				if (minutes < 0) {
					minutes = 0
				}
				if (ss < 0) {
					ss = 0
				}
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
	.serial-list {
		margin: 40rpx 0;
		.serial-item {
			position: relative;
			margin: 0 auto 30rpx;
			width: 686rpx;
			height: 270rpx;
			background-color: #DFE1E2;
			border-radius: 20rpx;
			.name {
				position: absolute;
				left: 30rpx;
				top: 30rpx;
				font-size: 32rpx;
				font-weight: bold;
				color: #333333;
			}
			.see-car-btn {
				position: absolute;
				bottom: 30rpx;
				left: 35rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				width: 140rpx;
				height: 48rpx;
				font-size: 24rpx;
				color: #FFFFFF;
				border-radius: 24rpx;
				background-color: #333333;
			}
			.cover {
				position: absolute;
				right: 37rpx;
				bottom: 31rpx;
				width: 300rpx;
				height: 200rpx;
			}
		}
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
		height: 104rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
	.operation-list {
			position: fixed;
			z-index: 1;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 104rpx;
			font-size: 32rpx;
			font-weight: bold;
			background-color: #ffffff;
			padding-top: 20rpx;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
			.share-btn, .enroll-btn, .over-btn {
				display: flex;
				justify-content: center;
				align-items: center;
			}
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
					background-color: #FFFFFF;
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
