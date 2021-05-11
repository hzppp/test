<template>
	<view :class="'vrModule '+ noneImage">
		<view class="loading" v-if="isLoading">
			<view class="loading-content">
				<image class="loading-image" :style="'left:' + loadingNumber" :src="loadImageUrl" mode="scaleToFill" lazy-load="false"></image>
				<view class="jd">
					<view class="jd-dd" :style="'width:' + loadingNumber"></view>
				</view>
				<view class="loading-text">Loading {{loadingNumber}}</view>
			</view>
		</view>
		<view class="image-content" @touchstart="canvasTouchstart" @touchmove="canvasTouchmove" @touchend="canvasTouchend">
			<block v-for="(item,index) in imageList" :key="index">
				<image class="vrImage" :hidden="current != (item.Seq-1)" mode="widthFix" :src="item.Url" @load="imageLoad" />
			</block>
		</view>
		<view :class="'colorlist-ns-link ' + (colorlist.length < 5 ? 'last-item-mr0':'')">
			<view class="colorlist" v-if="colorlist.length>1">
				<view class="prev-btn" @tap="slideItem('prev')"></view>
				<scroll-view class="scroll-view-vr" :scroll-left="scrollLeft" scroll-x scroll-with-animation @scroll="scroll">
					<block v-for="(item,index) in colorlist" :key="index">
						<button class="colorlist-item" @tap="tabVR(index)" :style="'background:#'+item.ColorValue" form-type="submit"
						 plain="true"></button>
					</block>
				</scroll-view>
				<view class="next-btn" @tap="slideItem('next')"></view>
			</view>
			<view class="ns-link" v-if="pano.vurl" @tap="towebView">VR赏车</view>
		</view>
	</view>
</template>

<script>
	import api from '@/public/api/index'
	export default {
		data() {
			return {
				currentIndex: 0,
				noneImage: "",
				isLoading: true,
				vurl: {},
				jtscrollLeft: 0,
				scrollLeft: 0,
				scrollWidth: 0,
				loadingNumber: '0',
				startPosition: [],
				loadImageUrl: '',
				movePosition: [],
				time: [],
				current: 0,
				imageLoadNumber: 0,
				imageList: [],
				colorlist: []
			}
		},
		methods: {
			scroll(e) {
				this.scrollWidth = e.detail.scrollWidth
				this.jtscrollLeft = e.detail.scrollLeft
			},
			slideItem(name) {
				let number = Math.floor(this.scrollWidth / this.colorlist.length) || 30
				let left
				if (name == 'prev') {
					left = this.jtscrollLeft - number
				} else {
					left = this.jtscrollLeft + number
				}
				if (left < 0) {
					left = 0
				}
				if (left > this.scrollWidth && this.scrollWidth != 0) {
					left = this.scrollWidth
				}
				this.scrollLeft = left
			},
			towebView() {
				let vurl = escape(this.pano.vurl)
				let url = `/pages/webview?webURL=${vurl}`
				uni.navigateTo({
					url
				})
			},
			async getImages(id) {
				let {
					appear,
					pano
				} = await api.getPanosInfo2(id)
				console.log('appear', appear)
				this.noneImage = ''
				this.colorlist = appear.allAppearInfo
				if (!this.colorlist) {
					this.$emit('none-vr-image')
				} else {
					this.pano = pano
					this.setImageList(0)
				}
			},
			setbaitu(obj) {
				this.colorlist = [{
					Hori: {
						Normal: [{
							Seq: 1,
							Url: obj.baiPic
						}]
					}
				}]
				if (obj.serialGroupId == 89) {
					this.pano = {
						vurl: 'https://www1.pcauto.com.cn/panorama/1191/tour.html'
					}
				}
				this.noneImage = 'noneImage'

				this.setImageList(0)
			},
			imageLoad() {
				this.isLoading = true
				this.loadingNumber = Math.floor((this.imageLoadNumber / this.imageList.length) * 100) + '%'
				this.imageLoadNumber++
				if (this.imageLoadNumber == this.imageList.length) {
					console.log('image-load-end')
					this.scrollLeft = 1
					setTimeout(() => {
						this.scrollLeft = 0
					}, 100)
					this.isLoading = false;
				}
			},
			canvasTouchstart(e) {
				var arr = e.changedTouches[0]
				this.startPosition = arr
			},
			canvasTouchmove(e) {
				var arr = e.changedTouches[0]
				this.movePosition.push(arr)
				this.time.push(new Date().getTime())
				var len = this.movePosition.length
				var tlen = this.time.length
				if (len > 2) {
					var d = this.movePosition[len - 1]
					var q = this.movePosition[len - 2]
					var x = d.clientX - q.clientX //x轴移动距离
					var j = this.time[tlen - 1] - this.time[tlen - 2] //时间间隔
					if (j > 8) {
						if (x > 0) {
							this.changeCurrent('add')
						}
						if (x < -1) {
							this.changeCurrent()
						}
					}
				}
			},
			canvasTouchend(e) {
				var arr = e.changedTouches[0]
				this.movePosition = []
			},
			tabVR(i) {
				if (i != this.currentIndex) {
					this.currentIndex = i
					this.isLoading = true
					this.loadingNumber = 0
					this.setImageList(i)
				}
			},
			setImageList(i) {
				this.imageLoadNumber = 0
				let indexList
				if (!this.colorlist) {
					this.colorlist = [{
						Hori: {
							Normal: [{}]
						}
					}]
				}
				indexList = this.colorlist[i].Hori.Normal
				if (indexList.length > 12) {
					this.loadImageUrl = indexList[12].Url
				}
				this.imageList = indexList

			},
			changeCurrent(type) {
				if (type == 'add') {
					this.current++
				} else {
					this.current--
				}
				if (this.current > this.imageList.length - 1) {
					this.current = 0
				}
				if (this.current < 0) {
					this.current = this.imageList.length - 1
				}

			}
		}
	}
