<template>
	<view>
		<view class="get-preferential" v-if="serialData.id">
			<userBand @gohidden='close' :noback='true' @loginSuccess='getStoragePhone'></userBand>
			<pop ref="pop" @closeShow='close'></pop>
			<!-- 顶部提示S -->
			<view class="top-tit">立即询价获取优惠
			<view class="close"  @tap='close'></view>
			</view>
			<!-- 顶部提示E -->
			<!-- 头部信息S -->
			<view class="head-info">
				<image mode="aspectFit" :src="serialData.picCoverUrl" />
				<view class="text-dec" @tap="changeSerial">
					<view class="title">{{serialData.name}}</view>
					<view class="price">指导价: {{serialData.price}}万</view>
				</view>
				<view class="arrow"></view>
			</view>
			<!-- 头部信息E -->
			<view class="content">
				<!-- 手机号S -->
				<view class="list models" android:focusable="true" android:focusableInTouchMode="true">
					<view class="list-title">手机号</view>
					<!--  #ifndef MP-TOUTIAO  -->
					<input class="select" :focus="isFocus" v-if="getPhoneBtn == true ||  TOUTIAO == 'TOUTIAO'"
						pattern="[0-9]*" placeholder="请输入11位手机号码" @input="checkInfo" v-model="phoneNum"
						maxlength="11" />
					<!-- #endif -->
					<!--  #ifdef MP-TOUTIAO  -->
					<input class="select" :focus="isFocus" v-if="getPhoneBtn == true ||  TOUTIAO == 'TOUTIAO'"
						pattern="[0-9]*" placeholder="请授权手机号码" @input="checkInfo" v-model="phoneNum" maxlength="11"
						disabled="true" />
					<!-- #endif -->
					<button class="getPhoneBtn" v-if="getPhoneBtn == false && TOUTIAO != 'TOUTIAO'"
						open-type="getPhoneNumber" @getphonenumber="getPhoneNumber($event)">您的手机号码（点击授权免手写）</button>
				</view>
				<!-- 手机号E -->
				<!-- 验证码S -->	
				<view class="list models" v-if="smsCodeShow">
					<view class="list-title">验证码</view>
					<input class="select" placeholder="请输入验证码" @input="checkInfo" v-model="codeNum"
						android:focusable="true" android:focusableInTouchMode="true" />
					<view class="get-code" v-if="timeDownFalg" @tap="getCode">{{isFirst?"获取验证码":"重新发送"}}</view>
					<view class="downcount" v-else>{{downNum}}s</view>
				</view>
				<!-- 验证码E -->
				<!-- 城市选择S -->
				<view class="list models">
					<view class="list-title">城市</view>
					<view class="select" @tap="goChooseCity">
						{{currentCity.name?currentCity.name:''}}
					</view>
					<view class="arrow"></view>
				</view>
				<!-- 城市选择E -->
				<!-- 地区选择E -->
			<!-- 	<view class="list models">
					<view class="list-title">地区</view>
					<view class="select" @tap="goChooseRegion">
						{{currentRegion.name || ""}}
					</view>
					<i class="clean-btn" v-if="currentRegion.id" @tap.stop="cleanRegion"></i>
					<view class="arrow"></view>
				</view> -->
				<!-- 地区选择S -->
				<!-- 经销商S -->
			<!-- 	<view class="list models">
					<view class="list-title">经销商</view>
					<view class="select" @tap="changDealers">
						{{currentDealer.name? currentDealer.name : '暂无对应经销商'}}
					</view>
					<view v-show="currentDealer.name" class="arrow"></view>
				</view> -->
				<!-- 经销商E -->
				<view class="btn-area">
					<!-- <view class="tit">提交后经销商会尽快与您联系</view> -->
					<button class="btn" @tap="yuYue" :class="{'origin':isAllSelect}">获取底价</button>
				</view>
			</view>
			<pyBoomV titlecolor="#FA8845"></pyBoomV>
		</view>

		<view v-if="isNoData && !serialData.id" class="no-data">暂无数据</view>
	</view>
