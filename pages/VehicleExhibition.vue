<template>
	<view>
		<form-pop ref="formpop"></form-pop>
		<!-- <view style="height:40rpx"></view> -->
		<!-- <view class="activity-top">
			<view class="tit">
				车型展厅
				<view class="more-btn" @tap="toCarPage" @tap="toCarPage('{{serialList[0].serialGroupId}}')">更多车型<button class="submit-button" formType="submit" plain="true"></button></view>
			</view>
		</view> -->
		<view class="header-sales-info" v-if="dealerInfo">
			<view class="d-name">{{dealerInfo.dealerName}}</view>
			<view class="d-address" @tap.stop="openLocation">{{dealerInfo.address}}</view>
			<view class="d-label" v-if="dealerInfo.distance">
				<view class="db">距离{{dealerInfo.distance}}km</view>
				<!-- <view class="db"></view> -->
			</view>
			<image class="s-head" :src="dealerInfo.salesheadUrl" mode="scaleToFill" lazy-load="false"></image>
			<view class="s-name">{{dealerInfo.salesName}}</view>
			<view class="btns">
				<view class="call-phone-btn" @tap="callPhone"></view>
				<button class="form-btn" plain open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" v-if="!phone"></button>
				<view v-else class="form-btn" @tap.stop="dealerForm()"></view>
				<!-- <view class="form-btn"></view> -->
				<!-- <view class="im-btn"></view> -->
				<navigator class="im-btn" target='miniProgram' app-id='wx6986c1a258647aae' :path="'pages/chat?salesId='+dealerInfo.salesId"
				 hover-class="none" redirect></navigator>
			</view>
		</view>
		<view class="activity-list" v-if="serialList.length>0">

			<view class="list">
				<block v-for="(item,index) in serialList1" :key="index">
					<view :class="'list-image'+index" @tap="toCarPage(item.serialGroupId)">
						<image mode="widthFix" :src="item.picUrl" lazy-load="true"></image>
						<view class="lebel" v-if="item.indexLable">{{item.indexLable}}</view>
						<button class="submit-button" form-type="submit" plain="true"></button>
					</view>
				</block>
			</view>
			<view class="list2">
				<block v-for="(item,index) in serialList2" :key="index">
					<view class="pic-text" :class="item.className ? 'not-bd' : ''" @tap="toCarPage(item.serialGroupId)">
						<view class="text">{{item.name}}</view>
						<image mode="widthFix" :src="item.baiPic" lazy-load="true"></image>
						<view class="lebel" v-if="item.indexLable">{{item.indexLable}}</view>
						<button class="submit-button" form-type="submit" plain="true"></button>
					</view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	import coupon from '@/components/coupon/coupon'
	import formpop from '@/components/formpop/formpop'

	import login from '@/units/login'
	import api from '@/public/api/index'
	import shouquan from '@/units/shouquan'
	import distance from '@/units/distance'
	let app = getApp()
	export default {
		components: {
			'coupon-list': coupon,
			'form-pop': formpop
		},

		mixins: [shouquan],
		data() {
			return {
				phone: "",
				serialList: [],
				serialList1: [],
				serialList2:[],
				dealerInfo: ""
			}
		},
		async onShow() {
			this.phone = app.globalData.pocketUserInfo.phone
		},
		async onLoad(options) {
			this.serialList = []
			await login.login()
			api.getUser()
			// 车型展厅
			let serialList = await api.getAutoSerialList()
			
			console.log('serialList=======',serialList)
			this.serialList = serialList.data
			let serialList2 = []
			if(serialList.data[0] && serialList.data[0].picUrl && serialList.data[1] && serialList.data[1].picUrl){
				this.serialList1 = serialList.data.slice(0,2)
				serialList2 = serialList.data.slice(2)
			}else{
				serialList2 = serialList.data
			}
			if(serialList2.length%2 == 0){
				serialList2[serialList2.length-1].className = true
				serialList2[serialList2.length-2].className = true
			}else{
				serialList2[serialList2.length-1].className = true
			}
			this.serialList2 = serialList2
			let cs = {}
			let wxPosition = app.globalData.currentLocation.wxPosition
			if (!wxPosition.wsq) {
				cs.latitude = wxPosition.latitude
				cs.longitude = wxPosition.longitude
			}
			let {
				data,
				code
			} = await api.getVehicleExhibitionSalesInfo(cs)
			if (code == 1) {
				// console.log(data.distance)
				data.distance = (data.distance * 1).toFixed(2)
				this.dealerInfo = data
			}
			// console.log(this.dealerInfo)

		},
		onShareAppMessage() {
			let title = '奥迪东海汇：活动优惠都在这里！'
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
			toCarPage(id) {
				console.log('toCarPagetoCarPagetoCarPage')
				let url = '/pages/carShow?id=' + id
				uni.navigateTo({
					url
				})
			},
			toActivityPage(id) {
				let url = '/pages/activity?id=' + id
				uni.navigateTo({
					url
				})
			},
			formSubmit(e) {
				let {
					detail
				} = e
				api.saveFormId(detail.formId)
			},
			callPhone() {
				let phone = this.dealerInfo.dealerPhone
				uni.makePhoneCall({
					phoneNumber: phone
				})
			},
			dealerForm() {
				// this.$invoke('form-pop', 'formShow', 'form', 'dealer', this.dealerInfo)
				this.$refs.formpop.formShow('form', 'dealer', this.dealerInfo)
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
				}
				// this.$invoke('form-pop', 'formShow', 'form', 'dealer', this.dealerInfo)
				this.$refs.formpop.formShow('form', 'dealer', this.dealerInfo)

			},
			openLocation() {
				let obj = this.dealerInfo
				uni.openLocation({
					latitude: parseFloat(obj.dealerLatitude),
					longitude: parseFloat(obj.dealerLongitude),
					scale: 18,
					name: obj.dealerName,
					address: obj.address
				})
			},
		}
	}
