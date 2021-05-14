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
			<!-- 基本信息s -->
			<basic-info :leftSerial="leftSerial" :rightSerial="rightSerial"></basic-info>
			<!-- 基本信息s -->
		</view>
	</view>
</template>
<script>
	import carInfo from "@/components/carSerialsVS/carInfo.vue";
	import basicInfo from "@/components/carSerialsVS/basicInfo.vue";
    import domain from '@/configs/interface';
	import countPage from '@/configs/countPage';
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
				tip: 0 //0left 1right
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
		},
		methods: {
			async init() {
				try {
					let data = await this.getVsData(this.SerialIds);
                    console.log('data :>> ', data);
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
                        url:domain.getAPI('getVSserials'),
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
	.page {
		padding-top: 425rpx;
        height: 200vh;
	}
</style>
