<template>
	<view class="cars-page">
    <testDrive></testDrive>
        <view class="image-wrap" v-if="serialData.videoUrl">
            <video  object-fit="cover" lazy-load :src='serialData.videoUrl' :poster="serialData.videoCoverUrl"></video>
            <!-- <i class="video-icon"></i> -->
        </view>
        <!-- 按钮 -->
        <btnWrap :ids="ids" :serialId="serialId" v-if="serialData.videoUrl"></btnWrap>


        <view class="image-wrap">
            <image mode='widthFix' lazy-load :src='serialData.picHeadUrl' />
        </view>

        <!-- 按钮 -->
        <btnWrap :ids="ids" :serialId="serialId" v-if="!serialData.videoUrl"></btnWrap>

        <view class="image-wrap" v-for="(item,index) in serialData.picUrlArray" :key="index">
            <image mode='widthFix' lazy-load :src='item' />

        </view>

        <view class="btn-wrap">
            <button class="yuyue-btn" @tap="goYuyue">
                预约试驾
            </button>
        </view>

	</view>
</template>

<script>

import btnWrap from '@/components/lookCar/LookCar';
import api from '@/public/api/index'
import testDrive from '@/components/testDrive/testDrive'


export default {
    components: {btnWrap,testDrive},
    data() {
        return {
            serialData: {}, //车系详情
            ids:'', //车系对应的前两个车型的id集合字符串，
            serialId: "" //车系id
        }
    },
    onLoad(options) {
        this.reqSerialDetail(options.id)
    },
	methods: {
        async reqSerialDetail(sgId) {
            try {
                const {code,data} = await api.fetchSerialDetail({sgId})
                console.log('data :>> ', data);
                if(code ===1 ) {
                    this.serialData = data
                    this.serialId = data.pcSerialGroupId
                    this.reqModelsList(data.pcSerialGroupId)
                    uni.setNavigationBarTitle({
                        title:data.name
                    })
                }
            } catch (error) {
                console.error(error)
            }
        },
        //预约试驾
        goYuyue(){
            uni.navigateTo({
                url:"/pages/YuyuePage?serialId=" + this.serialId
            })
        },
        async reqModelsList(sgId) {
            try {
                const {code,data} = await api.fetchModelsList({sgId})
                let ids = []
                if(code === 1 ) {
                    data.map((v,i) => {
                        if( i < 2) {
                            ids.push(v.pcModelId)
                        }
                    })
                }
                this.ids = ids.join(",")
            } catch (error) {
                console.error(error)
            }
        },
	}
}
</script>

<style lang="scss">
.cars-page {
	min-height: 100vh;
    padding-bottom: 161rpx;
    .image-wrap {
        position: relative;
        width: 100%;
        z-index: 1;
        image {
            vertical-align: middle;
            width: 100%;
        }
        video {
            width: 100%;
        }
        .video-icon {
            position: absolute;
            width: 120rpx;
            height: 120rpx;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            background-image: url('../static/images/videoPlayBtn.png');
            z-index: 2;
        }
    }
    .btn-wrap {
        position: fixed;
        width: 100%;
        height: 161rpx;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        background-color: #ffffff;
        z-index: 99;
        display: flex;
        align-items: center;
        justify-content: center;
        .yuyue-btn {
            width: 686rpx;
            height: 88rpx;
            border-radius: 88rpx;
            line-height: 88rpx;
            color: #ffffff;
            background-color: #FA8845;
        }
    }
}
</style>
