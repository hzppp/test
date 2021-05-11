<template>
	<view class="details" @tap="popHide">
		<view class="cs-box" v-if="csList.fields.length>0">
			<view class="box-hd">
				<view class="hd-tit">参数</view>
			</view>
			<view class="box-content">
				<block v-for="(item,index) in csList.fields" :key="index">
					<view class="list" :hidden="item.isShow" @tap="showDescription(index)">
						{{item.field_name}}
						<view class="fr">
							<block v-if="item.field_name == '车身颜色' || item.field_name == '内饰颜色'">
								<view class="ys-item" v-for="(itemName,index) in item.field_value" :key="index" :style="'background:'+ itemName.color_value"></view>
							</block>
							<block v-else>
								{{item.field_value}}
							</block>
						</view>
					</view>
					<view class="list-description" :hidden="item.isTextShow || item.isShow">
						<view class="description-tit">{{item.field_name}}</view>
						<text>{{item.description}}</text>
					</view>
				</block>
				<view v-if="csList.fields.length > 5" :class="'moren-btn ' + (iszk && 'sq' || '')" @tap="showMore">{{iszk ? "收起":"展开"}}更多详细参配</view>
			</view>
		</view>
		<view class="pz-box" v-if="pzList.fields.length>0">
			<view class="box-hd">
				<view class="hd-tit">配置</view>
			</view>
			<view class="box-content">
				<view class="item" v-for="(item,index) in pzList.fields" :key="index" @tap.stop="popShow(index)">
					<image class="image" :src="item.icon" mode="scaleToFill" lazy-load="true"></image>
					<view class="text">{{item.field_name}}</view>
				</view>
			</view>
		</view>
		<view class="text-pop" v-if="ispopShow" @tap.stop="abd">
			<view class="text-pop-title">{{popObject.field_name}}</view>
			<text>{{popObject.description}}</text>
		</view>
	</view>
</template>

<script>
	let app = getApp()
	export default {
		data() {
			return {
				csList: [],
				pzList: [],
				popObject: {},
				iszk: false,
				ispopShow: false
			}
		},
		async onLoad(options) {
			let items = app.globalData.AutoOptions.items
			console.log(items)
			uni.setNavigationBarTitle({
				title: app.globalData.AutoOptions.name
			})
			for (let i in items) {
				let obj = items[i]
				if (obj.name.indexOf('参数') > -1) {
					if (obj.fields.length > 0) {
						for (let j in obj.fields) {
							let jobj = obj.fields[j]
							jobj.isShow = false
							jobj.isTextShow = true
							if (j > 4) { //大于5条的隐藏
								jobj.isShow = true
							}
							jobj.description = jobj.description.replace(/。/g, '。\n')
						}
						this.csList = obj
					}
				} else {
					obj.fields
					for (let v in obj.fields) {
						obj.fields[v].icon = obj.fields[v].icon.replace(/gz20160810kd/, "gz20190716kd")
					}
					// 
					this.pzList = obj
				}
			}

			console.log(this.csList)
		},
		methods: {
			showDescription(i) {
				let fields = this.csList.fields[i]
				// this.csList.fields[i].isTextShow = !this.csList.fields[i].isTextShow
				fields.isTextShow = !this.csList.fields[i].isTextShow
				this.$set(this.csList.fields,i,fields)
			},
			abd() {
				console.log('-')
			},
			showMore() {
				let list = this.csList.fields
				let len = list.length
				this.iszk = !this.iszk
				if (!this.iszk) {
					len = 4
				}
				for (let i in list) {
					let obj = list[i]
					obj.isShow = false
					if (i > len) {
						obj.isShow = true
					}
				}
			},
			popShow(i) {
				let obj = this.pzList.fields[i]
				this.popObject = obj
				this.ispopShow = true
				console.log(obj)
			},
			popHide() {
				// console.log('--')
				this.ispopShow = false
			}
		}
	}
</script>

<style lang="less">
	@import '@/static/less/datadetails.less';
</style>
