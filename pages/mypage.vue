<template>
	<view>
       <userBand @loginSuccess='getData'></userBand>
		<!-- <page-top :background.sync="'#f6f7f8'" :titleys.sync="'#000'" :btnys.sync="''" :title.sync="'综合服务区'"></page-top> -->
		<pageTopCity ref="pagetop" :background="'#e2ebf4'" :titleys="'#000'" :btnys="''" :title.sync="title"></pageTopCity>
		<button v-if="!haveUserInfoAuth" class="getUserInfo_name_info_mask_body" lang="zh_CN"
			@tap="getWxUserInfoAuth(callback,'myPage')"></button>
		<view class="top-wrap">
			<view class="top" style="display: block;">
				<block v-if="haveUserInfoAuth">
					<view class="info">
						<view class="name_info">
							<view class="name">
								<!--  #ifdef MP-WEIXIN  -->
										<open-data type="userNickName"></open-data>
								<!-- #endif -->
								
								<!--  #ifdef MP-TOUTIAO  -->
										<template>{{name}}</template>
								<!-- #endif -->
								
							</view>
							<view v-if="photo" class="phoneV">
								<image class="phoneVicon"
									src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/caphoto.png"></image>
								<view class="phonetitle">{{photo?photo:'-'}}</view>
							</view>
							<view v-if="score" class="phoneV">
								<image class="scoreVicon"
									src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/score.png"></image>
								<view class="scoretitle">{{score}}</view>
							</view>

						</view>

					</view>

					<view class="head">
						<!--  #ifdef MP-TOUTIAO  -->
							<image :src="wxHead"></image>
						<!-- #endif -->
						<open-data type="userAvatarUrl"></open-data>
					</view>

				</block>
				<block v-else>
					<button class="getUserInfo-name_info" lang="zh_CN">登录</button>
					<view class="p9" style="font-size: 28rpx;margin-top:25rpx;">登录开启长安云车展精彩之旅</view>
				</block>
			</view>

			<view class="box">
				<!-- 上线需要删掉 start -->
				<!-- <view class="line"></view>
				<navigator url="/pages/invitationLetter/Search" redirect hover-class="className" class="box-list list3">
					<view class="p1">测试跳邀请函搜索</view>
					<view class="right isApprove"></view>
				</navigator> -->
				<!-- 上线需要删掉 end -->
				<!--  #ifdef MP-WEIXIN  -->
					<view class="box-list list2" @tap="toMyicon">
						<view class="p1">积分商城</view>
						<view class="right isApprove"></view>
					</view>
					<view class="line"></view>
					
					<view class="box-list list8" @tap="toMyOrder">
						<view class="p1">我的订单</view>
						<view class="right isApprove"></view>
					</view>
					<view class="line"></view>
				<!-- #endif -->
				<view class="box-list list6" @tap="toactivity">
					<view class="p1">我的活动</view>
					<view class="right isApprove"></view>
				</view>
				<view class="line"></view>
				<view class="box-list list4" @tap="toMylotteryRecord">
					<view class="p1">我的中奖记录</view>
					<view class="right isApprove"></view>
				</view>
				<!--  #ifdef MP-WEIXIN  -->
				<view class="line"></view>
				<view class="box-list list3" @tap="tomyvideo">
					<view class="p1">新媒体营销查询</view>
					<view class="right isApprove"></view>
				</view>
				<!-- #endif -->
				
				
				<!--  #ifdef MP-TOUTIAO  -->
			<!-- 		<view class="line"></view>
					<view class="box-list list5" @tap="tomSuggestion">
						<view class="p1">意见反馈</view>
						<view class="right isApprove"></view>
					</view> -->
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN  -->
					<view class="line"></view>
					<button class="list7Btn"   @click="contactKefu"></button>
					<view class="box-list list7">
						<view class="p1">联系客服</view>
						<view class="right isApprove"></view>
					</view>
				<!-- #endif -->


			
				
			
				<!-- <view class="box-list list4">
					<navigator version="trial" class="activity-btn" target='miniProgram' app-id='wx1c5c0ec0757002c2'
						path='pages/index' hover-class="" redirect></navigator>
					<view class="p1">车贷计算器</view>
					<view class="right isApprove"></view>

				</view> -->
			</view>
				<image  v-if="imageData.picUrl" :src="imageData.picUrl" class="imagev" @tap="goImageDetail" mode="aspectFill"></image>
		</view>
		<!-- <view class="banner_bot">
			<image src=""></image>
		</view> -->
		<testDrive aldEventName='我的页面预约试驾' from="myPage"></testDrive>
