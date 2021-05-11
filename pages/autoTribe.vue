<template>
	<view class="autoTribe">
		<button v-if="isUserInfoPage" class="getUserInfo_name_info_mask_body" lang="zh_CN" @getuserinfo="getWxUserInfoButton"
		 open-type="getUserInfo"></button>
		<share-pop ref="sharepop"></share-pop>
		<loading ref="loading"></loading>
		<plinput ref="plinput" :fromPage="'index'" @add-pl="addpl"></plinput>
		<!-- <getFormidbox> -->
		<view slot="content" class="content">
			<view class="head-nav">
				<view v-for="(item,index) in navList" :key="index" @tap="tabSwiper(index)" :class="'nav-item ' + (current == index && 'current')">
					{{item}}
				</view>
			</view>
			<view class="swpier-box">
				<swiper :current="current" class="swpier" @change="getSwiperCurrent">
					<block v-for="(item,index) in navList" :key="index">
						<swiper-item>
							<scroll-view :scroll-top="scrollTop[index]" @scroll="getTop" lower-threshold="350" @scrolltolower="scrollGetData"
							 class="scroll-view" scroll-y scroll-with-animation>
								<block v-if="index == 0">
									<subjectList ref="subjectList" @changeLoading="changeLoading"></subjectList>
								</block>
								<block v-if="index == 1">
									<zuixin ref="zuixin" @xianshi="plinputxianshi" @changeLoading="changeLoading" @swiper-tab="swiperTab" @set-scroll-top="setScrollTop" :from="'zuixin'"></zuixin>
								</block>
								<block v-if="index == 2">
									<tuijian ref="tuijian" @xianshi="plinputxianshi" @changeLoading="changeLoading" @swiper-tab="swiperTab" @set-scroll-top="setScrollTop" :from="'tuijian'"></tuijian>
								</block>
								<block v-if="index == 3">
									<tongcheng ref="tongcheng" @xianshi="plinputxianshi" @changeLoading="changeLoading" @swiper-tab="swiperTab" @set-scroll-top="setScrollTop" :from="'tongcheng'"></tongcheng>
								</block>
								<block v-if="index == 4">
									<guanzhu ref="guanzhu" @xianshi="plinputxianshi" @changeLoading="changeLoading" @swiper-tab="swiperTab" @set-scroll-top="setScrollTop" :from="'guanzhu'"></guanzhu>
								</block>
								<block v-if="index == 5">
									<articleList ref="articleList" @changeLoading="changeLoading"></articleList>
								</block>
							</scroll-view>
						</swiper-item>
					</block>
				</swiper>
			</view>
			<block v-if="current != 0 && current != 5">
				<view class="fix-btn-content">
					<view class="fix-btn" @tap="popBtnsShow"></view>
					<view class="fix-btn-updata" @tap="upData"></view>
				</view>
			</block>
		</view>
		<block v-if="btnpopShow">
			<view class="pop-btns" @tap="popBtnsHide">
				<view class="pop-btns-content">
					<view class="to-putDynamic-btn" @tap="toputDynamic"></view>
					<view class="to-putArticle-btn" @tap="toputArticle"></view>
				</view>
			</view>
		</block>
		<!-- </getFormidbox> -->
	</view>
</template>

