<template>
	<view class="cq_marathon" :style="{ paddingBottom: activityStatus != 1 ? 0 + 'rpx' : paddingBottm + 'rpx' }">
		<!-- <userBand :cancleShow='sourceUserId' @loginSuccess='getData'></userBand> -->
		<view class="activity" v-if="soureDone">
			<!-- <share-pop ref="shareSuccess"></share-pop> -->
			<!-- <page-top :background="'#fff'" :titleys="'#000'" :btnys="''" :title="'重庆马拉松门票抽奖活动' " :noShowHouse="sourceUserId">
			</page-top> -->
			<form-pop ref="formpop" @subSuccess="subSuccess()"></form-pop>
			<image v-if="headBg" class="content-image" :src="headBg" mode="widthFix" lazy-load="false"></image>
			<view id="middleWrap">
				<!-- 被邀请页面 -->
				<view class="inviteInfo be_invite" v-if="sourceUserId && activityStatus == 1 && isApply === 0">
					<view class="be_invite_bg">
						<image class="invite_avatar" :src="sourceUserAvatar" mode="widthFix"></image>
						<view class="instructions invite_name_wrap"
							><text class="source_user_name">{{ sourceUserName }}</text
							>邀请你报名,快来报名吧~</view
						>
						<view class="btn sign_up" @click="formShow()">报名活动</view>
					</view>
				</view>
				<!-- 未报名 -->
				<view class="inviteInfo" v-else-if="isApply === 0 && activityStatus == 1">
					<view class="instructions">你还没有报名,报名后才可以参与哦~</view>
					<view class="btn onApply" @click="formShow()">报名活动</view>
				</view>
				<!-- 已报名 -->
				<view class="inviteInfo" v-else-if="isApply === 1 && activityStatus == 1">
					<view class="instructions">
						<!-- 已经邀请的人的头像 -->
						<view class="invitered">
							<view class="invitered_item" v-for="(item, index) in inviteredList" @click="!!!item.userId && shareChoise()" :key="index">
								<image class="invitered__avatar" :src="item.avatarUrl"></image>
							</view>
						</view>
						<view class="invitered_count">已有{{ inviteCount }}位好友报名></view>
					</view>
					<view class="btn" @click="isComplete !== 1 && shareChoise()">{{ isComplete ? "邀请达标,请等待活动抽奖" : "邀请好友报名" }}</view>
				</view>
				<!-- 活动未开始 -->
				<view class="inviteInfo" v-else-if="activityStatus == 0">
					<view class="instructions">
						<view>朋友你来早啦,活动还为开始哦~</view>
						<view>活动时间:{{ activityTimeRang }}</view>
					</view>
					<view class="btn finish">活动未开始</view>
				</view>
				<!-- 活动已经结束 -->
				<view class="inviteInfo" v-else-if="activityStatus == 2">
					<view class="instructions">
						<view>朋友你来晚啦,活动已经结束了</view>
						<view>答应我下一个活动一定要早点来看我哦~</view>
					</view>
					<view class="btn finish">活动已结束</view>
				</view>
			</view>
		</view>
		<image class="content-image" :src="ruleImg" mode="widthFix" lazy-load="false"></image>
		<view class="bottom_btn inviteInfo" id="bottomBtn" v-show="isShowBottomBtn && activityStatus == 1">
			<view class="instructions" v-if="isApply == 1">
				<!-- 已经邀请的人 -->
				<view class="invitered">
					<view class="invitered_item" v-for="(item, index) in inviteredList" @click="!!!item.userId && shareChoise()" :key="index">
						<image class="invitered__avatar" :src="item.avatarUrl"></image>
					</view>
				</view>
				<view class="invitered_count">已有{{ inviteCount }}位好友报名</view>
			</view>
			<view class="bottom_sigin_text" v-else> 报名后才可以参与哦~ </view>
			<view class="btn bottom" @click="isComplete ? '' : isApply == 1 ? shareChoise() : formShow()">{{
				isComplete ? "邀请达标,请等待活动抽奖" : isApply == 1 ? "邀请好友报名" : "报名活动"
			}}</view>
		</view>
		<uni-popup ref="popup" type="bottom">
			<view class="shareBtnBackV">
				<view class="shareBtnV">
					<view class="shareBtn" @tap="shareHB()">
						<image src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/changansharePY.png"> </image>
						<view class="text">海报分享</view>
					</view>
					<button class="shareBtn" open-type="share">
						<image src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/changanshareFD.png"> </image>
						<view class="text1">分享微信好友</view>
					</button>
				</view>
				<view class="line"></view>
				<button @tap="shareCancle()">取消</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import login from "@/units/login"
