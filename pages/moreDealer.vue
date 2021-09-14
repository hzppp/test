<template>
	<view class="page">
		<view class="city">
			<picker @change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange" :value="selectIndex"
				mode="multiSelector" :range="[provinceList, cityList,regionList]" range-key="name" class="picker">
				<view class="select-city1">{{crtCityItem.name}}</view>
				<view class="select-city1">{{crtregionItem.name}}</view>
			</picker>
		</view>
		<view class="tabv" v-for="(item,index) in dealerList" :key="index">
			<view class="hotNDelFTitle">{{item.name}}</view>
			<view class="hotNDelFLocation">{{item.address}}</view>
			<view class="hotNDelFView">
				<view @tap="goDealer(item)" class="footone">
					{{item.distance | formatThousand}}
				</view>
				<view @tap="goPhone(item)" class="foottwo" v-if="item.phone && item.phone.length > 0">
					打电话
				</view>
				<view class="hotNDelFBtn" @tap="goYuyue(item)">预约试驾</view>
			</view>
		</view>
	</view>
</template>

<script>
	import api from '@/public/api/index'
	import distance from '@/units/distance'
	export default {
		data() {
			return {
				currentCity: { //传过来的最近门店定位
					cityId: '',
					proId: '',
					name: '',
					countryId: ''
				},
				nearDealerId: '',
				crtProvinceItem: {},
				crtCityItem: {},
				crtregionItem: {},
				cityList: [],
				provinceList: [],
				regionList: [],
				dealerList: []
			}
		},
		computed: {
			selectCity() {
				let text = ''
				if (this.crtCityItem.cityId) {
					text = this.crtCityItem.name
				}
				return text
			},
			selectIndex() {
				let provinceIndex = this.provinceList.findIndex(item => item.id == this.crtProvinceItem.id)
				let cityIndex = -1
				if (this.crtProvinceItem && this.crtProvinceItem.cities) {
					cityIndex = this.crtProvinceItem.cities.findIndex(item => item.id == this.crtCityItem.id)
				}
				let dealerIndex = this.regionList.findIndex(item=> item.id == this.crtregionItem.id)
				provinceIndex = provinceIndex > -1 ? provinceIndex : 0
				cityIndex = cityIndex > -1 ? cityIndex : 0
				dealerIndex = dealerIndex > -1 ? dealerIndex : 0
				return [provinceIndex, cityIndex,dealerIndex]
			}
		},
		watch: {
			crtregionItem(item) {
				console.log('asda',this.crtCityItem,this.crtregionItem)
				this.reqDealerListByCityId(this.crtCityItem.id, this.crtregionItem.id)
			}
		},


		filters: {
			formatThousand(num) {
				console.log(num)
				if (num != undefined && num != Infinity) {
					if (num > 1000) {
						return (num / 1000).toFixed(2) + 'km'
					} else {
						return num + 'm'
					}
				} else {
					return '无法获取距离'
				}

			},
		},
		async onLoad(options) {
			
			this.nearDealerId = options.nearDealer
			await this.getlistByDealer()
			this.reqProvinceCityList()
		},
		methods: {
			async getlistByDealer() {
				let res = await api.listByDealer({
					dealerId: this.nearDealerId
				})
				if (res.code == 1) {
					let dealer = res.data.dealer
					this.currentCity.proId = dealer.provinceId
					this.currentCity.name = dealer.city
					this.currentCity.cityId = dealer.cityId
					this.currentCity.countryId = dealer.countryId;
					

				} else {
					this.currentCity.proId = '1000000022'
					this.currentCity.name = '重庆市'
					this.currentCity.cityId = '1000000262'
					this.currentCity.countryId = '1000002813'
				}

			},
			async bindMultiPickerChange(e) {
				console.log(e)
				let {
					detail
				} = e
				this.crtProvinceItem = this.provinceList[detail.value[0]]
				this.cityList = this.crtProvinceItem.cities
				this.crtCityItem = this.cityList[detail.value[1]] ? this.cityList[detail.value[1]] : this.cityList[
					0]
				this.crtregionItem = this.regionList[detail.value[2]] ? this.regionList[detail.value[2]] : this
					.regionList[0]
				console.log('asda',this.crtCityItem,this.crtregionItem)

			},

			bindMultiPickerColumnChange(e) {
				console.log(e)
				let {
					detail
				} = e
				if (detail.column == 0) {
					this.cityList = this.provinceList[detail.value].cities
					this.crtCityItem = this.cityList[0]
					this.reqRegionByCityId(this.crtCityItem.id)
				}

				if (detail.column == 1) {
					// 城市变
					this.crtCityItem = this.cityList[detail.value]
					this.reqRegionByCityId(this.crtCityItem.id)
				}
				// #ifdef MP-WEIXIN
				if(detail.column == 1){
				  wx.aldstat.sendEvent('更多门店页点击选择城市')
				}else if(detail.column == 2){
				wx.aldstat.sendEvent('更多门店页点击选择地区')
				}
                 // #endif

			},
			async reqProvinceCityList() {
				try {
					const res = await api.fetchProvinceCityList()
					if (res.code == 1) {
						this.provinceList = res.data

						let index = this.provinceList.findIndex(item => item.id == this.currentCity.proId)
						if (index == -1) {
							index = 0
						}
						this.crtProvinceItem = this.provinceList[index]
						if (this.provinceList && this.provinceList.length) {
							this.cityList = this.provinceList[index].cities
							let cityindex = this.cityList.findIndex(item => item.id == this.currentCity.cityId)
							this.crtCityItem = this.cityList[cityindex]
							this.reqRegionByCityId(this.crtCityItem.id)
						}
					}
				} catch (err) {
					this.$toast('获取省份和城市信息失败', 'none', 1500);
					console.error(err)
				}
			},

			async reqRegionByCityId(cityId) {
				try {
					uni.showLoading({
						title: '正在加载...'
					})
					const {
						code,
						data
					} = await api.fetchDistrictListByCityId({
						cityId
					})
					if (code === 1) {
						this.regionList = data
						let index = this.regionList.findIndex(item => item.id == this.currentCity.countryId)
						if (index == -1) {
							index = 0
						}
						this.crtregionItem = this.regionList[index]
					}
				} catch (error) {
					console.error(error)
				} finally {
					uni.hideLoading()
				}
			},
			// 根据城市id请求经销商
			async reqDealerListByCityId(cityId = '', districtId = '') {
				try {
					const res = await api.fetchDealerListByCityId({
						cityId,
						districtId,
					})
					if (res.code == 1) {
						this.dealerList = distance.sortDealersByDistance(res.data)

					}
				} catch (err) {
					
					console.error(err)
				}
			},
			goDealer(nearDealer){
				console.log('去经销商',this.nearDealer)
				// #ifdef MP-WEIXIN
				wx.aldstat.sendEvent('更多门店页点击导航')
				// #endif
				if(nearDealer && nearDealer.lngX && nearDealer.lngY &&  nearDealer.distance  != undefined && nearDealer.distance  != Infinity){
					uni.navigateTo({
						url:`/pages/map?latitude=${nearDealer.lngY}&longitude=${nearDealer.lngX}&des=${nearDealer.name}`
					})
				}
			},
			goPhone(nearDealer){
				console.log('获取电话')
				// #ifdef MP-WEIXIN
				wx.aldstat.sendEvent('更多门店页点击打电话')
				// #endif
				if(nearDealer.phone && nearDealer.phone.length > 0){
				uni.makePhoneCall({
				    phoneNumber: nearDealer.phone,
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
			goYuyue(nearDealer){
				console.log('预约试驾')
				// #ifdef MP-WEIXIN
				wx.aldstat.sendEvent('更多门店页点击预约试驾')
				// #endif
				 var nearDealer = JSON.stringify(nearDealer);
				uni.navigateTo({
					url: `/pages/NearDealerYuyuePage?nearDealer=${nearDealer}&cityId=${this.crtCityItem.cityId}&proId=${this.crtProvinceItem.proId}&cityName=${this.crtCityItem.name}`
				})
			},
		},




	}
</script>

<style lang="less">
	.page {
		background-color: #F6F7F8;
		height: 100vh;
	}

	.city {
		display: inline-block;
		left: 0;
		top: 0;
		z-index: 1;
		padding: 15rpx 32rpx 0;
		background-color: #F6F7F8;

		.picker {
			display: inline-block;

			.select-city1 {
				display: inline-block;
				flex-direction: row;
				font-size: 28rpx;
				color: #333333;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				height: 30rpx;
				line-height: 30rpx;
				background: url('../static/images/arrowBottom.png') no-repeat center right/ 16rpx 8rpx;
				padding-right: 26rpx;
				margin-right: 30rpx;
			}


		}
	}

	.tabv {
		background: #FFFFFF;
		margin: 24rpx 32rpx;
		border-radius: 20rpx;
		padding: 25rpx;

		.hotNDelFTitle {
			color: #3C4650;
			font-size: 32rpx;
			margin-bottom: 24rpx;
		}

		.hotNDelFLocation {
			color: #999999;
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

			.footone {
				display: flex;
				flex-direction: row;
				height: 56rpx;
				line-height: 56rpx;
				background: url('https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/dealLocation.png') no-repeat center left/ 32rpx 32rpx;
				padding-left: 40rpx;
			}

			.foottwo {
				display: flex;
				flex-direction: row;
				height: 56rpx;
				line-height: 56rpx;
				background: url('https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/dealPhone.png') no-repeat center left/ 32rpx 32rpx;
				padding-left: 40rpx;
				margin-left: 40rpx;
			}


			.hotNDelFicon {
				// display: block;
				margin: auto 9rpx;
				width: 32rpx;
				height: 32rpx;

			}

			.right {
				margin-left: 40rpx;
			}

			.hotNDelFBtn {
				position: absolute;
				right: 54rpx;
				width: 160rpx;
				height: 56rpx;
				font-size: 24rpx;
				color: #FFFFFF;
				line-height: 56rpx;
				text-align: center;
				background: #ff9632;
				border-radius: 28px;
			}
		}


	}
</style>
