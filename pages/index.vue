<template>
  <view class="index">
    <viewTabBar :current="0"></viewTabBar>
    <askOnline></askOnline>
    <view class="content">
      <image class="banner" :src="testUrl || pageData.bannerActivity.picUrl" @tap="goActDetail(pageData.bannerActivity.id)"></image>
      <view class="linkCont">
        <view class="linkContL">
          <view class="article linkItem" @tap="goArtList">
            <view class="title">发现</view>
            <view class="info">探索更多精彩</view>
            <image class="img" src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/findArticle.png"></image>
          </view>
        </view>
        <view class="linkContR">
          <view class="testDrive linkItem rItem">
            <view class="title">预约试驾</view>
            <view class="info">试驾快人一步</view>
            <image class="img" src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/testDrive.png"></image>
          </view>
          <view class="calculation linkItem rItem">
            <view class="title">购车计算</view>
            <view class="info">价格一目了然</view>
            <image class="img" src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/cal.png"></image>
          </view>
        </view>
      </view>
      <view class="hotAct" v-if="pageData.list.length">
        <view class="hotTab">
          热门
        </view>
        <view v-for="(item,index) in pageData.list" :key="index" class="actItem">
          <view>
            <!--contentType 1文章资讯，2活动，3直播-->
            <!--status 当为直播类型时 1未开始  2正在进行  3已结束-->
            <view class="icon1 status_4"></view>
<!--            <view class="icon1 status_1">{{item.contentType}}{{item.status}}</view>-->
            <image class="img banner" :src="testUrl || item.picUrl"  lazy-load="true"></image>
            <view class="info">
              <!--type 当为活动类型时,1购车福利,2车主福利,3线下活动 4试驾活动-->
              <view class="icon2">{{'车展福利'|| item.type}}</view>
              <view class="title">{{'全新CS15 线下体验活动' || item.title}}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import login from '@/units/login'
import api from '@/public/api/index'
import tabBar from '@/components/tabBar/tabBar'
import shouquan from '@/units/shouquan'
import askOnline from '@/components/askOnline/askOnline'

let app = getApp()
export default {
  components: {viewTabBar: tabBar, askOnline},
  mixins: [shouquan],
  data() {
    return {
      pageData:{bannerActivity:{},list:[]},
      testUrl:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F018c1c57c67c990000018c1b78ef9a.png&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1623756249&t=81ceea2ac01c237a71a3587b2482151a'
    }
  },
  onShow() {
    console.log('index_app.globalData.currentLocation', app.globalData.currentLocation)
  },
  watch: {
    indexCity: function (newVal) {
      console.log('indexCity===========', newVal)
    }
  },
  async onLoad(options) {
    this.pageData = await api.getHomepageData().then(res => {
      return res.code == 1 ? res.data : {bannerActivity:{},list:[]}
    })
  },
  onUnload() {
  },
  onShareAppMessage() {
    let title = '奥迪东海汇：轻松开启精彩车生活'
    let path = `pages/authorization?to=index`
    if (app.globalData.salesId) {
      path += `&salesId=${app.globalData.salesId}`
    }
    let imageUrl = 'https://www1.pcauto.com.cn/zt/gz20210125/audi/xcx/img/xcxshare.png'
    return {
      title: title,
      path: path,
      imageUrl: imageUrl
    }
  },
  methods: {
    goArtList() {
      uni.navigateTo({
        url: `/pages/articleListPage`
      })
    },
    goActDetail(id) {
      uni.navigateTo({
        url: `/pages/act?id=${id}`
      })
    },
    goArticlePage() {
      uni.navigateTo({
        url: `/pages/articleListPage`
      })
    },
    getUserInfo(e) {
      wx.getUserProfile({
        desc: '完善用户信息',
        success: (res) => {

        },
        complete: (res) => {

        }
      })
    }

  }
}
</script>

<style lang="less" scoped>
@import '@/static/less/index.less';
.index {
  background: #f9f9f9;
}
.content {
  padding: 0 32rpx 150rpx;
  .banner {
    width: 686rpx;
    height: 360rpx;
    border-radius: 20rpx;
  }
  .linkCont {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 40rpx;
    height: 260rpx;
    .linkItem {
      box-sizing: border-box;
      padding: 22rpx 0 0 26rpx;
      border-radius: 20rpx;
    }
    .title {
      font-size: 30rpx;
      font-weight: bold;
    }
    .info {
      font-size: 22rpx;
      color: #96a5b4;
    }
    .linkContL {
      position: relative;
      .article {
        width: 260rpx;
        height: 256rpx;
        background: #FFF5EC;
        .img {
          position: absolute;
          left: 13rpx;
          bottom: 0;
          width: 230rpx;
          height: 140rpx;
        }
      }
    }
    .linkContR {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      height: 260rpx;
      .rItem {
        width: 410rpx;
        height: 120rpx;
        position: relative;
        .img {
          width: 176rpx;
          height: 100rpx;
          position: absolute;
          right: 13rpx;
          bottom: 0;
        }
      }
      .testDrive {
        background: #FFF1F1;
      }
      .calculation {
        background: #E9F2FB;
      }
    }
  }
  .hotAct {
    margin-top: 30rpx;
    .hotTab {
      font-size: 40rpx;
      font-weight: bold;
      margin-bottom: 10rpx
    }
    .actItem {
      margin: 30rpx 0;
      background: #fff;
      position: relative;
    }
    .icon1 {
      position: absolute;
      width: 104rpx;
      height: 36rpx;
      left:-4rpx;
      top: -2rpx;
      &.status_1 {
        background: url("https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/playing.png") no-repeat;
        background-size: contain;
      }
      &.status_2 {
        background: url("https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/playing.png") no-repeat;
        background-size: contain;
      }
      &.status_3 {
        background: url("https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/playing.png") no-repeat;
        background-size: contain;
      }
      &.status_4 {
        background: url("https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/art.png") no-repeat;
        background-size: contain;
      }
      &.status_5 {
        background: url("https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/act.png") no-repeat;
        background-size: contain;
      }
    }
    .banner {
      border-radius: 20rpx 20rpx 0 0;
    }
    .info {
      height: 92rpx;
      line-height: 92rpx;
      padding-left: 30rpx;
      border-radius: 0 0 20rpx 20rpx;
      box-shadow: #f7f7f7 4rpx 4rpx 0;
      .icon2 {
        position: relative;
        display: inline-block;
        box-sizing: border-box;
        padding: 8rpx 12rpx;
        line-height: 20rpx;
        font-size: 20rpx;
        background: #FA8845;
        color: #fff;
        margin-right: 12rpx;
        top: -4rpx;
      }
      .title {
        display: inline-block;
        font-size: 32rpx;
        font-weight: bold;
        color: #000;
      }
    }
  }
}
</style>
