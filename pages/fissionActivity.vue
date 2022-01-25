<template>
	<view class="page-container">
		<userBand :cancleShow='sourceUserId' @loginSuccess='getData'></userBand>
		<view class="activity" v-if="soureDone">
			<button v-if="!haveUserInfoAuth" class="getUserInfo_name_info_mask_body" @tap="getWxUserInfoAuth(callback,'activity')"
				style="top: 128rpx;"></button>
			<!-- <share-pop ref="shareSuccess"></share-pop> -->
			<page-top :background="'#fff'" :titleys="'#000'" :btnys="''" :title="'活动详情' " :noShowHouse="sourceUserId" @getTopNavHeigth="getTopNavHeigth">
			</page-top>
			<form-pop ref="formpop" @subSuccess='subSuccess()'></form-pop>

			<template v-if="activityType=='wawaji' || activityType=='checkIn'">
				<view class="title">{{content.name}}</view>
				<view class="date" v-if="content && isActStart && !isActEnded">
					离活动结束还剩<view class="db">{{artDownDate[0]}}</view>天<view class="db">{{artDownDate[1]}}</view>时<view
						class="db">{{artDownDate[2]}}</view>分
					<!-- <view class="db">{{artDownDate[3]}}</view>秒 -->
				</view>
				<view class="date" v-if="isActEnded">活动已结束</view>
			</template>

			<view class="content" v-if="!isJigsaw">
				<image class="content-image" :src="content.detailPic" mode="widthFix" lazy-load="false" @load="e => imgBindload()" style="height:auto"></image>
			</view>
			
			<!-- 拆红包活动 -->
			<open-red-packets-activity 
				ref="redPackets"
				:navHeight="navHeight" 
				:activityId="activityId" 
				:shareStatus="content.shareStatus"
				:isSharePosterPic="content.sharePosterPic ? true : false"
				v-if="activityType && activityType=='packets' && bgImgLoaded" >
				<template slot-scope="scope">
					<view class="package-detail-btn">
						<button class="enroll-btn enroll-btn2 enroll-btn-gray" v-if="!isActStart">活动未开始</button>
						<button class="enroll-btn enroll-btn2 enroll-btn-gray" v-else-if="isActEnded">活动已结束</button>
						<template v-else>
							<button class="enroll-btn enroll-btn2" open-type="getPhoneNumber"
								@getphonenumber="getPhoneNumber" v-if="!phone">报名拆红包</button>
							<template v-else>
								<button v-if="!isApply" class="enroll-btn enroll-btn2" @tap="formShow">报名拆红包</button>
								<button v-else-if="isApply && scope.chanceCount>0" class="enroll-btn enroll-btn2" @tap="openPackets">拆红包</button>
								<button v-else class="enroll-btn enroll-btn2 enroll-btn-gray">拆红包</button>
							</template>
							<view class="chance-count" v-if="isApply">还有{{scope.chanceCount||0}}次机会</view>
						</template>
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
					</view>
				</template>
			</open-red-packets-activity>
			<!-- 拼图活动 -->
			<jigsaw-activity
				ref="jigsaw"
				:activityId="activityId"
				v-if="isJigsaw"
			>	
			 <template v-slot="{chanceCount}">
				<view class="content">
					<image class="content-image" :src="content.detailPic" mode="widthFix" lazy-load="false" @load="e => imgBindload()" style="height:auto"></image>
					<view class="jigsaw-detail-btn">
						<button class="activity-btn-status" v-if="!isActStart">挑战未开始</button>
						<button class="activity-btn-status" v-else-if="isActEnded">挑战已结束</button>
						<template v-else>
							<button class="enroll-btn enroll-btn2" open-type="getPhoneNumber"
								@getphonenumber="getPhoneNumber" v-if="!phone">报名参与</button>
							<template v-else>
								<button v-if="!isApply" class="no-apply-btn" @tap="formShow">报名参与</button>
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
									<button :class="['challenge-btn',{'no-challenge-btn':!chanceCount}]" :maxCoun="maxCount" @tap="startGame()" >
										开始挑战
										<view class="chance-count">还有{{chanceCount||0}}次机会</view>
									</button>
								</template>
								
							</template>
							
						</template>
						
					</view>
				</view>
			 </template>
			</jigsaw-activity>
			<template  v-if="activityType && activityType!='packets' && !isJigsaw">
				<view class="zw"></view>
				<view class="operation-list">
					<view class="type-c" v-if="artDownDate[0] <= 0 && artDownDate[1] <= 0 && artDownDate[2] <= 0 ">
						<button class="over-btn" hover-class="none">活动已结束</button>
					</view>
					<view class="type-a" v-else>
						<template v-if="activityType && activityType=='wawaji' || activityType=='checkIn'">
							<template v-if="isApply && actSelect == 2 && isActStart ">
								<view class="enroll-btn actSelectOneBtn" @click="actSelect1()">
									<view class="selectTitle1">车展现场活动</view>
									<view class="selectTitle2">线下活动</view>
								</view>
								<view class="enroll-btn actSelectTwoBtn" @click="actSelect2()">
									<view class="selectTitle1">奇趣拆盲盒</view>
									<view class="selectTitle2">线上抽豪礼</view>
								</view>
							</template>
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
								
								<template v-if="!isActStart && isApply">
									<button class="enroll-btn enroll-btn2 enroll-btn3" >已报名，活动未开始</button>
								</template>
								<template v-else>
										<button class="enroll-btn enroll-btn2" open-type="getPhoneNumber"
											@getphonenumber="getPhoneNumber" v-if="!phone">报名活动</button>
										<template v-else>
											<!-- 如果是到店签到活动 -->
											<template v-if="activityType=='checkIn'">
												<!-- 如果未留咨，则取留咨 -->
												<button class="enroll-btn enroll-btn2"  @tap="formShow" v-if="!isApply">报名活动</button>
												<!-- 如果已经留咨但未签到 ，则取扫码签到 -->
												<button class="enroll-btn enroll-btn2 enroll-btn-gray" v-if="isApply && !ischeckIn">到店扫码签到后方可抽奖</button>
												<!-- 如果已经留咨且已签到 ，则去抽奖 -->
												<button class="enroll-btn enroll-btn2" @tap="formShow" v-if="isApply && ischeckIn">去抽奖</button>
											</template>	
											<button class="enroll-btn enroll-btn2" @tap="formShow"
											v-else>{{(actSelect == 1 && isApply)?"奇趣拆盲盒":"报名活动"}}</button>
										</template>
												
								</template>
							</template>
						</template>
						<button :class="(!isActStart && isApply)?'enroll-btn enroll-btn3': 'enroll-btn'" @tap="formShow" v-else>{{formShowTitle}}</button>
					</view>
				</view>
			</template>
		</view>

		<uni-popup ref="popup" type="bottom">
			<view class="shareBtnBackV">
				<view class="shareBtnV">
					<view class="shareBtn" @tap="shareHB()">
						<image src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/changansharePY.png">
						</image>
						<view class="text">海报分享</view>
					</view>
					<button class="shareBtn" open-type="share">
						<image src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/changanshareFD.png">
						</image>
						<view class="text1">分享微信好友</view>
					</button>
				</view>
				<view class="line"></view>
				<button @tap='shareCancle()'>取消</button>
			</view>

		</uni-popup>

		<view class="checkin-popup" v-if="isShowCheckInPop">
			<!-- 签到报名弹窗 -->
			<view class="checkin-sign-pop">
				<view class="p1">您还没有报名活动</br>请先报名后再重新扫码签到</view>
				<view class="show-form-btn" @tap="formShow">报名活动</view>
			</view>
		</view>
	</view>
