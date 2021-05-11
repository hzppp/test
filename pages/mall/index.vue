<template>
	<view class="mall-index">
		<loading ref="loading"></loading>
		<page-top :background="'#ce1330'" @getTopNavHeigth="topNavHei" :isShowBackBtn="true" :titleys="'#fff'" :btnys="'white'" :title.sync="title"></page-top>
		<view class="fixed-top" :style="'top:'+topHei+'px'">
			<view class="fl">当前积分: {{credits}}</view>
			<view class="fr arow-r" @tap="toRecordPage">兑换记录 </view>
		</view>
		<scroll-view lower-threshold="150" @scrolltolower="scrollGetData" :style="sclStyle" class="scroll-view" scroll-y="true" scroll-with-animation="true">
			<view class="banner" v-if="bannerList.length>0 && bannerList[0].picUrl">
				<swiper :autoplay="true" circular="true" interval="3000" @change="swiperChange">
					<block v-for="(item,index) in bannerList" :key="index">
						<swiper-item @tap="toDetailPage(item.giftId,'banner')">
							<image class="swiper-image" :src="item.picUrl"></image>
						</swiper-item>
					</block>
				</swiper>
				<!-- 自定义指示点 -->
				<view class="swiper-dot" v-if="bannerList.length>1">
					<view v-for="(item,index) in bannerList" :key="index" class="dot" :class="swiperCurrent==index?'dot-active':''"></view>
				</view>
			</view>
			<view class="list">
				<view class="card" v-for="(item,index) in goodsList"  :key="index" @tap="toDetailPage(item.id,'list')">
					<view class="img-wrap">
						<image class="img" mode="heightFix" lazy-load :src="item.coverPic"></image>
					</view>
					<view class="name">{{item.name}}</view>
					<view class="score"><text class="red">{{item.credits}}</text>积分<text class="price" v-if="item.price && item.price!=0">{{item.price}}元</text></view>
					<button class="btn btn-disabled" size="mini" type="default" v-if="item.stock==0 || item.isOverDue" @tap.stop="toDetailPage(item.id,'none')">已兑完</button>
					<button class="btn btn-disabled" style="font-size: 24rpx;" size="mini" type="default" v-else-if="item.isStart" @tap.stop="toDetailPage(item.id,'none')">{{item.startTime}}可兑</button>
					<button class="btn" size="mini" type="default" @tap.stop="toDetailPage(item.id,'button')" v-else>立即兑换</button>
				</view>
			</view>
			<view class="no-data">已经到底啦~</view>
		</scroll-view>
	</view>
</template>

<script>
	import api from '@/public/api/index'
	import pageTop from '@/components/pageTop/pageTop'
	import timeFormat from '@/units/timeFormat.js'
	export default {
		components:{
			'page-top': pageTop,
		},
		data() {
			return {
				title: "商城首页",
				topHei:64,
				sclStyle:'',
				swiperCurrent:0,
				bannerList:[],
				pageNo:1,
				pageSize:10,
				isLoadMore:true,
				isFirstLoad:true,
				goodsList:[],
				credits:0,
			}
		},
		async onLoad(options) {
			this.scrollStyle()
			this.scrollGetData()
		},
		onShow(){
		},
		methods: {
			topNavHei(data){
				this.topHei = data
			},
			scrollStyle(){
				const that = this;
				uni.getSystemInfo({
					success:(res)=>{
						// const scrollHei = res.windowHeight
						const scrollPt = that.topHei + 48*res.windowWidth/750 -1; 
						that.sclStyle = `padding-top:${scrollPt}px;`
					}
				})
			},
			async scrollGetData(){
				if(this.isLoadMore){
					await this.getScrollData()
				}
			},
			async getScrollData(){
				const that = this
				let {data} = await api.mallIndex({
					pageNo: that.pageNo,
					pageSize: that.pageSize
				})
				const totaPage =  Math.ceil(data.total / data.pageSize)
				if(totaPage>that.pageNo){
					that.pageNo++
					that.isLoadMore = true
				}else{
					that.isLoadMore = false
				}
				const nowTime = new Date().getTime();
				let giftList = data.giftList.map((item,index)=>{
					let isOverDue = false,isStart = false;
					if(item.endTime && item.endTime<nowTime){
						isOverDue = true
					}
					if(item.startTime && item.startTime>nowTime){
						isStart = true
					}
					item.coverPic = item.coverPic.replace('http:','https:')
					item.startTime = timeFormat (item.startTime,'time4')
					return {...item,isStart:isStart,isOverDue:isOverDue};
					// return Object.assign(item,{isStart:isStart,isOverDue:isOverDue});
				})
				that.goodsList = [...that.goodsList,...giftList]
				if(that.isFirstLoad){ 
					that.isFirstLoad = false; 
					that.credits = data.credits
					let bannerObj = data.banner
					if(bannerObj){
						let isToDetail = true
						// if(bannerObj.stock==0 || !bannerObj.id ||(bannerObj.endTime && bannerObj.endTime<nowTime) || (bannerObj.startTime && bannerObj.startTime>nowTime)){
						if(!bannerObj.giftId || bannerObj.giftId=='0'){
							isToDetail = false
						}
						bannerObj.isToDetail = isToDetail
						bannerObj.picUrl = bannerObj.picUrl.replace('http:','https:')
						that.bannerList = [data.banner]
					}
				}
			},
			toDetailPage(id,type){
				if(type=='banner' && this.bannerList.length>0 && !this.bannerList[0].isToDetail){
					return;
				}else if(type=='none'){
					return;
				}
				uni.navigateTo({
					url:"/pages/mall/detail?id="+id
				})
			},
			toRecordPage(){
				uni.navigateTo({
					url:"/pages/mall/recordList"
				})
			},
			swiperChange(e){
				this.swiperCurrent = e.detail.current
			}
		}
	}
</script>

<style lang="less">
	@import '@/static/less/mall.less';
	
	.scroll-view{
		.pa(0,0);
		width: 100%;
		height: 100%;
		background-color: #f8f8f8;
		box-sizing: border-box;
	}
</style>
