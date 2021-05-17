import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		selectCars: {}, // 「车型对比」中已选择的车型
        pageData: {}, //页面返回提前更改的数据=>参考车系列表点击返回更改对比车系列表页
	},
	getters: {

	},
	mutations: {
	},
	actions: {

	}
	
})

export default store
