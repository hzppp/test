<template>
    <view  class="rank-list">
        <scroll-view 
            scroll-y="true" 
            class="scroll-view" 
            :scroll-top='scrollTop' 
            @scroll="scroll"
            @scrolltolower="loadMore" 
           >
            <view class="ranking-view">
                <template v-if="!isRankWin || type == 3">
                    <template v-if="rankList.length>0">
                        <view class="podium">
                            <view class="ranking-text">{{podiumTxt}}</view>
                            <view class="top3">
                                <view :class="['winner','no'+(index+1)]" v-for="(item,index) in top3List" :key="index">
                                    <view class="header">
                                        <image class="wxHead" :src="item.avatarUrl"></image>
                                    </view>
                                    <view class="wxName">{{item.nickName}}</view>
                                    <view class="time">{{item.score}}秒</view>
                                </view>
                            </view>
                        </view>
                        <view class="ranking-list"  v-if="resetList.length>0">
                            <view class="rank-item" v-for="(item,index) in resetList" :key="index">
                                <view class="rank-left">
                                    <view class="number">{{index+4}}</view>
                                    <image class="wxHead" :src="item.avatarUrl"></image>
                                    <view class="name">{{item.nickName}}</view>
                                </view>
                                <view class="time">{{item.score}}秒</view>
                            </view>
                            <view v-show="isLoadMore||isLoaded" class="loadStatus">{{loadStatus}}</view>
                        </view>

                        
                    </template>
                    <view class="noData" v-else>
                        <view class="no-data-icon"></view>
                        <view class="no-data-txt">现在没有数据哦~</view>
                    </view>
                </template>
                <view class="collect-info" v-else-if="type!=3">
                    <view class="win-txt">{{winTxt}}</view>
                    <view class="info-form">
                        <view class="form-item">
                            <view class="input-label">邮寄姓名</view>
                            <view class="input-con">
                                <input type="text" :always-embed="true" v-model="saveInfo.userName" placeholder="请填写姓名"
                                placeholder-class="placeholder"  class="input"></input>
                            </view>
                        </view>
                        <view class="form-item">
                            <view class="input-label">邮寄电话</view>
                            <view class="input-con">
                                <input type="text" :always-embed="true" v-model="saveInfo.mobile" placeholder="请填写电话号码"
                                placeholder-class="placeholder" class="input"></input>
                            </view>
                        </view>
                        <view class="form-item form-txtarea">
                            <view class="input-label">邮寄地址</view>
                            <view class="input-con">
                                <textarea maxlength="80" placeholder="请填写收货地址"
                                placeholder-class="placeholder" v-model="saveInfo.address" class="input"></textarea>
                            </view>
                        </view>
                    </view>
                    <view class="submit" @tap='submit()'>{{formBtntxt}}</view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script>
import api from '@/public/api/index'
import {checkPhone,trim, getYesterDayDate} from '@/units/check'
let app = getApp()
export default {
    props: {
        activityId:{
            type: String,
            default: ""
        },
        type:{
            type: Number,
            default: 0
        },
        mineRank:{
            type: Number,
            default: 0
        },
        todayRankWinDate:{
            type: String,
            default: ""
        },
        isRankWin:{
            type: Boolean,
            default: false
        }
    },
    computed: {
        top3List(){
            return this.rankList.length>0?this.rankList.filter((item,index)=>index<3):[]
        },
        resetList(){
            return this.rankList.length>3?this.rankList.filter((item,index)=>index>=3 && index<100):[]
        },
        podiumTxt(){
            let endTime = app.globalData.avtivityEndTime
            switch(this.type) {
				case 1: {
                    return '只显示前100名，每5分钟更新一次\n凌晨24:00截止当天挑战'
                    break;
                }
                case 2: {
                    return `只显示前100名，每5分钟更新一次\n${endTime}截止挑战`
                    break;
                }
                case 3: {
                    return '只显示前100名'
                    break;
                }
                default: {
                    return '只显示前100名'
                    break;
                }
                        }
        },
        winTxt(){
            switch(this.type) {
				case 1: {
                    return `日榜已于${this.todayRankWinDate}挑战成功,\n获得日榜排行奖励一份，请登记邮寄信息`
                    break;
                }
                case 2: {
                    return `恭喜您，总排行榜第${this.mineRank}名\n获得总榜排行奖励一份，请登记邮寄信息`
                    break;
                }
                default: {
                    return ''
                    break;
                }
            }
        }
    },
    watch: {
        isRankWin(val){
            if(val){
                this.getWinInfo()
            }
        },
        type(val){
			this.goTop()
        }
    },
    components: {},
    data() {
        return {
            scrollTop: 0,
            old: {
                scrollTop: 0
            },
            rankList:[],
            saveInfo:{
                address:"",
                mobile:"",
                userName:"",
            },
            submiting:false,
            createTime:"",
            scrollHeight:0,
            formBtntxt:"提交",
            loadStatus: 'loading', //加载样式：more-加载前样式，loading-加载中样式，nomore-没有数据样式
			isLoadMore: false, //是否加载中
            isLoaded:false, //是否加载完成
            pageNum:1,
            pageSize:10,
            total:0
        };
    },
    methods: {
        loadMore() { //上拉触底函数
            console.log(333333333333 + '加载更多')
            if (!this.isLoadMore && this.pageNum<=this.total) { //此处判断，上锁，防止重复请求
                this.pageNum++
                this.isLoadMore = true
                this.getRankList()
            }
            if(this.pageNum>this.total){
                this.isLoaded=true;
                this.loadStatus="没有更多了哟~"
            }
        },
        async getRankList(){
            let {activityId,type,createTime,pageNum,pageSize}=this;
            let {code,data = {}} = await api.getRankInfo({activityId,type,createTime,pageNum,pageSize})
            if(code==1){
                this.rankList = [...this.rankList,...data.topRankList];
                this.isLoadMore = false
                this.total = data.pageTotal<=10 ? data.pageTotal : 10
                this.getScrollHeight()
            }
        },
        getScrollHeight() {
            let that = this;
            let list = uni.createSelectorQuery().in(this).select('.ranking-view');
            setTimeout(() => {
                list.boundingClientRect(data => {
                // console.log(data)
                if (data) {
                    if (data.height && data.height == '' || data.height && data.height == null || data.height && data.height ==
                    'null') {
                        that.getScrollHeight();
                    }
                    that.scrollHeight = data.height +50;
                    this.$emit('setScrollHeight',this.scrollHeight)
                }
                }).exec();
            }, 0);
        },
        
        async getWinInfo(){
            let {activityId,type}=this;
            let {code,data = {}} = await api.selectWinInfo({activityId,type})
            if(code == 1 && data){
                this.saveInfo= data;
                this.formBtntxt = "修改"
            }
        },
        async submit(){
            if(this.submiting){
                // 防止重复点击
                return
            }
            if (!trim(this.saveInfo.userName)) {
				this.$toast('请先输入邮寄姓名')
				return
			}
            if (!this.saveInfo.mobile) {
				this.$toast('请先输入邮寄电话')
				return
			}
            if (!checkPhone(this.saveInfo.mobile)) {
				this.$toast('请先输入正确的邮寄电话')
				return
			}
            if (!this.saveInfo.address) {
				this.$toast('请先输入邮寄地址')
				return
			}
            this.submiting = true
            let {address,mobile,userName} = this.saveInfo
            let {activityId,type} =this
            let {code,data = {},msg} = await api.saveWinInfo({activityId,type,address,mobile,userName})
            if (code == 1) {
                this.$toast('提交成功')
                this.getWinInfo()
                this.submiting = false
            }else{
                this.$toast(msg)
                this.submiting = false
            }
        },
        scroll(e) {
            console.log("scroll")
            this.old.scrollTop = e.detail.scrollTop
        },
        goTop() {
            this.scrollTop = this.old.scrollTop
            this.$nextTick(() => {
                this.scrollTop = 0
            });
        }
    },
    created() {

    },
    mounted() {
        
        if(this.type == 3){
            this.createTime = getYesterDayDate()
        }else{
            this.createTime = ""
        }
        this.getRankList()
    },
};
</script>

