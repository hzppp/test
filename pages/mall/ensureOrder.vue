<template>
	<view class="ensure-order">
		<page-top :background="'#fff'" :titleys="'#000'" :btnys="''" :title.sync="title"></page-top>
		<view class="card">
			<view class="order-info">
				<image class="img" :src="giftInfo.coverPic" mode="widthFix"></image>
				<view class="info">
					<view class="name">
						{{giftInfo.name}}
					</view>
					<view class="score">
						{{giftInfo.credits}} <text class="unit"> 积分</text>
					</view>
					<view class="num">
						x 1
					</view>
				</view>
			</view>
			<view class="addr-info">
				<view class="title">
					收货人信息 <view class="btn" v-if="!addrInfo" @tap="chooseAddr">选择收货人信息</view><view class="btn" v-else @tap="chooseAddr">修改收货人信息</view>
				</view>
				<block  v-if="addrInfo">
					<view class="p">{{addrInfo.userName}} </view>
					<view class="p">{{addrInfo.telNumber}} </view>
					<view class="p">
						{{addrInfo.provinceName}}{{addrInfo.cityName}}{{addrInfo.countyName}}{{addrInfo.detailInfo}}
					</view>
				</block>
			</view>
		</view>
		
		
		<view class="fix-btn" @tap="exchange">
			{{giftInfo.credits}}积分兑换
		</view>
		
		<view class="mask" v-if="isShowMask">
			<view class="body">
				<view class="content">请先完善收货人信息</view>
				<view class="btn-group">
					<view class="btn btn-cancel" @tap="cancelChoose">
						取消
					</view>
					<view class="btn btn-ensure" @tap="applyAuthen">
						填写信息
					</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	import api from '@/public/api/index'
	import pageTop from '@/components/pageTop/pageTop'
	import toast from '@/units/showToast.js'
	export default {
		components: {
			'page-top': pageTop,
		},
		data() {
			return {
				title: '订单确认',
				giftId:0,
				giftInfo: null,
				addrInfo:null,
				isShowMask:false
			}
		},
		onLoad(options){
			this.giftId = options.id || 2
			this.getGiftData(this.giftId)
		},
		onShow(){
		},
		methods:{
			async getGiftData(id){
				const that = this
				let {data} = await api.mallGoodDetail({
					giftId: id
				})
				this.giftInfo = data
			},
			async exchange(){
				let addrInfo = this.addrInfo
				if(!addrInfo){ 
					toast('请填写收货人信息','none',1500) 
					return
				}
				let resData = await api.mallCreateOrder({
					address:`${addrInfo.provinceName} ${addrInfo.cityName} ${addrInfo.countyName} ${addrInfo.detailInfo}`,
					giftId:parseInt(this.giftId),
					name: addrInfo.userName,
					phone: addrInfo.telNumber
				})
				if(resData.code!=1){
					toast(resData.msg,'none',2000)
					return;
				}
				let data = resData.data;
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 3]  //商城首页
				prevPage.$vm.credits -= this.giftInfo.credits //积分处理
				prevPage.$vm.goodsList.map((item,index)=>{
					if(item.id==this.giftInfo.id){
						item.stock -= 1
					}
					return item;
				})//库存处理
				toast('已提交兑换申请，请在兑换记录查看订单审核情况','none',2000)
				setTimeout(()=>{
					uni.navigateBack({
						delta:2
					})
				},2000)
			},
			chooseAddr(){
				this.isShowMask = true
			},
			cancelChoose(){
				this.isShowMask = false
			},
			applyAuthen(){
				uni.chooseAddress({
					success:(res)=>{
						this.cancelChoose()
						this.addrInfo = res
					},
					fail:(err)=>{
						console.log('chooseAddress-2------',err)
					}
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
