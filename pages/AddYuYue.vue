<template>
  <view class="add-yuyue"> 
      <view class="yuyue-item" v-for="(item,index) in serialData" :key="index" @tap="goChooseModels(item)">
          <image mode="widthFix" :src="item.pcSerialGroupPic" />
          <view class="dec">
              <view class="title">
                  {{item.name}}
              </view>
              <view class="price">
                  {{item.price}}
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
            uni.redirectTo({
                url:`/pages/ChooseModels?serialId=${item.pcSerialGroupId}&mids=${this.mids}&pages=${this.pages}`
            })
        }
    },
};
</script>

<style lang="scss" scoped>
.add-yuyue {
    .yuyue-item {
        display: flex;
        margin-bottom: 48rpx;
        align-items: center;
        padding: 0 20rpx;
        image {
            width: 180rpx;
            height: 136rpx;
        }
        .dec {
            margin-left: 22rpx;
            .title {
                color: #333333;
                font-size: 32rpx;
                font-weight: bold;
            }
            .price {
                font-size: 28rpx;
                color: #FA8845;
            }
        }
    }
}
</style>
