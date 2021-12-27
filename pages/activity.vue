<template>
	<view>
		<userBand @loginSuccess='loginSuccess'></userBand>
		<view class="activity">
			<button v-if="!haveUserInfoAuth" class="getUserInfo_name_info_mask_body" @tap="getWxUserInfoAuth"
				style="top: 128rpx;"></button>
			<share-pop ref="shareSuccess"></share-pop>
			<page-top :background="'#fff'" :titleys="'#000'" :btnys="''" :title="'活动详情'"></page-top>
			<form-pop ref="formpop" @subSuccess='subSuccess()'></form-pop>
			<view class="title">{{content.name}}</view>
			<view class="date" v-if="content && isActStart && !isActEnded">
				离活动结束还剩<view class="db">{{artDownDate[0]}}</view>天<view class="db">{{artDownDate[1]}}</view>时<view
					class="db">{{artDownDate[2]}}</view>分
				<!-- <view class="db">{{artDownDate[3]}}</view>秒 -->
			</view>
			<view class="date" v-if="isActEnded">活动已结束</view>

			<view class="content">
				<image class="content-image"
				:src="content.detailPic"
				mode="widthFix"
				lazy-load="false"
				style="height:auto"
				@click="imgClick"></image>
			</view>
			<view class="serial-list" v-if="content.showCustomAds == 0">
				<view class="serial-item" v-for="(serialGroupItem, index) in content.serialGroupList" :key="index"
					@tap="seeCarBtnClick(serialGroupItem)">
					<view class="name">{{serialGroupItem.name}}</view>
					<button class="see-car-btn">3D看车 ></button>
					<image class="cover" :src="serialGroupItem.picCoverUrl" mode="aspectFill" lazy-load="true"></image>
				</view>
			</view>
			<!-- customAdList -->
			<view v-if="content.showCustomAds == 1" v-for="(item,index) in content.customAdList" @tap="tapAcivity(item)" :key="index">
				<image style="width: 686rpx;height:270rpx ;margin-left: 32rpx;border-radius: 14rpx;margin-top: 10rpx;"
					:src="item.picUrl" mode="aspectFill" lazy-load="true"></image>
			</view>


			
			<!-- 拼团中 -->
			<template  v-if="groupStatus==0 && isActStart && !isActEnded" >
				<view class="zw2"></view>
				<view class="group-purchase">
					<template v-if="!isBeInvited">
						<view class="group-text">还差<text class="nums">{{payRemains}}</text>名好友支付即可拼团成功</view>
						<view class="group-list">
							<view class="group-members" v-for="(item,index) in groupAllUserInfoList" :key="index">
								<image :src="item.avatarUrl"></image>
								<view class="condition" v-if="item.orderStatus==0">待支付</view>
							</view>
							<button class="add-members" v-for="(item,index) in remainGroups"  :key="index" hover-class="none" open-type="share" @click="shareBtnClick"></button>
						</view>
						
					</template>
					<template v-else>
						<view class="inviter-info">
							<image class="invite-avatar" :src="sourceUserInfo.avatarUrl" mode="widthFix"></image>
							<view class="inviter-text">
								<view class="inviter-name"><text class="name">{{ sourceUserInfo.nickName }}</text>邀请你参与拼团</view>
								<view class="group-nums">仅剩<text class="nums">{{remainGroups}}</text>个名额</view>
							</view>
						</view>
					</template>
					<view class="group-btn">
						<view class="count-time">
							倒计时：
							<view class="db">{{groupDownDate[1]}}</view>时
							<view class="db">{{groupDownDate[2]}}</view>分
							<view class="db">{{groupDownDate[3]}}</view>秒
						</view>
						<template v-if="!isBeInvited">
							<view class="share-btn" v-if="!isPay" @tap="purchase">去支付</view>
							<template v-else>
								<!--  #ifdef MP-WEIXIN  -->
								<button v-if="content.sharePosterPic"
									:class="'share-btn ' + (content.shareStatus == 0 ? 'share-tip':'')" hover-class="none"
									@tap='shareChoise()'>分享好友</button>

								<button v-else :class="'share-btn ' + (content.shareStatus == 0 ? 'share-tip':'')"
									hover-class="none" open-type="share" @click="shareBtnClick">分享好友</button>
								<!-- #endif -->
								<!--  #ifndef MP-WEIXIN  -->
								<button :class="'share-btn ' + (content.shareStatus == 0 ? 'share-tip':'')"
									hover-class="none" open-type="share" @click="shareBtnClick">分享好友</button>
								<!-- #endif -->
							</template>
						</template>
						<template v-else>
							<view class="share-btn" @tap="purchase">参与拼团</view>
						</template>
					</view>
				</view>
			</template>
			<template v-else>
				<view class="zw"></view>
				<view class="operation-list">
					<view class="type-c"
						v-if="(artDownDate[0] <= 0 && artDownDate[1] <= 0 && artDownDate[2] <= 0) || isActEnded ">
						<button v-if="!buyOrder" class="over-btn" hover-class="none">活动已结束</button>
						<button v-else
							:class="haveBuy?'over-btn1':'over-btn'"
							style="width::'686rpx;border-radius: 44rpx;"
							@tap="formShow">{{haveBuy?'查看订单':'活动已结束'}}</button>
					</view>
					<view class="type-a" v-else-if="content.needApply == 1">
						<!-- <button :class="'share-btn ' + (content.shareStatus == 0 ? 'share-tip':'')" hover-class="none"
							open-type="share" @click="shareBtnClick" v-if="canShare">分享好友</button> -->
						<!--  #ifdef MP-WEIXIN  -->
						<button v-if="content.sharePosterPic"
							:class="'share-btn ' + (content.shareStatus == 0 ? 'share-tip':'')" hover-class="none"
							@tap='shareChoise()'>分享好友</button>

						<button v-else :class="'share-btn ' + (content.shareStatus == 0 ? 'share-tip':'')"
							hover-class="none" open-type="share" @click="shareBtnClick">分享好友</button>
						<!-- #endif -->
						<!--  #ifndef MP-WEIXIN  -->
						<button :class="'share-btn ' + (content.shareStatus == 0 ? 'share-tip':'')"
							hover-class="none" open-type="share" @click="shareBtnClick">分享好友</button>
						<!-- #endif -->
						<template v-if="!isActStart ">
							<button v-if="isApply && !buyOrder" :class="'enroll-btn enroll-btn3'"
								:style="{width:canShare?'420rpx':'686rpx'}">已报名，活动未开始</button>
							<!-- 下订活动活动未开始不允许点击 -->
							<button v-if="buyOrder || isGroupPurchase" :class="'enroll-btn enroll-btn3'"
								:style="{width:canShare?'420rpx':'686rpx'}">活动未开始</button>
						</template>

						<template v-else>
							<!-- 拼团活动  20211227 未参加拼团和拼团成功-->
							<template v-if="isGroupPurchase">
								<view :class="['enroll-btn purchase-btn',{gray:!groupBtnObj.canOperate}]" @tap="purchase">
									{{groupBtnObj.text}}
									<view class="success-icon" v-if="groupStatus==2"></view>
									<view class="remain" v-else-if="isPay && groupBtnObj.canOperate">剩余<text class="nums">{{groupRemains}}</text>个名额</view>
								</view>
							</template>

							<!-- 其他活动 -->
							<template v-else>
								<button v-if="buyOrder && !haveBuy && (!content.products[0] || content.products[0].stock == 0)" 
								:class=" (isApply && activityType != 'wawaji' && voucherShow)?'enroll-btn4':'enroll-btn enroll-btn3'">
									已被抢完啦
								</button>
								<template v-else>
									<button
										:class=" (isApply && activityType != 'wawaji' && voucherShow)?'enroll-btn4':'enroll-btn'"
										open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" v-if="!phone"
										:style="{width:canShare?'420rpx':'686rpx'}">{{buyOrder?'报名购买':'报名活动'}}</button>
									<button
										:class=" (isApply && activityType != 'wawaji' && voucherShow)?'enroll-btn4':'enroll-btn'"
										:style="{width:canShare?'420rpx':'686rpx'}" @tap="formShow"
										v-else>{{buyOrder?(haveBuy?'查看订单':'报名购买'):fromShowBtnTitle}}</button>
								</template>
							</template>
						</template>

					</view>
					<view class="type-b" v-else-if="content.needApply == 0">
						<button :class="'share-btn ' + (content.shareStatus == 0 ? 'share-tip':'')" hover-class="none"
							open-type="share" @click="shareBtnClick">分享好友</button>
					</view>
				</view>
			</template>
		</view>

		<view class="myred" @tap='tapmyred()' v-if="red.redDone"></view>
		<uni-popup ref="redpopup" type="center" :mask-click="false">
			<view v-if="!red.redDone" class="redOpenV">
				<view @tap='redOpen()' class="redOpenVBtn"></view>
				<!-- <image  src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/redBack.png" mode="aspectFit"></image> -->
			</view>

			<view v-if="red.redDone" class='redShow'>
				<view>
					<view class="title">{{red.amount>0?'恭喜获得':'谢谢参与'}}</view>
					<view class="middelTitle" v-if="red.amount>0">
						<view class="amount">{{red.amount}}</view>
						元
					</view>
					<view class="middelTitle1" v-else>
						<view class="amount">祝好运常伴</view>
					</view>
					<view class="miaos">{{red.amount>0?'红包约6小时后到账':''}}</view>
					<button class="shareV" hover-class="none" open-type="share" @click="shareBtnClick"></button>
				</view>
			</view>

			<view class="closeBtn" @tap='closePop()'></view>
		</uni-popup>
		
		<uni-popup v-if="activityId == 138" ref="roleImgPopup" :mask-click="false">
			<view class="rolePopup">
				<swiper class="s-container"
						:current="rolesPopupSwiperCurrent"
						:duration="rolesSwiperDuration"
						@change="e => this.rolesPopupSwiperCurrent = e.detail.current">
					<swiper-item class="swiper-item" v-for="(item, index) in rolePopupSwiperList" :key="item">
						<image class="item-img" :src="(rolesPopupSwiperCurrent <= index + 1 && rolesPopupSwiperCurrent >= index - 1) ? ('https://www1.pcauto.com.cn/images/roleImages/' + item + '.jpg') : ''"></image>
					</swiper-item>
				</swiper>
				<view class="number">{{rolesPopupSwiperCurrent + 1}}/{{rolePopupSwiperList.length}}</view>
				<view class="swiper-control-btn">
					<view :class="['left', rolesPopupSwiperCurrent != 0 ? 'show' : '']"
						@click="rolesPopupSwiperCurrent--"></view>
					<view :class="['right', rolesPopupSwiperCurrent != (rolePopupSwiperList.length - 1) ? 'show' : '']"
						@click="rolesPopupSwiperCurrent++"></view>
				</view>
				<view class="role-Popup-closeBtn" @click="closeRolesSwiperPopup"></view>
			</view>
		</uni-popup>

		<uni-popup ref="groupPupup" :mask-click="false" >
			<view class="groupPupup">
				<view class="no-group-icon"></view>
				<view class="no-group-txt">很遗憾，没有参团名额了 可以找其它团或开团试试哦~</view>
				<view class="no-group-btn" @click="closeGroupPopup">好的</view>
			</view>
		</uni-popup>

		<!-- 底部按钮区域E -->
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
	import login from '@/units/login'
	import api from '@/public/api/index'
	import shouquan from '@/units/shouquan'
	import userBand from '@/components/userBand/userBand'
	import formpop from '@/components/formpop/formpop'
	import pageTop from '@/components/pageTop/pageTop'
	import shareSuccess from '@/components/shareSuccess/shareSuccess'
	import groupPurchasing from '@/components/groupPurchasing/groupPurchasing'
	let app = getApp()
	const ctx = uni.createCanvasContext('myCanvas')
	export default {
		components: {
			'form-pop': formpop,
			'page-top': pageTop,
			'share-pop': shareSuccess,
			'userBand': userBand,
			'group-Purchase':groupPurchasing
		},
		data() {
			return {
				phone: false,
				artDownDate: [],
				activityId: '',
				content: "",
				isActEnded: false,
				isActStart: false,
				activityType: "",
				isApply: 0, //是否留咨过
				//直播间用的
				liveUrl: '',
				shareURL: '',
				red: {
					amount: 0,
					redDone: false
				},
				redOpening: false,
				fromShowBtnTitle: '报名活动',
				voucherShow: false,
				activitySceneId: '',
				canShare: true,
				buyOrder: false, //是否下订活动
				haveBuy: false, //已经购买过且有有效订单
				orderDetail: '', // 订单详情
				
				rolesSwiperDuration: 500,
				pxAndRpxRatio: 0.5, // 当前屏幕尺寸 px和rpx的比例
				rolesPopupSwiperCurrent: 0,
				rolePopupSwiperList: [], // 弹窗swiper imgList
				roleImgInfo: { // 小图的宽高
					width: 58,
					height: 114,
					verticalInterval: 7
				},
				activityStageInfoList: [{
					offsetTop: 866,
					offsetLeft: 165,
					width: 423,
					height: 114,
					roleList: [
						['0-0', '0-3', '1-3', '1-7', '2-0', '2-1']
					],
				}, {
					offsetTop: 1164,
					offsetLeft: 59,
					width: 634,
					height: 114,
					roleList: [
						['0-0', '0-3', '0-4', '0-6', '1-2', '1-3', '1-7', '2-0', '2-1']
					],
				}, {
					offsetTop: 1458,
					offsetLeft: 59,
					width: 634,
					height: 235,
					roleList: [
						['0-0', '0-1', '0-3', '0-2', '0-4', '0-6', '0-8', '1-2', '1-3'],
						['1-4', '1-5', '1-6', '1-7', '1-8', '2-0', '2-1', '2-2', '2-7'],
					],
				},{
					offsetTop: 1872,
					offsetLeft: 59,
					width: 634,
					height: 356,
					roleList: [
						['0-0', '0-1', '0-3', '0-2', '0-4', '0-5', '0-6', '0-7', '0-8'],
						['1-0', '1-1', '1-2', '1-3', '1-4', '1-5', '1-6', '1-7', '1-8'],
						['2-0', '2-1', '2-2', '2-3', '2-4', '2-5', '2-6', '2-7']
					],
				}],
				isGroupPurchase:false,
				groupStatus:-1, //当前团状态:0 拼团中，1团过期， 2拼团完成
				groupSize:0, //拼团人数
				groupRemains:"",//剩余团数
				groupAllUserInfoList:[], //团员信息
				remainGroups:"", //成团还差人数
				payRemains:0,//成团还差支付人数
				groupDownDate:[],
				isPay:true, 
				groupBtnObj:{
					canOperate:true,
					text:"拼团购买"
				},
				sourceUserId:0, //邀请人id
				groupId:0, //团id
				isBeInvited:false,//是否是被邀请的
				sourceUserInfo:{
					avatarUrl:"",
					nickName:""
				}
			}
		},
		mixins: [shouquan],
		async onLoad(options) {
			this.getPxAndRpxRatio()
			if (options.scene) {
				// 分享海报来的
				let url = decodeURIComponent(options.scene)
				url = this.changURl(url)
				//id=69&lotteryType=grid&type=wawaji&actSelect=1&sourceUserId=66
				let array = url.split("&")
				array.forEach((item, index) => {
					let arr = item.split("=")
					if (arr) {
						options[arr[0]] = arr[1]
					}
				})
			}
			if (options.tolbActivity) {
				uni.reLaunch({
					url: '/pages/lbActivity?id=' + options.id + '&sourceUserId=' + options.sourceUserId
				})
				return
			}
			//直播活动相关
			if (options.type && (options.type == 'Live' || options.type == 'verticalLive')) {
				if (options.type == 'Live') {
					this.liveUrl = '/pages_live/liveRoomPlay/liveRoomPlay?share=' + options.share + '&id=' + options
						.liveId

				} else if (options.type == 'verticalLive') {
					this.liveUrl = '/pages_live/verticalLiveRoom/verticalLiveRoom?type=verticalLive&share=' + options
						.share + '&id=' + options.liveId
				}

				console.log('liveurl == ', this.liveUrl)
			}
			if (options.canShare && options.canShare == 'no') {
				this.canShare = false
			}
			if (app.Interval) {
				clearInterval(app.Interval)
				console.log('----------------', this.Interval)
			}
			
			if (options.type) {
				this.activityType = options.type || ''
			}
			this.voucherShow = options.voucherShow
			this.activityId = options.id
			
			this.sourceUserId = options.sourceUserId;
			this.groupId = options.groupId
			console.log("options111111111",options)
			await login.checkLogin(api)
			await login.checkOauthMobile(api)

			//分享进入拼团活动
			let wxUserInfo = uni.getStorageSync('wxUserInfo')
			
			// 数据相关
			if(this.activityId && wxUserInfo && wxUserInfo.id){
				this.getData()
			}
			// 分享用
			let cs = ''
			for (let i in options) {
				if (i != 'ald_share_src' && i != 'groupId' && i != 'sourceUserId') {
					cs += `${i}=${options[i]}&`
				}
			}
			this.cs = cs.substr(0, cs.length - 1)
			this.shareURL = `/pages/activity?${this.cs}`
		},
	    onShow() {
			let wxUserInfo = uni.getStorageSync('wxUserInfo')
		    if(this.activityId && wxUserInfo && wxUserInfo.id){
			    this.getData()
		    }

	    },
		onHide() {
			if (app.Interval) {
				clearInterval(app.Interval)
			}
		},
		onShareAppMessage() {
			let title = this.content.name
			let path = this.shareURL
			let imageUrl = this.content.sharePic || this.content.detailPic
			console.log("this.shareURL",this.shareURL)
			return {
				title: title,
				path: path,
				imageUrl: imageUrl
			}
		},
		methods: {
			loginSuccess(){
				let wxUserInfo = uni.getStorageSync('wxUserInfo')
				if(this.activityId && wxUserInfo && wxUserInfo.id){
					this.getData()
				}
			},
			formShow() {
				if (this.isApply && this.activityType != 'wawaji' && this.voucherShow) {
					// 针对有抽奖凭证的 不能点击
					return
				}
				if (this.buyOrder) {
					// 下订活动单独处理
					if (this.haveBuy) {
						//已经购买且有有有效订单
						uni.navigateTo({
							url: `/pages/orderDetail?id=${this.orderDetail.orderId}`
						})
					} else {
						
						if(this.isActEnded){
							return
						}
						// #ifdef MP-WEIXIN
						// 未购买
						uni.navigateTo({
							url: `/pages/buyOrder?activityId=${this.content.id}`
						})
						// #endif
					// #ifndef MP-WEIXIN
					 this.$toast('请在微信搜索本小程序参与')
					// #endif
					}

					return
				}

				// #ifdef MP-WEIXIN
				wx.aldstat.sendEvent('报名活动')
				console.log("已经报名，且为抓娃娃机活动", this.isApply, this.activityType)
				//如果已经报名，且为抓娃娃机活动，则直接跳转活动页面
				if (this.isApply && this.activityType == "wawaji") {
					uni.navigateTo({
						url: `/pages/wawaji?activityId=${this.content.id}`
					})
				} else {
					this.$refs.formpop.formShow('form', 'activity', this.content, '报名活动')
				}

				// #endif

				// #ifdef MP-TOUTIAO
				console.log(12133123)
				if (this.isApply && this.activityType == "wawaji") {
					uni.navigateTo({
						url: `/pages/wawaji?activityId=${this.content.id}`
					})
				} else {
					this.$children[3].formShow('form', 'activity', this.content, '报名活动')
				}
				// #endif

			},
			//拼团购买
			purchase(){
				
				// 如果已成团或者未支付，则跳转支付页面
				if (this.groupStatus ==2 || !this.isPay) {
					//已经购买且有有有效订单
					uni.navigateTo({
						url: `/pages/orderDetail?id=${this.orderDetail.orderId}`
					})
				} else {
					if(this.isActEnded){
						return
					}
					//团过期或者拼团完成,或者无参团名额
					if(this.groupStatus !=0 && !this.groupBtnObj.canOperate){
						return;
					}	
					// #ifdef MP-WEIXIN
					// 未购买

					//如果是被邀请进来的
					if(this.isBeInvited){
						uni.navigateTo({
							url: `/pages/buyOrder?activityId=${this.content.id}&sourceUserId=${this.sourceUserId}&groupId=${this.groupId}`
						})
					}else{
						uni.navigateTo({
							url: `/pages/buyOrder?activityId=${this.content.id}`
						})
					}
					// #endif

					// #ifndef MP-WEIXIN
						this.$toast('请在微信搜索本小程序参与')
					// #endif
				}
				return
			},
			// 分享按钮被点击
			shareBtnClick() {
				// #ifdef MP-WEIXIN
				wx.aldstat.sendEvent('活动分享点击')
				// #endif			
				
			},
			shareChoise() {
				// #ifdef MP-WEIXIN
				this.content.sharePosterPic && this.$refs.popup.open("bottom")
				// #endif
			},
			// 分享好友关闭
			shareCancle() {
				this.$refs.popup.close()
			},
			shareHB() {
				let url = '/pages/sharePost?scene1=' + encodeURIComponent(this.shareURL) + '&shareUrl=' +
					encodeURIComponent(this.content.sharePosterPic)
				uni.navigateTo({
					url: url
				})
				this.$refs.popup.close()
			},
			changURl(url) {
				console.log(url)
				//D=69&L=G&P=W&A=1&O=66
				if (url.indexOf('D') != -1) { // 新
					url = url.replace('P', 'type')
					url = url.replace('L', 'lotteryType')
					url = url.replace('D', 'id')
					url = url.replace('G', 'grid')
					url = url.replace('W', 'wawaji')
					url = url.replace('A', 'actSelect')
					url = url.replace('O', 'sourceUserId')
					url = url.replace('V', 'Vouchers')
					url = url.replace('C', 'veriCode') //签到码
					url = url.replace('=S', '=checkIn')
					url = url.replace(/@/g, '=')
					url = url.replace(/_/g, '&')
					url = url.replace('K', 'packets')
					url = url.replace('GI', 'groupId')
				} else { // 旧
					//dd=69&ll=gg&tt=ww&aa=1&ss=66
					url = url.replace('tt', 'type')
					url = url.replace('ll', 'lotteryType')
					url = url.replace('dd', 'id')
					url = url.replace('gg', 'grid')
					url = url.replace('ww', 'wawaji')
					url = url.replace('aa', 'actSelect')
					url = url.replace('ss', 'sourceUserId')
				}
				return url


			},
			// 看车按钮被点击
			seeCarBtnClick(serialGroupItem) {
				// #ifdef MP-WEIXIN
				wx.aldstat.sendEvent('3D看车点击')
				// #endif
				const currentLocation = app.globalData.currentLocation
				let cityId = '1000000262'
				let cityName = '重庆市'
				if (currentLocation.selectedCityData && currentLocation.selectedCityData.cityId) {
					cityId = currentLocation.selectedCityData.cityId
					cityName = currentLocation.selectedCityData.city
				}
				uni.navigateTo({
					url: `/pages/vr360Frame/vr360Frame?sid=${serialGroupItem.pcSerialGroupId}&cityId=${cityId}&cityName=${cityName}`
				})
			},
			tapAcivity(item) {
				//0:跳转小程序内部页面,1:H5外链,2:外部小程序
				console.log('跳转', item)
				switch (item.redirectType) {
					case 0: {
						uni.navigateTo({
							url: item.miniUrl,
						})
						// #ifndef MP-WEIXIN
						if (item.miniUrl && item.miniUrl.substr(0, 3) == 'cxd') {
							this.$toast('请在微信搜索本小程序参与')
						}
						// #endif
					}
					case 1: {
						if (item.h5Link && item.h5Link.substring(0, 4) == "http") {
							uni.navigateTo({
								url: `/pages/webview?webURL=${encodeURIComponent(item.h5Link)}`,
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
							if (item.miniUrl && item.miniUrl.substr(0, 3) == 'cxd') {
								this.$toast('请在微信搜索本小程序参与')
							}
							// #endif
							return
						}
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
						break;
					}
				}
			},

			async getPhoneNumber(e) {
				console.log('eeeeee', e)
				let {
					detail = {}
				} = e
				if (detail.iv) {
					try {
						let {
							data
						} = await api.decryptPhone(detail.encryptedData, detail.iv)
						if (data && data.phoneNumber) {
							uni.setStorageSync('userPhone', data.phoneNumber)
							this.phone = data.phoneNumber
						}
					} catch (err) {
						this.$toast('手机号码授权失败', 'none', 1500);
						console.error(err)
					}
				}
				this.formShow()
			},
			downDate(endtime="",expireTime="") {
				let j =""
				if(endtime){
					let time = new Date().getTime()
					endtime = new Date(endtime.replace(/-/g, '/')).getTime()
					j = endtime - time
					if(j<=0){
						this.isActEnded = true;
					}
				}else{
					j=expireTime
				}
				if (j <= 0) {
					return;
				}
				let tt = 1000 * 60 * 60
				let days = parseInt(j / (tt * 24))
				let hours = parseInt((j % (tt * 24)) / (tt))
				let minutes = parseInt((j % (tt)) / (1000 * 60))
				let ss = Math.floor(j / 1000 % 60)
				if (days < 0) {
					days = 0
				}
				if (hours < 0) {
					hours = 0
				}
				if (minutes < 0) {
					minutes = 0
				}
				if (ss < 0) {
					ss = 0
				}
				let v = [this.add0(days), this.add0(hours), this.add0(minutes), this.add0(ss)]
				return v;
				// console.log('vvvvvvv==' + v)
				
			},
			// +0
			add0(number) {
				return number > 9 ? number : '0' + number
			},

			async getData() {
				if(!this.activityId) return;
				try {
					uni.showLoading({
						title: '正在加载...'
					})
					let {
						data = {}
					} = await api.getActivityContent(this.activityId)
					let clueInfo = await api.getClueInfo({
						activityId: this.activityId
					})
					if (clueInfo.code == 1) {
						this.isApply = clueInfo.data.isApply
						this.orderDetail = clueInfo.data.orderDetail
					}
					//0待支付 1已支付 2待使用 3退款审核中 4已核销 5已退款 6已失效
					if (clueInfo.code == 1 && clueInfo.data.orderDetail && clueInfo.data.orderDetail.orderId && 
						(clueInfo.data.orderDetail.orderStatus != 3 &&	clueInfo.data.orderDetail.orderStatus != 5 && 	clueInfo.data.orderDetail.orderStatus != 6) ) {
						this.haveBuy = true
					}
					// 拼团活动
					let groupBuyConfigDetail = data ? data.groupBuyConfigDetail :""
					//如果有拼团活动团信息详情
					if(data.activityType == 1 && groupBuyConfigDetail){
						this.isGroupPurchase = true
						this.groupRemains = groupBuyConfigDetail.surplusCount //剩余团数
						
						if(this.groupRemains <=0){
							this.groupBtnObj.canOperate =false;
							this.groupBtnObj.text = "已被抢完啦"
						}else if((!data.products[0] || data.products[0].stock == 0)){
							this.groupBtnObj.canOperate =false;
							this.groupBtnObj.text = "已被抢完啦"
						}else{
							this.groupBtnObj.canOperate =true;
							this.groupBtnObj.text = "拼团购买"
						}
						
						//留咨但是未支付
						if(this.orderDetail && this.orderDetail.orderId && this.orderDetail.orderStatus == 0){
							this.groupBtnObj.canOperate =true;
							this.groupBtnObj.text = "去支付"
							this.isPay = false
						}else{
							this.isPay = true
						}
						
						this.groupSize = groupBuyConfigDetail.groupSize
						
						let userGroupDetail = clueInfo.data.userGroupDetail
						let wxUserInfo = uni.getStorageSync('wxUserInfo')
						//有团信息和订单信息，则已经参团
						if(userGroupDetail && userGroupDetail.id && this.orderDetail && this.orderDetail.orderId){
							this.groupStatus =  userGroupDetail.groupStatus
							if(this.groupStatus == 2){
								this.groupBtnObj.canOperate =true;
								this.groupBtnObj.text = "查看订单"
							}
							let expireTime = userGroupDetail.expireTime
							if (this.groupStatus == 0) {
								this.groupDownDate = this.downDate("",expireTime)
								this.timer && clearInterval(this.timer)
								this.timer = setInterval(() => {
									expireTime = expireTime - 1000
									this.groupDownDate = this.downDate("",expireTime)
								}, 1000)
							}
							this.groupAllUserInfoList = userGroupDetail.groupAllUserInfoList;
							//剩余成团人数
							this.remainGroups =  this.groupSize - this.groupAllUserInfoList.length
							let payList = this.groupAllUserInfoList.length >0 ? this.groupAllUserInfoList.filter(item=>item.orderStatus==1) :[]
							this.payRemains = this.groupSize - payList.length
							if(this.isPay){
								this.shareURL = `/pages/activity?${this.cs}&sourceUserId=${wxUserInfo.id}&groupId=${userGroupDetail.id}`
							}
						}else if(this.orderDetail && this.orderDetail.orderId  && this.orderDetail.orderStatus == 0 && !userGroupDetail){ //有订单但是没有团信息（团长未支付）
							this.isBeInvited = false
						}else if(this.sourceUserId && this.groupId && wxUserInfo && wxUserInfo.id != this.sourceUserId ){
							this.isBeInvited = true
							//根据团id获取团信息
							this.getGroupInfo(this.groupId)

						}
					}
					if (this.isApply && this.activityType != 'wawaji' && this.voucherShow) {
						let str = ''
						if (app.globalData.wxUserInfo.openId) {
							str = app.globalData.wxUserInfo.openId.substring(app.globalData.wxUserInfo.openId.length -
								6)
						}

						this.fromShowBtnTitle = '抽奖凭证 CA' + this.activityId + str;
					}

					this.artDownDate = this.downDate(data.endTime)
					this.isActStart = ((new Date().getTime() - new Date(data.startTime.replace(/-/g, "/")).getTime()) >
						0)
					app.Interval = setInterval(() => {
						this.artDownDate = this.downDate(data.endTime)
					}, 1000)
					this.phone = uni.getStorageSync('userPhone');
					this.content = data
					if (this.liveUrl) {
						this.content.liveUrl = this.liveUrl
					}
					this.content.isActStart = this.isActStart


					if (data.redirectType == 1 && data.h5Link && data.h5Link.substring(0, 4) == "http") {
						uni.reLaunch({
							url: `/pages/webview?webURL=${encodeURIComponent(data.h5Link)}`,
						})
					}
					if (data.h5Link && data.h5Link == 'changan://lbcjactivity') {
						uni.reLaunch({
							url: '/pages/lbActivity?id=' + this.activityId
						})
					}
					// 下订活动专用
					if (data.miniUrl && data.miniUrl.indexOf('type=buyorder') != -1) {
						this.buyOrder = true
					}

					
					// 访问活动 记录活动访问次数
					api.fetchActivityVisit({
						'activityId': this.activityId
					})
				} catch (err) {
					console.error(err)
				} finally {
					uni.hideLoading()
				}


				// #ifdef MP-WEIXIN
				// 红包相关
				this.redStatus(this.activityId)
				// #endif
			},

			async redStatus() {
				let {
					data
				} = await api.redStatus({
					'activityId': this.activityId
				})
				this.activitySceneId = data.activitySceneId
				let status = data.status
				console.log('红包状态', status)
				if (status == 0) {
					//未开过
					this.$refs.redpopup.open('center')
				} else if (status == 1) {
					// 开过
					this.redRecord()
				} else if (status == 3) {
					// 无关联红包
				}

			},

			async redRecord() {
				let data = await api.redRecord({
					'activityId': this.activityId,
					'activitySceneId': this.activitySceneId
				})
				console.log('中奖记录', data)
				let rows = data.rows
				this.red.redDone = true
				if (rows.length > 0) {
					// 中奖过
					this.red.amount = rows[0].amount
				} else {
					// 为中奖
					this.red.amount = 0
				}


			},

			async redOpen() {
				// #ifdef MP-WEIXIN
				let openId = ''
				if (app.globalData.wxUserInfo && app.globalData.wxUserInfo.openId) {
					openId = app.globalData.wxUserInfo.openId
				}

				if (this.redOpening) {
					return
				}

				this.redOpening = true
				uni.showLoading({})
				try {
					let {
						data,
						code
					} = await api.openRed({
						'activityId': this.activityId,
						'openId': openId,
						'scene': '0',
						'activitySceneId': this.activitySceneId
					})
					uni.hideLoading()
					if (code == -1) {
						this.$toast('活动太火爆啦，请稍后再来')
					} else {
						this.red.redDone = true
						this.red.amount = data.amount
						console.log(data, data.amount)
					}
				} catch (err) {
					uni.hideLoading()
					this.$toast('活动太火爆啦，请稍后再来')
				}

				this.redOpening = false


				// #endif

				// #ifdef MP-TOUTIAO
				this.$toast('请在微信搜索本小程序参与活动')

				// #endif


			},


			closePop() {
				this.$refs.redpopup.close()
			},
			tapmyred() {
				this.$refs.redpopup.open('center')
			},
			subSuccess() {
				// 留资成功
				this.isApply = true
			},


			imgClick(e) {
				if ( this.activityId ==  138)
					this.roleActivityClickFunc({
						touchX: (e.detail.x - e.currentTarget.offsetLeft) / this.pxAndRpxRatio,
						touchY: (e.detail.y - e.currentTarget.offsetTop) / this.pxAndRpxRatio
					})
			},
			
			roleActivityClickFunc({ touchX, touchY }) {
				const roleImgInfo = this.roleImgInfo,
					activityStageInfoList = this.activityStageInfoList

				const activityStageInfo = activityStageInfoList.find(item => (item.offsetTop <= touchY) && (item.offsetTop + item.height >= touchY))
				
				if (!activityStageInfo) return

				const roleList = activityStageInfo.roleList,
					// 相对于图片列表区域左上角的坐标
					_left = touchX - activityStageInfo.offsetLeft,
					_top = touchY - activityStageInfo.offsetTop

				// 判断点击处是否在范围内
				if (_top > activityStageInfo.height || _left < 0 || _left > activityStageInfo.width) return

				const rowIndex = Math.floor((_top + roleImgInfo.verticalInterval) / (roleImgInfo.height + roleImgInfo.verticalInterval))	
				const colIndex = (function() {
					const aboutInterval = (activityStageInfo.width - roleList[rowIndex].length * roleImgInfo.width) / (roleList[rowIndex].length - 1)
					return Math.floor((_left + aboutInterval) / (aboutInterval + roleImgInfo.width))
				})()

				this.rolePopupSwiperList = roleList.reduce((prev, item) => {
					return [...prev, ...item]
				})
				
				this.openRolesSwiperPopup(rowIndex * 9 + colIndex)
			},

			// 获取当前屏幕，px和rpx的比例
			getPxAndRpxRatio() {
				wx.getSystemInfo({
					success: (res) => {
						this.pxAndRpxRatio = (res.windowWidth / 750).toFixed(2);
					}
				})
			},
			
			openRolesSwiperPopup(current = 0) {
				this.rolesPopupSwiperCurrent = current
				this.$refs['roleImgPopup'].open()
				this.rolesSwiperDuration = 500
			},
			
			closeRolesSwiperPopup() {
				this.$refs['roleImgPopup'].close()
				this.rolesSwiperDuration = 0
			},
			closeGroupPopup() {
				this.$refs['groupPupup'].close()
				this.groupStatus=-1
				this.isBeInvited=false;
				this.groupId=0;
				this.getData()

			},
			//获取团信息
			async getGroupInfo(id){
				let {code,data = {}} = await api.getGroupBuyInfo({id})
				if(code == 1 && data){
					this.groupStatus =  data.groupStatus
					this.groupAllUserInfoList = data.groupAllUserInfoList;
					let sourceUserInfo = this.groupAllUserInfoList.filter(item=>item.userId == this.sourceUserId)
					this.sourceUserInfo = sourceUserInfo[0]

					//剩余成团人数
					this.remainGroups =  this.groupSize - this.groupAllUserInfoList.length
					let payList = this.groupAllUserInfoList.length >0 ? this.groupAllUserInfoList.filter(item=>item.orderStatus==1) :[]
					this.payRemains = this.groupSize - payList.length
					if(this.remainGroups <= 0 || this.groupStatus!=0){
						this.$refs['groupPupup'].open()
					}else{
						if(this.isPay){
							this.shareURL = `/pages/activity?${this.cs}&sourceUserId=${wxUserInfo.id}&groupId=${data.id}`
						}
					}
					let expireTime = data.expireTime
					if(this.expireTime <= 0){
						this.$refs['groupPupup'].open()
					}
					if (this.groupStatus == 0) {
						this.groupDownDate = this.downDate("",expireTime)
						this.timer && clearInterval(this.timer)
						this.timer = setInterval(() => {
							expireTime = expireTime - 1000
							this.groupDownDate = this.downDate("",expireTime)
							if(this.groupDownDate[0] <=0 && this.groupDownDate[1] <=0 && this.groupDownDate[2]<=0 && this.groupDownDate[3]<=0){
								this.$refs['groupPupup'].open()
							}
						}, 1000)
					}
				}else{
					//团过期，暂无拼团名额
					this.$refs['groupPupup'].open()
					
				}
			},
		}
	}
</script>

<style lang="less">
	@import '@/static/less/public.less';


	.myred {
		position: fixed;
		bottom: 282rpx;
		right: 36rpx;
		width: 89rpx;
		height: 109rpx;
		z-index: 66;
		.setbg(89rpx, 109rpx, 'myRed.png');
	}

	.title {
		line-height: 65rpx;
		padding: 30rpx 32rpx;
		font-size: 48rpx;
		color: #333;
		font-weight: bold;
	}

	.date {
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		color: #999;
		padding: 0 32rpx 40rpx;

		.db {
			display: inline-block;
			vertical-align: top;
			background: #fa8845;
			height: 40rpx;
			padding: 0 12rpx;
			color: #fff;
			font-weight: bold;
			margin: 0 5rpx;
			border-radius: 4rpx;
		}
	}

	.content {
		font-size: 0;
	}

	.content-image {
		width: 750rpx;
	}

	.serial-list {
		margin: 40rpx 0;

		.serial-item {
			position: relative;
			margin: 0 auto 30rpx;
			width: 686rpx;
			height: 270rpx;
			background-color: #DFE1E2;
			border-radius: 20rpx;

			.name {
				position: absolute;
				left: 30rpx;
				top: 30rpx;
				font-size: 32rpx;
				font-weight: bold;
				color: #333333;
			}

			.see-car-btn {
				position: absolute;
				bottom: 30rpx;
				left: 35rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				width: 140rpx;
				height: 48rpx;
				font-size: 24rpx;
				color: #FFFFFF;
				border-radius: 24rpx;
				background-color: #333333;
			}



			.cover {
				position: absolute;
				right: 37rpx;
				bottom: 31rpx;
				width: 300rpx;
				height: 200rpx;
			}
		}
	}

	.fixys {
		height: 100rpx;
		font-size: 32rpx;
		height: 100rpx;
		line-height: 100rpx;
		color: #fff;
		vertical-align: top;
		display: inline-block;
	}

	.zw {
		height: 104rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.operation-list {
		position: fixed;
		z-index: 1;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 104rpx;
		font-size: 32rpx;
		font-weight: bold;
		background-color: #ffffff;
		padding-top: 20rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		.share-btn,
		.enroll-btn,
		.over-btn {
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.type-a {
			display: flex;
			justify-content: space-between;
			padding: 0 32rpx;
			box-sizing: border-box;

			.share-btn {
				width: 236rpx;
				height: 88rpx;
				color: #fa8845;
				border: 2rpx solid #fa8845;
				border-radius: 44rpx;
				box-sizing: border-box;
				background-color: #FFFFFF;
			}

			.enroll-btn4 {
				width: 420rpx;
				height: 88rpx;
				color: #fa8845;
				border: 2rpx solid #fa8845;
				border-radius: 44rpx;
				box-sizing: border-box;
				background-color: #FFFFFF;
				font-size: 27rpx;
				line-height: 88rpx;
			}

			.enroll-btn {
				width: 420rpx;
				height: 88rpx;
				color: #ffffff;
				background-color: #fa8845;
				border-radius: 44rpx;
			}

			.enroll-btn3 {
				background-color: #DEDEDE;
			}
		}

		.type-b {
			padding: 0 32rpx;
			box-sizing: border-box;

			.share-btn {
				width: 686rpx;
				height: 88rpx;
				color: #ffffff;
				background-color: #fa8845;
				border-radius: 44rpx;
			}
		}

		.type-c {
			padding: 0 32rpx;
			box-sizing: border-box;

			.over-btn {
				width: 686rpx;
				height: 88rpx;
				color: #ffffff;
				background-color: #cccccc;
				border-radius: 44rpx;
			}
			.over-btn1 {
				width: 686rpx;
				height: 88rpx;
				color: #ffffff;
				background-color: #FA8845;
				border-radius: 44rpx;
			}
		}
	}

	.redOpenV {
		position: relative;
		width: 560rpx;
		height: 760rpx;
		.setbg(560rpx, 760rpx, 'redBack.png');

		.redOpenVBtn {
			// background: #0062CC;
			position: absolute;
			top: 146rpx;
			left: 156rpx;
			width: 249rpx;
			height: 250rpx;
			.setbg(249rpx, 250rpx, 'redBackOpen.png');

		}
	}

	.redShow {
		width: 560rpx;
		height: 560rpx;
		.setbg(560rpx, 560rpx, 'redBC.png');
		text-align: center;

		.middelTitle {
			display: flex;
			margin-top: 53rpx;
			font-size: 32rpx;
			font-weight: 700;
			color: #f82e1c;
			// height: 77rpx;
			justify-content: center;
			align-items: flex-end;

			// background: #F0AD4E;
			.amount {
				// margin: auto;
				height: 62rpx;
				line-height: 62rpx;
				font-size: 78rpx;
				font-weight: 700;
				color: #f82e1c;

			}
		}

		.middelTitle1 {
			display: flex;
			margin-top: 53rpx;
			font-size: 32rpx;
			font-weight: 700;
			color: #f82e1c;
			// height: 77rpx;
			justify-content: center;
			align-items: flex-end;
			// background: #F0AD4E;

			.amount {
				// margin: auto;
				height: 62rpx;
				line-height: 62rpx;
				font-size: 64rpx;
				font-weight: 700;
				color: #f82e1c;
				margin-bottom: 63rpx;

			}
		}

		.title {
			font-size: 40rpx;
			height: 33rpx;
			font-weight: 700;
			color: #fa8845;
			margin-top: 65rpx;
		}

		.miaos {
			margin-top: 43rpx;
			font-size: 24rpx;
			font-weight: 700;
			color: #FA8845;

		}

		.shareV {
			margin: auto;
			margin-top: 129rpx;
			width: 420rpx;
			height: 100rpx;
			.setbg(420rpx, 100rpx, 'redBCShare.png');
		}

	}

	.closeBtn {
		margin: auto;
		margin-top: 60rpx;
		width: 64rpx;
		height: 64rpx;
		.setbg(64rpx, 64rpx, 'redClose.png');
	}
	
	.rolePopup{
		width: 500rpx;
		.s-container{
			height: 1000rpx;
			width: 100%;
			.swiper-item {
				height: 100%;
				box-sizing: border-box;
				position: relative;
			}
			.item-img {
				width: 100%;
				height: 100%;
				z-index: 5;
			}
		}
		.number {
			width: 108rpx;
			height: 40rpx;
			position: absolute;
			left: 50%;
			bottom: 0;
			transform: translate(-50%, 0);
			background-image: url('https://www1.pcauto.com.cn/images/role-swiper-num-bg.png');
			background-size: 100% 100%;
			text-align: center;
			line-height: 40rpx;
			font-size: 24rpx;
			color: #fff;
		}
		.swiper-control-btn {
			width: 100%;
			position: absolute;
			top: 50%;
			transform: translate(0, -50%);
			.left,.right {
				display: none;
				width: 48rpx;
				height: 48rpx;
				position: absolute;
				background-image: url('https://www1.pcauto.com.cn/images/role-swiper-control-btn.png');
				background-size: 100% 100%;
				&.show {
					display: inline-block;
				}
			}
			.left {
				left: -97rpx;
			}
			.right {
				right: -97rpx;
				transform: rotate(180deg);
			}
		}
		.role-Popup-closeBtn {
			height: 48rpx;
			width: 48rpx;
			position: absolute;
			bottom: -96rpx;
			left: 50%;
			transform: translate(-50%, 0);
			background-image: url('https://www1.pcauto.com.cn/images/role-swiper-close-btn.png');
			background-size: 100% 100%;
		}
	}

	// 拼团活动
	.operation-list{
		.type-a {
			.purchase-btn{
				flex-direction: column;
				font-size: 32rpx;
				position: relative;
				.remain{
					font-size: 20rpx;
					color: #ffd6be;
					margin-top: 5rpx;
					.nums{
						color: #FFFFFF;
					}
				}
				&.gray{
					background: #999999;
					color: #ffffff;
				}
				.success-icon{
					position: absolute;
					.setbg(104rpx,32rpx,'groupIn/success-icon.png');
					top: -8rpx;
					right:43rpx;
				}
			}
		}
	}
	.groupPupup{
		width: 560rpx;
		height: 586rpx;
		background: #ffffff;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		padding: 0 80rpx;
		box-sizing: border-box;
		font-size: 32rpx;
		color: #333333;
		line-height: 48rpx;
		.no-group-icon{
			.setbg(240rpx, 240rpx, 'groupIn/no-groups.png');
		}
		.no-group-txt{
			margin:20rpx auto 60rpx;
		}
		.no-group-btn{
			width: 360rpx;
			height: 88rpx;
			line-height: 88rpx;
			text-align: center;
			font-size: 32rpx;
			background: #fa8845;
			border-radius: 44rpx;
			color: #ffffff;
		}
	}
	.zw2{
		height: 360rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
	.group-purchase{
        position: fixed;
        z-index: 1;
        left: 0;
        bottom: 0;
        .setbg(750rpx,360rpx,'groupIn/group-bg.png');
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .group-list{
            display: flex;
            justify-content: center;
            margin:30rpx 0;
        }
        .group-members image{
            width: 92rpx;
            height: 92rpx;
            border-radius: 50%;
            border:4rpx solid #fa8845;
            
        }
        .group-members{
            margin:0 20rpx;
            .condition{
               font-size: 20rpx;
               color: #999999;
               margin-top: 12rpx;
               text-align: center;
            }
        }
		.inviter-info{
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: flex-start;
			width:100%;
			padding:0 32rpx;
			box-sizing: border-box;
			margin-bottom: 30rpx;
			.invite-avatar{
				width:100rpx;
				height: 100rpx;
				border-radius: 100%;
				margin-right: 25rpx;
			}
			.inviter-name{
				font-size: 32rpx;
				color: #333333;
				.name{
					font-weight: bold;
				}
			}
			.group-nums{
				font-size: 24rpx;
				color: #999999;
				margin-top: 23rpx;
				.nums{
					color: #FA8845
				}
			}
		}
        .add-members{
            .setbg(100rpx,100rpx,'groupIn/add.png');
            margin:0 20rpx;
        }
        .group-btn{
            display: flex;
            justify-content: space-between;
            flex-direction: row;
            width: 100%;
            padding:0 32rpx;
            box-sizing: border-box;
            .count-time{
                color: #999999;
                font-size: 24rpx;
                display: flex;
                align-items: center;
            }
            .db{
                width: 48rpx;
                height: 44rpx;
                background: #e64848;
                border-radius: 10rpx;
                text-align: center;
                font-size: 28rpx;
                line-height: 44rpx;
                color: #ffffff;
                margin:0 5rpx;
            }
            .share-btn{
                width: 312rpx;
                height: 88rpx;
                line-height: 88rpx;
                background: #fa8845;
                border-radius: 44rpx;
                font-size: 32rpx;
                text-align: center;
                color: #ffffff;

            }
        }
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
</style>
