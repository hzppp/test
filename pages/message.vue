<template>
	<view class="message">
		<share-pop ref="sharepop"></share-pop>
		
		<page-top :background="'none'" :titleys="'#fff'" :btnys="'white'" :title.sync="title"></page-top>
		<view class="topbg"></view>
		<!-- <view class="topnav">
			<view class="return" @tap="navigateBack"></view>
			<view class="toIndex" @tap="topIndexPage"></view>
		</view>
		<view class="navtit">个人信息</view> -->
		<view class="card">
			<view class="user-info-box" v-if="user.isApprove=='1'">
				<view class="tit">认证车主信息</view>
				<view class="user-info-list-item">
					姓名：<text>{{user.name}}</text>
				</view>
				<view class="user-info-list-item">
					车牌号：<text>{{user.carNum}}</text>
				</view>
				<view class="user-info-list-item">
					车架号：<text>{{user.vin}}</text>
				</view>
				<view class="user-info-list-item">
					车系车型：<text>{{user.model}}</text>
				</view>
			</view>
			<view v-if="user.isApprove=='0'" class="mupload" @tap="reUpload">

			</view>
			<view class="verifying" v-if="user.isApprove=='2'">
				<view class="logo"></view>
				<view class="text">车主资料认证在审核中...</view>
			</view>
			<view class="verifyFail" v-if="user.isApprove=='3'">
				<view class="logo"></view>
				<view class="text">车主认证审核失败，请重新上传行驶证</view>
				<view class="btn" @tap="reUpload">重新上传</view>
			</view>

		</view>
		<view class="baseInfo">
			<view class="title">基本信息</view>
			<view class="form">
				<view class="inp inp1">
					<input type="text" :value="user.nickName" @input="name" maxlength="18">
					<!-- <view class="zishu"><text>{{txtLenNum[0]}}</text>/18</view> -->
				</view>
				<view class="inp inp2">
					<input type="number" :value="user.mobile" @input="mobile" maxlength="11">
					<!-- <view class="zishu"><text>{{txtLenNum[1]}}</text>/11</view> -->
				</view>
				<view class="inp inp3 province" @tap="opencity">
					{{user.regionName}}{{selProvince}}{{selCity}}
				</view>
				<view class="inp inp4">
					<input type="text" placeholder="请输入收件地址" :value="user.address" @input="address" maxlength="20">
					<!-- <view v-else class="placeholder">请输入收件地址</view> -->
					<!-- <view class="zishu"><text>{{txtLenNum[1]}}</text>/11</view> -->
				</view>
			</view>
		</view>
		<view class="citypicker" v-if="isCity">
			<view class="btn">
				<text class="fl" @tap="closecity()">取消</text>
				<text class="fr sure" @tap="btnSureHandle()">确认</text>
			</view>
			<picker-view @change="bindChange" :value="value">
				<picker-view-column class="prolist">
					<block v-for="(item,index) in province" :key="index">
						<view :data-id="item.provinceId">{{item.provinceName}}</view>
					</block>
				</picker-view-column>
				<picker-view-column class="prolist">
					<block v-for="(item,index) in citys" :key="index">
						<view>{{item.regionName}}</view>
					</block>
				</picker-view-column>
			</picker-view>
		</view>
		<view class="mask" v-if="isCity"></view>
		<view class="save" @tap="submit">
			保存
		</view>
		<view class="fail" v-if="fail">
			<view class="uploadbtn" @tap="reUpload">
				<!-- <chooseImage class="choose-btn-button"></chooseImage> -->
			</view>
			<view class="close" @tap="close" v-if="fail"></view>
		</view>
		<view class="bg" v-if="fail"></view>
	</view>
</template>

