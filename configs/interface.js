//环境配置
var ENV = {
	RELEASE: 0, //正式环境 wxe6ffa5dceb3b003b
	TEST: 1, //测试环境  wxb36fb5205e5afb36
}
//当前环境 （上线前检查）！！！！
const CUR_ENV = ENV.RELEASE; 
const version = 1062;



// 正式域名
var DOMAIN_R = {
	csbHost:"https://price.pcauto.com.cn",//基础信息
	whoisHost:"https://whois.pconline.com.cn",//位置信息
	host:"https://pocket.pcauto.com.cn",
	changan:"https://ccar.pcauto.com.cn",
	pcauto: 'https://magear.pcauto.com.cn', //测试域名
	webUrl:'https://ccar.pcauto.com.cn/h5/' ,//云展厅
	UPC:'https://upc2.pc.com.cn',
	mystore:'https://cloud.mall.changan.com.cn/reactcaecapp/member/home?biz=69&mine=1'
}

//测试环境域名
var DOMAIN_T = {
	csbHost:"https://testprice.pcauto.com.cn",//基础信息
	whoisHost:"https://whois.pconline.com.cn",//位置信息
	host:"https://testpocket2.pcauto.com.cn",
	pcauto: 'https://magear.pcauto.com.cn', //测试域名
	changan:"https://tccar.pcauto.com.cn",
	// changan:"http://192.168.30.207:7080",
	// changan:'https://devqd-changan.pcauto.com.cn',
	// mock:"https://www.fastmock.site/mock/4b94bbec30c646fb92f631fac3d6ab4c",
	// webUrl:'https://cdc.pcauto.com.cn/vue/hall/a/' ,//云展厅
	webUrl:'https://www1.pcauto.com.cn/test/gz20211217/yzt/changan/',
	UPC:'https://qa-upc2.pc.com.cn',
	mystore:'https://ssl.mall.changan.com.cn/reactcaecapp/member/home?biz=9'
}

//云车展小程序配置信息
//测试环境
var CONFIG_T = {
	accountID:'ac8e9fff9218d0b4',
	datasourceID:'a8baef5711ad838e',
	appId:'wxb36fb5205e5afb36',
	host:'//cbd-api.changan.com.cn:9090',
	version:version
}
//正式环境
var CONFIG_R = {
	accountID:'b17c69986984a3be',
	datasourceID:'8c8866d4dd9f349c',
	appId:'wxe6ffa5dceb3b003b',
	host:'//cbd-api.changan.com.cn:9092',
	version:version
}

const DOMAIN = (CUR_ENV === ENV.RELEASE) ? DOMAIN_R : DOMAIN_T;

const CONFIG = (CUR_ENV === ENV.RELEASE) ? CONFIG_R : CONFIG_T;


