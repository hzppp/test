<template>
	<view class="index">
		<loading ref="loading"></loading>
		<plinput ref="plinput" :fromPage="'index'" @add-pl="addpl"></plinput>
		<scroll-view lower-threshold="350" @scrolltolower="scrollGetData" class="scroll-view" scroll-y="tre">
			<button v-if="isUserInfoPage" class="getUserInfo_name_info_mask_body" lang="zh_CN" @getuserinfo="getWxUserInfoButton"
			 open-type="getUserInfo"></button>
			<!-- <form-pop></form-pop> -->
			<form bindsubmit="formSubmit" report-submit="true">
				<view class="header">
					<image v-if="citybgName" class="header-bg" :src="'https://www1.pcauto.com.cn/zt/gz20210125/audi/xcx/img/'+citybgName+'.png'"
					 mode="widthFix" lazy-load="false"></image>
					<picker @change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange" mode="multiSelector" :range="province"
					 range-key="text" class="selct-city">
						<view>{{selectCity || indexCity.name}}</view>
					</picker>
				</view>
				<!--  -->
				<view class="swiper" v-if="activityList.length > 0">
					<swiper :indicator-color="'#ebebeb'" :current="swiperCurrent" indicator-active-color="#c6c6c6" :indicator-dots="activityList.length > 1"
					 autoplay="true" circular="true" interval="3000">
						<swiper-item @tap="toMoneyActivityPage" v-if="isShow">
							<image class="swiper-image" mode="scaleToFill" src="https://www1.pcauto.com.cn/gz/20190715/dazhong/fuqi_bannner.png"></image>
						</swiper-item>
						<block v-for="(item,index) in activityList" :key="index">
							<swiper-item @tap="toActivityPage(item.id)">
								<image class="swiper-image" mode="scaleToFill" :src="item.picUrl"></image>
								<button class="submit-button" formType="submit" plain="true"></button>
							</swiper-item>
						</block>
					</swiper>
				</view>
			</form>
			<view class="tuijian-tit">精选推荐</view>
			<tuijian ref="tuijian" :from="'tuijian'" @changeLoading="changeLoading" @xianshi="plinputxianshi"></tuijian>
		</scroll-view>
	</view>
</template>

