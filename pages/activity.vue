<template>
	<view>
		<userBand @loginSuccess='getData'></userBand>
		<view class="activity">
			<!--    <button v-if="!haveUserInfoAuth" class="getUserInfo_name_info_mask_body" @tap="getWxUserInfoAuth"></button>-->
			<share-pop ref="shareSuccess"></share-pop>
			<page-top :background="'#fff'" :titleys="'#000'" :btnys="''" :title="'活动详情'"></page-top>
			<form-pop ref="formpop"></form-pop>
			<view class="title">{{content.name}}</view>
			<view class="date" v-if="content && isActStart && !isActEnded">
				离活动结束还剩<view class="db">{{artDownDate[0]}}</view>天<view class="db">{{artDownDate[1]}}</view>时<view
					class="db">{{artDownDate[2]}}</view>分
				<!-- <view class="db">{{artDownDate[3]}}</view>秒 -->
			</view>
			<view class="date" v-if="isActEnded">活动已结束</view>

			<view class="content">
				<image class="content-image" :src="content.detailPic" mode="widthFix" lazy-load="false"></image>
			</view> 
			<view class="serial-list" v-if="content.showCustomAds == 0">
				<view class="serial-item" v-for="(serialGroupItem, index) in content.serialGroupList" :key="index"
					@tap="seeCarBtnClick(serialGroupItem)">
					<view class="name">{{serialGroupItem.name}}</view>
					<button class="see-car-btn">3D看车 ></button>
					<image class="cover" :src="serialGroupItem.picCoverUrl" mode="aspectFill" lazy-load="true"></image>
				</view>
			</view>
			<!-- customAdList --> 
			<view v-if="content.showCustomAds == 1" v-for="(item) in content.customAdList" @tap="tapAcivity(item)">
				<image  style="width: 686rpx;height:270rpx ;margin-left: 32rpx;border-radius: 14rpx;margin-top: 10rpx;" :src="item.picUrl" mode="aspectFill" lazy-load="true"></image>
			</view>


			<view class="zw"></view>
			<view class="operation-list">
				<view class="type-c"
					v-if="(artDownDate[0] <= 0 && artDownDate[1] <= 0 && artDownDate[2] <= 0) || isActEnded ">
					<button class="over-btn" hover-class="none">活动已结束</button>
				</view>
				<view class="type-a" v-else-if="content.needApply == 1">
					<button :class="'share-btn ' + (content.shareStatus == 0 ? 'share-tip':'')" hover-class="none"
						open-type="share" @click="shareBtnClick">分享好友</button>
					<button class="enroll-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber"
						v-if="!phone">报名活动</button>
					<button class="enroll-btn" @tap="formShow" v-else>报名活动</button>
				</view>
				<view class="type-b" v-else-if="content.needApply == 0">
					<button :class="'share-btn ' + (content.shareStatus == 0 ? 'share-tip':'')" hover-class="none"
						open-type="share" @click="shareBtnClick">分享好友</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import login from '@/units/login'
	import api from '@/public/api/index'
	import shouquan from '@/units/shouquan'
    import userBand from '@/components/userBand/userBand'
	import formpop from '@/components/formpop/formpop'
	import pageTop from '@/components/pageTop/pageTop'
	import shareSuccess from '@/components/shareSuccess/shareSuccess'

	let app = getApp()
	const ctx = uni.createCanvasContext('myCanvas')
	export default {
		components: {
			'form-pop': formpop,
			'page-top': pageTop,
			'share-pop': shareSuccess,
			'userBand':userBand
		},
		data() {
			return {
				phone: false,
				artDownDate: [],
				activityId: '',
				content: "",
				isActEnded: false,
				isActStart: false,
				activityType:"",
				isApply:0, //是否留咨过
				//直播间用的
				liveUrl:'',
				shareURL:'',
				
			}
		},
		mixins: [shouquan],
		async onLoad(options) {	
			
			if (options.tolbActivity) {
				uni.reLaunch({
					url: '/pages/lbActivity?id=' + options.id + '&sourceUserId=' + options.sourceUserId
				})
				return
			}
			//直播活动相关
			if(options.type && (options.type == 'Live' || options.type == 'verticalLive')){
				if(options.type == 'Live' ){
					this.liveUrl =  '/pages_live/liveRoomPlay/liveRoomPlay?share=' + options.share +  '&id=' +  options.liveId

             }else if(options.type == 'verticalLive' ){
					this.liveUrl = '/pages_live/verticalLiveRoom/verticalLiveRoom?type=verticalLive&share=' +  options.share +  '&id=' + options.liveId
				}
				
				console.log('liveurl == ',this.liveUrl)
			}
			
			if (app.Interval) {
				clearInterval(app.Interval)
				console.log('----------------', this.Interval)
			}
			console.log("options.type",options.type)
			if(options.type){
				this.activityType= options.type || ''
			}
			await login.checkLogin(api)
			try {
				uni.showLoading({
					title: '正在加载...'
				})
				// await login.login()
				this.activityId = options.id
				let {
					data = {}
				} = await api.getActivityContent(this.activityId)
				let clueInfo= await api.getClueInfo({activityId: this.activityId})
				if(clueInfo.code==1) this.isApply= clueInfo.data.isApply
				this.downDate(data.endTime)
				this.isActStart = ((new Date().getTime() - new Date(data.startTime.replace(/-/g, "/")).getTime()) > 0)
				app.Interval = setInterval(() => {
					this.downDate(data.endTime)
				}, 1000)
				this.phone = uni.getStorageSync('userPhone');
				this.content = data
			    if(this.liveUrl){
					this.content.liveUrl = this.liveUrl
				}
				if (data.redirectType == 1 && data.h5Link && data.h5Link.substring(0, 4) == "http") {
					uni.reLaunch({
						url: `/pages/webview?webURL=${encodeURIComponent(data.h5Link)}`,
					})
				}
				if (data.h5Link && data.h5Link == 'changan://lbcjactivity') {
					uni.reLaunch({
						url: '/pages/lbActivity?id=' + this.activityId + '&sourceUserId=' + options
							.sourceUserId
					})
				}
				// 访问活动 记录活动访问次数
				api.fetchActivityVisit({
					'activityId': this.activityId
				})
			} catch (err) {
				console.error(err)
			} finally {
				uni.hideLoading()
			}
			
			// 分享用
			let cs = ''
			for (let i in options) {
			  cs += `${i}=${options[i]}&`
			}
			  cs = cs.substr(0, cs.length - 1)
			  this.shareURL = `/pages/activity?${cs}`
			  console.log('shareurl',this.shareURL)
			// 红包相关
			this.redStatus(this.activityId)
		},
		onHide() {
			if (app.Interval) {
				clearInterval(app.Interval)
			}
		},
		onShareAppMessage() {
			let title = this.content.name
			let path = this.shareURL
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
				// #ifdef MP-WEIXIN
				wx.aldstat.sendEvent('报名活动')
				console.log("已经报名，且为抓娃娃机活动",this.isApply,this.activityType)
				//如果已经报名，且为抓娃娃机活动，则直接跳转活动页面
				if(this.isApply && this.activityType=="wawaji"){
					uni.navigateTo({
						url:`/pages/wawaji?activityId=${this.content.id}`
					})
				}else{
					this.$refs.formpop.formShow('form', 'activity', this.content, '报名活动')
				}
				
				// #endif
				
				// #ifdef MP-TOUTIAO
				console.log(12133123)
				this.$children[3].formShow('form', 'activity', this.content, '报名活动')
				// #endif
				
			},
			// 分享按钮被点击
			shareBtnClick() {
				// #ifdef MP-WEIXIN
				wx.aldstat.sendEvent('活动分享点击')
				// #endif			
			},
			// 看车按钮被点击
			seeCarBtnClick(serialGroupItem) {
				// #ifdef MP-WEIXIN
				wx.aldstat.sendEvent('3D看车点击')
				// #endif
				const currentLocation = app.globalData.currentLocation
				let cityId = '1000000262'
				let cityName = '重庆市'
				if (currentLocation.selectedCityData && currentLocation.selectedCityData.cityId) {
					cityId = currentLocation.selectedCityData.cityId
					cityName = currentLocation.selectedCityData.city
				}
				uni.navigateTo({
					url: `/pages/vr360Frame/vr360Frame?sid=${serialGroupItem.pcSerialGroupId}&cityId=${cityId}&cityName=${cityName}`
				})
			},
			tapAcivity(item) {
				//0:跳转小程序内部页面,1:H5外链,2:外部小程序
				console.log('跳转',item)
				switch (item.redirectType) {
					case 0: {
						uni.navigateTo({
							url: item.miniUrl,
						})
						// #ifndef MP-WEIXIN
						if(item.miniUrl && item.miniUrl.substr(0,3) == 'cxd'){
							this.$toast('请在微信搜索本小程序参与')
						}
						// #endif
					}
					case 1: {
						if (item.h5Link && item.h5Link.substring(0, 4) == "http") {
							uni.navigateTo({
								url: `/pages/webview?webURL=${encodeURIComponent(item.h5Link)}`,
							})
						}
						break;
					}
					case 2: {
						if (item.appId == 'wxe6ffa5dceb3b003b' || item.appId == 'wxb36fb5205e5afb36') {
							// 说明是自己的小程序
							uni.navigateTo({
								url: item.miniUrl
							})
							// #ifndef MP-WEIXIN
							if(item.miniUrl && item.miniUrl.substr(0,3) == 'cxd'){
								this.$toast('请在微信搜索本小程序参与')
							}
							// #endif
							return
						}
						// #ifndef MP-WEIXIN
					    this.$toast('请在微信搜索本小程序参与')
						// #endif
						 // #ifdef MP-WEIXIN
						uni.navigateToMiniProgram({
							appId: item.appId,
							path: item.miniUrl,
							success: res => {
								// 打开成功
								console.log("打开成功", res);
							},
							fail: err => {
								console.log("打开失败", err);
								uni.showToast({
									title: "跳转小程序失败",
									icon: "none"
								})
							},
							// envVersion: 'trial'
						});
						 // #endif
						break;
					}
				}
			},

			async getPhoneNumber(e) {
				console.log('eeeeee', e)
				let {
					detail = {}
				} = e
				if (detail.iv) {
					try {
						let {
							data
						} = await api.decryptPhone(detail.encryptedData, detail.iv)
						if (data && data.phoneNumber) {
							uni.setStorageSync('userPhone', data.phoneNumber)
							this.phone = data.phoneNumber
						}
					} catch (err) {
						this.$toast('手机号码授权失败', 'none', 1500);
						console.error(err)
					}
				}
				this.formShow()
			},
			downDate(endtime) {
				let time = new Date().getTime()
				endtime = new Date(endtime.replace(/-/g, '/')).getTime()
				let j = endtime - time
				if (j <= 0) {
					this.isActEnded = true;
					return;
				}
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
				// console.log('vvvvvvv==' + v)
				this.artDownDate = v
			},
			// +0
			add0(number) {
				return number > 9 ? number : '0' + number
			},
		    
			getData(){
		    	// 访问活动 记录活动访问次数
		    	api.fetchActivityVisit({
		    		'activityId': this.activityId
		    	})
		    },
			
			async redStatus(){
			let {data} = await api.redStatus({
					'activityId':this.activityId
				})
			let status = data.status
			console.log('红包状态',status)
			
		// yuchentest
		status = 1
			
			if(status == 0){
				//未开过
				
			}else if(status == 1){
				// 开过
				this.redRecord()
			}else if(status == 3){
				// 无关联红包
				
			}

			},
			
			async redRecord(){
				let data  = await  api.redRecord({
					'activityId':this.activityId
				})
				console.log('中奖记录',data)
				let rows = data.rows
			   if(rows.count > 0){
				   // 中奖过
			   }else{
				   // 为中奖
			   }
				
				
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

		.share-btn,
		.enroll-btn,
		.over-btn {
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
