<template>
	<view class="wwj-page">
		<!-- 能量 -->
		<view class="content content-enery" >
			<view class="content-tit">{{tit}}</view>
			<view class="content-info">{{seconde}}</view>
			<view class="content-enery-inner">
				<!-- 已经领取过 -->
					
					<view class="qrimg">
						 	<canvas canvas-id="qrcode" id="qrcode" style="width:460rpx;height: 460rpx" />
					</view>
				<!-- <view class="back" @tap="pageStatus=0">返回</view> -->
			</view>
		</view>
		
		</view>
	</view>
	
</template>
<script>
	import api from '@/public/api/index'
	import CODE from '@uni-plugs/uni-code';
	export default {
		components: {
	
		},
		data() {
			return {
				tit:'',
				seconde:'',
				val:'',
				config:{
				  
				    qrc:{
				        id: 'qrcode', // canvas的canvas-id
				        size: 460, // 二维码大小 单位rpx
				        level: 4, //等级 0～4
				        // bgColor: '#FFFFFF', //二维码背景色 默认白色
				        // border: {
				        //     color: ['#e66465', '#9198e5'], //边框颜色支持渐变色
				        //     lineWidth: 4, //边框宽度
				        // },
				        // img: '/static/logo.png',//图片
				        iconSize: 40, //二维码图标的大小
				        // color: ['#e66465', '#9198e5'] // 二维码颜色 默认黑色
				    }
				}
			}
		},
		watch:{
		
		},
		async onLoad(options){
		  this.tit =options.tit;
		  this.seconde = options.seconde
			CODE.QRCode({
				...this.config.qrc,
			    code: options.val,
			    ctx: this //自定义组件时 必须传 其它不用传
			});
		},  
	
		methods: {
			
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
		position: relative;
		.back-icon{
			position: absolute;
			width: 75rpx;
			height: 77rpx;
			left:60rpx;
			top:150rpx;
			background: url('https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/back-icon.png') no-repeat center/100%;
		}
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
		.back{
			width:529rpx;
			height:76rpx;
			margin:38rpx auto;
			line-height: 76rpx;
			font-size: 42rpx;
			color: #ffffff;
			text-align: center;
			background: url('https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/back-btn.png') no-repeat center/100%;
		}
		.content-tit{
			font-size:68rpx;
			color:#0789a8;
			margin-bottom:40rpx;
			line-height:1;
			font-weight: bold;
		}
		.content-info{
			color:#666666;
			font-size:28rpx;
			text{
				display:block;
			}
		}
		.hasReceived{
			color: #333333;
			font-size: 36rpx;
			padding:30rpx 0;
		}
		.btn{
			width:423rpx;
			height:81rpx;
			background: url('https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/btn-bg.png') no-repeat center/100%;
			font-size:34rpx;
			color:#fff;
			text-align:center;
			line-height:81rpx;
		}

		// 能量补给站
		.content-enery{
			.content-enery-inner{
				width:649rpx;
				height:710rpx;
				background: url('https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/enery-code-bg.png') no-repeat center/100%;
				display:flex;
				flex-direction:column;
				justify-content:center;
				align-items:center;
				.qrimg{
					// background: #F0AD4E;
					// margin-left: 50rpx;
				}
			}
			
		}
		.content-technology-code{
			width:647rpx;
			height:710rpx;
			background: url('https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/enery-code-bg.png') no-repeat center/100%;
			display:flex;
			flex-direction:column;
			justify-content:center;
			align-items:center;
			.qrimg{
				margin-top:35rpx;
			}
		}
		.content-treasure{
			.content-treasure-con{
				width:649rpx;
				height:486rpx;
				background: url('https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/treasure-con.png') no-repeat center/100%;
				display:flex;
				flex-direction:column;
				justify-content:center;
				align-items:center;
				.content-info{
					color: #333333;
					font-size: 36rpx;
				}
				.scan-btn{
					width:529rpx;
					height:96rpx;
					margin:50rpx auto 0;
				}
			}
		}
		
		.technology-con{
			width:649rpx;
			height:745rpx;
			background: url('https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/technology-bg.png') no-repeat center/100%;
			padding: 0 60rpx;
			box-sizing:border-box;
			display:flex;
			flex-direction:column;
			justify-content:center;
			align-items:center;
			text-align:center;
			.car-img{
				width:529rpx;
				height:353rpx;
				box-shadow:0rpx 10rpx 50rpx 10rpx rgba(175, 192, 209, 0.4);
			}
			.show-code-btn{
				width:529rpx;
				height:96rpx;
				margin:30rpx 0;
				background: url('https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/show-code-btn.png') no-repeat center/100%;
			}
		}
		.content-choose-car .technology-con{
			padding:0
		}
		// 选择车型
		.swiper-3d{
			width:571rpx;
			margin:30rpx auto 40rpx;
			.s-container{
				height: 280rpx;
				width: 100%;
				.swiper-item {
					height: 100%;
					box-sizing: border-box;
					position: relative;
				}
				.item-img {
					width: 100%;
					height: 80%;
					z-index: 5;
					transform: translateY(10%);
				}
				.active {
					opacity: 1;
					z-index: 10;
					height:100%;
					transition: all .1s ease-in 0s;
					transform: translateY(0);
					border:3rpx solid #4395b4;
					box-sizing:border-box;
				}
			}
		}
		.content-treasure-scan{
			.content-info{
				margin:30rpx auto 20rpx;
			}
		}
		.content-gift{
			.gift-tit{
				width: 438rpx;
				height: 387rpx;
			}
			.task-complete{
				width: 389rpx;
				height: 237rpx;
				position: relative;
				margin:0 auto;
				.star{
					width: 115rpx;
					height: 108rpx;
					background: url('https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/star2.png') no-repeat center/100%;
					&.light{
						background: url('https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/star.png') no-repeat center/100%;
					}
				}
				.star1{
					position: absolute;
					left:50%;
					top:0;
					transform: translateX(-50%)scale(1);
				}
				.star2{
					position: absolute;
					left:0;
					bottom:0;
					transform: scale(0.8);
				}
				.star3{
					position: absolute;
					right:0;
					bottom:0;
					transform: scale(0.7);
				}
			}
			.star-btn{
				width: 276rpx;
				height: 276rpx;
				background: url('https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/start_bg.png') no-repeat center/100%;
				margin: 40rpx auto 0;
				display: flex;
				flex-direction:column;
				justify-content:center;
				align-items:center;
				text-align:center;
				font-size: 38rpx;
				color: #fff;
			}
		}
	}
</style>