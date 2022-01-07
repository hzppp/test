<template>
    <view class="ranking-page">
        <view class="search">
            <picker class="search-picker" mode="date" :value="createTime" :start="start" :end="end" @change="bindDateChange">
                <view :class="['search-input',{hasChoosed:createTime}]">{{createTime ? createTime :'请选择历史排行日期'}}</view>
            </picker>
        </view>
        <view class="podium">
            <view class="ranking-text">只显示前100名</view>
            <view class="top3">
                <view :class="['winner','no'+(index+1)]" v-for="(item,index) in top3List" :key="index">
                    <view class="header">
                        <image class="wxHead" :src="item.avatarUrl"></image>
                    </view>
                    <view class="wxName">{{item.nickName}}</view>
                    <view class="time">{{item.score}}</view>
                </view>
            </view>
        </view>
        <view class="ranking-list">
            <view class="rank-item" v-for="(item,index) in resetList" :key="index">
                <view class="rank-left">
                    <view class="number">{{index+4}}</view>
                    <image class="wxHead" :src="item.avatarUrl"></image>
                    <view class="name">{{item.nickName}}</view>
                </view>
                <view class="time">{{item.score}}</view>
            </view>
        </view>
        <view class="more-ranking" >
            <view class="more-btn" @tap="toActivity()">返回活动首页</view>
        </view>
    </view>
</template>

<script>
import api from '@/public/api/index'
export default {
    data() {
        return {
            activityId:"",
            start:"",
            end:"",
            createTime:this.getDate(),
            rankList:[
                {
                    activityId:1,
                    avatarUrl:"https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLicVBmSTBeWWllgOh8U0s564YRiaV0XQuMFm46MKnaGZWn0D6icDM0H48kQbo1Dqxv9ic7A6SwgMficSw/132",
                    createTime:"",
                    id:1,
                    nickName:"Crystal～",
                    score:"5.88秒",
                    updateTime:"",
                    userId:"",
                },
                {
                    activityId:1,
                    avatarUrl:"https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLicVBmSTBeWWllgOh8U0s564YRiaV0XQuMFm46MKnaGZWn0D6icDM0H48kQbo1Dqxv9ic7A6SwgMficSw/132",
                    createTime:"",
                    id:1,
                    nickName:"Crystal～",
                    score:"5.88秒",
                    updateTime:"",
                    userId:"",
                },
                {
                    activityId:1,
                    avatarUrl:"https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLicVBmSTBeWWllgOh8U0s564YRiaV0XQuMFm46MKnaGZWn0D6icDM0H48kQbo1Dqxv9ic7A6SwgMficSw/132",
                    createTime:"",
                    id:1,
                    nickName:"Crystal～",
                    score:"5.88秒",
                    updateTime:"",
                    userId:"",
                },
                {
                    activityId:1,
                    avatarUrl:"https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLicVBmSTBeWWllgOh8U0s564YRiaV0XQuMFm46MKnaGZWn0D6icDM0H48kQbo1Dqxv9ic7A6SwgMficSw/132",
                    createTime:"",
                    id:1,
                    nickName:"Crystal～",
                    score:"5.88秒",
                    updateTime:"",
                    userId:"",
                },
                {
                    activityId:1,
                    avatarUrl:"https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLicVBmSTBeWWllgOh8U0s564YRiaV0XQuMFm46MKnaGZWn0D6icDM0H48kQbo1Dqxv9ic7A6SwgMficSw/132",
                    createTime:"",
                    id:1,
                    nickName:"Crystal～",
                    score:"5.88秒",
                    updateTime:"",
                    userId:"",
                },
                {
                    activityId:1,
                    avatarUrl:"https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLicVBmSTBeWWllgOh8U0s564YRiaV0XQuMFm46MKnaGZWn0D6icDM0H48kQbo1Dqxv9ic7A6SwgMficSw/132",
                    createTime:"",
                    id:1,
                    nickName:"Crystal～",
                    score:"5.88秒",
                    updateTime:"",
                    userId:"",
                },
                {
                    activityId:1,
                    avatarUrl:"https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLicVBmSTBeWWllgOh8U0s564YRiaV0XQuMFm46MKnaGZWn0D6icDM0H48kQbo1Dqxv9ic7A6SwgMficSw/132",
                    createTime:"",
                    id:1,
                    nickName:"Crystal～",
                    score:"5.88秒",
                    updateTime:"",
                    userId:"",
                },
                {
                    activityId:1,
                    avatarUrl:"https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLicVBmSTBeWWllgOh8U0s564YRiaV0XQuMFm46MKnaGZWn0D6icDM0H48kQbo1Dqxv9ic7A6SwgMficSw/132",
                    createTime:"",
                    id:1,
                    nickName:"Crystal～",
                    score:"5.88秒",
                    updateTime:"",
                    userId:"",
                }
            ],
        };
    },
    computed: {
        top3List(){
            return this.rankList.length>0?this.rankList.filter((item,index)=>index<3):[]
        },
        resetList(){
            return this.rankList.length>3?this.rankList.filter((item,index)=>index>=3):[]
        }
    },
    watch:{
        createTime(val){
            // this.getRankList();
        }
    },
    onLoad(options) {
        this.activityId = options.id
        this.getActivityInfo()
    },
    methods: {
        async getActivityInfo(){
            let {code,data = {}} = await api.getActivityContent(this.activityId);
            if(code == 1){
                this.start = data.startTime.split(" ")[0]
                this.end = data.endTime.split(" ")[0]
                console.log(this.start)
            }

        },
        bindDateChange (e) {
            let that = this
            that.createTime = e.detail.value

        },
        async getRankList(){
            let {activityId,createTime}=this;
            let {code,data = {}} = await api.getRankInfo({activityId,type:2,createTime})
            if(code==1){
                this.rankList = data;
            }
        },
        toActivity(){
            uni.navigateTo({
                url: `/pages/fissionActivity?id=${this.activityId}`
            })
        },
        getDate(){
            const date = new Date(new Date().getTime() - 3600 * 1000 * 24 * 1)
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            month = month > 9 ? month : '0' + month;
            day = day > 9 ? day : '0' + day;
            return `${year}-${month}-${day}`;
        }
    }

};
</script>

