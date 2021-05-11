<template>
	<view>
		<plinput ref="plinput" @add-pl="addpl"></plinput>
		<scroll-view class="scroll-view" lower-threshold="350" @scrolltolower="scrollGetData" scroll-y="true" scroll-with-animation="true"
		 @scroll="scroll">
			<button v-if="isUserInfoPage" class="getUserInfo_name_info_mask_body" lang="zh_CN" @getuserinfo="getWxUserInfoButton"
			 open-type="getUserInfo"></button>
			<loading ref="loading"></loading>
			<canvas id='myCanvas' canvas-id="myCanvas" />
			<view class="zw-top-fix" :style="'height:' + topHeight + 'px'"></view>
			<!-- <getFormidbox> -->
			<view class="content">
				<page-top @getTopNavHeigth="getTopNavHeigth" :background="'none'" :titleys="'#fff'" :btnys="'white pageTop-absolute'" :title.sync="title"></page-top>
				<view class="banner" :style="'margin-top:' + -1*topHeight + 'px'">
					<image class="banner-image" :src="headInfo.homePic" mode="widthFix" lazy-load="true"></image>
					<view class="banner-text" :style="'margin-top:' + topHeight/3 + 'px'">
						<view class="tit">#{{headInfo.themeName}}#</view>
						<view class="number">{{headInfo.dynamicCount}}人参与</view>
						<view class="desc">{{headInfo.introduce}}</view>
					</view>
				</view>
				<dynamic ref="dynamic" :themeId.sync="themeId" @changeLoading="changeLoading" @xianshi="plinputxianshi"></dynamic>
				<view v-if="isBottomShow" class="zw-bottom-fix"></view>
			</view>
			<!-- </getFormidbox> -->
		</scroll-view>
		<block v-if="isbtnshow">
			<view class="share-button">
				邀请好友一起聊
				<button open-type="share" plain="true"></button>
			</view>
			<view class="right-btn" @tap="toputDynamic">我也说两句</view>
		</block>
	</view>
</template>

<script>
	import plinput from '@/components/plinput/plinput'
	import pageTop from '@/components/pageTop/pageTop'
	import dynamic from '@/components/dynamic/dynamic'
	import login from '@/units/login'
	import api from '@/public/api/index'
	import shouquan from '@/units/shouquan'

	const app = getApp()
	const ctx = uni.createCanvasContext('myCanvas')
	export default {
		components: {
			dynamic,
			plinput,
			'page-top': pageTop
		},
		mixins: [shouquan],
		data() {
			return {
				from: "",
				shareImage: '',
				isbtnshow: true,
				isBottomShow: true,
				title: '热门话题',
				topHeight: 0,
				themeId: "",
				headInfo: {},
			}
		},
		async onLoad(options) {
			await login.login()
			this.themeId = options.themeId
			this.from = options.from || ''
			let {
				data
			} = await api.getThemeData(this.themeId)
			console.log(data)
			this.headInfo = data
			if (data.status != 2) {
				let duration = 2000
				uni.showToast({
					title: '该话题已关闭，无法查看',
					icon: 'none',
					mask: true,
					duration: duration
				})
				setTimeout(() => {
					let url = '/pages/autoTribe'
					if (this.from == 'share') {
						url = '/pages/autoTribe'
					}
					uni.reLaunch({
						url
					})
				}, duration)
				return false
			}
			this.$nextTick(function(){
				this.$refs.dynamic.startGetData(this.themeId)
				this.drawShareImage()
			})
			uni.$on('dynamic-list-none', function() {
				this.isbtnshow = false
				this.isBottomShow = false
			})
		},
		onUnload() {
			uni.$off('dynamic-list-none', function() {})
		},
		onShow(){
		},
		onShareAppMessage() {
			let title = '这个话题很有趣，一起来看看？'
			let path = `pages/authorization?to=ztdetails&themeId=${this.themeId}&from=share`
			return {
				title: title,
				path: path,
				imageUrl: this.shareImage
			}
		},
		methods: {
			addpl(obj){
				this.$refs.dynamic.addpl(obj)
			},
			plinputxianshi(obj,ly){
				this.$refs.plinput.xianshi(obj,ly)
			},
			changeLoading(type = false) {
				this.$refs.loading.changeLoading(type)
			},
			getTopNavHeigth(h){
				console.log('getTopNavHeigth================================',h)
				this.topHeight = h
			},
			scroll(event) {
				let {
					scrollTop
				} = event.detail
			},
			scrollGetData() {
				this.$refs.dynamic.scrollGetData()
			},
			toputDynamic() {
				let url = `/pages/putDynamic?themeId=${this.themeId}`
				uni.navigateTo({
					url
				})
			},
			async drawShareImage() {
				let that = this
				console.log('homePic', this.headInfo.homePic)
				let {
					path
				} =	await (function(){
					return new Promise((resolve, reject) => {
						uni.getImageInfo({
							src: that.headInfo.homePic,
							success: (res) => {
								// console.log('getImageInfo', res)
								if (res.statusCode === 200) {
									resolve(res)
								}
							}
						})
					}) 
				})();
				console.log('path', path);
				ctx.drawImage(path, 0, 0, 420, 263)
				ctx.setTextAlign('center')
				let themeNameTop = 308
				if (this.headInfo.dynamicCount > 0) {
					ctx.setFontSize(12)
					ctx.setFillStyle('#999')
					ctx.fillText(this.headInfo.dynamicCount + '人参与', 210, 344)
				} else {
					themeNameTop = 316
				}
				ctx.setFontSize(44)
				ctx.setFillStyle('#000')
				ctx.fillText('#' + this.headInfo.themeName + '#', 210, 308)
				ctx.save()
				ctx.draw(false, () => {
					uni.canvasToTempFilePath({
						canvasId: 'myCanvas',
						fileType: "jpg",
					}).then(res => {
						let {
							tempFilePath
						} = res
						this.shareImage = tempFilePath
						console.log('shareImageURL', tempFilePath)
						// console.log(tempFilePath)
					})
				})
				// console.log(path)
			}
		}
	}
