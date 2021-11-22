v<template>
    <view class="packet-popup">
        <view class="process" :class="{move:isMoveStart}">
            <view class="process-close"></view>
            <view class="process-open-behind hide"></view>
            <view class="process-open-inner hide">
                <view class="win-inner-con">
                    <block v-if="isWin">
                        <view class="win-txt1">恭喜获得</view>
                        <view class="win-money"><text>3.88</text>元</view>
                        <view class="win-txt2">30分钟内到账微信钱包，请注意查收</view>
                    </block>
                    <block v-else>
                        <view class="win-txt1">很遗憾，没有拆到红包</view>
                        <view class="win-txt3">红包擦肩而过</view>
                    </block>
                </view>
            </view>
            <view class="process-open-front hide"></view>
            <view class="share-btn-group hide">
                <!--  #ifdef MP-WEIXIN  -->
                <button v-if="sharePosterPic"
                    :class="'share-btn ' + (shareStatus == 0 ? 'share-tip':'')" hover-class="none"
                    @tap='shareChoise()'>分享好友</button>

                <button v-else :class="'share-btn ' + (shareStatus == 0 ? 'share-tip':'')"
                    hover-class="none" open-type="share" @click="shareBtnClick">分享好友</button>
                <!-- #endif -->
                <!--  #ifndef MP-WEIXIN  -->
                <button :class="'share-btn ' + (shareStatus == 0 ? 'share-tip':'')"
                    hover-class="none" open-type="share" @click="shareBtnClick">分享好友</button>
                <!-- #endif -->
            </view>
        </view>
    </view>
</template>
<script>
export default {
    data() {
      return {
        isMoveStart:false,
        isWin:true,
        sharePosterPic:false,
        shareStatus:false
      }
    },
    created() {
        this.isMoveStart =true;
   
    },
    methods: {
       
    },
}
</script>
<style lang="less" scoped>
    .packet-popup{
        position: fixed;
        width: 100%;
        height: 100vh;
        left:0;
        top: 0;
        background: rgba(0,0,0,0.5);
        z-index: 999;
        .process{
            position: absolute;
            width:560rpx;
            left:50%;
            top: 50%;
            margin-left:-280rpx;
            height: 400rpx;
            margin-top: -200rpx;
            // overflow: hidden;
        }
        .hide{
            opacity: 0;
        }
        .process-close{
            position: absolute;
            width: 100%;
            height: 100%;
            left:0;
            top: 0;
            background: url(https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/redpackage/packet-close.png) no-repeat center/100%;
            // &.hideMove{
            //     animation: hide 0.6s ease-in forwards;
            // }
        }
        .process-open-behind{
            width: 560rpx;
            height: 490rpx;
            position: absolute;
            left:0;
            bottom:0;
            background: url(https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/redpackage/packet-outer-after.png) no-repeat center/100%;
        }
        .process-open-front{
            width: 560rpx;
            height: 260rpx;
            position: absolute;
            left:0;
            bottom:0;
            background: url(https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/redpackage/packet-outer-front.png) no-repeat center/100%;
        }
       
        .process-open-inner{
            width: 536rpx;
            height: 380rpx;
            position: absolute;
            left: 50%;
            margin-left:-268rpx;
            bottom: 180rpx;
            background: url(https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/redpackage/packet-inner-bg.png) no-repeat center/100%;
            &.up{
                animation: moveUp 0.6s ease-out forwards;
            }
        }
        .win-inner-con{
            height: 335rpx;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .win-txt1{
            font-size: 40rpx;
            line-height: 1;
            color: #fa8845;
            margin-bottom: 45rpx;
        }
        .win-money{
            font-size: 32rpx;
            color: #f82e1c;
            line-height: 42rpx;
            font-weight: bold;
            text{
                font-size: 78rpx;
            }
        }
        .win-txt2{
            font-size: 24rpx;
            color: #fa8845;
            line-height: 1;
            margin-top: 40rpx;
        }
        .win-txt3{
            font-size: 64rpx;
            line-height: 1;
            color: #e70026;
        }
        .share-btn{
            width: 420rpx;
            height: 100rpx;
            line-height: 100rpx;
            text-align: center;
            border-radius: 50rpx;
            font-size: 36rpx;
            color: #ac3700;
            position: absolute;
            left:50%;
            margin-left:-210rpx;
            bottom:60rpx;
            background: linear-gradient(to right, #ffe569 0%,#ffae00 100%);
        }
        .move{
            .process-close{
                animation: moveScale 0.4s ease-out forwards,shake .2s linear infinite,hide 0.4s ease-in 1.2s forwards;
            }
            .process-open-front,.process-open-behind{
                animation: show 1s ease-out 1.4s forwards;
            }
            .process-open-inner{
                animation: moveUp 0.6s ease-out 1.8s forwards;
            }
            .share-btn-group{
                animation: show 0.6s ease-out 1.8s forwards;
            }
        }
    }
    // @keyframes shake {
    //     0%,
    //     100% {
    //             transform: translateX(0)
    //     }

    //     10% {
    //             transform: translateX(-9px)
    //     }

    //     20% {
    //             transform: translateX(8px)
    //     }

    //     30% {
    //             transform: translateX(-7px)
    //     }

    //     40% {
    //             transform: translateX(6px)
    //     }

    //     50% {
    //             transform: translateX(-5px)
    //     }

    //     60% {
    //             transform: translateX(4px)
    //     }

    //     70% {
    //             transform: translateX(-3px)
    //     }

    //     80% {
    //             transform: translateX(2px)
    //     }

    //     90% {
    //             transform: translateX(-1px)
    //     }
    // }
    @keyframes shake {
        25% {
            transform: rotate(7deg);
        }
        75% {
            transform: rotate(-7deg);
        }
        50%,
        100% {
            transform: rotate(0);
        }
    }
    @keyframes moveScale{
        0% {
            transform: scale(0.9);
        }
        100% {
            transform: scale(1);
        }
    }
    @keyframes hide {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
    @keyframes show {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
    @keyframes moveUp {
        0% {
            opacity: 0;
            bottom: 0;
        }
        30%{
            opacity: 1;
        }
        100% {
            opacity: 1;
            bottom: 180rpx;
        }
    }
</style>
