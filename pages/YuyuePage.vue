<template>
    <view>
    <view class="yuyue" v-if="serialData.id">
        <pop ref="pop"></pop>
        <image mode="widthFix" src="http://img.pcauto.com.cn/images/upload/upc/tx/auto5/2102/02/c16/252303537_1612261476705.png" />
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
                <view class="arrow"></view>
            </view>
            <view class="list models">
                <view class="list-title">经销商</view>
                <view class="select" @tap="changDealers">
                    {{currentDealer.name?currentDealer.name:""}}
                </view>
                <view class="arrow"></view>
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
            <view class="btn-area">
                <view class="tit">提交后经销商会尽快与您联系</view>
                <button class="btn" @tap="yuYue" :class="{'origin':isAllSelect}" :disabled=!isAllSelect>立即预约</button>
            </view>
        </view>
    </view>
    <view v-if="!serialData.id && isNoData" class="no-data">暂无数据</view>
    </view>
</template>

<script>
import api from '@/public/api/index'
import pop from '@/components/apop/aPop'
import distance from '@/units/distance'
let app = getApp()


/* *
* 倒计时默认时间
*/
const COUNTDOWN = 60

    export default {
        components:{pop},
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
                console.log('n :>> ', n);
            }
        },
        async onLoad(options) {
            console.log('options :>> ', options);
            this.serialId = options.serialId || ""
            if(options.cityId) {
                this.$set(this.currentCity,'id',options.cityId)
                this.$set(this.currentCity,'name',cityData.cityName)
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
            async getPhoneNumber(e) {
				let {detail} = e
				if (detail.iv) {
                    try {
                    	uni.showLoading({
                            title: '正在加载...'
                        })
                        let {data} = await api.decryptPhone(detail.encryptedData, detail.iv)
                        if (data && data.phoneNumber) {
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
                if(this.phoneNum && this.codeNum && this.currentCity) {
                    this.isAllSelect = true
                }else {
                    this.isAllSelect = false
                }
            },
            //获取经销商列表
            async reqDealersList(cityId,districtId) {
                try {
                    const {code,data} = await api.fetchDealersList({cityId,districtId})
                    console.log('data :>> ', data);
                    if(code === 1) {
                        this.dealersList = data
                    }
                } catch (error) {
                    console.error(error)
                }
            },
            //获取车系详情
            async reqSerialDetail(sgId) {
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
                            icon:"none"
                        })
                    }
                } catch (error) {
                    console.error(error)
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
                // /this.currentCity.id
                uni.navigateTo({
                    url: `/pages/ChooseDealer?cityId=${this.currentCity.id}&dealersId=${this.currentDealer.id}&districtId=${this.currentRegion.id}`
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
                    url: "/pages/ChooseSerial?pages=YuyuePage"
                })
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