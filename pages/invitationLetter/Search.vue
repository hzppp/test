<template>
  <view class="invitation-search">
    <view class="content">
      <input type="text" placeholder="请输入线索ID" v-model="id" />
      <button class="btn" @click="verify">生成</button>
    </view>
  </view>
</template>

<script>
import api from "@/public/api/index"
export default {
  data() {
    return {
      id: "",
    }
  },
  onShareAppMessage() {
    let title = "填写线索ID"
    let path = `pages/invitationLetter/Search`
    let imageUrl = "https://www1.pcauto.com.cn/zt/gz20220104/changan/xcx/img/changan_dcc_share.png"
    return { title, path, imageUrl }
  },
  methods: {
    async verify() {
      try {
        let params = {
          crmClueId: this.id,
          isLogin: 0,
        }
        uni.showLoading({
          title: "正在加载...",
          mask: true,
        })
        const res = await api.getInvitaionLetter(params)
        if (res.code == 1) {
          // 验证成功跳转到结果页
          uni.navigateTo({
            url: "/pages/invitationLetter/Result?id=" + this.id,
          })
        } else {
          setTimeout(()=>{
            this.dilog(res.msg)
          },500)
        }
      } catch (error) {
        console.error(error)
        this.dilog("网络异常，请稍后再试…")
      }
    },
    // 提示信息
    dilog(msg) {
      uni.showToast({
        title: msg,
        icon: "none",
        duration: 1500,
        mask: true,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.invitation-search {
  position: relative;
  width: 100%;
  height: 100vh;
  background-image: url(https://www1.pcauto.com.cn/zt/gz20220104/changan/xcx/img/changan_dcc_bg.jpg);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .content {
    position: absolute;
    padding: 60rpx 32rpx 40rpx;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 686rpx;
    height: 336rpx;
    background: #ffffff;
    border-radius: 20rpx;
    box-shadow: 0 0 20rpx 20rpx rgba(0, 0, 0, 0.03);
    box-sizing: border-box;
  }
  input {
    padding: 0 32rpx;
    width: 606rpx;
    height: 88rpx;
    background: #f8f8f8;
    border: 3rpx solid #cccccc;
    border-radius: 10rpx;
    box-sizing: border-box;
  }
  .btn {
    margin: 60rpx auto 0;
    width: 460rpx;
    height: 88rpx;
    background: #fa8845;
    border-radius: 44rpx;
    color: #fff;
  }
}
</style>
