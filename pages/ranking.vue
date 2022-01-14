<template>
    <view class="ranking-page" v-if="activityId">
        <view class="ranking-tab">
            <view v-for="(item,index) in tabs" :key="index" :id="'tabNum'+index" :class="['tab-item',{'tab-item-cur':curIndex == item.type}]" @tap="change(item.type,index)">
                {{item.name}}
                <view class="chance-count" v-if="(index==2 && isSumRankWin) || (index==0 && isTodayRankWin)">获得奖励</view>
            </view>
        </view>
        <swiper :current="currentTab" class="tab-con" duration="300" @change="swiperChange" :style="'height:'+scrollHeight+'px'">
            <swiper-item v-for="(item,index) in tabs" :key="index">
                <ranking-list 
                    :activityId="activityId" 
                    :type="curIndex" 
                    :isRankWin="isRankWin"
                    :isSumRankWin="isSumRankWin"
                    :isTodayRankWin="isTodayRankWin"
                    :todayRankWinDate="todayRankWinDate"
                    :mineRank="mineRank"
                    v-if="curIndex == item.type" 
                    @setScrollHeight="setScrollHeight"
                />
            </swiper-item>
        </swiper>
        <template v-if="curIndex!=3 && !isRankWin">
            <view class="mine" v-if="!isBlack && mineRank!=-1 && mineScore!=-1">
                <view class="rank-left">
                    <view class="number">{{mineRank}}</view>
                    <image class="wxHead" :src="wxUserInfo.wxHead"></image>
                    <view class="name">{{wxUserInfo.wxName}}</view>
                </view>
                <view class="time">{{mineScore}}秒</view>
            </view>
            <view class="mine" v-else-if="isBlack && historyBest!=-1">
                <view class="blacker">您已被列入黑名单，成绩不计入榜单\n如有疑问，请咨询在线客服</view>
            </view>
        </template>
        <view class="more-ranking" v-if="curIndex==3">
            <view class="more-btn" @tap="toHistory">更多历史榜单</view>
        </view>
    </view>
</template>

<script>
import rankingList from '@/components/rankingList/rankingList'
import api from '@/public/api/index'
export default {
    components: {
        rankingList
    },
    data() {
        return {
            tabs:[
                {name:'今日排行',type:1},
                {name:'昨日排行',type:3},
                {name:'总排行',type:2}
            ],
            curIndex:1,
            activityId:"",
            currentTab:0,
            isTodayRankWin:false,
            isSumRankWin:false,
            scrollHeight:"",
            wxUserInfo:{},
            mineRank:0,
            mineScore:"",
            historyBest:-1,
            isRankWin:false,
            todayRankWinDate:"",
            isBlack:false,
        };
    },
    watch:{
        curIndex(val){
            this.getUserRankInfo()
        }
    },
    onLoad(options) {
        this.activityId = options.id
        this.curIndex = options.type || 1
        this.tabs.forEach((item,index) => {
            if(item.type == this.curIndex){
                this.currentTab = index;
            }
        })
        this.wxUserInfo = uni.getStorageSync('wxUserInfo')
        this.getUserRankInfo()
    },
    methods: {
        change(type,index){
            this.curIndex = type;
            this.currentTab = index;
        },
        swiperChange(e){
            let index = e.target.current;
            this.currentTab = index;
            this.curIndex=this.tabs[index].type;
        },
        setScrollHeight(h){
            console.log("scrollHeight",h)
            this.scrollHeight =h;
        },
        toHistory(){
            let {activityId}=this;
            uni.navigateTo({
                url: `/pages/historyRanking?id=${activityId}`
            })
        },
        async getUserRankInfo(){
            let {activityId}=this;
            let {code,data = {}} = await api.getUserRankInfo({activityId})
            if(code==1){
                this.mineRank = this.curIndex==1?data.todayRank:this.curIndex==2?data.sumRank:"";
                this.mineScore = this.curIndex==1?data.todayBest:this.curIndex==2?data.historyBest:"";
                this.historyBest = data.historyBest
                this.isRankWin = this.curIndex==1?data.isTodayRankWin:this.curIndex==2?data.isSumRankWin:false;
                this.isTodayRankWin= data.isTodayRankWin
                this.isSumRankWin=data.isSumRankWin
                this.todayRankWinDate = data.todayRankWinDate ? `${data.todayRankWinDate.split("-")[1]}月${data.todayRankWinDate.split("-")[2]}日` :''
                this.isBlack = data.isBlack;
            }
        },

    }

};
</script>

<style scoped lang="less">
    @import '@/static/less/public.less';
    .ranking-page{
        width: 100vw;
        height: 100vh;
        background: #f8f8f8;
        overflow-x: hidden;
    }
    .ranking-tab{
        position: fixed;
        top:0;
        left:0;
        width: 100%;
        z-index: 100;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 88rpx;
        background: #ffffff;
        .tab-item{
            width: 33.333%;
            text-align: center;
            font-size: 32rpx;
            color: #999999;
            position: relative;
            &-cur{
                font-weight: bold;
                color: #333333;
                &:after{
                    content: "";
                    width: 40rpx;
                    height: 6rpx;
                    background: #fa8845;
                    border-radius: 3rpx;
                    display: block;
                    position: absolute;
                    left:50%;
                    margin-left: -20rpx;
                    bottom:-15rpx;
                }
            }
        }
    }
    .tab-con{
        width: 100%;
        overflow: hidden;
        padding-top: 88rpx;
        min-height: 100vh;
        box-sizing: border-box;
        flex: 1;
    }
    .chance-count{
        position: absolute;
        .setbg(100rpx,32rpx,'jigsaw/win-icon.png');
        box-sizing: border-box;
        background-size:cover;
        font-size: 20rpx;
        text-align: center;
        line-height: 32rpx;
        color: #ffffff;
        top:-24rpx;
        right:0;
    }
    .mine{
        .setbg(100%,128rpx,'jigsaw/black-bg.png');
        position: fixed;
        bottom:0;
        left:0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
        z-index: 99;
        padding:0 36rpx;
        color: #ffffff;
        box-sizing: border-box;
        .rank-left{
            display: flex;
            align-items: center;
        }
        .name{
            font-size: 32rpx;
            color: #ffffff;
        }
        .wxHead{
            width: 88rpx;
            height: 88rpx;
            overflow: hidden;
            margin:0 24rpx 0 38rpx;
            border-radius: 50%;
        }
        .number{
            font-size: 32rpx;
            font-family: DIN, DIN-Bold;
            font-weight: 700;
            font-style: italic;
            text-align: center;
            color: #ffffff;
        }
    }
    .blacker{
        font-size: 28rpx;
        color: #ffffff;
        text-align: center;
        white-space: pre-line;
        margin:0 auto;
    }
    .more-ranking{
        position: fixed;
        bottom:0;
        left:0;
        width: 100%;
        height: 112rpx;
        background: #ffffff;
        padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;
        .more-btn{
            width: 686rpx;
            height: 88rpx;
            font-size: 32rpx;
            text-align: center;
            line-height: 88rpx;
            border: 2rpx solid #fa8845;
            border-radius: 46rpx;
            color: #fa8845;
            
        }
    }
</style>