<script>
	import dynamic from '@/components/dynamic/dynamic'
	import articleList from '@/components/articleList/articleList'
	import subjectList from '@/components/subjectList/subjectList'
	import plinput from '@/components/plinput/plinput'
	import shareSuccess from '@/components/shareSuccess/shareSuccess'

	import login from '@/units/login'
	import api from '@/public/api/index'
	import shouquan from '@/units/shouquan'

	const app = getApp()
	export default {
		components: {
			zuixin: dynamic,
			tuijian: dynamic,
			tongcheng: dynamic,
			guanzhu: dynamic,
			// dynamic,
			articleList,
			subjectList,
			plinput,
			'share-pop': shareSuccess,
		},
		mixins: [shouquan],
		data() {
			return {
				btnpopShow: false,
				scrollTop0: 0,
				scrollTop: [],
				current: 0,
				// 话题 -> 最新 -> 推荐 -> 同城 -> 关注 -> 文章
				navList: ['话题', '最新', '推荐', '同城', '关注', '文章'],
				// navList: ['话题', '最新', '推荐', '同城', '关注'],
				// navList:['动态','文章','话题']
			}
		},
		async onLoad(options) {
			console.log('options', options)
			if (options.current) {
				this.current = options.current
			}
			
			if (app.globalData.firstPutDynamic) {
				// this.$invoke('share-pop','shareSuccessShow',app.globalData.firstPutDynamic,'发表成功')
				this.$refs.sharepop.shareSuccessShow(app.globalData.firstPutDynamic, '发表成功')
				that.showToast('发表成功')
				app.globalData.firstPutDynamic = 0
			}
			await login.login()
			this.getModule()
			let that = this
			uni.onNetworkStatusChange(function(res) {
				let {
					isConnected
				} = res
				console.log('isConnected', isConnected)
				if (!isConnected) {
					that.showToast('当前无网络连接')
				} else {
					// console.log("网络变化")
					that.networkStatusChange()
					// that.getModule()
				}
			})
		},
		onShow() {
			this.getModule()
		},
		methods: {
			plinputxianshi(obj,ly){
				this.$refs.plinput.xianshi(obj,ly)
			},
			changeLoading(type = false) {
				this.$refs.loading.changeLoading(type)
			},
			addpl(obj){
                // this.$invoke(this.getPath(),'addpl',obj)
				this.$refs[this.getPath()][0].addpl(obj)
			},
			setScrollTop(top){
				let ctop = this.scrollTop0
				let vt = ctop + top
				this.scrollTop[0] = vt
			},
			swiperTab(index){
				this.current = index
			},
			getPath() {
				let path
				if (this.current == 0) {
					path = 'subjectList'
				} else if (this.current == 1) {
					path = 'zuixin'
				} else if (this.current == 2) {
					path = 'tuijian'
				} else if (this.current == 3) {
					path = 'tongcheng'
				} else if (this.current == 4) {
					path = 'guanzhu'
				} 
				else if (this.current == 5) {
					path = 'articleList'
				}
				return path
			},
			stop() {

			},
			upData() {
				let path = this.getPath()
				// this.$invoke(path, 'againLoad')
				this.$refs[path][0].againLoad()
			},
			tabSwiper(i) {
				this.current = i
			},
			getTop(e) {
				this.scrollTop0 = e.detail.scrollTop
			},
			getSwiperCurrent(e) {
				let {
					current
				} = e.detail
				this.current = current
				this.getModule()
			},
			scrollGetData() {
				this.getModule('scroll')
			},
			popBtnsShow() {
				this.btnpopShow = true
			},
			popBtnsHide() {
				this.btnpopShow = false
			},
			toputArticle() {
				let url = '/pages/putArticle'
				uni.navigateTo({
					url
				})
			},
			toputDynamic() {
				let url = '/pages/putDynamic'
				uni.navigateTo({
					url
				})
			},
			getModule(type = 'swiperChange') {
				let path = this.getPath()
				// let name = 'startGetData'
				let from = ''
				console.log('getModule==path======',path)
				console.log(this.$refs)
				if (type == 'scroll') {
					// name = 'scrollGetData'
					this.$refs[path][0].scrollGetData()
				}else{
					this.$refs[path][0].startGetData()
				}
				// console.log(from)
				// this.$invoke(path, name)
				
			},
			networkStatusChange() {
				if (this.current == 0 || this.current == 5) {
					return false
				}
				let name = this.getPath()
				// this.$invoke(name, 'networkStatusChange')
				this.$refs[name][0].networkStatusChange()
			},
			showToast(title, duration = 2000) {
				this.$toast(title, 'none', duration);
			}
		}
	}
</script>

<style lang="less">
	@import '@/static/less/public.less';

	.mm {
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
	}

	.content {
		position: fixed;
		z-index: 9;
		display: flex;
		flex-direction: column;
		.mm;
	}

	.head-nav {
		padding: 0 22rpx 23rpx;
		white-space: nowrap;
		overflow-x: auto;

		.nav-item {
			.db(middle);
			width: 16.6667%;
			text-align: center;
			.seth(64rpx, 32rpx, #333);
			position: relative;
		}

		.current {
			font-size: 32rpx;
			background: #ce1330;
			color: #fff;
			border-radius: 100rpx;
			.fb;
			// &:after{
			//     display: block;
			//     content: "";
			//     height: 6rpx;
			//     background: #ce1330;
			//     position: absolute;
			//     width: 30%;
			//     left: 37.5%;
			//     bottom: 0rpx;
			//     border-radius: 6rpx;
			//     overflow: hidden;
			// }
		}
	}

	.swpier-box {
		width: 100%;
		flex: auto;
		position: relative;

		.swpier {
			position: absolute;
			.mm;
		}

		.scroll-view {
			.mm;
		}
	}

	.fix-btn-content {
		position: fixed;
		right: 32rpx;
		bottom: 100rpx;
		z-index: 9;

		.fix-btn {
			position: relative;
			.arc(78rpx);
			background: #ce1330;
			border: 1px solid #ce1330;

			&:after {
				display: block;
				content: "";
				.setIcon(32rpx, 32rpx, 150rpx, 187rpx);
				.pa(50%, 50%);
				transform: translate(-50%, -50%);
			}
		}

		.fix-btn-updata {
			margin-top: 24rpx;
			position: relative;
			.arc(78rpx);
			background: #fff;
			border: 1px solid #dedede;

			&:after {
				display: block;
				content: "";
				.setbg(33rpx, 36rpx, 'undata_icon.png');
				.pa(50%, 50%);
				transform: translate(-50%, -50%);
			}
		}
	}

	.pop-btns {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .5);
		z-index: 10;

		&-content {
			.pa(50%, 50%);
			.setbg(520rpx, 254rpx, 'dazhong_20191204_0.png');
			background-color: #fff;
			transform: translate(-50%, -50%);
			border-radius: 12rpx;
		}

		.to-putDynamic-btn,
		.to-putArticle-btn {
			width: 250rpx;
			height: 100%;
			.pa(0, 0);
		}

		.to-putArticle-btn {
			width: 245rpx;
			left: 275rpx;
		}
	}
</style>
