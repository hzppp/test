<template>
		<view class="pyview" @tap="doPy">
				<span class="title1">点击按钮即视为同意</span><span class="title2">《用户隐私协议》</span>
		</view>
</template>

<script>
	export default {
		name: "pyBoomV",
		data() {
			return {

			};
		},
		methods:{
			doPy(){
				uni.navigateTo({
					url:'/pages/changanPy'
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.pyview{
		text-align: center;
		height: 40rpx;
		line-height: 40rpx;
		// background: #4CD964;
		margin-bottom: 10rpx;
	}

	.title1{
		color: #101010;
		font-size: 28rpx;
	}
	.title2{
		color: #5A94E1;
		font-size: 28rpx;
	}
	

</style>
