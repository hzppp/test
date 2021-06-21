<template>
    <view class="a-pop-mask" v-if="isShow">
        <view class="pop-content">
            <view class="title">温馨提示</view>
            <view class="text">请授权手机号注册长安会员</view>
            <button class="btn" @tap="closeShow">暂不注册</button>
			<button class="btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber($event)" @tap.stop="stop" >立即注册</button>
        </view>
    </view>
</template>

<script>
import login from '@/units/login.js'
import api from '@/public/api/index.js'
    export default {
        data() {
            return {
                isShow: false, //控制显隐
            }
        },
       async created() {
         let token  =  uni.getStorageSync('session-3rd')
		 console.log('userBand token'+token)
		 if(!token){	 
			this.isShow = true
			await login.checkLogin(api)
		 }else{
		    await login.checkExpireTime(api)	 
		 }
		 this.isShow = true
        },
        methods: {
            closeShow() {
				let pages = getCurrentPages()
				let len = pages.length
				if(len>1){
					uni.navigateBack({
						
					})
				}else{
					uni.reLaunch({
						url:"/pages/authorization"
					})
				}
				
				
                this.isShow = false
				
            },
			async getPhoneNumber(e) {
				let {
					detail
				} = e
				console.log('getPhoneNumber===============',detail.encryptedData, 'iv=='+ detail.iv)
			  uni.showLoading({
			  	title:'登录中'
			  })
			let data =   await	login.userBind(api,detail.encryptedData,detail.iv)
	        let token  =  uni.getStorageSync('session-3rd')
	        console.log('userBand token'+token)
	        if(!token){
	          this.isShow = true
			  this.$toast('登录失败,请稍后重试')
	        }else{
	           this.isShow = false
	        }
			uni.hideLoading()
			  
			},
			stop() {
				console.log('stop')
			},

        },
    }
</script>

<style lang="scss">
.a-pop-mask {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color:rgba(0, 0, 0, .5);
    top: 0;
    left: 0;
	z-index: 10000;
    touch-action: none;
    .pop-content {
        position: absolute;
        width: 280px;
        height: 261px;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        text-align: center;
        background-color: #ffffff;
        padding: 30px;
        border-radius: 5px;
        box-sizing: border-box;
        .success {
            width: 65px;
            height: 65px;
            background-image: url("../../static/images/succes.png");
            background-size: cover;
            margin: 0 auto;
        }
        .title {
            color: #333333;
            line-height: 27px;
            font-size: 18px;
            font-weight: 700;
            margin: 10px 0;
        }
        .text {
            font-size: 14px;
            line-height: 20px;
            color: #999999;
        }
        .btn {
            width: 180px;
            height: 44px;
            font-size: 16px;
            line-height: 44px;
            border-radius: 44px;
            margin: 0 auto;
            margin-top: 34px;
            color: #ffffff;
            background-color: #fa8943;
        }
        .close {
            margin: 0 auto;
            margin-top: 60rpx;
            width: 64rpx;
            height: 64rpx;
            background-image: url("../../static/images/close_btn.png");
            background-size: cover;
        }
    }
}
</style>