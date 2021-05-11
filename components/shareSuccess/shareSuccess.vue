<template>
	<view class="jf-pop" v-if="isshow" @tap="popHide">
		<view class="jf-pop-content">
			<view v-for="(item,index) in [0,1,2]" :key="index" :class="'xx'+index"></view>
			<view class="p1">+<text>{{number}}</text>众享币</view>
			<view class="p2">{{text}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isshow:false,
				number:0,
				text:"",
				timeout: null
			}
		},
		methods: {
			popHide(){
                this.isshow = false
            },
			shareSuccessShow(number = 0,text = ''){
				this.isshow = true
				this.number = number
				this.text = text
				clearTimeout(this.timeout)
				this.timeout = setTimeout(()=>{
					this.isshow = false
				},3000)
			}
		}
	}
</script>

<style lang="less">
	@import '@/static/less/public.less';

	.jf-pop {
		.mask;
		z-index: 88888;
		overflow: initial;

		&-content {
			.pa(50%, 50%);
			transform: translate(-50%, -50%);
			width: 484rpx;
			height: 282rpx;
			background: #fff;
			border-radius: 20rpx;
			overflow: initial;
			.tc;

			&::before {
				display: block;
				content: "";
				.setbg(168rpx, 168rpx, '20190909_4.png');
				.pa(50%, -84rpx);
				transform: translate(-50%, 0);
			}
		}

		.xx0 {
			.setbg(24rpx, 34rpx, '20190909_5.png');
			.pa(92rpx, -61rpx);
		}

		.xx1 {
			.setbg(17rpx, 26rpx, '20190909_5.png');
			.pa(323rpx, 19rpx);
		}

		.xx2 {
			.setbg(15rpx, 21rpx, '20190909_5.png');
			.pa(128rpx, 68rpx);
		}

		.p1 {
			.seth(68rpx, 36rpx, #333);
			.fb;
			padding-top: 119rpx;

			text {
				margin-right: 10rpx;
			}
		}

		.p2 {
			.seth(49rpx, 24rpx, #999);
		}
	}
</style>
