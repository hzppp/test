<template>
	<view class='serial_groups'>
		<view class="list2">
			<view class="visit-hd">大多数用户会对比</view>
			<view class="section-mask">
				<scroll-view class="visit-serial-box" scroll-x>
					<block v-for="(item,index) in serialGroups" :key="index">
						<view class="visit-item" @tap="chooseSerials(item.id)">
							<image :src="item.baiPic" mode="aspectFill"></image>
							<text class="car_name">{{item.name}}</text>
						</view>
					</block>
				</scroll-view>
				<view class="mask"></view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		props: ['serialGroups'],
		data() {
			return {}
		},
		mounted() {},
		methods: {
			chooseSerials(id) {
				this.$store.state.pageData = {
					id
				}
				uni.navigateBack()
			}
		}
	}
</script>
<style lang="scss">
	.serial_groups {
		.list2 {
			display: flex;
			flex-direction: column;
		}

		.list2 .visit-hd {
			font-size: 36rpx;
			font-weight: bold;
			color: #121c35;
			margin: 0 28rpx 0 52rpx;
		}

		.list2 .visit-serial-box {
			display: flex;
			margin-top: 34rpx;
			padding-left: 40rpx;
			box-sizing: border-box;
			margin-bottom: 64rpx;
			white-space: nowrap;
		}

		.list2 .visit-serial-box .visit-item {
			width: 180rpx;
			text-align: center;
			font-size: 28rpx;
			color: #121c35;
			// overflow: hidden;
			// text-overflow: ellipsis;
			// white-space: nowrap;
			display: inline-block;
			margin-right: 20rpx;
		}
		.list2 .visit-serial-box .visit-item .car_name{
			width: 180rpx;
			text-align: center;
			font-size: 28rpx;
			color: #121c35;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			display: inline-block;
			margin-right: 20rpx;
		}

		.visit-serial-box .visit-item image {
			display: block;
			margin: 0 auto 10rpx;
			width: 180rpx;
			height: 135rpx;
			background: url(https://magear.pcauto.com.cn/p/www1.pcauto.com.cn/images/holder.png) no-repeat;
			background-size: 100% 100%;
		}

		.visit-item image {
			font-size: 24rpx;
			color: rgb(51, 51, 51);
			text-align: center;
		}

		.mask {
			position: absolute;
			top: 34rpx;
			right: 0;
			width: 30rpx;
			height: 180rpx;
			z-index: 2;
			background-image: -webkit-linear-gradient(left, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);
			background-image: -moz-linear-gradient(left, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);
			background-image: -o-linear-gradient(left, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);
			background-image: linear-gradient(left, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);
		}

		.section-mask {
			position: relative;
		}
	}
</style>
