<template>
    <view class="ranking-page">
        <view class="ranking-tab">
            <view v-for="(item,index) in tabs" :key="index" :class="['tab-item',{'tab-item-cur':curIndex == item.type}]" @tap="change(item.type)">
                {{item.name}}
            </view>
        </view>
        <view class="tab-con">
            <ranking-list :activityId="activityId" :type="curIndex" :endTime="endTime"/>
        </view>
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
            endTime:""
        };
    },
    onLoad(options) {
        this.activityId = options.id
        this.curIndex = options.type || 1
        this.endTime = options.endTime || ""
    },
    methods: {
        change(type){
            this.curIndex = type;
        }
    }

};
</script>

<style scoped lang="less">
    .ranking-page{
        width: 100%;
        min-height: 100vh;
        background: #f8f8f8;
    }
    .ranking-tab{
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
</style>
