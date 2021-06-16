<template>
	<view class="power">
		<view class="power__content">
			<view class="power__content__title">动力表现参数</view>
		</view>
	</view>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.power {
	width: 100%;
	margin-bottom: 40rpx;
	padding: 0 30rpx;
	box-sizing: border-box;
	.power__content {
		border: 2rpx solid #f8f8f8;
		border-radius: 10rpx;
		.power__content__title {
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
