<template>
	<view class="webView">
		<web-view :src="webURL" @message="message"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				thURL: [414, 606, 629, 794, 799, 1151, 1191, 1227, 1235, 1268, 972],
				webURL: "",
			}
		},
		async onLoad(options) {
			console.log(options.webURL,unescape(options.webURL))
			this.getURL(options)
		},
		methods: {
			getURL(options) {
				this.webURL = unescape(options.webURL)
				for (let i in this.thURL) {
					let obj = this.thURL[i]
					if (this.webURL.indexOf(obj) > -1 && this.webURL.indexOf('panorama') > -1) {
						this.webURL = `https://www1.pcauto.com.cn/zt/gz20190715/dazhongweb/${obj}/index.html`
					}
				}
				this.webURL = this.http2https(this.webURL)
				console.log(this.webURL)
			},
			http2https(url) {
				if (url.indexOf('http:') > -1) {
					url = url.replace('http:', 'https:')
				}
				return url
			}
		}
	}
</script>

<style>

</style>
