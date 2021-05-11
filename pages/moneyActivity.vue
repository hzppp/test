<template>
	<view class="moneyActivity">
		<page-top ref="pagetop" :background="'#fff'" :titleys="'#000'" :btnys="''" :title="'新春送福气'"></page-top>
		<!-- <button v-if="{{isUserInfoPage}}" class="getUserInfo_name_info_mask_body" lang="zh_CN" @getuserinfo="getWxUserInfoButton" open-type="getUserInfo"></button> -->
		<view class="fix-share-btn">
			<button class="zx-btn" open-type="getUserInfo" plain="true" @getuserinfo="getWxUserInfoButton" v-if="isUserInfoPage"></button>
			<view v-else class="zx-btn" @tap="sharePopShow"></view>
			<button class="share-btn" hover-class="none" open-type="share" plain="true"></button>
		</view>
		<!-- 福卡弹窗 -->
		<canvas id='myCanvas' canvas-id="myCanvas" :style="'height:' + canvasHeight + 'px'" />
		<view class="mask" v-if="issharepopShow" @tap="sharePopHide"></view>
		<view class="shareFiend" v-if="issharepopShow">
			<image mode="widthFix" class="saveImg" :src="saveURL"></image>
			<view class="bottom-btn">
				<button class="sharePic" hover-class="none" open-type="share" plain="true"></button>
				<view class="savePic" @tap="saveImageToPhotosAlbum"></view>
			</view>
			<view class="tryAgain" @tap="sharePopHide">再抽一遍</view>
		</view>
		<!-- 抽奖弹窗 -->
		<view class="mask" v-if="isPrizepopShow" @tap="prizePopHide"></view>
		<view class="prize" v-if="isPrizepopShow">
			<view class="prizeBtn">
				<button class="drawPrize" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" v-if="!phone"></button>
				<view v-else class="drawPrize" @tap="toPrizePage"></view>
				<view class="QuickPrize" @tap="prizePopHide"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import login from '@/units/login'
	import api from '@/public/api/index'
	import shouquan from '@/units/shouquan'
	import domain from '@/configs/interface'

	// import formpop from '@/components/formpop/formpop'
	import pageTop from '@/components/pageTop/pageTop'
	// import shareSuccess from '@/components/shareSuccess/shareSuccess'
	let app = getApp()
	const ctx = uni.createCanvasContext('myCanvas')

	export default {
		components: {
			'page-top': pageTop,
		},
		mixins: [shouquan],
		data() {
			return {
				phone: false,
				canvasCode: '',
				number: 0,
				saveURL: '',
				isdrawIng: false,
				issharepopShow: false,
				canvasHeight: '',
				isPrizepopShow: false,
			}
		},
		async onLoad() {
			if (app.Interval) {
				clearInterval(app.Interval)
				console.log('----------------', this.Interval)
			}
			await login.login()
			let pocketUserInfo = await api.getPocketUserInfo()
			this.phone = app.globalData.pocketUserInfo.phone
			console.log('isUserInfoPage', this.isUserInfoPage)
			
			let that = this
			uni.onNetworkStatusChange(function(res) {
				let {
					isConnected
				} = res
				console.log('isConnected', isConnected)
				if (!isConnected) {
					uni.showToast({
						title: '当前无网络连接',
						icon: 'none',
						duration: 1500
					})
				} else {
					that.start()
				}
			})
		},
		onShareAppMessage() {
			let that = this
			if (that.issharepopShow == true) {
				that.issharepopShow = false
				that.isPrizepopShow = true
			}
			let imageUrl = 'https://www1.pcauto.com.cn/gz/20190715/dazhong/420-336.png'
			let shareObj = {
				title: "奥迪东海汇牛年来送福气啦~更有丰厚礼品等你抢哦",
				path: 'pages/authorization?to=moneyActivity',
				imageUrl: 'https://www1.pcauto.com.cn/zt/gz20210125/audi/xcx/img/xcxshare.png',
			}
			return shareObj;
		},
		methods: {
			sharePopShow() {
				this.startCanvas()
			},
			async getWxUserInfoButton(e) {
				let {
					detail = {}
				} = e
				if (detail.errMsg.indexOf("ok") > -1) {
					console.log('成功授权,来源按钮')
					// this.setWxUserInfo(detail)
					app.globalData.wxUserInfo = detail
					this.isUserInfoPage = false
					app.globalData.isUserInfoPage = false
					this.startCanvas()
					
				} else {
					uni.showToast({
						title: '需授权后才可参与',
						icon: 'none',
						duration: 1500
					})
				}

			},
			saveImageToPhotosAlbum(e) {
				var that = this;
				uni.saveImageToPhotosAlbum({
					filePath: that.saveURL,
					success(res) {
						console.log(res)
						uni.showToast({
							title: '图片已保存到相册',
							icon: 'none',
							duration: 2000
						})
						// that.saveURL = ''
						that.issharepopShow = false
						that.isPrizepopShow = true
						
					},
					fail(res) {
						console.log(res);
						uni.showToast({
							title: "图片保存失败，请重新授权",
							icon: "none",
							duration: 2000
						})
						that.issharepopShow = false
						that.isPrizepopShow = true
					}
				})
			},
			//跳转对吧页面
			toPrizePage() {
				this.towebView()
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
					this.towebView()
					
				} else {
					uni.showToast({
						title: '需要授权后才能报名',
						icon: 'none',
						duration: 1500
					})
				}

			},
			sharePopHide() {
				this.canvasCode = ''
				this.number = 0
				this.saveURL = ''
				this.isdrawIng = false
				this.canvasHeight = ''
				this.issharepopShow = false
				
			},
			prizePopHide() {
				this.canvasCode = ''
				this.number = 0
				this.saveURL = ''
				this.isdrawIng = false
				this.canvasHeight = ''
				this.issharepopShow = false
				this.isPrizepopShow = false
				
			},
			changeHead(type) {
				let currentURL = app.globalData.getUserData.wxHead || app.globalData.pocketUserInfo.avatarUrl
				let list = this.dynamic.likeHead
				let i = list.indexOf(currentURL)
				if (type == 1) { //取消点赞
					if (i > -1) {
						this.dynamic.likeHead.splice(i, 1)
					}
				} else {
					this.dynamic.likeHead.unshift(currentURL)
				}
				console.log(currentURL, list, i)
				
			},
			loadImg(url, name, vurl) {
				let that = this;
				console.log(url);
				url = url.replace("http:", "https:")
				let p = new Promise(function(resolve, reject) {
					uni.getImageInfo({
						src: url,
						success: function(res) {
							if (name || name == "0") {
								res.name = name;
							}
							if (vurl) {
								res.head2 = vurl;
							}
							that.number++;
							console.log(that.number)
							resolve(res)
						}
					})
				})
				return p;
			},
			drawHead(w = 30, x = 0, y = 0, url) {
				// 头像
				let avatarurl_width = w; //绘制的头像宽度
				let avatarurl_heigth = w; //绘制的头像高度
				let avatarurl_x = x; //绘制的头像在画布上的位置
				let avatarurl_y = y; //绘制的头像在画布上的位置
				ctx.save();
				ctx.beginPath();
				ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2,
					false);
				ctx.clip();
				ctx.drawImage(url, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth);
				ctx.restore();
			},
			save() {
				console.log('save')
				let that = this;
				uni.canvasToTempFilePath({
					canvasId: 'myCanvas',
					fileType: "png",
					success: function(res) {
						that.saveURL = res.tempFilePath
						that.shareImagePopShow()
						console.log(that.saveURL)
						// uni.hideLoading()
						
					}
				})
			},
			shareImagePopShow() {
				uni.hideLoading()
				this.issharepopShow = true
			},
			async start() {
				this.canvasCode = ''
				this.number = 0
				this.saveURL = ''
				this.isdrawIng = false
				this.canvasHeight = ''
				
			},
			async startCanvas() {
				if (this.saveURL) {
					this.shareImagePopShow()
					return false
				}
				if (this.isdrawIng) { //正在画图中
					console.log('正在画图中')
					return false
				}
				uni.showLoading({
					title: '福气生成中...',
				})
				this.isdrawIng = true
				let url = `${domain.DOMAIN.host}/api/audi/qrcode/unlimited?sceneId=gh_dd83231d4d16&sence=to=xcsfq`
				console.log(url)
				let da = await uni.downloadFile({
					url: url,
				})
				this.canvasCode = da.tempFilePath
				console.log('tempFilePath', da.tempFilePath)

				// 背景 10张背景图片随机生成一张
				let num = Math.floor(Math.random() * 12 + 1)
				console.log('图片num', num)
				let bgurl = `https://www1.pcauto.com.cn/gz/20190715/dazhong/activity_share_bg_${num}.png`
				let bgURL = await this.loadImg(bgurl)

				bgURL = bgURL.path
				// 头像
				let wxHead = await this.loadImg(app.globalData.wxUserInfo.userInfo.avatarUrl)
				wxHead = wxHead.path
				// 开始画

				this.canvasHeight = 916
				
				ctx.drawImage(bgURL, 0, 0, 560, 916) //画背景
				this.drawHead(86, (560 - 86) / 2, 770, this.canvasCode) //画二维码
				this.drawHead(88, 236, 38, wxHead) //头像
				// 昵称
				ctx.setFontSize(28)
				ctx.setFillStyle("#fff")
				var textW = ctx.measureText(app.globalData.wxUserInfo.userInfo.nickName).width;
				ctx.fillText(app.globalData.wxUserInfo.userInfo.nickName, (560 - textW) / 2, 160)

				// 二维码旁边文字        
				ctx.setFontSize(24);
				ctx.setFillStyle('#ffe0b4');
				var textW2 = ctx.measureText('长按扫码生成你的福卡').width;
				ctx.fillText('长按扫码生成你的福卡', (560 - textW2) / 2, 890);


				// 生成图片
				ctx.draw(false, () => {
					this.save()
				})
			},
			towebView() {
				let redirect = {
					'redirect': 'https://65447.activity-1.m.duiba.com.cn/hdtool/index?id=3741089&dbnewopen'
				}
				api.getMallLink(redirect).then(res => {
					let vurl = escape(res.data)
					let url = `/pages/webview?webURL=${vurl}`
					uni.navigateTo({
						url
					})
					console.log('MallLink', url)
				})
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

	.moneyActivity {
		.setbg(750rpx, 1643rpx, 'money_activity_bg.jpg');
		position: relative;
		overflow: hidden;
	}

	.fix-share-btn {
		position: absolute;
		width: 100%;
		left: 50%;
		margin-left: -333rpx;
		top: 865rpx;
		.setbg(666rpx, 194rpx, 'luck_draw_btn.png');

		.zx-btn {
			width: 100%;
			height: 111rpx;
			margin-top: 17rpx;
			opacity: 0;
		}

		.share-btn {
			height: 66rpx;
			width: 100%;
		}
	}

	.mask {
		z-index: 100;
	}

	canvas {
		width: 560px;
		height: 916px;
		z-index: 100;
		position: absolute;
		left: -750px;
		top: 0;
	}

	.shareFiend {
		position: fixed;
		z-index: 100;
		top: calc(50% + 64rpx);
		left: 50%;
		transform: translateX(-50%)translateY(-50%);
	}

	.saveImg {
		width: 560rpx;
		// position: absolute;

	}

	.shareFiend {
		text-align: center;
	}

	.bottom-btn {
		.setbg(560rpx, 80rpx, 'bottom-btn.png');
		display: flex;
		justify-content: space-between;
		margin: 40rpx auto 0;
	}

	.savePic,
	.sharePic {
		width: 268rpx;
		height: 80rpx;
	}

	.tryAgain {
		font-size: 28rpx;
		color: #ffffff;
		margin-top: 30rpx;
		height: 48rpx;
		line-height: 48rpx;

	}

	//抽奖弹窗
	.prize {
		position: fixed;
		left: 95rpx;
		top: calc(50% + 64rpx);
		width: 560rpx;
		height: 782rpx;
		margin-top: -391rpx;
		.setbg(560rpx, 782rpx, 'luck_draw_bg.png');
		z-index: 101;

		.prizeBtn {
			.pa(9.5rpx;
			600rpx);
			.setbg(541rpx, 153rpx, 'prize_btn.png');
		}

		.drawPrize {
			width: 100%;
			height: 88rpx;
			margin-top: 17rpx;
			opacity: 0;
		}

		.QuickPrize {
			height: 66rpx;
			width: 100%;
		}
	}
</style>
