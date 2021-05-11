<template>
	<view class="dataassistant">
		<page-top ref="pagetop" :background="'#fff'" :titleys="'#000'" :btnys="''" :title.sync="title"></page-top>
		<view class="dataassistant-content">
			<view class="ser-box">
				<view class="box-hd">{{serialGroupName}}</view>
				<view class="box-content">
					<image class="auto-image" :src="serialObject.baiPicUrl" mode="widthFix" lazy-load="true"></image>
					<!-- <view></view> -->
					<picker @change="bindMultiPickerChange" :range="selectList" range-key="text" class="change-auto-btn">
						<view>更换车型</view>
					</picker>
					<!-- <view class="look-auto-pk-btn" @tap="towebView">车型对比</view> -->
				</view>
			</view>
			<!--  -->
			<view class="data-box">
				<view class="box-hd">基本参数</view>
				<view class="content">
					<block v-for="(i,index) in showPartValue" :key="index">
						<block v-for="(v,vindex) in modelAllData" :key="vindex">
							<view v-if="i == v.name" class="item">
								<view class="p1">{{v.name}}</view>
								<view class="p2">{{v.value}}</view>
							</view>
						</block>
					</block>
				</view>
			</view>
			<!--  -->
			<view class="size-box">
				<view class="box-hd">空间</view>
				<view class="box-content">
					<block v-for="(item,index) in size" :key="index">
						<view :class="'p'+index">{{item}}</view>
					</block>
				</view>
			</view>
			<!-- 更多参数 -->
			<view class="more-data-box">
				<view class="box-hd">更多参数</view>
				<view class="box-content">
					<view class="item" v-for="(item,index) in moreDataList" @tap="toxqPage(index)">
						<view class="text">
							{{item.name}}(<text>{{item.field_count}}</text>)
						</view>
					</view>
				</view>
			</view>
			<!--  -->
		</view>
	</view>
</template>

<script>
	import api from '@/public/api/index'
	import pageTop from '@/components/pageTop/pageTop'
	import domain from '@/configs/interface';
	let app = getApp()
	export default {
		components: {
			'page-top': pageTop
		},
		data() {
			return {
				title: "参配助手",
				serialObject: {},
				selectList: [],
				modelId: "",
				serialGroupName: "",
				showPartValue: ['排量(mL)', '变速箱', '驱动方式', '燃料形式', '车身类型', '整车质保'],
				moreDataList: [],
				modelAllData: [],
				pkURL: "",
				size: []
			}
		},
		async onLoad(options) {
			this.modelId = options.id
			api.getModelListBySerialId(options.serialGroupId).then(res => {
				this.serialObject = res
				let selectList = []
				for (let v in res.sections) {
					let vo = res.sections[v].data
					for (let vv in vo) {
						let vvobj = vo[vv]
						if (vvobj.state != '停售') {
							selectList.push(vvobj)
						}
					}
					console.log(selectList)
					// console.log('vo',vo)
					// selectList.push(...vo)
				}
				for (let i in selectList) {
					let obj = selectList[i]
					obj.text = obj.yearTitle + obj.modelName
				}
				this.selectList = selectList
				
			})
			this.getJson()
		},

		onShareAppMessage() {
			let title = `我正在看「${this.serialGroupName}」，推荐给你`
			let path = `pages/authorization?to=dataassistant&id=${this.modelId}`
			if (app.globalData.salesId) {
				path += `&salesId=${app.globalData.salesId}`
			}
			let imageUrl = this.serialObject.baiPicUrl
			return {
				title: title,
				path: path,
				imageUrl: imageUrl
			}
		},
		methods: {
			toxqPage(i) {
				let obj = this.moreDataList[i]
				console.log(obj)
				if (obj.field_count > 0) {
					app.globalData.AutoOptions = this.moreDataList[i]
					uni.navigateTo({
						url: "/pages/datadetails"
					})
				}
			},
			bindMultiPickerChange(e) {
				// console.log(e)
				let id = this.selectList[e.detail.value].id
				this.modelId = id
				this.getJson()
			},
			towebView() {
				let vurl = escape(this.pkURL)
				let url = `/pages/pkwebview?webURL=${vurl}`
				console.log(url)
				uni.navigateTo({
					url: url
				})
			},
			getJson() {
				this.pkURL =
					`${domain.DOMAIN.host}/buyer/compare/r${app.globalData.currentLocation.cityData.cityId}/?mIds=${this.modelId}`
				api.getModelParamEquip(this.modelId).then(data => {
					let a
					for (let i in data) {
						a = data[i]
					}
					let b = a.slice(1, data.length)
					this.moreDataList = b
					
				})
				api.getModelData(this.modelId).then(data => {
					this.modelAllData = data.modelAllData
					this.serialGroupName = data.modelName
					this.size = data.size
					console.log(data)
					
				})
			}
		}
	}
</script>

<style lang="less">
	@import '@/static/less/dataassistant.less';
</style>
