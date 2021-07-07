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
				<tki-qrcode ref="qrcode" :val="eneryCode.val" :size="eneryCode.size" :unit="eneryCode.unit" :background="eneryCode.background" :foreground="eneryCode.foreground"
				 :pdground="eneryCode.pdground" :lv="eneryCode.lv" :onval="eneryCode.onval" :loadMake="eneryCode.loadMake"
				 :showLoading="eneryCode.showLoading" :loadingText="eneryCode.loadingText" />
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
				<view class="btn choose-btn" @tap="chooseModel">选择此车型</view>
			</view>
		</view>
		
		<!-- 科技 -->
		<view class="content content-technology" v-if="pageStatus==2">
			<view class="content-tit">科技量产中心</view>
			<view class="technology-con">
				<view class="car-img-con">
					<image src="https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/car/yidong-plus.jpg" class="car-img"></image>
				</view>
				<template v-if="activityInfo && hasTechnology">
					<view class="show-code-btn" @tap="pageStatus=4"></view>
					<view class="content-info">
						<text>点击立即领取并前往接待台处</text>
						<text>领取长安汽车精美礼品一份</text>
					</view>
				</template>
				<template v-else>
					<view class="back" @tap="pageStatus=0"></view>
					<view class="content-info">
						<text>您已领取过奖品</text>
					</view>
				</template>
			</view>
		</view>
		
		<!-- 展示科技量产中心二维码 -->
		<view class="content content-technology-code" v-if="pageStatus==4">
			<view class="qrimg">
				<tki-qrcode ref="qrcode" :val="technologyCode.val" :size="technologyCode.size" :unit="technologyCode.unit" :background="technologyCode.background" :foreground="technologyCode.foreground"
				 :pdground="technologyCode.pdground" :lv="technologyCode.lv" :onval="technologyCode.onval" :loadMake="technologyCode.loadMake"
				 :showLoading="technologyCode.showLoading" :loadingText="technologyCode.loadingText" />
			</view>
			<view class="back" @tap="pageStatus=0"></view>
		</view>
	
		<view class="content content-treasure" v-if="pageStatus==5">
			<view class="scan-btn" @tap="scan"></view>
		</view>
		
		<!-- 扫码夹娃娃 -->
		<view class="content content-treasure-scan" v-if="pageStatus==6">
			<view class="content-tit">寻宝大作战</view>
			<view class="technology-con">
				<view class="car-img-con">
					<image src="https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/car/yidong-plus.jpg" class="car-img"></image>
				</view>
				<view class="content-info">
					<text>您获得一次抓娃娃机会，快前往娃娃机处</text>
					<text>扫码娃娃机上的二维码，开始游戏</text>
				</view>
				<view class="btn scan-btn" @tap="scanWwj">扫一扫</view>
			</view>
		</view>


		<view class="content content-gift" v-if="pageStatus==7">
			<view class="gift-tit"><image src="https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/verify-tit.png" mode="aspectFit" class="gift-tit"></image></view>
			<view class="star"></view>
			<!-- 点击领取定制好礼 -->
			<view class="star-btn" @tap="receive"></view>
		</view>

		<view class="content content-technology-code" v-if="pageStatus==8">
			<view class="qrimg">
				<tki-qrcode ref="qrcode" :val="gift.val" :size="gift.size" :unit="gift.unit" :background="gift.background" :foreground="gift.foreground"
				 :pdground="gift.pdground" :lv="gift.lv" :onval="gift.onval" :loadMake="gift.loadMake"
				 :showLoading="gift.showLoading" :loadingText="gift.loadingText" />
			</view>
			<view class="back" @tap="pageStatus=0"></view>
		</view>
	</view>
	
</template>
<script>
	import api from '@/public/api/index'
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
				pageStatus:7,
				swiper:{
					current:1,
					circular:true,
					indicatorDots: false,
					autoplay: true,
					interval: 3000,
					duration: 500,
				},
				eneryCode:{
					val: 'https://www.baidu.com',
					size: 348,
					background: '#ffffff',
					foreground: '#000000',
					pdground: '#000000',
					lv: 3,
					onval: true,
					unit: 'upx',
					loadMake: true,
					src: '',
					showLoading: true,
					loadingText: '加载中··',
				},
				technologyCode:{
					val: 'https://www.baidu.com',
					size: 348,
					background: '#ffffff',
					foreground: '#000000',
					pdground: '#000000',
					lv: 3,
					onval: true,
					unit: 'upx',
					loadMake: true,
					src: '',
					showLoading: true,
					loadingText: '加载中··',
				},
				gift:{
					val: 'https://www.baidu.com',
					size: 348,
					background: '#ffffff',
					foreground: '#000000',
					pdground: '#000000',
					lv: 3,
					onval: true,
					unit: 'upx',
					loadMake: true,
					src: '',
					showLoading: true,
					loadingText: '加载中··',
				},
				activityInfo:{},
				activityId:107
			}
		},
		onLoad(){
			this.getActivityInfo();
		},
		methods: {
			async getActivityInfo(){
				let activityInfo = await api.wwjInfo({
					activityId: this.activityId
				})
				if(activityInfo.code==1){
					this.activityInfo=activityInfo.data;
				}
			},
			targetItem(item,index){
				this.pageStatus=index;
				if(index==2){
					if(this.activityInfo && this.activityInfo.modelPath){
						this.pageStatus=2;
					}else{
						this.pageStatus=3;
					}
				}else{
					this.pageStatus=4;
				}
				
			},
			swiperChange(e){
				this.swiper.current = e.detail.current;
			},
			async chooseModel(){
				console.log("选择车型",this.swiper.current);
				// 保存选中的车型
				let resData = await api.saveModel({
					id: this.activityInfo.id,
					modelPath: this.chooseCarList[this.swiper.current]
				})
			},
			//扫码
			async scan(){
				uni.scanCode({
				    success: function (res) {
						//扫码成功，核销，判断是否有夹娃娃的机会
						let verifyData=`${this.activityInfo.userToken}|Prize`
						console.log(verifyData);
						// let ress = await api.wwjVerify({
						// 	data: verifyData
						// })
						// if(ress.code==1){
						// 	if(ress.data.status==1) this.pageStatus=6;
						// }
				    }
				});
			},
			//扫描娃娃机
			async scanWwj(){
				uni.scanCode({
					success: function (res) {
						console.log("扫描娃娃机结果",res.result);
						//启动娃娃机
						// const {code,data} = await api.wwjStart({
						// 	activityId:this.activityId,
						// 	deviceId:res.result
						// })
					}
				});
			},
			async receive(){
				let verifyData=`${this.activityInfo.userToken}|Prize`
				let ress = await api.wwjVerify({
					data: verifyData
				})
				this.pageStatus=8;
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
		.content-enery{
			width:647rpx;
			height:787rpx;
			background: url('https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/enery-code-bg.png') no-repeat center/100%;
			.qrimg{
				margin-top:205rpx;
			}
		}
		.content-technology-code{
			width:647rpx;
			height:710rpx;
			background: url('https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/technology-code-bg.png') no-repeat center/100%;
			.qrimg{
				margin-top:205rpx;
			}
		}
		.content-treasure{
			width:649rpx;
			height:574rpx;
			background: url('https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/treasure-con.png') no-repeat center/100%;
			.scan-btn{
				width:529rpx;
				height:96rpx;
				margin:378rpx auto 0;
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
			.star-btn{
				width: 276rpx;
				height: 276rpx;
				background: url('https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/start.png') no-repeat center/100%;
				margin: 40rpx auto 0;
			}
		}
	}
</style>