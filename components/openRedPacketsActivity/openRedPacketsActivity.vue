<template>
    <view class="red-package-page">
       <view class="package-top" :style="'top:' + navHeight + 'px'">
            <!-- 中奖纪录 -->
			<win-records :winnerRecords="winnerRecords" :autoplay="autoplay"/>
            <!-- 我的红包 -->
            <view class="mypackage-btn" @tap="goMyPackage">中奖纪录</view>
        </view>
        <slot name="operateBtn" :data="chanceCount"></slot>
       <!-- 邀请记录 -->
	    <invite-records :activityId="activityId"/>
       <!-- 抽奖说明 -->
	   <draw-tips :activityMemoArr="activityMemoArr"/>
       <!-- 中奖弹窗 -->
       <packet-popup :isOpen.sync="isOpen">
            <view class="win-inner-con">
                <block v-if="amount>0">
                    <view class="win-txt1">恭喜获得</view>
                    <view class="win-money"><text>3.88</text>元</view>
                    <view class="win-txt2">30分钟内到账微信钱包，请注意查收</view>
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
        }
    },
    components: {
        winRecords,//中奖纪录
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

        }
    },
    mounted() {
        this.getActivityInfo()
    },
    methods: {
        goMyPackage(){
            if(this.isOpening) return;
            uni.navigateTo({
                url:'/pages/myPackets'
            })
        },
        async getActivityInfo(){
            
            let {activityId} = this;
            let {code,data={},msg=""} = await api.getLotteryActInfo({activityId})
            if(code == 1){
                this.chanceCount = data.chanceCount;
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
            this.isOpen = true;
            this.isOpening =true;
            let {code,data,msg} = await api.openRedPacket({activityId: this.activityId})
            setTimeout(()=>{
                this.isOpening=false;
            },2500)
            if(code==1){
                this.amount=data.amount
            }else{
                uni.showToast({
                    title: msg,
                    icon: "none"
                })
            }
        }
    },
}
</script>
<style lang="css" scoped>
    
</style>
<style lang="less" scoped>
    
    @import '@/static/less/public.less';
    .red-package-page{
        background: #fef7ea;
        .package-top{
            position: absolute;
            width: 100%;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20rpx;
            box-sizing: border-box;
        }
        .mypackage-btn{
            font-size: 28rpx;
            .setbg(156rpx,56rpx,'redpackage/package-btn-bg.png');
            text-align: center;
            line-height: 56rpx;
            color: #ffffff;
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



