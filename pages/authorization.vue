<template>
<!--  <view>
    <loading ref="loading"></loading>
    <view class="authorization" v-if="isShowPhoto">
    <view class="authorization-pop">
  		<button class="coupon-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber($event)" @tap.stop="stop" >获取手机号</button>
    </view>
    </view>		
  </view> -->
</template>

<script>
import login from '@/units/login'
import distance from '@/units/distance'
import api from '@/public/api/index'


let app = getApp()
export default {
  data() {
    return {
		isShowPhoto: false
	}
  },
  async onLoad(options) {
    // this.$refs.loading.changeLoading(true);
    app.globalData.haveUserInfoAuth = uni.getStorageSync('haveUserInfoAuth')
    console.log('页面参数', options,api)
    // to=dynamicDetails-dynamicId=205扫码进来带参方式
    // options.scene = 'salesId=386-to=carShow-id=89-wxacode'
    var scene = decodeURIComponent(options.scene)
    // let iswxacode = scene.indexOf('-wxacode') > -1
    let scenecs = ['salesId', 'to', 'id', 'dynamicId', 'isArt', 'aid']
    if (scene) {
      for (let i in scenecs) {
        let iobj = scenecs[i]
        let value = this.GetQueryString(scene, iobj)
        if (value) {
          options[iobj] = value
        }
      }

    }
    if (options.salesId) {
      app.globalData.salesId = options.salesId
    }

 let code =   await login.checkLogin(api)
 if(code == 1){
	 //需要绑定手机号
	 console.log('没有绑定过，需要授权手机号')
	 // this.isShowPhoto = true 
	 this.goPage(options)
 }else{
	 this.goPage(options)
 }
 console.log('code',code)

   
  },
  methods: {  
	  // async getPhoneNumber(e) {
	  // 	let {
	  // 		detail
	  // 	} = e
	  // 	console.log('getPhoneNumber===============',detail.encryptedData, detail.iv)
	  // 	// api.userBind
		 // await login.userBind(api,detail.encryptedData,detail.iv)
	  // },
	  // stop() {
	  // 	console.log('stop')
	  // },
	goPage(options){
		let cs = ''
		let url = '/pages/index'
		for (let i in options) {
		  cs += `${i}=${options[i]}&`
		}
		if (options.to) {
		  if (options.to == 'ddxq') {//动态详情页面
		    options.to = 'dynamicDetails'
		  } else if (options.to == 'xcsfq') {//新春送福气页面
		    options.to = 'moneyActivity'
		  }
		  cs = cs.substr(0, cs.length - 1)
		  url = `/pages/${options.to}?${cs}`
		}
		uni.reLaunch({url})
	},
	  
    GetQueryString(str, name) {
      var reg = new RegExp("(^|-)" + name + "=([^-]*)(-|$)");
      var r = str.match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    }
  }
}
</script>

<style lang="less">
</style>
