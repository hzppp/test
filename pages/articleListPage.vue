<template>
  <view>
<!--    <loading ref="loading"></loading>-->
    <articleList ref="articleList" @changeLoading="changeLoading"></articleList>
    <askOnline></askOnline>
  </view>
</template>

<script>
import articleList from '@/components/articleList/articleList'
import login from '@/units/login'
import askOnline from '@/components/askOnline/askOnline'

export default {
name: "articleListPage",
  components: {
    articleList,
    askOnline
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
