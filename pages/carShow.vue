<template>
	<form class="carShow" bindsubmit="formSubmit" report-submit="true">
		<form-pop ref="formpop"></form-pop>
		<page-top ref="pagetop" @get-top-nav-heigth="getTopNavHeigth" :background="'#fff'" :titleys="'#000'" :btnys="''" :title.sync="title"></page-top>
		<view :hidden="isfixNavShow" class="top-nav-fix" :style="'top:' + topHeight + 'px'">
			<view class="nav-item" v-for="(item,index) in navTopList" :key="index" @tap="topNav(index)">
				<!-- <view class="item-name {{item.serialGroupId == serialGroupId ? 'current':''}}">{{item.name}}</view> -->
				<button :class="'item-name '+ (item.serialGroupId == serialGroupId ? 'current':'')" form-type="submit" plain="true">{{item.name}}</button>
			</view>
		</view>
		<scroll-view class="scroll-view" scroll-y scroll-with-animation @scroll="scroll">
			<view class="top-nav-zw" :style="'height:' + topHeight + 'px'"></view>
			<view class="top-nav">
				<block v-for="(item,index) in navTopList" :key="index">
					<button form-type="submit" plain="true" class="nav-item" @tap="topNav(index)">
						<image :src="item.baiPic" mode="scaleToFill" lazy-load="true"></image>
						<view :class="'item-name ' + (item.serialGroupId == serialGroupId ? 'current':'')">{{item.name}}</view>
						<!-- <button formType="submit" plain="true">{{item.name}}</button> -->
					</button>
				</block>
			</view>
			<!--  -->
			<vr-module ref="vrModule" @none-vr-image="noneVrImage"></vr-module>
			<!-- 本地价 -->
			<view class="bd-price">
				<view class="tit">{{navTopList[serialInex].name}}</view>
				<view class="content" v-if="autoPrice">
					<view class="left">
						<view class="p1">
							<text>{{autoPrice.price}}</text>万
						</view>
						<view class="p2">官方指导价</view>
					</view>
					<view class="right">
						<view class="p1">
							首付
							<text>{{autoPrice.downPayment}}</text>万起
						</view>
						<view class="p2">分期购车</view>
					</view>
				</view>
			</view>
			<!-- 销售卡片 -->
			<view class="sales-box" v-if="salesList.length>0">
				<image class="sales-head" :src="salesList[indexSales].headUrl" mode="scaleToFill" lazy-load="true"></image>
				<view class="sales-name">
					{{salesList[indexSales].name}}
					<button class="change-btn" @tap="changeSals" form-type="submit" plain="true">换一个</button>
					<!-- <view class="change-btn" @tap="changeSals">换一个</view> -->
				</view>
				<view class="sales-dealer">{{salesList[indexSales].shortName}}</view>
				<view class="call-btn" @tap="callMobile"></view>
				<view class="im-btn"></view>
				<navigator class="im-btn-mask" target='miniProgram' app-id='wx6986c1a258647aae' :path="'pages/chat?salesId=' + salesList[indexSales].salesId"
				 hover-class="none" redirect></navigator>
				<view class="sale-label">
					<view class="db" v-if="salesList[indexSales].distance">距离{{salesList[indexSales].distance}}km</view>
					<view class="db">{{salesList[indexSales].dateText}}</view>
					<view class="db" v-if="salesList[indexSales].serviceCount>0">服务客户{{salesList[indexSales].serviceCount}}人</view>
				</view>
			</view>
			<!--  -->
			<view class="fg"></view>
			<!-- 卡券 -->
			<view class="coupon-list" v-if="vehicleOupons">
				<view class="tit">{{navTopList[serialInex].name}}福利</view>
				<coupon-list ref="coupon" @formShow="formShow" :from="'carShow'"></coupon-list>
			</view>
			<!--  -->
			<view class="basics-cs" v-if="modelAllData.length > 0">
				<view class="tit">
					基本参数
					<view class="more-btn" @tap="toDataassistant">更多参数</view>
				</view>
				<view class="basics-cs-box">
					<block v-for="(i,index) in showPartValue" :key="index">
						<block v-for="(v,vindex) in modelAllData" :key="vindex">
							<view v-if="i == v.name" class="item">
								<view class="p1">{{v.name}}</view>
								<view class="p2">{{v.value}}</view>
							</view>
						</block>
					</block>
				</view>
			</view>
			<view class="zw"></view>
		</scroll-view>
		<view class="fix-bottom-share-btn">
			<button class="share-btn" hover-class="none" open-type="share">找朋友参谋</button>
			<button class="zx-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" v-if="!phone">询底价</button>
			<view v-else class="zx-btn" @tap="liuzi">询底价</view>
		</view>
	</form>
