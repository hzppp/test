<template>
	<view>
		<!-- @touchstart="touchstart" @touchend="touchend" @touchmove="touchmove" -->
		<view class="swiperPanel" @touchstart="startMove" @touchend="endMove">
			<view class="swiperItem" v-for="(item, index) in swiperList2" :key="index"
				:style="{transform: itemStyle[index].transform, zIndex: itemStyle[index].zIndex, opacity: itemStyle[index].opacity}"
				@tap="touch(item,index)">
				<view class="children">
					<image class="pic" :src="item.picUrl" lazy-load="true" mode="aspectFill"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import api from '@/public/api/index'
	const gdp = gioGlobal.gio;
	export default {
		props: {
			swiperList: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				slideNote: {
					x: 0,
					y: 0
				},
				screenWidth: 0,
				itemStyle: [],
				longlock: true,
				timeOutEvent: 0,
				swiperList2:[]
			};
		},
		watch:{
			swiperList(array){
				console.log('变化了',array)
				var macInfo = uni.getSystemInfoSync();
				this.swiperList2 = array
				this.screenWidth = macInfo.screenWidth;
				// 计算swiper样式
				this.itemStyle = []
				this.swiperList2.forEach((item, index) => {
					this.itemStyle.push(this.getStyle(index))
				})
				
			},
			itemStyle(array){
				let sourcePage = getCurrentPages().length>1?getCurrentPages()[getCurrentPages().length-2].route:""
				array.forEach((item,index)=>{
					if(item.opacity==null){
						// console.log("变化了",this.swiperList2)
						// #ifdef MP-WEIXIN
						gdp('track', 'YCZ_homeShow', 
							{ "YCZ_area_var": 'banner', 
							"YCZ_position_var": index+1 ,
							"YCZ_flowName_var":'',
							"YCZ_sourcePage_var":sourcePage
						})
						// #endif
					}
				})
				
			}
		},
		created() {
			var macInfo = uni.getSystemInfoSync();
			this.screenWidth = macInfo.screenWidth;
			// 计算swiper样式
			this.swiperList.forEach((item, index) => {
				this.itemStyle.push(this.getStyle(index))
			})
			this.swiperList2 = this.swiperList
			
		},
		methods: {
			getStyle(e) {
				if (e > this.swiperList.length / 2) {
					var right = this.swiperList.length - e
					// console.log(this.swiperList.length + '===' + right + '===' + e)
					return {
						transform: 'scale(' + (1 - right / 9) + ') translate(-' + (right * 9) + '%,0px)',
						zIndex: 999 - right,
						// opacity: 0.8 / right
						opacity: right > 1 ? (0):(0.8 / right)
						// dispaly: right > 1 ? none:block
					}
				} else {
					// console.log(this.swiperList.length + '#===' + right + '===' + e)
					return {
						transform: 'scale(' + (1 - e / 9) + ') translate(' + (e * 9) + '%,0px)',
						zIndex: 999 - e,
						// opacity: 0.8 / e
						opacity: e > 1 ?(0):(0.8 / e)
						// dispaly: e > 1 ? none:block
					}
				}
			},
			
			async getActData(contentId){
			    let {
					data = {}
				} = await api.getActivityContent(contentId);
				let item = data
				// console.log('dadad' + JSON.stringify(item))
				switch(item.redirectType) {
					case 0: {
						if (item.duibaUrl && item.duibaUrl == 'changan://lbcjactivity') {
							let url = '/pages/lbActivity?id=' + item.id
							uni.navigateTo({
								url
							})
						} else {
							let url = '/pages/activity?id=' + item.id
							uni.navigateTo({
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
							uni.navigateTo({
								url: `/pages/webview?webURL=${encodeURIComponent(item.duibaUrl)}`,
							})
						}
						break;
					}
					case 2: {
						if (item.appId == 'wxe6ffa5dceb3b003b' || item.appId == 'wxb36fb5205e5afb36') {
							// 说明是自己的小程序
							uni.navigateTo({
								url: item.miniUrl
							})
							// #ifndef MP-WEIXIN
							if(item.miniUrl && item.miniUrl.substr(0,3) == 'cxd'){
								this.$toast('请在微信搜索本小程序参与')
							}
							// #endif
						   if(item.miniUrl.indexOf('lbActivity') == -1  &&  item.miniUrl.indexOf('activity') == -1 && item.miniUrl.indexOf('CqMarathon') == -1){
							   // 跳转到本喜爱但不是活动页
							   api.fetchActivityVisit({
							   	'activityId': item.id
							   })
						   }	
							return
						}else{
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
							uni.navigateTo({
								url
							})
						} else {
							let url = '/pages/activity?id=' + item.id
							uni.navigateTo({
								url
							})
						}
						break;
					}
				}
			},
			
			touchstart(e) {
				this.longlock = false; // 每次点击都设置为false
				// 加背景颜色操作
				clearTimeout(this.timeOutEvent);
				this.timeOutEvent = setTimeout(() => {
					this.longlock = true; // 长按后将longlock设置为true
				}, 1000); //这里设置定时
				this.startMove(e)
			},
			touchmove(e) { // 短按不会走move
				if (!this.longlock) { //滑动的时候
					clearTimeout(this.timeOutEvent); //清除定时器
					this.timeOutEvent = 0;
					this.endMove(e)
				}
			},

			touchend(e) {
				if (this.timeOutEvent != 0) { // 滑动的时候timeoutEvent会为0 ，则不会走进end
					// console.log('跳转')
				}
			},
			startMove(e) {
				this.slideNote.x = e.changedTouches[0] ? e.changedTouches[0].pageX : 0;
				this.slideNote.y = e.changedTouches[0] ? e.changedTouches[0].pageY : 0;
				clearTimeout(this.timeOutEvent);
				this.longlock = false;
				this.timeOutEvent = setTimeout(() => {
					this.longlock = true; // 长按后将longlock设置为true
				}, 1000); //这里设置定时
			},
			endMove(e) {
				var newList = JSON.parse(JSON.stringify(this.itemStyle))
				// console.log(e.changedTouches[0].pageX )
				// console.log(e.changedTouches[0].pageX - this.slideNote.x)
				if(Math.abs(e.changedTouches[0].pageX - this.slideNote.x) < 5){
					return
				}
				
				if ((e.changedTouches[0].pageX - this.slideNote.x) < 0) {
					// 向左滑动
					var last = [newList.pop()]
					newList = last.concat(newList)
					// console.log(e)
					// console.log(JSON.stringify(newList))
				} else {
					// 向右滑动
					newList.push(newList[0])
					newList.splice(0, 1)
				}
				this.itemStyle = newList
			},
			
			moveRight(){
				if(this.longlock){
				var newList = JSON.parse(JSON.stringify(this.itemStyle))
				var last = [newList.pop()]
				newList = last.concat(newList)
				// console.log("埋点测试",this.itemStyle,newList)
				this.itemStyle = newList	

				}
				
			},
			
			
			dosetData(array){
				console.log('数据边',array)
			this.swiperList =  array
			var macInfo = uni.getSystemInfoSync();
			this.screenWidth = macInfo.screenWidth;
			// 计算swiper样式
			this.swiperList.forEach((item, index) => {
				this.itemStyle.push(this.getStyle(index))
			})
			this.swiperList2 = this.swiperList
			
				
			},

			touch(item,index) {
				// #ifdef MP-WEIXIN
				  wx.aldstat.sendEvent('首页Banner')
				// #endif	
				
				console.log('JSON.stringify(item)',JSON.stringify(item))
				let type = item.contentType;
				let  contentId = item.contentId
				let  status = item.status
				let  id = item.id
				// console.log('type,id,status', type, id, status, typeof(type))
				// console.log('item1.index',index)
				
				//主页轮播点击埋点
				// #ifdef MP-WEIXIN
				gdp('track', 'YCZ_homeClick', { "YCZ_area_var": 'banner', "YCZ_position_var": index+1 ,"YCZ_flowName_var":''})
				// #endif
				
				switch (type) {
					case 1: {
						// #ifdef MP-WEIXIN
						  wx.aldstat.sendEvent('精选资讯点击')
						// #endif
						uni.navigateTo({
							url: `/pages/article?articleId=${contentId}`
						})
						break;
					}
					case 2: {
						this.getActData(contentId)
						// wx.aldstat.sendEvent('精选活动点击')
						// uni.navigateTo({
						// 	url: `/pages/activity?id=${contentId}`
						// })
						break;
					}
					case 3: {
						wx.aldstat.sendEvent('精选直播点击')
						switch (status) {
							case 0: {
								uni.navigateTo({
									url: `/pages/liveDetail?liveId=${item.livestreamId}`
								})
								break;
							}
							case 1: {
								this.goMP(id, 'verticalLive', contentId)
								break;
							}
							case 2: {
								uni.navigateTo({
									url: `/pages/liveDetail?liveId=${item.livestreamId}`
								})
								break;
							}
							case 3: {
								this.goMP(id, 'verticalPlayback', contentId)
								break;
							}
						}
						break;
					}
				}
				
			},
			goMP(id, type, sourceId) { //跳转pcauto+
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
			}

		}
	}
</script>

<style lang="scss">
	.swiperPanel {
		margin: 0rpx 0;
		height: 970rpx;
		width: 100%;
		overflow: hidden;
		position: relative;
		// background: #007AFF;

		.swiperItem {
			height: 100%;
			width: 100%;
			position: absolute;
			top: 0;
			left: 0;
			transition: all .5s;

			// background: #007AFF;
			.children {
				height: 100%;
				width: 670rpx;
				margin: 2rpx auto;
				// background: #4CD964;

				.pic {
					height: 100%;
					width: 100%;
					border-radius: 10px;
					// box-shadow: 0 0 10px #333;
				}
			}
		}
	}
</style>
