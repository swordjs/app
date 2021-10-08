<template>
  <view class="IInput">
    <input
      class="value"
      :maxlength="maxlength || 99"
      :name="name"
      :type="type"
      @input="handleInput"
      :value="defaultValue"
      :placeholder="placeholder"
      placeholder-style="color:#BCBDC3"
    />
  </view>
</template>

<script>
import { watch, ref, computed } from "vue";
export default {
  props: ["modelValue", "placeholder", "type", "name", "maxlength"],
  setup(props, { emit }) {
    const defaultValue = computed(() => {
      return props.modelValue
    });
    const handleInput = (e) => {
      const value = e.target.value;
      emit("input", value);
    };
    return {
      defaultValue,
      handleInput,
    };
  },
};
</script>

<style lang="scss" scoped>
.IInput {
  text-align: end;
  color: #333333;
  font-size: 28rpx;
  input {
    &:focus {
      text-align: end;
    }
  }
}
</style>
