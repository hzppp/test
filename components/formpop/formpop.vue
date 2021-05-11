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
				<picker @change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange" mode="multiSelector" :range="province"
				 :range-key="'text'" :class="'input-view city-input ' + (showCityText == '请选择' ? 'placeholder':'')">
					<view>{{showCityText}}</view>
				</picker>
				<picker @change="bindMultiPickerColumnChangeArea" mode="selector" :range="areaList" :range-key="'areaName'" :class="'input-view area-input ' + (areaList[indexarea].areaName == '请选择您的地区' ? 'placeholder':'')">
					<view>{{areaList[indexarea].areaName}}</view>
				</picker>
				<picker v-if="dealerList.length > 0" mode="selector" @change="getDealerChangeIndex" :range="dealerList" :range-key="'dealerName'"
				 :class="'input-view dealer-input jt-icon ' + (dealerList[currentDealerIndex].dealerId < 1 ? 'placeholder':'')">
					<view>{{dealerList[currentDealerIndex].dealerName}}</view>
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
			<text class="p2">工作人员会尽快与您电话联系\n请留意接听电话</text>
			<view class="close-btn2" @tap="formHide">我知道了</view>
		</view>
		<!-- 成功 -->
		<view class="form-success-pop" v-if="popName == 'form-success-pop'">
			<view class="success-icon"></view>
			<view class="p1">报名成功</view>
			<text class="p2">工作人员会尽快与您电话联系\n请留意接听电话</text>
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
			<text class="p2">请到我的优惠券查看</text>
			<view class="look-coupon-btn" @tap="toMyPage">查看优惠券</view>
			<view class="close-btn-bd2" @tap="formHide"></view>
		</view>
		<!--  -->
		<view class="coupon-success-pop" v-if="popName == 'coupon-success-pop'">
			<view class="success-icon"></view>
			<view class="p1">领取成功</view>
			<text class="p2">请到我的优惠券查看</text>
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
				province: [
					[],
					[]
				],
				indexCity: "",
				indexarea: "0",
				areaList: [{
					areaName: "请选择您的地区"
				}],
				showCityText: "请选择",
				isShowFormPop: false,
				popName: '',
				phone: "",
				isphone: false,
				name: "",
				isName: "",
				isActLink: false
			}
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
				this.indexarea = detail.value
				// console.log('this.indexarea', this.areaList[this.indexarea].areaId)
				this.getFormDealer(true)
			},
			bindMultiPickerChange(e) {
				console.log(e)
				let {
					detail
				} = e
				detail.value[0] = detail.value[0] || 0
				detail.value[1] = detail.value[1] || 0
				this.indexCity = detail.value
				this.showCityText = this.province[0][detail.value[0]].text + ' ' + this.province[1][detail.value[1]].text
				this.getArea()
				this.getFormDealer()
			},
			bindMultiPickerColumnChange(e) {
				let {
					detail
				} = e
				if (detail.column == 0) {
					let index = this.province[0][detail.value]
					if (this.from == 'coupon' || this.from == 'activity') {
						this.fsetcity(detail.value)
					} else {
						this.getCity(index.provinceId)
					}

				}
			},
			getValue(name, e) {
				let {
					detail: {
						value
					}
				} = e
				// console.log('getValue============',name)
				// console.log(value)
				if (name == 'name') {
					this.name = value
				} else {
					this.phone = value
				}

			},
			async submit() {
				let sf = this.province[0][this.indexCity[0]]
				let cs = this.province[1][this.indexCity[1]]
				let dq = this.areaList[this.indexarea]
				let chexi = this.serialList[this.indexSerial]
				let ly = this.from
				let lydx = this.currentObj
				let source, sourceId
				console.log('省份', sf)
				console.log('城市', cs)
				console.log('地区', dq)
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
					//   sourceId = lydx.serialGroupId
					sourceId = chexi.serialGroupId
				} else if (ly == 'dealer') {
					source = 3
					sourceId = lydx.id || lydx.dealerId
				}
				let isphone = this.isPoneAvailable(this.phone)
				if (!isphone) {
					//   console.log('请输入正确手机号')
					this.showToast('请输入正确手机号')
					return false
				}
				if (!this.name) {
					//   console.log('请输入姓名')
					//   this.showToast('请输入姓名')
					//   return false
				}
				if (!cs) {
					//   console.log("请选择城市")
					this.showToast('请选择城市')
					return false
				}
				if (!chexi.serialGroupId) {
					//   console.log('请选择车系')
					this.showToast('请选择车系')
					return false
				}
				console.log('this.dealerList', this.dealerList)
				let dealerId
				if (this.dealerList.length == 0) {
					dealerId = ''
				} else {
					dealerId = this.dealerList[this.currentDealerIndex].dealerId
				}
				let data = await api.submitClue({
					mobile: this.phone,
					name: this.name,
					regionId: cs.regionId,
					serialGroupId: chexi.serialGroupId,
					source: source,
					sourceId: sourceId,
					dealerId: dealerId,
					areaId: dq.areaId
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
				/*
				{
				    mobile:this.phone,
				    name:"xxx",
				    regionId:"",
				    serialGroupId:"",
				    source:"",//留资来源,0优惠券,1活动报名,2车系页询价,3经销商询价
				    sourceId:"",//留资来源对应的id，若source=0，sourceId代表优惠券Id。若source=1，sourceId代表活动id。以此类推
				    userId:"",
				    areaId:""
				}
				*/
				//   submitClue
			},
			toMyPage() {
				let url = '/pages/my'
				// uni.reLaunch({url})
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
						let dList = [...[{
							dealerName: data.defaultDealerName || '请选择经销商',
							dealerId: data.defaultDealerId
						}], ...data.dealerList]
						this.dealerList = dList
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
				//   城市选择
				for (let i in data.cityVo) {
					let obj = data.cityVo[i]
					obj.text = obj.provinceName
				}
				this.province[0] = data.cityVo
				this.isShowFormPop = true
				let provinceIndex = 0
				let sfid = app.globalData.currentLocation.cityData.proId
				for (let i in data.cityVo) {
					let id = data.cityVo[i].provinceId
					if (id == sfid) {
						provinceIndex = i
					}
				}
				this.fsetcity(provinceIndex)
				this.toFirst(this.province[0], provinceIndex)
				let csIndex = 0
				let csid = app.globalData.currentLocation.cityData.cityId
				for (let i in this.province[1]) {
					let id = this.province[1][i].regionId
					if (id == csid) {
						csIndex = i
					}
				}
				console.log('provinceIndex', provinceIndex)
				this.toFirst(this.province[1], csIndex)
				this.indexCity = [0, 0]
				this.showCityText = this.province[0][0].text + ' ' + this.province[1][0].text
				this.getArea()

			},
			fsetcity(iiii = 0) {
				let obj = this.province[0]
				let list = obj[iiii].regionList
				for (let i in list) {
					let vobj = list[i]
					vobj.text = vobj.regionName
				}
				// this.province[1] = list
				this.$set(this.province, 1, list)
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
				//   获取省份
				let province = await api.getProvince('form')
				for (let i in province.data) {
					province.data[i]['text'] = province.data[i].provinceName
				}
				let provinceIndex = 0
				// if(this.from == 'serial' || true){
				let sfid = app.globalData.currentLocation.cityData.proId
				for (let i in province.data) {
					let id = province.data[i].provinceId
					if (id == sfid) {
						provinceIndex = i
					}
				}
				// }
				await this.getCity(province.data[provinceIndex].provinceId)
				this.province[0] = province.data
				this.toFirst(this.province[0], provinceIndex)
				// if(this.from == 'serial' || true){
				let csIndex = 0
				let csid = app.globalData.currentLocation.cityData.cityId
				for (let i in this.province[1]) {
					let id = this.province[1][i].regionId
					if (id == csid) {
						csIndex = i
					}
				}
				this.toFirst(this.province[1], csIndex)
				this.indexCity = [0, 0]
				this.showCityText = this.province[0][0].text + ' ' + this.province[1][0].text
				this.getArea()
				// }
				this.isShowFormPop = true

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
			},
			async getArea() { //获取区
				let cityCode = this.province[1][this.indexCity[1]].regionId
				let {
					data
				} = await api.getAreaInfo(cityCode)
				this.indexarea = 0
				this.areaList = [{
					areaName: "请选择您的地区"
				}, ...data]
				//   this.getFormDealer()

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
				if (this.areaList[this.indexarea].areaId && ff) {
					cs.areaId = this.areaList[this.indexarea].areaId
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
