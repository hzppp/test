import api from '@/public/api/index'
export default {
    async chooseImage(){//选取图片
        var that = this
        return new Promise(async (resolve)=>{
            uni.chooseImage({
                sizeType:'compressed',
                count:1,
                async success(res) {
                console.log(res)
                let tempFilePaths = res.tempFilePaths
                api.uploadUPC(tempFilePaths[0]).then(ress=>{
                let data = ress.data
                    data =  JSON.parse(data)
                    resolve(data)
                })
            }
        })
    })
},
async uploadLicence(url){
    uni.showLoading({
       title: '图片识别中',
     })
     let data = await api.uploadLicencePic(url)
     return data
   }
}