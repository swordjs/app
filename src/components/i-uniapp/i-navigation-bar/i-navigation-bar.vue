<template>
  <view class="iNavBar">
    <!-- 一个是普通未吸顶的view -->
    <view :class="['iNavBarMain']">
      <view :class="['icon']" @click="handleBack">
        <i-icon color="#fff" @click="handleBack" name="arrow-left-s-line" />
      </view>
      <text>
        <slot></slot>
      </text>
    </view>
    <!-- 一个是吸顶覆盖在普通上面的view -->
    <view v-if="sticky" :class="['iNavBarMain', { sticky }]">
      <view :class="['icon']" @click="handleBack">
        <i-icon color="#000" @click="handleBack" name="arrow-left-s-line" />
      </view>
      <text>
        <slot></slot>
      </text>
    </view>
  </view>
</template>
<script lang='ts'>
import { defineComponent, ref } from "vue";
export default defineComponent({
  props: {
    sticky: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const handleBack = () => {
      uni.navigateBack({
        delta: 1,
      });
    };
    const statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    emit("onReady", {
      height: statusBarHeight + 30 + 17,
    });
    return {
      handleBack,
    };
  },
});
</script>


<style lang="scss" scoped>
.iNavBarMain {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60rpx;
  color: #fff;
  margin-top: calc(34rpx + var(--status-bar-height));
  overflow: hidden;
  &.sticky {
    z-index: 9999;
    position: fixed;
    top: 0;
    background: #fff;
    margin-top: 0;
    padding-top: calc(34rpx + var(--status-bar-height));
  }
  .icon {
    position: absolute;
    left: 30rpx;
    top: 70%;
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