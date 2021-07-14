<template>
  <view class="container">
	<userBand></userBand>
    <pageTopCommon ref="pagetop" :background="'#fff'" :titleys="'#3C4650'" :btnys="'white'" :title.sync="title" :homeBtn="true"></pageTopCommon>
    <view class="content">
      <view class="luckyWheel" :style="{backgroundImage: `url(${lotteryActInfo.activityPic})`}">
        <view class="lotteryList">
          <swiper style="width: 500rpx;height: 56rpx;" :disable-touch="true" :vertical="true" :circular="true" :duration="500" :interval="2000" :autoplay="true">
            <swiper-item @touchmove.stop v-for="(item,index) in lotteryActInfo.winnerRecords" :key="index"><view class="item">{{item}}</view></swiper-item>
          </swiper>
        </view>
        <view class="lotteryRecord" @tap="golotteryRecord">中奖纪录</view>
        <LuckyWheel
            ref="luckyWheel"
            width="520rpx"
            height="520rpx"
            :blocks="blocks"
            :prizes="prizes"
            :defaultStyle="defaultStyle"
            @start="startCallBack"
            @end="endCallBack"
            :showDialogL = "showDialogL"
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
          <view class="title titleK">抽奖说明</view>
          <scroll-view scroll-y="true" class="contentTips">
            <text>{{activityMemoArr}}</text>
          </scroll-view>
        </view>
      </view>
    </view>
    <view class="lotteryDialog" v-if="showDialogL" @touchmove.stop.prevent>
      <view class="dialogContainer">
        <block v-if="lotteryRes.id>1&&lotteryRes.price">
          <view class="tTitle titleQ">恭喜您获得</view>
          <view class="tBody">
            <view class="przie-name">{{lotteryRes.name}}</view>
          </view>
          <view class="tFoot">
            <button class="left" @tap="goLotteryDetail(lotteryRes.lotteryId)">查看详情</button>
            <button class="right" @tap="closeDialog">继续抽奖</button>
          </view>
        </block>
        <block v-else>
          <view class="tTitle titleQ">您与奖品檫肩而过</view>
          <view class="tBody tBody2">
            <view class="funnyIcon"></view>
            <view class="thxA">谢谢惠顾~</view>
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
import userBand from '@/components/userBand/userBand'
export default {
  name: "lotteryPage",
  components: {LuckyWheel,pageTopCommon,userBand},
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
      lotteryRes: {},
      activityMemoArr:[]
    }
  },
  onShow() {
    app.globalData.isRotating = false;
  },
  async onLoad(options) {
    this.showDialogL = false;
    this.prizes = []
    uni.showLoading({
      title: '正在加载...'
    })
    const {activityId=0} = options
    this.activityId = activityId
    // await login.checkLogin(api)
    //邀请记录list
    this.inviteRecordList = await api.getInviteRecordList({pageNo:1,pageSize:3,activityId}).then(res => {
      this.inviteRecordCount = res.total || 0
      return res.code == 1 ? res.rows : []
    })
    this.lotteryActInfo =  await api.getLotteryActInfo({activityId}).then(res => {
      if(res.code == 1) {
        return res.data || {prizeList:[],winnerRecords:[]}
      }else if(res.code ==10){
        uni.showToast({
          title:res.msg,
          icon:"none"
        })
        app.globalData.isRotating = false;
        return {};
        // setTimeout(()=> {
        //   uni.reLaunch({
        //     url:"/pages/authorization"
        //   })
        // },1500)
      }else if(res.code == 0){
        uni.showToast({
          title:'本次抽奖异常，已保留抽奖机会，请稍后再试',
          icon:"none"
        })
        app.globalData.isRotating = false;
        return {};
      }
    }).finally(res => {
      console.log('this.lotteryActInfo',this.lotteryActInfo)
    })
    if(this.lotteryActInfo && this.lotteryActInfo.activityMemo){
      // this.activityMemoArr =this.lotteryActInfo.activityMemo.split(/[\s\n]/)
      this.activityMemoArr =this.lotteryActInfo.activityMemo.replace('/n','/r/s')
    }
    this.lotteryActInfo.winnerRecords.reverse()
    if(!(this.lotteryActInfo.isApply)) {
      //跳到留资页
      console.log('this.lotteryActInfo.isApply',this.lotteryActInfo.isApply)
      const wxUserInfo = uni.getStorageSync('wxUserInfo')
      const url = `/pages/lbActivity?id=${this.activityId}`
      uni.showToast({
        title:'您暂未留资',
        icon:"none"
      })
      setTimeout(()=> {
        uni.reLaunch({
          url
        })
      },1000)
      return;
    }
    // `../../static/images/prize_${item.id}.png`
    this.lotteryActInfo.prizeList = this.lotteryActInfo.prizeList.sort((a,b) => a.prizeCode-b.prizeCode)
    // console.log("lotteryActInfo11111111111111111111111111111",this.lotteryActInfo);
    if(this.lotteryActInfo.prizeList.length){
      this.lotteryActInfo.prizeList.forEach((item, index) => {
        this.prizes.push({
          title: '', background: '#c3ecff', fonts: [{text: '', top: '18%'}],
          imgs: [
            {
              src: item.picUrl, width: '100%', height: '100%', top: '1rpx'
              // src: `../../static/images/prize_${item.prizeCode}.png`, width: '100%', height: '100%', top: '1rpx'
            }
          ]
        })
        if (index == this.lotteryActInfo.prizeList.length - 1) {
          uni.hideLoading()
        }
      })
      // console.log("this.prizes",this.prizes);
    }
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
        console.log('点击抽奖按钮触发')
        app.globalData.isRotating = false;
        return
      }
      // 先开始旋转
      this.lotteryRes = await api.handleStartLottery({activityId:this.activityId}).then(res => {
        console.log('tttttt',res)
        if(res.code ==10 ) {
          uni.showToast({
            title:res.msg,
            icon:"none"
          })
          app.globalData.isRotating = false;
          return
        }else if(res.code===1){
			// #ifdef MP-WEIXIN
			  this.$refs.luckyWheel.play()
			// #endif
			
			// #ifdef MP-TOUTIAO
			this.$children[2].play()
			// #endif
         
          let index = this.matchIndex(res.data.id) //中奖索引
          console.log('中奖索引',index)
          // 缓慢停止游戏
          setTimeout(() => {
            // 缓慢停止游戏
			// #ifdef MP-WEIXIN
			  this.$refs.luckyWheel.stop(index)
			// #endif
			
			// #ifdef MP-TOUTIAO
			this.$children[2].stop(index)
			// #endif
			
           
          }, 500)
          return res.data
        }else if(res.code == 0){
          uni.showToast({
            title:'本次抽奖异常，已保留抽奖机会，请稍后再试',
            icon:"none"
          })
          app.globalData.isRotating = false;
          return
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
      console.log('抽奖结束触发回调')
      app.globalData.isRotating = false;
      this.showDialogL = true;
      this.lotteryActInfo.chanceCount--;
      console.log(prize)
    },
    closeDialog() {
      this.showDialogL = false;
    },
    goLotteryDetail(id) {
      this.closeDialog()
      setTimeout(()=> {
        let url = `/pages/lotteryDetail?id=${id}`;
        uni.navigateTo({
          url
        })
      },100)
    },
    golotteryRecord() {
      this.closeDialog();
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
  background: #eef1f5;
  position: relative;
  .content {
    overflow-x: hidden;
    width: 100%;
    .luckyWheel {
      position: relative;
      .setbg(100%, 1130rpx, 'lottory_bg.png');
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
        width:134rpx;
        height: 56rpx;
        background: rgba(0,0,0,.6);
        border-top-left-radius: 28rpx;
        border-bottom-left-radius: 28rpx;
        font-size: 24rpx;
        text-align: center;
        line-height: 56rpx;
        color: #fff;
        // .setbg(134rpx, 56rpx, 'recode_icon.png');
      }
      .choiceTime {
        position: absolute;
        bottom: 20rpx;
        width: 100%;
        text-align: center;
        font-size: 28rpx;
        color: #333333;
        .times {
          display: inline-block;
          color: #ed2c2c;
          margin: 0 10rpx;
        }
      }
    }
    .titleK {
      position: relative;
      margin-bottom: 34rpx !important;
      color: #ed2c2c;
      font-size: 32rpx;
      &::before {
        position: absolute;
        left: 42rpx;
        top: 10rpx;
        width: 186rpx;
        height: 13rpx;
        content: '';
        .setbg(186rpx, 13rpx, 'recode_new_icon_l.png');
      }
      &::after {
        position: absolute;
        right: 42rpx;
        top: 10rpx;
        width: 186rpx;
        height: 13rpx;
        content: '';
        .setbg(186rpx, 13rpx, 'recode_new_icon_2.png');
      }
    }
    .list {
      padding: 0 32rpx 20rpx;
      background: #eef1f5;
      margin-bottom: 20rpx;
      .invite {
        margin: 0 auto;
        .setbg(686rpx, 102rpx, 'invite_btn_210712.png');
        margin-bottom: 60rpx;
      }
      .inviteRecord {
        color: #333333;
        padding: 40rpx 20rpx 30rpx;
        background: #ffffff;
        border-radius: 10rpx;
        .title {
          text-align: center;
          font-size: 32rpx;
          line-height: 32rpx;
          margin-bottom: 20rpx;
          color: #ed2c2c;
        }
        .item {
          height: 112rpx;
          line-height: 112rpx;
          background: #eef1f5;
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
            color:#999999;
            font-size: 24rpx;
          }
        }
        .nodata {
          border-radius: 10rpx;
          margin-bottom: 20rpx;
          background: #eef1f5;
          height: 212rpx;
          line-height: 212rpx;
          font-size: 28rpx;
          color: #999999;
          text-align: center;
        }
        .more {
          color: #999999;
          text-align: center;
          font-size: 24rpx;
        }
      }
    }
    .tips {
      padding: 0 32rpx 20rpx;
      background: #ffffff;
      .title {
        color: #ed2c2c;
        text-align: center;
        font-size: 32rpx;
        line-height: 32rpx;
        margin-bottom: 20rpx;
      }
      .contentBody {
        color: #333333;
        padding: 40rpx 20rpx 30rpx;
        background: #ffffff;
        border-radius: 10rpx;
        .contentTips {
          max-height: 170rpx;
          width: 646rpx;
          overflow: scroll;
          border-radius: 10rpx;
          background: #eef1f5;
          padding:30rpx 20rpx 30rpx 20rpx;
          font-size: 28rpx;
          line-height: 54rpx;
          /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
          ::-webkit-scrollbar
          {
           width: 16upx!important;
           height: 16upx!important;
           background-color: #eef1f5;
          }
          
          /*定义滚动条轨道 内阴影+圆角*/
          ::-webkit-scrollbar-track
          {
           // -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
          //  border-radius: 10px;
          //  background-color: #1806a3;
          }
          
          /*定义滑块 内阴影+圆角*/
          ::-webkit-scrollbar-thumb
          {
           border-radius: 10px;
          //  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
           background-color: #dee0e2;
          }
        }
      }
    }
    .mbt14 {
      // margin-bottom: 14rpx;
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
        top: 190rpx;
        width: 480rpx;
        color: #fff;
        &.tBody2{
          top:210rpx;
        }
        .przie-name{
          width: 100%;
          height: 215rpx;
          font-size: 44rpx;
          text-align: center;
          line-height: 215rpx;
          font-weight: bold;
        }
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
