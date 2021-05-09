<template>
  <view class="webview">
      <web-view :src="url"></web-view>
  </view>
</template>
<script lang='ts'>
import { defineComponent, ref } from "vue";
export default defineComponent({
  onLoad(e) {
    if (e.url) {
      this.url = e.url;
    }
  },
  setup() {
    const url = ref<string>("");
    return {
      url,
    };
  },
});
</script>
<style scoped>
</style>