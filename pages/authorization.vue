<template>
	<view>
		<loading ref="loading"></loading>
<!--		<view class="authorization" v-if="isUserInfoPage">-->
<!--			<view class="authorization-pop">-->
<!--				<button class="getUserInfo-btn" lang="zh_CN" @getuserinfo="getWxUserInfoButton" open-type="getUserInfo"></button>-->
<!--			</view>-->
<!--		</view>-->
	</view>
</template>

<script>
	import login from '@/units/login'
	import api from '@/public/api/index'
	import distance from '@/units/distance'
	let app = getApp()
	export default {
		data() {
			return {}
		},
		async onLoad(options) {
			this.$refs.loading.changeLoading(true);
      app.globalData.haveUserInfoAuth = uni.getStorageSync('haveUserInfoAuth')
      app.globalData.getUserData = uni.getStorageSync('getUserData')
			console.log('页面参数', options)
			// to=dynamicDetails-dynamicId=205扫码进来带参方式
			// options.scene = 'salesId=386-to=carShow-id=89-wxacode'
			var scene = decodeURIComponent(options.scene)
			// let iswxacode = scene.indexOf('-wxacode') > -1
			let scenecs = ['salesId','to','id','dynamicId','isArt','aid']
			if(scene){
				for(let i in scenecs){
					let iobj = scenecs[i]
					let value = this.GetQueryString(scene,iobj)
					if(value){
						options[iobj] = value
					}
				}

			}
			if(options.salesId){
				app.globalData.salesId = options.salesId
			}
			let loginJson = await login.login()
			if(!app.globalData.wxUserInfo){
				// await this.getWxUserInfo()

			}
			if (app.globalData.haveUserInfoAuth) {
			  console.log('decryptUserInfo',app.globalData.haveUserInfoAuth)
				let info = app.globalData.getUserData
				await api.saveWXuserInfo({
					encryptedData:info.encryptedData,
					iv:info.iv,
					rawData:info.rawData,
					signature:info.signature
				})
			}

			if(!app.globalData.getUserData){
				let {data} = await api.getUser()
				app.globalData.getUserData = data
			}
			// if(!app.globalData.pocketUserInfo){
			// 	await api.getPocketUserInfo()
			// }
			if(!app.globalData.currentLocation.wxPosition){
				let position = await distance.getLocation()
				console.log('position==================',position)
				if(position){
					let cs = `${position.longitude},${position.latitude}`
					let cityData = await api.getIpAreaCoord(cs)
          console.log('cityData',cityData)
					app.globalData.currentLocation.cityData = cityData
					app.globalData.currentLocation.wxPosition = position
				}
			} else {
				app.globalData.currentLocation.cityData = {
					"city": "重庆市",
					"cityCode": "500000",
					"error": "",
					"pro": "重庆市",
					"proCode": "500000",
					"region": "江北区",
					"regionCode": "500105"
				}
			}
			let cs = ''
			let url = '/pages/index'
			for(let i in options){
				cs+=`${i}=${options[i]}&`
			}
			if(options.to){
				if(options.to == 'ddxq'){//动态详情页面
					options.to = 'dynamicDetails'
				}else if(options.to == 'xcsfq'){//新春送福气页面
					options.to = 'moneyActivity'
				}
				cs = cs.substr(0,cs.length-1)
				url = `/pages/${options.to}?${cs}`
			}
			uni.reLaunch({ url })
		},
		methods: {
			GetQueryString (str,name) {
				var reg = new RegExp("(^|-)" + name + "=([^-]*)(-|$)");
				var r = str.match(reg);
				if (r != null) return unescape(r[2]); return null;
			}
		}
	}
</script>

<style lang="less">
@import '@/static/less/public.less';
.authorization{
    &-pop{
        .setbg(560rpx,750rpx,'sq.png');
        .pa(50%,50%);
        transform: translate(-50%,-50%);
        margin-top: -100rpx;
        border-radius: 20rpx;
    }
    .getUserInfo-btn{
        height:88rpx;
        width: 360rpx;
        position: absolute;
        left: 100rpx;
        bottom: 40rpx;
        background: none;
        &:after{
            display: none;
        }
    }
}
</style>
