<template>
	<view class="external" v-if="externalData.name">
		<view class="external__content">
			<view class="external__content__title"><i class="icon" />{{ externalData.name }}</view>
			<view class="classify">
				<view class="classify__item" v-for="(item, index) in externalData.parData" :key="index">
					<uni-collapse @change="change">
						<view class="item__name">{{ item.title }}</view>
						<uni-collapse-item class="diy_uni-collapse-item" :title="item.value" showAnimation="true" :count="item.amount">
							<view class="item__model_wrap">
								<view class="item__model" v-for="(model, mIndex) in item.models" :key="mIndex" @tap='goCanpei(model.id,1)'>
									<view class="item__model__left">
										<view class="item__model__left_title">{{ model.name }}</view>
										<view class="item__model__left_price">{{ model.price }}万</view>
									</view>
									<view class="right_icon"></view>
								</view>
								<view class="view--more" @tap='goCanpei(externalData.parData[index].modelIds)'>查看{{ item.amount }}款车型完整参数<i class="right_icon" /></view>
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
		PropsExternalData: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			externalData: {},
		};
	},
	watch: {
		PropsExternalData(v) {
			this.externalData = v;
			console.log("externalData :>> ", v);
		},
	},
    methods: {
        goCanpei(id,type) {
            if(type == 1) {
                this.$emit('addHighlightedModelId',[id])
            }else {
                this.$emit('addHighlightedModelId',id)
            }
        }
    },
};
</script>

<style lang="scss" scoped>
.external {
	width: 100%;
	margin-bottom: 40rpx;
	padding: 0 30rpx;
	box-sizing: border-box;
	.external__content {
		border: 2rpx solid #f8f8f8;
		border-radius: 10rpx;
		.external__content__title {
			margin-top: 25rpx;
			font-size: 36rpx;
			font-weight: bold;
			display: flex;
			justify-content: center;
			align-items: center;
			.icon {
				width: 30rpx;
				height: 30rpx;
				margin-right: 18rpx;
				background-image: url("../../static/images/external_icon.png");
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
			flex: 1;
		}
		.item__model__left_title {
			font-size: 28rpx;
			line-height: 24rpx;
			color: #333333;
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
		margin-left: 20rpx;
		width: 9rpx;
		height: 14rpx;
		background-image: url("../../static/images/right_arrow.png");
		background-size: cover;
	}
}
</style>
