<template>
	<view class="formpop" v-if="isShowFormPop">
		<view :class="'form ' + from" v-if="popName == 'form'">
			<view class="header">
				<view class="p1">{{title}}</view>

				<view class="p2" v-if="from == 'lbactivity'">要提交报名信息才可以参与抽奖哦~</view>
				<view class="p2" v-else>为了给您提供更好的服务，请完善基础信息</view>
			</view>
			<view class="content">
				<block>
					<picker v-if="serialList.length" @change="bindMultiPickerColumnChangeser" mode="selector"
						:range="serialList" :range-key="'name'"
						:class="'input-view auto-input ' + (showSerialText == '请选择车型' ? 'placeholder':'')">
						<view>{{showSerialText}}</view>
					</picker>
					<view v-else class="input-view auto-input placeholder" @tap="showToast('暂无车型')">
						<view>暂无车型</view>
					</view>
				</block>
				<picker @change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange" mode="multiSelector"
					:range="[provinceList, cities]" :range-key="'name'"
					:class="'input-view city-input ' + (showProvinceCityText == '请选择省市' ? 'placeholder':'')"
					:value="selectIndex">
					<view>{{showProvinceCityText}}</view>
				</picker>
					<picker @change="bindMultiPickerColumnChangeArea" :value="selectDistrictIndex" mode="selector"
					:range="districtList" :range-key="'name'"
					:class="'input-view area-input ' + (showDistrictText == '请选择您的地区' ? 'placeholder':'')">
					<view>{{showDistrictText}}</view>
				</picker>
				<!-- 经销商 S -->
				<block>
					<picker v-if="dealerList.length" mode="selector" @change="getDealerChangeIndex" :range="dealerList"
						:range-key="'name'"
						:class="'input-view dealer-input jt-icon ' + (!crtDealerItem.id ? 'placeholder':'')" :value="selectDealerIndex">
						<view>{{crtDealerItem.name ? crtDealerItem.name : '请选择经销商'}}</view>
					</picker>
					<view v-else class="input-view dealer-input  ">
						<view>暂无对应经销商</view>
					</view>
				</block>
				<!-- 经销商 E -->
				<!-- 	<view class="input-view mobile-input name-input">
					<input type="text" :always-embed="true" @input="getValue('name',$event)" :value="name"
						maxlength="12" placeholder="请填写您的姓名" placeholder-class="placeholder"></input>
				</view> -->
				<view class="input-view mobile-input">
					<!--  #ifndef MP-TOUTIAO  -->
						<input type="text" :always-embed="true" :value="phone" placeholder="请填写您的手机号码"
							placeholder-class="placeholder" @input="getValue('phone',$event)" maxlength="11"></input>
					<!-- #endif -->
					<!--  #ifdef MP-TOUTIAO  -->
						<input type="text" :always-embed="true" :value="phone" placeholder="请授权手机号码"
							placeholder-class="placeholder" @input="getValue('phone',$event)" maxlength="11" disabled="true"></input>
					<!-- #endif -->
					
			
				</view>
				<view class="lbactivityphoto" v-if="from == 'lbactivity'">报名手机号需要跟购车手机号一致哦~~</view>
				<view class="input-view mobile-input sms-code-input" v-if="smsCodeShow">
					<input type="text" :always-embed="true" v-model="smsCode" placeholder="请输入验证码"
						placeholder-class="placeholder"></input>

					<view :class="'sms-code-btn' + (from == 'lbactivity' ? 'Red':'')" @tap="getSmsCodeClick">
						{{smsCodeText}}
					</view>
				</view>
				<view :class="canSubmit?'btn':'btnMr'" @tap="submit" v-if="from == 'lbactivity'">提交去抽奖</view>
				<view :class="canSubmit?'btn':'btnMr'" @tap="submit" v-else>提交</view>
				<view v-if="isActLink" class="reminder">提交成功可抽奖</view>
				<view class="close-btn-bd" @tap="closeBtnClick"></view>
				<view class="pyview" @tap="doPy">
					<span class="title1">点击按钮即视为同意</span><span class="title2">《用户隐私协议》</span>
				</view>
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
		<!-- 直播重复 -->
		<view class="form-warning-pop" v-if="popName == 'form-livewarning-pop'">
			<view class="warning-icon"></view>
			<view class="p1">您已报名</view>
			<text class="p2">若尚未参与红包雨请\n移步红包雨现场</text>
			<view class="close-btn2" @tap="formHidetoLive">移步红包雨现场</view>
		</view>
		<!-- 成功 -->
		<view class="form-success-pop" v-if="popName == 'form-success-pop'">
			<view class="success-icon"></view>
			<view class="p1">报名成功</view>
			<text class="p2">工作人员会尽快与您电话联系\n请保持电话畅通</text>
			<view class="close-btn2" @tap="formHide">我知道了</view>
		</view>
		<!-- 直播成功 -->
		<view class="form-success-pop" v-if="popName == 'form-livesuccess-pop'">
			<view class="success-icon"></view>
			<view class="p1">报名成功</view>
			<text class="p2">工作人员会尽快与您电话联系\n请保持电话畅通</text>
			<view class="close-btn2" @tap="formHidetoLive">立即参与红包雨</view>
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
		<!-- 签到成功 -->
		<view class="checkin-success-pop" v-if="popName == 'checkin-success-pop'">
			<view class="success-icon"></view>
			<view class="p1">签到成功</view>
			<text class="p2">可以参与抽奖啦</text>
			<view class="look-coupon-btn" @tap="toDraw">去抽奖</view>
		</view>
	</view>
