v<template>
    <view class="packet-popup">
        <view class="process">
            <view class="process-close-cover"></view>
            <view class="process-close" :animation="animationData"></view>
            <view class="process-open-behind hide" :animation="animationData2"></view>
            <view class="process-open-inner hide" :animation="animationData3">
               <slot></slot>
            </view>
            <view class="process-open-front hide" :animation="animationData2"></view>
            <view class="share-btn-group hide" :animation="animationData2">
                <!--  #ifdef MP-WEIXIN  -->
                <button v-if="sharePosterPic"
                    :class="'share-btn ' + (shareStatus == 0 ? 'share-tip':'')" hover-class="none"
                    @tap='shareChoise()'>分享好友</button>

                <button v-else :class="'share-btn ' + (shareStatus == 0 ? 'share-tip':'')"
                    hover-class="none" open-type="share" @click="shareBtnClick">分享好友</button>
                <!-- #endif -->
                <!--  #ifndef MP-WEIXIN  -->
                <button :class="'share-btn ' + (shareStatus == 0 ? 'share-tip':'')"
                    hover-class="none" open-type="share" @click="shareBtnClick">分享好友</button>
                <!-- #endif -->
            </view>
        </view>
    </view>
</template>
<script>
var timer = null ; //创建一个定时器
export default {
    data() {
      return {
        animation:'',
        animationData: {},
        animation2:'',
        animationData2: {},
        animation3:'',
        animationData3: {},
        isWin:true,
        sharePosterPic:false,
        shareStatus:false
      }
    },
    mounted() {
        this.$nextTick(() => {
            // 初始化一个动画
            this.animation = uni.createAnimation({
                timingFunction: 'linear',  
            })
            this.shake()

            this.animation2 = uni.createAnimation({
                duration: 600,  //动画持续1秒
                timingFunction: 'ease-in',  
                delay:1450  //延迟两秒执行动画
            })
            this.show()

            this.animation3 = uni.createAnimation({
                timingFunction: 'ease-out',  
            })
            this.moveUp()
        })
    },
    methods: {
       //定义动画,红包左右晃动
        shake(){
           this.animation.rotate(12).step({duration:60}) 
           this.animation.rotate(0).step({duration:60})  

           this.animation.rotate(-11).step({duration:60})
           this.animation.rotate(0).step({duration:60})

           this.animation.rotate(10).step({duration:60}) 
           this.animation.rotate(0).step({duration:60}) 

           this.animation.rotate(-9).step({duration:60})
           this.animation.rotate(0).step({duration:60})

           this.animation.rotate(8).step({duration:55})
           this.animation.rotate(0).step({duration:55})

           this.animation.rotate(-7).step({duration:50})
           this.animation.rotate(0).step({duration:50})

           this.animation.rotate(6).step({duration:45})
           this.animation.rotate(0).step({duration:45})

           this.animation.rotate(-5).step({duration:40})
           this.animation.rotate(0).step({duration:40})

           this.animation.rotate(4).step({duration:35})
           this.animation.rotate(0).step({duration:35})

           this.animation.rotate(-3).step({duration:33})
           this.animation.rotate(0).step({duration:33})

           this.animation.rotate(2).step({duration:31})
           this.animation.rotate(0).step({duration:31})

           this.animation.rotate(-1).step({duration:29})
           this.animation.rotate(0).step({duration:29})

           this.animation.opacity(0).step({duration:400,timingFunction: "ease-in"})
           // 导出动画数据传递给data层
           this.animationData = this.animation.export(); //每次执行导出动画时 会覆盖之前的动画
        },
        show() {
            this.animation2.opacity(1).step()
            this.animationData2 = this.animation2.export()
        },
        moveUp(){
            this.animation3.opacity(1).bottom('90rpx').step({duration:200,delay:1850})
            this.animation3.bottom('180rpx').step({duration:200,delay:0})
            this.animationData3 = this.animation3.export()
        }
    },
    destroyed(){
        this.animation=''
        this.animationData= {}
        this.animation2=''
        this.animationData2= {}
        this.animation3=''
        this.animationData3= {}
    }
}
</script>
<style lang="less" scoped>
    @import '@/static/less/public.less';
    .packet-popup{
        position: fixed;
        width: 100%;
        height: 100vh;
        left:0;
        top: 0;
        background: rgba(0,0,0,0.5);
        z-index: 999;
        .process{
            position: absolute;
            width:560rpx;
            left:50%;
            top: 50%;
            margin-left:-280rpx;
            height: 400rpx;
            margin-top: -200rpx;
            // overflow: hidden;
        }
        .hide{
            opacity: 0;
        }
        .process-close-cover{
            .setbg(560rpx,282rpx,'redpackage/packet-cover.png');
            position: absolute;
            left:0;
            top:0;
        }
        .process-close{
            position: absolute;
            width: 100%;
            height: 100%;
            left:0;
            top: 0;
            background: url(https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/redpackage/packet-close.png) no-repeat center/100%;
            // &.hideMove{
            //     animation: hide 0.6s ease-in forwards;
            // }
        }
        .process-open-behind{
            width: 560rpx;
            height: 490rpx;
            position: absolute;
            left:0;
            bottom:0;
            background: url(https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/redpackage/packet-outer-after.png) no-repeat center/100%;
        }
        .process-open-front{
            width: 560rpx;
            height: 260rpx;
            position: absolute;
            left:0;
            bottom:0;
            background: url(https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/redpackage/packet-outer-front.png) no-repeat center/100%;
        }
       
        .process-open-inner{
            width: 536rpx;
            height: 380rpx;
            position: absolute;
            left: 50%;
            margin-left:-268rpx;
            bottom: 0;
            background: url(https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/redpackage/packet-inner-bg.png) no-repeat center/100%;
            &.up{
                animation: moveUp 0.6s ease-out forwards;
            }
        }
        
        .share-btn{
            width: 420rpx;
            height: 100rpx;
            line-height: 100rpx;
            text-align: center;
            border-radius: 50rpx;
            font-size: 36rpx;
            color: #ac3700;
            position: absolute;
            left:50%;
            margin-left:-210rpx;
            bottom:60rpx;
            background: linear-gradient(to right, #ffe569 0%,#ffae00 100%);
        }
        .move{
            .process-close{
                animation: moveScale 0.4s ease-out forwards,shake .2s linear infinite,hide 0.4s ease-in 1.2s forwards;
            }
            .process-open-front,.process-open-behind{
                animation: show 1s ease-out 1.4s forwards;
            }
            .process-open-inner{
                animation: moveUp 0.6s ease-out 1.8s forwards;
            }
            .share-btn-group{
                animation: show 0.6s ease-out 1.8s forwards;
            }
        }
    }
    // @keyframes shake {
    //     0%,
    //     100% {
    //             transform: translateX(0)
    //     }

    //     10% {
    //             transform: translateX(-9px)
    //     }

    //     20% {
    //             transform: translateX(8px)
    //     }

    //     30% {
    //             transform: translateX(-7px)
    //     }

    //     40% {
    //             transform: translateX(6px)
    //     }

    //     50% {
    //             transform: translateX(-5px)
    //     }

    //     60% {
    //             transform: translateX(4px)
    //     }

    //     70% {
    //             transform: translateX(-3px)
    //     }

    //     80% {
    //             transform: translateX(2px)
    //     }

    //     90% {
    //             transform: translateX(-1px)
    //     }
    // }
    @keyframes shake {
        25% {
            transform: rotate(7deg);
        }
        75% {
            transform: rotate(-7deg);
        }
        50%,
        100% {
            transform: rotate(0);
        }
    }
    @keyframes moveScale{
        0% {
            transform: scale(0.9);
        }
        100% {
            transform: scale(1);
        }
    }
    @keyframes hide {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
    @keyframes show {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
    @keyframes moveUp {
        0% {
            opacity: 0;
            bottom: 0;
        }
        30%{
            opacity: 1;
        }
        100% {
            opacity: 1;
            bottom: 180rpx;
        }
    }
</style>
