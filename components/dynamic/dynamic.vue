<template>
	<view class="dynamic" :class="list.length == 0 && 'none-data'" v-if="isLoading">
		<block v-if="list.length > 0">
			<block v-for="(item,index) in list" :key="item.dynamicId">
				<view class="dynamic-box">
					<view class="head-name">
						<image :src="item.wxHead" @tap="toMyFollowPage(index)" mode="scaleToFill" lazy-load="true"></image>
						<view class="name">
							<view class="nickName">{{item.nickName}}</view>
							<view v-if="item.isApprove == 1" class="approve"></view>
							<view v-if="item.official == 1" class="official"></view>
						</view>
						<view class="date">{{item.createTime}}</view>
						<view v-if="item.isUserDynamic" class="del-btn" @tap="popShow(index)"></view>
					</view>
					<view class="dynamic-content" :class="item.textSize.textRow > 3 ? 'overflow':''">
						<view class="dynamic-content-text" @tap="toDynamicDetailsPage(index)">
							<text class="zhuti" v-if="item.themeName" @tap.stop="toztDetails(item.themeId)">#{{item.themeName}}#</text>
							<text decode="true">{{item.dynamicContent}}</text>
						</view>
						<view class="toggle-btn" @tap.stop="textShow(index)">全文</view>
						<view v-if="item.type == 1" class="dynamic-article-content" @tap="toArticleDetailsPage(index)">
							<image class="dynamic-article-content-cover" :src="item.articleNew.cover" mode="widthFix" lazy-load="true"></image>
							<view class="dynamic-article-content-mask"></view>
							<image class="dynamic-article-content-articleAuthorHead" :src="item.wxHead" mode="scaleToFill" lazy-load="true"></image>
							<view class="dynamic-article-content-name">{{item.nickName}}</view>
							<view class="dynamic-article-content-articleNew-icon"></view>
							<view class="dynamic-article-content-title">{{item.title}}</view>
							<view class="dynamic-article-content-mask-bottom"></view>
							<view class="dynamic-article-content-articleNew-title ellipsis">{{item.articleNew.title}}</view>
						</view>
						<view class="image-list" :class="'image-list' + item.picList.length">
							<block v-for="(imageList,imageindex) in item.picList" :key="imageindex">
								<view class="image-box">
									<!-- <image @tap.stop="imageShow('{{index}}','{{imageindex}}')" src="{{imageList}}" mode="widthFix" lazy-load="true"></image> -->
									<image @tap.stop="imageShow(index,imageindex)" :src="imageList" :mode="item.picList.length == 1 ? 'widthFix' : 'aspectFill'" lazy-load="true"></image>
								</view>
							</block>
						</view>
					</view>
					<view class="dz-pl-number">
						<view class="dz">{{item.provinceName + ' · ' +item.regionName}}</view>

						<view class="diznzan" :class="item.liked ==  1 && 'current'" @tap.stop="give(index)">
							<block v-if="item.likeCount > 0">
								{{item.likeCount}}
							</block>
						</view>
						<view class="pl" @tap.stop="inputShow(index,'999','dt',$event)">
							<block v-if="item.commentCount > 0">
								{{item.commentCount}}
							</block>
						</view>
						<view class="share" @tap="sharePYQ(index)"></view>
						<view class="show-number">{{item.browseCount}}</view>
					</view>
					<view class="pl-list" v-if="item.commentContent.length > 0">
						<view class="list" v-for="(v,vi) in item.commentContent" :key="vi" @tap.stop="inputShow(index,vi,'pl',$event)" v-if="vi < viewCount">
							<block v-if="v.beReplyUserName">
								<text class="list-name">{{v.userName}}</text>
								回复
								<text class="list-name">{{v.beReplyUserName}}: </text>
							</block>
							<block v-else>
								<text class="list-name">{{v.userName}}: </text>
							</block>
							<!-- <text class="list-name"><block v-if="{{v.beReplyUserName}}">{{v.userName + '回复:' + v.beReplyUserName+' '}}</block>
	                                <block v-else>{{v.userName}}:</block>
	                            </text> -->
							<block v-if="v.content.messageName == 'text'">
								<text decode="true">{{v.content.content}}</text>
							</block>
							<block v-else>
								<block v-for="(vitem,vitemindex) in v.content.content" :key="vitemindex">
									<block v-if="vitem.type == 'text'">
										<text decode="true">{{vitem.txt}}</text>
									</block>
									<block v-else>
										<image class="ubb-image" :src="vitem.txt" mode="scaleToFill" lazy-load="true"></image>
									</block>
								</block>
							</block>
						</view>
						<view class="more-btn" v-if="item.commentCount > 2" @tap="toDynamicDetailsPage(index)">查看全部{{item.commentCount}}条评论
							></view>
					</view>
				</view>
			</block>
			<view class="zw-bottom" :style="'height:' + bottomHeight + 'px'"></view>
			<view class="bottom-tip" v-if="allLoadList">已经到底啦</view>
		</block>
		<block v-else>
			<view style="height:145rpx"></view>
			<view class="none-icon"></view>

			<text class="none-text">{{noneText}}</text>

			<view class="none-btn" @tap="toputDynamic" v-if="isshowButton">
				去写动态
			</view>
			<view style="height:30rpx"></view>
		</block>
		<block v-if="delboxShow">
			<view class="del-dynamic-mask"></view>
			<view class="del-dynamic-box">
				<text>动态删除后不可找回\n是否确定要删除此动态</text>
				<view class="del-dynamic-box-btns">
					<view class="btn" @tap="popHide">取消</view>
					<view class="btn" @tap="deleteDynamic">删除</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	import api from '@/public/api/index'
	import ubb from '@/units/ubb.js'
	let app = getApp()
	export default {
		props: ['from', 'themeId'],//主题id themeId
		data() {
			return {
				delboxShow: false,
				inputFrom: "",
				inputIndex: 0,
				inputvi: 0,
				allLoadList: false,
				isLoading: false,
				isLoadList: false,
				page: 1, //页码
				pageSize: 15, //页大小
				isFocus: false,
				bottomHeight: 0,
				systemInfo: {},
				targetBottom: 0,
				deleteIndex: 0,
				list: [],
				viewCount: 2,
				noneText: "",
				isshowButton: false,
				userid: '',
			}
		},
		created() {
			this.userid = this.themeId || ''
		},
		methods: {
			setZwHeight(h){
				let that = this
				let height = h - that.targetBottom + 30
				if (height > 0) {
					that.bottomHeight = h
					setTimeout(() => {
						that.$emit('set-scroll-top', height)
					}, 100)
				}
			},
			removeZw(){
				this.bottomHeight = 0
				this.$emit('share-btn-show')
			},
			popShow(i) {
				this.delboxShow = true
				this.deleteIndex = i
			},
			popHide() {
				this.delboxShow = false
			},
			// 删除动态
			async deleteDynamic() {
				let obj = this.list[this.deleteIndex]
				// console.log(obj)
				let {
					data,
					code,
					msg
				} = await api.deleteDynamic(obj.dynamicId, obj.userId)
				console.log(data,code,msg)
				if (code == 1) {
					this.list.splice(this.deleteIndex, 1);
					if (this.from == 'personalHome') {
						this.$emit('getTotal', this.list.length)
					}
				} else {
					this.showToast(msg)
				}
				this.delboxShow = false;
			},
			// 跳转个人中心
			toMyFollowPage(i) {
				let obj = this.list[i]
				let url = `/pages/personalHome?userid=${obj.userId}`
				uni.navigateTo({
					url
				})
			},
			inputShow(i, vi, ly, e) {
				// console.log(i, vi, ly, e)
				
				this.targetBottom = this.systemInfo.windowHeight - e.detail.y
				let obj = {}
				this.inputFrom = ly
				this.inputIndex = i
				this.inputvi = vi
				if (ly == 'dt') {
					obj = this.list[i]
				} else {
					obj = this.list[i].commentContent[vi]
				}
				if ((obj.userId == app.globalData.pocketUserInfo.userId && ly != 'dt') || !obj.userId) {
					this.showToast('自己不能回复自己')
					return false
				}

				obj.dynamicId = this.list[i].dynamicId
				
				this.$emit('xianshi', obj, ly)
			},

			toDynamicDetailsPage(index) { //去动态详情页
				let obj = this.list[index]
				let current = this.getPath()
				//动态
				let url = `/pages/dynamicDetails?id=${obj.dynamicId}&current=${current}`
				//文章动态
				if (obj.type == 1) {
					url += `&isArtDynamic=1&aid=${obj.articleNew.articleId}&auid=${obj.articleNew.authorUserId}`
				}
				uni.navigateTo({
					url
				})
			},
			toArticleDetailsPage(index) { //去文章详情页
				let obj = this.list[index]
				let current = this.getPath()
				let url = `/pages/dynamicDetails?id=${obj.dynamicId}&current=${current}`
				url += `&isArt=1&aid=${obj.articleNew.articleId}`
				uni.navigateTo({
					url
				})
			},
			toztDetails(id) {
				let url = `/pages/ztdetails?themeId=${id}`
				uni.navigateTo({
					url
				})
			},
			toputDynamic() {
				if (this.from == 'guanzhu') {
					this.$emit('swiper-tab', 2)
					return false;
				}
				let url = `/pages/putDynamic`
				if (this.userid) {
					url = `/pages/putDynamic?themeId=${this.userid}`
				}
				uni.navigateTo({
					url
				})
			},
			sharePYQ(i) {

			},
			give(i) { //点赞
				// console.log(i)
				let obj = this.list[i]
				let isdz = obj.liked
				let type = 0
				obj.liked = !isdz
				if (isdz) {
					obj.likeCount--
					type = 1
				} else {
					obj.likeCount++
				}
				api.like({
					dynamicId: obj.dynamicId,
					type: type
				})
			},
			textShow(i) {
				let list = this.list
				list[i].textSize.textRow = 0
				this.$set(this.list, i, list[i])
			},
			imageShow(i, imgi) {
				let obj = this.list[i].picList
				uni.previewImage({
					urls: obj,
					current: obj[imgi]
				})
			},
			addpl(obj) {
				console.log('addpl==========================',obj)
				
				obj.content = this.str2obj(obj.content)
				// this.list[this.inputIndex].commentContent.unshift(obj)
				// this.list[this.inputIndex].commentCount++
				
				let _list = this.list[this.inputIndex]
				_list.commentContent.unshift(obj)
				_list.commentCount++
				this.$set(this.list, this.inputIndex, _list)
			},
			showToast(text = '', duration = 2000) {
				this.$toast(text, 'none', duration);
			},
			againLoad() {
				this.page = 1
				this.list = []
				this.isLoadList = false
				this.startGetData()
			},
			async startGetData(themeId) {
				if (themeId) {
					this.userid = themeId
				}
				this.systemInfo = uni.getSystemInfoSync()
				if (this.list.length == 0) {
					this.$emit('changeLoading',true)
					await this.getDynamicList()
					this.$emit('changeLoading',false)
				}
			},
			async networkStatusChange() {
				if (this.list.length == 0) {
					this.isLoadList = false
					await this.getDynamicList()
					this.$emit('changeLoading',false)
				}
			},
			scrollGetData() {
				this.getDynamicList()
			},
			async getDynamicList() {
			
				// console.log(this.from,'=======',!this.isLoadList)
				if (!this.isLoadList) {
					this.isLoadList = true
					let parameter = {
						// commentSize:3,
						page: this.page,
						pageSize: this.pageSize
					}
					console.log('themeId=========',this.userid)
					if (this.userid) {
						parameter.themeId = this.userid
					}
					let data
					if (this.from == 'personalHome') { //个人中心
						data = await api.getUserDynamicList(parameter.themeId, this.page, this.pageSize)
					} else if (this.from == 'zuixin') {
						data = await api.getDynamicList(parameter)
					} else if (this.from == 'tuijian') {
						data = await api.getTJdynamic(this.page, this.pageSize)
					} else if (this.from == 'tongcheng') {
						parameter.regionId = app.globalData.currentLocation.cityData.cityId
						data = await api.getDynamicList(parameter)
					} else if (this.from == 'guanzhu') {
						data = await api.getFocusDynamic(this.page, this.pageSize)
					} else {
						data = await api.getDynamicList(parameter)
					}

					// let data = await api.getDynamicList(parameter)
					let total = Math.ceil(data.total / this.pageSize)
					if (this.from == 'personalHome') {
						this.$emit('getTotal', data.total)
					}
					if (total > this.page) {
						this.page++
						this.isLoadList = false
					} else {
						this.allLoadList = true
					}
					this.isLoading = true
					let {
						rows = []
					} = data
					let len = this.list.length
					this.list = [...this.list, ...rows]
					if (this.list.length == 0) {
						this.isLoadList = false
						let noneText = ""
						if (this.from == 'guanzhu') {
							noneText = "你的关注对象还没有发布动态哦~\n快去推荐动态看看吧"
						} else if (this.from == 'personalHome') {
							noneText = "该用户还没有发布动态哦"
						} else {
							noneText = "暂时还没有人发表动态\n快去发表动态成为第一人啦"
							this.isshowButton = true
						}
						this.noneText = noneText
						this.$emit('dynamic-list-none')
					}
					for (let i in rows) {
						let obj = rows[i]
						obj.textSize = this.getTextHeight(obj)
						// console.log(obj)
						// let 
						obj.createTime = this.date2Str(obj.createTime)
						// 获取评论列表
						api.getCommentList({
							dynamicId: obj.dynamicId,
							pageNum: 1,
							pageSize: 2
						}).then(res => {
							let ii = len * 1 + i * 1
							for (let i in res.rows) {
								let robj = res.rows[i]
								robj.content = this.str2obj(robj.content)
							}
							let _list = this.list[ii]
							_list.commentContent = res.rows
							_list.commentCount = res.total || 0
							this.$set(this.list, ii, _list)
							// this.list[ii].commentContent = res.rows
							// this.list[ii].commentCount = res.total || 0
						})
					}
					console.log('list=============', this.list)
				} else {
					return false
				}
			},
			getTextHeight(obj) {
				if (!this.systemInfo) {
					this.systemInfo = uni.getSystemInfoSync()
				}
				let sw = this.systemInfo.screenWidth || 375
				let bili = sw / 750
				let txt = `#${obj.themeName}#${obj.dynamicContent}`
				let txtlen = this.textLen(txt)
				let textRow = Math.ceil((bili * txtlen * 32) / (sw - bili * 64))
				let textHeight = textRow * (sw / 750) * 46
				let robj = {
					textRow,
					textHeight
				}
				// console.log(robj)
				return robj
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
			textLen(txt) {
				var _txt = txt;
				var iCount = 0;
				var sStr = _txt.split("");
				for (var i = 0; i < sStr.length; i++) {
					let strTemp = escape(sStr[i]);
					if (strTemp.indexOf("%u", 0) == -1) {
						iCount = iCount + 0.5;
					} else {
						iCount = iCount + 1;
					}
				}
				return iCount
			},
			getPath() {
				let current = 0
				if (this.from == 'subjectList') {
					current = 0
				} else if (this.from == 'zuixin') {
					current = 1
				} else if (this.from == 'tuijian') {
					current = 2
				} else if (this.from == 'tongcheng') {
					current = 3
				} else if (this.from == 'guanzhu') {
					current = 4
				} else if (this.from == 'articleList') {
					current = 5
				}
				return current
			}
		}
	}
</script>

<style lang="less">
	@import '@/static/less/dynamic.less';

	.toggle-btn {
		display: none;
	}

	.dynamic-content-text {
		font-size: 32rpx;
		line-height: 50rpx;
		margin-bottom: 15rpx;
	}

	.dynamic-content.overflow {
		.dynamic-content-text {
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 3;
			overflow: hidden;
		}

		.toggle-btn {
			display: block;
			color: #ce1330;
		}
	}

	.dynamic-article-content {
		font-size: 0;
		position: relative;
		line-height: 1;
		height: 360rpx;
		overflow: hidden;

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
