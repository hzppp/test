<template>
	<view class="external">
		<view class="external__content">
			<view class="external__content__title">外部配置参数</view>
		</view>
	</view>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.external {
	width: 100%;
	margin-bottom: 40rpx;
	padding: 0 30rpx;
	box-sizing: border-box;
	.external__content {
		border: 2rpx solid #f8f8f8;
		border-radius: 10rpx;
		.external__content__title {
			margin-top: 25rpx;
			font-size: 36rpx;
			font-weight: bold;
            display: flex;
            justify-content: center;
            align-items: center;
		}
	}
}
</style>
