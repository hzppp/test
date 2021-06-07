<template>
	<!-- 参配页 -->
	<view>
		<view class='canpei uni' v-if="max > 0">
			<!-- 车型对比计数器 S -->
			<!-- <count :channel="countPage.car.canpei.count1" v-if="navigateBack == '1' && countPage.car.canpei.count1" :__uuid=" countPage.car.canpei.count1 == 9841 ? serialId+':1': ''"></count> -->
			<!-- <count :channel="countPage.car.canpei.count2" v-if="navigateBack == '2' && countPage.car.canpei.count2"></count> -->
			<back-home></back-home>
			<view :class="['nav_btn',showNav?'nav_btn_act':'']" @tap="showNav = !showNav" v-if="Data.detailArray.length>0">
				<view class="icon">
					<i class="iconfont icondaohangpinlei"></i>
				</view>
				<text>导航</text>
			</view>
			<block v-if="nodata">
				<view class="nodata_box">
					<view class="nodata">
						<view class="td">暂无参配信息</view>
					</view>
				</view>
			</block>
			<block>
				<scroll-view scroll-y class="canpei_bot" :scroll-into-view="scrollID" :style="nodata?'background:#fff':''">
					<block v-if="Data.detailArray.length==0">
						<view class="canpei_bot_none"></view>
					</block>
					<block v-else>
						<view class="canpei_bot_left">
                            <!-- 顶部左侧参数配置区域S -->
                            <view class="canpei_top_left">
                                <!-- <view :class="['icon',showOrhide?'':'icon_none']"></view> -->
                                <view class="canpei_top_left_title" style="background-color:white">
                                    <!-- {{showOrhide?'隐藏相同':'显示全部'}} -->
                                    参数配置
                                </view>
                            </view>
                            <!-- 顶部左侧参数配置区域E -->
                            
                            <!-- 对比内容区域左侧S -->
							<block v-for="(item,index) in dataList" :key="index">
								<view class="canpei_list_left">
									<view class="canpei_head" :id="'id_'+index">
										<view class="canpei_head_left">
											{{item.name}}
										</view>
										<view class="flex-1"></view>
										<view class="canpei_head_right" style="margin-right:20px">
											●标配 ○选配 -无
										</view>
									</view>
									<block v-if="item.detail.length>0">
										<block v-for="(it,inds) in item.detail[0]" :key="inds">
											<block v-if="it.key != '本地最低价' && showOrhide||(!showOrhide&&difData[it.key])">
												<!--  :class="['left_item',difData[it.key]&&Data.detailArray.length>1?'yellow':'']" -->
												<view :class="['left_item', it.key === '官方报价' ? 'h76px' : '']">
													{{it.key}}
												</view>
											</block>
										</block>
									</block>
								</view>
							</block>
                            <!-- 对比内容区域左侧E -->
						</view>
						<view class="canpei_box_right_con">
							<scroll-view scroll-x class="canpei_box_right" :scroll-left="scrollLeft">
                                <!-- 区域右侧车型名称区域S -->
                                <block>
                                    <view class="car_box" :style="'width:'+width+'rpx'">
                                        <block v-for="(item,index) in Data.detailArray" :key="index">
                                            <view class="car_list">
                                                <view class="item">
                                                    <text>{{item.modelName}}</text>
                                                    <view class="close" @tap="delCar(item.modelId,index)">
                                                        <i class="iconclose iconfont"></i>
                                                    </view>
                                                </view>
                                            </view>
                                        </block>
                                        <view class="car_list">
                                            <view :class="max==4||nodata?'add opc':'add'" @tap="addCar">
                                                <view class="add_icon">
                                                    <i class="iconadd iconfont"></i>
                                                </view>
                                                <view class="add_title">
                                                    添加车型
                                                </view>
                                                <view class="add_message">
                                                    (最多可添加4项)
                                                </view>
                                            </view>
                                        </view>
                                    </view>
                                </block>
                                <!-- 区域右侧车型名称区域E -->
                                <!-- 区域右侧对比数据S -->
								<block v-for="(item1,index) in dataList" :key="index">
									<view class="canpei_head_right"></view>
									<view class="canpei_box_right_box" :style="'width:'+width+'rpx'">
										<block v-for="(item2,idx) in item1.detail" :key="idx">
											<view class="right_list">
												<block v-for="(d,i) in item2" :key="i">
													<!-- 在支付宝小程序中 两层v-for后只能获取到当前遍历的值，获取不到其他变量值 showOrhide都为空，zfb兼容性bug 暂时没找到方案解决-->
													<block v-if="d.key != '本地最低价' && showOrhide || (!showOrhide&&difData[d.key])">
														<view :class="['right_list_item' , d.key === '官方报价' ? 'h76px' : '']">
															<!-- :class="[(d.key === '官方报价' || d.key === '上市时间') ? 'origin' : '']" -->
															<!--  :class="[difData[d.key] ? 'origin' : '']" -->
															<text>{{d.value}}</text>
															<view v-if="d.key === '官方报价'">
																<view class="zdj_box">
																	<view class="zdj" @tap.stop="toYuYue(Data.detailArray[idx].serialGorupId)">预约试驾</view>
																</view>
															</view>
														</view>
													</block>
												</block>
											</view>
										</block>
										<view class="right_list">
											<block v-for="(d,i) in item.detail[0]" :key="i">
												<block v-if="showOrhide||(!showOrhide&&difData[d.key])">
													<view class="right_list_item"></view>
												</block>
											</block>
										</view>
									</view>
								</block>
                                <!-- 区域右侧对比数据E -->
							</scroll-view>
						</view>
					</block>
				</scroll-view>
			</block>
			<!-- 导航弹窗s -->
			<block v-if="showNav">
				<view class="nav_tc" @tap="showNav=!showNav">
					<scroll-view scroll-y class="tc_win" @tap.stop>
						<view class="tc_win_box">
							<block v-for="(item,index) in dataList" :key="index">
								<view class="nav_list" @tap.stop="toView(index)">
									{{item.name}}
								</view>
							</block>
						</view>
					</scroll-view>
				</view>
			</block>
			<!-- 导航弹窗e -->
		</view>
		<view v-else class="no-canpei">
			<image mode="WidthFix" src="../static/images/canpei_noData.png" />
			<view class="text">暂时没有参配信息</view>
		</view>
	</view>
