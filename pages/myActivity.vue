<template>
	<view class="welfareActivity">

		<scroll-view class="scroll-view" @scrolltolower="getList" lower-threshold="200" scroll-y scroll-with-animation>

			<view class="box">

				<view class="activity-list" v-if="activityList.length > 0">
					<block v-for="(item,index) in activityList" :key="index">
						<view class="pic-text" @tap="toActivityPage(item.id)">
							<image mode="aspectFill" :src="item.picUrl" lazy-load="true"></image>
							<view class="activity-label-text">
								<view :class="'label '+ item.typeClass">
									{{item.typeText}}
								</view>
								<view class="text">{{item.name}}</view>
							</view>
						</view>
					</block>
				</view>
				<view v-else class="activity-list-none">
					<view class="tips">
						还没参加过活动哦~
					</view>
				</view>
			</view>

		</scroll-view>
	</view>
</template>

<script>
	import api from '@/public/api/index'
	let app = getApp()
	export default {
		components: {

		},
		mixins: [],
		data() {
			return {
				pageNum: 1,
				pageSize: 10,
				hasNext: true,
				activityList: [
				// 	{
				// 	type: 1,
				// 	id: '1',
				// 	picUrl: 'https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/welfareActivity2.png',
				// 	name: '测试标题'
				// },
				],
			}
		},
		async onShow() {

		},
		async onLoad() {
			this.getList()
		},

		methods: {
			toActivityPage(id) {
				let url = '/pages/activity?id=' + id
				uni.navigateTo({
					url
				})
			},

			// 获取活动列表
			async getList() {
				if (!this.hasNext) {
					return false;
				}
				let resData = await api.getActivityUser({
					pageNum: this.pageNum,
					pageSize: this.pageSize
				})
				if (resData.hasNext) {
					this.pageNum++
				} else {
					this.hasNext = false
				}
				let rows = resData.rows
				for (let i in rows) {
					let obj = rows[i]
					let type = obj.type
					let typeText
					let typeClass
					if (type == 1) {
						typeText = '购车福利'
						typeClass = 'red-bg'
					} else if (type == 2) {
						typeText = '车主福利'
						typeClass = ''
					}else if (type == 4) {
						typeText = '试驾活动'
						typeClass = ''
					} else {
						typeText = '线下活动'
						typeClass = 'yellow-bg'
					}
					obj.typeText = typeText
					obj.typeClass = typeClass
				}
				this.activityList = [...this.activityList, ...rows]
				console.log('activityList', this.activityList)
			},

		}
	}
</script>

<style lang="less">
	@import '@/static/less/welfareActivity.less';
</style>
<style lang="less" scoped>
	.activity-list-none {
		margin-top: 200rpx;
	}

	.activity-list .pic-text {
		margin-top: 15rpx;
		box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.10);
		.label{
			font-size: 20rpx;
			    color: #fff;
		}
	}
</style>
