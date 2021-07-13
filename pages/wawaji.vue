<template>
	<view class="wwj-page">
		<view class="back-icon" v-if="pageStatus>0" @tap="pageStatus=0"></view>
		<view class="content" v-if="pageStatus==0">
			<view :class="index == 3 ? 'type-item-prize':'type-item'" v-for="(item,index) in btnList" :key="index" @tap="targetItem(item,index+1)">
				<image :src="item.btn" :class="index == 3 ? 'prize-img':'img'"></image>
			</view>
			<view class="rule-btn" @tap="showRule=true">活动规则>></view>
		</view>
		<!-- 活动规则 -->
		<wwj-rule :visible.sync="showRule"/>

		<!-- 能量 -->
		<view class="content content-enery" v-if="pageStatus==1">
			<view class="content-tit">能量补给站</view>
			<view class="content-enery-inner">
				<!-- 已经领取过 -->
				<template v-if="activityInfo && activityInfo.hasAddEnergy">
					<view class="hasReceived">您已经领取定制好礼</view>
				</template>
				<template v-else>
					<view class="content-info">请前往接待处领取奖品</view>
					<view class="qrimg">
						<tki-qrcode ref="qrcode" :val="eneryCode.val" :size="eneryCode.size" :unit="eneryCode.unit" :background="eneryCode.background" :foreground="eneryCode.foreground"
						:pdground="eneryCode.pdground" :lv="eneryCode.lv" :onval="eneryCode.onval" :loadMake="eneryCode.loadMake"
						:showLoading="eneryCode.showLoading" :loadingText="eneryCode.loadingText" />
					</view>
				</template>
				<view class="back" @tap="pageStatus=0">返回</view>
			</view>
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
					<image :src="modelPath" class="car-img"></image>
				</view>
				<template v-if="activityInfo && activityInfo.hasTechnology">
					<view class="back" @tap="pageStatus=0">返回</view>
					<view class="content-info">
						<text>您已领取过奖品</text>
					</view>
				</template>
				<template v-else>
					<view class="show-code-btn" @tap="pageStatus=4"></view>
					<view class="content-info">
						<text>点击立即领取并前往接待台处</text>
						<text>领取长安汽车精美礼品一份</text>
					</view>
				</template>
			</view>
		</view>
		
		<!-- 展示科技量产中心二维码 -->
		<view class="content content-technology-code" v-if="pageStatus==4">
			<view class="content-info">请前往接待处领取奖品</view>
			<view class="qrimg">
				<tki-qrcode ref="qrcode" :val="technologyCode.val" :size="technologyCode.size" :unit="technologyCode.unit" :background="technologyCode.background" :foreground="technologyCode.foreground"
				 :pdground="technologyCode.pdground" :lv="technologyCode.lv" :onval="technologyCode.onval" :loadMake="technologyCode.loadMake"
				 :showLoading="technologyCode.showLoading" :loadingText="technologyCode.loadingText" />
			</view>
			<view class="back" @tap="pageStatus=0">返回</view>
		</view>
	
		<!-- 寻宝大作战 -->
		<view class="content content-treasure" v-if="pageStatus==5">
			<view class="content-tit">寻宝大作战</view>
			<view class="content-treasure-con">
				<template v-if="activityInfo && activityInfo.hasTreasure">
					<view class="hasReceived">
						已完成任务
					</view>
				</template>
				<template v-else>
					<view class="content-info">
						<text>请在长安展台区域</text>
						<text>寻找宝藏二维码并扫描</text>
					</view>
					<view class="btn scan-btn" @tap="scan">开始扫描</view>
				</template>
			</view>
		</view>
		
		<!-- 扫码夹娃娃 -->
		<view class="content content-treasure-scan" v-if="pageStatus==6">
			<view class="content-tit">寻宝大作战</view>
			<view class="technology-con">
				<view class="car-img-con">
					<image :src="wwjResultImg" class="car-img"></image>
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
			<view class="task-complete" v-if="activityInfo.hasAddEnergy && activityInfo.hasTechnology && activityInfo.hasTreasure">
				<image :src="completeStar" class="task-complete"></image>
			</view>
			<view class="task-complete" v-else>
				<view :class="['star', 'star1', {light:activityInfo.hasAddEnergy}]"></view>
				<view :class="['star', 'star2', {light:activityInfo.hasTechnology}]"></view>
				<view :class="['star', 'star3', {light:activityInfo.hasTreasure}]"></view>
			</view>
			<!-- 点击领取定制好礼 -->
			<view class="star-btn" @tap="receive"></view>
		</view>

		<view class="content content-enery" v-if="pageStatus==8">
			<view class="content-tit">定制好礼</view>
			<view class="content-enery-inner">
				<!-- 已经领取过 -->
				<template v-if="activityInfo && activityInfo.hasPrize">
					<view class="hasReceived">您已经领取定制好礼</view>
				</template>
				<template v-else>
					<view class="content-info">请前往接待处领取奖品</view>
					<view class="qrimg">
						<tki-qrcode ref="qrcode" :val="gift.val" :size="gift.size" :unit="gift.unit" :background="gift.background" :foreground="gift.foreground"
						:pdground="gift.pdground" :lv="gift.lv" :onval="gift.onval" :loadMake="gift.loadMake"
						:showLoading="gift.showLoading" :loadingText="gift.loadingText" />
					</view>
				</template>
				<view class="back" @tap="pageStatus=0">返回</view>
			</view>
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
					{btn:'https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/wawaji_btn3.png',type:'Prize',name:'定制好礼'},
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
				pageStatus:0, //0,进入页面状态，1，能量二维码，2，科技，已选车型 3，科技，选择车型 4，科技，二维码 5，寻宝大作战 6，寻宝大作战，有夹娃娃机会 7，集星赢好礼 8，点击领取定制好礼，二维码
				swiper:{
					current:1,
					circular:true,
					indicatorDots: false,
					autoplay: true,
					interval: 3000,
					duration: 500,
				},
				eneryCode:{
					val: '',
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
					val: '',
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
					val: '',
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
				activityId:'',
				modelPath:"",
				wwjResultImg:"",
				completeStar:"https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/star-complete.gif?hash="+Math.random()*10,
				gif_show:false
			}
		},
		watch:{
			pageStatus(val){
				console.log('pageStatus',val)
			}
		},
		onLoad(options){
			console.log("options",options.activityId)
			this.activityId = options.activityId
			this.getActivityInfo();
		},  
		methods: {
			async getActivityInfo(){
				let activityInfo = await api.wwjInfo({
					activityId: this.activityId
				})
				if(activityInfo.code==1){
					this.activityInfo=activityInfo.data;
					this.modelPath = this.activityInfo.modelPath
					this.eneryCode.val=`${this.activityInfo.userToken}|AddEnergy`
					this.technologyCode.val=`${this.activityInfo.userToken}|Technology`
					this.gift.val=`${this.activityInfo.userToken}|Prize`
				}
			},
			targetItem(item,index){
				this.pageStatus=index;
				this.getActivityInfo();
				if(index==1){//能量补给站
					this.pageStatus=1;
				}else if(index==2){//科技量产中心
					if(this.activityInfo && this.activityInfo.modelPath){
						this.pageStatus=2;
					}else{
						this.pageStatus=3;
					}
				}else if(index==3){ //寻宝大作战
					this.pageStatus=5;
				}else if(index==4){//集星赢好礼
					this.completeStar="https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/star-complete.gif?hash="+Math.random()*10
					this.pageStatus=7;
					
				}
				
			},
			swiperChange(e){
				this.swiper.current = e.detail.current;
			},
			async chooseModel(){
				// 保存选中的车型
				let resData = await api.saveModel({
					id: this.activityInfo.id,
					modelPath: this.chooseCarList[this.swiper.current]
				})
				// 选择车型成功，重新调用活动接口，获取选择车型图片
				if(resData.code==1){
					this.getActivityInfo();
					this.pageStatus=2;
				}
			},
			//扫码
			async scan(){
				let that=this;
				uni.scanCode({
				    success: function (res) {
						console.log("扫描寻宝二维码",res)
						that.wwjResultImg="https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/car/"+res.result
						//扫码成功，如果未完成寻宝，则扫描夹娃娃机
						that.getActivityInfo();
						if(!that.activityInfo.hasTreasure){
							that.pageStatus=6;
						}
				    }
				});
			},
			//扫描娃娃机
			scanWwj(){
				let that=this;
				uni.scanCode({
					success: function (res) {
						that.wwjStart(res.result)
					}
				});
			},
			async wwjStart(result){
				//启动娃娃机
				let {code,data} = await api.wwjStart({
					activityId:this.activityId,
					deviceId:result
				})
				if (code == 1) {
					this.$toast('正在开启中！')
					that.getActivityInfo();
					this.pageStatus=5
				} else {
					this.$toast(data.msg)
				}
				console.log("启动娃娃机",code,data)
			},
			async receive(){
				if(this.activityInfo.hasAddEnergy && this.activityInfo.hasTechnology && this.activityInfo.hasTreasure){
					this.gif_show=false;
					this.pageStatus=8;
				}else{
					this.$toast('请先完成任务！')
				}
				
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
					margin-top:30rpx;
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
				background: url('https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/start.png') no-repeat center/100%;
				margin: 40rpx auto 0;
			}
		}
	}
</style>