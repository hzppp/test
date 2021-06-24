<template>
	<view class="choose-models">
        <!-- 多选 -->
		<view v-if="!single">
			<checkbox-group @change="checkboxChange">
                <label class="item-list" v-for="(item,index) in modelsList" :key="index" :class="[currentValue.includes(item.pcModelId) ? 'ischecked': canSelectLength === currentCount?'dischecked' : '']">
                    <view class="check-wrap" :class="[currentValue.includes(item.pcModelId)? 'hasChecked':'']">
                        <checkbox class="check-box" :value="item.pcModelId" :disabled="canSelectLength === currentCount && !currentValue.includes(item.pcModelId)" :checked="item.checked" />
                    </view>
                    <view class="model-name">{{item.name}}</view>
                </label>
            </checkbox-group>
            <view class="btn" @tap="add">确定添加</view>
		</view>
        <!-- 单选 -->
		<view v-else>
            <view  class="item-list" v-for="(item,index) in modelsList" :key="index" @tap="goSingle(item)">
                <view :class="['model-name', item.pcModelId == modelId ? 'orange' : '']">{{item.name}}</view>
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
				currentCount: 0, //当前选择的个数
				currentValue:[], //选择的值
                pages:"",
                serialId:"",
                mids:"",
                canSelectLength:0, // 可选择的个数，总的不可以超过4个，跟传过来的mids的个数有关
                single:false, // 是否是单选
                type: "",
                sort: "",
                modelId:'', //车型id
			}
		},
		methods: {
            onLoad(options) {
                console.log('options :>> ', options);
                this.modelId = options.modelId || ''
                this.single = options.single || false
                this.type = options.type || ""
                this.serialId = options.serialId || ""
                this.pages = options.pages || ""
                this.mids = options.mids || ""
                this.sort = options.sort || ""
                if(options.mids) {
                    this.canSelectLength = 6 - options.mids.split(",").length
                }else {
                    this.canSelectLength = 6
                }
                this.reqModelsList(options.serialId)
            },
            async reqModelsList(sgId) {
                try {
                    const {code,data} = await api.fetchModelsList({sgId})
                    if(code === 1) {
                        this.modelsList = data
                        console.log('data :>> ', data);
                    }
                } catch (error) {
                    console.error(error)
                }
            },
            //go参配页
            add() {
                // let newMids
                let tempMids
                if(this.mids && this.currentValue.length > 0) {
                    tempMids = this.mids + ","+ this.currentValue.join(",")
                    console.log('1 :>> ', 1);
                }else if(this.mids) {
                    tempMids = this.mids
                    console.log('2 :>> ', 2);
                }
                console.log('tempMids :>> ', tempMids);
                // newMids = tempMids.split(",")
                // this.addGlobalSelectCar(newMids)
                if(this.pages === "canpei") {
                    uni.redirectTo({
                        url:`/pages/canpei?serialId=${this.serialId}&mids=${tempMids}`
                    })
                }
            },
            //goSingle 单选跳转
            goSingle(item) {
                if(this.type === "calc") {
                    uni.redirectTo({
                        url:`/pages/calc?serialId=${this.serialId}&id=${item.pcModelId}`
                    })
                }
                if(this.pages === "vs") {
                    let pages = getCurrentPages();  //获取所有页面栈实例列表
                    let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
                    prevPage.$vm[this.sort] = item.pcModelId;   //修改上一页data里面的searchVal参数值为1211
                    uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
                        delta: 1
                    });
                }
            },
            checkboxChange: function (e) {
				console.log('e :>> ', e);
				this.currentCount = e.detail.value.length
				this.currentValue = e.detail.value
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
    .dischecked {
        color: #888888
    }
    .hasChecked {
        background-image: url("../static/images/is_checked_icon.png");
        background-size: cover;
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
            &.orange {
                color: #fa8845;
            }
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