<template>
    <view class="choose-region">
        <view class="region-title">
            <!-- 当前定位地区：<text>广州市</text><text>天河区</text> -->
        </view>
        <view class="region-item" :class="{'origin':currentRegionName == item.name}" v-for="(item,index) in regionList" :key="index" @tap="chooseRegion(item)">
            {{item.name}}
        </view>
    </view>
</template>

<script>
import api from '@/public/api/index'

    export default {
        data() {
            return {
                regionList: [], //地区列表
                currentRegionName:"" //当前选择的地区
            }
        },
        methods: {
            onLoad(options) {
                console.log('options :>> ', options);
                this.currentRegionName = options.name || ""
                this.reqRegionByCityId(options.cityId)
            },
            chooseRegion(item) {
                console.log('item :>> ', item);
                let pages = getCurrentPages();  //获取所有页面栈实例列表
                let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
                prevPage.$vm.currentRegion = item;   //修改上一页data里面的searchVal参数值为1211
                uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
                    delta: 1
                });
            },
            async reqRegionByCityId(cityId) {
                try {
                    uni.showLoading({
                        title: '正在加载...'
                    })
                    const {code,data} = await api.fetchDistrictListByCityId({cityId})
                    if(code === 1) {
                        this.regionList = data
                        console.log('data :>> ', data);
                    }
                } catch (error) {
                    console.error(error)
                }finally {
                    uni.hideLoading()
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
.choose-region {
    .region-title {
        font-size: 24rpx;
        color: #999999;
        line-height: 48rpx;
        padding-left: 36rpx;
        text {
            color: #333333;
            margin: 0 5rpx;
            font-weight: bold;
        }
    }
    .region-item {
        padding: 16rpx 0 16rpx 36rpx;
        font-size: 28rpx;
        color: #333333;
        &.origin {
            color: #fa8943;
        }
    }
}
</style>