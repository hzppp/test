<template>
	<view class="record">
		<page-top :background="'#fff'" :titleys="'#000'" :btnys="''" :title.sync="title"  @getTopNavHeigth="topNavHei"></page-top>
		<scroll-view class="scroll-view"  scroll-with-animation="true" :style="'padding-top:'+topHei+'px'" scroll-y="true" lower-threshold="150" @scrolltolower="scrollGetData">
			<view class="top-tip">
				<view class="tel">
					客服电话：400-123-4567 <br/>
					审核通过的订单将在10个工作日内发货，请留意物流信息
				</view>
			</view>
			<view class="record-list" v-if="listData.length>0">
				<view class="card" v-for="(item,index) in listData">
					<view class="l">
						<image :src="item.coverPic" mode="widthFix"></image>
					</view>
					<view class="r">
						<view class="info">
							<view class="name">
								{{item.giftName}}
							</view>
							<view class="time">
								{{item.createTime}}
							</view>
						</view>
						<view class="status review" v-if="item.status==1">
							审核中
						</view>
						<view class="status access" v-else-if="item.status==2">
							审核通过
						</view>
						<view class="status reject" v-else-if="item.status==3">
							审核不通过
							<br/>
							不通过原因：{{item.reason}}
						</view>
					</view>
				</view>
			</view>
			<view class="none-list" v-else>
				<view class="bg"></view>
				<view class="text">您还没兑换礼品哦~</view>
			</view>
			
		</scroll-view>
	</view>
	
</template>

<script>
	import api from '@/public/api/index'
	import pageTop from '@/components/pageTop/pageTop'
	import timeFormat from "@/units/timeFormat.js"
	export default {
		components:{
			'page-top': pageTop,
		},
		data() {
			return {
				title:'兑换记录',
				isLoadMore:true,
				pageNo:1,
				pageSize:10,
				topHei:64,
				sclStyle:'',
				listData:[]
			}
		},
		onLoad() {
			this.scrollGetData()
		},
		methods:{
			topNavHei(data){
				this.topHei = data
			},
			scrollGetData(){
				if(this.isLoadMore){
					this.getRecordList()
				}
			},
			
			async getRecordList(){
				let resData = await api.mallRecord({
					pageNo: this.pageNo,
					pageSize: this.pageSize
				})
				if(resData.hasNext){
					this.pageNo++
				}
				this.isLoadMore = resData.hasNext
				resData.rows.map((item,index)=>{
					item.createTime = timeFormat(item.createTime,'time5')
					item.coverPic = item.coverPic.replace('http:','https:')
				})
				this.listData = [...this.listData,...resData.rows]
			},
		}
	}
</script>

<style lang="less">
	@import '@/static/less/record.less';
	.scroll-view{
		.pa(0,0);
		width: 100%;
		height: 100%;
		background-color: #f8f8f8;
		box-sizing: border-box;
	}
</style>
