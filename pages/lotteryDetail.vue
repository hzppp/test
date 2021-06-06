<template>
  <view class="bg">
    <view class="container" v-if="detailInfo.winningCode">
      <view class="headerT">
        <view class="lId">中奖单号：{[detailInfo.winningCode]}</view>
        <view class="headerInfo">
          <view class="lDetail">
            <view class="prizeName">{{detailInfo.prizeName}}</view>
            <view class="prizeCode"><view>核销码：</view> <view class="code">{{ detailInfo.verificationCode }}</view></view>
          </view>
        </view>
      </view>
      <view class="bodyT">
        <view class="info">
          <view class="item"><view class="babelT">使用手机号：</view>
            {{ detailInfo.mobile }}</view>
          <view class="item"><view class="babelT">中奖时间：</view>{{detailInfo.createTime}}</view>
          <view class="item"><view class="babelT">兑奖期限：</view>{{detailInfo.endDate}}</view>
        </view>
        <view class="tips">
          <view class="title">
            使用须知：
          </view>
          <view class="infoItem">1.兑奖期限：2021年6月30日24时前，过期作废。</view>
          <view class="infoItem">2.本券仅用于活动期间购买长安汽车旗下乘用车品牌经销商（不含新能源）线下使用，每辆车限使用1张代金券。</view>
          <view class="infoItem">3.购车客户电话号码和报名电话号码需保持一致，否则将导致将无法使用。</view>
          <view class="infoItem">4.购车出示本券，经服务中心销售人员验证有效后使用。</view>
          <view class="infoItem">*本次活动解释权归长安汽车乘用车所有</view>
        </view>
      </view>
    </view>
    <view v-else>暂无数据</view>
  </view>
</template>

<script>
import api from '@/public/api/index'
import login from '@/units/login'
export default {
  name: "lotteryDetail",
  data() {
    return {
      detailInfo: {}
    }
  },
  async onLoad(options) {
    const {id=0} = options
    console.log('id',id)
    if(id) {
      this.detailInfo = await api.getLotteryDetail({id}).then(res => {
        console.log('rrrres',res)
        if(res.code == 1) {
          return res.data || {}
        }else {
          uni.showToast({
            title: res.msg,
            icon:"none"
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/static/less/public.less';
.bg {
  width: 100%;
  height: 100vh;
  background: #f6f7f8;
}
.container {
  display: inline-block;
  background: '';
  .headerT {
    position: relative;
    height: 427rpx;
    width: 100%;
    .setbg(750rpx,223rpx,'lottery_detail_bg.png');
    .lId {
      position: absolute;
      top: 32rpx;
      left: 36rpx;
      color: #fff;
      font-size: 28rpx;
    }
    .headerInfo {
      position: absolute;
      top: 98rpx;
      left: 32rpx;
      background: #fff;
      border-radius: 20rpx;
      width: 686rpx;
      height: 186rpx;
      .lDetail {
        position: relative;
        height: 100%;
        .prizeName {
          position: absolute;
          top: 48rpx;
          left: 42rpx;
          color: #000;
          font-weight: 600;
          font-size: 36rpx;
        }
        .prizeCode {
          position: absolute;
          bottom: 42rpx;
          left: 42rpx;
          display: flex;
          font-size: 28rpx;
          color: #999;
          .code {
            color:#FA8845;
          }
        }
      }
    }
  }
  .bodyT {
    position: absolute;
    top: 314rpx;
    left: 32rpx;
    width: 686rpx;
    background: #fff;
    border-radius: 20rpx;
    box-sizing: border-box;
    padding: 42rpx;
    .info {
      font-size: 26rpx;
      color: #000;
      line-height: 50rpx;
      .item {
        display: flex;
        .babelT {
          color: #999;
        }
      }
    }
    .tips {
      font-size: 28rpx;
      color: #000;
      margin-top: 16rpx;
      .title {
        font-size: 36rpx;
        color: #000;
        font-weight: 600rpx;
      }
      .infoItem {
        line-height: 46rpx;
      }
    }
  }
}
</style>
