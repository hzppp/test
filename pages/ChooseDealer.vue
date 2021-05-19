<template>
    <view class="choose-dealer">
        <view class="dealer-item" v-for="(item,index) in dealersList" :key="index" @tap="goBack(item)">
            <view class="title">
                {{item.name}}
            </view>
            <view class="address">
                {{item.address}}
            </view>
        </view>
    </view>
</template>

<script>
import api from '@/public/api/index'

    export default {
        data() {
            return {
                dealersList: [], //经销商列表
                currentDealer:{}, //
            }
        },
        methods: {
            onLoad(options) {
                this.reqDealersList(options.cityId)
            },
            //获取经销商列表
            async reqDealersList(cityId) {
                try {
                    const {code,data} = await api.fetchDealersList({cityId})
                    if(code === 1) {
                        this.dealersList = data
                        console.log('data :>> ', data);
                    }
                } catch (error) {
                    console.error(error)
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
        }
        .address {
            color: #999999;
            font-size: 24rpx;
            margin-top: 24rpx;
            margin-bottom: 32rpx;
        }
    }
}
</style>