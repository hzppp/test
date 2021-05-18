<template>
    <view class="yuyue">
        <pop ref="pop"></pop>
        <image mode="widthFix" :src="serialData.picHeadUrl" />
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
                <view class="list-title">经销商</view>
                <view class="select" @tap="changDealers">
                    {{currentDealer.name?currentDealer.name:""}}
                </view>
                <view class="arrow"></view>
            </view>
            <view class="list models">
                <view class="list-title">手机号</view>
                <input class="select" pattern="[0-9]*" placeholder="请输入11位手机号码" @input="checkInfo" v-model="phoneNum" maxlength="11" />
            </view>
            <view class="list models">
                <view class="list-title">验证码</view>
                <input class="select" placeholder="请输入验证码" v-model="codeNum" @input="checkInfo" />
                <view class="get-code" v-if="timeDownFalg" @tap="getCode">{{isFirst?"获取验证码":"重新发送"}}</view>
                <view class="downcount" v-else>{{downNum}}s</view>
            </view>
            <view class="btn-area">
                <view class="tit">提交后经销商会尽快与您联系</view>
                <button class="btn" @tap="yuYue" :class="{'origin':isAllSelect}" :disabled=!isAllSelect>立即预约</button>
                <view class="tit">点击按钮即视为同意《个人信息保护声明》</view>
            </view>
        </view>
    </view>
</template>

<script>
import api from '@/public/api/index'
import pop from '@/components/apop/aPop'

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

                currentModelId: "", //当前车型id

            }
        },
        onLoad(options) {
            this.reqSerialDetail(options.serialId)
        },
        methods: {
            //检测信息是否齐全
            checkInfo() {
                if(this.phoneNum && this.codeNum && this.currentCity) {
                    this.isAllSelect = true
                }else {
                    this.isAllSelect = false
                }
            },

            //获取城市列表
            // async reqAllCityList() {
            //     try {
            //         const {code,data:{letterGroup}} = await api.fetchAllCityList()
            //         let tempArr = []
            //         if(code === 1) {
            //             for(let k in letterGroup) {
            //                letterGroup[k].map(v=>{
            //                    tempArr.push(v)
            //                })
            //             }
            //         }
            //         this.cityList = tempArr
            //         this.currentCity = tempArr[this.cityIndex]
            //     } catch (error) {
            //         console.error(error)
            //     }
            // },

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
            //获取车系详情
            async reqSerialDetail(sgId) {
                try {
                    const {code,data} = await api.fetchSerialDetail({sgId})
                    if(code ===1) {
                        this.serialData = data
                        this.currentCaraSerial = data.name
                    }
                } catch (error) {
                    console.error(error)
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
                    console.log('res :>> ', res);
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
                    const res = await api.postYuYueDrive({
                        cityId:1,
                        mobile:14716166366,
                        provinceId:1,
                        serialGroupId:2,
                        source:2,
                        sourceId:1
                    })
                    if(res.code === 1) {
                         this.$refs.pop.isShow = true
                    }
                    console.log('res :>> ', res);
                } catch (error) {
                    console.error(error)
                }
                console.log('this.currentModelId :>> ', this.currentModelId);
                console.log('this.currentCity :>> ', this.currentCity);
                console.log('this.currentDealer :>> ', this.currentDealer);
                console.log('this.phoneNum :>> ', this.phoneNum);
                console.log('this.codeNum :>> ', this.codeNum);


            },
            //经销商点击，判断提示
            changDealers(){
                if(!this.currentCity.id) {
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
            //选择城市
            goChooseCity(){
                uni.navigateTo({
					url: "/pages/ChooseCity"
				})
            },
            //选择车系
            goChooseSerial() {
                uni.navigateTo({
					url: "/pages/ChooseSerial?pages=YuyuePage"
				})
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
.yuyue {
	image {
		width: 100%;
        vertical-align: middle;
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