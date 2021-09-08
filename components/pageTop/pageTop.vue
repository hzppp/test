<template>
	<view :class="'pageTop ' + btnys">
	    <view class="pageTop-zw" :style="'height:' + height + 'px'"></view>
	    <view class="pageTop-title" :style="'background:' + background + ';height:' + height + 'px'">
	        <view class="pageTop-content" :style="'height:' + jnHeight + 'px;top:' + jnTop + 'px'">
	            <block v-if="isShowBackBtn">
	                <view class="pageTop-back-btn" @tap="navigateBack"></view>
	                <view class="pageTop-line" v-if="!noShowHouse"></view>
	            </block>
	            <view :class="'pageTop-home ' + (isShowBackBtn ? '':'pageTop-home-left')" @tap="topIndexPage" v-if="!noShowHouse"></view>
	            <view class="pageTop-text" :style="'color:' + titleys ">{{title}}</view>
	        </view>
	    </view>
	  </view>
</template>

<script>
	export default {
		props:["background","btnys","titleys","title","isstoppageback","noShowHouse"],
		data() {
			return {
				isShowBackBtn:false,
				height:0,
				jnHeight:0,
				jnTop:0
			};
		},
		async created(){
      console.log('tttttt')
      let {
				bottom,height,left,right,top,width
			} = uni.getMenuButtonBoundingClientRect()
			this.height = height + top + Math.floor(top/3)
			this.jnHeight = height
			this.jnTop = top
			this.getPages()
			console.log('son==',this.height)
			this.$emit('getTopNavHeigth',this.height)
		},
		methods:{
			getPages(){
				let pages = getCurrentPages()
				let len = pages.length
				if(len > 1){
					this.isShowBackBtn = true
				}
			},
			navigateBack(){
				if(!this.isstoppageback){
					uni.navigateBack({
						delta: 1
					})
				}else{
					this.$emit('page-back')
				}
			},
			topIndexPage(){
				if(!this.isstoppageback){
					uni.reLaunch({
						url:"/pages/authorization"
					})
				}else{
					this.$emit('page-back')
				}
			}
		}
	}
</script>

<style lang="less">
@import (reference) '@/static/less/public.less';
.pageTop-zw{
    height: 128rpx;
}
.pageTop-content{
    .pa(0,0);
    width: 100%;
}
.pageTop-title{
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    background: #fff;
    overflow: hidden;
    z-index: 66;
}
.pageTop-back-btn{
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
.pageTop-line{
    width: 2rpx;
    height: 32rpx;
    background: #ccc;
    .pa(71rpx,50%);
    transform: translate(0%,-50%);
}
.pageTop-home{
    .setIcon(36rpx,38rpx,388rpx,41rpx);
    .pa(101rpx,50%);
    transform: translate(0%,-50%);
}
.pageTop-home-left{
    left: 32rpx;
}
.pageTop-text{
    width: 336rpx;
    .tc;
    .fb;
    .seth(42rpx,38rpx,#fff);
    .ellipsis;
    .pa(50%,50%);
    transform: translate(-50%,-50%);
    z-index: 99;
}

.white{
    .pageTop-title{
        .pageTop-back-btn{
            border-color: #fff;
        }
        .pageTop-home{
            .setIcon(36rpx,38rpx,426rpx,41rpx);
        }
    }
}
.pageTop-absolute{
	.pageTop-title{
		position: absolute;
	}
}
</style>
