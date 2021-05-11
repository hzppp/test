<template>
	<view class="loading" v-if="isshow">
		<view class="loading-content">
			<view class="gif-image"></view>
			<view class="text">极速加载中...</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isshow:false
			};
		},
		methods:{
			changeLoading(type = false){
				this.isshow = type
			}
		}
	}
</script>

<style lang="less">
@import '@/static/less/public.less';
.loading{
    .mask;
    .tc;
    z-index: 9999;
    &-content{
        padding: 13rpx 20rpx;
        width: 240rpx;
        background: #fff;
        .pa(50%,50%);
        transform: translate(-50%,-50%);
        font-size: 0;
        border-radius: 20rpx;
    }
    .text{
        .seth(78rpx,24rpx,#9c9c9c);
    }
    .gif-image{
        height: 74rpx;
        &::after{
            display: block;
            content: "";
            .setbg(140rpx,46rpx,'loading.gif');
            .pa(50%,32rpx);
            transform: translate(-50%,0);
        }
    }
}
</style>
