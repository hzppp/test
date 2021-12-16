import '@/public/ald/ald-stat.js'
import Vue from 'vue'
import App from './App'
import store from './store'
import toast from './units/showToast.js'
import request from './units/request.js'
import loading from '@/components/loading/loading'
import domain from '@/configs/interface';
import {gio} from '@/units/buriedpoint.js'

Vue.component("loading", loading)
Vue.prototype.$store = store
Vue.prototype.$toast = toast
Vue.prototype.$request = request
Vue.prototype.$EventBus = new Vue()
Vue.config.productionTip = false
Vue.prototype.$gdp = gio;
App.mpType = 'app'


const app = new Vue({
	store,
    ...App
})
app.$mount()