import api from "@/public/api/index"
import shouquan from "@/units/shouquan"
import formpop from "@/components/formpop/formpop"
import pageTop from "@/components/pageTop/pageTop"
// import shareSuccess from '@/components/shareSuccess/shareSuccess'
import userBand from "@/components/userBand/userBand"
let app = getApp()
// const ctx = uni.createCanvasContext('myCanvas')
export default {
	components: {
		"form-pop": formpop,
		"page-top": pageTop,
		userBand: userBand,
		// 'share-pop': shareSuccess
	},
	data() {
		return {
			phone: false,
			artDownDate: [],
			activityId: "",
			content: "",
			soureDone: false,
			actiDone: false,
			activityType: "",
			isActEnded: false,
			isActStart: false,
			shareURL: "",
			isApply: 0, //是否留咨过
			lotteryType: "", //转盘类型
			actSelect: "", // 玩法（0   线下   1 线上抽奖  2 both）
			formShowTitle: "我要参与抽奖",

			nums: 0, // 需要邀请 几人
			sourceUserId: "", // 邀请人id
			sourceUserAvatar: "", // 邀请人头像src
			sourceUserName: "", // 邀请人名字
			inviteRecordList: [], //
			inviteredList: [], // 已经被邀请人的信息
			isShowBottomBtn: false, // 是否展示底部按钮
			paddingBottm: 0, // 根据底部按钮高度不一样
			default_avatar: require("../static/images/default_avatar.png"),
			inviteCount: 0, // 已经被邀请人的个数
			isComplete: false, //是否已经邀请满人
			activityStatus: 0, // 活动状态: 0 即将开始,1 进行中,2 已结束,3 已下架
			headBg: "", // 顶部头图
			ruleImg: "", //底部规则图
			activityTimeRang: "", // 活动时间区间
		}
	},
	mixins: [shouquan],
	async onLoad(options) {
		await login.checkLogin(api)
		this.lotteryType = options.lotteryType
		this.sourceUserId = options.sourceUserId || ""
		this.activityId = options.id || ""
		this.activityType = options.type || ""
		this.actSelect = options.actSelect || ""
		this.nums = options.nums || 0

		// 分享用
		let cs = ""
		for (let i in options) {
			if (i != "scene" && i != "sourceUserId") {
				cs += `${i}=${options[i]}&`
			}
		}
		this.cs = cs.substr(0, cs.length - 1)
		let wxUserInfo = uni.getStorageSync("wxUserInfo")
		if (wxUserInfo) {
			this.shareURL = `/pages/cqMarathon?${this.cs}&sourceUserId=${wxUserInfo.id}`
		}
		if (app.Interval) {
			clearInterval(app.Interval)
		}

		try {
			uni.showLoading({
				title: "正在加载...",
			})
			this.activityId && this.getFission()
			let { data = {} } = await api.getActivityContent(this.activityId)
			!data && (data = {})
			if (!!data && data.status == 0) {
				this.activityTimeRang = this.formatTime(data.startTime, data.endTime)
			}

			this.activityStatus = data.status
			if (options.sourceUserId) {
				this.queryingUserInfor()
			}
			this.getInviteredInfo()
			this.headBg = data.picUrl
			this.ruleImg = data.detailPic
			this.phone = uni.getStorageSync("userPhone")
			this.content = data || {}
			if (this.sourceUserId) {
				this.content.sourceUserId = this.sourceUserId
			}
			if (this.shareURL) {
				this.content.shareURL = this.shareURL
			}
			if (this.content && this.content.miniUrl && this.content.miniUrl.indexOf("dDis=1") != -1 && !this.sourceUserId) {
				// dDis=1 且不是裂变进来的（sourceUserId为空） 就不随机经销商
				this.content.noDistanceDeal = true
			}
			if (this.content && this.content.miniUrl && this.content.miniUrl.indexOf("dSer=1") != -1) {
				this.content.noSer = true
			}
		} catch (err) {
			console.error(err)
		} finally {
			setTimeout(() => {
				uni.createSelectorQuery()
					.in(this)
					.select("#middleWrap")
					.boundingClientRect((data) => {
						data && (this.scrollTop = data.height + data.top)
					})
					.exec()
			}, 500)
			this.soureDone = true
			uni.hideLoading()
		}
		// 访问活动 记录活动访问次数
		api.fetchActivityVisit({
			activityId: this.activityId,
		})
	},
	onPageScroll(e) {
		let scrollTop = e.scrollTop
		if (scrollTop >= this.scrollTop) {
			this.isShowBottomBtn = true
			uni.createSelectorQuery()
				.in(this)
				.select("#bottomBtn")
				.boundingClientRect((data) => {
					data && (this.paddingBottm = data.height * 2)
				})
				.exec()
		} else {
			this.isShowBottomBtn = false
		}
	},
	onHide() {
		if (app.Interval) {
			clearInterval(app.Interval)
		}
	},
	onShareAppMessage() {
		let title = this.content.name
		let imageUrl = this.content.sharePic || this.content.detailPic
		return {
			title: title,
			path: this.shareURL,
			imageUrl: imageUrl,
		}
	},
	methods: {
		/**
		 * @param {String} sTime
		 * @param {String} eTime
		 * @returns {String}
		 */
		formatTime(sTime, eTime) {
			let str
			let tempS
			let tempE
			let reg = /(\d{4})\-(\d{2})\-(\d{2})/g
			tempS = sTime.substring(0, 10).replace(reg, "$1年$2月$3日")
			tempE = eTime.substring(0, 10).replace(reg, "$1年$2月$3日")
			str = tempS + "-" + tempE
			return str
		},

		// 判断用户是否留资过
		async getFission() {
			try {
				const { code, data } = await api.getClueInfo({ activityId: this.activityId })
				if (code == 1 && data) {
					this.isApply = data.isApply
				}
			} catch (error) {
				console.error(error)
			}
		},
		// 如果是分享链接,获取分享人的信息
		async queryingUserInfor() {
			let type

			// #ifdef MP-WEIXIN
			type = 1
			// #endif

			// #ifdef MP-TOUTIAO
			type = 2
			// #endif

			// #ifdef MP-ALIPAY
			type = 3
			// #endif
			try {
				const { code, data } = await api.queryingUserInfor({
					id: this.sourceUserId,
					type,
				})
				if (code == 1 && data) {
					if (data.nickName.length > 6) {
						this.sourceUserName = data.nickName.substring(0, 6) + "..."
					} else {
						this.sourceUserName = data.nickName
					}
					this.sourceUserAvatar = data.avatarUrl
				}
			} catch (error) {
				console.error(error)
			} finally {
			}
		},

		// 获取已经被邀请人的信息
		async getInviteredInfo() {
			try {
				//邀请记录list
				let tempArr = []
				let emptyObj = { avatarUrl: this.default_avatar }
				let nums = this.nums
				const res = await api.getInviteRecordList({
					pageNo: 1,
					pageSize: nums,
					activityId: this.activityId,
				})
				let row = res.rows || []
				this.inviteRecordCount = res.total || 0
				for (let index = 0; index < nums; index++) {
					tempArr.push(emptyObj)
				}
				if (row.length) {
					// 有邀请的人 && 替换默认的图
					tempArr.splice(0, row.length, ...row)
				}
				if (row.length == nums) {
					this.isComplete = true
				}
				this.inviteCount = row.length
				this.inviteredList = tempArr
			} catch (error) {
				console.error(error)
			} finally {
			}
		},

		// 分享好友选择
		shareChoise() {
			this.$refs.popup.open("bottom")
		},

		// 分享好友关闭
		shareCancle() {
			this.$refs.popup.close()
		},

		// 分享到海报
		shareHB() {
			let url = "/pages/sharePost?scene1=" + encodeURIComponent(this.shareURL) + "&shareUrl=" + encodeURIComponent(this.content.sharePosterPic)
			uni.navigateTo({
				url: url,
			})
			this.$refs.popup.close()
		},

		// 表单留资
		formShow() {
			// #ifdef MP-WEIXIN
			wx.aldstat.sendEvent("报名活动")
			// #endif
			this.$refs.formpop.formShow("form", "marathon", this.content, "报名活动")
		},
		// 分享按钮被点击
		shareBtnClick() {
			wx.aldstat.sendEvent("活动分享点击")
		},

		subSuccess() {
			this.isApply = 1
			this.sourceUserId = ""
			this.activityId && this.getFission()
			this.$toast("报名成功,快去参与活动吧~", "none", 2000)
		},
		getData() {
			// 访问活动 记录活动访问次数
			api.fetchActivityVisit({
				activityId: this.activityId,
			})

			let wxUserInfo = uni.getStorageSync("wxUserInfo")

			this.phone = wxUserInfo.mobile
			if (wxUserInfo) {
				if (this.lotteryType == "Vouchers") {
					this.formShowTitle = "领取代金券"
					this.shareURL = `/pages/lbActivity?${this.cs}`
				} else {
					this.shareURL = `/pages/lbActivity?${this.cs}&sourceUserId=${wxUserInfo.id}`
				}
			}
		},
		changURl(url) {
			//D=69&L=G&P=W&A=1&O=66
			if (url.indexOf("D") != -1) {
				// 新
				url = url.replace("P", "type")
				url = url.replace("L", "lotteryType")
				url = url.replace("D", "id")
				url = url.replace("G", "grid")
				url = url.replace("W", "wawaji")
				url = url.replace("A", "actSelect")
				url = url.replace("O", "sourceUserId")
				url = url.replace("V", "Vouchers")
			} else {
				// 旧
				//dd=69&ll=gg&tt=ww&aa=1&ss=66
				url = url.replace("tt", "type")
				url = url.replace("ll", "lotteryType")
				url = url.replace("dd", "id")
				url = url.replace("gg", "grid")
				url = url.replace("ww", "wawaji")
				url = url.replace("aa", "actSelect")
				url = url.replace("ss", "sourceUserId")
			}
			return url
		},
	},
}
</script>

