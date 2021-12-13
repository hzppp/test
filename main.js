import '@/public/ald/ald-stat.js'
import Vue from 'vue'
import App from './App'
import store from './store'
import toast from './units/showToast.js'
import request from './units/request.js'
import loading from '@/components/loading/loading'

Vue.component("loading", loading)
Vue.prototype.$store = store
Vue.prototype.$toast = toast
Vue.prototype.$request = request
Vue.prototype.$EventBus = new Vue()
Vue.config.productionTip = false

App.mpType = 'app'
var gdp = require("./units/gio-minp").default;
gdp('init', 'ac8e9fff9218d0b4', 'a8baef5711ad838e', 'wxb36fb5205e5afb36', {
    version: '小程序版本',
    host: 'https://cbd-api.changan.com.cn:9090',
    vue: Vue,
    debug: true
});
//gdp('track', eventId, properties);
gdp('track', 'YCZ_openApplet');
//上一个url
var lastUrl='index'
gioGlobal.gdp=gdp
gioGlobal.lastUrl=lastUrl
const app = new Vue({
	store,
    ...App
})
app.$mount()

