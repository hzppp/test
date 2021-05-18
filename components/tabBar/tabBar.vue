<template>
      <cover-view class="tabbar" :style="{'padding-bottom': paddingBottomHeight + 'rpx'}">
        <cover-view class="tabbar-item" :class="index == 2 && 'mainMenu'" v-for="(item, index) in list" :key="index" @click="tabbarChange(item.path)">
          <cover-image class="item-img"  :src="item.icon_a" v-if="current == index"></cover-image>
          <cover-image class="item-img" :src="item.icon" v-else></cover-image>
          <cover-view class="item-name" :class="{'tabbarActive': current == index}" v-if="item.text">{{item.text}}</cover-view>
        </cover-view>
      </cover-view>
</template>

<script>
export default {
  name: "tabBar",
  props: ['current'],
  data() {
    return {
      paddingBottomHeight: 0,  //苹果X以上手机底部适配高度
      list: [{
        text: '首页',
        icon: '/static/images/tab1_icon.png',  //未选中图标
        icon_a: '/static/images/tab1_icon_c.png',  //选中图片
        path: "index",  //页面路径
      }, {
        text: '直播',
        icon: '/static/images/tab2_icon.png',
        icon_a: '/static/images/tab2_icon_c.png',
        path: "live",
      }
        , {
          text: '云展厅',
          icon: '/static/images/tab3_icon.png',
          icon_a: '/static/images/tab3_icon_c.png',
          path: 'exhibition',
        }, {
          text: '活动',
          icon: '/static/images/tab4_icon.png',
          icon_a: '/static/images/tab4_icon_c.png',
          path: "welfareActivity",
        },{
          text: '我的',
          icon: '/static/images/tab5_icon.png',
          icon_a: '/static/images/tab5_icon_c.png',
          path: "mypage",
        }
      ]
    };
  },
  created() {
    console.log('tttttt')
    let that = this;
    uni.getSystemInfo({
      success: function (res) {
        console.log('getSystemInfo', res)
        let model = ['X', 'XR', 'XS', '11', '12', '13', '14', '15'];
        model.forEach(item => {
          //适配iphoneX以上的底部，给tabbar一定高度的padding-bottom
          if (res.model.indexOf(item) != -1 && res.model.indexOf('iPhone') != -1) {
            that.paddingBottomHeight = 40;
          }
        })
      }
    });
  },
  methods: {
    tabbarChange(path) {
      // this.$pageTo.toTab(path);
      uni.switchTab({
        url: path
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.tabbarActive{
  color: #FA8845 !important;
}
.tabbar{
  position: fixed;
  z-index: 8888;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100rpx;
  background-color: #ffffff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .tabbar-item{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    height: 100rpx;
    .item-img{
      width: 48rpx;
      height: 48rpx;
      margin-bottom: 4rpx;
    }
    .item-name{
      font-size: 26rpx;
      color: #A3A3A3;
    }
    &.mainMenu {
      .item-img{
        width: 72rpx;
        height: 72rpx;
        margin-bottom: 4rpx;
      }
    }
  }
}
</style>
