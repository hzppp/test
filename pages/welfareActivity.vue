<template>
  <view class="welfareActivity">
    <testDrive></testDrive>
    <viewTabBar :current="3"></viewTabBar>
    <pageTopCity ref="pagetop" :background="'#fff'" :titleys="'#000'" :btnys="'white'" :title.sync="title">
      <view class="city">
        <picker @change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange" :value="selectIndex"
                mode="multiSelector" :range="[provinceList, cityList]" range-key="name" class="select-city">
          <view>{{ selectCity || indexCity.name }}</view>
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
  async onShow() {
	try {
		uni.showLoading({
			title: '正在加载...'
		})
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
	} finally {
		uni.hideLoading()
	}
  },
  onHide() {
	this.resetjson()
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
  onReachBottom () {
	  this.getactivity()
  },
  methods: {
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
	  this.crtCityItem = this.cityList[detail.value[1]]
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
      if (item.duibaUrl) {
        uni.navigateTo({
          url: `/pages/webview?webURL=${encodeURI(item.duibaUrl)}`,
        })
      } else {
        let url = '/pages/activity?id=' + item.id
        uni.navigateTo({
          url
        })
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
  }
}
</script>

<style lang="less">
@import '@/static/less/welfareActivity.less';
</style>
