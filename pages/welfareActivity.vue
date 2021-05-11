<template>
	<view class="welfareActivity">
		<button v-if="isUserInfoPage" class="getUserInfo_name_info_mask_body" lang="zh_CN" @getuserinfo="getWxUserInfoButton"
		 open-type="getUserInfo"></button>
		<form-pop ref="formpop"></form-pop>
		<scroll-view class="scroll-view" @scrolltolower="scrollGetActivity" lower-threshold="200" scroll-y
		 scroll-with-animation>
			<view class="welfareActivity-top-banner" @tap="toMall"></view>
			
			<view class="box">
				<view class="box-tit">
					奥迪福利
					<picker @change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange" :value="currentSelectIndex"
					 mode="multiSelector" :range="province" range-key="text" class="select-city">
						<view>{{selectCity ||indexCity.name}}</view>
					</picker>
				</view>
				<view v-if="welfareList.length == 0" class="welfareActivity-none"></view>
				<coupon-list v-else ref="couponlist" :from="'welfareActivity'" @load-more-coupon="loadMoreCoupon" @formShow="formShow"></coupon-list>
			</view>

			<view class="box">
				<view class="box-tit">
					精选活动
					<picker @change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange" :value="currentSelectIndex"
					 mode="multiSelector" :range="province" range-key="text" class="select-city">
						<view>{{selectCity ||indexCity.name}}</view>
					</picker>
				</view>
				<view class="activity-list" v-if="activityList.length > 0">
					<block v-for="(item,index) in activityList" :key="index">
						<view class="pic-text" @tap="toActivityPage(item.id)">
							<image mode="widthFix" :src="item.picUrl" lazy-load="true"></image>
							<view class="activity-label-text">
								<view :class="'label '+ item.typeClass">
									{{item.typeText}}
								</view>
								<view class="text">{{item.name}}</view>
							</view>
						</view>
					</block>
				</view>
				<view v-else class="activity-list-none"></view>
			</view>
			<navigator v-if="fixSale.salesId" class="fix-sale" target='miniProgram' app-id='wx6986c1a258647aae' :path="'pages/chat?salesId=' + fixSale.salesId"
			 hover-class="none" redirect version="trial"></navigator>
		</scroll-view>
	</view>
</template>

