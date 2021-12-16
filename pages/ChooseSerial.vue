<template>
  <view class="choose-serial">
    <view class="serial-item" v-for="(item,index) in serialData" :key="index" @tap="goSerialDetail(item)">
        <image mode="widthFix" :src="item.pcSerialGroupPic" />
		<view class="dec">
			<view class="title">
                {{item.name}}
            </view>
            <view class="price">
                ¥<text>{{item.minPrice | formatThousand}}</text>起
            </view>
		</view>
    </view>
  </view>
</template>

<script>
import api from '@/public/api/index'

    export default {
        data() {
            return {
                serialData:[], //车系列表
                vs: false, //是否进行车系选择对比
                serialId: '', //来自车系详情页的id，进行对比的车系id
                noun:'', //改变左边或者右边的车系判断
                leftSerialId:"", //左边车系id
                rightSerialId:"", //右边车系id
                pages:"",
                type:"",
				dealersId:""
            }
        },
        onLoad(options) {
            // console.log('options :>> ', options);
            // console.log('options.pages :>> ', options.pages);
            this.pages = options.pages || ""
            this.noun = options.noun || ""
            this.vs = options.vs || ""
            this.serialId = options.serialId || ""
            this.type = options.type || ""
            this.leftSerialId = options.leftSerialId || ""
            this.rightSerialId = options.rightSerialId || ""
			this.dealersId = options.dealersId || ""
			console.log('dealersId',this.dealersId)
			if(this.dealersId && this.dealersId.length > 0){
				this.reqSerialScreenListbyDealer()
			}else{
			    this.reqSerialScreenList()	
			}
           
        },
        methods: {
			async reqSerialScreenListbyDealer() {
			     
			      	let res = await api.listByDealer({
			      		dealerId: this.dealersId
			      	})
			      	if (res.code == 1) {
			      		let dealer = res.data.dealer
			      		this.serialData = res.data.serialGroups
			      	} 
			      
			},
            async reqSerialScreenList() {
                try {
                    const {code,data} = await api.fetchSerialScreenList({showPrice:1})
                    if(code === 1) {
                        this.serialData = data
                    }
                } catch (error) {
                    console.error(error)
                }
            },
            //ID 是左边车系 ， this.serialid是右边车系
            goSerialDetail(item) {
				
				
				this.$gdp('YCZ_clickModel', { "YCZ_choseCarModel_var": item.name, "YCZ_choseCarSeries_var": item.pcSerialGroupName })
				
				
                if(this.type === "calc") {
                    return  uni.navigateTo({
                        url:`/pages/ChooseModels?type=calc&single=true&serialId=${item.pcSerialGroupId}`
                    })
					 return
                }else if(this.type === "yuyue") {
   
					if(this.dealersId && this.dealersId.length > 0){
						// 回填
						
						
						
						
						
					}else{
						let pages = getCurrentPages();  //获取所有页面栈实例列表
						let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
						prevPage.$vm.serialId = item.pcSerialGroupId;   //修改上一页data里面的searchVal参数值为1211
						prevPage.$vm.show  = true; 
						uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
						    delta: 1
						});
						 return	
					}
		
                }
                if(this.pages) {
				    if(this.pages == 'GetPreferential'){
						let pages = getCurrentPages();  //获取所有页面栈实例列表
						let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
						prevPage.$vm.serialId = item.pcSerialGroupId;   //修改上一页data里面的searchVal参数值为1211
						// prevPage.$vm.show  = true; 
						uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
						    delta: 1
						});
					}else{
					this.$store.commit('changModel',item.pcSerialGroupId)
					return  uni.redirectTo({
					    url:`/pages/${this.pages}?serialId=${item.pcSerialGroupId}`
					})	
					}
					 return
                }
                if(this.noun) {
                    if(this.noun === "left") {
                        // uni.redirectTo({
                        //     url:`/pages/carSerialsVS?leftSerialId=${id}&rightSerialId=${this.serialId}`
                        // })
                        if(this.serialId == item.pcSerialGroupId) {
                            return  uni.showToast({
                                icon: 'none',
                                title: '该车型已在对比列表中，请选择另一款车型',
                            })
                        }
                        let pages = getCurrentPages();  //获取所有页面栈实例列表
                        let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
                        prevPage.$vm.leftSerialId = item.pcSerialGroupId;   //修改上一页data里面的searchVal参数值为1211
                        uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
                            delta: 1
                        });
                    }else {
                        // uni.redirectTo({
                        //     url:`/pages/carSerialsVS?leftSerialId=${this.serialId}&rightSerialId=${id}`
                        // })
                        if(this.serialId == item.pcSerialGroupId) {
                            return  uni.showToast({
                                icon: 'none',
                                title: '该车型已在对比列表中，请选择另一款车型',
                            })
                        }
                        let pages = getCurrentPages();  //获取所有页面栈实例列表
                        let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
                        prevPage.$vm.rightSerialId = item.pcSerialGroupId;   //修改上一页data里面的searchVal参数值为1211
                        uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
                            delta: 1
                        });
                    }
                    return
                }
                if(this.vs) {
                    if(item.pcSerialGroupId == this.serialId) {
                        return  uni.showToast({
                            icon: 'none',
                            title: '该车型已在对比列表中，请选择另一款车型',
                        })
                    }
                    uni.redirectTo({
                        url:`/pages/carSerialsVS?leftSerialId=${this.serialId}&rightSerialId=${item.pcSerialGroupId}`
                    })
                }else {
                    uni.redirectTo({
                        url:`/pages/LookCar?id=${item.pcSerialGroupId}`
                    })
                }
            }
        },
        filters: {
            //千份位逗号
            formatThousand (num) {
                num = num*1000*10
                var reg=/\d{1,3}(?=(\d{3})+$)/g;
                return (num + '').replace(reg, '$&,');
            }
        },
    }
</script>

<style lang="scss" scoped>
.choose-serial {
    padding: 40rpx;
	.serial-item {
		display: flex;
        align-items: center;
        margin-top: 56rpx;
		image {
			width: 340rpx;
		}
		.dec {
            flex: 1;
            text-align: center;
            .title {
                font-size: 32rpx;
                color: #333333;
            }
            .price {
                font-size: 28rpx;
                text {
                    font-size: 32rpx;
                    font-weight: bold;
                    color: #333333;
                    padding: 0 4rpx;
                }
            }
        }
	}
}
</style>