</template>
<script>
	import { dataInit } from "@/jsfiles/canpei";
	import countPage from '@/configs/countPage';
	export default {
		data() {
			return {
				countPage,//页面计数器id
				test: '测试字符串',
				serialId: '', //车系id
				ids: "",
				dataList: [], //数据列表
				Data: {},
				width: 280,
				Left: 0, //记录滚动的值
				scrollLeft: 0, //scroll-view位置
				difData: "", //不相同的数据
				difData1: '',
				showOrhide: true,
				showNav: false, //显示导航弹窗
				scrollID: "",
				offon: true, //防止连续多次点击
				sidName: "", //车系名
				stopYearCur: -1, //停售车型年款选择标志
				max: 0,
				dataInfo: "",
				mids: "",
				Runshow: false,
				nodata: false,
				navigateBack: '-1',
                tag: true
			}
		},
		watch: {
			"Data.detailArray"(val) {
				this.max = val.length;
				this.width = 280 + val.length * 250;
			}
		},
		onUnload() {
			this.$store.state.selectCars = {}
		},
		onLoad(options) {
			uni.showLoading({
				title: "加载中"
			})
            console.log('options.mids :>> ', options.mids);
			this.serialId = options.serialId;
			this.navigateBack = options.navigateBack;
			this.max = options.max || 0;

			let mids = options.mids || "";
			if (mids) {
				mids = mids.split(",").slice(0, 4);
			}
			this.mids = mids;
			console.log('mids :>> ', mids);
			this.init()
		},
		onShow() {
			if (!this.Runshow && this.navigateBack == '1') {
				this.Runshow = true
				return
			};
			this.addData()
		},
		onShareAppMessage() { //分享
            let title = '参数配置'
            let desc = '点击查看'
            let path = `pages/canpei?navigateBack=1&compare=true&mids=${this.mids}&serialId=${this.serialId}`
            return {title,desc,path}
		},
		methods: {
			async init() {
				try {
					let data = await this.getCarData(this.mids.join(","));
					this.width += data.detailArray.length * 250;
					console.log('data. :>> ', data.detailArray);
					this.max = data.detailArray.length;
					this.Data = data;
					this.sidName = data.detailArray[0].serialGorup;
					let res = await dataInit(data);
					this.dataList = res.dataList;
					this.difData = res.difData;
					uni.hideLoading()
				} catch (e) {
					if (e == 0) { //没有数据
						this.nodata = true
					}
					uni.hideLoading()
				}
			},
			async addData() {
				if (this.$store.state.selectCars && this.$store.state.selectCars.newSelect) {
					// #ifdef MP-BAIDU
					this.difData = ""
					// #endif
					try {
						let data = await this.getCarData(this.$store.state.selectCars.newSelect);
						this.Data.detailArray = this.Data.detailArray.concat(data.detailArray[0]);
						let res = await dataInit(this.Data);
						this.dataList = res.dataList;
						this.$nextTick(() => {
							this.difData = res.difData
						})
						delete this.$store.state.selectCars.newSelect;
					} catch (e) {
						if (e == 0) { //没有数据
							this.nodata = true
						}
						uni.hideLoading()
					}
				}
			},
			toggleHide(){
				if(JSON.stringify(this.Data)!='{}'&&this.Data.detailArray.length>1) {
					this.showOrhide = !this.showOrhide
				}
			},
			// 添加车型
			addCar() {
                uni.redirectTo({
					url:`/pages/AddYuYue?serialId=${this.serialId}&mids=${this.mids.join(',')}&pages=canpei`
                })
			},
			// 删除车型
			delCar(id, index) {
                this.mids =  this.mids.filter( item => item !=id )
                if(!this.mids.length) {
                    this.Data.detailArray = []
                    this.dataList = []
                }else {
                    this.init()
                }
			},
			// 前往锚点位置
			toView(index) {
				this.scrollID = "id_" + index
				this.showNav = false
			},
            //go预约试驾
            toYuYue(idx) {
                uni.navigateTo({
                    url:"/pages/YuyuePage?serialId=" + idx
                })
            },
			getCarData(ids) {
				return new Promise((relove, resject) => {
					try{
						uni.request({
							url: "https://ics.pcauto.com.cn/magear/s/pcauto/info/v1/detailCompare.xsp",
							data: {
								// serialId: this.serialId,
								modelIds: ids,
								rid: 1
							},
							header: {
								'Content-Type': 'application/json'
							},
							success: res => {
								if (res.data.status == -1) { //没有车型比较
									resject(0)
								} else {
									if (!Array.isArray(res.data.detailArray)) {
										res.data.nodata = true
										resject(0)
									} else {
										relove(res.data)
									}
								}
							},
							fail: err => {
								this.$toast("网络异常")
								resject()
							}
						})
					}catch(e){
						//TODO handle the exception
						console.error('eeeeeeeeeee',e)
					}

				})
			}
		}
	}
