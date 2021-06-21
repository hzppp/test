<template>
	<view>
		<web-view :src="src"></web-view>
	</view>
</template>

<script>
	import domain from '@/configs/interface';
	let app = getApp()
	export default {
		data() {
			return {
				src:domain.getAPI('webUrl'),
			};
		},
    mounted(){
      let routes = getCurrentPages();
      let curObj = routes[routes.length - 1]
      let curRoute = curObj.route 
      let curParam = curObj.options
      this.src = this.src+ `vrkrpano.html?sid=${curParam.sid}&serialId=${curParam.serialId}&pcid=${curParam.pcid}&cityId=${curParam.cityId}&cityName=${curParam.cityName}`
      if(app.globalData.wxUserInfo&&app.globalData.wxUserInfo.openId){
      	let openId =  app.globalData.wxUserInfo.openId;
      	this.src= this.src +  '&openId=' + openId
      }
	}
	}
</script>

<style lang="scss">

</style>
