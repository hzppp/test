<template>
  <view class="container">
    <pageTopCommon ref="pagetop" :background="'#fff'" :titleys="'#3C4650'" :btnys="'white'" :title.sync="title"></pageTopCommon>
    <view class="content">
      <view class="luckyWheel">
        <view class="lotteryList">
          <swiper style="width: 500rpx;height: 56rpx;" :disable-touch="true" :vertical="true" :circular="true" :duration="500" :interval="2000" :autoplay="true">
            <swiper-item v-for="(item,index) in lotteryActInfo.winnerRecords" :key="index"><view class="item">{{item}}</view></swiper-item>
          </swiper>
        </view>
        <view class="lotteryRecord" @tap="golotteryRecord"></view>
        <LuckyWheel
            ref="luckyWheel"
            width="520rpx"
            height="520rpx"
            :blocks="blocks"
            :prizes="prizes"
            :defaultStyle="defaultStyle"
            @start="startCallBack"
            @end="endCallBack"
            v-if="!showDialogL"
        />
        <view class="choiceTime">您还有<view class="times">{{lotteryActInfo.chanceCount || 0}}</view>次抽奖机会</view>
      </view>
      <view class="list">
        <button open-type="share" class="invite"></button>
        <view class="inviteRecord">
          <view class="title titleK">邀请记录</view>
          <block v-if="inviteRecordList&&inviteRecordList.length">
            <view class="item" v-for="(item,index) in inviteRecordList" :key="index">
              <view class="imgView"><image class="img" :src="item.wxHead"></image></view><view class="name">{{item.wxName}}</view><view class="time">{{item.joinTime}} 加入</view>
            </view>
          </block>
          <view class="nodata" v-else>
            您还没有邀请记录哦！快去邀请好友参与吧~
          </view>
          <view class="more" @tap="goInviteRecord" v-if="inviteRecordCount>3">
            查看更多 >
          </view>
        </view>
      </view>
      <view class="tips">
        <view class="contentBody">
          <view class="title titleK">活动规则</view>
          <view class="contentTips">
            <view class="mbt14">1.兑奖期限：2021年6月30日24时前，过期作废。</view>
            <view class="mbt14">2.本券仅用于活动期间购买长安汽车乘用车品牌经销商（不含新能源）线下使用，每辆车限使用1张代金券。</view>
            <view class="mbt14">3.请您在购车时出示本券，经服务中心销售人员验证后核销使用。</view>
            <view class="mbt14">4.购车客户电话号码和报名活动电话号码需保持一致，否则将导致奖券无法使用。</view>
            <view>*本次活动解释权归长安乘用车营销事业部所有</view>
          </view>
        </view>
      </view>
    </view>
    <view class="lotteryDialog" v-if="showDialogL" @touchmove.stop.prevent>
      <view class="dialogContainer">
        <block v-if="lotteryRes.id>1&&lotteryRes.price">
          <view class="tTitle titleQ">恭喜您获得</view>
          <view class="tBody gotPrize">
            <view class="amountBox"><view class="iconK">￥</view><view class="amount">{{ lotteryRes.price }}</view></view>
            <view class="time">有效期至：{{lotteryRes.endTime || '-'}}</view>
            <view class="lotteryType" v-if="lotteryRes.id !=2 ">
              <view>购车</view>
              <view>代金券</view>
            </view>
            <view class="lotteryType" v-else>
<!--            <view class="lotteryType long" v-else>-->
              <view>保养</view>
              <view>代金券</view>
            </view>
          </view>
          <view class="tFoot">
            <button class="left" @tap="goLotteryDeatail(lotteryRes.lotteryId)">查看详情</button>
            <button class="right" @tap="closeDialog">继续抽奖</button>
          </view>
        </block>
        <block v-else>
          <view class="tTitle titleQ">您与奖品檫肩而过</view>
          <view class="tBody">
            <view class="funnyIcon"></view>
            <view class="thxA">谢谢参与~</view>
          </view>
          <view class="tFoot">
            <button class="right btn1" @tap="closeDialog">继续抽奖</button>
          </view>
        </block>
        <button class="closeBtn" @tap="closeDialog"></button>
      </view>
    </view>
  </view>
