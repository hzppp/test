<template>
	<!-- 品牌查找组件 -->
	<view class="company" :style="[{height}]">
		<scroll-view scroll-y class="company_box" :scroll-into-view="toView">
			<block v-if="navigateBack=='6'&&serialGroups.length>0">
				<view id="anchorPos-group"></view>
				<serial-group :serialGroups="serialGroups"></serial-group>
			</block>
			<view class="hot_company" v-else>
				<view class="hot_company_head" id="anchorPos-hot">
					热门品牌
				</view>
				<view class="hot_company_con">
					<block v-for="(item,index) in hotBrands" :key="index">
						<view class="item" @tap="toSerials(item.id)">
							{{item.name}}
						</view>
					</block>
				</view>
			</view>
			<view class="brands">
				<block v-for="(item,index) in brandsAll" :key="index">
					<view class="brands_list">
						<view class="brands_list_head" :id="'anchorPos-'+item.index">
							{{item.index}}
						</view>
						<view class="item_box">
							<block v-for="(it,inds) in item.brands" :key="inds">
								<view class="item" @tap="toSerials(it.id)">
									<image :src="it.logo+'?t=0011'" :lazy-load="false" mode="aspectFill"></image>
									<text>{{it.name}}</text>
								</view>
							</block>
						</view>
					</view>
				</block>
			</view>
		</scroll-view>
		<!-- 右侧锚点 -->
		<view class="car_right">
			<view class="car_right_box" @touchmove.stop="selectLetter_start" @touchstart.stop="selectLetter" @touchend.stop="selectLetter_end">
				<view class="car_right_list" :data-item="item" v-for="(item, index) in anchorPos" :key="index">{{ item.value }}</view>
			</view>
		</view>
		<carToast :toast="toast" :types="2" v-if="showToast" />
	</view>
</template>
<script>
	import carToast from '@/components/carToast/carToast.vue';
	import serialGroup from "@/pages_car/chooseModels/components/serialGroups.vue";
	export default {
		components: {
			carToast,
			serialGroup
		},
		props:['navigateBack',"Brands",'serialGroups',"unChangeSerialId"],
		watch: {
			inds(val) {
				this.toView = 'anchorPos-' + this.anchorPos[val].key;
				this.toast = this.anchorPos[val].value;
				this.showToast = false;
				this.showToast = true;
			}
		},
		data() {
			return {
				height: 0,
				showToast: false,
				toast: "",
				top: 0,
				hotBrands: [], //热门品牌
				brandsAll: [], //所有品牌
				anchorPos: [{
					key: "hot",
					value: "#"
				}], //锚点
				inds: 0, //滑动右侧栏字母下标
				toView: ""
			}
		},
		mounted() {
			this.init()
			if(this.navigateBack == '6'){
				this.anchorPos[0].key = 'group'
			}
		},
		methods: {
			async init() {
				let data = this.Brands;
				this.hotBrands = data.hotBrands;
				let list = data.brandsAll.sections.splice(0, 2)
				this.brandsAll = list
				this.anchorPos = [...this.anchorPos, ...data.anchorPos];
				this.pageInit()
				setTimeout(() => {
					this.brandsAll = [...this.brandsAll, ...data.brandsAll.sections]
				}, 1000)
			},
			// 前往车型列表页
			toSerials(id) {
				var navigateBack = 2;
				if (this.navigateBack == '4') {
					navigateBack = 3;
				}else if(this.navigateBack == '6'){
					navigateBack = 6;
				}else if(this.navigateBack == '7'){
					navigateBack = 7;
				}
				if(navigateBack == 6){
					uni.navigateTo({
						url: `/pages_car/selectSerials/selectSerials?navigateBack=${navigateBack}&id=${id}&unChangeSerialId=${this.unChangeSerialId}`,
					})
				}else{
					uni.navigateTo({
						url: `/pages_car/selectSerials/selectSerials?navigateBack=${navigateBack}&id=${id}`,
					})
				}
			},
			// 滑动开始
			selectLetter_start(e) {
				this.selectLetter(e);
				setTimeout(() => {
					this.showToast = true;
				}, 200);
			},
			// 锚点指向品牌
			selectLetter(e) {
				console.log(e.changedTouches[0].pageY)
				if (this.inds == Math.floor((e.changedTouches[0].pageY - this.top) / 16)) {
					return;
				}
				this.inds = Math.floor((e.changedTouches[0].pageY - this.top) / 16);
			},
			// 滑动结束
			selectLetter_end(e) {
				this.selectLetter(e);
				setTimeout(() => {
					this.showToast = false;
				}, 500);
			},
			// 页面数据初始化
			pageInit() {
				if(this.navigateBack != '2' && this.navigateBack != '4' && this.navigateBack != '6' && this.navigateBack != '7'){
					this.height = `calc(${uni.getSystemInfoSync().windowHeight}px - 90rpx)`;
				}else{
					this.height = `${uni.getSystemInfoSync().windowHeight}px`;
				}
				this.top = (uni.getSystemInfoSync().windowHeight - this.anchorPos.length * 16) / 2;
				console.log(this.top)
			}
		}
	}
</script>
<style lang="scss">
	.company {
		width: 100%;

		.car_right {
			height: 100%;
			width: 50rpx;
			position: fixed;
			z-index: 2;
			right: 0;
			top: 0;
			@include flex_center_center;

			.car_right_box {
				width: 100%;
				@include flex_center_center;
				flex-wrap: wrap;
				align-content: center;

				.car_right_list {
					width: 100%;
					height: 16px;
					font-size: 11px;
					color: #aaa;
					@include flex_center_center;
				}
			}
		}

		.company_box {
			padding-top: 40rpx;
			height: 100%;

			.hot_company {
				.hot_company_head {
					color: #121c35;
					padding: 0 36rpx;
					@include flex_left_center;
					font-size: 36rpx;
					font-weight: bold;
				}

				.hot_company_con {
					padding: 8rpx 36rpx;
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;

					.item {
						overflow: hidden;
						width: 156rpx;
						height: 70rpx;
						line-height: 70rpx;
						margin-top: 32rpx;
						text-align: center;
						font-size: 28rpx;
						color: #121c35;
						background: #f4f4f5;
						border-radius: 35rpx;
						box-sizing: border-box;
						padding: 0 15rpx;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}
			}

			.brands {
				.brands_list {
					margin-top: 40rpx;
					padding: 0 36rpx;

					.brands_list_head {
						padding-bottom: 28rpx;
						color: #121c35;
						@include flex_left_center;
					}

					.item_box {
						width: 100%;

						.item {
							height: 120rpx;
							border-top: 1px solid #e5e6f0;
							font-size: 32rpx;
							color: #333;
							@include flex_left_center;

							image {
								width: 78rpx;
								height: 78rpx;
								vertical-align: middle;
								margin-right: 30rpx;
								// background: #d9d9d9 url(https://magear.pcauto.com.cn/p/www1.pcauto.com.cn/images/holder.png) no-repeat center center;
								background-size: 98rpx;
							}
						}

						;
					}
				}
			}
		}
	}
	.setHeight{
		height: 100% !important;
	}
</style>
