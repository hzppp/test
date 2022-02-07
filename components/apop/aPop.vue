<template>
    <view class="a-pop-mask" v-if="isShow">
        <view class="pop-content">
            <view class="success"></view>
            <view class="title">预约成功</view>
            <view class="text">我们的销售将尽快与您联系</view>
            <button class="btn" @tap="closeShow">完成</button>
            <i class="close" @tap="isShow = false"></i>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                isShow: false, //控制显隐
            }
        },
        onLoad() {
            console.log('app.globalData.currentLocation.cityData :>> ', app.globalData.currentLocation.cityData);
        },
        methods: {
            closeShow() {
				
				// zijie
				this.$emit('closeShow')
				
				
                this.isShow = false
				uni.navigateBack()
            }
        },
    }
</script>

<style lang="scss">
.a-pop-mask {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color:rgba(0, 0, 0, .5);
    top: 0;
    left: 0;
    z-index: 999;
    touch-action: none;
    .pop-content {
        position: absolute;
        width: 280px;
        height: 261px;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        text-align: center;
        background-color: #ffffff;
        padding: 30px;
        border-radius: 5px;
        box-sizing: border-box;
        .success {
            width: 65px;
            height: 65px;
            background-image: url("../../static/images/succes.png");
            background-size: cover;
            margin: 0 auto;
        }
        .title {
            color: #333333;
            line-height: 27px;
            font-size: 18px;
            font-weight: 700;
            margin: 10px 0;
        }
        .text {
            font-size: 14px;
            line-height: 20px;
            color: #999999;
        }
        .btn {
            width: 180px;
            height: 44px;
            font-size: 16px;
            line-height: 44px;
            border-radius: 44px;
            margin: 0 auto;
            margin-top: 34px;
            color: #ffffff;
            background-color: #fa8943;
        }
        .close {
            margin: 0 auto;
            margin-top: 60rpx;
            width: 64rpx;
            height: 64rpx;
            background-image: url("../../static/images/close_btn.png");
            background-size: cover;
        }
    }
}
</style>