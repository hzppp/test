<template>
	<view :class="'container' +  (lotteryType == 'Vouchers' ? '  containerv' : '' )">
		<userBand></userBand>
		<page-top v-if="lotteryType == 'Vouchers'" :background="'#FA8845'" :titleys="'#000'" :btnys="''"
			:title.sync="title"></page-top>
		<pageTopCommon v-else ref="pagetop" :background="'#fff'" :titleys="'#3C4650'" :btnys="'white'"
			:title.sync="title" :homeBtn="true"></pageTopCommon>
		<view :class="'content' +  (lotteryType == 'Vouchers' ? '  vouchers' : '' )" >
			<template v-if="lotteryType == 'Vouchers'">
				<view class="VoucherBC">
					<view class="VoucherBCImg">
						<view class="BCtitle">{{lotteryActInfo.prizeList[0].name}}</view>
						<scroll-view scroll-y="true" class="BCContentTips">
							<text>{{activityMemoArr}}</text>
						</scroll-view>
						<button :class="(lotteryActInfo.chanceCount == 0  && lotteryActInfo) ? 'BCSub1' : (lotteryActInfo.prizeList[0].stock == 0 )?'BCSub2':'BCSub' "
							@tap='voucherStart()'>{{(lotteryActInfo.chanceCount == 0  && lotteryActInfo)?('查看代金券'):(lotteryActInfo.prizeList[0].stock == 0 ?'代金券已领完':'立即领取')}}
						</button>
						<text class="BCSub1Title" v-if="(lotteryActInfo.chanceCount == 0  && lotteryActInfo)" @tap='voucherStart()'>
							代金券存入[我的]-[中奖记录]</text>
						<!--  #ifdef MP-WEIXIN  -->
						<button v-if="sharePosterPic" class="BCShare" @tap='shareChoise()'>分享好友</button>
						<button v-else class="BCShare" open-type="share">分享好友</button>
						<!-- #endif -->
						<!--  #ifndef MP-WEIXIN  -->
						<button class="BCShare" open-type="share">分享好友</button>
						<!-- #endif -->
					</view>
					

				</view>
				
			</template>

			<template v-else>
				<view :class="lotteryType != 'grid'?'luckyWheel':'LuckyGrid'"
					:style="{backgroundImage: `url(${lotteryActInfo.activityPic})`}">
					<image :src="lotteryActInfo.activityPic" @load="e => imgBindload()"  class="lottery-bg"></image>
					<!-- 中奖记录 -->
					<win-records :winnerRecords="lotteryActInfo.winnerRecords" :autoplay="autoplay"/>
					<view class="lotteryRecord" @tap="golotteryRecord">中奖记录</view>

					<!-- 转盘抽奖 -->
					<lottery v-if="lotteryType != 'grid'" :prizes="prizes" :runDeg="runDeg" @start="startCallBack"/>
					
					<!-- 盲盒抽奖 -->
					<MysteryPrize v-if="lotteryType == 'grid'"  width="555rpx" height="685rpx" ref="mysteryPrize" :winPrizeUrl="winPrizeUrl" @end="gridEnd"/>

					<view class="choiceTime">
						您还有
						<view class="times">{{lotteryActInfo.chanceCount || 0}}</view>
						次抽奖机会
						<view :class="'refChangBtn'+  (lotteryType == 'grid'?' girdchangBtn':'')" @tap='refChangBtn()'></view>
					</view>
					<view v-if="lotteryType == 'grid'" :class="['btnBackV',{'btnOne':activityType==3}]">
						<template v-if="activityType!=3">
							<!--  #ifdef MP-WEIXIN  -->
							<button v-if="sharePosterPic" class="shareFiedv" @tap='shareChoise()'></button>
							<button v-else class="shareFiedv" open-type="share"></button>
							<!-- #endif -->
							<!--  #ifndef MP-WEIXIN  -->
							<button class="shareFiedv" open-type="share"></button>
							<!-- #endif -->
						</template>
						<button class="goGirldv" @tap='gridStart()'></button>
					</view>

				</view>
				<view :class="lotteryType != 'grid'?'list':'list girdList'">
					<button v-if="lotteryType != 'grid'" open-type="share" class="invite"></button>
					<!-- 邀请记录 -->
					<invite-records :activityId="activityId" v-if="activityType!=3"/>
				</view>
				<!-- 抽奖说明 -->
				<draw-tips :activityMemoArr="activityMemoArr"/>
			</template>
		</view>
		<view class="lotteryDialog" v-if="showDialogL && lotteryType != 'grid'" @touchmove.stop.prevent>
			<view class="dialogContainer">
				<block v-if="lotteryRes.id>1&&lotteryRes.price">
					<view class="tTitle titleQ">恭喜您获得</view>
					<view class="tBody">
						<view class="przie-name">{{lotteryRes.name}}</view>
					</view>
					<view class="tFoot">
						<button :class="['left',activityType!='checkIn'?'':'btn1 btn-yellow']" @tap="goLotteryDetail(lotteryRes.lotteryId)">{{activityType!='checkIn'?'查看详情':'查看中奖记录'}}</button>
						<button class="right" @tap="closeDialog" v-if="activityType!='checkIn'">继续抽奖</button>
					</view>
				</block>
				<block v-else>
					<view class="tTitle titleQ">您与奖品檫肩而过</view>
					<view class="tBody tBody2">
						<view class="funnyIcon"></view>
						<view class="thxA">谢谢惠顾~</view>
					</view>
					<view class="tFoot">
						<button class="right btn1" @tap="closeDialog">继续抽奖</button>
					</view>
				</block>
				<button class="closeBtn" @tap="closeDialog"></button>
			</view>
		</view>

		<!-- 抽奖结果 -->
		<view class="girdDialog" v-if="showDialogL && lotteryType == 'grid'" @touchmove.stop.prevent>
			<view class="dialogContainer">
				<block v-if="lotteryRes.id>1&&lotteryRes.price">
					<view class="tTitle ">恭喜您获得</view>
					<view class="tBody">
						<image class='funnyPrizeIcon' :src="lotteryRes.picUrl"></image>
						<view class="przie-name">{{lotteryRes.name}}</view>
					</view>
					<view class="tFoot">
						<button :class="['left',activityType!='checkIn'?'':'btn-yellow']" @tap="goLotteryDetail(lotteryRes.lotteryId)">{{activityType!='checkIn'?'':'查看中奖记录'}}</button>
						<button class="right" @tap="closeDialog"  v-if="activityType!='checkIn'"></button>
					</view>
				</block>
				<block v-else>
					<view class="tTitle ">您与奖品檫肩而过</view>
					<view class="tBody tBody2">
						<view class="funnyIcon"></view>
						<view class="thxA">谢谢参与～</view>
					</view>
					<view class="tFoot">
						<button class="right btn1" @tap="closeDialog"></button>
					</view>
				</block>
				<button class="closeBtn" @tap="closeDialog"></button>
			</view>
		</view>

		<uni-popup ref="popup" type="bottom" :mask-click="false">
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



		<!-- 绘图用 -->
		<view style="position: absolute; top: 10px;z-index:-1 ; visibility: hidden;">
			<canvas v-if="canvasshow" id="myCanvas" canvas-id="myCanvas"
				style="margin-top: 100rpx;width: 90px;height: 117px;position:fixed;left:100%;"></canvas>
		</view>

		<view class="loading" v-if="!bgImgLoaded"></view>

	</view>
