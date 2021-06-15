<template>
  <view class="welfareActivity">
    <testDrive :aldEventName="'活动列表预约试驾'"></testDrive>
    <viewTabBar :current="3"></viewTabBar>
    <pageTopCity ref="pagetop" :background="'#fff'" :titleys="'#000'" :btnys="'white'" :title.sync="title">
      <view class="city">
        <picker @change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange" :value="selectIndex"
                mode="multiSelector" :range="[provinceList, cityList]" range-key="name" class="select-city">
          <view class="select-city-inner">
            <view>{{ selectCity || indexCity.name }}</view>
            <image class="icon" src="../static/images/arrowBottom.png" mode="aspectFit"></image>
          </view>
        </picker>
      </view>
    </pageTopCity>

    <form-pop ref="formpop"></form-pop>
    <!-- <view class="box">
      <view class="box-tit">
        长安福利
      </view>
      <view v-if="isWelfareInit && welfareList.length == 0" class="welfareActivity-none">
        <text class="tips">敬请期待</text>
      </view>
      <coupon-list v-else-if="welfareList.length > 0" ref="couponlist" :from="'welfareActivity'" @load-more-coupon="loadMoreCoupon"
                   @formShow="formShow"></coupon-list>
    </view> -->

    <view class="box">
      <!-- <view class="box-tit">
        精选活动
      </view> -->
      <view class="activity-list" v-if="activityList.length > 0">
        <block v-for="(item,index) in activityList" :key="index">
          <view class="pic-text" @tap="toActivityPage(item)">
            <image mode="aspectFill" :src="item.picUrl" lazy-load="true"></image>
            <view class="label">
              <image class="logo" src="../static/images/gift-logo.png" mode="aspectFit"></image>
              <view class="label-name">{{ item.typeText }}</view>
            </view>
            <view class="text">{{ item.name }}</view>
            <view class="desc">
             <view class="left-area">
               <view><view class="locationCot" v-if="item.type==3"><view class="cityName">{{ selectCity || indexCity.name }}</view><view class="line"></view></view><view class="date">{{item.startTime | dateFilter}} - {{item.endTime | dateFilter}}</view></view>
               <view class="info">
               <view v-show="item.visitCount"><span class="num">{{item.visitCount | numFilter}}</span>人感兴趣</view>
               <view v-show="item.visitCount && item.clueCount && item.redirectType==0" class="line"></view>
               <view v-show="item.clueCount && item.redirectType==0"><span class="num">{{item.clueCount | numFilter}}</span>人报名</view>
               </view>
             </view>
             <view class="right-area">
               <view class="tag before" v-show="statusFilter(item.startTime, item.endTime) == 'before'">即将开始</view>
               <view class="tag during" v-show="statusFilter(item.startTime, item.endTime) == 'during'">进行中</view>
               <view class="tag after" v-show="statusFilter(item.startTime, item.endTime) == 'after'">已结束</view>
             </view>
           </view>
          </view>
        </block>
      </view>
      <view v-else-if="isActivityInit && activityList.length == 0" class="activity-list-none">
        <text class="tips">敬请期待</text>
      </view>
    </view>
    <view class="zw"></view>
  </view>
</template>

<script>
import coupon from '@/components/coupon/coupon'
import formpop from '@/components/formpop/formpop'
import login from '@/units/login'
import api from '@/public/api/index'
import shouquan from '@/units/shouquan'
import tabBar from '@/components/tabBar/tabBar'
import testDrive from '@/components/testDrive/testDrive'
import distance from '@/units/distance'
import pageTopCity from '@/components/pageTopCity/pageTopCity'
import toast from '@/units/showToast'

