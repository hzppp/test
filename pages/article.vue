<template>
	<view class="article">
		<button v-if="isUserInfoPage" class="getUserInfo_name_info_mask_body" lang="zh_CN" @getuserinfo="getWxUserInfoButton"
		 open-type="getUserInfo"></button>
		<loading ref="loading"></loading>
		<share-pop ref="sharepop"></share-pop>
		<getFormidbox>
			<view class="content" slot="content">
				<page-top :background="'#fff'" :titleys="'#000'" :btnys="''" :title.sync="title"></page-top>
				<view class="header-box">
					<view class="tit">{{title}}</view>
					<view class="text">
						{{publishTime}}
					</view>
				</view>
				<view class="m-html" v-if="articleType == 2">
					<htmlParser :content="content"></htmlParser>
				</view>
				<block v-else>
					<view class="content_zb">
						<view class="panel" v-for="(paperItem,idx) in paperContent" :key="idx">
							<view class="tit">{{paperItem.title}}</view>
							<view class="txt" v-for="(cell,cellindex) in paperItem.description" :key="cellindex">
								<view>{{cell}}</view>
							</view>
						</view>
					</view>
				</block>
				<view class="zw"></view>
			</view>
		</getFormidbox>
		<view class="operation-list">
			<view class="type-a">
				<button class="share-btn" open-type="share" plain="true" hover-class="none">分享给好友</button>
				<button class="enroll-btn" hover-class="none">报名活动</button>
			</view>
			<!-- <view class="type-b">
				<button class="share-btn" open-type="share" plain="true" hover-class="none">分享给好友</button>
			</view> -->
			<!-- <view class="type-c">
				<button class="over-btn" hover-class="none">活动已结束</button>
			</view> -->
		</view>
	</view>
</template>

<script>
	import getFormidbox from '@/components/getFormIdModule/getFormIdModule'
	import pageTop from '@/components/pageTop/pageTop'
	import mpHtml from '@/components/mp-html/mp-html'
	import shareSuccess from '@/components/shareSuccess/shareSuccess'

	import api from '@/public/api/index'
	import shouquan from '@/units/shouquan'
	let app = getApp()
	export default {
		components: {
			getFormidbox,
			htmlParser: mpHtml,
			'page-top': pageTop,
			'share-pop': shareSuccess
		},
		data() {
			return {
				paperContent: [],
				articleType: "",
				articleId: "",
				title: "",
				publishTime: "",
				content: '',
				pictureUrl: ''
			}
		},
		mixins: [shouquan],
		async onLoad(options) {
			// this.$invoke('loading','changeLoading',true)
			this.$refs.loading.changeLoading(true)
			console.log('options',options)
			this.articleType = options.type
			this.articleId = options.articleId
			let data = await api.getArticleContent(options.articleId,this.articleType)
			if(data.code !=1){
				// this.$invoke('loading','changeLoading')
				this.$refs.loading.changeLoading(false)
				let duration = 2000
				uni.showToast({
					title: '文章已被删除，请查看其它文章',
					icon: 'none',
					duration: duration
				})
				setTimeout(()=>{
					uni.reLaunch({
						url:`/pages/autoTribe?current=1`
					})
				},duration)
				return false
			}

			let {
				content = '',
				title = '',
				publishTime = '',
				pictureUrl = ''
			} = data.data
			this.title = title
			this.publishTime = publishTime
			this.pictureUrl = pictureUrl
			if(this.articleType == 1){
				let paperarray = JSON.parse(content)
				var array = [];
				for (var i = 0; i < paperarray.length; i++) {
					array = paperarray[i].description.split('\r\n\r\n')
					paperarray[i].description = array;
				}
				this.paperContent = paperarray
			}else{
				this.content = content
			}
			this.$refs.loading.changeLoading(false)
		},
		onShareAppMessage(){
			let title = this.title
			let path = `pages/authorization?to=article&articleId=${this.articleId}&type=${this.articleType}`
			console.log(path)
			api.shareArticle(this.articleId,this.articleType).then(res=>{
				console.log(res)
				if(res.data > 0){
					// setTimeout(()=>{
					//     this.$invoke('share-pop','shareSuccessShow',res.data,'转发成功')
					// },800)
				}
			})
			return {
				title: title,
				path: path,
				imageUrl: this.pictureUrl
			}
		},
		methods: {

		}
	}
</script>

<style lang="less">
	@import '@/static/less/dynamic.less';

	.head {
		height: 200rpx;
		background: #f00;
	}

	.content {
		position: relative;
		z-index: 9;
		.m-html{
			padding: 0 30rpx;
		}
	}

	.header-box {
		padding: 30rpx 32rpx 0;

		.tit {
			font-size: 48rpx;
			line-height: 65rpx;
			color: #333;
			.fb;
		}

		.text {
			.seth(98rpx, 28rpx, #999);

			text {
				margin-left: 20rpx;
			}
		}
	}

	.zw {
		height: 100rpx;
	}

	.operation-list {
		position: fixed;
		z-index: 999;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 104rpx;
		font-size: 32rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		.type-a {
			display: flex;
			justify-content: space-between;
			padding: 0 32rpx;
			box-sizing: border-box;
			.share-btn {
				width: 236rpx;
				height: 88rpx;
				color: #fa8845;
				border: 2rpx solid #fa8845;
				border-radius: 44rpx;
				box-sizing: border-box;
			}
			.enroll-btn {
				width: 420rpx;
				height: 88rpx;
				color: #ffffff;
				background-color: #fa8845;
				border-radius: 44rpx;
			}			
		}
		.type-b {
			padding: 0 32rpx;
			box-sizing: border-box;
			.share-btn {
				width: 686rpx;
				height: 88rpx;
				color: #ffffff;
				background-color: #fa8845;
				border-radius: 44rpx;
			}
		}
		.type-c {
			padding: 0 32rpx;
			box-sizing: border-box;
			.over-btn {
				width: 686rpx;
				height: 88rpx;
				color: #ffffff;
				background-color: #cccccc;
				border-radius: 44rpx;
			}
		}
	}

	.content_zb {
		padding: 20rpx 30rpx;

		.tit {
			color: #ff5a05;
			font-size: 36rpx;
			padding: 20rpx;
			text-align: center;
			position: relative;
			display: inline-block;
			margin-bottom: 30rpx;
		}

		.tit:before {
			width: 56rpx;
			height: 4rpx;
			display: inline-block;
			position: absolute;
			content: "";
			background: url(//www1.pcauto.com.cn/wap/pocket/v15/0611/tit_left_03.png) no-repeat;
			background-size: 100% 100%;
			left: -56rpx;
			top: 45rpx;
		}

		.tit:after {
			width: 56rpx;
			height: 4rpx;
			display: inline-block;
			position: absolute;
			content: "";
			background: url(//www1.pcauto.com.cn/wap/pocket/v15/0611/tit_right_03.png) no-repeat;
			background-size: 100% 100%;
			right: -56rpx;
			top: 45rpx;
		}

		.panel {
			text-align: center
		}
	}

	.content_zb .panel .txt view {
		display: block;
		color: #333;
		font-size: 30rpx;
		text-align: left;
		margin-bottom: 35rpx;
		line-height: 45rpx;
	}
</style>
