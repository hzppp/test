<template>
	<view class="sign">
		<!-- <button v-if="{{isUserInfoPage}}" class="getUserInfo_name_info_mask_body" lang="zh_CN" @getuserinfo="getWxUserInfoButton" open-type="getUserInfo"></button> -->
		<view class="topbg">
			<view class="title">{{actData.name}}</view>
			<view class="welcome">欢迎您~</view>
		</view>
		<block v-if="actData.status ==1">
			<block v-if="actData.signStatus">
				<!-- 已经签到且未结束 -->
				<view class="content">
					<view class="person"></view>
					<view class="form shortHeight">
						<view class="vt gray">
							<image src="https://www1.pcauto.com.cn/pocket/xcx/yqdz1014/hadLogo_03.jpg"></image>
							<view>{{actData.userName}}完成签到</view>
						</view>

					</view>
					<block v-if="actData.link">
						<view class="btn blue" @tap="towebView2">去查看抽奖</view>
					</block>
				</view>
			</block>
			<blcok v-else>
				<!-- 未签到 -->
				<view class="content">
					<view class="person"></view>
					<view class="form">
						<view class="tit">请您完善以下信息参与签到抽奖</view>
						<view class="formBox">
							<view class="inp inp1">
								<input type="text" placeholder="请填写您的称呼" @input="getValue('name')" :value="name" maxlength="8"
								 :placeholder-style="'color:#ccc'">
							</view>
							<view class="inp inp2">
								<button class="zx-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" @tap.stop="getPhoneNumberstop"
								 v-if="!isphoneInp">请填写您的手机</button>
								<input type="text" v-if="isphoneInp" placeholder="请填写您的手机" @input="getValue('phone')" :value="phone"
								 :placeholder-style="'color:#ccc'">
							</view>
							<view class="inp inp3">
								<picker @change="bindMultiPickerColumnChangeser" :range="serialList" range-key="name" class="input-view auto-input">
									<view v-if="indexSerial>=0">{{serialList[indexSerial].name}}</view>
									<view v-else class="placeholder">您的意向车型</view>
									<!-- <view>{{serialList[indexSerial].name}}</view> -->
								</picker>
							</view>
							<view class="inp inp4">
								<picker @change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange" mode="multiSelector" :range="province"
								 range-key="text" :placeholder="province.length>1?'请选择车系':showCityText" :class="'input-view city-input ' + (showCityText == '请选择' ? 'placeholder':'')">
									<view v-if="showCityText">{{showCityText}}</view>
									<view v-else class="placeholder">请选择城市</view>
									<!-- <view>{{showCityText}}</view> -->
								</picker>
							</view>
							<view class="inp inp5">
								<picker @change="bindMultiPickerColumnChangeArea" :range="areaList" range-key="areaName" :class="'input-view area-input ' + (areaList[indexarea].areaName == '请选择您的地区' ? 'placeholder':'')">
									<view>{{areaList[indexarea].areaName}}</view>
								</picker>
							</view>
							<view class="inp inp6">
								<picker v-if="dealerList.length > 0" @change="getDealerChangeIndex" :range="dealerList" range-key="dealerName"
								 :class="'input-view dealer-input jt-icon ' + (dealerList[currentDealerIndex].dealerId < 1 ? 'placeholder':'')">
									<view v-if="currentDealerIndex>=0">{{dealerList[currentDealerIndex].dealerName}}</view>
									<view v-else class="placeholder">请选择签到门店</view>
								</picker>
							</view>
						</view>
					</view>
					<block v-if="actData.link.length>0">
						<view class="btn" @tap="submit">签到去抽奖</view>
					</block>
					<block v-else>
						<view class="btn" @tap="submit">确定签到</view>
					</block>

				</view>
			</blcok>
		</block>
		<block v-if="actData.status == 2">
			<!-- 签到未开始 -->
			<view class="content">
				<view class="person"></view>
				<view class="form shortHeight">
					<view class="vt gray">
						<view>签到已结束</view>
						<view>可以先逛逛其他哦~</view>

					</view>
				</view>
				<view class="btn blue" @tap="topIndexPage">去逛逛</view>
			</view>
		</block>
		<blcok v-if="actData.status == 0">
			<view class="content">
				<view class="person"></view>
				<view class="form shortHeight">
					<view class="vt gray">
						<view>签到还没开始</view>
						<view>可以先逛逛其他哦~</view>

					</view>
				</view>
				<view class="btn blue" @tap="topIndexPage">去逛逛</view>
			</view>
		</blcok>

		<view class="tip gray" v-if="actData.link"><text>抽奖结果可在【我的】-【我的礼品】中查看</text></view>
		<view class="sign_notes">
			<view class="tit">签到说明</view>
			<view class="notesList">
				<rich-text :nodes="actData.description" class="gray"></rich-text>
			</view>
		</view>
	</view>
