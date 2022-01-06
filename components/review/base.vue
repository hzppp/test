<template>
	<view class="base" v-if="baseData.name">
		<view class="base__content">
			<view class="base__content__title"><i class="icon" />{{ baseData.name }}</view>
			<view class="classify">
				<view class="classify__item" v-for="(item, index) in baseData.parData" :key="index">
					<uni-collapse @change="change">
						<view class="item__name">{{ item.title }}</view>
						<uni-collapse-item class="diy_uni-collapse-item" :title="item.value" showAnimation="true" :count="item.amount">
							<view class="item__model_wrap">
								<view class="item__model" v-for="(model, mIndex) in item.models" :key="mIndex" @tap="goCanpei(model.id, 1,model)">
									<view class="item__model__left">
										<view class="item__model__left_title">{{ model.name }}</view>
										<view class="item__model__left_price">{{ model.price }}万</view>
									</view>
									<view class="right_icon"></view>
								</view>
								<view class="view--more" v-if="item.amount > 1" @tap="goCanpei(baseData.parData[index].modelIds)"
									>查看{{ item.amount }}款车型完整参数<i class="right_icon all"
								/></view>
							</view>
						</uni-collapse-item>
					</uni-collapse>
				</view>
			</view>
		</view>
	</view>
</template>

<script>

export default {
	props: {
		PropsBaseData: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			baseData: {},
		};
	},
	watch: {
		PropsBaseData: {
			immediate: true, 
			handler (v) {
				this.baseData = v;
				console.log("baseData :>> ", v);
			}
		}
	},
	methods: {
		goCanpei(id, type,model) {
			

			if(model){
				
				var names = model.name.toString().split(' ')
				
				this.$gdp('YCZ_modelParameterConfigurePageModelClick',{'YCZ_configure_var':names[names.length-1],
																		'YCZ_price_var':model.price+'万',
																		'YCZ_carModel_var':model.name,
																		'YCZ_carSeries_var':'-'})
				
			}
			
			if (type == 1) {
				this.$emit("addHighlightedModelId", [id]);
			} else {
				this.$emit("addHighlightedModelId", id);
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.base {
	width: 100%;
	margin-bottom: 40rpx;
	padding: 0 30rpx;
	box-sizing: border-box;
	.base__content {
		border: 2rpx solid #f8f8f8;
		border-radius: 10rpx;
		.base__content__title {
			margin-top: 25rpx;
			font-size: 36rpx;
			font-weight: bold;
			display: flex;
			justify-content: center;
			align-items: center;
			.icon {
				width: 28rpx;
				height: 30rpx;
				margin-right: 18rpx;
				background-image: url("../../static/images/base_icon.png");
				background-size: cover;
			}
		}
	}
	.classify {
		.classify__item {
			position: relative;
			.item__name {
				margin-left: 30rpx;
				margin-top: 20rpx;
				font-size: 24rpx;
				color: #777777;
			}
		}
	}
	.item__model_wrap {
		padding: 30rpx 30rpx 0rpx 30rpx;
		box-sizing: border-box;
		.view--more {
			display: flex;
			justify-content: center;
			align-items: center;
			padding-bottom: 33rpx;
			font-size: 24rpx;
			line-height: 24rpx;
			color: #777777;
		}
	}
	.item__model {
		display: flex;
		align-items: center;
		margin-bottom: 27rpx;
		border-bottom: 2rpx solid #ececec;
		.item__model__left {
			width: calc(100% - 32rpx);
		}
		.item__model__left_title {
			font-size: 28rpx;
			line-height: 24rpx;
			color: #333333;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.item__model__left_price {
			margin: 27rpx 0;
			color: #fa8845;
			font-size: 24rpx;
			line-height: 24rpx;
			font-weight: bold;
		}
	}
	.right_icon {
		width: 9rpx;
		height: 14rpx;
		background-image: url("../../static/images/right_arrow.png");
		background-size: cover;
        &.all {
            margin-left: 20rpx;
        }
	}
}
</style>
