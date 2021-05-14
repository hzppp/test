<template>
	<view class="nearby">
    <button v-if="!withoutUserInfoAuth" class="getUserInfo_name_info_mask_body" @tap="getWxUserInfoAuth"></button>
    <form-pop ref="formpop"></form-pop>
	        <view class="head-tap-nav">
	            <block v-for="(ietm,index) in ['附近销售','附近4S']" :key="index">
	                <view @tap="tabSwiper(index)" :class="'item ' + (current == index ? 'current':'')">{{item}}</view>
	            </block>
	            <picker @change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange" mode="multiSelector" :range="province" range-key="text" class="select-city">
	                <view>{{selectCity ||indexCity.name}}</view>
	            </picker>
	        </view>
	        <view class="slide">
	            <swiper class="swiper" circular :current="current" @change="getSwiperCurrent">
	                <swiper-item class="nearby-sales">
	                    <scroll-view :lower-threshold="lowerthreshold"  @scrolltolower="getnearbySale" class="sales-list" scroll-y scroll-with-animation>
	                        <view class="box" v-if="nearbySalesList.length>0" v-for="(item,index) in nearbySalesList" :key="index">
	                            <image class="sales-head" :src="item.headUrl" mode="scaleToFill" lazy-load="true"></image>
	                            <view class="sale-name-position">
	                                <text class="name">{{item.name}}</text>
	                                <text :class="'position ' + (item.type == 1 && 'v')">{{item.position}}</text>
	                            </view>
	                            <view class="sale-dealer">{{item.shortName}}</view>
	                            <view class="sale-label">
	                                <view class="db" v-if="item.distance">距离{{item.distance}}km</view>
	                                <view class="db">{{item.dateText}}</view>
	                                <view class="db" v-if="item.serviceCount>0">服务客户{{item.serviceCount}}人</view>
	                            </view>
	                            <view class="call-btn" @tap="saleCallPhone(index)"></view>
	                            <view class="im-btn"></view>
	                            <navigator class="im-btn-mask"  target='miniProgram' app-id='wx6986c1a258647aae' :path="'pages/chat?salesId=' + item.salesId" hover-class="none" redirect></navigator>
	                        </view>
	                        <view  v-if="nearbySalesList.length==0" class="sales-list-none"></view>
	                        <view class="nearby-sales-zw"></view>
	                    </scroll-view>
	                </swiper-item>
	                <swiper-item class="nearby-4s">
	                    <scroll-view @scrolltolower="getDealersList" :lower-threshold="lowerthreshold" class="nearby-4s-list" scroll-y scroll-with-animation>
	                        <view :class="'box ' + (item.salesList.length > 0 ? '':'none-sales')" v-for="(item,index) in dealersList" @tap="toWapdealerPage(index)">
	                            <view class="d-name">
	                                {{item.name}}
	                            </view>
	                            <view class="d-address">
	                                <text class="dz dz-icon" @tap.stop="openLocation(index)">{{item.address}}</text>
	                            </view>
	                            <button class="get-dj" open-type="getPhoneNumber" @tap.stop="getPhoneNumberstop" @getphonenumber="getPhoneNumber(index)" v-if="!phone"></button>
	                            <view v-else class="get-dj" @tap.stop="dealerForm(index)"></view>
	                            <view class="call-dh" @tap.stop="callPhone(index)"></view>
	                            <view class="d-4s-label">
	                                <text class="db" v-if="item.distance>0">距离{{item.distance}}km</text>
	                                <view class="db">
	                                    {{item.nameListRange == 0 && "售本市" || item.nameListRange == 1 && "售本省" || item.nameListRange == 2 && "售全国" || item.nameListRange == 3 && "售多市"}}
	                                </view>
	                            </view>
	                            <view class="d-4s-sales" v-if="item.salesList.length > 0">
	                                <navigator @tap.stop="getPhoneNumberstop" class="navigator"  target='miniProgram' app-id='wx6986c1a258647aae' :path="'pages/chat?salesId=' + item.salesList[0].salesId" hover-class="none" redirect>
	                                    <image class="sales-head" :src="item.salesList[0].headUrl" mode="scaleToFill" lazy-load="true"></image>
	                                    <view class="sale-name">{{item.salesList[0].name}}</view>
	                                </navigator>
	                                <view v-if="item.salesList.length > 1" class="more-sale-btn" @tap.stop="salesPop(index)">更多销售</view>
	                                <view v-else  class="more-sale-btn none-jt">共1位销售</view>
	                            </view>
	                        </view>
	                        <view  v-if="dealersList.length==0" class="nearby-4s-list-none"></view>
	                        <view class="nearby-4s-zw"></view>
	                    </scroll-view>
	                </swiper-item>
	            </swiper>
	        </view>
	        <view class="sales-pop" v-if="isSalesPop">
	            <view class="sales-pop-content">
	                <view class="sales-pop-tit">
	                    销售顾问-{{salePopList[0].shortName}}
	                    <view class="sales-pop-close-btn" @tap="salesPopHide"></view>
	                </view>
	                <view class="sales-pop-items">
	                    <view class="sales-pop-item" v-for="(item,index) in salePopList">
	                        <image class="sales-pop-head" :src="item.headUrl" mode="scaleToFill" lazy-load="false"></image>
	                        <view class="sales-pop-text">
	                            <view class="sales-pop-sale-name">{{item.name}}</view>
	                            <view class="sales-pop-sale-label">
	                                <view class="label-date">{{item.dateText}}</view>
	                                <view class="label-number" v-if="item.serviceCount>0">服务客户{{item.serviceCount}}人</view>
	                            </view>
	                        </view>
	                        <view class="sales-pop-btn1" @tap="popCallPhone(index)"></view>
	                        <navigator class="sales-pop-btn2"  target='miniProgram' app-id='wx6986c1a258647aae' :path="'pages/chat?salesId=' + item.salesId" hover-class="" redirect></navigator>
	                    </view>
	                </view>
	            </view>
	        </view>
	    </view>
