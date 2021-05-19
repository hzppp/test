<template>
  <view>
    <!--    <button v-if="!haveUserInfoAuth" class="getUserInfo_name_info_mask_body" @tap="getWxUserInfoAuth"></button>-->
    <scroll-view scroll-y lower-threshold="200" @scrolltolower="getList" class="live-list">
      <view class="live-item" v-for="(item,index) in liveList" :key="item.id" @tap="toLiveDet(item)">
        <view class="top">
          <image class="avator" :src="item.headPic"></image>
          <view class="name">
            {{ item.nickName }}
          </view>
        </view>
        <view class="banner">
          <image class="bg" :src="item.cover"></image>
          <view class="play"></view>
          <view class="status blue" v-if="item.status==0 || item.status==2">
            <view class="icon"></view>
            {{ item.startTime }}开始播放
          </view>
          <view class="status yellow" v-if="item.status==1">

          </view>
          <view class="status green" v-if="item.status==3">

          </view>
        </view>
        <view class="title">
          {{ item.title }}
        </view>
      </view>
    </scroll-view>
    <viewTabBar :current="1"></viewTabBar>
  </view>
</template>

<script>
import tabBar from '@/components/tabBar/tabBar'
// import shouquan from '@/units/shouquan'
import api from '@/public/api/index'

let app = getApp()
export default {
  components: {
    viewTabBar: tabBar
  },
  data() {
    return {
      title: "直播",
      liveList: [],
      hasNext: true,
      pageNum: 1,
      pageSize: 10,
      dealerGroupId: '',
    }
  },
  // mixins: [],
  onLoad() {
    this.getList()
  },
  onShow() {
    // console.log('app.globalData.wxUserInfo  show:', app.globalData.wxUserInfo)
  },
  methods: {
    /* 获取列表 */
    async getList() {
      if (!this.hasNext) {
        return false;
      }
      let {data} = await api.getLiveList({
        pageNum: this.pageNum,
        pageSize: this.pageSize
      })
      if (data.hasNext) {
        this.pageNum++
      } else {
        this.hasNext = false
      }
      data.rows.forEach((item, index) => {
        item.startTime = item.startTime.substring(0, 13)
      })
      this.liveList = [...this.liveList, ...data.rows]
    },
    toLiveDet(item) {
      if (item.status == 2 || item.status == 0) { /* 直播预告 */
        uni.navigateTo({
          url: '/pages/liveDetail?liveId=' + item.id
        })
      } else if (item.status == 1) { /* 直播中 */
        uni.navigateToMiniProgram({
          appId: 'wxa860d5a996074dbb',
          path: `/pages_live/changanVerticalLiveRoom/changanVerticalLiveRoom?type=verticalLive&id=${item.roomId}&souceId=${item.id}`,
          extraData: {},
          success(res) {
            // 打开成功
          },
          envVersion: 'trial'
        })
      } else if (item.status == 3) {
        //回放
        uni.navigateToMiniProgram({
          appId: 'wxa860d5a996074dbb',
          path: `/pages_live/changanVerticalLiveRoom/changanVerticalLiveRoom?type=verticalPlayback&id=${item.playId}&souceId=${item.id}`,
          extraData: {},
          success(res) {
            // 打开成功
          },
          envVersion: 'trial'
        })
      }
    }
  }
}
</script>

<style lang="less">
@import '@/static/less/public.less';

.live-list {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  padding: 0 0 100 rpx;
  box-sizing: border-box;
}

.live-item {
  margin: 0 32 rpx;
  border-bottom: 1px solid #ebebeb;

  &:last-child {
    border-bottom: none;
  }

  .top {
    padding: 40 rpx 0 24 rpx;
    .dflex(center, flex-start);

    .avator {
      width: 64 rpx;
      height: 64 rpx;
      border-radius: 50%;
    }

    .name {
      color: #666666;
      font-size: 28 rpx;
      margin-left: 20 rpx;
    }
  }

  .banner {
    // width: 100%;
    position: relative;
    width: 686 rpx;

    .bg {
      width: 686 rpx;
      height: 388 rpx;
      border-radius: 20 rpx;
    }

    .status {
      padding: 8 rpx 13 rpx;
      border-radius: 4 rpx;
      padding-left: 35 rpx;
      font-size: 24 rpx;
      color: #ffffff;
      .pa(-5 rpx, -2 rpx);
      z-index: 3;
      // .icon {
      // 	width: 24rpx;
      // 	height:24rpx;
      // 	.pa(10rpx,14rpx);
      // }
      &.yellow {
        // background-color: #fa843f;
        .setbg(122 rpx, 36 rpx, 'live_tag1.png')
        // .icon {
        // 	.setbg(24rpx, 24rpx, 'livetimes.png')
        // }
      }

      &.green {
        // background-color: #33CE99;
        .setbg(104 rpx, 36 rpx, 'live_tag2.png')
      }

      &.blue {
        background-color: #56a3f1;
        border-top-left-radius: 20 rpx;
        border-top-right-radius: 8 rpx;
        border-bottom-right-radius: 8 rpx;
        // .setbg(152rpx,  36rpx, 'live_tag3.png')
        // .dflex(center,center);
        &::after {
          content: "";
          position: absolute;
          left: 0;
          top: 100%;
          border-width: 0 4 rpx 4 rpx;
          border-style: solid;
          border-color: transparent transparent #444444;
          transform: rotate(45deg);
          z-index: -1;
        }

        .icon {
          display: inline-block;
          margin-right: 10 rpx;
          .setbg(24 rpx, 24 rpx, 'livetimes.png');
          position: relative;
          top: 2 rpx;
        }
      }

      // &.red {
      // 	background-color: #fd5248;

      // 	.icon {
      // 		.setbg(24rpx, 24rpx, 'livetimes.png')
      // 	}
      // }
    }

    .play {
      .pa(50%, 50%);
      transform: translate(-50%, -50%);
      width: 100 rpx;
      height: 100 rpx;
      .setbg(100 rpx, 100 rpx, 'livePlay.png')
    }

  }

  .title {
    font-weight: 800;
    text-align: left;
    color: #333333;
    padding: 18 rpx 0 35 rpx;
  }
}
</style>
