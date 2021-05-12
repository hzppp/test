//环境配置
var ENV = {
	RELEASE: 0, //正式环境
	TEST: 1, //测试环境
}
//当前环境 （上线前检查）！！！！
const CUR_ENV = ENV.TEST;

// 正式域名
var DOMAIN_R = {
	csbHost:"https://price.pcauto.com.cn",//基础信息
	whoisHost:"https://whois.pconline.com.cn",//位置信息
	magearHost:"https://magear.pcauto.com.cn",
	host:"https://pocket.pcauto.com.cn",
	panorama:"https://panorama.pcauto.com.cn",//vr看车图片
	//panorama:"http://t-panorama.pcauto.com.cn",
    UPCHost:"https://upc.pcauto.com.cn",
	changan:"http://ms-changan-auto.changan-cloud-auto"
}

//测试环境域名
var DOMAIN_T = {
	csbHost:"https://price.pcauto.com.cn",//基础信息
	whoisHost:"https://whois.pconline.com.cn",//位置信息
	magearHost:"https://magear.pcauto.com.cn",
	host:"https://testpocket2.pcauto.com.cn",
	// panorama:"https://panorama.pcauto.com.cn",//vr看车图片
	panorama:"https://panorama.pcauto.com.cn",
    UPCHost:"https://upc.pcauto.com.cn",
	changan:"http://ms-changan-auto.changan-cloud-auto"
}


const DOMAIN = (CUR_ENV === ENV.RELEASE) ? DOMAIN_R : DOMAIN_T;



