<template>
	<!-- 车型对比-添加车型 -->
	<view class='choose_models uni'>
		<count v-if="countPage.car.chooseModels.count" :channel="countPage.car.chooseModels.count"></count>
		<back-home></back-home>
		<block v-if="navigateBack != '2' && navigateBack != '4' && navigateBack != '6'&& navigateBack != '7'">
			<view class="tab">
				<block v-if="serialId != 0">
					<view :class="['tab_list',tab_inds==0?'tab_list_act':'']" @tap="selectTab(0)">
						<text>{{serialName}}</text>
						<view v-if="tab_inds==0" class="line"></view>
					</view>
				</block>
				<view :class="['tab_list',tab_inds==1?'tab_list_act':'']" @tap="selectTab(1)">
					<text>按品牌查找</text>
					<view v-if="tab_inds==1" class="line"></view>
				</view>
				<view :class="['tab_list',tab_inds==2?'tab_list_act':'']" @tap="selectTab(2)">
					<text>对比历史</text>
					<view v-if="tab_inds==2" class="line"></view>
				</view>
			</view>
		</block>
		<!-- 正售/停售模块s -->
		<block v-if="tab_inds==0">
			<count v-if="countPage.car.chooseModels.count1" :channel="countPage.car.chooseModels.count1"></count>
			<!-- #ifdef MP-BAIDU -->
			<!-- <count :channel="9849"></count> -->
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<!-- <count :channel="9786"></count> -->
			<!-- #endif -->
			<saleing v-if="carSale.length > 0" :compare="compare" :serialId="serialId" :serialName="serialName" @addCar="addCar" @showPop='showPop'
			 :addedData="addedData" :carSale="carSale" :carStopSale="carStopSale" :year="year"></saleing>
		</block>
		<!-- 正售/停售模块e -->
		<!-- 品牌查找模块s -->
		<block v-if="tab_inds==1&&Brands!=''">
			<count v-if="countPage.car.chooseModels.count2" :channel="countPage.car.chooseModels.count2"></count>
			<!-- #ifdef MP-BAIDU -->
			<!-- <count :channel="9847"></count> -->
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<!-- <count :channel="9784"></count> -->
			<!-- #endif -->
			<company :unChangeSerialId="unChangeSerialId" :serialGroups="serialGroups" :Brands="Brands" :navigateBack="navigateBack"></company>
		</block>
		<!-- 品牌查找模块end -->
		<!-- 对比历史模块s -->
		<block v-if="tab_inds==2">
			<count v-if="countPage.car.chooseModels.count3" :channel="countPage.car.chooseModels.count3"></count>
			<!-- #ifdef MP-BAIDU -->
			<!-- <count :channel="9848"></count> -->
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<!-- <count :channel="9785"></count> -->
			<!-- #endif -->
			<log-list @addCar="addCar" :serialName="serialName" :hadCompareCar="hadCompareCar" :addedData="addedData"></log-list>
		</block>
		<!-- 对比历史模块e -->
		<!-- 选择年限模块s -->
		<popup ref="popup" type="right" height="100%" width="100%" transition="slider" @tap="hideTc">
			<view class="saleing_years" @tap.stop @touchmove.stop>
				<view class="saleing_years_head">
					选择年款
				</view>
				<scroll-view scroll-y class="saleing_years_list">
					<view :class="['item',stopYearCur==-1?'act':'']" @tap="selectYear(-1,'全部年款')">
						全部年款
					</view>
					<block v-for="(item,index) in stopYearArr" :key="index">
						<view :class="['item',index==stopYearCur?'act':'']" @tap="selectYear(index,item)">
							{{item}}
						</view>
					</block>
				</scroll-view>
			</view>
		</popup>
		<!-- 选择年限模块end -->
	</view>
