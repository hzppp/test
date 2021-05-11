<template>
	<view class="coinDetails">
		<view class="coinDetails-content">
			<page-top ref="pagetop" :background="'#fff'" :titleys="'#000'" :btnys="''" :title.sync="title"></page-top>
			<view class="scroll-view">
				<scroll-view @scrolltolower="getJson" lower-threshold="300" scroll-y scroll-with-animation >
					<view class="header">
						<view class="p1">
							<view class="db">我的众享币：</view><text>{{credits}}</text>
						</view>
					</view>
					<view class="lists">
						<view class="list" v-for="(item,index) in lists" :key="index">
							<view class="p1">{{item.reason}}</view>
							<view class="p2">{{item.createTime}}</view>
							<view :class="'number ' + (item.type == 0 ? 'j':'')">
								{{(item.type == 0 ? '-':'+') + item.credits}}
							</view>
						</view>
					</view>
					<view class="bottom-tip" v-if="isAllLoad">已经到底了~</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	
	import pageTop from '@/components/pageTop/pageTop'
	import api from '@/public/api/index'
	let app = getApp()
	export default {
		components: {
		        'page-top':pageTop,
		    },
		data() {
			return {
				 page:1,
				        pageSize:15,
				        isLoad:false,
				        isAllLoad:false,
				        lists:[],
				        credits:0,
				        title:"众享币详情"
			}
		},
		async onLoad(options) {
		        api.getCredits().then(res=>{
		            this.credits = res.data
		        })
		        this.getRecord()
		    },
		methods: {
			getJson(){
			            // console.log('获取数据')
			            this.getRecord()
			        },
					async getRecord(){
					        if(!this.isLoad){
					            this.isLoad = true
					            let {data} = await api.getRecord(this.page,this.pageSize)
					            console.log('getRecord========',data)
					            let total = Math.ceil(data.total/this.pageSize)
					            if(total > this.page){//还有下一页
					                this.page++
					                this.isLoad = false
					            }else{//全部加载完成
					                this.isAllLoad = true
					            }
					            this.lists = [...this.lists,...data.rows]
					            console.log(data)
					
					        }
					        
					    }
		}
	}
</script>

<style lang="less">
@import '@/static/less/public.less';
.coinDetails{
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    &-content{
        display: block;
        width: 100%;
        height: 100%;
        overflow:hidden;
        position:relative;
        display:flex;
        flex-direction:column;
    }
}
.scroll-view{
    width:100%;
    flex: auto;
    position:relative;
    scroll-view{
        .pa(0,0);
        width: 100%;
        height: 100%;
    }
}
.header{
    .seth(208rpx,28rpx,#fff);
    background: #ce1330;
    .p1{
        color: #ffc7c7;
        .db{
            padding-left: 28rpx;
            .db(middle);
        }
        text{
            .db(middle);
            color: #fff;
            .fb;
            font-size: 64rpx;
        }
    }
}
.lists{
    padding-top: 50rpx;
    .list{
        padding: 0rpx 0 32rpx 80rpx;
        position: relative;
        height: 78rpx;
        &::before{
            display: block;
            content: "";
            width: 2rpx;
            height: 100%;
            bottom: 0;
            left: 45rpx;
            position: absolute;
            background: #ebebeb;
        }
        &:first-child::before{
            height: 88rpx;
        }
        &:last-child::before{
            height: 23rpx;
            bottom: initial;
            top: 0;
        }
        &:after{
            display: block;
            content: "";
            .arc(12rpx);
            background: #ce1330;
            .pa(40rpx,15rpx);
        }
    }
    .p1{
        .seth(44rpx,28rpx,#333);
    }
    .p2{
        .seth(34rpx,20rpx,#999);
    }
    .number{
        .seth(78rpx,36rpx,#f98100);
        .fb;
        position: absolute;
        top: 0;
        right: 40rpx;
        &.j{
            color: #333;
        }
    }
}
.bottom-tip{
    .tc;
    .seth(32rpx,24rpx,#999);
    padding-bottom: 24rpx;
}
</style>
