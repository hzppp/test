<template>
	<view class="bg">
		<view class="container" v-if="detailInfo && detailInfo.id">
			<view class="headerT">
				<view class="lId">订单ID：{{detailInfo.outTradeNo}}</view>
				<view class="lIdorderState" v-if="state==0">{{orderText}}</view>
				<view :class="'lIdcode' + state">{{ state | formatState }}</view>
			</view>
			<view class="headerInfo">
				<view class="lDetail">
					<view class="prizeName">{{detailInfo.productName}}</view>
					<view class="services-btn">{{"¥ " + detailInfo.totalFee}}</view>
					<view class="prizeCode">
						<view
							v-if="detailInfo.verifyCode && detailInfo.verifyCode.length && state !=5 && state !=6 && state !=1">
							核销码：
						</view>
						<view
							:class="(detailInfo.verifyCode && detailInfo.verifyCode.length&& state !=5 && state !=6 && state !=1)?'code':'nocode' ">
							{{ (detailInfo.verifyCode && detailInfo.verifyCode.length && state !=5 && state !=6 && state !=1)? detailInfo.verifyCode:(state==0? "核销码完成支付后生成":(state==5?"核销码已失效":(state==6?"订单已失效":"核销码生成中")))}}
						</view>
					</view>
					<image v-if="picShow" mode="widthFix" style="margin: auto;width: 606rpx;" :src="detailInfo.picUrl">
					</image>
				</view>
			    <!-- <image mode="widthFix" src="../static/images/orderDetailMiddle.png" style="width: 100%;"></image> -->
				 <view class="bodyT">
					<view class="info">
						<view class="title titleK">
							报名信息：
						</view>
						<view class="item">
							<view class="babelT">姓名：</view>
							{{ detailInfo.userName }}
						</view>
						<view class="item">
							<view class="babelT">电话：</view>
							{{ detailInfo.mobile }}
						</view>
						<view class="item">
							<view class="babelT">购买时间：</view>{{detailInfo.createTime }}
						</view>
						<view class="item">
							<view class="babelT">使用期限：</view>{{detailInfo.endTime | formatTimeMins}}
						</view>
						<view class="item" v-if="detailInfo.transactionId">
							<view class="babelT">支付单号：</view>{{detailInfo.transactionId}}
						</view>
						<view class="item">
							<view class="babelT">经销商：</view>
							{{ detailInfo.dealerName }}
						</view>
						<view class="item" @tap='goDealer()'>
							<view class="babelT" style="width: 100rpx;">地址：</view>
							{{ detailInfo.address }}
						</view>
						<view class="item" @tap='goDealer()'>
							<image v-if="detailInfo.distance != undefined && detailInfo.distance != Infinity"
								class="hotNDelFicon"
								src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/dealLocation1.png"
								style="width: 24rpx;height: 24rpx;">
							</image>
							<view v-if="detailInfo.distance != undefined && detailInfo.distance != Infinity"
								style="color: #FA8845;white-space:nowrap;">{{detailInfo.distance | formatThousand}}
							</view>
						</view>

					</view>
					<view class="info" style="margin-top: 40rpx;">
						<view class="title titleK">使用说明:</view>
						<view class="contentTips">
							<text>{{detailInfo.meme}}</text>

						</view>

					</view>
				</view>
			</view>
			<view class="boomV" v-if="state===0">
				<view class="share-btn" @tap='goActivity()'>活动详情</view>
				<view class="buyBtn" @tap='pay()'>去支付</view>
			</view>
			<!-- <view class="boomV" v-if="state==3">
				<view class="share-btn" @tap='goActivity()'>活动详情</view>
				<view class="buyBtn" @tap='disBackPay()'>取消退款</view>
			</view> -->
			<view class="boomV" v-if="state==2">
				<view class="share-btn" @tap='goActivity()'>活动详情</view>
				<view class="buyBtn" @tap='backPay()'>退款</view>
			</view>
			<view class="boomV" v-if="state==6 || state==5 || state==4 || state==1 || state==3" @tap='goActivity()'>
				<view class="activityDeatil">活动详情</view>
			</view>
		</view>
		<uni-popup ref="popup" type="center" :mask-click="false">
			<view class="popV" v-if="showType=='showtexteare'">
				<view class="setitle">退款成功后会取消相应的权益，请登记一下您的退款原因</view>
				<view class="textareaback">
					<textarea placeholder="请填写退款原因" maxlength="80" v-model="backReason" confirm-type='done'
						 />
				</view>
				<view class="cancle" @tap='popCancle()'>取消</view>
				<view class="soure" @tap='backSoure()'>确定退款</view>
			</view>

			<view class="popV success" v-if="showType=='success'">
				<image src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/backOrderSuccess.png"></image>
				<view class="title1">提交成功</view>
				<view class="title2">提交成功支付费用将会在3个工作日原路退回，请注意查收</view>
				<view class="soure" @tap='popCancle()' style="width: 360rpx;">好的</view>
			</view>

			<view class="popV error1" v-if="showType=='error'">
				<image src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/backOrderFail.png" ></image>
				<view class="title1">对不起,核销码生成失败</view>
				<view class="title2 error">
					<text>您已支付的金额将会在3个工作日内系统将会原路返回，请注意查收

						如有其它疑问，可电话咨询 400-2548-265</text>
				</view>
				<view class="soure" @tap='goActivity()' style="width: 360rpx;">好的</view>
			</view>
			<view class="popV backerror" v-if="showType=='backerror'" >
				<view class="title1">由于核销码生成不可作废，因此需商品过期后才可以申请退款</view>
				<view class="title2 error">
					<text>{{detailInfo.endTime | formatTime }}~</text>
				</view>
				<view class="soure" @tap='popCancle()' style="width: 360rpx;">好的</view>
			</view>

		</uni-popup>
	</view>