</template>

<script>
	import login from '@/units/login'
	import api from '@/public/api/index'
	import shouquan from '@/units/shouquan'
	import getUserInfo from '@/units/getUserInfo'
	import distance from '@/units/distance'

	import pageTop from '@/components/pageTop/pageTop'
	let app = getApp()
	export default {
		data() {
			return {
				phone: '',
				serialList: [],
				indexSerial: -1,
				province: [
					[],
					[]
				],
				indexarea: "0",
				areaList: [{
					areaName: "请选择您的地区"
				}],
				showCityText: '',
				dealerList: [],
				currentDealerIndex: -1,
				isHasPrize: false, //是否有抽奖，是否有link
				isHadSign: false, //是否已经签到,signStatus为1时已签到
				isStart: false, //是否开始,status：0未开始,1进行中,2已结束
				actData: {},
				indexCity: 0,
				name: "",
				ActivityId: null,
				isphoneInp: false
			}
		},
		mixins: [shouquan],
		async onLoad(options) {
			console.log(options)
			await login.login()
			if (options.id) {
				this.ActivityId = options.id || 0
				
			}

			let data = await api.getSignInActData(this.ActivityId)
			this.actData = data.data
			this.actData.description = '<pre style="white-space:pre-wrap;">' + data.data.description + '</pre>';
			let data2 = await api.getAutoSerialList()
			this.serialList = data2.data

			
			this.getpreClue()
			let pocketUserInfo = await api.getPocketUserInfo()
			console.log(pocketUserInfo)
			if (pocketUserInfo.phone) {
				this.isphoneInp = true;
				this.phone = pocketUserInfo.phone
				
			}
		},
		methods: {
			async getPhoneNumber(e) {
				let {
					detail = {}
				} = e
				if (detail.iv) {
					let {
						data
					} = await api.decryptPhone(detail.encryptedData, detail.iv)
					console.log('电话解密接口返回', data)
					app.globalData.pocketUserInfo.phone = data.phoneNumber
					this.phone = data.phoneNumber
					this.isphoneInp = true
				} else {
					this.isphoneInp = true
					
				}
				
			},

			getPhoneNumberstop() {
				console.log('-')
				// this.phone = true
				// 
			},
			bindMultiPickerColumnChangeser(e) {
				let {
					detail
				} = e
				this.indexSerial = detail.value
			},
			bindMultiPickerChange(e) {
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
			bindMultiPickerColumnChangeArea(e) {
				let {
					detail
				} = e
				this.indexarea = detail.value
				// console.log('this.indexarea', this.areaList[this.indexarea].areaId)
				this.getFormDealer(true)
			},
			getDealerChangeIndex(e) {
				let {
					detail
				} = e
				this.currentDealerIndex = detail.value
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
					console.log(this.phone)
				}

			},

			async submit() {
				console.log(8)
				let sf = this.province[0][this.indexCity[0]]
				let cs = this.province[1][this.indexCity[1]]
				let dq = this.areaList[this.indexarea]
				let chexi = this.serialList[this.indexSerial]
				//   let ly = this.from
				//   let lydx = this.currentObj
				let source = 4,
					sourceId = this.ActivityId
				//   console.log('省份',sf)
				//   console.log('城市',cs)
				//   console.log('地区',dq)
				//   console.log('车系',chexi)
				let isphone = this.isPoneAvailable(this.phone)
				if (!isphone) {
					this.showToast('请输入正确手机号')
					return false
				}
				if (!this.name) {
					console.log('请输入姓名')
					this.showToast('请输入姓名')
					return false
				}
				if (!this.showCityText) {
					this.showToast('请选择城市')
					return false
				}
				if (this.indexSerial < 0) {
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
				console.log(data)
				if (data.code == 1) {
					if (this.actData.link.length > 0) {
						this.towebView2()
					} else {
						this.showToast('签到成功')

					}
					let data = await api.getSignInActData(this.ActivityId)
					this.actData = data.data
					
				} else if (data.code == 2) { //重复留资
					this.showToast('重复留资')
				} else {
					this.showToast('签到异常')
				}
				//   let popname
				//   if(data.code == 1){//成功留资
				//         if(ly == 'coupon'){
				//             popname = 'coupon-success-pop'
				//         }else{
				//             popname = 'form-success-pop'
				//         }
				//   }else if(data.code == 2){//重复留资
				//         if(ly == 'coupon'){
				//             popname = 'coupon-warning-pop'
				//         }else{
				//             popname = 'form-warning-pop'
				//         }
				//   }else{
				//       if(ly == 'coupon'){
				//             popname = 'coupon-sb-pop'
				//         }else{
				//             popname = 'form-sb-pop'
				//         }
				//   }
				//   this.popName = popname
				
				console.log(data)
			},
			towebView2() {
				if (this.actData.link) {
					let redirect = {
						'redirect': this.actData.link
					}
					api.getMallLink(redirect).then(res => {
						let vurl = escape(res.data)
						let url = `/pages/webview?webURL=${vurl}`
						uninavigateTo({
							url
						})
						console.log('MallLink', res)
					})
				} else {
					api.getMallLink().then(res => {
						let vurl = escape(res.data)
						let url = `/pages/webview?webURL=${vurl}`
						uninavigateTo({
							url
						})
						console.log('MallLink', res)
					})
				}

			},
			topIndexPage() {
				unireLaunch({
					url: "/pages/index"
				})
			},
			towebView2() {
				if (this.actData.link) {
					let redirect = {
						'redirect': this.actData.link
					}
					api.getMallLink(redirect).then(res => {
						let vurl = escape(res.data)
						let url = `/pages/webview?webURL=${vurl}`
						uninavigateTo({
							url
						})
						console.log('MallLink', res)
					})
				} else {
					api.getMallLink().then(res => {
						let vurl = escape(res.data)
						let url = `/pages/webview?webURL=${vurl}`
						uninavigateTo({
							url
						})
						console.log('MallLink', res)
					})
				}

			},
			async getpreClue() {
				let source = 4
				let sourceId = this.ActivityId
				let currentLocation = app.globalData.currentLocation
				let query = {
					source,
					sourceId
					//   regionId:currentLocation.cityData.cityId
				}
				if (!currentLocation.wxPosition.wsq) {
					console.log(currentLocation)
					query.latitude = currentLocation.wxPosition.latitude
					query.longitude = currentLocation.wxPosition.longitude
				}
				let {
					data
				} = await api.getpreClue(query)
				console.log(data, 'getpreClue'); {
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
				// this.showCityText = this.province[0][0].text + ' ' +this.province[1][0].text
				this.getArea('1')
				
				// if(data == null || !data){
				//     data = {}
				// }
			},
			fsetcity(iiii = 0) {
				let obj = this.province[0]
				let list = obj[iiii].regionList
				for (let i in list) {
					let vobj = list[i]
					vobj.text = vobj.regionName
				}
				this.province[1] = list
				
			},
			toFirst(list, index) {
				return list.unshift(list.splice(index, 1)[0])
			},
			async getCity(id) {
				let {
					data
				} = await api.getRegionByProvince(id)
				for (let i in data) {
					data[i]['text'] = data[i].regionName
				}
				this.province[1] = data
				
				return data
			},
			async getArea(first) { //获取区
				//   conso.log(111)
				if (first) {
					this.areaList = [{
						areaName: "请选择您的地区"
					}]
				} else {
					let cityCode = this.province[1][this.indexCity[1]].regionId
					let {
						data
					} = await api.getAreaInfo(cityCode)
					this.indexarea = 0
					this.areaList = [{
						areaName: "请选择您的地区"
					}, ...data]
				}

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
			},
			showToast(title = "", duration = 1500) {
				unishowToast({
					title: title,
					icon: 'none',
					duration: duration
				})
			},
			isPoneAvailable(phoneNumber) {
				var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
				if (!myreg.test(phoneNumber)) {
					return false;
				} else {
					return true;
				}
			}
		}
	}
</script>

<style lang="less">
	@import '@/static/less/signPrize.less';
</style>
