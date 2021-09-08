<template>
	<view class="scan-page">
		<view class="back-icon" v-if="pageStatus!=0" @tap="pageStatus=0"></view>
		<div class="content" v-if="pageStatus==0">
			<view class="txt">请打开微信扫描</view>
			<view class="scan-btn" @tap="scanCode">扫一扫</view>
		</div>
		<div class="content" v-else>
			<view class="txt">{{pageStatus==1?'核销成功':'核销失败'}}</view>
			<view class="txt2" v-if="description">{{description}}</view>
		</div>
	</view>
	
</template>
<script>
	import api from '@/public/api/index'

	export default {
		data() {
			return {
				pageStatus:0 ,//0，未核销 1，核销成功 -1，核销失败 
				description:""
			}
		},
		onLoad(){
			
		},
		methods: {
			//二维码核销
			async scanCode(){
				uni.scanCode({
					success: (res)=> {
						if(res.result){
							this.verifyCode(res.result);
						}
						
						
					},
					fail: (err)=> {
						this.$toast(err)
					}
				})
			},
			async verifyCode(result){
				let res = await api.wwjVerify({
					data: result
				})
	
				if(res.code==1){
					this.pageStatus=res.data.status;
					if(res.data.status==-1){
						this.description=res.data.description;
					}
				}else{
					this.pageStatus=-1;
					this.description=res.msg;
				}
			}
		},
		onShareAppMessage() {
			let title = "扫描核销"
			let path = `pages/authorization?to=scan`
			return {
				title: title,
				path: path,
				imageUrl: ""
			}
		},
	}
</script>
<style lang="less">
	.scan-page{
		width:100%;
		height:100vh;
		overflow:hidden;
		background: url('https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/wwj_bg.jpg') no-repeat center top/100%;
		display:flex;
		flex-direction:column;
		justify-content:flex-start;
		align-items:center;
		text-align:center;
		position: relative;
		padding-top: 40%;
		.back-icon{
			position: absolute;
			width: 75rpx;
			height: 77rpx;
			left:60rpx;
			top:150rpx;
			background: url('https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/back-icon.png') no-repeat center/100%;
		}
		.txt{
			font-size: 68rpx;
			color: #0789a8;
			margin-bottom:30rpx;
		}
		.txt2{
			font-size: 28rpx;
			color: #666666;
		}
		.scan-btn{
			width:423rpx;
			height:81rpx;
			background: url('https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/btn-bg.png') no-repeat center/100%;
			font-size:34rpx;
			color:#fff;
			text-align:center;
			line-height:81rpx;
			margin:0 auto;
		}
	}
</style>