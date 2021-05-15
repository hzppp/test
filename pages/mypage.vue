<template>
	<view>

		<!-- <page-top :background.sync="'#f6f7f8'" :titleys.sync="'#000'" :btnys.sync="''" :title.sync="'综合服务区'"></page-top> -->
		<page-top ref="pagetop" :background="'#e2ebf4'" :titleys="'#000'" :btnys="''" :title.sync="title"></page-top>

		<button v-if="!haveUserInfoAuth" class="getUserInfo_name_info_mask_body" lang="zh_CN" @tap="getWxUserInfoAuth"></button>
		<view  class="top-wrap">
			<view class="top" style="display: block;">
				<block v-if="haveUserInfoAuth">
					<view class="info">
						<view class="name_info">
							<view class="name">
								<open-data type="userNickName"></open-data>
							</view>
						</view>
					</view>

					<view class="head">
						<open-data type="userAvatarUrl"></open-data>
					</view>

				</block>
				<block v-else>
					<button class="getUserInfo-name_info" lang="zh_CN">登录</button>
					<view class="p9" style="font-size: 28rpx;margin-top:25rpx;">登录开启长安云车展精彩之旅</view>
				</block>
			</view>
			<view class="box">
				<view class="box-list list2" @tap="tocard">
					<view class="p1">我的优惠券</view>
					<view class="right isApprove"></view>
				</view>
				<view class="line"></view>
				<view class="box-list list4" @tap="toactivity">
					<view class="p1">我的活动</view>
					<view class="right isApprove"></view>
				</view>
				<!-- <view class="box-list list4">
					<navigator version="trial" class="activity-btn" target='miniProgram' app-id='wx1c5c0ec0757002c2'
						path='pages/index' hover-class="" redirect></navigator>
					<view class="p1">车贷计算器</view>
					<view class="right isApprove"></view>

				</view> -->
			</view>
		</view>
		<view class="banner_bot">
<!--			<image src=""></image>-->
		</view>

		<viewTabBar :current="4"></viewTabBar>

	</view>
</template>

<script>
	import login from '@/units/login'
	import shouquan from '@/units/shouquan'
	import api from '@/public/api/index'

	// import chooseImg from '@/units/chooseImg'
	// import getUserInfo from '@/units/getUserInfo'
	// import shareSuccess from '@/components/shareSuccess/shareSuccess'
	import pageTop from '@/components/pageTop/pageTop'
	import tabBar from '@/components/tabBar/tabBar'
	let app = getApp()
	export default {
		components: {
			'page-top': pageTop,
			'viewTabBar':tabBar
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
				title: "综合服务区",
				isUserInfoPage: true,
				// user: false,
				// userId: null,
				isshowUpload: false,
				fail: false
			}
		},

		async onShow() {
			
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
			await login.login()
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

			// console.log('getsignIn', data)
		},
		methods: {
			tocard() {
				uni.navigateTo({
					url: '/pages/myCoupon'
				})
			},
			toactivity(){
				uni.navigateTo({
					url: '/pages/myActivity'
				})
			}
		}
	}
</script>

<style lang="less">
	@import '@/static/less/mypage.less';
	.top-wrap{
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
		float:right;
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
	.banner_bot{
		width: 684rpx;
		height: 186rpx;
		margin:0 auto;
		background-color: #3F536E;
		border-radius: 20rpx;
		image{
			width: 684rpx;
			height: 186rpx;
			// .arc(684rpx,186rpx);
		}
	}
</style>
