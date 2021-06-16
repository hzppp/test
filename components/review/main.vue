<template>
	<view class="main" v-if="mainData.name">
		<view class="main__content">
			<view class="main__content__title">{{ mainData.name }}</view>
			<view class="main__content__bottom">
				<view
					class="item"
					v-for="(item, index) in mainData.parData"
					:key="index"
				>
					<view class="item__title"
						>{{ item.title }}
						<view
							class="title_tip"
							v-if="item.title == 'OTA'"
							@tap="tipShow = true"
							>?</view
						>
					</view>
					<view class="item__value">{{ item.value }}</view>
				</view>
				<view class="middle__gap"></view>
			</view>
		</view>
		<view class="tip__popup" v-if="tipShow">
			<view class="popup">
				<view class="popup__close--btn" @tap="tipShow = false"></view>
				<view class="popup__text">
					<view class="text__title">OTA、SOTA、FOTA介绍</view>
					<view class="text"
						>OTA英文全称是Over-the-Air
						Technology，即空中下载技术的意思。通过网络从远程服务器下载新的软件更新包对自身系统进行升级。</view
					>
					<view class="text"
						>FOTA是英文Firmware Over the
						Air的缩写，即固件空中升级。</view
					>
					<view class="text"
						>SOTA是英文Software-over-the-air的缩写，即软件空中升级。</view
					>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		PropsMainData: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			mainData: {},
			tipShow: false, // ?的提示弹窗
		};
	},
	watch: {
		PropsMainData(v) {
			this.mainData = v;
		},
	},
};
</script>

<style lang="scss" scoped>
.main {
	width: 100%;
	margin-bottom: 40rpx;
	padding: 0 30rpx;
	color: #333333;
	box-sizing: border-box;
	.main__content {
		border: 2rpx solid #f8f8f8;
		border-radius: 10rpx;
		.main__content__title {
			margin-top: 25rpx;
			font-size: 36rpx;
			font-weight: bold;
			text-align: center;
		}
		.main__content__bottom {
			position: relative;
			box-sizing: border-box;
			display: flex;
			flex-wrap: wrap;
			.item {
				width: 50%;
				text-align: center;
				.item__title {
					display: flex;
					align-items: center;
					justify-content: center;
					margin-top: 28rpx;
					font-size: 24rpx;
					line-height: 44rpx;
					color: #777777;
					.title_tip {
						width: 44rpx;
						height: 44rpx;
						font-size: 40rpx;
						transform: scale(0.5);
						color: #ffffff;
						border-radius: 50%;
						background-color: #777777;
					}
				}
				.item__value {
					margin-top: 31rpx;
					margin-bottom: 22rpx;
					line-height: 24rpx;
					font-size: 28rpx;
					color: #333333;
					font-weight: bold;
				}
			}
			.middle__gap {
				position: absolute;
				top: 40rpx;
				left: 50%;
				transform: translateX(-50%);
				width: 2rpx;
				height: 214rpx;
				background-color: #ececec;
			}
		}
	}
	.tip__popup {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba($color: #000000, $alpha: 0.5);
		z-index: 9999;
		.popup {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 590rpx;
			height: 516rpx;
			padding: 38rpx 42rpx 0;
			border-radius: 20rpx;
			background-color: #fff;
			box-sizing: border-box;
			z-index: inherit;
			.popup__close--btn {
				position: absolute;
				top: -94rpx;
				right: 0;
				width: 64rpx;
				height: 64rpx;
				border: 2rpx solid #ffffff;
				border-radius: 50%;
				background-image: url("../../static/images/close_btn.png");
				background-size: cover;
			}
			.popup__text {
				.text__title {
					margin-bottom: 31rpx;
					text-align: center;
					font-size: 34rpx;
					color: #333333;
					font-weight: bold;
					line-height: 44rpx;
				}
				.text {
					margin-bottom: 31rpx;
					font-size: 24rpx;
					line-height: 40rpx;
					color: #333333;
				}
			}
		}
	}
}
</style>
