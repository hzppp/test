<template>
	<view class="detail" v-if="giftInfo">
		<page-top :background="'#fff'" :titleys="'#000'" :btnys="''" :title.sync="title"></page-top>
		<view class="mian-top">
			<image class="img" :src="giftInfo.detailPic" mode="widthFix"></image>
			<view class="name">
				{{giftInfo.name}}
			</view>
			<view class="score">
				{{giftInfo.credits}} <text class="unit"> 积分</text><text class="price" v-if="giftInfo.price && giftInfo.price!=0">{{giftInfo.price}}元</text>
			</view>
		</view>
		<view class="mian-center" v-if="giftInfo.detail || giftInfo.descPic">
			<view class="title">
				礼品详情
			</view>
			<view class="line" v-html="giftInfo.detail">
				
			</view>
			<image class="img" v-if="giftInfo.descPic" :src="giftInfo.descPic" mode="widthFix"></image>
		</view>
		<!-- <view class="fix-btn" @tap="exchange">
			立即兑换
		</view> -->
		<view class="fix-btn disabled" v-if="giftInfo.stock==0 || giftInfo.isOverDue">已兑完</view>
		<view class="fix-btn disabled" v-else-if="giftInfo.isStart">{{giftInfo.startTime}}可兑</view>
		<view class="fix-btn" @tap="exchange" v-else>立即兑换</view>
		
		<view class="mask" v-if="isShowMask">
			<view class="body">
				<view class="content">该礼品仅限车主兑换<br/>您还不是车主</view>
				<view class="btn-group">
					<view class="btn btn-cancel" @tap="cancelExchange">
						暂不认证
					</view>
					<view class="btn btn-ensure" @tap="applyAuthen">
						申请车主认证
					</view>
				</view>
			</view>
			
		</view>
	</view>

</template>

<script>
	import api from '@/public/api/index'
	import pageTop from '@/components/pageTop/pageTop'
	import timeFormat from '@/units/timeFormat.js'
	import toast from '@/units/showToast.js'
	let app = getApp()
	export default {
		components: {
			'page-top': pageTop,
		},
		data() {
			return {
				title: '商品详情',
				giftId:0,
				giftInfo: null,
				userInfo: null,
				isShowMask:false,
			}
		},
		onLoad(options){
			// this.userInfo = app.globalData.getUserData
			// console.log('userInfo====',this.userInfo)
			this.giftId = options.id || 2
			this.getGiftData(this.giftId)
		},
		onShow(){
			this.getUserInfo()
		},
		methods:{
			async getGiftData(id){
				const that = this
				let {data} = await api.mallGoodDetail({
					giftId: id
				})
				const nowTime = new Date().getTime();
				let isOverDue = false,isStart = false;
				if(data.endTime && data.endTime<nowTime){
					isOverDue = true
				}
				if(data.startTime && data.startTime>nowTime){
					isStart = true
				}
				data.startTime = timeFormat (data.startTime,'time4')
				data.detailPic = data.detailPic.replace('http:','https:')
				data.descPic = data.descPic.replace('http:','https:')
				data.detail = data.detail.replace(/\n/g,'<br/>')
				data = {...data,isStart:isStart,isOverDue:isOverDue}
				// Object.assign(data,{isStart:isStart,isOverDue:isOverDue});
				this.giftInfo = data
				this.title = this.giftInfo.name
			},
			async getUserInfo(){
				let {data} = await api.getUser({})
				this.userInfo = data //data.isApprove 0待审核-，1-审核通过，2-未审核，3-未通过
			},
			exchange(){
				const nowTime = new Date().getTime()
				if(this.giftInfo.isVehicle==1 && this.userInfo.isApprove!=1){ /* 限定已认证车主兑换 */
					this.isShowMask = true
					return;
				}else if(this.giftInfo.status==2){
					toast('礼品已下架','none',1500)
					return;
				}else if(this.giftInfo.stock==0){
					toast('礼品库存不足','none',1500)
					return;
				}else if( this.giftInfo.startTime && nowTime<this.giftInfo.startTime){
					toast('尚未开始兑换','none',1500)
					return;
				}else if(this.giftInfo.endTime && nowTime>this.giftInfo.endTime){
					toast('兑换已截止','none',1500)
					return;
				}else if(parseInt(this.userInfo.credits) < this.giftInfo.credits){
					toast('积分不足','none',1500)
					return;
				}else {
					uni.navigateTo({
						url:'/pages/mall/ensureOrder?id='+this.giftId
					})
				}
			},
			cancelExchange(){
				this.isShowMask = false
			},
			applyAuthen(){
				uni.navigateTo({
					url:'/pages/message?from=mall'
				})
			},
		}
	}
</script>

<style lang="less">
	@import '@/static/less/mall.less';

	page,
	.detail {
		width: 100%;
		height: 100%;
		background-color: #f8f8f8;
	}
</style>
