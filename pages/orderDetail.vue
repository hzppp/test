<template>
  <view class="bg">
    <view class="container" v-if="detailInfo.winningCode">
      <view class="headerT">
        <view class="lId">中奖单号：{{detailInfo.winningCode}}</view>
        <view class="headerInfo">
          <view class="lDetail">
            <view class="prizeName">{{detailInfo.prizeName}}</view>
            <!--  #ifdef MP-WEIXIN  -->
            <view class="services-btn" @tap="toServices(detailInfo.csUrl)" v-if="detailInfo.csUrl">点击添加客服</view>
            <!-- #endif -->
			<view class="services-btn" @tap="toCollectInfor(detailInfo.csUrl)" v-if="detailInfo.yucenUrl">登记信息</view>
            <view class="prizeCode" v-if="detailInfo.source !=3"><view>核销码：</view> <view class="code">{{ detailInfo.verificationCode }}</view></view>
            <!-- 积分商品 -->
            <view class="prizeScore" v-else>
              <view>
                <view class="code"><text>{{detailInfo.price}}</text> 积分</view>
                <view class="description">需自行去长安商城兑换商品，兑换记录在商城查看</view>
              </view>
              <view class="externalLink" @tap="toExternalPage(detailInfo.externalLink)">去兑换</view>
            </view>
          </view>
          <view class="bodyT">
            <view class="info">
              <view class="item"><view class="babelT">报名电话：</view>
                {{ detailInfo.mobile }}</view>
              <view class="item"><view class="babelT">中奖时间：</view>{{detailInfo.createTime | formatTimeMins}}</view>
              <view class="item"><view class="babelT">兑奖期限：</view>{{detailInfo.endDate | formatTimeMins}}</view>
            </view>
            <view class="tips">
              <view class="title">
                使用须知：
              </view>
              <view class="infoItem"><text>{{detailInfo.memo}}</text></view>

            </view>
          </view>
        </view>
      </view>
     
    </view>
  </view>
</template>

<script>
import api from '@/public/api/index'
import login from '@/units/login'
import domain from '@/configs/interface';
export default {
  name: "lotteryDetail",
  data() {
    return {
      detailInfo: {}
    }
  },
  filters: {
    formatTimeMins(time) {
      return time ? time.substr(0,time.length-3) : time;
    },
  },
  async onLoad(options) {
    const {id=0} = options
    console.log('id',id)
    if(id) {
      uni.showLoading({
        title: '正在加载...'
      })
      this.detailInfo = await api.getLotteryDetail({id}).then(res => {
        console.log('rrrres',res)
        setTimeout(() => {
          uni.hideLoading()
        },300)
        if(res.code == 1) {	
          return res.data || {}
        }else {
          uni.showToast({
            title: res.msg,
            icon:"none"
          })
        }
      })
	  
	  // yuchenceshi
	 this.detailInfo.yucenUrl = 'http://dev.pcauto.com.cn:8080/#/collectInfor?id=11&order=22'
	  
    }
  },
  methods: {
      toExternalPage(url){
        if (url && url.substring(0, 4) == "http") {
          uni.navigateTo({
              url: `/pages/webview?webURL=${encodeURIComponent(url)}`,
          })
        }
      },
	  toCollectInfor(url){
		 uni.navigateTo({
		     url: `/pages/webview?webURL=${encodeURIComponent(url)}`,
		 })
	  },
      toServices(csUrl){
        let baseUrl = domain.getAPI('serversCode')
        let url=`${baseUrl}?csUrl=${csUrl}`
        uni.navigateTo({
            url: `/pages/webview?webURL=${encodeURIComponent(url)}`,
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
    padding-top: 98rpx;
    box-sizing: border-box;
    .lId {
      position: absolute;
      top: 32rpx;
      left: 36rpx;
      color: #fff;
      font-size: 28rpx;
    }
    .headerInfo {
      position: relative;
      background: #fff;
      border-radius: 20rpx;
      padding:42rpx;
      width: 686rpx;
      // height: 186rpx;
      margin:0 auto;
      box-sizing: border-box;
      .lDetail {
        position: relative;
        height: 100%;
        padding-bottom: 42rpx;
        border-bottom: 1px dashed #ebebeb;
        .prizeName {
          position: relative;
          color: #000;
          font-weight: 600;
          font-size: 36rpx;
          margin-bottom: 20rpx;
        }
        .prizeCode {
          position: relative;
          display: flex;
          font-size: 28rpx;
          color: #999;
          .code {
            color:#FA8845;
          }
        }
        .services-btn{
          width: 216rpx;
          height: 58rpx;
          line-height: 58rpx;
          font-size: 24rpx;
          text-align: center;
          border-radius: 29rpx;
          background: #fa8845;
          color: #ffffff;
          float: right;
          transform: translateY(-50%)
        }
        .prizeScore{
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          font-size: 32rpx;
          color: #fa8845;
          .code{
            text{
              margin-right:15rpx;
            }
          }
          .description{
            font-size: 20rpx;
            color: #999999;
            margin-top: 10rpx;
          }
          .externalLink{
            width: 140rpx;
            height: 56rpx;
            font-size: 24rpx;
            color: #ffffff;
            text-align: center;
            line-height: 56rpx;
            border-radius: 56rpx;
            background: #fa8845;
          }
        }
      }
    }
  }
  .bodyT {
    padding-top: 42rpx;
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
      color: #000;
      margin-top: 16rpx;
      .title {
        font-size: 28rpx;
        color: #000;
        font-weight: 600rpx;
        line-height: 50rpx;
      }
      .infoItem {
        line-height: 46rpx;
        font-size: 26rpx;
        color: #333333;
        line-height: 48rpx;
      }
    }
  }
}
</style>
