<template>
    <view class="c-btn-wrap">
        <button class="go-canpei" @tap="goCanPei">
            查看参数配置
        </button>
        <view class="bottom-btn-wrap">
            <button class="bottom-btn" @tap="goCalc">
                购车计算
            </button>
            <button class="bottom-btn" @tap="goSerialList">
                车型对比
            </button>
        </view>
    </view>
</template>

<script>

    export default {
        props:{
			serialData:{
				type: Object ,
				default: null
			},
			
            serialId: { //车系id
                type: String,
                default: ""
            },
            ids: {
                type: String,
                default: ""
            }
        },
		data() {
			return {
				
			}
		},
        onload(options) {
            this.feqSerialList()
        },
        onShow() {
            this.feqSerialList()
        },
		methods: {
			goCanPei() {
				// #ifdef MP-WEIXIN
				 wx.aldstat.sendEvent('查看参数配置点击')
				// #endif	
				uni.navigateTo({
					url:`/pages/canpei?navigateBack=1&compare=true&mids=${this.ids}&serialId=${this.serialId}`
				})
				
				
				this.$gdp('YCZ_viewParameterConfigureButtonClick',{'YCZ_carModel_var':this.serialData.name,
																		'YCZ_carSeries_var':this.serialData.pcSerialGroupName})
				
				
				
				this.$gdp('YCZ_modelParameterConfigureSummaryPageView',{'YCZ_sourcePage_var':'LookCar',
																		'YCZ_carModel_var':this.serialData.name,
																		'YCZ_carSeries_var':this.serialData.pcSerialGroupName})
			},
            goSerialList() {
				// #ifdef MP-WEIXIN
				 wx.aldstat.sendEvent('车型对比点击')
				// #endif	
                
                uni.navigateTo({
					url:`/pages/ChooseSerial?&vs=true&serialId=${this.serialId}`
				})
				
				//进入车型参配-参数概述页面时触发
				
				this.$gdp('YCZ_modelComparisonButtonClick',{'YCZ_carModel_var':this.serialData.name,
															'YCZ_carSeries_var':this.serialData.pcSerialGroupName})
            },
            goCalc() {
				// #ifdef MP-WEIXIN
				wx.aldstat.sendEvent('购车计算点击')
				// #endif	
                uni.navigateTo({
                    url:`/pages/calc?serialId=${this.serialId}`
                })
				

				
				this.$gdp('YCZ_purchaseVehicleButtonClick',{'YCZ_carModel_var':this.serialData.name,
																		'YCZ_carSeries_var':this.serialData.pcSerialGroupName})
				
				
				
				this.$gdp('YCZ_carBuyCalculatorPageView',{'YCZ_sourcePage_var':'LookCar',
																		'YCZ_sourceCarModel_var':this.serialData.name,
																		'YCZ_sourceCarSeries_var':this.serialData.pcSerialGroupName})
				
            },
		}
    }
</script>

<style lang="scss" scoped>
.c-btn-wrap {
	position: absolute;
    padding: 30rpx 32rpx;
	bottom: 0rpx;
	left: 0rpx;
	opacity: 1;
    .go-canpei {
        width: 686rpx;
        height: 88rpx;
        line-height: 88rpx;
		font-size: 32rpx;
        color:  #FFFFFF;
		border-style:solid;
        border-radius: 88rpx;
		border-width: 2rpx;
		border-color:  #FFFFFF;
        // background-color: #fff;
        margin-bottom: 24rpx;
		background-color: rgba($color: #FFFFFF, $alpha: 0);
    }
    .bottom-btn-wrap {
		// background: #007AFF;
        display: flex;
        justify-content: space-between;
        .bottom-btn {
            width: 330rpx;
            height: 88rpx;
            line-height: 88rpx;
            border-radius: 88rpx;
			border-style:solid;
            // background-color: #f5f5f5;
            color: #FFFFFF;
			border-width: 2rpx;
			border-color:  #FFFFFF;
            font-size: 32rpx;
			background-color: rgba($color: #FFFFFF, $alpha: 0);
        }
    }
}
</style>