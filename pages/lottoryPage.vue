<template>
  <view>
    <pageTopCity ref="pagetop" :background="'#fff'" :titleys="'#3C4650'" :btnys="'white'" :title.sync="title"></pageTopCity>
    <LuckyWheel
        ref="luckyWheel"
        width="520rpx"
        height="520rpx"
        :blocks="blocks"
        :prizes="prizes"
        :defaultStyle="defaultStyle"
        @start="startCallBack"
        @end="endCallBack"
    />
  </view>
</template>

<script>
import LuckyWheel from '@/components/uni-luck-draw/lucky-wheel'
import pageTopCity from '@/components/pageTopCity/pageTopCity'

export default {
  name: "lottoryPage",
  components: {LuckyWheel,pageTopCity},
  data() {
    return {
      title: '转盘抽奖',
      blocks: [],
      prizes: [
        { title: '1元红包', background: '#c3ecff', fonts: [{ text: '', top: '18%' }],
          imgs:[
            {
              src:'https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/prize_18888.png',width:'100%',height: '100%',top:'1rpx'
            }
          ] },
        { title: '100元红包', background: '#f4fcff', fonts: [{ text: '', top: '18%' }],
          imgs:[
            {
              src:'https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/prize_thx.png',width:'100%',height: '100%',top:'1rpx'
            }
          ] },
        { title: '0.5元红包', background: '#c3ecff', fonts: [{ text: '', top: '18%' }],
          imgs:[
            {
              src:'https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/prize_18888.png',width:'100%',height: '100%',top:'1rpx'
            }
          ] },
        { title: '2元红包', background: '#f4fcff', fonts: [{ text: '', top: '18%' }],
          imgs:[
            {
              src:'https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/prize_thx.png',width:'100%',height: '100%',top:'1rpx'
            }
          ] },
        { title: '10元红包', background: '#c3ecff', fonts: [{ text: '', top: '18%' }],
          imgs:[
            {
              src:'https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/prize_18888.png',width:'100%',height: '100%',top:'1rpx'
            }
          ] },
        { title: '50元红包', background: '#f4fcff', fonts: [{ text: '', top: '18%' }],
          imgs:[
            {
              src:'https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/prize_thx.png',width:'100%',height: '100%',top:'1rpx'
            }
          ] },
        { title: '50元红包', background: '#c3ecff', fonts: [{ text: '', top: '18%' }],
          imgs:[
            {
              src:'https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/prize_18888.png',width:'100%',height: '100%',top:'1rpx'
            }
          ] },
        { title: '50元红包', background: '#f4fcff', fonts: [{ text: '', top: '18%' }],
          imgs:[
            {
              src:'https://www1.pcauto.com.cn/zt/gz20210530/changan/xcx/img/prize_thx.png',width:'100%',height: '100%',top:'1rpx'
            }
          ] },
      ],
      defaultStyle: {
        fontColor: '#d64737',
        fontSize: '14px',
      },
    }
  },
  methods: {
    // 点击抽奖按钮触发回调
    startCallBack () {
      // 先开始旋转
      this.$refs.luckyWheel.play()
      // 使用定时器来模拟请求接口
      setTimeout(() => {
        // 3s后得到中奖索引
        let index = Math.random() * 6 >> 0
        // 缓慢停止游戏
        this.$refs.luckyWheel.stop(index)
      }, 3000)
    },
    // 抽奖结束触发回调
    endCallBack (prize) {
      // 奖品详情
      console.log(prize)
    }
  }
}
</script>

<style scoped>

</style>