</template>

<script>
	import api from '@/public/api/index'
	import pop from '@/components/apop/aPop'
	import distance from '@/units/distance'
	import login from '@/units/login'
	import pyBoomV from '@/components/pyBoomV/pyBoomV'
	import userBand from '@/components/userBand/userBand'
	let app = getApp()

	/* *
	 * 倒计时默认时间
	 */
	const COUNTDOWN = 60
	let reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/

	//埋点标识字段
	const trackAttribute = {
		carDetPrice: {
			btnFrom: "获取实时底价",
			pageFrom: "车辆详情页"
		},
		myPage: {
			btnFrom: "悬浮按钮预约试驾",
			pageFrom: "我的页面"
		},
		exhibitionTotal: {
			btnFrom: "询底价",
			pageFrom: "云展厅车辆总页"
		},
		exhibitionCar: {
			btnFrom: "询底价",
			pageFrom: "云展厅车辆页"
		},
	}
	export default {
		components: {
			pop,
			pyBoomV,
			userBand
		},
		props: {
			serialId:{
			    type: String,
			    default: "",
			
			},
			currentCity:{
				type:Object,
				default:null
			}
			
		},
		data() {
			return {
				phoneNum: '', //手机号码
				codeNum: '', //验证码
				timeDownFalg: true, //验证码倒计时标识
				timer: null, //倒计时
				downNum: COUNTDOWN, //倒计时秒数
				isFirst: true, //是否是第一次发送

				title: '获取优惠',
				cityList: [], //城市列表
				dealersList: [], //经销商列表

				currentCaraSerial: '', //当前的车系名字
				isAllSelect: false, //信息是否已经全部完成

				// currentCity: {}, //当前选择的城市

				currentDealer: {}, //当前经销商

				currentRegion: {}, //当前选择的地区
				serialData: {}, //车系详情

				getPhoneBtn: false,
				isFocus: false,
				isNoData: false,
				smsCodeShow: false,
				from: ""
			}
		},
		watch: {
			currentCity(n) {
				//YCZ_城市选择埋点
				this.$gdp('YCZ_chooseCity', {
					'YCZ_city_var': n.name
				})
				if(n){
					this.currentCity = n
					this.reqDealersList(n.id)
				}
			  console.log('this.currentCity',this.currentCity)
			},
			currentRegion(n) {
				//YCZ_地区选择埋点
				this.$gdp('YCZ_cityProperChoice', {
					'YCZ_cityProper_var': n.name
				})
				this.reqDealersList(this.currentCity.id, n.id)
			},
			serialData(n) {
				//车型选择埋点
				this.$gdp('YCZ_CarModelChoice', {
					'YCZ_carModel_var': n.name,
					'YCZ_carSeries_var': '-'
				})
			},
			currentDealer(n) {
				//YCZ_经销商选择埋点  
				this.$gdp('YCZ_distributorChoice', {
					'YCZ_distributorName_var': n.name
				})

			},
			
			serialId:{
				handler(n){
					console.log('serialId',n)
					this.serialId = n
					this.reqSerialDetail(this.serialId)
					this.reqDealersList(this.currentCity.id, this.currentRegion.id)
				},
				immediate: true
				
			},
			phoneNum: {
				handler(n){
					if (n && n.length > 11) {
						this.phoneNum = n.substring(0, 11)
					} else if (n.length == 11) {
					
						this.$gdp('YCZ_iphoneInput')
					
					}
					this.checkInfo()
				},
				immediate: true
				
			}


		},
		onShow() {
			this.checkInfo()
		},
		async mounted() {
			console.log('onLoad',this.serialId)
			await login.checkLogin(api)
			await login.checkOauthMobile(api)
			this.getStoragePhone()
			// console.log('this.currentCity',this.currentCity)
			
			// this.reqSerialDetail(this.serialId)
			// this.reqDealersList(this.currentCity.id, this.currentRegion.id)

		},
		methods: {
			close(){
				console.log('close')
				this.$emit('getpflclose')
			},
			getStoragePhone() {
				let phone = uni.getStorageSync('userPhone');
				if (phone) {
					this.phoneNum = phone
					this.getPhoneBtn = true
				}
			},
			async getPhoneNumber(e) {
				let {
					detail
				} = e
				if (detail.iv) {
					try {
						// uni.showLoading({
						// 	title: '正在加载...',
						// 	mask: true
						// })
						console.log('encryptedData = ', detail.encryptedData, 'detailiv == ', detail.iv)
						let {
							data
						} = await api.decryptPhone(detail.encryptedData, detail.iv)
						if (data && data.phoneNumber) {
							uni.setStorageSync('userPhone', data.phoneNumber)
							this.phoneNum = data.phoneNumber
						}
					} catch (error) {
						// uni.showToast({
						// 	icon: "none",
						// 	title: "手机授权失败"
						// })
						this.isFocus = true
					} finally {
						// uni.hideLoading()
					}
				} else {
					this.isFocus = true
				}
				this.getPhoneBtn = true
			},
			//车系详情
			async reqSerialDetail(sgId) {
				try {
					uni.showLoading({
						title: '正在加载...',
						mask: true
					})
					const {
						code,
						data
					} = await api.fetchSerialDetail({
						sgId
					})
					if (code === 1) {
						this.serialData = data

					} else {
						this.isNoData = true
					}
				} catch (error) {
					console.error(error)
				} finally {
					uni.hideLoading()
				}
			},
			//经销商点击，判断提示
			changDealers() {
				if (!this.currentCity.name) {
					return uni.showToast({
						title: "请选择城市",
						icon: "none"
					})
				}
				// /this.currentCity.id
				if (!this.currentDealer.name) {
					return
				}
				uni.navigateTo({
					url: `/pages/ChooseDealer?cityId=${this.currentCity.id}&dealersId=${this.currentDealer.id}&districtId=${this.currentRegion.id}&serialId=${this.serialId}`
				})
			},
			//切换车系
			changeSerial() {
				uni.navigateTo({
					url: "/pages/ChooseSerial?pages=GetPreferential"
				})

			},
			//获取经销商列表
			async reqDealersList(cityId) {
				try {
					console.log(2111111111 + cityId)
					if (cityId) {
						let pcSerialGroupId = this.serialId;
						const {
							code,
							data
						} = await api.fetchDealerListByCityId({
							cityId,
							pcSerialGroupId
						})
						if (code === 1) {
							this.dealersList = distance.sortDealersByDistance(data)
						}
					}
				} catch (error) {
					console.error(error)
				}
			},

			//获取验证码
			async getCode() {
				if (!reg.test(this.phoneNum)) return uni.showToast({
					title: "请输入正确的手机号码",
					icon: "none"
				})
				this.timeDownFalg = false
				this.isFirst = false
				this.timer = setInterval(() => {
					this.downNum--
					if (this.downNum == 0) {
						this.timeDownFalg = true
						this.downNum = COUNTDOWN
						clearInterval(this.timer)
					}
				}, 1000)
				try {
					const res = await api.fetchCode({
						mobile: this.phoneNum
					})
					console.log('res :>> ', res);
				} catch (error) {
					console.error(error)
				}
			},
			//检测信息是否齐全
			checkInfo() {
				//             if(this.phoneNum && this.codeNum && this.currentCity.id && this.currentDealer.id) {
				//                 this.isAllSelect = true
				//                 console.log('true :>> ', true);
				//             }else {
				//                 this.isAllSelect = false
				//                 console.log('false :>> ', false);
				//             }

				if (this.phoneNum.length == 11 && this.phoneNum != uni.getStorageSync('userPhone')) {
					this.smsCodeShow = true
				} else {
					this.smsCodeShow = false
				}
				if (this.phoneNum && this.currentCity.id && ((this.phoneNum != uni.getStorageSync('userPhone') && this
							.codeNum) || this
						.phoneNum == uni.getStorageSync('userPhone')) && this.currentDealer.id) {
					this.isAllSelect = true
				} else {
					this.isAllSelect = false
				}


			},
			//选择城市
			goChooseCity() {
				// this.currentDealer = {}
				// this.currentRegion = {}
				uni.navigateTo({
					url: "/pages/ChooseCity"
				})
			},
			cleanRegion() {
				this.currentRegion = {}
			},
			//选择地区
			goChooseRegion() {
				if (!this.currentCity.name) {
					return uni.showToast({
						title: "请先选择城市",
						icon: none
					})
				}
				// this.currentDealer = {}
				uni.navigateTo({
					url: `/pages/ChooseRegion?cityId=${this.currentCity.id}&name=${this.currentRegion.name}`
				})
			},
			//立即预约
			async yuYue() {
				//YCZ_留资按钮点击埋点
				this.$gdp('YCZ_leaveAssetsButtonClick', {
					'YCZ_carModel_var': this.serialData.name,
					'YCZ_mobile_var': this.phoneNum,
					'YCZ_province_var': '-',
					'YCZ_city_var': this.currentCity.name,
					'YCZ_distributorName_var': this.currentDealer.name
				})
				console.log(this.phoneNum, reg.test(this.phoneNum))
				if (!reg.test(this.phoneNum)) return uni.showToast({
					title: "请输入正确的手机号码",
					icon: "none"
				})
				if (!this.codeNum && this.smsCodeShow) return uni.showToast({
					title: "请输入正确的验证码",
					icon: "none"
				})
				if (!this.currentDealer.id) return uni.showToast({
					title: "无对应经销商",
					icon: "none"
				})

				try {
					// uni.showLoading({
					// 	title: '正在加载...',
					// 	mask: true
					// })
					const res = await api.submitClue({
						areaId: this.currentRegion.id || "",
						cityId: this.currentCity.id,
						mobile: this.phoneNum,
						provinceId: this.currentCity.provinceId,
						serialGroupId: this.serialId,
						source: 3,
						sourceId: this.currentDealer.id,
						smsCode: this.codeNum,
						dealerId: this.currentDealer.id || "",
						sourceId: this.serialId,
						adDealerId: app.globalData.adDealerId
					})
					console.log('res :>> ', res);
					if (res.code === 1) {
						// #ifdef MP-WEIXIN
						this.$refs.pop.isShow = true
						// #endif

						// #ifdef MP-TOUTIAO
						// this.$refs.pop.isShow = true
						this.$children[1].isShow = true
						// #endif
						console.log('res :>> ', res);
						//YCZ_留资单提交成功埋点
						let sourcePage = getCurrentPages().length > 1 ? getCurrentPages()[getCurrentPages().length - 2]
							.route : "-"
						this.$gdp('YCZ_leaveListSubmitSuccess', {
							'YCZ_sourcePage_var': sourcePage,
							'YCZ_carModel_var': this.serialData.name,
							'YCZ_mobile_var': this.phoneNum,
							'YCZ_province_var': '-',
							'YCZ_city_var': this.currentCity.name,
							'YCZ_distributorName_var': this.currentDealer.name
						})


						//这里
					} else {
						return uni.showToast({
							title: res.msg,
							icon: "none"
						})
					}
				} catch (error) {
					console.error(error)
				} finally {
					setTimeout(() => {
						uni.hideLoading()
					}, 2000)
				}
			},
			//获取经销商列表
			async reqDealersList(cityId, districtId) {
				try {
					console.log(1111111111 + cityId)
					if (!cityId) {
						return
					}
					let pcSerialGroupId = this.serialId;
					uni.showLoading({
						title: '正在加载...',
						mask: true
					})
					if (!districtId) {
						const {
							code,
							data
						} = await api.fetchDealerListByCityId({
							cityId,
							pcSerialGroupId
						})
						if (code === 1 && data.length) {
							this.dealersList = distance.sortDealersByDistance(data)
							let  crtPosition = app.globalData.currentLocation.wxPosition
							let longitude =  crtPosition.longitude
							let latitude   =  crtPosition.latitude
							
							if(longitude && latitude){
								// 有定位
								this.currentDealer = this.dealersList[0]
							}else{
							    this.currentDealer = this.dealersList[Math.floor(Math.random() * this.dealersList.length)]
							}
							console.log('用户当前定位',longitude,latitude,this.currentDealer.name)
							
							
						} else {
							this.currentDealer = {}
						}
					} else {
						const {
							code,
							data
						} = await api.fetchDealerListByCityId({
							cityId,
							districtId,
							pcSerialGroupId
						})
						if (code === 1 && data.length) {
							this.dealersList = distance.sortDealersByDistance(data)
							this.currentDealer = this.dealersList[0]
						} else {
							this.currentDealer = {}
						}
					}
					this.checkInfo()
				} catch (error) {
					console.error(error)
				} finally {
					uni.hideLoading()
				}
			},
			cityPickerChange: function(e) {
				this.reqDealersList(this.cityList[e.target.value].id)
				this.cityIndex = e.target.value
				this.test = ''
				this.checkInfo()
			},
			dealersPickerChange: function(e) {
				this.dealersIndex = e.target.value
				this.checkInfo()
			},
		},
	}
