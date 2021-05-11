<template>
	<view class="putArticle">
		<page-top @page-back="pageBack" :background="'#fff'" :titleys="'#000'" :isstoppageback.sync="isstoppageback" :btnys="''"
		 :title.sync="title"></page-top>
		<view class="title-box">
			<input type="text" @input="getTitle" :value="articleTitle" placeholder="标题（5-20个字）" placeholder-class="placeholder"
			 maxlength="20">
			</input>
		</view>
		<view class="text-pic-list">
			<block v-for="(item,index) in picTextList" :key="index">
				<block v-if="item.type == 'txt'">
					<view class="textarea-box item">
						<view class="del-btn" @tap="delItme(index)"></view>
						<view :class="'textarea ' + (item.value == ''?'gray':'')" @tap="textFocus(index)" v-if="!item.focus"><text>{{item.value == ''?'来吧，畅所欲言...':item.value}}</text></view>
						<textarea v-else class="textarea" :focus="item.focus" @blur="textBlur(index)" @input="getValue(index,$event)" :value="item.value"
						 placeholder-class="placeholder" maxlength="-1" />
						</view>
				</block>
				<block v-else>
					<view class="image-box item" v-if="item.value">
						<view class="del-btn" @tap="delItme(index)"></view>
						<image class="image" :src="item.value" mode="widthFix" lazy-load="false"></image>
					</view>
				</block>
			</block>
			<view class="text-pic-btn">
				<view class="btn" @tap="addTextArea"></view>
				<view class="btn" @tap="chooseImage"></view>
			</view>
			<view style="height:124rpx"></view>
			<button  :class="'fix-submit-btn ' + (isOpen?'open':'')" @tap="submit" v-if="isShow">发布</button>
		</view>
	</view>
</template>

<script>
	import pageTop from '@/components/pageTop/pageTop'
	import api from '@/public/api/index'
	let app = getApp()
	export default {
		components: {
			'page-top':pageTop
		},
		data() {
			return {
				title:"发布文章",
				isstoppageback:false,
				isOpen:false,
				articleTitle:"",
				articleUnsubmitStorage:"",
				isShow:true,
				picTextList:[{
						type:"txt",
						value:"",
						isFocus:false
				}]
			}
		},
		watch: {
			"picTextList"(){
				this.checkForm()
			},
			"articleTitle"(){
				this.checkForm()
			}
		},
		onLoad(){
			// this.addTextArea()
			this.articleUnsubmitStorage = uni.getStorageSync('articleUnsubmitStorage')
			if(this.articleUnsubmitStorage){
				this.articleTitle=this.articleUnsubmitStorage.title
				this.picTextList=this.articleUnsubmitStorage.content
			}
		},
		
		methods: {
			pageBack() {
				let articleUnsubmitStorage = {
					content:this.picTextList,
					title:this.articleTitle
				}
				console.log(articleUnsubmitStorage)
				uni.setStorageSync('articleUnsubmitStorage', articleUnsubmitStorage)
				uni.navigateBack({
					delta: 1
				})
			},
			addImage(url,index){
				console.log(url,index)
				api.checkImage(url,index).then(res=>{
					let data = JSON.parse(res.data)
					if(data.data){
						let that = this
						api.uploadUPC(url).then(vres=>{
							console.log(vres)
							let u_data = JSON.parse(vres.data)
							let url = u_data.files[0].url
							that.picTextList[index].value = url
						})
						api.uploadUPC(url).then(res => {
						})
					}else{
						this.showToast('内容不合法')
					}
				})
			},
			showToast(title,duration=2000){
				this.$toast(title, 'none', duration);
			},
			checkForm(){
				let is = false
				for(let i in this.picTextList){
					let obj = this.picTextList[i]
					if(obj.value){
						is = true
					}
				}
				let isstoppageback = false
				if(this.articleTitle.length>20||this.articleTitle.length<5){
					is = false
		
				}else{
					is = true
					isstoppageback = true
				}
				this.isOpen = is
				this.isstoppageback = isstoppageback
				return is
			},
			textBlur(index,e){//文本框失去焦点
				this.picTextList[index].focus = false
				this.isShow=true
			},
			textFocus(index){
				this.picTextList[index].focus = true
				this.isShow=false
			},
			addTextArea(){//添加输入框
				this.picTextList.push({
					type:"txt",
					value:"",
					isFocus:false
				})
			},
			getValue(index,e){//获取输入框内容
				let {detail} = e
				this.picTextList[index].value = detail.value
				// console.log(index,e)
			},
			getTitle(e){
				let {value,cursor} = e.detail
				if(cursor > 20){
					value = value.substr(0,20)
					this.showToast('文章标题限制5-20个字符')
				}
				this.articleTitle = value
			},
			delItme(i){//删除项
				this.picTextList.splice(i,1)
			},
			chooseImage(){//选择图片
				uni.chooseImage({
					sizeType: ['compressed'],
					count: 9,
					success: res => {
						let {tempFilePaths} = res
						let len = this.picTextList.length
						for(let i in tempFilePaths){
							let vi = i*1 + len*1
							this.addImage(tempFilePaths[i],vi)
							this.picTextList.push({
								type:"image",
								value:''
							})
						}
						console.log(res)
					}
				})
			},
			submit(){//发布
				if(!this.isOpen){
					return false
				}
				let articleCover = null
				if(this.picTextList.length<2){
					this.picTextList.push({
						type:"image",
						value:'https://www1.pcauto.com.cn/gz/20191209/dazhong/upload/upload_default-img.jpg'
					})
				}
			   
				for(let i in this.picTextList){
					let obj = this.picTextList[i]
					if(!articleCover && obj.type == 'image'){
						articleCover = obj.value
					}
				}
				
				let articleStorage = {
					articleCover,
					content:this.picTextList,
					title:this.articleTitle
				}
				console.log(articleStorage)
				uni.setStorageSync('articleStorage', articleStorage)
				uni.removeStorageSync('articleUnsubmitStorage')
				let url = '/pages/putDynamic'
				uni.navigateTo({ url })
	
			}
		}
	}
</script>

<style lang="less">
@import '@/static/less/public.less';
@import '@/static/less/putArticle.less';

.pop{
    width: 600rpx;
    height: 336rpx;
    background: #fff;
    position: fixed;
    z-index: 99;
    top: 300rpx;
    left: 50%;
    transform: translate(-50%,0);
    border-radius: 20rpx;
    .tc;
    .text{
        display: block;
        width: 100%;
        color: #333;
        font-size: 32rpx;
        line-height: 55rpx;
        .pa(0,48rpx);
    }
    .btn{
        width: 244rpx;
        .seth(84rpx,32rpx,#333);
        border: 1px solid #d0d0d0;
        border-radius: 84rpx;
        .pa(40rpx,208rpx);
    }
    .btn1{
        background: #ce1330;
        border-color: #ce1330;
        color: #fff;
        left: 312rpx;
    }
}

</style>
