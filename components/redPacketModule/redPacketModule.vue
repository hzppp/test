<template>
	<view>
		<!-- 红包雨 -->
		<red-packet-activity ref="redPacketActivity" :showPackage="showPackage" :activityId="activityId" @hidePackage="hidePackage" @showMyWallet="showMyWallet"></red-packet-activity>
		<!-- 3秒倒数 -->
		<view class="countdown-tost" v-if="tostCount < 4" @touchmove.stop="()=>{}">
			<view class="countdown-tost-bg">
				<view class="tit"><image src="https://www1.pcauto.com.cn/zt/gz20201029/xcx/img/tost.png" mode="widthFix"></image></view>
				<view class="num"><image :src="'https://www1.pcauto.com.cn/zt/gz20201029/xcx/img/c_' + tostCount + '.png'" mode="widthFix"></image></view>
			</view>
		</view>
	</view>
</template>

<script>
import api from '@/public/api/index'
import redPacketActivity from '@/components/redPacketActivity/redPacketActivity.vue';  //红包雨

export default {
	data () {
		return {
			tostCount: 4,//倒数
			showPackage: false,
			myWalletShow: false,
			
			offsetTime: 0, // 时间差
			redPacketRainList: [], // 红包雨列表
			crtRedPacketRainIndex: -1, // 当前红包雨的index
			coldDownTimer: null, // 倒计时计时器
		}
	},
	components: {redPacketActivity},
	mounted () {
		this.init()
	},
	beforeDestroy () {
		this.coldDownTimer && clearTimeout(this.coldDownTimer)
	},
	methods: {
		async init () {
			const reqServerTime = this.reqServerTime()
			const reqRedPacketRainList = this.reqRedPacketRainList()
			await reqServerTime
			await reqRedPacketRainList
			this.nextRedPacketRain()
		},
		// 红包雨计时器
		redPacketRainColdDown (startTime, endTime) {
			this.coldDownTimer && clearTimeout(this.coldDownTimer)
			
			const coldDown = () => {
				if (this.crtRedPacketRainIndex > -1) {
					let crtTime = new Date().getTime() - this.offsetTime
					
					console.log(
						`距离开始时间${Math.floor((startTime - crtTime) / 1000)}`, 
						`距离结束时间${Math.floor((endTime - crtTime) / 1000)}`
					)
					
					if (crtTime < startTime) { // 活动前
						this.coldDownTimer = setTimeout(() => {
							coldDown()
						}, 1000)
					} else if (crtTime < endTime) { // 活动中
						uni.showModal({
							title: '云车展红包雨来袭',
							showCancel: true,
							success: (res) => {
								if (res.confirm) {
									this.startRedPacket()
								} else if (res.cancel) {
									this.nextRedPacketRain()
								}
							}
						})
					} else { // 活动后
						this.nextRedPacketRain()
					}
				}
			}
			
			coldDown()
		},
		// 下一场红包雨
		async nextRedPacketRain () {
			console.log('进入下一场红包雨')
			if (this.crtRedPacketRainIndex + 1 < this.redPacketRainList.length) { // 进行下一场红包雨倒计时
				this.crtRedPacketRainIndex = this.crtRedPacketRainIndex + 1
				this.activityId = this.redPacketRainList[this.crtRedPacketRainIndex].id
				const status = await this.reqRedPacketStatus(this.activityId)
				if (status == 0) {
					this.redPacketRainColdDown(this.redPacketRainList[this.crtRedPacketRainIndex].startTime,this.redPacketRainList[this.crtRedPacketRainIndex].endTime)
				} else {
					this.nextRedPacketRain()
				}
			} else { //没有下一场
				console.log('没有下一场红包雨')
				this.crtRedPacketRainIndex = -1
			}
		},
		// 请求服务器时间
		async reqServerTime () {
			try {
				const res = await api.fetchServerTime()
				if (res.code == 200) {
					 this.offsetTime = new Date().getTime() - res.data
				} else {
					console.error(res.message)
				}
			} catch (err) {
				console.error(err)
			}
		},
		// 请求当日的红包雨活动
		async reqRedPacketRainList () {
			try {
				const res = await api.fetchRedPacketRainList()
				if (res.code == 200) {
					this.redPacketRainList = res.data
				} else {
					console.error(res.message)
				}
			} catch (err) {
				console.error(err)
			}			
		},
		// 请求开红包的状态 返回0为未开过红包 1为已开过红包
		async reqRedPacketStatus (activityId) {
			try {
				const res = await api.fetchRedPacketStatus({activityId})
				if (res.code == 200) {
					return res.data.status
				} else {
					console.error(res.message)
					return 1
				}
			} catch (err) {
				console.error(err)
				return 1
			}
		},
		startRedPacket () {
			console.log('开始红包雨')
			this.$nextTick(() => {
				let timer = setInterval(()=>{
					--this.tostCount
					console.log(this.tostCount)
					if(this.tostCount == 0){
						clearInterval(timer)
						this.tostCount = 4
						this.showPackage = true//是否显示红包雨
						this.$refs.redPacketActivity.startRedPacket(true,20000);
					}
				},1000)
			});
		},
		// 隐藏红包雨
		hidePackage () {
			this.showPackage = false
			this.nextRedPacketRain()
		},
		showMyWallet () {
			this.myWalletShow = true
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
	z-index: 10000;
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
