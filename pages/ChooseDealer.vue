<template>
    <view class="choose-dealer">
        <view class="dealer-item" v-for="(item,index) in dealersList" :key="index" @tap="goBack(item)">
            <view class="title" :class="{'isSelect':currentDealerId==item.id}">
                {{item.name}}
            </view>
            <view class="address" :class="{'isSelect':currentDealerId==item.id}">
                {{item.address}}
            </view>
        </view>
        <view class="no-dealer" v-if="dealersList.length === 0 && isComplete">暂无对应经销商</view>
    </view>
</template>

<script>
import api from '@/public/api/index'

    export default {
        data() {
            return {
                dealersList: [], //经销商列表
                currentDealerId:"", //
                isComplete: false,
            }
        },
        methods: {
            onLoad(options) {
                console.log('options :>> ', options);
                this.currentDealerId = options.dealersId
                if(options.districtId != "undefined") {
                    this.reqDealersList(options.cityId,options.districtId)
                }else {
                    this.reqDealersList(options.cityId,"")
                }
            },
            //获取经销商列表
            async reqDealersList(cityId,districtId) {
                try {
                    uni.showLoading({
                        title: '正在加载...',
                        mask:true
			        })
                    const {code,data} = await api.fetchDealersList({cityId,districtId})
                    if(code === 1 && data.length) {
                        this.dealersList = data
                    }else {
                        this.isComplete = true
                    }
                } catch (error) {
                    this.isComplete = true
                    console.error(error)
                }finally {
                    uni.hideLoading()
                }
            },

            //经销商点击返回预约页
            goBack(item) {
                this.$store.commit("changDealer",item)
            	this.currentCity = item.name
				// console.log('app. :>> ', app.globalData);
                let pages = getCurrentPages();  //获取所有页面栈实例列表
                let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
                prevPage.$vm.currentDealer = item;   //修改上一页data里面的searchVal参数值为1211
                uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
                    delta: 1
                });
            }
        },
    }
</script>

<style lang="scss" scoped>
.choose-dealer {
    padding: 32rpx;
    .dealer-item {
        border-bottom: 2rpx solid #EBEBEB;
        margin-bottom: 20rpx;
        .title {
            color: #333333;
            font-size: 32rpx;
            font-weight: bold;
            &.isSelect {
                color: #FA8845 !important;
            }
        }
        .address {
            color: #999999;
            font-size: 24rpx;
            margin-top: 24rpx;
            margin-bottom: 32rpx;
            &.isSelect {
                color: #FA8845 !important;
            }
        }
     
    }
    .no-dealer {
        text-align: center;
        padding: 100rpx;
    }
}
</style>