const config = {

	appName: '长安云车展',

	DOMAIN: DOMAIN,
	CONFIG: CONFIG,
	version:version,

	CUR_ENV: (CUR_ENV === ENV.RELEASE),//环境判断 true 正式

	api: {
		
		login:  `${DOMAIN.changan}/api/xcx/user/login`,
		// #ifdef MP-WEIXIN
		// 手机号解密
		decryptPhone: `${DOMAIN.changan}/api/xcx/user/decryptPhone`,
		// 保存用户信息
		 saveWXuserInfo: `${DOMAIN.changan}/api/xcx/user/decryptInfo`,
		
		// #endif
		
		// #ifdef MP-TOUTIAO
		// 手机号解密
		decryptPhone: `${DOMAIN.changan}/api/xcx/user/dy/decryptPhone`,
		// 保存用户信息
		 saveWXuserInfo: `${DOMAIN.changan}/api/xcx/user/dy/decryptInfo`,
		// #endif
		// 获取区域
		getRegion: `${DOMAIN.host}/api/audi/base/getRegion`,
		//
		getIpAreaCoord: `${DOMAIN.whoisHost}/ipAreaCoordJson.jsp`,
		//
		getAreaByRegion: `${DOMAIN.host}/api/audi/base/getAreaByRegion`,
		// 活动
		getactivity: `${DOMAIN.changan}/api/xcx/activity/list`,
		//我的活动列表
		getActivityUser:`${DOMAIN.changan}/api/xcx/activity/list/user`,
		//直播列表
		getLiveList:`https://cama.changan.com.cn/api/page/topic`,
		
		getLiveDetail:`${DOMAIN.changan}/api/xcx/livestream/detail`,
		// 获取车系列表
		getAutoSerialList: `${DOMAIN.host}/api/audi/back/vehicleManagement/showVehicle`,
		// 获取价格
		getAutoPrice: `${DOMAIN.host}/api/audi/xcx/vehicleExhibition/vehicleInformation`,
		// 获取活动内容
		getActivityContent: `${DOMAIN.changan}/api/xcx/activity/detail`,
		// 是否留过咨
		getClueInfo: `${DOMAIN.changan}/api/xcx/clue/clueInfo`,
		// 获取优惠券列表
		getWelfare: `${DOMAIN.changan}/api/xcx/coupon/list`,
		// 用户留资
		submitClue: `${DOMAIN.changan}/api/xcx/clue/user`,
		// 获取用户信息
		getPocketUserInfo: `${DOMAIN.host}/api/xcx/user/info`,
		// 记录活动访问
		visitActivity: `${DOMAIN.host}/api/audi/xcx/visitActivity`,
		
		
		// 获取用户领取的优惠券
		getUserOupons: `${DOMAIN.changan}/api/xcx/coupon/list/user`,
		//获取优惠券
		userOuponsDet:`${DOMAIN.changan}/api/xcx/coupon/detail/user`,
		// vehicleOupons 车型展厅，获取优惠券
		vehicleOupons: `${DOMAIN.host}/api/audi/xcx/vehicleExhibition/vehicleOupons`,
		// 获取附近经销商
		getDealers: `${DOMAIN.csbHost}/interface/iphone/get_dealers_by_sgid_rid.jsp`,
		// /interface/sales/get_sales_list.jsp
		getSalesList: `${DOMAIN.host}/interface/sales/get_sales_list.jsp`,
		//
		getpreClue: `${DOMAIN.host}/api/audi/xcx/preClue`,
		// 提交formid
		saveFormId: `${DOMAIN.host}/api/audi/xcx/base/formId`,
		// 获取经销商
		getFormDealer: `${DOMAIN.host}/api/audi/xcx/dealer`,
		// 我的页面
		// 获得用户基础信息
		getUser: `${DOMAIN.changan}/api/xcx/user/info`,
		// 上传驾驶证
		uploadLicencePic: `${DOMAIN.host}/api/audi/xcx/uploadVehicleLicencePic`,
		//获得用户个人信息
		detailedMessage: `${DOMAIN.host}/api/audi/xcx/detailedMessage`,
		// 车驾信息认证
		Carapprove: `${DOMAIN.host}/api/audi/xcx/approve`,
		// 获取文章列表
		getArticleList: `${DOMAIN.changan}/api/xcx/article/list`,
		// 点赞
		like: `${DOMAIN.host}/api/audi/xcx/carFriend/like`,
		// 获取文章内容
		getArticleContent: `${DOMAIN.changan}/api/xcx/article/detail`,
		// 获取签到数据
		getsignIn: `${DOMAIN.host}/api/audi/xcx/signIn`,
		// 签到
		submitSignIn: `${DOMAIN.host}/api/audi/xcx/signIn`,
		// 获取任务列表
		getTaskList: `${DOMAIN.host}/api/audi/xcx/task`,
		// 获取众享币详情
		getRecord: `${DOMAIN.host}/api/audi/xcx/credits/record`,
		// 获取积分商城链接
		getMallLink: `${DOMAIN.host}/api/audi/duiba/mall`,
		// 活动分享
		shareActivity: `${DOMAIN.host}/api/audi/xcx/activity/`,
		//获取二维码
		getCode: `${DOMAIN.host}/xcx/qrCode.do`,
		//
		getSalesId: `${DOMAIN.host}/api/audi/xcx/activity/getSalesId`,
		// 获取用户信息-个人主页
		getUserInfo: `${DOMAIN.host}/api/audi/xcx/user/center`,
		// 获取设定车系
		getVehicle: `${DOMAIN.host}/api/audi/xcx/vehicle`,
		// 获取推荐动态
		getTJdynamic: `${DOMAIN.host}/api/audi/xcx/carFriend/recommendDynamic`,
		// 获取关注动态
		getFocusDynamic: `${DOMAIN.host}/api/audi/xcx/carFriend/focus`,
		// 获取文章详情
		getDynamicArticle: `${DOMAIN.host}/api/audi/xcx/carFriend/article/`,
		// 动态被访问
		visitDynamic: `${DOMAIN.host}/api/audi/xcx/visitDynamic`,
		//
		getVehicleExhibitionSalesInfo: `${DOMAIN.host}/api/audi/xcx/vehicleExhibition/salesAndDealer`,
		// 核销接口
		doCouponVerifiy: `${DOMAIN.changan}/api/xcx/coupon/verify`,
		//商城首页
		mallIndex:`${DOMAIN.host}/api/audi/xcx/gift/index`,
		//兑换记录
		mallRecord:`${DOMAIN.host}/api/audi/xcx/gift/order/index`,
		//商品详情
		mallGoodDetail:`${DOMAIN.host}/api/audi/xcx/gift/detail`,
		//创建订单
		mallCreateOrder:`${DOMAIN.host}/api/audi/xcx/gift/order/createWithAddr`,
		//获取各城市
		allCityList:`${DOMAIN.changan}/api/xcx/base/allCities`,
		//获取车系对比
		fetchVSserials: `${DOMAIN.pcauto}/s/pcauto/price/v1/serialsCompare.xsp`,
		// 获取省份
		fetchProvinceList: `${DOMAIN.changan}/api/xcx/base/provinces`,
		// 根据省份id获取城市
		fetchCityListByProvinceId: `${DOMAIN.changan}/api/xcx/base/getCities`,
		// 根据城市id获取地区
		fetchDistrictListByCityId: `${DOMAIN.changan}/api/xcx/base/getDistricts`,
		// 根据城市id获取经销商
		fetchDealerListByCityId: `${DOMAIN.changan}/api/xcx/base/getDealers`,
		// 获取车型对比对比数据
		fetchCarSerialContrast: `${DOMAIN.changan}/api/xcx/model/pk`,
		//获取车系详情
		fetchSerialDetail: `${DOMAIN.changan}/api/xcx/serialGroup/detail`,
		//获取车型列表
		fetchModelsList:`${DOMAIN.changan}/api/xcx/model/list`,
		//获取车系筛选列表
		fetchSerialList:`${DOMAIN.changan}/api/xcx/model/list`,
		//获取车系筛选列表
		fetchSerialScreenList: `${DOMAIN.changan}/api/xcx/serialGroup/simple/list`,
		// 获取车系
		fetchSerialList: `${DOMAIN.changan}/api/xcx/serialGroup/simple/list`,
		// 获取首页banner&活动数据
		getHomepageData:`${DOMAIN.changan}/api/xcx/index/homepage`,
		//获取验证码
		fetchCode: `${DOMAIN.changan}/api/xcx/base/senMsg`,
		//预约试驾
		postYuYueDrive: `${DOMAIN.changan}/api/xcx/behavior/driver/clue`,
		//计算器获取车系
		calcSerial: `${DOMAIN.csbHost}/interface/iphone/atom/price/serial_group_basic_json.jsp`,
		//计算器获取车型 
		calcModel: `${DOMAIN.csbHost}/price/api/v1/serialgroup/model_list_v3`,
		// 获取验证码
		fetchCode: `${DOMAIN.changan}/api/xcx/base/senMsg`,
		// 获取省份和城市的级联列表
		fetchProvinceCityList: `${DOMAIN.changan}/api/xcx/base/allMap`,
		// 请求优惠券详情
		fetchCouponDetail: `${DOMAIN.changan}/api/xcx/coupon/detail`,
		// 车系列表
		getSgList: `${DOMAIN.changan}/api/xcx/serialGroup/simple/list`,
		// 底部陪配置
		setLivePage: `${DOMAIN.changan}/api/xcx/livestream/visibility`,
		// 获取广告
		getBannerByPosition:`${DOMAIN.changan}/api/xcx/ad/getByPositionType`,
		// 获取抽奖信息
		getFission:`${DOMAIN.changan}/api/xcx/lottery/fission`,
		// 访问活动 记录活动访问次数
		fetchActivityVisit: `${DOMAIN.changan}/api/xcx/activity/visit`,
		// 云展厅地址
		webUrl:`${DOMAIN.webUrl}`,
		// 商城
		mystore:`${DOMAIN.mystore}`,

		// 中奖记录list
		lotteryRecordList: `${DOMAIN.changan}/api/xcx/lottery/record/page`,
		// 中奖记录list
		inviteRecordList: `${DOMAIN.changan}/api/xcx/clue/invite/list`,
		// 抽奖活动信息
		lotteryActInfo: `${DOMAIN.changan}/api/xcx/lottery/fission`,
		// lotteryActInfo: `${DOMAIN.changan}/api/xcx/lottery/lottery`,
		// 抽奖
		startLottery: `${DOMAIN.changan}/api/xcx/lottery/start`,
		// 奖励详情
		lotteryDetail: `${DOMAIN.changan}/api/xcx/lottery/record/detail`,
		// 获取服务器时间
		fetchServerTime: `${DOMAIN.changan}/rpr/api/base/time`,
		// 获取当日的红包雨活动
		fetchRedPacketRainList: `${DOMAIN.changan}/rpr/api/activity/liveRoom/today`,
		// 获取红包金额
		fetchRedPacketAmount: `${DOMAIN.changan}/rpr/api/redPacket/amount`,
		// 获取开红包
		fetchRedPacketOpen: `${DOMAIN.changan}/rpr/api/redPacket/open`,
		// 获取红包记录
		fetchRedPacketRecord: `${DOMAIN.changan}/rpr/api/redPacket/record`,
		// 获取开红包状态
		fetchRedPacketStatus: `${DOMAIN.changan}/rpr/api/redPacket/status`,
		// 图库url
		VRouter: `${DOMAIN.changan}/wap/#/outer`,
		// 积分查询 
	    score: `${DOMAIN.changan}/api/xcx/user/score`,
		// UPC
		uploadUPC:`${DOMAIN.UPC}/api/images/post?appCode=changan_cloud&token=changan_cloud$0625&passportId=489798471&fileExt=jpg&bizType=pcncc`,
		// submit
		submit: `${DOMAIN.changan}/api/xcx/feedback/submit`,		
		// 注册
		userBind: `${DOMAIN.changan}/api/xcx/user/bind`,
		// 刷新token
		refreshToken: `${DOMAIN.changan}/api/xcx/user/refreshToken`,
		// 获取用户ip
		getIP:'https://whois.pconline.com.cn/ipJson.jsp?resp_enc=utf-8&json=true',
		// 娃娃机-活动信息
		wwjInfo: `${DOMAIN.changan}/api/xcx/wawaji/info`,
		// 娃娃机-保存车型
		saveModel: `${DOMAIN.changan}/api/xcx/wawaji/model/save`,
		// 启动娃娃机
		wwjStart: `${DOMAIN.changan}/api/xcx/wawaji/start`,
		// 娃娃机-二维码核销
		wwjVerify: `${DOMAIN.changan}/api/xcx/wawaji/verify`,
		// 生成微信二维码
		createWxQrCode: `https://ccar.pcauto.com.cn/api/xcx/base/createWxQrCode`,
		// 订阅消息
		subscribe: `${DOMAIN.changan}/api/xcx/subscribe/add`,
		//检查是否订阅
		checkSubscribe:`${DOMAIN.changan}/api/xcx/subscribe/check`,
		//开红包
		openRed:`${DOMAIN.changan}/api/xcx/redPacket/open`,
		//开红包记录
		redRecord:`${DOMAIN.changan}/api/xcx/redPacket/record`,
		//开红包状态
		redStatus:`${DOMAIN.changan}/api/xcx/redPacket/status`,
		//根据经销商查询车系
		listByDealer:`${DOMAIN.changan}/api/xcx/serialGroup/listByDealer`,
		//查询用户基本信息
		queryingUserInfor:`${DOMAIN.changan}/api/xcx/user/base/info`,
		//活动扫码签到
		checkIn:`${DOMAIN.changan}/api/xcx/activity/checkIn`,
		//查询用户的活动签到状态
		checkInStatus:`${DOMAIN.changan}/api/xcx/activity/checkIn/status`,
		// 客服url
		serversCode: `${DOMAIN.changan}/wap/#/serversCode`,
		
		//订单相关
		// 订单详情
		orderDetail: `${DOMAIN.changan}/api/xcx/order/order`,
		// 获取用户订单列表
		orders: `${DOMAIN.changan}/api/xcx/order/orders`,
		// 生成订单
		preOrder: `${DOMAIN.changan}/api/xcx/order/preOrder`,
		// 微信小程序客户端支付回调
		preOrderBack: `${DOMAIN.changan}/api/xcx/order/preOrder/callback`,
		// 用户申请退款
		apply: `${DOMAIN.changan}/api/xcx/order/refund/apply`,
		// 取消申请退款
		cancelApply: `${DOMAIN.changan}/api/xcx/order/refund/cancel`,
		
		//查询用户红包记录
		fetchPacketRecords: `${DOMAIN.changan}/api/xcx/redPacket/user/record`,
		//开启红包
		openRedPacket: `${DOMAIN.changan}/api/xcx/redPacket/redPacketOpen`,
		//拼团活动获取团信息
		getGroupBuyInfo: `${DOMAIN.changan}/api/xcx/activity/selectGroupBuyInfo`,
	},
	getAPI(key) {
		let url;

		if (config && config.api) url = config.api[key];

		return url;
	},
	getCurrentEnv() {
		return CUR_ENV;
	}
}

module.exports = config;