const config = {

	appName: '奥迪部落',
	
	DOMAIN: DOMAIN,
	
	CUR_ENV: (CUR_ENV === ENV.RELEASE),//环境判断 true 正式
	
	api: {
		login:  `${DOMAIN.host}/api/audi/xcx/user/login`,
		// 获取车型基础信息
		getModelData: `${DOMAIN.csbHost}/price/api/v1/model/atom/99999/params`,
		// 获取车型外观
		getModelParamEquip: `${DOMAIN.csbHost}/price/api/v1/pocket/m`,
		// 获取省
		getProvince: `${DOMAIN.host}/api/audi/base/getProvince`,
		// 获取中心省
		getProvinceCentral: `${DOMAIN.host}/api/audi/base/getProvince/central`,
		// 按省获取区域
		getRegionByProvince: `${DOMAIN.host}/api/audi/base/getRegionByProvince`,
		// 获取区域
		getRegion: `${DOMAIN.host}/api/audi/base/getRegion`,
		// 
		getIpAreaCoord: `${DOMAIN.whoisHost}/ipAreaCoordJson.jsp`,
		// 
		getAreaByRegion: `${DOMAIN.host}/api/audi/base/getAreaByRegion`,
		// 
		getRegionIpArea: `${DOMAIN.magearHost}/x-7200/price.pcauto.com.cn/interface/cms/region_ipArea.jsp`,
		// 活动
		getactivity: `${DOMAIN.host}/api/audi/xcx/activity`,
		// 获取车系列表
		getAutoSerialList: `${DOMAIN.host}/api/audi/back/vehicleManagement/showVehicle`,
		// 获取价格
		getAutoPrice: `${DOMAIN.host}/api/audi/xcx/vehicleExhibition/vehicleInformation`,
		// 获取活动内容
		getActivityContent: `${DOMAIN.host}/api/audi/xcx/activity/`,
		// 
		getWelfare: `${DOMAIN.host}/api/audi/xcx/index/welfare`,
		// 用户留资
		submitClue: `${DOMAIN.host}/api/audi/xcx/clue`,
		// 获取用户信息
		getPocketUserInfo: `${DOMAIN.host}/api/audi/xcx/user/info`,
		// 记录活动访问
		visitActivity: `${DOMAIN.host}/api/audi/xcx/visitActivity`,
		// 保存用户信息
		saveWXuserInfo: `${DOMAIN.host}/api/audi/xcx/user/decryptInfo`,
		// 手机号解密
		decryptPhone: `${DOMAIN.host}/api/audi/xcx/user/decryptPhone`,
		// 获取用户领取的优惠券
		getUserOupons: `${DOMAIN.host}/api/audi/xcx/getUserOupons`,
		// getPanosInfo2 获取vr看车图片
		getPanosInfo2: `${DOMAIN.panorama}/intf/getAllApprInfo.jsp`,
		// vehicleOupons 车型展厅，获取优惠券
		vehicleOupons: `${DOMAIN.host}/api/audi/xcx/vehicleExhibition/vehicleOupons`,
		// 获取附近经销商
		getDealers: `${DOMAIN.csbHost}/interface/iphone/get_dealers_by_sgid_rid.jsp`,
		// /interface/sales/get_sales_list.jsp
		getSalesList: `${DOMAIN.host}/interface/sales/get_sales_list.jsp`,
		// 获取车型
		getModelListBySerialId: `${DOMAIN.magearHost}/s/pcauto/price/v1/getModelListBySerialId.xsp`,
		// 
		getpreClue: `${DOMAIN.host}/api/audi/xcx/preClue`,
		// 提交formid
		saveFormId: `${DOMAIN.host}/api/audi/xcx/base/formId`,
		// 获取经销商
		getFormDealer: `${DOMAIN.host}/api/audi/xcx/dealer`,
		// 我的页面
		// 获得用户基础信息
		getUser: `${DOMAIN.host}/api/audi/xcx/getUser`,
		// 上传驾驶证
		uploadLicencePic: `${DOMAIN.host}/api/audi/xcx/uploadVehicleLicencePic`,
		//获得用户个人信息
		detailedMessage: `${DOMAIN.host}/api/audi/xcx/detailedMessage`,
		//提交用户个人信息
		userMessageEntering: `${DOMAIN.host}/api/audi/xcx/userMessageEntering`,
		// 车驾信息认证
		Carapprove: `${DOMAIN.host}/api/audi/xcx/approve`,
		// 上传到 UPC
		uploadPhoto: `${DOMAIN.UPCHost}/upload_quick.jsp?application=autopocket`,
		// 获取文章列表
		getArticleList: `${DOMAIN.host}/api/audi/xcx/carFriend/article`,
		// 获取动态列表
		getDynamicList: `${DOMAIN.host}/api/audi/xcx/carFriend/dynamic`,
		// 获取主题列表
		getThemeList: `${DOMAIN.host}/api/audi/xcx/carFriend/theme`,
		// 点赞
		like: `${DOMAIN.host}/api/audi/xcx/carFriend/like`,
		// 发布动态
		putDynamic: `${DOMAIN.host}/api/audi/xcx/carFriend/dynamic`,
		// 获取评论列表
		// dynamicId:id,page:1,pageSize:10
		getCommentList: `${DOMAIN.host}/api/audi/xcx/comment`,
		// 发表评论
		publishComment: `${DOMAIN.host}/api/audi/xcx/comment`,
		// 获取动态详情
		getDynamicDetails: `${DOMAIN.host}/api/audi/xcx/carFriend/dynamic/`,
		//
		getThemeData: `${DOMAIN.host}/api/audi/xcx/carFriend/theme/`,
		// 获取文章内容
		getArticleContent: `${DOMAIN.host}/api/audi/xcx/carFriend/articleContent`,
		// 
		getAllTheme: `${DOMAIN.host}/api/audi/xcx/carFriend/theme/all`,
		// 上传图片到upc
		uploadUPC: `${DOMAIN.UPCHost}/upload_quick.jsp?referer=https://play10.pcauto.com.cn/&application=autopocket&keepSrc=yes&readExif=no`,
		// 获取未读消息
		getUserMessage: `${DOMAIN.host}/api/audi/xcx/userMessage`,
		// 检查图片是否合法
		checkImage: `${DOMAIN.host}/api/audi/xcx/base/check/img`,
		// 获取签到数据
		getsignIn: `${DOMAIN.host}/api/audi/xcx/signIn`,
		// 签到
		submitSignIn: `${DOMAIN.host}/api/audi/xcx/signIn`,
		// 获取众享币数
		getCredits: `${DOMAIN.host}/api/audi/xcx/credits`,
		// 获取任务列表
		getTaskList: `${DOMAIN.host}/api/audi/xcx/task`,
		// 获取众享币详情
		getRecord: `${DOMAIN.host}/api/audi/xcx/credits/record`,
		// 获取积分商城链接
		getMallLink: `${DOMAIN.host}/api/audi/duiba/mall`,
		// 获取积分商城链接
		getNotify: `${DOMAIN.host}/api/audi/duiba/notify`,
		// 获取兑换记录链接
		getPrizeRecord: `${DOMAIN.host}/api/audi/duiba/record`,
		// 活动分享
		shareActivity: `${DOMAIN.host}/api/audi/xcx/activity/`,
		// 文章分享
		shareArticle: `${DOMAIN.host}/api/audi/xcx/carFriend/article/share`,
		//获取签到活动数据
		getSignInActData: `${DOMAIN.host}/api/audi/xcx/signActivity/`,
		//获取二维码
		getCode: `${DOMAIN.host}/xcx/qrCode.do`,
		// 
		getSalesId: `${DOMAIN.host}/api/audi/xcx/activity/getSalesId`,
		// 
		getH5URL: `${DOMAIN.host}/api/audi/xcx/h5/url`,
		// 我的关注
		getMyFocus: `${DOMAIN.host}/api/audi/xcx/user/myFocus`,
		// 我的粉丝
		getMyFans: `${DOMAIN.host}/api/audi/xcx/user/myFans`,
		// +关注
		addFocus: `${DOMAIN.host}/api/audi/xcx/user/focus`,
		// 取消关注
		cancelFocus: `${DOMAIN.host}/api/audi/xcx/user/cancelFocus`,
		// 获取用户信息-个人主页
		getUserInfo: `${DOMAIN.host}/api/audi/xcx/user/center`,
		// 获取个人动态
		getUserDynamicList: `${DOMAIN.host}/api/audi/xcx/carFriend/user`,
		// 删除动态
		deleteDynamic: `${DOMAIN.host}/api/audi/xcx/carFriend/deleteDynamic`,
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
		doCouponVerifiy: `${DOMAIN.host}/api/audi/xcx/doCouponVerifiy`,
		//商城首页
		mallIndex:`${DOMAIN.host}/api/audi/xcx/gift/index`,
		//兑换记录
		mallRecord:`${DOMAIN.host}/api/audi/xcx/gift/order/index`,
		//商品详情
		mallGoodDetail:`${DOMAIN.host}/api/audi/xcx/gift/detail`,
		//创建订单
		mallCreateOrder:`${DOMAIN.host}/api/audi/xcx/gift/order/createWithAddr`,
		fetchProvinceList: `${DOMAIN.changan}/xcx/base/provinces`,
		fetchcityListByProvinceId: `${DOMAIN.changan}/xcx/base/getCities`
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
