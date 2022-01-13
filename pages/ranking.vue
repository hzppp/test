<template>
    <view class="ranking-page" v-if="activityId">
        <view class="ranking-tab">
            <view v-for="(item,index) in tabs" :key="index" :id="'tabNum'+index" :class="['tab-item',{'tab-item-cur':curIndex == item.type}]" @tap="change(item.type,index)">
                {{item.name}}
                <view class="chance-count" v-if="(index==2 && isSumRankWin) || (index==0 && isTodayRankWin)">获得奖励</view>
            </view>
        </view>
        <swiper :current="currentTab" class="tab-con" duration="300" @change="swiperChange">
            <swiper-item v-for="(item,index) in tabs" :key="index">
                <ranking-list :activityId="activityId" :type="curIndex" v-if="curIndex == item.type" @showRankWin="showRankWin"/>
            </swiper-item>
        </swiper>
    </view>
</template>

<script>
import rankingList from '@/components/rankingList/rankingList'
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
            isSumRankWin:false
        };
    },
    onLoad(options) {
        this.activityId = options.id
        this.curIndex = options.type || 1
    },
    methods: {
        change(type,index){
            this.curIndex = type;
            this.setScrollLeft(index)
            this.currentTab = index;
        },
        swiperChange(e){
            let index = e.target.current;
            this.setScrollLeft(index)
            this.currentTab = index;
            this.curIndex=this.tabs[index].type;
        },
        async setScrollLeft(tabIndex) {
            let leftWidthSum = 0;
            for (var i = 0; i <= tabIndex; i++) {
                let nowElement = await this.getWidth('tabNum' + i);
                leftWidthSum = leftWidthSum + nowElement.width;
            }
            let winWidth = uni.getSystemInfoSync().windowWidth;
            this.scrollLeft = leftWidthSum > winWidth ? (leftWidthSum - winWidth) : 0
        },
         getWidth: function(id) { //得到元素的宽高
            return new Promise((res, rej) => {
                uni.createSelectorQuery().select("#" + id).fields({
                    size: true,
                    scrollOffset: true
                }, (data) => {
                    res(data);
                }).exec();
            })
        },
        showRankWin(data){
            this.isTodayRankWin=data.isTodayRankWin
            this.isSumRankWin = data.isSumRankWin
        }

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
</style>
