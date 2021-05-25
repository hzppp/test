<template>
	<view>
		<web-view :src="src"></web-view>
	</view>
</template>

<script>
	import domain from '@/configs/interface';
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
      
      this.src =  domain.getAPI('webUrl') + `vrkrpano.html?sid=${curParam.sid}&serialId=${curParam.serialId}&pcid=${curParam.pcid}`
      // this.src = `http://192.168.16.53:8080/vrkrpano.html?sid=${curParam.sid}&serialId=${curParam.serialId}&pcid=${curParam.pcid}`
    }
	}
</script>

<style lang="scss">

</style>
