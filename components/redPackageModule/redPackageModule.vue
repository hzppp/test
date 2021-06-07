<template>
	<view>
		<!-- 红包雨 -->
		<red-package-activity ref="redPackageActivity" :showPackage="showPackage" :activityId="activityId" @hidePackage="hidePackage" @showMyWallet="showMyWallet"></red-package-activity>
		<!-- 3秒倒数 -->
		<view class="countdown-tost" v-if="tostCount < 4">
			<view class="countdown-tost-bg">
				<view class="tit"><image src="https://www1.pcauto.com.cn/zt/gz20201029/xcx/img/tost.png" mode="widthFix"></image></view>
				<view class="num"><image :src="'https://www1.pcauto.com.cn/zt/gz20201029/xcx/img/c_' + tostCount + '.png'" mode="widthFix"></image></view>
			</view>
		</view>
	</view>
</template>

<script>
import redPackageActivity from '@/components/redPackageActivity/redPackageActivity.vue';  //红包雨

export default {
	data () {
		return {
			tostCount: 4,//倒数
			showPackage: false,
			myWalletShow: false,
			redPacketGroupId: -1,//当前红包雨列表标识
			groupList: [],//红包雨场次列表
			countDown: {
				show: false,
				hour: [0,0],
				minute: [0,0],
				second: [0,0]
			},
			step: 0,// 时间差
			countDownTimer: null,
			canDrawPacket: 1,//当前是否下红包雨（0否，1是）
		}
	},
	components: {redPackageActivity},
	mounted () {
		this.startRedPacket()
	},
	methods: {
		startRedPacket(){
				console.log('startRedPacket开始红包雨')
				this.$nextTick(() => {
					let timer = setInterval(()=>{
						--this.tostCount
						console.log(this.tostCount)
						if(this.tostCount == 0){
							clearInterval(timer)
							this.tostCount = 4
							this.showPackage = true//是否显示红包雨
							this.$refs.redPackageActivity.startRedPacket(true,20000);
						}
					},1000)
				});
		},
		// 隐藏红包雨
		hidePackage(){
			this.showPackage = false
			this.nextRedPackage()
		},
		showMyWallet(){
			this.myWalletShow = true
		},
		// 进行下一场倒计时
		nextRedPackage(){
			// 进行下一场红包雨倒计时
			if(this.redPacketGroupId + 1 < this.groupList.length){
				this.redPacketGroupId = this.redPacketGroupId + 1
				this.activityId = this.groupList[this.redPacketGroupId].id
				this.liveTimer(this.groupList[this.redPacketGroupId].startTime,this.groupList[this.redPacketGroupId].endTime)
			}else{ //没有下一场
				this.countDown.show = false //隐藏 下一场红包雨 开始时间
			}
		},
		liveTimer(beginTime,endTime) {
			console.log('倒计时')
			//开始时间
			beginTime = beginTime - 4*1000;//开始时间 提前3秒开始 多出1秒提示
			console.log('当前时间', new Date().getTime())
			console.log('开始时间', beginTime)
			console.log('结束时间', endTime)
			const countDown = () => {
				console.log('时间差',this.step)
				let newEvtime = new Date().getTime();
				newEvtime = newEvtime + this.step;
				if (newEvtime >= endTime) {//一场红包雨结束
					console.log('一场红包雨结束')
					clearTimeout(this.countDownTimer);
					this.nextRedPackage()
				}else if (newEvtime >= beginTime) {//一场红包雨开始
					console.log('一场红包雨开始')
					if(this.canDrawPacket == 1){//刚开始进来判断是否可以下红包雨
						clearTimeout(this.countDownTimer);
						this.startRedPacket()
					}else{
						clearTimeout(this.countDownTimer);
						this.nextRedPackage()
					}
				} else {
					this.countDown.show = true //显示 下一场红包雨 开始时间
					this.countDown = Object.assign(this.countDown,RedPacketTimeFormat(newEvtime,beginTime))
					this.canDrawPacket = 1
					this.countDownTimer = setTimeout(() => {
						countDown();
					}, 450);
				}
			}
			countDown();
		},
	}
}
</script>

<style lang="scss" scoped>
.countdown-tost{
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,.5);
	position: fixed;
	top: 0;
	left: 0;
	z-index: 999;
}
.countdown-tost-bg{
	width: 100%;
	height: 1000rpx;
	margin: -500rpx 0 0;
	background: url(https://www1.pcauto.com.cn/zt/gz20201029/xcx/img/c_bg.png) no-repeat center;
	background-size: 100%;
	position: fixed;
	top: 50%;
	left: 0;
	z-index: 999;
}
.countdown-tost image{
	max-width: 100%;
	height: auto;
}
.countdown-tost .tit{
	width: 190rpx;
	height: 110rpx;
	margin: 306rpx auto 0;
}
.countdown-tost .num{
	width: 190rpx;
	height: 200rpx;
	margin: 0 auto;
}
</style>
