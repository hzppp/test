<template>
	<view>
		<userBand :cancleShow='sourceUserId' @loginSuccess='getData'></userBand>
		<view class="activity" v-if="soureDone">
			<button v-if="!haveUserInfoAuth" class="getUserInfo_name_info_mask_body" @tap="getWxUserInfoAuth"
				style="top: 128rpx;"></button>
			<!-- <share-pop ref="shareSuccess"></share-pop> -->
			<page-top :background="'#fff'" :titleys="'#000'" :btnys="''" :title="'活动详情' " :noShowHouse="sourceUserId">
			</page-top>
			<form-pop ref="formpop" @subSuccess='subSuccess()'></form-pop>

			<template v-if="activityType=='wawaji'">
				<view class="title">{{content.name}}</view>
				<view class="date" v-if="content && isActStart && !isActEnded">
					离活动结束还剩<view class="db">{{artDownDate[0]}}</view>天<view class="db">{{artDownDate[1]}}</view>时<view
						class="db">{{artDownDate[2]}}</view>分
					<!-- <view class="db">{{artDownDate[3]}}</view>秒 -->
				</view>
				<view class="date" v-if="isActEnded">活动已结束</view>
			</template>

			<view class="content">
				<image class="content-image" :src="content.detailPic" mode="widthFix" lazy-load="false"></image>
			</view>

			<view class="zw"></view>
			<view class="operation-list">
				<view class="type-c" v-if="artDownDate[0] <= 0 && artDownDate[1] <= 0 && artDownDate[2] <= 0 ">
					<button class="over-btn" hover-class="none">活动已结束</button>
				</view>
				<view class="type-a" v-else>
					<template v-if="activityType && activityType=='wawaji'">
						<template v-if="isApply && actSelect == 2 && isActStart ">
							<view class="enroll-btn actSelectOneBtn" @click="actSelect1()">
								<view class="selectTitle1">车展现场活动</view>
								<view class="selectTitle2">线下活动</view>
							</view>
							<view class="enroll-btn actSelectTwoBtn" @click="actSelect2()">
								<view class="selectTitle1">奇趣拆盲盒</view>
								<view class="selectTitle2">线上抽豪礼</view>
							</view>
						</template>
						<template v-else>

							<!--  #ifdef MP-WEIXIN  -->
							<button v-if="content.sharePosterPic"
								:class="'share-btn ' + (content.shareStatus == 0 ? 'share-tip':'')" hover-class="none"
								@tap='shareChoise()'>分享好友</button>

							<button v-else :class="'share-btn ' + (content.shareStatus == 0 ? 'share-tip':'')"
								hover-class="none" open-type="share" @click="shareBtnClick">分享好友</button>
							<!-- #endif -->
							<!--  #ifndef MP-WEIXIN  -->
							<button :class="'share-btn ' + (content.shareStatus == 0 ? 'share-tip':'')"
								hover-class="none" open-type="share" @click="shareBtnClick">分享好友</button>
							<!-- #endif -->
							<template v-if="!isActStart && isApply">
								<button class="enroll-btn enroll-btn2 enroll-btn3" >已报名，活动未开始</button>
							</template>
							<template v-else>
								<button class="enroll-btn enroll-btn2" open-type="getPhoneNumber"
									@getphonenumber="getPhoneNumber" v-if="!phone">报名活动</button>
								<button class="enroll-btn enroll-btn2" @tap="formShow"
									v-else>{{(actSelect == 1 && isApply)?"奇趣拆盲盒":"报名活动"}}</button>
							</template>
						</template>
					</template>
					<button :class="(!isActStart && isApply)?'enroll-btn enroll-btn3': 'enroll-btn'" @tap="formShow" v-else>{{formShowTitle}}</button>
				</view>
			</view>
		</view>

		<uni-popup ref="popup" type="bottom">
			<view class="shareBtnBackV">
				<view class="shareBtnV">
					<view class="shareBtn" @tap="shareHB()">
						<image src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/changansharePY.png">
						</image>
						<view class="text">海报分享</view>
					</view>
					<button class="shareBtn" open-type="share">
						<image src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/changanshareFD.png">
						</image>
						<view class="text1">分享微信好友</view>
					</button>
				</view>
				<view class="line"></view>
				<button @tap='shareCancle()'>取消</button>
			</view>

		</uni-popup>
	</view>
