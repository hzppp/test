<template>
	<view class="webView">
	      <web-view :src="webURL"></web-view>
	  </view>
</template>

<script>
	export default {
		data() {
			return {
				webURL:"",
			}
		},
		async onLoad(options) {
		      this.getURL(options)
		    },
		 onShareAppMessage(){
		        let title = '我正在关注长安云车展的热门车系，推荐给你'
		        let path = `pages/authorization?to=pkwebview&webURL=${this.webURL}`
		        if(app.globalData.salesId){
		            path+=`&salesId=${app.globalData.salesId}`
		        }
		        // let imageUrl = 'https://www1.pcauto.com.cn/zt/yqdzhzq/xcxshare/compare.jpg'
				let imageUrl = 'https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/share.jpeg'
		        return {
		            title: title,
		            path: path,
		            imageUrl: imageUrl
		        }
		    },
		methods: {
			getURL(options){
			  this.webURL = unescape(options.webURL)
			  this.webURL = this.http2https(this.webURL)
			  console.log(this.webURL)
			},

			http2https(url){
			  if(url.indexOf('http:')>-1){
				url = url.replace('http:','https:')
			  }
			  return url
			}
		}
	}
</script>

<style>

</style>
