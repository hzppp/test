<template>
	<view class="taskList">
		<page-top :background="'#fff'" :titleys="'#000'" :btnys="''" :title.sync="title"></page-top>
		<view class="header">
			<view class="number">{{credits}}</view>
			<view class="p1">我的众享币</view>
			<view class="btn" @tap="toCoinDetailsPage">众享币详情</view>
		</view>
		<view class="content">
			<view class="task-title">
				任务列表
			</view>
			<view class="t-item" v-for="(item,index) in taskList" :key="index">
				<image class="pic" :src="'../static/images/task'+(index+1)+'.png'" mode=""></image>
				<view class="txt">
					<view class="tit">
						{{item.title}}
					</view>
					<view class="desc">
						{{item.desc}}
					</view>
				</view>
				<view @tap="taskClick(index)" :class="'btn ' + (item.status == 1 ? 'disabled':'')">{{item.status == 1 ? '已完成':'去完成'}}</view>
			</view>
		</view>
		<view class="web-page-btn" @tap="toMall"></view>
	</view>
</template>

<script>
	import api from '@/public/api/index'
	import pageTop from '@/components/pageTop/pageTop'
	let app = getApp()
	export default {
		components: {
			'page-top': pageTop
		},
		data() {
			return {
				MallLink: "", //商城链接
				credits: 0,
				taskList: [],
				title: "我的众享币"
			}
		},
		async onLoad(options) {
			api.getCredits().then(res => {
				this.credits = res.data

			})
			let data = await api.getTaskList()
			let arr = data.data.filter(item => item.index !== 0 && item.index !== 2);
			this.taskList = arr

			console.log(arr)
		},
		methods: {
			taskClick(i) {
				let obj = this.taskList[i]
				console.log(obj)
				if (obj.status == 0) {
					let url = ''
					if (i == 0) {
						url = '/pages/autoTribe?current=1'
					} else if (i == 1) {
						url = '/pages/message'
					} else if (i == 2) {
						url = '/pages/mypage'
					}
					// if(i == 0){
					//     url = '/pages/autoTribe?current=5'
					// }else if(i == 1){
					//     url = '/pages/autoTribe?current=1'
					// }else if(i == 2){
					//     url = '/pages/welfareActivity'
					// }else if(i == 3){
					//     url = '/pages/message'
					// }else{
					//     url = '/pages/mypage'
					// }
					uni.reLaunch({
						url
					})
				}
			},
			towebView() {
				api.getMallLink().then(res => {
					let vurl = escape(res.data)
					let url = `/pages/webview?webURL=${vurl}`
					uni.navigateTo({
						url
					})
					console.log('MallLink', res)
				})
			},
			// 跳转商城页
			toMall(){
				uni.navigateTo({
					url:'/pages/mall/index'
				})
			},
			toCoinDetailsPage() {
				uni.navigateTo({
					url: '/pages/coinDetails'
				})
			}
		}
	}
</script>

<style lang="less">
	@import '@/static/less/public.less';

	.header {
		padding-top: 48rpx;
		height: 254rpx;
		background: #ce1330;
		.tc;

		.number {
			.seth(72rpx, 64rpx, #fff);
			.fb;
		}

		.p1 {
			.seth(46rpx, 24rpx, #ffc7c7);
		}

		.btn {
			width: 198rpx;
			.seth(54rpx, 24rpx, #ffc7c7);
			border: 1px solid #ffc7c7;
			border-radius: 54rpx;
			margin: 30rpx auto 0;

			&:after {
				.db(middle);
				content: "";
				width: 10rpx;
				height: 10rpx;
				border: 1px solid #ffc7c7;
				border-left: 0;
				border-bottom: 0;
				transform: rotate(45deg);
			}
		}
	}

	.content {
		position: relative;
		padding: 0 30rpx;
		// .setbg(750rpx,1044rpx,'20190909_3.png');
		// .setbg(750rpx,778rpx,'20200114_1.png');
		// .setbg(750rpx, 778rpx, '20201102_1.png');
		.task-title{
			padding-top: 35rpx;
			line-height: 85rpx;
			font-size: 36rpx;
			color: #333;
			font-weight: bold;
		}
		.t-item{
			height: 130rpx;
			display: flex;
			align-items: center;
			border-bottom: 1px solid #ebebeb;
			&:last-child{
				border-bottom: 0;
			}
			.pic{
				width: 72rpx;
				height: 72rpx;
				margin-right: 25rpx;
			}
			.txt{
				flex: 1;
				.tit{
					font-size: 28rpx;
					color: #333;
					line-height: 1;
					margin-bottom: 20rpx;
				}
				.desc{
					font-size: 24rpx;
					color: #999;
					line-height: 1;
				}
			}
			.btn {
				.tc;
				width: 138rpx;
				.seth(56rpx, 24rpx, #fff);
				background: #ce1330;
				border-radius: 56rpx;
				// .pa(580rpx, 162rpx);

				&.disabled {
					background: #ccc;
				}
			}
		}
	}
	.web-page-btn {
		width: 686rpx;
		height: 186rpx;
		background: url(https://www1.pcauto.com.cn/zt/gz20210125/audi/xcx/img/welfareActivity_top_banner.png) 0 0 no-repeat;
		background-size: 100% 100%;
		margin: 30rpx auto;
	}
</style>
