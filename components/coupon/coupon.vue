<template>
	<view class="coupon">
		<block v-for="(item,index) in couponList" :key="index">
			<view :class="'coupon-box bg-' + (item.type == 1 ? 'blue' : 'red')" @tap="ruleShow(index)">
				<view class="coupon-name">{{item.title}}</view>
				<view class="coupon-desc">{{item.subhead}}</view>
				<view class="coupon-date">有效期：{{item.startTime}}-{{item.endTime}}</view>
				<view class="coupon-line">
					<view class="line"></view>
				</view>
				<view class="coupon-icon"></view>
				<view :class="'coupon-type color-' + (item.type == 1 ? 'blue':'red')" >{{item.type == 1?'通用券':'车型券'}}</view>
				<button class="coupon-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber(index,$event)" @tap.stop="stop" v-if="!phone">一键抢券</button>
				<view v-else class="coupon-btn" @tap.stop="getPhoneNumber(index,$event)">一键抢券</view>
			</view>
		</block>
		<view class="load-more-btn" @tap="morebtn" v-if="from == 'welfareActivity' && isMoreBtnShow">
			<text>更多福利</text>
			<image class="icon" src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/arrow-bottom.png" mode="aspectFit"></image>
		</view>
		<block v-if="isRuleShow">
			<view :class="'rule-desc ' + (couponList[couponListIndex].type == 1 ? 'blue' : 'red')">
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
						<text class="explain">使用说明</text>
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
				uni.showLoading({
					title: '正在加载...'
				})
				let obj = this.couponList[i]
				let {
					detail
				} = e
				console.log('getPhoneNumber===============',e)
				if (detail.iv) {
					//申请试用手机号点击允许时触发
					
					this.$gdp('YCZ_phoneGrantPermissions')
					
					try {
						let {
							data
						} = await api.decryptPhone(detail.encryptedData, detail.iv)
						if (data && data.phoneNumber) {
							uni.setStorageSync('userPhone', data.phoneNumber)
							this.phone = data.phoneNumber						
						}						
					} catch (err) {
						this.$toast('手机号码授权失败', 'none', 1500);
						console.error(err)
					}
				}
				try {
					const detailObj = await this.reqCouponDetail(obj.id)
					this.formpopShow('form', detailObj)
					this.isRuleShow = false
				} catch (err) {

				} finally {
					uni.hideLoading()
				}
			},
			setcouponList(list) {
				this.phone = uni.getStorageSync('userPhone');
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
			},
			// 请求优惠券详情
			async reqCouponDetail (id) {
				try {
				  const res = await api.fetchCouponDetail({id})
				  if (res.code == 1) {
				    return Object.assign(res.data, {regionList: res.data.cityList})
				  }
				} catch(err) {
				  this.$toast('获取优惠券详情失败', 'none', 1500);
				  console.error(err)
				  throw new Error('获取优惠券详情失败')
				}
			}
		}
	}
</script>

<style lang="less">
	@import '@/static/less/coupon.less';
</style>
