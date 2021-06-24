<template>
	<view class="welfareActivity">

		<scroll-view class="scroll-view" @scrolltolower="getList" lower-threshold="200" scroll-y scroll-with-animation>

			<view class="box">

				<view class="activity-list" v-if="activityList.length > 0">
					<block v-for="(item,index) in activityList" :key="index">
						<view class="pic-text" @tap="toActivityPage(item)">
							<image mode="aspectFill" :src="item.picUrl" lazy-load="true"></image>
							<view class="activity-label-text">
								<view class="label">
								<image class="logo" src="../static/images/gift-logo.png" mode="aspectFit"></image>
								  <view class="label-name">{{ item.typeText }}</view>
								</view>
								<view class="text">{{item.name}}</view>
							</view>
              <view class="desc">
                <view class="left-area">
                  <view><view class="locationCot" v-if="item.type==3"><view class="cityName">{{item.city}}</view><view class="line"></view></view><view class="date">{{item.startTime | dateFilter}} - {{item.endTime | dateFilter}}</view></view>
                  <view class="info">
                    <view v-show="item.visitCount"><span class="num">{{item.visitCount | numFilter}}</span>人感兴趣</view>
                    <view v-show="item.visitCount && item.clueCount" class="line"></view>
                    <view v-show="item.clueCount"><span class="num">{{item.clueCount | numFilter}}</span>人报名</view>
                  </view>
                </view>
                <view class="right-area">
                  <view class="tag before" v-show="statusFilter(item.startTime, item.endTime) == 'before'">即将开始</view>
                  <view class="tag during" v-show="statusFilter(item.startTime, item.endTime) == 'during'">进行中</view>
                  <view class="tag after" v-show="statusFilter(item.startTime, item.endTime) == 'after'">已结束</view>
                </view>
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
  filters: {
    // 数字过滤器
    numFilter (num) {
      if (num > 100000) {
        return '10万+'
      } else {
        return num
      }
    },
    // 日期过滤器
    dateFilter (date) {
      return date.split(' ')[0]
    },
  },
		async onShow() {

		},
		async onLoad() {
			this.getList()
		},

		methods: {
      // 状态过滤器
      statusFilter (startTime, endTime) {
        startTime = new Date(startTime.replace(/-/g, '/')).getTime()
        endTime = new Date(endTime.replace(/-/g, '/')).getTime()
        let crtTime = new Date().getTime()
        let status = ''
        if (crtTime < startTime) {
          status = 'before'
        } else if (crtTime > endTime) {
          status = 'after'
        } else {
          status = 'during'
        }
        return status
      },
      toActivityPage(item) {
		// #ifdef MP-WEIXIN
		 wx.aldstat.sendEvent('活动点击')
		// #endif
        console.log('item.redirectType',item)
        if(new Date().getTime() - new Date(item.endTime.replace(/-/g,'/')).getTime() >= 0) {
          uni.showToast({
            title: "活动结束啦",
            icon: "none"
          })
          return
        }
        //0:标准活动(不涉及外跳),1:H5外链,2:外部小程序
        switch(item.redirectType) {
          case 0: {
            if(item.duibaUrl && item.duibaUrl == 'changan://lbcjactivity'){
              let url = '/pages/lbActivity?id=' + item.id
              uni.navigateTo({
                url
              })
            }else{
              let url = '/pages/activity?id=' + item.id
              uni.navigateTo({
                url
              })
            }
            break;
          }
          case 1: {
			  api.fetchActivityVisit({
			  	'activityId': item.id
			  })
            if (item.duibaUrl && item.duibaUrl.substring(0, 4) == "http" ) {
              uni.navigateTo({
                url: `/pages/webview?webURL=${encodeURI(item.duibaUrl)}`,
              })
            }
            break;
          }
          case 2: {
			  api.fetchActivityVisit({
			  	'activityId': item.id
			  })
			  // #ifndef MP-WEIXIN
			  this.$toast('请在微信搜索本小程序参与')
			  // #endif
			  // #ifdef MP-WEIXIN
            uni.navigateToMiniProgram({
              appId: item.appId,
              path: item.miniUrl,
              success: res => {
                // 打开成功
                console.log("打开成功", res);
              },
              fail: err => {
                console.log("打开失败", err);
                uni.showToast({
                  title: "跳转小程序失败",
                  icon: "none"
                })
              },
              // envVersion: 'trial'
            });
            // #endif
			break;
          }
          default: {
            if(item.duibaUrl && item.duibaUrl == 'changan://lbcjactivity'){
              let url = '/pages/lbActivity?id=' + item.id
              uni.navigateTo({
                url
              })
            }else{
              let url = '/pages/activity?id=' + item.id
              uni.navigateTo({
                url
              })
            }
            break;
          }
        }
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
					} else if (type == 5) {
				       typeText = '抽奖活动'
					   typeClass = ''
			        }else {
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
		.label{
			font-size: 20rpx;
			    color: #fff;
		}
	}
	.logo {
		width: 29rpx;
		height: 30rpx;
	}
</style>
