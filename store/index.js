import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		selectCars: {}, // 「车型对比」中已选择的车型
        pageData: {}, //页面返回提前更改的数据=>参考车系列表点击返回更改对比车系列表页
		currentModelId:'', //预约当前选择的车型的id
        currentDealer: {}, //当前选择的经销商
        currentCity:{name:'广州'}, //当前选择的城市
	},
	getters: {

	},
	mutations: {
		changModel(state,modelId) {
			state.currentModelId = modelId
		},
        changDealer(state,item) {
            state.currentDealer = item
        },
        changCity(state,item) {
            state.currentCity = item
        }
	},
	actions: {

	}
	
})

export default store
