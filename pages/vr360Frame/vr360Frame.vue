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
			let _data = decodeURIComponent(curParam.data)
			curParam = JSON.parse(_data)
			// console.log(curParam)
      
      // this.src = `https://cdc.pcauto.com.cn/vue/hall/a/vrkrpano.html?sid=${curParam.sid}&serialId=${curParam.serialId}&pcid=${curParam.pcid}`
      // this.src = `http://192.168.16.53:8080/vr360.html?sid=${curParam.sid}&serialId=${curParam.serialId}&pcid=${curParam.pcid}`
			
			// this.src = `http://192.168.16.53:8080/vr360.html?data=${_data}`
			// this.src = 'https://cdc.pcauto.com.cn/vue/hall/a/vr360.html?data=${_data}'
			this.src = domain.getAPI('webUrl') + `vr360.html?data=${_data}`
    }
	}
</script>

<style lang="scss">

</style>
