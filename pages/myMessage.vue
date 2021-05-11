<template>
	<view class="myMessage">
		<!-- <getFormidbox> -->
		<scroll-view lower-threshold="350" @scrolltolower="scrollGetData" class="scroll-view" scroll-y scroll-with-animation>
			<view class="content">
				<page-top :background="'#fff'" :titleys="'#000'" :btnys="''" :title.sync="title"></page-top>
				<block v-if="list.length > 0">
					<view class="myMessage-list">
						<!-- <block v-for="{{20}}"> -->
						<view class="list-box" v-for="(item,index) in list" :key="index" @tap="toDynamicDetailsPage(index)">
							<image class="image" :src="item.wxHead" mode="widthFix" lazy-load="true"></image>
							<view class="name-date">
								{{item.nickName}}
								<view class="date">{{item.createTime}}</view>
							</view>
							<view class="pl-type">{{item.type == 1 && '回复了你的评论' || item.type == 2 && '评论了你的动态' || '点赞了你的动态'}}</view>
							<view class="pl-content" v-if="item.content">
								{{item.content}}
							</view>
						</view>
						<!-- </block> -->
					</view>
				</block>
				<block v-else>
					<view style="height:140rpx"></view>
					<view class="none-icon"></view>
					<text class="none-text">您暂时还没有消息，\n快去车友圈参与互动吧！</text>
					<view class="none-btn" @tap="toputDynamic">去车友圈</view>
				</block>
			</view>
		</scroll-view>
		<!-- </getFormidbox> -->
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
				title: "消息中心",
				list: [],
				page: 1,
				isLoadList: false,
				pageSize: 15
			}
		},

		async onLoad(options) {
			this.getMsg()
		},
		methods: {
			toputDynamic() {
				let url = `/pages/putDynamic`
				uni.reLaunch({
					url: `/pages/autoTribe?current=1`
				})
			},
			scrollGetData() {
				console.log('---')
				this.getMsg()
			},
			toDynamicDetailsPage(i) { //去动态详情页
				let obj = this.list[i]
				let dynamicId = obj.dynamicId
				if (obj.status == 1 || !dynamicId) {
					this.showToast("动态已作废")
					return false
				}
				let url = `/pages/dynamicDetails?dynamicId=${dynamicId}`
				uni.navigateTo({
					url
				})
			},
			async getMsg() {
				if (this.isLoadList) {
					return false
				}
				this.isLoadList = true
				let data = await api.getUserMessage(this.page, this.pageSize)
				let total = Math.ceil(data.total / this.pageSize)
				console.log("total:", total, "page:", this.page)
				if (total > this.page) {
					this.page++
					this.isLoadList = false
				}
				this.list = [...this.list, ...data.rows]
			},
			showToast(text = '', duration = 2000) {
				uni.showToast({
					title: text,
					icon: 'none',
					duration: duration
				})
			}
		}
	}
</script>

<style lang="less">
	@import '@/static/less/public.less';

	.pageTop {
		border-bottom: 1px solid #ddd;
	}

	.content {
		position: relative;
		z-index: 9;
	}

	.myMessage-list {
		margin: 0 32rpx;
	}

	.list-box {
		padding: 30rpx 0 30rpx 119rpx;
		min-height: 90rpx;
		position: relative;
		border-bottom: 1px solid #ebebeb;

		.image {
			.arc(80rpx);
			.pa(0, 30rpx);
		}

		.name-date {
			.seth(43rpx, 32rpx, #333);
			.fb;
		}

		.date {
			font-size: 24rpx;
			color: #aaa;
			float: right;
			font-weight: initial;
		}

		.pl-type {
			.seth(42rpx, 22rpx, #999);
		}

		.pl-content {
			font-size: 28rpx;
			color: #666;
			line-height: 42rpx;
			height: 84rpx;
			word-break: break-all;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
	}

	.list-box:last-child {
		border-bottom: 0;
	}

	.none-icon {
		.setbg(406rpx, 292rpx, 'dynamic-none-data-icon.png');
		margin: 84rpx auto 0;
	}

	.none-text {
		color: #999;
		display: block;
		font-size: 28rpx;
		line-height: 42rpx;
		margin-top: 38rpx;
		.tc;
	}

	.none-btn {
		width: 460rpx;
		.tc;
		.fb;
		.seth(88rpx, 32rpx, #fff);
		background: #ce1330;
		margin: 42rpx auto 0;
		border-radius: 88rpx;
	}

	.scroll-view {
		width: 100%;
		height: 100%;
		.pa(0, 0);
	}
</style>
