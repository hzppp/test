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

export default class BadIntersectionObserver {
  constructor(options) {
    this.$options = {
      context: null,
      selector: null,
      onEach: res => res.dataset,
      onFinal: () => null,
      relativeTo: null,
      threshold: 0.5,
      delay: 200,
      observeAll: false,
      initialRatio: 0,
      ...options,
    }
    this.$observer = null
  }

  connect() {
    if (this.$observer) return this
    this.$observer = this._createObserver()
    return this
  }

  reconnect() {
    this.disconnect()
    this.connect()
  }

  disconnect() {
    if (!this.$observer) return
    const ob = this.$observer
    if (ob.$timer) clearTimeout(ob.$timer)
    ob.disconnect()
    this.$observer = null
  }

  _createObserver() {
    const opt = this.$options
    const observerOptions = {
      thresholds: [0.5],
      observeAll: opt.observeAll,
      initialRatio: opt.initialRatio,
    }

    // 创建监听器
    const ob = opt.context
      ? opt.context.createIntersectionObserver(observerOptions)
      : wx.createIntersectionObserver(null, observerOptions)

    // 相交区域设置
    if (opt.relativeTo) ob.relativeTo(opt.relativeTo)
    else ob.relativeToViewport()

    // 开始监听
    let finalData = []
    let isCollecting = false
    ob.observe(opt.selector, res => {
      const { intersectionRatio } = res
      const visible = intersectionRatio >= opt.threshold
      if (!visible) return

      const data = opt.onEach(res)
      finalData.push(data)

      if (isCollecting) return
      isCollecting = true

      setTimeout(() => {
        opt.onFinal.call(null, finalData)
        finalData = []
        isCollecting = false
      }, opt.delay)
    })
    return ob
  }
}
