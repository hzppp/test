<template>
  <view class="welfareActivity">
	<ask-online></ask-online>
    <viewTabBar :current="3"></viewTabBar>
    <button v-if="!haveUserInfoAuth" class="getUserInfo_name_info_mask_body" @tap="getWxUserInfoAuth"></button>
    <form-pop ref="formpop"></form-pop>
    <scroll-view class="scroll-view" @scrolltolower="scrollGetActivity" lower-threshold="200" scroll-y
                 scroll-with-animation>
      <view class="city">
        <picker @change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange" :value="selectIndex"
                mode="multiSelector" :range="[provinceList, cityList]" range-key="name" class="select-city">
          <view>{{selectCity || indexCity.name}}</view>
        </picker>
      </view>
      <view class="box">
        <view class="box-tit">
          长安福利
        </view>
        <view v-if="welfareList.length == 0" class="welfareActivity-none"></view>
        <coupon-list v-else ref="couponlist" :from="'welfareActivity'" @load-more-coupon="loadMoreCoupon" @formShow="formShow"></coupon-list>
      </view>

      <view class="box">
        <view class="box-tit">
          精选活动
        </view>
        <view class="activity-list" v-if="activityList.length > 0">
          <block v-for="(item,index) in activityList" :key="index">
            <view class="pic-text" @tap="toActivityPage(item.id)">
              <image mode="widthFix" :src="item.picUrl" lazy-load="true"></image>
              <view class="label">
                <view class="label-name">{{item.typeText}}</view>
              </view>
              <view class="text">{{item.name}}</view>
            </view>
          </block>
        </view>
        <view v-else class="activity-list-none"></view>
      </view>
	  <view class="zw"></view>
    </scroll-view>
  </view>
</template>

