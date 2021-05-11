<template>
	<view class="putDynamic">
		<getFormidbox>
			<view class="content" slot="content">
				<page-top @page-back="pageBack" :background="'#fff'" :titleys="'#000'" :isstoppageback.sync="isstoppageback" :btnys="''" :title.sync="title"></page-top>
				<textarea maxlength="401" :value="textareaValue" @input="getTextareaValue" class="textarea" placeholder="请输入内容"
				 placeholder-class="placeholder"></textarea>
				<view class="imageList" v-if="!articleStorage">
					<block v-for="(item,index) in vvvvImageList" :key="index">
						<view class="image-box">
							<view class="del-btn" @tap="delImage(index)"></view>
							<image :src="item" mode="widthFix" lazy-load="false"></image>
						</view>
					</block>
					<view class="up-photo-btn" v-if="vvvvImageList.length != 9" @tap="pageChooseImage"></view>
				</view>
				<!-- 发布文章-文章图 -->
				<view class="article-banner-image" v-if="articleStorage">
					<image class="article-image" :src="articleStorage.articleCover" mode="widthFix" lazy-load=""></image>
					<view class="userAvatarUrl">
						<open-data type="userAvatarUrl"></open-data>
					</view>
					<open-data class="userNickName" type="userNickName"></open-data>
					<view class="article-title">{{articleStorage.title}}</view>
					<view class="article-icon"></view>
				</view>
				<!--  -->
				<picker @change="selectzt" range-key="themeName" :range="ztList" :value="ztIndex">
					<view class="zt-item">{{ztList[ztIndex].themeName}}</view>
				</picker>
				<picker @change="multiPickerChange" @columnchange="multiPickerColumnChange" mode="multiSelector" :range="province"
				 :value="provinceSelect" range-key="text" class="dz-item" :disabled="isDisabled">
					<view>{{(province[0][provinceSelect[0]].text || '') + ' ' + (province[1][provinceSelect[1]].text||'')}}</view>
				</picker>
				<!-- 选择经销商 -->
				<picker @change="selectDealerList" range-key="dealerName" :range="dealerList">
					<view class="jxs-item list-item" :value="dealerListIndex">
						{{dealerList[dealerListIndex].dealerName}}
					</view>
				</picker>
				<picker @change="selectVehicleList" range-key="serialGroupName" :range="vehicleList" :value="vehicleListIndex">
					<view class="chexi-item list-item">{{vehicleList[vehicleListIndex].serialGroupName}}</view>
				</picker>
				<!--  -->
				<view class="zw"></view>
				<view v-show="!isOpen" class="'submit-btn" >发表动态</view>
				<view v-show="isOpen" class="'submit-btn open" @tap="uploadImage">发表动态</view>
			</view>
		</getFormidbox>
	</view>
</template>