</script>

<style lang="less" scoped>
	.vrModule {
		height: 540rpx;
		background: #f4f4f4;
		position: relative;
	}

	.vrImage {
		width: 750rpx;
	}

	.noneImage {
		background: #fff;

		.vrImage {
			width: 500rpx;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}
	}

	.colorlist-ns-link {
		position: absolute;
		font-size: 0;
		text-align: center;
		bottom: 40rpx;
		left: 0;
		width: 100%;
		white-space: nowrap;
	}

	.colorlist {
		display: inline-block;
		padding: 8rpx 20rpx;
		border-radius: 100rpx;
		background: #c3c3c3;
		vertical-align: top;
	}

	.colorlist-item {
		display: inline-block;
		width: 40rpx;
		height: 40rpx;
		margin-right: 24rpx;
		// border: 1px solid #f44;
		border-radius: 40rpx;
		overflow: hidden;
	}

	.last-item-mr0 .colorlist-item:last-child {
		margin-right: 0;
	}

	.ns-link {
		display: inline-block;
		// width: 98rpx;
		padding: 0 18rpx;
		height: 56rpx;
		color: #fff;
		line-height: 56rpx;
		font-size: 24rpx;
		background: #c3c3c3;
		border-radius: 56rpx;
		vertical-align: top;
		margin-left: 20rpx;
	}

	.loading {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		background: #e9e9e9;
		z-index: 4;

		&-content {
			padding-top: 112rpx;
			width: 480rpx;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}

		.jd {
			height: 20rpx;
			background: #ccc;
			border-radius: 20rpx;
			overflow: hidden;
			position: relative;
		}

		.jd-dd {
			position: absolute;
			left: 0;
			top: 0;
			height: 100%;
			background: -webkit-linear-gradient(left, #ce1330, #5597ff);
			border-radius: 200rpx;
		}

		.loading-image {
			width: 168rpx;
			height: 112rpx;
			position: absolute;
			top: 0;
			margin-left: -168rpx;
		}

		.loading-text {
			text-align: center;
			line-height: 65rpx;
			font-size: 20rpx;
			color: #666;
		}
	}

	.scroll-view-vr {
		display: inline-block;
		vertical-align: middle;
		width: 296rpx;
		white-space: nowrap;
		text-align: center;
		// overflow: hidden;
	}

	.prev-btn,
	.next-btn {
		display: inline-block;
		vertical-align: middle;
		width: 30rpx;
		height: 30rpx;
		position: relative;

		&:after,
		&:before {
			display: block;
			content: "";
			width: 20rpx;
			height: 20rpx;
			border-left: 1px solid #eee;
			border-top: 1px solid #eee;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(0, -50%) rotate(-45deg);
			margin-left: -10rpx;
		}

		&:after {
			margin-left: -5rpx;
		}
	}

	.prev-btn {
		margin-right: 10rpx;
	}

	.next-btn {
		margin-left: 10rpx;
		transform: rotate(-180deg);
		// transform: translate(0,-50%) rotate(-135deg);

	}
</style>