<style scoped lang="less">
    @import '@/static/less/public.less';
    .search{
        padding:8rpx 32rpx;
        .search-picker{
            width: 686rpx;
            height: 72rpx;
            line-height: 72rpx;
            background: #f8f8f8;
            border: 2rpx solid #ebebeb;
            border-radius: 38rpx;
            margin:0 auto;
            padding:0 32rpx;
            box-sizing: border-box;
           
        }
        .search-input{
            font-size: 28rpx;
            color: #999999;
            position: relative;
            &.hasChoosed{
                color: #333333
            }
            &:after{
                content: "";
                position: absolute;
                right:0;
                top:50%;
                display: block;
                width: 12rpx;
                height: 12rpx;
                border-top: 2rpx solid #999999;
                border-right: 2rpx solid #999999;
                transform: translateY(-50%)rotate(45deg);
            }
        }
    }
    .podium{
        .setbg(750rpx,540rpx,'jigsaw/podium-bg.png');
        padding: 20rpx;
        box-sizing: border-box;
        position: relative;
    }
    .ranking-text{
        font-size: 24rpx;
        text-align: center;
        white-space: pre-line; 
        color: #ffb5aa;
    }
    .top3{
        position: absolute;
        width:100%;
        height: 250rpx;
        bottom:160rpx;
    }
    .winner{
        width:33.33%;
        position: absolute;
        text-align: center;
        .header{
            height: 120rpx;
            width: 120rpx;
            position: relative;
            margin:0 auto;
            &:before{
                content: "";
                position: absolute;
                top: -22rpx;
                left: -22rpx;
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
        left: 31%;
        transform: translateY(-20rpx);
        .header{
            &:before{
                .setbg(56rpx,56rpx,'jigsaw/no1.png');
            }
        }
    }
    .no2{
        left: 0;
        .header{
            &:before{
                .setbg(56rpx,56rpx,'jigsaw/no2.png');
            }
        }
    }
    .no3{
        right: 5%;
        .header{
            &:before{
                .setbg(56rpx,56rpx,'jigsaw/no3.png');
            }
        }
    }
    .ranking-list{
        width: 100%;
        background: #ffffff;
        border-radius: 20rpx;
        margin-top: -50rpx;
        position: relative;
        z-index: 10;
        padding:16rpx 33rpx 16rpx 43rpx;
        box-sizing: border-box;
        .rank-item{
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 135rpx;
            border-bottom:1px solid #ebebeb;
        }
        
    }
    .rank-left{
        display: flex;
        align-items: center;
    }
    .ranking-list .number,
    .mine .number{
        font-size: 32rpx;
        font-family: DIN, DIN-Bold;
        font-weight: 700;
        font-style: italic;
        text-align: center;
        color: #666666;
    }
    .ranking-list .wxHead,
    .mine .wxHead{
        width: 88rpx;
        height: 88rpx;
        overflow: hidden;
        margin:0 24rpx 0 38rpx;
        border-radius: 50%;
    }
    .ranking-list .name,
    .mine .name{
        font-size: 32rpx;
        color: #333333;
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
