<template>
  <div class="webview">
    <web-view :src="url"></web-view>
  </div>
</template>
<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';

const url = ref<string>('');

onLoad((e) => {
  if (e.url) {
    url.value = e.url;
  }
});
</script>
<style scoped></style>
