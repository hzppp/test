import '@/public/ald/ald-stat.js'
import Vue from 'vue'
import App from './App'
import store from './store'
import toast from './units/showToast.js'
import request from './units/request.js'
import loading from '@/components/loading/loading'
import domain from '@/configs/interface';

Vue.component("loading", loading)
Vue.prototype.$store = store
Vue.prototype.$toast = toast
Vue.prototype.$request = request
Vue.prototype.$EventBus = new Vue()
Vue.config.productionTip = false

App.mpType = 'app'
var gdp = require("./units/gio-minp").default;
gdp('init', domain.CONFIG.accountID, domain.CONFIG.datasourceID, domain.CONFIG.appId, {
    version: '小程序版本',
    host: domain.CONFIG.host,
    vue: Vue,
    debug: true
});
gdp('track', 'YCZ_openApplet');

const app = new Vue({
	store,
    ...App
})
app.$mount()