<!--  #ifdef MP-WEIXIN  -->
		<viewTabBar :current="4"></viewTabBar>
<!-- #endif -->
	</view>
</template>

<script>
	import login from '@/units/login'
	import shouquan from '@/units/shouquan'
	import api from '@/public/api/index'
	import testDrive from '@/components/testDrive/testDrive'
	// import getUserInfo from '@/units/getUserInfo'
	// import shareSuccess from '@/components/shareSuccess/shareSuccess'
	import pageTopCity from '@/components/pageTopCity/pageTopCity'
	import tabBar from '@/components/tabBar/tabBar'
	import toast from '@/units/showToast'
    import userBand from '@/components/userBand/userBand'
	import domain from '@/configs/interface';
	import {checkVersion} from '@/units/check';
	let app = getApp()
	export default {
		components: {
			'pageTopCity': pageTopCity,
			'viewTabBar': tabBar,
			testDrive,
			userBand
			// 'share-pop': shareSuccess
		},
		mixins: [shouquan],
		data() {
			return {
				// MallLink: "", //商城链接
				// isqd: false, //是否签到
				// signInList: [],
				// qdIndex: 0, //第几天签到
				// credits: 0, //众享币数
				// isUserInfoPage:app.globalData.isUserInfoPage,
				title: "我的",
				isUserInfoPage: true,
				// user: false,
				// userId: null,
				isshowUpload: false,
				fail: false,
				photo: null,
				imageData: [],
				score:'',
				name:'',
				wxHead:''
			}
		},

		async onShow() {
			
			this.$gdp('YCZ_myPageView')
			
			
             this.getData()
			// this.qiandao()
			// await api.getPocketUserInfo()
			// let user = await api.getUser()
			// console.log(user)
			// this.user = user.data

			// api.getCredits().then(res => {
			// 	this.credits = res.data || 0

			// })
			/*
			api.getMallLink().then(res=>{
				this.MallLink = res.data
				console.log('MallLink',res)
			})
			*/
		},
		async onLoad(options) {
			// await login.login()
			// console.log(app.globalData)
			// if (app.globalData && app.globalData.pocketUserInfo && app.globalData.pocketUserInfo.userId) {
			// 	this.userId = app.globalData.pocketUserInfo.userId;
			// }

			// let data = await api.getsignIn()
			// let list = data.data
			// let isqd = true
			// let index = 0
			// for (let i in list) {
			// 	let obj = list[i]
			// 	if (obj.status == 0) {
			// 		isqd = false
			// 	}
			// 	if (obj.status == 0 || obj.status == 1) {
			// 		index = i
			// 	}
			// }
			// this.isqd = isqd
			// this.qdIndex = index
			// this.signInList = data.data
			// this.signInList
			await login.checkLogin(api)
			await login.checkOauthMobile(api)

			// console.log('getsignIn', data)

		},
		methods: {
			
			contactKefu(){
				
				let res =  checkVersion('2.19.0')
				if(res >= 0){
					wx.openCustomerServiceChat({
					  extInfo: {url: 'https://work.weixin.qq.com/kfid/kfc205ab4705fdf1977?enc_scene=ENC7b8LYeCE9dP3mAYRTDtKWDkmjD7N2jPJVpCPAfe4yP9Y3UiDetwkvKG7sUi4yRh47q'},
					  corpId: 'wx2b418a3d21bf8228',
					  success(res) {}
					})
				}else{
				 	uni.showToast({
				 		title:'当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试',
						icon:'none'
				 	})
				}
				
				this.$gdp( 'YCZ_contactCustomerServiceClick')
				
			},
			
			 handleContact (e) {
			        console.log(e.detail.path)
			        console.log(e.detail.query)
					
					this.$gdp( 'YCZ_contactCustomerServicePageView')
					
					
			    },
			

			async getData(){
				let phone = uni.getStorageSync('userPhone')
				if (phone) {
					// this.photo = phone
					this.photo = phone.substr(0, 3) + '****' + phone.substr(7, phone.length)
				}
				let sgList = await api.getBannerByPosition({
					'positionType': '1'
				})
				if (sgList) {
					let data = sgList.data
					console.log(data);
					if (data) {
						this.imageData = data[0]
					}
				}
				let scoreData = await api.getScore()
				console.log('scoreData=' , scoreData)
				if(scoreData&&scoreData.data){
				 this.score = scoreData.data.score	
				}
				 if(app.globalData.haveUserInfoAuth){
					this.name=app.globalData.wxUserInfo.wxName ,
					this.wxHead=app.globalData.wxUserInfo.wxHead 
				 }
			},
			callback(){
			if(app.globalData.haveUserInfoAuth){
				this.name=app.globalData.wxUserInfo.wxName,
				this.wxHead=app.globalData.wxUserInfo.wxHead 
				console.log(this.name,this.wxHead)
			}
			},
			tocard() {
				// #ifdef MP-WEIXIN
				wx.aldstat.sendEvent('我的优惠券点击')
				// #endif
				uni.navigateTo({
					url: '/pages/myCoupon'
				})
			},
			toMyOrder(){
				
				this.$gdp('YCZ_MyOrderClick')
				
				
			 // 我的订单
			uni.navigateTo({
				url: '/pages/myOrder'
			})	
			},
			toMyicon(){
				
				this.$gdp('YCZ_integralShopClick')
				
				
				// #ifdef MP-WEIXIN
				wx.aldstat.sendEvent('我的金币点击')
				// #endif
				let token  =  uni.getStorageSync('session-3rd')
				if(token){
					let url = encodeURIComponent(domain.getAPI('mystore') + '?token=' + token)
					if(domain.getCurrentEnv() ==0){
						url = encodeURIComponent(domain.getAPI('mystore') + '&token=' + token)
					}
					console.log('url',url)
					uni.navigateTo({
						url: `/pages/webview?webURL=${url}` 
					})
				}else{
					this.$toast('请先登录')
				}
			},
			toactivity() {
				
				this.$gdp( 'YCZ_myActivityClick')
				
				
				
				// #ifdef MP-WEIXIN
			    wx.aldstat.sendEvent('我的活动点击')
				// #endif
		    	uni.navigateTo({
					url: '/pages/myActivity'
				})
			},
			toMylotteryRecord() {
				
				this.$gdp('YCZ_myWinningRecordClick')
				
				
				uni.navigateTo({
					url: '/pages/lotteryRecord'
				})
			},
			tomyvideo() {
				
				this.$gdp('YCZ_newMediaMarketingQueryClick')
				
				
				// #ifdef MP-WEIXIN
				wx.aldstat.sendEvent('新媒体运营查询点击')
				// #endif
				uni.navigateTo({
					url: '/pages/myvideo'
				})
			},
			tomSuggestion(){
				// #ifdef MP-WEIXIN
				wx.aldstat.sendEvent('意见反馈点击')
				// #endif
				uni.navigateTo({
					url: '/pages/Suggestion'
				})
			},
			goImageDetail() {
				// #ifdef MP-WEIXIN
				wx.aldstat.sendEvent('我的页面广告图')
				// #endif
				if (this.imageData) {
					if (this.imageData.type == 1) {
						// H5
						api.fetchActivityVisit({
							'activityId': this.imageData.originalId
						})
						let url = this.imageData.url
						uni.navigateTo({
							url: `/pages/webview?webURL=${url}`
						})
					} else {
						let id = this.imageData.originalId
						uni.navigateTo({
							url: `/pages/activity?id=${id}`
						})
					}
				}
			}
		}
	}
