<template>
    <view class="jigsaw-activity">
        <view class="rank-btn">
            <view class="rank-item rank-date">
                <text class="label">日榜</text>
                <view class="rank-con" @tap="toRank(1)">
                    <view v-if="!userRankInfo.isTodayRankWin" class="rank-info">
                        <text class="number" v-if="userRankInfo.todayRank&&userRankInfo.todayRank!=-1">{{userRankInfo.todayRank}}</text>{{userRankInfo.todayRank&&userRankInfo.todayRank!=-1?'名':'暂无排名'}}
                    </view>
                    <view v-else class="award">
                        获得奖励
                    </view>
                    <view class="arrow-right"></view>
                </view>
                <view class="rank-best-con">
                    今日最佳：{{userRankInfo.todayBest && userRankInfo.todayBest != -1 ? userRankInfo.todayBest:'暂无成绩'}}
                </view>
            </view>
            <view class="rank-item rank-total">
                <text class="label">总榜</text>
                <view class="rank-con"  @tap="toRank(2)">
                    <view v-if="!userRankInfo.isSumRankWin"  class="rank-info">
                        <text class="number" v-if="userRankInfo.sumRank&&userRankInfo.sumRank!=-1">{{userRankInfo.sumRank}}</text>{{userRankInfo.sumRank&&userRankInfo.sumRank!=-1?'名':'暂无排名'}}
                    </view>
                    <view v-else class="award">
                        获得奖励
                    </view>
                    <view class="arrow-right"></view>
                </view>
                <view class="rank-best-con">
                    历史最佳：{{userRankInfo.historyBest && userRankInfo.historyBest != -1 ? userRankInfo.historyBest:'暂无成绩'}}
                </view>
            </view>
        </view>
        <slot :chanceCount="chanceCount"></slot>
        <!-- 邀请记录 -->
        <invite-records :activityId="activityId" type="jigsaw"/>
        <!-- 抽奖说明 -->
        <draw-tips :activityMemoArr="activityMemoArr" type="jigsaw"/>
    </view>
</template>

<script>
import inviteRecords from '@/components/inviteRecords/inviteRecords'
import drawTips from '@/components/drawTips/drawTips'
import api from '@/public/api/index'
export default {
    props: {
        activityId:{
            type: String,
            default: ""
        }
    },
    components: {
        inviteRecords,//邀请记录
        drawTips,//抽奖说明
    },
    data() {
        return {
            activityMemoArr:"",
            chanceCount:0,
            maxCount:0,
            todayUserCount:0,
            userRankInfo:{
                todayRank:"",
                sumRank:"",
                historyBest:"",
                todayBest:"",
                todayAward:1,
                historyAward:0,
            }
            
        };
    },
    methods: {
        async getActivityInfo(){
            let {code,data={},msg=""} = await api.getLotteryActInfo({activityId:this.activityId,activityType:2})
            if(code == 1){
                this.chanceCount = data.chanceCount;
                this.maxCount = data.maxCount;
                this.winnerRecords = data.winnerRecords
                this.todayUserCount = data.todayUserCount
                this.activityMemoArr = data.activityMemo.replace('/n', '/r/s')
            }else{
                uni.showToast({
                    title: msg,
                    icon: "none"
                })
            }
        },
        async getUserRankInfo(){
            let {activityId}=this;
            let {code,data = {}} = await api.getUserRankInfo({activityId})
            if(code==1){
                this.userRankInfo = data;
            }
        },
        toRank(type){
            let {activityId}=this;
            uni.navigateTo({
                url: `/pages/ranking?id=${activityId}&type=${type}`
            })
        }
    },
    created() {

    },
    mounted() {
        this.getActivityInfo()
        this.getUserRankInfo()
    },
};
</script>

<style scoped lang="less">
    @import '@/static/less/public.less';
    .jigsaw-activity{
        position: relative;
        background: #ffe88b;
        padding-bottom: 60rpx;
        .rank-btn{
            position: absolute;
            top:217rpx;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
        }
        .rank-item{
            .setbg(290rpx,160rpx,'jigsaw/rank-btn-bg.png');
            margin:0 12rpx;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            text-align: center;
            .label{
                font-size: 30rpx;
                color: #6d9ffc;
                width: 100rpx;
                line-height: 40rpx;
            }
            .rank-con{
                width:100%;
                padding:0 24rpx;
                box-sizing: border-box;
                text-align: left;
                color: #4d70f2;
                font-size: 28rpx;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .rank-info{
                padding: 0 10rpx;
                font-size: 24rpx;
                .number{
                    font-size: 44rpx;
                }
            }
            .arrow-right{
                .setbg(32rpx,32rpx,'jigsaw/arrow-right.png');
            }
            .rank-best-con{
                font-size: 28rpx;
                color: #ffffff;
                line-height: 48rpx;
            }
            .award{
                font-size: 28rpx;
                font-weight: bold;
                color: #fc4b06;
                line-height: 1;
                &:before{
                    content: "";
                    .setbg(64rpx,64rpx,'jigsaw/reward.png');
                    background-size:64rpx 64rpx;
                    display: inline-block;
                    vertical-align: middle;
                    margin-right: 8rpx;
                }
            }
        }
        
    }
</style>
