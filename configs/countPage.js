// #ifdef MP-WEIXIN
// 微信页面计数id
let countPage = {
	art: 9810,								//汽车网文章页
	vInfo: 9811,							//汽车网视频
	kolArt: 10123,							//太平洋号文章
	kolVideo: 10124,						//太平洋号视频
	phoneBind:{								//用户手机号登录
		count1: 9821,						//登录
		count2: 9822,						//绑定
	},
	picInfo: 9812,							//图赏页面
	search: 9799,							//搜索
	smallVideo: 10427,						//小视频终端页
	zxIndex: {								//首页
		recommend: 9802,					//推荐
		video: 9803,						//视频
		smallVideo: 10426,					//小视频
		newCar: 9804,						//新车
		pcautoHomes: '',					//太平洋号
		pingce: 9805,						//评测
		daogou: 9806,						//导购
		yongche: 9807,						//用车
		technology: 9808,					//技术
		culture: 9809,						//文化
	},
	index: {
		count: 9773,						//找车
	},
	bbs: {
		bbsCount: 10028,					//论坛tab
		bbsDetail: 10029,					//论坛列表
		bbsPost: 10031,						//帖子详情
		bbsSelect: '',						//论坛详情列表
	},
	salesRankings: {
		count: 10147,						//销量排行
	},
	newCarListed: {
		count: 10146,						//上市新车
	},
	dealer: {								//经销商
		chooseDealerSerials: '',			//经销商选择车系页
		dealerListIndex: 10033,				//首页经销商列表
		dealerDetail: 10109,				//经销商详情页
		delearsFuse: '',					//新经销商页
		dealerList: 9782,					//车系经销商列表
	},
	car: {									//车系相关
		carSerialsVS: 10144,				//车系对比页面
		modelsCompar: '',					//车型对比
		qindex: 9774,						//条件找车
		qlist: 9775,						//选车结果
		selectSerials: 9776,				//选择车系
		firmIndex: 9777,					//车系详情
		videoList: 9876,					//视频列表
		chexiPic: 9788,						//车系图片页
		canpei: {							//参配页
			count1: 9778,					//参数配置
			count2: 9787					//车型对比
		},
		xdj: 9794,							//询底价
		fqgc: 9795,							//分期购车
		gcyh: 10016,						//购车优惠
		qckj: 9796,							//全城砍价
		chexing: 9783,						//车型
		calc: 9793,							//计算器
		selectCity: 9861,					//城市选择
		xjPic: 9792,						//详解图片终端页
		serialPicDetail: 9789,				//图片终端页
		chexingxj: 9791,					//车型详解
		comment: 9780,						//点评列表页
		commentInfo: 9781,					//点评详情
		chooseModels: {						//车型对比-添加车型
			count: '',						//
			count1: 9786,					//正售/停售模块
			count2: 9784,					//品牌查找模块
			count3: 9785,					//对比历史模块
		},
		artList: 9779,						//文章列表
	},
	askIndex: 10110,						//车问答首页
	askTopic: 10111,						//车问答话题页
	QAdetial: 10112,						//车问答详情
	statement: 9877,						//个人信息保护声明
	myCollect: {							//我的收藏
		count: '',					 		//
		count1: 9818,						//收藏文章
		count2: 9819,						//收藏视频
		count3: 9820,						//收藏车系
	},
	myComment: {							//我的评论
		count: '',					 		//
		count1: 9816,						//发表的评论
		count2: 9817,						//收到的评论回复
	},
	person: '',								//个人中心
	webView: 0,								//webView页面
}
// #endif

