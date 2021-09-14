<template>
	<view>
		<view class="page-body">
			<view class="page-section page-section-gap">
				<map id='map' style="width: 750rpx; height: 100vh;" :latitude="latitude" :longitude="longitude"
					:markers="covers" clickable='true' @markertap='tapMap()'>
				</map>
				 <view class="back" @tap='back()' :style="'top:' +  height  + 'px'">
				</view>
			
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: 0, // 使用 marker点击事件 需要填写id
				title: 'map',
				latitude: 23.12463,
				longitude: 113.36199,
				des: '',
				covers: [],
				height:0
			}
		},

		onLoad(option) {
			console.log(option)
			this.latitude = Number(option.latitude)
			this.longitude =Number(option.longitude)
			this.des = option.des
			let dic = {
				'latitude': option.latitude,
				'longitude': option.longitude,
				'iconPath': '../../../static/images/location.png',
				'width': 64,
				'height': 64,

			}
			this.covers.push(dic)
			
			
			
			let {bottom,height,left,right,top,width
				} = uni.getMenuButtonBoundingClientRect()
			 console.log({bottom,height,left,right,top,width
				})
			this.height = height + top - 13;
		},

		methods: {
			tapMap() {
				// #ifdef MP-WEIXIN
				let context = uni.createMapContext('map', this);
				context.openMapApp({
					latitude: this.latitude,
					longitude: this.longitude,
					destination: this.des
				})

				// #endif

				// #ifdef MP-TOUTIAO
				tt.openLocation({
					latitude: this.latitude,
					longitude: this.longitude,
					name:this.des,
					scale: 18,
					success() {
						console.log("打开地图成功");
					},
					fail(res) {
						console.log("打开地图失败:", res.errMsg);
					},
				});
				// #endif
			},
			back(){
				let pages = getCurrentPages()
				let len = pages.length
				if(len > 1){
					uni.navigateBack({
						delta: 1
					})
				}else{
					uni.reLaunch({
						url:"/pages/authorization"
					})
				}
				
			}

		}
	}
</script>

<style lang="less">
	@import  '@/static/less/public.less';
	.back1{
		 .pa(0rpx,0rpx);
		 width: 100rpx;
	}
  .back{
	 
     width: 26rpx;
    height: 26rpx;
    border-left: 4rpx solid #000;
    border-top: 4rpx solid #000;
    .pa(30rpx,50%);
    transform: translate(0%,-50%) rotate(-45deg);
	&.back-btn-white{color:#fff;}
    &:after{
        display: block;
        content: "";
        width:180%;
        height: 180%;
        .pa(-40%,-40%);
        z-index: 9999;
    }
	}
</style>
