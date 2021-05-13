<template>
    <view class="c-btn-wrap">
        <button class="go-canpei" @tap="goCanPei">
            查看参数配置
        </button>
        <view class="bottom-btn-wrap">
            <button class="bottom-btn">
                购车计算
            </button>
            <button class="bottom-btn" @tap="goCanPei">
                车型对比
            </button>
        </view>
    </view>
</template>

<script>
    export default {
		data() {
			return {
				
			}
		},
        onload(options) {

        },
		methods: {
			goCanPei() {
				uni.navigateTo({
					url:"/pages/canpei?navigateBack=2&compare=true&ids=101317,103933"
				})
			}
		}
    }
</script>

<style lang="scss" scoped>
.c-btn-wrap {
    padding: 30px 16px;
    .go-canpei {
        width: 343px;
        height: 44px;
        line-height: 44px;
        color: #ffffff;
        border-radius: 44px;
        background-color: #fa8943;
        margin-bottom: 12px;
    }
    .bottom-btn-wrap {
        display: flex;
        justify-content: space-between;
        .bottom-btn {
            width: 165px;
            height: 44px;
            line-height: 44px;
            border-radius: 44px;
            background-color: #f5f5f5;
            color: #333333;
            font-size: 16px;
        }
    }
}
</style>