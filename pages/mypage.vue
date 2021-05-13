<template>
	<view>
		<button v-if="isUserInfoPage" class="getUserInfo_name_info_mask_body" lang="zh_CN" @getuserinfo="getWxUserInfoButton"
		 open-type="getUserInfo"></button>
		<share-pop ref="sharepop"></share-pop>
		<view class="top">
			<block v-if="!isUserInfoPage">
				<view class="head" @tap="toMyFollowPage">
					<open-data type="userAvatarUrl"></open-data>
				</view>
				<view class="info">
					<view class="name_info">
						<view class="name" @tap="toMyFollowPage">
							<open-data type="userNickName"></open-data>
						</view>
						<view class="level" v-if="user.isApprove == 1"></view>
						<view class="isOfficial" v-if="user.official">官方认证</view>
						<!--  -->
					</view>
				</view>
			</block>
			<block v-else>
				<view class="head">
					<!-- <open-data type="userAvatarUrl"></open-data> -->
					<image src="http://www1.pcauto.com.cn/zt/gz20160608kdcs/mcjs/my_20190905_mr_head.png" mode="scaleToFill" lazy-load="true"></image>
				</view>
				<view class="info">
					<view class="name_info">
						<view class="name">未登录</view>
						<view class="p9" style="font-size: 24rpx;color: #999;">登录后享受更多服务</view>
					</view>
				</view>
				<button class="getUserInfo-name_info" lang="zh_CN" @getuserinfo="getWxUserInfoButton" open-type="getUserInfo">登录</button>
			</block>
<!--			<view v-if="!isUserInfoPage" class="right-content" @tap="totaskListPage">{{credits}}个众享币</view>-->
		</view>
		<view class="box" v-if="false && signInList.length > 0 && !isUserInfoPage">
			<view class="qd-title">
				连续签到赚众享币
				<view :class="'qd-btn ' + (isqd ? 'disabled':'')" @tap="qiandao">{{isqd ? '已签到':'签到'}}</view>
			</view>
			<view class="qd-icons">
				<block v-for="(item,index) in signInList" :key="index">
					<view :class="'item ' + (item.status == 1 ? 'current':'')">+{{item.credits}}</view>
				</block>
			</view>
			<view class="qd-texts">
				<block v-for="(item,index) in [1,2,3,4,5,6,7]" :key="index">
					<view class="item">
						{{qdIndex == index ? '今天':'第'+(index+1)+'天'}}
					</view>
				</block>
			</view>
		</view>
		<view class="box">
			<view class="box-list list2" @tap="tocard">
				<view class="p1">我的优惠券</view>
				<view class="right isApprove" v-if="user.unUsedNum" style="color:#999999">{{user.unUsedNum}}张未使用</view>
			</view>
			<view class="line"></view>
			<view class="box-list list3" @tap="toMessage">
				<view class="p1">消息中心</view>
				<view class="right isApprove" v-if="user.unReadNum">有{{user.unReadNum}}条未读消息</view>
			</view>
			<!-- <view class="box-list list6" @tap="getPrizeRecord">
				<view class="p1">我的奖品</view>
			</view> -->
			<view class="line"></view>
			<view class="box-list list4">
				<navigator version="trial" class="activity-btn" target='miniProgram' app-id='wx1c5c0ec0757002c2' path='pages/index'
				 hover-class="" redirect></navigator>
				<view class="p1">车贷计算器</view>
				<view class="right isApprove"></view>

			</view>
		</view>
		<view class="firstUnload" v-if="isshowUpload">
			<view class="uploadbtn" @tap="chooseImg">
			</view>
		</view>
		<view class="close" @tap="close" v-if="isshowUpload || fail"></view>
		<view class="bg" v-if="isshowUpload || fail">

		</view>
		<view class="fail" v-if="fail">
			<view class="uploadbtn" @tap="chooseImg">
			</view>
		</view>
	</view>
</template>