<script>
import coupon from '@/components/coupon/coupon'
import formpop from '@/components/formpop/formpop'
import login from '@/units/login'
import api from '@/public/api/index'
import shouquan from '@/units/shouquan'
import tabBar from '@/components/tabBar/tabBar'
import askOnline from '@/components/askOnline/askOnline'
import distance from '@/units/distance'
let app = getApp()
export default {
  components: {
    'coupon-list': coupon,
    'form-pop': formpop,
    viewTabBar:tabBar,
	askOnline
  },
  mixins: [shouquan],
  data() {
    return {
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
    }
  },
  computed: {
    selectCity () {
      let text = ''
      if (this.crtCityItem.id) {
        text = this.crtCityItem.name
      }
      return text
    },
    selectIndex () {
      let provinceIndex = this.provinceList.findIndex(item => item.id == this.crtProvinceItem.id)
      let cityIndex = this.cityList.findIndex(item => item.id == this.crtCityItem.id)
      provinceIndex = provinceIndex > -1 ? provinceIndex : 0
      cityIndex = cityIndex > -1 ? cityIndex : 0
      return [provinceIndex, cityIndex]
    }
  },
  async onShow() {
    this.resetjson()
    // api.getUser()
	await distance.getLocation()
    let currentLocation = app.globalData.currentLocation
    if (currentLocation) {
      await this.reqProvinceList()
      const crtLocationProvinceItem = this.provinceList.find(item => item.name.replace('省', '').replace('市', '') == currentLocation.cityData.pro.replace('省', '').replace('市', ''))
      if (crtLocationProvinceItem) {
        await this.reqCityListByProvinceId(crtLocationProvinceItem.id)
        const crtLocationCityItem = this.cityList.find(item => item.name.replace('市', '') == currentLocation.cityData.city.replace('市', ''))
        if (crtLocationCityItem) {
          this.crtProvinceItem = crtLocationProvinceItem
          this.crtCityItem = crtLocationCityItem
        }
      }
      // 精选活动
      this.getactivity()
      // 福利列表
      this.getWelfare()
    }
  },
  async onLoad() {

  },
  onShareAppMessage() {
    let title = '长安云车展：活动优惠都在这里！'
    let path = `pages/authorization?to=welfareActivity`
    if (app.globalData.salesId) {
      path += `?salesId=${app.globalData.salesId}`
    }
    let imageUrl = 'https://www1.pcauto.com.cn/zt/gz20210125/audi/xcx/img/xcxshare.png'
    return {
      title: title,
      path: path,
      imageUrl: imageUrl
    }
  },
  methods: {
    formShow(name, from = "", obj = {}, title = "完善资料") {
      this.$refs.formpop.formShow(name, from, obj, title)
    },
    loadMoreCoupon() {
      this.getWelfarePageNumber++
      this.getWelfare()
    },
    // 跳转商城页
    toMall(){
      uni.navigateTo({
        url:'/pages/mall/index'
      })
    },
    bindMultiPickerChange(e) {
      let {
        detail
      } = e
      this.crtProvinceItem = this.provinceList[detail.value[0]]
      this.crtCityItem = this.cityList[detail.value[1]]
	  app.globalData.currentLocation.selectedCityData = { // 设置当前选择的城市
	  	pro: this.crtProvinceItem.name,
	  	city: this.crtCityItem.name,
	  }
      this.resetjson()
      this.getWelfare()
      this.getactivity()

      // 改变默认定位省市
      let currentLocation = app.globalData.currentLocation
      currentLocation.cityData.cityId = this.crtCityItem.id
      currentLocation.cityData.name = this.crtCityItem.name
      currentLocation.cityData.proId = this.crtProvinceItem.id
      currentLocation.cityData.pro = this.crtProvinceItem.name
    },
    bindMultiPickerColumnChange(e) {
      let {
        detail
      } = e
      if (detail.column == 0) {
        this.reqCityListByProvinceId(this.provinceList[detail.value].id)
      }
    },
    scrollGetActivity() {
      this.getactivity()
    },
    toActivityPage(id) {
      let url = '/pages/activity?id=' + id
      uni.navigateTo({
        url
      })
    },
    resetjson() {
      this.getWelfarePageNumber = 1
      this.isLoadGetWelfare = true
      this.welfarePageNumber = 1
      this.isLoadGetActivity = true
      this.activityListPageNumber = 1
      this.activityList = []
      this.welfareList = []
    },
    // 获取精选活动
    async getactivity() {
      if (this.isLoadGetActivity) {
        this.isLoadGetActivity = false
        let currentLocation = app.globalData.currentLocation
        let cityId = this.crtCityItem.id || currentLocation.cityData.cityId
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
		  }
          obj.typeText = typeText
        }
        this.activityList = [...this.activityList, ...rows]

        console.log('activityList', this.activityList)
      }
    },
    // 获取福利列表
    async getWelfare() {
      let currentLocation = app.globalData.currentLocation
      let cityId = this.crtCityItem.id || currentLocation.cityData.cityId

      let data = await api.getWelfare(cityId, 2, this.welfarePageNumber)
      this.welfarePageNumber++
      let rows = data.rows ? data.rows : []
      let total = Math.ceil(data.total / 2)
      let a = [...this.welfareList, ...rows]
      this.welfareList = a
      console.log('welfareList', this.welfareList)
      if(this.welfareList.length == 0){return;}
      this.$nextTick(function(){
        if (this.welfarePageNumber > total || rows.length < 2) {
          // this.$invoke('coupon-list', 'morebtnHide')
          console.log('couponlist=================',this.$refs.couponlist)
          this.$refs.couponlist.morebtnHide()
        } else {
          // this.$invoke('coupon-list', 'morebtnShow')
          this.$refs.couponlist.morebtnShow()
        }

        // this.$invoke('coupon-list', 'setcouponList', this.welfareList)
        this.$refs.couponlist.setcouponList(this.welfareList)
      })


    },
    // 请求所有的省份
    async reqProvinceList () {
		this.provinceList = []
      try {
        const res = await api.fetchProvinceList()
        if (res.code == 1) {
          this.provinceList = res.data
        }
      } catch(err) {
        this.$toast('获取省份信息失败', 'none', 1500);
        console.error(err)
      }
    },
    // 根据省份id请求城市
    async reqCityListByProvinceId (provinceId) {
      this.cityList = []
      try {
        const res = await api.fetchCityListByProvinceId({provinceId})
        if (res.code == 1) {
          this.cityList = res.data
        }
      } catch (err) {
        this.$toast('获取城市信息失败', 'none', 1500);
        console.error(err)
      }
    },
  }
}
</script>

<style lang="less">
@import '@/static/less/welfareActivity.less';
</style>