let app = getApp()
export default {
  components: {
    'coupon-list': coupon,
    'form-pop': formpop,
    viewTabBar: tabBar,
    testDrive,
    pageTopCity
  },
  mixins: [shouquan],
  data() {
    return {
      title: '活动',
      indexCity: {},
      getWelfarePageNumber: 1,
      provinceList: [],
      cityList: [],
      crtProvinceItem: {}, // 当前选择的省份
      crtCityItem: {}, // 当前选择的城市
      isLoadGetWelfare: true,
      welfarePageNumber: 1,
      isLoadGetActivity: true,
      activityListPageNumber: 1,
      activityList: [],
      welfareList: [],
      isActivityInit: false, // 活动是否已初始化
      isWelfareInit: false, // 优惠券是否已初始化
    }
  },
  computed: {
    selectCity() {
      let text = ''
      if (this.crtCityItem.id) {
        text = this.crtCityItem.name
      }
      return text
    },
    selectIndex () {
      let provinceIndex = this.provinceList.findIndex(item => item.id == this.crtProvinceItem.id)
      let cityIndex = -1
      if (this.crtProvinceItem.cities) {
        cityIndex = this.crtProvinceItem.cities.findIndex(item => item.id == this.crtCityItem.id)
      }
      provinceIndex = provinceIndex > -1 ? provinceIndex : 0
      cityIndex = cityIndex > -1 ? cityIndex : 0
      return [provinceIndex, cityIndex]
    }
  },
  async onLoad() {
    uni.showLoading({
      title: '正在加载...'
    })
    await this.init()
    uni.hideLoading()
  },
  async onPullDownRefresh () {
    uni.showLoading({
      title: '正在加载...'
    })
    await this.init()
    setTimeout(() => {
      uni.hideLoading()
      uni.stopPullDownRefresh()
    }, 300)
  },
  onShareAppMessage() {
    let title = '长安云车展：活动优惠都在这里！'
    let path = `pages/authorization?to=welfareActivity`
    if (app.globalData.salesId) {
      path += `?salesId=${app.globalData.salesId}`
    }
    let imageUrl = 'https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/share.jpeg'
    return {
      title: title,
      path: path,
      imageUrl: imageUrl
    }
  },
  onReachBottom () {
    this.getactivity()
  },
  methods: {
    // 初始化
    async init () {
      try {
        this.resetjson()
        // api.getUser()
        await distance.getLocation()
        let currentLocation = app.globalData.currentLocation
        if (currentLocation) {
          await this.reqProvinceCityList()
          const crtLocationProvinceItem = this.provinceList.find(item => item.name.replace('省', '').replace('市', '') == currentLocation.selectedCityData.pro.replace('省', '').replace('市', ''))
          if (crtLocationProvinceItem) {
            const crtLocationCityItem = crtLocationProvinceItem.cities.find(item => item.name.replace('市', '') == currentLocation.selectedCityData.city.replace('市', ''))
            this.crtProvinceItem = crtLocationProvinceItem
            this.cityList = this.crtProvinceItem.cities
            this.crtCityItem = crtLocationCityItem
          }
          // 精选活动
          await this.getactivity()
          // 福利列表
          // this.getWelfare()
        }
      } catch (err) {
        console.error(err)
      }
    },
    // 状态过滤器
    statusFilter (startTime, endTime) {
      startTime = new Date(startTime.replace(/-/g, '/')).getTime()
      endTime = new Date(endTime.replace(/-/g, '/')).getTime()
      let crtTime = new Date().getTime()
      let status = ''
      if (crtTime < startTime) {
        status = 'before'
      } else if (crtTime > endTime) {
        status = 'after'
      } else {
        status = 'during'
      }
      return status
    },
    formShow(name, from = "", obj = {}, title = "报名活动") {
      this.$refs.formpop.formShow(name, from, obj, title)
    },
    loadMoreCoupon() {
      this.getWelfarePageNumber++
      this.getWelfare()
    },
    // 跳转商城页
    toMall() {
      uni.navigateTo({
        url: '/pages/mall/index'
      })
    },
    bindMultiPickerChange(e) {
      let {
        detail
      } = e
      this.crtProvinceItem = this.provinceList[detail.value[0]]
      this.cityList = this.crtProvinceItem.cities
      this.crtCityItem = this.cityList[detail.value[1]] ? this.cityList[detail.value[1]] : this.cityList[0]
      this.resetjson()
      // this.getWelfare()
      this.getactivity()

      // 改变默认定位省市
      let currentLocation = app.globalData.currentLocation
      currentLocation.selectedCityData.isChange = true
      currentLocation.selectedCityData.proId = this.crtProvinceItem.id
      currentLocation.selectedCityData.pro = this.crtProvinceItem.name
      currentLocation.selectedCityData.cityId = this.crtCityItem.id
      currentLocation.selectedCityData.city = this.crtCityItem.name
    },
    bindMultiPickerColumnChange(e) {
      let {
        detail
      } = e
      if (detail.column == 0) {
        this.cityList = this.provinceList[detail.value].cities
      }
    },
    toActivityPage(item) {
      wx.aldstat.sendEvent('活动点击')
      console.log('item.redirectType',item)
	  // web 小程序  
	  if((item.redirectType == 1 ||item.redirectType == 2) &&  !(item.duibaUrl && item.duibaUrl == 'changan://lbcjactivity')){
		  api.fetchActivityVisit({
		  	'activityId': item.id
		  })
		 if(new Date().getTime() - new Date(item.endTime.replace(/-/g,'/')).getTime() >= 0) {
		   uni.showToast({
		     title: "活动结束啦",
		     icon: "none"
		   })
		   return
		 } 
	  }
      //0:标准活动(不涉及外跳),1:H5外链,2:外部小程序
      switch(item.redirectType) {
        case 0: {
          if(item.duibaUrl && item.duibaUrl == 'changan://lbcjactivity'){
            let url = '/pages/lbActivity?id=' + item.id
            uni.navigateTo({
              url
            })
          }else{
            let url = '/pages/activity?id=' + item.id
            uni.navigateTo({
              url
            })
          }
          break;
        }
        case 1: {
          if (item.duibaUrl && item.duibaUrl.substring(0, 4) == "http" ) {
            uni.navigateTo({
              url: `/pages/webview?webURL=${encodeURI(item.duibaUrl)}`,
            })
          }
          break;
        }
        case 2: {
            uni.navigateToMiniProgram({
              appId: item.appId,
              path: item.miniUrl,
              success: res => {
                // 打开成功
                console.log("打开成功", res);
              },
              fail: err => {
                console.log("打开失败", err);
                uni.showToast({
                  title: "跳转小程序失败",
                  icon: "none"
                })
              },
              envVersion: 'trial'
            });
          break;
        }
        default: {
          if(item.duibaUrl && item.duibaUrl == 'changan://lbcjactivity'){
            let url = '/pages/lbActivity?id=' + item.id
            uni.navigateTo({
              url
            })
          }else{
            let url = '/pages/activity?id=' + item.id
            uni.navigateTo({
              url
            })
          }
          break;
        }
      }
    },
    resetjson() {
      this.getWelfarePageNumber = 1
      this.isLoadGetWelfare = true
      this.welfarePageNumber = 1
      this.isLoadGetActivity = true
      this.activityListPageNumber = 1
      this.activityList = []
      this.welfareList = []
      this.isActivityInit = false
      this.isWelfareInit = false
    },
    // 获取精选活动
    async getactivity() {
      if (this.isLoadGetActivity) {
        this.isLoadGetActivity = false
        let currentLocation = app.globalData.currentLocation
        let cityId = this.crtCityItem.id || currentLocation.cityData.cityId
        try {
          let {
            rows
          } = await api.getactivity(cityId, 5, this.activityListPageNumber)
          this.activityListPageNumber++
          if (rows.length > 0) {
            this.isLoadGetActivity = true
          }
          for (let i in rows) {
            let obj = rows[i]
            let type = obj.type
            let typeText
            if (type == 1) {
              typeText = '购车福利'
            } else if (type == 2) {
              typeText = '车主福利'
            } else if (type == 3) {
              typeText = '线下活动'
            } else if (type == 4) {
              typeText = '试驾活动'
            } else if (type == 5) {
              typeText = '抽奖活动'
            }
            obj.typeText = typeText
          }
          this.activityList = [...this.activityList, ...rows]

          console.log('activityList', this.activityList)
        } catch (err) {
          console.error(err)
        } finally {
          this.isActivityInit = true
        }
      }
    },
    // 获取福利列表
    async getWelfare() {
      let currentLocation = app.globalData.currentLocation
      let cityId = this.crtCityItem.id || currentLocation.cityData.cityId
      try {
        let data = await api.getWelfare(cityId, 2, this.welfarePageNumber)
        this.welfarePageNumber++
        let rows = data.rows ? data.rows : []
        let total = Math.ceil(data.total / 2)
        let a = [...this.welfareList, ...rows]
        this.welfareList = a
        console.log('welfareList', this.welfareList)
        if (this.welfareList.length == 0) {
          return;
        }
        this.$nextTick(function () {
          if (this.welfarePageNumber > total || rows.length < 2) {
            console.log('couponlist=================', this.$refs.couponlist)
            this.$refs.couponlist.morebtnHide()
          } else {
            this.$refs.couponlist.morebtnShow()
          }

          this.$refs.couponlist.setcouponList(this.welfareList)
        })
      } catch (err) {
        console.error(err)
      } finally {
        this.isWelfareInit = true
      }


    },
    // 请求省份和城市的级联列表
    async reqProvinceCityList () {
      try {
        const res = await api.fetchProvinceCityList()
        if (res.code == 1) {
          this.provinceList = res.data
          if (this.provinceList && this.provinceList.length) {
            this.cityList = this.provinceList[0].cities
          }
        }
      } catch(err) {
        this.$toast('获取省份和城市信息失败', 'none', 1500);
        console.error(err)
      }
    },
  },
  filters: {
    // 数字过滤器
    numFilter (num) {
      if (num > 100000) {
        return '10万+'
      } else {
        return num
      }
    },
    // 日期过滤器
    dateFilter (date) {
      if(!date) {
        return date
      }
      return date.split(' ')[0].replace(/-/g,'.')
    },
  }
}
</script>

<style lang="less">
@import '@/static/less/welfareActivity.less';
</style>
