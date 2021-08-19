<template>
    <view class="choose-dealer">
        <view class="dealer-item" v-for="(item,index) in dealersList" :key="index" @tap="goBack(item)">
            <view class="title" :class="{'isSelect':currentDealerId==item.id}">
                {{item.name}}
            </view>
            <view class="address" :class="{'isSelect':currentDealerId==item.id}">
                 {{item.address?item.address:'暂无详细地址'}}
            </view>
			<view v-if="item.distance && item.distance != Infinity" class="distance">
				{{item.distance | formatThousand}}
			</view>
        </view>
        <view class="no-dealer" v-if="dealersList.length === 0 && isComplete">暂无对应经销商</view>
    </view>
</template>

<script>
import api from '@/public/api/index'
import distance from '@/units/distance'
    export default {
        data() {
            return {
                dealersList: [], //经销商列表
                currentDealerId:"", //
                isComplete: false,
				serialId:''
            }
        },
        methods: {
            onLoad(options) {
                console.log('options :>> ', options);
                this.currentDealerId = options.dealersId
				this.serialId = options.serialId
                if(options.districtId != "undefined") {
                    this.reqDealersList(options.cityId,options.districtId)
                }else {
                    this.reqDealersList(options.cityId,"")
                }
            },
            //获取经销商列表
            async reqDealersList(cityId,districtId) {
                try {
					let pcSerialGroupId = this.serialId;
                    uni.showLoading({
                        title: '正在加载...',
                        mask:true
			        })
                    let pam = {cityId,districtId};
                    if(pcSerialGroupId){
                    	pam = {cityId,districtId,pcSerialGroupId};
                    }
                    const {code,data} = await api.fetchDealerListByCityId(pam)				
                    if(code === 1 && data.length) {
                        this.dealersList = distance.sortDealersByDistance(data)
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
		filters: {
		    //m 转化
		    formatThousand (num) {
		       if(num > 1000){
				   return (num / 1000).toFixed(2)  + 'km'
			   }else{
				   return num + 'm'
			   }
		    }
		},
    }
</script>

<style lang="scss" scoped>
.choose-dealer {
    padding: 32rpx;
    .dealer-item {
		position: relative;
        border-bottom: 2rpx solid #EBEBEB;
        margin-bottom: 20rpx;
        .title {
            color: #333333;
            font-size: 32rpx;
            font-weight: bold;
			margin-right: 120rpx;
            &.isSelect {
                color: #FA8845 !important;
            }
			
        }
        .address {
            color: #999999;
            font-size: 24rpx;
            margin-top: 24rpx;
            margin-bottom: 32rpx;
			margin-right: 120rpx;
            &.isSelect {
                color: #FA8845 !important;
            }
        }
		.distance{
		   position:absolute;
		   font-size: 24rpx;
		   top:50% ;
		   height: 31rpx;
		   right: 25rpx;
		   margin-top: - 16rpx;
		   
		}
     
    }
    .no-dealer {
        text-align: center;
        padding: 100rpx;
    }
	
}
</style>