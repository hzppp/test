<template>
  <view>
<!--    <loading ref="loading"></loading>-->
    <articleList ref="articleList" @changeLoading="changeLoading"></articleList>
    <testDrive></testDrive>
  </view>
</template>

<script>
import articleList from '@/components/articleList/articleList'
import login from '@/units/login'
import testDrive from '@/components/testDrive/testDrive'

export default {
name: "articleListPage",
  components: {
    articleList,
    testDrive
  },
  onLoad(options) {
    this.$refs.articleList.startGetData()
  },
  methods: {
    changeLoading(type = false) {
      // this.$refs.loading.changeLoading(type)
    },
  }
}
</script>

<style scoped>

</style>
