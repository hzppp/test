<template>
    <view class="group-purchase">
        <view class="group-text">还差<text class="nums">{{groupSize - groupAllUserInfoList.length}}</text>名好友支付即可拼团成功</view>
        <view class="group-list">
            <view class="group-members" v-for="(item,index) in groupAllUserInfoList" :key="index">
                <image :src="item.avatarUrl"></image>
                <view class="condition" v-if="item.orderStatus==0">待支付</view>
            </view>
            <button class="add-members" hover-class="none" open-type="share" @click="shareBtnClick"></button>
        </view>
        <view class="group-btn">
            <view class="count-time">
                倒计时：
                <view class="db">{{groupDownDate[1]}}</view>时
                <view class="db">{{groupDownDate[2]}}</view>分
                <view class="db">{{groupDownDate[3]}}</view>秒
            </view>
            <button class="share-btn" hover-class="none" open-type="share" @click="shareBtnClick">分享好友</button>
        </view>
    </view>
</template>

<script>
export default {
    name:"demo",
    props: {
        groupDownDate: {    // 倒计时
            type: Array,
            default: []
        },
        groupSize:{
            type:Number,
            default:0
        },
        groupAllUserInfoList:{
            type:Array,
            default:[]
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
    
</style>
