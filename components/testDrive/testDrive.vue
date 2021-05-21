<template>
<view>
  <button class="btn" @tap="goTestDrive"></button>
</view>
</template>

<script>
export default {
name: "testDrive",
  methods: {
    goTestDrive() {
      uni.navigateTo({
        url: `/pages/ChooseSerial`
      })
    }
  }
}
</script>

<style scoped>
.btn {
  position: fixed;
  z-index: 999;
  right: 10rpx;
  bottom: 160rpx;
  width: 100rpx;
  height: 145rpx;
  background: url("https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/testDrive.png");
  background-size: cover;
}
</style>