</script>
<style lang="scss">
	@import url("@/static/css/icon.css");

	.canpei {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		font-size: 26rpx;

		.nav_btn {
			text-align: center;
			position: fixed;
			z-index: 11;
			right: 32rpx;
			bottom: 326rpx;
			width: 78rpx;
			height: 78rpx;
			line-height: 36rpx;
			background: #fff;
			border-radius: 88rpx;
			box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.4);
			font-size: 20rpx;
			z-index: 1999;
			color: #333;

			.icon {
				width: 100%;
				text-align: center;
				margin-top: 4rpx;

				.iconfont {
					font-size: 30rpx;
					color: #333;
				}
			}

			text {
				font-size: 20rpx;
			}
		}

		.nav_btn_act {
			color: #3377d7;
			box-shadow: 0 0 20rpx rgba(0, 122, 223, 0.4);

			.icon {
				.iconfont {
					color: #3377d7;
				}
			}
		}

		.nav_tc {
			height: 100%;
			width: 100%;
			@include flex_center_center;
			position: fixed;
			z-index: 1998;
			top: 0;
			left: 0;

			.tc_win {
				width: 560rpx;
				// height: calc(100% - 240rpx);
				background: #fff;
				box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.3);
				padding-bottom: 20rpx;

				.tc_win_box {
					@include flex_left_top;
					flex-wrap: wrap;
					font-size: 28rpx;
					color: #121c35;
					height: 100%;
					width: 100%;
					align-content: flex-start;

					.nav_list {
						width: 243rpx;
						height: 60rpx;
						border: 2rpx solid #d6d5d6;
						border-radius: 10rpx;
						margin: 20rpx 0 0 24rpx;
						@include flex_center_center
					}
				}

			}
		}

		.nodata_box {
			flex: 1;
			position: relative;
			background: #f0f0f5;
			height: 100%;

			.nodata {
				position: absolute;
				top: 0;
				left: 0;
				display: table;
				height: 100%;
				width: 100%;
				font-size: 32rpx;
				color: #888;
				background: #f0f0f5;
				bottom: 0;

				.td {
					text-align: center;
					margin-top: 50%;
				}
			}
		}

		.yellow {
			background: #FFFFCF !important;
		}
        .origin {
            width: 100%;
            color: #fa8943 !important;
        }

		.canpei_top {
			height: 170rpx;
			width: #fff;
			border-bottom: 2rpx solid #D9D9D9;
			@include flex_left_center;
			.canpei_top_right {
				height: 170rpx;
				width: 500rpx;
				/* #ifdef MP-ALIPAY */
				padding-left: 2rpx;
				/* #endif  */
				.car_box {
					height: 100%;
					min-width: 500rpx;
					@include flex_left_center;

					.car_list {
						width: 250rpx;
						display: inline-block;
						border: 2rpx solid #ddd;
						padding: 5rpx 15rpx;
						position: relative;
						font-size: 24rpx !important;
                        height: 162rpx;
                        // box-sizing: border-box;
						.item {
							@include flex_center_center;
							height: 150rpx;
							width: 100%;

							text {
								width: 100%;
								@include flex_center_center;
								color: #333333;
								font-size: 26rpx;
							}

							.close {
								position: absolute;
                                bottom: 0;
                                right: 0;
								height: 30rpx;
								width: 30rpx;
                                border-top-left-radius: 10rpx;
								background: #808080;
								@include flex_center_center;

								.iconclose {
									font-size: 25rpx;
									color: #fff;
								}
							}
						}

						.add {
							width: 100%;
							@include flex_center_center;
							flex-wrap: wrap;
							align-content: center;
							height: 100%;
							white-space: normal;

							.add_icon {
								width: 100%;
								text-align: center;

								.iconfont {
									color: #333333;
									font-size: 35rpx;
                                    font-weight: bold;  
								}

								;
							}

							.add_title {
								width: 100%;
								text-align: center;
								color: #333333;
								font-size: 26rpx;
							}

							.add_message {
								font-size: 24rpx;
								color: #aaa;
								width: 100%;
								text-align: center;
							}
						}

						.opc {
							opacity: 0.3;
                            pointer-events: none;
						}
					}
				}

			}
		}

		.canpei_bot {
			height: 100%;
			width: 100%;
			// background: #eee;
			@include flex_left_center;
			position: relative;

			.canpei_bot_none {
				background: #fff;
				height: 100%;
				width: 100%;
			}

			.canpei_bot_left {
				/*#ifdef MP-ALIPAY*/ 
				position: absolute;
				top: 0;
				/*#endif*/
				width: 250rpx;
				.canpei_list_left {
					color: #888;
					width: 250rpx;
					border-right: 2rpx solid #EEEEEE;
					background: #fff;
					padding-top: 80rpx;
					position: relative;
					min-height: 80rpx;
                    box-sizing: border-box;
					.canpei_head {
						height: 80rpx;
						width: 750rpx;
						padding: 0 24rpx;
						color: #888;
						position: absolute;
						left: 0;
						z-index: 1100;
						top: 0rpx;
						background: #eee;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;

						.canpei_head_left {
							height: 80rpx;
							width: 250rpx;
                            font-weight: 600;
                            color: #333333;
							@include flex_left_center;

							.canpei_head_right {
								width: 234rpx;
								height: 100%;
								@include flex_right_center;
							}
						}
					}

					.left_item {
						height: 100rpx;
						// width: 100%;
						@include flex_center_center;
						border-bottom: 2rpx solid #EEEEEE;
                        border-right: 2rpx solid #EEEEEE;
						padding: 0 10rpx;
						text-align: center;
						&:last-child {
							border-bottom: 0;
						}
					}
				}
			}

			.canpei_box_right_con {
				width: 500rpx;
				position: absolute;
				left: 250rpx;
				top: 0;

				.canpei_box_right {
					width: 500rpx;
					color: #333;
					background: #fff;

					.canpei_head_right {
						width: 100%;
						height: 100%;
						@include flex_right_center;
						height: 80rpx;
						padding: 0 24rpx;
						color: #888;
						background: #eee;
					}

					.canpei_box_right_box {
						min-width: 500rpx;
						@include flex_left_center;

						.right_list {
							width: calc(250rpx + 2rpx);
							border-right: 2rpx solid #eee;

							&:last-child {
								width: 270rpx;
								border: 0;
							}

							.right_list_item {
                                display: flex;
								width: 100%;
								height: 100rpx;
								border-bottom: 2rpx solid #eee;
								@include flex_center_center(wrap);
								padding: 0 10rpx;
								text-align: center;
								align-content: center;

								.zdj_box {
									width: 100%;
									@include flex_center_center(wrap)
								}

								.icon {
									background: url(https://magear.pcauto.com.cn/p/www1.pcauto.com.cn/weixin/baojia/canpeibg.png) no-repeat;
									background-size: cover;
									display: inline-block;
									vertical-align: middle;
									width: 44rppx;
									height: 44rppx;
									background-position: -116rpx;
									text-indent: -999rem;
								}

								.zdj {
                                    // padding: 1px 15px;
                                    font-size: 24rpx;
									// height: 18px;
                                    width: 172rpx;
                                    height: 42rpx;
									overflow: hidden;
									color: #fa8943;
									margin: 6rpx 20rpx 0;
									border-radius: 60rpx;
									background: #fa8943;
                                    color: #ffffff;
									@include flex_center_center(wrap)
								}

								&:last-child {
									border-bottom: 0;
								}
							}
						}
					}
				}
			}

		}
        .h76px {
            height: 152rpx !important;
        }
	}
	.no-canpei {
		text-align: center;
		margin-top: 240rpx;
		image {
			width: 670rpx;
			height: 324rpx;
		}
		.text {
			font-size: 28rpx;
			color: #999999;
		}
	}
    .canpei_top_left {
    width: 250rpx;
    @include flex_center_center;
    flex-wrap: wrap;
    align-content: center;

    .icon {
        background: url(https://magear.pcauto.com.cn/p/www1.pcauto.com.cn/weixin/baojia/canpeibg.png) no-repeat;
        background-size: cover;
        width: 56rpx;
        height: 44rpx;
    }

    .icon_none {
        background-position: -60rpx 0;
    }

    .canpei_top_left_title {
        width: 100%;
        text-align: center;
        height: 162rpx;
        line-height: 162rpx;
        border: 2rpx solid #ddd;
        color: #333333;
        font-size: 26rpx;
        font-weight: 800;
        box-sizing: border-box;
    }
}
    .car_box {
        height: 100%;
        min-width: 500rpx;
        @include flex_left_center;

        .car_list {
            width: 250rpx;
            display: inline-block;
            border: 2rpx solid #ddd;
            padding: 5rpx 15rpx;
            position: relative;
            font-size: 24rpx !important;
            height: 162rpx;
            box-sizing: border-box;
            .item {
                @include flex_center_center;
                height: 150rpx;
                width: 100%;

                text {
                    width: 100%;
                    @include flex_center_center;
                    color: #333333;
                    font-size: 26rpx;
                }

                .close {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    height: 30rpx;
                    width: 30rpx;
                    border-top-left-radius: 10rpx;
                    background: #808080;
                    @include flex_center_center;

                    .iconclose {
                        font-size: 25rpx;
                        color: #fff;
                    }
                }
            }

            .add {
                width: 100%;
                @include flex_center_center;
                flex-wrap: wrap;
                align-content: center;
                height: 100%;
                white-space: normal;

                .add_icon {
                    width: 100%;
                    text-align: center;

                    .iconfont {
                        color: #333333;
                        font-size: 35rpx;
                        font-weight: bold;  
                    }

                    ;
                }

                .add_title {
                    width: 100%;
                    text-align: center;
                    color: #333333;
                    font-size: 26rpx;
                }

                .add_message {
                    font-size: 24rpx;
                    color: #aaa;
                    width: 100%;
                    text-align: center;
                }
            }

            .opc {
                opacity: 0.3;
                pointer-events: none;
            }
        }
    }
</style>
