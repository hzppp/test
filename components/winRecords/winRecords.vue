<template>
    <view class="lotteryList">
        <swiper  :disable-touch="true" :vertical="true"
            :circular="true" :duration="500" :interval="2000" :autoplay="autoplay">
            <swiper-item @touchmove.stop='stopTouchMove' @touchstart.stop='stopTouchMove' v-for="(item,index) in winnerRecords"
                :key="index">
                <view class="item">{{item}}</view>
            </swiper-item>
        </swiper>
    </view>
</template>
<script>
export default {
    props: {
		winnerRecords: {
			type: Object|Array,
			default: () => ({}),
		},
        autoplay:{
            type: Boolean,
            default:false
        }
	},
    methods: {
        //禁止用户手动滑动
        stopTouchMove(){
            return true;
        },
    },
}
</script>
<style lang="less" scoped>
    .lotteryList {
        position: absolute;
        left: 16rpx;
        top: 16rpx;
        font-size: 24rpx;
        line-height: 56rpx;
        color: #fff;
        text-align: center;
        padding: 0 20rpx;
        max-width: 530rpx;
        swiper{
            width: 500rpx;
            height: 56rpx;
        }
        .item {
            background: rgba(0, 0, 0, .3);
            border-radius: 28rpx;
        }
    }
</style>