</template>
<script>
	import saleing from "@/components/chooseModels/Saleing.vue";
	import company from "@/components/chooseModels/company.vue";
	import logList from "@/components/chooseModels/logList.vue";
	import ContrastCar from "@/units/ContrastCar.js";
	import popup from "@/components/popup/popup.vue";
	import countPage from '@/configs/countPage';
	import {
		getAddedData,
		getModelListBySerialId,
		filterStopYear,
		getBrands
	} from "@jsfiles/models.js";
	export default {
		components: {
			saleing,
			popup,
			company,
			logList
		},
		computed: {
			pageData() {
				return this.$store.state.pageData
			}
		},
		data() {
			return {
				countPage,//页面计数器id
				tab_inds: 1,
				serialId: 0, //车型id
				compare: false,
				addedData: "", //已添加的车型数据
				carSale: [], //在售车型
				carStopSale: [], //停售车型
				carStopSaleAll: [], //所有停售车型
				stopYearArr: [], //停售车型年份
				stopYearCur: -1, //停售车型年款选择标志
				year: "全部年款",
				navigateBack: 2, //返回的页面
				serialName: "", //车型名字
				hadCompareCar: {}, //历史对比车型
				number: 0,
				Brands: "", //车系品牌数据
				unChangeSerialId: -1,
				changeSerialId: -1,
				serialGroups: [], //对比车系数组
			}
		},
		onLoad(o) {
			// o = {
			// 	"navigateBack": "6",
			// 	"unChangeSerialId": "3996",
			// 	"changeSerialId": "23054"
			// }
			this.navigateBack = (o.navigateBack ? parseInt(o.navigateBack) : 0);
			this.serialId = o.serialId || 0;
			this.serialName = o.serialName || "";
			this.unChangeSerialId = o.unChangeSerialId || -1;
			this.changeSerialId = o.changeSerialId || -1;
			this.pageInit(o)
			this.init()
		},
		watch: {
			pageData(val) {
				if (val.serialId) {
					this.serialId = val.serialId
					this.serialName = val.serialName
					this.tab_inds = val.tab_inds
					this.getModelListBySerialId_()
				}
			}
		},
		methods: {
			async init() {
				try {
					// 获取已添加的车型数据
					let data = await getAddedData(this.compare);
					console.log(data)
					// 获取车系品牌
					let Brands = await getBrands({
						unChangeSerialId: this.unChangeSerialId,
						changeSerialId: this.changeSerialId
					})
					this.Brands = Brands;
					this.addedData = data;
					this.number += 1
					this.serialGroups = Brands.serialGroups
					if (this.serialId != 0) {
						this.getModelListBySerialId_()
					}
				} catch (e) {
					console.log(e)
					this.$toast("网络错误")
				}
			},
			// 获取在售/停售数据
			async getModelListBySerialId_() {
				try {
					let data = await getModelListBySerialId(this.serialId)
					this.carSale = data.carSale
					this.carStopSaleAll = data.carStopSaleAll
					this.stopYearArr = data.stopYearArr
					if (data.carStopSale.length > 0) {
						try {
							let res = await filterStopYear(this.carStopSaleAll, 0, this.stopYearArr[0]);
							this.carStopSale = res.carStopSale;
							this.stopYearCur = res.stopYearCur
							this.year = res.year
						} catch (e) {}
					}
				} catch (e) {}
			},
			// 页面数据初始化
			pageInit(o) {
				if (o.compare) {
					this.compare = true
				} else {
					this.compare = false
				}
				if (this.navigateBack == 2) {
					this.tab_inds = 0
					uni.setNavigationBarTitle({
						title: this.serialName,
					})
				} else if (this.navigateBack == 4 || this.navigateBack == 6) {
					uni.setNavigationBarTitle({
						title: '选择车系',
					})
				} else if(this.navigateBack == 7){
					uni.setNavigationBarTitle({
						title: this.compare ? '车系对比-添加车型' : '选择车系',
					})
				}else {
					uni.setNavigationBarTitle({
						title: '车型对比-添加车型',
					})
				}
			},
			// 添加对比车型
			addCar(e) {
				if (this.addedData['id_' + e.id] || e.showParameter == '0') return;

				let addedData = this.addedData,
					key = "id_" + e.id;

				if (this.navigateBack != 1) {
					// 添加全局已选车型id
					this.addGlobalSelectCar(e.id);
				}
				if (this.compare) {
					ContrastCar.add(e.id, e.carname, e.price, true);
					let hadCompare = ContrastCar.getHadCompare();
					let obj = {
						id: e.id,
						name: e.carname,
						price: e.price,
						selected: true
					}
					ContrastCar.addHadCompare(obj);
				}
				
				console.log(this.navigateBack)
				uni.navigateBack({
					// #ifndef MP-BAIDU
					delta: 1,
					// delta: this.navigateBack,
					// #endif
					// #ifdef MP-BAIDU
					delta: 1,
					// #endif
					
				})
			},
			/**
			 * 添加全局已选车型
			 * @param {Number} id 车型id
			 */
			addGlobalSelectCar(id) {
				var key = "id_" + id;
				this.$store.state.selectCars[key] = true;
				this.$store.state.selectCars['newSelect'] = id;
			},
			// 显示年款弹窗
			showPop() {
				this.$refs.popup.show()
			},
			// 选择年款
			async selectYear(index, year) {
				let res = await filterStopYear(this.carStopSaleAll, index, year);
				this.carStopSale = res.carStopSale;
				this.stopYearCur = res.stopYearCur
				this.year = res.year
				this.hideTc()
			},
			selectTab(index) {
				this.tab_inds = index
				if (index == 2) {
					let compareArr = Object.keys(this.hadCompareCar)
					if (compareArr.length == 0) {
						let hadCompareCar = [];
						let CompareCarObj = ContrastCar.getHadCompare();
						let CompareCarObjToArr = Object.keys(ContrastCar.getHadCompare()).reverse();
						for (let i in CompareCarObjToArr) {
							let item = CompareCarObjToArr[i];
							hadCompareCar.push(CompareCarObj[item])
						}
						this.hadCompareCar = hadCompareCar
					}
				}
			},
			// 关闭年限选择弹窗
			hideTc() {
				this.$refs.popup.close()
			}
		}
	}
