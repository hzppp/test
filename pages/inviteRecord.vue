<template>
  <view class="inviteRecord">
    <block>
      <view class="item">
        <view class="imgView"><image class="img" src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/handleDraw.png"></image></view><view class="name">名称</view><view class="time">2021-05-20 12:35 加入</view>
      </view>
      <view class="item">
        <view class="imgView"><image class="img" src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/handleDraw.png"></image></view><view class="name">名称</view><view class="time">2021-05-20 12:35 加入</view>
      </view>
      <view class="item">
        <view class="imgView"><image class="img" src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/handleDraw.png"></image></view><view class="name">名称</view><view class="time">2021-05-20 12:35 加入</view>
      </view>
    </block>
    <view class="nomore">没有更多了~</view>
  </view>
</template>

<script>
export default {
name: "inviteRecord"
}
</script>

<style scoped lang="less">
.inviteRecord {
  color: #fff;
  padding: 40rpx 20rpx 30rpx;
  background: #183aba;
  height: 100vh;
  .title {
    text-align: center;
    font-size: 32rpx;
    line-height: 32rpx;
    margin-bottom: 20rpx;
  }
  .item {
    height: 112rpx;
    line-height: 112rpx;
    background: #1806a3;
    margin-bottom: 20rpx;
    box-sizing: border-box;
    padding: 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 10rpx;
    &>view {
      display: inline-block;
    }
    .imgView {
      width: 72rpx;
      height: 72rpx;
      .img {
        width: 100%;
        height: 100%;
      }
    }
    .name {
      font-size: 30rpx;
      width: 270rpx;
      overflow: hidden; text-overflow:ellipsis; white-space: nowrap;
    }
    .time {
      font-size: 24rpx;
    }
  }
  .nodata {

  }
  .nomore {
    font-size: 24rpx;
    color: #6b87cf;
    margin-top: 20rpx;
    text-align: center;
  }
}
</style>
