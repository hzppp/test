<template>
    <view class="jigsaw-play-page" :style='{background: "url(" + bg + ") no-repeat center top/cover;"}'>
        <view class="user-info">
            <image class="wxHead" :src="wxUserInfo.wxHead"></image>
            <view class="wxName">{{wxUserInfo.wxName}}</view>
        </view>
        <view class="deloy" v-if="isStarted">计时：<view class="time">{{counttime}}</view></view>
        <view class="play-area" id="playArea">
            <view :class="['play-area-inner',{'play-area-mask':!isStarted}]">
                <view 
                    v-for="item in boxArr" 
                    :index="pool[item].index" 
                    :key="item" 
                    :class="['piece','piece-'+item]" 
                    :style="{backgroundImage:'url('+selectedImg+')',transform:'translate('+pool[item].x+'rpx,'+pool[item].y+'rpx)'}" 
                    @touchstart="handleTouchstart($event,item,item)"
                    @touchend="handleTouchend($event,item,item)"
                    :ref="'piece' +item">
                </view>
            </view>
        </view>
        <template v-if="!isStarted">
            <view class="btn start-btn" id="start" @click="startGame()">开始游戏</view>
            <view class="game-reminder">点击【开始游戏】即扣除挑战机会</view>
        </template>
        <view class="btn start-btn" @click="onceSuccess()" v-else>一键拼图成功</view>
        <uni-popup ref="resultPopup" type="center" :mask-click="false">
            <view class="challenge-con">
                <image class="wxHead" :src="wxUserInfo.wxHead"></image>
                <view class="used-time">您的成绩为：<text class="time">{{counttime}}秒</text></view>
                <view class="rank-btn">
                    <view class="rank-item rank-date">
                        <text class="label">今日排行</text>
                         <view class="rank-con" @tap="toRank(1)">
                            <view v-if="!userRankInfo.todayAward" class="rank-info">
                                <text class="number" v-if="userRankInfo.todayRank">{{userRankInfo.todayRank}}</text>{{userRankInfo.todayRank?'名':'暂无排名'}}
                            </view>
                            <view v-else class="award">
                                获得奖励
                            </view>
                        </view>
                        <view class="rank-best-con">
                            今日最佳：{{userRankInfo.todayBest && userRankInfo.todayBest != -1 ? userRankInfo.todayBest:'暂无成绩'}}
                        </view>
                    </view>
                    <view class="rank-item rank-total">
                        <text class="label">历史排行</text>
                         <view class="rank-con" @tap="toRank(2)">
                            <view v-if="!userRankInfo.historyAward"  class="rank-info">
                                <text class="number" v-if="userRankInfo.sumRank">{{userRankInfo.sumRank}}</text>{{userRankInfo.sumRank?'名':'暂无排名'}}
                            </view>
                            <view v-else class="award">
                                获得奖励
                            </view>
                        </view>
                        <view class="rank-best-con">
                            历史最佳：{{userRankInfo.historyBest && userRankInfo.historyBest != -1 ? userRankInfo.historyBest:'暂无成绩'}}
                        </view>
                    </view>
                </view>
                <view class="game-rule">每日最终排行榜将在次日凌晨1点前统计\n要记得明天来看哦~</view>
                <view class="challenge-btn" v-if="chanceCount>0" @tap="onceAgain">
                    继续挑战
                    <view class="chance-count">还有{{chanceCount||0}}次机会</view>
                </view>
                <button class="share-btn" hover-class="none" open-type="share" @click="shareBtnClick" v-else>分享好友</button>
            </view>
            <view class="btn-group">
                <navigator :url="'/pages/ranking?id='+ activityId" class="btn">排行榜</navigator>
                <view class="btn" @tap="toIndex">返回首页</view>
            </view>
        </uni-popup>
    </view>
