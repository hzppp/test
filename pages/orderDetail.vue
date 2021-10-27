<template>
	<view class="bg">
		<view class="container">
			<view class="headerT">
				<view class="lId">订单ID：{{detailInfo.winningCode}}</view>
				<view class="lIdorderState" v-if="state==2">{{orderText}}</view>
				<view :class="'lIdcode' + state">{{ state | formatState }}</view>
			</view>
			<view class="headerInfo">
				<view class="lDetail">
					<view class="prizeName">{{detailInfo.prizeName}}</view>
					<view class="services-btn">{{detailInfo.prizeName}}</view>
					<view class="prizeCode">
						<view v-if="detailInfo.verificationCode && detailInfo.verificationCode.length && state !=7 && state !=1 && state !=3">核销码：
						</view>
						<view
							:class="(detailInfo.verificationCode && detailInfo.verificationCode.length&& state !=7 && state !=1 && state !=3)?'code':'nocode' ">
							{{ (detailInfo.verificationCode && detailInfo.verificationCode.length && state !=7 && state !=1 && state !=3)? detailInfo.verificationCode:(state==2? "核销码完成支付后生成":(state==7?"核销码已失效":(state==1?"订单已失效":"核销码生成中")))}}
						</view>
					</view>
				</view>
				<!-- yuchenceshi -->
				<image mode="widthFix" style="margin: auto;width: 606rpx;"
					src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/lottery_detail_bg1.png"></image>

				<view class="bodyT">
					<view class="info">
						<view class="title titleK">
							报名信息：
						</view>
						<view class="item">
							<view class="babelT">姓名：</view>
							{{ detailInfo.mobile }}
						</view>
						<view class="item">
							<view class="babelT">电话：</view>
							{{ detailInfo.mobile }}
						</view>
						<view class="item">
							<view class="babelT">购买时间：</view>{{detailInfo.createTime | formatTimeMins }}
						</view>
						<view class="item">
							<view class="babelT">使用期限：</view>{{detailInfo.endDate | formatTimeMins}}
						</view>
						<view class="item">
							<view class="babelT">经销商：</view>
							{{ detailInfo.mobile }}
						</view>
						<view class="item" @tap='goDealer()'>
							<view class="babelT">地址：</view>
							{{ detailInfo.mobile }}
							<image v-if="detailInfo.distance != undefined && detailInfo.distance != Infinity"
								class="hotNDelFicon"
								src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/dealLocation1.png">
							</image>
							<view v-if="detailInfo.distance != undefined && detailInfo.distance != Infinity"
								style="color: #FA8845;">{{detailInfo.distance | formatThousand}}</view>
						</view>
					</view>
					<view class="info" style="margin-top: 40rpx;">
						<view class="title titleK">使用说明:</view>
						<view class="contentTips">
							<text>
								1、兑奖期限：2021年6月30日24时前，过期作废。
								2、本券仅用于活动期间购买长安汽车旗下乘用车品
								牌经销商（不含新能源）线下使用，每辆车限使用1
								张代金券。
								3、请您在购车时出示本券，经服务中心销售人员验
								证后核销使用。
								4、购车客户电话号码和报名活动电话号码需保持一
								致，否则将导致奖券无法使用。
								* 本次活动解释权归长安乘用车营销事业部所有
								1、兑奖期限：2021年6月30日24时前，过期作废。
								2、本券仅用于活动期间购买长安汽车旗下乘用车品
								牌经销商（不含新能源）线下使用，每辆车限使用1
								张代金券。
								3、请您在购车时出示本券，经服务中心销售人员验
								证后核销使用。
								4、购车客户电话号码和报名活动电话号码需保持一
								致，否则将导致奖券无法使用。
								* 本次活动解释权归长安乘用车营销事业部所有
								1、兑奖期限：2021年6月30日24时前，过期作废。
								2、本券仅用于活动期间购买长安汽车旗下乘用车品
								牌经销商（不含新能源）线下使用，每辆车限使用1
								张代金券。
								3、请您在购车时出示本券，经服务中心销售人员验
								证后核销使用。
								4、购车客户电话号码和报名活动电话号码需保持一
								致，否则将导致奖券无法使用。
								* 本次活动解释权归长安乘用车营销事业部所有
							</text>
							<!-- <text>{{detailInfo.activityMemoArr}}</text> -->

						</view>

					</view>
				</view>
			</view>
			<view class="boomV" v-if="state==2">
				<view class="share-btn" @tap='goActivity()'>活动详情</view>
				<view class="buyBtn" @tap='pay()'>去支付</view>
			</view>
			<view class="boomV" v-if="state==5">
				<view class="share-btn" @tap='goActivity()'>活动详情</view>
				<view class="buyBtn" @tap='disBackPay()'>取消退款</view>
			</view>
			<view class="boomV" v-if="state==4">
				<view class="share-btn" @tap='goActivity()'>活动详情</view>
				<view class="buyBtn" @tap='backPay()'>退款</view>
			</view>
			<view class="boomV" v-if="state==1 || state==7 || state==6 || state==3" @tap='goActivity()'>
				<view class="activityDeatil">活动详情</view>
			</view>
		</view>
		<uni-popup ref="popup" type="center" :mask-click="false">
			<view class="popV" v-if="showType=='showtexteare'">
				<view class="setitle">退款成功后会取消相应的权益，请登记一下您的退款原因</view>
				<view class="textareaback" >
					<textarea placeholder="请填写退款原因" maxlength="200" v-model="backReason" placeholder-style="color:#CCCCCC;" />
				</view>
				<view class="cancle" @tap='popCancle()'>取消</view>
				<view class="soure" @tap='backSoure()'>确定退款</view>
			</view>
			
			<view class="popV" v-if="showType=='success'" style="width: 560rpx;height: 546rpx;">
				<image src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/backOrderSuccess.png"></image>
				<view class="title1">提交成功</view>
				<view class="title2">{{detailInfo.winningCode  + '提交之后将会原路退回支付金额'}}</view>
				<view class="soure" @tap='popCancle()' style="width: 360rpx;">好的</view>
			</view>
			
			<view class="popV" v-if="showType=='error'" style="width: 560rpx;height: 666rpx;">
				<image src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/backOrderFail.png"></image>
				<view class="title1">对不起,核销码生成失败</view>
				<view class="title2 error" >
					<text >您已支付的金额将会在3个工作日内系统将会原路返回，请注意查收 
					
					如有其它疑问，可电话咨询 400-2548-265</text>
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
	export default {
		name: "lotteryDetail",
		data() {
			return {
				detailInfo: {},
				id: '',
				state: 3, // 订单状态有7种  1 已失效  2 待支付  3  已支付  4 待使用  5 退款审核种 6 已核销  7已退款 
				orderState: '1635236704000', // 支付订单倒计时
				orderText: '',
				timer: '',
				backReason: '',
				showType:''   //showtexteare 输入   success  成功  error  失败
				
			}
		},
		filters: {
			formatState(state) {
				// console.log('parseInt(state)', parseInt(state))
				switch (parseInt(state)) {
					case 1: {
						return '已失效'
						break;
					}
					case 2: {
						return '待支付'
						break;
					}
					case 3: {
						return '已支付'
						break;
					}

					case 4: {
						return '待使用'
						break;
					}

					case 5: {
						return '退款审核中'
						break;
					}

					case 6: {
						return '已核销'
						break;
					}

					case 7: {
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
				return time ? time.substr(0, time.length - 3) : time;
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
			if (id) {
				uni.showLoading({
					title: '正在加载...'
				})
				this.detailInfo = await api.getLotteryDetail({
					id
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
				if (this.state == 2) {
					this.timer = setInterval(() => {
						this.getOrderState(this.orderState)
					}, 1000)
				}


				this.$nextTick(function() {
					//success showtexteare
					this.showType = 'error'
				})
				this.$refs.popup.open('center')

				// yuchencehshi
				// this.detailInfo.verificationCode = ''
			}
		},

		onUnload() {
			clearInterval(this.timer)
		},
		methods: {

			pay() {
				console.log('去支付')
			},
			disBackPay() {
				// 取消退款
			},
			// 退款
			backPay() {
				console.log('发起退款')
				
				
				
				
			},

			goActivity() {

				uni.navigateTo({
					url: `/pages/activity?id=${this.id}`
				})
			},
			goDealer() {

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
			
			popCancle(){
				this.$refs.popup.close()
				
			},
			backSoure(){
				// this.$refs.popup.close()
				console.log('确定退款')
				
				
				
				//提交成功
				this.showType = 'success'
				this.$refs.popup.open('center')
				
			},
			getOrderState(orderState) {
				let time = new Date().getTime()
				let endtime = new Date(parseInt(orderState)).getTime()
				let j = parseInt((endtime - time) / 1000) // 66 s
				let minutes = parseInt(j / 60)
				let ss = Math.floor(j % 60)
				if (minutes < 0) {
					minutes = 0
				}
				if (ss < 0) {
					ss = 0
				}

				// console.log('时间',j / 1000,minutes,ss)
				this.orderText = (minutes > 9 ? minutes : ('0' + minutes)) + ":" + (ss > 9 ? ss : ('0' + ss)) + '后失效'
				if (minutes == 0 && ss == 0) {
					clearInterval(this.timer)
					this.orderText = '订单已失效'
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
		// height: 1000rpx;
		background: #f6f7f8;

		// padding-bottom: 100rpx;
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
				top: 34rpx;
				right: 162rpx;
				color: #A5ABAF;
				font-size: 24rpx;
			}

			.lIdcode2,
			.lIdcode3,
			.lIdcode5,
			.lIdcode4 {
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

			.lIdcode7,
			.lIdcode6,

			.lIdcode1 {
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
			background: #fff;
			border-radius: 20rpx;
			padding: 42rpx;
			width: 686rpx;
			// height: 186rpx;
			margin: 0 auto;
			box-sizing: border-box;
			margin-top: -210rpx;


			.lDetail {
				position: relative;
				height: 100%;
				padding-bottom: 42rpx;
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
		image{
			padding-top: 60rpx;
			width: 130rpx;
			height: 130rpx;
		}
		.title1{
			color: #333333;
			font-size: 36rpx;
			margin-top: 37rpx;
			font-weight: 800;
		}
		.title2{
			margin: auto;
			width: 334rpx;
			color: #999999;
			font-size: 28rpx;
			margin-top: 37rpx;
			font-weight: 500;
		}
		.error{
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
</style>
