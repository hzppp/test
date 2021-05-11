<template>
	<view class="plinput" v-show="isShow" :style="'bottom:' + keyboardHeight + 'px;'">
		<view class="comment-box">
			<textarea type="text" :focus="isFocus" @blur="inputblur" @input="getValue" @focus="getjpgd" class="textarea"
			 placeholder-class="form-input-gray" :value="inputValue" :adjust-position="false" auto-height="true" fixed="true" :cursor-spacing="'12px'"
			 :placeholder="'有话要说'" :show-confirm-bar="false" @keyboardheightchange='textKeyboardHeightChange'></textarea>
			<view class="ubb-button" @tap="ubbOpenShow"></view>
			<view class="submit-btn" v-show="!isOpen" >发送</view>
			<view class="submit-btn open" v-show="isOpen"  @tap="publishComment">发送</view>
		</view>
		<view class="ubb-box" :hidden="ubbOpen">
			<swiper class="swiper" indicator-dots="true" circular="true">
				<block v-for="(item,pidx) in faceList" :key="pidx">
					<swiper-item>
						<block v-for="(itemName,idx) in item" :key="idx">
							<view @tap.stop="selectubbImage(pidx,idx)" class="face-image">
								<image :src="'https://www1.pcauto.com.cn/autobbs/2013/images/emot/' + itemName + '.gif'" mode="widthFix" lazy-load="true"></image>
							</view>
						</block>
					</swiper-item>
				</block>
			</swiper>
		</view>
	</view>
</template>

<script>
	import api from '@/public/api/index'
	import ubb from '@/units/ubb'
	let app = getApp()
	export default {
		props:['fromPage'],
		data() {
			return {
				tabBarHeight: 0,
				keyboardHeight: 0,//键盘高度
				from: "",
				top: 0,
				indexObject: {},
				ubbOpen: true,
				face: [],
				isOpen: false,
				faceList: [],
				inputValue: "",
				isShow: false,
				isFocus: false,
				isblurhide: true
			}
		},
		mounted() {
			let systemInfo = uni.getSystemInfoSync();
			console.log('systemInfo========',systemInfo)
			this.face = ubb.face()
			this.faceList = ubb.splitObject(this.face, 21);
			let tabHeight = 53 + systemInfo.screenHeight - systemInfo.safeArea.bottom
			this.tabBarHeight = this.fromPage == 'index' ? tabHeight : 3;
		},
		methods: {
			ubbOpenShow() {
				this.ubbOpen = !this.ubbOpen
				if (this.ubbOpen) {
					this.inputHide()
				}
			},
			getValue(event) {
				let {
					value
				} = event.detail
				let str = value.replace(/(^\s*)|(\s*$)/g, "")
				this.inputValue = str
				if (str.length > 0) {
					this.isOpen = true
				} else {
					this.isOpen = false
				}
			},
			textKeyboardHeightChange(e){
				console.log('键盘高度：111=======',e.detail.height)
				this.keyboardHeight = e.detail.height - this.tabBarHeight;
			},
			inputblur() {
				this.isFocus = false
				this.keyboardHeight = 0;
				setTimeout(() => {
					if (this.ubbOpen) {
						this.inputHide()
					}
				}, 200)
			},
			getjpgd(event) { //键盘高度
				let {
					height
				} = event.detail
				this.top = height
				this.keyboardHeight = height == 0 ? '0' : (height - this.tabBarHeight);
				console.log('键盘高度：222=======',height,this.keyboardHeight)
				// if (this.from == 'dt') {
				// 	this.$emit('set-zw-height', height)
				// }
			},
			selectubbImage(pi, i) {
				let ubbImageIndex = pi * 21 + i
				let arr = Object.keys(this.face)
				let name = arr[ubbImageIndex]
				this.inputValue += name
				this.isOpen = true
			},
			publishComment() { //发表评论
				/*
				    beReplyId:被回复的评论id
				    beReplyUserId:被回复的用户id
				    content:评论内容
				    dynamicId:动态id
				    
				*/

				console.log('this.from', this.from)
				console.log('this.indexObject', this.indexObject)
				let parameter = {
					content: this.inputValue,
					dynamicId: this.indexObject.dynamicId
				}
				if (this.from == 'dt') {

				} else {
					parameter.beReplyId = this.indexObject.id
					parameter.beReplyUserId = this.indexObject.userId
				}
				let emitcontent = this.inputValue
				api.publishComment(parameter).then(res => {
					if (res.code == 1) {
						let pocketUserInfo = app.globalData.pocketUserInfo
						let getUserData = app.globalData.getUserData
						console.log('app.globalData====================',app.globalData.getUserData)
						this.$emit('add-pl', {
							isApprove: getUserData.isApprove || 0,
							userAvatar: getUserData.wxHead || pocketUserInfo.avatarUrl,
							userName: getUserData.wxName || pocketUserInfo.nickName,
							beReplyUserAvatar: this.indexObject.userAvatar,
							beReplyUserName: this.indexObject.userName,
							content: emitcontent,
							createTime: new Date().getTime()
						}, this.from)
					} else {
						this.showToast(res.msg || '内容不合法')
					}
				})
				this.inputHide()
				//
				//

				this.inputValue = ''
				this.isOpen = false

			},
			xianshi(obj, ly, isblurhide = true, vv = true) {
				let that = this
				console.log('xianshi========',obj)
				this.indexObject = obj
				this.from = ly
				this.isblurhide = isblurhide
				this.isShow = true
				setTimeout(function(){
					if (isblurhide || !vv) {
						that.isFocus = true
					}
				},200)
			},
			inputHide() {
				this.isFocus = false
				if (this.isblurhide) {
					this.isShow = false
				}
				this.$emit('remove-zw')
			},
			inputHide2() {
				this.isShow = false
			},
			showToast(text = '', duration = 2000) {
				this.$toast(text, 'none', duration);
			}
		}
	}
</script>

<style lang="less">
	@import '@/static/less/index.less';

	.plinput {
		background: #fff;
		border-top: 1px solid #ddd;
		position: fixed;
		width: 100%;
		z-index: 99;
		left: 0;
		bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
	.comment-box{
		padding: 14rpx 0 20rpx;
	}
	.textarea {
		z-index: 99;
		padding: 12rpx 24rpx;
		.db(middle);
		width: 487rpx;
		height: 44rpx;
		// line-height: 44rpx;
		font-size: 32rpx;
		border: 1px solid #d2d2d2;
		margin-left: 24rpx;
		/*
    position: fixed;
    left:0;
    bottom:0
    */
	}

	.ubb-button {
		.db(middle);
		.setIcon(46rpx, 46rpx, 184rpx, 186rpx);
		margin: 0rpx 0 0 30rpx;
	}

	.submit-btn {
		.db(middle);
		.tc;
		margin: 0rpx 0 0 5rpx;
		width: 107rpx;
		.seth(44rpx, 32rpx, #d0d0d0);

		&.open {
			color: #ce1330;
		}
	}

	.ubb-box {
		padding: 22rpx 32rpx 10rpx;
	}

	.face-image {
		.db(top);
		width: 98rpx;
		height: 80rpx;
		position: relative;

		image {
			width: 44rpx;
			height: 44rpx;
			.pa(50%, 50%);
			transform: translate(-50%, -50%);
		}
	}
</style>
