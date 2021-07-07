<template>
	<view class="wwj-rule" v-if="visible">
		<view :class="['rule-content', { show: classShow }]">
			<view class="rule-close" @click.prevent="close"></view>
			<view class="rule-con">
				<view class="rule-tit">活动规则</view>
				<view class="rule-item"><text>能量补给站：</text>点击进入活动页面，凭二维码前往接待台处兑换长安补给能量一份。</view>				<view class="rule-item"><text>科技量产中心：</text>点击进入活动页面，并选择自己喜爱的车型，凭二维码前往接待台兑换长安汽车精美礼品一份。</view>				<view class="rule-item"><text>寻宝大作战：</text>请在长安展台区域寻找宝藏二维码并扫描进入界面，即可获得娃娃机游戏机会一次。</view>				<view class="rule-item"><text>集星赢好礼：</text>参与以上三项活动均自动获得一枚星光，集齐三枚星光即有机会获得长安定制数据线一份。</view>				<view class="rule-item">*礼品每日限量供应</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			visible: [Boolean]
		},
		data() {
			return {
				classShow: false
			}
		},
		watch: {
			visible(val) {
				if (val) {
					setTimeout(() => {
						this.classShow = true
					}, 50)
				}else {
					this.classShow = false
				}
			}
		},
		created() {
			if (this.visible) {
				setTimeout(() => {
					this.classShow = true
				}, 50)
			}
		},
		mounted() { },
		methods: {
			close() {
				this.$emit('update:visible', false)
			}
		}
	}
</script>
<style lang="less">
	.wwj-rule{
		position: fixed;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		top: 0;
		left: 0;
		background-color: rgba(0,0,0,0.8);
		z-index: 999;
		.rule-content {
			width: 640rpx;
			height: 732rpx;
			background: url('https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/rule-bg.png') no-repeat center/100%;
			padding:80rpx 50rpx;
			box-sizing:border-box;
			position: absolute;
			top: 45%;
			left: 50%;
			transform: translate(-50%, -50%) scale(0);
			transition: all 0.2s;
			z-index: 100;
			text-align:left;
			&.show {
			  transform: translate(-50%, -50%) scale(1);
			}
		}
		.rule-close{
			width:65rpx;
			height:65rpx;
			background: url('https://www1.pcauto.com.cn/zt/gz20210712/changan/wawaji/images/rule-close.png') no-repeat center/100%;
			position:absolute;
			top:-90rpx;
			right:30rpx;
		}
		.rule-tit{
			color:#0789a8;
			font-size:54rpx;
			line-height:1;
			text-align:center;
			margin-bottom:45rpx;
		}
		.rule-item{
			font-size:24rpx;
			color:#333333;
			line-height:44rpx;
			text{
				color:#126c85;
			}
		}
	}
</style>
