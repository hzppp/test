<template>
    <view class="rank-list">
        <view class="podium">
            <view class="ranking-text">只显示前100名，每5分钟更新一次\n凌晨24:00截止当天挑战</view>
            <view class="top3">
                <view class="winner no1">
                    <view class="header">
                        <image class="wxHead" src="https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLicVBmSTBeWWllgOh8U0s564YRiaV0XQuMFm46MKnaGZWn0D6icDM0H48kQbo1Dqxv9ic7A6SwgMficSw/132"></image>
                    </view>
                    <view class="wxName">Crystal～</view>
                    <view class="time">5.88秒</view>
                </view>
                <view class="winner no2">
                    <view class="header">
                        <image class="wxHead" src="https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLicVBmSTBeWWllgOh8U0s564YRiaV0XQuMFm46MKnaGZWn0D6icDM0H48kQbo1Dqxv9ic7A6SwgMficSw/132"></image>
                    </view>
                    <view class="wxName">Crystal～</view>
                    <view class="time">5.88秒</view>
                </view>
                <view class="winner no3">
                    <view class="header">
                        <image class="wxHead" src="https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLicVBmSTBeWWllgOh8U0s564YRiaV0XQuMFm46MKnaGZWn0D6icDM0H48kQbo1Dqxv9ic7A6SwgMficSw/132"></image>
                    </view>
                    <view class="wxName">Crystal～</view>
                    <view class="time">5.88秒</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name:"demo",
    props: {

    },
    computed: {

    },
    watch: {

    },
    components: {},
    data() {
        return {

        };
    },
    methods: {

    },
    created() {

    },
    mounted() {

    },
};
</script>

<style scoped lang="less">
    @import '@/static/less/public.less';
    .rank-list{
        .podium{
            .setbg(750rpx,540rpx,'jigsaw/podium-bg.png');
            padding: 20rpx;
            box-sizing: border-box;
        }
        .ranking-text{
            font-size: 24rpx;
            text-align: center;
            white-space: pre-line; 
            color: #ffb5aa;
        }
        .top3{
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 66rpx;
        }
        .winner{
            margin:0 45rpx;
            .header{
                position: relative;
                &:before{
                    content: "";
                    .setbg(56rpx,56rpx,'jigsaw/no1.png');
                    position: absolute;
                    top: -24rpx;
                    left: -24rpx;
                }
            }
            .wxHead{
                width: 120rpx;
                height: 120rpx;
                border-radius: 50%;
            }
            .wxName{
                font-size: 28rpx;
                color: #ffffff;
                margin:28rpx auto 42rpx;
            }
            .time{
                font-size: 28rpx;
                color: #ffffff;
                font-weight: bold;
            }
        }
        
        .no1{
            transform: translateY(20rpx)
        }
    }
</style>
