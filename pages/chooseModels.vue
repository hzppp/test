<template>
	<view class="choose-models">
		<view class="top-title">2019</view>
		<view>
			<checkbox-group @change="checkboxChange">
                <label class="item-list" v-for="item in items" :key="item.value">
                    <view>
                        <checkbox class="check-box" :value="item.value" :checked="item.checked" :disabled="!currentValue.includes(item.value) && currentCount == 2" />
                    </view>
                    <view class="model-name">{{item.name}}</view>
                </label>
            </checkbox-group>
		</view>
		<view class="btn">
			确定添加
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				items: [{
                        value: 'USA',
                        name: '美国'
                    },
                    {
                        value: 'CHN',
                        name: '中国',
                        checked: 'true'
                    },
                    {
                        value: 'BRA',
                        name: '巴西'
                    },
                    {
                        value: 'JPN',
                        name: '日本'
                    },
                    {
                        value: 'ENG',
                        name: '英国'
                    },
                    {
                        value: 'FRA',
                        name: '法国'
                    }
                ],
				currentCount: "", //当前选择的个数
				currentValue:[]
			}
		},
		methods: {

            checkboxChange: function (e) {
				console.log('e :>> ', e);
				this.currentCount = e.detail.value.length
				this.currentValue = e.detail.value
                var items = this.items,
                    values = e.detail.value;
                // for (var i = 0, lenI = items.length; i < lenI; ++i) {
                //     const item = items[i]
                //     if(values.includes(item.value)){
                //         this.$set(item,'checked',true)
                //     }else{
                //         this.$set(item,'checked',false)
                //     }
                // }
            }
        }
	}
</script>

<style lang="scss" scoped>
.choose-models {
	.top-title {
		height: 56rpx;
		line-height: 56rpx;
		background-color: #f5f5f6;
		font-size: 24rpx;
		color: #333333;
		// padding-left: 39rpx;
	}
	.item-list {
		display: flex;
		padding-left: 32rpx;
		align-items: center;
		line-height: 96rpx;
		.check-box {
			border-radius: 50%;
		}
		.model-name {
			font-size: 28rpx;
			color: #333333;
			margin-left: 32rpx;
		}
	}
	.btn {
		position: fixed;
		bottom: 20rpx;
		left: 50%;
		transform: translateX(-50%);
		height: 88rpx;
		width: 686rpx;
		text-align: center;
		color: #ffffff;
		background-color: #FA8845;
		border-radius: 44rpx;
		line-height: 88rpx;
	}
}
</style>