</template>

<script>
	import api from '@/public/api/index'
	import login from '@/units/login'
	import domain from '@/configs/interface';
	import distance from '@/units/distance'
	import pay from '@/units/pay'
	let app = getApp()
	export default {
		name: "lotteryDetail",
		data() {
			return {
				detailInfo: {},
				id: '', // 订单id
				state: '', // 订单状态有7种   //0待支付 1已支付 2待使用 3退款审核中 4已核销 5已退款 6已失效
				orderTime: '600', // 支付订单倒计时
				orderText: '',
				timer: '',
				timer1: '',
				backReason: '',
				showType: '', //showtexteare 输入   success  成功  error  失败
				payState: '', // 1支付成功（实时刷新结果）   0 支付失败
				picShow: false

			}
		},
		filters: {
			formatTime(time) {
				var date = new Date(parseInt(time));;
				var YY = date.getFullYear() + '-';
				var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
				var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
				var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
				var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
				// var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
				return YY + MM + DD + " " + hh + mm + '后再来申请退款吧'

			},
			formatState(state) {
				// console.log('parseInt(state)', parseInt(state))
				switch (parseInt(state)) {
					case 6: {
						return '已失效'
						break;
					}
					case 0: {
						return '待支付'
						break;
					}
					case 1: {
						return '已支付'
						break;
					}

					case 2: {
						return '待使用'
						break;
					}

					case 3: {
						return '退款中'
						break;
					}

					case 4: {
						return '已核销'
						break;
					}

					case 5: {
						return '已退款'
						break;
					}
					default: {
						return '已失效'
						break;
					}

				}


			},
			formatTimeMins(time) {

				let t = new Date(parseInt(time));

				let month = t.getMonth() + 1;
				let date = t.getDate();
				let hour = t.getHours();
				let min = t.getMinutes();
				let sec = t.getSeconds();
				console.log('time', t.getFullYear())
				if (month < 10) {
					month = '0' + month;
				}
				if (date < 10) {
					date = '0' + date;
				}
				if (hour < 10) {
					hour = '0' + hour;
				}
				if (min < 10) {
					min = '0' + min;
				}
				if (sec < 10) {
					sec = '0' + sec;
				}

				return t.getFullYear() + '.' + month + '.' + date + ' ' + hour + ':' + min + ':' + sec;


			},
			formatThousand(num) {
				if (num != undefined && num != Infinity) {
					if (num > 1000) {
						return (num / 1000).toFixed(2) + 'km'
					} else {
						return num + 'm'
					}
				} else {
					return '无法获取距离'
				}

			},
		},
		async onLoad(options) {
			const {
				id = 0
			} = options
			console.log('id', id)
			this.id = id
			this.payState = options.pay
			if (id) {
				this.getDeatil(id)
			}
		},

		onUnload() {
			console.log('onUnload')
			this.timer1 && clearInterval(this.timer1)
			this.timer && clearInterval(this.timer)
		},
		methods: {
			async getDeatil() {
                await this.getOrderDetail()
				uni.showLoading({
					title: '正在加载...'
				})

				// this.refStatus()
				if (this.payState == 1 && (this.state == 0 || this.state == 1)) {
					// 刚刚支持成功   要及时获取核销码生成状态  不停刷新状态
					this.timer1 && clearInterval(this.timer1)
					this.timer1 = setInterval(() => {
						this.getDeatil()
					}, 2000)
				}else{
					this.timer1 && clearInterval(this.timer1)
				}

			},
			
		 async getOrderDetail(){
			this.detailInfo = await api.orderDetail({
				"id": this.id
			}).then(res => {
				console.log('rrrres', res)
				setTimeout(() => {
					uni.hideLoading()
				}, 300)
				if (res.code == 1) {
					return res.data || {}
				} else {
					uni.showToast({
						title: res.msg,
						icon: "none"
					})
				}
			})	
			if (this.detailInfo.picUrl && this.detailInfo.picUrl.indexOf("http") != -1) {
				this.picShow = true
			}
			this.orderTime = this.detailInfo.ttl
			let crtPosition = app.globalData.currentLocation.wxPosition
			let longitude = crtPosition.longitude
			let latitude = crtPosition.latitude
			if (longitude && latitude) {
				this.detailInfo.distance = distance.countLatLng(parseFloat(latitude), parseFloat(longitude),
					parseFloat(this.detailInfo.latitude), parseFloat(this.detailInfo.longitude))
			}
			
			console.log('请求完了哈',this.detailInfo)
			
			this.state = this.detailInfo.status
			if (this.detailInfo.couponStatus == -1) {
				this.timer1 && clearInterval(this.timer1)
				this.$nextTick(function() {
					//success showtexteare
					this.showType = 'error'
				})
				this.$refs.popup.open('center')
			
			}
			
			if (this.state == 0) {
				this.timer && clearInterval(this.timer)
				this.timer = setInterval(() => {
					this.orderTime = this.orderTime - 1
					this.getOrderState(this.orderTime)
				}, 1000)
			}
			},

			pay() {
				let that = this
				pay.pay(this.detailInfo.activityId)
				console.log('去支付')
			},
			disBackPay() {
				// 取消退款




			},
			// 退款
			backPay() {
				// 支付成功 卡券信息可能没那么快生成
				if(this.detailInfo.couponEndTime){
					console.log('发起退款')
					let time = new Date().getTime()
					let endtime = new Date(this.detailInfo.couponEndTime.replace(/-/g, '/')).getTime()  //卡券结束时间
					let j = endtime - time
					if (j <= 0 && this.detailInfo.couponStatus != 2) {
						// 到了有效期
							this.$refs.popup.open('center')
						this.$nextTick(function() {
							//success showtexteare
							this.showType = 'showtexteare'
						})
					
					} else {
						// // 还没有到有效期
						this.showType = 'backerror'
						this.$refs.popup.open('center')
					}
				}else{
				// 还没有到有效期
				this.showType = 'backerror'
				this.$refs.popup.open('center')
				}
			},

			goActivity() {
				// let pages = getCurrentPages();  //获取所有页面栈实例列表
				// console.log(pages)
				
				
				uni.redirectTo({
					url: `/pages/activity?id=${this.detailInfo.activityId}`
				})
			},
			goDealer() {
				if (this.detailInfo.latitude && this.detailInfo.longitude) {
					// uni.navigateTo({
					// 	url:`/pages/map?latitude=${this.nearDealer.lngY}&longitude=${this.nearDealer.lngX}&des=${this.nearDealer.name}`
					// })
					uni.openLocation({
						'latitude': Number(this.detailInfo.latitude),
						'longitude': Number(this.detailInfo.longitude),
						'name': this.detailInfo.dealerName,
						scale: 18,
						success(sus) {
							console.log(sus)
						},
						fail(res) {
							console.log(res)
						}
					})
				}

			},
			toExternalPage(url) {
				if (url && url.substring(0, 4) == "http") {
					uni.navigateTo({
						url: `/pages/webview?webURL=${encodeURIComponent(url)}`,
					})
				}
			},
			toCollectInfor(url) {
				uni.navigateTo({
					url: `/pages/webview?webURL=${encodeURIComponent(url)}`,
				})
			},
			toServices(csUrl) {
				let baseUrl = domain.getAPI('serversCode')
				let url = `${baseUrl}?csUrl=${csUrl}`
				uni.navigateTo({
					url: `/pages/webview?webURL=${encodeURIComponent(url)}`,
				})
			},

			popCancle1() {
				this.$refs.popup.close()
				uni.redirectTo({
					url: `/pages/buyOrder?activityId=${this.detailInfo.activityId}`,
				})
			},

			popCancle() {
				this.$refs.popup.close()
				
				setTimeout(() => {
					this.getOrderDetail()
				}, 2000)
				
				
				

			},
			async backSoure() {
				// this.$refs.popup.close()
				console.log('确定退款')
				if (this.backReason.length <= 0) {
					this.$toast('请先输入退款原因')
					return
				}
				if (this.backReason.length > 200) {
					this.backReason = this.backReason.substr(0, 200)
				}
				let data = await api.apply({
					"orderId": this.detailInfo.id,
					"refundReason": this.backReason
				})
				if (data.code == 1) {
					//提交成功
					this.showType = 'success'
					this.$refs.popup.open('center')
					this.state = 3
				} else if (data.code == 2 || data.code == 3) {
					this.showType = 'backerror'
					this.$refs.popup.open('center')
					this.$toast(data.msg)
				}else{
					this.$toast(data.msg)
				}
			},
			getOrderState(orderState) {
				let j = orderState // 66 s
				let minutes = parseInt(j / 60)
				let ss = Math.floor(j % 60)
				if (minutes < 0) {
					minutes = 0
				}
				if (ss < 0) {
					ss = 0
				}

				console.log('时间', j / 1000, minutes, ss)
				this.orderText = (minutes > 9 ? minutes : ('0' + minutes)) + ":" + (ss > 9 ? ss : ('0' + ss)) + '后失效'
				if (orderState <= 0 ) {
					this.timer && clearInterval(this.timer)
					if(this.state == 0){
						// 手动改下
					this.orderText = '订单已失效'
					this.state = 6 	
					}
					
					// setTimeout(() => {
					//   this.getOrderDetail()
					// }, 1000)
				}
			},
		}
	}
