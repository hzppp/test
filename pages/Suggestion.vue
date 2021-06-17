<template>
	<view>
		<uni-card class="box" :isFull="true" title="反馈意见" :thumbnail="contentIcon">
			<textarea v-model="data.content" placeholder="您的反馈对我们非常重要,请在此输入."></textarea>
		</uni-card>
		<uni-card class="box" :isFull="true" title="上传图片" :thumbnail="imgListIcon">
			<view class="imgs" v-for="(item, index) in data.imgList" :key="index">
				<image class="img" @click="previewImage(index)" :src="item.path" mode="aspectFit" />
				<uni-icons @click="removeImage(index)" style="color: white; font-size: 30rpx;" type="closeempty" class="remove"></uni-icons>
			</view>
			<view class="imgs" @click="chooseImage">
				<view class="img add-img">
					<uni-icons style="position:absolute; line-height: 150rpx; font-size: 149rpx;" type="camera"></uni-icons>
				</view>
			</view>
		</uni-card>
		<uni-card class="box" :isFull="true" title="联系方式" :thumbnail="contactIcon">
			<input v-model="data.contact" placeholder="手机 QQ或e-mail,方便我们联系您" />
		</uni-card>
		<button class="submit-btn" @click="submit">提交</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: {
					imgList: [],
					content: "",
					contact: ""
				},
				contentIcon: require("./icons/suggestion.png"),
				contactIcon: require("./icons/contact.png"),
				imgListIcon: require("./icons/image.png")
			}
		},
		methods: {
			chooseImage() {
				let _self = this;
				uni.chooseImage({
					sizeType: ['compressed', 'original'],
					sourceType: ['album', 'camera'],
					success: function(res) {
						_self.data.imgList = _self.data.imgList.concat(res.tempFiles)
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
				this.$emit("submit", this.data)
			}
		}
	}
</script>

<style lang="scss">
	.box {
		margin-bottom: 20rpx;
	}
	.imgs {
		position: relative;
		display: inline-flex;
		flex-wrap: wrap;
		margin: 10rpx;
		width: 150rpx;
		height: 150rpx;
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
			background-color: #e53c25;
		}
		.add-img {
			background-color: #f0f0f0;
		}
	}
	.submit-btn {
		background-color: #49abe8;
		margin: 20rpx 0;
	}
</style>