<style scoped lang="less">
    @import '@/static/less/public.less';
    .rank-list{
        
        width: 100%;
        overflow: hidden;
        box-sizing: border-box;
        .ranking-view{
            min-height: calc(100% - 88rpx);
            position: relative;
            overflow: hidden;
        }   
        .scroll-view{
            height: 100vh;
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
                    top: -21rpx;
                    left: -21rpx;
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
                .wxHead{
                    border:4rpx solid #fedb58
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
            .wxHead{
                border:4rpx solid #c2ddf0
            }
        }
        .no3{
            right: 5%;
            .header{
                &:before{
                    .setbg(56rpx,56rpx,'jigsaw/no3.png');
                }
            }
            .wxHead{
                border:4rpx solid #f0cbbe
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
        padding-bottom: 150rpx;
        box-sizing: border-box;
        .rank-item{
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 135rpx;
            border-bottom:1px solid #ebebeb;
            &:last-child{
                border-bottom: none;
            }
        }
        
    }
    .rank-left{
        display: flex;
        align-items: center;
    }
    .ranking-list .number{
        font-size: 32rpx;
        font-family: DIN, DIN-Bold;
        font-weight: 700;
        font-style: italic;
        text-align: center;
        color: #666666;
    }
    .ranking-list .wxHead{
        width: 88rpx;
        height: 88rpx;
        overflow: hidden;
        margin:0 24rpx 0 38rpx;
        border-radius: 50%;
    }
    .ranking-list .name{
        font-size: 32rpx;
        color: #333333;
    }
    
    .noData{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        margin-top: 200rpx;
        .no-data-icon{
            .setbg(670rpx,324rpx,'jigsaw/no-data-icon.png');
        }
        .no-data-txt{
            font-size: 28rpx;
            color: #999999;
            margin-top: 20rpx;
        }
    }
    .win-txt{
        .setbg(750rpx,360rpx,'jigsaw/collect-bg.png');
        display: flex;
        align-items: center;
        justify-content: center;
        white-space: pre-line;
        font-size: 32rpx;
        color: #ffffff;
        padding-bottom: 80rpx;
    }
    .info-form{
        width: 686rpx;
        height: 404rpx;
        background: #ffffff;
        border-radius: 20rpx;
        margin:-123rpx auto 0;
        padding:0 30rpx;
        box-sizing: border-box;
        .form-item{
            display: flex;
            align-items:center;
            min-height: 106rpx;
            border-bottom: 1px solid #EBEBEB;
        }
        .form-txtarea{
            align-items: flex-start;
            padding-top: 40rpx;
            border-bottom: none;
            .input{
                height: 100rpx;
            }
        }
        .input-label{
            font-size: 32rpx;
            color: #666666;
            width: 184rpx;
        }
        .placeholder{
            font-size: 32rpx;
            color: #cccccc;
        }
        .input{
            width: 442rpx;
        }
    }
    .submit{
        font-size: 32rpx;
        width: 600rpx;
        height: 88rpx;
        background: #fa8845;
        border-radius: 44rpx;
        text-align: center;
        line-height: 88rpx;
        margin:60rpx auto;
        color: #ffffff;
    }
    .loadStatus{
        font-size: 28rpx;
        color: #666666;
        text-align: center;
        margin-top: 20rpx;
    }
</style>
