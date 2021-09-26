<template>
	<view class="lucky-box" :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }">
		<view class="grid-box">
			<image v-for="(item,index) in 6" :src="item === selectIndex ? imgsrc[0] : imgsrc[1]" :key="index"></image>
		</view>
	</view>
</template>

<script>
	import { changeUnits } from '@/lottery/utils.js'
	export default {
		name:"lucky-grid",
		props: {
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
					'../../static/images/gird.png'
				],
				prize: '',
				runcount: 0,
				luck: ''
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
						if (this.selectIndex === num) {
							clearInterval(this.luck)
						} else {
							var waitNum = setInterval(() => {
								if (this.selectIndex === num) {
									this.$emit('end')
									clearInterval(this.luck)
									clearInterval(waitNum)
								}
							},100)
						}
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
		image {
			flex: 33.33%;
			height: 33.9%;
			margin-top: 10.7%;
			&:nth-child(n+4) {
				margin-top: 9%;
			}
		}
	}
</style>