</script>
<style lang="scss">
	.choose_models {
		min-height: 100%;
	}

	.lu-popup-wrapper {
		height: 100% !important;
		top: 0 !important;
		background: rgba(0, 0, 0, 0.5);
		z-index: 2000 !important;

		.saleing_years {
			width: 620rpx;
			height: 100%;
			background: #fff;
			position: absolute;
			top: 0;
			right: 0;
			padding: 0 36rpx;

			.saleing_years_head {
				height: 100rpx;
				width: 100%;
				@include flex_center_center;
				font-size: 36rpx;
				color: #121c35;
				font-weight: bold;
			}

			.saleing_years_list {
				height: calc(100% - 100rpx);
				width: 100%;
				font-size: 28rpx;
				color: #121c35;

				.item {
					height: 108rpx;
					width: 100%;
					border-bottom: 1px solid #e5e6f0;
					@include flex_left_center;

					&:last-child {
						border: 0;
					}
				}

				.act {
					color: #3377d7;
				}
			}
		}
	}

	.tab {
		width: 100%;
		height: 90rpx;
		@include flex_center_bottom;

		.tab_list {
			width: 33.3333%;
			height: 75rpx;
			@include flex_center_center;
			position: relative;

			text {
				display: block;
				margin: 0 auto;
				font-size: 30rpx;
				color: #a1a2a4;
				position: relative;
				padding: 0 20rpx;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}

			.line {
				position: absolute;
				left: 0;
				right: 0;
				margin: 0 auto;
				bottom: 0;
				height: 6rpx;
				width: 34rpx;
				background: #3377d7;
				border-radius: 3rpx;
			}
		}

		.tab_list_act {
			text {
				font-weight: bold;
				color: #121c35;
			}
		}
	}
</style>
