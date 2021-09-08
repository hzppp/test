<template>
  <view class="choose-serial">
    <view class="serial-item" v-for="(item,index) in serialData" :key="index" @tap="goChooseModels(item)">
        <image mode="widthFix" :src="item.pcSerialGroupPic" />
		<view class="dec">
			<view class="title">
                {{item.name}}
            </view>
            <view class="price">
                ¥<text>{{item.minPrice | formatThousand}}</text>起
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
            serialData: [],
            mids:"" , //对比的id字符
            serialId: "" , //车系id
            pages:"" // 来源页面
        }
    },
    methods: {
        onLoad(options) {
            console.log('options :>> ', options);
            this.mids = options.mids || ""
            this.serialId = options.serialId || ""
            this.pages = options.pages || ""
            this.reqSerialScreenList()
        },
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
        goChooseModels(item) {
            if(this.pages == 'canpei') {
                uni.redirectTo({
                    url:`/pages/ChooseModels?serialId=${item.pcSerialGroupId}&mids=${this.mids}&pages=${this.pages}&originSerialId=${this.serialId}`
                })
            }else {
                uni.redirectTo({
                    url:`/pages/ChooseModels?serialId=${item.pcSerialGroupId}&mids=${this.mids}&pages=${this.pages}`
                })
            }
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
};
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