<script>
	import getFormidbox from '@/components/getFormIdModule/getFormIdModule'
	import pageTop from '@/components/pageTop/pageTop'
	import api from '@/public/api/index'
	const app = getApp()
	export default {
		components: {
			'page-top': pageTop,
			getFormidbox
		},
		data() {
			return {
				fromThemeId: "",
				province: [],
				provinceSelect: [],
				currentProvinceIndex: 0,
				cruuentCityIndex: 0,
				isstoppageback: false,
				isDisabled: false, //是否禁用地址选择
				isOpen: false,
				textareaValue: "", //输入框内容
				imageList: [], //图片列表
				vvvvImageList: [],
				dealerList: [{
					dealerName: "选择经销商"
				}], //经销商列表
				dealerListIndex: 0,
				vehicleList: [{
					serialGroupName: "选择车系"
				}], //车系列表
				vehicleListIndex: 0,
				title: "发布动态",
				ztIndex: 0,
				upLoadImageNumber: 0,
				upLoadImageList: [],
				articleStorage: "",
				dynamicStorage: "",
				ztList: [{
					themeName: "选择话题"
				}]
			}
		},
		watch: {
			'textareaValue'(nvalue) {
				this.isSubmitOpen()
				return nvalue
			},
			'vvvvImageList'(nList) {
				this.isSubmitOpen()
				return nList
			}
		},
		async onLoad(options) {
			this.articleStorage = uni.getStorageSync('articleStorage')
			this.dynamicStorage = uni.getStorageSync('dynamicStorage')
			if(this.dynamicStorage){
				this.textareaValue=this.dynamicStorage.content
				this.vvvvImageList=this.dynamicStorage.vvvvImageList
				this.ztIndex=this.dynamicStorage.ztIndex
				this.provinceSelect= this.dynamicStorage.provinceSelect
				this.dealerListIndex=this.dynamicStorage.dealerListIndex
				this.vehicleListIndex=this.dynamicStorage.vehicleListIndex
			}
			if(this.articleStorage){
				this.textareaValue = '分享文章'
			}
			this.fromThemeId = options.themeId
			this.getsf()
			this.getAllTheme()
			// this.getDealerList()
			this.getVehicle()
			/* setInterval(()=>{
			},1000) */
		},
		methods: {
			pageBack() {
				let dynamicStorage = {
					content: this.textareaValue,
					ztIndex: this.ztIndex || 0,
					vvvvImageList: this.vvvvImageList,
					type: 0,
					provinceSelect: [this.currentProvinceIndex, this.cruuentCityIndex],
					dealerListIndex: this.dealerListIndex,
					vehicleListIndex: this.vehicleListIndex
				}
				console.log(dynamicStorage)
				uni.setStorageSync('dynamicStorage', dynamicStorage)
				uni.navigateBack({
					delta: 1
				})
			},
			multiPickerColumnChange(event) {
				let {
					column,
					value
				} = event.detail
				let obj = this.province[column][value]
				if (column == 0) { //省份
					this.getCity(obj.provinceId)
				}
			},
			multiPickerChange(event) {
				let {
					value
				} = event.detail
				this.currentProvinceIndex = value[0] || 0
				this.cruuentCityIndex = value[1] || 0
				this.provinceSelect = [this.currentProvinceIndex, this.cruuentCityIndex]
				let cityId = this.province[1][this.cruuentCityIndex].regionId
				this.getDealerList(cityId)
			},
			selectzt(event) { //选择主题
				let {
					value
				} = event.detail
				this.ztIndex = value
				console.log(this.ztIndex)
			},
			selectDealerList(event) {
				let {
					value
				} = event.detail
				this.dealerListIndex = value
			},
			selectVehicleList(event) {
				let {
					value
				} = event.detail
				this.vehicleListIndex = value
			},
			pageChooseImage() { //选择图片
				let count = 9 - this.vvvvImageList.length
				uni.chooseImage({
					sizeType: ['compressed'],
					count: count,
					success: (async res => {
						let {
							tempFilePaths
						} = res
						//this.vvvvImageList = [...this.vvvvImageList,...tempFilePaths]
						console.log('chooseImage============',tempFilePaths)
						for (let i in tempFilePaths) {
							let imgPath = tempFilePaths[i]
							if (imgPath) {
								let iiindex = i
								let {
									data
								} = await api.checkImage(imgPath, iiindex)
								// console.log('checkImage=================',data)
								data = JSON.parse(data)
								console.log('上传图片', data)
								if (!data.data) {
									this.showToast('内容不合法')
									
								} else {
									this.vvvvImageList.push(imgPath)
								}
							}
					
						}
						console.log(this.vvvvImageList)
						
					})
				})
			},
			getTextareaValue(event) { //获取输入框内容
				let maxLen = 400
				let {
					value,
					cursor
				} = event.detail
				value = value.replace(/(^\s*)|(\s*$)/g, "")
				if (cursor > maxLen) {
					value = value.substr(0, maxLen)
					this.showToast('最多输入400字')
				}

				this.textareaValue = value
				// console.log(cursor)
			},

			delImage(i) { //删除图片
				this.vvvvImageList.splice(i, 1)
			},
			uploadImage() {
				let len = this.vvvvImageList.length
				if (len == 0) {
					this.submit()
					return false
				}
				for (let i in this.vvvvImageList) {
					let url = this.vvvvImageList[i]
					api.uploadUPC(url).then(res => {
						let data = JSON.parse(res.data)
						let url = data.files[0].url
						this.upLoadImageList[i] = url
						this.upLoadImageNumber++
						if (this.upLoadImageNumber == len) {
							this.upLoadImageNumber = 0
							this.submit()
						}
					})
				}
			},
			async submit() {
				console.log('textareaValue', this.textareaValue)
				console.log(this.upLoadImageList)
				console.log('image-list', this.upLoadImageList.join(''))
				// console.log(this.provinceSelect)
				// console.log(this.ztIndex)
				// console.log("发布动态")
				if (this.upLoadImageList.length > 0 && this.textareaValue.length == 0) {
					if (this.articleStorage) {
						this.textareaValue = '分享文章'
					} else {
						this.textareaValue = '分享图片'
					}
				}
				console.log(this.dealerList)
				let parameter = {
					content: this.textareaValue,
					themeId: this.ztList[this.ztIndex].themeId || 0,
					picListr: this.upLoadImageList,
					type: 0,
					regionId: this.province[1][this.provinceSelect[1]].regionId || 0,
					// dealerId:this.dealerList[this.dealerListIndex].dealerId,
					// serialGroupId:this.vehicleList[this.vehicleListIndex].serialGroupId
				}
				if (this.dealerList[this.dealerListIndex]) {
					parameter.dealerId = this.dealerList[this.dealerListIndex].dealerId
				}
				if (this.vehicleList[this.vehicleListIndex]) {
					parameter.serialGroupId = this.vehicleList[this.vehicleListIndex].serialGroupId
				}
				if (this.articleStorage) {
					parameter.article = this.articleStorage
					parameter.type = 1
				}
				let data = await api.putDynamic(parameter)
				console.log(data)
				if (data.data > 0) {
					app.globalData.firstPutDynamic = data.data
				}

				if (data.code == 1) {
					uni.removeStorageSync('dynamicStorage')
					uni.removeStorageSync('articleStorage')
					uni.reLaunch({
						url: `/pages/autoTribe?current=1`
					})
				} else {
					let msg = data.msg || '发布失败'
					this.showToast(msg)
				}
			},
			// 获取经销商
			async getDealerList(cityId = false) {
				let currentLocation = app.globalData.currentLocation
				let wxPosition = currentLocation.wxPosition
				let parameter = {
					regionId: cityId || currentLocation.cityData.cityId
				}
				//如果已经授权定位
				if (!wxPosition.wsq) {
					parameter.latitude = wxPosition.latitude
					parameter.longitude = wxPosition.longitude
				}
				let {
					data
				} = await api.getFormDealer(parameter)
				if(data){
					this.dealerList = [...this.dealerList, ...data]
				}else{
					this.dealerList = [...this.dealerList]
				}
				console.log('getDealerList===============',this.dealerList)
				

				// if(app.globalData)
			},
			async getVehicle() { //获取车系
				let {
					data
				} = await api.getVehicle()
				this.vehicleList = [...this.vehicleList, ...data]
				
				console.log('getVehicle', data)
			},
			showToast(title, duration = 2000) {
				this.$toast(title, 'none', duration);
			},
			async getsf() {
				let currentLocation = app.globalData.currentLocation
				let wxPosition = currentLocation.wxPosition
				let dddwww = {}
				//如果已经授权定位    
				if (!wxPosition.wsq) {
					dddwww = app.globalData.currentLocation.realPositionCS
					this.isDisabled = true
				} else {
					dddwww = {
						proId: app.globalData.currentLocation.cityData.proId || 3,
						cityId: app.globalData.currentLocation.cityData.cityId || 217
					}
					this.isDisabled = false;
				}
				let grInfo = await api.detailedMessage()
				console.log('grInfo', grInfo)
				let {
					cityId,
					provinceId
				} = grInfo.data
				if (cityId) {
					this.isDisabled = true
				}
				let currentProvinceId = provinceId || dddwww.proId //定位省份id
				let currentCityId = cityId || dddwww.cityId //定位城市id
				console.log('省份城市id:', currentProvinceId, currentCityId)
				this.getDealerList(currentCityId)
				let currentProvinceIndex = 0 //
				let cruuentCityIndex = 0
				let province = await api.getProvince('form')
				for (let i in province.data) {
					let obj = province.data[i]
					obj.text = obj.provinceName
					if (currentProvinceId == obj.provinceId) {
						currentProvinceIndex = i
					}
				}
				if (!currentProvinceId) {
					currentProvinceId = province.data[0].provinceId
				}
				let cityData = await this.getCity(currentProvinceId)
				for (let i in cityData) {
					let obj = cityData[i]
					if (currentCityId == obj.regionId) {
						cruuentCityIndex = i
					}
				}
				console.log('cityData', cityData)
				this.province[0] = province.data
				// 城市
				console.log('=城市=========',currentProvinceIndex,currentProvinceIndex)
				this.provinceSelect = [currentProvinceIndex, cruuentCityIndex]
				
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
			// 获取主题
			async getAllTheme() {
				let query = {
					page: '-1',
					pageSize: '-1',
					status: 2
				}
				if (this.fromThemeId) {
					query.themeId = this.fromThemeId
				}
				let {
					rows
				} = await api.getAllTheme(query)
				this.ztList = [...this.ztList, ...rows]
				if (this.fromThemeId) {
					for (let i in this.ztList) {
						let id = this.ztList[i].themeId
						if (id == this.fromThemeId) {
							this.ztIndex = i
						}
					}
				}
				
				console.log('getAllTheme================',rows)
			},
			isSubmitOpen() {
				let {
					length: imageLen
				} = this.vvvvImageList
				let {
					length: valueLen
				} = this.textareaValue
				let isOpen = false
				let isstoppageback = false
				if (valueLen > 0 || imageLen > 0) {
					isOpen = true
					isstoppageback = true
				}
				if (imageLen > 0 && valueLen == 0) {
					// this.textareaValue = "分享图片"
				}
				this.isOpen = isOpen
				this.isstoppageback = isstoppageback
				
			}
		}
	}
</script>

<style lang="less">
	@import '@/static/less/public.less';

	.content {
		position: relative;
		z-index: 9;
	}

	.textarea {
		padding: 32rpx;
		font-size: 32rpx;
		color: #333;
		width: 686rpx;
		height: 185rpx;
	}

	.placeholder {
		color: #d0d0d0;
	}

	.imageList {
		margin: 20rpx 0 40rpx 32rpx;
		font-size: 0;

		.image-box {
			.db();
			width: 154rpx;
			height: 154rpx;
			border: 1px solid #ebebeb;
			margin-right: 20rpx;
			margin-bottom: 20rpx;
			position: relative;
			overflow: hidden;

			.del-btn {
				position: absolute;
				right: 0;
				top: 0;
				.setbg(32rpx, 32rpx, 'putdt-del-icon.png');
			}
		}

		image {
			width: 154rpx;
		}
	}

	.up-photo-btn {
		.db();
		width: 154rpx;
		height: 154rpx;
		border: 1px solid #ebebeb;
		position: relative;

		&:before,
		&:after {
			display: block;
			content: "";
			width: 4rpx;
			height: 82rpx;
			background: #d0d0d0;
			.pa(50%, 50%);
			transform: translate(-50%, -50%);
		}

		&:after {
			transform-origin: 0 0;
			transform: rotate(90deg) translate(-50%, -50%);
		}
	}

	.zw {
		height: 100rpx;
	}

	.submit-btn {
		.seth(100rpx, 32rpx, #fff);
		.fb;
		.tc;
		width: 100%;
		position: fixed;
		left: 0;
		bottom: 0;
		background: #aaa;

		&.open {
			background: #ce1330;
		}
	}

	.zt-item,
	.dz-item,
	.list-item {
		margin-left: 32rpx;
		padding: 0 32rpx;
		.seth(100rpx, 28rpx, #666);
		padding-left: 44rpx;
		position: relative;
		border: 1px solid #ebebeb;
		border-left: 0;
		border-right: 0;
		.jt(20rpx, 20rpx, #999, 45deg);
		.ellipsis;
		width: 654rpx;

		&:after {
			right: 32rpx;
		}
	}

	.zt-item {
		&:before {
			display: block;
			content: "";
			.setIcon(30rpx, 32rpx, 230rpx, 187rpx);
			.pa(0, 50%);
			transform: translate(0, -50%);
		}
	}

	.dz-item {
		border-top: 0;

		&:before {
			display: block;
			content: "";
			.setIcon(28rpx, 32rpx, 262rpx, 187rpx);
			.pa(1rpx, 50%);
			transform: translate(0, -50%);
		}
	}

	.jxs-item {
		border-top: 0;

		&:before {
			display: block;
			content: "";
			.setbg(32rpx, 30rpx, 'dazhong_20191125_0.png');
			.pa(1rpx, 50%);
			transform: translate(0, -50%);
		}
	}

	.chexi-item {
		border-top: 0;

		&:before {
			display: block;
			content: "";
			.setbg(32rpx, 30rpx, 'dazhong_20191125_1.png');
			.pa(1rpx, 50%);
			transform: translate(0, -50%);
		}
	}

	.article-banner-image {
		font-size: 0;
		margin: 0 32rpx;
		position: relative;
		height: 360rpx;
		overflow: hidden;

		.article-image {
			width: 686rpx;
		}

		&:before {
			.pa(0, 0);
			content: "";
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, .2);
		}

		.userAvatarUrl {
			.pa(29rpx, 20rpx);
			.arc(40rpx);
			overflow: hidden;
		}

		.userNickName {
			.seth(40rpx, 24rpx, #fff);
			.pa(80rpx, 20rpx);
		}

		.article-title {
			width: 622rpx;
			position: absolute;
			left: 30rpx;
			bottom: 20rpx;
			color: #fff;
			font-size: 32rpx;
			line-height: 52rpx;
		}

		.article-icon {
			.setbg(75rpx, 25rpx, 'dazhong_20191125_2.png');
			.pa(580rpx, 28rpx);
		}
	}

	.pop {
		width: 600rpx;
		height: 336rpx;
		background: #fff;
		position: fixed;
		z-index: 9;
		top: 300rpx;
		left: 50%;
		transform: translate(-50%, 0);
		border-radius: 20rpx;
		.tc;

		.text {
			display: block;
			width: 100%;
			color: #333;
			font-size: 32rpx;
			line-height: 55rpx;
			.pa(0, 48rpx);
		}

		.btn {
			width: 244rpx;
			.seth(84rpx, 32rpx, #333);
			border: 1px solid #d0d0d0;
			border-radius: 84rpx;
			.pa(40rpx, 208rpx);
		}

		.btn1 {
			background: #ce1330;
			border-color: #ce1330;
			color: #fff;
			left: 312rpx;
		}
	}
</style>
