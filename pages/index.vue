<template>
  <view class="index">
    <viewTabBar :current="0"></viewTabBar>
    <testDrive></testDrive>
    <view class="content">
      <image v-if="pageData.bannerActivity&&pageData.bannerActivity.picUrl" class="banner" :src="pageData.bannerActivity.picUrl" @tap="goActDetail(pageData.bannerActivity.id)"></image>
      <view class="linkCont" v-if="false">
        <view class="linkContL">
          <view class="article linkItem" @tap="goArtList">
            <view class="title">发现</view>
            <view class="info">探索更多精彩</view>
            <image class="img" lazy-load src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/findArticle.png"></image>
          </view>
        </view>
        <view class="linkContR">
          <view class="testDrive linkItem rItem"  @tap="goTestDrive">
            <view class="title">预约试驾</view>
            <view class="info">试驾快人一步</view>
            <image class="img" lazy-load src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/testDriveIcon.png"></image>
          </view>
          <view class="calculation linkItem rItem" @tap="goCalc">
            <view class="title">购车计算</view>
            <view class="info">价格一目了然</view>
            <image class="img" lazy-load src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/cal.png"></image>
          </view>
        </view>
      </view>
      <view class="hotAct">
        <view class="hotTab">
          热车速递
        </view>
        <scroll-view scroll-x show-scrollbar class="hotCar">
          <view class="hotCarItem" v-for="(item,index) in sgList" :key="index">
            <image :src="item.pcSerialGroupPic" class="img"></image>
            <view class="title">{{item.name}}</view>
          </view>
        </scroll-view>
      </view>
      <view class="hotAct">
        <view class="hotTab">
          VR看车
        </view>
        <view class="actItem vrCar" @tap="goVr">
          <image src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/vrCar.jpg" class="img"></image>
        </view>
      </view>
      <view class="hotAct" v-if="pageData.list.length">
        <view class="hotTab">
          精选
        </view>
        <view v-for="(item,index) in pageData.list" :key="index" class="actItem" @tap="handleLinkHot(item.contentType,item.contentId,item.status,item.livestreamId)">
          <view>
            <!--contentType 1文章资讯，2活动，3直播-->
            <!--status 当为直播类型时 1直播中  2预告  3回放-->
<!--            <view class="icon1 status_3">YYYY-MM-DD HH-MM开播</view>-->
            <view :class="'icon1 '+ `status_${item.contentType}`" v-if="item.contentType !=3"></view>
            <view v-else>
              <view :class="'icon1 '+ `play_${item.status}`" v-if="item.status == 2 && item.startTime">{{item.startTime}}开播</view>
              <view :class="'icon1 '+ `play_${item.status}`" v-if="item.status !== 2"></view>
            </view>
<!--            <view class="icon1 status_1">{{item.contentType}}{{item.status}}</view>-->
            <image class="img banner" :src="item.picUrl" lazy-load></image>
            <view class="info shadow">
              <!--type 当为活动类型时,1购车福利,2车主福利,3线下活动 4试驾活动-->
<!--              <view class="icon2" v-if="item.type">{{item.type | actType}}</view>-->
              <view class="title ovh">{{item.title}}</view>
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
import testDrive from '@/components/testDrive/testDrive'

