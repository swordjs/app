<template>
  <view class="INavigationBar">
    <view class="icon" @click="handleBack">
      <i-icon color="#fff" @click="handleBack" name="arrow-left-s-line" />
    </view>
    <text>
      <slot></slot>
    </text>
  </view>
</template>
<script lang='ts'>
import { defineComponent, ref } from "vue";
export default defineComponent({
  setup() {
    const handleBack = () => {
      uni.navigateBack({
        delta: 1
      })
    }
    return {
      handleBack
    };
  },
});
</script>
<style lang="scss" scoped>
.INavigationBar {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60rpx;
  color: #fff;
  margin-top: calc(34rpx + var(--status-bar-height));
  .icon {
    position: absolute;
    left: 30rpx;
    top: 50%;
    transform: translateY(-50%);

    &::before {
      content: "";
      position: absolute;
      top: -20px;
      right: -20px;
      bottom: -20px;
      left: -20px;
    }
  }
  text {
    font-size: 36rpx;
  }
}
</style>