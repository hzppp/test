<template> 
    <view>
	<userBand @loginSuccess='getStoragePhone' ></userBand>
    <view class="yuyue" v-if="currentDealer.id">
        <pop ref="pop"></pop>
        <image mode="widthFix" src="../static/images/yuyue_banner.png" />
        <view class="content">
            <view class="title">预约试驾</view>
  
            <view class="list models">
                <view class="list-title">城市</view>
                <view class="select" @tap="goChooseCity">{{currentCity.name}}</view>
                <view class="arrow"></view>
            </view>
            <view class="list models">
                <view class="list-title">地区</view>
                <view class="select" @tap="goChooseRegion">{{currentRegion.name}}</view>
                <!-- <i class="clean-btn" v-if="currentRegion.id" @tap.stop="cleanRegion"></i> -->
                <view class="arrow"></view>
            </view>
            <view class="list models">
                <view class="list-title">经销商</view>
                <view class="select" @tap="changDealers">
                    {{currentDealer.name?currentDealer.name:"暂无对应经销商"}}
                </view>
                <view class="arrow" v-show="currentDealer.name"></view>
            </view>
			  <picker @change="bindMultiPickerChange" :value="index" :range="serialGroups"  range-key="name">   
		<!-- 	<picker @change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange" :value="selectIndex"
				mode="multiSelector" :range="[serialGroups]" range-key="name"> -->
			<view class="list models">
					<view class="list-title">车型</view>
					<view class="select">{{serialData.name}}</view>
			        <view class="arrow"></view>
			</view>
			</picker>
            <view class="list models" android:focusable="true" android:focusableInTouchMode="true">
                <view class="list-title">手机号</view>
              <!--  #ifndef MP-TOUTIAO  -->
              	 <input class="select" :always-embed="true" :focus="isFocus"  v-if="getPhoneBtn == true ||  TOUTIAO == 'TOUTIAO'" pattern="[0-9]*" placeholder="请输入11位手机号码" @input="checkInfo()" v-model="phoneNum" maxlength="11"/>
              <!-- #endif -->
              <!--  #ifdef MP-TOUTIAO  -->
              	 <input class="select" :always-embed="true" :focus="isFocus"  v-if="getPhoneBtn == true ||  TOUTIAO == 'TOUTIAO'" pattern="[0-9]*" placeholder="请授权手机号码" @input="checkInfo()" v-model="phoneNum" maxlength="11" disabled="true"/>
              <!-- #endif -->
				<button class="getPhoneBtn" v-if="getPhoneBtn == false && TOUTIAO != 'TOUTIAO'" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber($event)">您的手机号码（点击授权免手写）</button>
            </view>
            <view class="list models" v-if="smsCodeShow">
                <view class="list-title">验证码</view>
                <input class="select" :always-embed="true" placeholder="请输入验证码" v-model="codeNum" @input="checkInfo"/>
                <view class="get-code" v-if="timeDownFalg" @tap="getCode">{{isFirst?"获取验证码":"重新发送"}}</view>
                <view class="downcount" v-else>{{downNum}}s</view>
            </view>
            <view class="btn-area" >
                <view class="tit">提交后经销商会尽快与您联系</view>
                <button class="btn" @tap="yuYue" :class="{'origin':isAllSelect}">立即预约</button>
            </view>
        </view>
		<pyBoomV></pyBoomV>
    </view>
	
    <view v-if="!serialData.id && isNoData" class="no-data">暂无数据</view>
	</view>
</template>
 
<script>
import api from '@/public/api/index'
import pop from '@/components/apop/aPop'
import distance from '@/units/distance'
import login from '@/units/login'
import pyBoomV from '@/components/pyBoomV/pyBoomV' 
import userBand from '@/components/userBand/userBand'
let app = getApp()

