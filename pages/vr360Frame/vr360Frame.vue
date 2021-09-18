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
			title:'',
			imageurl:'',
			data:''
			
				// src:'http://192.168.16.53:8080/',
			};
		},
    mounted(){
      let routes = getCurrentPages();
      let curObj = routes[routes.length - 1]
      let curRoute = curObj.route 
      let curParam = curObj.options
	 
			let _data = decodeURIComponent(curParam.data)
			console.log(_data,typeof(_data))
			if(_data!='undefined'){
				let _dataPam = JSON.parse(_data)
				this.data = curParam.data
				this.title = _dataPam.name
				this.imageurl = _dataPam.img
				console.log(this.imageurl)
				this.src = this.src + `vr360.html?data=${_data}`
				if(app.globalData.wxUserInfo&&app.globalData.wxUserInfo.openId){
					let openId =  app.globalData.wxUserInfo.openId;
					this.src= this.src+  '&openId=' + openId
				}
				// #ifdef MP-WEIXIN
				 this.src = this.src +  '&app=wechat'
				// #endif
				
				// #ifdef MP-TOUTIAO
				 this.src = this.src + '&app=toutiao'
				// #endif
				return;
			}
			if(curParam.sid){
				this.src = this.src + `vr360.html?sid=${curParam.sid}&cityId=${curParam.cityId}&cityName=${curParam.cityName}`
				if(app.globalData.wxUserInfo&&app.globalData.wxUserInfo.openId){
					let openId =  app.globalData.wxUserInfo.openId;
					this.src= this.src +  '&openId=' + openId
				}
				// #ifdef MP-WEIXIN
				 this.src = this.src +  '&app=wechat'
				// #endif
				
				// #ifdef MP-TOUTIAO
				 this.src = this.src + '&app=toutiao'
				// #endif
				return;
			}
			console.log('参数缺失')
      // this.src = `https://cdc.pcauto.com.cn/vue/hall/a/vrkrpano.html?sid=${curParam.sid}&serialId=${curParam.serialId}&pcid=${curParam.pcid}`
      // this.src = `http://192.168.16.53:8080/vr360.html?sid=${curParam.sid}&serialId=${curParam.serialId}&pcid=${curParam.pcid}`
			
			// this.src = `http://192.168.16.53:8080/vr360.html?data=${_data}`
			// this.src = 'https://cdc.pcauto.com.cn/vue/hall/a/vr360.html?data=${_data}'
			
    },
	onShareAppMessage() {
		let title = this.title
		let path = `pages/vr360Frame/vr360Frame?data=${this.data}`
	    
		let imageUrl = this.imageurl
		return {
			title: '【云展厅】'  +  title,
			path: path,
			imageUrl: imageUrl
		}
		
	},
	}
	
</script>

<style lang="scss">

</style>
