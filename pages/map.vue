<template>
    <view>
        <view class="page-body">
            <view class="page-section page-section-gap">
                <map id='map' style="width: 100%; height: 300px;" :latitude="latitude" :longitude="longitude" :markers="covers" clickable='true' @markertap='tapMap()'>
                </map>
            </view>
        </view>
    </view>
</template>

<script>
	export default {
	    data() {
	        return {
	      id:0, // 使用 marker点击事件 需要填写id
	            title: 'map',
	            latitude:23.12463,
	            longitude:113.36199,
	            covers: [{
	                latitude: 23.12463,
	                longitude: 113.36199,
	                iconPath: '../static/images/arrowBottom.png'
	            }, {
	                latitude: 39.90,
	                longitude: 116.39,
	                iconPath: '../static/images/arrowBottom.png'
	            }]
	        }
	    },
	    methods: {
			tapMap(){
			
				
				
				// tt.openLocation({
				//       latitude:23.12463,
				//       longitude:113.36199,
				//       scale: 18,
				//       success() {
				//         console.log("打开地图成功");
				//       },
				//       fail(res) {
				//         console.log("打开地图失败:", res.errMsg);
				//       },
				//     });
			   // let  context = uni.createMapContext('map',this);
			   // context.openMapApp({latitude:23.12463,longitude:113.36199,destination:'什么什么事经销商'})
			}
	
	    }
	}
</script>

<style>
</style>
