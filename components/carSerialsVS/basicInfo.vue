<template>
	<!-- 车系对比基本信息模块 -->
	<view class='basic_nfo'>
		<view class="title">
			基本信息
		</view>
		<view class="list_box">
			<view class="list">
				<view class="item">{{leftSerial.plText}}</view>
				<view class="item">排量</view>
				<view class="item">{{rightSerial.plText}}</view>
			</view>
			<block v-if="leftSerial.yhxhText==rightSerial.yhxhText">
				<view class="list">
					<view class="item">{{leftSerial.yhxhVal}}</view>
					<view class="item">{{rightSerial.yhxhText}}</view>
					<view class="item">{{rightSerial.yhxhVal}}</view>
				</view>
			</block>
			<block v-else>
				<view class="list">
					<view class="item">{{leftSerial.yhxhVal}}</view>
					<view class="item">{{leftSerial.yhxhText}}/{{rightSerial.yhxhText}}</view>
					<view class="item">{{rightSerial.yhxhVal}}</view>
				</view>
			</block>
			<view class="list">
				<view class="item">{{leftSerial.saleNum == 0?"暂无" : leftSerial.saleNum}}</view>
				<view class="item">月度销量</view>
				<view class="item">{{rightSerial.saleNum == 0 ?"暂无" : rightSerial.saleNum}}</view>
			</view>
			<view class="btn_group">
				<view class="btn_item" @tap="toCanpei(leftSerial.serialId)">
					<text>查看参数配置</text>
					<image src="https://magear.pcauto.com.cn/p/www1.pcauto.com.cn/zt/pcautoWX/img/arrow_right_gray.png" mode="aspectFill"></image>
				</view>
				<view class="btn_item" @tap="toCanpei(rightSerial.serialId)">
					<text>查看参数配置</text>
					<image src="https://magear.pcauto.com.cn/p/www1.pcauto.com.cn/zt/pcautoWX/img/arrow_right_gray.png" mode="aspectFill"></image>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		props:['leftSerial','rightSerial'],
		methods:{
			toCanpei(serialId){
				uni.navigateTo({
					url:"/pages_car/canpei/canpei?navigateBack=1&max=4&serialId="+serialId
				})
			}
		}
	}
</script>
<style lang="scss">
	.basic_nfo{
		padding: 100rpx 40rpx 0rpx;
		.title{
			text-align: center;
			font-size: 40rpx;
			font-weight: bold;
		}
		.list_box{
			padding-top: 20rpx;
			.list{
				width: 100%;
				@include flex_left_center;
				margin-top: 30rpx;
				.item{
					flex: 1;
					padding: 5rpx 0;
					@include flex_center_center;
					color: rgb(51, 51, 51);
					font-size: 28rpx;
					&:first-child{
						justify-content: flex-end;
					}
					&:nth-child(2){
						font-size: 24rpx;
						color: rgb(153, 153, 153);
						padding: 5px;
					}
					&:last-child{
						justify-content: flex-start;
					}
				}
			}
			.btn_group{
				margin-top: 50rpx;
				@include flex_left_center;
				width: 100%;
				.btn_item{
					height: 44rpx;
					flex: 1;
					@include flex_center_center;
					font-size: 24rpx;
					color: rgb(51, 51, 51);
					image{
						width: 9rpx;
						height: 16rpx;
						margin-left: 10rpx;
					}
				}
			}
		}
	}
</style>
