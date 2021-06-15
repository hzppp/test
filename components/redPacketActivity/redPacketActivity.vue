<template>
	 <view class="ser_home" v-if="showPackage" :style="{top: `${safeTopHeight}px`, height: `${bgHeight}px`,}"
		@touchmove.stop="()=>{}">
		 <view class="red-packet-wrap" id="red_packet" v-if="start">
			<block v-if="aniStart">
				<view class="time">剩余时间<view class="time-ico">{{countDown}}</view>秒</view>
				<!-- 流星 -->
				<view class="ani-meteor" style="left: 25%; bottom: 107%; animation-delay: .5s; animation-duration: 4s;"></view>
				<view class="ani-meteor" style="left: 50%; bottom: 107%; animation-delay: 1s; animation-duration: 3s;"></view>
				<view class="ani-meteor" style="left: 85%; bottom: 107%; animation-delay: 1.5s; animation-duration: 3.5s;"></view>
				<view class="ani-meteor" style="left: 100%; bottom: 107%; animation-delay: 2s; animation-duration: 4s;"></view>
				<view class="ani-meteor" style="left: 113%; bottom: 107%; animation-delay: .5s; animation-duration: 2.5s;"></view>
				<view class="ani-meteor" style="left: 125%; bottom: 107%; animation-delay: 1s; animation-duration: 2s;"></view>
				<view class="ani-meteor" style="left: 150%; bottom: 107%; animation-delay: 1.5s; animation-duration: 3s;"></view>
				<!-- 星星 -->
				<view class="ani-stars" style="left: 9%; bottom: 107%; transform: scale(1); animation-delay: 2.2s; animation-duration: 4s;"></view>
				<view class="ani-stars" style="left: 22%; bottom: 107%; transform: scale(.5); animation-delay: 3s; animation-duration: 4.5s;"></view>
				<view class="ani-stars" style="left: 45%; bottom: 107%; transform: scale(.4); animation-delay: 2.4s; animation-duration: 5.5s;"></view>
				<view class="ani-stars" style="left: 60%; bottom: 107%; transform: scale(.6); animation-delay: .5s; animation-duration: 4s;"></view>
				<view class="ani-stars" style="left: 82%; bottom: 107%; transform: scale(.5); animation-delay: 1.5s; animation-duration: 3.5s;"></view>
			</block>
		  	<block v-for="(item, index) in liParams" :key="index">
			  	<view class="red-packet-item" :style="{ left: item.left, animationDuration: item.durTime, webkitAnimationDuration: item.durTime,animationPlayState: item.state,webkitAnimationPlayState: item.state,}"  :class="item.cls" :data-index="index">
					<view v-if="item.type" class="red-packet-icon" @touchstart='qianghongbao(index,$event)'></view>
					<view v-else class="open-red-packet"></view>
				</view>
			</block>
		</view>
		<!-- loading -->
		<view class="pop-cover" v-show="type != 0" @tap.stop="closePop"></view>
		<!-- 抽中 -->
		<view class="pop-prize" v-show="type == 1">
			<view class="tit">恭喜你获得红包</view>
			<view class="money">{{packetAmount}} <text>元</text></view>
			<view class="txt">已存入微信红包</view>
			<view class="btn" @tap.stop="closePop">妙啊</view>
		</view>
		<!-- 未抽中 -->
		<view class="pop-fail" v-show="type == 2">
			<view class="tit">Sorry</view>
			<view class="txt">未开出红包</view>
			<view class="btn" @tap.stop="closePop">一点都不妙</view>
		</view>
	</view>
