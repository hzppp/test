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
        src:domain.getAPI('webUrl')
				// src:'http://192.168.16.53:8080/',
			};
		},
    mounted(){
      let routes = getCurrentPages();
      let curObj = routes[routes.length - 1]
      let curRoute = curObj.route 
      let curParam = curObj.options
			let openId =  app.globalData.wxUserInfo.openId;
			let _data = decodeURIComponent(curParam.data)
			if(_data!='undefined'){
				this.src = this.src + `vr360.html?data=${_data}&openId=${openId}`
				return;
			}
			if(curParam.sid){
				this.src = this.src + `vr360.html?sid=${curParam.sid}&cityId=${curParam.cityId}&cityName=${curParam.cityName}&openId=${openId}`
				return;
			}
			console.log('参数缺失')
      // this.src = `https://cdc.pcauto.com.cn/vue/hall/a/vrkrpano.html?sid=${curParam.sid}&serialId=${curParam.serialId}&pcid=${curParam.pcid}`
      // this.src = `http://192.168.16.53:8080/vr360.html?sid=${curParam.sid}&serialId=${curParam.serialId}&pcid=${curParam.pcid}`
			
			// this.src = `http://192.168.16.53:8080/vr360.html?data=${_data}`
			// this.src = 'https://cdc.pcauto.com.cn/vue/hall/a/vr360.html?data=${_data}'
			
    }
	}
</script>

<style lang="scss">

</style>