let app = getApp()
export default {
  components: {viewTabBar: tabBar, testDrive},
  mixins: [shouquan],
  data() {
    return {
      sgList: [],
      pageData:{bannerActivity:{},list:[]},
      testUrl:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F018c1c57c67c990000018c1b78ef9a.png&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1623756249&t=81ceea2ac01c237a71a3587b2482151a',
    }
  },
  filters: {
    actType(type) {
      switch (type) {
        case 1: {
          return '购车福利'
          break;
        }
        case 2: {
          return '车主福利'
          break;
        }
        case 3: {
          return '线下活动'
          break;
        }
        case 4: {
          return '试驾活动'
          break;
        }
      }
    },
  },
  async onShow(options) {
    console.log('index_app.globalData.currentLocation', app.globalData.currentLocation)
    const resData = (await this.getCityId()) || [1000000022,1000000022]
    const provinceId = resData[0]
    const cityId = resData[1]
    const cityCode = app.globalData.currentLocation ? app.globalData.currentLocation.cityData.cityCode : 500000
    this.pageData = await api.getHomepageData({
      cityId: cityId,
      cityCode: cityCode
    }).then(res => {
      return res.code == 1 ? res.data : {bannerActivity:{},list:[]}
    })
  },
  watch: {
    indexCity: function (newVal) {
      console.log('indexCity===========', newVal)
    }
  },
  async onLoad(options) {
    let sgList = await api.getSgList().then(res => {
      console.log('sssssssss',res)
      return res.code == 1 && res.data ? res.data : []
    })
    this.sgList = [...sgList]
  },
  onUnload() {
  },
  onShareAppMessage() {
    let title = '长安云车展'
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
    async getCityId() {
      let currentLocation = app.globalData.currentLocation
      if (currentLocation) {
        let pro = currentLocation.selectedCityData.pro || currentLocation.cityData.pro
        let city = currentLocation.selectedCityData.city || currentLocation.cityData.city

        const provinceList = await this.reqProvinceList()
        console.log('sdsdsd',provinceList)
        const crtLocationProvinceItem = provinceList.find(item => item.name.replace('省', '').replace('市', '') == pro.replace('省', '').replace('市', ''))
        if (crtLocationProvinceItem) {
          const cityList = await this.reqCityListByProvinceId(crtLocationProvinceItem.id)
          const crtLocationCityItem = cityList.find(item => item.name.replace('市', '') == city.replace('市', ''))
          if (crtLocationCityItem) {
            this.crtProvinceItem = crtLocationProvinceItem
            this.crtCityItem = crtLocationCityItem
            console.log('this.crtProvinceItem',this.crtProvinceItem,this.crtCityItem)
            return [crtLocationProvinceItem.id,crtLocationCityItem.id]
          }
        }
      }
    },
    // 请求所有的省份
    async reqProvinceList () {
      let res = [];
      try {
        res = await api.fetchProvinceList().then(res => {
          return res.code == 1?res.data : []
        })
        console.log('rrr',res)
        return res
      } catch(err) {
        this.showToast('获取省份信息失败')
        console.error(err)
        return res
      }
    },
    // 根据省份id请求城市
    async reqCityListByProvinceId (provinceId) {
      let res = []
      try {
        res = await api.fetchCityListByProvinceId({provinceId}).then(res => {
          return res.code == 1?res.data : []
        })
        console.log('ccc',res)
        return res
      } catch (err) {
        this.showToast('获取城市信息失败')
        console.error(err)
        return res
      }
    },
    goVr() {
      uni.navigateTo({
        url:'/pages/exhibition'
      })
    },
    handleLinkHot(type,id,status,sourceId) {
      // type = 3
      // id = 48965835
      // status = 'verticalLive'
      // status = 1
      //type:1资讯，2活动，3直播
      //status:1直播中，2预告，3回放
      console.log('type,id,status',type,id,status,typeof(type))
      switch (type) {
        case 1: {
          uni.navigateTo({
            url: `/pages/article?articleId=${id}`
          })
          break;
        }
        case 2: {
          uni.navigateTo({
            url: `/pages/activity?id=${id}`
          })
          break;
        }
        case 3: {
          switch (status) {
            case 0: {
              uni.navigateTo({
                url: `/pages/liveDetail?liveId=${id}`
              })
              break;
            }
            case 1: {
              this.goMP(id,'verticalLive',sourceId)
              break;
            }
            case 2: {
              uni.navigateTo({
                url: `/pages/liveDetail?liveId=${id}`
              })
              break;
            }
            case 3: {
              this.goMP(id,'verticalPlayback',sourceId)
              break;
            }
          }
          break;
        }
      }
    },
    goMP(id,type,sourceId) { //跳转pcauto+
      const oUrl = `/pages_live/changanVerticalLiveRoom/changanVerticalLiveRoom?id=${id}&type=${type}&sourceId=${sourceId}`
      console.log('oUrl',oUrl)
      uni.navigateToMiniProgram({
        appId: 'wxa860d5a996074dbb',
        path: oUrl,
        success: res => {
          // 打开成功
          console.log("打开成功", res);
        },
        fail: err => {
          console.log(err);
        },
        envVersion: 'trial'
      });
    },
    goArtList() {
      uni.navigateTo({
        url: `/pages/articleListPage`
      })
    },
    goCalc() {
      uni.navigateTo({
        url: `/pages/ChooseSerial?type=calc`
      })
    },
    goTestDrive() {
      uni.navigateTo({
        url: `/pages/ChooseSerial`
      })
    },
    goActDetail(id) {
      uni.navigateTo({
        url: `/pages/activity?id=${id}`
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
  padding-top: 16rpx;
  overflow-x: hidden;
}
.ovh {
  overflow: hidden; text-overflow:ellipsis; white-space: nowrap;max-width: 520rpx;
}
.shadow {
  box-shadow: 5px 5px 17px rgba(0, 0, 0, 0.3);
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
    border-radius: 20rpx;
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
    .hotCar {
      width: 700rpx;
      overflow: hidden;
      white-space:nowrap;
      .hotCarItem {
        display: inline-block;
        width: 210rpx;
        align-items: center;
        margin-right: 16rpx;
        .img {
          width: 210rpx;
          height: 140rpx;
          border-radius: 20rpx;
          margin: 30rpx 0 16rpx 0;
        }
        .title {
          font-size: 24rpx;
          font-weight: bold;
          text-align: center;
        }
      }
    }
    .vrCar {
      .img {
        display: inline-block;
        width: 686rpx;
        height: 360rpx;
        border-radius: 20rpx;
      }
    }
    .icon1 {
      position: absolute;
      width: 104rpx;
      height: 40rpx;
      left:-4rpx;
      top: -2rpx;

      &.status_1 {
        background: url("https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/art.png") no-repeat;
        background-size: contain;
      }
      &.status_2 {
        background: url("https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/act.png") no-repeat;
        background-size: contain;
      }
      &.play_1 {
        background: url("https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/playing.png") no-repeat;
        background-size: contain;
      }
      &.play_2 {
        width: 270rpx;
        font-size: 20rpx;
        color: #fff;
        width: auto;
        background: #55a4f1;
        padding-left: 48rpx;
        box-sizing: border-box;
        line-height: 36rpx;
        background: url("https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/willplay.png") no-repeat;
        background-size: contain;
      }
      &.play_3 {
        background: url("https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/replay.png") no-repeat;
        background-size: contain;
      }
    }
    .banner {
      border-radius: 20rpx 20rpx 0 0;
      margin-bottom: -8rpx;
    }
    .info {
      height: 92rpx;
      line-height: 92rpx;
      padding-left: 30rpx;
      border-radius: 0 0 20rpx 20rpx;
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
        top: -36rpx;
        border-radius: 8rpx;
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