</template>
 
 
<script>
	import api from '@/public/api/index'
	let app = getApp()
	
	export default {
		props: ['showPackage','activityId','groupId','endTime'],
		data() {
			return {
				systemInfo: {}, // 系统信息
				safeTopHeight: 0, // 安全顶部高度
				bgHeight: 0, // 背景高度
				aniStart: true,
				start: true,//是否开始红包雨
				type: 0,//0关闭弹框,1成功领取，2领取失败 还有机会，3领取失败 没有机会
				packetAmount: 0,//金额
				liParams: [],
				timer: null,
				overTimer: null,
				endCount: 0,//动画结束红包个数
				duration: this.endTime, // 定义红包雨时间 秒
				line: [0,1,2,3],//红包轨道数量
				now: 0,//现在红包出现的轨道
				countDown: 20,
			}
		},
		mounted() {
			this.systemInfo = uni.getSystemInfoSync()
			let {
			  bottom,height,left,right,top,width
			} = uni.getMenuButtonBoundingClientRect()
			this.safeTopHeight = height + top + Math.floor(top/3)
			this.bgHeight = this.systemInfo.windowHeight - this.safeTopHeight
		},
		beforeDestroy(){
			console.log('销毁组件============================')
			clearTimeout(this.overTimer)
			clearTimeout(this.timer)
		},
		methods: {
			/**
			 * 开启动画
			 */
			startRedPacket(first,endTime) {
				if(first){
					this.endCount = 0
					this.liParams = []
					console.log('多少时间结束',endTime)
					clearTimeout(this.overTimer)
					clearTimeout(this.timer)
					this.overTimer = setInterval (() => {
						endTime = endTime - 1000
						this.countDown = this.countDown - 1
						if(this.countDown <= 0 || endTime <= 0){
							console.log('红包雨结束')
							this.start = false
							this.aniStart = false
							this.closeRedPcakage()
							clearTimeout(this.timer)
							return;
						}
					}, 1000);
				}
				this.start = true
				this.aniStart = true
				this.now++
				if (this.now > this.line.length - 1) {
					this.now = 0;
					this.line.sort(() => { return 0.5 - Math.random(); });
				}
				let left = this.line[this.now] * 80 + 10;
				
				let rotate = '0deg'; // 旋转角度
				
				let arr = ['0.6', '0.7', '0.8', '0.9', '1']
				let index = Math.floor((Math.random()*arr.length))
				let scales = arr[index]; // 图片尺寸
				let durTime = (Math.random() * (3.5 - 2.2 + 1) + 2.2) + 's'; // 时间 1.2和1.2这个数值保持一样
				this.liParams.push({
					left: left + 'px',
					cls: 'move_1',
					transforms: 'rotate(' + rotate + ') scale(' + scales + ')',
					durTime: durTime,
					type: true,
					state: 'running',
				})
				this.timer = setTimeout(() => {
					this.startRedPacket()
				}, 300)
			},
			// 抢红包
			async qianghongbao(index,e) {
				if(!this.start){return}
				console.log(index,e)
				this.liParams[index].state = 'paused'
				this.liParams[index].type = false
				uni.showLoading({
					mask: true
				})
				let openId = app.globalData.wxUserInfo.openId
				let groupId = this.groupId
				let activityId = this.activityId
				try {
					const res = await api.fetchRedPacketOpen({activityId,openId,scene: 0})
					console.log(res)
					uni.hideLoading();
					this.liParams[index].state = 'running'
					if(res.code == 200){
						if(res.data.amount){
							this.packetAmount = res.data.amount / 100
							this.type = 1
							this.$emit("showMyWallet")
						}else{
							this.packetAmount = 0
							this.type = 2
						}
					}else{
						this.type = 2
					}
				} catch (err) {
					console.error(err)
				}
			},
			// 关闭红包雨界面
			closeRedPcakage(){
				this.liParams = []
				this.endCount = 0
				clearTimeout(this.overTimer)
				clearTimeout(this.timer)
				this.$emit("hidePackage")
			},
			// 关闭提示
			closePop(){
				if(this.start){//开红包期间，红包雨未结束就继续
					this.type = 0
				}else{
					this.closeRedPcakage()
				}
			},
		}
	}
