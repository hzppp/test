<template>
  <view>
    exhibition 云展馆
    <viewTabBar :current="2"></viewTabBar>
  </view>
</template>

<script>
import tabBar from '@/components/tabBar/tabBar'

export default {
  components: {viewTabBar: tabBar},
}
</script>
<style>
</style>
