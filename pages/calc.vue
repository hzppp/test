<template>
	<!-- 计算器页面 -->
	<view class='calc uni'>
	
	<view class="pageTop">
	    <view class="pageTop-zw" :style="'height:' + height + 'px'"></view>
	    <view class="pageTop-title" :style="'height:' + height + 'px'">
	        <view class="pageTop-content" :style="'height:' + jnHeight + 'px;top:' + jnTop + 'px'" >
	            <block v-if="isShowBackBtn">
	                <view class="pageTop-back-btn" @tap="navigateBack"></view>
	            </block>
				<view class="pageTop-text-box">
					<view class="pageTop-text" :class="{'pageTop-act':!isLoans}" @tap="fullPayment">
						<view>全款</view>
					</view>
					<view class="pageTop-text" :class="{'pageTop-act':isLoans}" @tap="loansPayment">
						<view>贷款</view>
					</view>
				</view>
	           
	        </view>
	    </view>
	  </view>
		<!-- <back-home></back-home> -->
		<!-- <activity-ad-view pageIsLoaded="{{loadFail == false}}" mode="rightBottom"></activity-ad-view> -->
		<view class="container" scroll-y="true">
			<view class="box" style="width: 100%;">
				<!-- 头部.s -->
				<view class="box-hd" :class="{'box-Loans':isLoans}">
					<view class="info-price">
						<block v-if="isLoans">
							<view class="hd-price" >
								<view class="title">首付</view>
								<view class="price">{{shoufu}}</view>
							</view>
							<view class="icon" >+</view>
							<view class="hd-price">
								<view class="title">月供</view>
								<view class="price">{{monthPay}} x {{monthly[monthlyIdx].monthly}}</view>
							</view>
							<view class="icon">+</view>
						</block>
						<view class="hd-price" v-if="!isLoans">
							<view class="title">裸车价</view>
							<view class="price">{{modelPrice}}</view>
						</view>
						<view class="icon" v-if="!isLoans">+</view>
						<view class="hd-price">
							<view class="title">必要花费</view>
							<view class="price">{{needPrice}}</view>
						</view>
						<view class="icon">+</view>
						<view class="hd-price">
							<view class="title">商业保险</view>
							<view class="price">{{surPrice}}</view>
						</view>
					</view>
				<view class="all-price" :class="{'all-price-loans':isLoans}">
					<view class="hd-price">
						<view class="title">全款总价（元）</view>
						<view class="price">{{isLoans?loantotalStr:totalPrice}}</view>
						<!-- <view v-if="isLoans" class="hint">比全款多{{priceGap}}</view> -->
					</view>
				</view>
				</view>
				<!-- 头部.e -->

				<view class="section section-dark section_first">
					<!-- 选择车型.s -->
					<view class="section-item model-item" @tap="goModel()" :data-modelid="model.id" :data-pl="model.pl" :data-price="model.price"
					 :data-serialid="model.serialId">
					 <view class="section-hd">
					 	<img class="photo" :src="carPhoto" alt="">
					 </view>
						
						<view class="section-bd section-picker">{{model.title}}</view>
					</view>

					<!-- 裸车价格.s -->
					<view class="section-item section-title">
						<view class="section-hd section-title">裸车价
						</view>
						<view class="section-bd section-editabled">
							<i class="icon-editor"></i>
							<input type="number" :value="modelPrice" id="modelprice" :maxlength="model.maxlength" bindinput="bindKeyInput"
							 @focus="bindKeyFocus" @blur="bindKeyBlur" />
						</view>
					</view>
				</view>
				<!-- 贷款.s -->
				<view class="section section-dark " v-if='isLoans'>
							<view class="section-loans">
								<view class="loans-title">
									<view class="loans-hd">首付金额</view>
									<view class="loans-bd">{{shoufu}}</view>
								</view>
								
								<view class="option-loans">
									<view class="title">比例</view>
									<view class="loans-row" >
										<text  v-for="(item,idx) in ratio" :key='idx' :data-idx="idx"  @tap='checkRatio' class="option_item" :class="{'act':idx==ratioIdx}" >{{item.title}}</text>
                                        <picker class="option_item" @tap="DownPaymenChangeClick"  @change="DownPaymenChange" :range-key="'title'" :value="index" :range="ratioArray">
                                            <text :class="{'act':ratioIdx === 3}" class="option_item">{{ratioIdx == 3 ? ratioArray[DownPaymentindex].title : '其他'}}</text>
                                        </picker>
									</view>
								</view>
								
							</view>
							<view class="section-loans">
								<view class="loans-title">
									<view class="loans-hd">月供金额</view>
									<view class="loans-bd">{{monthPay}}</view>
								</view>
								<view class="option-loans">
									<view class="title">月供</view>
									<view class="loans-row" >
										<text v-for="(item,idx) in monthly" :key='idx' :data-idx="idx" @tap='checkMonthly'  class="option_item" :class="{'act':idx==monthlyIdx}">{{item.title}}</text>
									</view>
								</view>
							</view>
				</view>
				<!-- 贷款.e -->
				<!-- 必要花费.s -->
				<view :class="['section', 'section-dark', needToSpendExpand ? 'cancel-sction' : '']">
					<block v-for="(item,idx) in need_item" :key="idx">
						<block v-if="idx== 0">
							<view class="section-item section-title height148 needPrice-item" @tap="closeprice(1)">
								<view class="section-hd">
                                    <view class="tit_title">必要花费</view>
                                    <view class="tit_text">购置税,交强险等</view>
                                </view>
								<view class="section-bd">
									<text class="section-bd-text">{{needPrice}}</text>
								</view>
                                <view :class="['arrow',needToSpendExpand ? '' : 'to_down']"></view>
							</view>
						</block>
						<block v-else>
							<view class="section-item">
								<view class="section-hd">
									{{item.name}}
									<!-- <text v-if="item.editabled" class="tip">(点数字可编辑)</text> -->
									<block v-if="item.picker">
										<text class="section-desc">{{item.option[item.index]}}</text>
									</block>
								</view>

								<block v-if="item.editabled">
									<view class="section-bd section-editabled">
										<i class="icon-editor"></i>
										<input type="number" :value="item.value" :id="item.label" :maxlength="item.maxlength" bindinput="bindKeyInput"
										 @focus="bindKeyFocus" @blur="bindKeyBlur" />
									</view>
								</block>
								<block v-else-if="item.picker">
									<picker class="picker-item" @change="bindPickerChange" :id="item.label" :value="item.index" :range="item.option">
										<view class="section-bd section-picker">
											{{item.optionValue[item.index]}}
										</view>
									</picker>
								</block>
								<block v-else>
									<view class="section-bd">
										<text class="section-bd-text">{{item.value}}</text>
									</view>
								</block>
							</view>
						</block>
					</block>

				</view>
				<!-- 必要花费.e -->

				<!-- 商业险.s -->
				<view :class="['section', 'section-dark', commercialInsuranceExpand ? 'cancel-sction' : '']">
					<block v-for="(item ,idx) in baoxian_item" :key="idx">
						<block v-if="idx== 0">
							<view class="section-item section-title height148 needPrice-item" @tap="closeprice(2)">
								<view class="section-hd">
                                    <view class="tit_title">{{item.name}}</view>
                                    <view class="tit_text">车辆损失险、盗抢险、责任险等</view>
                                </view>
								<view class="section-bd">
									<text class="section-bd-text">{{surPrice}}</text>
								</view>
                                <view :class="['arrow',commercialInsuranceExpand ? '' : 'to_down']"></view>
							</view>
						</block>
						<block v-else>
							<view class="section-item">

								<block v-if="item.picker">
									<view :class="['checkbox', item.checked == true ? 'checked' : '']" :for="'check_'+item.label" @tap="selectItem(idx)"></view>
									<!-- <label :class="['checkbox',item.checked == true ? 'checked' : '']" :for="'check_'+item.label" @tap="selectItem(idx)">
										<checkbox class="checkbox-btn" :value="item.label" :id="'check_'+item.label" :checked="item.checked" />
									</label> -->
									<view class="section-hd">{{item.name}}
										<text class="section-desc">{{item.option[item.index]}}</text>
									</view>

									<picker class="picker-item" :id="item.label" @change="bindPickerChange" :value="item.index" :range="item.option">

										<block v-if="item.checked">

											<block v-if="item.area >= 0 ">
												<view class="section-bd section-picker">{{item.optionValue[item.index][item.area]}}</view>
											</block>
											<block v-else>
												<view class="section-bd section-picker">{{item.optionValue[item.index]}}</view>
											</block>
										</block>
										<block v-else>
											<view class="section-bd section-picker">0</view>
										</block>
									</picker>
								</block>
								<block v-else-if="item.default">
									<view :class="['checkbox', item.checked == true ? 'checked' : '']" :for="'check_'+item.label" @tap="selectItem(idx)"></view>
									<!-- <label :class="['checkbox',item.checked == true ? 'checked' : '']" :for="'check_'+item.label" @tap="selectItem(idx)">
										<checkbox class="checkbox-btn" :value="item.label" :id="'check_'+item.label" :checked="item.checked" />
									</label> -->
									<view class="section-hd">{{item.name}}
										<text class="section-desc">{{item.option[item.index]}}</text>
									</view>
									<block  v-if="item.checked">
											<view class="section-bd ">{{item.optionValue[item.index]}}</view>
									</block>
									<block v-else>
										<view class="section-bd ">0</view>
									</block>
								</block>
								<block v-else>

									<!-- <label :class="['checkbox', item.checked == true ? 'checked' : '']" :for="'check_'+item.label" @tap="selectItem(idx)">
										<checkbox class="checkbox-btn" :value="item.label" :id="item.label" :checked="item.checked" />
									</label> -->
									<view :class="['checkbox', item.checked == true ? 'checked' : '']" :for="'check_'+item.label" @tap="selectItem(idx)"></view>
									<view class="section-hd">
										{{item.name}}
									</view>
									<view class="section-bd">
										<text class="section-bd-text" v-if="item.checked">{{item.value}}</text>
										<text class="section-bd-text" v-else>0</text>
									</view>
								</block>

							</view>
						</block>
					</block>
				</view>
                <view class="hint">此结果仅供参考，实际费用以当地为准</view>

				<view class="foot">
					<view class="btn" @click="goDrive">
						预约试驾
					</view>
				</view>
				<!-- 商业险.e -->

				<!-- 弹出车型.s -->
				<view class="slide" :animation="animationData">
					<scroll-view class="serialSelect" scroll-y="true">
						<view class="slide-title">选择车型</view>
						<block v-for="(itemSer,idxS) in serial" :key="idxS">
							<view class="serial-title">{{itemSer.title}}</view>
							<view class="serial-list">
								<view v-for="(sales,idx) in itemSer.data" :key="idx" :for-item="sales" :class="['serial-item', sales.id == model.id?'cur': '']"
								 @tap="checkModel" :data-id="sales.id" :data-title="sales.title" :data-pl="sales.pl" :data-price="sales.price">
									<view>{{sales.title}}</view>
								</view>
							</view>
						</block>
					</scroll-view>
				</view>
				<view class="mask" v-if="slide" @tap="closeSlide"></view>
				<!-- 弹出车型.e -->
			</view>
		</view>
	</view>
