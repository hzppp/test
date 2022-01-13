<template>
    <view :class="type=='jigsaw'?'jigsaw-tips':'tips'">
        <view class="contentBody">
            <view class="title titleK">抽奖说明</view>
            <view class="contentTips-outer">
                <scroll-view scroll-y="true" class="contentTips">
                    <text>{{activityMemoArr}}</text>
                </scroll-view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props:{
        activityMemoArr: {
            type: String,
            default:""
        },
		type:{
            type: String,
            default: ""
        },
    }
}
</script>
<style lang="less" scoped>
	@import '@/static/less/public.less';
    .tips {
		padding: 0 32rpx 20rpx;
		box-sizing: border-box;
		.title {
			color: #ed2c2c;
			text-align: center;
			font-size: 32rpx;
			line-height: 32rpx;
			margin-bottom: 20rpx;
		}

		.contentBody {
			color: #333333;
			padding: 40rpx 20rpx 30rpx;
			background: #ffffff;
			border-radius: 10rpx;
			.contentTips-outer{
				max-height: 406rpx;
				padding: 30rpx 10rpx 30rpx 20rpx;
				box-sizing: border-box;
				width: 646rpx;
				background: #eef1f5;
				border-radius: 10rpx;
			}
			.contentTips {
				width: 100%;
				height: 346rpx;
				font-size: 28rpx;
				line-height: 54rpx;
				
				text{
					padding-right:15rpx;
					display: block;
				}
				/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
				::-webkit-scrollbar {
					width: 10rpx !important;
					height: 51rpx !important;
					color:  #dee0e2;

				}

				// /*定义滚动条轨道 内阴影+圆角*/
				// ::-webkit-scrollbar-track {
				// 	-webkit-box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
				// 	box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
				// 	border-radius: 5rpx;
				// 	background-color:#FFFFFF;
				// }

				/*定义滑块 内阴影+圆角*/
				::-webkit-scrollbar-thumb {
					border-radius: 5rpx;
					background-color:#dee0e2; /*滚动条的颜色*/
				}
			}
		}
	}
	.jigsaw-tips{
		width: 706rpx;
		height: 560rpx;
		background: linear-gradient(0deg,#9dfff2 0%, #f8ffed 100%);
		border: 2rpx solid #333333;
		border-radius: 20rpx;
		margin:0 auto;
		padding:20rpx;
		box-sizing: border-box;
		position: relative;
		margin-top: 68rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		.title{
			.setbg(260rpx,76rpx,'jigsaw/title-bg.png');
			position: absolute;
			left:50%;
			margin-left:-130rpx;
			top:-38rpx;
			z-index: 19;
			font-size: 36rpx;
			font-weight: 700;
			text-align: center;
			color: #ffffff;
			line-height: 76rpx;
			padding: 0
		}
		.contentBody{
			content: "";
			width: 666rpx;
			height: 520rpx;
			background: #edfffc;
			border: 2px solid #333333;
			border-radius: 14px;
			margin:0 auto;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.contentTips-outer{
			width: 626rpx;
			height: 434rpx;
			background: #ffffff;
			border: 2rpx solid #333333;
			border-radius: 10rpx;
			padding:20rpx;
			box-sizing: border-box;
			font-size: 28rpx;
			color: #333333;
			line-height: 54rpx;
			.contentTips {
				width: 100%;
				height: 346rpx;
				overflow: scroll;
				text{
					padding-right:15rpx;
					display: block;
				}
				/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
				::-webkit-scrollbar {
					width: 10rpx !important;
					height: 51rpx !important;
					color:  #dee0e2;

				}

				/*定义滑块 内阴影+圆角*/
				::-webkit-scrollbar-thumb {
					border-radius: 5rpx;
					background-color:#dee0e2; /*滚动条的颜色*/
				}
			}
		}
	}
</style>


