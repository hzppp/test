<template>
	<view class="couponCode">
		<page-top ref="pagetop" :background="'#fa8943'" :titleys="'#fff'" :btnys="'white'" :title.sync="title"></page-top>
		<!-- <view class="couponCode-content">
			<view class="coupon-info">
				<view class="p1">{{currentCoupon.title}}</view>
				<view class="txt">{{currentCoupon.subhead}}</view>
				<view class="txt">有效期：{{currentCoupon.startTime}}-{{currentCoupon.endTime}}</view>
			</view>
			<image class="code" mode="aspectFill" :src="currentCoupon.qrCode" style="background-color: #ccc;" lazy-load="true"></image>
			<view class="p3">148 965 485 456 123 457</view>
			<view class="rule-con">
				<text class="txt">到店出示优惠券二维码</text>
			</view>
		</view> -->
		<view class="couponCode-content">
			<view class="coupon-info">
				<view class="p1">{{currentCoupon.title}}</view>
				<view class="txt">{{currentCoupon.subhead}}</view>
				<view class="txt">有效期：{{currentCoupon.startTime}}-{{currentCoupon.endTime}}</view>
				<view class="btn" v-if="currentCoupon.status==2" @tap="popShow">确认使用</view>
				<view class="btn disabled" v-else>{{currentCoupon.status == 1 && "已使用" || "已过期"}}</view>
				<text class="txt">请确认使用规则后点击确认兑换权益 \n 确认后无法撤销</text>
			</view>
			<!-- <image class="code" mode="aspectFill" :src="currentCoupon.qrCode" lazy-load="true"></image> -->
			<!-- <view class="p3">{{currentCoupon.code}}</view> -->
			<view class="rule-con">
				<view class="p3">使用说明</view>
				<text class="txt" style="color:#999;">{{currentCoupon.instructions}}</text>
			</view>
		</view>
		<block v-if="delboxShow">
			<view class="del-dynamic-mask"></view>
			<view class="del-dynamic-box">
				<text class="text"  style="color:#999;">请确认使用规则后点击兑换权益 \n 确认后无法撤销</text>
				<view class="del-dynamic-box-btns">
					<view class="btn" @tap="popHide">取消</view>
					<view class="btn" @tap="hxCoupon">确定</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	import pageTop from '@/components/pageTop/pageTop'
	import domain from '@/configs/interface';
	import request from "@/units/request.js"
	import api from '@/public/api/index'
	
	let app = getApp()
	export default {
		components: {
			'page-top': pageTop
		},
		data() {
			return {
				title: "优惠券核销",
				currentCoupon: null,
				delboxShow: false,
				id:''
			}
		},
		async onLoad(options) {
			console.log('获取优惠券id===',options)
			this.id = options.id
			this.userOuponsDet()
		},
		methods: {
			/* 获取优惠券信息 */
			async userOuponsDet(){
				let data = await api.userOuponsDet({id:this.id})
				if(data.code==1){
					let res = data.data
					res.startTime =  res.startTime.replace(/-/g, ".")
					res.endTime =  res.endTime.replace(/-/g, ".")
					this.currentCoupon = res
				}else{
					this.$toast(data.msg) 
				}
			},
			popShow() {
				this.delboxShow = true
			},
			popHide() {
				this.delboxShow = false
			},
			/* 核销 */
			async hxCoupon(){
				let param = {
					code:this.currentCoupon.code
				}
				request({
					url: domain.getAPI('doCouponVerifiy'),
					method: 'POST',
					data: param
				}).then(res => {
					if(res.data.data.code == 1){
						this.currentCoupon.status = 1
						this.$toast(res.data.data.msg)
					}else{
						this.$toast(res.data.data.msg)
					}
					this.delboxShow = false
				}).catch(err => {
					console.log(err);
				})
			}
		}
	}
</script>

