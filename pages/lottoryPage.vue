<template>
  <view>
    <view class="content">
      <view class="luckyWheel">
        <view class="lottoryList">
          <view class="item">1分钟前 用户XX抽中888元购车代金券</view>
        </view>
        <view class="lottoryRecord"></view>
        <LuckyWheel
            ref="luckyWheel"
            width="520rpx"
            height="520rpx"
            :blocks="blocks"
            :prizes="prizes"
            :defaultStyle="defaultStyle"
            @start="startCallBack"
            @end="endCallBack"
        />
        <view class="choiceTime">您还有<view class="times">1</view>次抽奖机会</view>
      </view>
      <view class="list">
        <view class="invite"></view>
        <view class="inviteRecord">
          <view class="title">邀请记录</view>
          <view class="item">
            <view class="imgView"><image class="img" src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/handleDraw.png"></image></view><view class="name">名称</view><view class="time">2021-05-20 12:35 加入</view>
          </view>
          <view class="item">
            <view class="imgView"><image class="img" src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/handleDraw.png"></image></view><view class="name">名称</view><view class="time">2021-05-20 12:35 加入</view>
          </view>
          <view class="item">
            <view class="imgView"><image class="img" src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/handleDraw.png"></image></view><view class="name">名称</view><view class="time">2021-05-20 12:35 加入</view>
          </view>
          <view class="item">
            <view class="imgView"><image class="img" src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/handleDraw.png"></image></view><view class="name">名称</view><view class="time">2021-05-20 12:35 加入</view>
          </view>
          <view class="item">
            <view class="imgView"><image class="img" src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/handleDraw.png"></image></view><view class="name">名称</view><view class="time">2021-05-20 12:35 加入</view>
          </view>
          <view class="item">
            <view class="imgView"><image class="img" src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/handleDraw.png"></image></view><view class="name">名称</view><view class="time">2021-05-20 12:35 加入</view>
          </view>
          <view class="item">
            <view class="imgView"><image class="img" src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/handleDraw.png"></image></view><view class="name">名称</view><view class="time">2021-05-20 12:35 加入</view>
          </view>
          <view class="item">
            <view class="imgView"><image class="img" src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/handleDraw.png"></image></view><view class="name">名称</view><view class="time">2021-05-20 12:35 加入</view>
          </view>
          <view class="item">
            <view class="imgView"><image class="img" src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/handleDraw.png"></image></view><view class="name">名称</view><view class="time">2021-05-20 12:35 加入</view>
          </view>
          <view class="item">
            <view class="imgView"><image class="img" src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/handleDraw.png"></image></view><view class="name">名称</view><view class="time">2021-05-20 12:35 加入</view>
          </view>
          <view class="item">
            <view class="imgView"><image class="img" src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/handleDraw.png"></image></view><view class="name">名称</view><view class="time">2021-05-20 12:35 加入</view>
          </view>
          <view class="item">
            <view class="imgView"><image class="img" src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/handleDraw.png"></image></view><view class="name">名称</view><view class="time">2021-05-20 12:35 加入</view>
          </view>
          <view class="nodata" v-if="false">
            您还没有邀请记录哦！快去邀请好友参与吧~
          </view>
          <view class="more">
            查看更多 >
          </view>
        </view>
      </view>
    </view>
    <pageTopCommon ref="pagetop" :background="'#fff'" :titleys="'#3C4650'" :btnys="'white'" :title.sync="title"></pageTopCommon>
  </view>
</template>
<!--lottory_bg.png-->
<script>
import LuckyWheel from '@/components/uni-luck-draw/lucky-wheel'
import pageTopCommon from '@/components/pageTopCommon/pageTopCommon'

