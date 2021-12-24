<template>
  <view>
	<userBand></userBand> 
    <view class="container" v-if="dataList&&dataList.length">
      <view class="list">
        <view class="item" v-for="(item,index) in dataList" :key="index" @tap='goDetail(item.id)'> 
          <view class="order-status">
            <view class="code">订单ID：{{ item.outTradeNo }}</view>
            <view class="playState state7" v-if="item.activityType==1 && item.status==1 && item.groupDetail.groupStatus==2">核销码\n生成中</view>
            <view v-else :class="['playState' ,item.activityType && item.status ==1 ? 'groupState1' : 'state' +  item.status]">{{item.status | formatState(item.activityType)}}</view>
          </view>
          <view class="order-info">
            <view class="title">{{ item.productName }}</view>
            <view class="time">购买时间：{{item.createTime | formatTimeMins}}</view>
            <view class="time1">使用期限：{{item.endTime | formatTimeMins}}</view>
            <view class="detail">{{"¥" +  item.totalFee  }}</view>
          </view>
        </view>
      </view>
      <view class="no-more" v-if="noMore">没有更多了</view>
    </view>
    <block v-else>
      <view style="height:145rpx;"></view>
      <view class="none-icon"></view>
      <view class="none-text">
        <view class="textK">你现在还没有订单哈~</view>
        <!-- <view class="textK">快去参与抽奖吧~</view> -->
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
  formatState(state,activityType) {
  	// console.log('parseInt(state)', parseInt(state))
    switch (parseInt(state)) {
      case 6: {
        return '已失效'
        break;
      }
      case 0: {
        return '待支付'
        break;
      }
      case 1: {
        return activityType ? '拼团中' : '已支付'
        break;
      }
  
      case 2: {
        return '待使用'
        break;
      }
  
      case 3: {
        return '退款中'
        break;
      }
  
      case 4: {
        return '已核销'
        break;
      }
  
      case 5: {
        return '已退款'
        break;
      }

      case 7: {
        return '核销码\n生成失败'
        break;
      }

      default: {
        return '已失效'
        break;
      }
  
    }
   },
  },
  onReachBottom() {
    if(!this.noMore){
      this.getRecordList()
    }
			
	},
	onShow(){
		
		this.$gdp('YCZ_myOrderPageView')
		
	},
  methods:{
    goDetail(id) {
      //
      uni.navigateTo({
        url: `/pages/orderDetail?id=${id}`
      })
    },
    golottery() {
      uni.navigateBack()
    },
    async getRecordList(){
      let {pageNum,pageSize}=this
      let data = await api.orders({pageNum,pageSize})
      if(data.code == 1){
        uni.hideLoading()
        data.rows = data.rows.filter(item=>(item.activityType == 1 && item.status !=6) || item.activityType != 1)
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
  async onShow() {
    this.getRecordList()
  }
 
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
      width:686rpx;
      // .setbg(686rpx,214rpx,'lottery_record_icon1.png');
      position: relative;
      width: 100%;
      margin-bottom: 24rpx;
      .order-status,.order-info{
        background: #ffffff;
        border-radius: 20px;
      }
      .order-status{
        padding:22rpx 30rpx 18rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .order-info{
        position: relative;
        padding:30rpx;
        &:after{
          content: "";
          position: absolute;
          top:0;
          width:626rpx;
          left:50%;
          margin-left: -313rpx;
          border-top:1rpx dashed #ebebeb;
        }
      }
      .code{
        color:#333;
        font-size: 24rpx;
      }
      .title{
        color: #333333;
        font-weight: 800;
        font-size: 32rpx;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        width: 500rpx;
        line-height: 1;
        margin-bottom: 19rpx;
      }
      .time,.time1{
        color: #999;
        font-size: 24rpx;
        line-height: 38rpx;
      }
      .detail{
        position: absolute;
        right:30rpx;
        top: 30rpx;
        color: #FA8845;
        font-size: 32rpx;
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
.playState{
	font-size: 24rpx;
	font-weight: 500;
	text-align: center;
	color: #FA8845;
	padding: 0 18rpx;
	border: 1px solid #FA8845;
	border-radius: 20rpx;
  height: 40rpx;
  line-height: 40rpx;
}


.state0{
	color: #F04242;
	border: 1px solid #F04242;
}
.state2{
	color: #FA8845;
	border: 1px solid #FA8845;
}
.state4{
	color: #FFD4B1;
	border: 1px solid #FFD4B1;
}
.state1{
	color: #333333;
	border: 1px solid #333333;
}
.state3{
	color: #999999;
	border: 1px solid #999999;
}
.state5,.state7{
	color: #CCCCCC;
	border: 1px solid #CCCCCC;
}
.state7{
  white-space: pre-line; 
  display: flex;
  align-items: center;
  justify-content: center;
  height: 66rpx;
  line-height: 1.15;
}
.groupState1{
  color: #ffffff;
  background: #e64848;
 
}
</style>
