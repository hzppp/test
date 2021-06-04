<template>
  <view class="container">
    <pageTopCommon ref="pagetop" :background="'#fff'" :titleys="'#3C4650'" :btnys="'white'" :title.sync="title"></pageTopCommon>
    <view class="content">
      <view class="luckyWheel">
        <view class="lottoryList">
          <view class="item">1分钟前 用户XX抽中888元购车代金券</view>
        </view>
        <view class="lottoryRecord" @tap="goLottoryRecord"></view>
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
        <button open-type="share" class="invite"></button>
        <view class="inviteRecord">
          <view class="title titleK">邀请记录</view>
          <block v-if="inviteRecordList&&inviteRecordList.length">
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
          <view class="nodata" v-else>
            您还没有邀请记录哦！快去邀请好友参与吧~
          </view>
          <view class="more" @tap="goInviteRecord" v-if="inviteRecordList&&inviteRecordList.length>3">
            查看更多 >
          </view>
        </view>
      </view>
      <view class="tips">
        <view class="contentBody">
          <view class="title titleK">活动规则</view>
          <view class="contentTips">
            <view class="mbt14">活动时间：即日起至2021年6月23日24时为止</view>
            <view class="mbt14">1.报名成功后即可获得1次抽奖机会，每邀请1名好友助力成功，可增加1次抽奖机会。</view>
            <view class="mbt14">2.每人每天最多可抽奖10次，奖品数量有限，先到先得。</view>
            <view class="mbt14">3.购车、售后代金券仅用于活动期间购买长安汽车旗下乘用车品牌经销商（不含新能源）线下使用，每辆车限使用1张代金券。</view>
            <view class="mbt14">4.购车客户电话号码和报名电话号码需保持一致，否则将导致将无法使用。</view>
            <view>*本次活动解释权归长安汽车乘用车所有</view>
          </view>
        </view>
      </view>
    </view>
    <view v-if="false">
      <view>恭喜你获得</view>
    </view>
  </view>
</template>
<!--lottory_bg.png-->
<script>
import LuckyWheel from '@/components/uni-luck-draw/lucky-wheel'
import pageTopCommon from '@/components/pageTopCommon/pageTopCommon'
const app = getApp()
import api from '@/public/api/index'
import login from '@/units/login'
export default {
  name: "lottoryPage",
  components: {LuckyWheel,pageTopCommon},
  data() {
    return {
      inviteRecordList: [],
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
  async onLoad() {
    const {activityId=1} = options
    await login.checkLogin(api)
    //邀请记录list
    this.inviteRecordList = await api.getInviteRecordList({pageNo:1,pageSize:3,activityId}).then(res => {
      console.log('rrrrr123',res)
      return res.code == 1 ? res.rows : []
    })
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
      app.globalData.isRotating = false;
      console.log(prize)
    },
    goLottoryRecord() {
      let url = '/pages/lottoryRecord';
      uni.navigateTo({
        url
      })
    },
    goInviteRecord() {
      let url = '/pages/inviteRecord';
      uni.navigateTo({
        url
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '@/static/less/public.less';
.container {
  padding-bottom: 40rpx;
  background: #000052;
  .content {
    .luckyWheel {
      position: relative;
      .setbg(750rpx, 1130rpx, 'lottory_bg.png');
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
    .titleK {
      position: relative;
      margin-bottom: 34rpx !important;
      &::before {
        position: absolute;
        left: 42rpx;
        top: 10rpx;
        width: 186rpx;
        height: 13rpx;
        content: '';
        .setbg(186rpx, 13rpx, 'recode_icon_l.png');
      }
      &::after {
        position: absolute;
        right: 42rpx;
        top: 10rpx;
        width: 186rpx;
        height: 13rpx;
        content: '';
        .setbg(186rpx, 13rpx, 'recode_icon_r.png');
      }
    }
    .list {
      padding: 0 32rpx 20rpx;
      background: #000052;
      margin-bottom: 20rpx;
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
            width: 258rpx;
            overflow: hidden; text-overflow:ellipsis; white-space: nowrap;
          }
          .time {
            font-size: 24rpx;
          }
        }
        .nodata {
          border-radius: 10rpx;
          margin-bottom: 20rpx;
          background: #1806a3;
          height: 212rpx;
          line-height: 212rpx;
          font-size: 14px;
          color: #6b87cf;
          text-align: center;
        }
        .more {
          color: #6b87cf;
          text-align: center;
          font-size: 24rpx;
        }
      }
    }
    .tips {
      padding: 0 32rpx 20rpx;
      background: #000052;
      .title {
        color: #fff;
        text-align: center;
        font-size: 32rpx;
        line-height: 32rpx;
        margin-bottom: 20rpx;
      }
      .contentBody {
        color: #fff;
        padding: 40rpx 20rpx 30rpx;
        background: #183aba;
        border-radius: 10rpx;
        .contentTips {
          border-radius: 10rpx;
          background: #1806a3;
          padding:30rpx 20rpx;
          font-size: 28rpx;
        }
      }
      margin-bottom: 20rpx;
    }
    .mbt14 {
      margin-bottom: 14rpx;
    }
  }
}
</style>
