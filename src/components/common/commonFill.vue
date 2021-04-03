<template>
  <view class="fillBox">
    <image
      class="icon"
      :style="{
          width: icons[type].width,
          height: icons[type].height
      }"
      :src="icons[type].image"
    />
    <view class="title">{{ title }}</view>
    <view class="tip">{{ tip }}</view>
  </view>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  props: {
    type: {
      type: String,
      default: "notResult",
    },
    title: {
      type: String,
      default: "暂无数据",
    },
    tip: {
      type: String,
      default: "",
    }
  },
  setup() {
    const icons = ref({
      notResult: {
        image: require("../../static/common/notResult.png"),
        width: "330rpx",
        height: "298rpx",
      },
    });
    return {
      icons,
    };
  },
});
</script>
<style lang="scss" scoped>
.fillBox {
  margin: 0 auto;
  text-align: center;
  .title {
    color: #666666;
    font-size: 28rpx;
  }
  .tip {
    font-size: 24rpx;
    color: #666666;
    margin-top: 4rpx;
  }
}
</style>