<template>
	<view>
		<userBand @loginSuccess='getStoragePhone'></userBand>
		<view class="buyOrder">
			<view class="orderHeader" v-if="products && products.name">
				<view class="name">{{products.name}}</view>
				<view class="price1">¥ </view>
				<view class="price">{{ products.price}}</view>
				<view class="stock">{{'剩余库存: ' + products.stock}}</view>

			</view>
			<view style="background:#F6F7F8 ; height: 16rpx;width: 100%;"></view>
			<image v-if="products&&products.picUrl.length>4" mode="widthFix" :src="products.picUrl" />
			<view  v-if="products&&products.picUrl.length>4" style="background:#F6F7F8 ; height: 16rpx;width: 100%;"></view>
			<view class="content">
				<view class="title">报名信息</view>
				<view class="list models">
					<view class="list-title">车型</view>
					<picker v-if="serialList.length" @change="bindMultiPickerColumnChangeser" mode="selector"
						:range="serialList" :range-key="'name'" class="select">
						<view style="width: 470rpx">{{showSerialText}}</view>
					</picker>
					<view v-else class="select place" @tap="showToast('暂无车型')">
						<view>暂无车型</view>
					</view>
					<view class="arrow"></view>
				</view>
				<view class="list models">
					<view class="list-title">城市</view>
					<picker @change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange"
						mode="multiSelector" :range="[provinceList, cities]" :range-key="'name'" class="select"
						:value="selectIndex">
						<view v-if="showProvinceCityText&&showProvinceCityText.length" style="width: 470rpx">
							{{showProvinceCityText}}</view>
						<view v-else class="place" style="width: 470rpx">请选择城市</view>
					</picker>
					<view class="arrow"></view>
				</view>
				<view class="list models">
					<view class="list-title">地区</view>
					<picker @change="bindMultiPickerColumnChangeArea" :value="selectDistrictIndex" mode="selector"
						:range="districtList" :range-key="'name'" class="select">
						<view v-if="showDistrictText&&showDistrictText.length" style="width: 470rpx">
							{{showDistrictText}}</view>
						<view v-else class="place" style="width: 470rpx">请选择地区</view>
					</picker>
					<i class="clean-btn" v-if="currentRegion.id" @tap.stop="cleanRegion"></i>
					<view class="arrow"></view>
				</view>

				<!-- 经销商 S -->
				<view class="list models">
					<view class="list-title">经销商</view>
					<block>
						<picker v-if="dealerList.length" mode="selector" @change="getDealerChangeIndex"
							:range="dealerList" :range-key="'name'" class="select" :value="selectDealerIndex">
							<view style="width: 470rpx">{{crtDealerItem.name ? crtDealerItem.name : '请选择经销商'}}</view>
						</picker>
						<view v-else class="select">
							<view v-if="showProvinceCityText&&showProvinceCityText.length" class="place"
								style="width: 470rpx">暂无对应经销商 </view>
							<view v-else class="place" style="width: 470rpx">请选择经销商</view>
						</view>
						<view class="arrow"></view>
					</block>
					<view class="arrow" v-show="currentDealer.name"></view>
				</view>


				<view class="list models" android:focusable="true" android:focusableInTouchMode="true">
					<view class="list-title">手机号</view>
					<!--  #ifndef MP-TOUTIAO  -->
					<input type="text" :always-embed="true" :value="phone" placeholder="请填写您的手机号码"
						placeholder-class="placeholder" @input="getValue('phone',$event)" maxlength="11" class="select"
						placeholder-style="color: #CCCCCC"></input>
					<!-- #endif -->
					<!--  #ifdef MP-TOUTIAO  -->
					<input type="text" :always-embed="true" :value="phone" placeholder="请授权手机号码"
						placeholder-class="placeholder" @input="getValue('phone',$event)" maxlength="11" disabled="true"
						class="select" placeholder-style="color: #CCCCCC"></input>
					<!-- #endif -->
				</view>

				<!-- <view class="list models" v-if="smsCodeShow">
					<view class="list-title">验证码</view>
					<input type="text" :always-embed="true" v-model="smsCode" placeholder="请输入验证码"
						placeholder-style="color: #CCCCCC;" placeholder-class="placeholder" class="select"></input>

					<view class="downcount" @tap="getSmsCodeClick">
						{{smsCodeText}}
					</view>

				</view> -->
				<view class="list models" v-if="smsCodeShow">
				    <view class="list-title">验证码</view>
				    <input class="select" :always-embed="true" placeholder="请输入验证码" v-model="codeNum" @input="checkInfo"/>
				    <view class="get-code" v-if="timeDownFalg" @tap="getSmsCodeClick">{{smsCodeText}}</view>
				    <view class="downcount" v-else>{{smsCodeText}}</view>
				</view>


				<view class="btn-area">
					<view class="tit">提交后经销商会尽快与您联系</view>
					<button class="btn" @tap="buyOrder" :class="{'origin':ifcanSubmit()}">立即购买</button>
				</view>
			</view>
		</view>
		<pyBoomV></pyBoomV>
	</view>
