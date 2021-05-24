<template>
	<view>
		<web-view :src="src"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
        src:'',
			};
		},
    mounted(){
      let routes = getCurrentPages();
      let curObj = routes[routes.length - 1]
      let curRoute = curObj.route 
      let curParam = curObj.options
      
      this.src = `https://cdc.pcauto.com.cn/vue/hall/a/vrkrpano.html?sid=${curParam.sid}&serialId=${curParam.serialId}&pcid=${curParam.pcid}`
      // this.src = `http://localhost:8080/vrkrpano.html?sid=${curParam.sid}&serialId=${curParam.serialId}&pcid=${curParam.pcid}`
    }
	}
</script>

<style lang="scss">

</style>
