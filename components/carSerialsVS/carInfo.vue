<template>
	<!-- 车系对比顶部车型pk模块 -->
	<view class='car_info'>
		<block v-if="types==0">
			<view class="info_box">
				<view class="list" @tap="tofirmIndex(leftSerial.serialId)">
					<view class="car_img_box">
						<image :src="leftSerial.baiPic" mode="aspectFill"></image>
					</view>
					<view class="gh" @tap.stop="changeCarSearial(0)">
						更换
					</view>
					<view class="car_name">
						<text>{{leftSerial.name}}</text>
					</view>
					<view class="car_price left">
						<text>{{leftSerial.price}}</text>
					</view>
					<!-- <block v-if="leftSerial.maxDiscount !=''">
						<view class="car_message">
							最高优惠: <text :style="[{color:'#ff4444'}]">99万</text>
						</view>
					</block>
					<block v-else>
						<view class="car_message">
							<text>暂无优惠</text>
						</view>
					</block> -->
					<view class="car_btn">
						<block v-if="leftSerial.jumpType == 1">
							<view @tap.stop="toXdj(leftSerial.serialId)" class="left-btn">预约试驾</view>
						</block>
						<block v-else>
							<view class="none left-btn" @tap.stop>预约试驾</view>
						</block>
					</view>
				</view>
				<view class="line">官方价</view>
				<view class="list" @tap="tofirmIndex(rightSerial.serialId)">
					<view class="car_img_box">
						<image :src="rightSerial.baiPic" mode="aspectFill"></image>
					</view>
					<view class="gh" @tap.stop="changeCarSearial(1)">
						更换
					</view>
					<view class="car_name">
						<text>{{rightSerial.name}}</text>
					</view>
					<view class="car_price right">
						<text>{{rightSerial.price}}</text>
					</view>
					<!-- <block v-if="rightSerial.maxDiscount !=''">
						<view class="car_message">
							最高优惠: <text :style="[{color:'#ff4444'}]">99万</text>
						</view>
					</block>
					<block v-else>
						<view class="car_message">
							<text>暂无优惠</text>
						</view>
					</block> -->
					<view class="car_btn">
						<block v-if="rightSerial.jumpType == 1">
							<view @tap.stop="toXdj(rightSerial.serialId)" class="right-btn">预约试驾</view>
						</block>
						<block v-else>
							<view class="none right-btn" @tap.stop>预约试驾</view>
						</block>
					</view>
				</view>
			</view>
		</block>
		<block v-else>
			<view class="info_box2">
				<view class="list" @tap="tofirmIndex(leftSerial.serialId)">
					<view class="gh" @tap.stop="changeCarSearial(0)">
						更换
					</view>
					<view class="car_message">
						<view class="car_image">
							<image :src="leftSerial.baiPic" mode="aspectFill"></image>
						</view>
						<view class="car_name">
							{{leftSerial.name}}
						</view>
					</view>
				</view>
				<view class="pk">
					<image src="../../static/images/PK.png" mode="aspectFill"></image>
				</view>
				<view class="list" @tap="tofirmIndex(rightSerial.serialId)">
					<view class="car_message">
						<view class="car_image">
							<image :src="rightSerial.baiPic" mode="aspectFill"></image>
						</view>
						<view class="car_name">
							{{rightSerial.name}}
						</view>
					</view>
					<view class="gh" @tap.stop="changeCarSearial(1)">
						更换
					</view>
				</view>
			</view>
		</block>
	</view>
</template>
<script>
	export default {
		props:["types",'leftSerial','rightSerial'],
		methods:{
			// 前往车系详情页
			tofirmIndex(serialId){
				uni.navigateTo({
					url:"/pages/firmIndex/firmIndex?serialId="+serialId
				})
			},
			// 0left 1right
			changeCarSearial(index){
				this.$emit("changeCarSearial",index)
			},
			// 询底价
			toXdj(serialId){
				uni.navigateTo({
					url:"/pages_car/xdj/xdj?sid="+serialId
				})
			}
		}
	}
