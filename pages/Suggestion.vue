<template>
	<view>
		<view class="box" :isFull="true" title="反馈意见">
			<view class="titleBar">
				<view style="color:#333333 ; font-size: 34rpx;">描述问题</view>
				<view style="color:#999999 ; font-size: 24rpx;">{{parseInt(data.content.length)}}/200</view>
			</view>
			<textarea class="testareav" placeholder-style="color:#CCCCCC; font-size: 28rpx;" v-model="data.content"
				placeholder="您在哪个页面，遇到了什么问题，详细描述有助于我们帮您快速解决哦.." maxlength="200"></textarea>
		</view>
		<view class="box" :isFull="true" title="上传图片">
			<view class="titleBar">
				<view style="color:#333333 ; font-size: 34rpx;">上传截图({{data.imgList.length}}/5)</view>
			</view>
			<view class="imgs" v-for="(item, index) in data.imgList" :key="index">
				<image class="img" @click="previewImage(index)" :src="item" mode="aspectFit" />
				<image @click="removeImage(index)" src="../static/images/suggestion.png" class="remove"></image>
			</view>
			<view class="imgs" @click="chooseImage">
				<view class="img">
					<image src="../static/images/imageS.png" style="width: 160rpx;height: 160rpx;"></image>
				</view>
			</view>
		</view>
		<button class="submit-btn" @click="submit">提交</button>
	</view>
</template>

<script>
	import domain from '@/configs/interface';
	import api from '@/public/api/index'
	export default {
		data() {
			return {
				data: {
					imgList: [],
					content: "",
					contact: "",
					ip:''

				},
			}
		},
		async onLoad() {
			let apidata = await api.getIP()
			this.ip = apidata.ip
		},
		methods: {
			chooseImage() {
				if (this.data.imgList.length >= 5) {
					this.$toast('最多选取5张')
					return
				}
				let _self = this;
				uni.chooseImage({
					sizeType: ['compressed', 'original'],
					sourceType: ['album', 'camera'],
					count: 5 - _self.data.imgList.length,
					success: function(res) {
						console.log(res)
						_self.data.imgList = _self.data.imgList.concat(res.tempFilePaths)
					},
					fail: function(err) {
						console.log(err);
					}
				});
			},
			removeImage(index) {
				this.data.imgList.splice(index, 1)
			},
			previewImage(index) {
				uni.previewImage({
					current: index,
					urls: this.data.imgList.map(r => r.path)
				});
			},
			submit() {
				console.log(this.data.content.length)
				if(this.data.imgList.length > 0){
					this.uploadImage()
				}else{
					this.submin([])
				}
				

			},
			uploadImage() {
				if (this.data.content.length == 0 || this.data.content == '') {
					this.$toast('请描述您的疑问')
					return
				}
				uni.showLoading({
					title: '提交中'
				})
				setTimeout(() => {
					uni.hideLoading()
				}, 8000)
				 var array = new Array()
				this.data.imgList.forEach((item, index) => {
					this.upload(item,array)
				})
			},


			async upload(item,array) {
				let data = await api.uploadUPC(this.ip)
				// console.log('updata', data, data.publicUrl)
				let pam = {
					'key': data.key,
					'policy': data.policy,
					'OSSAccessKeyId': data.ossAccessKeyId,
					'signature': data.signature,
				}
				uni.uploadFile({
					url: data.hostUrl,
					filePath: item,
					name: 'file',
					formData: pam,
					success: (res) => {
						 if (res.statusCode === 204) {
						      let url = data.publicUrl
						      console.log('url==' + url)
						      array.unshift(url)
						      // console.log('arraylength' + array.length)
						      if (array.length == this.data.imgList.length) {
						      	// 说明上传完了
								// console.log(this.submin(),_self.submin())
						      	this.submin(array)
						      }
						    }
						

					},
					fail: (error) => {
						console.log(error)
					}
				});

			},

			async submin(array) {
				let pam = {
					'content': this.data.content,
					'pic1': array[0]?array[0]:'',
					'pic2': array[1]?array[1]:'',
					'pic3': array[2]?array[2]:'',
					'pic4': array[3]?array[3]:'',
					'pic5': array[4]?array[4]:''
				}
				console.log('pam', pam)
				let res = await api.submit(pam)
				uni.hideLoading()
				if (res.code == 1) {
					this.$toast('提交成功')
					uni.navigateBack({

					})
				} else {
					this.$toast('提交失败')
				}
				console.log('data', res)
			}


		}
	}
</script>

<style lang="scss">
	.box {
		margin-bottom: 20rpx;
	}

	.titleBar {
		display: flex;
		// flex-wrap: ;
		justify-content: space-between;
		margin: 15rpx 32rpx;
	}

	.testareav {
		margin: 15rpx 32rpx;
		font-size: 32rpx;
	}

	.imgs {
		position: relative;
		display: inline-flex;
		flex-wrap: wrap;
		margin: 5rpx 32rpx;
		width: 160rpx;
		height: 160rpx;

		.img {
			width: 100%;
			height: 100%;
			border-radius: 10rpx;
			border: 1rpx solid #ebebeb;
		}

		.remove {
			line-height: 30rpx;
			text-align: center;
			border-radius: 10rpx;
			position: absolute;
			right: 0rpx;
			top: 0rpx;
			width: 30rpx;
			height: 30rpx;
			font-weight: bold;
			// background-color: #e53c25;
		}

	}

	.submit-btn {
		background-color: #FA8845;
		margin: 0 55rpx;
		position: absolute;
		bottom: 20rpx;
		width: 640rpx;
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 44rpx;
		font-size: 32rpx;
		color: #FFFFFF;
	}
</style>
