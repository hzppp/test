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
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
