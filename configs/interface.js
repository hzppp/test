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
	changan:"http://ms-changan-auto.changan-cloud-auto",
    pcauto: 'https://magear.pcauto.com.cn', //测试域名
}

//测试环境域名
var DOMAIN_T = {
	csbHost:"https://testprice.pcauto.com.cn",//基础信息
	whoisHost:"https://whois.pconline.com.cn",//位置信息
	magearHost:"https://magear.pcauto.com.cn",
	host:"https://testpocket2.pcauto.com.cn",
	// panorama:"https://panorama.pcauto.com.cn",//vr看车图片
	panorama:"https://panorama.pcauto.com.cn",
    UPCHost:"https://upc.pcauto.com.cn",
    pcauto: 'https://magear.pcauto.com.cn', //测试域名
	changan:"https://tccar.pcauto.com.cn",
	mock:"https://www.fastmock.site/mock/4b94bbec30c646fb92f631fac3d6ab4c",
}



const DOMAIN = (CUR_ENV === ENV.RELEASE) ? DOMAIN_R : DOMAIN_T;



const config = {

	appName: '长安云车展',

	DOMAIN: DOMAIN,

	CUR_ENV: (CUR_ENV === ENV.RELEASE),//环境判断 true 正式

	api: {
		login:  `${DOMAIN.changan}/api/xcx/user/login`,
		// 获取区域
		getRegion: `${DOMAIN.host}/api/audi/base/getRegion`,
		//
		getIpAreaCoord: `${DOMAIN.whoisHost}/ipAreaCoordJson.jsp`,
		//
		getAreaByRegion: `${DOMAIN.host}/api/audi/base/getAreaByRegion`,
		//
		getRegionIpArea: `${DOMAIN.magearHost}/x-7200/price.pcauto.com.cn/interface/cms/region_ipArea.jsp`,
		// 活动
		getactivity: `${DOMAIN.changan}/api/xcx/activity/list`,
		//我的活动列表
		getActivityUser:`${DOMAIN.changan}/api/xcx/activity/list/user`,
		//直播列表
		getLiveList:`${DOMAIN.changan}/api/xcx/livestream/list`,
		getLiveDetail:`${DOMAIN.changan}/api/xcx/livestream/detail`,
		// 获取车系列表
		getAutoSerialList: `${DOMAIN.host}/api/audi/back/vehicleManagement/showVehicle`,
		// 获取价格
		getAutoPrice: `${DOMAIN.host}/api/audi/xcx/vehicleExhibition/vehicleInformation`,
		// 获取活动内容
		getActivityContent: `${DOMAIN.changan}/api/xcx/activity/detail`,
		// 获取优惠券列表
		getWelfare: `${DOMAIN.changan}/api/xcx/coupon/list`,
		// 用户留资
		submitClue: `${DOMAIN.changan}/api/xcx/clue/user`,
		// 获取用户信息
		getPocketUserInfo: `${DOMAIN.host}/api/xcx/user/info`,
		// 记录活动访问
		visitActivity: `${DOMAIN.host}/api/audi/xcx/visitActivity`,
		// 保存用户信息
		saveWXuserInfo: `${DOMAIN.changan}/api/xcx/user/decryptInfo`,
		// 手机号解密
		decryptPhone: `${DOMAIN.changan}/api/xcx/user/decryptPhone`,
		// 获取用户领取的优惠券
		getUserOupons: `${DOMAIN.changan}/api/xcx/coupon/list/user`,
		userOuponsDet:`${DOMAIN.changan}/api/xcx/coupon/detail/user`,
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
		// 车驾信息认证
		Carapprove: `${DOMAIN.host}/api/audi/xcx/approve`,
		// 上传到 UPC
		uploadPhoto: `${DOMAIN.UPCHost}/upload_quick.jsp?application=autopocket`,
		// 获取文章列表
		getArticleList: `${DOMAIN.changan}/api/xcx/article/list`,
		// 点赞
		like: `${DOMAIN.host}/api/audi/xcx/carFriend/like`,
		// 获取文章内容
		getArticleContent: `${DOMAIN.changan}/api/xcx/article/detail`,
		// 上传图片到upc
		uploadUPC: `${DOMAIN.UPCHost}/upload_quick.jsp?referer=https://play10.pcauto.com.cn/&application=autopocket&keepSrc=yes&readExif=no`,
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
		// 文章分享
		shareArticle: `${DOMAIN.host}/api/audi/xcx/carFriend/article/share`,
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
        //获取经销商列表
        fetchdealersList:`${DOMAIN.changan}/api/xcx/base/getDealers`,
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
		calcModel: `${DOMAIN.csbHost}/interface/iphone/model_list_v3.jsp`,
		// 获取验证码
		fetchCode: `${DOMAIN.changan}/api/xcx/base/senMsg`,
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
