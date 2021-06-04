<template>
	<view>
		<view class="swiperPanel" @touchstart="startMove" @touchend="endMove">
			<view class="swiperItem" v-for="(item, index) in swiperList" :key="index" :style="{transform: itemStyle[index].transform, zIndex: itemStyle[index].zIndex, opacity: itemStyle[index].opacity}">
				<view class="children">
					<image class="pic" :src="item.picUrl"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			swiperList: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				slideNote: {
					x: 0,
					y: 0
				},
				screenWidth: 0,
				itemStyle: []
			};
		},
		created() {
			var macInfo = uni.getSystemInfoSync();
			this.screenWidth = macInfo.screenWidth;
			// 计算swiper样式
			this.swiperList.forEach((item, index) => {
				this.itemStyle.push(this.getStyle(index))
			})
		},
		methods: {
			getStyle(e) {
				if (e > this.swiperList.length / 2) {
					var right = this.swiperList.length - e
					console.log(this.swiperList.length + '===' + right + '===' + e )
					return {
						transform: 'scale(' + (1 - right / 9) + ') translate(-' + (right * 9) + '%,0px)',
						zIndex: 9999 - right,
					    opacity: right > 1 ? (0):(0.8 / right)
						// dispaly: right > 1 ? none:block
					}
				} else {
					console.log(this.swiperList.length + '#===' + right + '===' + e )
					return {
						transform: 'scale(' + (1 - e / 9) + ') translate(' + (e * 9) + '%,0px)',
						zIndex: 9999 - e,
						opacity: e > 1 ?(0):(0.8 / e)
						// dispaly: e > 1 ? none:block
					}
				}
			},
			startMove(e) {
				this.slideNote.x = e.changedTouches[0] ? e.changedTouches[0].pageX : 0;
				this.slideNote.y = e.changedTouches[0] ? e.changedTouches[0].pageY : 0;
			},
			endMove(e) {
				var newList = JSON.parse(JSON.stringify(this.itemStyle))
				if ((e.changedTouches[0].pageX - this.slideNote.x) < 0) {
					// 向左滑动
					var last = [newList.pop()]
					newList = last.concat(newList)
				} else {
					// 向右滑动
					newList.push(newList[0])
					newList.splice(0, 1)
				}
				this.itemStyle = newList
			}
		}
	}
</script>

<style lang="scss">
	.swiperPanel {
		margin: 20rpx 0;
		height: 500rpx;
		width: 100%;
		overflow: hidden;
		position: relative;

		.swiperItem {
			height: 100%;
			width: 100%;
			position: absolute;
			top: 0;
			left: 0;
			transition: all .5s;
             // background: #007AFF;
			.children {
				height: 100%;
				width: 670rpx;
				margin: 2rpx auto;
				// background: #4CD964;

				.pic {
					height: 100%;
					width: 100%;
					border-radius: 10px;
					// box-shadow: 0 0 10px #333;
				}
			}
		}
	}
</style>
