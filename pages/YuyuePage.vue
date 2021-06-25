<template> 
    <view>
	<userBand @loginSuccess='getStoragePhone' ></userBand>
    <view class="yuyue" v-if="serialData.id">
        <pop ref="pop"></pop>
        <image mode="widthFix" src="../static/images/yuyue_banner.png" />
        <view class="content">
            <view class="title">预约试驾</view>
            <view class="list models">
                <view class="list-title">车型</view>
                <view class="select" @tap="goChooseSerial">{{currentCaraSerial}}</view>
                <view class="arrow"></view>
            </view>
            <view class="list models">
                <view class="list-title">城市</view>
                <view class="select" @tap="goChooseCity">{{currentCity.name}}</view>
                <view class="arrow"></view>
            </view>
            <view class="list models">
                <view class="list-title">地区</view>
                <view class="select" @tap="goChooseRegion">{{currentRegion.name}}</view>
                <i class="clean-btn" v-if="currentRegion.id" @tap.stop="cleanRegion"></i>
                <view class="arrow"></view>
            </view>
            <view class="list models">
                <view class="list-title">经销商</view>
                <view class="select" @tap="changDealers">
                    {{currentDealer.name?currentDealer.name:"暂无对应经销商"}}
                </view>
                <view class="arrow" v-show="currentDealer.name"></view>
            </view>
            <view class="list models" android:focusable="true" android:focusableInTouchMode="true">
                <view class="list-title">手机号</view>
                <input class="select" :always-embed="true" :focus="isFocus"  v-if="getPhoneBtn == true" pattern="[0-9]*" placeholder="请输入11位手机号码" @input="checkInfo" v-model="phoneNum" maxlength="11" />
				<button class="getPhoneBtn" v-if="getPhoneBtn == false" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber($event)">您的手机号码（点击授权免手写）</button>
            </view>
            <view class="list models">
                <view class="list-title">验证码</view>
                <input class="select" :always-embed="true" placeholder="请输入验证码" v-model="codeNum" @input="checkInfo" />
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

                currentCaraSerial: '', //当前的车系名字
                test: '默认全局城市广州test',
                // cityIndex: 71, //城市默认下标(广州)
                dealersIndex:0, //经销商下标
                isAllSelect: false, //信息是否已经全部完成

                serialId:'', //参数车系id
				
				show:false,

                serialData: {},// 车系详情
                
                currentCity:{}, //当前选择的城市

                currentDealer: {}, //当前经销商

                currentRegion: {}, //当前选择的地区

                // currentModelId: "", //当前车型id

                getPhoneBtn: false,
                isFocus:false,
                isNoData:false,
            }
        },
        watch: {
            currentCity(n) {
                this.reqDealersList(n.id)  
            },
            currentRegion(n) {
                this.reqDealersList(this.currentCity.id,n.id)  
            },
			serialId(n){
				 this.reqDealersList(this.currentCity.id, this.currentRegion.id)    
			}			

        },
        onShow() {
			if(this.show && this.serialId){
				 this.reqSerialDetail(this.serialId)
				 this.show = false
			}
			 // console.log('22222options :>> ', this.serialId);
            this.checkInfo()
        },
        async onLoad(options) {
            // console.log('111111options :>> ', options);
            // await login.checkLogin(api)
            this.getStoragePhone()
            this.serialId = options.serialId || ""
			if(this.serialId == ""){
				this.reqSerialScreenList();
			}
            if(options.cityId) {
                await distance.getLocation()
                const cityData = app.globalData.currentLocation.selectedCityData
                this.$set(this.currentCity,'provinceId',cityData.proId )
                this.$set(this.currentCity,'id',options.cityId)
                this.$set(this.currentCity,'name',decodeURI(options.cityName))
            }else {
                await distance.getLocation()
                const cityData = app.globalData.currentLocation.selectedCityData
                this.$set(this.currentCity,'id',cityData.cityId )
                this.$set(this.currentCity,'name',cityData.city )
                this.$set(this.currentCity,'provinceId',cityData.proId )
            }
            this.reqSerialDetail(options.serialId)
        },
        methods: {
			// 获取车型信息
			async reqSerialScreenList() {
			    try {
			        const {code,data} = await api.fetchSerialScreenList({showPrice:0})
			        if(code === 1) {
			          this.serialId = data[0].pcSerialGroupId
					  console.log(this.serialId,data[0])
					  this.reqSerialDetail(this.serialId )
			        }
			    } catch (error) {
			        console.error(error)
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
                if(this.phoneNum && this.codeNum && this.currentCity.id && this.currentDealer.id) {
                    this.isAllSelect = true
                }else {
                    this.isAllSelect = false
                }
            },
            cleanRegion() {
                this.currentRegion = {}
            },

            //获取车系详情
            async reqSerialDetail(sgId) {
				if(!sgId){
				  return
				}
                try {
                    uni.showLoading({
                        title: '正在加载...',
                        mask:true
                    })
                    const {code,data} = await api.fetchSerialDetail({sgId})
                    if(code ===1) {
                        this.serialData = data
                        this.currentCaraSerial = data.name
                    }
                } catch (error) {
                    console.error(error)
                } finally {
                    uni.hideLoading()
                }
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
                if(!this.currentDealer.id) return uni.showToast({
                    title:"请先选择经销商",
                    icon:"none"
                })
                let reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
                if(!reg.test(this.phoneNum)) return uni.showToast({
                    title:"请输入正确的手机号码",
                    icon:"none"
                })
                if(!this.codeNum) return uni.showToast({
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
                        provinceId:this.currentCity.provinceId,
                        serialGroupId:this.serialId,
                        source:2,
                        sourceId:1,
                        smsCode:this.codeNum,
                        dealerId:this.currentDealer.id || "",
                        sourceId:this.serialId
                    })
                    if(res.code === 1) {
                         this.$refs.pop.isShow = true
                    }else {
                        return uni.showToast({
                            title:res.msg,
                            icon:"none",
							duration:2000
							
                        })
                    }
                } catch (error) {
                    console.error(error)
                }finally {
					setTimeout(() => {
						uni.hideLoading()
					}, 2000)
                    
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
                  url: `/pages/ChooseDealer?cityId=${this.currentCity.id}&dealersId=${this.currentDealer.id}&districtId=${this.currentRegion.id}&serialId=${this.serialId}`
                })
            },
            //选择城市
            goChooseCity(){
                this.currentDealer = {}
                this.currentRegion = {}
                uni.navigateTo({
                    url: "/pages/ChooseCity?name="+ this.currentCity.name
                })
            },
            //选择地区
            goChooseRegion(){
                if(!this.currentCity.name) {
                    return uni.showToast({
                        title:"请先选择城市",
                        icon:none
                    })
                }
                this.currentDealer = {}
                uni.navigateTo({
                    url: `/pages/ChooseRegion?cityId=${this.currentCity.id}&name=${this.currentRegion.name}`
                })
            },
            //选择车系
            goChooseSerial() {
                uni.navigateTo({
                    url: "/pages/ChooseSerial?type=yuyue"
                })
            },
            //获取经销商列表
            async reqDealersList(cityId,districtId) {
                try {
					let pcSerialGroupId = this.serialId;
                    uni.showLoading({
                        title: '正在加载...',
                        mask:true
			        })
                    if(!districtId) {
                        const {code,data} = await api.fetchDealersList({cityId,pcSerialGroupId})
                        if(code === 1 && data.length) {
                            this.dealersList = data
                            this.currentDealer = data[0]
                        }else {
                            this.currentDealer = {}
                        }
                    }else {
                        const {code,data} = await api.fetchDealersList({cityId,districtId,pcSerialGroupId})
                        if(code === 1 && data.length) {
                            this.dealersList = data
                            this.currentDealer = data[0]
                        }else {
                            this.currentDealer = {}
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