<script>
	import login from '@/units/login'
	import api from '@/public/api/index'
	import shouquan from '@/units/shouquan'

	import plinput from '@/components/plinput/plinput'
	import dynamic from '@/components/dynamic/dynamic'
	let app = getApp()
	export default {
		components: {
			plinput,
			tuijian: dynamic
		},
		data() {
			return {
				H5URL: "https://client.weiruicar.com/site/index",
				selecti1: 0,
				swiperCurrent: 0,
				activityList: [],
				selectIndex: "",
				selectCity: "",
				province: [],
				citybgName: "",
				indexCity: {},
				isShow: false
			}
		},
		mixins: [shouquan],
		watch:{
			indexCity: function(newVal){
				console.log('indexCity===========',newVal)
			}
		},
		async onLoad(options) {
			this.selectCity = ''
			this.welfareList = []
			this.serialList = []
			this.activityList = []
			await login.login()
			api.getUser()
			// this.$invoke('tuijian', 'startGetData')
			// 
			console.log('index onLoad====')
			let currentLocation = app.globalData.currentLocation
			if (currentLocation) {
				{
					this.indexCity = currentLocation.cityData
					console.log('cityData=========',currentLocation.cityData)
					this.setCityBg(this.indexCity.proId)
					let province = await api.getProvince()
					// console.log('province=========',province)
					for (let i in province.data) {
						province.data[i]['text'] = province.data[i].provinceName
					}
					this.province[0] = province.data
					await this.getCity(province.data[this.selecti1].provinceId)
				}

				// 精选活动
				this.getactivity(currentLocation.cityData.cityId)
			}
			// this.compareDate('2020-01-23 23:00:00','2020-01-26 23:59:59')
			this.compareDate('2020-01-19 18:25:00', '2020-01-24 18:50:59')
			
		},
		async onShow() {
			await this.$refs.tuijian.startGetData()
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
			addpl(obj){
				this.$refs.tuijian.addpl(obj)
			},
			plinputxianshi(obj,ly){
				this.$refs.plinput.xianshi(obj,ly)
			},
			changeLoading(type = false) {
				this.$refs.loading.changeLoading(type)
			},
			bindMultiPickerChange(e) {
				let {
					detail = [0, 0]
				} = e
				let i1 = detail.value[0] || 0
				let i2 = detail.value[1] || 0
				this.selecti1 = i1
				this.selectIndex = this.province[1][i2]
				this.selectCity = this.selectIndex.regionName
				// this.getWelfare(this.selectIndex.regionId)
				this.getactivity(this.selectIndex.regionId);
				this.setCityBg(this.province[0][detail.value[0]].provinceId)
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
			toCarPage(id) {
				let url = '/pages/carShow?id=' + id
				uni.navigateTo({
					url
				})
			},
			async toActivityPage(id) {
				console.log(id)
				let url
				if (id == 'towebview') {
					// /api/audi/xcx/h5/url
					let vvurl = await api.getH5URL(this.H5URL)
					let vurl = escape(vvurl.data)
					url = `/pages/webview?webURL=${vurl}`
				} else {
					url = '/pages/activity?id=' + id
				}
				uni.navigateTo({
					url
				})
			},
			toMoneyActivityPage() {
				let url = '/pages/moneyActivity'
				uni.navigateTo({
					url
				})
			},
			formSubmit(e) {
				let {
					detail
				} = e
				api.saveFormId(detail.formId)
			},
			toWelfarePage() {
				let url = '/pages/welfareActivity'
				uni.reLaunch({
					url
				})
			},
			scrollGetData() {
				this.$refs.tuijian.scrollGetData()
			},
			compareDate(beginDate, endDate) {
				const date = new Date()
				const seperator1 = "-"
				const blank = " "
				const colon = ":"
				const year = date.getFullYear()
				let month = date.getMonth() + 1
				let strDate = date.getDate()
				let hour = date.getHours();
				let minutes = date.getMinutes();
				let seconds = date.getSeconds();

				if (month >= 1 && month <= 9) {
					month = "0" + month
				}
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate
				}
				if (hour >= 1 && hour <= 9) {
					hour = "0" + hour
				}
				if (minutes >= 1 && minutes <= 9) {
					minutes = "0" + minutes
				}
				if (seconds >= 1 && seconds <= 9) {
					seconds = "0" + seconds
				}
				console.log(year, strDate, month, hour, minutes, seconds)
				const currentdate = year + seperator1 + month + seperator1 + strDate + blank + hour + colon + minutes + colon +
					seconds
				const d1 = new Date(beginDate.replace(/\-/g, "\/"))
				const d2 = new Date(endDate.replace(/\-/g, "\/"))
				const dc = new Date(currentdate.replace(/\-/g, "\/"))
				console.log(d1, d2, dc)
				if (beginDate != '' && endDate != '' && currentdate != '' && dc >= d1 && dc <= d2) {
					this.isShow = true
				}

			},
			// 设置头图
			setCityBg(provinceId) {
				// if (provinceId == 10) {
				// 	this.citybgName = 'hunan'
				// } else if (provinceId == 4) {
				// 	this.citybgName = 'hubei'
				// } else if (provinceId == 22) {
				// 	this.citybgName = 'henan'
				// } else if (provinceId == 13) {
				// 	this.citybgName = 'shandong'
				// } else {
				// 	this.citybgName = 'tongyong'
				// }
				if(provinceId == 3) {
					this.citybgName = 'fujian'
				} else if(provinceId == 19){
					this.citybgName = 'zhejiang'
				}else {
					this.citybgName = 'tongyong'
				}
			},
			// 获取精选活动
			async getactivity(cityCode) {
				let {
					rows
				} = await api.getactivity(cityCode, 5)
				this.activityList = []
				let time = new Date().getTime()
				if (time > 1572105600000 && time < 1577808000000) {
					this.activityList = [{
						id: 'towebview',
						picUrl: "http://www1.pcauto.com.cn/zt/gz20160608kdcs/mcjs/20191028_a.jpg"
					}, ...rows]
				} else {
					this.activityList = rows
				}


				this.swiperCurrent = 0
				console.log('activityList', this.activityList)
			},
			async getCity(id) {
				let {
					data
				} = await api.getRegionByProvince(id)
				for (let i in data) {
					data[i]['text'] = data[i].regionName
				}
				// console.log('getCity=========',this.province)
				// this.province[1] = data
				this.$set(this.province, 1, data)
				return data
			}

		}
	}
</script>

<style lang="less">
	@import '@/static/less/index.less';

	.scroll-view {
		.pa(0, 0);
		width: 100%;
		height: 100%;
	}

	.tuijian-tit {
		.seth(60rpx, 40rpx);
		.fb;
		padding: 20rpx 32rpx 0;
	}
</style>
