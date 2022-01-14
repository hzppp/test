<template>
  <view class="invitation-result">
    <userBand v-if="showLogin" @hadLogin="hadLogin" @loginSuccess="loginSuccess" :fromInvitation="true" :cancleShow="true"></userBand>
    <view class="content" v-if="isLoad">
      <view class="title"
        >尊敬的 <text class="name">{{ storeInvitation.customerName }}</text> {{ gender }}，您好！ 现诚挚邀请您试驾{{
          storeInvitation.intentSeries
        }}</view
      >
      <view class="des">
        <view class="time">预约试驾时间：{{ storeInvitation.visitDate }}</view>
        <view class="address">预约试驾地点：{{ currentDistance.show }}</view>
      </view>
      
      <view class="map" @click="goDealer">
        <map style="width: 100%; height: 402rpx" :id="marks.id" :latitude="storeInvitation.latY" :longitude="storeInvitation.lngX" :markers="marks">
        </map>
        <view class="map-des">
          <view class="left">
            <view class="dealer">{{ storeInvitation.dealerName }}</view>
            <view class="dealer-address">{{ storeInvitation.address }}</view>
          </view>
          <view class="right">
            <image src="https://www1.pcauto.com.cn/zt/gz20220104/changan/xcx/img/location_position.png" mode="aspectFit" />
          </view>
        </view>
      </view>
      <view class="phone"
        >如有疑问，请联系 <text class="blod">{{ storeInvitation.saleName }} &nbsp; {{ storeInvitation.salePhone }}</text></view
      >
      <view class="attention">试驾注意事项： </br>
			参与试驾人员请携带好本人身份证及驾驶证，切勿穿高跟 鞋参与试驾环节！
			</view>
    </view>
  </view>
</template>