//埋点标识字段
const trackAttribute={
    nearStore:{
        btnFrom:"最近门店预约试驾",
        pageFrom:"首页"
    },
    moreDealer:{
        btnFrom:"最近门店列表预约试驾",
        pageFrom:"最近门店页"
    }
}
/* *
* 倒计时默认时间
*/
const COUNTDOWN = 60

    export default {
        components:{pop,pyBoomV,userBand},
        data() {
            return {
                phoneNum: '', //手机号码
                codeNum: '', //验证码
                timeDownFalg: true, //验证码倒计时标识
                timer: null, //倒计时
                downNum: COUNTDOWN, //倒计时秒数
                isFirst: true, //是否是第一次发送

                title: 'picker',
                // cityList: [], //城市列表
                dealersList: [], //经销商列表
                test: '默认全局城市广州test',
                // cityIndex: 71, //城市默认下标(广州)
                dealersIndex:0, //经销商下标
                isAllSelect: false, //信息是否已经全部完成
				gochoiseCity:false,
				show:false,
                serialGroups:[], // 车系列表
                serialData: {},// 车系详情
                
                currentCity:{
					name:'',
					proId:'',
					id:'',
					countryId:''
				}, //当前选择的城市

                currentDealer: {}, //当前经销商

                currentRegion: {}, //当前选择的地区

                // currentModelId: "", //当前车型id

                getPhoneBtn: false,
                isFocus:false,
                isNoData:false,
				TOUTIAO:'',
				smsCodeShow: false,
                from:""
            }
        },
        watch: {
            currentCity(n) {
				this.$gdp('YCZ_chooseCity',{'YCZ_city_var':n.name})
				if(this.gochoiseCity){
				   this.reqDealersList(n.id)  	
				}
                
            },
            currentRegion(n) {
                this.$gdp('YCZ_cityProperChoice',{'YCZ_cityProper_var':n.name})
				if(this.gochoiseCity){
				   this.reqDealersList(this.currentCity.id,n.id)  
				}
            
            },
			phoneNum(n){
                if(n.length > 11){
                    this.phoneNum = n.substring(0,11)
                }else if(n.length==11){
                    //YCZ_手机号输入
					this.$gdp('YCZ_iphoneInput')
				}
			  this.checkInfo()
			},
			currentDealer(n){
                //YCZ_经销商选择
				this.$gdp('YCZ_distributorChoice',{'YCZ_distributorName_var':n.name})
			}
				

        },
		computed: {
			selectIndex() {
				let index = this.serialGroups.findIndex(item => item.id == this.serialData.item )
				console.log('坐标地址是',index)
				return [index]
			}
		},
        onShow() {
			console.log("into nearDeal")
            this.checkInfo()
        },
        async onLoad(options) {

            console.log('111111options :>> ', options);
           await login.checkLogin(api)
           await login.checkOauthMobile(api)
			
			// #ifdef MP-TOUTIAO
			 this.TOUTIAO = 'TOUTIAO'
			// #endif
			
            this.getStoragePhone()
            this.from = options.from
			if(options.nearDealer){
				this.currentDealer = JSON.parse(options.nearDealer)
				await this.reqSerialScreenList()
                if(this.from){
                    this.$gdp('YCZ_leaveAsseleavetsPageView',{
                        YCZ_sourceButtonName_var:trackAttribute[this.from].btnFrom,
                        YCZ_sourcePage_var:trackAttribute[this.from].pageFrom,
                        YCZ_sourceCarModel_var:this.serialData.name,
                        YCZ_sourceCarSeries_var:"-"
                    })
                }
				// console.log('currentDealer',this.currentDealer,this.currentCity)
			}
            
            
        },
		async onShareAppMessage() {
            let title = "长安汽车预约试驾"
            let path = `pages/NearDealerYuyuePage?nearDealer=${JSON.stringify(this.currentDealer)}&cityId=${this.currentCity.id}&proId=${this.currentCity.proId}&cityName=${this.currentCity.name}&from=${this.from}`
			const {code,data} = await api.fetchSerialDetail({sgId:this.serialData.pcSerialGroupId})
			let imageUrl = ""
			if(code ===1) {
				imageUrl=data.picCoverUrl
			}
            console.log({path})
            return {
                title: title,
                path: path,
                imageUrl: imageUrl
            }
        },
        methods: {
			async reqSerialScreenList() {
			    try{
			    	let res = await api.listByDealer({
			    		dealerId: this.currentDealer.id
			    	})
			    	if (res.code == 1) {
			    		let dealer = res.data.dealer
			    		console.log('经销商id', dealer)
			    		this.currentCity.proId = dealer.provinceId
			    		this.currentCity.name = dealer.city
			    		this.currentCity.id = dealer.cityId
			    		this.currentCity.countryId = dealer.countryId;
			    		this.serialGroups = res.data.serialGroups
						this.currentRegion.name = dealer.country
						this.currentRegion.id = dealer.countryId
			    		
						this.serialData = res.data.serialGroups[0]?res.data.serialGroups[0]:{}
                        //车型选择埋点
                        this.$gdp( 'YCZ_CarModelChoice',{
                            'YCZ_carModel_var':this.serialData.name,
                            'YCZ_carSeries_var':'-'
                        })
						console.log('经销商id', this.serialData)
			    	} else {
			    		this.currentCity.proId = '1000000022'
			    		this.currentCity.name = '重庆市'
			    		this.currentCity.id = '1000000262'
			    		this.currentCity.countryId = '1000002813'
			    	}
					this.checkInfo()
			    }catch(e){
			    	this.currentCity.proId = '1000000022'
			    	this.currentCity.name = '重庆市'
			    	this.currentCity.id = '1000000262'
			    	this.currentCity.countryId = '1000002813'
			    }
			
			},

            getStoragePhone() {
				console.log('登录成功触发')
				let phone = uni.getStorageSync('userPhone');
                if(phone) {
                    this.phoneNum = phone
                    this.getPhoneBtn = true
                }
            },
            async getPhoneNumber(e) {
				let {detail} = e
				if (detail.iv) {
                    
                    this.$gdp('YCZ_phoneGrantPermissions')
                    
                    try {
                    	uni.showLoading({
                            title: '正在加载...'
                        })
                        let {data} = await api.decryptPhone(detail.encryptedData, detail.iv)
                        if (data && data.phoneNumber) {
                            uni.setStorageSync('userPhone', data.phoneNumber)
                            this.phoneNum = data.phoneNumber						
					    }
                    } catch (error) {
                        uni.showToast({
                            icon:"none",
                            title:"手机授权失败"
                        })
                        this.isFocus = true
                    }finally {
                        uni.hideLoading()
                    }
				}else {
                    this.isFocus = true
                }
				this.getPhoneBtn = true
			},
            //检测信息是否齐全
            checkInfo() {
			if (this.phoneNum.length == 11 && this.phoneNum != uni.getStorageSync('userPhone')) {
								this.smsCodeShow = true
							} else {
								this.smsCodeShow = false
							}
			if(this.phoneNum  && this.currentCity.id && ((this.phoneNum != uni.getStorageSync('userPhone') && this.codeNum) || this
								.phoneNum == uni.getStorageSync('userPhone')) && this.currentDealer.id) {
			    this.isAllSelect = true
			}else {
			    this.isAllSelect = false
			}
			 
            },
            cleanRegion() {
                this.currentRegion = {}
            },

    
            //获取验证码
            async getCode() {
                let reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
                if(!reg.test(this.phoneNum)) return uni.showToast({
                    title:"请输入正确的手机号码",
                    icon:"none"
                })
                this.timeDownFalg = false
                this.isFirst = false
                this.timer = setInterval(()=>{
                    this.downNum--
                    if(this.downNum == 0) {
                        this.timeDownFalg = true
                        this.downNum = COUNTDOWN
                        clearInterval(this.timer)
                    }
                },1000)
                try {
                    const res = await api.fetchCode({mobile:this.phoneNum})
                } catch (error) {
                    console.error(error)
                }
            },

            //立即预约
            async yuYue() {

                //YCZ_留资按钮点击埋点
				this.$gdp('YCZ_leaveAssetsButtonClick',{
                    'YCZ_carModel_var':this.serialData.name,
                    'YCZ_mobile_var':this.phoneNum,
                    'YCZ_province_var':'-',
                    'YCZ_city_var':this.currentCity.name,
                    'YCZ_distributorName_var':this.currentDealer.name
                })
                if(!this.currentDealer.id) return uni.showToast({
                    title:"请先选择经销商",
                    icon:"none"
                })
                let reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
                if(!reg.test(this.phoneNum)) return uni.showToast({
                    title:"请输入正确的手机号码",
                    icon:"none"
                })
                if(!this.codeNum && this.smsCodeShow) return uni.showToast({
                    title:"请输入正确的验证码",
                    icon:"none"
                })
                
                try {
                    uni.showLoading({
                        title: '正在加载...',
                        mask:true
                    })
                    const res = await api.submitClue({
                        areaId:this.currentRegion.id || "",
                        cityId:this.currentCity.id,
                        mobile:this.phoneNum,
                        provinceId:this.currentCity.proId || this.currentCity.provinceId ,
                        serialGroupId:this.serialData.pcSerialGroupId,
                        source:2,
                        sourceId:1,
                        smsCode:this.codeNum,
                        dealerId:this.currentDealer.id || "",
                        sourceId:this.serialData.id
                    })
                    if(res.code === 1) {
                        //YCZ_留资单提交成功埋点
                        let sourcePage = getCurrentPages().length>1?getCurrentPages()[getCurrentPages().length-2].route:"-"
						this.$gdp( 'YCZ_leaveListSubmitSuccess',{
                            'YCZ_sourcePage_var':sourcePage,
                            'YCZ_carModel_var':this.serialData.name,
                            'YCZ_mobile_var':this.phoneNum,
                            'YCZ_province_var':'-',
                            'YCZ_city_var':this.currentCity.name,
                            'YCZ_distributorName_var':this.currentDealer.name
                        })

						// #ifdef MP-WEIXIN
						 this.$refs.pop.isShow = true
						// #endif
						
						// #ifdef MP-TOUTIAO
						this.$children[1].isShow = true
						// #endif
                      
                    }else {
                        return uni.showToast({
                            title:res.msg,
                            icon:"none",
							duration:500
							
                        })
                    }
                } catch (error) {
                    console.error(error)
                }finally {
					setTimeout(() => {
						uni.hideLoading()
					}, 500)
                    
                }
            },
            //经销商点击，判断提示
            changDealers(){
                if(!this.currentCity.name) {
                    return uni.showToast({
                        title:"请选择城市",
                        icon:"none"
                    })
                }
				if(!this.currentDealer.name){
					return
				}
                // /this.currentCity.id
                uni.navigateTo({
                  url: `/pages/ChooseDealer?cityId=${this.currentCity.id}&dealersId=${this.currentDealer.id}&districtId=${this.currentRegion.id}`
                })
            },
            //选择城市
            goChooseCity(){
                // this.currentDealer = {}
                this.currentRegion = {}
				this.gochoiseCity = true
                uni.navigateTo({
                    url: "/pages/ChooseCity?name="+ this.currentCity.name
                })
            },
            //选择地区
            goChooseRegion(){
				this.gochoiseCity = true
                if(!this.currentCity.name) {
                    return uni.showToast({
                        title:"请先选择城市",
                        icon:none
                    })
                }
                // this.currentDealer = {}
                uni.navigateTo({
                    url: `/pages/ChooseRegion?cityId=${this.currentCity.id}&name=${this.currentRegion.name}`
                })
            },
            //选择车系
            goChooseSerial() {
                uni.navigateTo({
                    url: `/pages/ChooseSerial?type=yuyue&dealersId=${this.currentDealer.id}`
                })
            },
            //获取经销商列表
            async reqDealersList(cityId,districtId) {
                try {

                    uni.showLoading({
                        title: '正在加载...',
                        mask:true
			        })
                    if(!districtId) {
                        const {code,data} = await api.fetchDealerListByCityId({cityId})
                        if(code === 1 && data.length) {
                            this.dealersList = distance.sortDealersByDistance(data)
                            this.currentDealer = this.dealersList[0]
                        }else {
                            // this.currentDealer = {}
                        }
                    }else {
                        const {code,data} = await api.fetchDealerListByCityId({cityId,districtId})
                        if(code === 1 && data.length) {
                          this.dealersList = distance.sortDealersByDistance(data)
                          this.currentDealer = this.dealersList[0]
                        }else {
                            // this.currentDealer = {}
                        }
                    }
                } catch (error) {
                    console.error(error)
                }finally {
                    uni.hideLoading()
                }
            },

            cityPickerChange: function(e) {
                console.log('this.cityList[e.target.value].id :>> ', this.cityList[e.target.value].id);
                this.currentRegion = {}
                // this.reqDealersList(this.cityList[e.target.value].id)
                this.cityIndex = e.target.value
                this.test = ''
                this.checkInfo()
            },
            dealersPickerChange: function(e) {
                // this.dealersIndex = e.target.value
                this.checkInfo()
            },
			bindMultiPickerChange(e){
				console.log(e)
				let {
					detail
				} = e
				console.log(e)
				this.serialData = this.serialGroups[detail.value[0]]
                //车型选择埋点
                this.$gdp( 'YCZ_CarModelChoice',{
                    'YCZ_carModel_var':this.serialData.name,
                    'YCZ_carSeries_var':'-'
                })
				console.log('serialData',this.serialData)
			}
        },
    }
