<template>
	<view class="base" v-if="baseData.name">
		<view class="base__content">
			<view class="base__content__title"
				><i class="icon" />{{ baseData.name }}</view
			>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		PropsBaseData: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			baseData: {},
		};
	},
	watch: {
		PropsBaseData(v) {
			this.baseData = v;
			console.log("v.name :>> ", v);
		},
	},
};
</script>

<style lang="scss" scoped>
.base {
	width: 100%;
	margin-bottom: 40rpx;
	padding: 0 30rpx;
	box-sizing: border-box;
	.base__content {
		border: 2rpx solid #f8f8f8;
		border-radius: 10rpx;
		.base__content__title {
			margin-top: 25rpx;
			font-size: 36rpx;
			font-weight: bold;
            display: flex;
            justify-content: center;
            align-items: center;
			.icon {
				width: 28rpx;
				height: 30rpx;
                margin-right: 18rpx;
				background-image: url("../../static/images/base_icon.png");
				background-size: cover;
			}
		}
	}
}
</style>