</template>
<!--lottery_bg.png-->
<script>
	// import LuckyWheel from '@/components/uni-luck-draw/lucky-wheel'
	// import LuckyGrid from '@/components/uni-luck-draw/lucky-grid'
	import MysteryPrize from '@/components/mystery-prize/mystery-prize'
	import lottery from '@/components/toutiao-lottery/lottery'
	import pageTopCommon from '@/components/pageTopCommon/pageTopCommon'
	const app = getApp()
	import api from '@/public/api/index'
	import login from '@/units/login'
	import userBand from '@/components/userBand/userBand'
	import pageTop from '@/components/pageTop/pageTop'
	import winRecords from '@/components/winRecords/winRecords'
	import inviteRecords from '@/components/inviteRecords/inviteRecords'
	import drawTips from '@/components/drawTips/drawTips'
	import {
		changeUnits,
		resolveImage
	} from '@/lottery/utils.js'
	export default {
		name: "lotteryPage",
		components: {
			// LuckyWheel,
			pageTopCommon,
			userBand,
			// LuckyGrid,
			MysteryPrize,
			pageTop,
			lottery,
			winRecords,
			inviteRecords,
			drawTips
		},
		data() {
			return {
				selectPrizesURL: '',
				inviteRecordList: [],
				inviteRecordCount: 0,
				lotteryActInfo: {},
				title: '转盘抽奖',
				blocks: [],
				showDialogL: false,
				GirdShowDialogL: false,
				prizes: [],
				defaultStyle: {
					fontColor: '#d64737',
					fontSize: '14px',
				},
				activityId: '',
				lotteryRes: {},
				lotteryResindex: 999,
				activityMemoArr: [],
				shareTitle: '',
				shareUrl: '',
				isIOS: false, 
				lotteryType: '',
				activityType:"",
				shareURL: '',
				sharePosterPic: '',
				buttons: [{
						radius: '35px',
						background: '#d64737'
					},
					{
						radius: '30px',
						background: '#f6c66f',
						pointer: true
					},
					{
						radius: '25px',
						background: '#ffdea0'
					}
				],
				defaultConfig: {
					gutter: '5px',
					offsetDegree: 30
				},
				canvasshow: true,
				grid: {},
				canvasShow: false,
				startIng:false,
				runDeg:0,
				animationData:{},
				winPrizeUrl:"",
				autoplay:false,
				bgImgLoaded:false
			}
		},
		onShow() {
			this.autoplay = true
			app.globalData.isRotating = false;
		},
		async onLoad(options) {
			// #ifndef MP-WEIXIN
			try {
				const res = uni.getSystemInfoSync();
				
				if (res.platform === 'android') {
					this.isIOS = false
				}
			} catch (e) {
				// error
			}
			// #endif
			this.shareURL = decodeURIComponent(options.shareURL)
			this.lotteryType = options.lotteryType
			this.activityType = options.activityType
			this.showDialogL = false;
			this.GirdShowDialogL = false;
			this.prizes = []

			if (this.lotteryType == 'Vouchers') {
				this.title = '购车代金券'
			}else if (this.lotteryType == 'grid'){
			     this.title = '盲盒抽奖'
			}



			uni.showLoading({
				title: '正在加载...'
			})
			const {
				activityId = 0,
				activityType = 0
			} = options
			this.activityId = activityId
			// await login.checkLogin(api)
			this.lotteryActInfo = await api.getLotteryActInfo({
				activityId,
				activityType:activityType>=0 ?activityType :""
			}).then(res => {
				if (res.code == 1) {
					return res.data || {
						prizeList: [],
						winnerRecords: []
					}
				} else if (res.code == 10) {
					uni.showToast({
						title: res.msg,
						icon: "none"
					})
					app.globalData.isRotating = false;
					return {};
					// setTimeout(()=> {
					//   uni.reLaunch({
					//     url:"/pages/authorization"
					//   })
					// },1500)
				} else if (res.code == 0) {
					uni.showToast({
						title: '本次抽奖异常，已保留抽奖机会，请稍后再试',
						icon: "none"
					})
					app.globalData.isRotating = false;
					return {};
				}
			}).finally(res => {
				console.log('this.lotteryActInfo', this.lotteryActInfo)
			})
			if (this.lotteryActInfo && this.lotteryActInfo.activityMemo) {
				// this.activityMemoArr =this.lotteryActInfo.activityMemo.split(/[\s\n]/)
				this.activityMemoArr = this.lotteryActInfo.activityMemo.replace('/n', '/r/s')
			}

			this.lotteryActInfo.winnerRecords.reverse()

			if (!(this.lotteryActInfo.isApply)) {
				//跳到留资页
				console.log('this.lotteryActInfo.isApply', this.lotteryActInfo.isApply)
				const wxUserInfo = uni.getStorageSync('wxUserInfo')
				const url = `/pages/fissionActivity?id=${this.activityId}`
				uni.showToast({
					title: '您暂未留资',
					icon: "none"
				})
				setTimeout(() => {
					uni.reLaunch({
						url
					})
				}, 1000)
				return;
			}
			this.lotteryActInfo.prizeList = this.lotteryActInfo.prizeList.sort((a, b) => a.prizeCode - b.prizeCode)
			// console.log("lotteryActInfo11111111111111111111111111111",this.lotteryActInfo);
			if (this.lotteryType == 'grid') {
				uni.hideLoading()
				
			} else {
				// 
				if (this.lotteryActInfo.prizeList.length) {
					 var turnNum = 1 / this.lotteryActInfo.prizeList.length*360;  // 文字旋转 turn 值
					 
					this.lotteryActInfo.prizeList.forEach((item, index) => {
						let url = item.picUrl.trim()
						if (url.indexOf('http:') > -1) {
							url = url.replace('http:', 'https:')
						}
						this.prizes.push({
							src: url,
							turn: index * turnNum + 'deg',lineTurn: index * turnNum + turnNum / 2 + 'deg'
						})

						if (index == this.lotteryActInfo.prizeList.length - 1) {
							uni.hideLoading()
						}
					})
					// console.log("this.prizes",this.prizes);
				}

			}

			let {
				data = {}
			} = await api.getActivityContent(this.activityId)
			console.log('fenxang ', data)
			this.shareTitle = data.name
			this.shareUrl = data.sharePic
			this.sharePosterPic = data.sharePosterPic

		},
		onShareAppMessage() {
			console.log('ui', this.shareURL, this.shareTitle, this.shareUrl)
			return {
				title: this.shareTitle,
				path: this.shareURL,
				imageUrl: this.shareUrl
			}
		},
		onHide() {
			this.autoplay = false
		},
		methods: {
			//背景图片加载事件
			imgBindload () {
				this.bgImgLoaded = true;
            },
			
			// 点击抽奖按钮触发回调
			async startCallBack() {
				if (!this.lotteryActInfo.chanceCount) {
					// chanceCount
					uni.showToast({
						title: '您的机会已经用完啦~',
						icon: "none"
					})
					app.globalData.isRotating = false;
					return
				}
				// 先开始旋转
				this.lotteryRes = await api.handleStartLottery({
					activityId: this.activityId
				}).then(res => {
					if (res.code == 10) {
						uni.showToast({
							title: res.msg,
							icon: "none"
						})
						app.globalData.isRotating = false;
						return
					} else if (res.code === 1) {
						let index = this.matchIndex(res.data.id) //中奖索引
						// 缓慢停止游戏
						setTimeout(() => {
							this.run(index)
						}, 500)
						return res.data

					} else if (res.code == 0) {
						uni.showToast({
							title: '本次抽奖异常，已保留抽奖机会，请稍后再试',
							icon: "none"
						})
						app.globalData.isRotating = false;
						return
					}
				}).catch (e =>{
					app.globalData.isRotating = false;
					uni.showToast({
						title: '网络连接错误，请稍后再试',
						icon: "none"
					})
				})

			},
			run(index){
				var runNum = 8;//旋转8周  
				var duration = 4000;//时长 
				// 旋转角度  
				this.runDeg = this.runDeg || 0;  
				this.runDeg = this.runDeg + (360 - this.runDeg % 360) + (360 * runNum - index * (360 / this.lotteryActInfo.prizeList.length))  
	
				//动画结束后弹出中奖弹窗
				setTimeout(function () {  
					this.endCallBack()
				}.bind(this), duration);  
			},
			matchIndex(id) {
				let res;
				this.lotteryActInfo.prizeList.some((item, index) => {
					if (item.id == id) {
						res = index
						return true
					}
				})
				return res;
			},
			// 抽奖结束触发回调
			endCallBack(prize) {
				// 奖品详情
				app.globalData.isRotating = false
				this.showDialogL = true;
				this.GirdShowDialogL = true
				this.lotteryActInfo.chanceCount--;
			},
			closeDialog() {
				this.showDialogL = false;
				this.GirdShowDialogL = false
			},
			goLotteryDetail(id) {
				if(app.globalData.isRotating){
					return
				}
				this.closeDialog()
				setTimeout(() => {
					let url = `/pages/lotteryDetail?id=${id}`;
					uni.navigateTo({
						url
					})
				}, 100)
			},
			golotteryRecord() {
				if(app.globalData.isRotating){
					return
				}
				this.closeDialog();
				let url = '/pages/lotteryRecord';
				uni.navigateTo({
					url
				})
			},
			goInviteRecord() {
				if(app.globalData.isRotating){
					return
				}
				let url = `/pages/inviteRecord?activityId=${this.activityId}`;
				uni.navigateTo({
					url
				})
			},
			// 购车代金券抽奖
			async voucherStart() {
				if (this.lotteryActInfo.chanceCount == 0) {
					uni.navigateTo({
						url: '/pages/lotteryRecord'
					})
					return
				}
				if (this.lotteryActInfo.prizeList[0].stock == 0) {
					// 没有库存
					return
				}
				uni.showLoading({})
				this.lotteryRes = await api.handleStartLottery({
					activityId: this.activityId
				}).then(res => {
					uni.hideLoading()
					if (res.code == 10) {
						uni.showToast({
							title: res.msg,
							icon: "none"
						})
						return
					} else if (res.code === 1) {
						if (res.price == 0) {
							this.$toast('来晚啦～代金券已抢光')
							this.lotteryActInfo.prizeList[0].stock = 0
							this.lotteryActInfo.chanceCount = 0
						} else {
							this.$toast('领取成功')
							this.lotteryActInfo.prizeList[0].stock = 0
							this.lotteryActInfo.chanceCount = 0
						}
						return res.data
					} else if (res.code == 0) {
						this.lotteryActInfo.prizeList[0].stock = 0
						uni.showToast({
							title: '来晚啦～代金券已抢光',
							icon: "none"
						})

						return
					}
				})



			},
			// 盲盒抽奖
			async gridStart() {
				
				this.winPrizeUrl = ""
				this.lotteryResindex == 999
				if (!this.$refs.mysteryPrize) {
					return;
				}
				if(app.globalData.isRotating){
					return
				}
				app.globalData.isRotating = true
				if (!this.lotteryActInfo.chanceCount) {
					// chanceCount
					uni.showToast({
						title: '您的机会已经用完啦~',
						icon: "none"
					})
					app.globalData.isRotating = false;
					return
				}

				
				// 先开始旋转
				this.lotteryRes = await api.handleStartLottery({
					activityId: this.activityId
				}).then(res => {
					if (res.code == 10) {
						uni.showToast({
							title: res.msg,
							icon: "none"
						})
						app.globalData.isRotating = false;
						return
					} else if (res.code === 1) {

						this.$refs.mysteryPrize.play(num)
						// 中奖索引
						var num = Math.round(Math.random() * 5)
						this.lotteryResindex = num
						
						// 缓慢停止游戏
						setTimeout(() => {
							console.log('num' + num)
							this.$refs.mysteryPrize.stop(num)
						}, 500)
						return res.data
					} else if (res.code == 0) {
						uni.showToast({
							title: '本次抽奖异常，已保留抽奖机会，请稍后再试',
							icon: "none"
						})
						app.globalData.isRotating = false;
						return
					}
				}).catch (e =>{
					app.globalData.isRotating = false;
					uni.showToast({
						title: '网络连接错误，请稍后再试',
						icon: "none"
					})
				})
			},
			
			gridEnd(prize) {
				// 奖品详情
				console.log("gridEnd")
				this.showDia()
			},
			showDia() {
				this.winPrizeUrl = this.lotteryRes.picUrl
				setTimeout(() => {
					app.globalData.isRotating = false
					this.showDialogL = true;
					this.GirdShowDialogL = true
					this.lotteryActInfo.chanceCount--;
				}, 500)
			},
			shareChoise() {

				this.GirdShowDialogL = true
				this.$refs.popup.open('bottom')
			},

			shareCancle() {

				this.GirdShowDialogL = false
				this.$refs.popup.close()
			},
			shareHB() {
				if(app.globalData.isRotating){
					return
				}

				this.GirdShowDialogL = false
				let url = '/pages/sharePost?scene1=' + encodeURIComponent(this.shareURL) + '&shareUrl=' +
					encodeURIComponent(this.sharePosterPic)
				uni.navigateTo({
					url: url
				})



				this.$refs.popup.close()
			},
			
			async refChangBtn(){
				
				if(!app.globalData.isRotating){
				uni.showLoading({
					title:'加载中'
				})
				this.inviteRecordList = await api.getInviteRecordList({
					pageNo: 1,
					pageSize: 3,
					'activityId':this.activityId
				}).then(res => {
					this.inviteRecordCount = res.total || 0
					return res.code == 1 ? res.rows : []
				})
					
				await api.getLotteryActInfo({
					'activityId':this.activityId,
					activityType:this.activityType>=0 ?this.activityType :""
				}).then(res => {
					uni.hideLoading()
					if (res.code == 1) {
						this.lotteryActInfo.chanceCount = res.data.chanceCount
						this.lotteryActInfo.prizeList = res.data.prizeList
					} else if (res.code == 10) {
						
					} else if (res.code == 0) {
						
					}
				}).finally(res => {})	
				}
			}


		}
	}