</script>

<style lang="less" scoped>
	@import '@/static/less/public.less';

	page {
		background-color: #3C4851;
	}

	.bg {
		width: 100%;
		min-height: 100vh;
		background: #f6f7f8;
	    margin-bottom: constant(safe-area-inset-bottom) ;
	    margin-bottom: env(safe-area-inset-bottom) ;
		padding-bottom: 140rpx;
	}

	.container {

		.titleK {
			font-size: 32rpx;
			font-weight: 800;
			text-align: left;
			color: #333333;
		}

		.headerT {
			// position: relative;
			height: 427rpx;
			width: 100%;
			.setbg(750rpx, 223rpx, 'lottery_detail_bg1.png');
			padding-top: 98rpx;
			// box-sizing: border-box;


			.lId {
				position: absolute;
				top: 32rpx;
				left: 36rpx;
				color: #fff;
				font-size: 28rpx;
			}

			.lIdorderState {
				position: absolute;
				top: 77rpx;
				right: 40rpx;
				color: #A5ABAF;
				font-size: 24rpx;
			}

			.lIdcode0,
			.lIdcode3,
			.lIdcode1,
			.lIdcode2 {
				position: absolute;
				top: 26rpx;
				right: 36rpx;
				height: 40rpx;
				line-height: 40rpx;
				color: #fff;
				font-size: 24rpx;
				border: 1px solid #FFFFFF;
				border-radius: 20rpx;
				padding: 0 15rpx 0;
			}

			.lIdcode5,
			.lIdcode4,

			.lIdcode6 {
				position: absolute;
				top: 26rpx;
				right: 36rpx;
				height: 40rpx;
				line-height: 40rpx;
				color: #A5ABAF;
				font-size: 24rpx;
				border: 1px solid #A5ABAF;
				border-radius: 20rpx;
				padding: 0 15rpx 0;
			}

		}

		.headerInfo {
			position: relative;
			// background: red;
			// border-radius: 20rpx;
			// padding: 42rpx;
			width: 686rpx;
			// height: 186rpx;
			margin: 0 auto;
			box-sizing: border-box;
			margin-top: -200rpx;


			.lDetail {
				position: relative;
				height: 100%;
				border-radius: 30rpx;
				padding-bottom: 42rpx;
				background: #FFFFFF;
				padding: 42rpx;
				border-bottom: 1px dashed #ebebeb;

				.prizeName {
					position: relative;
					color: #000;
					font-weight: 600;
					font-size: 36rpx;
					margin-bottom: 20rpx;
				}

				.prizeCode {
					position: relative;
					display: flex;
					font-size: 26rpx;
					color: #999;
					height: 30rpx;
					line-height: 30rpx;

					.code {
						font-size: 32rpx;
						font-weight: 500;
						color: #FA8845;
					}

					.nocode {
						font-size: 26rpx;
						color: #999999;
					}
				}

				.services-btn {
					line-height: 58rpx;
					font-size: 36rpx;
					text-align: center;
					color: #fa8845;
					float: right;
					transform: translateY(-70%)
				}

				.prizeScore {
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					font-size: 32rpx;
					color: #fa8845;

					.code {
						text {
							margin-right: 15rpx;
						}
					}

					.description {
						font-size: 20rpx;
						color: #999999;
						margin-top: 10rpx;
					}

					.externalLink {
						width: 140rpx;
						height: 56rpx;
						font-size: 24rpx;
						color: #ffffff;
						text-align: center;
						line-height: 56rpx;
						border-radius: 56rpx;
						background: #fa8845;
					}
				}
			}
		}


		.bodyT {
			padding-top: 42rpx;
			background: #FFFFFF;
			padding: 42rpx;
			border-radius: 30rpx;

			.info {
				font-size: 26rpx;
				color: #000;
				line-height: 50rpx;


				.item {
					display: flex;
					font-size: 26rpx;

					.hotNDelFicon {
						// display: block;
						margin: auto 9rpx;
						width: 32rpx;
						height: 32rpx;

					}

					.babelT {
						color: #999;
						white-space: nowrap;
						// background: red;

					}
				}
			}

			.contentTips {
				color: #333333;
				font-size: 26rpx;
			}

			.tips {
				color: #000;
				margin-top: 16rpx;

				.title {
					font-size: 28rpx;
					color: #000;
					font-weight: 600rpx;
					line-height: 50rpx;
				}

				.infoItem {
					line-height: 46rpx;
					font-size: 26rpx;
					color: #333333;
					line-height: 48rpx;
				}
			}
		}

		.boomV {
			display: flex;
			position: fixed;
			bottom: 0;
			width: 100%;
			height: 120rpx;
			background: #FFFFFF;
			margin-top: 40rpx;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);

			.activityDeatil {
				width: 686rpx;
				height: 88rpx;
				color: #fa8845;
				border: 2rpx solid #fa8845;
				border-radius: 44rpx;
				box-sizing: border-box;
				background-color: #FFFFFF;
				margin: auto;
				line-height: 88rpx;
				text-align: center;
			}

			.share-btn {
				width: 236rpx;
				height: 88rpx;
				color: #fa8845;
				border: 2rpx solid #fa8845;
				border-radius: 44rpx;
				box-sizing: border-box;
				background-color: #FFFFFF;
				margin: auto;
				text-align: center;
				line-height: 88rpx;
			}

			.buyBtn {
				margin: auto;
				width: 420rpx;
				height: 88rpx;
				margin-left: 30rpx;
				color: #FFFFFF;
				background: #FA8845;
				border-radius: 44rpx;
				text-align: center;
				line-height: 88rpx;
				box-sizing: border-box;

			}
		}


	}

	.popV {
		width: 600rpx;
		height: 568rpx;
		background: #FFFFFF; 
		border-radius: 10rpx;
		text-align: center;

		image {
			// padding-top: 60rpx;
			margin-top: 60rpx;
			width: 130rpx;
			height: 130rpx;
		}

		.title1 {
			color: #333333;
			font-size: 36rpx;
			margin-top: 37rpx;
			font-weight: 800;
		}

		.title2 {
			margin: auto;
			width: 334rpx;
			color: #999999;
			font-size: 28rpx;
			margin-top: 37rpx;
			font-weight: 500;
		}

		.error {
			margin-top: 20rpx;
		}


		.setitle {
			font-size: 28rpx;
			color: #333333;
			padding: 40rpx;
			padding-top: 30rpx;

		}

		.textareaback {
			textarea {
				margin: 0 40rpx 0;
				width: 480rpx;
				height: 220rpx;
				border: 1px solid #FFD5BC;
				border-radius: 8rpx;
				padding: 20rpx;
				text-align: left;
			}
		}



		.cancle {
			display: inline-block;
			width: 248rpx;
			height: 88rpx;
			border: 2rpx solid #d0d0d0;
			border-radius: 46rpx;
			color: #333333;
			line-height: 88rpx;
			text-align: center;
			margin: 40rpx 0rpx 40rpx 40rpx;
		}

		.soure {
			display: inline-block;
			width: 248rpx;
			height: 88rpx;
			color: #FFFFFF;
			background: #fa8845;
			border-radius: 44rpx;
			line-height: 88rpx;
			text-align: center;
			margin: 40rpx 0rpx 40rpx 24rpx;

		}

	}
	
	.success{
		width: 560rpx;
		height: 585rpx;
		/*  #ifdef  MP-TOUTIAO */
		height: 605rpx;
		/*  #endif  */
		
	}
	.error1{
		width: 560rpx;
		height: 685rpx;
		/*  #ifdef  MP-TOUTIAO */
		height: 705rpx;
		/*  #endif  */
	}
	.backerror{
		width: 440rpx;
		height: 407rpx;
		padding:23rpx 60rpx;
		/*  #ifdef  MP-TOUTIAO */
		height: 457rpx;
		/*  #endif  */
	}
</style>
