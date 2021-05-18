<template>
<view>
  <button class="btn" open-type="contact"></button>
</view>
</template>

<script>
export default {
name: "askOnline"
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
  background: url("https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/askOnline.png");
  background-size: cover;
}
</style>