</template>

<script>
	// import Location from '@/units/Location.js'
	import domain from '@/configs/interface.js';
	import request from '@/units/request.js';
	import api from '@/public/api/index'
	// import count from '@/components/count/count.vue'
	// import backHome from '@/components/backHome/backHome.vue'
	// import activityADView from '@/components/activityADView/activityADView.vue'
	// import countPage from '@/configs/countPage';
	
	export default {
		data() {
			return {
				// countPage,//页面计数器id
				loading: false,
				totalPrice: 0, //全款价格
				modelPrice: 0, //裸车价格
				needPrice: 0, //必要花费
				surPrice: 0, //商业保险
				cityId: '',
				changed: "",
				carData: {},
				drive:true,//预约试驾
                needToSpendExpand:true, //必要花费展开 默认不展开
                commercialInsuranceExpand:true, //商业保险展开 默认不展开
                ratioArray: [
                    {
                        title:'0%',
                        count:0
                    },
                    {
                        title:'10%',
                        count:10
                    },
                    {
                        title:'20%',
                        count:20
                    },
                    {
                        title:'30%',
                        count:30
                    },
                    {
                        title:'40%',
                        count:40
                    },
                    {
                        title:'50%',
                        count:50
                    },
                    {
                        title:'60%',
                        count:60
                    },
                    {
                        title:'70%',
                        count:70
                    },
                    {
                        title:'80%',
                        count:80
                    },
                    {
                        title:'90%',
                        count:80
                    },
                    {
                        title:'100%',
                        count:100
                    },
                ],
                DownPaymentindex: 0,
				model: {
					title: '', //车型名字
					id: '', //车型id
					price: '', //官方价
					serialId: '', //车系id
					pl: '', //排量
					maxlength: 11,
					photo:''
				},
				serial: [],
				animationData: {},
				slide: false,
				winWidth: 375,
				need_item: [{
					label: 'nd_0',
					name: "必要花费"
				}, {
					label: 'nd_1',
					name: "购置税",
					value: ''
				}, {
					label: 'nd_2',
					name: "上牌费用",
					value: "500",
					editabled: true,
					maxlength: 11
				}, {
					label: 'nd_3',
					name: "车船使用",
					value: ""
				}, {
					label: 'nd_4',
					name: "交强险",
					optionValue: ["950", "1,100"],
					index: 0,
					option: ["家用6座以下", "家用6座及以上"],
					picker: true
				}],
				baoxian_item: [{
						label: 'bx_0',
						name: "商业保险",
					}, {
						label: 'bx_1',
						name: "第三者责任险",
						desc: "10万",
						value: '710',
						optionValue: ["710", "1,026", "1,169", "1,270"],
						option: ["5万", "10万", "15万", "20万"],
						picker: true,
						checked: true,
						index: 0
					}, {
						label: 'bx_2',
						name: "车辆损失险",
						value: "",
						checked: true
					}, {
						label: 'bx_3',
						name: "全车盗抢险",
						value: "",
						checked: true
					}, 
					{
						label: 'bx_4',
						name: "玻璃单独破碎险",
						optionValue: ["0.19"],
						option: ["国产"],
						default: true,
						checked: true,
						index: 0
					}, 
					// {
					// 	label: 'bx_4',
					// 	name: "玻璃单独破碎险",
					// 	optionValue: ["0.31", "0.19"],
					// 	option: ["进口", "国产"],
					// 	picker: true,
					// 	checked: true,
					// 	index: 0
					// }, 
					{
						label: 'bx_5',
						name: "自燃损失险",
						value: "",
						checked: true
					},{
						label: 'bx_6',
						name: "不计免赔特约险",
						value: "",
						checked: true
					},{
						label: 'bx_7',
						name: '无过责任险',
						value: '',
						checked: true
					},{
						label: 'bx_8',
						name: "车上人员责任险",
						value: "150",
						checked: true
					}, {
						label: 'bx_9',
						optionValue: [
							["400", "585", "850"],
							["570", "900", "1,100"],
							["760", "1,170", "1,500"],
							["1,140", "1,780", "2,250"]
						],
						option: ["赔付2千", "赔付5千", "赔付1万", "赔付2万"],
						picker: true,
						name: '车身划痕险',
						checked: true,
						index: 0,
						area: 0
					},   {
						label: 'bx_10',
						name: '车辆涉水险',
						value: '',
						checked: true
					}

				],
				ratio:[{
					title:'0%',
					count:0
				},{
					title:'30%',
					count:30
				},{
					title:'50%',
					count:50
				}],
				monthly:[{
					title:'12期',
					rate:6.57,
					monthly:12
				},{
					title:'24期',
					rate:6.75,
					monthly:24
				},{
					title:'36期',
					rate:6.75,
					monthly:36
				},{
					title:'48期',
					rate:6.93,
					monthly:36
				},{
					title:'60期',
					rate:6.93,
					monthly:60
				}],
				ratioIdx:1,
				monthlyIdx:2,
				isLoans:false,//是否贷款
				shoufu:0,//首付金额
				monthPay:0,//月供
				totalPriceNum:0,//全款价格
				loantotal:0,//贷款总额
				priceGap:0,//贷款差额
				loantotalStr:0,//贷款总额字符
				isShowBackBtn:false,
				height:0,
				jnHeight:0,
				jnTop:0,
				carPhoto:'',
				
			}
		},
		components: {
			// count,
			// backHome,
		},
		watch: {

		},
		onLoad(options) {
			// console.log(options);
			// options = {
			// 	id: "82381",
			// 	serialId: "90"
			// }
			var that = this;
			// 页面初始化 options为页面跳转所带来的参数
			uni.getSystemInfo({
				success: function(res) {
					var winWidth = res.windowWidth;
					// console.log(winWidth);
					that.winWidth = winWidth
				}
			});
			var obj = {};
			obj.id = options.id || this.model.id;
			obj.serialId = options.serialId || this.model.serialId;

			this.serialId = obj.serialId
			if(obj.id == '' ||obj.id == undefined){
				this.reqModelsList(obj.serialId)
			}else{
				that.getSerial(obj.id, obj.serialId, 1, function(data) {
					that.getPrice(data);
				});
			}
			
		},
		async created(){
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
		onShareAppMessage: function() {
			var modelId = this.model.id,
				serialId = this.model.serialId;
			return {
				title: this.carData.serialGroupName + '购车花多少',
				desc: '了解购车款项，买车不上当',
				path: '/pages/calc?id=' + modelId + '&serialId=' + serialId
			}
		},
		onShow() {
			// 页面显示
			// 数据统计
			// var mta = require('../../mta_wechat_sdk/mta_analysis.js');
			// mta.Page.init();
		},
		methods: {
            DownPaymenChangeClick() {
                this.ratioIdx = 3
                let mIndex = this.monthlyIdx
                let rCount = this.ratioArray[this.DownPaymentindex].count
                this.defaultLoans(mIndex,rCount)
            },
            //
            DownPaymenChange(e) {
                this.DownPaymentindex = e.target.value
                let mIndex = this.monthlyIdx
                let rCount = this.ratioArray[e.target.value].count
				this.defaultLoans(mIndex,rCount)
            },
			//选择车型
			modelSelect: function(e) {
				// console.log(e);
				var serialid = e.currentTarget.dataset.serialid;
				var modelid = e.currentTarget.dataset.modelid;
				// console.log(serialId);
				this.getSerial(modelid, serialid);
				this.slide = true
				var animation = uni.createAnimation({
					duration: 600,
					timingFunction: 'ease-in-out',
				})

				this.animation = animation;
				var winWidth = this.winWidth;
				// animation.translateX(-winWidth).step();
				animation.right(0).step();
				this.animationData = animation.export()
			},
			goModel(){
				uni.redirectTo({
					url: "/pages/ChooseSerial?type=calc"
				})
			},
			//关闭侧滑
			closeSlide: function() {
				var animation = uni.createAnimation({
					duration: 500,
					timingFunction: 'linear',
				});
				this.animation = animation

				// animation.translateX(0).step()
				var winWidth = this.winWidth;
				animation.right(-winWidth).step();
				this.animationData = animation.export()

				setTimeout(function() {
					this.slide = false
				}.bind(this), 720)
			},
			//选中该车型
			checkModel: function(e) {
				var dataset = e.currentTarget.dataset;
				// console.log(dataset);
				var model = this.model;
				var modelPrice = this.modelPrice;
				for (var item in model) {
					// console.log(dataset[item]);
					if (dataset[item] !== undefined) {
						model[item] = dataset[item];
					}
				}
				if (dataset['price'] !== undefined) {
					dataset['price'] = dataset['price'] * 10000;
				}
				this.model = model
				this.getPrice(dataset);
				this.closeSlide();
			},
			//计算价格
			getPrice: function(obj) {
				//只要两个参数，一个是官方价price,另一个是排量pl
				var originData = this;
				var modelPrice = originData.modelPrice,
					totalPrice = originData.totalPrice,
					needPrice = originData.needPrice,
					surPrice = originData.surPrice;

				var obj = obj || {};
				var objPrice = parseFloat(obj.price) || this.k2w(modelPrice); //裸价

				//必要费用
				var needItem = originData.need_item;
				var curYear = new Date().getFullYear;
				var pl = parseFloat(obj.pl || originData.model.pl);
				var gzsl = parseFloat(obj.gzsl) || 0.1; //购置税率
				if (curYear < 2017 && pl <= 1.6) {
					gzsl = 0.05;
				}
				var gzs = parseInt(objPrice / (1 + (17 / 100)) * gzsl); //购置税 
				var spfy = this.k2w(needItem[2].value) || 500; //上牌费用

				//车船使用费
				var ccsy_item = {
					"0": 180,
					"1.0": 360,
					"1.6": 420,
					"2.0": 720,
					"2.5": 1800,
					"3.0": 3000,
					"4.0": 4500
				};
				var ccsy = 180;
				for (var plItem in ccsy_item) { 
					if (pl > parseFloat(plItem)) {
						ccsy = ccsy_item[plItem];
					}
				}
				// console.log('pl',pl,'ccsy',ccsy);
				var jqx_item = needItem[4];
				var jqx = this.k2w(jqx_item.optionValue[jqx_item.index]); //交强税
				// console.log('jqx',jqx);
				var needPrice = parseFloat(gzs) + parseFloat(spfy) + parseFloat(ccsy) + parseFloat(jqx);
				// console.log('needprice',needPrice);
				needItem[1].value = this.w2k(gzs);
				needItem[2].value = this.w2k(spfy);
				needItem[3].value = this.w2k(ccsy);
				needItem[4].value = this.w2k(jqx);
				// this.modelPrice = this.w2k(objPrice)
				this.modelPrice = this.k2w(objPrice)
				this.need_item = needItem
				this.needPrice = this.w2k(needPrice)

				//选中返回值，否则价格为0
				var checkedItemValue = function(item, value) {
					if (sybxItem[item].checked) return value;
					return 0;
				}

				//商业保险
				var sybxItem = originData.baoxian_item;
				var dszzr = sybxItem[1].optionValue[sybxItem[1].index]; //第三者责任险
				dszzr = this.k2w(dszzr);
				dszzr = checkedItemValue(1, dszzr);

				var clss = parseFloat(objPrice * 1.5 / 100); //车辆损失险
				clss = checkedItemValue(2, clss);

				var qcdq = parseFloat(objPrice * 0.45 / 100 + 120); //全车盗抢险
				qcdq = checkedItemValue(3, qcdq);

				var bjmpty = (clss + dszzr) * 20 / 100; //不计免赔费
				bjmpty = checkedItemValue(6, bjmpty);

				// console.log('bjmpty',bjmpty);
				var zrss = objPrice * 0.15 / 100; //自燃损失
				zrss = checkedItemValue(5, zrss);

				var blddpsValue = ["0.31", "0.19"]; //玻璃单独破碎险
				for (var i = 0; i < blddpsValue.length; i++) {
					var bl = objPrice * parseFloat(blddpsValue[i]) / 100;
					sybxItem[4].optionValue[i] = this.w2k(bl);
				}

				// blddps = objPrice * blddps / 100;
				var blddps = this.k2w(sybxItem[4].optionValue[sybxItem[4].index]);
				blddps = checkedItemValue(4, blddps);

				sybxItem[9].area = objPrice < 300000 ? 0 : objPrice > 500000 ? 2 : 1;
				var cshh = this.k2w(sybxItem[9].optionValue[sybxItem[9].index][sybxItem[9].area]); //车身划痕险
				cshh = checkedItemValue(7, cshh);

				var csryzr = 150; //车上人员责任险
				csryzr = checkedItemValue(8, csryzr);

				var wgzr = dszzr * 20 / 100; //无过责任险
				wgzr = checkedItemValue(7, wgzr);

				var clsheshui = clss * 5 / 100; //车辆涉水险
				clsheshui = checkedItemValue(10, clsheshui);

				// console.log('dszzr',dszzr);
				//console.log(dszzr, clss, qcdq, bjmpty, zrss, blddps, cshh, csryzr, wgzr, clsheshui);
				var sybxPrice = Math.round(dszzr) + Math.round(clss) + Math.round(qcdq) + Math.round(bjmpty) + Math.round(zrss) +
					Math.round(blddps) + Math.round(cshh) + Math.round(csryzr) + Math.round(wgzr) + Math.round(clsheshui);
				// console.log('total');
				// console.log(sybxPrice);
				// console.log(objPrice);
				// console.log(needPrice);
				var totalPrice = parseInt(objPrice + needPrice + sybxPrice); //全款总价
				this.totalPriceNum = totalPrice
				// sybxItem[1].value = this.w2k(dszzr);
				sybxItem[2].value = this.w2k(clss);
				sybxItem[3].value = this.w2k(qcdq);
				sybxItem[6].value = this.w2k(bjmpty);
				sybxItem[5].value = this.w2k(zrss);
				// sybxItem[7].value = 
				// sybxItem[8].value = 
				sybxItem[7].value = this.w2k(wgzr);
				sybxItem[10].value = this.w2k(clsheshui);
				this.surPrice = this.w2k(sybxPrice)
				this.baoxian_item = sybxItem
				this.totalPrice = this.w2k(totalPrice)
				//console.log(sybxItem)
				// var plddps = sybxItem[];
				// 计数默认贷款
				// let mIndex = this.monthlyIdx
				// let rIndex = this.ratioIdx
				this.defaultLoans(this.monthlyIdx,this.ratio[this.ratioIdx].count)
			},
			//编辑事件
			//聚焦改变3位数字为完整数字
			bindKeyFocus: function(e) {
				var value = e.detail.value;
				var id = e.currentTarget.id;
				value = this.k2w(value);
				if (id == 'modelprice') {
					this.modelPrice = value
					this.model.maxlength = 9
				} else if (id == 'nd_2') {
					var need_item = this.need_item;
					need_item[2].value = value;
					need_item[2].maxlength = 9;
					this.need_item = need_item
				}
			},
			//还原完整数字为3位金钱的字符
			bindKeyBlur: function(e) {
				var value = e.detail.value;
				var id = e.currentTarget.id;
				value = this.k2w(value);
				var str = this.w2k(value);

				if (id == 'modelprice') {
					this.modelPrice = str
					this.model.maxlength = 11
					this.getPrice({
						price: value
					});
				} else if (id == 'nd_2') {
					var need_item = this.need_item;
					need_item[2].value = str;
					need_item[2].maxlength = 11;
					this.need_item = need_item
					this.getPrice();
				}

			},
			//只允许输入数字并且头位不能为0
			bindKeyInput: function(e) {
				var value = e.detail.value
				var pos = e.detail.cursor
				if (pos != -1) {
					//光标在中间
					var left = e.detail.value.slice(0, pos)
					//计算光标的位置
					pos = left.replace(/[^\d]/g, '').replace(/^0/g, '').replace(/([\d]{1,9}).*/, '$1').length
				}
				//直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
				//var value = value.replace(/[^\d]/g, '').replace(/^0/g, '').replace(/([\d]{1,9}).*/,'$1');
				// value = value.length > 9 ? value.toString().slice(0,9) - 0 : value;
				return {
					value: value.replace(/[^\d]/g, '').replace(/^0/g, '').replace(/([\d]{1,9}).*/, '$1'),
					cursor: pos
				}

			},

			//选择选项事件
			bindPickerChange: function(e) {
				// console.log(e);
				// console.log('picker发送选择改变，携带值为', e.detail.value);
				var id = e.currentTarget.id;
				var index = e.detail.value;
				if (id == 'nd_4') {
					this.$set(this.need_item[4], 'index', index)
				} else if (id == 'bx_1') {
					this.$set(this.baoxian_item[1], 'index', index)
				} else if (id == 'bx_4') {
					this.$set(this.baoxian_item[4], 'index', index)
				} else if (id == 'bx_9') {
					this.$set(this.baoxian_item[9], 'index', index)
				}
				// console.log(this);
				this.getPrice();
			},
			selectItem(index) {
				console.log(index, 'index')
				if (this.changed == "") {
					let changed = {};
					for (let i in this.baoxian_item) {
						if (i == 0) continue;
						if (i == index) {
							let data = JSON.stringify(this.baoxian_item[i]);
							let item = JSON.parse(data)
							if (this.baoxian_item[i].checked) {
								changed['baoxian_item[' + i + '].checked'] = false;
								item.checked = false;
								this.baoxian_item[i] = item
							} else {
								changed['baoxian_item[' + i + '].checked'] = true;
								item.checked = false;
								this.baoxian_item[i] = item
							}
						} else {
							changed['baoxian_item[' + i + '].checked'] = this.baoxian_item[i].checked;
						}
					}
					this.changed = changed;
				} else {
					if (this.baoxian_item[index].checked) {
						this.changed['baoxian_item[' + index + '].checked'] = false;
						this.baoxian_item[index].checked = false
					} else {
						this.changed['baoxian_item[' + index + '].checked'] = true;
						this.baoxian_item[index].checked = true
					}
				}
				this.getPrice();
			},
			//选中按钮
			checkboxChange: function(e) {
				// console.log(e);
				// console.log('checkbox发生change事件，携带value值为：', e.detail.value);
				console.log(e)
				var baoxian_item = this.baoxian_item;
				var checked = e.detail.value;
				var changed = {};
				for (var i = 1, len = baoxian_item.length; i < len; i++) {
					if (checked.indexOf(baoxian_item[i].label) !== -1) {
						changed['baoxian_item[' + i + '].checked'] = true
					} else {
						changed['baoxian_item[' + i + '].checked'] = false
					}
				}
				this.changed = changed
				// this.setData(changed);
				this.getPrice();
			},


			//把价格数字转为字符
			w2k: function(str) {
				// console.log(str);
				str = !str ? 0 : str;
				var str = new Number(str);
				str = Math.round(str);

				str = str.toString();
				var n = str.length % 3;
				if (n) {
					return str.slice(0, n) + str.slice(n).replace(/(\d{3})/g, ',$1')
				} else {
					return str.replace(/(\d{3})/g, ',$1').slice(1)
				}
			},
			//把字符转为数字
			k2w: function(str) {
				if (str === '' || str === undefined) {
					str = 0;
				}
				var price = str;
				// console.log(typeof str);
				var str = str + '';
				if (str.indexOf(',') > -1 && str.indexOf('.') == -1) {
					price = null;
					var arr = str.split(',');
					var price = arr.join('');
				}

				return Math.round(price);
			},
			
			setOnclickGdp(confirm){

				if(confirm){
					
					this.$gdp('YCZ_windowOkButtonClick')
					
				}else{
					
					this.$gdp( 'YCZ_windowCancelButtonClick')
					
				}
			},
			
			async reqModelsList(sgId) {
				const that = this
			    try {
			        const {code,data} = await api.fetchModelsList({sgId})
			        if(code === 1 && data[0].pcModelId) {
			            that.modelsList = data
						let modelId = data[0].pcModelId
						that.getSerial(modelId,sgId, 1, function(data) {
							that.getPrice(data);
						});
			        }
			    } catch (error) {
			       uni.showModal({
			       	title: '没有找到你查询的车系',
			       	confirmColor: '#007adf',
			       	success: function(res) {
						
						that.setOnclickGdp(res.confirm)
			       		if (res.confirm) {
							
			       			uni.navigateBack({
			       				delta: 1
			       			});
			       		}
			       	}
			       })
			    }
			},
			//获取车系数据
			async getSerial(modelId, serialId, cityId, callback) {

				// var modelId = modelId;
				// var serialId = serialId;
				// var cityId = cityId || this.cityId;
				// var cityId = appInstance.location.cityId || 1;
				var that = this;
				// console.log('serial',this.serial);
				if ((this.serial && this.serial.length) || this.loading) return;
				this.loading = true
				
				uni.showLoading({
					title: '加载中',
				})
				// calcSerial
				// calcModel
				let data = await  api.getCalcModel({
						serialId: serialId,
						version: 1
					})
			
				if(data){
					this.drive = true
					if(modelId=='' ||modelId ==undefined){
						modelId = data.sections[0].data[0].id
					}
					var sales = data.sections;
					that.carData = data
					that.serial = sales
					var findFlag = false;
						this.carPhoto = data.baiPicUrl
					for(let i = 0;i<sales.length;i++){
						for(let j = 0 ;j<sales[i].data.length;j++){
						let saledata = sales[i].data[j]
							if(saledata.id == modelId){
								var model = {
									id: saledata.id,
									title: saledata.title,
									pl: saledata.yqPl,
									price: saledata.price * 10000,
									serialId: serialId,
									photo:saledata.photo
								}
								that.model = model
								that.modelPrice = model.price
								callback && callback.call(this, model);
								findFlag = true;
								break;
							}
						}
					}
					
						uni.hideLoading()
					if (!findFlag ) {
						this.drive = false
						uni.showModal({
							title: '没有找到你查询的车型',
							content: '请返回重新选择试试',
							confirmColor: '#007adf',
							success: function(res) {
								that.setOnclickGdp(res.confirm)
								if (res.confirm) {
									
									uni.navigateBack({
										delta: 1
									});
								}
							}
						})
					}
				}else{
					uni.hideLoading()
					this.drive = false
					uni.showModal({
						title: '没有找到你查询的车系',
						confirmColor: '#007adf',
						success: function(res) {
							that.setOnclickGdp(res.confirm)
							if (res.confirm) {
								
								uni.navigateBack({
									delta: 1
								});
							}
						}
					})
				}
			},
			defaultLoans(mIndex,rcount){
				// let mIndex = this.monthlyIdx
				// let rIndex = this.ratioIdx
				let shoufu = this.totalPriceNum * rcount/100
				let loan = Math.round((this.totalPriceNum - shoufu)/10000)*10000;
				let loanMonthRate = this.monthly[mIndex].rate / 100 /12;      //月利率
				let loanMonths = this.monthly[mIndex].monthly;    //贷款总月数
				let temp = Math.pow((1+loanMonthRate),loanMonths);
				let monthPay = Math.round(loan*loanMonthRate*temp/(temp-1));
				this.monthPay = this.w2k(monthPay)
				this.shoufu = this.w2k(shoufu)
				this.loantotal = shoufu+monthPay*loanMonths;
				this.loantotalStr = this.w2k(shoufu+monthPay*loanMonths)
				this.priceGap = this.w2k(Math.round(this.loantotal - this.totalPriceNum))
			},
			checkRatio(e){
				let rIndex = e.currentTarget.dataset.idx
				let mIndex = this.monthlyIdx
				this.ratioIdx = rIndex
				this.defaultLoans(mIndex,this.ratio[rIndex].count)
			},
			checkMonthly(e){
				let mIndex = e.currentTarget.dataset.idx
				let rIndex =  this.ratioIdx
				this.monthlyIdx = mIndex
                if(this.ratioIdx === 3) {
                    this.defaultLoans(mIndex,this.ratioArray[this.DownPaymentindex].count)
                }else {
                    this.defaultLoans(mIndex,this.ratio[rIndex].count)
                }
				
			},
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
		
			loansPayment(){
				this.isLoans = true
			},
			fullPayment(){
				this.isLoans = false
			},
			goDrive(){
				if(this.drive == true){
					uni.navigateTo({
						url: "/pages/YuyuePage?serialId="+this.serialId+"&from=calc"
					})
					
				}
				
				
				this.$gdp('YCZ_leaveAssetsEntranceButtonClick', { "YCZ_sourcePage_var": '购车计算器页', "YCZ_sourceButtonName_var": '预约试驾' })
				
			},
            //控制必要花费和商业保险的展开 1:必要花费 2:商业保险
            closeprice(sort) {
                if(sort === 1) {
                    this.needToSpendExpand = !this.needToSpendExpand
                }else if(sort === 2) {
                    this.commercialInsuranceExpand = !this.commercialInsuranceExpand
                }
            }
		}
	}
</script>

<style lang="less">
	@import (reference) '@/static/less/public.less';
.calc {
    height: 100%;
    padding-bottom: 250rpx;
}
.pageTop-zw{
    height: 128rpx;
	background-color: #3a3a3a;
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
    overflow: hidden;
    z-index: 666;
	background-color: #3a3a3a;
}
.pageTop-back-btn{
    width: 26rpx;
    height: 26rpx;
    border-left: 4rpx solid #fff;
    border-top: 4rpx solid #fff;
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
.pageTop-text-box{
     width: 100%;
	 text-align: center;
}
.pageTop-text{
       display: inline-block;
	   color: #fff;
	   height: 42rpx;
	   line-height: 42rpx;
	   font-size: 32rpx;
	   margin: 0 24rpx;
}
.pageTop-act{
      font-weight: bold;
	  font-size: 40rpx;
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
	page {
		height: 100%;
		font-family: 'helvetica neue', tahoma, 'hiragino sans gb', stheiti, 'wenquanyi micro hei', \5FAE\8F6F\96C5\9ED1, \5B8B\4F53, sans-serif;
		font-size: 28rpx;
		-webkit-text-size-adjust: none;
		color: #333;
		line-height: 1.5;
	}

	.container {
		height: 100%;
	}

	input {
		text-align: right;
		padding: 0;
	}
	.box{
		// background-color: #3a3a3a;
	}
	.box-hd {
		background: #3A3A3A;
		color: #fff;
		font-size: 28rpx;
		padding: 0 92rpx 0;
		overflow: hidden;
	}
	.box-Loans{
		padding: 0 56rpx 0;
	}
	.box-hd .info-price{
		display: flex;
		justify-content:space-between;
		margin-top: 20rpx;
		margin-bottom: 46rpx;
		text-align: center;
	}
	
	.box-hd .all-price {
		display: flex;
		justify-content:center;
		text-align: center;
		margin-bottom: 70rpx;
	}
	.box-hd .all-price-loans {
		margin-bottom: 40rpx;
	}
	.box-hd .all-price .price{
		font-size: 72rpx;
		color: #FA8845;
		line-height: 72rpx;
		margin-top: 23rpx;
	}
	.box-hd .all-price .title{
		font-size: 22rpx;
		color: #AAAAAA;
		line-height: 22rpx;
	}
	.box-hd .all-price .hint{
		font-size: 22rpx;
		color: #AAAAAA;
		line-height: 32rpx;
		height: 32rpx;
		text-align: center;
		background-color: #434343;
		margin-bottom: 0;
		border-radius: 16rpx;
		margin-top: 8rpx;
	}
	.box-hd .info-price .price{
		font-size: 24rpx;
		color: #fff;
		line-height: 24rpx;
		margin-top: 18rpx;
	}
	.box-hd .info-price .title{
		font-size: 22rpx;
		color: #AAAAAA;
		line-height: 22rpx;
	}

	.total-price-ipt {
		font-size: 27px;
		text-align: left;
	}

	.total-price-no {
		font-size: 27px;
		margin-right: 20rpx;
	}

	.price-list {
		background: #006EC8;
		font-size: 12px;
		line-height: 72rpx;
		display: flex;
		flex-grow: row nowrap;
		justify-content: space-between;
		padding: 0 40rpx;
		color: #6db6f2;
	}

	.section {
		// border-bottom: 40rpx solid #F0F0F5;
		padding: 0;
		background-color: #fff;
        &.cancel-sction {
            height: 148rpx;
            overflow: hidden;
        }
	}
	.section_first{
		border-radius:30rpx 30rpx 0 0;
	}
	.section-item {
		padding: 0 20rpx;
		height: 101rpx;
		display: flex;
		flex-grow: row nowrap;
		position: relative;
		color: #888;
		font-size: 14px;
		align-items: center;
		background-color: #f5f5f5;
	}
	.section-loans{
		padding: 0 20rpx;
		position: relative;
		color: #333;
		font-size: 14px;
		background-color: #fff;
	}
	.loans-title{
		height: 76rpx;
		line-height: 76rpx;
		font-size: 30rpx;
		font-weight: bold;
		
	}
	.loans-hd{
		display: inline-block;
	}
	.loans-bd{
		display: inline-block;
		float: right;
	}
	.option-loans{
		overflow: hidden;
		height: 60rpx;
		padding-bottom: 40rpx;
	}
	.option-loans .title{
		display: inline-block;
		font-size: 24rpx;
		line-height: 56rpx;
		color: #999;
		margin-right: 22rpx;
		float: left;
	}
	.option-loans .option_item{
		display: inline-block;
		width: 98rpx;
		height: 56rpx;
		line-height: 56rpx;
		background-color: #f5f5f5;
		border-radius: 28rpx;
		text-align: center;
		margin-right: 24rpx;
	}
	.option-loans .option_item.act{
		background-color: #FA8845;
		color: #fff;
		
	}
	.loans-row{
		display: inline-block;
		width: 600rpx;
		overflow-y: auto;
		white-space: nowrap;
	}
	.model-item{
		height: 200rpx;
		background-color: #fff;
		border-radius:30rpx ;
	}
	.section-item .photo{
		width: 160rpx;
		height: 120rpx;
	}
	.section-item:not(:first-child) {
		font-size: 15px;
	}

	.section-item::before,.section-loans::before {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		border-bottom: 1rpx solid #e5e5e5;
		content: "\0020";
	}

	.section-item:not(:last-child)::before {
		left: 20rpx;
		right: 20rpx;
	}

	.section-title:first-child::before {
		left: 0;
		right: 0;
	}

	.section-title {
		// padding-left: 47rpx;
		background-color: #fff;
	}

	// .section-title::after {
	// 	width: 8rpx;
	// 	height: 8rpx;
	// 	border-radius: 100%;
	// 	background: #888888;
	// 	position: absolute;
	// 	left: 0;
	// 	top: 50%;
	// 	margin: -4rpx 0 0 24rpx;
	// 	content: "";
	// }

	.section-hd {
		flex: 1;
		min-width: 120rpx;
		font-size: 28rpx;
		color: #333;
        padding: 10rpx 0;
        .tit_title {
            font-weight: bold;
            font-size: 30rpx;
        }
		.tit_text {
            font-size: 24rpx;
            color: #999999;
            margin-top: 5rpx;
        }
	}
	.section-title{
		font-weight: bold;
		font-size: 30rpx;
		color: #333;
	}
	.section-hd .tip {
		font-size: 12px;
		font-weight: 400;
	}

	.section-bd {
		text-align: right;
		padding-right: 40rpx;
		position: relative;
		color: #000;
	}

	.section-dark .section-bd {
		color: #000;
	}

	/*可编辑*/
	.section-editabled {
		min-width: 210rpx;
		position: absolute;
		left: 8rpx;
		top: 0;
		height: 100rpx;
		width: 722rpx;
		box-sizing: border-box;
		padding-right: 0;
	}

	.section-editabled input {
		line-height: 100rpx;
		height: 100rpx;
		padding-right: 40rpx;
		margin-left: 10em;
		text-align: right;
	}

	.icon-editor {
		width: 19rpx;
		height: 19rpx;
		background: url(https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/calc_edit.png) no-repeat;
		background-size: cover;
		position: absolute;
		right: 0;
		top: 50%;
		transform: translate(0, -50%);
		content: "";
	}

	.picker-item {
		position: absolute;
		left: 86rpx;
		top: 0;
		right: 20rpx;
		height: 101rpx;
		line-height: 101rpx;
	}

	.section-picker::after {
		position: absolute;
		right: 8rpx;
		top: 50%;
		margin-top: -8rpx;
		content: "";
		border-top: 2rpx solid #B0B0B0;
		border-right: 2rpx solid #B0B0B0;
		transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		width: 16rpx;
		height: 16rpx;
	}

	.checkbox {
		float: left;
		margin-right: 20rpx;
		position: relative;
		width: 36rpx;
		height: 36rpx;
		background: url(https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/calc_check.png) no-repeat;
		background-size: 100% 100%;
		// background-position: center 0;
	}

	.checked {
		// background-position: center 100%;
		background: url(https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/calc_check_on.png) no-repeat;
	}

	.checkbox .checkbox-btn {
		position: absolute;
		left: -9999px;
	}

	.section-desc {
		font-size: 24rpx;
		display: block;
		color: #999;
		
	}

	.slide {
		position: fixed;
		right: 0;
		top: 0;
		width: 582rpx;
		z-index: 99;
		height: 100%;
		overflow: hidden;
	}

	.slide {
		right: -100%;
	}

	.mask {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: block;
		content: "";
	}

	.serialSelect {
		position: absolute;
		background: #fff;
		display: block;
		width: 582rpx;
		right: 0;
		top: 0;
		height: 100%;
		overflow: auto;
		z-index: 100;
	}

	.slide-title {
		text-align: center;
		height: 113rpx;
		font-size: 16px;
		line-height: 113rpx;
	}

	.serial-title {
		background: #F0F0F5;
		color: #aaa;
		font-size: 12px;
		line-height: 40rpx;
		padding-left: 25rpx;
	}

	.serial-item {
		font-size: 16px;
		border-bottom: 1rpx solid #EAEAEA;
		padding-left: 25rpx;
		padding-right: 43rpx;
		line-height: 100rpx;
		height: 100rpx;
		overflow: hidden;
		color: #000;
		position: relative;
	}

	.serial-item view {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}

	.serial-item.cur:after {
		width: 26rpx;
		height: 19rpx;
		background: url(https://magear.pcauto.com.cn/p/www1.pcauto.com.cn/xwapp/2016/price/images/calc-checked.png) no-repeat;
		background-size: cover;
		position: absolute;
		right: 17rpx;
		top: 50%;
		margin-top: -10rpx;
		content: "";
		display: block;
	}
	.hint{
		height: 100rpx;
		margin-bottom: 128rpx;
		text-align: center;
		line-height: 100rpx;
		font-size: 24rpx;
		color: #999;
		background: #ffffff;
	}
	.foot{
		height: 148rpx;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		width: 100%;
	}
	.foot .btn{
		height: 88rpx;
		width: 686rpx;
		color: #fff;
		text-align: center;
		line-height: 88rpx;
		background-color: #FA8845;
		border-radius:44rpx;
		margin: 0 auto;
		font-size: 32rpx;
		margin-top: 20rpx;
	}
    .arrow {
        width: 15rpx;
        height: 20rpx;
        background-image: url("../static/images/right_arrow.png");
        background-size: auto 100%;
        background-repeat: no-repeat;
        &.to_down {
            transform: rotate(90deg);
        }
    }
    .height148 {
        height: 148rpx;
    }
</style>
