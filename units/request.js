import config from '@/configs/interface.js';

const kIsIcs = 'isIcs';

/**
 * 检测阿里云环境是否切换ics or release
 * （抽到app.js调用，模块内部不应该直接调用）
 */
// if (config.getCurrentEnv() === 0) {
//     icsStatusCheck();
// }

/**
 * 网络请求方法
 */
export default function request(options = {}) {

	const {
		url = '', header, method, data
	} = options;

	if (header === undefined) {
		options.header = {
			// #ifdef MP-WEIXIN
			'App': 'wechat'
			// #endif

			// #ifdef MP-BAIDU
			'App': 'baidu'
			// #endif

			// #ifdef MP-ALIPAY
			'App': 'alipay'
			// #endif
			
			// #ifdef MP-TOUTIAO
			'App': 'toutiao'
			// #endif
			
			
		};
	} else {
		// #ifdef MP-WEIXIN
		options.header["App"] = "wechat";
		// #endif

		// #ifdef MP-BAIDU
		options.header['App'] = 'baidu';
		// #endif

		// #ifdef MP-ALIPAY
		options.header['App'] = 'alipay';
		// #endif
		
		// #ifdef MP-TOUTIAO
			options.header['App'] = 'toutiao';
		// #endif
	}
	let session3rd = uni.getStorageSync('session-3rd')
	  options.header = options.header || {}
	  if(options.method == 'POST'){
		// p.header['content-type'] = 'application/x-www-form-urlencoded'
	  }
	  if(session3rd && options.url.indexOf(config.DOMAIN.changan) > -1){
		options.header['token'] = session3rd
	  }
	   if(session3rd && options.url.indexOf(config.DOMAIN.host) > -1){
		options.header['token'] = session3rd
	  }
	// 支持直接传接口名字请求
	options.url = options.url.indexOf("http") != -1 ? options.url : config.getAPI(options.url)

	return new Promise((resolve, reject) => {
		uni.request({
		    ...options,
			success: (res) => {
				console.log(res)
				resolve(res);
			},
			fail: (err) => {
				console.log(err)
				reject();
			}
		})
	})
}

function _complete(res, options, isIcs) {
	// const {
	// 	statusCode = ''
	// } = res;

	// 如果是云缓存，并且返回非200
	// 则自动切换到release，并回源请求
	// if (config.getCurrentEnv() === 0 && isIcs && statusCode != 200 && options) {
	const {
		url = ''
	} = options;
	let reload = false;
	if (url.startsWith("https://magear.pcauto.com.cn") && url.indexOf("/nocache/") === -1) {
		reload = true;
	}
	if (reload) {
		// console.log('reload to megear.')
		uni.request(options);
	}
	// } else {
	// 	options.fail && options.fail(res);
	// 	options.complete && options.complete(res);
	// }
}

/**
 * 校验是否需要使用阿里云接口
 * (getStorage有fail情况，所以要用Promise)
 */
function icsCheck(url) {

	return new Promise((resolve, reject) => {
		uni.getStorage({
			key: kIsIcs,
			success: res => {
				let isIcs = true;
				if (typeof res == 'string') {
					isIcs = res.indexOf('false') === -1;
				}

				let checkedUrl = url;

				if (!url) {
					console.error(`没有找到 ${url} 对应的api`)
					reject();
				}
				/**
				 * /p/ 段接口作为域名跳板，由网络进行配置，解决合法域名20个上限的问题
				 */
				if (url.startsWith('https://magear.pcauto.com.cn/p/')) {
					resolve({
						'checkedUrl': checkedUrl,
						'isIcs': isIcs
					});
				}
				if (config.getCurrentEnv() === 0 && isIcs && url.startsWith("https://magear.pcauto.com.cn") && url.indexOf(
						"/nocache/") === -1) {
					checkedUrl = "https://ics.pcauto.com.cn/magear" + url.substr("https://magear.pcauto.com.cn".length)
				}
				resolve({
					'checkedUrl': checkedUrl,
					'isIcs': isIcs
				});
			},
			fail: err => {
				reject(err);
			}
		})
	})
}

/**
 * 判断是否需要使用阿里云缓存
 */
export function icsStatusCheck() {
	let icsLockUrl = '';
	// #ifdef MP-WEIXIN || MP-QQ
	icsLockUrl = 'https://ics.pcauto.com.cn/actuator/ics/atp/wx_xcx_pcauto'
	// #endif

	// #ifdef MP-BAIDU
	icsLockUrl = 'https://ics.pcauto.com.cn/actuator/ics/atp/bd_xcx_pcauto'
	// #endif
	uni.request({
		url: icsLockUrl,
		header: {
			'content-type': 'application/json' // 默认值
		},
		complete(res) {
			console.log(res.data)
			if (res.statusCode !== 200 || (res.statusCode == 200 && res.data.ATP !== undefined && !res.data.ATP)) {
				uni.setStorageSync(kIsIcs, 'false')
			} else {
				uni.setStorageSync(kIsIcs, 'true')
			}
		}
	})
}