<script>
	import login from '@/units/login'
	import api from '@/public/api/index'
	import chooseImg from '@/units/chooseImg'
	import shareSuccess from '@/components/shareSuccess/shareSuccess'
	import pageTop from '@/components/pageTop/pageTop'
	let app = getApp()
	export default {
		components: {
			'page-top': pageTop,
			'share-pop': shareSuccess
		},
		data() {
			return {
				title: '个人信息',
				isConfirm: false,
				user: {},
				selectIndex: "",
				selectCity: "",
				province: [],
				citybgName: "",
				indexCity: {},
				txtLenNum: [0, 0, 0],
				selecti1: 0,
				citys: [],
				value: [0, 0],
				isCity: false,
				selProvince: "",
				selCity: "",
				fail: false,
				from:'',
			}
		},
		async onLoad(options) {
			this.from = options.from
		},
		async onShow() {
			if (app.globalData.renzhengchezhu) {
				// this.$invoke('share-pop','shareSuccessShow',app.globalData.renzhengchezhu,'认证成功')
				this.$refs.sharepop.shareSuccessShow(app.globalData.renzhengchezhu, '认证成功')
				app.globalData.renzhengchezhu = 0
			}

			let user = await api.detailedMessage()
			console.log(user)
			this.user = user.data
			this.user['picUrl'] = user.picUrl
			this.selectCity = this.user.regionName
			this.user.regionId = this.user.cityId
			this.user.nickName = this.user.nickName ? this.user.nickName : ''
			this.user.mobile = this.user.mobile ? this.user.mobile : ''
			this.txtLenNum[0] = this.txtLen(this.user.nickName)
			this.txtLenNum[1] = this.txtLen(this.user.mobile)
			let province = await api.getProvince('form')
			this.province = province.data
			await this.getCity(province.data[0].provinceId)
		},
		methods: {
			btnSureHandle() { //点击确定, $emit通知父组件page页面, 并将选择的省市区发送给父组件
				let value = this.value;
				this.selProvince = this.province[value[0]].provinceName
				this.selCity = this.citys[value[1]].regionName
				this.isCity = false
				this.user.regionName = ""
				this.user.provinceId = this.province[value[0]].provinceId
				this.user.regionId = this.citys[value[1]].regionId
			},
			bindChange(e) {
				let e_value = e.detail.value;
				let provinceNum = e_value[0]; //省份
				let cityNum = e_value[1]; //城市
				if (this.value[0] != provinceNum) { //第一列滚动处理
					let id = this.province[provinceNum].provinceId;
					this.value = [provinceNum, 0];
					this.getCity(id)
				} else if (this.value[1] != cityNum) { //第二列滚动处理
					let id = this.citys[cityNum].regionId;
					this.value = [provinceNum, cityNum];
				}

			},
			close() {
				this.fail = false
			},
			opencity() {
				this.isCity = true
			},
			closecity() {
				this.isCity = !this.isCity
			},
			navigateBack() {
				uni.reLaunch({
					url: '/pages/mypage'
				})
				// uni.navigateBack({
				//     delta: 1
				// })
			},
			topIndexPage() {
				uni.reLaunch({
					url: "/pages/index"
				})
			},

			async submit() {
				if (!this.submitCheck()) return
				console.log(this.user)
				let ddd = await api.userMessageEntering(this.user)
				console.log(ddd)
				if (ddd.code == 1) {
					uni.showToast({
						title: '基本信息已保存成功',
						duration: 1000,
						mask: true
					})
					// if(this.from = 'mall'){
					// 	setTimeout(()=>{
					// 		uni.navigateBack({
					// 			delta:1
					// 		})
					// 	},1000)
					// }
				}
				console.log(ddd)
			},
			name(e) {
				this.user.nickName = e.detail.value
				let obj = this.txtLen(e.detail.value)
				this.txtLenNum[0] = obj
			},
			mobile(e) {
				this.user.mobile = e.detail.value
				let obj = this.txtLen(e.detail.value)
				this.txtLenNum[1] = obj
			},
			province(e) {
				this.user.province = e.detail.value
			},
			address(e) {
				this.user.address = e.detail.value
			},
			async reUpload() {
				this.showUpload = true
				this.fail = false;
				let sdd = await chooseImg.chooseImage()
				let data = await chooseImg.uploadLicence(sdd.files[0].url)
				if (data.code == 1) {
					uni.hideLoading()
					uni.navigateTo({
						url: `/pages/confirm?carNum=${data.data.carNum}&model=${data.data.model}&name=${data.data.name}&vin=${data.data.vin}&picUrl=${sdd.files[0].url}`
					})
					// this.user.isApprove = '1'
					// this.user.name = data.data.name
					// this.user.carNum =data.data.carNum
					// this.user.vin = data.data.vin
					// this.user.model =data.data.model
					// this.user.picUrl = sdd.files[0].url

				} else {
					uni.hideLoading()
					this.fail = true
					// this.$emit('fail')
				}
			},
			// 获取字符串长度
			txtLen(txt) {
				var _txt = txt;
				var iCount = 0;
				var sStr = _txt.split("");
				for (var i = 0; i < sStr.length; i++) {
					var strTemp = escape(sStr[i]);
					if (strTemp.indexOf("%u", 0) == -1) {
						iCount = iCount + 1;
					} else {
						iCount = iCount + 1;
					}
				}
				return iCount;
			},
			async getCity(id) {
				let data = await api.getRegionByProvince(id)
				this.citys = data.data
			},
			submitCheck() {
				let t = this,
					isok = true,
					tips = ""
				if (!t.user.nickName) {
					isok = false;
					tips = '请填写昵称';
				}
				// else if (!t.user.mobile) {
				// isok = false;
				// tips = '请填写您的手机号码';
				// }else if (!t.user.provinceId) {
				// isok = false;
				// tips = '请选择省份城市';
				// }else if(!t.user.name || !t.user.carNum || !t.user.vin){
				// isok = false;
				// tips = '请上传车架信息';
				// }
				// tips && showToast(tips)
				if (tips) {
					uni.showToast({
						title: tips,
						icon: 'none',
						duration: 1000,
						mask: true
					})
				}
				return isok
			}
		}
	}
