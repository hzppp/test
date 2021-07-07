<template>
	<view class="wwj-page">
		<view class="content" v-if="pageStatus==0">
			<view :class="index == 3 ? 'type-item-prize':'type-item'" v-for="(item,index) in btnList" :key="index" @tap="targetItem(item,index+1)">
				<image :src="item.btn" :class="index == 3 ? 'prize-img':'img'"></image>
			</view>
			<view class="rule-btn" @tap="showRule=true">活动规则>></view>
		</view>
		<!-- 能量 -->
		<wwj-rule :visible.sync="showRule"/>
		<view class="content content-enery" v-if="pageStatus==1">
			<view class="qrimg">
				<tki-qrcode ref="qrcode" :val="val" :size="size" :unit="unit" :background="background" :foreground="foreground"
				 :pdground="pdground" :icon="icon" :iconSize="iconsize" :lv="lv" :onval="onval" :loadMake="loadMake"
				 :showLoading="showLoading" :loadingText="loadingText" />
			</view>
			<view class="back" @tap="pageStatus=0"></view>
		</view>
		<!-- 选择车型 -->
		<view class="content content-choose-car" v-if="pageStatus==3">
			<view class="content-tit">科技量产中心</view>
			<view class="technology-con">
				<view class="content-info">请选择您喜爱的车型</view>
				<view class="swiper-3d">
					<swiper :current="swiper.current" class="s-container" @change="swiperChange" 
					:circular="swiper.circular"  
					:interval="swiper.interval" 
					:duration="swiper.duration"
					previous-margin="70rpx"
					next-margin='70rpx'>
						<swiper-item class="swiper-item"  v-for="(item,index) in chooseCarList" :key= "index">
							<image class="item-img" :src="item"  :class="swiper.current == index?'active':''"></image>
						</swiper-item>
					</swiper>
				</view>
				<view class="btn choose-btn">选择此车型</view>
			</view>
		</view>
		<!-- 科技 -->
		<view class="content content-technology" v-if="pageStatus==2">
			<view class="content-tit">科技量产中心</view>
			<view class="technology-con">
				<view class="car-img-con">
					<image src="https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/car/yidong-plus.jpg" class="car-img"></image>
				</view>
				<view class="show-code-btn" @tap="showCode"></view>
				<view class="content-info">
					<text>点击立即领取并前往接待台处</text>
					<text>领取长安汽车精美礼品一份</text>
				</view>
			</view>
		</view>
	</view>
	
	
</template>
<script>
	import wwjRule from '@/components/wwjRule/wwjRule.vue';
	import tkiQrcode from "tki-qrcode";
	export default {
		components: {
			wwjRule,
			tkiQrcode
		},
		data() {
			return {
				showRule:false,
				btnList:[
					{btn:'https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/wawaji_btn1.png',type:'AddEnergy',name:'能量补给'},
					{btn:'https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/wawaji_btn2.png',type:'Technology',name:'科技量产中心'},
					{btn:'https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/wawaji_btn1.png',type:'Prize',name:'定制好礼'},
					{btn:'https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/wawaji_btn4.png',type:'Prize',name:'定制好礼'}
				],
				chooseCarList:[
					"https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/car/cs55-plus.jpg",
					"https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/car/cs75-plus.jpg",
					"https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/car/cs75.jpg",
					"https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/car/new-cs15.jpg",
					"https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/car/new-cs35-plus.jpg",
					"https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/car/new-cs95.jpg",
					"https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/car/rucheng-cc.jpg",
					"https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/car/unik.jpg",
					"https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/car/unit.jpg",
					"https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/car/yidong-plus.jpg"
				],
				pageStatus:3,
				swiper:{
					current:1,
					circular:true,
					indicatorDots: false,
					autoplay: true,
					interval: 3000,
					duration: 500,
				},
				val: 'https://www.baidu.com',
				size: 348,
				background: '#ffffff',
				foreground: '#000000',
				pdground: '#000000',
				icon: '',
				iconsize: 30,
				lv: 3,
				onval: true,
				unit: 'upx',
				loadMake: true,
				src: '',
				showLoading: true,
				loadingText: '加载中··'
			
			}
		},
		
		methods: {
			targetItem(item,index){
				this.pageStatus=index;s
			},
			swiperChange(e){
				this.swiper.current = e.detail.current;
			},
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
		.content-enery{
			width:647rpx;
			height:787rpx;
			background: url('https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/enery-code-bg.png') no-repeat center top/100%;
			.qrimg{
				margin-top:205rpx;
			}
		}
		.back{
			width:530rpx;
			height:80rpx;
			margin:38rpx auto;
		}
		.content-tit{
			font-size:68rpx;
			color:#0789a8;
			margin-bottom:40rpx;
			line-height:1;
		}
		.content-info{
			color:#666666;
			font-size:28rpx;
			text{
				display:block;
			}
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
		.technology-con{
			width:649rpx;
			height:745rpx;
			background: url('https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/technology-bg.png') no-repeat center top/100%;
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
				background: url('https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/show-code-btn.png') no-repeat center top/100%;
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

	}
</style>