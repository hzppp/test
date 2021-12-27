<template>
    <view class="red-package-page">
       <view class="package-top" :style="'top:' + navHeight + 'px'">
            <!-- 中奖记录 -->
			<win-records :winnerRecords="winnerRecords" :autoplay="autoplay" v-if="winnerRecords && winnerRecords.length>=3"/>
            <!-- 我的红包 -->
            <view class="mypackage-btn" @tap="goMyPackage">我的红包</view>
        </view>
        <slot :chanceCount="chanceCount"></slot>
       <!-- 邀请记录 -->
	    <invite-records :activityId="activityId" :isRecordsShow="false"/>
       <!-- 抽奖说明 -->
	   <draw-tips :activityMemoArr="activityMemoArr" v-if="activityMemoArr"/>
       <!-- 中奖弹窗 -->
       <packet-popup 
       :isOpen.sync="isOpen" 
       :isSharePosterPic="isSharePosterPic"
       :shareStatus="shareStatus">
            <view class="win-inner-con" >
                <block v-if="amount>0">
                    <view class="win-txt1">恭喜获得</view>
                    <view class="win-money"><text>{{amount}}</text>元</view>
                    <view class="win-txt2">6小时内到账微信钱包，请注意查收</view>
                </block>
                <block v-else>
                    <view class="win-txt1">很遗憾，没有拆到红包</view>
                    <view class="win-txt3">红包擦肩而过</view>
                </block>
            </view>
       </packet-popup>
    </view>
</template>
<script>
const app = getApp()
import api from '@/public/api/index'
import winRecords from '@/components/winRecords/winRecords'
import inviteRecords from '@/components/inviteRecords/inviteRecords'
import drawTips from '@/components/drawTips/drawTips'
import packetPopup from '@/components/packetPopup/packetPopup'
export default {
    props:{
        navHeight: {
			type: Number,
			default: 0
		},
        activityId:{
            type: String,
            default: ""
        },
        shareStatus: {
			type: Number,
			default: 0
		},
        isSharePosterPic:{
            type: Boolean,
            default: false
        }
    },
    components: {
        winRecords,//中奖记录
        inviteRecords,//邀请记录
        drawTips,//抽奖说明
        packetPopup //中奖弹窗
    },
    data() {
        return {
            winnerRecords: [],
            activityMemoArr:"",
            amount:0,
            isOpen:false,
            isOpening:false,//是否正在打开红包
            chanceCount:"",
            autoplay:true
        }
    },
    mounted() {
        this.getActivityInfo()
    },
    methods: {
        goMyPackage(){
            if(this.isOpening) return;
            uni.navigateTo({
                url:`/pages/myPackets?activityId=${this.activityId}`
            })
        },
        async getActivityInfo(){
            let {code,data={},msg=""} = await api.getLotteryActInfo({activityId:this.activityId,isRedPacketActivity:1})
            if(code == 1){
                this.chanceCount = data.chanceCount;
                console.log("获取当前抽奖机会",this.chanceCount)
                this.winnerRecords = data.winnerRecords
                this.activityMemoArr = data.activityMemo.replace('/n', '/r/s')
            }else{
                uni.showToast({
                    title: msg,
                    icon: "none"
                })
            }
        },
        async openPacket(){
            if(this.chanceCount<=0) return;
            let {code,data,msg} = await api.openRedPacket({activityId: this.activityId})
            if(code==1){
                this.isOpen = true;
                this.isOpening =true;
                setTimeout(()=>{
                    this.isOpening=false;
                },2500)
                this.amount=data.amount
                this.getActivityInfo();
            }else{
                uni.showToast({
                    title: msg,
                    icon: "none"
                })
            }
            
        }
    }
}
</script>
<style lang="css" scoped>
    
</style>
<style lang="less" scoped>
    
    @import '@/static/less/public.less';
    .red-package-page{
        background: #fef7ea;
        padding-bottom: 44rpx;
        .package-top{
            position: absolute;
            width: 100%;
            left: 0;
            padding: 20rpx;
            box-sizing: border-box;
        }
        .mypackage-btn{
            font-size: 28rpx;
            .setbg(156rpx,56rpx,'redpackage/package-btn-bg.png');
            text-align: center;
            line-height: 56rpx;
            color: #ffffff;
            float: right;
        }
        
       
        .win-inner-con{
            height: 335rpx;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .win-txt1{
                font-size: 40rpx;
                line-height: 1;
                color: #fa8845;
                margin-bottom: 45rpx;
            }
            .win-money{
                font-size: 32rpx;
                color: #f82e1c;
                line-height: 42rpx;
                font-weight: bold;
                text{
                    font-size: 78rpx;
                }
            }
            .win-txt2{
                font-size: 24rpx;
                color: #fa8845;
                line-height: 1;
                margin-top: 40rpx;
            }
            .win-txt3{
                font-size: 64rpx;
                line-height: 1;
                color: #e70026;
            }
        }
        
    }
</style>



