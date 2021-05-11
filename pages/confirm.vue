<template>
	<view class="confirm">
		<view class="topnav">
			<view class="return" @tap="navigateBack"></view>
			<view class="toIndex" @tap="topIndexPage"></view>
		</view>
		<view class="tit">
			确认行驶证信息
		</view>
		<view class="form">
			<view class="inp">
				<text>您的姓名</text>
				<input type="text" :value="user.name" disabled>
			</view>
			<view class="inp">
				<text>车牌号</text>
				<input type="text" :value="user.carNum" disabled>
			</view>
			<view class="inp">
				<text>车架号</text>
				<input type="text" :value="user.vin" disabled>
			</view>
			<view class="carNum" v-if="morecarNum">
				<view class="p1">
					可选择其他识别结果
				</view>
				<view class="carList" v-for="(item,index) in vinList" :key="index">{{item}}</view>
			</view>
			<view class="inp">
				<text>车系</text>
				<view>
					<picker @change="bindMultiPickerColumnChangeser" :range="serialList" range-key="name" :value="indexSerial" class="input-view auto-input">
						<view>{{serialList[indexSerial].name}}</view>
					</picker>
				</view>
			</view>
			<view class="confirm-btn" @tap="confirm">确认认证</view>

			<view class="shibie">
				识别的信息不正确？
				<view @tap="reUpload" class="reUpload">可点击这里重新识别
					<!-- <chooseImage class="choose-btn-button"></chooseImage> -->
				</view>

			</view>


		</view>
		<view class="fail" v-if="fail">
			<view class="uploadbtn" @tap="reUpload">
			</view>
			<view class="close" @tap="close" v-if="fail"></view>
		</view>
		<!-- <view class="ssss"></view> -->
		<view class="bg" v-if="fail"></view>
	</view>
</template>

<script>
	import api from '@/public/api/index'
	import chooseImg from '@/units/chooseImg'
	let app = getApp()
	export default {
		data() {
			return {
				user: {},
				morecarNum: false,
				vinList: [],
				showUpload: false,
				fail: false,
				serialList: [],
				indexSerial: 0
			}
		},
		onLoad(options) {
			console.log(options)
			this.user.model = options.model;
			this.user.name = options.name;
			this.user.carNum = options.carNum;
			this.user.picUrl = options.picUrl;
			console.log(options.vin instanceof Array)
			if (options.vin instanceof Array) {
				this.morecarNum = true
				this.user.vin = options.vin[0]
				this.user.vinList = options.vin.splice(0, 1)

			} else {
				this.user.vin = options.vin
			}
			this.getseriesList()
			console.log(this.showUpload)
		},
		methods: {
			getseriesList() {
				api.getAutoSerialList().then(res => {
					// console.log('this.currentObj',this.currentObj)
					let {
						data
					} = res
					this.serialList = data;
					this.user.sgName = this.serialList[this.indexSerial].name
					this.user.sgId = this.serialList[this.indexSerial].serialGroupId
					console.log(this.serialList)
				})
			},
			async confirm() {
				let ddd = await api.Carapprove(this.user)
				console.log(ddd)
				if (ddd.data > 0) {
					app.globalData.renzhengchezhu = ddd.data
				}
				if (ddd.code == 1) {
					uni.showToast({
						title: '认证成功',
						duration: 1000,
						mask: true
					})
					uni.navigateTo({
						url: `/pages/message?carNum=${this.carNum}&model=${this.model}&name=${this.name}&vin=${this.vin}&picUrl=${this.user.picUrl}`
					})
				} else if (ddd.code == 2) {
					uni.showToast({
						title: '已经认证过啦',
						icon: 'none',
						duration: 1000,
						mask: true
					})
					uni.navigateTo({
						url: `/pages/message?carNum=${this.carNum}&model=${this.model}&name=${this.name}&vin=${this.vin}&picUrl=${this.user.picUrl}`
					})
				} else if (ddd.code == 0) {
					uni.showToast({
						title: '车架号已存在，请重新上传识别',
						icon: 'none',
						duration: 1000,
						mask: true
					})
				} else {
					uni.showToast({
						title: '认证失败',
						icon: 'none',
						duration: 1000,
						mask: true
					})
				}

			},
			bindMultiPickerColumnChangeser(e) {
				let {
					detail
				} = e
				this.indexSerial = detail.value,
					this.user.sgName = this.serialList[detail.value].name
				this.user.sgId = this.serialList[detail.value].serialGroupId
			},
			async reUpload() {
				this.showUpload = true
				let sdd = await chooseImg.chooseImage()
				let data = await chooseImg.uploadLicence(sdd.files[0].url)
				if (data.code == 1) {
					uni.hideLoading()
					uni.navigateTo({
						url: `/pages/confirm?carNum=${data.data.carNum}&model=${data.data.model}&name=${data.data.name}&vin=${data.data.vin}&picUrl=${sdd.files[0].url}`
					})
				} else {
					uni.hideLoading()
					// this.$emit('fail')
					this.fail = true
				}
			},
			navigateBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			topIndexPage() {
				uni.reLaunch({
					url: "/pages/index"
				})
			},
			close() {
				this.fail = false
			},
		}
	}
</script>

<style lang="less">
	@import '@/static/less/confirm.less';
</style>
