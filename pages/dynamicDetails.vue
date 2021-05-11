<template>
	<view>
		<!-- :hidden="!isArticleOver || isArticle" -->
		<plinput ref="plinput" @set-zw-height="setZwHeight" @remove-zw="removeZw" @add-pl="addpl"></plinput>
		<block v-if="isArticle && isArticleOver">
			<view class="bottomShare">
				<button open-type="share" plain="true" hover-class="none"></button>分享给好友
			</view>
		</block>
		<button v-if="isUserInfoPage" class="getUserInfo_name_info_mask_body" lang="zh_CN" @getuserinfo="getWxUserInfoButton"
		 open-type="getUserInfo"></button>
		<scroll-view class="dynamicDetails" :class="!isArticleOver ? 'bg-white':''" lower-threshold="200" @scrolltolower="scrollGetData"
		 scroll-y="true" scroll-with-animation="true">
			<loading ref="loading"></loading>
			<!-- <getFormidbox> -->
			<view class="content">
				<page-top :background="'#fff'" :titleys="'#000'" btnys="" :title.sync="title"></page-top>
				<view class="zw-bottom" :style="'height:' + bottomHeight + 'px'"></view>
				<view class="dynamic-box">
					<block v-if="isArticleOver && isArticle">
						<view class="dynamic-article-title">
							{{articleData.title}}
						</view>
					</block>
					<view class="head-name" v-if="isArticleOver">
						<image :src="dynamic.wxHead" mode="scaleToFill" lazy-load="true" @tap="toMyFollowPage"></image>
						<view class="name">
							<view class="nickName">{{dynamic.nickName}}</view>
							<view v-if="dynamic.isApprove == 1" class="approve"></view>
							<view v-if="dynamic.official == 1" class="official"></view>
						</view>
						<view class="date">{{dynamic.createTime || ''}}</view>
						<view v-if="isUserDynamic && !isArticle" class="del-btn" @tap="popShow"></view>
					</view>
					<block v-if="!isArticle">
						<view class="dynamic-content">
							<text class="zhuti" @tap="toztDetails" v-if="dynamic.themeName">#{{dynamic.themeName}}#</text>
							<text decode="true">{{dynamic.dynamicContent}}</text>
							<view class="image-list" :class="'image-list' + dynamic.picList.length">
								<block v-for="(imageList,index) in dynamic.picList" :key="index">
									<view class="image-box">
										<image @tap.stop="imageShow(index)" :src="imageList" :mode="dynamic.picList.length == 1 ? 'widthFix' : 'aspectFill'"
										 lazy-load="true"></image>
									</view>
								</block>
							</view>
						</view>
						<block v-if="isArticleDynamic">
							<view class="dynamic-article-content cover" @tap="toArticleDetailsPage">
								<image class="dynamic-article-content-cover" :src="articleData.cover" mode="widthFix" lazy-load="true"></image>
								<view class="dynamic-article-content-mask"></view>
								<image class="dynamic-article-content-articleAuthorHead" :src="dynamic.wxHead" mode="scaleToFill" lazy-load="true"></image>
								<view class="dynamic-article-content-name">{{dynamic.nickName}}</view>
								<view class="dynamic-article-content-articleNew-icon"></view>
								<view class="dynamic-article-content-mask-bottom"></view>
								<view class="dynamic-article-content-articleNew-title ellipsis">{{articleData.title}}</view>
							</view>
						</block>
					</block>
					<block v-else>
						<view class="dynamic-article-content">
							<block v-if="isArticleOver" v-for="(item,index) in articleData.content" :key="index">
								<view class="dynamic-article-text" v-if="item.type == 'txt' && item.value">
									{{item.value}}
								</view>
								<image class="dynamic-article-image" v-if="item.type == 'image' && item.value" :src="item.value" mode="widthFix"
								 lazy-load="true"></image>
							</block>
							<block v-if="!isArticleOver">
								<view class="dynamic-article-none" @tap="toDynamicMore">
									<view class="dynamic-article-none-btn"></view>
								</view>
							</block>
						</view>
					</block>
					<block v-if="isArticleOver && !isArticle">
						<view class="dz-pl-number">
							<button class="share-btn" plain hover-class="none" open-type="share"></button>
							<view class="dz">{{dynamic.provinceName + ' · ' + dynamic.regionName}}</view>

							<view @tap="give" class="diznzan" :class="dynamic.liked && 'current'">
								<block v-if="dynamic.likeCount > 0">
									{{dynamic.likeCount}}
								</block>
							</view>
							<view class="viewCount">
								<block v-if="dynamic.browseCount > 0">
									{{dynamic.browseCount}}
								</block>
							</view>
							<!-- <view class="share" @tap="sharePYQ('{{index}}')"></view> -->
							<view class="share" @tap="sharePopShow"></view>

						</view>
						<view class="dianzan-head-list">
							<block v-for="(item,index) in dynamic.likeHead" :key="index">
								<block v-if="index < 8">
									<image class="image" :src="item" mode="scaleToFill" lazy-load="true"></image>
								</block>
								<block v-else-if="index == 8">
									<image class="image" src="https://www1.pcauto.com.cn/gz/20190715/dazhong/ddd.png" mode="scaleToFill" lazy-load="true"></image>
								</block>
							</block>

						</view>
					</block>
				</view>
				<view class="pinglun-lists" v-if="total > 0 && isArticleOver && !isArticle">
					<view class="tit">全部{{total}}条评论</view>
					<view class="lists">
						<view class="list-box" v-for="(item,index) in list" :key="index">
							<image class="head" :src="item.userAvatar" mode="scaleToFill" lazy-load="true" @tap="toCommentFollowPage(item.userId)"></image>
							<view class="name" :class="item.isApprove == 1 && 'v'">
								{{item.userName}}
							</view>
							<view class="pinglun-content" @tap="inputShow(index,$event)">
								<block v-if="item.beReplyUserName">
									回复<text class="hfname"> {{item.beReplyUserName}}: </text>
								</block>
								<block v-if="item.content.messageName == 'text'">
									<text decode="true">{{item.content.content}}</text>
								</block>
								<block v-else>
									<block v-for="(vitem,index) in item.content.content" :key="index">
										<block v-if="vitem.type == 'text'">
											<text decode="true">{{vitem.txt}}</text>
										</block>
										<block v-else>
											<image class="ubb-image" :src="vitem.txt" mode="scaleToFill" lazy-load="true"></image>
										</block>
									</block>
								</block>
							</view>
							<view class="pinglun-date">{{item.createTime}}</view>
						</view>
					</view>
				</view>
				<view class="gd-zw"></view>
				<!-- <view class="zw-bottom" style="height:{{bottomHeight}}px"></view> -->
				<block v-if="delboxShow">
					<view class="del-dynamic-mask"></view>
					<view class="del-dynamic-box">
						<text class="text">动态删除后不可找回\n是否确定要删除此动态</text>
						<view class="del-dynamic-box-btns">
							<view class="btn" @tap="popHide">取消</view>
							<view class="btn" @tap="deleteDynamic">删除</view>
						</view>
					</view>
				</block>
			</view>
			<!-- </getFormidbox> -->
		</scroll-view>
		<canvas id='myCanvas' :canvas-id="'myCanvas'" :style="'width: 600px;height:'+canvasHeight + 'px'" />
		<view class="mask" v-if="issharepopShow" @tap="sharePopHide"></view>
		<view class="shareFiend" v-if="issharepopShow">
			<image mode="widthFix" class="saveImg" :src="saveURL"></image>
			<view class="savePic" @tap="saveImageToPhotosAlbum">保存到相册</view>
		</view>
	</view>
