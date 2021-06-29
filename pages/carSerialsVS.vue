<template>
	<!-- 车系对比页面 -->
	<view class='carSerialsVS uni'>
		<!-- <load-fail v-if="loadFail" @init="init"></load-fail> -->
		<!-- 车系信息s -->
		<block v-if="leftSerial!=''&& rightSerial!=''">
			<car-info @changeCarSearial="changeCarSearial" :leftSerial="leftSerial" :rightSerial="rightSerial" :types="types"></car-info>
		</block>
		<!-- 车系信息e -->
		<view class="page" v-if="leftSerial!=''&&rightSerial!=''">
			<!-- 基本信息S -->
			<basic-info :leftSerial="leftSerial" :rightSerial="rightSerial"></basic-info>
			<!-- 基本信息E -->
		</view>
        <!-- 配置对比S -->
        <view class="configuration">
            <view class="title">配置对比</view>
            <view class="models-wrap">
                <view class="car-model" @tap="changModel(leftSerial.serialId,1,powerErank4ModelA.modelId)">
                    <view class="dec" v-if="powerErank4ModelA.modelName">{{powerErank4ModelA.modelName}}</view>
                     <view class="arrow" v-if="powerErank4ModelA.modelName"></view>
                     <view v-else>暂无该车系车型</view>
                </view>
                <view class="car-model" @tap="changModel(rightSerial.serialId,2,powerErank4ModelB.modelId)">
                    <view class="dec" v-if="powerErank4ModelB.modelName">{{powerErank4ModelB.modelName}}</view>
                    <view class="arrow" v-if="powerErank4ModelB.modelName"></view>
                    <view v-else>暂无该车系车型</view>
                </view>
            </view>
        </view>
        <!-- 配置对比E -->
		<!-- 数据对比S -->
		<view class="data-vs">
			<view class="vs-content" v-for="(title,index) in powerEquipGroupList" :key="index">
				<view class="vs-title">
					{{title.name}}
				</view>
				<view class="vs-detail">
					<view class="l-r-content">
						<view class="left-a" v-if="modelEquipA.length > 0 &&　powerErank4ModelA.modelName">
							<view class="l-tit" v-for="(a,ai) in modelEquipA[index].filter((v,i) => i < 6)" :key="ai">
								{{a.name}}
							</view>
						</view>
					</view>
					<view class="l-r-content">
						<view class="right-b" v-if="modelEquipB.length > 0 && powerErank4ModelB.modelName">
							<view class="r-tit" v-for="(b,bi) in modelEquipB[index].filter((v,i) => i < 6)" :key="bi">
								{{b.name}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 数据对比E -->
        <view class="view-all" @tap="goCanpei">
            <view>查看完整配置对比</view>
            <view class="arrow"></view>
        </view>
	</view>
</template>
<script>
	import carInfo from "@/components/carSerialsVS/carInfo.vue";
	import basicInfo from "@/components/carSerialsVS/basicInfo.vue";
    import domain from '@/configs/interface';
	import countPage from '@/configs/countPage';
	import api from '@/public/api/index'

	export default {
		components: {
			carInfo,
			basicInfo,
		},
		computed: {
			pageData() {
				return this.$store.state.pageData
			}
		},
		onUnload() {
			this.$store.state.pageData = {}
		},
		watch: {
			pageData(val) {
				if (this.tip == 0) {
					this.SerialIds = val.id + ',' + this.SerialIds.split(',')[1]
				} else {
					this.SerialIds = this.SerialIds.split(',')[0] + ',' + val.id
				}
				this.init()
			},
            mid1() {
                this.getVsDownData(this.mid1,this.mid2)
            },
            mid2() {
                this.getVsDownData(this.mid1,this.mid2)
            },
            leftSerialId() {
                this.reqModelsBySerialId("left", this.leftSerialId)
                this.getVsData()
            },
            rightSerialId() {
                this.reqModelsBySerialId("right", this.rightSerialId)
                this.getVsData()
            }
		},
		data() {
			return {
				countPage,//页面计数器id
				loadFail: false,
				types: 0, //顶部样式默认是0，滑动到一定距离后改成1
				// SerialIds: "",
				city: "广州",
				cityId: 1,
				offon: true, //true走onload的init，false走onshow的init；防止onload数据还未初始化就执行了init(百度小程序)
				// worthRead: [], //买车必看pk
				leftSerial: "", //左边数据
				rightSerial: "", //右边数据
				tip: 0, //0left 1right

				powerEquipGroupList: [], //对比头

				modelEquipA: [], //车a的数据-左
				modelEquipB: [], //车b的数据-右
                powerErank4ModelA:{}, //车型a的数据-左
                powerErank4ModelB:{}, //车型b的数据-右

                mid1:'', //左边车型id
                mid2:'', //右边车型id

                leftSerialId:"", //左车系id
                rightSerialId:"" //右车系id

			}
		},
		onPageScroll(e) {
			if (e.scrollTop <= 90) {
				this.types = 0
			} else {
				this.types = 1
			}
		},
        onShow(){
            // this.init()
        },
		onLoad(options) {
			console.log('options :>> ', options);
            this.mid1 = options.mid1 || ''
            this.mid2 = options.mid2 || ''
            this.leftSerialId = options.leftSerialId || ''
            this.rightSerialId = options.rightSerialId || ''
		},
		methods: {
			// async init() {
			// 	try {
            //         uni.showLoading({
            //             title: '正在加载...'
            //         })
			// 		let data = await this.getVsData();
			// 		// this.worthRead = data.worthRead;
			// 		this.leftSerial = data.leftSerial;
			// 		this.rightSerial = data.rightSerial;
			// 		this.offon = false
			// 	} catch (e) {
            //      console.error(e)
			// 		this.loadFail = true
			// 	} finally {
			// 		uni.hideLoading()
            //     }
			// },
            //查看完整参数对比
            goCanpei() {
				uni.navigateTo({
					url: `/pages/canpei?mids=${this.mid1},${this.mid2}`
				})
            },
            //获取车系下的车型
            async reqModelsBySerialId(noun,sgId) {
                uni.showLoading({
					title: '正在加载...'
				})
                try {
                    const {code,data} = await api.fetchModelsList({sgId})
                    if(code === 1) {
                        if(noun === "left") { //获取车系下的车型,默认展示第一个车型的对比
                            this.mid1 =  data[0] ? data[0].pcModelId : ''
                        }else if(noun === "right") {
                            this.mid2 = data[0] ? data[0].pcModelId : ''
                        }
                    }
                } catch (error) {
                    console.error(error)
                } finally {
                    uni.hideLoading()
                }
            },
            // 数组交叉排序重组
            setArr(arr1,arr2){
                for (let i in arr2) {
                    arr1.splice(2 * i + 1, 0, arr2[i])
                }
                return arr1;
            },
            //获取对比车系
             getVsData(){
                uni.showLoading({
					title: '正在加载...'
				})
                return new Promise((reolve,resject)=>{
                    uni.request({
                        url:domain.getAPI('fetchVSserials'),
                        data:{
                            leftSerialId:this.leftSerialId,
                            rightSerialId:this.rightSerialId
                        },
                        success:res=>{
                            let data = res.data;
                            // console.log('carSerialsVS.vue页面下的第215行, res.data =>', res.data)
                            this.leftSerial = data.leftSerial
                            this.rightSerial = data.rightSerial
                            // reolve({...data,worthRead:this.setArr(data.leftSerial.worthRead,data.rightSerial.worthRead)})
                            uni.hideLoading()
                        },
                        fail:err=>{
                            resject(err)
                            uni.hideLoading()
                        },
                    })
                })
            },
            //切换车型 
            changModel(id,sort,modelId) {
                uni.navigateTo({
					url: `/pages/ChooseModels?pages=vs&serialId=${id}&sort=mid${sort}&single=true&modelId=${modelId}`
				})
            },
			//获取文字对比数据
			async getVsDownData(mid1,mid2) {
                uni.showLoading({
					title: '正在加载...'
				})
				try {
					const res = await api.fetchCarSerialContrast({mid1,mid2})
                    this.powerErank4ModelA =  res.modelEquipA ? res.modelEquipA.powerErank4Model : []
                    this.powerErank4ModelB =  res.modelEquipB ? res.modelEquipB.powerErank4Model : []
					this.powerEquipGroupList = res.modelEquipA ? res.modelEquipA.powerEquipGroupList : res.modelEquipB ? res.modelEquipB.powerEquipGroupList : []
                    console.log('this.powerEquipGroupList :>> ', this.powerEquipGroupList);
                    let tempModelEquipA = []
					let tempModelEquipB = []
                    if(res.modelEquipA && res.modelEquipA.powerEquipGroupList) {
                        for(let A in res.modelEquipA) {
                            if(A <= res.modelEquipA.powerEquipGroupList.length) {
                                tempModelEquipA.push(res.modelEquipA[A])
                            }
                        }
                    }
                    if(res.modelEquipB && res.modelEquipB.powerEquipGroupList) {
                        for(let B in res.modelEquipB) {
                            if(B <= res.modelEquipB.powerEquipGroupList.length) {
                                tempModelEquipB.push(res.modelEquipB[B])
                            }
                        }
                    }

					this.modelEquipA = tempModelEquipA
					this.modelEquipB = tempModelEquipB

				} catch (error) {
					console.error(error)
				} finally {
                    uni.hideLoading()
                }
			},
			// 更换车系
			changeCarSearial(e) {
				this.tip = e;
				let unChangeSerialId = '',
					changeSerialId = '';
				if (e == 0) {
					changeSerialId = this.SerialIds.split(',')[0];
					unChangeSerialId = this.SerialIds.split(',')[1]
				} else {
					changeSerialId = this.SerialIds.split(',')[1];
					unChangeSerialId = this.SerialIds.split(',')[0]
				}
				uni.navigateTo({
					url: '/pages_car/chooseModels/chooseModels?navigateBack=6&unChangeSerialId=' + unChangeSerialId + '&changeSerialId=' +
						changeSerialId
				})
			}
		}
	}
</script>
<style lang="scss">
.carSerialsVS {
	.page {
		padding-top: 425rpx;
	}
    .configuration {
        .title {
            text-align: center;
            font-size: 40rpx;
            color: #333333;
            font-weight: bold;
			margin: 50rpx 0;
        }
        .models-wrap {
            display: flex;
            justify-content: space-between;
            padding: 0 32rpx;
            .car-model {
                font-size: 28rpx;
                font-weight: bold;
                width: 308rpx;
                padding: 10rpx;
                box-sizing: border-box;
                border-radius: 10rpx;
                border: 2rpx solid #EBEBEB;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .dec {
                    width: 280rpx;
                }
            }
        }
    }
	.data-vs {
		.vs-content {
			padding: 0  20rpx;
			.vs-title {
				width: 100%;
				text-align: center;
				font-weight: bold;
				font-size: 28rpx;
				color: #333333;
				margin: 40rpx 0 20rpx;
			}
			.l-r-content {
				width: 50%;
			}
			.vs-detail {
				display: flex;
				justify-content: space-between;
				.left-a {
					display: flex;
					flex-wrap: wrap;
					.l-tit {
						background-color: #FFF2EC;
						flex-wrap: nowrap;
						color: #FA8845;
						height: 36rpx;
						line-height: 36rpx;
						margin: 8rpx 4rpx;
						padding: 2rpx 4rpx;
						border-radius: 10rpx;
						font-size: 22rpx;
					}
				}
				.right-b {
					display: flex;
					flex-wrap: wrap;
					.r-tit {
						background-color: #E6F3FF;
						flex-wrap: nowrap;
						height: 36rpx;
						line-height: 36rpx;
						color: #56A3F1;
						margin: 8rpx 4rpx;
						padding: 2rpx 4rpx;
						border-radius: 10rpx;
						font-size: 22rpx;
					}
				}
			}
		}
	}
    .arrow {
        width: 20rpx;
        height: 20rpx;
        background-image: url("../static/images/right_arrow.png");
        background-size: auto 100%;
        background-repeat: no-repeat;
    }
    .view-all {
        display: flex;
        text-align: center;
        font-size: 24rpx;
        color: #333333;
        align-items: center;
        justify-content: center;
        margin: 40rpx 0;
		padding-bottom: 33rpx;
    }

}
</style>
