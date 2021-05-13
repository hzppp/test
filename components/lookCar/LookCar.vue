<template>
    <view class="btn-wrap">
        <button class="go-canpei">
            查看参数配置
        </button>
        <view class="bottom-btn-wrap">
            <button class="bottom-btn">
                购车计算
            </button>
            <button class="bottom-btn">
                车型对比
            </button>
        </view>
    </view>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>
.btn-wrap {
    padding: 0 16px;
    height: 50px;
    width: 100%;
    background-color: #e49;
    .go-canpei {
        width: 343px;
        height: 44px;
        line-height: 44px;
        color: #ffffff;
        border-radius: 44px;
        background-color: #fa8943;
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