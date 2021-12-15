//检测平台是否为微信

export const isWeChat = function(val) {
	// #ifdef MP-WEIXIN
	return true
	// #endif
	return false
};