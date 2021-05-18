<template>
	<view class="live-detail">
		<!-- <page-top ref="pagetop" :background="'transparent'" :titleys="''" :btnys="''" :title.sync="title"></page-top> -->
		<!-- <page-top ref="pagetop" :background="'#e2ebf4'" :titleys="'#000'" :btnys="''" :title.sync="title"></page-top> -->
		<view class="pageTop-back-btn" @tap="navigateBack"></view>
		<view class="banner">
			<image :src="liveObj.picUrl"></image>
		</view>
		<view class="main-container">
			<view class="prev">
				将于2021-5-17 16:30开始
			</view>
			<view class="title">
				{{liveObj.title}}
			</view>
			<view class="userinfo">
				<image class="avator" :src="liveObj.picUrl"></image>
				<view class="name">
					名字
				</view>
			</view>
			<view class="intro">
				UNI-T新车首发，带你线上看车、体验未来科技量 产者的魅力，5月17日16点30分准时开播，点击订 阅关注准时收看~
			</view>
		</view>
		<view class="fixed-bot">
			<button open-type="share" class="btns icon-share">
				<view class="icon"></view>分享
			</button>
		</view>
	</view>
</template>

<script>
	// import tabBar from '@/components/tabBar/tabBar'
	// import shouquan from '@/units/shouquan'
	import pageTop from '@/components/pageTop/pageTop'
	let app = getApp()
	export default {
		components: {
			// viewTabBar: tabBar,
			'page-top': pageTop
		},
		mixins: [],
		data(){
			return{
				id:0,
				title:'12312',
				liveObj:{
					id:1,
					picUrl:'https://profile.csdnimg.cn/3/E/3/3_caseywei',
					startTime:'2021-12-12 03:20',
					status:1,
					title:'欢迎来到我的欢迎来到我的直播间欢迎来到我的直播间直播间',
				},
			}
		},
		methods:{
			navigateBack(){
				uni.navigateBack({
					delta: 1
				})
			},
		},
		onShareAppMessage(res) {
		    if (res.from === 'button') {// 来自页面内分享按钮
		      console.log(res.target)
		    }
		    return {
		      title: this.liveObj.title,
		      path: '/pages/liveDetail?id='+this.id
		    }
		},
		onLoad(options) {
			// console.log('app.globalData.currentLocation:', app.globalData.currentLocation)
		},
		onShow() {
			// console.log('app.globalData.wxUserInfo  show:', app.globalData.wxUserInfo)
		}
	}
</script>

<style lang="less">
	@import '@/static/less/public.less';
	.live-detail{
		padding-bottom:128rpx;
		.pageTop-back-btn{
			    width: 26rpx;
			    height: 26rpx;
			    border-left: 4rpx solid #fff;
			    border-top: 4rpx solid #fff;
			    position: absolute;
			    left: 30rpx;
			    top: 80rpx;
			    -webkit-transform: translate(0%, -50%) rotate(-45deg);
			    transform: translate(0%, -50%) rotate(-45deg);
				&::after{
					display: block;
					    content: "";
					    width: 180%;
					    height: 180%;
					    position: absolute;
					    left: -40%;
					    top: -40%;
					    z-index: 9999;
				}
		}
		.banner,.banner image{
			width:750rpx;
			height: 422rpx;
		}
		.main-container{
			padding:0 60rpx;
			box-sizing: border-box;
			.prev{
				background: url('@{imgURL}live_prev.png') 0 0 no-repeat;
				background-size: 140rpx 40rpx;
				padding-left: 156rpx;
				color: #fa843f;
				font-weight: 800;
				margin: 80rpx 0;
			}
			.title{
				font-size: 48rpx;
				font-weight: 800;
			}
			
			.userinfo {
				padding: 40rpx 0 24rpx;
				margin:30rpx 0;
				.dflex(center, flex-start);
			
				.avator {
					width: 64rpx;
					height: 64rpx;
					border-radius: 50%;
				}
			
				.name {
					color: #666666;
					font-size: 28rpx;
					margin-left: 20rpx;
				}
			}
			.intro{
				color: #999999;
				line-height: 48rpx;
				font-size: 28rpx;
			}
		}
		.fixed-bot{
			position: fixed;
			width: 100%;
			left: 0;
			bottom: 41rpx;
			.dflex(center,center);
			.btns{
				width: 330rpx;
				height: 88rpx;
				line-height: 88rpx;
				background-color: #fff3ed;
				border-radius: 44rpx;
				color:#FA843F;
				
				.dflex(center,center);
				.icon{
					.setbg(48rpx,48rpx,'share_btn.png');
					margin-right: 18rpx;
				}
			}
		}
	}
	
</style>
