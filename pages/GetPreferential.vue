<template>
    <view>
        <view  class="get-preferential" v-if="serialData.id">
        <pop ref="pop"></pop>
        <!-- 顶部提示S -->
        <view class="top-tit">填写手机号等信息即可免费获得车型优惠</view>
        <!-- 顶部提示E -->
        <!-- 头部信息S -->
        <view class="head-info">
            <image :src="serialData.picHeadUrl" />
            <view class="text-dec" @tap="changeSerial">
                <view class="title">{{serialData.name}}</view>
                <view class="price">指导价:    {{serialData.price}}万</view>
            </view>
            <view class="arrow"></view>
        </view>
        <!-- 头部信息E -->
        <view class="content">
            <!-- 手机号S -->
            <view class="list models" android:focusable="true" android:focusableInTouchMode="true">
                <view class="list-title">手机号</view>
                <input class="select" :focus="isFocus" v-if="getPhoneBtn == true" pattern="[0-9]*" placeholder="请输入11位手机号码" @input="checkInfo" v-model="phoneNum" maxlength="11" />
				<button class="getPhoneBtn" v-if="getPhoneBtn == false" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber($event)">您的手机号码（点击授权免手写）</button>
            </view>
            <!-- 手机号E -->
            <!-- 验证码S -->
            <view class="list models">
                <view class="list-title">验证码</view>
                <input class="select" placeholder="请输入验证码"  @input="checkInfo" v-model="codeNum" />
                <view class="get-code" v-if="timeDownFalg" @tap="getCode">{{isFirst?"获取验证码":"重新发送"}}</view>
                <view class="downcount" v-else>{{downNum}}s</view>
            </view>
            <!-- 验证码E -->
            <!-- 城市选择S -->
            <view class="list models">
                <view class="list-title" >城市</view>
                <view class="select" @tap="goChooseCity">
                    {{currentCity.name?currentCity.name:''}}
                </view>
                <view class="arrow"></view>
            </view>
            <!-- 城市选择E -->
            <!-- 经销商S -->
            <view class="list models">
                <view class="list-title">经销商</view>
                <view class="select" @tap="changDealers">
                    {{currentDealer.name? currentDealer.name : ''}}
                </view>
                <view class="arrow"></view>
            </view>
            <!-- 经销商E -->
            <view class="btn-area">
                <view class="tit">提交后经销商会尽快与您联系</view>
                <button class="btn" @tap="yuYue" :class="{'origin':isAllSelect}">立即提交</button>
            </view>
        </view>
        </view>
        <view v-if="isNoData && !serialData.id" class="no-data">暂无数据</view>
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
let reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/

    export default {
        components: {pop},
        data() {
            return {
                phoneNum: '', //手机号码
                codeNum: '', //验证码
                timeDownFalg: true, //验证码倒计时标识
                timer: null, //倒计时
                downNum: COUNTDOWN, //倒计时秒数
                isFirst: true, //是否是第一次发送

                title: 'picker',
                cityList: [], //城市列表
                dealersList: [], //经销商列表

                currentCaraSerial: '', //当前的车系名字
                isAllSelect: false, //信息是否已经全部完成

                currentCity:{}, //当前选择的城市

                currentDealer: {}, //当前经销商
                serialData: {}, //车系详情
                serialId:"", //车系id

                getPhoneBtn: false,

                isFocus:false,

                isNoData:false,
            }
        },
       async onLoad(options) {
            uni.showLoading({
                title: '正在加载...',
                mask:true
			})
            this.serialId = options.serialId || ""
            this.reqSerialDetail(options.serialId)
            await distance.getLocation()
            const cityData = app.globalData.currentLocation.selectedCityData
            this.$set(this.currentCity,'id',cityData.cityId )
            this.$set(this.currentCity,'name',cityData.city )
            this.$set(this.currentCity,'provinceId',cityData.proId )
        },
        methods: {
            async getPhoneNumber(e) {
				let {detail} = e
				if (detail.iv) {
                    try {
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
                    }
				}else {
                    this.isFocus = true
                }
                this.getPhoneBtn = true 
			},
            //车系详情
            async reqSerialDetail(sgId) {
                try {
                    const {code,data} = await api.fetchSerialDetail({sgId})
                    if(code ===1 ) {
                        this.serialData = data
                    }else {
                        this.isNoData = true
                    }
                } catch (error) {
                    console.error(error)
                } finally {
                    uni.hideLoading()
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
					url: "/pages/ChooseDealer?cityId="+ this.currentCity.id
				})
            },
            //切换车系
            changeSerial() {
                uni.redirectTo({
					url: "/pages/ChooseSerial?pages=GetPreferential"
				})
            },
            //获取经销商列表
            async reqDealersList(cityId) {
                try {
                    const {code,data} = await api.fetchDealersList({cityId})
                    if(code === 1) {
                        this.dealersList = data
                    }
                } catch (error) {
                    console.error(error)
                }
            },

            //获取验证码
            async getCode() {
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
                    console.log('res :>> ', res);
                } catch (error) {
                    console.error(error)
                }
            },
            //检测信息是否齐全
            checkInfo() {
                if(this.phoneNum && this.codeNum && this.currentCity) {
                    this.isAllSelect = true
                }else {
                    this.isAllSelect = false
                }
            },
            //选择城市
            goChooseCity(){
                this.currentDealer = {}
                uni.navigateTo({
					url: "/pages/ChooseCity"
				})
            },
            //立即预约
            async yuYue() {
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
                        cityId:this.currentCity.id,
                        mobile:this.phoneNum,
                        provinceId:this.currentCity.provinceId,
                        serialGroupId:this.serialId,
                        source:3,
                        sourceId:this.currentDealer.id,
                        smsCode:this.codeNum,
                        dealerId:this.currentDealer.id || "",
                        sourceId:this.serialId
                    })
                    console.log('res :>> ', res);
                    if(res.code === 1) {
                        this.$refs.pop.isShow = true
                        console.log('res :>> ', res);
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
            cityPickerChange: function(e) {
                this.reqDealersList(this.cityList[e.target.value].id)
                this.cityIndex = e.target.value
                this.test = ''
                this.checkInfo()
            },
            dealersPickerChange: function(e) {
                this.dealersIndex = e.target.value
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
.get-preferential {
    .getPhoneBtn {
        background-color: transparent;
        color: #777777;
        flex: 1;
        margin-left: 20rpx;
        height: 100%;
        display: flex;
        align-items: center;
        font-size: 35rpx;
    }
    .top-tit {
        width: 100%;
        height: 64rpx;
        background-color: #f5f5f5;
        font-size: 24rpx;
        color: #999999;
        padding: 0 26rpx;
        line-height: 64rpx;
    }
    .head-info {
        padding: 40rpx 40rpx;
        display: flex;
        align-items: center;
        image {
            width: 180rpx;
            height: 136rpx;
            vertical-align: middle;
        }
        .text-dec {
            margin-left: 20rpx;
            height: 136rpx;
            flex: 1;
            display: flex;
            flex-direction: column;
            color: #333333;
            justify-content: space-between;
            .title {
                font-size: 32rpx;
                font-weight: 600;
            }
            .serial {
                font-size: 24rpx;
            }
            .price {
                font-size: 24rpx;
                color: #999999;
            }
        }
    }
    .content {
        padding: 32rpx 32rpx 10rpx;
        box-sizing: border-box;
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
                width: 100rpx;
            }
            .select {
                flex: 1;
                margin-left: 20rpx;
                height: 100%;
                display: flex;
                align-items: center;
            }
            .get-code {
                color: #fa8943;
                font-size: 26rpx;
            }
            .downcount {
                color: #999999;
                font-size: 28rpx;
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
                font-size: 32rpx;
                background-color: #cdcdcd;
                &.origin {
                    background-color: #fa8943;
                }
            }
        }
    }
    .arrow {
        width: 12rpx;
        height: 12rpx;
        transform: rotate(45deg);
        border-top: 2rpx solid #999999;
        border-right: 2rpx solid #999999;
    }
}
</style>