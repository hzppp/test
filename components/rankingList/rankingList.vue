<template>
    <view class="rank-list">
        <template v-if="!isRankWin">
            <template v-if="rankList.length>0">
                <view class="podium">
                    <view class="ranking-text">只显示前100名{{type!=2?'，每5分钟更新一次\n凌晨24:00截止当天挑战':''}}</view>
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
                <view class="mine" v-if="type!=2">
                    <template v-if="isBlack">
                        <view class="rank-left">
                            <view class="number">{{mineRank}}</view>
                            <image class="wxHead" :src="wxUserInfo.wxHead"></image>
                            <view class="name">{{wxUserInfo.wxName}}</view>
                        </view>
                        <view class="time">{{mineScore}}</view>
                    </template>
                    <view class="blacker" v-else>您已被列入黑名单，成绩不计入榜单\n如有疑问，请咨询在线客服</view>
                </view>
                <view class="more-ranking" v-else>
                    <view class="more-btn">更多历史榜单</view>
                </view>
            </template>
            <view class="noData" v-else>
                <view class="no-data-icon"></view>
                <view class="no-data-txt">现在没有数据哦~</view>
            </view>
        </template>
        <view class="collect-info" v-else-if="type!=2">
            <view class="win-txt">
                恭喜您，{{type==0?'日榜已于1月18日挑战成功':'总排行榜第8名'}}\n获得{{type==0?'日榜':'总榜'}}排行奖励一份，请登记邮寄信息
            </view>
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
            <view class="submit" @tap='submit()'>提交</view>
        </view>
    </view>
</template>

<script>
import api from '@/public/api/index'
import {checkPhone,trim} from '@/units/check'
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
        createTime:{
            type: String,
            default: ""
        }
    },
    computed: {
        top3List(){
            return this.rankList.length>0?this.rankList.filter((item,index)=>index<3):[]
        },
        resetList(){
            return this.rankList.length>3?this.rankList.filter((item,index)=>index>=3):[]
        }
    },
    watch: {
        isRankWin(val){
            if(val){
                this.getWinInfo()
            }
            
        },
        type(val){

        }
    },
    components: {},
    data() {
        return {
            wxUserInfo:{},
            mineRank:0,
            mineScore:"5.88秒",
            isRankWin:false,
            isBlack:false,
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
            saveInfo:{
                activityId:this.activityId,
                address:"",
                mobile:"",
                userName:"",
                createTime:""
            },
            submiting:false
        };
    },
    methods: {
        async getRankList(){
            let {activityId,type}=this;
            let {code,data = {}} = await api.getRankInfo({activityId,type})
            if(code==1){
                this.rankList = data;
            }
        },
        async getUserRankInfo(){
            let {activityId}=this;
            let {code,data = {}} = await api.getUserRankInfo({activityId})
            if(code==1){
                this.mineRank = this.type==0?data.todayRank:this.type==1?data.sumRank:"";
                this.mineScore = this.type==0?data.todayBest:this.type==1?data.historyBest:"";
                this.isRankWin = this.type==0?data.isTodayRankWin:this.type==1?data.isSumRankWin:false;
                this.isBlack = data.isBlack;
            }
        },
        async getWinInfo(){
            let {activityId}=this;
            let {code,data = {}} = await api.selectWinInfo({activityId})
            if(code == 1){
                this.saveInfo= data;
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
            if (!checkPhone(this.saveInfo.address)) {
				this.$toast('请先输入邮寄地址')
				return
			}
            this.submiting = true
            let {activityId,address,mobile,userName} = this.saveInfo
            let {code,data = {},msg} = await api.saveWinInfo(this.saveInfo)
            if (data.code == 1) {
                this.$toast('提交成功')
                this.submiting = false
            }else{
                this.$toast(msg)
                this.submiting = false
            }
        },
        toHistory(){
            uni.navigateTo({
                url: `/pages/historyRanking?id=${activityId}`
            })
        }
    },
    created() {

    },
    mounted() {
        this.wxUserInfo = uni.getStorageSync('wxUserInfo')
        console.log(this.wxUserInfo)
        // this.getUserRankInfo()
        // this.getRankList()
    },
};
</script>

<style scoped lang="less">
    @import '@/static/less/public.less';
    .rank-list{
        padding-bottom: 150rpx;
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
        .name,.number{
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
</style>