</template>

<script>
	import login from '@/units/login'
	import api from '@/public/api/index'
	import shouquan from '@/units/shouquan'

	import formpop from '@/components/formpop/formpop'
	  import distance from '@/units/distance'

	let app = getApp()
	export default {
		components: {
		        'form-pop':formpop
		    },

    mixins: [shouquan],
		data() {
			return {
				selecti1:0,
				        phone:false,
				        isSalesPop:false,
				        salePopList:[],
				        selectIndex:"",
				        selectCity:"",
				        isChangeCityType:false,//是否已经改变过城市
				        province:[],
				        indexCity:{},
				        selectArr:[{regionId:0}],
				        lowerthreshold:200,
				        isLoad4sList:true,//是否加载中
				        load4sPageNumber:1,//页码
				        getNearbySalesListPageNumber:1,
				        isgetNearbySalesList:true,
				        dealersList:[],
				        nearbySalesList:[],
				        current:0
			}
		},
		async onShow(){
		        this.resetdata()
		        api.getUser()
		        let currentLocation = app.globalData.currentLocation
		        if(currentLocation){
		            {
		            this.indexCity = currentLocation.cityData
		            let province = await api.getProvince()
		            for(let i in province.data){
		                province.data[i]['text'] = province.data[i].provinceName
		            }
		            this.province[0] = province.data
		            await this.getCity(province.data[this.selecti1].provinceId)
		            }
		        }
		        this.phone = app.globalData.pocketUserInfo.phone
		        this.swiperChange()

		    },
		    async onLoad(options) {
		        /* let currentLocation = app.globalData.currentLocation
		        if(currentLocation){
		            {
		            this.indexCity = currentLocation.cityData
		            let province = await api.getProvince()
		            console.log(province)
		            for(let i in province.data){
		                province.data[i]['text'] = province.data[i].provinceName
		            }
		            this.province[0] = province.data
		            await this.getCity(province.data[0].provinceId)
		            }
		        }
		        this.swiperChange() */
		        // this.getDealers()
		    },
			onShareAppMessage(){
			        let title = '奥迪东海汇：优选销售顾问为您服务'
			        let path = `pages/authorization?to=nearby`
			        if(app.globalData.salesId){
			            path+=`&salesId=${app.globalData.salesId}`
			        }
			        // let imageUrl = 'https://www1.pcauto.com.cn/zt/yqdzhzq/xcxshare/sales.jpg'
					let imageUrl = 'https://www1.pcauto.com.cn/zt/gz20210125/audi/xcx/img/xcxshare.png'
			        return {
			            title: title,
			            path: path,
			            imageUrl: imageUrl
			        }
			    },
		methods: {
			dealerForm(i){
			            let obj = this.dealersList[i]
			            console.log(obj)
			            this.$invoke('form-pop','formShow','form','dealer',obj)
			        },
			        async getPhoneNumber(i,e){
			            let obj = this.dealersList[i]
			            let {detail={}} = e
			            // this.isSalesPop = false
			            if(detail.iv){
			                let {data} = await api.decryptPhone(detail.encryptedData,detail.iv)
			                app.globalData.pocketUserInfo.phone = data.phoneNumber
			                this.phone = data.phoneNumber
			            }
			            // this.$invoke('form-pop','formShow','form','activity',this.content)
			            this.$invoke('form-pop','formShow','form','dealer',obj)

			        },
			        getPhoneNumberstop(){
			            console.log('-')
			        },
			        bindMultiPickerChange(e){
			            let {detail=[0,0]} = e
			            let i1 = detail.value[0] || 0
			            let i2 = detail.value[1] || 0
			            this.selecti1 = i1
			            this.selectIndex = this.province[1][i2]
			            this.selectCity = this.selectIndex.regionName
			            this.selectArr.push(this.selectIndex)
			            this.isChangeCity()
			            {
			                // 改变默认定位省市
			                let currentLocation = app.globalData.currentLocation
			                currentLocation.cityData.cityId = this.selectIndex.regionId
			                currentLocation.cityData.name = this.selectIndex.text
			                currentLocation.cityData.proId = this.province[0][i1].provinceId
			                currentLocation.cityData.pro = this.province[0][i1].text
			            }
			        },
			        bindMultiPickerColumnChange(e){
			                let {detail} = e
			                if(detail.column == 0){
			                    let index = this.province[0][detail.value]
			                    this.getCity(index.provinceId)
			                }
			        },
			        getSwiperCurrent(e){
			            let {
			                detail
			            } = e
			            this.current = detail.current
			            this.swiperChange()
			        },
			        tabSwiper(i){
			            this.current = i
			            this.swiperChange()
			        },
			        getDealersList(){
			            this.getDealers()
			        },
			        getnearbySale(){
			            this.getNearbySalesList()
			        },
			        callPhone(i){
			            let obj = this.dealersList[i]
			            let phone = obj.phone
			            uni.makePhoneCall({
			                phoneNumber:phone
			            })
			        },
			        popCallPhone(i){
			            let obj = this.salePopList[i]
			            let phone = obj.mobile
			            uni.makePhoneCall({
			                phoneNumber:phone
			            })
			        },
			        saleCallPhone(i){
			            let obj = this.nearbySalesList[i]
			            uni.makePhoneCall({
			                phoneNumber:obj.mobile
			            })
			        },
			        salesPop(i){
			            let currentDealer = this.dealersList[i]
			            let list = currentDealer.salesList
			            if(list.length > 0){
			                for(let i in list){
			                    let obj = list[i]
			                    obj.dateText = this.rDateString(obj.loginTime)
			                }
			                console.log(list)
			                this.isSalesPop = true
			                this.salePopList = list
			            }
			        },
			        salesPopHide(){
			            this.isSalesPop = false
			        },
			        openLocation(i){
			            let obj = this.dealersList[i]
			            let currentLocation = app.globalData.currentLocation
			            if(currentLocation.wxPosition.wsq){
			                let xy = distance.bd_decrypt(obj.mapY, obj.mapX)
			                obj.mapX = xy[1]
			                obj.mapY = xy[0]
			            }
			            console.log(obj)
			            uni.openLocation({
			                latitude:obj.mapY,
			                longitude:obj.mapX,
			                scale:18,
			                name:obj.name,
			                address:obj.address
			            })
			        },
			        toWapdealerPage(i){
			            let obj = this.dealersList[i]
			            console.log(obj)
			            let vurl  = escape('https://m.pcauto.com.cn/auto/'+obj.id+'/?fromPcautoApp=1')
			            let url = `/pages/webview?webURL=${vurl}`
			            uni.navigateTo({
			                url:url
			            })
			        },
					resetdata(){
					        this.selectCity = ''
					        this.isLoad4sList = true//是否加载中
					        this.load4sPageNumber = 1//页码
					        this.getNearbySalesListPageNumber = 1
					        this.isgetNearbySalesList = true
					        this.dealersList = []
					        this.nearbySalesList = []

					    },
						async getCity(id){
						        let {data} = await api.getRegionByProvince(id)
						        for(let i in data){
						            data[i]['text'] = data[i].regionName
						        }
						        this.province[1] = data

						        return data
						    },
						    toFirst(list,index){
						        return list.unshift(list.splice(index , 1)[0])
						    },
						    // sales
						    async getNearbySalesList(){
						        if(this.isgetNearbySalesList){
						            this.isgetNearbySalesList = false
						            let currentLocation = app.globalData.currentLocation
						            let cityId = this.selectIndex.regionId || currentLocation.cityData.cityId
						            let salesId = app.globalData.salesId || 0
						            // salesId = 147530
						            let {data} = await api.getSalesList({
						                manufacturerId: 1,
						                orderByRanking:1,
						                pageNum:this.getNearbySalesListPageNumber,
						                pageSize:10,
						                regionId:cityId,
						                salesId:salesId
						            })

						            if(data.list.length>0){
						                this.isgetNearbySalesList = true
						            }
						            this.getNearbySalesListPageNumber++
						            let list = data.list || []
						            if(!currentLocation.wxPosition.wsq){
						                list = distance.sortByDistance(currentLocation.wxPosition.latitude, currentLocation.wxPosition.longitude, list) || []
						            }
						            if(salesId > 0 && this.getNearbySalesListPageNumber == 2){
						                for(let iv in list){
						                    let ivIndex
						                    let ivobj = list[iv]
						                    if(ivobj.salesId == salesId){
						                        ivIndex = iv
						                    }
						                    if(ivIndex){
						                        this.toFirst(list,ivIndex)
						                    }
						                }
						            }
						            let time = new Date().getTime()
						            for(let i in list){
						                let obj = list[i]
						                obj.dateText = this.rDateString(obj.loginTime)
						            }
						            let a = [...this.nearbySalesList,...list]
						            this.nearbySalesList = a

						            console.log(this.nearbySalesList)
						        }
						    },
						    rDateString(loginTime){
						        let time = new Date().getTime()
						        let t = 86400000
						        let text
						        let j = time - loginTime
						        if(j > t){
						            text = '1天前回复'
						        }else{
						            let v = Math.floor(j/1000/60/60)
						            text = v+"小时前回复"
						        }
						        return text
						    },
						    // 4s
						    async getDealers(){
						        if(this.isLoad4sList){
						            this.isLoad4sList = false
						            let currentLocation = app.globalData.currentLocation
						            let cityId = this.selectIndex.regionId || currentLocation.cityData.cityId
						            console.log(this.selectIndex.regionId)
						            let res =await api.getDealers(cityId,this.load4sPageNumber)
						            if(res.size != 0){
						                this.isLoad4sList = true
						            }
						            this.load4sPageNumber++
						            let list = res.data || []
						            if(!currentLocation.wxPosition.wsq){
						                list = distance.sortByDistance(currentLocation.wxPosition.latitude, currentLocation.wxPosition.longitude, list) || []
						            }
						            // let list = distance.sortByDistance(currentLocation.wxPosition.latitude, currentLocation.wxPosition.longitude, res.data) || []
						            if(list.length>0){//获取销售信息
						                let ids = ''
						                for(let i in list){
						                    let obj = list[i]
						                    obj.salesList=[]
						                    ids+=obj.id+','
						                }
						                let {data} =await api.getSalesList({
						                    dealerIds:ids
						                })
						                for(let i in data.list){
						                    let listobj = data.list[i]
						                    for(let j in list){
						                        let jobj = list[j]
						                        if(listobj.dealerId == jobj.id){
						                            jobj.salesList.push(listobj)
						                        }
						                    }
						                }
						            }
						            let a = [...this.dealersList,...list]
						            this.dealersList = a

						        }
						    },
						    isChangeCity(){
						        let len = this.selectArr.length
						        let prev = this.selectArr[len-2]
						        let current = this.selectIndex
						        if(prev.regionId != current.regionId){
						            this.isgetNearbySalesList = true
						            this.getNearbySalesListPageNumber = 1
						            this.nearbySalesList = []
						            //
						            this.isLoad4sList = true
						            this.load4sPageNumber = 1
						            this.dealersList = []
						            this.swiperChange()
						        }
						    },
						    swiperChange(){
						        if(this.current == 0 && this.nearbySalesList.length == 0){
						            this.getNearbySalesList()
						        }
						        if(this.current == 1 && this.dealersList.length == 0){
						            this.getDealers()
						        }
						    }
		}
	}
</script>
<style lang="less">
@import '@/static/less/nearby.less';
</style>
