<template>
	<view class="cars-page">
        <view class="image-wrap" v-if="serialData.videoUrl && btnWrapShow" >
            <video  object-fit="cover" lazy-load :src='serialData.videoUrl' :poster="serialData.videoCoverUrl" style="vertical-align:top;" @play="playVideo()"></video>
            <!-- <i class="video-icon"></i> -->
        </view>
        <!-- 按钮 -->
        <!-- <btnWrap :ids="ids" :serialId="serialId" v-if="serialData.videoUrl"></btnWrap> -->


        <view class="image-wrap" v-if="btnWrapShow">
			<image src='../static/images/lookcarVRIcon.png' class="vsIcon" mode="scaleToFill" @tap="toVR" v-if="serialData.hasPhoto == 1"></image>
            <image mode='widthFix' lazy-load :src='serialData.picHeadUrl' />
		    <!-- 按钮 -->
		     <btnWrap :ids="ids" :serialId="serialId" :serialData="serialData"></btnWrap>
        </view>

      
   

        <view class="image-wrap" v-for="(item,index) in serialData.picUrlArray" :key="index">
            <image mode='widthFix' lazy-load :src='item' style="height:auto" />
        </view>
		<!--  #ifndef MP-TOUTIAO  -->
		<view class="btn-wrap">
		    <button class="yuyue-btn" @tap="goYuyue">
		        预约试驾
		    </button>
			<button class="yuyue-btn1" @tap="goXundijia">
			    获取实时底价
			</button>
		</view>
		<!-- #endif -->
		<!--  #ifdef MP-TOUTIAO  -->
		<view class="btn-wrap">
			<button class="yuyue-btn2" @tap="goXundijia">
			    询底价
			</button>
		</view>
		<view class="get-pfl-popv" v-if="getpflshow">
			<get-pfl ref='pfl' :serialId='serialId' :currentCity='currentCity' class="pfl-content" @getpflclose='getpflshow=false'></get-pfl>
		</view>
		<!-- #endif -->
		
	


	</view>
</template>

<script>

import btnWrap from '@/components/lookCar/LookCar';
import api from '@/public/api/index'
import domain from '@/configs/interface';
import getpfl from '@/components/get-preferential/get-pfl'
import distance from '@/units/distance'
let app = getApp()

export default {
    components: {btnWrap,
	'get-pfl':getpfl
	},
    data() {
        return {
            serialData: {}, //车系详情
            ids:'', //车系对应的前两个车型的id集合字符串，
            serialId: "" ,//车系id
			id:'',
			currentCity:{},
			getpflshow:false,
			btnWrapShow:true
			
			

        }
    },
	watch:{
	  currentCity(n) {
		  if(n){
			  n.num = Math.floor(Math.random() * 10000)
			 this.currentCity = n  
		  }
	  
	  },	
	},
   async onLoad(options) {
		console.log('options')
		this.id = options.id
		
		
		
		// #ifdef MP-TOUTIAO
		  await distance.getLocation()
		  const cityData = app.globalData.currentLocation.selectedCityData
		  console.log('cityData',cityData)
		  this.currentCity.id =  cityData.cityId
		  this.currentCity.name =  cityData.city
		  this.currentCity.provinceId =  cityData.proId
		  if(options.adDealerId){
			 app.globalData.adDealerId  =  options.adDealerId
			 this.btnWrapShow = false
		  }
		// #endif
        await this.reqSerialDetail(options.id)
		
		
    },
	methods: {
        async reqSerialDetail(sgId) {
            try {
                const {code,data} = await api.fetchSerialDetail({sgId})
                console.log('data :>> ', data);
                if(code ===1 ) {
                    this.serialData = data
					console.log("datadata",data)
                    this.serialId = data.pcSerialGroupId

                    this.reqModelsList(data.pcSerialGroupId)
                    uni.setNavigationBarTitle({
                        title:data.name
                    })
                }
            } catch (error) {
                console.error(error)
            }
            let sourcePage = getCurrentPages().length>1?getCurrentPages()[getCurrentPages().length-2].route:"-"
			
			// 进入车辆详情页面时触发埋点
			// console.log("this.serialData",this.serialData)
			this.$gdp('YCZ_carDetailPageView',{
                'YCZ_carModel_var':this.serialData.name,
                'YCZ_carSeries_var':'-',
                'YCZ_sourcePage_var':sourcePage})
			
        },
		//开始播放视频 触发埋点
		playVideo(){
			//车辆详情页视频播放时触发
			this.$gdp('YCZ_videoClick',{
                'YCZ_videoID_var':'-',
                'YCZ_videoName_var':'-',
                'YCZ_carModel_var':this.serialData.name,
                'YCZ_carSeries_var':"-"
            })
			
		},
        //预约试驾
        goYuyue(){
			// #ifdef MP-WEIXIN
			  wx.aldstat.sendEvent('预约试驾点击')
			// #endif
          
            uni.navigateTo({
                url:"/pages/YuyuePage?serialId=" + this.serialId +"&from=carDetDrive"
            })
			
			
			this.$gdp('YCZ_leaveAssetsEntranceButtonClick', { "YCZ_sourcePage_var": '车辆详情页', "YCZ_sourceButtonName_var": '预约试驾' })
			
        },
		// vr 图库
		toVR(){
		let openId =  app.globalData.wxUserInfo.openId;	
		let url1 = domain.getAPI('VRouter') + '?sgId=' + this.serialId +'&openId=' + openId
		console.log(url1)
		let path = '/pages/webview?webURL=' + encodeURIComponent(url1)
		
		console.log(path)
		uni.navigateTo({
		  url: path,
		})	
		},
		goXundijia(){
			// #ifdef MP-WEIXIN
			 wx.aldstat.sendEvent('车系页获取实时底价点击')
			 uni.navigateTo({
			 	url:'/pages/GetPreferential?' + 'serialId='+this.serialId+"&from=carDetPrice"
			 })
			// #endif
			
			
			// #ifdef MP-TOUTIAO
		 	this.getpflshow = true
			// #endif
			
		
			
			
			this.$gdp('YCZ_leaveAssetsEntranceButtonClick', { "YCZ_sourcePage_var": '车辆详情页', "YCZ_sourceButtonName_var": '获取实时底价' })
			
		
			
			
			
		},
        //跳转VR
        goVr(){
            uni.navigateTo({
                //                                     内饰id            车型id        车型id             城市名              城市id
                // url:`/pages/vrInFrame/vrInFrame?sid=${vrInId}&serialId=${pcid}&pcid=${pcid}&cityName=${nowCity}&cityId=${nowCityId}``
            })
        },
        async reqModelsList(sgId) {
            try {
                const {code,data} = await api.fetchModelsList({sgId})
                let ids = []
                if(code === 1 ) {
                    data.map((v,i) => {
                        if( i < 3 && v.pcModelId) {
                            ids.push(v.pcModelId)
                        }
                    })
                }
                this.ids = ids.join(",")
            } catch (error) {
                console.error(error)
            }
        },
		onShareAppMessage() {
				let title = this.serialData.name
				
				// #ifdef MP-WEIXIN
				let path = `pages/LookCar?id=${this.id}`
				// #endif
				// #ifdef MP-TOUTIAO
				let path = `pages/LookCar?id=${this.id}&adDealerId=changan`
				// #endif
				let imageUrl = this.serialData.picCoverUrl
				return {
					title: title,
					path: path,
					imageUrl: imageUrl
				}
			},

	}
}
</script>