</script>

<style scoped lang="less">
	@import '@/static/less/public.less';

	.titleQ {
		position: relative;

		&::before {
			content: '';
			border-top: 1rpx solid #fda2a2;
			width: 60rpx;
			position: absolute;
			left: -88rpx;
			top: 50%;
			transform: translateY(-50%);
		}

		&::after {
			content: '';
			border-top: 1rpx solid #fda2a2;
			width: 60rpx;
			position: absolute;
			right: -88rpx;
			top: 50%;
			transform: translateY(-50%);
		}
	}
 
 
    .containerv{
	  height: 100vh;
	}
	.container {
		position: relative;
		background: #eef1f5;
		.vouchers {
            overflow: hidden;
			background: #FA8845;
			height: 100vh;
			
		}

		.content {
			overflow-x: hidden;
			overflow-y: hidden;
			width: 100%;
			.VoucherBC {
				position: relative;
				height: calc(85.9vh - 0rpx);
				width: 686rpx;
				top: 10rpx;
				left: 30rpx;
				width: 686rpx;
				margin-bottom: 30rpx;
				
				

				.VoucherBCImg {
					.setbg(100%, 100%, 'VouchersBC.png');

					.BCtitle {
						position: relative;
						top: 56rpx;
						font-size: 46rpx;
						font-weight: 700;
						text-align: center;
					    align-items:center;
						height: 130rpx;
						display: flex;
						  justify-content: center;
						  align-items:center;
						  width: 100%;

						color: #333333;
						/*  #ifndef  MP-WEIXIN */
						font-size: 46rpx;
						top: 36rpx;
						/*  #endif  */	
		
					}

					.BCContentTips {
						width: 601rpx;
						position: relative;
						top: 107rpx;
						left: 44rpx;
						font-size: 28rpx;
						font-weight: 400;
						color: #999999;
						line-height: 44rpx;
						height: 46vh;

					}

					.BCSub {
						position: fixed;
						bottom: 13.6vh;
						width: 588rpx;
						height: 88rpx;
						left: 81rpx;
						opacity: 1;
						background: #fa8845;
						border-radius: 44px;
						color: #FFFFFF;
					}

					.BCSub1 {
						position: fixed;
						bottom: 13.6vh;
						width: 588rpx;
						height: 88rpx;
						left: 81rpx;
						opacity: 1;
						background: #FFFFFF;
						border: 2px solid #fa8845;
						border-radius: 44px;
						line-height: 50rpx;
						color: #FA8845 !important;
					}
					.BCSub2 {
						position: fixed;
						bottom: 13.6vh;
						width: 588rpx;
						height: 88rpx;
						left: 81rpx;
						opacity: 1;
						background: #F8F8F8;
						border-radius: 44px;
						color: #CCCCCC;
					}

					.BCSub1Title {
						font-size: 22rpx;
						left: 236rpx;
						position: fixed;
						bottom: 14.46vh;
						font-weight: 400;
						text-align: center;
						color: #999999;

					}

					.BCShare {
						position: fixed;
						bottom: 5.2vh;
						width: 588rpx;
						height: 88rpx;
						left: 81rpx;
						opacity: 1;
						background: #FFFFFF;
						border: 2px solid #fa8845;
						border-radius: 44px;
						color: #FA8845 !important;
					}

				}



				// 
			}



			.luckyWheel {
				position: relative;
				.setbg(100%, 1130rpx, 'lottory_bg.png');

				.lotteryList {
					position: absolute;
					left: 16rpx;
					top: 16rpx;
					font-size: 24rpx;
					line-height: 56rpx;
					color: #fff;
					text-align: center;
					padding: 0 20rpx;
					max-width: 530rpx;

					.item {
						background: rgba(0, 0, 0, .3);
						border-radius: 28rpx;
					}
				}

				.lotteryRecord {
					position: absolute;
					right: 0;
					top: 16rpx;
					width: 134rpx;
					height: 56rpx;
					background: rgba(0, 0, 0, .6);
					border-top-left-radius: 28rpx;
					border-bottom-left-radius: 28rpx;
					font-size: 24rpx;
					text-align: center;
					line-height: 56rpx;
					color: #fff;
					// .setbg(134rpx, 56rpx, 'recode_icon.png');
				}

				.choiceTime {
					position: absolute;
					bottom: 20rpx;
					width: 100%;
					text-align: center;
					font-size: 28rpx;
					color: #333333;
					// background: #DD524D;
				
					.refChangBtn{
						display: inline-block;
						width: 32rpx;
						height: 32rpx;
						line-height: 32rpx;
						margin-left: 30rpx;
						position: absolute;
						top: 50%;
						// left:50%;
						 transform: translate(-50% , -50%);
						.setbg(32rpx, 32rpx, 'fotteryRef.png');
					}

					.times {
						height: 38rpx;
						display: inline-block;
						color: #ed2c2c;
						// margin: 0 10rpx;
						line-height: 38rpx;
					}
				}
			}

			.LuckyGrid {
				position: relative;
				.setbg(100%, 1460rpx, 'lottory_bg.png');
				text-align: center;

				.lotteryList {
					position: absolute;
					left: 16rpx;
					top: 16rpx;
					font-size: 24rpx;
					line-height: 56rpx;
					color: #fff;
					text-align: center;
					padding: 0 20rpx;
					max-width: 530rpx;

					.item {
						background: rgba(0, 0, 0, .3);
						border-radius: 28rpx;
					}
				}
				.refChangBtn{
					display: inline-block;
					width: 32rpx;
					height: 32rpx;
					line-height: 32rpx;
					margin-left: 30rpx;
					position: absolute;
					top: 50%;
					// left:50%;
					 transform: translate(-50% , -50%);
					.setbg(32rpx, 32rpx, 'fotteryRef.png');
					
					
					
					
				}
				
				.girdchangBtn{
					.setbg(32rpx, 32rpx, 'fotteryRefWrite.png');
				}
				
				

				.lotteryRecord {
					position: absolute;
					right: 0;
					top: 16rpx;
					width: 134rpx;
					height: 56rpx;
					background: rgba(0, 0, 0, .6);
					border-top-left-radius: 28rpx;
					border-bottom-left-radius: 28rpx;
					font-size: 24rpx;
					text-align: center;
					line-height: 56rpx;
					color: #fff;
					// .setbg(134rpx, 56rpx, 'recode_icon.png');
				}

				.choiceTime {
					position: absolute;
					bottom: 414rpx;
					text-align: center;
					font-size: 24rpx;
					color: #FFFFFF;
					background: #035E8A;
					height: 60rpx;
					width: 356rpx;
					border-radius: 30rpx;
					line-height: 60rpx;
					left: 50%;
					 margin-left: -175rpx;
					 padding-right: 25rpx;

					.times {
						display: inline-block;
						color: #FA8845;
						margin: 0 10rpx;
					}
				}
			}

			.btnBackV {
				position: absolute;
				bottom: 235rpx;
				display: flex;
				width: 100%;
				// background: #007AFF;
				text-align: center;
				
				.shareFiedv {
					margin-left: 42rpx;
					.setbg(311rpx, 109rpx, 'sFiedv.png');
				}

				.goGirldv {
					margin-left: 42rpx;
					.setbg(311rpx, 109rpx, 'goGirldv.png');
				}
				&.btnOne{
					justify-content: center;
					.goGirldv{
						margin-left: auto;
						margin:0 auto;
					}
				}
			}


			.titleK {
				position: relative;
				margin-bottom: 34rpx !important;
				color: #FA8845 !important;
				font-size: 32rpx;

				&::before {
					position: absolute;
					left: 42rpx;
					top: 10rpx;
					width: 186rpx;
					height: 13rpx;
					content: '';
					.setbg(186rpx, 13rpx, 'recode_new_icon_l1.png');
				}

				&::after {
					position: absolute;
					right: 42rpx;
					top: 10rpx;
					width: 186rpx;
					height: 13rpx;
					content: '';
					.setbg(186rpx, 13rpx, 'recode_new_icon_22.png');
				}
			}

			.girdList {
				margin-top: -160rpx;
			}

			.list {
				padding: 0 32rpx 20rpx;
				position: relative;
				margin-bottom: 20rpx;

				.invite {
					margin: 0 auto;
					.setbg(686rpx, 102rpx, 'invite_btn_210712.png');
					margin-bottom: 60rpx;
				}

				
			}

			.gridlist {
				margin-top: -160rpx;
				padding: 0 32rpx 20rpx;
				background: #eef1f5;
				margin-bottom: 20rpx;

				.invite {
					margin: 0 auto;
					.setbg(686rpx, 102rpx, 'invite_btn_210712.png');
					margin-bottom: 60rpx;
				}

				.inviteRecord {

					color: #333333;
					padding: 40rpx 20rpx 30rpx;
					background: #ffffff;
					border-radius: 10rpx;

					.title {
						text-align: center;
						font-size: 32rpx;
						line-height: 32rpx;
						margin-bottom: 20rpx;
						color: #FA8845;
					}

					.item {
						height: 112rpx;
						line-height: 112rpx;
						background: #eef1f5;
						margin-bottom: 20rpx;
						box-sizing: border-box;
						padding: 20rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						border-radius: 10rpx;

						&>view {
							display: inline-block;
						}

						.imgView {
							width: 72rpx;
							height: 72rpx;

							.img {
								width: 100%;
								height: 100%;
								border-radius: 50%;
							}
						}

						.name {
							font-size: 30rpx;
							width: 232rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}

						.time {
							color: #999999;
							font-size: 24rpx;
						}
					}

					.nodata {
						border-radius: 10rpx;
						margin-bottom: 20rpx;
						background: #eef1f5;
						height: 212rpx;
						line-height: 212rpx;
						font-size: 28rpx;
						color: #999999;
						text-align: center;
					}

					.more {
						color: #999999;
						text-align: center;
						font-size: 24rpx;
					}
				}
			}



			
			.mbt14 {
				// margin-bottom: 14rpx;
			}
		}

		.lotteryDialog {
			position: fixed;
			z-index: 9999;
			height: 100vh;
			width: 100%;
			background: rgba(0, 0, 0, .3);

			.dialogContainer {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				.setbg(560rpx, 570rpx, 'lottery_dialog_bg.png');

				.tTitle {

					position: absolute;
					top: 120rpx;
					left: 50%;
					transform: translateX(-50%);
					color: #fff;
					font-size: 32rpx;
				}

				.tBody {
					position: absolute;
					left: 40rpx;
					top: 190rpx;
					width: 480rpx;

					&.tBody2 {
						top: 210rpx;
					}

					.przie-name {
						width: 100%;
						height: 215rpx;
						font-size: 44rpx;
						text-align: center;
						line-height: 215rpx;
						font-weight: bold;
						color: #fff;
					}

					&.gotPrize {
						.setbg(480rpx, 164rpx, 'coupon_icon.png');
					}

					.funnyIcon {
						position: absolute;
						.setbg(112rpx, 112rpx, 'funny_icon.png');
						left: 50%;
						transform: translateX(-50%);
						text-align: center;
						width: 112rpx;
					}

					.thxA {
						position: absolute;
						top: 130rpx;
						left: 50%;
						transform: translateX(-50%);
						color: #ffffff;
					}

					.amountBox {
						font-size: 32rpx;
						line-height: 44rpx;
						color: #ed2c2c;
						font-weight: 700;
						height: 72rpx;

						position: absolute;
						top: 40rpx;
						left: 40rpx;

						.iconK {
							display: inline-block;
						}

						.amount {
							display: inline-block;
							font-size: 50rpx;
						}
					}

					.time {
						position: absolute;
						left: 40rpx;
						bottom: 40rpx;
						color: #AB6C2C;
						font-size: 20rpx;

					}

					.lotteryType {
						font-size: 28rpx;
						color: #AB6C2C;
						position: absolute;
						top: 50rpx;
						right: 30rpx;
						text-align: center;

						&.long {
							right: 12rpx;
						}
					}
				}

				.tFoot {
					button {
						position: absolute;
						bottom: 30rpx;
						border-radius: 40rpx;
						font-size: 32rpx;
						height: 80rpx;
						width: 238rpx;
						font-weight: 700;

						&.left {
							left: 30rpx;
							background: transparent;
							border: 1px solid #FFF4CC;
							box-sizing: border-box;
							color: #FFF4CC;
						}

						&.right {
							right: 30rpx;
							border: #FFF4CC 1px;
							background: linear-gradient(-90deg, #FFDF6C, #FFF4CC);
							color: #ED2C2C;
						}
						&.btn-yellow{
							border: #FFF4CC 1px;
							background: linear-gradient(-90deg, #FFDF6C, #FFF4CC);
							color: #ED2C2C;
						}
						&.btn1 {
							width: 420rpx;
							height: 80rpx;
							left: 50%;
							transform: translateX(-50%);
						}
					}
				}

				.closeBtn {
					position: absolute;
					bottom: -80rpx;
					left: 50%;
					transform: translateX(-50%);
					.setbg(64rpx, 64rpx, 'lottory_close_btn.png');
				}
			}
		}

		.girdDialog {
			position: fixed;
			z-index: 99999;
			height: 100vh;
			width: 100%;
			background: rgba(0, 0, 0, .3);

			.dialogContainer {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				.setbg(561rpx, 570rpx, 'grid_dialog_bg.png');

				.tTitle {
					white-space: nowrap;
					// background: #007AFF;
					position: absolute;
					top: 35rpx;
					left: 50%;
					transform: translateX(-50%);
					color: #fff;
					font-size: 40rpx;
					font-weight: 800;
				}

				.tBody {
					position: absolute;
					left: 40rpx;
					top: 190rpx;
					width: 480rpx;
					color: #fff;

					&.tBody2 {

						top: 210rpx;
					}

					.przie-name {
						width: 100%;
						height: 215rpx;
						font-size: 30rpx;
						text-align: center;
						line-height: 215rpx;
						font-weight: 800;
						text-align: center;
						color: #333333;
						padding-top: 65rpx
					}

					&.gotPrize {
						.setbg(480rpx, 164rpx, 'coupon_icon.png');
					}

					.funnyIcon {
						position: absolute;
						.setbg(112rpx, 112rpx, 'funny_icon.png');
						left: 50%;
						transform: translateX(-50%);
						// text-align: center;
						top: -30rpx;
						width: 112rpx;
					}


					.funnyPrizeIcon {
						position: absolute;
						left: 50%;
						transform: translateX(-50%);
						// text-align: center;
						top: -30rpx;
						width: 124rpx;
						height: 160rpx;
					}

					.thxA {
						position: absolute;
						top: 110rpx;
						left: 50%;
						transform: translateX(-50%);
						font-size: 40rpx;

						// font-family: changan uni type, changan uni type-Bold;
						font-weight: 800;
						text-align: center;
						color: #333333;
						line-height: 42rpx;
					}

					.amountBox {
						font-size: 32rpx;
						line-height: 44rpx;
						color: #ed2c2c;
						font-weight: 700;
						height: 72rpx;

						position: absolute;
						top: 40rpx;
						left: 40rpx;

						.iconK {
							display: inline-block;
						}

						.amount {
							display: inline-block;
							font-size: 50rpx;
						}
					}

					.time {
						position: absolute;
						left: 40rpx;
						bottom: 40rpx;
						color: #AB6C2C;
						font-size: 20rpx;

					}

					.lotteryType {
						font-size: 28rpx;
						color: #AB6C2C;
						position: absolute;
						top: 50rpx;
						right: 30rpx;
						text-align: center;

						&.long {
							right: 12rpx;
						}
					}
				}

				.tFoot {
					button {
						position: absolute;
						bottom: 30rpx;
						border-radius: 40rpx;
						font-size: 32rpx;
						height: 80rpx;
						width: 238rpx;
						font-weight: 700;

						&.left {
							left: 30rpx;
							.setbg(247rpx, 91rpx, 'giTDetail.png');
							// background: transparent;
							// border: 1px solid #FFF4CC;
							// box-sizing: border-box;
							// color: #FFF4CC;
						}

						&.right {
							right: 30rpx;
							.setbg(247rpx, 91rpx, 'giTonext.png');
							// border: #FFF4CC 1px;
							// background: linear-gradient(-90deg, #FFDF6C, #FFF4CC);
							// color: #ED2C2C;
						}
						&.btn-yellow{
							bottom: 40rpx !important;
							width: 247rpx;
							height: 80rpx;
							line-height: 80rpx;
							left: 50%;
							transform: translateX(-50%);
							border: #FFF4CC 1px;
							background: linear-gradient(-90deg, #FFDF6C, #FFF4CC);
							color: #ED2C2C;
						}
						&.btn1 {
							bottom: 40rpx !important;
							width: 431rpx;
							height: 91rpx;
							left: 50%;
							.setbg(431rpx, 91rpx, 'lottory_nextgo.png');
							transform: translateX(-50%);
						}
					}
				}

				.closeBtn {
					position: absolute;
					bottom: -80rpx;
					left: 50%;
					transform: translateX(-50%);
					.setbg(64rpx, 64rpx, 'lottory_close_btn1.png');
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







	}
	.lottery-bg{
		position: absolute;
		left:0;
		top: 0;
		visibility: hidden;
		opacity: 0;
	}
	.loading{
		position: fixed;
		z-index: 999;
		left:0;
		top: 0;
		width: 100%;
		height: 100%;
	}
</style>


