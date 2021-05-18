<template>
    <view class="get-preferential">
        <!--提交弹窗 -->
        <pop ref="pop"></pop>
        <!-- 顶部提示S -->
        <view class="top-tit">填写手机号等信息即可免费获得车型优惠</view>
        <!-- 顶部提示E -->
        <!-- 头部信息S -->
        <view class="head-info">
            <image mode="heightFix" src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1361135963,570304265&fm=26&gp=0.jpg" />
            <view class="text-dec">
                <view class="title">长安</view>
                <view class="serial">2021款</view>
                <view class="price">指导价:    11:55万</view>
            </view>
            <view class="arrow"></view>
        </view>
        <!-- 头部信息E -->
        <view class="content">
            <!-- 手机号S -->
            <view class="list models">
                <view class="list-title">手机号</view>
                <input class="select" pattern="[0-9]*" placeholder="请输入11位手机号码" @input="checkInfo" v-model="phoneNum" maxlength="11" />
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
                <view class="list-title">城市</view>
                <view class="select">
                    <view class="uni-list">
                        <view class="uni-list-cell">
                            <view class="uni-list-cell-db">
                                <picker @change="cityPickerChange" :value="cityList[cityIndex]" :range="cityList" range-key="name">
                                    <view v-if="test">{{test}}</view>
                                    <view class="uni-input" v-else>{{cityList[cityIndex].name}}</view>
                                </picker>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="arrow"></view>
            </view>
            <!-- 城市选择E -->
            <!-- 经销商S -->
            <view class="list models">
                <view class="list-title">经销商</view>
                <view class="select">
                    <view class="uni-list">
                        <view class="uni-list-cell">
                            <view class="uni-list-cell-db">
                                <picker @change="dealersPickerChange" :value="cityList[dealersIndex]" :range="dealersList" range-key="name">
                                    <view class="uni-input">{{dealersList[dealersIndex].name}}</view>
                                </picker>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="arrow"></view>
            </view>
            <!-- 经销商E -->
            <view class="btn-area">
                <view class="tit">提交后经销商会尽快与您联系</view>
                <button class="btn" @tap="yuYue" :class="{'origin':isAllSelect}">立即提交</button>
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

                currentCaraSerial: 'qq', //当前的车系名字
                currentCity:{}, //当前选择的城市
                test: '默认全局城市广州test',
                cityIndex: 71, //城市默认下标(广州)
                isAllSelect: false, //信息是否已经全部完成
            }
        },
        onLoad() {
            this.reqAllCityList(0)
        },
        methods: {

            //获取城市列表
            async reqAllCityList() {
                try {
                    const {code,data:{letterGroup}} = await api.fetchAllCityList()
                    let tempArr = []
                    if(code === 1) {
                        for(let k in letterGroup) {
                           letterGroup[k].map(v=>{
                               tempArr.push(v)
                           })
                        }
                    }
                    this.cityList = tempArr
                    this.currentCity = tempArr[this.cityIndex]
                } catch (error) {
                    console.error(error)
                }
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
            getCode() {
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
            },
            //检测信息是否齐全
            checkInfo() {
                if(this.phoneNum && this.codeNum && this.currentCity) {
                    this.isAllSelect = true
                }else {
                    this.isAllSelect = false
                }
            },
            //立即预约
            yuYue() {
                if(!reg.test(this.phoneNum)) return uni.showToast({
                    title:"请输入正确的手机号码",
                    icon:"none"
                })
                if(!this.codeNum) return uni.showToast({
                    title:"请输入正确的验证码",
                    icon:"none"
                })
                this.$refs.pop.isShow = true
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
.get-preferential {
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