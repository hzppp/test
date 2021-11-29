<template>
    <view class="packet-popup" v-if="isOpen">
        <view class="process-cover" :class="{move:isMoveStart}">
            <view class="process process-close-con">
                <view class="process process-close"></view>
                <view class="process process-close-cover"></view>
            </view>
            <view class="process process-open-behind hide"></view>
            <view class="process process-open-inner hide">
                <slot></slot>
            </view>
            <view class="process process-open-front hide"></view>
            <view class="share-btn-group hide">
                <!--  #ifdef MP-WEIXIN  -->
                <button v-if="isSharePosterPic"
                    :class="'share-btn ' + (shareStatus == 0 ? 'share-tip':'')" hover-class="none"
                    @tap='sharePosterClick()'>分享好友</button>

                <button v-else :class="'share-btn ' + (shareStatus == 0 ? 'share-tip':'')"
                    hover-class="none" open-type="share" @click="shareBtnClick">分享好友</button>
                <!-- #endif -->
                <!--  #ifndef MP-WEIXIN  -->
                <button :class="'share-btn ' + (shareStatus == 0 ? 'share-tip':'')"
                    hover-class="none" open-type="share" @click="shareBtnClick">分享好友</button>
                <!-- #endif -->
            </view>
             <view class="close hide" @click="close"></view>
        </view>
       
    </view>
</template>
<script>
export default {
    props: {
        isOpen: {
            type: Boolean,
            default: false
        },
        shareStatus: {
			type: Number,
			default: 0
		},
        isSharePosterPic:{
            type: Boolean,
            default: false
        },
    },
    data() {
      return {
        isMoveStart:false,
      }
    },
    created() {
        this.isMoveStart =true;
   
    },
    methods: {
       close(){
           this.$emit('update:isOpen',false)
       },
       sharePosterClick(){
           this.$EventBus.$emit('shareChoiseFun')
       },
       // 分享按钮被点击
        shareBtnClick() {
            wx.aldstat.sendEvent('活动分享点击')
        },
    },
}
</script>
<style lang="less" scoped>
    @import '@/static/less/public.less';
    .packet-popup{
        position: fixed;
        width: 100%;
        height: 100vh;
        left:0;
        top: 0;
        background: rgba(0,0,0,0.5);
        z-index: 99;
        .process-cover{
            position: absolute;
            width:560rpx;
            left:50%;
            top: 50%;
            margin-left:-280rpx;
            height: 400rpx;
            margin-top: -200rpx;
        }
        .process{
            position: absolute;
            left:0;
            bottom: 0;
        }
        .hide{
            opacity: 0;
        }
        .process-close-con{
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
        }
        .process-close-cover{
            bottom:auto;
            top: 0;
            .setbg(560rpx,282rpx,'redpackage/packet-cover.png');
        }
        .process-close{
            .setbg(560rpx,400rpx,'redpackage/packet-cover-behind.png');
        }
        .process-open-behind{
            .setbg(560rpx,620rpx,'redpackage/packet-outer-after.png');
        }
        .process-open-front{
            .setbg(560rpx,260rpx,'redpackage/packet-outer-front.png');
        }
       
        .process-open-inner{
            .setbg(536rpx,380rpx,'redpackage/packet-inner-bg.png');
            left: 50%;
            margin-left:-268rpx;
            bottom: 180rpx;
           
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
        .close{
            position: absolute;
            left:50%;
            bottom:0;
            margin-left:-32rpx;
            .setbg(64rpx,64rpx,'redpackage/close.png');
            transform: translateY(154rpx)
        }
        .move{
            .process-close-con{
                animation: moveScale 0.4s ease-out forwards,shake 1.2s ease-in,hide 0.4s ease-in 1.45s forwards;
            }
            .process-close-cover{
                transform-origin:50% 0%;
                animation: flip 0.8s ease-out 1.2s forwards;
            }
            .process-open-front,.process-open-behind{
                animation: show 0.4s ease-out 1.45s forwards;
            }
            .process-open-inner{
                animation: moveUp 0.6s ease-out 1.7s forwards;
            }
            .share-btn-group{
                animation: show 0.6s ease-out 1.8s forwards;
            }
            .close{
                animation: show 0.6s ease-out 2s forwards;
            }
        }
    }
    @keyframes shake {
        0%,
        100% {
                transform: rotate(0)
        }

        10% {
                transform: rotate(-9deg)
        }

        20% {
                transform: rotate(8deg)
        }

        30% {
                transform: rotate(-7deg)
        }

        40% {
                transform: rotate(6deg)
        }

        50% {
                transform: rotate(-5deg)
        }

        60% {
                transform: rotate(4deg)
        }

        70% {
                transform: rotate(-3deg)
        }

        80% {
                transform: rotate(2deg)
        }

        90% {
                transform: rotate(-1deg)
        }
    }
    // @keyframes shake {
    //     25% {
    //         transform: rotate(7deg);
    //     }
    //     75% {
    //         transform: rotate(-7deg);
    //     }
    //     50%,
    //     100% {
    //         transform: rotate(0);
    //     }
    // }
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
    @keyframes flip {
        0% {
            transform: rotateX(0);
            opacity: 1;
        }
        40%{
            opacity: 0.8;
        }
        100% {
            transform: rotateX(180deg);
            opacity: 0;
        }
    }
</style>
