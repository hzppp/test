export default function(title, icon = "none", duration = 1000) {
	uni.showToast({
		title: title,
		// #ifndef APP-PLUS
		duration: duration,
		// #endif
		icon: icon,
		// #ifndef MP-TOUTIAO || MP-ALIPAY
		mask: true
		// #endif
	})
	// #ifdef MP-ALIPAY || MP-BAIDU
	setTimeout(() => {
		uni.hideToast()
		uni.hideLoading()
	}, duration)
	// #endif
}
