<template>
<view>
  <movable-area class="movableArea">
    <movable-view class="movableView" :position="position" :x="x" :y="y" :direction="direction" :damping="damping" :inertia="true"
                  @change="onChange" @touchend="onTouchend">
      <button class="btn" @tap="goTestDrive"></button>
    </movable-view>
  </movable-area>
</view>
</template>

<script>
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
      x: 400,
      y: 465,
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
        wx.aldstat.sendEvent(this.aldEventName)
      }
      uni.navigateTo({
        url: `/pages/ChooseSerial?type=yuyue`
      })
    },
    onChange(e) {
      if (e.detail.source === "touch") {
        this.move.x = e.detail.x;
        this.move.y = e.detail.y;
      }
    },
    onTouchend() {
      this.x = this.move.x;
      this.y = this.move.y;
      setTimeout(() => {
        if (this.move.x < this.x2 / 2) this.x = this.x1;
        else this.x = this.x2;
        console.log(this.x, this.y)
      }, 100)
    },
  }
}
</script>

<style scoped lang="less">
.btn {
  //right: 10rpx;
  //bottom: 308rpx;
  width: 100rpx;
  height: 145rpx;
  background: url("https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/testDrive.png");
  background-size: cover;
}
.movableArea {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; //设置area元素不可点击，则事件便会下移至页面下层元素
  z-index: 9999;

.movableView {
  pointer-events: auto; //可以点击
  border-radius: 100%;
  width: 130rpx;
  height: 160rpx;
  box-sizing: border-box;
  padding: 0 10rpx;
}
}
</style>
