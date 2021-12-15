<template>
  <view>
	<userBand></userBand>
    <view class="container" v-if="dataList&&dataList.length">
      <view class="list">
        <view class="item" v-for="(item,index) in dataList" :key="index">
          <view class="code">中奖单号：{{ item.winningCode }}</view>
          <view class="title">{{ item.prizeName }}</view>
          <view class="time">使用截止时间：{{item.endDate | formatTimeMins}}</view>
          <view class="detail" @tap="goDetail(item.id)">查看详情 ></view>
        </view>
      </view>
      <view class="no-more" v-if="noMore">没有更多了</view>
    </view>
    <block v-else>
      <view style="height:145rpx;"></view>
      <view class="none-icon"></view>
      <view class="none-text">
        <view class="textK">你现在还没有中奖记录哦~</view>
        <view class="textK">快去参与抽奖吧~</view>
      </view>
<!--      <button class="golottery" @tap="golottery">去抽奖</button>-->
    </block>
  </view>
</template>

<script>
import api from '@/public/api/index'
import login from '@/units/login'
import userBand from '@/components/userBand/userBand'
export default {
name: "lotteryRecord",
 components:{userBand},
  data() {
    return {
      dataList: [],
      pageSize:20,
      pageNum:1,
      noMore:false
    }
  },
  filters: {
    formatTimeMins(time) {
      return time ? time.substr(0,time.length-3) : time;
    },
  },
  onReachBottom() {
    if(!this.noMore){
      this.getRecordList()
    }
			
	},
	onShow() {
		// #ifdef MP-WEIXIN
		gioGlobal.gdp('track', 'YCZ_myWinningRecordPageView')
		// #endif
	},
	
  methods:{
    goDetail(id) {
      //
      uni.navigateTo({
        url: `/pages/lotteryDetail?id=${id}`
      })
    },
    golottery() {
      uni.navigateBack()
    },
    async getRecordList(){
      let {pageNum,pageSize}=this
      let {data} = await api.getlotteryRecordList({pageNum,pageSize})
      if(data.code == 1){
        uni.hideLoading()
        if(data.hasNext){
          this.pageNum++
        }else{
          this.noMore=true;
        }
        this.dataList = [...this.dataList, ...data.rows]
      }
    }
  },
  async onLoad() {
    uni.showLoading({
      title: '正在加载...'
    })
    this.getRecordList()
  },
 
}
</script>

<style scoped lang="less">
@import '@/static/less/public.less';
.container {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 30rpx;
  background: #f6f7f8;
  .list{
    width: 686rpx;
    box-sizing: border-box;
    .item{
      background: url("token: 3ec22bf4-3f87-4c15-9333-c5a05ce4e234");
      .setbg(686rpx,214rpx,'lottery_record_icon.png');
      position: relative;
      width: 100%;
      height: 214rpx;
      margin-bottom: 24rpx;
      .code{
        position: absolute;
        left: 30rpx;
        top: 30rpx;
        color:#333;
        font-size: 24rpx;
      }
      .title{
        position: absolute;
        left: 30rpx;
        top: 110rpx;
        color: #fa8845;
        font-size: 32rpx;
		text-overflow: ellipsis;
	     white-space: nowrap;
		 overflow: hidden;
		 width: 500rpx;
		
      }
      .time{
        position: absolute;
        left: 30rpx;
        bottom: 30rpx;
        color: #999;
        font-size: 24rpx;
      }
      .detail{
        position: absolute;
        right: 30rpx;
        bottom: 60rpx;
        color: #999;
        font-size: 24rpx;
      }
    }
  }
}
.none-icon {
  .setbg(610rpx, 312rpx, 'articleList-none-data-icon2.png');
  margin: 40rpx auto 0;
}
.no-more{
  color:#666;
  padding:10rpx 0;
  text-align: center;
}
.none-text {
  .seth(126rpx, 28rpx, #999);
  .tc;
  .textK {
    height: 40rpx;
  }
}
.golottery {
  width: 460rpx;
  height: 88rpx;
  background: #FA8845;
  color: #fff;
  font-weight: 500;
  margin: 100rpx auto;
  border-radius: 44rpx;
}
</style>