// #ifdef MP-BAIDU
// 百度页面计数id
let countPage = {
	art: 9873,								//汽车网文章页
	vInfo: 9874,							//汽车网视频
	kolArt: 10126,							//太平洋号文章
	kolVideo: 10127,						//太平洋号视频
	phoneBind:{								//用户手机号登录
		count1: '',							//登录
		count2: '',							//绑定
	},
	picInfo: 9875,							//图赏页面
	search: 9862,							//搜索
	smallVideo: '',							//小视频终端页
	zxIndex: {
		recommend: 9865,
		video: 9866,
		smallVideo: '',						//小视频
		newCar: 9867,
		pcautoHomes: 10125,
		pingce: 9868,
		daogou: 9869,
		yongche: 9870,
		technology: 9871,
		culture: 9872,
	},
	index: {
		count: 9836,
	},
	bbs: {
		bbsCount: 10028,
		bbsDetail: 10029,					//论坛列表
		bbsPost: 10043,						//帖子详情
		bbsSelect: '',						//论坛详情列表
	},
	salesRankings:{
		count: 10152,
	},
	newCarListed: {
		count: 10151,
	},
	dealer:{
		chooseDealerSerials: '',			//经销商选择车系页
		dealerListIndex: 10045,
		dealerDetail: 10113,
		delearsFuse: '',					//新经销商页
		dealerList: 9845,					//车系经销商列表
	},
	car: {
		carSerialsVS: 10149,				//车系对比页面
		modelsCompar: '',
		qindex: 9837,
		qlist: 9838,
		selectSerials: 9839,
		firmIndex: 9840,					//车系详情
		videoList: 9878,					//视频列表
		chexiPic: 9851,						//车系图片页
		canpei: {							//参配页
			count1: 9841,					//参数配置
			count2: 9850					//车型对比
		},
		xdj: 9857,							//询底价
		fqgc: 9858,							//分期购车
		gcyh: 10016,						//购车优惠
		qckj: 9859,							//全城砍价
		chexing: 9846,						//车型
		calc: 9856,							//计算器
		selectCity: 9798,					//城市选择
		xjPic: 9855,						//详解图片终端页
		serialPicDetail: 9852,				//图片终端页
		chexingxj: 9854,					//车型详解
		comment: 9843,						//点评列表页
		commentInfo: 9844,					//点评详情
		chooseModels: {						//车型对比-添加车型
			count: '',						//
			count1: 9849,					//正售/停售模块
			count2: 9847,					//品牌查找模块
			count3: 9848,					//对比历史模块
		},
		artList: 9842,						//文章列表
	},
	askIndex: 10115,						//车问答首页
	askTopic: 10116,						//车问答话题页
	QAdetial: 10117,						//车问答详情
	statement: 9879,						//个人信息保护声明
	myCollect: {							//我的收藏
		count: '',					 		//
		count1: 9818,						//收藏文章
		count2: 9819,						//收藏视频
		count3: 9820,						//收藏车系
	},
	myComment: {							//我的评论
		count: '',					 		//
		count1: 9816,						//收藏文章
		count2: 9817,						//收藏视频
	},
	person: '',								//个人中心
	webView: 0,								//webView页面
}
// #endif

// #ifdef MP-ALIPAY
// 支付宝页面计数id
let countPage = {
	art: '',								//汽车网文章页
	vInfo: '',								//汽车网视频
	kolArt: '',								//太平洋号文章
	kolVideo: '',							//太平洋号视频
	phoneBind:{								//用户手机号登录
		count1: '',							//登录
		count2: '',							//绑定
	},
	picInfo: '',							//图赏页面
	search: '',								//搜索
	smallVideo: '',							//小视频终端页
	zxIndex: {								//首页
		recommend: '',						//推荐
		video: '',							//视频
		smallVideo: '',						//小视频
		newCar: '',							//新车
		pcautoHomes: '',					//太平洋号
		pingce: '',							//评测
		daogou: '',							//导购
		yongche: '',						//用车
		technology: '',						//技术
		culture: '',						//文化
	},
	index: {
		count: '',							//找车
	},
	bbs: {
		bbsCount: '',						//论坛tab
		bbsDetail: '',						//论坛列表
		bbsPost: '',						//帖子详情
		bbsSelect: '',						//论坛详情列表
	},
	salesRankings:{
		count: '',							//销量排行
	},
	newCarListed: {
		count: '',							//上市新车
	},
	dealer:{								//经销商
		chooseDealerSerials: '',			//经销商选择车系页
		dealerListIndex: '',				//经销商选择车系页
		dealerDetail: '',					//首页经销商列表
		delearsFuse: '',					//新经销商页
		dealerList: '',						//车系经销商列表
	},
	car: {
		carSerialsVS: '',					//车系对比页面
		modelsCompar: '',					//车型对比
		qindex: '',							//条件找车
		qlist: '',							//选车结果
		selectSerials: '',					//选择车系
		firmIndex: '',						//车系详情
		videoList: '',						//视频列表
		chexiPic: '',						//车系图片页
		canpei: {							//参配页
			count1: '',						//参数配置
			count2: ''						//车型对比
		},
		xdj: '',							//询底价
		fqgc: '',							//分期购车
		gcyh: '',							//购车优惠
		qckj: '',							//全城砍价
		chexing: '',						//车型
		calc: '',							//计算器
		selectCity: '',						//城市选择
		xjPic: '',							//详解图片终端页
		serialPicDetail: '',				//图片终端页
		chexingxj: '',						//车型详解
		comment: '',						//点评列表页
		commentInfo: '',					//点评详情
		chooseModels: {						//车型对比-添加车型
			count: '',						//
			count1: '',						//正售/停售模块
			count2: '',						//品牌查找模块
			count3: '',						//对比历史模块
		},
		artList: '',						//文章列表
	},
	askIndex: '',							//车问答首页
	askTopic: '',							//车问答话题页
	QAdetial: '',							//车问答详情
	statement: '',							//个人信息保护声明
	myCollect: {							//我的收藏
		count: '',					 		//
		count1: '',							//收藏文章
		count2: '',							//收藏视频
		count3: '',							//收藏车系
	},
	myComment: {							//我的评论
		count: '',					 		//
		count1: '',							//收藏文章
		count2: '',							//收藏视频
	},
	person: '',								//个人中心
	webView: 0,								//webView页面
}
// #endif