<script>
	import login from '@/units/login'
	import api from '@/public/api/index'
	import shouquan from '@/units/shouquan'

	import chooseImg from '@/units/chooseImg'
	import getUserInfo from '@/units/getUserInfo'
	import shareSuccess from '@/components/shareSuccess/shareSuccess'
	let app = getApp()
	export default {
		components: {
			'share-pop': shareSuccess
		},
		mixins: [shouquan],
		data() {
			return {
				MallLink: "", //商城链接
				isqd: false, //是否签到
				signInList: [],
				qdIndex: 0, //第几天签到
				credits: 0, //众享币数
				isUserInfoPage:false,
				user: false,
				userId: null,
				isshowUpload: false,
				fail: false
			}
		},

		async onShow() {
			await login.login()
			this.qiandao()
			await api.getPocketUserInfo()
			let user = await api.getUser()
			console.log(user)
			this.user = user.data

			api.getCredits().then(res => {
				this.credits = res.data || 0

			})
			/*
			api.getMallLink().then(res=>{
				this.MallLink = res.data
				console.log('MallLink',res)
			})
			*/
		},
		async onLoad(options) {
			console.log(app.globalData)
			if (app.globalData && app.globalData.pocketUserInfo && app.globalData.pocketUserInfo.userId) {
				this.userId = app.globalData.pocketUserInfo.userId;
			}

			let data = await api.getsignIn()
			let list = data.data
			let isqd = true
			let index = 0
			for (let i in list) {
				let obj = list[i]
				if (obj.status == 0) {
					isqd = false
				}
				if (obj.status == 0 || obj.status == 1) {
					index = i
				}
			}
			this.isqd = isqd
			this.qdIndex = index
			this.signInList = data.data
			this.signInList

			console.log('getsignIn', data)
		},
		methods: {
			failFun(...args) {
				this.fail = true
				this.isshowUpload = false
			},
			async qiandao() {
				if (!this.isqd) {
					let {
						code
					} = await api.submitSignIn()
					if (code == 1) {
						let addNumber = this.signInList[this.qdIndex].credits * 1
						this.signInList[this.qdIndex].status = 1
						this.isqd = true
						this.credits = this.credits + addNumber
						// this.$invoke('share-pop', 'shareSuccessShow', addNumber, '连续打卡可获得更多金币哦')
						this.$refs.sharepop.shareSuccessShow(addNumber, '连续打卡可获得更多金币哦')
					} else {
						console.log(code)
					}
				}
			},
			// 跳转个人个人主页
			toMyFollowPage() {
				let url = `/pages/personalHome?userid=${this.userId}`
				uni.navigateTo({
					url
				})
			},
			towebView() {
				api.getMallLink().then(res => {
					// this.MallLink = res.data
					let vurl = escape(res.data)
					let url = `/pages/webview?webURL=${vurl}`
					uni.navigateTo({
						url
					})
					console.log('MallLink', res)
				})
			},
			// 跳转商城页
			toMall(){
				uni.navigateTo({
					url:'/pages/mall/index'
				})
			},
			// 跳转兑换记录
			getPrizeRecord() {

				uni.navigateTo({
					url:'/pages/mall/recordList'
				})
				// api.getPrizeRecord().then(res => {
				// 	// this.MallLink = res.data
				// 	let vurl = escape(res.data)
				// 	let url = `/pages/webview?webURL=${vurl}`
				// 	uni.navigateTo({
				// 		url
				// 	})
				// 	console.log('MallLink', res)
				// })
			},
			towebView2() {

			},
			async qiandao() {
				if (!this.isqd) {
					let {
						code
					} = await api.submitSignIn()
					if (code == 1) {
						let addNumber = this.signInList[this.qdIndex].credits * 1
						this.signInList[this.qdIndex].status = 1
						this.isqd = true
						this.credits = this.credits + addNumber
						// this.$invoke('share-pop', 'shareSuccessShow', addNumber, '连续打卡可获得更多金币哦')
						this.$refs.sharepop.shareSuccessShow(addNumber, '连续打卡可获得更多金币哦')

					} else {
						console.log(code)
					}
				}
			},
			totaskListPage() {
				uni.navigateTo({
					url: '/pages/taskList'
				})
			},
			close() {
				uni.navigateTo({
					url: '/pages/message'
				})
				this.isshowUpload = false
				this.fail = false
			},
			async chooseImg() {
				let sdd = await chooseImg.chooseImage()
				let data = await chooseImg.uploadLicence(sdd.files[0].url)
				if (data.code == 1) {
					uni.hideLoading()
					uni.navigateTo({
						url: `/pages/confirm/confirm?carNum=${data.data.carNum}&model=${data.data.model}&name=${data.data.name}&vin=${data.data.vin}&picUrl=${sdd.files[0].url}`
					})
				} else {
					uni.hideLoading()
					this.failFun()
				}
			},
			submitCheck() {
				let t = this,
					isok = true,
					tips = ""
				if (!t.xingName) {
					isok = false;
					tips = '请填写您的姓名';
				} else if (!t.phone) {
					isok = false;
					tips = '请填写您的手机号码';
				} else if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(t.phone)) {
					isok = false;
					tips = '请填写正确的手机号码';
				} else if (!t.city) {
					isok = false;
					tips = '请选择省份城市';
				}
				// tips && showToast(tips)
				if (tips) {
					uni.showToast({
						title: tips,
						icon: 'succes',
						duration: 1000,
						mask: true
					})
				}

				return isok
			},
			jumpConfirm() {
				let is = uni.getStorageSync('isShowUploadPop')
				console.log(is)
				//认证状态：0未认证，1-审核通过，2-未审核，3-未通过
				let isApprove = this.user.isApprove
				if (isApprove == 1 || isApprove == 2 || isApprove == 3 || is) {
					uni.navigateTo({
						url: '/pages/message'
					})
				} else {
					this.isshowUpload = true
					uni.setStorageSync('isShowUploadPop', true)
				}
			},
			tocard() {
				uni.navigateTo({
					url: '/pages/my'
				})
			},
			toMessage() {
				uni.navigateTo({
					url: '/pages/myMessage'
				})
			}
		}
	}
</script>

<style lang="less">
	@import '@/static/less/mypage.less';

	.top {
		position: relative;

		.name {
			.ellipsis;
			width: 350rpx;
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
		image {
			.arc(120rpx);
		}
	}

	.getUserInfo-name_info {
		width: 180rpx;
		.seth(72rpx, 28rpx, #fff);
		.fb;
		background: #ce1330;
		position: absolute;
		right: 32rpx;
		top: 50%;
		transform: translate(0, -50%);

		&:after {
			display: none;
		}

		;
		border-radius: 72rpx;
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
		background-image: linear-gradient(to right, #fd714a ,  #fe4035);
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
			background:url(../static/images/my_4.png) no-repeat center;
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
</style>
