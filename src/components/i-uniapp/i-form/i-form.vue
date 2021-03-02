<template>
  <view class="IForm">
    <slot></slot>
  </view>
</template>

<script>
import { defineComponent, watch } from "vue";
export default defineComponent({
  props: {
    form: {
      type: Object,
      default: {},
    },
    formRule: {
      type: Object,
    },
  },
  setup(props, e) {
    const validate = () => {
      console.log("点击了校验");
    };
    return {
      validate,
    };
  },
});
</script>

<style lang="scss" scoped>
.IForm {
  width: 690rpx;
  background-color: #fff;
  border-radius: 16rpx;
  margin: 0 auto;
}
</style>