</template>
<!--lottery_bg.png-->
<script>
import LuckyWheel from '@/components/uni-luck-draw/lucky-wheel'
import pageTopCommon from '@/components/pageTopCommon/pageTopCommon'
const app = getApp()
import api from '@/public/api/index'
import login from '@/units/login'
export default {
  name: "lotteryPage",
  components: {LuckyWheel,pageTopCommon},
  data() {
    return {
      inviteRecordList: [],
      inviteRecordCount: 0,
      lotteryActInfo: {},
      title: '转盘抽奖',
      blocks: [],
      showDialogL: false,
      prizes: [],
      defaultStyle: {
        fontColor: '#d64737',
        fontSize: '14px',
      },
      activityId: '',
      lotteryRes: {}
    }
  },
  async onLoad(options) {
    uni.showLoading({
      title: '正在加载...'
    })
    const {activityId=0} = options
    this.activityId = activityId

    await login.checkLogin(api)
    //邀请记录list
    this.inviteRecordList = await api.getInviteRecordList({pageNo:1,pageSize:3,activityId}).then(res => {
      this.inviteRecordCount = res.total || 0
      return res.code == 1 ? res.rows : []
    })
    this.lotteryActInfo =  await api.getLotteryActInfo({activityId}).then(res => {
      if(res.code == 1) {
        return res.data || {prizeList:[],winnerRecords:[]}
      }else {
        uni.showToast({
          title:res.msg,
          icon:"none"
        })
        // setTimeout(()=> {
        //   uni.reLaunch({
        //     url:"/pages/authorization"
        //   })
        // },1500)
      }
    })
    if(!this.lotteryActInfo.isApply) {
      //跳到留资页
    }
    this.lotteryActInfo.prizeList.length && this.lotteryActInfo.prizeList.forEach((item,index) => {
      this.prizes.push({ title: '', background: '#c3ecff', fonts: [{ text: '', top: '18%' }],
        imgs:[
          {
            src:`../../static/images/prize_${item.id}.png`,width:'100%',height: '100%',top:'1rpx'
          }
        ] })
      if(index == this.lotteryActInfo.prizeList.length-1) {
        uni.hideLoading()
      }
    })
  },
  async onShareAppMessage() {
    let {
      data = {}
    } = await api.getActivityContent(this.activityId)
    const wxUserInfo = uni.getStorageSync('wxUserInfo')
    const url = `pages/lbActivity?id=${this.activityId}&sourceUserId=${wxUserInfo.id}`
    console.log('ui',url)
    return {
      title: data.name,
      path: url, //抽奖页面?activityId=0&userId=0
      imageUrl: data.sharePic
    }
  },
  methods: {
    // 点击抽奖按钮触发回调
    async startCallBack () {
      if(!this.lotteryActInfo.chanceCount) {
        // chanceCount
        uni.showToast({
          title:'您的机会已经用完啦~',
          icon:"none"
        })
        app.globalData.isRotating = false;
        return
      }
      // 先开始旋转
      this.lotteryRes = await api.handleStartLottery({activityId:this.activityId}).then(res => {
        console.log('tttttt',res)
        if(res.code !=1 ) {
          uni.showToast({
            title:res.msg,
            icon:"none"
          })
        }else {
          this.$refs.luckyWheel.play()
          let index = this.matchIndex(res.data.id) //中奖索引
          console.log('中奖索引',index)
          // 缓慢停止游戏
          setTimeout(() => {
            // 缓慢停止游戏
            this.$refs.luckyWheel.stop(index)
          }, 3000)
          return res.data
        }
      })

    },
    matchIndex(id) {
      let res;
      this.lotteryActInfo.prizeList.some((item,index) => {
        if(item.id == id){
          res = index
          return true
        }
      })
      return res;
    },
    // 抽奖结束触发回调
    endCallBack (prize) {
      // 奖品详情
      app.globalData.isRotating = false;
      this.showDialogL = true;
      this.lotteryActInfo.chanceCount--;
      console.log(prize)
    },
    closeDialog() {
      this.showDialogL = false;
    },
    goLotteryDeatail(id) {
      let url = `/pages/lotteryDetail?id=${id}`;
      uni.navigateTo({
        url
      })
    },
    golotteryRecord() {
      let url = '/pages/lotteryRecord';
      uni.navigateTo({
        url
      })
    },
    goInviteRecord() {
      let url = `/pages/inviteRecord?activityId=${this.activityId}`;
      uni.navigateTo({
        url
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '@/static/less/public.less';
.titleQ {
  position: relative;
  &::before {
    content: '';
    border-top: 1rpx solid #fda2a2;
    width: 60rpx;
    position: absolute;
    left: -88rpx;
    top: 50%;
    transform: translateY(-50%);
  }
  &::after {
    content: '';
    border-top: 1rpx solid #fda2a2;
    width: 60rpx;
    position: absolute;
    right: -88rpx;
    top: 50%;
    transform: translateY(-50%);
  }
}
.container {
  padding-bottom: 40rpx;
  background: #000052;
  position: relative;
  .content {
    .luckyWheel {
      position: relative;
      .setbg(750rpx, 1130rpx, 'lottory_bg.png');
      .lotteryList {
        position: absolute;
        left: 16rpx;
        top: 16rpx;
        font-size: 24rpx;
        line-height: 56rpx;
        color: #fff;
        text-align: center;
        padding: 0 20rpx;
        max-width: 530rpx;
        .item {
          background: rgba(0,0,0,.3);
          border-radius: 28rpx;
        }
      }
      .lotteryRecord {
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
              border-radius: 50%;
            }
          }
          .name {
            font-size: 30rpx;
            width: 232rpx;
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
  .lotteryDialog {
    position: fixed;
    z-index: 9999;
    height: 100vh;
    width: 100%;
    background: rgba(0,0,0,.3);
    .dialogContainer {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      .setbg(560rpx,570rpx,'lottery_dialog_bg.png');
      .tTitle {
        position: absolute;
        top: 130rpx;
        left: 50%;
        transform: translateX(-50%);
        color: #fff;
        font-size: 32rpx;
      }
      .tBody {
        position: absolute;
        left: 40rpx;
        top: 216rpx;
        width: 480rpx;
        color: #fff;
        &.gotPrize {
          .setbg(480rpx,164rpx,'coupon_icon.png');
        }
        .funnyIcon {
          position: absolute;
          .setbg(112rpx,112rpx,'funny_icon.png');
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          width: 112rpx;
        }
        .thxA {
          position: absolute;
          top: 130rpx;
          left: 50%;
          transform: translateX(-50%);
        }
        .amountBox {
          font-size: 32rpx;
          line-height: 44rpx;
          color: #ed2c2c;
          font-weight: 700;
          height: 72rpx;

          position: absolute;
          top: 40rpx;
          left: 40rpx;
          .iconK {
            display: inline-block;
          }
          .amount {
            display: inline-block;
            font-size: 50rpx;
          }
        }
        .time {
          position: absolute;
          left: 40rpx;
          bottom: 40rpx;
          color: #AB6C2C;
          font-size: 20rpx;

        }
        .lotteryType {
          font-size: 28rpx;
          color: #AB6C2C;
          position: absolute;
          top: 50rpx;
          right: 30rpx;
          text-align: center;
          &.long {
            right: 12rpx;
          }
        }
      }
      .tFoot {
        button {
          position: absolute;
          bottom: 30rpx;
          border-radius: 40rpx;
          font-size: 32rpx;
          height: 80rpx;
          width: 238rpx;
          font-weight: 700;
          &.left {
            left: 30rpx;
            background: transparent;
            border: 1px solid #FFF4CC;
            box-sizing: border-box;
            color: #FFF4CC;
          }
          &.right {
            right: 30rpx;
            border: #FFF4CC 1px;
            background: linear-gradient(-90deg, #FFDF6C, #FFF4CC);
            color: #ED2C2C;
          }
          &.btn1 {
            width: 420rpx;
            height: 80rpx;
            left: 50%;
            transform: translateX(-50%);
          }
        }
      }
      .closeBtn {
        position: absolute;
        bottom: -80rpx;
        left: 50%;
        transform: translateX(-50%);
        .setbg(64rpx,64rpx,'lottory_close_btn.png');
      }
    }
  }
}
</style>
