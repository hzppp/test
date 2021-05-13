<template>
	<view class="test">
		<getFormidbox>
			<view class="content" slot="content">
                
			</view>
		</getFormidbox>
	</view>
</template>

<script>
	import getFormidbox from '@/components/getFormIdModule/getFormIdModule'
	const app = getApp()
	export default {
		components: {
			getFormidbox
		},
		data() {
			return {

			}
		},
		async onLoad(options) {

		},
		methods: {
			abc() {
				console.log('abc')
			},
			abcd() {
				console.log("abcd")
			}
		}
	}
</script>

<style>
	.content {
		position: relative;
		z-index: 9;
	}
</style>