</template>

<script>
	import login from '@/units/login'
	import api from '@/public/api/index'
	import distance from '@/units/distance'
	import pyBoomV from '@/components/pyBoomV/pyBoomV'
	import pay from '@/units/pay'
	let app = getApp()
	export default {
		comments: {
			pyBoomV
		},
		data() {
			return {
				title: '报名活动',
				currentObj: {},
				from: "",
				id:'',
				serialList: [],
				provinceList: [],
				cities: [],
			    timeDownFalg: true, //验证码倒计时标识
				districtList: [],
				dealerList: [],
				crtSerialItem: {}, // 当前选择的车型
				crtProvinceItem: {}, // 当前选择的省份
				crtCityItem: {}, // 当前选择的城市
				crtDistrictItem: {}, // 当前选择的地区项
				crtDealerItem: {}, // 当前选择的经销商项
				isShowFormPop: false,
				popName: '',
				phone: "",
				isphone: false,
				name: "",
				isActLink: false,
				smsCode: "", // 验证码s
				smsCodeTime: 0, // 验证码计时
				smsCodeTimer: null, // 验证码计时器
				smsCodeText: "获取验证码", // 显示的验证码文本
				smsCodeShow: false,
				canSubmit: false,
				sourceUserId: '',
				products: {}, // 关联商品
				orderDetail: {} //当前活动订单状态
			}
		},
		watch: {
			crtSerialItem(dic) {
				this.canSubmit = this.ifcanSubmit()
			},

			crtProvinceItem(dic) {
				this.canSubmit = this.ifcanSubmit()
			},
			crtDealerItem(dic) {
				this.canSubmit = this.ifcanSubmit()
			},

			phone(phone) {
				this.canSubmit = this.ifcanSubmit()

			},
			smsCode(code) {
				this.canSubmit = this.ifcanSubmit()
				
			}
		},

		computed: {
			showSerialText() {
				let text = ''
				if (this.crtSerialItem.id) {
					text = this.crtSerialItem.name
				}
				return text
			},
			showProvinceCityText() {
				let text = ''
				if (this.crtProvinceItem.id && this.crtCityItem.id) {
					text = this.crtProvinceItem.name + ' ' + this.crtCityItem.name
				}
				return text
			},
			showDistrictText() {
				let text = ''
				if (this.crtDistrictItem.id) {
					text = this.crtDistrictItem.name
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
			},
			selectDistrictIndex() {
				let districtIndex = this.districtList.findIndex(item => item.id == this.crtDistrictItem.id)
				districtIndex = districtIndex > -1 ? districtIndex : 0
				return districtIndex
			},
			selectDealerIndex() {
				let districtIndex = this.dealerList.findIndex(item => item.id == this.crtDealerItem.id)
				districtIndex = districtIndex > -1 ? districtIndex : 0
				return districtIndex
			}
		},
		async onLoad(options) {
			if (options.scene) { // 分享海报来的
				let url = options.scene.indexOf('%') > -1 ? decodeURIComponent(options.scene) : options.scene
				url = this.changURl(url)
				let array = url.split('&')
				array.forEach((item, index) => {
					let arr = item.split('=')
					if (arr) {
						options[arr[0]] = arr[1]
					}
				})


			}
			this.id = options.activityId
			this.sourceUserId = options.sourceUserId
			await distance.getLocation()
			await login.checkLogin(api)
			this.getData()

		},
		async onShow() {
			if(this.id){
				let {
					data = {}
				} = await api.getActivityContent(this.id)
							
				let clueInfo = await api.getClueInfo({
					activityId: this.id
				})
				if (clueInfo.code == 1) this.orderDetail = clueInfo.data.orderDetail
							
				this.currentObj = data
				if (data.products) {
					this.products = data.products[0]
				}
			}	
			
			
			// console.log('asdhiashih', this.products,this.products.picUrl.length>0,this.products.picUrl.indexOf('http')!=-1)
		},

		methods: {
			async getData() {
				try {
					uni.showLoading({
						title: '正在加载...'
					})
					let {
						data = {}
					} = await api.getActivityContent(this.id)

					let clueInfo = await api.getClueInfo({
						activityId: this.id
					})
					if (clueInfo.code == 1) this.orderDetail = clueInfo.data.orderDetail

					this.currentObj = data
					if (data.products) {
						this.products = data.products[0]
					}
					this.serialList = this.currentObj.serialGroupList

					if (this.content && this.content.miniUrl && this.content.miniUrl.indexOf('dDis=1') != -1 && !this
						.sourceUserId) {
						// dDis=1 且不是裂变进来的（sourceUserId为空） 就不随机经销商
						console.log('不定位经销商', this.content.miniUrl.indexOf('dDis=1' != -1))
						this.content.noDistanceDeal = true
					}
					if (this.content && this.content.miniUrl && this.content.miniUrl.indexOf('dSer=1') != -1) {
						console.log('不自动车车系')
						this.content.noSer = true
					}
					if (this.currentObj && this.currentObj.noSer) {
						// 不自动选车型
					} else {
						this.crtSerialItem = this.serialList.length ? this.serialList[0] : {}
					}
					await this.reqProvincecities()
					this.getpreClue()
				} catch (err) {
					console.error(err)
				} finally {
					uni.hideLoading()
				}
			},
			// 获取验证码被点击
			getSmsCodeClick() {
				if (!/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(this.phone)) {
					uni.showToast({
						title: "请输入正确的手机号码",
						icon: "none"
					})
					return
				}

				if (this.smsCodeTime > 0) {
					return
				}

                this.timeDownFalg = false
				this.smsCodeTime = 60
				this.smsCodeText = this.smsCodeTime + 's'
				this.reqCode()
			},
			// 验证码倒计时
			smsCodeCD() {
				this.smsCodeTimer = setTimeout(() => {
					this.smsCodeTime--
					this.smsCodeText = this.smsCodeTime + 's'
					if (this.smsCodeTime <= 0) {
						this.timeDownFalg = true
						this.smsCodeText = '重新发送'
						clearTimeout(this.smsCodeTimer)
					} else {
						this.smsCodeCD()
					}
				}, 1000)
			},
			getDealerChangeIndex(e) {
				let {
					detail
				} = e
				this.crtDealerItem = this.dealerList[detail.value]
			},
			bindMultiPickerColumnChangeser(e) {
				let {
					detail
				} = e
				this.crtSerialItem = this.serialList[detail.value]
				this.reqDealerListByCityId(this.crtCityItem.id, this.crtDistrictItem.id)
			},
			bindMultiPickerColumnChangeArea(e) {
				let {
					detail
				} = e
				this.crtDistrictItem = this.districtList[detail.value]
				this.reqDealerListByCityId(this.crtCityItem.id, this.crtDistrictItem.id)
			},
			bindMultiPickerChange(e) {
				console.log(e)
				let {
					detail
				} = e
				this.crtProvinceItem = this.provinceList[detail.value[0]]
				this.cities = this.crtProvinceItem.cities
				this.crtCityItem = this.cities[detail.value[1]] ? this.cities[detail.value[1]] : this.cities[0]
				this.reqDistrictListByCityId(this.crtCityItem.id)
				this.reqDealerListByCityId(this.crtCityItem.id)
			},
			bindMultiPickerColumnChange(e) {
				let {
					detail
				} = e
				if (detail.column == 0) {
					this.cities = this.provinceList[detail.value].cities
				}
			},
			getValue(name, e) {
				let {
					detail: {
						value
					}
				} = e
				if (name == 'name') {
					this.name = value
				} else {
					this.phone = value
					if (this.phone.length == 11 && this.phone != uni.getStorageSync('userPhone')) {
						this.smsCodeShow = true
					} else {
						this.smsCodeShow = false
					}


				}

			},
			ifcanSubmit() {
				let isphone = this.isPoneAvailable(this.phone)
				if (!this.crtSerialItem.id) {
					// this.showToast('请选择车型')
					return false
				}
				if (!this.crtProvinceItem.id) {
					// this.showToast('请选择省份')
					return false
				}
				// if (!this.crtCityItem.id) {
				// 	this.showToast('请选择城市')
				// 	return false
				// }
				if (!isphone) {
					// this.showToast('请输入正确手机号')
					return false
				}
				if (!this.crtDealerItem.id) {
					// this.showToast('请选择经销商')
					return false
				}

				if (!this.products || this.products.stock <= 0) {
					//当前没有库存了
					return false
				}

				if ((this.phone.length == 11 && this.phone != uni.getStorageSync('userPhone') && this.smsCode) || this
					.phone == uni.getStorageSync('userPhone')) {
					return true
				} else {
					return false
				}
				return true
			},

			toMyPage() {
				let url = '/pages/myCoupon'
				uni.navigateTo({
					url
				})
			},
			isPoneAvailable(phoneNumber) {
				var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
				if (!myreg.test(phoneNumber)) {
					return false;
				} else {
					return true;
				}
			},
			showToast(title = "", duration = 1500) {
				this.$toast(title, 'none', duration);
			},
			// 请求省份和城市的级联列表
			async reqProvincecities() {
				try {
					const res = await api.fetchProvinceCityList()
					if (res.code == 1) {
						this.provinceList = res.data
						console.log(this.provinceList)
						if (this.provinceList && this.provinceList.length) {
							this.cities = this.provinceList[0].cities
						}

					}
				} catch (err) {
					this.$toast('获取省份和城市信息失败', 'none', 1500);
					console.error(err)
				}

			},
			async getpreClue() {
				// 手机号码
				this.phone = uni.getStorageSync('userPhone');
				if (this.phone && this.isPoneAvailable(this.phone)) {
					this.smsCodeShow = false
				} else {
					this.smsCodeShow = true
				}


				// 省市区 经销商
				let currentLocation = app.globalData.currentLocation
				let ifding = true
				if (currentLocation.wxPosition.provider && currentLocation.wxPosition.provider == 'default') {
					// 没有开启定位不出默认
					ifding = false
				}
				if (currentLocation && ifding) {
					if (this.currentObj && this.currentObj.noDistanceDeal) {
						// 子维要求有这个参数 就一直出定位
						console.log('currentLocation', currentLocation)
						const crtLocationProvinceItem = this.provinceList.find(item => item.name.replace('省', '')
							.replace(
								'市', '') == currentLocation.cityData.pro.replace('省', '').replace('市', ''))
						if (crtLocationProvinceItem) {
							const crtLocationCityItem = crtLocationProvinceItem.cities.find(item => item.name.replace(
								'市', '') == currentLocation.cityData.city.replace('市', ''))
							this.crtProvinceItem = crtLocationProvinceItem
							this.cities = this.crtProvinceItem.cities
							this.crtCityItem = crtLocationCityItem
							console.log(this.crtProvinceItem.name, this.crtCityItem.name)
							this.reqDistrictListByCityId(this.crtCityItem.id)
							this.reqDealerListByCityId(this.crtCityItem.id)
						}
					} else {
						console.log('currentLocation', currentLocation)
						const crtLocationProvinceItem = this.provinceList.find(item => item.name.replace('省', '')
							.replace(
								'市', '') == currentLocation.selectedCityData.pro.replace('省', '').replace('市', ''))
						if (crtLocationProvinceItem) {
							const crtLocationCityItem = crtLocationProvinceItem.cities.find(item => item.name.replace(
								'市', '') == currentLocation.selectedCityData.city.replace('市', ''))
							this.crtProvinceItem = crtLocationProvinceItem
							this.cities = this.crtProvinceItem.cities
							this.crtCityItem = crtLocationCityItem
							console.log(this.crtProvinceItem.name, this.crtCityItem.name)
							this.reqDistrictListByCityId(this.crtCityItem.id)
							this.reqDealerListByCityId(this.crtCityItem.id)
						}
					}
				}
				this.isShowFormPop = true
			},
			// 发送验证码
			async reqCode() {
				try {
					const res = await api.fetchCode({
						mobile: this.phone
					})
					if (res.code == 1) {
						this.showToast('发送验证码成功')
						this.smsCodeCD()
					} else {
						this.showToast(res.msg)
					}
				} catch (err) {
					this.showToast('发送验证码失败')
					console.error(err)
				}
			},
			// 根据城市id请求地区
			async reqDistrictListByCityId(cityId) {
				this.districtList = []
				this.crtDistrictItem = {}
				try {
					const res = await api.fetchDistrictListByCityId({
						cityId
					})
					if (res.code == 1) {
						this.districtList.push(...res.data)
						console.log('this.districtList', this.districtList)
						let num = Math.floor(Math.random() * (this.districtList.length))
						if (this.currentObj && this.currentObj.noDistanceDeal) {
							// 不根据位置出经销商 随机城市下面的一家，所以先不出地区
							console.log('随机出区', num)
						} else {
							// 根据定位出区
							let currentLocation = app.globalData.currentLocation
							if (currentLocation) {
								let cityData = currentLocation.cityData
								// console.log('cityData',cityData,currentLocation.selectedCityData)
								let regionShow = true
								if (currentLocation.selectedCityData.isChange) { // 改过
									if (cityData.city.replace('市', '') != currentLocation.selectedCityData.city
										.replace('市', '')) { // 切改了城市不同了
										regionShow = false
									}
								}
								if (regionShow) { //要根据定位出区域
									let index = this.districtList.findIndex(item => item.name.replace('区', '').replace(
										'县', '').replace('市', '') == cityData.region.replace('区', '').replace(
										'县', '').replace('市', ''))
									console.log('匹配到了', index)
									if (index != -1) {
										num = index
									}
								}
							}
						}
						this.crtDistrictItem = this.districtList[num]
						console.log('this.crtDistrictItem', this.crtDistrictItem, this.districtList, num)
						this.reqDealerListByCityId(this.crtCityItem.id, this.crtDistrictItem.id)

					}
				} catch (err) {
					this.showToast('获取地区信息失败')
					console.error(err)
				}
			},
			// 根据城市id请求经销商
			async reqDealerListByCityId(cityId = '', districtId = '') {
				// this.dealerList = []
				// this.crtDealerItem = {}
				try {
					let pcSerialGroupId = this.crtSerialItem.pcSerialGroupId
					if (!pcSerialGroupId) {
						return
					}
					const res = await api.fetchDealerListByCityId({
						cityId,
						districtId,
						pcSerialGroupId
					})
					if (res.code == 1) {
						if (this.currentObj && this.currentObj.noDistanceDeal) {
							this.dealerList = res.data
							if (this.dealerList && this.dealerList.length) {
								console.log('经销商随机数', this.dealerList.length, Math.floor(Math.random() * this
									.dealerList.length))
								this.crtDealerItem = this.dealerList[Math.floor(Math.random() * this.dealerList
									.length)]
							}
						} else {
							this.dealerList = distance.sortDealersByDistance(res.data)
							if (this.dealerList && this.dealerList.length) {
								this.crtDealerItem = this.dealerList[0]
							}
						}
					}
				} catch (err) {
					this.showToast('获取经销商信息失败')
					console.error(err)
				}
			},
			async buyOrder() {



              if (!this.products || this.products.stock <= 0) {
				 this.$toast('商品太火爆，被抢完了')
				}
				if (!this.ifcanSubmit()) {
					return
				}

				if (this.from == 'activity') {
					// #ifdef MP-WEIXIN
					wx.aldstat.sendEvent('报名活动留资提交')
					// #endif	

				}
				let ly = this.from
				let lydx = this.currentObj
				let source, sourceId
				console.log('省份', this.crtProvinceItem)
				console.log('城市', this.crtCityItem)
				console.log('车型', this.crtSerialItem)
				console.log('来源', ly)
				console.log('来源对象', lydx)
				source = 1
				sourceId = lydx.id
				let pam = {
					mobile: this.phone,
					name: this.name,
					cityId: this.crtCityItem.id,
					serialGroupId: this.crtSerialItem.pcSerialGroupId,
					source: source,
					sourceId: sourceId,
					dealerId: this.crtDealerItem.id,
					areaId: this.crtDistrictItem.id,
					provinceId: this.crtProvinceItem.id,
					smsCode: this.smsCode,

				}
				console.log(this.sourceUserId)
				if (this.sourceUserId && this.sourceUserId != 'undefined' && this
					.sourceUserId != 0) {
					pam.sourceUserId = this.sourceUserId
				}
				console.log('留资参数', pam)
				let data = await api.submitClue(pam)

				if (data.code == 1) {
					// 留资成功 吊起支付
					this.pay()
				} else if (data.code == 2) {
					// 重复留资了
					this.pay()
				} else {
					this.showToast(data.msg)
				}

				console.log(data)
			},
			// 生成订单支付  先查询商品剩余数量 - 查留资信息 - 生成订单  - 支付   活动id  
			async pay() {

			  await	pay.pay(this.id)
			  setTimeout(()=>{
				// 延时
				this.getData()   
			  },1100)
			
			  

				// let {
				//  	data = {}
				//  } = await api.getActivityContent(id)
				//  if(products.stock<=0){
				// 	 this.$toast('商品太火爆，被抢完了')
				// 	 return
				//  }
				//    // 留资成功生成订单
				//  let clueInfo = await api.getClueInfo({
				//  	activityId: id
				//  })
				//  let clueDetail
				//  if (clueInfo.code == 1)  clueDetail = clueInfo.data.clueDetail

				//  // yuchen 测试
				//  // api.preOrderBack({"op":3,"id":clueInfo.data.orderDetail.orderId})

				//  //0待支付 1已支付 2待使用 3退款审核中 4已核销 5已退款 6已失效
				//  if(clueInfo.code == 1 && clueInfo.orderDetail && clueInfo.orderDetail.orderId && (clueInfo.orderDetail.orderStatus != 0 || clueInfo.orderDetail.orderStatus != 6|| clueInfo.orderDetail.orderStatus != 5)){
				//  	// 说明有在进行中的到查看订单
				// 	this.$toast('已有支付订单,请勿重复操作')
				// 	uni.navigateTo({
				// 	  url: `/pages/orderDetail?id=${this.content.id}`
				// 	})
				// 	return
				//  }
				//  console.log('clueDetail',clueDetail)
				//  if(!clueDetail){
				// 	 console.log('订单生成失败')
				// 	 this.$toast(clueInfo.msg)
				//      return	 
				//  }
				// 	let data1 =  await api.preOrder({"clueId":clueDetail.clueId})
				// 	if (data1.code = 1 &&  data1.data){
				// 		let order = data1.data
				// 		let that = this
				// 		uni.requestPayment({
				// 			provider: 'wxpay', // 平台
				// 			timeStamp: order.timeStamp, // 时间戳
				// 			nonceStr: order.nonceStr, // 随机字符串
				// 			package: order.package, //  统一下单接口返回的 prepay_id 参数值
				// 			signType: order.signType, // 签名算法，暂支持 MD5。
				// 			paySign: order.paySign, // 签名
				// 			success: function(res) {
				// 				console.log('success:' + JSON.stringify(res));

				// 				api.preOrderBack({"op":1,"id":order.orderId})
				// 				uni.navigateTo({
				// 				  url: `/pages/orderDetail?id=${order.orderId}&pay=1`
				// 				})
				// 				that.$toast('支付成功')
				// 			},
				// 			fail: function(err) {
				// 				console.log('fail:' + JSON.stringify(err));
				// 				api.preOrderBack({"op":3,"id":order.orderId})
				// 				that.$toast('支付失败请稍后重试')
				// 				uni.navigateTo({
				// 				  url: `/pages/orderDetail?id=${order.orderId}&pay=0`
				// 				})
				// 			},
				// 			complete: () => {
				// 				console.log("payment结束")
				// 			}
				// 		});

				// 	}else{
				// 		this.$toast(data.msg)
				// 	}


			}


		}
	}
</script>


<style lang="scss" scoped>
	.no-data {
		padding: 32rpx 0;
		text-align: center;
	}

	.buyOrder {
		image {
			width: 100%;
			vertical-align: middle;
		}

		.orderHeader {
			margin: 32rpx;

			.name {
				font-size: 40rpx;
				font-weight: 800;
				text-align: left;
				color: #333333;
			}

			.price {
				margin-top: 30rpx;
				display: inline;
				font-size: 48rpx;
				font-weight: 800;
				text-align: left;
				color: #fa8845;
			}

			.price1 {
				margin-top: 30rpx;
				display: inline;
				font-size: 38rpx;
				font-weight: 800;
				text-align: left;
				color: #fa8845;
			}

			.stock {
				display: inline;
				font-size: 24rpx;
				font-weight: 500;
				text-align: left;
				color: #999999;
				margin-left: 40rpx;
			}



		}

		.content {

			padding: 32rpx 32rpx 10rpx;
			box-sizing: border-box;

			.place {
				color: #CCCCCC;
			}

			.getPhoneBtn {
				background-color: transparent;
				color: #777777;
				flex: 1;
				margin-left: 20rpx;
				height: 100%;
				display: flex;
				align-items: center;
				font-size: 34rpx;
			}

			.title {
				font-size: 40rpx;
				font-weight: 800;
			}

			.list {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 110rpx;
				border-bottom: 2rpx solid #EBEBEB;

				.list-title {
					width: 130rpx;
				}

				.select {
					flex: 1;
					margin-left: 20rpx;
					height: 100%;
					display: flex;
					align-items: center;
					margin-right: 80rpx;
					font-size: 34rpx;
				}

				.get-code {
					color: #fa8943;
					font-size: 26rpx;
				}

				.downcount {
					color: #999999;
					font-size: 28rpx;
				}

				.arrow {
					width: 12rpx;
					height: 12rpx;
					transform: rotate(45deg);
					border-top: 2rpx solid #999999;
					border-right: 2rpx solid #999999;
				}

				.clean-btn {
					width: 40rpx;
					height: 40rpx;
					background-image: url("../static/images/close_btn.png");
					background-color: #999999;
					border-radius: 50%;
					background-size: cover;
					margin-right: 20rpx;
				}
			}

			.btn-area {
				text-align: center;
				margin-top: 24rpx;

				.tit {
					color: #999999;
					font-size: 24rpx;
					margin: 24rpx 0;
				}

				.btn {
					height: 88rpx;
					border-radius: 88rpx;
					line-height: 88rpx;
					color: #ffffff;
					background-color: #cdcdcd;
					font-size: 32rpx;

					&.origin {
						background-color: #fa8943;
					}
				}
			}
		}
	}
</style>