</script>

<style lang="less">
	@import '@/static/less/mypage.less';

	.top-wrap {
		background: linear-gradient(-20deg, #f6f7f8 0%, #e1eaf4 100%);
	}

	.top {
		position: relative;
		padding: 45rpx 61rpx 66rpx;
		overflow: hidden;

		// display: flex;
		// justify-content: space-between;
		// align-items: center;
		.name {
			.ellipsis;
			width: 350rpx;
			font-weight: bold;
			font-size: 48rpx;
		}

		.isOfficial,
		.level {
			display: inline-block;
			vertical-align: middle;
			margin-right: 15rpx;
		}

		.isOfficial {
			margin-right: 0;
		}
	}

	.head {
		float: right;

		image {
			.arc(120rpx);
		}
	}

	.getUserInfo-name_info {
		width: 200rpx;
		.seth(72rpx, 28rpx, #fff);
		.fb;
		background: #fa843f;
		// position: absolute;
		// right: 32rpx;
		// top: 50%;
		// transform: translate(0, -50%);

		&:after {
			display: none;
		}

		border-radius: 32rpx;
	}

	.right-content {
		.seth(56rpx, 24rpx, #fff);

		&::before {
			display: block;
			content: "";
			.setbg(32rpx, 32rpx, '20190909_0.png');
			.pa(18rpx, 50%);
			transform: translate(0, -50%);
		}

		background: #fd6043;
		background-image: linear-gradient(to right, #fd714a, #fe4035);
		position: absolute;
		top: 50%;
		right:0;
		transform: translate(0, -50%);
		padding: 0 20rpx 0 60rpx;
		border-top-left-radius: 56rpx;
		border-bottom-left-radius: 56rpx;
	}

	.qd-title {
		.seth(104rpx, 32rpx, #333);
		position: relative;
		padding: 0 0 18rpx 32rpx;
		.fb;

		.qd-btn {
			width: 138rpx;
			.seth(56rpx, 24rpx, #fff);
			border-radius: 56rpx;
			background: #ce1330;
			.tc;
			position: absolute;
			top: 50%;
			right: 30rpx;
			transform: translate(0, -50%);

			&.disabled {
				background: #ccc;
			}
		}
	}

	.qd-icons {
		font-size: 0;
		height: 56rpx;
		position: relative;

		&::before {
			display: block;
			content: "";
			width: 612rpx;
			height: 4rpx;
			background: #ebebeb;
			.pa(72rpx, 50%);
			transform: translate(0, -50%);
		}

		.item {
			overflow: hidden;
			position: relative;
			.db();
			.tc;
			.arc(56rpx);
			background: #ebebeb;
			margin-left: 44rpx;
			.seth(56rpx, 20rpx, #aaa);

			&.current {
				font-size: 0;
				.setbg(56rpx, 56rpx, '20190909_1.png');
			}
		}
	}

	.qd-texts {
		padding-bottom: 35rpx;

		.item {
			white-space: nowrap;
			margin-left: 44rpx;
			width: 56rpx;
			.db();
			.tc;
			.seth(64rpx, 20rpx, #333);
		}
	}

	.list5 {
		&::before {
			display: block;
			content: "";
			width: 40rpx;
			height: 40rpx;
			background: url(../static/images/my_4.png) no-repeat center;
			background-size: 100%;
			.pa(40rpx, 33rpx);
		}
	}

	.isOfficial {
		width: 100rpx;
		height: 28rpx;
		color: #fff;
		background: #f98100;
		font-size: 20rpx;
		text-align: center;
		line-height: 28rpx;
		border-radius: 14rpx;
	}

	.banner_bot {
		width: 684rpx;
		height: 186rpx;
		margin: 0 auto;
		background-color: #3F536E;
		border-radius: 20rpx;

		image {
			width: 684rpx;
			height: 186rpx;
			// .arc(684rpx,186rpx);
		}
	}

	.imagev {
		margin: 0 32rpx 30rpx;
		width: 686rpx;
		height: 200rpx;
		border-radius: 10rpx;
		// margin-bottom: 38rpx;
	}
</style>
