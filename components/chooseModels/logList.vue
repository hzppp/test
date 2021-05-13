<template>
	<!-- 对比历史组件 -->
	<view class='log_list'>
		<block v-for="(item,index) in hadCompareCar" :key="index">
			<view :class="addedData['id_'+item.id]?'list list_act':'list'" @tap="addCar" :data-id="item.id" :data-name="serialName+' '+item.name"
			 :data-price="item.price">
				<view class="left">
					<view class="name">
						{{item.name}}
					</view>
					<block v-if="item.price != '' && item.price != '暂无报价'">
						<view class="price">
							{{item.price}}万
						</view> 
					</block>
					<block v-else>
						<view class="price">
							暂无报价
						</view>
					</block>
				</view>
				<block v-if="addedData['id_'+item.id]">
					<view class="right">
						已添加
					</view>
				</block>
			</view>
		</block>
	</view>
</template>
<script>
	export default {
		props: ['addedData', 'hadCompareCar', "serialName"],
		data() {
			return {}
		},
		mounted() {},
		methods:{
			addCar(e){
				this.$emit("addCar",{
					id:e.currentTarget.dataset.id,
					carname:e.currentTarget.dataset.name,
					price:e.currentTarget.dataset.price,
					showParameter:""
				})
			}
		}
	}
</script>
<style lang="scss">
	.log_list {
		padding: 0 30rpx;
		padding-top: 22rpx;

		.list {
			height: 152rpx;
			border-bottom: 1px solid #e5e6f0;
			@include flex_left_center;

			.left {
				@include flex_left_center;
				flex-wrap: wrap;
				align-content: center;
				height: 100%;
				width: 80%;

				.name {
					font-size: 30rpx;
					color: #121c35;
					width: 100%;
					@include text()
				}

				.price {
					margin-top: 14rpx;
					color: #f44;
					font-weight: bold;
					font-size: 32rpx;
				}
			}

			.right {
				width: 20%;
				height: 100%;
				@include flex_right_center;
				color: #9d9fa1;
				font-size: 24rpx;
				white-space: nowrap;
			}
		}

		.list_act{
			.left{
				.name {
					color: #9d9fa1;
				}
				
				.price {
					color: #9d9fa1;
				}
			}
		}
	}
</style>
