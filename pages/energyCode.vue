<template>
	<view class="showCode">
		
	</view>
	
	
</template>
<script>
	import wwjRule from '@/components/wwjRule/wwjRule.vue';
	export default {
		components: {
			wwjRule
		},
		data() {
			return {
				showRule:false,
				btnList:[
					{btn:'https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/wawaji_btn1.png',type:'AddEnergy',name:'能量补给'},
					{btn:'https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/wawaji_btn2.png',type:'Technology',name:'科技量产中心'},
					{btn:'https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/wawaji_btn1.png',type:'Prize',name:'定制好礼'},
					{btn:'https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/wawaji_btn4.png',type:'Prize',name:'定制好礼'}
				]
			}
		},
		methods: {
			// 活动规则
			showRule(){
				
			}
		}
	}
</script>
<style lang="less">
	.wwj-page{
		width:100%;
		height:100vh;
		overflow:hidden;
		background: url('https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/wwj_bg.jpg') no-repeat center top/100%;
		display:flex;
		flex-direction:column;
		justify-content:center;
		align-items:center;
		text-align:center;
		.type-item{
			margin-bottom:50rpx;
		}
		.type-item-prize{
			margin-top:120rpx;
		}
		.img{
			width:412rpx;
			height:97rpx;
		}
		.prize-img{
			width:313rpx;
			height:65rpx;
		}
		.rule-btn{
			font-size:26rpx;
			color:#333333;
			line-height:1;
			margin-top:35rpx;
		}
	}
</style>sss