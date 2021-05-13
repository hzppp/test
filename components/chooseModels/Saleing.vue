<template>
	<!-- 正售/停售组件 -->
	<view class='saleing'>
		<view class="type_state">
			<view class="state_box">
				<view :class="['state_list',inds==0?'act':'']" @tap="inds=0">
					在售
				</view>
				<view :class="['state_list',inds==1?'act':'']" @tap="inds=1">
					停售
				</view>
			</view>
		</view>
		<view class="saleing_box">
			<block v-if="inds==1">
				<view class="saleing_box_date" @tap="showPop">
					<text>{{year}}</text>
				</view>
			</block>
			<block v-if="(carSale.length==0&&inds==0)||(carStopSale.length==0&&inds==1)">
				<view class="saleing_head">
					暂无车型
				</view>
			</block>
			<block v-if="inds==0">
				<block v-for="(item,index) in carSale" :key="index">
					<view class="saleing_list_">
						<block v-if="item.cars.length > 0">
							<view class="saleing_head">
								{{item.year+'款'}}
							</view>
							<block v-for="(cars,idx) in item.cars" :key="idx">
								<view :class="['saleing_list',addedData['id_'+cars.id]||cars.showParameter=='0'?'added':'']" :data-showParameter="cars.showParameter" :data-id="cars.id" :data-name="serialName+' '+cars.yearTitle+' '+cars.modelName"
								 :data-price="cars.price" @tap="addCar">
									<view class="saleing_list_box">
										<view class="saleing_list_name">
											{{item.year+'款 '+cars.modelName}}
										</view>
										<block v-if="cars.price != '' && cars.price != '暂无报价'">
											<view class="saleing_list_price">
												{{cars.price}}万
											</view>
										</block>
										<block v-else>
											<view class="saleing_list_price">
												暂无报价
											</view>
										</block>
										<block v-if="addedData['id_'+cars.id]">
											<view class="saleing_list_box_right">已添加</view>
										</block>
									</view>
								</view>
							</block>
						</block>
					</view>
				</block>
			</block>
			<block v-else>
				<block v-for="(item,index) in carStopSale" :key="index">
					<view class="saleing_list_">
						<block v-if="item.data != ''">
							<view class="saleing_head">
								{{item.title}}
							</view>
							<block v-for="(cars,idx) in item.data" :key="idx">
								<view :class="['saleing_list',addedData['id_'+cars.id]||cars.showParameter=='0'?'added':'']" :data-showParameter="cars.showParameter" :data-id="cars.id" :data-name="serialName+' '+cars.yearTitle+' '+cars.modelName"
								 :data-price="cars.price" @tap="addCar">
									<view class="saleing_list_box">
										<view class="saleing_list_name">
											{{cars.yearTitle+' '+cars.modelName}}
										</view>
										<block v-if="cars.price != '' && cars.price != '暂无报价'">
											<view class="saleing_list_price">
												{{cars.price}}
											</view>
										</block>
										<block v-else>
											<view class="saleing_list_price">
												暂无报价
											</view>
										</block>
										<block v-if="addedData['id_'+cars.id]">
											<view class="saleing_list_box_right">已添加</view>
										</block>
									</view>
								</view>
							</block>
						</block>
					</view>
				</block>
			</block>
		</view>
	</view>
</template>
<script>
	export default {
		props: ['carSale', 'carStopSale', 'addedData', 'year',  "serialName"],
		data() {
			return {
				inds: 0
			}
		},
		mounted() {
			this.init()
		},
		methods: {
			async init() {
				console.log('carSale=============',this.carSale)
			},
			// 打开年限选择弹窗
			showPop() {
				this.$emit("showPop")
			},
			// 添加车型
			addCar(e) {
				if(e.currentTarget.dataset.showparameter=='0') return;
				this.$emit("addCar",{
					id:e.currentTarget.dataset.id,
					carname:e.currentTarget.dataset.name,
					price:e.currentTarget.dataset.price,
					showParameter:e.currentTarget.dataset.showParameter
				})
			}
		}
	}
</script>
<style lang="scss">
	.saleing {
		.type_state {
			height: 124rpx;
			width: 100%;
			@include flex_center_center;

			.state_box {
				height: calc(62rpx + 2px);
				width: 280rpx;
				@include flex_left_center;
				border-radius: 100px;
				margin-top: -10rpx;
				border: 1px solid #3377d7;
				color: #3377d7;
				overflow: hidden;
				font-size: 28rpx;

				.state_list {
					height: 100%;
					flex: 1;
					@include flex_center_center
				}

				.act {
					background: #3377d7;
					color: #fff;
				}
			}
		}

		.saleing_box {
			width: 100%;

			.saleing_box_date {
				width: 90%;
				height: 82rpx;
				line-height: 82rpx;
				margin: 0 auto 32rpx auto;
				border: 1px solid #e7e9ee;
				border-radius: 10rpx;
				position: relative;
				font-size: 28rpx;
				color: #121c35;
				box-sizing: border-box;
				padding: 0 24rpx;

				&:after {
					content: '';
					width: 0;
					height: 0;
					border-left: 8rpx solid #aaa;
					border-top: 6rpx solid transparent;
					border-bottom: 6rpx solid transparent;
					position: absolute;
					right: 24rpx;
					top: 50%;
					margin-top: -4rpx;
				}
			}

			.saleing_head {
				color: #9d9fa1;
				height: 60rpx;
				padding: 0 30rpx;
				background: #f6f6f8;
				font-size: 24rpx;
				@include flex_left_center
			}

			.saleing_list {
				padding: 0 30rpx;
				height: 152rpx;
				width: 100%;

				.saleing_list_box {
					border-bottom: 1px solid #e5e6f0;
					width: 100%;
					height: 100%;
					@include flex_center_center;
					flex-wrap: wrap;
					align-content: center;
					position: relative;

					.saleing_list_name {
						width: 100%;
						font-size: 30rpx;
						color: #121c35;
						@include text()
					}

					.saleing_list_box_right {
						position: absolute;
						right: 0;
						font-size: 24rpx;
						color: #9d9fa1;
						width: 90rpx;
						text-align: right;
					}

					.saleing_list_price {
						margin-top: 14rpx;
						color: #f44;
						font-weight: bold;
						font-size: 32rpx;
						text-align: left;
						width: 100%;
					}
				}

				&:last-child {
					.saleing_list_box {
						border: 0;
					}
				}
			}
			.added{
				.saleing_list_box{
					.saleing_list_name{
						color: #9d9fa1;
					}
					.saleing_list_price{
						color: #9d9fa1;
					}
				}
			}
		}
	}
</style>
