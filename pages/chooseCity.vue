<template>
	<view class="choose-city">
		<!-- 侧边导航 -->
		<view class="side">
			<view  v-for="(cityIndex,index) in letterGroup" :key="index" @tap="sidePoint(cityIndex)">
				{{cityIndex}}
			</view>
		</view>
		<!-- 当前城市 -->
		<view class="current-city">
			当前定位的城市：<text>{{currentCity}}</text>
		</view>
		<!-- 城市索引 -->
		<scroll-view class="scroll-view" :scroll-into-view="targetId" :scroll-y="true">
			<view class="city-index" v-for="(cityIndex,index) in letterGroup" :key="index" :id="cityIndex">
				<view class="index">
					{{cityIndex}}
				</view>
				<view class="city" v-for="(city,i) in cityList[index]" :key="i" @tap="changeCity(city)">
					{{city.name}}
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import api from '@/public/api/index'
let app = getApp()
	export default {
		data() {
			return {
				letterGroup:[], //城市索引
				cityList: [], //城市列表
				targetId: 'A', //当前城市导航索引
				currentCity: '' //当前城市
			}
		},
		onLoad() {
			this.getAllCityList()
		},
		methods: {
			async getAllCityList() {
				try{
					const {code,data:{letterGroup}} = await api.fetchAllCityList({hasHot:0})
					let tempLetterGroup = []
					let tempCityList = []
					if( code===1 ) {
						for(let k in letterGroup) {
							tempLetterGroup.push(k)
							tempCityList.push(letterGroup[k])
						}
					}
					this.letterGroup = tempLetterGroup
					this.cityList = tempCityList
				}catch(e){
					console.error(e)
				}
			},
			sidePoint(id) {
				this.targetId = id
			},
			changeCity(item) {
				this.currentCity = item.name
				console.log('item :>> ', item);
				// console.log('app. :>> ', app.globalData);
				uni.navigateTo({
					url: `/pages/YuyuePage?name=${item.name}&id=${item.id}`
				})
			}
		},
	}
</script>

<style lang="scss">
.choose-city {
	.side {
		position: fixed;
		right: 20rpx;
		top: 64rpx;
		width: 28rpx;
		height: 942rpx;
		font-size: 24rpx;
		text-align: center;
		display: flex;
		justify-content: space-around;
		flex-direction: column;
		z-index: 99;
		.side-city {
			display: flex;
		}
	}
	.current-city {
		font-size: 24rpx;
		color: #999999;
		line-height: 58rpx;
		margin-left: 39rpx;
		text {
			font-weight: bold;
			color: #333333;
		}
	}
	.scroll-view {
		height: calc(100vh - 58rpx);
	}
	.city-index {
		.index {
			height: 56rpx;
			line-height: 56rpx;
			background-color: #F5F5F5;
			padding-left: 26rpx;
		}
		.city {
			margin-left: 32rpx;
			line-height: 50rpx;
			height: 50rpx;
		}
	}
}
</style>
