<template>  
    <view class="lottery">  
        <view class="lottery-canvas-container" :style="{transform:'rotate('+runDeg+'deg)'}">
            <view class="lottery-canvas">
                <view class="canvas-list" v-show="isLoadedNum == prizes.length">  
                <view class="canvas-item" v-for="(iteml,index2) in prizes" :key="index2">  
                    <view class="canvas-item-con" :style="[{transform:'rotate('+iteml.turn+')'}]">  
                    <image class="canvas-item-con-img" :src="iteml.src" mode="aspectFit" @load="e => imgBindload()"></image>  
                    </view>  
                </view>  
                </view>  
            </view>
       </view> 
       <image class="lucky-wheel-btn" src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/handleDraw.png" @click="toPlay" style="z-index: 999;"> 

    </view>  
</template>

<script>  
    const app = getApp()
    export default {
        name:'lottery',
        props:{
            prizes: {
                type: Array,
                default: () => []
            },
            runDeg:{
                type: Number,
                default: () => {
                    return 0
                }
            }
        },
        data() {  
            return {  
                animationData: {},  
                isLoadedNum:0,
            };  
        },  
   
        mounted() {
        },
        methods: {
            imgBindload () {
                this.isLoadedNum++;
            },
 
            //发起抽奖  
            toPlay(){
                if(app.globalData.isRotating) {
                uni.showToast({
                    title:"正在抽奖，请勿频繁操作",
                    icon:"none"
                })
                return;
                }
                app.globalData.isRotating = true
                this.$emit('start')
            }
        } 
        

    }  
</script>
<style lang="less" scoped>
	@import '@/static/less/public.less';
    .lottery-canvas-container{
		width:520rpx;
		height: 520rpx;
		margin:0 auto;
		top: 326rpx;
        position: relative;
        transition: transform  4000ms ease;
		.lottery-canvas{
		    width:100%;
		    height: 100%;
            position: absolute;
            left:50%;
            top: 50%;
            transform: translate(-50%,-50%);
            overflow: hidden;
            border-radius: 100%;
        }
		.canvas-list {  
            position: absolute;  
            left: 0;  
            top: 0;  
            width: inherit;  
            height: inherit;  
            z-index: 998;  
        } 
        .canvas-item {  
            position: absolute;  
            left: 0;  
            top: 0;  
            width: 100%;  
            height: 100%;  
		}  
		.canvas-item-con {  
            position: relative;  
            display: block;  
            margin: 0 auto;  
            text-align: center;  
            -webkit-transform-origin: 50% 260rpx;  
            transform-origin: 50% 260rpx;  
            display: flex;  
            flex-direction: column;  
            align-items: center;  
        }  
        .canvas-item-con-img{  
            height:260rpx; 
        }  
    }
    .lucky-wheel-btn {
        position: absolute;
        z-index: 999;
        left: 50%;
        top: 50%;
        width: 211rpx;
        height: 219rpx;
        transform: translate(-50%, -50%);
        border-radius: 50%;
    }
</style>