</script>

<style lang="less">
	@import '@/static/less/public.less';

	.scroll-view {
		.pa(0, 0);
		width: 100%;
		height: 100%;
	}

	.content {
		position: relative;
		z-index: 9;
	}

	.banner {
		font-size: 0;
		position: relative;

		&:before {
			display: block;
			content: "";
			.pa(0, 0);
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, .5);
		}

		&-image {
			width: 750rpx;
		}

		&-text {
			.pa(32rpx, 50%);
			transform: translate(0, -50%);
		}

		.tit {
			padding: 15rpx 0;
			.seth(53rpx, 46rpx, #fff);
			height: auto;
			.fb;
		}

		.number {
			padding: 10rpx 0;
			.seth(41rpx, 24rpx, #dedede);
			height: auto;
			margin-bottom: 32rpx;
		}

		.desc {
			.seth(44rpx, 28rpx, #fff);
			width: 680rpx;
			height: auto;
		}
	}

	.none-icon {
		.setbg(406rpx, 292rpx, 'dynamic-none-data-icon.png');
		margin: 84rpx auto 0;
	}

	.none-text {
		color: #999;
		display: block;
		font-size: 28rpx;
		line-height: 42rpx;
		margin-top: 38rpx;
		.tc;
	}

	.none-btn {
		width: 460rpx;
		.tc;
		.fb;
		.seth(88rpx, 32rpx, #fff);
		background: #ce1330;
		margin: 42rpx auto 0;
		border-radius: 88rpx;
	}

	.dynamic-box {
		margin-bottom: 0;
		border-bottom: 12rpx solid #f0f2f7;
	}

	.zw-bottom-fix {
		height: 100rpx;
	}

	.share-button {
		position: fixed;
		left: 0;
		bottom: 0;
		.seth(100rpx, 32rpx, #fff);
		.fb;
		.tc;
		background: #ce1330;
		width: 496rpx;
		z-index: 11;

		button {
			.pa(0, 0);
			width: 100%;
			height: 100%;
		}
	}

	.right-btn {
		position: fixed;
		right: 0;
		bottom: 0;
		width: 256rpx;
		.seth(100rpx, 32rpx, #fff);
		.fb;
		.tc;
		background: #f98100;
		z-index: 11;
	}

	.zw-top-fix {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		z-index: 10;
		background: #fff;
		display: none;
	}


	#myCanvas {
		position: absolute;
		left: -420px;
		top: -356px;
		width: 420px;
		height: 356px;
	}
</style>