</template>
<script>
import api from '@/public/api/index'
import md5 from "@/units/md5";
export default {
    data() {
        return {
            activityId:"",
            wxUserInfo:{},
            bg:"",
            activeClass: -1,
            boxArractivelass: -1,
            selectedImg: "",
            boxArr: new Array(9).fill(1).map((item, index) => {
                return index;
            }),
            pool: this.generateMatrix(3, 212, 212),
            prevEl:null,
            prevIndex: 0, 
            minute:0,//分
            second:0,
            counttime:0,
            millisecond:0,
            timer:null,
            isStarted:false,
            isSuccess:false,
            chanceCount:0,
            userRankInfo:{
                todayRank:"",
                sumRank:"",
                historyBest:"",
                todayBest:"",
                todayAward:0,
                historyAward:0,
            },
       }
    },
    onLoad(options) {
        this.wxUserInfo = uni.getStorageSync('wxUserInfo')
        console.log("wxUserInfo",this.wxUserInfo)
        this.activityId = options.id
        this.randomPictureConfig()
        
    },
    onShow() {
        this.getActivityInfo(0)
        this.onceAgain()
    },
    async onShareAppMessage() {
        let {data = {}} = await api.getActivityContent(this.activityId)
        let wxUserInfo = uni.getStorageSync('wxUserInfo')
        let title = data.name
        let path = `/pages/fissionActivity?id=${this.activityId}&sourceUserId=${wxUserInfo.id}`
        let imageUrl = data.sharePic || data.detailPic
        return {
            title: title,
            path: path,
            imageUrl: imageUrl
        }
    },
    methods: {
        async randomPictureConfig(){
            console.log(this.activityId)
            let {code,data={},msg=""} = await api.randomPictureConfig({activityId:this.activityId})
            if(code == 1){
                this.selectedImg = data.url;
            }
        },
        async getActivityInfo(type=1){
            const url = `/pages/fissionActivity?id=${this.activityId}`
            let {code,data={},msg=""} = await api.getLotteryActInfo({activityId:this.activityId,activityType:2})
            if(code == 1){
                if (!data.isApply) {
                    uni.showToast({
                        title: '您暂未留资',
                        icon: "none"
                    })
                    setTimeout(() => {
                        uni.reLaunch({
                            url
                        })
                    }, 2000)
				    return;
			    }else if(data.chanceCount==0 && type==0){
                    uni.showToast({
                        title: '您没有挑战机会',
                        icon: "none"
                    })
                    setTimeout(() => {
                        uni.reLaunch({
                            url
                        })
                    }, 2000)
                    return;
                }
                this.bg = data.activityPic
                this.chanceCount = data.chanceCount
            }else{
                uni.showToast({
                    title: msg,
                    icon: "none"
                })
            }
        },
        // 分享按钮被点击
		shareBtnClick() {
			// #ifdef MP-WEIXIN
			wx.aldstat.sendEvent('活动分享点击')
			// #endif			
		},
        // 生成n维矩阵
        generateMatrix(n, dx, dy) {
            var arr = [],
                index = 0;
            for (var i = 0; i < n; i++) {
                for (var j = 0; j < n; j++) {
                arr.push({ x: j * dx, y: i * dy, index: index });
                index++;
                }
            }
            return arr;
        },
        upsetArr(arr) {
            for (var i = 0, len = arr.length; i < len; i++) {
                var a = parseInt(Math.random() * len);
                if(a == i) a = parseInt(Math.random() * len);
                var temp = arr[a];
                arr[a] = arr[i]; // 随机替换
                arr[i] = temp;
            }
            return arr;
        },
        // upsetArr(arr) {
        //     return arr.sort(function() {
        //         return Math.random() > 0.5 ? -1 : 1;
        //     });
        // },
        //开始游戏
        async startGame(){
            if(!this.isStarted){
                let {code,data={},msg=""} = await api.startJigsaw({activityId:this.activityId})
                if(code ==1){
                    this.pool = this.upsetArr(this.pool);
                    this.isStarted = true;
                    this.isSuccess = false;
                    this.millisecond = 0;
                    this.second = 0;
                    this.counttime = 0;
                    clearInterval(this.timer);
                    this.timer = setInterval(()=>{
                        this.countTimer()
                    }, 10);
                }else{
                    this.$toast(msg)
                }
                
            }
        },
        //计时
        countTimer(){
            this.millisecond=this.millisecond+10;
            if(this.millisecond>=1000)
            {
                this.millisecond=0;
                this.second=this.second+1;
            }
            this.counttime=`${this.second?this.second:'0'}.${this.millisecond?this.millisecond/10:'00'}`
        },  
        //再玩一次
        onceAgain(){
            this.isStarted = false;
            this.$refs.resultPopup.close()
            this.randomPictureConfig()
            this.pool = this.generateMatrix(3, 212, 212)
        },
        //手指按下屏幕
        handleTouchstart(event, item,index){
            //如果游戏未开始或者已经挑战成功
            if(!this.isStarted || this.isSuccess){
                return;
            }
            this.prevEl = event.target;
            this.prevIndex = index
            this.startTime = Date.now()
            this.startX = event.changedTouches[0].clientX
            this.startY = event.changedTouches[0].clientY
        },
        //手指离开屏幕
        handleTouchend(event, item,index){
            //如果游戏未开始或者已经挑战成功
            if(!this.isStarted || this.isSuccess){
                return;
            }
            const endTime = Date.now()
            const endX = event.changedTouches[0].clientX
            const endY = event.changedTouches[0].clientY
            //判断按下的时长
            if(endTime - this.startTime >2000){
                return
            }
            //滑动的方向
            let direction = "";
            //先判断用户滑动的距离，是否合法，合法:判断滑动的方向 注意 距离要加上绝对值
            if(Math.abs(endX -this.startX)>Math.abs(endY -this.startY)){
                direction = endX -this.startX >0?"right":"left"
            }else if(Math.abs(endY -this.startY)>Math.abs(endX -this.startX)){
                console.log("上下移动")
                direction = endY -this.startY >0?"down":"up"
            }
            let transformX = this.pool[this.prevIndex].x
            let transformY = this.pool[this.prevIndex].y,
                curposX = 0,
                curposY = 0
            // console.log("transformX:",transformX,"transformY:",transformY,"direction:",direction,"endY:",endY,"startY",this.startY,"endX:",endX,"startX",this.startX)
            if((transformX == 424 && direction=="right") || (transformX == 0 && direction=="left") || (transformY == 424 && direction=="down") || (transformY == 0 && direction=="up")){
                return;
            }else if(direction=="up"){
                curposX=transformX
                curposY=transformY-212
            }else if(direction=="down"){
                curposX=transformX
                curposY=transformY+212
            }else if(direction=="left"){
                curposX=transformX-212
                curposY=transformY
            }else if(direction=="right"){
                curposX=transformX+212
                curposY=transformY
            }else {
                return;
            }
            let curIndex = this.pool.findIndex((item, index) => item.x == curposX && item.y == curposY)
             // 置换数组
            if(curIndex != this.prevIndex){
                let curPostion = this.pool[curIndex]
                this.pool[curIndex] = this.pool[this.prevIndex]
                this.pool[this.prevIndex] = curPostion
           }
           // 校验是否成功
            if (this.isTestSuccess(this.pool)) {
                //清除计时器
                clearInterval(this.timer);
                this.saveResult()
                
            } 
        },
        async saveResult(){
            let timeStamp = new Date().getTime();
            console.log("时间明文",`changan${this.activityId}${this.counttime}${timeStamp}auto555`)
            console.log("时间加密",md5.hex_md5(md5.hex_md5(`changan${this.activityId}${this.counttime}${timeStamp}auto555`)))
            let {code,data={},msg=""} = await api.saveResult({
                activityId:this.activityId,
                timeStamp,
                score:this.counttime,
                signStr:md5.hex_md5(md5.hex_md5(`changan${this.activityId}${this.counttime}${timeStamp}auto555`))    
            })
            if(code == 1){
                this.isSuccess = true;
                this.getActivityInfo()
                this.getUserRankInfo()
                this.$refs.resultPopup.open()
            }
        },
        // 校验是否成功方法
        isTestSuccess(arr) {
            return arr.every(function(item, i) {
                return item.index === i;
            });
        },
        async getUserRankInfo(){
            let {activityId}=this;
            let {code,data = {}} = await api.getUserRankInfo({activityId})
            if(code==1){
                this.userRankInfo = data;
            }
        },
        toRank(){
            let {activityId}=this;
            uni.navigateTo({
                url: `/pages/ranking?id=${activityId}&type=${type}`
            })
        },
        // 测试一键拼图成功
        onceSuccess(){
            clearInterval(this.timer);
            this.saveResult()
        },
        toIndex(){
            uni.navigateBack()
        }
    }
}
</script>
<style lang="less" scoped>
    @import '@/static/less/public.less';
    .jigsaw-play-page{
        position: relative;
        width: 100vw;
        height: 100vh;
        text-align: center;
        background-size:cover;
        padding:32rpx;
        box-sizing: border-box;
        background-color: rgba(0, 0, 0, 0.5);
        overflow: hidden;
        .user-info{
            display: flex;
            align-items: center;
            margin-bottom: 55rpx;
            .wxHead{
                width: 124rpx;
                height: 124rpx;
                border-radius: 100%;
                overflow: hidden;
                border:2rpx solid #fff;
            }
            .wxName{
                font-size: 36rpx;
                color: #fff;
                font-size: 36rpx;
                margin-left: 20rpx;
            }
        }
        .deloy{
            font-size: 32rpx;
            color: #ffffff;
            .time{
                font-size: 60rpx;
                color: #ffffff;
                font-weight: bold;
            }
        }
        .play-area{
            position: relative;
            width: 676rpx;
            height: 676rpx;
            background: #fff;
            border-radius: 10rpx;
            display: flex;
            flex-wrap: wrap;
            margin: 20px auto;
            padding:20rpx;
            box-sizing: border-box;
            .play-area-inner{
                position: relative;
                width: 636rpx;
                height: 636rpx;
            }
            .play-area-mask:after{
                content: "";
                position: absolute;
                left:0;
                top: 0;
                .setbg(636rpx,636rpx,'jigsaw/game-mask.png');
                background-color: rgba(0, 0, 0, 0.5)
            }
            .piece{
                position: absolute;
                left: 0;
                top: 0;
                width: 212rpx;
                height: 212rpx;
                background-repeat: no-repeat;
                background-size: 636rpx 636rpx;
                transition: transform 0.3s ease-in-out;
                
                &-0{
                    background-position: 0 0;
                }
                &-1{
                    background-position: -212rpx 0;
                }
                &-2{
                    background-position: -424rpx 0;
                }
                &-3{
                    background-position: 0 -212rpx;
                }
                &-4{
                    background-position: -212rpx -212rpx;
                }
                &-5{
                    background-position: -424rpx -212rpx;
                }
                &-6{
                    background-position: 0 -424rpx;
                }
                &-7{
                    background-position: -212rpx -424rpx;
                }
                &-8{
                    background-position: -424rpx -424rpx;
                }
            }
        }
    }
    .start-btn {
        font-size: 40rpx;
        text-align: center;
        .setbg(480rpx,100rpx,'jigsaw/start-btn.png');
        line-height: 100rpx;
        font-weight: bold;
        margin:60rpx auto 0;
        color: #ffffff;
    }
    .game-reminder{
        font-size: 24rpx;
        color: #ffffff;
        margin-top: 20rpx;
    }
    .challenge-con{
        width: 600rpx;
        height: 618rpx;
        background: #ffffff;
        border: 2rpx solid #333333;
        border-radius: 20rpx;
        .wxHead{
            width: 130rpx;
            height: 130rpx;
            border: 2rpx solid #333333;
            border-radius: 50%;
            margin-top: -65rpx;
        }
        .used-time{
            font-size: 32rpx;
            color: #333333;
            line-height: 1;
            margin-top: 30rpx;
            margin-bottom: 40rpx;
            .time{
                font-size: 44rpx;
                color: #FC4B06;
                font-weight: bold;
            }
        }
        .rank-btn{
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .rank-item{
            .setbg(246rpx,142rpx,'jigsaw/rank-btn-bg2.png');
            margin:0 13rpx;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            text-align: center;
            .label{
                font-size: 22rpx;
                color: #6d9ffc;
                width: 120rpx;
                line-height: 40rpx;
            }
            .rank-con{
                width:100%;
                padding:0 24rpx;
                box-sizing: border-box;
                text-align: center;
                color: #4d70f2;
                font-size: 32rpx;
                display: flex;
                font-weight: bold;
                justify-content: center;
                align-items: center;
            }
            .rank-info{
                padding: 0 10rpx;
            }
            .rank-best-con{
                font-size: 22rpx;
                color: #ffffff;
                line-height: 45rpx;
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
        .game-rule{
            font-size: 24rpx;
            text-align: center;
            color: #999999;
            line-height: 38rpx;
            margin:40rpx 0;
            white-space: pre-line; 
        }
        .challenge-btn{
			.setbg(400rpx,88rpx,'jigsaw/challenge-more.png');
			font-size: 36rpx;
			color: #ffffff;
			text-align: center;
			line-height: 88rpx;
			font-weight: bold;
			margin:0 auto;
			padding:0;
			position: relative;
			overflow: inherit;
		}
        .chance-count{
            position: absolute;
            .setbg(auto,32rpx,'redpackage/chance-bg.png');
            min-width: 132rpx;
            padding:0 10rpx;
            box-sizing: border-box;
            background-size:cover;
            font-size: 20rpx;
            text-align: center;
            line-height: 32rpx;
            color: #ffffff;
            top:-15rpx;
            right:0;
            white-space: nowrap;
        }
        .share-btn{
            font-size: 36rpx;
            line-height: 88rpx;
            font-weight: bold;
            .setbg(400rpx,88rpx,'jigsaw/share-btn2.png');
            margin:0 auto;
            color: #ffffff;
        }
    }
    .btn-group{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 38rpx;
        .btn{
            width: 286rpx;
            height: 80rpx;
            line-height: 80rpx;
            border: 2rpx solid #ffffff;
            border-radius: 42rpx;
            font-size: 32rpx;
            font-weight: bold;
            text-align: center;
            color: #ffffff;
            margin:0 14rpx;
        }
    }
</style>
