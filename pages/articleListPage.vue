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
	  // #ifdef MP-WEIXIN
	   this.$refs.articleList.startGetData()
	  // #endif
	  
	  // #ifdef MP-TOUTIAO
	  this.$children[0].startGetData()
	  // #endif
   
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