</script>

<style lang="less">
	@import '@/static/less/index.less';

	.activity-top {
		overflow: hidden;
		.tit {
			.seth(117rpx, 40rpx, #333);
			font-weight: bold;
			text-align: center;
			margin-top: constant(safe-area-inset-bottom);
			margin-top: env(safe-area-inset-bottom);
		}

	}

	.header-sales-info {
		width: 686rpx;
		height: 294rpx;
		position: relative;
		background: #fff;
		margin: 32rpx;
		box-shadow: 0 0 10rpx #fafafa;

		.d-name {
			.seth(50rpx, 32rpx, #333);
			.fb;
			.pa(30rpx, 33rpx);
			.ellipsis;
			width: 415rpx;
		}

		.d-address {
			.seth(38rpx, 24rpx, #666);
			padding-right: 30rpx;
			max-width: 385rpx;
			.ellipsis;
			.pa(30rpx, 83rpx);
		}

		.d-label {
			.pa(30rpx, 136rpx);
			font-size: 0;

			.db {
				.db();
				.seth(40rpx, 20rpx, #999);
				padding: 0 15rpx;
				border-radius: 40rpx;
				background: #f6f7fb;
				margin-right: 15rpx;
			}
		}

		.s-head {
			.arc(50rpx);
			.pa(30rpx, 206rpx);
		}

		.s-name {
			.seth(50rpx, 24rpx, #666);
			.pa(94rpx, 206rpx);
		}

		.btns {
			.setbg(174rpx, 202rpx, 'dazhong_20191129_1.png');
			.pa(482rpx, 40rpx);

			.call-phone-btn,
			.form-btn {
				.pa(0, 0);
				width: 50%;
				height: 110rpx;
				// background: #fff;
			}

			.form-btn {
				left: 50%;
			}

			.im-btn {
				width: 120rpx;
				height: 35rpx;
				position: absolute;
				right: 0;
				bottom: 0;
			}
		}
	}
</style>
