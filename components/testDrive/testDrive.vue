<template>
<view>
  <!--  #ifdef MP-WEIXIN  -->
  		<movable-area class="movableArea">
  			<movable-view class="movableView" :position="position" :x="x" :y="y" :direction="direction"
  				:damping="damping" :inertia="true" @change="onChange" @touchend="onTouchend">
  				<button class="btn" @tap="goTestDrive"></button>
  			</movable-view>
  		</movable-area>
  		<!--  #endif  -->
  
  
  		<!--  #ifndef MP-WEIXIN  --> 
  	<!-- 	<view class="movableArea">
  			<view class="movableView" :position="position" :x="x" :y="y" :direction="direction" :damping="damping"
  				:inertia="true" @change="onChange" @touchend="onTouchend">
  				<button class="btn" @tap="goTestDrive"></button>
  			</view>
  		</view> -->
  		<!--  #endif  -->
</view>
</template>

<script>
const app = getApp()
export default {
name: "testDrive",
  props: {
    aldEventName: {
      type: String,
      default: ""
    },
    damping: {
      type: Number,
      default: 10
    },
    direction: {
      type: String,
      default: "all"
    },
    position: {
      type: Number,
      default: 4
    }
  },
  data() {
    return {
      x: 0,
      y: 0,
      x1: 0,
      x2: 375,
      y1: 0,
      y2: 0,
      move: {
        x: 0,
        y: 0
      }
    };
  },
  methods: {
    goTestDrive() {
      if(this.aldEventName) {
        console.log('首页 浮窗',this.aldEventName)
		// #ifdef MP-WEIXIN
		wx.aldstat.sendEvent(this.aldEventName)
		// #endif
        
      }
      uni.navigateTo({
         url: `/pages/YuyuePage`
      })
    },
    onChange(e) {
      if (e.detail.source === "touch") {
        this.move.x = e.detail.x;
        this.move.y = e.detail.y;
      }
    },
    onTouchend() {
      if(!this.move.x && !this.move.y) return
      this.x = this.move.x;
      this.y = this.move.y;
      setTimeout(() => {
        if (this.move.x < this.x2 / 2) this.x = this.x1;
        else this.x = this.x2;
        console.log(this.x, this.y)
        // app.globalData.testDriveX = this.x
        // app.globalData.testDriveY = this.y
      }, 100)
    }
  },
  created() {
    this.x = app.globalData.testDriveX
    this.y = app.globalData.testDriveY
  }
}
</script>

<style scoped lang="less">
.btn {
  //right: 10rpx;
  //bottom: 308rpx;
  width: 110rpx;
  height: 116rpx;
  background: url("https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/testDriveNew.png");
  background-size: cover;
  // background: #007AFF;
}
 .movableArea {
   position: fixed;
  top: 50%;
  left: 0rpx;
  /*  #ifdef  MP-WEIXIN */
   top: 0;
   left: 0;
  /*  #endif  */
   width: 100%;
   height: 100%;
   pointer-events: none; //设置area元素不可点击，则事件便会下移至页面下层元素
   z-index: 9999;
 
 .movableView {
	/*  #ifndef  MP-WEIXIN */
	position: absolute;
	right: 0;
	/*  #endif  */
   pointer-events: auto; //可以点击
   border-radius: 100%;

   width: 130rpx;
   height: 160rpx;
   box-sizing: border-box;

}
}
</style>
