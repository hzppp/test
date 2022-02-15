<template>
	<view class="register">
		<view class="introduction">
			<text>请选择心仪的车型</text>
		</view>
		<scroll-view scroll-y="true" style="height: 825rpx;">
				<view class="content">
					<view v-for="i in 8" class="carBox" @click="chooseCar(i)" :class="{'active': i == activeCar}">
						<view class="carImg">
							<image src="../static/images/car1.png" mode="" class="img"></image>
						</view>
						<!-- <view class="carName"> -->
						<text class="carName">UNI-T</text>
						<!-- </view> -->
					</view>
				</view>
		</scroll-view>
		<view class="bottom">
			<view class="tel">
				<view class="tel-label">
					手机号
				</view>
				<!-- <view class="tel-input"> -->
					<input class="tel-input" type="text" value="" placeholder="点击授权微信手机号" />
				<!-- </view> -->
			</view>
			<!-- <view class="code">
				<view class="code-label">
					验证码
				</view>
				<view class="code-input">
					<input type="text" value="" placeholder="请输入验证码" />
				</view>
			</view> -->
			
			<view class="submit">
				<view class="sub-text">
					提交登记信息
				</view>
			</view>
			
			<view class="tongyi">
				点击按钮即视为同意《用户隐私协议》
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				carsList : [
					{
						imgUrl : ''
					}
				],
				activeCar : 0
			}
		},
		methods: {
			chooseCar(i){
				console.log(i)
				this.activeCar = i
			}
		}
	}
</script>

<style lang="less">
@import '@/static/less/public.less';
.register{
	position: relative;
	height: 100vh;
}

.introduction{
	margin-bottom: 29rpx;
}

.introduction text{
	width: 167rpx;
	height: 20rpx;
	font-size: 24rpx;
	font-family: changan uni type, changan uni type-Regular;
	font-weight: 400;
	text-align: left;
	color: #999999;
	margin-left: 4%;
}

.content{
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	padding: 0 32rpx;
}

.content .carBox{
	width: 330rpx;
	height: 298rpx;
	border-radius: 20rpx;
	margin-bottom: 24rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	box-sizing: border-box;
}

.carImg{
	width: 290rpx;
	height: 193rpx;
	margin: 20rpx;
}

.img{
	width: 100%;
	height: 100%;
	border-radius: 20rpx;
}

.carName{
	text-align: center;
	height: 19rpx;
	font-size: 26rpx;
	font-family: changan uni type, changan uni type-Bold;
	font-weight: 700;
	text-align: center;
	color: #333333;
	margin-top: 2%;
	margin-bottom: 40rpx;
}

.bottom{
	width: 750rpx;
	height: 310rpx;
	box-sizing: border-box;
	background: #ffffff;
	// border-radius: 20px;
	box-shadow: 0rpx -8rpx 6rpx 6rpx rgba(0,0,0,0.05); 
	padding: 0 32rpx 0 32rpx;
}

.tel{
	height: 114rpx;
	display: flex;
	align-items: center;
	margin-top: 17rpx;
	border-bottom: 1px solid #ebebeb;
}


.tel-label{
	width: 94rpx;
	font-size: 32rpx;
	font-family: changan uni type, changan uni type-Bold;
	font-weight: 700;
	text-align: left;
	color: #333333;
}

.tel-input{
	width: 285rpx;
	height: 27rpx;
	font-size: 32rpx;
	font-family: changan uni type, changan uni type-Regular;
	font-weight: 400;
	text-align: left;
	color: #999999;
	margin-left: 90rpx;
}

.submit{
	width: 686rpx;
	height: 88rpx;
	background: #fa8845;
	border-radius: 44rpx;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 30rpx;
}

.sub-text{
	width: 190rpx;
	height: 26rpx;
	font-size: 32rpx;
	font-family: changan uni type, changan uni type-Regular;
	font-weight: 400;
	text-align: center;
	color: #ffffff;
	vertical-align: center;
	margin-top: -11rpx;
	// margin-top: 32rpx;
	// margin-bottom: 30rpx;
}

.active{
	border: 4rpx solid #fa8845;
}

.tongyi{
	// width: 398rpx;
	// height: 20rpx;
	font-size: 24rpx;
	font-family: changan uni type, changan uni type-Regular;
	font-weight: 400;
	text-align: center;
	color: #999999;
	margin: 0 auto;
}
</style>