<style lang="scss">
.cars-page {
	min-height: 100vh;
    padding-bottom: 161rpx;
    .image-wrap {
        position: relative;
        width: 100%;
        z-index: 1;
        image {
            vertical-align: middle;
            width: 100%;
        }
        video {
            width: 100%;
        }
        // .video-icon {
        //     position: absolute;
        //     width: 120rpx;
        //     height: 120rpx;
        //     top: 50%;
        //     left: 50%;
        //     transform: translate(-50%,-50%);
        //     background-image: url('../static/images/videoPlayBtn.png');
        //     z-index: 2;
        // }
        .vr-icon {
            position: absolute;
            top: 20rpx;
            right: 20rpx;
            width: 100rpx;
            height: 100rpx;
            line-height: 50rpx;
            text-align: center;
            border-radius: 50%;
            background-image: url("../static/images/vr_btn.png");
            background-size: cover;
            
        }
    }
	.vsIcon{
		position: absolute;
		width: 100rpx !important;
		height: 100rpx !important;
		top: 20rpx;
		right: 20rpx;
		
		box-sizing: border-box;
	}
    .btn-wrap {
        position: fixed;
        width: 100%;
        height: 161rpx;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        background-color: #ffffff;
        z-index: 99;
        display: flex;
        align-items: center;
        justify-content: center;
		// background-color: #007AFF;
        .yuyue-btn {
            width: 330rpx;
            height: 88rpx;
            border-radius: 88rpx;
            line-height: 88rpx;
			margin-left: 32rpx;
			margin-right: 26rpx;
			font-size: 32rpx;
            color: #ffffff;
            background-color: #FA8845;
        }
		.yuyue-btn1 {
			width: 330rpx;
			height: 88rpx;
			border-radius: 88rpx;
			line-height: 88rpx;
			font-size: 32rpx;
			color: #fa8943;
			background-color: #ffffff;
			border-style:solid;
			border-width: 2rpx;
			border-color:  #fa8943;
		}
		.yuyue-btn2 {
			width: 686rpx;
			height: 88rpx;
			border-radius: 88rpx;
			line-height: 88rpx;
			margin-left: 32rpx;
			margin-right: 26rpx;
			font-size: 32rpx;
			color: #ffffff;
			background-color: #FA8845;
		}
    }
	.get-pfl-popv{
	    position: fixed;
		bottom: 0;
		left: 0;
		width: 750rpx;
	    height: 100vh;
		z-index: 1000;
		background-color: rgba(0,0,0,0.5);
		 
		 .pfl-content{
			 position: absolute;
			 bottom: 0;
			 left: 0;
			 width: 750rpx;
			 // height:844rpx;
		 }
	}
}
</style>
