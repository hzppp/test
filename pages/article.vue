<template>
	<view class="article">
<!--    <button v-if="!haveUserInfoAuth" class="getUserInfo_name_info_mask_body" @tap="getWxUserInfoAuth"></button>-->
    <loading ref="loading"></loading>
		<share-pop ref="sharepop"></share-pop>
		<getFormidbox>
			<view class="content" slot="content">
				<page-top :background="'#fff'" :titleys="'#000'" :btnys="''" :title.sync="title"></page-top>
				<view class="header-box">
					<view class="tit">{{title}}</view>
					<view class="text">
						{{publishTime || ''}}
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
    <askOnline></askOnline>
		<view class="share-btn">
			<button open-type="share" plain="true" hover-class="none"></button>分享给好友
		</view>
	</view>
</template>

<script>
	import getFormidbox from '@/components/getFormIdModule/getFormIdModule'
	import pageTop from '@/components/pageTop/pageTop'
	import mpHtml from '@/components/mp-html/mp-html'
	import shareSuccess from '@/components/shareSuccess/shareSuccess'
	import askOnline from '@/components/askOnline/askOnline'

	import api from '@/public/api/index'
	import shouquan from '@/units/shouquan'
	let app = getApp()
	export default {
		components: {
			getFormidbox,
			htmlParser: mpHtml,
      askOnline,
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
			this.articleType = 2
			this.articleId = options.articleId
			let data = await api.getArticleContent(options.articleId)
			if(data.code !=1 || !data.data){
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
						url:`/pages/index`
					})
				},duration)
				return false
			}
      if(!data.data) {
        data.data = {
          content : '',
          title : '',
          publishTime : '',
          pictureUrl : ''
        }
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

	.share-btn {
		position: fixed;
		width: 100%;
		.tc;
		z-index: 999;
		left: 0;
		bottom: 0;
		.seth(100rpx, 32rpx, #fff);
		background: #ce1330;

		button {
			.pa(0, 0);
			width: 100%;
			height: 100%;
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