</template>

<script>
	import login from '@/units/login'
	import api from '@/public/api/index'
	import shouquan from '@/units/shouquan'

	import formpop from '@/components/formpop/formpop'
	import pageTop from '@/components/pageTop/pageTop'
	import shareSuccess from '@/components/shareSuccess/shareSuccess'
	import userBand from '@/components/userBand/userBand'
	let app = getApp()
	// const ctx = uni.createCanvasContext('myCanvas')
	export default {
		components: {
			'form-pop': formpop,
			'page-top': pageTop,
			'userBand': userBand
			// 'share-pop': shareSuccess
		},
		data() {
			return {
				phone: false,
				artDownDate: [],
				activityId: '',
				content: "",
				sourceUserId: '',
				soureDone: false,
				actiDone: false,
				activityType: "",
				isActEnded: false,
				isActStart: false,
				shareURL: '',
				isApply: 0, //是否留咨过
				lotteryType: '', //转盘类型
				actSelect: '' ,// 玩法（0   线下   1 线上抽奖  2 both）
				formShowTitle:'我要参与抽奖'
			}
		},
		mixins: [shouquan],
		async onLoad(options) {
			if (options.scene) { // 分享海报来的
				let url = decodeURIComponent(options.scene)
				url = this.changURl(url)
				//id=69&lotteryType=grid&type=wawaji&actSelect=1&sourceUserId=66
				let array = url.split('&')
				array.forEach((item, index) => {
					let arr = item.split('=')
					if (arr) {
						options[arr[0]] = arr[1]
					}
				})

			}
			await login.checkLogin(api)
			this.lotteryType = options.lotteryType
			this.sourceUserId = options.sourceUserId
			this.activityId = options.id
			this.activityType = options.type || ''
			this.actSelect = options.actSelect || ''
			// 分享用
			let cs = ''
			for (let i in options) {
				if (i != 'scene' && i != 'sourceUserId') {
					cs += `${i}=${options[i]}&`
				}

			}
			cs = cs.substr(0, cs.length - 1)
			let wxUserInfo = uni.getStorageSync('wxUserInfo')
			if(this.lotteryType == 'Vouchers'){
				this.formShowTitle = '领取代金券'
				this.shareURL = `/pages/lbActivity?${cs}`
			}else{
			this.shareURL = `/pages/lbActivity?${cs}&sourceUserId=${wxUserInfo.id}`	
			}
			

			console.log('shareurl', this.shareURL)
			if (app.Interval) {
				clearInterval(app.Interval)
				console.log('----------------', this.Interval)
			}
			
			try {
				uni.showLoading({
					title: '正在加载...'
				})
				// await login.login()

				let {
					data = {}
				} = await api.getActivityContent(this.activityId)
				this.downDate(data.endTime)
				this.isActStart = ((new Date().getTime() - new Date(data.startTime.replace(/-/g, "/")).getTime()) > 0)
				this.getFission()
				app.Interval = setInterval(() => {
					this.downDate(data.endTime)
				}, 1000)
				this.phone = uni.getStorageSync('userPhone');
				this.content = data
				if (this.sourceUserId) {
					this.content.sourceUserId = this.sourceUserId
					console.log('sourceUserId' + this.sourceUserId)
					// this.$toast('sourceUserId' + this.sourceUserId  )
				}
				if (this.shareURL) {
					this.content.shareURL = this.shareURL
				}
				this.content.from = 'lbactivity'
				this.content.lotteryType = this.lotteryType
				this.content.actSelect = this.actSelect
				this.content.activityType = this.activityType
				this.content.isActStart = this.isActStart

			} catch (err) {
				console.error(err)
			} finally {
				uni.hideLoading()
			}
			// 访问活动 记录活动访问次数
			api.fetchActivityVisit({
				'activityId': this.activityId
			})

		},
		onHide() {
			if (app.Interval) {
				clearInterval(app.Interval)
			}
		},
		onShareAppMessage() {
			let title = this.content.name
			// let path = `pages/authorization?to=lbActivity&id=${this.content.id}`
			// if (app.globalData.salesId) {
			// 	path += `&salesId=${app.globalData.salesId}`
			// }
			// api.shareActivity(this.content.id).then(res => {
			// 	console.log(res)
			// 	if (res.data > 0) {
			// 		this.content.shareStatus = 1
			// 	}
			// })
			let imageUrl = this.content.sharePic || this.content.detailPic
			console.log('fenxiang ', this.shareURL)
			return {
				title: title,
				path: this.shareURL,
				imageUrl: imageUrl
			}
		},
		methods: {
			async getFission() {
				console.log(1)
				// let {
				// 	data,
				// 	code
				// } = await api.getFission({
				// 	activityId: this.activityId
				// })
				
				let clueInfo = await api.getClueInfo({
					activityId: this.activityId
				})
				if (clueInfo) {
					let isApply = clueInfo.data.isApply
					this.isApply = isApply;
					if(isApply && !this.isActStart){
						this.formShowTitle = "已报名,活动未开始"
					}
					
					
					console.log('isApply' , isApply,this.activityType,this.isActStart)
					//是否提交过
					if (isApply == 1 && this.activityType == "" && this.isActStart) {
						if(this.lotteryType == 'Vouchers'){
							uni.redirectTo({
							 url: '/pages/lotteryPage?activityId=' + this.activityId + '&lotteryType=' + this
									.lotteryType + "&shareURL=" + encodeURIComponent(this.shareURL)
							
							})
						}else{
						uni.reLaunch({
							url: '/pages/lotteryPage?activityId=' + this.activityId + '&lotteryType=' + this
								.lotteryType + "&shareURL=" + encodeURIComponent(this.shareURL)
						
						})	
						}
						
					}
				}
				// if(code == 10){
				// 	// 活动以下架
				// 	console.log('活动已经结束')
				// 	this.actiDone =  true
				// }else{
				// if (data) {
				// 	let isApply = data.isApply
				// 	if (isApply == 1) {
				// 		uni.reLaunch({
				// 			url: '/pages/lotteryPage?activityId=' + this.activityId
				// 		})
				// 	}
				// }	
				// }
				this.soureDone = true

			},
			actSelect1() {
				uni.navigateTo({
					url: `/pages/wawaji?activityId=${this.content.id}`
				})
			},
			actSelect2() {
				uni.reLaunch({
					url: '/pages/lotteryPage?activityId=' + this.activityId + '&lotteryType=' + this
						.lotteryType + "&shareURL=" + encodeURIComponent(this.shareURL)
				})
			},

			formShow() {
				if(!this.isActStart && this.isApply){
					return
				}
				// #ifdef MP-WEIXIN
				wx.aldstat.sendEvent('报名活动')
				// #endif
				console.log("this.isApply", this.isApply)
				if (this.activityType == 'wawaji') {
					if (!this.isApply) {
						// #ifdef MP-WEIXIN
						this.$refs.formpop.formShow('form', 'activity', this.content, '报名活动')
						// #endif
						// #ifdef MP-TOUTIAO
						this.$children[3].formShow('form', 'activity', this.content, '报名活动')
						// #endif

					} else {
						if (this.actSelect == 1) {
							uni.reLaunch({
								url: '/pages/lotteryPage?activityId=' + this.activityId + '&lotteryType=' + this
									.lotteryType + "&shareURL=" + encodeURIComponent(this.shareURL)
							})
						} else if (this.actSelect == 2) {
							uni.navigateTo({
								url: '/pages/ActivitySelect?activityId=' + this.activityId + '&lotteryType=' + this
									.lotteryType + "&shareURL=" + encodeURIComponent(this.shareURL)
							})
						} else {
							uni.navigateTo({
								url: `/pages/wawaji?activityId=${this.content.id}`
							})
						}

					}

				} else {
					var formpopName = 'lbactivity'
					if(this.lotteryType == 'Vouchers'){
						formpopName = 'activity'
					}
					// #ifdef MP-WEIXIN
					this.$refs.formpop.formShow('form', formpopName, this.content, '报名活动')
					// #endif

					// #ifdef MP-TOUTIAO
					this.$children[3].formShow('form', formpopName, this.content, '报名活动')
					// #endif
				}
			},
			// 分享按钮被点击
			shareBtnClick() {
				wx.aldstat.sendEvent('活动分享点击')
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
				this.artDownDate = v
			},
			// +0
			add0(number) {
				return number > 9 ? number : '0' + number
			},
			
			subSuccess(){
				this.getFission()
			},
			getData() {
				// 访问活动 记录活动访问次数
				api.fetchActivityVisit({
					'activityId': this.activityId
				})
			
				
			},
			shareChoise() {
				this.$refs.popup.open('bottom')
			},

			shareCancle() {
				this.$refs.popup.close()
			},
			shareHB() {

				let url = '/pages/sharePost?scene1=' + encodeURIComponent(this.shareURL) + '&shareUrl=' +
					encodeURIComponent(this.content.sharePosterPic)
				uni.navigateTo({
					url: url
				})



				this.$refs.popup.close()
			},

			changURl(url) {
				console.log(url)
				//D=69&L=G&P=W&A=1&O=66
				if (url.indexOf('D') != -1) { // 新
					url = url.replace('P', 'type')
					url = url.replace('L', 'lotteryType')
					url = url.replace('D', 'id')
					url = url.replace('G', 'grid')
					url = url.replace('W', 'wawaji')
					url = url.replace('A', 'actSelect')
					url = url.replace('O', 'sourceUserId')
					url = url.replace('V', 'Vouchers')
				} else { // 旧
					//dd=69&ll=gg&tt=ww&aa=1&ss=66
					url = url.replace('tt', 'type')
					url = url.replace('ll', 'lotteryType')
					url = url.replace('dd', 'id')
					url = url.replace('gg', 'grid')
					url = url.replace('ww', 'wawaji')
					url = url.replace('aa', 'actSelect')
					url = url.replace('ss', 'sourceUserId')
				}
				return url


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
				width: 686rpx;
				height: 88rpx;
				color: #ffffff;
				font-size: 32rpx;
				background-color: #fa8845;
				border-radius: 44rpx;
				
				&.enroll-btn2 {
					width: 420rpx;
						
				}
				
				
			}
			.enroll-btn3 {
				background-color: #DEDEDE;
					
			}
			

			.actSelectOneBtn {
				text-align: center;
				display: inline;
				width: 330rpx;
				height: 88rpx;
				background: #0B457F;
				border-radius: 44rpx;

				.selectTitle1 {

					margin-top: 13rpx;
					/*  #ifndef  MP-WEIXIN */
					margin-top: 5rpx;
					/*  #endif  */
					font-size: 32rpx;
					font-weight: 800;

					color: #ffffff;
				}

				.selectTitle2 {
					font-size: 22rpx;
					font-weight: 500;

					color: #AEBDCD;
				}
			}

			.actSelectTwoBtn {

				text-align: center;
				display: inline;
				width: 330rpx;
				height: 88rpx;
				background: #FA8845;
				border-radius: 44rpx;

				.selectTitle1 {
					margin-top: 13rpx;
					/*  #ifndef  MP-WEIXIN */
					margin-top: 5rpx;
					/*  #endif  */
					font-size: 32rpx;
					font-weight: 800;

					color: #ffffff;
				}

				.selectTitle2 {
					font-size: 22rpx;
					font-weight: 500;

					color: #FFEFDD;
				}
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

	.shareBtnBackV {
		border-top-left-radius: 10rpx;
		border-top-right-radius: 10rpx;
		width: 100%;
		height: 331rpx;
		background: #ffffff;

		.shareBtnV {
			width: 90%;
			margin: auto;
			display: flex;

			.shareBtn {
				text-align: center;
				width: 50%;
				height: 230rpx;
				margin: auto;

			}

			image {
				width: 88rpx;
				height: 88rpx;
				margin-top: 50rpx;

			}

			.text {
				width: 100%;
				height: 23rpx;
				text-align: center;
				margin-top: 20rpx;
				font-size: 24rpx;
				color: #666666;

			}

			.text1 {
				width: 100%;
				height: 23rpx;
				text-align: center;
				margin-top: -20rpx;
				font-size: 24rpx;
				color: #666666;
			}


		}

		.line {
			background: #EBEBEB;
			height: 1rpx;
			width: 100%;
			// margin-top: ;
		}

		button {
			width: 100%;
			color: #333333;
			background: #FFFFFF;
			font-size: 33rpx;
			margin: auto;
			margin-top: 10rpx;
		}

	}
</style>