</template>

<script>
	import login from '@/units/login'
	import api from '@/public/api/index'
	import shouquan from '@/units/shouquan'
	import formpop from '@/components/formpop/formpop'
	import pageTop from '@/components/pageTop/pageTop'
	import shareSuccess from '@/components/shareSuccess/shareSuccess'
	import userBand from '@/components/userBand/userBand'
	import openRedPacketsActivity from '@/components/openRedPacketsActivity/openRedPacketsActivity'
	import jigsawActivity from '@/components/jigsawActivity/jigsawActivity'
	let app = getApp()
	// const ctx = uni.createCanvasContext('myCanvas')
	export default {
		components: {
			'form-pop': formpop,
			'page-top': pageTop,
			'userBand': userBand,
			'open-red-packets-activity':openRedPacketsActivity,
			'jigsaw-activity':jigsawActivity
			// 'share-pop': shareSuccess
		},
		data() {
			return {
				phone: false,
				artDownDate: [],
				activityId: '',
				content: "",
				sourceUserId: '',
				soureDone: false,
				actiDone: false,
				activityType: "",
				isActEnded: false,
				isActStart: false,
				shareURL: '',
				isApply: 0, //是否留咨过
				ischeckIn:0, //是否签到
				lotteryType: '', //转盘类型
				actSelect: '' ,// 玩法（0   线下   1 线上抽奖  2 both）
				formShowTitle:'我要参与抽奖',
				isShowCheckInPop:false,  //签到二维码进入报名提示
				navHeight:0,
				bgImgLoaded:false,
				isJigsaw:false,//是否是拼团活动
			}
		},
		mixins: [shouquan],
		async onLoad(options) {
			// this.$EventBus.$on('shareChoiseFun',this.shareChoise)
			if (options.scene) { // 分享海报来的
				let url = options.scene.indexOf('%')>-1 ? decodeURIComponent(options.scene) : options.scene
				console.log('===============url1==============',url)
				url = this.changURl(url)
				console.log('===============url==============',url)
				//id=69&lotteryType=grid&type=wawaji&actSelect=1&sourceUserId=66
				let array = url.split('&')
				array.forEach((item, index) => {
					let arr = item.split('=') 
					if (arr) {
						options[arr[0]] = arr[1]
					}
				})


			}
			await login.checkLogin(api)
			await login.checkOauthMobile(api)
			this.lotteryType = options.lotteryType
			this.sourceUserId = options.sourceUserId
			this.activityId = options.id
			this.activityType = options.type || ''
			this.actSelect = options.actSelect || ''
			
			if (app.Interval) {
				clearInterval(app.Interval)
				console.log('----------------', app.Interval)
			}
			
			try {
				uni.showLoading({
					title: '正在加载...'
				})
				// await login.login()

				let {
					data = {}
				} = await api.getActivityContent(this.activityId)
				if(data.activityType == 2){
					this.activityType = data.activityType
					this.isJigsaw = true;
				}
				//从签到二维码进入
				if(options.scene && options.veriCode && data.miniUrl){
					let param = data.miniUrl.split('?')[1].split('&')
					param.forEach((item, index) => {
						let arr = item.split('=')
						if (arr) {
							options[arr[0]] = arr[1]
						}
						this.lotteryType = options.lotteryType
						this.sourceUserId = options.sourceUserId
						this.activityId = options.id
						this.activityType = options.type || ''
						this.actSelect = options.actSelect || ''
						this.veriCode = options.veriCode || ''
					})
				}

				// 分享用
				let cs = ''
				for (let i in options) {
					if (i != 'scene' && i != 'ald_share_src' && i != 'sourceUserId' && i!='veriCode') {
						cs += `${i}=${options[i]}&`
					}

				}
				this.cs = cs.substr(0, cs.length - 1)
				let wxUserInfo = uni.getStorageSync('wxUserInfo')
				if(wxUserInfo){
					if(this.lotteryType == 'Vouchers'){
						this.formShowTitle = '领取代金券'
						this.shareURL = `/pages/fissionActivity?${this.cs}`
					}else{
						this.shareURL = `/pages/fissionActivity?${this.cs}&sourceUserId=${wxUserInfo.id}`	
					}
				}
				console.log('shareurl', this.shareURL)

				this.downDate(data.endTime)
				this.isActStart = ((new Date().getTime() - new Date(data.startTime.replace(/-/g, "/")).getTime()) > 0)
				//是否留咨
				await this.getFission()
				//如果是到店签到活动，判断是否签到
				if(this.activityType == "checkIn"){
					await this.getCheckInStatus()
					//签到二维码扫码进入
					if(options.scene && options.veriCode){
						//已经报名未签到，则直接签到
						if(!this.ischeckIn && this.isApply){
							this.checkIn()
						}else if(!this.isApply){ //未报名
							this.isShowCheckInPop = true
						}
					}
				}
				app.Interval = setInterval(() => {
					this.downDate(data.endTime)
				}, 1000)
				this.phone = uni.getStorageSync('userPhone');
				this.content = data
				if (this.sourceUserId) {
					this.content.sourceUserId = this.sourceUserId
					console.log('sourceUserId' + this.sourceUserId)
					// this.$toast('sourceUserId' + this.sourceUserId  )
				}
				if (this.shareURL) {
					this.content.shareURL = this.shareURL
				}
				this.content.from = 'lbactivity'
				this.content.lotteryType = this.lotteryType
				this.content.actSelect = this.actSelect
				this.content.activityType = this.activityType
				this.content.isActStart = this.isActStart
				console.log("this.activityType",this.activityType)
				console.log("this.content",this.content)
				if(this.content && this.content.miniUrl && this.content.miniUrl.indexOf('dDis=1') != -1 && !this.sourceUserId){
					// dDis=1 且不是裂变进来的（sourceUserId为空） 就不随机经销商
					console.log('不定位经销商',this.content.miniUrl.indexOf('dDis=1' != -1))
					this.content.noDistanceDeal = true
				} 
				if(this.content && this.content.miniUrl && this.content.miniUrl.indexOf('dSer=1') != -1){
					console.log('不自动车车系')
					this.content.noSer = true
				} 
			} catch (err) {
				console.error(err)
			} finally {
				uni.hideLoading()
			}
			// 访问活动 记录活动访问次数
			api.fetchActivityVisit({
				'activityId': this.activityId
			})

		},
		onShow() {
			if(this.activityType=="packets"){
				this.$refs.redPackets.autoplay=true
			}else if(this.activityType==2){
				this.$refs.jigsaw.getActivityInfo();
				this.$refs.jigsaw.getUserRankInfo()
			}
		},
		onHide() {
			// this.$EventBus.$off('shareChoiseFun')
			if (app.Interval) {
				clearInterval(app.Interval)
			}
			if(this.activityType=="packets"){
				this.$refs.redPackets.autoplay=false;
				this.$refs.redPackets.isOpen=false;
			}
			
		},
		onShareAppMessage() {
			let title = this.content.name
			// let path = `pages/authorization?to=fissionActivity&id=${this.content.id}`
			// if (app.globalData.salesId) {
			// 	path += `&salesId=${app.globalData.salesId}`
			// }
			// api.shareActivity(this.content.id).then(res => {
			// 	console.log(res)
			// 	if (res.data > 0) {
			// 		this.content.shareStatus = 1
			// 	}
			// })
			let imageUrl = this.content.sharePic || this.content.detailPic
			console.log('分享 ', this.shareURL)
			return {
				title: title,
				path: this.shareURL,
				imageUrl: imageUrl
			}
		},
		methods: {
			imgBindload () {
				this.bgImgLoaded = true;
            },
			//获取顶部导航栏高度
			getTopNavHeigth(h){
				this.navHeight = h
			},
			//到店签到活动，判断是否签到
			async getCheckInStatus(){
				let checkInStatus = await api.checkInStatus({activityId: this.activityId})
				if (checkInStatus && checkInStatus.code==1 && checkInStatus.data) {
					this.ischeckIn = checkInStatus.data.status==1?true:false
				}
			},
			async getFission() {
				let clueInfo = await api.getClueInfo({
					activityId: this.activityId
				})
				if (clueInfo && clueInfo.data) {
					let isApply = clueInfo.data.isApply
					// for 本地测试
					this.isApply = isApply;
					if(isApply && !this.isActStart){
						this.formShowTitle = "已报名,活动未开始"
					}
					this.soureDone = true
				}

			},
			//扫码签到
			async scanCode(){
				let that=this;
				uni.scanCode({
				    success: function (res) {
						//调用签到接口
						if(res.result){
							that.checkIn(res.result)
						}	
					},
					fail:function(err){
						that.$toast(err)
					}
				});
			},
			//活动扫码签到
			async checkIn(){
				let {activityId , veriCode} = this
				let res = await api.checkIn({activityId,veriCode})
				if(res.code==1){
					//弹出签到成功弹窗
					this.getCheckInStatus();
					this.$refs.formpop.formShow('checkin-success-pop') 
				}else{
					this.$toast(res.msg)
				}
			},
			actSelect1() {
				uni.navigateTo({
					url: `/pages/wawaji?activityId=${this.content.id}`
				})
			},
			actSelect2() {
				uni.reLaunch({
					url: '/pages/lotteryPage?activityId=' + this.activityId + '&lotteryType=' + this
						.lotteryType + "&shareURL=" + encodeURIComponent(this.shareURL)
				})
			},

			formShow() {
				this.isShowCheckInPop = false;
				if(!this.isActStart && this.isApply){
					return
				}
				// #ifdef MP-WEIXIN
				wx.aldstat.sendEvent('报名活动')
				// #endif
				if (this.activityType == 'wawaji' || this.activityType == 'checkIn') {
					if (!this.isApply) {
						// #ifdef MP-WEIXIN
						this.$refs.formpop.formShow('form', 'activity', this.content, '报名活动')
						// #endif
						// #ifdef MP-TOUTIAO
						this.$children[3].formShow('form', 'activity', this.content, '报名活动')
						// #endif

					} else {
						if (this.actSelect == 1) {
							uni.reLaunch({
								url: '/pages/lotteryPage?activityId=' + this.activityId + '&lotteryType=' + this
									.lotteryType + "&shareURL=" + encodeURIComponent(this.shareURL) + "&activityType="+this.activityType
							})
						} else if (this.actSelect == 2) {
							uni.navigateTo({
								url: '/pages/ActivitySelect?activityId=' + this.activityId + '&lotteryType=' + this
									.lotteryType + "&shareURL=" + encodeURIComponent(this.shareURL) + "&activityType="+this.activityType
							})
						} else {
							uni.navigateTo({
								url: `/pages/wawaji?activityId=${this.content.id}`
							})
						}

					}

				} else {
					var formpopName = 'lbactivity'
					if(this.lotteryType == 'Vouchers'){
						formpopName = 'activity'
					}
					// #ifdef MP-WEIXIN
					this.$refs.formpop.formShow('form', formpopName, this.content, '报名活动')
					// #endif

					// #ifdef MP-TOUTIAO
					this.$children[3].formShow('form', formpopName, this.content, '报名活动')
					// #endif
				}
			},

			//开启红包
			openPackets(){
				//活动未开始或者已结束
				if((!this.isActStart && this.isApply) || !this.isApply || this.isActEnded){
					return;
				}
				// #ifndef MP-WEIXIN
				this.$toast('请在微信搜索本小程序参与')
				// #endif
				
				// #ifdef MP-WEIXIN
				if(this.$refs.redPackets.chanceCount>0){
					this.$refs.redPackets.openPacket()
				}
				// #endif
			},
			//开始挑战
			startGame(){
				if(this.$refs.jigsaw.chanceCount <= 0){
					return
				}
				if(this.$refs.jigsaw.maxCount <= this.$refs.jigsaw.todayUserCount){
					this.$toast("您已超过每日挑战次数，请明天再来吧～")
					return
				}
				let endTime =  this.content.endTime ? this.content.endTime.replaceAll("-","/"):""
				app.globalData.avtivityEndTime = endTime;
				uni.navigateTo({
					url: `/pages/Jigsaw?id=${this.activityId}`
				})
			},
			// 分享按钮被点击
			shareBtnClick() {
				wx.aldstat.sendEvent('活动分享点击')
			},
			async getPhoneNumber(e) {
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
			downDate(endtime) {
				let time = new Date().getTime()
				endtime = new Date(endtime.replace(/-/g, '/')).getTime()
				let j = endtime - time
				if (j <= 0) {
					this.isActEnded = true;
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
				let v = [this.add0(days), this.add0(hours), this.add0(minutes), ss]
				this.artDownDate = v
			},
			// +0
			add0(number) {
				return number > 9 ? number : '0' + number
			},
			
			async subSuccess(type){
				if(type=='draw'){
					this.formShow()
				}else{
					this.getFission()
					if(this.activityType=="packets"){
						this.$refs.redPackets.getActivityInfo();
					}
					if(this.activityType == 2){
						this.$refs.jigsaw.getActivityInfo();
					}
				}
			},
			async getData() {
				// 访问活动 记录活动访问次数
				api.fetchActivityVisit({
					'activityId': this.activityId
				})
				await this.getFission()
				console.log("this.activityType",this.activityType)
				if(this.activityType=="packets" && this.$refs.redPackets){
					this.$refs.redPackets.getActivityInfo()
				}else if(this.activityType == 2 && this.$refs.jigsaw){
					this.$refs.jigsaw.getActivityInfo()
				}
				let wxUserInfo = uni.getStorageSync('wxUserInfo')
				this.phone = wxUserInfo.mobile
				console.log("getData wxUserInfo",wxUserInfo)
				console.log("this.phone",this.phone)
				if(wxUserInfo){
					if(this.lotteryType == 'Vouchers'){
						this.formShowTitle = '领取代金券'
						this.shareURL = `/pages/fissionActivity?${this.cs}`
					}else{
						this.shareURL = `/pages/fissionActivity?${this.cs}&sourceUserId=${wxUserInfo.id}`	
					}
				}
				
			},
			shareChoise() {
				this.$refs.popup.open('bottom')
			},

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


			}



		}
	}
</script>

<style lang="less">
	@import '@/static/less/public.less';
	// .page-container{
	// 	position: relative;
	// }
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
		position: relative;
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

			.enroll-btn {
				width: 686rpx;
				height: 88rpx;
				color: #ffffff;
				font-size: 32rpx;
				background-color: #fa8845;
				border-radius: 44rpx;
				
				&.enroll-btn2 {
					width: 420rpx;	
				}
				&.enroll-btn-gray{
					background: #9e9e9e;
				}
				
			}
			.enroll-btn3 {
				background-color: #DEDEDE;
					
			}
			

			.actSelectOneBtn {
				text-align: center;
				display: inline;
				width: 330rpx;
				height: 88rpx;
				background: #0B457F;
				border-radius: 44rpx;

				.selectTitle1 {

					margin-top: 13rpx;
					/*  #ifndef  MP-WEIXIN */
					margin-top: 5rpx;
					/*  #endif  */
					font-size: 32rpx;
					font-weight: 800;

					color: #ffffff;
				}

				.selectTitle2 {
					font-size: 22rpx;
					font-weight: 500;

					color: #AEBDCD;
				}
			}

			.actSelectTwoBtn {

				text-align: center;
				display: inline;
				width: 330rpx;
				height: 88rpx;
				background: #FA8845;
				border-radius: 44rpx;

				.selectTitle1 {
					margin-top: 13rpx;
					/*  #ifndef  MP-WEIXIN */
					margin-top: 5rpx;
					/*  #endif  */
					font-size: 32rpx;
					font-weight: 800;

					color: #ffffff;
				}

				.selectTitle2 {
					font-size: 22rpx;
					font-weight: 500;

					color: #FFEFDD;
				}
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
			background: #EBEBEB;
			height: 1rpx;
			width: 100%;
			// margin-top: ;
		}

		button {
			width: 100%;
			color: #333333;
			background: #FFFFFF;
			font-size: 33rpx;
			margin: auto;
			margin-top: 10rpx;
		}

	}
	.share-txt{
		font-size: 24rpx;
		color: #999999;
		text-align: center;
		margin-top: 19rpx;
		line-height: 1;
	}
	.chance-count{
		position: absolute;
		.setbg(auto,32rpx,'redpackage/chance-bg.png');
		min-width: 132rpx;
		padding:0 10rpx;
		box-sizing: border-box;
		background-size:cover;
		font-size: 20rpx;
		text-align: center;
		line-height: 32rpx;
		color: #ffffff;
		top:-15rpx;
		right:-22rpx;
		white-space: nowrap;
	}
	.jigsaw-detail-btn .chance-count{
		right:0;
	}
	// 签到报名弹窗
	.checkin-popup{
		.mask;
    	z-index: 11;
		.checkin-sign-pop{
			width:560rpx;
			height: 313rpx;
			border-radius: 16rpx;
			background: #ffffff;
			position: fixed;
			left: 50%;
			top: 52%;
			transform: translate(-50%, -49%);
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			text-align: center;
		}
		.p1{
			font-size: 32rpx;
			color: #333333;
			line-height: 50rpx;
		}
		.show-form-btn{
			width: 400rpx;
			height: 88rpx;
			text-align: center;
			line-height: 88rpx;
			border-radius: 44rpx;
			background: #fb2b51;
			margin-top: 30rpx;
			font-size: 32rpx;
			color: #ffffff;
		}
	}
	.jigsaw-detail-btn{
		position: absolute;
		width: 100%;
		bottom: 120rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		.activity-btn-status,
		.no-apply-btn{
			width: 560rpx;
			height: 100rpx;
			background: url(https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/jigsaw/activity-status-bg.png) no-repeat center/100%;
			font-size: 40rpx;
			color: #ffffff;
			text-align: center;
			line-height: 100rpx;
			font-weight: bold;
		}
		.no-apply-btn{
			background: url(https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/jigsaw/form-bg.png) no-repeat center/100%;
		}
		.share-btn,
		.challenge-btn{
			width: 320rpx;
			height: 100rpx;
			background: url(https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/jigsaw/share-btn-bg.png) no-repeat center/100%;
			font-size: 40rpx;
			color: #ffffff;
			text-align: center;
			line-height: 100rpx;
			font-weight: bold;
			margin:0 12rpx;
			padding:0;
			position: relative;
			overflow: inherit;
		}
		.challenge-btn{
			background: url(https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/jigsaw/challenge-btn.png) no-repeat center/100%;
		}
		.no-challenge-btn{
			background: url(https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/jigsaw/no-chance-bg.png) no-repeat center/100%;
		}
	}
	 
