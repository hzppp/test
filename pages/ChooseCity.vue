<template>
	<view class="choose-city">
		city
	</view>
</template>

<script>
import api from '@/public/api/index'
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {
			this.getAllCityList()
		},
		methods: {
			async getAllCityList() {
				try{
					const res = await api.reqAllCityList({hasHot:0})
					console.log('allcity==>',res)
				}catch(e){
					console.error(e)
				}
				
			}
		},
	}
</script>

<style>
.choose-city {
	
}
</style>
