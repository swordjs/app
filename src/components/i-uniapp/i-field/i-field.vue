<template>
  <view class="IField">
    <view class="fieldTop">
      <view class="label">
        <!-- 如果必填则显示图标 -->
        <view
          :style="{
            visibility: required ? 'visible' : 'hidden',
          }"
        >
          <i-icon name="asterisk" size="20rpx" color="#FF4B54"></i-icon>
        </view>

        <view>{{ label }}</view>
      </view>
      <slot></slot>
    </view>
  </view>
</template>

<script>
import iIcon from "../i-icon/i-icon.vue";
export default {
  components: { iIcon },
  props: {
    label: {
      type: String,
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.IField {
  width: 690rpx;
  line-height: 100rpx;
  margin: 0 auto;
  .fieldTop {
    width: 660rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
    .label {
      display: flex;
      justify-content: flex-start;
      align-content: center;
      color: #666666;
      font-size: 28rpx;
      & /deep/ .i-icon {
        margin-top: 0;
      }
    }
  }
}
</style>
