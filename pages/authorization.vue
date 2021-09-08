<template>
	<!--  <view>
    <loading ref="loading"></loading>
    <view class="authorization" v-if="isShowPhoto">
    <view class="authorization-pop">
  		<button class="coupon-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber($event)" @tap.stop="stop" >获取手机号</button>
    </view>
    </view>		
  </view> -->
</template>

<script>
	import login from '@/units/login'
	import distance from '@/units/distance'
	import api from '@/public/api/index'


	let app = getApp()
	export default {
		data() {
			return {
				isShowPhoto: false
			}
		},
		async onLoad(options) {
			// this.$refs.loading.changeLoading(true);
			app.globalData.haveUserInfoAuth = uni.getStorageSync('haveUserInfoAuth')
			console.log('页面参数', options, api)
			// to=dynamicDetails-dynamicId=205扫码进来带参方式
			// options.scene = 'salesId=386-to=carShow-id=89-wxacode'
			var scene = decodeURIComponent(options.scene)
			// let iswxacode = scene.indexOf('-wxacode') > -1
			let scenecs = ['salesId', 'to', 'id', 'dynamicId', 'isArt', 'aid']
			if (scene) {
				for (let i in scenecs) {
					let iobj = scenecs[i]
					let value = this.GetQueryString(scene, iobj)
					if (value) {
						options[iobj] = value
					}
				}

			}
			if (options.salesId) {
				app.globalData.salesId = options.salesId
			}

			let code = await login.checkLogin(api)
			if (code == 1) {
				//需要绑定手机号
				console.log('没有绑定过，需要授权手机号')
				// this.isShowPhoto = true 
				this.goPage(options)
			} else {
				this.goPage(options)
			}
			console.log('code', code)


		},
		methods: {
			// async getPhoneNumber(e) {
			// 	let {
			// 		detail
			// 	} = e
			// 	console.log('getPhoneNumber===============',detail.encryptedData, detail.iv)
			// 	// api.userBind
			// await login.userBind(api,detail.encryptedData,detail.iv)
			// },
			// stop() {
			// 	console.log('stop')
			// },
			goPage(options) {
				let cs = ''
				let url = '/pages/index'
				for (let i in options) {
					cs += `${i}=${options[i]}&`
				}
				if (options.type) {
					this.tapMessageTo(options)
					return
				}
				if (options.to) {
					if (options.to == 'ddxq') { //动态详情页面
						options.to = 'dynamicDetails'
					} else if (options.to == 'xcsfq') { //新春送福气页面
						options.to = 'moneyActivity'
					}
					cs = cs.substr(0, cs.length - 1)
					url = `/pages/${options.to}?${cs}`
				}
				uni.reLaunch({
					url
				})
			},

			async tapMessageTo(options) {
				let type = options.type
				let contentId = options.id
				console.log(type, type == 1)
				switch (parseInt(type)) {
					case 1: {
						console.log(type, type == 1)
						uni.reLaunch({
							url: `/pages/article?articleId=${contentId}`
						})
						break;
					}
					case 2: {
						this.getActData(contentId)
						break;
					}
					case 3: {
						let {
							data
						} = await api.getLiveDetail({
							id: contentId
						})
						if(!data){ // 直播存在
							uni.reLaunch({ 
								url: `/pages/live`
							})
							// this.$toast('直播已删除')
							return
						}
						
						
						let status = data.status
						let id = data.roomId
						// contentId 本系统id    id 直播间id
						switch (status) {
							case 0: {
								uni.reLaunch({
									url: `/pages/liveDetail?liveId=${contentId}&share=share`
								})
								break;
							}
							case 1: {
								uni.reLaunch({
									url: `/pages/live`
								})
								// id = data.roomId
								// this.goMP(id, 'verticalLive', contentId)
								break;
							}
							case 2: {
								uni.reLaunch({
									url: `/pages/liveDetail?liveId=${contentId}&share=share`
								})
								break;
							}
							case 3: {
								// id = data.playId
								uni.reLaunch({
									url: `/pages/live`
								})
								// this.goMP(id, 'verticalPlayback', contentId)
								break;
							}
						}
						break;
					}
				}
			},

			goMP(id, type, sourceId) { //跳转pcauto+  id 直播间id     sourceId 本系统直播间id
				const oUrl =
					`/pages_live/changanVerticalLiveRoom/changanVerticalLiveRoom?id=${sourceId}&type=${type}&sourceId=${id}`
				console.log('oUrl', oUrl)
				// #ifndef MP-WEIXIN
				this.$toast('请在微信搜索本小程序参与')
				// #endif
				// #ifdef MP-WEIXIN
				uni.navigateToMiniProgram({
					appId: 'wxa860d5a996074dbb',
					path: oUrl,
					success: res => {
						// 打开成功
						console.log("打开成功", res);
					},
					fail: err => {
						console.log(err);
					},
					// envVersion: 'trial'
				});
				// #endif
			},
			async getActData(contentId) {
				let {
					data = {}
				} = await api.getActivityContent(contentId);
				let item = data
				// console.log('dadad' + JSON.stringify(item))
				switch (item.redirectType) {
					case 0: {
						if (item.duibaUrl && item.duibaUrl == 'changan://lbcjactivity') {
							let url = '/pages/lbActivity?id=' + item.id
							uni.reLaunch({
								url
							})
						} else {
							let url = '/pages/activity?id=' + item.id
							uni.reLaunch({
								url
							})
						}
						break;
					}
					case 1: {
						api.fetchActivityVisit({
							'activityId': item.id
						})
						if (item.duibaUrl && item.duibaUrl.substring(0, 4) == "http") {
							uni.reLaunch({
								url: `/pages/webview?webURL=${encodeURIComponent(item.duibaUrl)}`,
							})
						}
						break;
					}
					case 2: {
						if (item.appId == 'wxe6ffa5dceb3b003b' || item.appId == 'wxb36fb5205e5afb36') {
							// 说明是自己的小程序
							uni.reLaunch({
								url: item.miniUrl
							})
							// #ifndef MP-WEIXIN
							if (item.miniUrl && item.miniUrl.substr(0, 3) == 'cxd') {
								this.$toast('请在微信搜索本小程序参与')
							}
							// #endif
							if (item.miniUrl.indexOf('lbActivity') == -1 && item.miniUrl.indexOf('activity') == -1) {
								// 跳转到本喜爱但不是活动页
								api.fetchActivityVisit({
									'activityId': item.id
								})
							}
							return
						} else {
							api.fetchActivityVisit({
								'activityId': item.id
							})

							// #ifndef MP-WEIXIN
							this.$toast('请在微信搜索本小程序参与')
							// #endif
							// #ifdef MP-WEIXIN
							uni.navigateToMiniProgram({
								appId: item.appId,
								path: item.miniUrl,
								success: res => {
									// 打开成功
									console.log("打开成功", res);
								},
								fail: err => {
									console.log("打开失败", err);
									uni.showToast({
										title: "跳转小程序失败",
										icon: "none"
									})
								},
								// envVersion: 'trial'
							});
							// #endif
						}
						break;
					}
					default: {
						if (item.duibaUrl && item.duibaUrl == 'changan://lbcjactivity') {
							let url = '/pages/lbActivity?id=' + item.id
							uni.reLaunch({
								url
							})
						} else {
							let url = '/pages/activity?id=' + item.id
							uni.reLaunch({
								url
							})
						}
						break;
					}
				}
			},

			GetQueryString(str, name) {
				var reg = new RegExp("(^|-)" + name + "=([^-]*)(-|$)");
				var r = str.match(reg);
				if (r != null) return unescape(r[2]);
				return null;
			}
		}
	}
</script>

<style lang="less">
</style>
