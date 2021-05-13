<template>
	<view class="formpop" v-if="isShowFormPop">
		<view class="form" v-if="popName == 'form'">
			<view class="header">
				<view class="p1">{{title}}</view>
				<view class="p2">为了给您提供更好的服务，请完善基础信息</view>
			</view>
			<view class="content">
				<picker @change="bindMultiPickerColumnChangeser" mode="selector" :range="serialList" :range-key="'name'" class="input-view auto-input">
					<view>{{serialList[indexSerial].name}}</view>
				</picker>
				<picker @change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange" mode="multiSelector" :range="[provinceList, cityList]"
				 :range-key="'name'" :class="'input-view city-input ' + (showProvinceCityText == '请选择' ? 'placeholder':'')" :value="selectIndex">
					<view>{{showProvinceCityText}}</view>
				</picker>
				<picker @change="bindMultiPickerColumnChangeArea" mode="selector" :range="districtList" :range-key="'name'" :class="'input-view area-input ' + (showDistrictText == '请选择您的地区' ? 'placeholder':'')">
					<view>{{showDistrictText}}</view>
				</picker>
				<picker mode="selector" @change="getDealerChangeIndex" :range="dealerList" :range-key="'dealerName'"
				 :class="'input-view dealer-input jt-icon ' + (!dealerList[currentDealerIndex] ? 'placeholder':'')">
					<view>{{dealerList[currentDealerIndex] ? dealerList[currentDealerIndex].dealerName : '请选择经销商'}}</view>
				</picker>
				<view class="input-view mobile-input name-input">
					<input type="text" @input="getValue('name',$event)" :value="name" placeholder="请填写您的姓名" placeholder-class="placeholder"></input>
				</view>
				<view class="input-view mobile-input">
					<input type="text" :value="phone" :disabled="isphone ? true :false" placeholder="请填写您的手机号码" placeholder-class="placeholder"
					 @input="getValue('phone',$event)" maxlength="11"></input>
				</view>
				<view class="btn" @tap="submit">提交</view>
				<view v-if="isActLink" class="reminder">提交成功可抽奖</view>
				<view class="close-btn-bd" @tap="formHide"></view>
			</view>
		</view>
		<!-- 失败 -->
		<view class="form-sb-pop" v-if="popName == 'form-sb-pop'">
			<view class="sb-icon"></view>
			<view class="p1">提交失败</view>
			<view class="p2">请稍后再试</view>
			<view class="close-btn2" @tap="formHide">我知道了</view>
		</view>
		<!-- 重复 -->
		<view class="form-warning-pop" v-if="popName == 'form-warning-pop'">
			<view class="warning-icon"></view>
			<view class="p1">您已报名</view>
			<text class="p2">工作人员会尽快与您电话联系\n请保持电话畅通</text>
			<view class="close-btn2" @tap="formHide">我知道了</view>
		</view>
		<!-- 成功 -->
		<view class="form-success-pop" v-if="popName == 'form-success-pop'">
			<view class="success-icon"></view>
			<view class="p1">报名成功</view>
			<text class="p2">工作人员会尽快与您电话联系\n请保持电话畅通</text>
			<view class="close-btn2" @tap="formHide">我知道了</view>
		</view>
		<!--  -->
		<view class="coupon-sb-pop" v-if="popName == 'coupon-sb-pop'">
			<view class="sb-icon"></view>
			<view class="p1">领取失败</view>
			<view class="p2">请稍后再试</view>
			<view class="close-btn2" @tap="formHide">我知道了</view>
		</view>
		<!--  -->
		<view class="coupon-warning-pop" v-if="popName == 'coupon-warning-pop'">
			<view class="warning-icon"></view>
			<view class="p1">您已领取过优惠券</view>
			<text class="p2">请到【我的-我的优惠券】查看</text>
			<view class="look-coupon-btn" @tap="toMyPage">查看优惠券</view>
			<view class="close-btn-bd2" @tap="formHide"></view>
		</view>
		<!--  -->
		<view class="coupon-success-pop" v-if="popName == 'coupon-success-pop'">
			<view class="success-icon"></view>
			<view class="p1">领取成功</view>
			<text class="p2">请到【我的-我的优惠券】查看</text>
			<view class="look-coupon-btn" @tap="toMyPage">查看优惠券</view>
			<view class="close-btn-bd2" @tap="formHide"></view>
		</view>
	</view>
</template>

