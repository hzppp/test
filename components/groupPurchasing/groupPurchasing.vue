<template>
    <view class="group-purchase">
        <view class="group-text">还差<text class="nums">2</text>名好友支付即可拼团成功</view>
        <view class="group-list">
            <view class="group-members" v-for="(item,index) in userGroupDetail.groupAllUserInfoList" :key="index">
                <image :src="item.avatarUrl"></image>
                <view class="condition" v-if="item.orderStatus==0">待支付</view>
            </view>
            <button class="add-members" hover-class="none" open-type="share" @click="shareBtnClick"></button>
        </view>
        <view class="group-btn">
            <view class="count-time">
                倒计时：
                <view class="db">{{artDownDate[1]}}</view>时
                <view class="db">{{artDownDate[2]}}</view>分
                <view class="db">{{artDownDate[3]}}</view>秒
            </view>
            <button class="share-btn" hover-class="none" open-type="share" @click="shareBtnClick">分享好友</button>
        </view>
    </view>
</template>

<script>
export default {
    name:"demo",
    props: {
        artDownDate: {    // 倒计时
            type: Array,
            default: []
        },
        groupSize:{
            type:Number,
            default:0
        },
        userGroupDetail:{
            type:Object,
            default:{}
        }
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
        // 分享按钮被点击
        shareBtnClick() {
            // #ifdef MP-WEIXIN
            wx.aldstat.sendEvent('活动分享点击')
            // #endif			
        },
      
    },
    created() {

    },
    mounted() {
      
    },
};
</script>

<style scoped lang="less">
    @import '@/static/less/public.less';
    .group-purchase{
        position: fixed;
        z-index: 1;
        left: 0;
        bottom: 0;
        .setbg(750rpx,360rpx,'groupIn/group-bg.png');
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .group-list{
            display: flex;
            justify-content: center;
            margin:30rpx 0;
        }
        .group-members image{
            width: 92rpx;
            height: 92rpx;
            border-radius: 50%;
            border:4rpx solid #fa8845;
            
        }
        .group-members{
            margin:0 30rpx;
            .condition{
               font-size: 20rpx;
               color: #999999;
               margin-top: 12rpx;
               text-align: center;
            }
        }
        .add-members{
            .setbg(100rpx,100rpx,'groupIn/add.png');
            margin:0 30rpx;
        }
        .group-btn{
            display: flex;
            justify-content: space-between;
            flex-direction: row;
            width: 100%;
            padding:0 32rpx;
            box-sizing: border-box;
            .count-time{
                color: #999999;
                font-size: 24rpx;
                display: flex;
                align-items: center;
            }
            .db{
                width: 48rpx;
                height: 44rpx;
                background: #e64848;
                border-radius: 10rpx;
                text-align: center;
                font-size: 28rpx;
                line-height: 44rpx;
                color: #ffffff;
                margin:0 5rpx;
            }
            .share-btn{
                width: 312rpx;
                height: 88rpx;
                line-height: 88rpx;
                background: #fa8845;
                border-radius: 44rpx;
                font-size: 32rpx;
                text-align: center;
                color: #ffffff;

            }
        }
    }
</style>
