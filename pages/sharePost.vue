<template>
	<view class="content">
		<page-top :background="'#fff'" :titleys="'#000'" :btnys="''" :title="'活动详情' " :noShowHouse="sourceUserId">
		</page-top>
		<canvas class="canvas" canvas-id="myCanvas" id="myCanvas"
			:style="'width:' +  width + 'px'  + ';height:' + height + 'px'"></canvas>
		<button class="btn" @tap='saveDraw()'>保存图片</button>
	</view>
</template>

<script>
	import pageTop from '@/components/pageTop/pageTop'
	import api from '@/public/api/index'
	import domain from '@/configs/interface';
	export default {
		components: {
			'page-top': pageTop,
		},
		data() {
			return {
				shareUrl: '',
				context: '',
				wxUserInfo: '',
				src: '',
				dpr1: '',
				width: '',
				height: '',
				scene1:''
			}
		},
		mixins: [],
		async onLoad(options) {
            this.scene1 = decodeURIComponent(options.scene1)
			this.shareUrl = decodeURIComponent(options.shareUrl)
			console.log( this.scene1,this.shareUrl)
			this.dpr1 = uni.getSystemInfoSync().pixelRatio
			this.width = this.dpr(270)
			this.height = this.dpr(480)
			this.wxUserInfo = uni.getStorageSync('wxUserInfo')
			this.context = uni.createCanvasContext('myCanvas')
			// this.context.scale(this.dpr1 , this.dpr1 );
			
			this.draw()



		},
		onHide() {

		},
		methods: {
			draw() {
				var that = this
				if(this.shareUrl.substring(0, 5) != "https"){
				   this.shareUrl = this.shareUrl.replace('http','https')
				}
				console.log('开始下载', this.shareUrl.trim())
				uni.showLoading({
					title: '正在加载...'
				})
				// 背景
				uni.downloadFile({
					url: this.shareUrl.trim(),
					success: function(res) {
						that.canvasShow = true
						uni.hideLoading()
						console.log('下载成功', res)
						// that.imageURL = res.tempFilePath
						that.context.save()
						that.context.beginPath()
						that.context.drawImage(res.tempFilePath, 0, 0, that.dpr(270), that.dpr(480))
						that.context.setFillStyle('#FFFFFF')
						that.context.setFontSize(12)
						let name = that.wxUserInfo.wxName
						if(name.length>9){
							name = name.substr(0,8)
						}
						that.context.fillText(name, that.dpr(57), that.dpr(419))

						that.context.setFontSize(9)
						that.context.fillText('邀请你参与活动啦', that.dpr(57), that.dpr(436))

						that.context.fillText('长按扫码进入', that.dpr(189), that.dpr(463))


						that.context.restore()
						//绘制图片
						that.context.draw(true);
						that.drawHeader()
						that.drawWxQrCode()

					},
					fail(res) {
						uni.hideLoading()
						that.drawHeader()
						console.log('下载失败', res)

					}
				})



			},
			drawHeader() {
				// 头像
				var that = this
				if (that.wxUserInfo.wxHead) {
					uni.downloadFile({
						url: that.wxUserInfo.wxHead.trim(),
						success: function(res) {
							that.canvasShow = true

							console.log('下载成功', res)
							// that.imageURL = res.tempFilePath
							// const ctx = uni.createCanvasContext('myCanvas')
							that.context.save()
							that.context.beginPath()
							that.handleBorderRect(that.context, that.dpr(15), that.dpr(400), that.dpr(38), that
								.dpr(38), that.dpr(19))
							// that.context. arc(0, 0, 0, 0, 2 * Math.PI)
							that.context.clip()
							that.context.drawImage(res.tempFilePath, that.dpr(15), that.dpr(400), that.dpr(38),
								that.dpr(38))
							that.context.restore()
							//绘制图片
							that.context.draw(true);

						},
						fail(res) {

							console.log('下载失败', res)

						}
					})
				}
			},

			async drawWxQrCode() {
				var that = this  
				let page = 'pages/lbActivity'
				
				//id=69&lotteryType=grid&type=wawaji&actSelect=1&sourceUserId=66
			    this.scene1 =this.scene1.replace('/pages/lbActivity?','')
				this.scene1 =this.scene1.replace('type','tt')
				this.scene1 =this.scene1.replace('lotteryType','ll')
				this.scene1 =this.scene1.replace('id','dd')
				this.scene1 =this.scene1.replace('grid','gg')
				this.scene1 =this.scene1.replace('wawaji','ww')
				this.scene1 =this.scene1.replace('actSelect','aa')
				this.scene1 =this.scene1.replace('sourceUserId','ss')
				console.log(this.scene1,this.scene1.length)
				let scene = encodeURIComponent(this.scene1)
				
				
				
				
				
				
				console.log('scene',scene)
				let url = `https://ccar.pcauto.com.cn/api/xcx/base/createWxQrCode?scene=${scene}&page=${page}`
				if (domain.getCurrentEnv() == 1) {
					url = `https://devqd-changan.pcauto.com.cn/api/xcx/base/createWxQrCode?scene=${scene}&page=${page}`
				}
				uni.downloadFile({
					url: url,
					success: function(res) {
						that.canvasShow = true

						console.log('下载成功', res)
						// that.imageURL = res.tempFilePath
						// const ctx = uni.createCanvasContext('myCanvas')
						that.context.save()
						that.context.beginPath()
						that.handleBorderRect(that.context, that.dpr(178.5), that.dpr(374), that.dpr(73.5),
							that.dpr(73.5), that.dpr(36.75))
						// that.context. arc(0, 0, 0, 0, 2 * Math.PI)
						that.context.clip()
						that.context.drawImage(res.tempFilePath, that.dpr(178.5), that.dpr(374), that.dpr(
							73.5), that.dpr(73.5))
						that.context.restore()
						//绘制图片
						that.context.draw(true);

					},
					fail(res) {

						console.log('下载失败', res)

					}
				})





			},

			handleBorderRect(ctx, x, y, w, h, r, color) {
				ctx.beginPath();
				// 左上角
				ctx.arc(x + r, y + r, r, Math.PI, 1.5 * Math.PI);
				ctx.moveTo(x + r, y);
				ctx.lineTo(x + w - r, y);
				ctx.lineTo(x + w, y + r);
				// 右上角
				ctx.arc(x + w - r, y + r, r, 1.5 * Math.PI, 2 * Math.PI);
				ctx.lineTo(x + w, y + h - r);
				ctx.lineTo(x + w - r, y + h);
				// 右下角
				ctx.arc(x + w - r, y + h - r, r, 0, 0.5 * Math.PI);
				ctx.lineTo(x + r, y + h);
				ctx.lineTo(x, y + h - r);
				// 左下角
				ctx.arc(x + r, y + h - r, r, 0.5 * Math.PI, Math.PI);
				ctx.lineTo(x, y + r);
				ctx.lineTo(x + r, y);
				if (color) {
					ctx.fillStyle = color;
				}
				ctx.fill();
				ctx.closePath();
			},

			saveDraw() {
				setTimeout(() => {
					var that = this
					uni.canvasToTempFilePath({
						canvasId: 'myCanvas',
						success: function(res) {
							console.log('绘制', res);
							wx.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success(res) {
									that.$toast('保存成功')
									console.log(res.errMsg)
								},
								fail(err) {
									that.$toast('保存失败请稍后再试')
									console.log(err)
								}
							})
						},
						fail: function(res) {
							console.log('绘制', res);

						}
					})
				}, 500)
			},
			dpr(w) {
				return this.dpr1 > 2.0 ? 1.2 * w : w
			}

		}
	}
</script>

<style>
	.content {
		margin: auto;
		text-align: center;
	}

	.canvas {
		/* background: #007AFF; */
		margin: auto;


	}

	.btn {
		margin-left: 135rpx;
		margin-top: 60rpx;
		color: #FFFFFF;
		width: 480rpx;
		height: 88rpx;
		opacity: 1;
		background: #fa843f;
		border-radius: 44rpx;
	}
</style>
