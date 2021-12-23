<script>
	import '@/public/ald/ald-stat.js'
	export default {
		globalData: {
			haveUserInfoAuth: false, //是否缺少授权 false:已经授权
			csbHost: "https://price.pcauto.com.cn", //基础信息
			whoisHost: "https://whois.pconline.com.cn", //位置信息
			magearHost: "https://magear.pcauto.com.cn",
			host: "https://testpocket.pcauto.com.cn",
			panorama: "https://panorama.pcauto.com.cn", //vr看车图片
			//panorama:"http://t-panorama.pcauto.com.cn",
			testDriveX: 400,
			testDriveY: 465,
			adDealerId:'',  // 留资来源id
			currentLocation: { //当前位置
				wxPosition: { // 微信定位的坐标位置
					wsq: true,
					latitude: 29.57,
					longitude: 106.5,
					provider: 'default',
				},
				cityData: { // 当前定位的位置
					"city": "重庆市",
					"cityCode": "500000",
					"error": "",
					"pro": "重庆市",
					"proCode": "500000",
					"region": "江北区",
					"regionCode": "500105"
				},
				selectedCityData: { // 当前选择的位置
					"isChange": false, // 是否已手动修改
					"pro": "重庆市",
					"city": "重庆市",
				},
			},
			userInfo: null,
			UPCHost: "https://upc.pcauto.com.cn/upload_quick.jsp?application=autopocket",
			wxUserInfo: null,
			phone: '', //  授权的手机号码
			provinceList: [], // 省市列表
			hasAuthorized:false
		},
		onLaunch: function() {
			// #ifndef MP-TOUTIAO
			uni.hideTabBar({
				animation: false
			})
			// #endif
			console.log('App Launch')
			if (uni.canIUse('loadFontFace')) {
				let _this = this
				console.log("支持自定义字体");
				uni.loadFontFace({
					global: true,
					family: 'Ping Fang',
					source: 'url("https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/font/ChangAnunitype-Regular.TTF")',
					success(res) {
						_this.fontLoaded = true
						console.log("字体加载成功") //  loaded
					},
					fail(res) {
						console.log("字体加载失败") //  error
					},
					complete(res) {
						console.log("字体加载完成1");
					}
				});

			} else {
				console.log('不支持自定义字体')
			}

		},
		onShow: function() {
			console.log('App Show')
			
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {}
	}
</script>

<style lang="less">
	/*每个页面公共css */
	body {
		font-family: Ping Fang;
	}

	// @font-face {
	//   font-family: ChangAnunitype;
	//   src: url("~@/static/font/ChangAnunitype-Regular.TTF") format("truetype");
	// }
	.autoFont {
		font-family: Ping Fang;
	}

	.container {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
	}

	page {
		word-break: break-all;
	}

	button {
		border: 0;
		padding: 0;
		margin: 0;
		border-radius: 0;
	}

	button:after {
		border-radius: 0;
		border: 0;
	}

	button[plain] {
		border: 0;
		border-radius: 0;
	}

	.getUserInfo_name_info_mask_body {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 9999;
		background: none;
	}
</style>