</script>
 
 
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
	.ser_home {
		width: 100%;
		height: 100%;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 10000;
		background-color: rgba(0,0,0,.8);
		.btn{
			width: 480rpx;
			height: 80rpx;
			line-height: 80rpx;
			font-size: 28rpx;
			color: #fff;
			font-weight: bold;
			text-align: center;
			margin: 40rpx auto 0;
			background: linear-gradient(#ff3637 0%, #ffa60b 0%, #f36d15 100%);
			border-radius: 40rpx;
		}
		.close{
			width: 72rpx;
			height: 72rpx;
			position: absolute;
			right: -54rpx;
			top: -92rpx;
			z-index: 3;
			background: url() no-repeat center/100%;
		}
		// 红包
		.red-packet-wrap {
			display: block;
			position: relative;
			overflow: hidden;
			width: 100%;
			height: 100%;
			.time{
				height: 60rpx;
				line-height: 60rpx;
				font-size: 24rpx;
				color: #fff;
				position: absolute;
				left: 40rpx;
				top: 40rpx;
				z-index: 13;
				.time-ico{
					display: inline-block;
					font-size: 26rpx;
					font-weight: bold;
					color: #EA0F22;
					text-align: center;
					margin: 0 10rpx;
					width: 50rpx;
					height: 58rpx;
					line-height: 65rpx;
					padding-right: 5rpx;
					box-sizing: border-box;
					background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAA6CAMAAADFsvruAAAAkFBMVEVHcEz5bib5bSb8gCf5bib1gCL6dST6cyP6cCb5bSb5cyf6dCf+jCf7eCf5bSbvbyP9iij5bif+iij/7sv////1Vyb2Xyb3Yyb0UiX5ayf4Zyb2Wyb9iyj8hyj0UCX8gij+jyj8zLb7vKP7eif+6cn+8e76q5P2aUL6nnr+/Pv3i233e1n1Xjb0TyX/7cz94dvHFQL0AAAAE3RSTlMAmPF8qgYzHsL+WOKyZNkNmIL1TvpnXAAAAqdJREFUSMeNlm2/ckAQxlFZUip7yCIdQshd3//b3TNrPdQhe72pF/v/zcOO2UtR3rU5Or8jOceNsqQVPxlx8b/7RWQXifOCio4SSHQZKZJAdOdyHeni6IvIhqxAxxvoiP+IIikdkbfTZLX/3jvdBI2RgxX97mYZslcNiwFiGeq+w/QrdGKaISubsSAIzij4ZXZbDXGu0L4JRl+beNrrhZi5xqZtr1MM4YDnhaErFIYhUuYaIu0nmK2GABz3/Tj+B4pj3wcMIW1LrNsns1FZBzzKJHtS+syS8iGggGkmtB2ZfhoOBhAI3IuMjvQs7gIyzZuFcZye4CH8e0r/KAWIMxbBHhgiK0GUGZ1QVsacMTbK1tiJm1IZLyOlM0p5bkwd9YoFQDQJnVXSABOwbX8fGq/8CwEMxgm0bn7WUIjrp/SrUqjnHKy7qYW0/JIuqPRdLzD1Lkjo3rMlJLv3YQgEWUyLp8bDYDUnhkGohHiYEyA2VlLIIAWGsQFh2K5MBskAOTOCSOjWVEo1ZMZge0K/ljvc9RmKganBfiVySBJDMQZH4kwOyeK2fkSecsgTEU1RoGExlRQgZ7NFqh8pVQLBxHI5JBeJIfKSQ15D+X4ihyS+aDJcZSGHFOIqcWAecshDDAwfS6n6824s2+GXzKsd/vYTk7iZCj8xdho+5GVk+JDbddEsVpM3w1Zql1K9hNRYiVhK3epbTGtYff2C/XrxLhL9gu3X+HdivMa7x2I+t9T/fCz6J6me7Fte+92TNPYbgmnSP3dapY0gDu9vPn9e+WtZvEXK8XkNoXL2Sbw/4kXyyqsqfyXF8IirU/5FWAXhFbjwPAJgFWYs0oQh8TzuYuaNHNgehiZpcD2QUmt75kVOrbkKuLUKGLNPElYRLZytmaZmjyzcWP8BtrS3HKXifokAAAAASUVORK5CYII=) no-repeat center/100%;
				}
			}
			.ani-meteor,.ani-stars{
				position: absolute;
				left: 50%;
				bottom: 100%;
				background-repeat: no-repeat;
				background-position: center;
				background-size: 100%;
				animation: aim_move 10s linear infinite;
			}
			.ani-meteor{
				width: 65rpx;
				height: 222rpx;
				animation: aim_move1 10s linear infinite;
				background-image: url(https://www1.pcauto.com.cn/zt/gz20201029/xcx/img/line.png);
			}
			.ani-stars{
				width: 32rpx;
				height: 32rpx;
				background-image: url(https://www1.pcauto.com.cn/zt/gz20201029/xcx/img/ani-stars.png);
			}
			.red-packet-item {
				position: absolute;
				animation: all 3s linear;
				top: -100rpx;
				z-index: 10;
				&.move_1 {
					-webkit-animation: aim_move 20s linear 1 forwards;
					animation: aim_move 20s linear 1 forwards;
				}
				.red-packet-icon,.open-red-packet{
					width: 128rpx;
					height: 160rpx;
					margin-left: 50rpx;
					display: block;
					background-image: url(https://www1.pcauto.com.cn/zt/gz20201029/xcx/img/red1.png);
					background-repeat: no-repeat;
					background-position: center;
					background-size: 100% 100%;
				}
				.open-red-packet{
					background-image: url(https://www1.pcauto.com.cn/zt/gz20201029/xcx/img/red3.png);
				}
				
			}
		}
		.pop-cover{
			width: 100%;
			height: 100%;
			position: absolute;
			left: 0;
			top: 0;
			z-index: 9;
		}
		// 抽中
		.pop-prize{
			width: 600rpx;
			height: 445rpx;
			text-align: center;
			position: absolute;
			left: 50%;
			top: 50%;
			z-index: 10;
			margin: -225rpx 0 0 -300rpx;
			background: url(https://www1.pcauto.com.cn/zt/gz20201029/xcx/img/pop_bg.png) no-repeat center/100%;
			.tit{
				font-size: 40rpx;
				// font-weight: bold;
				color: #ffffff;
				line-height: 80rpx;
				margin: 70rpx 0 0 0;
			}
			.money{
				font-size: 80rpx;
				font-weight: bold;
				color: #FFF000;
				line-height: 80rpx;
				font-family: Arial, Helvetica, sans-serif;
				margin: 10rpx 0 0;
				text{
					font-size: 28rpx;
				}
			}
			.txt{
				font-size: 24rpx;
				line-height: 36rpx;
				color: #FFB3B3;
				text{
					color: #fff;
				}
			}
		}
		// 未抽中
		.pop-fail{
			width: 600rpx;
			height: 445rpx;
			text-align: center;
			position: absolute;
			left: 50%;
			top: 50%;
			z-index: 10;
			margin: -225rpx 0 0 -300rpx;
			background: url(https://www1.pcauto.com.cn/zt/gz20201029/xcx/img/pop_bg.png) no-repeat center/100%;
			.tit{
				font-size: 80rpx;
				font-weight: bold;
				font-family: Arial, Helvetica, sans-serif;
				color: #ffffff;
				line-height: 80rpx;
				margin: 100rpx 0 30rpx 0;
			}
			.txt{
				font-size: 40rpx;
				line-height: 46rpx;
				color: #FFB3B3;
				padding: 10rpx 0 20rpx;
				text{
					color: #FFF600;
				}
			}
		}
	}

	

	@keyframes aim_move {
		0% {
			-webkit-transform: translateY(0);
			transform: translateY(0);
		}
	
		100% {
			-webkit-transform: translateY(120vh);
			transform: translateY(120vh);
		}
	}
	@keyframes aim_move1 {
		0% {
			-webkit-transform: translate(0,0);
			transform: translate(0,0);
		}

		100% {
			-webkit-transform: translate(-100vw,120vh);
			transform: translate(-100vw,120vh);
		}
	}
</style>
