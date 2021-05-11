<template>
	<view class="my">
		<!-- <view class="header">
	            <view class="userAvatarUrl">
	                <open-data type="userAvatarUrl"></open-data>
	            </view>
	            <open-data class="userNickName" type="userNickName"></open-data>
	        </view> -->
		<!-- <view class="topnav">
	            <view class="return" @tap="navigateBack"></view>
	            <view class="toIndex" @tap="topIndexPage"></view>
	        </view> -->
		<page-top ref="pagetop" :background="'#fff'" :titleys="'#000'" :btnys="''" :title.sync="title"></page-top>
		<view class="scroll">
			<scroll-view class="scroll-view" scroll-y scroll-with-animation>
				<view class="coupon" v-if="couponList.length > 0">
					<block v-for="(item,index) in couponList" :key="index">
						<view :class="'coupon-box bg-' + (item.type == 1 && 'red' || item.type == 2 && 'blue' || 'yellow') + ' bg-' + ((item.status == 1 || item.status == 3) && 'gray')" @tap="ruleShow(index)">
							<view class="coupon-name">{{item.title}}</view>
							<view class="coupon-desc">{{item.subhead}}</view>
							<view class="coupon-date">有效期：{{item.startTime}}-{{item.endTime}}</view>
							<view class="coupon-line">
								<view class="line"></view>
							</view>
							<view class="coupon-btn" @tap.stop="tocouponCode(index)">
								<!-- 1：已使用，2：去使用，3：已过期 -->
								{{item.status == 1 && "已使用" || item.status == 2 && "去使用" || "已过期"}}
							</view>
						</view>
					</block>
					<view class="end-text">已经到底啦</view>
					<view class="zw"></view>
				</view>
				<block v-else>
					<view class="welfareActivity-none">
						<view class="toWelfare" @tap="toWelfare"></view>
					</view>
				</block>
			</scroll-view>
		</view>
		<block v-if="isRuleShow">
			<view class="rule-desc">
				<view class="content">
					<view class="rule-desc-content">
						<view class="title">
							{{currentCoupon.title}}
						</view>
						<view class="sub-title">
							{{currentCoupon.subhead}}
						</view>
						<view class="date">
							有效期：{{currentCoupon.startTime}}-{{currentCoupon.endTime}}
						</view>
						<text class="p">{{currentCoupon.instructions}}</text>
					</view>
					<view class="close-btn" @tap="ruleHide"></view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	import login from '@/units/login'
	import api from '@/public/api/index'
	import pageTop from '@/components/pageTop/pageTop'
	let app = getApp()
	export default {
		components: {
			'page-top': pageTop
		},
		data() {
			return {
				isRuleShow: false,
				currentCoupon: {},
				couponList: [],
				title: "我的优惠券",
			}
		},
		async onShow() {
			await login.login()
			await api.getPocketUserInfo()
			let userOupons = await api.getUserOupons()
			for (let i in userOupons.data) {
				userOupons.data[i].endTime = userOupons.data[i].endTime.replace(/-/g, ".")
				userOupons.data[i].startTime = userOupons.data[i].startTime.replace(/-/g, ".")
			}
			this.couponList = userOupons.data
			api.getUser()
		},
		async onLoad(options) {

		},
		methods: {
			ruleShow(i) {
				console.log(i)
				this.currentCoupon = this.couponList[i]
				this.isRuleShow = true
			},
			ruleHide() {
				this.isRuleShow = false
			},
			tocouponCode(i) {
				let obj = this.couponList[i]
				if (obj.status == 1 || obj.status == 3) {
					console.log("过期 || 已使用")
					return false
				}

				app.globalData.currentCoupon = obj
				let url = '/pages/couponCode'
				uni.navigateTo({
					url
				})
			},
			toWelfare() {
				uni.reLaunch({
					url: "/pages/welfareActivity"
				})
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
			}
		}
	}
</script>

<style lang="less">
	@import '@/static/less/my.less';
</style>