<script>
	import coupon from '@/components/coupon/coupon'
	import formpop from '@/components/formpop/formpop'
	import login from '@/units/login'
	import api from '@/public/api/index'
	import shouquan from '@/units/shouquan'
	let app = getApp()
	export default {
		components: {
			'coupon-list': coupon,
			'form-pop': formpop
		},
		mixins: [shouquan],
		data() {
			return {
				currentSelectIndex: [0, 0],
				indexCity: {},
				selectCity: "",
				selectIndex: "",
				getWelfarePageNumber: 1,
				province: [],
				isLoadGetWelfare: true,
				welfarePageNumber: 1,
				isLoadGetActivity: true,
				activityListPageNumber: 1,
				activityList: [],
				welfareList: [],
				fixSale: {}
			}
		},
		async onShow() {
			this.resetjson()
			api.getUser()
			let currentLocation = app.globalData.currentLocation
			if (currentLocation) {
				this.indexCity = currentLocation.cityData
				let province = await api.getProvince()
				for (let i in province.data) {
					province.data[i]['text'] = province.data[i].provinceName
				}
				this.province[0] = province.data
				await this.getCity(province.data[this.currentSelectIndex[0]].provinceId)
				// 精选活动
				this.getactivity()
				// 福利列表
				this.getWelfare()
				// this.getSalesList()
				this.getChatSales()
			}
		},
		async onLoad() {

		},
		onShareAppMessage() {
			let title = '奥迪东海汇：活动优惠都在这里！'
			let path = `pages/authorization?to=welfareActivity`
			if (app.globalData.salesId) {
				path += `?salesId=${app.globalData.salesId}`
			}
			// let imageUrl = 'https://www1.pcauto.com.cn/zt/yqdzhzq/xcxshare/activity.jpg'
			let imageUrl = 'https://www1.pcauto.com.cn/zt/gz20210125/audi/xcx/img/xcxshare.png'
			return {
				title: title,
				path: path,
				imageUrl: imageUrl
			}
		},
		methods: {
			formShow(name, from = "", obj = {}) {
				this.$refs.formpop.formShow(name, from, obj)
			},
			loadMoreCoupon() {
				this.getWelfarePageNumber++
				this.getWelfare()
			},
			towebView() {
				// api.getMallLink().then(res => {
				// 	let vurl = escape(res.data)
				// 	let url = `/pages/webview?webURL=${vurl}`
				// 	uni.navigateTo({
				// 		url
				// 	})
				// 	console.log('MallLink', res)
				// })
			},
			
			// 跳转商城页
			toMall(){
				uni.navigateTo({
					url:'/pages/mall/index'
				})
				// api.getMallLink().then(res => {
				// 	let vurl = escape(res.data)
				// 	let url = `/pages/webview?webURL=${vurl}`
				// 	uni.navigateTo({
				// 		url
				// 	})
				// 	console.log('MallLink', res)
				// })
			},
			bindMultiPickerChange(e) {
				let {
					detail = [0, 0]
				} = e
				let i1 = detail.value[0] || 0
				let i2 = detail.value[1] || 0
				this.currentSelectIndex = [detail.value[0], i2]
				this.selectIndex = this.province[1][i2]
				this.selectCity = this.selectIndex.regionName
				this.resetjson()
				this.getWelfare()
				this.getactivity() 
				{
					// 改变默认定位省市
					let currentLocation = app.globalData.currentLocation
					currentLocation.cityData.cityId = this.selectIndex.regionId
					currentLocation.cityData.name = this.selectIndex.text
					currentLocation.cityData.proId = this.province[0][i1].provinceId
					currentLocation.cityData.pro = this.province[0][i1].text
				}
			},
			bindMultiPickerColumnChange(e) {
				let {
					detail
				} = e
				if (detail.column == 0) {
					let index = this.province[0][detail.value]
					this.getCity(index.provinceId)
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
				this.selectCity = ''
				this.getWelfarePageNumber = 1
				this.isLoadGetWelfare = true
				this.welfarePageNumber = 1
				this.isLoadGetActivity = true
				this.activityListPageNumber = 1
				this.activityList = []
				this.welfareList = []
			},
			async getChatSales() {
				let {
					data
				} = await api.getSalesId()
				// data = 108349;
				if (data > 0) {
					this.fixSale = {
						'salesId': data
					}
				} else {
					this.getSalesList()
				}
				console.log(data)

			},
			async getSalesList() {
				let currentLocation = app.globalData.currentLocation
				let cityId = this.selectIndex.regionId || currentLocation.cityData.cityId
				let salesId = ''
				if (app.globalData.pocketUserInfo && app.globalData.pocketUserInfo.salesId) {
					salesId = app.globalData.pocketUserInfo.salesId
				}
				let {
					data
				} = await api.getSalesList({
					manufacturerId: 1,
					orderByRanking: 1,
					pageNum: 1,
					pageSize: 10,
					regionId: cityId,
					salesId: salesId
				})
				if (data.list[0]) {
					this.fixSale = data.list[0]
				}

				console.log('getSalesList', this.fixSale)
			},
			// 获取精选活动
			async getactivity() {
				if (this.isLoadGetActivity) {
					this.isLoadGetActivity = false
					let currentLocation = app.globalData.currentLocation
					let cityId = this.selectIndex.regionId || currentLocation.cityData.cityId
					let {
						rows
					} = await api.getactivity(cityId, 3, this.activityListPageNumber)
					this.activityListPageNumber++
					if (rows.length > 0) {
						this.isLoadGetActivity = true
					}
					for (let i in rows) {
						let obj = rows[i]
						let type = obj.type
						let typeText
						let typeClass
						if (type == 1) {
							typeText = '购车福利'
							typeClass = 'red-bg'
						} else if (type == 2) {
							typeText = '车主福利'
							typeClass = ''
						} else {
							typeText = '线下活动'
							typeClass = 'yellow-bg'
						}
						obj.typeText = typeText
						obj.typeClass = typeClass
					}
					this.activityList = [...this.activityList, ...rows]

					console.log('activityList', this.activityList)
				}
			},
			// 获取福利列表
			async getWelfare() {
				let currentLocation = app.globalData.currentLocation
				let cityId = this.selectIndex.regionId || currentLocation.cityData.cityId

				let data = await api.getWelfare(cityId, 3, this.welfarePageNumber)
				this.welfarePageNumber++
				let rows = data.rows ? data.rows : []
				let total = Math.ceil(data.total / 3)
				let a = [...this.welfareList, ...rows]
				this.welfareList = a
				console.log('welfareList', this.welfareList)
				if(this.welfareList.length == 0){return;}
				this.$nextTick(function(){
					if (this.welfarePageNumber > total || rows.length < 3) {
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
			async getCity(id) {
				let {
					data
				} = await api.getRegionByProvince(id)
				for (let i in data) {
					data[i]['text'] = data[i].regionName
				}
				// this.province[1] = data
				this.$set(this.province, 1, data)
				return data
			}
		}
	}
</script>

<style lang="less">
	@import '@/static/less/welfareActivity.less';
</style>
