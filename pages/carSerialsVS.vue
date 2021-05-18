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

		<!-- 数据对比S -->
		<view class="data-vs">
			<view class="vs-content" v-for="(title,index) in powerEquipGroupList" :key="index">
				<view class="vs-title">
					{{title.name}}
				</view>
				<view class="vs-detail">
					<view class="left-a">
						<view class="l-tit" v-for="(a,ai) in modelEquipA[index].filter((v,i) => i < 6)" :key="ai">
							{{a.name}}
						</view>
					</view>
					<view class="right-b">
						<view class="r-tit" v-for="(b,bi) in modelEquipB[index].filter((v,i) => i < 6)" :key="bi">
							{{b.name}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 数据对比E -->
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
			}
		},
		data() {
			return {
				countPage,//页面计数器id
				loadFail: false,
				types: 0, //顶部样式默认是0，滑动到一定距离后改成1
				SerialIds: "",
				city: "广州",
				cityId: 1,
				offon: true, //true走onload的init，false走onshow的init；防止onload数据还未初始化就执行了init(百度小程序)
				worthRead: [], //买车必看pk
				leftSerial: "", //左边数据
				rightSerial: "", //右边数据
				tip: 0, //0left 1right

				powerEquipGroupList: [], //对比头

				modelEquipA: [], //车a的数据-左
				modelEquipB: [] //车b的数据-右
			}
		},
		onPageScroll(e) {
			if (e.scrollTop <= 90) {
				this.types = 0
			} else {
				this.types = 1
			}
		},
		onLoad(options) {
			console.log('options :>> ', options);
			if (options.leftSerialId && options.rightSerialId) {
				this.SerialIds = options.leftSerialId + ',' + options.rightSerialId
			}
			// Location.init((data) => {
			// 	if (data) {
			// 		this.city = data.city
			// 		this.cityId = data.cityId
			// 	}
			// 	this.init()
			// })
            this.init()
			this.getVsDownData()
		},
		methods: {
			async init() {
				try {
					let data = await this.getVsData(this.SerialIds);
					this.worthRead = data.worthRead;
					this.leftSerial = data.leftSerial;
					this.rightSerial = data.rightSerial;
					this.offon = false
					uni.hideLoading()
				} catch (e) {
					uni.hideLoading()
					console.error(e)
					this.loadFail = true
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
             getVsData(ids,rid){
                return new Promise((reolve,resject)=>{
                    uni.request({
                        url:domain.getAPI('fetchVSserials'),
                        data:{
                            rid,
                            leftSerialId:ids.split(",")[0],
                            rightSerialId:ids.split(",")[1]
                        },
                        success:res=>{
                            let data =res.data;
                            reolve({...data,worthRead:this.setArr(data.leftSerial.worthRead,data.rightSerial.worthRead)})
                        },
                        fail:err=>{
                            resject(err)
                        }
                    })
                })
            },
			//兼容获取的gbk
			 resDecode(str, charset, callback) {
				var script = document.createElement('script');
				script.id = '_urlDecodeFn_';
				var src = 'data:text/javascript;charset=' + charset + ',_urlDecodeFn_("' + str + '");'
				src += 'document.getElementById("_urlDecodeFn_").parentNode.removeChild(document.getElementById("_urlDecodeFn_"));';
				script.src = src;
				document.body.appendChild(script);
				window._urlDecodeFn_ = callback;
			},
			 gbkVerbUtf(str){
				return new Promise ((resolve,reject) => {
					try {
						this.resDecode(str,'GBK',(res) => {
							resolve(res)
						})
					} catch (error) {
						console.error(error)
					}
				})
			},
			//获取文字对比数据
			async getVsDownData() {
				try {
					const {modelEquipA,modelEquipB,modelEquipA:{powerEquipGroupList}} = await api.fetchCarSerialContrast({mid1:102631,mid2:94839})
					this.powerEquipGroupList = powerEquipGroupList
					let tempModelEquipA = []
					let tempModelEquipB = []
					for(let A in modelEquipA) {
						if(A <= powerEquipGroupList.length) {
							tempModelEquipA.push(modelEquipA[A])
						}
					}
					for(let B in modelEquipB) {
						if(B <= powerEquipGroupList.length) {
							tempModelEquipB.push(modelEquipB[B])
						}
					}
					this.modelEquipA = tempModelEquipA
					this.modelEquipB = tempModelEquipB
				} catch (error) {
					console.error(error)
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
	.data-vs {
		.vs-content {
			.vs-title {
				width: 100%;
				text-align: center;
				font-weight: bold;
				font-size: 28rpx;
				color: #333333;
				margin: 40rpx 0 20rpx;
			}
			.vs-detail {
				display: flex;
				justify-content: space-between;
				.left-a {
					display: flex;
					flex-wrap: wrap;
					flex: 1;
					.l-tit {
						background-color: #FFF2EC;
						flex-wrap: nowrap;
						color: #FA8845;
						height: 36rpx;
						line-height: 36rpx;
						margin: 4rx;
						padding: 2rpx 4rpx;
						border-radius: 10rpx;
					}
				}
				.right-b {
					display: flex;
					flex-wrap: wrap;
					flex: 1;
					.r-tit {
						background-color: #E6F3FF;
						flex-wrap: nowrap;
						height: 36rpx;
						line-height: 36rpx;
						color: #56A3F1;
						margin: 4rpx;
						padding: 2rpx 4rpx;
						border-radius: 10rpx;
					}
				}
			}
		}
	}
}
</style>
