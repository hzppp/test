<template>
	<view class="choose-models">
		<view class="top-title">2019</view>
        <!-- 多选 -->
		<view v-if="!single">
			<checkbox-group @change="checkboxChange">
                <label class="item-list" v-for="(item,index) in modelsList" :key="index" :class="[currentValue.includes(item.pcModelId)? 'ischecked':'dischecked']">
                    <view class="check-wrap" :class="[currentValue.includes(item.pcModelId)? 'hasChecked':'']">
                        <checkbox class="check-box" :value="item.pcModelId" :checked="item.checked" />
                    </view>
                    <view class="model-name">{{item.modelMemo}}</view>
                </label>
            </checkbox-group>
            <view class="btn" @tap="add">确定添加</view>
		</view>
        <!-- 单选 -->
		<view v-else>
            <view  class="item-list" v-for="(item,index) in modelsList" :key="index" @tap="goSingle(item)">
                <view class="model-name">{{item.modelMemo}}</view>
            </view>
		</view>
	</view>
</template>

<script>
	import api from '@/public/api/index'
	export default {
		data() {
			return {
                modelsList: [], //车型列表
				currentCount: "", //当前选择的个数
				currentValue:[], //选择的值
                pages:"",
                serialId:"",
                mids:"",
                single:false, // 是否是单选
                type:""
			}
		},
		methods: {
            onLoad(options) {
                console.log('options :>> ', options);
                this.single = options.single || false
                this.type = options.type || ""
                if(options.pages === "canpei") {
                    this.pages = options.pages
                    this.serialId = options.serialId
                    this.mids = options.mids
                }
                this.reqModelsList(options.serialId)
            },
            async reqModelsList(sgId) {
                try {
                    const {code,data} = await api.fetchModelsList({sgId})
                    if(code === 1) {
                        this.modelsList = data
                    }
                } catch (error) {
                    console.error(error)
                }
            },
            //go参配页
            add() {
                let tempMids = ""
                tempMids = this.mids + ","+ this.currentValue.join(",")
                console.log('tempMids :>> ', tempMids);
                if(this.pages === "canpei") {
                    uni.navigateTo({
                        url:`/pages/canpei?serialId=${this.serialId}&mids=${tempMids}`
                    })
                }
            },
            //goSingle 单选跳转
            goSingle(item) {
                if(this.type === "calc") {
                    uni.navigateTo({
                        url:`/pages/calc?serialId=${this.serialId}&id=${item.pcModelId}`
                    })
                }
            },
            checkboxChange: function (e) {
				console.log('e :>> ', e);
				this.currentCount = e.detail.value.length
				this.currentValue = e.detail.value
                console.log('this.currentCount :>> ', this.currentCount);
                console.log('this.currentValue :>> ', this.currentValue);
                var items = this.items,
                    values = e.detail.value;
                // for (var i = 0, lenI = items.length; i < lenI; ++i) {
                //     const item = items[i]
                //     if(values.includes(item.value)){
                //         this.$set(item,'checked',true)
                //     }else{
                //         this.$set(item,'checked',false)
                //     }
                // }
            }
        }
	}
</script>

<style lang="scss" scoped>
.choose-models {
    .ischecked {
        color: #fa8845;
    }
    .hasChecked {
        background-image: url("../static/images/is_checked_icon.png");
        background-size: cover;
    }
	.top-title {
		height: 56rpx;
		line-height: 56rpx;
		background-color: #f5f5f6;
		font-size: 24rpx;
		color: #333333;
		// padding-left: 39rpx;
	}
	.item-list {
		display: flex;
		padding-left: 32rpx;
		align-items: center;
		line-height: 96rpx;
        .check-wrap {
            width: 36rpx;
            height: 36rpx;
            border-radius: 50%;
            border: 1rpx solid #eeeeee;
        }
		.check-box {
			border-radius: 50%;
            opacity: 0;
		}
        .model-name {
            font-size: 28rpx;
            // color: #333333;
            margin-left: 32rpx;
        }
	}
	.btn {
		position: fixed;
		bottom: 20rpx;
		left: 50%;
		transform: translateX(-50%);
		height: 88rpx;
		width: 686rpx;
		text-align: center;
		color: #ffffff;
		background-color: #FA8845;
		border-radius: 44rpx;
		line-height: 88rpx;
	}
}
</style>