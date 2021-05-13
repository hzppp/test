<template>
	<view class="coupon">
		<block v-for="(item,index) in couponList" :key="index">
			<view :class="'coupon-box bg-' + (item.type == 1 && 'red' || item.type == 2 && 'blue' || 'yellow')" @tap="ruleShow(index)">
				<view class="coupon-name">{{item.title}}</view>
				<view class="coupon-desc">{{item.subhead}}</view>
				<view class="coupon-date">有效期：{{item.startTime}}-{{item.endTime}}</view>
				<view class="coupon-line">
					<view class="line"></view>
				</view>
				<view class="coupon-icon"></view>
				<button class="coupon-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber(index,$event)" @tap.stop="stop" v-if="!phone">一键抢券</button>
				<view v-else class="coupon-btn" @tap.stop="getPhoneNumber(index,$event)">一键抢券</view>
			</view>
		</block>
		<view class="load-more-btn" @tap="morebtn" v-if="from == 'welfareActivity' && isMoreBtnShow">更多福利></view>
		<block v-if="isRuleShow">
			<view class="rule-desc">
				<view class="content">
					<view class="rule-desc-content">
						<view class="title">
							{{couponList[couponListIndex].title}}
						</view>
						<view class="sub-title">
							{{couponList[couponListIndex].subhead}}
						</view>
						<view class="date">
							有效期：{{couponList[couponListIndex].startTime}}-{{couponList[couponListIndex].endTime}}
						</view>
						<text class="p">{{couponList[couponListIndex].instructions}}</text>
						<button class="rule-form-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber(couponListIndex,$event)"
						 @tap.stop="stop" v-if="!phone">一键抢券</button>
						<view v-else class="rule-form-btn" @tap.stop="getPhoneNumber(couponListIndex,$event)">一键抢券</view>
					</view>
					<view class="close-btn" @tap="ruleHide"></view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	import api from '@/public/api/index'
	let app = getApp()
	export default {
		props: ["from"],
		data() {
			return {
				couponListIndex: 0,
				// currentCoupon:{},
				isRuleShow: false,
				phone: 0,
				isMoreBtnShow: true,
				couponList: []
			}
		},
		methods: {
			stop() {
				console.log('stop')
			},
			ruleShow(i) {
				console.log(i)
				this.couponListIndex = i
				// this.currentCoupon = this.couponList[i]
				this.isRuleShow = true
			},
			ruleHide() {
				this.isRuleShow = false
			},
			morebtn() {
				this.$emit('load-more-coupon')
			},
			morebtnHide() {
				this.isMoreBtnShow = false
			},
			morebtnShow() {
				this.isMoreBtnShow = true
			},
			async getPhoneNumber(i, e) {
				let obj = this.couponList[i]
				let {
					detail
				} = e
				console.log('getPhoneNumber===============',e)
				if (detail.iv) {
					let {
						data
					} = await api.decryptPhone(detail.encryptedData, detail.iv)
					app.globalData.pocketUserInfo.phone = data.phoneNumber
					this.phone = data.phoneNumber
				}
				
				this.formpopShow('form', obj)
				this.isRuleShow = false
			},
			setcouponList(list) {
				this.phone = ''
				if (app.globalData.pocketUserInfo && app.globalData.pocketUserInfo.phone) {
					this.phone = app.globalData.pocketUserInfo.phone
				}
				for (let i in list) {
					list[i].endTime = list[i].endTime.replace(/-/g, ".")
					list[i].startTime = list[i].startTime.replace(/-/g, ".")
				}
				this.couponList = list
				console.log(this.couponList)
			},
			formpopShow(name, obj) {
				this.$emit('formShow', name, 'coupon', obj, '领取优惠券')
				// this.$invoke('../form-pop','formShow',name,'coupon',obj)
			}
		}
	}
</script>

<style lang="less">
	@import '@/static/less/coupon.less';
</style>