</script>

<style lang="scss" scoped>
	.no-data {
		padding: 32rpx 0;
		text-align: center;
	}

	.get-preferential {
		overflow: hidden;
		background: #FFFFFF;
		width: 100%;
		height: 100%;
		padding-bottom: constant(safe-area-inset-bottom) ;
		padding-bottom: env(safe-area-inset-bottom) ;
		
		
	
		.getPhoneBtn {
			background-color: transparent;
			color: #777777;
			flex: 1;
			margin-left: 20rpx;
			height: 100%;
			display: flex;
			align-items: center;
			font-size: 34.5rpx;
		}

		.top-tit {
			width: 100%;
			height: 74rpx;
			background-color: #F8F8F8;
			font-size: 36rpx;
			color: #333333;
			padding: 0 26rpx;
			line-height: 74rpx;
			.close  {
				content: '';
				width: 30rpx;
				height: 30rpx;
				position: absolute;
				right: 32rpx;
				top:31rpx;
				margin-top: -4rpx;
				background: url(../../static/images/get-pfl-clsoe.png) 0 0 no-repeat;
				background-size: 25rpx 25rpx;
		
			}
		}

		.head-info {
			padding: 40rpx 40rpx;
			display: flex;
			align-items: center;

			image {
				width: 180rpx;
				height: 136rpx;
				vertical-align: middle;
			}

			.text-dec {
				margin-left: 20rpx;
				height: 136rpx;
				flex: 1;
				display: flex;
				flex-direction: column;
				color: #333333;
				justify-content: space-between;

				.title {
					font-size: 32rpx;
					font-weight: 600;
				}

				.serial {
					font-size: 24rpx;
				}

				.price {
					font-size: 24rpx;
					color: #999999;
				}
			}
		}

		.content {
			padding: 32rpx 32rpx 10rpx;
			box-sizing: border-box;

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
					width: 100rpx;
					/*#ifndef MP-WEIXIN */
					width: 120rpx;
					/* #endif */

				}

				.select {
					flex: 1;
					margin-left: 20rpx;
					height: 100%;
					display: flex;
					align-items: center;
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

				.clean-btn {
					width: 40rpx;
					height: 40rpx;
					background-image: url("../../static/images/close_btn.png");
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
					font-size: 32rpx;
					background-color: #cdcdcd;

					&.origin {
						background-color: #fa8943;
					}
				}
			}
		}

		.arrow {
			width: 12rpx;
			height: 12rpx;
			transform: rotate(45deg);
			border-top: 2rpx solid #999999;
			border-right: 2rpx solid #999999;
		}
	}
</style>