<script>
import shouquan from "@/units/shouquan"
import distance from "@/units/distance"
import userBand from "@/components/userBand/userBand"
import api from "@/public/api/index"
let app = getApp()
export default {
  componets: {
    userBand: userBand,
  },
  mixins: [shouquan],
  data() {
    return {
      id: "", // 当前的邀请函id
      showLogin: false, // 是否需要登录
      isLoad: false, // 是否加载完成
      storeInvitation: {},
      title: "x",
      wxPosition: {},
      marks: [
        {
          id: 1,
          width: 20,
          height: 30,
          latitude: 0,
          longitude: 0,
          iconPath: "https://www1.pcauto.com.cn/zt/gz20220104/changan/xcx/img/location_icon.png",
        },
      ],
    }
  },
  async onLoad(option) {
    console.log("🚩Result @ ❨70❩🌸,%c this.wxPosition:", "color:#f6e7", this.wxPosition)
    this.showLogin = option.showLogin || false
    if (!option.showLogin) {
      // 不是分享的 不需要注册，同样要获取地址信息 分享先走useband内的是否登录
      this.getLocation()
    }
    if (!option.id) {
      uni.navigateTo({
        url: "/pages/invitationLetter/Search",
      })
    }
    this.id = option.id
    this.getInvitaionLetter(option.id)
  },
  onShareAppMessage() {
    let title = "诚邀您到店试驾"
    let path = "pages/invitationLetter/Result?id=" + this.id + "&showLogin=true"
    let imageUrl = "https://www1.pcauto.com.cn/zt/gz20220104/changan/xcx/img/changan_dcc_share.png"
    return { title, path, imageUrl }
  },
  computed: {
    currentDistance() {
      // 两点的距离
      let long = this.wxPosition.longitude
      let lat = this.wxPosition.latitude
      let m = distance.countLatLng(lat, long, this.marks[0].latitude, this.marks[0].longitude)
      let show = "" // 展示的距离
      if (typeof m !== "number") {
        show = ""
      } else if (m > 999) {
        show = "距您约" + parseFloat((m / 1000).toFixed(2)) + "km"
      } else {
        show = "距您约" + m + "米"
      }
      return { m, show }
    },
    gender() {
      // 性别
      let gender = ""
      switch (this.storeInvitation.gender) {
        case "10061001": {
          gender = "先生"
          break
        }
        case "10061002": {
          gender = "女士"
          break
        }
        default: {
          gender = ""
        }
      }
      return gender
    },
  },
  methods: {
    // 授权成功
    loginSuccess() {
      this.getLocation()
    },
    // 判断是否已经登录，登录了才弹出获取地址授权
    hadLogin() {
      this.getLocation()
    },
    // 地址授权
    async getLocation() {
      await distance.getLocation()
      this.wxPosition = app.globalData.currentLocation.wxPosition
    },
    // 获取邀请函信息
    async getInvitaionLetter(crmClueId) {
      try {
        let params = {
          crmClueId,
          isLogin: 0,
        }
        uni.showLoading({
          title: "正在加载...",
          mask: true,
        })
        const res = await api.getInvitaionLetter(params)
        if (res.code == 1) {
          this.storeInvitation = res.data
          let mark = [
            {
              id: new Date().getTime(),
              width: 20,
              height: 30,
              latitude: Number(res.data.latY),
              longitude: Number(res.data.lngX),
              iconPath: "https://www1.pcauto.com.cn/zt/gz20220104/changan/xcx/img/location_icon.png",
            },
          ]
          this.marks = mark
          setTimeout(()=>{
            let distance = this.currentDistance.m
            if (distance <= 100) {
              // 到店留资
              this.sendToStore(res.data)
            }
          },1000)
        }
      } catch (error) {
        console.error(error)
      } finally {
        uni.hideLoading()
        this.isLoad = true
      }
    },
    // 留资
    async sendToStore(data) {
      try {
        let { clueId: crmId, customerName, gender, intentModel, intentPackage, intentSeries } = data
        let params = {
          crmId,
          customerName,
          gender,
          intentLevel:"13101001",
          intentModel,
          intentPackage,
          intentSeries,
        }
        const res = await api.sendToStore(params)
      } catch (error) {
        console.error(error)
      } finally {
      }
    },
    goDealer() {
      uni.openLocation({
        latitude: Number(this.marks[0].latitude),
        longitude: Number(this.marks[0].longitude),
        name: this.storeInvitation.dealerName,
        scale: 18,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.invitation-result {
  position: relative;
  padding: 57rpx 0;
  width: 100%;
  min-height: 100vh;
  background-image: url(https://www1.pcauto.com.cn/zt/gz20220104/changan/xcx/img/changan_dcc_bg.jpg);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  box-sizing: border-box;
  .content {
    margin: 0 auto;
    padding: 46rpx 40rpx;
    width: 686rpx;
    min-height: 1092rpx;
    opacity: 0.9;
    background: #ffffff;
    border-radius: 20rpx;
    box-sizing: border-box;
    .title {
      margin-bottom: 46rpx;
      width: 431rpx;
      line-height: 56rpx;
      text-align: left;
      font-size: 36rpx;
      font-weight: 800;
      color: #333333;
      .name {
        color: #ff884f;
        padding: 0 10rpx;
      }
    }
    .des {
      margin-bottom: 50rpx;
      line-height: 52rpx;
      font-size: 28rpx;
      font-weight: 500;
      text-align: left;
      color: #333333;
    }
    .map {
      margin-bottom: 40rpx;
      .map-des {
        display: flex;
        padding: 28rpx 25rpx;
        box-sizing: border-box;
      }
      .left {
        flex: 1;
        .dealer {
          line-height: 52rpx;
          font-size: 34rpx;
          font-weight: 500;
          text-align: left;
          color: #333333;
        }
        .dealer-address {
          font-size: 24rpx;
          line-height: 52tpx;
          color: #9c9c9c;
        }
      }
      .right {
        margin-left: 20rpx;
        image {
          width: 80rpx;
          height: 80rpx;
        }
      }
    }
    .phone {
      margin-bottom: 35rpx;
      height: 28rpx;
      line-height: 44rpx;
      font-size: 28rpx;
      text-align: left;
      color: #333333;
      .blod {
        font-weight: bold;
      }
    }
    .attention {
      font-size: 24rpx;
      line-height: 44rpx;
      font-weight: 500;
      text-align: left;
      color: #999999;
    }
  }
}
</style>
