<template>
	<view class="subjectList" v-if="isLoading">
		<block v-if="list.length > 0">
			<view class="list-box" v-for="(item,index) in list" :key="index" @tap="toztdetailsPage(item.themeId)">
				<image class="image" :src="item.listPic" mode="scaleToFill" lazy-load="true"></image>
				<view class="text">
					<view class="zt">#{{item.themeName}}#</view>
					<view class="number">{{item.dynamicCount}}人参与</view>
				</view>
			</view>
			<view class="bottom-tip" v-if="allLoadList">已经到底啦</view>
		</block>
		<block v-else>
			<view style="height:145rpx"></view>
			<view class="none-icon"></view>
			<view class="none-text">暂时还没有主题，敬请期待吧~</view>
		</block>
	</view>
</template>

<script>
	import api from '@/public/api/index.js'
	let app = getApp()
	export default {
		data() {
			return {
				allLoadList: false,
				isLoading: false,
				isLoadList: false,
				page: 1, //页码
				pageSize: 15, //页大小
				list: []
			}
		},
		methods: {
			toztdetailsPage(id) {
				let url = `/pages/ztdetails?themeId=${id}`
				uni.navigateTo({
					url
				})
			},
			async startGetData() { //首次加载数据
			
				console.log('首次加载数据subjectList')
				if (this.list.length == 0) {
					this.$emit('changeLoading', true)
					// this.$invoke('../loading', 'changeLoading', true)
					await this.getThemeList()
					this.$emit('changeLoading', false)
				}
				this.isLoading = true

			},
			scrollGetData() { //滚动加载数据
				// console.log('scrollGetData-subjectList')
				this.getThemeList()
			},
			async getThemeList() {
				if (!this.isLoadList) {
					this.isLoadList = true
					let data = await api.getThemeList({
						regionId: app.globalData.currentLocation.cityData.cityId,
						page: this.page,
						pageSize: this.pageSize
					})
					data.total = Math.ceil(data.total / data.pageSize)
					if (data.total > this.page) {
						this.page++
						this.isLoadList = false
					} else {
						this.allLoadList = true
					}
					let {
						rows = []
					} = data
					console.log(rows)
					this.list = [...this.list, ...rows]
					if (this.list.length == 0) {
						this.isLoadList = false
					}

				} else {
					return false
				}
			}
		}
	}
</script>

<style lang="less">
	@import '@/static/less/public.less';

	.list-box {
		margin: 24rpx 32rpx 0;
		font-size: 0;
		position: relative;
		overflow: hidden;
		border-radius: 15rpx;

		&:before {
			display: block;
			content: "";
			.pa(0, 0);
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, .5);
		}

		.image {
			width: 686rpx;
			height: 236rpx;
		}

		.text {
			.pa(32rpx, 50%);
			transform: translate(0, -50%);
		}

		.zt {
			padding: 12rpx 0;
			.seth(50rpx, 36rpx, #fff);
			// line-height: 50rpx;
			.fb;
			height: auto;
		}

		.number {
			.seth(61rpx, 24rpx, #dedede);
		}
	}

	.bottom-tip {
		.seth(82rpx, 24rpx, #999);
		text-align: center;
	}

	.none-icon {
		.setbg(406rpx, 294rpx, 'subjectList-none-data-icon.png');
		margin: 0 auto;
	}

	.none-text {
		.seth(126rpx, 28rpx, #999);
		.tc;
	}
</style>
