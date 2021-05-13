<template>
	<!-- 车系对比页面 -->
	<view class='carSerialsVS uni'>
		<count v-if="countPage.car.carSerialsVS" :channel="countPage.car.carSerialsVS"></count>
		<!-- #ifdef MP-WEIXIN -->
		<!-- <count :channel="10144"></count> -->
		<!-- #endif -->
		<!-- #ifdef MP-BAIDU -->
		<!-- <count :channel="10149"></count> -->
		<!-- #endif -->
		<load-fail v-if="loadFail" @init="init"></load-fail>
		<!-- 车系信息s -->
		<block v-if="leftSerial!=''&& rightSerial!=''">
			<car-info @changeCarSearial="changeCarSearial" :leftSerial="leftSerial" :rightSerial="rightSerial" :types="types"></car-info>
		</block>
		<!-- 车系信息e -->
		<view class="page" v-if="leftSerial!=''&&rightSerial!=''">
			<!-- 基本信息s -->
			<basic-info :leftSerial="leftSerial" :rightSerial="rightSerial"></basic-info>
			<!-- 基本信息s -->
		</view>
	</view>
</template>
<script>
	import carInfo from "@/components/carSerialsVS/carInfo.vue";
	import basicInfo from "@/components/carSerialsVS/basicInfo.vue";
	import Location from "@/units/Location.js";
	import { getVsData } from "@/jsfiles/carSerialsVS.js"; 
	import countPage from '@/configs/countPage';
	export default {
		components: {
			carInfo,
			basicInfo,
		},
		computed: {
			pageData() {
				return this.$store.state.pageData
			}
		},
		onUnload() {
			this.$store.state.pageData = {}
		},
		watch: {
			pageData(val) {
				if (this.tip == 0) {
					this.SerialIds = val.id + ',' + this.SerialIds.split(',')[1]
				} else {
					this.SerialIds = this.SerialIds.split(',')[0] + ',' + val.id
				}
				this.init()
			}
		},
		data() {
			return {
				countPage,//页面计数器id
				loadFail: false,
				types: 0, //顶部样式默认是0，滑动到一定距离后改成1
				SerialIds: "",
				city: "广州",
				cityId: 1,
				offon: true, //true走onload的init，false走onshow的init；防止onload数据还未初始化就执行了init(百度小程序)
				imagePklist: [], //pk对比图片
				worthRead: [], //买车必看pk
				leftSerial: "", //左边数据
				rightSerial: "", //右边数据
				tip: 0 //0left 1right
			}
		},
		onPageScroll(e) {
			console.log(e.scrollTop,"scrollTop")
			if (e.scrollTop <= 90) {
				console.log("types0")
				this.types = 0
			} else {
				console.log("types1")
				this.types = 1
			}
		},
		onLoad(options) {
			if (options.leftSerialId && options.rightSerialId) {
				this.SerialIds = options.leftSerialId + ',' + options.rightSerialId
			}
			// Location.init((data) => {
			// 	if (data) {
			// 		this.city = data.city
			// 		this.cityId = data.cityId
			// 	}
			// 	this.init()
			// })
            this.init()
		},
		methods: {
			async init() {
				try {
					let data = await getVsData(this.SerialIds, this.cityId);
                    console.log('data :>> ', data);
					this.imagePklist = data.imagePklist;
					this.worthRead = data.worthRead;
					this.leftSerial = data.leftSerial;
					this.rightSerial = data.rightSerial;
					this.offon = false
					console.log(data)
					uni.hideLoading()
				} catch (e) {
					uni.hideLoading()
					console.log(e)
					this.loadFail = true
				}
			},
			// 更换车系
			changeCarSearial(e) {
				this.tip = e;
				let unChangeSerialId = '',
					changeSerialId = '';
				if (e == 0) {
					changeSerialId = this.SerialIds.split(',')[0];
					unChangeSerialId = this.SerialIds.split(',')[1]
				} else {
					changeSerialId = this.SerialIds.split(',')[1];
					unChangeSerialId = this.SerialIds.split(',')[0]
				}
				uni.navigateTo({
					url: '/pages_car/chooseModels/chooseModels?navigateBack=6&unChangeSerialId=' + unChangeSerialId + '&changeSerialId=' +
						changeSerialId
				})
			}
		}
	}
</script>
<style lang="scss">
	.page {
		padding-top: 425rpx;
	}
</style>
