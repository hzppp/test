<template>
	<view class="cars-page">
        <view class="image-wrap">
            <image  mode='widthFix' lazy-load src='https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20170910%2Ff73ce2baf6e4487e9b9d6a149c6ec143.gif&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1623485249&t=aae4b5e4df31261a7f1a513770ebb959'>
            </image>
            <i class="video-icon"></i>
        </view>
        <btnWrap></btnWrap>
        <view class="image-wrap">
            <image mode='widthFix' lazy-load src='https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3850593577,2712737975&fm=26&gp=0.jpg'>
            </image>
        </view>
        <view class="btn-wrap">
            <button class="yuyue-btn">
                预约试驾
            </button>
        </view>
	</view>
</template>

<script>

import btnWrap from '@/components/lookCar/LookCar';
export default {
    components: {btnWrap},
	methods: {
	}
}
</script>

<style lang="scss">
.cars-page {
	min-height: 100vh;
    padding-bottom: 64px;
    .image-wrap {
        position: relative;
        width: 100%;
        z-index: 1;
        image {
            vertical-align: middle;
            width: 100%;
        }
        .video-icon {
            position: absolute;
            width: 60px;
            height: 60px;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            background-image: url('../static/images/videoPlayBtn.png');
            z-index: 2;
        }
    }
    .btn-wrap {
        position: fixed;
        width: 100%;
        height: 64px;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        background-color: #ffffff;
        z-index: 99;
        display: flex;
        align-items: center;
        justify-content: center;
        .yuyue-btn {
            width: 343px;
            height: 44px;
            border-radius: 44px;
            line-height: 44px;
            color: #ffffff;
            background-color: #FA8845;
        }
    }
}
</style>