</script>

<style lang="scss" scoped>
.no-data {
    padding: 32rpx 0;
    text-align: center;
}
.yuyue {
	image {
		width: 100%;
        vertical-align: middle;
	}
    .content {
        padding: 32rpx 32rpx 10rpx;
        box-sizing: border-box;
        .getPhoneBtn {
            background-color: transparent;
            color: #777777;
            flex: 1;
            margin-left: 20rpx;
            height: 100%;
            display: flex;
            align-items: center;
            font-size: 34rpx;
        }
        .title {
            font-size: 40rpx;
            font-weight: 800;
        }
        .list {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 110rpx;
            border-bottom: 2rpx solid #EBEBEB;
            .list-title {
                width: 130rpx;
            }
            .select {
                flex: 1;
                margin-left: 20rpx;
                height: 100%;
                display: flex;
                align-items: center;
                font-size: 34rpx;
            }
            .get-code {
                color: #fa8943;
                font-size: 26rpx;
            }
            .downcount {
                color: #999999;
                font-size: 28rpx;
            }
            .arrow {
                width: 12rpx;
                height: 12rpx;
                transform: rotate(45deg);
                border-top: 2rpx solid #999999;
                border-right: 2rpx solid #999999;
            }
            .clean-btn {
                width: 40rpx;
                height: 40rpx;
                background-image: url("../static/images/close_btn.png");
                background-color: #999999;
                border-radius: 50%;
                background-size: cover;
                margin-right: 20rpx;
            }
        }
        .btn-area {
            text-align: center;
            margin-top: 24rpx;
            .tit {
                color: #999999;
                font-size: 24rpx;
                margin: 24rpx 0;
            }
            .btn {
                height: 88rpx;
                border-radius: 88rpx;
                line-height: 88rpx;
                color: #ffffff;
                background-color: #cdcdcd;
                font-size: 32rpx;
                &.origin {
                    background-color: #fa8943;
                }
            }
        }
    }
}
</style>