// #ifdef MP-TOUTIAO
// 头条页面计数id
let countPage = {
	art: 10624,								//汽车网文章页
	vInfo: 10625,								//汽车网视频
	kolArt: 10627,							//太平洋号文章
	kolVideo: 10628,							//太平洋号视频
	phoneBind:{								//用户手机号登录
		count1: '',							//登录
		count2: '',							//绑定
	},
	picInfo: 10626,							//图赏页面
	search: 10573,							//搜索
	smallVideo: 10570,						//小视频终端页
	zxIndex: {								//首页
		recommend: 10616,						//推荐
		video: 10617,							//视频
		smallVideo: '',						//小视频
		newCar: 10618,							//新车
		pcautoHomes: '',					//太平洋号
		pingce: 10619,							//评测
		daogou: 10620,							//导购
		yongche: 10621,						//用车
		technology: 10622,						//技术
		culture: 10623,						//文化
	},
	index: {
		count: 10583,						//找车
	},
	bbs: {
		bbsCount: 10552,					//论坛tab
		bbsDetail: 10574,					//论坛列表
		bbsPost: 10629,						//帖子详情
		bbsSelect: 10552,					//论坛详情列表
	},
	salesRankings:{
		count: 10569,						//销量排行
	},
	newCarListed: {
		count: 10557,						//上市新车
	},
	dealer:{								//经销商
		chooseDealerSerials: 10560,			//经销商选择车系页
		dealerListIndex: 10587,				//经销商选择车系页
		dealerDetail: 10588,				//首页经销商列表
		delearsFuse: 10587,					//新经销商页
		dealerList: 10615,					//车系经销商列表
	},
	car: {
		carSerialsVS: 10606,				//车系对比页面
		modelsCompar: 10603,				//车型对比
		qindex: 10584,						//条件找车
		qlist: 10585,						//选车结果
		selectSerials: 10586,				//选择车系
		firmIndex: 10609,					//车系详情
		videoList: 10611,					//视频列表
		chexiPic: 10597,					//车系图片页
		canpei: {							//参配页
			count1: 10610,					//参数配置
			count2: 10605					//车型对比
		},
		xdj: 10591,			 				//询底价
		fqgc: 10593,						//分期购车
		gcyh: 10595,						//购车优惠
		qckj: 10594,						//全城砍价
		chexing: 10608,						//车型
		calc: 10596,						//计算器
		selectCity: 10589,					//城市选择
		xjPic: 10601,						//详解图片终端页
		serialPicDetail: 10598,				//图片终端页
		chexingxj: 10600,					//车型详解
		comment: 10613,						//点评列表页
		commentInfo: 10614,					//点评详情
		chooseModels: {						//车型对比-添加车型
			count: 10604,					//
			count1: '',						//正售/停售模块
			count2: '',						//品牌查找模块
			count3: '',						//对比历史模块
		},
		artList: 10612,						//文章列表
	},
	askIndex: 10576,							//车问答首页
	askTopic: 10577,							//车问答话题页
	QAdetial: 10578,							//车问答详情
	statement: 10592,							//个人信息保护声明
	myCollect: {							//我的收藏
		count: 10632,						//
		count1: 10636,						//收藏文章
		count2: 10637,						//收藏视频
		count3: 10638,						//收藏车系
	},
	myComment: {							//我的评论
		count: 10631,						//
		count1: 10634,						//发表的评论
		count2: 10635,						//收到的评论回复
	},
	person: 10554,							//个人中心
	webView: 10599,							//webView页面
}
// #endif
module.exports = countPage;