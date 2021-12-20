<template>
    <view class="mall-update">
        <view class="update-icon"></view>
        <view class="update-txt">
            积分商城升级中，请耐心等待</br>期间可登录<text class="website">mall.changan.com.cn</text>查看
        </view>
    </view>
</template>

<script>
export default {
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
    .mall-update{
        display: flex;
        height: 100vh;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-bottom: 200rpx;
        box-sizing: border-box;
        .update-icon{
            .setbg(372rpx,312rpx,'unseal/update-icon.png');
        }
        .update-txt{
            font-size: 32rpx;
            color: #333333;
            line-height: 48rpx;
            margin-top: 22rpx;
            text-align: center;
            .website{
                color: #FA8845
            }
        }
        
    }
    
</style>