</template>

<script>
	// import getFormidbox from '@/components/getFormIdModule/getFormIdModule'
	import plinput from '@/components/plinput/plinput'
	import pageTop from '@/components/pageTop/pageTop'
	import api from '@/public/api/index'
	import shouquan from '@/units/shouquan'
	import ubb from '@/units/ubb.js'
	import config from '@/configs/interface';

	const app = getApp()
	const ctx = uni.createCanvasContext('myCanvas')
	export default {
		components: {
			plinput,
			'page-top': pageTop
		},
		mixins: [shouquan],
		data() {
			return {
				delboxShow: false,
				bottomHeight: 0,
				targetBottom: 0,
				dynamicId: 0,
				list: [],
				total: 0,
				isLoadList: false,
				dynamic: {},
				pageNum: 1,
				pageSize: 30,
				title: '动态详情',
				systemInfo: {},
				canvaspicList: [],
				canvasbg: 'http://www1.pcauto.com.cn/wap/pocket/xcx/yqdz/20190930/bg_03.png',
				canvashead: '',
				canvasCode: '',
				number: 0,
				maxNumber: 2,
				saveURL: '',
				isdrawIng: false,
				issharepopShow: false,
				canvasHeight: '',
				isArticle: false, //是否为文章
				articleId: 0,
				articleData: {},
				isArticleOver: true, //文章是否过期--默认没有过期
				isArticleDynamic: false, //是否为文章动态
				isUserDynamic: false, //当前动态是否是该用户发布的
				current: 0
			}
		},

		async onLoad(options) {
			this.$refs.loading.changeLoading(true)
			uni.getSystemInfo().then(res => {
				this.systemInfo = res
			})
			console.log("options", options)
			this.isArticle = options.isArt || options.c1 || false;
			this.isArticleDynamic = options.isArtDynamic || options.c2 || false;
			this.dynamicId = options.dynamicId || options.id || options.a
			this.articleId = options.aid || options.b
			this.authorUserId = options.auid || options.d
			this.current = options.current
			if (!this.dynamicId) {
				this.showToast('缺少dynamicId')
				setTimeout(() => {
					uni.reLaunch({
						url: "/pages/authorization"
					})
				}, 2000)
				console.log('缺少dynamicId')
				return false
			}
			this.start()
			uni.onNetworkStatusChange(res => {
				let {
					isConnected
				} = res
				if (isConnected) {
					this.start()
				}
			})
		},
		onUnload() {
		},
		onShareAppMessage() {
			let title = '这条动态太棒了！你快来看看。'
			let path = `pages/authorization?to=dynamicDetails&dynamicId=${this.dynamicId}`
			if (this.isArticle) {
				title = this.articleData.title
				path += `&isArt=1&aid=${this.articleId}`
			} else {
				title = '这条动态太棒了！你快来看看。'
			}
			if (this.isArticleDynamic) {
				path += `&isArtDynamic=1&aid=${this.articleId}&auid=${this.authorUserId}`
			}

			let imageUrl = ''

			console.log(title)
			return {
				title: title,
				path: path,
				imageUrl: imageUrl
			}
		},
		methods: {
			setZwHeight(h){
				let height = h - this.targetBottom
				this.bottomHeight = h
			},
			removeZw(h){
				this.bottomHeight = 0
			},
			addpl(obj){
				obj.createTime = this.date2Str(obj.createTime)
				obj.content = this.str2obj(obj.content)
				this.list.push(obj)
				this.total++
				this.$refs.plinput.xianshi(this.dynamic, 'dt', false)
			},
			popShow() {
				this.delboxShow = true
			},
			popHide() {
				this.delboxShow = false
			},
			// 删除动态
			async deleteDynamic() {
				let obj = this.dynamic
				console.log(obj)
				let {
					data,
					code,
					msg
				} = await api.deleteDynamic(obj.dynamicId, obj.userId)
				// console.log(data,code,msg)
				if (code == 1) {
					let pages = getCurrentPages()
					let prevPage = pages[pages.length - 2]
					let url = prevPage.route
					if (url == 'pages/index') {
						uni.reLaunch({
							url: "/pages/authorization"
						})
					} else {
						uni.reLaunch({
							url: `/pages/autoTribe?current=${this.current}`
						})
					}

					// uni.navigateTo(prevPage)
				} else {
					this.showToast(msg)
				}
				this.delboxShow = false;
			},
			sharePopShow() {
				this.startCanvas()
				// startCanvas
			},
			sharePopHide() {
				this.issharepopShow = false
			},
			toztDetails() {
				let url = `/pages/ztdetails?themeId=${this.dynamic.themeId}`
				uni.navigateTo({
					url
				})
			},
			// 跳转个人中心
			toMyFollowPage() {
				let url = `/pages/personalHome?userid=${this.dynamic.userId}`
				uni.navigateTo({
					url
				})
			},
			toCommentFollowPage(id) {
				let url = `/pages/personalHome?userid=${id}`
				uni.navigateTo({
					url
				})
			},
			toArticleDetailsPage() {
				this.title = '文章详情'
				this.isArticleDynamic = false
				this.isArticle = true
				this.$refs.plinput.inputHide2()
			},
			give() { //点赞
				let obj = this.dynamic
				let isdz = obj.liked
				let type = 0
				obj.liked = !isdz
				if (isdz) {
					obj.likeCount--
					type = 1
				} else {
					obj.likeCount++
				}
				this.changeHead(type)
				api.like({
					dynamicId: obj.dynamicId,
					type: type
				})
			},
			toDynamicMore() {
				let url = `/pages/autoTribe?current=1`
				uni.reLaunch({
					url
				})
			},
			saveImageToPhotosAlbum(e) {
				var that = this;
				uni.saveImageToPhotosAlbum({
					filePath: that.saveURL,
					success(res) {
						console.log(res)
						uni.showToast({
							title: '图片已保存到相册',
							icon: 'none',
							duration: 2000
						})
						// that.saveURL = ''
						that.issharepopShow = false
					},
					fail(res) {
						uni.showToast({
							title: "图片保存失败，请重新授权",
							icon: "none",
							duration: 2000
						})
					}
				})
			},
			imageShow(i) {
				let obj = this.dynamic.picList
				uni.previewImage({
					urls: obj,
					current: obj[i]
				})
			},
			scrollGetData() {
				this.getCommentList()
			},
			inputShow(i, e) {
				this.targetBottom = this.systemInfo.windowHeight - e.detail.y
				let obj = this.list[i]
				if ((obj.userId == app.globalData.pocketUserInfo.userId) || !obj.userId) {
					this.showToast('自己不能回复自己')
					return false
				}
				obj.dynamicId = this.dynamicId
				this.$refs.plinput.xianshi(obj, 'pl', false, false)

			},
			changeHead(type) {
				let currentURL = app.globalData.getUserData.wxHead || app.globalData.pocketUserInfo.avatarUrl
				let list = this.dynamic.likeHead
				let i = list.indexOf(currentURL)
				if (type == 1) { //取消点赞
					if (i > -1) {
						this.dynamic.likeHead.splice(i, 1)
					}
				} else {
					this.dynamic.likeHead.unshift(currentURL)
				}
				console.log('changeHead==============',currentURL, list, i)
			},
			loadImg(url, name, vurl) {
				let that = this;

				url = url.replace("http:", "https:")
				let p = new Promise(function(resolve, reject) {
					wx.getImageInfo({
						src: url,
						success: function(res) {
							if (name || name == "0") {
								res.name = name;
							}
							if (vurl) {
								res.head2 = vurl;
							}
							that.number++;
							console.log(that.number)
							resolve(res)
						}
					})
				})
				return p;
			},
			drawHead(w = 30, x = 0, y = 0, url) {
				// 头像
				let avatarurl_width = w; //绘制的头像宽度
				let avatarurl_heigth = w; //绘制的头像高度
				let avatarurl_x = x; //绘制的头像在画布上的位置
				let avatarurl_y = y; //绘制的头像在画布上的位置
				ctx.save();
				ctx.beginPath();
				ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2,
					false);
					
				ctx.clip();
				ctx.drawImage(url, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth);
				ctx.restore();
			},
			save() {
				console.log('save')
				let that = this;
				uni.canvasToTempFilePath({
					canvasId: 'myCanvas',
					fileType: "png",
					success: function(res) {
						that.saveURL = res.tempFilePath
						that.shareImagePopShow()
						console.log('二维码路径', that.saveURL);
						// wx.hideLoading()
					}
				})
			},
			shareImagePopShow() {
				uni.hideLoading()
				this.issharepopShow = true
			},
			txtLen(txt, sNum) {
				let _txt = txt,
					iCount = 0,
					sStr = _txt.split(""),
					textlist = [''],
					length = 1
				for (let i = 0; i < sStr.length; i++) {
					let strTemp = escape(sStr[i]);
					if (strTemp.indexOf("%u", 0) == -1) {
						iCount = iCount + 0.5;
					} else {
						iCount = iCount + 1;
					}
					if (iCount < sNum) {
						textlist[0] += sStr[i];
					} else if (iCount >= sNum && iCount < (sNum * 2) - 1) {
						textlist[1] = ''
						textlist[1] += sStr[i];
					} else if (iCount >= sNum * 2 && iCount < (sNum * 3 - 2)) {
						textlist[2] = ''
						textlist[2] += sStr[i];
					} else if (iCount >= sNum * 2 && iCount < (sNum * 4 - 2)) {
						textlist[3] = ''
						textlist[3] += sStr[i];
					} else if (iCount >= sNum * 2 && iCount < (sNum * 5 - 2)) {
						textlist[4] = ''
						textlist[4] += sStr[i];
					} else if (iCount >= sNum * 2 && iCount < (sNum * 6 - 2)) {
						textlist[5] = ''
						textlist[5] += sStr[i];
					} else if (iCount >= sNum * 2 && iCount < (sNum * 7 - 2)) {
						textlist[6] = ''
						textlist[6] += sStr[i];
					} else if (iCount >= sNum * 2 && iCount < (sNum * 8 - 2)) {
						textlist[7] = ''
						textlist[7] += sStr[i];
					} else if (iCount >= sNum * 2 && iCount < (sNum * 9 - 2)) {
						textlist[8] = ''
						textlist[8] += sStr[i];
					} else if (iCount >= sNum * 2 && iCount < (sNum * 10 - 2)) {
						textlist[9] = ''
						textlist[9] += sStr[i];
					} else if (iCount >= sNum * 2 && iCount < (sNum * 11 - 2)) {
						textlist[10] = ''
						textlist[10] += sStr[i];
					}
				}
				console.log(textlist)
				return textlist
				// if (iCount < sNum) {
				//         textlist[0] += sStr[i];
				// }else{
				//     length = parseInt(iCount/sNum)
				//     let yu = iCount%sNum
				//     console.log(length,yu)
				//     if(yu>0){
				//         length=length+1
				//     }
				//     for(let j = 0;j<length;j++){
				//         let yushu;  
				//         for (let i = 0; i < sStr.length; i++) {
				//         let strTemp = escape(sStr[i]);
				//         if (strTemp.indexOf("%u", 0) == -1) {
				//             iCount = iCount + 0.5;
				//         } else {
				//             iCount = iCount + 1;
				//         }

				//         yushu = i/(sNum*j)
				//         console.log(yushu)
				//         if(yushu==j){
				//             textlist[j] +=sStr[i]
				//             console.log(textlist[j])
				//         }

				//     }
				// }


				// }
				// return {
				//     a: a,
				//     b: b,
				//     c: c + "......"
				// }
			},
			async start() {

				let data = await api.getDynamicDetails(this.dynamicId, 9)
				//动态作废
				if (data.code == 2 && !this.isArticle) {
					this.$refs.loading.changeLoading(false)
					this.showToast(data.msg)
					let pages = getCurrentPages()
					let prevPage = pages[pages.length - 2]
					console.log(prevPage)
					if (prevPage) {
						let url = prevPage.route
						setTimeout(() => {
							if (url == 'pages/index') {
								uni.reLaunch({
									url: "/pages/authorization"
								})
							} else if (url == 'pages/myMessage') {
								uni.reLaunch({
									url: "/pages/myMessage"
								})
							} else {
								uni.reLaunch({
									url: `/pages/autoTribe?current=${this.current}`
								})
							}
						}, 500)
					} else {
						setTimeout(() => {
							uni.reLaunch({
								url: `/pages/autoTribe?current=1`
							})
						}, 500)
					}

					return false
				}
				if (this.isArticle || this.isArticleDynamic) {
					this.title = '文章详情'
					let {
						data = {}, code
					} = await api.getDynamicArticle(this.articleId)
					// data = {}
					// code = 0
					this.articleData = data
					if (code != 1) {
						this.isArticleOver = false
					}
				}
				if (this.isArticleDynamic) {
					this.title = '动态详情'
				}
				if (data.code != 2) {
					this.getCommentList(this.dynamicId)
					data.data.createTime = this.date2Str(data.data.createTime)
					this.dynamic = data.data
					if (this.dynamic.userId == app.globalData.pocketUserInfo.userId) {
						this.isUserDynamic = true
					}
				}
				if(!this.isArticleOver || this.isArticle){
					this.$refs.plinput.inputHide2()
				}else{
					this.$refs.plinput.xianshi(this.dynamic, 'dt', false)
				}
				this.$refs.loading.changeLoading(false)
				//动态被访问
				api.visitDynamic(this.dynamicId)
			},
			async startCanvas() {
				let that = this
				if (that.saveURL) {
					that.shareImagePopShow()
					return false
				}
				if (that.isdrawIng) { //正在画图中
					console.log('正在画图中')
					return false
				}
				uni.showLoading()
				that.isdrawIng = true
				// let cs = `?sceneId=gh_dd83231d4d16&scene=o%3DdynamicDetails-dynamicId%3D${this.dynamicId}`
				let obj = that.dynamic
				let isArt = 0
				if (that.isArticle) {
					isArt = 1
				}
				let aid = 0
				if (that.articleId) {
					aid = that.articleId
				}
				let url =
					`${config.DOMAIN.host}/api/audi/qrcode/unlimited?sceneId=gh_dd83231d4d16&sence=to=ddxq-a=${this.dynamicId}-b=${aid}`
				// let url = `${app.globalData.host}/api/audi/qrcode/unlimited?sceneId=gh_dd83231d4d16&sence=to=ddxq-id=${this.dynamicId}-aid=${aid}`
				//如果是文章
				if (that.isArticle) {
					url += `-c1=1`
				}
				//如果是动态文章
				if (that.isArticleDynamic) {
					url += `-c2=1-d=${that.authorUserId}`
				}
				console.log('url', url);
				let da = await (function(){
					return new Promise((resolve, reject) => {
						uni.downloadFile({
							url: url,
							success: (res) => {
								// console.log('downloadFile', res)
								if (res.statusCode === 200) {
									resolve(res)
								}
							}
						})
					}) 
				})();
				that.canvasCode = da.tempFilePath
				// 背景
				// isArticle
				// let bgurl = 'https://www1.pcauto.com.cn/zt/gz20160608kdcs/mcjs/'
				let bgurl = 'https://www1.pcauto.com.cn/zt/gz20210125/audi/xcx/img/'
				if (that.isArticle) {
					bgurl += 'dazhong_20191125_3.png'
				} else {
					bgurl += 'share_bg.png'
				}
				let bgURL = await that.loadImg(bgurl)
				console.log(bgURL)
				bgURL = bgURL.path
				console.log('bgURL', bgURL)
				// 头像
				let wxHead = await that.loadImg(obj.wxHead)
				wxHead = wxHead.path
				// 开始画
				if (that.isArticle) {
					that.canvasHeight = 790
					ctx.drawImage(bgURL, 0, 0, 600, 790) //画背景
					ctx.drawImage(that.canvasCode, 103, 567, 148, 148) //画二维码
					that.drawHead(80, 260, 126, wxHead) //头像
					// 姓名
					ctx.setFontSize(28)
					ctx.setTextAlign('center')
					ctx.setFillStyle("#333")
					ctx.fillText(obj.nickName, 300, 246)
					// 时间
					ctx.setFontSize(20)
					ctx.setFillStyle("#999")
					ctx.fillText(obj.createTime, 300, 275)
					// let vtitle = '新宝马8系 广州车展新车全面预览最新车系'
					let vtitlea = that.splitString(that.articleData.title, ctx, 34)
					ctx.setTextAlign('left')
					ctx.setFillStyle("#333")
					ctx.fillText(vtitlea[0], 64, 348)
					if (vtitlea[1]) {
						ctx.fillText(vtitlea[1], 64, 393)
					}
					let ttext = ''
					for (let ti in that.articleData.content) {
						let tiobj = that.articleData.content[ti]
						if (tiobj.type == 'txt' && tiobj.value) {
							ttext += tiobj.value
						}
					}
					let ttexta = that.splitString(ttext, ctx, 26)
					ctx.setFillStyle("#666")
					ctx.fillText(ttexta[0], 64, 450)
					if (ttexta.length > 2) {
						ttexta[1] = ttexta[1].substr(0, ttexta[1].length - 3) + '...'
						ctx.fillText(ttexta[1], 64, 490)
					}
				} else {
					that.canvasHeight = 700
					ctx.drawImage(bgURL, 0, 0, 600, 700) //画背景
					ctx.drawImage(that.canvasCode, 214, 430, 172, 172) //画二维码
					
					ctx.arc(300, 170, 50, 0, 2 * Math.PI)
					ctx.setFillStyle('#ffffff')
					ctx.fill()
					that.drawHead(96, 252, 122, wxHead) //头像
					// 姓名
					ctx.setFontSize(26)
					ctx.setTextAlign('center')
					ctx.setFillStyle("#777")
					ctx.fillText(obj.nickName, 300, 260)
					// 时间
					ctx.setFontSize(20)
					ctx.setFillStyle("#999")
					ctx.fillText(obj.createTime, 300, 295)
					// 文案
					let textArray = that.splitString(obj.dynamicContent, ctx, 28)
					ctx.setFontSize(28)
					ctx.setTextAlign('left')
					ctx.setFillStyle("#333")
					ctx.fillText(textArray[0], 59, 350)
					if (textArray.length > 2) {
						textArray[1] = textArray[1].substr(0, textArray[1].length - 3) + '...'
						ctx.fillText(textArray[1], 59, 400)
					}
				}
				// 生成图片
				ctx.draw(false, () => {
					that.save()
				})
				
			},
			splitString(text = '', ctx, fontSize = 18, width = 456) {
				let chr = text.split("");
				let temp = "";
				let row = [];
				ctx.setFontSize(fontSize)
				for (var a = 0; a < chr.length; a++) {
					if (ctx.measureText(temp).width < width) {
						temp += chr[a];
					} else {
						a--;
						row.push(temp);
						temp = "";
					}
				}
				row.push(temp);
				return row;
			},
			async getCommentList() {
				if (this.isLoadList) {
					return false
				}
				this.isLoadList = true
				let data = await api.getCommentList({
					dynamicId: this.dynamicId,
					pageNum: this.pageNum,
					pageSize: this.pageSize
				})
				if(data.code == 1){
					let total = Math.ceil(data.total / data.pageSize)
					console.log(total > this.pageNum)
					if (total > this.pageNum) {
						this.isLoadList = false
						this.pageNum++
					} else {
						// this.allLoadList = true
					}
					for (let i in data.rows) {
						let obj = data.rows[i]
						obj.createTime = this.date2Str(obj.createTime)
						obj.content = this.str2obj(obj.content)
					}
					console.log('getCommentList==data===========',data)
					this.list = [...this.list, ...data.rows]
					this.total = data.total
				}else{
					this.list = [...this.list]
				}
			},
			str2obj(str) {
				let isubb = str.match(/\[[\u4e00-\u9fa5OK]{1,3}\]/g)
				let vcontent = {}
				if (isubb) {
					vcontent.messageName = 'ubb-text'
					vcontent.content = ubb.str2Json(str)
				} else {
					vcontent.messageName = 'text'
					vcontent.content = str
				}
				return vcontent
			},
			showToast(text = '', duration = 2000) {
				uni.showToast({
					title: text,
					icon: 'none',
					duration: duration
				})
			},
			date2Str(time) {
				if (!time) {
					return '- -'
				}
				let ccctime = time
				let str
				var date = new Date();
				var yesterday_milliseconds = date.getTime() - 1000 * 60 * 60 * 24;
				var yesterday = new Date();
				yesterday.setTime(yesterday_milliseconds);
				var strYear = yesterday.getFullYear();
				var strDay = yesterday.getDate();
				var strMonth = yesterday.getMonth() + 1;
				time = parseInt(time)
				var timeDate = new Date(time)
				var o = {
					'y': timeDate.getFullYear(),
					'M': timeDate.getMonth() + 1, //月份 
					'd': timeDate.getDate(), //日 
					'h': timeDate.getHours(), //小时 
					'm': timeDate.getMinutes(), //分 
					's': timeDate.getSeconds(), //秒 
					'q': Math.floor((timeDate.getMonth() + 3) / 3), //季度 
					'S': timeDate.getMilliseconds() //毫秒 
				}
				var thisDate = new Date()
				var p = {
					'y': thisDate.getFullYear(),
					'M': thisDate.getMonth() + 1, //月份 
					'd': thisDate.getDate(), //日 
					'h': thisDate.getHours(), //小时 
					'm': thisDate.getMinutes(), //分 
					's': thisDate.getSeconds(), //秒 
					'q': Math.floor((thisDate.getMonth() + 3) / 3), //季度 
					'S': thisDate.getMilliseconds() //毫秒
				}
				if (o.y == p.y) { //同年
					if (o.M == p.M) { //同月
						if (o.d == p.d) { //同日
							let dqTime = thisDate.getTime()
							let jjsj = dqTime - ccctime
							let fenzhong = Math.floor(jjsj / 1000 / 60)
							if (fenzhong < 0) {
								fenzhong = fenzhong * -1
							}
							if (fenzhong < 60) {
								str = fenzhong + '分钟前'
							} else {
								str = Math.floor(fenzhong / 60) + '小时前'
							}
						} else {
							if (o.d == strDay) {
								str = '昨天'
							} else {
								str = this.add0(o.M) + '月' + this.add0(o.d) + '日'
							}
						}
					} else {
						if (o.M == strMonth && o.d == strDay) {
							str = '昨天 '
						} else {
							str = this.add0(o.M) + '月' + this.add0(o.d) + '日'
						}
					}
				} else {
					str = o.y + '年' + this.add0(o.M) + '月' + this.add0(o.d) + '日'
				}
				return str
			},
			add0(n) { //+0
				return n > 9 ? n : '0' + n
			},
		}
	}
