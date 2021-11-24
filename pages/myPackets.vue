<template>
    <view class="my-packages">
        <userBand></userBand>
        <block v-if="!(recordsList&&recordsList.length)">
            <view class="package-top">
                <view class="package-total">
                    <text class="money">{{amountSum}}</text>元
                </view>
                <view class="package-txt">共获得红包</view>
            </view>
            <view class="package-records">
                <view class="title">红包记录</view>
                <view class="records-list" v-for="(item,index) in recordsList" :key="index">
                    <view class="records-item">
                        <view class="t1">{{item.winningTime}}</view>
                        <view class="t2">成功抽中红包</view>
                        <view class="t3">{{item.amount}}元</view>
                    </view>
                </view>
            </view>
            <view class="package-reminder">红包抽中后30分钟内会自动转入微信钱包，请仔细查看账单</br>如发现没有收到，可电话400-0114-638</view>
        </block>
        <view class="no-data" v-else>
            <view class="no-data-txt1">红包空空如也</view>
            <view class="no-data-txt2">您还没有红包中奖记录哦，快去攒次数抽红包吧~</view>
        </view>
    </view>
</template>
<script>
import api from '@/public/api/index'
import login from '@/units/login'
import userBand from '@/components/userBand/userBand'
export default {
    components:{
        userBand
    },
    data() {
        return {
            amountSum:0,
            recordsList: [],
            activityId:""
        }
    },
    filters: {
        formatTimeMins(time) {
            return time ? time.substr(0,time.length-3) : time;
        },
     },
    onLoad(options) {
        this.activityId = options.activityId
        uni.showLoading({
            title: '正在加载...'
        })
        this.getRecordList()
    },
    methods:{
        async getRecordList(){
            let {activityId}=this
            uni.hideLoading()
            let {code,data,msg} = await api.packetRecords({activityId})
            if(code == 1){
                uni.hideLoading()
                this.amountSum = data.amountSum;
                this.recordsList = data.redPacketRecordList
            }
        }
    },
}
</script>

<style lang="less" scoped>
    @import '@/static/less/public.less';
    .my-packages{
        min-height: 100vh;
        .setbg(750rpx,auto,'redpackage/packages-bg.png');
        background-size: 100% auto;
        background-color: #f8f8f8;
        padding:60rpx 32rpx;
        box-sizing: border-box;
        .no-data,.package-top{
            width:680rpx;
            height: 340rpx;
            background: #ffffff;
            border-radius: 20rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            margin-bottom: 30rpx;
        }
        .no-data-txt1{
            font-size: 36rpx;
            color: #333333;
            font-weight: bold;
            margin-bottom: 30rpx;
        }
        .no-data-txt2{
            font-size: 24rpx;
            color: #999999;
        }
        .package-total{
            color: #e70026;
            font-size: 32rpx;
            font-weight: bold;
            line-height: 0.8;
            margin-bottom: 42rpx;
            .money{
                font-size: 72rpx;
            }
        }
        .package-txt{
            font-size: 28rpx;
            color: #999999;
            line-height: 1;
        }
        .package-records{
            width: 686rpx;
            background: #ffffff;
            border-radius: 20rpx;
            padding:30rpx 30rpx 0 30rpx;
            box-sizing: border-box;
            .title{
                font-size: 36rpx;
                font-weight: bold;
                color: #333333;
                margin-bottom: 12rpx;
            }
            .records-item{
                height: 102rpx;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 28rpx;
                border-bottom: 1px solid #ebebeb;
                &:last-child{
                    border-bottom: none;
                }
                .t1,.t2{
                    color: #333333;
                }
                .t3{
                    color: #e70026;
                }
            }
        }
        .package-reminder{
            font-size: 24rpx;
            text-align: center;
            color: #999999;
            line-height: 38rpx;
            margin-top: 40rpx;
        }
    }
</style>