export default {
  name: "lottoryPage",
  components: {LuckyWheel,pageTopCommon},
  data() {
    return {
      title: '转盘抽奖',
      blocks: [],
      prizes: [
        { title: '', background: '#c3ecff', fonts: [{ text: '', top: '18%' }],
          imgs:[
            {
              src:'../../static/images/prize_18888.png',width:'100%',height: '100%',top:'1rpx'
            }
          ] },
        { title: '', background: '#f4fcff', fonts: [{ text: '', top: '18%' }],
          imgs:[
            {
              src:'../../static/images/prize_0.png',width:'100%',height: '100%',top:'1rpx'
            }
          ] },
        { title: '', background: '#c3ecff', fonts: [{ text: '', top: '18%' }],
          imgs:[
            {
              src:'../../static/images/prize_18888.png',width:'100%',height: '100%',top:'1rpx'
            }
          ] },
        { title: '', background: '#f4fcff', fonts: [{ text: '', top: '18%' }],
          imgs:[
            {
              src:'../../static/images/prize_0.png',width:'100%',height: '100%',top:'1rpx'
            }
          ] },
        { title: '', background: '#c3ecff', fonts: [{ text: '', top: '18%' }],
          imgs:[
            {
              src:'../../static/images/prize_18888.png',width:'100%',height: '100%',top:'1rpx'
            }
          ] },
        { title: '', background: '#f4fcff', fonts: [{ text: '', top: '18%' }],
          imgs:[
            {
              src:'../../static/images/prize_0.png',width:'100%',height: '100%',top:'1rpx'
            }
          ] },
        { title: '', background: '#c3ecff', fonts: [{ text: '', top: '18%' }],
          imgs:[
            {
              src:'../../static/images/prize_18888.png',width:'100%',height: '100%',top:'1rpx'
            }
          ] },
        { title: '', background: '#f4fcff', fonts: [{ text: '', top: '18%' }],
          imgs:[
            {
              src:'../../static/images/prize_0.png',width:'100%',height: '100%',top:'1rpx'
            }
          ] },
      ],
      defaultStyle: {
        fontColor: '#d64737',
        fontSize: '14px',
      },
    }
  },
  methods: {
    // 点击抽奖按钮触发回调
    startCallBack () {
      // 先开始旋转
      this.$refs.luckyWheel.play()
      // 使用定时器来模拟请求接口
      setTimeout(() => {
        // 3s后得到中奖索引
        let index = Math.random() * 6 >> 0
        // 缓慢停止游戏
        this.$refs.luckyWheel.stop(index)
      }, 3000)
    },
    // 抽奖结束触发回调
    endCallBack (prize) {
      // 奖品详情
      console.log(prize)
    }
  }
}
</script>

<style scoped lang="less">
@import '@/static/less/public.less';
.content {
  .setbg(750rpx, 1130rpx, 'lottory_bg.png');
  .luckyWheel {
    position: relative;
    height: 100%;
    width: 100%;
    .lottoryList {
      position: absolute;
      left: 16rpx;
      top: 16rpx;
      font-size: 24rpx;
      line-height: 56rpx;
      background: rgba(0,0,0,.3);
      color: #fff;
      text-align: center;
      padding: 0 20rpx;
      border-radius: 28rpx;
      max-width: 530rpx;
    }
    .lottoryRecord {
      position: absolute;
      right: 0;
      top: 16rpx;
      .setbg(134rpx, 56rpx, 'recode_icon.png');
    }
    .choiceTime {
      position: absolute;
      bottom: 20rpx;
      width: 100%;
      text-align: center;
      font-size: 28rpx;
      color: #fff;
      .times {
        display: inline-block;
        color: #ffd75c;
        margin: 0 10rpx;
      }
    }
  }
  .list {
    padding: 0 32rpx 20rpx;
    background: #000052;
    .invite {
      margin: 0 auto;
      .setbg(686rpx, 102rpx, 'invite_btn.png');
      margin-bottom: 60rpx;
    }
    .inviteRecord {
      color: #fff;
      padding: 40rpx 20rpx 30rpx;
      background: #183aba;
      border-radius: 10rpx;
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
          width: 250rpx;
          overflow: hidden; text-overflow:ellipsis; white-space: nowrap;
        }
        .time {
          font-size: 24rpx;
        }
      }
      .nodata {
        background: #1806a3;
      }
      .more {
        color: #6b87cf;
        text-align: center;
        font-size: 24rpx;
      }
    }
  }
}
</style>
