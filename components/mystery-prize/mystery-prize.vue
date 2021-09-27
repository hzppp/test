<template>
	<view class="lucky-box" :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }">
		<view class="grid-box">
			<view :class="['grid-box-image',{'grid-box-end':winPrizeUrl && item === selectIndex}]" v-for="(item,index) in 6" :key="index">
				<image :src="item === selectIndex ? winPrizeUrl ? imgsrc[2] : imgsrc[0] : imgsrc[1]" ></image>
				<image :src="winPrizeUrl" v-if="winPrizeUrl && item === selectIndex" class="win-pic"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import { changeUnits } from '@/lottery/utils.js'
	export default {
		name:"lucky-grid",
		props: {
		  winPrizeUrl: {
			type: String,
		    default: ''
		  },
		  width: {
		    type: String,
		    default: '600rpx'
		  },
		  height: {
		    type: String,
		    default: '600rpx'
		  },
		},
		data() {
			return {
				boxWidth: 100,
				boxHeight: 100,
				selectIndex: -1,
				imgsrc:[
					'../../static/images/girdSelect.png',
					'../../static/images/gird.png',
					'../../static/images/girdOpen.png'
				],
				prize: '',
				runcount: 0,
				luck: '',
				prizeMoveEnd:false,
			};
		},
		mounted () {
		  this.init()
			
		},
		
		methods: {
			init () {
				this.boxWidth = changeUnits(this.width)
				this.boxHeight = changeUnits(this.height)
				this.runcount = 0
				this.selectIndex = -1
				
			},
			play () {
				
				this.runcount = 0	
				this.luck = ''
				this.luck = setInterval( ()=>{ 
					console.log('real rlay')
					if (this.runcount <=4) {
						this.run(5)
					} else if (this.runcount <= 8) {
						clearInterval(this.luck)
						this.luck = setInterval( ()=>{ 
							if (this.runcount > 8) {
								clearInterval(this.luck)
								this.luck = setInterval( ()=>{ 
									this.run(5) 
									},35 )
							}
							this.run(5) 
						},50 )
					} 
				},60 )
			},
			run (max) {
				this.runcount++
				if (this.selectIndex > max) {
					this.selectIndex = 0
				} else {
					this.selectIndex = this.selectIndex + 1
				}
			},
			stop (num) {
				setTimeout(() => {
					clearInterval(this.luck)
					this.luck = setInterval( ()=>{ 
						this.run(5) 
					},70 )
					setTimeout(()=>{
						var waitNum = setInterval(() => {
							if (this.selectIndex === num) {
								console.log("stop end")
								this.$emit('end')
								clearInterval(this.luck)
								clearInterval(waitNum)
							}
						},100)
					
					},80*6)
				},1500)

			},
			
		}
	}
</script>

<style scoped lang="scss">
	.lucky-box {
    position: relative;
    overflow: hidden;
		margin: 0 auto;
		top: 344rpx;
  }
	.grid-box {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		.grid-box-image {
			flex: 33.33%;
			height: 33.9%;
			margin-top: 10.7%;
			position: relative;
			&:nth-child(n+4) {
				margin-top: 9%;
			}
			image{
				width: 100%;
				height: 100%;
			}
			.win-pic{
				position: absolute;
				width: 45%;
				height: 45%;
				object-fit: cover;
				left:50%;
				top:55%;
				transform:translate(-50%,-50%)
			}
		}

	}
</style>
