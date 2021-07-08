<template>
<view>
	<pageTop ref="pagetop" :background="'#fff'" :titleys="'#000'" :btnys="''" :title.sync="title" ></pageTop>
	 <image src="https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/zijiBanner.png" class="imageV"></image>
	  <view class="choose-serial">
	    <view class="serial-item" v-for="(item,index) in serialData" :key="index" @tap="goSerialDetail(item.pcSerialGroupId)">
	        <image mode="widthFix" :src="item.pcSerialGroupPic" />
			<view class="dec">
				<view class="title">
	                {{item.name}}
	            </view>
	            <view class="price">
	                ¥<text >{{item.minPrice | formatThousand}}</text>起
	            </view>
				<view class="getprice">
				    <text>获取优惠</text>
				</view>
			</view>
	    </view>
	  </view>
</view>
</template>

<script>
import api from '@/public/api/index'
import pageTop from '@/components/pageTop/pageTop'
let app = getApp()
    export default {
		components: {
			pageTop
		},
        data() {
            return {
                serialData:[], //车系列表
				title:'长安汽车云车展'
            }
        },
        onLoad(options) {
			let adDealerId = options.adDealerId;
			if(adDealerId){
				app.globalData.adDealerId = adDealerId;
			}
			
			
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
				goSerialDetail(pcSerialGroupId){
					uni.navigateTo({
						url:'/pages/GetPreferential?' + 'serialId='+ pcSerialGroupId + '&zijie=zijie'
					})
				}

        },
        filters: {
            //千份位逗号
            formatThousand (num) {
                num = num*1000*10
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
        margin-bottom: 56rpx;
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
					opacity: 1;
					font-family: DIN, DIN-Bold;
					font-weight: 700;
					text-align: left;
				
                }
            }
			.getprice{
			    margin: auto;
				margin-top:21rpx ;
				width: 200rpx;
				height: 64rpx;
				opacity: 1;
				background: #fa843f;
				border-radius: 32rpx;
				line-height: 55rpx;
				text{
					margin: auto;
					width: 110rpx;
					height: 26rpx;
					opacity: 1;
					font-size: 28rpx;
					font-weight: 500;
				    line-height: 26rpx;
					color: #ffffff;
					overflow:hidden;
					
				}
				
				
			}
        }
		
	}
	
	

}
	.imageV{
		width: 100%;
		height: 340rpx;
	}
</style>

<style>
</style>
