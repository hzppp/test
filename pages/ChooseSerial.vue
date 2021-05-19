<template>
  <view class="choose-serial">
    <view class="serial-item" v-for="(item,index) in serialData" :key="index" @tap="goSerialDetail(item.pcSerialGroupId)">
        <image mode="widthFix" :src="item.pcSerialGroupPic" />
		<view class="dec">
			<view class="title">
                {{item.name}}
            </view>
            <view class="price">
                ¥<text>{{item.minPrice*10000 | formatThousand}}</text>起
            </view>
		</view>
    </view>
  </view>
</template>

<script>
import api from '@/public/api/index'

    export default {
        data() {
            return {
                serialData:[], //车系列表
                vs: false, //是否进行车系选择对比
                serialId: '', //来自车系详情页的id，进行对比的车系id
                noun:'', //改变左边或者右边的车系判断
                leftSerialId:"", //左边车系id
                rightSerialId:"", //右边车系id
                pages:"",
                type:""
            }
        },
        onLoad(options) {
            console.log('options :>> ', options);
            this.pages = options.pages || ""
            this.noun = options.noun || ""
            this.vs = options.vs || ""
            this.serialId = options.serialId || ""
            this.type = options.type || ""
            this.reqSerialScreenList()
        },
        methods: {
            async reqSerialScreenList() {
                try {
                    const {code,data} = await api.fetchSerialScreenList({showPrice:1})
                    if(code === 1) {
                        this.serialData = data
                    }
                } catch (error) {
                    console.error(error)
                }
            },
            //ID 是左边车系 ， this.serialid是右边车系
            goSerialDetail(id) {
                if(this.type === "calc") {
                    return  uni.navigateTo({
                        url:`/pages/ChooseModels?type=calc&single=true&serialId=${id}`
                    })
                }
                if(this.pages === "YuyuePage") {
                    this.$store.commit('changModel',id)
                    return  uni.navigateTo({
                        url:`/pages/YuyuePage?serialId=${id}`
                    })
                }
                if(this.noun) {
                    if(this.noun === "left") {
                        uni.redirectTo({
                            url:`/pages/carSerialsVS?leftSerialId=${id}&rightSerialId=${this.serialId}`
                        })
                    }else {
                        uni.redirectTo({
                            url:`/pages/carSerialsVS?leftSerialId=${this.serialId}&rightSerialId=${id}`
                        })
                    }
                    return
                }
                if(this.vs) {
                    uni.navigateTo({
                        url:`/pages/carSerialsVS?leftSerialId=${this.serialId}&rightSerialId=${id}`
                    })
                }else {
                    uni.navigateTo({
                        url:`/pages/LookCar?id=${id}`
                    })
                }
            }
        },
        filters: {
            //千份位逗号
            formatThousand (num) {  
                var reg=/\d{1,3}(?=(\d{3})+$)/g;   
                return (num + '').replace(reg, '$&,');  
            }
        },
    }
</script>

<style lang="scss" scoped>
.choose-serial {
    padding: 40rpx;
	.serial-item {
		display: flex;
        align-items: center;    
        margin-top: 56rpx;
		image {
			width: 340rpx;
		}
		.dec {
            flex: 1;
            text-align: center;
            .title {
                font-size: 32rpx;
                color: #333333;
            }
            .price {
                font-size: 28rpx;
                text {
                    font-size: 32rpx;
                    font-weight: bold;
                    color: #333333;
                    padding: 0 4rpx;
                }
            }
        }
	}
}
</style>