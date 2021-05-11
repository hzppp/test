<template>
	<view class="personalHome">
		<loading ref="loading"></loading>
		<plinput ref="plinput" @add-pl="addpl"></plinput>
		<page-top @add-pl="addpl" ref="pagetop" :background="'#fff'" :titleys="'#000'" :isstoppageback.sync="isstoppageback"
		 :btnys="''" :title.sync="title"></page-top>
		<view class="content">
			<scroll-view class="scroll-view" scroll-y scroll-with-animation>
				<view class="header">
					<image class="head-image" :src="headInfo.wxHead" mode="scaleToFill" lazy-load="true"></image>
					<view :class="'name-item  ' + headInfo.auth">
						<view class="name">{{headInfo.wxName}}</view>
						<view class="auth1-icon" v-if="headInfo.isApprove == 1"></view>
						<view class="auth2-icon" v-if="headInfo.official">官方认证</view>
					</view>
					<view class="text">
						<view class="db" @tap="toMyFollowPage('follow',headInfo.focusNum)">
							关注：<text class="number">{{headInfo.focusNum}}</text>
						</view>
						<view class="zw"></view>
						<view class="db" @tap="toMyFollowPage('fans',headInfo.fansNum)">
							粉丝：<text class="number">{{headInfo.fansNum}}</text>
						</view>
					</view>
					<view v-if="!headInfo.isMy" @tap="addFocus" :class="'follow-btn ' + (headInfo.focus ? '':'open')">{{headInfo.focus ? '取消关注':'+关注'}}</view>
				</view>
				<!-- header end -->
				<view class="dynamic-number">动态：{{total}}条</view>
				<view class="lists">
					<dynamic ref="dynamic" @getTotal="getTotal" @xianshi="plinputxianshi" :from="'personalHome'"></dynamic>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import pageTop from '@/components/pageTop/pageTop'
	import dynamic from '@/components/dynamic/dynamic'
	import plinput from '@/components/plinput/plinput'
	import api from '@/public/api/index'
	export default {
		components: {
			'page-top': pageTop,
			plinput,
			dynamic
		},
		data() {
			return {
				total: 0,
				userid: 0,
				title: "个人主页",
				isstoppageback: false,
				myFansNum: 0, //我的粉丝数
				myFocusNum: 0, //我的关注数
				headInfo: {},
			}
		},
		onShow() {
			// if(app.globalData && app.globalData.pocketUserInfo && app.globalData.pocketUserInfo.userId){
			//     this.getFansAndFocus(app.globalData.pocketUserInfo.userId);
			// }
			this.getUserInfo()
		},
		onLoad(options) {
			this.userid = options.userid;
			// this.$invoke('dynamic','startGetData',this.userid)
			
			this.$refs.dynamic.startGetData(this.userid)
		},
		methods: {
			plinputxianshi(obj,ly){
				this.$refs.plinput.xianshi(obj,ly)
			},
			addpl(obj) {
				// this.$invoke('dynamic','addpl',obj)
				this.$refs.dynamic.addpl(obj)
			},
			getTotal(number) {
				this.total = number
			},
			async addFocus() {
				let type = this.headInfo.focus
				let userId = this.headInfo.id
				let data
				if (!type) {
					data = await api.addFocus(userId);
					this.headInfo.fansNum++; //用户粉丝+1
					this.myFocusNum++; //我的关注数+1
				} else {
					data = await api.cancelFocus(userId);
					this.headInfo.fansNum--; //用户粉丝-1
					this.myFocusNum--; //我的关注数-1
				}
				let {
					code,
					msg
				} = data
				console.log(data)
				if (code == 1) {
					this.headInfo.focus = !this.headInfo.focus
				} else {
					this.showToast(msg)
				}
			},
			toMyFollowPage(type, number) {
				if (number > 0 && this.headInfo.isMy) {
					let url = `/pages/myfollow?type=${type}`
					uni.navigateTo({
						url
					})
				}
			},
			async getFansAndFocus(userid) {
				let {
					data
				} = await api.getUserInfo(userid);
				this.myFansNum = data.fansNum //我的粉丝数
				this.myFocusNum = data.focusNum //我的关注数
			},
			async getUserInfo() {
				let {
					data
				} = await api.getUserInfo(this.userid)
				console.log(data)
				this.headInfo = data
				this.headInfo.auth = ''
				if (this.headInfo.isApprove == 1 || this.headInfo.official == 1) {
					this.headInfo.auth = 'auth1'
				}
				if (this.headInfo.isApprove == 1 && this.headInfo.official == 1) {
					this.headInfo.auth = 'auth2'
				}
			},
			showToast(text = '', duration = 2000) {
				this.$toast(text, 'none', duration);
			}
		}
	}
</script>

<style lang="less">
	@import '@/static/less/personalHome.less';
</style>
