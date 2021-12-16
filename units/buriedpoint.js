import Vue from 'vue'
import domain from '@/configs/interface';
var gdp = require("./gio-minp").default;
gdp('init', domain.CONFIG.accountID, domain.CONFIG.datasourceID, domain.CONFIG.appId, {
    version: '小程序版本',
    host: domain.CONFIG.host,
    vue: Vue,
    debug: true
});
gdp('track', 'YCZ_openApplet');

//检测平台是否为微信并埋点
export const gio = function(eventId,properties) {
	//#ifdef MP-WEIXIN
	if(properties){
		gioGlobal.gio('track', eventId ,properties)
	}else gioGlobal.gio('track', eventId)
	//#endif
};