<script>
	import '@/public/ald/ald-stat.js'
	export default {
		globalData: {
		  withoutUserInfoAuth:false,//是否缺少授权 false:已经授权
		  csbHost:"https://price.pcauto.com.cn",//基础信息
		  whoisHost:"https://whois.pconline.com.cn",//位置信息
		  magearHost:"https://magear.pcauto.com.cn",
		  host:"https://testpocket.pcauto.com.cn",
		  panorama:"https://panorama.pcauto.com.cn",//vr看车图片
		  //panorama:"http://t-panorama.pcauto.com.cn",
		  currentLocation:{},//当前位置
		  userInfo: null,
		  UPCHost:"https://upc.pcauto.com.cn/upload_quick.jsp?application=autopocket",
      wxUserInfo: null
		},
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="less">
	/*每个页面公共css */
	.container {
	  height: 100%;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  justify-content: space-between;
	  box-sizing: border-box;
	}
	page{
	  word-break: break-all;
	}

	button{
	    border: 0;
	    padding: 0;
	    margin: 0;
	    border-radius: 0;
	}
	button:after{
	  border-radius: 0;
	  border: 0;
	}

	button[plain]{
	  border:0;
	  border-radius: 0;
	}
	.getUserInfo_name_info_mask_body{
	    position: fixed;
	    left: 0;
	    top: 0;
	    width: 100%;
	    height: 100%;
	    z-index: 9999;
	    background: none;
	}
</style>