<style lang="less">
	@import (reference) '@/static/less/public.less';

	page {
		background: #fa8943;
	}
	
	.couponCode {
		.tc;
	
		&-content {
					width: 670rpx;
					height: 1096rpx;
					background: url("https://www1.pcauto.com.cn/gz20210514/changan/cupons_bg3.png") no-repeat;
					background-size: 100% 100%;
					margin:60rpx auto;
			// .setbg(670rpx, 1096rpx, 'cupons_bg3.png');
			position: relative;
		}
		
		.p1 {
			.seth(70rpx, 40rpx, #333);
			width: 100%;
			margin-bottom: 10rpx;
			font-weight: 700;
		}
	
		.p2 {
			.pa(10%, 252rpx);
			width: 80%;
			.seth(78rpx, 40rpx, #333);
			.fb;
		}
	
		.p3 {
			font-size: 28rpx;
			color: #333;
			margin-bottom: 20rpx;
			text-align: left;
			font-weight: 700;
		}
		.txt{
			font-size: 24rpx;
			color: #666;
			line-height: 40rpx;
			text-align: left;
			display: block;
			margin-bottom: 5rpx;
		}
		
		.code {
			width: 378rpx;
			height: 378rpx;
			.pa(186rpx, 531rpx);
		}
		.rule-con{
			padding: 0 80rpx;
		}
		.coupon-info{
			height: 470rpx;
			padding-top: 150rpx;
			margin: 0 70rpx 65rpx;
			// border-bottom: 1px dashed #ebebeb;
			.txt{
				text-align: center;
			}
			.btn{
				width: 560rpx;
				height: 88rpx;
				line-height: 88rpx;
				font-size: 32rpx;
				font-weight: 700;
				color: #fff;
				margin: 45rpx auto 30rpx;
				border-radius: 88rpx;
				background-color: #FA8845;
			}
			.disabled{
				background-color: #ccc;
				color: #fff;
			}
		}
	}
	.del-dynamic-mask {
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		z-index: 9;
		background: rgba(0, 0, 0, .5);
	}
	
	.del-dynamic-box {
		padding: 40rpx;
		width: 540rpx;
		background: #fff;
		border-radius: 12rpx;
		position: fixed;
		left: 50%;
		top: 50%;
		z-index: 10;
		transform: translate(-50%, -50%);
		text-align: center;
	
		.text {
			padding-top: 12rpx;
			font-size: 32rpx;
			line-height: 55rpx;
		}
	
		&-btns {
			margin-top: 45rpx;
			font-size: 0;
	
			.btn {
				.db();
				width: 244rpx;
				.seth(84rpx, 32rpx);
				border: 1px solid #d0d0d0;
				border-radius: 42rpx;
	
				&:last-child {
					color: #fff;
					border-color:  #FA8845;
					background:  #FA8845;
					margin-left: 24rpx;
				}
			}
		}
	}
	
	// .couponCode {
	// 	.tc;

	// 	&-content {
	// 		width: 670rpx;
	// 		height: 1096rpx;
	// 		background: url("https://www1.pcauto.com.cn/gz20210514/changan/cupons_bg3.png") no-repeat;
	// 		background-size: 100% 100%;
	// 		// .setbg(670rpx, 1206rpx, 'code.png');
	// 		position: relative;
	// 		margin:60rpx auto;
	// 	}
		
	// 	.p1 {
	// 		.seth(70rpx, 40rpx, #333);
	// 		width: 100%;
	// 		margin-bottom: 10rpx;
	// 		font-weight: 700;
	// 	}

	// 	.p2 {
	// 		.pa(10%, 252rpx);
	// 		width: 80%;
	// 		.seth(78rpx, 40rpx, #333);
	// 		.fb;
	// 	}

	// 	.p3 {
	// 		color: #666666;
	// 		margin-bottom: 100rpx;
	// 		text-align: center;
	// 	}
	// 	.txt{
	// 		font-size: 24rpx;
	// 		color: #999;
	// 		line-height: 40rpx;
	// 		text-align: left;
	// 		display: block;
	// 		margin-bottom: 10rpx;
	// 	}
		
	// 	.code {
	// 		width: 400rpx;
	// 		height: 400rpx;
	// 		// .pa(186rpx, 531rpx);
	// 	}
	// 	.rule-con{
	// 		padding: 0 80rpx;
	// 		text{
	// 			text-align: center;
	// 		}
	// 	}
	// 	.coupon-info{
	// 		// height: 470rpx;
	// 		padding-top: 150rpx;
	// 		margin: 0 70rpx 155rpx;
	// 		// border-bottom: 1px dashed #ebebeb;
	// 		.txt{
	// 			text-align: center;
	// 		}
	// 		.btn{
	// 			width: 560rpx;
	// 			height: 88rpx;
	// 			line-height: 88rpx;
	// 			font-size: 32rpx;
	// 			font-weight: 700;
	// 			color: #fff;
	// 			margin: 45rpx auto 30rpx;
	// 			border-radius: 88rpx;
	// 			background-color: #ce1330;
	// 		}
	// 		.disabled{
	// 			background-color: #ccc;
	// 			color: #fff;
	// 		}
	// 	}
	// }
	// .del-dynamic-mask {
	// 	position: fixed;
	// 	width: 100%;
	// 	height: 100%;
	// 	left: 0;
	// 	top: 0;
	// 	z-index: 9;
	// 	background: rgba(0, 0, 0, .5);
	// }
	
	// .del-dynamic-box {
	// 	padding: 40rpx;
	// 	width: 540rpx;
	// 	background: #fff;
	// 	border-radius: 12rpx;
	// 	position: fixed;
	// 	left: 50%;
	// 	top: 50%;
	// 	z-index: 10;
	// 	transform: translate(-50%, -50%);
	// 	text-align: center;
	
	// 	.text {
	// 		padding-top: 12rpx;
	// 		font-size: 32rpx;
	// 		line-height: 55rpx;
	// 	}
	
	// 	&-btns {
	// 		margin-top: 45rpx;
	// 		font-size: 0;
	
	// 		.btn {
	// 			.db();
	// 			width: 244rpx;
	// 			.seth(84rpx, 32rpx);
	// 			border: 1px solid #d0d0d0;
	// 			border-radius: 42rpx;
	
	// 			&:last-child {
	// 				color: #fff;
	// 				border-color: #ce1330;
	// 				background: #ce1330;
	// 				margin-left: 24rpx;
	// 			}
	// 		}
	// 	}
	// }
</style>
