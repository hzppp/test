<template>
	<view class="myfollow">
		<page-top ref="pagetop" :background="'#fff'" :titleys="'#000'" :isstoppageback.sync="isstoppageback" :btnys="''"
		 :title.sync="title"></page-top>
		<view class="content">
			<scroll-view class="scroll-view" scroll-y scroll-with-animation @scrolltolower="scrollTolowerGetList"
			 lower-threshold="250">
				<view class="lists">
					<block v-for="(item,index) in list" :key="index">
						<view class="item">
							<image class="head" :src="item.wxHead" mode="scaleToFill" lazy-load="true" @tap="toMyFollowPage(item.userId)"></image>
							<view class="name">{{item.wxName}}</view>
							<view class="follow-number">{{item.num || 0}} 粉丝</view>
							<view :class="'follow-btn '+(item.type == 0 ? 'open':'')" @tap="btnEvent(index)">{{item.type == 0 ? "+关注":"取消关注"}}</view>
						</view>
					</block>
				</view>
				<view class="none-data-tip" v-if="loadAll">没有更多了</view>
			</scroll-view>
		</view>
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
				title: "我的关注",
				type: "",
				isstoppageback: false,
				page: 1,
				pageSize: 10,
				loadAll: false, //是否加载全部数据
				loadIng: false, //是否加载中
				list: []
			}
		},
		onLoad(options) {
			this.type = options.type
			if (this.type == 'fans') { //我的粉丝
				this.title = "我的粉丝"
			}
			this.getList()
		},
		methods: {
			// 滚动加载数据
			scrollTolowerGetList() {
				this.getList()
			},
			// 关注按钮点击
			async btnEvent(index) {
				let obj = this.list[index]
				let type = obj.type
				let userId = obj.userId
				let data
				if (type) {
					data = await api.cancelFocus(userId)
				} else {
					data = await api.addFocus(userId)
				}
				let {
					code,
					msg
				} = data
				console.log(data)
				if (code == 1) {
					obj.type = !obj.type
				} else {
					this.showToast(msg)
				}

			},
			// 跳转个人中心
			toMyFollowPage(id) {
				let url = `/pages/personalHome?userid=${id}`
				uni.navigateTo({
					url
				})
			},
			// 获取列表数据
			async getList() {
				if (this.loadIng || this.loadAll) {
					console.log('数据加载中或者已经加载完成')
					return false
				}
				let data
				this.loadIng = true
				if (this.type == 'fans') {
					data = await api.getMyFans(this.page, this.pageSize)
				} else {
					data = await api.getMyFocus(this.page, this.pageSize)
				}
				let {
					rows,
					total
				} = data
				let totalPage = Math.ceil(total / this.pageSize)
				this.page++
				this.loadIng = false
				if (this.page > totalPage) {
					this.loadAll = true
				}
				this.list = rows

				console.log(rows)
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
	@import (reference) '@/static/less/public.less';

	.myfollow {
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		display: flex;
		flex-direction: column;
	}

	.content {
		width: 100%;
		flex: auto;
		position: relative;

		.scroll-view {
			.pa(0, 0);
			width: 100%;
			height: 100%;
		}

		.lists {
			margin: 0 22rpx;
		}

		.item {
			padding: 22rpx 150rpx 22rpx 124rpx;
			border-bottom: 1px solid #ebebeb;
			height: 100rpx;
			position: relative;

			.head {
				.arc(100rpx);
				.pa(0, 50%);
				transform: translate(0, -50%);
			}

			.name,
			.follow-number {
				width: 400rpx;
				.ellipsis;
			}

			.name {
				.seth(55rpx, 34rpx, #333);
				margin-bottom: 3rpx;
			}

			.follow-number {
				.seth(42rpx, 24rpx, #999);
			}

			.follow-btn {
				.tc;
				width: 126rpx;
				.seth(54rpx, 24rpx, #999);
				border: 1px solid #ccc;
				border-radius: 4rpx;
				position: absolute;
				top: 50%;
				right: 0;
				transform: translate(0, -50%);

				&.open {
					color: #fff;
					background: #ce1330;
					border-color: #ce1330;
				}
			}
		}
	}

	.none-data-tip {
		.tc;
		.seth(104rpx, 24rpx, #999);
	}
</style>