</template>

<script>
	import api from '@/public/api/index'
	import distance from '@/units/distance'
	let app = getApp()
	export default {
		data() {
			return {
				title: '报名活动',
				currentObj: {},
				from: "",
				serialList: [],
				provinceList: [],
				cities: [],
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
				canSubmit: false
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
				let text = '请选择车型'
				if (this.crtSerialItem.id) {
					text = this.crtSerialItem.name
				}
				return text
			},
			showProvinceCityText() {
				let text = '请选择省市'
				if (this.crtProvinceItem.id && this.crtCityItem.id) {
					text = this.crtProvinceItem.name + ' ' + this.crtCityItem.name
				}
				return text
			},
			showDistrictText() {
				let text = '请选择您的地区'
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
			selectDealerIndex(){
				let districtIndex = this.dealerList.findIndex(item => item.id == this.crtDealerItem.id)
				districtIndex = districtIndex > -1 ? districtIndex : 0
				return districtIndex
			}
		},
		methods: {
			  async formShow(name, from = "", obj = {}, title) {
				this.popName = name
				if(this.popName == 'checkin-success-pop'){
					this.isShowFormPop = true;
				}else{
					this.from = from
					this.currentObj = obj
					this.title = title
					this.smsCode = ''
					// this.provinceList = this.currentObj.regionList
					// this.cities = this.provinceList[0].cities
					this.serialList = this.currentObj.serialGroupList
					if(this.currentObj && this.currentObj.noSer){
						// 不自动选车型
					}else{
					this.crtSerialItem = this.serialList.length ? this.serialList[0] : {}
					}
					await this.reqProvincecities()
					this.getpreClue()
				}
			},
			doPy() {
				uni.navigateTo({
					url: '/pages/changanPy'
				})
			},
			//去抽奖
			toDraw(){
				this.$emit('subSuccess','draw')
			},
			closeBtnClick() {
				if (this.from == 'activity') {
					// #ifdef MP-WEIXIN
					wx.aldstat.sendEvent('报名活动留资退出')
					// #endif	

				}
				this.formHide()
			},
			async formHide() {
				this.isShowFormPop = false;
				let ly = this.from
				let lydx = this.currentObj
				let source, sourceId
				console.log(this.currentObj.miniUrl.split('&')[1])
				if ((this.popName == 'form-success-pop') && this.currentObj
					.redirectType == 2 && this.currentObj.miniUrl && this.currentObj.miniUrl.split('&')[1] ===
					'type=wawaji' && this.currentObj.isActStart) {
					uni.navigateTo({
						url: `/pages/wawaji?activityId=${this.currentObj.id}`
					})
				}
				if (ly == 'coupon') {
					source = 0
					sourceId = lydx.id
				} else if (ly == 'activity' && lydx.from != 'lbactivity') {
					source = 1
					sourceId = lydx.id
				} else if (ly = 'lbactivity' || lydx.from == 'lbactivity') {
					source = 5
					sourceId = lydx.id
				} else if (ly == 'serial') {
					source = 2
					sourceId = this.crtSerialItem.id
				} else if (ly == 'dealer') {
					source = 3
					sourceId = lydx.id || lydx.dealerId
				}


				// #ifdef MP-WEIXIN
				if (this.popName == 'form-success-pop' && ly == 'activity' && lydx.from != 'lbactivity' && this
					.currentObj.subscribeTemplateId && !lydx.isActStart) {
					// 普通活动
					let that = this
					//判断是否订阅
					let {
						data
					} = await api.checkSubscribe({
						'contentId': sourceId,
						'contentType': 2
					})
					if (!data.hasSubscribe) {
						wx.requestSubscribeMessage({
							tmplIds: [that.currentObj.subscribeTemplateId],
							success(res) {
								if (res[that.currentObj.subscribeTemplateId] == 'accept') {
									that.showToast('订阅成功')
									api.subscribe({
										'contentId': sourceId,
										'contentType': 2,
										'templateId': that.currentObj.subscribeTemplateId
									});
								}
								if (res[that.currentObj.subscribeTemplateId] == 'ban' | 'filter') {
									that.showToast('订阅失败，请重试')
								}

								console.log(res);
							},
							fail(err) {
								that.showToast('订阅失败，请重试')
								console.error(err);
							}

						})
					}
				}
				// #endif
			},

			formHidetoLive() {
				this.isShowFormPop = false;
				let liveurl = this.currentObj.liveUrl
				if (liveurl) {
					// #ifndef MP-WEIXIN
					this.$toast('请在微信搜索本小程序参与')
					// #endif
					// #ifdef MP-WEIXIN
					uni.navigateToMiniProgram({
						appId: 'wxa860d5a996074dbb',
						path: liveurl,
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
			async submit() {
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
				if (ly == 'coupon') {
					source = 0
					sourceId = lydx.id
				} else if (ly == 'activity' && lydx.from != 'lbactivity') {
					source = 1
					sourceId = lydx.id
				} else if (ly == 'lbactivity' || lydx.from == 'lbactivity') {
					source = 5
					sourceId = lydx.id
				} else if (ly == 'serial') {
					source = 2
					sourceId = this.crtSerialItem.id
				} else if (ly == 'dealer') {
					source = 3
					sourceId = lydx.id || lydx.dealerId
				} else if (ly == 'marathon') {
					source = 5
					sourceId = lydx.id
				}
				if (!this.ifcanSubmit()) {
					return
				}

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
				console.log(this.currentObj.sourceUserId)

				if (this.currentObj.sourceUserId && this.currentObj.sourceUserId != 'undefined' && this.currentObj
					.sourceUserId != 0) {
					pam.sourceUserId = this.currentObj.sourceUserId
				}
				console.log('留资参数', pam)
				let data = await api.submitClue(pam)
				let popname
				if (data.code == 1) { //成功留资
					console.log(ly + data)
					if ((ly == 'lbactivity' || lydx.from == 'lbactivity') && lydx.isActStart) {
						if (lydx.activityType == 'wawaji') {
							if (lydx.actSelect == 0) {
								// 线下
								uni.navigateTo({
									url: `/pages/wawaji?activityId=${lydx.id}`
								})
							} else if (lydx.actSelect == 2) {
								// both
								uni.navigateTo({
									url: '/pages/ActivitySelect?activityId=' + lydx.id + '&lotteryType=' + lydx
										.lotteryType + "&shareURL=" + encodeURIComponent(lydx.shareURL)
								})
							} else {
								// 不传或者1  抽奖
								uni.reLaunch({
									url: '/pages/lotteryPage?activityId=' + lydx.id + '&lotteryType=' + lydx
										.lotteryType + "&shareURL=" + encodeURIComponent(lydx.shareURL)
								})

							}
						} else {
							// 非wawa就去抽奖
							if (lydx.lotteryType == 'Vouchers') {
								uni.redirectTo({
									url: '/pages/lotteryPage?activityId=' + lydx.id + '&lotteryType=' + lydx
										.lotteryType + "&shareURL=" + encodeURIComponent(lydx.shareURL)
								})
							} else {
								uni.reLaunch({
									url: '/pages/lotteryPage?activityId=' + lydx.id + '&lotteryType=' + lydx
										.lotteryType + "&shareURL=" + encodeURIComponent(lydx.shareURL)
								})
							}

						}
						this.isShowFormPop = false;
						this.popName = 'lbactivity' 
						//跳转抽奖
						// this.popName = 'lbactivity'
						// let url = '/pages/lotteryPage?activityId=' + lydx.id
						// if(lydx.shareURL){
						// 	url = lydx.shareURL
						// }
						// uni.navigateTo({
						// 	url:url
						// })
						return
					}
					if (ly == 'coupon') {
						popname = 'coupon-success-pop'
					} else if(ly === 'marathon') {
						popname = ''
						this.isShowFormPop = false
					} else {
						popname = 'form-success-pop'
					}
					if (this.currentObj.liveUrl && this.currentObj.liveUrl.indexOf("pages_live") != -1) {
						popname = 'form-livesuccess-pop'
					}
					this.popName = popname
					this.$emit('subSuccess')

				} else if (data.code == 2) { //重复留资
					// if (ly == 'lbactivity') {
					// 	//跳转抽奖
					//     this.popName = 'lbactivity'
					// 	uni.navigateTo({
					// 		url:'/pages/lotteryPage?activityId=' + lydx.id
					// 	})
					// 	return
					// }

					if (ly == 'coupon') {
						popname = 'coupon-warning-pop'
					} else {
						popname = 'form-warning-pop'
					}
					if (this.currentObj.liveUrl && this.currentObj.liveUrl.indexOf("pages_live") != -1) {
						popname = 'form-livewarning-pop'
					}
					this.popName = popname


				} else {
					if (ly == 'coupon') {
						popname = 'coupon-sb-pop'
						this.showToast(data.msg)
					} else {
						popname = 'form-sb-pop'
						this.showToast(data.msg)
					}
				}

				console.log(data)
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

				await distance.getLocation()
				// 省市区 经销商
				let currentLocation = app.globalData.currentLocation
				let ifding = true 
				if(currentLocation.wxPosition.provider && currentLocation.wxPosition.provider == 'default'){
					// 没有开启定位不出默认
					ifding = false
				}
				if (currentLocation && ifding) {
					if(this.currentObj && this.currentObj.noDistanceDeal){
						// 子维要求有这个参数 就一直出定位
						console.log('currentLocation',currentLocation)
						const crtLocationProvinceItem = this.provinceList.find(item => item.name.replace('省', '').replace(
							'市', '') == currentLocation.cityData.pro.replace('省', '').replace('市', ''))
						if (crtLocationProvinceItem) {
							const crtLocationCityItem = crtLocationProvinceItem.cities.find(item => item.name.replace(
								'市', '') == currentLocation.cityData.city.replace('市', ''))
							this.crtProvinceItem = crtLocationProvinceItem
							this.cities = this.crtProvinceItem.cities
							this.crtCityItem = crtLocationCityItem
							console.log(this.crtProvinceItem.name,this.crtCityItem.name)
							this.reqDistrictListByCityId(this.crtCityItem.id)
							this.reqDealerListByCityId(this.crtCityItem.id)
						}
					}else{
						console.log('currentLocation',currentLocation)
						const crtLocationProvinceItem = this.provinceList.find(item => item.name.replace('省', '').replace(
							'市', '') == currentLocation.selectedCityData.pro.replace('省', '').replace('市', ''))
						if (crtLocationProvinceItem) {
							const crtLocationCityItem = crtLocationProvinceItem.cities.find(item => item.name.replace(
								'市', '') == currentLocation.selectedCityData.city.replace('市', ''))
							this.crtProvinceItem = crtLocationProvinceItem
							this.cities = this.crtProvinceItem.cities
							this.crtCityItem = crtLocationCityItem
							console.log(this.crtProvinceItem.name,this.crtCityItem.name)
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
						console.log('this.districtList',this.districtList)
						let num = Math.floor(Math.random()*(this.districtList.length ))
						if(this.currentObj && this.currentObj.noDistanceDeal){
							// 不根据位置出经销商 随机城市下面的一家，所以先不出地区
							console.log('随机出区',num)
						}else{
							// 根据定位出区
							let currentLocation = app.globalData.currentLocation
							if(currentLocation){
								let  cityData = currentLocation.cityData 
								// console.log('cityData',cityData,currentLocation.selectedCityData)
								let regionShow = true
								if(currentLocation.selectedCityData.isChange){// 改过
									if(cityData.city.replace('市', '') != currentLocation.selectedCityData.city.replace('市', '')){ // 切改了城市不同了
										regionShow = false
									}
								}
								if(regionShow){ //要根据定位出区域
								let index = this.districtList.findIndex(item => item.name.replace('区', '').replace(
							'县', '').replace('市', '') == cityData.region.replace('区', '').replace('县', '').replace('市', ''))
							console.log('匹配到了',index)
							  if(index != -1){
								  num = index
							  }
								}
							}
						}
						this.crtDistrictItem = this.districtList[num]
						console.log('this.crtDistrictItem',this.crtDistrictItem,this.districtList,num)
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
					if(!pcSerialGroupId){
						return
					}
					const res = await api.fetchDealerListByCityId({
						cityId,
						districtId,
						pcSerialGroupId
					})
					if (res.code == 1) {
						if(this.currentObj && this.currentObj.noDistanceDeal){
							this.dealerList = res.data
							if (this.dealerList && this.dealerList.length) { 
								console.log('经销商随机数',this.dealerList.length,Math.floor(Math.random() * this.dealerList.length))
								this.crtDealerItem = this.dealerList[Math.floor(Math.random() * this.dealerList.length)]
							}
						}else{
							this.dealerList =distance.sortDealersByDistance(res.data)
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

	.pyview {
		text-align: center;
		height: 40rpx;
		line-height: 40rpx;
		// background: #4CD964;
		margin-bottom: 10rpx;
	}

	.title1 {
		color: #101010;
		font-size: 28rpx;
	}

	.title2 {
		color: #5A94E1;
		font-size: 28rpx;
	}

	.lbactivityphoto {
		color: #F04040;
		font-size: 24rpx;
	}

	.sms-code-btnRed {
		position: absolute;
		right: 10rpx;
		top: 0;
		bottom: 0;
		z-index: 10;
		margin: auto 0;
		font-size: 24rpx;
		color: #FA8845;
	}
</style>
