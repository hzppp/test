<template>
	<userBand></userBand>
</template>

<script>
	import userBand from '@/components/userBand/userBand'
	export default {
		components: {
			userBand
		},
		data() {
			return {


			}

		},
		onShow() {
			console.log('sadasdasdasdasa')
		},
		onLoad(options) {
			let token = uni.getStorageSync('session-3rd')
			let path = options.path
			if (token) {
				uni.navigateTo({
					url: `/pages/{path}`
				})
			}

		}

	}
</script>

<style>
</style>
