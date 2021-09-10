<template>
	<view class="page">
		<view class="city">
			<picker @change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange" :value="selectIndex"
				mode="multiSelector" :range="[provinceList, cityList,regionList]" range-key="name" class="picker">
				<view class="select-city1">{{crtCityItem.name}}</view>
				<view class="select-city1">{{crtregionItem.name}}</view>
			</picker>
		</view>
		<view class="tabv" v-for="(item,index) in dealList" :key="index">
			<view class="hotNDelFTitle">{{item.name}}</view>
			<view class="hotNDelFLocation">{{item.address}}</view>
			<view class="hotNDelFView">
				<view @tap="goDealer()" class="footone">
					{{item.distance | formatThousand}}
				</view>
				<view @tap="goPhone()" class="foottwo" v-if="item.phone && item.phone.length > 0">
					打电话
				</view>
				<view class="hotNDelFBtn" @tap="goYuyue()">预约试驾</view>
			</view>
		</view>
	</view>
</template>

<script>
	import api from '@/public/api/index'
	export default {
		data() {
			return {
				currentCity: { //传过来的最近门店定位
					cityId: '',
					proId: '',
					name: ''
				},
				crtProvinceItem: {},
				crtCityItem: {},
				crtregionItem: {},
				cityList: [],
				provinceList: [],
				regionList: [],
				dealList: [{
					name: '123',
					address: '12312312312',
					phone: '15093186368',
					distance: '12.23'

				}, {
					name: '123',
					address: '12312312312',
					phone: '2312312',
					distance: '12.23'
				}, ]
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
				provinceIndex = provinceIndex > -1 ? provinceIndex : 0
				cityIndex = cityIndex > -1 ? cityIndex : 0
				return [provinceIndex, cityIndex]
			}
		},
		filters: {
			formatThousand(num) {
				if (num) {
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
		onLoad(options) {
			uni.setBackgroundColor({
				backgroundColor: '#F6F7F8', // 窗口的背景色为白色
			})
			if (options.currentCity) {
				this.currentCity = JSON.parse(options.currentCity)
				console.log('currentCity', this.currentCity)
			}
			this.reqProvinceCityList()
		},
		methods: {
			async bindMultiPickerChange(e) {
					console.log(e)
				let {
					detail
				} = e
				this.crtProvinceItem = this.provinceList[detail.value[0]]
				this.cityList = this.crtProvinceItem.cities
				this.crtCityItem = this.cityList[detail.value[1]] ? this.cityList[detail.value[1]] : this.cityList[
					0]
			    this.crtregionItem = this.regionList[detail.value[2]] ? this.regionList[detail.value[2]] : this.regionList[0]
			

			},

			bindMultiPickerColumnChange(e) {
				console.log(e)
				let {
					detail
				} = e
				if (detail.column == 0) {
					this.cityList = this.provinceList[detail.value].cities
				}
				
				if(detail.column == 1){
					// 城市变
				  this.crtCityItem = this.cityList[detail.value]
                  this.reqRegionByCityId(this.crtCityItem.id)
				}
				
				
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
						console.log('data :>> ', data);
					}
				} catch (error) {
					console.error(error)
				} finally {
					uni.hideLoading()
				}
			}
		}

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
