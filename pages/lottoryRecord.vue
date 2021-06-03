<template>
  <view>
    <view class="container" v-if="false">
      <view class="list">
        <view class="item">
          <view class="code">中奖单号：LB873586545</view>
          <view class="title">18888元购车代金券</view>
          <view class="time">使用截止时间：2021-05-31</view>
          <view class="detail">查看详情 ></view>
        </view>
        <view class="item">
          <view class="code">中奖单号：LB873586545</view>
          <view class="title">18888元购车代金券</view>
          <view class="time">使用截止时间：2021-05-31</view>
          <view class="detail">查看详情 ></view>
        </view>
        <view class="item">
          <view class="code">中奖单号：LB873586545</view>
          <view class="title">18888元购车代金券</view>
          <view class="time">使用截止时间：2021-05-31</view>
          <view class="detail">查看详情 ></view>
        </view>
        <view class="item">
          <view class="code">中奖单号：LB873586545</view>
          <view class="title">18888元购车代金券</view>
          <view class="time">使用截止时间：2021-05-31</view>
          <view class="detail">查看详情 ></view>
        </view>
        <view class="item">
          <view class="code">中奖单号：LB873586545</view>
          <view class="title">18888元购车代金券</view>
          <view class="time">使用截止时间：2021-05-31</view>
          <view class="detail">查看详情 ></view>
        </view>
      </view>
    </view>
    <block v-else>
      <view style="height:145rpx;"></view>
      <view class="none-icon"></view>
      <view class="none-text">
        <view class="textK">你现在还没有中奖记录哦~</view>
        <view class="textK">看去参与抽奖吧~</view>
      </view>
      <button class="goLottory" @tap="goLottory">去抽奖</button>
    </block>
  </view>
</template>

<script>
export default {
name: "lottoryRecord",
  methods:{
    goLottory() {
      uni.navigateBack()
    },
  }
}
</script>

<style scoped lang="less">
@import '@/static/less/public.less';
.container {
  height: 100vh;
  box-sizing: border-box;
  padding: 30rpx;
  background: #f6f7f8;
  .list{
    width: 686rpx;
    box-sizing: border-box;
    .item{
      background: #fff;
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

.none-text {
  .seth(126rpx, 28rpx, #999);
  .tc;
  .textK {
    height: 40rpx;
  }
}
.goLottory {
  width: 460rpx;
  height: 88rpx;
  background: #FA8845;
  color: #fff;
  font-weight: 500;
  margin: 100rpx auto;
  border-radius: 44rpx;
}
</style>
