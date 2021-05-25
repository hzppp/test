<template>
	<view class="choose-city">
		<!-- 侧边导航 -->
		<view class="side">
			<view class="item"  v-for="(cityIndex,index) in letterGroup" :key="index" @tap.stop="sidePoint(cityIndex)">
				{{cityIndex}}
			</view>
		</view>
		<!-- 当前城市 -->
		<view class="current-city">
			当前定位的城市：<text>{{cuurentPositioningCity}}</text>
		</view>
		<!-- 城市索引 -->
		<scroll-view class="scroll-view" :scroll-into-view="targetId" :scroll-y="true">
			<view class="city-index" v-for="(cityIndex,index) in letterGroup" :key="index" :id="cityIndex">
				<view class="index">
					{{cityIndex}}
				</view>
				<view class="city" v-for="(city,i) in cityList[index]" :class="{'isSelect':currentCity === city.name}" :key="i" @tap="changeCity(city)">
					{{city.name}}
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import api from '@/public/api/index'
import distance from '@/units/distance'

let app = getApp()
	export default {
		data() {
			return {
				letterGroup:[], //城市索引
				cityList: [], //城市列表
				targetId: 'A', //当前城市导航索引
                cuurentPositioningCity: "",
				currentCity: '', //当前城市
			}
		},
		async onLoad(options) {
            console.log('options :>> ', options);
			await distance.getLocation()
			this.getAllCityList()
            this.cuurentPositioningCity = app.globalData.currentLocation.selectedCityData.city || ""
            this.currentCity = options.name == "undefined" ? false:options.name || app.globalData.currentLocation.selectedCityData.city || ""
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
                console.log('item :>> ', item);
                this.$store.commit("changCity",item)
                let pages = getCurrentPages();  //获取所有页面栈实例列表
                let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
                prevPage.$vm.currentCity = item;   //修改上一页data里面的searchVal参数值为1211
                uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
                    delta: 1
                });
			}
		},
	}
</script>

<style lang="scss">
.choose-city {
	padding-bottom: 33rpx;
	.side {
		position: fixed;
		right: 0;
		top: 105rpx;
		width: 120rpx;
		height: 942rpx;
		font-size: 24rpx;
		text-align: right;
		display: flex;
		justify-content: space-around;
		flex-direction: column;
		z-index: 99;
		.item {
			padding-right: 20rpx;
		}
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
            &.isSelect {
                color: #FA8845;
            }
		}
	}
}
</style>
