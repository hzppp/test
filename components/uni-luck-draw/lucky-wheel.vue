<template>
<view class="lucky-wheel-container">
    <!-- 抖音抽奖转盘 -->

    <!-- #ifndef MP-WEIXIN -->
    <view class="lottery-canvas-container" :style="{transform:'rotate('+runDeg+'deg)'}">
      <view class="lottery-canvas">
        <view class="canvas-list" v-show="isLoadedNum == prizes.length">  
          <view class="canvas-item" v-for="(iteml,index2) in prizes" :key="index2">  
            <view class="canvas-item-con" :style="[{transform:'rotate('+iteml.turn+')'}]">  
              <image class="canvas-item-con-img" :src="iteml.imgs[0].src" mode="aspectFit" @load="e => imgBindload(e, 'prizes', index2, 0)" style="z-index: 999;"></image>  
            </view>  
          </view>  
        </view>  
      </view>
    </view> 
    <image class="lucky-wheel-btn" src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/handleDraw.png" @click="toPlay">
    <!-- #endif -->

    <!-- #ifdef MP-WEIXIN -->
      <view v-if="isShow" :class="showDialogL ? 'lucky-box hideWheel':'lucky-box'" :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }">
        <canvas 
          id="lucky-wheel" 
          canvas-id="lucky-wheel" 
          :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }"
        ></canvas>
        <!-- #ifndef MP-WEIXIN -->
      <image class="lucky-wheel-btn" src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/handleDraw.png" @click="toPlay" style="z-index: 999;">
        <!-- #endif -->
        <!-- #ifdef MP-WEIXIN -->
        <cover-image class="lucky-wheel-btn" src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/handleDraw.png" @click="toPlay"/>
        <!-- #endif -->
        <div class="lucky-imgs">
          <div v-for="(prize, index) in prizes" :key="index">
            <div v-if="prize.imgs">
              <image v-for="(img, i) in prize.imgs" :key="i" :src="img.src" @load="e => imgBindload(e, 'prizes', index, i)"></image>
            </div>
          </div>
        </div>

      </view>



      <!-- #endif -->
    </view>
</template>

<script>
  import { changeUnits, resolveImage } from '@/lottery/utils.js'
  import { LuckyWheel } from '@/lottery/lucky-canvas'
  const app = getApp()
  export default {
    name: 'lucky-wheel',
    data () {
      return {
        isShow: false,
        boxWidth: 100,
        boxHeight: 100,
        btnWidth: 0,
        btnHeight: 0,
        dpr: 1,
        transformStyle: '',
        isLoadedNum:0,
      }
    },
    props: {
      width: {
        type: String,
        default: '600rpx'
      },
      height: {
        type: String,
        default: '600rpx'
      },
      blocks: {
        type: Array,
        default: () => []
      },
      prizes: {
        type: Array,
        default: () => []
      },
      buttons: {
        type: Array,
        default: () => []
      },
      defaultConfig: {
        type: Object,
        default: () => {
          return {}
        }
      },
      defaultStyle: {
        type: Object,
        default: () => {
          return {}
        }
      },
      showDialogL: {
        type: Boolean,
        default: false
      },
      runDeg:{
        type: Number,
        default: () => {
          return 0
        }
      }
    },
    watch:{
      animationData(val){
        console.log(val);
      }
    },
    mounted () {
      this.initLucky()
    },
    watch: {
      blocks (newData) {
        this.$lucky && (this.$lucky.blocks = newData)
      },
      prizes (newData) {
        this.$lucky && (this.$lucky.prizes = newData)
      },
      buttons (newData) {
        this.$lucky && (this.$lucky.buttons = newData)
      },
      defaultStyle (newData) {
        this.$lucky && (this.$lucky.defaultStyle = newData)
      },
      defaultConfig (newData) {
        this.$lucky && (this.$lucky.defaultConfig = newData)
      },
      isLoadedNum(newData){
        // console.log("isLoadedNum",newData,newData==this.prizes.length);
        // if(newData==this.prizes.length){
        //     this.draw()
        // }
      }
    },
    methods: {
      async imgBindload (res, name, index, i) {
        const img = this[name][index].imgs[i]

        this.isLoadedNum+=1;

        // #ifdef MP-WEIXIN
        resolveImage(res, img).then(()=>{
        })
        // #endif
      },
      initLucky () {
        const dpr = this.dpr = uni.getSystemInfoSync().pixelRatio
        this.boxWidth = changeUnits(this.width)
        this.boxHeight = changeUnits(this.height)
        const compute = (len) => (len * dpr - len) / (len * dpr) * (dpr / 2) * 100
        this.transformStyle = `scale(${1 / dpr}) translate(
          ${-compute(this.boxWidth * dpr)}%, ${-compute(this.boxHeight * dpr)}%
        )`
        this.isShow = true
		// 页面绘制完
        this.$nextTick(() => {
          this.draw()
        })
      },

      draw () {
        const _this = this
        const ctx = this.ctx = uni.createCanvasContext('lucky-wheel', this)
        const $lucky = this.$lucky = new LuckyWheel({
          // #ifdef H5 || APP-PLUS
          flag: 'UNI-H5',
          // #endif
          // #ifdef MP
          flag: 'UNI-MP',
          // #endif
          dpr: 1,
          ctx: this.ctx,
          width: this.width,
          height: this.height,
          // #ifdef H5
          rAF: requestAnimationFrame,
          // #endif
          setTimeout: setTimeout,
          clearTimeout: clearTimeout,
          setInterval: setInterval,
          clearInterval: clearInterval,
          unitFunc: (num, unit) => changeUnits(num + unit),
          beforeInit: function () {
            const Radius = Math.min(this.config.width, this.config.height) / 2
             console.log('this.config.width, this.config.height',this.config.width, this.config.height,this.config)
            ctx.translate(-Radius, -Radius)
          },
          afterInit: function () {
            // 动态设置按钮
            _this.btnWidth = this.maxBtnRadius * 2
            _this.btnHeight = this.maxBtnRadius * 2
            _this.$forceUpdate()
          },
          beforeDraw: function () {
            ctx.translate(this.Radius, this.Radius)
          },
          afterDraw: function () {
            ctx.draw()
          },
        }, {
          ...this.$props,
          start: (...rest) => {
            this.$emit('start', ...rest)
          },
          end: (...rest) => {
            this.$emit('end', ...rest)
          },
        })
      },
      toPlay (e) {
        console.log('app.globalData.isRotating',app.globalData.isRotating)
        if(app.globalData.isRotating) {
          uni.showToast({
            title:"正在抽奖，请勿频繁操作",
            icon:"none"
          })
          return;
        }
        app.globalData.isRotating = true
        this.$lucky.startCallback()
      },
      init () {
        this.$lucky.init({})
      },
      play (...rest) {
        this.$lucky.play(...rest)
      },
      stop (...rest) {
        this.$lucky.stop(...rest)
      },
    },
  }
</script>

<style scoped lang="less">
  .lucky-box {
    position: relative;
    overflow: hidden;
    margin: 0 auto;
    top: 326rpx;
  }
  .lucky-box canvas {
    position: absolute;
    pointer-events: none;
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
    /*background: url(https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/handleDraw.png) center no-repeat;*/
    background-size: 100%;
  }
  .lucky-imgs {
    width: 0;
    height: 0;
    visibility: hidden;
  }
  .hideWheel {
    top: -11111rpx;
  }

  // 抖音转盘样式
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
            z-index: 9999;  
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
            // width:200rpx;
            will-change: transform; 
            display: block;
        }  
	}
</style>