<script>
	import api from '@/public/api/index'
	let app = getApp()
	export default {
		data() {
			return {
				dealerList: [],
				currentDealerIndex: 0,
				title: '完善资料',
				currentObj: {},
				from: "",
				serialList: [],
				indexSerial: "0",
				provinceList: [],
				cityList: [],
				districtList: [],
				crtProvinceItem: {}, // 当前选择的省份
				crtCityItem: {}, // 当前选择的城市
				crtDistrictItem: {}, // 当前选择的地区项
				indexCity: "",
				isShowFormPop: false,
				popName: '',
				phone: "",
				isphone: false,
				name: "",
				isName: "",
				isActLink: false
			}
		},
		computed: {
			showProvinceCityText () {
				let text = '请选择'
				if (this.crtProvinceItem.id && this.crtCityItem.id) {
					text = this.crtProvinceItem.name + ' ' + this.crtCityItem.name
				}
				return text 
			},
			showDistrictText () {
				let text = '请选择您的地区'
				if (this.crtDistrictItem.id) {
					text = this.crtDistrictItem.name
				}
				return text
			},
			selectIndex () {
				let provinceIndex = this.provinceList.findIndex(item => item.id == this.crtProvinceItem.id)
				let cityIndex = this.cityList.findIndex(item => item.id == this.crtCityItem.id)
				provinceIndex = provinceIndex > -1 ? provinceIndex : 0
				cityIndex = cityIndex > -1 ? cityIndex : 0
				return [provinceIndex, cityIndex]
			},
		},
		methods: {
			formShow(name, from = "", obj = {}, title) {
				this.popName = name
				this.from = from
				this.currentObj = obj
				this.title = title
				this.getpreClue()
			},
			formHide() {
				this.isShowFormPop = false
			},
			getDealerChangeIndex(e) {
				let {
					detail
				} = e
				this.currentDealerIndex = detail.value
			},
			bindMultiPickerColumnChangeser(e) {
				let {
					detail
				} = e
				this.indexSerial = detail.value
			},
			bindMultiPickerColumnChangeArea(e) {
				let {
					detail
				} = e
				this.crtDistrictItem = this.districtList[detail.value]
			},
			bindMultiPickerChange(e) {
				console.log(e)
				let {
					detail
				} = e
				this.crtProvinceItem = this.provinceList[detail.value[0]]
				this.crtCityItem = this.cityList[detail.value[1]]
				this.reqDistrictListByCityId(this.crtCityItem.id)
			},
			bindMultiPickerColumnChange(e) {
				let {
					detail
				} = e
				if (detail.column == 0) {
					this.reqCityListByProvinceId(this.provinceList[detail.value].id)
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
				}

			},
			async submit() {
				let chexi = this.serialList[this.indexSerial]
				let ly = this.from
				let lydx = this.currentObj
				let source, sourceId
				console.log('省份', this.crtProvinceItem)
				console.log('城市', this.crtCityItem)
				console.log('车系', chexi)
				console.log('来源', ly)
				console.log('来源对象', lydx)
				if (ly == 'coupon') {
					source = 0
					sourceId = lydx.id
				} else if (ly == 'activity') {
					source = 1
					sourceId = lydx.id
				} else if (ly == 'serial') {
					source = 2
					sourceId = chexi.serialGroupId
				} else if (ly == 'dealer') {
					source = 3
					sourceId = lydx.id || lydx.dealerId
				}
				let isphone = this.isPoneAvailable(this.phone)
				if (!chexi.serialGroupId) {
					this.showToast('请选择车系')
					return false
				}
				if (!this.crtProvinceItem.id) {
					this.showToast('请选择省份')
					return false
				}
				if (!this.crtCityItem.id) {
					this.showToast('请选择城市')
					return false
				}
				if (!isphone) {
					this.showToast('请输入正确手机号')
					return false
				}
				if (!this.dealerList[this.currentDealerIndex]) {
					this.showToast('请选择经销商')
					return
				}
				let data = await api.submitClue({
					mobile: this.phone,
					name: this.name,
					regionId: this.crtCityItem.id,
					serialGroupId: chexi.serialGroupId,
					source: source,
					sourceId: sourceId,
					dealerId: this.dealerList[this.currentDealerIndex].dealerId,
					areaId: this.crtDistrictItem.id
				})
				let popname
				if (data.code == 1) { //成功留资
					if (ly == 'coupon') {
						popname = 'coupon-success-pop'
					} else if (lydx.duibaUrl && ly == 'activity') { //如果有活动链接
						this.showToast('报名成功', 500)
						setTimeout(() => {
							this.towebView2()
						}, 500)

					} else {
						popname = 'form-success-pop'
					}
				} else if (data.code == 2) { //重复留资
					if (ly == 'coupon') {
						popname = 'coupon-warning-pop'
					} else if (lydx.duibaUrl && ly == 'activity') { //如果有活动链接
						this.showToast('您已留过资，可直接抽奖', 500)
						setTimeout(() => {
							this.towebView2()
						}, 500)
					} else {
						popname = 'form-warning-pop'
					}
				} else {
					if (ly == 'coupon') {
						popname = 'coupon-sb-pop'
					} else {
						popname = 'form-sb-pop'
					}
				}
				this.popName = popname

				console.log(data)
			},
			toMyPage() {
				let url = '/pages/my'
				uni.navigateTo({
					url
				})
			},
			towebView2() {
				this.isShowFormPop = false
				if (this.currentObj.duibaUrl) {
					let redirect = {
						'redirect': this.currentObj.duibaUrl
					}
					api.getMallLink(redirect).then(res => {
						let vurl = escape(res.data)
						let url = `/pages/webview?webURL=${vurl}`
						uni.navigateTo({
							url
						})
						console.log('MallLink', res)
					})
				} else {
					api.getMallLink().then(res => {
						let vurl = escape(res.data)
						let url = `/pages/webview?webURL=${vurl}`
						uni.navigateTo({
							url
						})
						console.log('MallLink', res)
					})
				}

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
			async getpreClue() {
				let source = 3
				let sourceId = 10086
				let currentLocation = app.globalData.currentLocation
				console.log('currentLocation==========',currentLocation)
				if (this.from == 'coupon') {
					source = 0
					sourceId = this.currentObj.id
				} else if (this.from == 'activity') {
					source = 1
					sourceId = this.currentObj.id
					if (this.currentObj.duibaUrl) {
						this.isActLink = true
					}
				} else if (this.from == 'serial') {
					source = 2
					sourceId = this.currentObj.serialGroupId
				} else {
					sourceId = this.currentObj.id || this.currentObj.dealerId
				}
				let query = {
					source,
					sourceId,
					regionId: currentLocation.cityData.cityId
				}
				if (!currentLocation.wxPosition.wsq) {
					query.latitude = currentLocation.wxPosition.latitude
					query.longitude = currentLocation.wxPosition.longitude
				}
				let {
					data
				} = await api.getpreClue(query)
				if (data == null || !data) {
					data = {}
				}
				this.phone = data.mobile
				console.log('phone', this.phone)
				this.isphone = this.phone
				this.name = data.userName
				this.isName = this.name
				//   经销商选择
				console.log('preClue-data', data) 
				{
					if (data.dealerList) {
						this.dealerList = data.dealerList
					} else {
						this.isDealerList()
					}
				}
				if (!data.serialGroupList || data.serialGroupList.length == 0) {
					this.getJson()
					return false
				}
				//   车系选择
				for (let i in data.serialGroupList) {
					let obj = data.serialGroupList[i]
					obj.name = obj.serialGroupName
				}
				this.serialList = data.serialGroupList
				// 省市
				if (currentLocation) {
					await this.reqProvinceList()
					const crtLocationProvinceItem = this.provinceList.find(item => item.id == currentLocation.cityData.proId)
					if (crtLocationProvinceItem) {
						await this.reqCityListByProvinceId(crtLocationProvinceItem.id)
						const crtLocationCityItem = this.cityList.find(item => item.id == currentLocation.cityData.cityId) 
						if (crtLocationCityItem) {
							this.crtProvinceItem = crtLocationProvinceItem
							this.crtCityItem = crtLocationCityItem
							this.reqDistrictListByCityId(this.crtCityItem.id)
						}
					}
				}
				this.isShowFormPop = true
			},
			toFirst(list, index) {
				return list.unshift(list.splice(index, 1)[0])
			},
			async getJson() { //默认数据
				//   获取车系
				api.getAutoSerialList().then(res => {
					console.log('this.currentObj', this.currentObj)
					let {
						data
					} = res
					if (this.from == 'serial') { //默认选中车系
						let index
						for (let i in data) {
							if (this.currentObj.serialGroupId == data[i].serialGroupId) {
								index = i
							}
						}
						let vdata = [...data]
						this.toFirst(vdata, index)
						this.serialList = vdata
					} else {
						this.serialList = data
					}
				})
				this.isShowFormPop = true
			},
			async getFormDealer(ff = false) {
				let cityCode = this.province[1][this.indexCity[1]].regionId
				let wxPosition = app.globalData.currentLocation.wxPosition
				let cs = {
					regionId: cityCode
				}
				if (!wxPosition.wsq) {
					cs.latitude = wxPosition.latitude
					cs.longitude = wxPosition.longitude
				}
				let {
					data
				} = await api.getFormDealer(cs)
				this.currentDealerIndex = 0
				this.dealerList = data
				this.isDealerList('该地区没有经销商，请切换地区')

			},
			isDealerList(text = '该城市没有经销商，请切换城市') {
				if (this.dealerList.length == 0) {
					this.showToast(text)
				}
			},
			// 请求所有的省份
			async reqProvinceList () {
				try {
					const res = await api.fetchProvinceList()
					if (res.code == 1) {
						this.provinceList = res.data
					}
				} catch(err) {
					this.showToast('获取省份信息失败')
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
					this.showToast('获取城市信息失败')
					console.error(err)
				}
			},
			// 根据城市id请求地区
			async reqDistrictListByCityId (cityId) {
				this.districtList = []
				try {
					const res = await api.fetchDistrictListByCityId({cityId})
					if (res.code == 1) {
						this.districtList = res.data
						this.crtDistrictItem = {}
					}
				} catch (err) {
					this.showToast('获取地区信息失败')
					console.error(err)
				}
			}
		}
	}
</script>

<style lang="less">
	@import '@/static/less/formpop.less';

	.reminder {
		color: #f98100;
		font-size: 24rpx;
		text-align: center;
		margin-top: 20rpx;
		line-height: 1;
	}
</style>
