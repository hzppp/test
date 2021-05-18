<template>
    <view class="c-btn-wrap">
        <button class="go-canpei" @tap="goCanPei">
            查看参数配置
        </button>
        <view class="bottom-btn-wrap">
            <button class="bottom-btn">
                购车计算
            </button>
            <button class="bottom-btn" @tap="goSerialList">
                车型对比
            </button>
        </view>
    </view>
</template>

<script>

    export default {
        props:{
            serialId: { //车系id
                type: String,
                default: ""
            },
            ids: {
                type: String,
                default: ""
            }
        },
		data() {
			return {
				
			}
		},
        onload(options) {
            this.feqSerialList()
        },
        onShow() {
            this.feqSerialList()
        },
		methods: {
			goCanPei() {
				uni.redirectTo({
					url:`/pages/canpei?navigateBack=1&compare=true&ids=${this.ids}&serialId=${this.serialId}`
				})
			},
            goSerialList() {
                uni.redirectTo({
					url:`/pages/ChooseSerial?&vs=true&serialId=${this.serialId}`
				})
            },

		}
    }
</script>

<style lang="scss" scoped>
.c-btn-wrap {
    padding: 60rpx 32rpx;
    .go-canpei {
        width: 686rpx;
        height: 88rpx;
        line-height: 88rpx;
        color: #ffffff;
        border-radius: 88rpx;
        background-color: #fa8943;
        margin-bottom: 24rpx;
    }
    .bottom-btn-wrap {
        display: flex;
        justify-content: space-between;
        .bottom-btn {
            width: 330rpx;
            height: 88rpx;
            line-height: 88rpx;
            border-radius: 88rpx;
            background-color: #f5f5f5;
            color: #333333;
            font-size: 32rpx;
        }
    }
}
</style>