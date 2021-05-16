<template>
	<view :class="'articleList ' + (articleList.length == 0 && 'none-list')" v-if="isLoading">
		<!-- <mp-loading class="mp-loading" type="circle" tips="{{tips}}"></mp-loading> -->
		<block v-if="articleList.length > 0">
			<view class="zw"></view>
			<block v-for="(item,index) in articleList" :key="index">
				<view class="list-box" @tap="toArticlePage(item.articleId)">
					<image class="image" :src="item.pictureUrl" mode="scaleToFill" lazy-load="true"></image>
					<view class="tit">{{item.title}}</view>
					<view class="date">{{item.publishTime}}</view>
				</view>
			</block>
			<mp-loading type="circle"></mp-loading>
			<view class="bottom-tip">已经到底啦</view>
		</block>
		<block v-else>
			<view style="height:145rpx;"></view>
			<view class="none-icon"></view>
			<view class="none-text">敬请期待</view>
		</block>
	</view>
</template>

<script>
	import api from '@/public/api/index.js'
	let app = getApp()
	export default {
		data() {
			return {
				tips: "wos wenzi",
				pageNum: 1,
				allLoadList: false,
				isLoadList: false,
				isLoading: false,
				articleList: []
			}
		},
		methods: {
			toArticlePage(id) {
				let url = `/pages/article?articleId=${id}`
				uni.navigateTo({
					url
				})
			},
			async startGetData() {
				if (this.articleList.length == 0) {
					this.$emit('changeLoading', true)
					let vd = await this.getArticleList()
					this.$emit('changeLoading', false)
				}
				this.isLoading = true
			},
			async getArticleList() {
				if (!this.isLoadList) {
					this.isLoadList = true
					let data = await api.getArticleList({
						pageSize: 15,
						pageNum: this.pageNum
					})
					let total = Math.ceil(data.total / 15)

					if (total > this.pageNum) { //还有下一页
						this.pageNum++
						this.isLoadList = false
					} else { //全部加载完成
						this.allLoadList = true
					}
					let {
						rows = []
					} = data
					this.articleList = [...this.articleList, ...rows]
					if (this.articleList.length == 0) {
						this.isLoadList = false
					}
					return data
				} else {
					return false
				}
			},
			scrollGetData() {
				this.getArticleList()
			}
		}
	}
</script>

<style lang="less">
	@import '@/static/less/public.less';
	.articleList {
		position: relative;
		background: #f0f2f7;
		min-height: 100%;
	}

	.none-list {
		background: #fff;
	}

	.zw {
		height: 30rpx;
	}

	.list-box {
		position: relative;
		height: 236rpx;
		background: #fff;
		border-radius: 20rpx;
		margin: 0 32rpx 30rpx;

		.image {
			width: 240rpx;
			height: 160rpx;
			border-radius: 15rpx;
			.pa(410rpx, 36rpx);
		}

		.date {
			.seth(38rpx, 24rpx, #999);
			.pa(35rpx, 164rpx);
		}

		.tit {
			.pa(35rpx, 24rpx);
			width: 335rpx;
			line-height: 55rpx;
			color: #333;
			font-size: 36rpx;
			.fb;
			height: 110rpx;
			word-break: break-all;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
	}

	.bottom-tip {
		.seth(82rpx, 24rpx, #999);
		background: #f0f2f7;
		text-align: center;
		margin-top: -30rpx;
	}

	.none-icon {
		.setbg(610rpx, 312rpx, 'articleList-none-data-icon2.png');
		margin: 215rpx auto 0;
	}

	.none-text {
		.seth(126rpx, 28rpx, #999);
		.tc;
	}

	.mp-loading {
		height: 100rpx;
		font-size: 24rpx;
		width: 750rpx;
		display: block;
		background: #fff;
	}
</style>
