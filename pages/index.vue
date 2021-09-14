<template>
	<view class="index">
		<pageTopCity ref="pagetop" :background="'#fff'" :titleys="'#3C4650'" :btnys="'white'" :title.sync="title">
			<view class="city">
				<picker @change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange" :value="selectIndex"
					mode="multiSelector" :range="[provinceList, cityList]" range-key="name" class="select-city">
					<view class="cityName">{{ selectCity || indexCity.name }}</view>
					<image src="../static/images/arrowBottom.png" class="img"></image>
				</picker>
			</view>
		</pageTopCity>
		<!--  #ifndef MP-TOUTIAO  -->
		<viewTabBar :current="0"></viewTabBar>
		<!-- #endif -->
		<testDrive aldEventName="首页预约试驾点击"></testDrive>
		<customSwiper ref='cmSwiper' :swiper-list="pageData.banners"  v-if="pageData.banners && pageData.banners.length> 0"></customSwiper>
		<image class="morenpic" src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/changanMoren.png" v-else>
		</image>
		<view class="content">
			<!-- 	<image v-if="pageData.bannerActivity&&pageData.bannerActivity.picUrl" class="bannerTop"
				:src="pageData.bannerActivity.picUrl" @tap="goActDetail(pageData.bannerActivity.id)"></image> -->
			<!-- 	<view class="linkCont" v-if="false">
				<view class="linkContL"> -->
			<!-- 					<view class="article linkItem" @tap="goArtList">
						<view class="title">发现</view>
						<view class="info">探索更多精彩</view>
						<image class="img" lazy-load
							src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/findArticle.png"></image>
					</view>
				</view>
				<view class="linkContR">
					<view class="testDrive linkItem rItem" @tap="goTestDrive">
						<view class="title">预约试驾</view>
						<view class="info">试驾快人一步</view>
						<image class="img" lazy-load
							src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/testDriveIcon.png"></image>
					</view>
					<view class="calculation linkItem rItem" @tap="goCalc">
						<view class="title">购车计算</view>
						<view class="info">价格一目了然</view>
						<image class="img" lazy-load
							src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/cal.png"></image>
					</view>
				</view>
			</view> -->
			<view class="hotAct">
				<view :class="fontLoaded ? 'hotTab autoFont': 'hotTab'">
					热销车型
				</view>
				<scroll-view scroll-x="true" show-scrollbar class="hotCar">
					<view class="hotCarItem" v-for="(item,index) in sgList" :key="index" @tap="goLookCar(item)">
						<image :src="item.picCoverUrl" class="img"></image>
						<view class="title">{{item.name.trim() ? item.name : '无'}}</view>
					</view>
				</scroll-view>
			</view>
			<view class="hotAct">
				<view class="hotTab">
					云展厅
				</view>
				<view class="actItem vrCar" @tap="goVr">
					<image src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/vrCar.jpg" class="img"></image>
				</view>
			</view>
			<view class="hotAct">
				<view class="hotTabMore" >
					最近门店
				</view>
				<view class="hotmore" @tap="goMoreDel()">查看更多
					<image class="hotmoreImg"
						src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/dealMore.png"></image>
				</view >

				<view class="actItem dealCar">
					<image src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/NearDealer.png" class="img" mode="aspectFill"></image>
				</view>
				<view class="hotNDelF">
					<view class="hotNDelFTitle">{{nearDealer.name}}</view>
					<view class="hotNDelFLocation">{{nearDealer.address}}</view>
					<view class="hotNDelFView">
						<view @tap = "goDealer()" class="footone">
							<image class="hotNDelFicon"
								src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/dealLocation.png"></image>
							
							<view>{{nearDealer.distance | formatThousand}}</view>
							
						</view>
						<view @tap = "goPhone()" class="foottwo" v-if="this.nearDealer.phone && this.nearDealer.phone.length > 0">
							<image class="hotNDelFicon right"
								src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/dealPhone.png"></image>
							<view> 打电话</view>
						</view>
						<view class="hotNDelFBtn" @tap="goYuyue()">预约试驾</view>
					</view>
				</view>

			</view>

			<view class="hotAct" v-if="pageData.list.length">
				<view class="hotTab">
					精选
				</view>
				<view v-for="(item,index) in pageData.list" :key="index" class="actItem"
					@tap="handleLinkHot(item.contentType,item.contentId,item.status,item.livestreamId,item.id)">
					<view :class="item.contentType == 3 ? 'playType':''">
						<!--contentType 1文章资讯，2活动，3直播-->
						<!--status 当为直播类型时 1直播中  2预告  3回放-->
						<!--            <view class="icon1 status_3">YYYY-MM-DD HH-MM开播</view>-->
						<view class="icon1" v-if="item.contentType !=3">
							<image :src="typeIcon[item.contentType-1]" class="iconK"></image>
							{{item.contentType | formatType}}
						</view>
						<view v-else>
							<view class="icon1 iconB" v-if="item.status == 1">
								<image :src="liveIcon[item.status-1]" class="iconK"></image>
								{{item.status | formatStatus}}
							</view>
							<view class="icon1" v-if="item.status == 2 && item.startTime">
								<image :src="liveIcon[item.status-1]" class="iconK"></image>{{item.startTime}}开播
							</view>
							<view class="icon1" v-if="item.status == 3">
								<image :src="liveIcon[item.status-1]" class="iconK"></image>
								{{item.status | formatStatus}}
							</view>
						</view>
						<!--            <view class="icon1 status_1">{{item.contentType}}{{item.status}}</view>-->
						<image class="img banner" :src="item.picUrl" lazy-load mode="aspectFill"></image>
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
	import distance from '@/units/distance'
	import pageTopCity from '@/components/pageTopCity/pageTopCity'
	import customSwiper from '@/components/blackmonth-swiper/homeSwiper'
	let app = getApp()
	export default {
		components: {
			viewTabBar: tabBar,
			testDrive,
			pageTopCity,
			customSwiper
		},
		mixins: [shouquan],
		data() {
			return {
				crtCityItem: [],
				provinceList: [],
				cityList: [],
				crtProvinceItem: {}, // 当前选择的省份
				title: '长安汽车云车展',
				sgList: [],
				typeIcon: ['https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/art_icon_3x.png',
					'https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/act_icon_3x.png'
				],
				liveIcon: ['https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/play_icon_3x.png',
					'https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/willplay_icon_3x.png',
					'https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/replay_icon_3x.png'
				],
				pageData: {
					banners: [],
					list: []
				},
				testUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F018c1c57c67c990000018c1b78ef9a.png&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1623756249&t=81ceea2ac01c237a71a3587b2482151a',

				fontLoaded: false,
				timeOutEvent: '',
				nearDealer:{},
				currentCity:{
					cityId:'',
					proId:'',
					name:''
				}
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
			selectIndex() {
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
		filters: {
			formatThousand (num) {
			    if(num){
					if(num > 1000){
						 return (num / 1000).toFixed(2)  + 'km'
					}else{
						return num + 'm'
					}
				}else{
					return '无法获取距离'
				}
			  
			},
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
			formatType(type) {
				// <!--contentType 1文章资讯，2活动，3直播-->
				// <!--status 当为直播类型时 1直播中  2预告  3回放-->
				switch (type) {
					case 1: {
						return '资讯'
						break;
					}
					case 2: {
						return '活动'
						break;
					}
				}
			},
			formatStatus(status) {
				// <!--contentType 1文章资讯，2活动，3直播-->
				// <!--status 当为直播类型时 1直播中  2预告  3回放-->
				switch (status) {
					case 1: {
						return '直播中'
						break;
					}
					case 3: {
						return '回放'
						break;
					}
				}
			},

		},
		onHide() {
			clearTimeout(this.timeOutEvent);
		},
		async onShow(options) {
			await distance.getLocation()
			await this.reqProvinceCityList()
			let currentLocation = app.globalData.currentLocation
			if (!currentLocation) {
				return
			}
			console.log('index_app.globalData.currentLocation', app.globalData.currentLocation)
			const crtLocationProvinceItem = this.provinceList.find(item => item.name.replace('省', '').replace('市',
				'') == currentLocation.selectedCityData.pro.replace('省', '').replace('市', ''))
			if (crtLocationProvinceItem) {
				const crtLocationCityItem = crtLocationProvinceItem.cities.find(item => item.name.replace('市', '') ==
					currentLocation.selectedCityData.city.replace('市', ''))
				this.crtProvinceItem = crtLocationProvinceItem
				this.cityList = this.crtProvinceItem.cities
				this.crtCityItem = crtLocationCityItem

				console.log('tstst', this.crtProvinceItem, this.crtCityItem)
				// const resData = (await this.getCityId()) || [1000000022,1000000022]
				// const provinceId = this.crtProvinceItem.id
				await this.getPageData()
				this.getNearDealer()
			}
			clearInterval(this.timeOutEvent)
			this.timeOutEvent = setInterval(() => {
				console.log('开始及时')

				// #ifdef MP-WEIXIN
				if (this.$refs.cmSwiper && this.pageData.banners && this.pageData.banners.length > 0) {
					// console.log(this.$refs.cmSwiper)
					this.$refs.cmSwiper.moveRight()
				}
			}, 4000); //这里设置定时
			// #endif


			// #ifdef MP-TOUTIAO
			if (this.$children[2] && this.pageData.banners && this.pageData.banners.length > 0) {
				// console.log(this.$refs.cmSwiper)
				this.$children[2].moveRight()
			}
		},
		4000); //这里设置定
	// #endif


	},
	watch: {
			indexCity: function(newVal) {
				console.log('indexCity===========', newVal)
			}
		},
		async onLoad(options) {	},
			onUnload() {},
			onShareAppMessage() {
				let title = '长安云车展'
				let path = `pages/authorization?to=index`
				if (app.globalData.salesId) {
					path += `&salesId=${app.globalData.salesId}`
				}
				let imageUrl = 'https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/share.jpeg'
				return {
					title: title,
					path: path,
					imageUrl: imageUrl
				}
			},
			methods: {
				async getPageData() {
					const cityId = this.crtCityItem.id
					const cityCode = this.crtCityItem.code
					this.pageData = await api.getHomepageData({
						cityId: cityId,
						cityCode: cityCode
					}).then(res => {
						return res.code == 1 ? res.data : {
							banners: [],
							list: []
						}
					})

					// #ifndef MP-WEIXIN

				let array = this.pageData.banners.filter(item=>item.miniUrl.indexOf('banH=true') == -1)
				this.pageData.banners = array

					// #endif
					this.sgList = this.pageData.heatSgList
					// this.pageData.bannerActivity.picUrl = 'https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/1.png';
				}, 
				
			async getNearDealer(){
	                let  cityId;
					let  pro;
					let  city;
					//  产品需求是有定位显示定位，没有定位显示选择
					let currentLocation = app.globalData.currentLocation
					if(currentLocation.wxPosition.provider == 'default'){
						// 说明没有定位
						let  selectcityData = currentLocation.selectedCityData
						if(selectcityData){
							city = selectcityData.city
							pro  =  selectcityData.pro
						}
					}else{
					   city = currentLocation.cityData.city;     
					   pro  =  currentLocation.cityData.pro
					}
					// console.log('provinceList',city,pro)
				    if (city&&pro) {
				    	const crtLocationProvinceItem = this.provinceList.find(item => item.name.replace('省', '').replace(
				    		'市', '') == pro.replace('省', '').replace('市', ''))
							
				    	if (crtLocationProvinceItem) {
				    		const crtLocationCityItem = crtLocationProvinceItem.cities.find(item => item.name.replace(
				    			'市', '') == city.replace('市', ''))
								 // console.log('this.provinceList',crtLocationCityItem)
							cityId = crtLocationCityItem.id
							this.currentCity.cityId = cityId
							this.currentCity.proId = crtLocationProvinceItem.id
							this.currentCity.name = crtLocationCityItem.name
							const {code,data} = await api.fetchDealerListByCityId({cityId})
							if(code === 1 && data.length) {
							  this.dealersList = distance.sortDealersByDistance(data)
							  this.nearDealer = this.dealersList[0]
							}else {
							    this.nearDealer = {}
							}
				    	
				    	}
				    }
				   
				   console.log('provinceList',this.nearDealer)
			
			
					
					
				},
				
				
				// 请求省份和城市的级联列表
				async reqProvinceCityList() {
					try {
						const res = await api.fetchProvinceCityList()
						if (res.code == 1) {
							this.provinceList = res.data
							if (this.provinceList && this.provinceList.length) {
								this.cityList = this.provinceList[0].cities
							}
						}
					} catch (err) {
						this.$toast('获取省份和城市信息失败', 'none', 1500);
						console.error(err)
					}
				},
				async bindMultiPickerChange(e) {
					let {
						detail
					} = e
					this.crtProvinceItem = this.provinceList[detail.value[0]]
					this.cityList = this.crtProvinceItem.cities
					this.crtCityItem = this.cityList[detail.value[1]] ? this.cityList[detail.value[1]] : this.cityList[
						0]
					await this.getPageData()
					// 改变默认定位省市
					let currentLocation = app.globalData.currentLocation
					currentLocation.selectedCityData.isChange = true
					currentLocation.selectedCityData.proId = this.crtProvinceItem.id
					currentLocation.selectedCityData.pro = this.crtProvinceItem.name
					currentLocation.selectedCityData.cityId = this.crtCityItem.id
					currentLocation.selectedCityData.city = this.crtCityItem.name
					this.getNearDealer()
				},
				bindMultiPickerColumnChange(e) {
					let {
						detail
					} = e
					if (detail.column == 0) {
						this.cityList = this.provinceList[detail.value].cities
					}
				},
				async getCityId() {
					let currentLocation = app.globalData.currentLocation
					if (currentLocation) {
						let pro = currentLocation.selectedCityData.pro || currentLocation.cityData.pro
						let city = currentLocation.selectedCityData.city || currentLocation.cityData.city

						const provinceList = await this.reqProvinceList()
						console.log('sdsdsd', provinceList)
						const crtLocationProvinceItem = provinceList.find(item => item.name.replace('省', '').replace(
							'市',
							'') == pro.replace('省', '').replace('市', ''))
						if (crtLocationProvinceItem) {
							const cityList = await this.reqCityListByProvinceId(crtLocationProvinceItem.id)
							const crtLocationCityItem = cityList.find(item => item.name.replace('市', '') == city
								.replace(
									'市', ''))
							if (crtLocationCityItem) {
								this.crtProvinceItem = crtLocationProvinceItem
								this.crtCityItem = crtLocationCityItem
								console.log('this.crtProvinceItem', this.crtProvinceItem, this.crtCityItem)
								return [crtLocationProvinceItem.id, crtLocationCityItem.id]
							}
						}
					}
				},
				// 请求所有的省份
				async reqProvinceList() {
					let res = [];
					try {
						res = await api.fetchProvinceList().then(res => {
							return res.code == 1 ? res.data : []
						})
						console.log('rrr', res)
						return res
					} catch (err) {
						this.showToast('获取省份信息失败')
						console.error(err)
						return res
					}
				},
				// 根据省份id请求城市
				async reqCityListByProvinceId(provinceId) {
					let res = []
					try {
						res = await api.fetchCityListByProvinceId({
							provinceId
						}).then(res => {
							return res.code == 1 ? res.data : []
						})
						console.log('ccc', res)
						return res
					} catch (err) {
						this.showToast('获取城市信息失败')
						console.error(err)
						return res
					}
				},
				goMoreDel() {
					console.log('去更多经销商	',this.currentCity)
					// var nearDealer = JSON.stringify(this.currentCity);
					uni.navigateTo({
						url: `/pages/moreDealer?nearDealer=${this.nearDealer.id}`
					})
				},
				goDealer(){
					console.log('去经销商',this.nearDealer)
					if(this.nearDealer && this.nearDealer.lngX && this.nearDealer.lngY ){
						uni.navigateTo({
							url:`/pages/map?latitude=${this.nearDealer.lngY}&longitude=${this.nearDealer.lngX}&des=${this.nearDealer.name}`
						})
					}
				},
				goPhone(){
					console.log('获取电话')
					if(this.nearDealer.phone && this.nearDealer.phone.length > 0){
					uni.makePhoneCall({
					    phoneNumber: this.nearDealer.phone,
						success(res) {
						     // 调用成功 makePhoneCall:ok
						     console.log("调用成功", res.errMsg);
						   },
						 fail(res) {
						     this.$toast(res.errMsg)
						   },  
					});	
					}
				
				},
				goYuyue(){
					console.log('预约试驾')
					 var nearDealer = JSON.stringify(this.nearDealer);
					uni.navigateTo({
						url: `/pages/NearDealerYuyuePage?nearDealer=${nearDealer}&cityId=${this.currentCity.cityId}&proId=${this.currentCity.proId}&cityName=${this.currentCity.name}`
					})
				},
				goVr() {
					// #ifdef MP-WEIXIN
					wx.aldstat.sendEvent('云展厅点击')
					uni.navigateTo({
						url: '/pages/exhibition'
					})
					// #endif

					// #ifdef MP-TOUTIAO
					uni.switchTab({
						url: '/pages/exhibition'
					})
					// #endif



				},
				handleLinkHot(type, id, status, sourceId, liveSoureId) {
					// type = 3
					// id = 48965835
					// status = 'verticalLive'
					// status = 1
					//type:1资讯，2活动，3直播
					//status:1直播中，2预告，3回放
					console.log('type,id,status', type, id, status, typeof(type))
					switch (type) {
						case 1: {
							// #ifdef MP-WEIXIN
							wx.aldstat.sendEvent('精选资讯点击')
							// #endif
							uni.navigateTo({
								url: `/pages/article?articleId=${id}`
							})
							break;
						}
						case 2: {
							// #ifdef MP-WEIXIN
							wx.aldstat.sendEvent('精选活动点击')
							// #endif
							// uni.navigateTo({
							// 	url: `/pages/activity?id=${id}`
							// })
							this.getActData(id)
							break;
						}
						case 3: {
							// #ifdef MP-WEIXIN
							wx.aldstat.sendEvent('精选直播点击')
							// #endif
							switch (status) {
								case 0: {
									uni.navigateTo({
										url: `/pages/liveDetail?liveId=${sourceId}`
									})
									break;
								}
								case 1: {
									this.goMP(id, 'verticalLive', liveSoureId)
									break;
								}
								case 2: {
									uni.navigateTo({
										url: `/pages/liveDetail?liveId=${sourceId}`
									})
									break;
								}
								case 3: {
									this.goMP(id, 'verticalPlayback', liveSoureId)
									break;
								}
							}
							break;
						}
					}
				},
				async getActData(contentId) {
					let {
						data = {}
					} = await api.getActivityContent(contentId);
					let item = data
					// console.log('dadad' + JSON.stringify(item))
					switch (item.redirectType) {
						case 0: {
							if (item.duibaUrl && item.duibaUrl == 'changan://lbcjactivity') {
								let url = '/pages/lbActivity?id=' + item.id
								uni.navigateTo({
									url
								})
							} else {
								let url = '/pages/activity?id=' + item.id
								uni.navigateTo({
									url
								})
							}
							break;
						}
						case 1: {
							api.fetchActivityVisit({
								'activityId': item.id
							})
							if (item.duibaUrl && item.duibaUrl.substring(0, 4) == "http") {
								uni.navigateTo({
									url: `/pages/webview?webURL=${encodeURIComponent(item.duibaUrl)}`,
								})
							}
							break;
						}
						case 2: {
							if (item.appId == 'wxe6ffa5dceb3b003b' || item.appId == 'wxb36fb5205e5afb36') {
								// 说明是自己的小程序
								uni.navigateTo({
									url: item.miniUrl
								})
								// #ifndef MP-WEIXIN
								if (item.miniUrl && item.miniUrl.substr(0, 3) == 'cxd') {
									this.$toast('请在微信搜索本小程序参与')
								}
								// #endif
								if (item.miniUrl.indexOf('lbActivity') == -1 && item.miniUrl.indexOf('activity') == -
									1) {
									// 跳转到本喜爱但不是活动页
									api.fetchActivityVisit({
										'activityId': item.id
									})
								}
								return
							} else {
								api.fetchActivityVisit({
									'activityId': item.id
								})

								// #ifndef MP-WEIXIN
								this.$toast('请在微信搜索本小程序参与')
								// #endif
								// #ifdef MP-WEIXIN
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
									// envVersion: 'trial'
								});
								// #endif
							}
							break;
						}
						default: {
							if (item.duibaUrl && item.duibaUrl == 'changan://lbcjactivity') {
								let url = '/pages/lbActivity?id=' + item.id
								uni.navigateTo({
									url
								})
							} else {
								let url = '/pages/activity?id=' + item.id
								uni.navigateTo({
									url
								})
							}
							break;
						}
					}
				},
				goMP(id, type, sourceId) { //跳转pcauto+
					const oUrl =
						`/pages_live/changanVerticalLiveRoom/changanVerticalLiveRoom?id=${id}&type=${type}&sourceId=${sourceId}`
					console.log('oUrl', oUrl)
					// #ifndef MP-WEIXIN
					this.$toast('请在微信搜索本小程序参与')
					// #endif
					// #ifdef MP-WEIXIN
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
						// envVersion: 'trial'
					});
					// #endif
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
						url: '/pages/activity?id=50'
					})
				},
				goLookCar(item) {
					// #ifdef MP-WEIXIN
					wx.aldstat.sendEvent('热销车型点击')
					// #endif
					uni.navigateTo({
						url: `/pages/LookCar?id=${item.pcSerialGroupId}`
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
	@import '@/static/less/public.less';

	.city {
		display: inline-block;
		left: 0;
		top: 0;
		z-index: 1;
		padding: 15rpx 32rpx 0;
		background-color: #ffffff;

		.select-city {
			position: relative;

			view {
				font-size: 28rpx;
				max-width: 164rpx;
				color: #333333;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.img {
				position: absolute;
				bottom: 15rpx;
				right: -24rpx;
				content: '';
				width: 16rpx;
				height: 8rpx;
				background-size: 16rpx 8rpx;
			}
		}
	}

	.morenpic {
		height: 970rpx;
		width: 676rpx;
		border-radius: 10px;
		margin-left: 37rpx;
	}

	.index {
		// padding-top: 16rpx;
		overflow-x: hidden;
		// font-family: PingFang SC;
		color: #3C4650;
	}

	.ovh {
		color: #3C4650 !important;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 620rpx;
	}

	.shadow {
		box-shadow: 5px 5px 17px rgba(0, 0, 0, 0.3);
	}

	.content {
		padding: 0 32rpx 150rpx;
		/*  #ifndef  MP-WEIXIN */
		padding: 0 32rpx 20rpx;
		/*  #endif  */

		.bannerTop {
			width: 100%;
			height: 500rpx;
			border-radius: 20rpx;
		}

		.banner {
			width: 100%;
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
				font-size: 34rpx;
				// font-weight: bold;
				margin-bottom: 10rpx;
			}

			.hotTabMore {
				font-size: 34rpx;
				// font-weight: bold;
				margin-bottom: 10rpx;
				display: inline;

			}

			.hotmore {
				position: absolute;
				right: 40rpx;
				color: #999999;
				font-size: 24rpx;
				display: inline-flex;
				text-align: center;
				height: 24rpx;
				line-height: 24rpx;
				// background-color: red;

			}

			.hotmoreImg {
				width: 8rpx;
				height: 16rpx;
				margin: auto;
				margin-left: 15rpx;
			}

			.hotNDelF {
				.hotNDelFTitle{
					color:#3C4650 ;
					font-size: 32rpx;
					margin: 24rpx 0rpx;
				}
				.hotNDelFLocation{
					color:#999999;
					font-size: 24rpx;
					
				}
				.hotNDelFView {
					color: #3C4650;
					font-size: 24rpx;
					margin-top: 15rpx;
					display: flex;
					flex-direction: row;
					height: 56rpx;
					line-height: 56rpx;
				   	.footone{
					    display: flex;
						flex-direction: row;
						height: 56rpx;
						line-height: 56rpx;
					}
					.foottwo{
						display: flex;
						flex-direction: row;
						height: 56rpx;
						line-height: 56rpx;
					}

					.hotNDelFicon {
						// display: block;
						margin: auto  9rpx;
						width: 32rpx;
						height: 32rpx;
						
					}
					.right{
						margin-left: 40rpx;
					}
					.hotNDelFBtn{
						position: absolute;
						right:32rpx;
						width: 160rpx;
						height: 56rpx;
						font-size:24rpx ;
						color: #FFFFFF;
						line-height: 56rpx;
						text-align: center;
						background: #ff9632;
						border-radius: 28px;
					}
				}


			}


			.actItem {
				margin: 15rpx 0 30rpx 0;
				background: #fff;
				position: relative;
			}

			.hotCar {
				width: 700rpx;
				overflow: hidden;
				white-space: nowrap;
				/*  #ifndef  MP-WEIXIN */
				height: 180rpx;
				flex-direction: column;
				/*  #endif  */


				.hotCarItem {
					display: inline-block;
					width: 210rpx;
					align-items: center;
					margin-right: 16rpx;
					white-space: nowrap;

					.img {
						width: 210rpx;
						height: 120rpx;
						border-radius: 20rpx;
						margin: 10rpx 0 -5rpx 0;
					}

					.title {
						height: 34rpx;
						width: 100%;
						font-size: 24rpx;
						font-weight: bold;
						text-align: center;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						color: #4A4A4A;
					}
				}
			}

			.playType {
				position: relative;

				&::after {
					content: '';
					position: absolute;
					width: 100rpx;
					height: 100rpx;
					background: url('https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/pause_icon.png');
					background-size: contain;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
				}
			}
			.dealCar{
				position: relative;
				
				.img {
					display: inline-block;
					width: 686rpx;
					height: 360rpx;
					border-radius: 20rpx;
				}
			}
			.vrCar {
				position: relative;

				.img {
					display: inline-block;
					width: 686rpx;
					height: 360rpx;
					border-radius: 20rpx;
				}

				&::after {
					content: '';
					position: absolute;
					width: 100rpx;
					height: 100rpx;
					background: url('https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/vr_icon.png');
					background-size: contain;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
				}
			}

			.icon1 {
				position: absolute;
				height: 40rpx;
				left: 24rpx;
				top: 20rpx;
				background: rgba(0, 0, 0, .3);
				box-sizing: border-box;
				padding: 5rpx 14rpx 5rpx 10rpx;
				color: #fff;
				border-radius: 12rpx;
				font-size: 24rpx;

				.iconK {
					width: 32rpx;
					height: 32rpx;
					vertical-align: bottom;
					margin-right: 8rpx;
				}

				&.iconB {
					padding-left: 48rpx;

					.iconK {
						position: absolute;
						left: -4rpx;
						top: 0;
						width: 40rpx;
						height: 40rpx;
						vertical-align: bottom;
					}
				}
			}

			.palyType {
				position: relative;

				&::after {
					content: '';
					position: absolute;
					width: 100rpx;
					height: 100rpx;
					background: url('https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/pause_icon.png');
					background-size: contain;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
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
