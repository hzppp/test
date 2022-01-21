<template>
    <view :class="['a-pop-mask',{'fromInvitation':fromInvitation}]" v-if="isShow">
        <view class="pop-content">
            <view class="title1">温馨提示</view>
            <view class="text">请授权手机号注册长安会员</view>
			<view class="btnV">
            <button v-if="!cancleShow" class="btn1" @tap="closeShow">暂不注册</button>
			<button class="btn2" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber($event)" @tap.stop="stop" >立即注册</button>
			</view>
		</view>
    </view>
</template>

<script>
import login from '@/units/login.js'
import api from '@/public/api/index.js'

    export default {
		props: {
			cancleShow: {
			      type: Boolean,
			      default:false
			    },
			fromInvitation:{
				type:Boolean,
				default:false
			}
		},
        data() {
            return {
                isShow: false, //控制显隐
				
            }
        },
       async created() {
         let token  =  uni.getStorageSync('session-3rd')
		 console.log('userBand token'+token)
		 if(!token){	 
			try{
			await login.checkLogin(api)
				if( !uni.getStorageSync('session-3rd')){
					this.isShow = true
				}
			}catch(e){
				if( !uni.getStorageSync('session-3rd')){
					this.isShow = true
				}
			}
		 }else{
		    await login.checkExpireTime(api)	 
			this.$emit('hadLogin')
		 }
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
			
			  getPhoneNumberHandler(e) {
				  tt.login({
				    force: true,
				    success(res) {
				      console.log(`login 调用成功${res.code} ${res.anonymousCode}`);
				    },
				    fail(res) {
				      console.log(`login 调用失败`);
				    },
				  });
				  
			    console.log(e.detail.errMsg);
			    console.log(e.detail.iv);
			    console.log(e.detail.encryptedData);
			  },
			async getPhoneNumber(e) {
				//点击立即注册发生跳转时触发
				
				this.$gdp('YCZ_registerNowClick')
				
				let {
					detail
				} = e
				console.log('getPhoneNumber===============',detail.encryptedData, 'iv=='+ detail.iv)
			  uni.showLoading({
			  	title:'登录中'
			  })
			  
			  if(detail.encryptedData &&  detail.iv){
				//申请试用手机号点击允许时触发
				
				this.$gdp('YCZ_phoneGrantPermissions')
				
				let data =   await	login.userBind(api,detail.encryptedData,detail.iv)
				let token  =  uni.getStorageSync('session-3rd')
				console.log('userBand token'+token)
				if(!token){
					this.isShow = true
					this.$toast('登录失败,请稍后重试')
				}else{
					this.isShow = false
					//注册成功时触发
					
					this.$gdp('YCZ_registerSuccess')
					
				}
				uni.hideLoading()
				this.$emit('loginSuccess')
				uni.hideLoading()
			  }else{
				  this.$toast('登录失败,请重试')
			  }
			
			  
			},
			stop() {
				// this.isShow = false
				// this.$emit('loginSuccess')
				console.log('stop')
			},

        },
    }
</script>

<style lang="scss">
.a-pop-mask {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color:rgba(0, 0, 0, .5);
    top: 0;
    left: 0;
	z-index: 10000;
    touch-action: none;
    .pop-content {
        position: absolute;
        width: 670rpx;
        height: 346rpx;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        text-align: center;
        background-color: #ffffff;
        // padding: 30px;
        border-radius: 5px;
        box-sizing: border-box;
        .success {
            width: 65px;
            height: 65px;
            background-image: url("../../static/images/succes.png");
            background-size: cover;
            margin: 0 auto;
        }
        .title1 {
            color: #333333;
            font-size: 34rpx;
            margin-top: 64rpx;
        }
        .text {
            font-size: 14px;
            line-height: 20px;
            color: #999999;
			margin-top: 32rpx;
        }
		.btnV{
			display: flex;
			align-items: center;
			justify-content: center;
		}
        .btn1 {
            width: 290rpx;
            height: 88rpx;
            font-size: 16px;
            line-height: 88rpx;
            border-radius: 44rpx;
            margin: 0 auto;
            margin-top: 44rpx;
            color: #FF9632;
			border-style:solid;
			border-width: 2rpx;
			border-color:  #FF9632;
            background-color: #ffffff;
        }
		.btn2 {
		   width: 290rpx;
		   height: 88rpx;
		   font-size: 16px;
		   line-height: 88rpx;
		   border-radius: 44rpx;
		   margin: 0 auto;
		   margin-top: 44rpx;
		   color: #FFFFFF;
		   background-color: #FF9632;
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
	&.fromInvitation {
		.pop-content {
			width: 560rpx;
			height: 306rpx;
		}
		.title1 {
			margin-top: 30rpx;
			color: #333333;
			font-weight: bold;
		}
		.text {
			margin-top: 22rpx;
			color: #333333;
		}
		.btnv2 {
			width: 320rpx;
			background-color: #ff884f;
		}
	}
}
</style>