</script>

<style lang="less">
	@import '@/static/less/dynamic.less';

	page {
		background: #f0f2f7;
	}

	.content {
		position: relative;
		z-index: 9;
	}
	.dynamic-box{
		.dz-pl-number{
			.diznzan{
				margin: 0 42rpx 0 0;
			}
		} 
	}
	.dynamicDetails {
		.pa(0, 0);
		width: 100%;
		height: 100%;
	}

	.dianzan-head-list {
		padding: 10rpx 0 40rpx;
		font-size: 0;

		.image {
			.db(top);
			.arc(60rpx);
			margin-left: 18rpx;
		}

		.image:first-child {
			margin-left: 0;
		}

		margin-bottom: 20rpx;
	}

	.dynamic-article-content {
		font-size: 0;
		position: relative;
		line-height: 1;
		padding-bottom: 40rpx;

		&.cover {
			height: 360rpx;
			overflow: hidden;
			margin-top: 10rpx;
			padding-bottom: 0;
		}

		.dynamic-article-text {
			font-size: 34rpx;
			line-height: 64rpx;
			color: #666666;
			margin-bottom: 40rpx;
		}

		.dynamic-article-image {
			margin-bottom: 40rpx;
			border-radius: 10rpx;
		}

		&-mask,
		&-mask-bottom {
			display: block;
			height: 50%;
			width: 100%;
			.pa(0, 0);
			content: "";
			background-image: -webkit-linear-gradient(bottom, rgba(57, 46, 490, 0) 0%, rgba(0, 0, 0, 1) 100%);
			opacity: 0.7;
		}

		&-mask-bottom {
			bottom: 0;
			left: 0;
			top: auto;
			background-image: -webkit-linear-gradient(top, rgba(57, 46, 490, 0) 0%, rgba(0, 0, 0, 1) 100%);
		}

		&-cover {
			position: relative;
			width: 686rpx;
		}

		&-articleAuthorHead {
			.arc(40rpx);
			.pa(30rpx, 20rpx);
		}

		&-name {
			.seth(40rpx, 24rpx, #fff);
			.pa(80rpx, 20rpx);
		}

		&-title {
			.seth(90rpx, 32rpx, #fff);
			position: absolute;
			left: 30rpx;
			bottom: 0;
		}

		&-articleNew-title {
			width: 622rpx;
			position: absolute;
			left: 30rpx;
			bottom: 20rpx;
			color: #fff;
			font-size: 32rpx;
			line-height: 52rpx;
		}

		&-articleNew-icon {
			.setbg(75rpx, 25rpx, 'dazhong_20191125_2.png');
			.pa(580rpx, 28rpx);
		}
	}

	.pinglun-lists {
		padding: 32rpx 32rpx 0;
		background: #fff;

		.tit {
			.seth(53rpx, 40rpx, #333);
			.fb;
		}

		.list-box {
			position: relative;
			padding: 32rpx 0 20rpx 104rpx;
			min-height: 80rpx;
			border-bottom: 1px solid #ebebeb;
		}

		.list-box:last-child {
			border-bottom: 0;
		}

		.head {
			.arc(80rpx);
			.pa(0, 32rpx);
		}

		.name {
			.seth(34rpx, 28rpx, #777);
			margin-bottom: 4rpx;
			position: relative;

			&.v {
				&:after {
					.db(middle);
					content: "";
					.setIcon(116rpx, 34rpx, 32rpx, 199rpx);
					margin-left: 20rpx;
				}
			}
		}

		.hfname {
			color: #777;
		}

		.pinglun-content {
			.seth(50rpx, 28rpx, #333);
			height: auto;
		}

		.pinglun-date {
			.seth(45rpx, 22rpx, #aaa);
		}
	}

	.image-list {
		padding-top: 12rpx;
		font-size: 0;

		.image-box {
			width: 222rpx;
			height: 222rpx;
			overflow: hidden;
			.db(top);
		}

		image {
			width: 222rpx;
		}

		.image-box:nth-child(3n-1) {
			margin: 0 10rpx;
		}
	}

	.image-list1 {
		.image-box {
			width: auto;
			height: auto;
		}

		image {
			width: 686rpx;
		}
	}

	.gd-zw {
		height: 100rpx;
	}

	.ubb-image {
		.db(middle);
		width: 30rpx;
		height: 30rpx;
	}

	.share-btn {
		position: relative;
		float: right;
		width: 34rpx;
		height: 76rpx;
		// margin-left: 12rpx;
		margin-right: 83rpx;

		&::before {
			display: block;
			content: "";
			.pa(0, 50%);
			.setbg(34rpx, 32rpx, 'shareicon20190824.png');
			transform: translate(0, -50%);
		}
	}

	.bottomShare {
		position: fixed;
		width: 100%;
		.tc;
		z-index: 999;
		left: 0;
		bottom: 0;
		.seth(100rpx, 32rpx, #fff);
		background: #ce1330;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		button {
			.pa(0, 0);
			width: 100%;
			height: 100%;
		}
	}

	.share {
		width: 40rpx;
		height: 40rpx;
		background: url(//www1.pcauto.com.cn/wap/pocket/xcx/yqdz/20190930/friends_03.jpg) no-repeat;
		background-size: 100% 100%;
		position: absolute;
		right: 0;
		top: 22rpx;
		z-index: 12 // float: right;
			// margin-left:40rpx;
			// position: relative;
			// right:0
	}

	.mask {
		z-index: 100;
	}

	canvas {
		width: 600px;
		height: 700px;
		z-index: 100;
		position: absolute;
		left: -750px;
		top: 0;
	}

	.shareFiend {
		position: relative;
		z-index: 100;
		top: 130rpx;
		left: 0rpx;
	}

	.saveImg {
		width: 600rpx;
		// position: absolute;

	}

	.shareFiend {
		text-align: center;
	}

	.savePic {
		width: 540rpx;
		height: 88rpx;
		color: #fff;
		font-size: 32rpx;
		background: #ce1330;
		border-radius: 44rpx;
		display: inline-block;
		line-height: 88rpx;
		margin-top: 40rpx;
	}

	.dynamic-article-image {
		width: 686rpx;
	}

	.dynamic-article-title {
		font-size: 50rpx;
		line-height: 70rpx;
		.fb;
		// padding: 12rpx 0;
		margin-top: -30rpx;
		padding-bottom: 30rpx;
	}

	.dynamic-article-none {
		.setbg(686rpx, 760rpx, 'dazhong_20191129_0.png')
	}

	.bg-white {
		background: #fff;
		position: relative;

		&-btn {
			width: 460rpx;
			height: 90rpx;
			position: absolute;
			left: 50%;
			bottom: 0;
			transform: translate(-50%, 0);
		}
	}

	.del-dynamic-mask {
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		z-index: 9;
		background: rgba(0, 0, 0, .5);
	}

	.del-dynamic-box {
		padding: 40rpx;
		width: 540rpx;
		background: #fff;
		border-radius: 12rpx;
		position: fixed;
		left: 50%;
		top: 50%;
		z-index: 10;
		transform: translate(-50%, -50%);
		text-align: center;

		.text {
			padding-top: 12rpx;
			font-size: 32rpx;
			line-height: 50rpx;
		}

		&-btns {
			margin-top: 45rpx;
			font-size: 0;

			.btn {
				.db();
				width: 244rpx;
				.seth(84rpx, 32rpx);
				border: 1px solid #d0d0d0;
				border-radius: 42rpx;

				&:last-child {
					color: #fff;
					border-color: #ce1330;
					background: #ce1330;
					margin-left: 24rpx;
				}
			}
		}
	}
</style>