</template>

<script>
	import vrModule from '@/components/vrModule/vrModule'
	import coupon from '@/components/coupon/coupon'
	import formpop from '@/components/formpop/formpop'
	import pageTop from '@/components/pageTop/pageTop'
	import api from '@/public/api/index'
	import distance from '@/units/distance'
	let app = getApp()
	export default {
		components: {
			'vr-module': vrModule,
			'coupon-list': coupon,
			'form-pop': formpop,
			'page-top': pageTop
		},
		data() {
			return {
				phone: false,
				isfixNavShow: true,
				topHeight: 0,
				autoPrice: '',
				vehicleOupons: '',
				serialInex: "",
				serialGroupId: 0,
				navTopList: [],
				modelAllData: [],
				salesList: [],
				indexSales: 0,
				title: "车型展厅",
				showPartValue: ['排量(mL)', '变速箱', '驱动方式', '燃料形式', '车身类型', '整车质保'],
			}
		},
		onPageScroll() {
			console.log('vs')
		},
		async onLoad(options) {
			// 列表
			let {
				data
			} = await api.getAutoSerialList()
			this.navTopList = data
			if (options.id) {
				for (let i in data) {
					let obj = data[i]
					if (options.id == obj.serialGroupId) {
						this.serialInex = i
					}
				}
			}
			this.serialGroupId = data[this.serialInex].serialGroupId || data[0].serialGroupId
			this.phone = app.globalData.pocketUserInfo.phone
			
			this.getJson()
			// 销售
			let salesId = app.globalData.salesId || 0
			api.getSalesList({
				manufacturerId: 1,
				orderByRanking: 1,
				pageNum: 1,
				pageSize: 10,
				regionId: app.globalData.currentLocation.cityData.cityId,
				salesId: salesId
			}).then(res => {
				let {
					data
				} = res
				let currentLocation = app.globalData.currentLocation
				if (!currentLocation.wxPosition.wsq) {
					data.list = distance.sortByDistance(currentLocation.wxPosition.latitude, currentLocation.wxPosition.longitude,
						data.list) || []
				}
				this.salesList = data.list || []
				for (let i in this.salesList) {
					let obj = this.salesList[i]
					obj.dateText = this.rDateString(obj.loginTime)
				}
				if (salesId > 0) {
					for (let iv in this.salesList) {
						let ivIndex
						let ivobj = this.salesList[iv]
						if (ivobj.salesId == salesId) {
							ivIndex = iv
						}
						if (ivIndex) {
							this.toFirst(this.salesList, ivIndex)
						}
					}
				}
				console.log('salesList', this.salesList)
				
			})
		},
		onShareAppMessage() {
			let obj = this.navTopList[this.serialInex]
			let title = `点我！免费看${obj.name}车系报价、参数、vr看车`
			let path = `pages/authorization?to=carShow&id=${obj.serialGroupId}`
			if (app.globalData.salesId) {
				path += `&salesId=${app.globalData.salesId}`
			}
			let imageUrl = obj.baiPic
			return {
				title: title,
				path: path,
				imageUrl: imageUrl
			}
		},
		methods: {
			formShow(name, type, obj){
				this.$refs.formpop.formShow(name,type,obj)
			},
			noneVrImage(){
				// this.$invoke('vr-module', 'setbaitu', this.navTopList[this.serialInex])
				this.$refs.vrModule.setbaitu(this.navTopList[this.serialInex])
			},
			getTopNavHeigth(heigth) {
				console.log('heigth', heigth)
				this.topHeight = heigth
			},
			formSubmit(e) {
				let {
					detail
				} = e
				api.saveFormId(detail.formId)
			},
			async getPhoneNumber(e) {
				let {
					detail = {}
				} = e
				console.log(e)
				if (detail.iv) {
					let {
						data
					} = await api.decryptPhone(detail.encryptedData, detail.iv)
					app.globalData.pocketUserInfo.phone = data.phoneNumber
					this.phone = data.phoneNumber
				}
				// this.$invoke('form-pop', 'formShow', 'form', 'serial', this.navTopList[this.serialInex])
				this.$refs.formpop.formShow('form', 'serial', this.navTopList[this.serialInex])
				
			},
			scroll(e) {
				let {
					detail
				} = e
				if (detail.scrollTop > 80) {
					this.isfixNavShow = false
				} else {
					this.isfixNavShow = true
				}
			},
			liuzi() {
				console.log(this.serialInex)
				// this.$invoke('form-pop', 'formShow', 'form', 'serial', this.navTopList[this.serialInex])
				this.$refs.formpop.formShow('form', 'serial', this.navTopList[this.serialInex])
			},
			topNav(i) {
				this.serialInex = i
				this.serialGroupId = this.navTopList[i].serialGroupId
				this.getJson()
				// this.$invoke('vr-module','getImages',id)
			},
			changeSals() {
				let len = this.salesList.length
				let i = this.indexSales
				i++
				if (i >= len) {
					i = 0
				}
				this.indexSales = i
			},
			toDataassistant() {
				let url = `/pages/dataassistant?id=${this.navTopList[this.serialInex].modelId}&serialGroupId=${this.serialGroupId}`
				uni.navigateTo({
					url
				})
			},
			callMobile() { //拨打电话
				let obj = this.salesList[this.indexSales]
				uni.makePhoneCall({
					phoneNumber: obj.mobile
				})
			},
			rDateString(loginTime) {
				let time = new Date().getTime()
				let t = 86400000
				let text
				let j = time - loginTime
				if (j > t) {
					text = '1天前回复'
				} else {
					let v = Math.floor(j / 1000 / 60 / 60)
					text = v + "小时前回复"
				}
				return text
			},
			toFirst(list, index) {
				return list.unshift(list.splice(index, 1)[0])
			},
			async getJson() {
				{
					// this.$invoke('vr-module', 'getImages', this.serialGroupId)
					this.$refs.vrModule.getImages(this.serialGroupId)
				}
				// 优惠
				let currentLocation = app.globalData.currentLocation
				console.log(currentLocation)
				// 优惠 - 本地价
				if (currentLocation) {
					api.getAutoPrice(currentLocation.cityData.cityId, this.serialGroupId).then(res => {
						console.log('getAutoPrice-本地价格', res)
						console.log(this.serialGroupId)
						// serialGroupId
						this.autoPrice = res.data
						
					})
					api.vehicleOupons(currentLocation.cityData.cityId, this.serialGroupId).then(res => {
						console.log('vehicleOupons-优惠券', res)
						this.vehicleOupons = res.data
						// this.$invoke('coupon-list', 'setcouponList', res.data)
						console.log(this.$refs)
						this.$nextTick(function(){
							if(this.vehicleOupons){
								this.$refs.coupon.setcouponList(res.data)
							}
						})
					})
				}
				// 基本参数
				/* api.getModelParamEquip(this.serialGroupId).then(data=>{
				    console.log('getModelParamEquip',data)
				}) */
				api.getModelData(this.navTopList[this.serialInex].modelId).then(data => {
					this.modelAllData = data.modelAllData
					console.log(data)
				})
			}
		}
	}
</script>

<style lang="less">
	@import '@/static/less/carShow.less';
</style>