</style>
<style scoped>
	/deep/.red-package-page .inviteRecord{
		width:686rpx;
		margin:0 auto 40rpx;
		box-sizing: border-box;
	}
	/deep/.red-package-page .inviteRecord .title,/deep/.red-package-page .tips .title{
       color: #ff5b02;
	   padding: 0;
    }
	/deep/.red-package-page .inviteRecord .title:before,
	/deep/.red-package-page .inviteRecord .title:after,
	/deep/.red-package-page .tips .title:before,
	/deep/.red-package-page .tips .title:after{
		content:"";
		width:185rpx;
		height:13rpx;
		display:inline-block;
		vertical-align:middle;
		margin:0 20rpx;
	}
	/deep/.red-package-page .inviteRecord .title:before,
	/deep/.red-package-page .tips .title:before{
		background: url(https://www1.pcauto.com.cn/changan/xcx/img/redpackage/title-line1.png) no-repeat center/100%;
	}
	/deep/.red-package-page .inviteRecord .title:after,
	/deep/.red-package-page .tips .title:after{
		background: url(https://www1.pcauto.com.cn/changan/xcx/img/redpackage/title-line2.png) no-repeat center/100%;
	}
	/deep/.red-package-page .inviteRecord .item{
       background: #fff3e3;
    }
	/deep/.red-package-page .tips .contentBody .contentTips-outer{
		background: #fff3e3;
		color: #333333;
		font-size: 28rpx;
		line-height: 54rpx;
	}
	/deep/.red-package-page .package-detail-btn{
		position: absolute;
		left:50%;
		transform: translate(-50%,-145%);
		height:180rpx;
	}
	/deep/.red-package-page .enroll-btn{
		font-size: 36rpx;
		font-weight: bold;
		text-align: center;
		line-height: 100rpx;
		color: #ffffff;
		width:560rpx;
		height:100rpx;
		background: url(https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/redpackage/open-btn-bg.png) no-repeat center/100%;
	}
	/deep/.red-package-page .enroll-btn.enroll-btn-gray{
		background: url(https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/redpackage/open-btn-bg-gray.png) no-repeat center/100%;
	}
	/deep/.red-package-page .share-btn{
		width: 560rpx;
		height: 94rpx;
		border: 3rpx solid #ff5c02;
		border-radius: 50rpx;
		font-size: 36rpx;
		font-weight: 700;
		text-align: center;
		color: #ff5c02;
		margin-top: 24rpx;
		line-height: 94rpx;
		background: none;
	}
	
</style>