</script>

<style lang="less">
	@import '@/static/less/confirm.less';

	.verifying .logo {
		display: inline-block;
		width: 120rpx;
		height: 120rpx;
		background: url(https://www1.pcauto.com.cn/pocket/xcx/yqdazhong/img20191128/ing_03.jpg) no-repeat;
		background-size: 100% 100%;
	}

	.verifying {
		padding: 40rpx 0;
	}

	.verifying,
	.verifyFail {
		color: #666666;
		font-size: 28rpx;
	}

	.verifyFail .logo {
		display: inline-block;
		width: 130rpx;
		height: 130rpx;
		background: url(https://www1.pcauto.com.cn/pocket/xcx/yqdazhong/img20191128/fail_03.jpg) no-repeat;
		background-size: 100% 100%;
	}

	.verifyFail .btn {
		width: 240rpx;
		height: 72rpx;
		background: #ce1330;
		color: #fff;
		border-radius: 36rpx;
		text-align: center;
		line-height: 72rpx;
		display: inline-block;
		margin-top: 10rpx;
	}

	.card {
		min-height: 260rpx;
		text-align: center;
		vertical-align: middle
	}

	.placeholder {
		padding-left: 90rpx;
		color: #d0d0d0;
	}

	.user-info-box {
		text-align: left;

		.tit {
			.seth(60rpx, 40rpx);
			.fb;
			margin-bottom: 12rpx;
		}

		.user-info-list-item {
			.seth(52rpx, 28rpx, #999);

			text {
				color: #666;
			}
		}
	}

	.inp4 {
		&::before {
			display: block;
			content: "";
			.setbg(32rpx, 33rpx, 'dazhong_20191203_0.png');
			.pa(35rpx, 39rpx);
		}
	}
</style>
