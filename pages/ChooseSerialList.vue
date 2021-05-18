<template>
    <view class="choose-serial-list" @tap="goChooseSerial">选择车系</view>
</template>

<script>
    export default {
        data() {
            return {
                serialId: "" //车系id
            }
        },
        onLoad(option) {
            this.serialId = option.serialId
        },
        methods: {
            goChooseSerial(){
				uni.navigateTo({
					url:`/pages/ChooseSerial?vs=true&serialId=${this.serialId}`
				})
            }
        },
    }
</script>

<style lang="scss" scoped>
.choose-serial-list {
    
}
</style>