<style lang="less">
@import "@/static/less/public.less";
.cq_marathon {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 0;
}
.inviteInfo {
	width: 100%;
	padding: 0 30rpx;
	background-color: #fff;
	padding: 55rpx 0 59rpx 0;
	box-sizing: border-box;
	text-align: center;
	&.be_invite {
		background-color: #f5f5f5;
	}
	.invite_avatar {
		margin-top: 16rpx;
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
	}
	.be_invite_bg {
		width: 690rpx;
		height: 395rpx;
		margin: 0 auto;
		padding: 0 44rpx;
		background-image: url(https://www1.pcauto.com.cn/images/changan/cq/20201012/invitation_wrap.png);
		background-size: 100%;
		box-sizing: border-box;
	}
	.source_user_name {
		color: #00c0ff;
	}
	.instructions {
		width: 100%;
		text-align: center;
		color: #7f7f7f;
		.invitered {
			display: flex;
			justify-content: flex-start;
			flex-wrap: wrap;
			width: 100%;
		}
		.invitered_item {
		}
		.invitered_count {
			// margin-top: 40rpx;
		}
		.invitered__avatar {
			overflow: hidden;
			width: 100rpx;
			height: 100rpx;
			margin: 0 0 30rpx 31rpx;
			background-color: #fff;
			border-radius: 50%;
			border: #f8884d 2rpx solid;
			box-sizing: border-box;
		}
		&.invite_name_wrap {
			margin-top: 30rpx;
		}
	}
	.btn {
		width: calc(100% - 40rpx);
		height: 92rpx;
		margin: 0 auto;
		margin-top: 29rpx;
		font-size: 40rpx;
		font-weight: bold;
		color: #fff;
		line-height: 92rpx;
		border-radius: 90rpx;
		text-align: center;
		background-color: #f8884d;
		&.bottom,
		&.onApply {
			background-color: #ee2758;
			margin-top: 20rpx;
		}
		&.sign_up {
			background-color: #ee2758;
			margin-top: 30rpx;
		}
		&.finish {
			background-color: #9a9a9a;
		}
	}
}
.bottom_btn {
	position: fixed;
	left: 0;
	bottom: 0;
	padding: 28rpx 30rpx 55rpx 30rpx;
	background-color: #fff;
	box-sizing: border-box;
	.bottom_sigin_text {
		color: #7f7f7f;
	}
}
.content-image {
	width: 100%;
	vertical-align: middle;
}
.shareBtnBackV {
	border-top-left-radius: 10rpx;
	border-top-right-radius: 10rpx;
	width: 100%;
	height: 331rpx;
	background: #ffffff;

	.shareBtnV {
		width: 90%;
		margin: auto;
		display: flex;

		.shareBtn {
			text-align: center;
			width: 50%;
			height: 230rpx;
			margin: auto;
		}

		image {
			width: 88rpx;
			height: 88rpx;
			margin-top: 50rpx;
		}

		.text {
			width: 100%;
			height: 23rpx;
			text-align: center;
			margin-top: 20rpx;
			font-size: 24rpx;
			color: #666666;
		}

		.text1 {
			width: 100%;
			height: 23rpx;
			text-align: center;
			margin-top: -20rpx;
			font-size: 24rpx;
			color: #666666;
		}
	}

	.line {
		background: #ebebeb;
		height: 1rpx;
		width: 100%;
		// margin-top: ;
	}

	button {
		width: 100%;
		color: #333333;
		background: #ffffff;
		font-size: 33rpx;
		margin: auto;
		margin-top: 10rpx;
	}
}
.zw {
	height: 104rpx;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
}
</style>
