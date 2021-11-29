<template>
    <view class="inviteRecord" v-if="isRecordsShow || (!isRecordsShow&&inviteRecordList&&inviteRecordList.length)">
        <view class="title titleK">邀请记录</view>
        <block v-if="inviteRecordList&&inviteRecordList.length">
            <view class="item" v-for="(item,index) in inviteRecordList" :key="index">
                <view class="item-left">
                    <view class="imgView">
                        <image class="img" :src="item.wxHead"></image>
                    </view>
                    <view class="name">{{item.wxName}}</view>
                </view>
                <view class="time">{{item.joinTime}} 加入</view>
            </view>
        </block>
        <view class="nodata" v-else>
            您还没有邀请记录哦！快去邀请好友参与吧~
        </view>
        <view class="more" @tap="goInviteRecord" v-if="inviteRecordCount>3">
            查看更多 >
        </view>
    </view>
</template>
<script>
const app = getApp()
import api from '@/public/api/index'
export default {
    props:{
        activityId:{
            type: String,
            default: ""
        },
		isRecordsShow:{
			type: Boolean,
            default: true
		}
    },
    data() {
        return {
            inviteRecordList: [],
			inviteRecordCount: 0,
        }
    },
    mounted() {
        this.getRecords()
    },
    methods: {
        async getRecords(){
            let {activityId} =this;
            this.inviteRecordList = await api.getInviteRecordList({
				pageNo: 1,
				pageSize: 3,
				activityId
			}).then(res => {
				this.inviteRecordCount = res.total || 0
				return res.code == 1 ? res.rows : []
			})
            console.log("isPacket",this.isRecordsShow,this.isRecordsShow&&this.inviteRecordList&&this.inviteRecordList.length)
        },
        goInviteRecord() {
            if(app.globalData.isRotating){
                return
            }
            let url = `/pages/inviteRecord?activityId=${this.activityId}`;
            uni.navigateTo({
                url
            })
        },
    },
}
</script>
<style lang="less" scoped>
    .inviteRecord {
		color: #333333;
		padding: 40rpx 20rpx 30rpx;
		background: #ffffff;
		border-radius: 10rpx;

		.title {
			text-align: center;
			font-size: 32rpx;
			line-height: 32rpx;
			margin-bottom: 20rpx;
			color: #ed2c2c;
		}

		.item {
			height: 112rpx;
			line-height: 112rpx;
			background: #eef1f5;
			margin-bottom: 20rpx;
			box-sizing: border-box;
			padding: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-radius: 10rpx;

			.item-left{
                display: flex;
                align-items: center;
            }

			.imgView {
				width: 72rpx;
				height: 72rpx;

				.img {
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}

			.name {
				font-size: 30rpx;
				width: 232rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
                margin-left: 20rpx;
			}

			.time {
				color: #999999;
				font-size: 24rpx;
			}
		}

		.nodata {
			border-radius: 10rpx;
			margin-bottom: 20rpx;
			background: #eef1f5;
			height: 212rpx;
			line-height: 212rpx;
			font-size: 28rpx;
			color: #999999;
			text-align: center;
		}

		.more {
			color: #999999;
			text-align: center;
			font-size: 24rpx;
            margin-top: 32rpx;
		}
	}
</style>


