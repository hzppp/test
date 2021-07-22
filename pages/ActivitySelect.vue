<template>
	<view>
		<page-top :background="'#fff'" :titleys="'#000'" :btnys="''" :title="'活动详情' " ></page-top>
		<image src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/activeBg.png" class="bgV"></image>
		<button class="actSelectWawaV" @click="actSelectWawa()"></button>
		<view class="title1" >仅限车展现场人员参与</view>
		<button class="actSelectXsV"  @click="actSelectXs()"></button>
		<view class="title2">所有人可参与，可以抽取丰厚礼品</view>
	</view>
</template>

<script>
	import pageTop from '@/components/pageTop/pageTop'
	export default {
			components: {
				'page-top': pageTop,
			},
			data() {
				return {
				  activityId: '',
				  lotteryType:'' ,//转盘类型
				}
			},
			mixins: [],
			async onLoad(options) {
				this.activityId = options.activityId
				this.lotteryType= options.lotteryType || ''
			},
			onHide() {},
		
			methods: {
				actSelectWawa(){
				uni.navigateTo({
					url:`/pages/wawaji?activityId=${this.activityId}`
				})	
				},
				
				actSelectXs(){
					uni.reLaunch({
						url: '/pages/lotteryPage?activityId=' + this.activityId + '&lotteryType=' +	this.lotteryType
					})
				}
				
				
			}
		
	}
</script>

<style lang="less">
	@import '@/static/less/public.less';
	.bgV{
		width: 750rpx;
		height: 1496rpx;
		
	}
	
	.actSelectWawaV{
		margin-left: 162rpx;
		position: absolute;
		top: 454rpx;
		.setbg(421rpx, 97rpx, 'actSelectWawa.png');
	}
	.actSelectXsV{
		margin-left: 162rpx;
		position: absolute;
		top: 695rpx;
		.setbg(421rpx, 97rpx, 'actSelectXs.png');
		
	}
	.title1{
		margin-left: 266rpx;
		position: absolute;
		top: 576rpx;
		width: 259rpx;
		height: 20rpx;
		color: #0C97B8;
		font-weight: 700;
		font-size: 24rpx;
	}
	.title2{
		margin-left: 206rpx;
		position: absolute;
		top: 817rpx;
		width: 378rpx;
		height: 20rpx;
		color: #0C97B8;
		font-weight: 700;
		font-size: 24rpx;
	}
</style>