</script>
<style lang="scss">
	.car_info{
		padding: 0 40rpx;
		padding-top: 55rpx;
		position: fixed;
		top: 0;
		left: 0;
		background: #fff;
		z-index: 100;
		.info_box{
			@include flex_left_center;
			.list{
				flex: 1;
				@include flex_center_center;
				flex-wrap: wrap;
				position: relative;
				.gh{
					position: absolute;
					right: 40rpx;
					top: -20rpx;
					width: 80rpx;
					height: 48rpx;
					color: rgb(51, 51, 51);
					background-color: rgb(247, 247, 247);
					border-radius: 100px;
					font-size: 24rpx;
					@include flex_center_center
				}
				.car_img_box{
					width: 100%;
					height: 135rpx;
					@include flex_center_center;
					image{
						width: 180rpx;
						height: 100%;
						background: url(https://magear.pcauto.com.cn/p/www1.pcauto.com.cn/2019515app/default/270x202.png) no-repeat;
						background-size: 100% 100%;
					}
				}
				.car_name{
					width: 100%;
					text-align: center;
					margin-top: 10rpx;
					font-weight: bold;
					font-size: 32rpx;
					color: rgb(51, 51, 51);
					tetx{
						@include text()
					}
				}
				.car_price{
					width: 100%;
					text-align: center;
					margin-top: 18rpx;
					font-size: 24rpx;
                    &.left {
                        color: #fa8943;
                    }
                    &.right {
                        color: #55a4f1;
                    }
					tetx{
						@include text()
					}
				}
				.car_message{
					font-size: 24rpx;
					color: rgb(51, 51, 51);
					margin-top: 18rpx;
					width: 100%;
					text-align: center;
					tetx{
						@include text()
					}
				}
				.car_btn{
					width: 100%;
					height: 85rpx;
					@include flex_center_bottom;
					view{
						background: #f90;
						border-radius: 100px;
						@include flex_center_center;
						color: #fff;
						font-size: 28rpx;
						width: 200rpx;
						height: 65rpx;
					}
					.none{
						background: #cfd2d5;
					}
                    .left-btn {
                        width: 100px;
                        height: 32px;
                        border-radius: 32px;
                        line-height: 32px;
                        color: #ffffff;
                        background-color: #fa8943;
                    }
                    .right-btn {
                        width: 100px;
                        height: 32px;
                        border-radius: 32px;
                        line-height: 32px;
                        color: #ffffff;
                        background-color: #55a4f1;
                    }
				}
			}
			.line{
                margin-top: 60px;
                color: #999999;
                font-size: 24rpx;
			}
		}
		.info_box2{
			padding:0 20rpx 40rpx 20rpx;
			@include flex_left_center;
			.list{
				flex: 1;
				height: 160rpx;
				@include flex_left_center;
				.gh{
					width: 80rpx;
					background-color: rgb(247, 247, 247);
					height: 48rpx;
					font-size: 24rpx;
					@include flex_center_center;
					border-radius: 100px;
					color: rgb(51, 51, 51);
				};
				.car_message{
					width: calc(100% - 100rpx);
					height: 100%;
					@include flex_center_center;
					flex-wrap: wrap;
					align-content: center;
					.car_image{
						width: 100%;
						height: 120rpx;
						@include flex_center_center;
						image{
							height: 100%;
							width: 160rpx;
							background: url(https://magear.pcauto.com.cn/p/www1.pcauto.com.cn/2019515app/default/270x202.png) no-repeat;
							background-size: 100% 100%;
						}
					}
					.car_name{
						width: 100%;
						text-align: center;
						@include text(1);
						margin-top: 10rpx;
						font-size: 32rpx;
						color: rgb(51, 51, 51);
						font-weight: bold;
					}
				}
				&:last-child{
					.car_message{
						margin-left: 20rpx;
					}
				}
			}
			.pk{
				width: 65rpx;
				height: 100%;
				@include flex_center_center;
				image{
					height: 42rpx;
				}
			}
		}
	}
	
</style>
