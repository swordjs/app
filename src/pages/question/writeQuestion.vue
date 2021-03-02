<template>
  <view class="writeBox">
    <view class="card">
      <view class="vertical"></view>
      <view class="content">
        {{ questionInfo.title }}
      </view>
    </view>
    <view class="editor">
      <!-- 撰写答案 -->
      <robin-editor
        class="editor"
        @cancel="handleCancel"
        @save="handleSaveEditor"
        v-model="questionInfo.content"
        :imageUploader="uploadImg"
        :muiltImage="true"
      ></robin-editor>
    </view>
  </view>
</template>

<script lang="ts">
import { ref } from "vue";
interface IPageParams {
  id: string;
  title: string;
}
export default {
  onLoad(params: IPageParams) {
    this.questionInfo.id = params.id;
    this.questionInfo.title = params.title;
  },
  setup() {
    // 题目信息
    const questionInfo = ref<{
      id: string;
      title: string;
      content: string;
    }>({
      id: "",
      title: "",
      content: "",
    });
    // 保存富文本
    const handleSaveEditor = async (e: {html: string}) => {
		console.log(e.html)
	};
    // 取消富文本（返回上一层）
    const handleCancel = () => {
      uni.navigateBack({
        delta: 1,
      });
    };
    return {
      questionInfo,
	  handleSaveEditor,
	  handleCancel,
    };
  },
};
</script>

<style>
page {
  background-color: #f6f7f9;
}
</style>
<style lang="scss">
view {
  box-sizing: border-box;
}
.card {
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 680rpx;
  margin: 0 auto;
  padding: 20rpx;
  background-color: #fff;
  font-size: 30rpx;
  margin-top: 108rpx;
  border-radius: 8px;
  .vertical {
    position: absolute;
    top: 36rpx;
    left: 20rpx;
    width: 8rpx;
    height: 24rpx;
    background: linear-gradient(180deg, #91abf6 0%, #5873e9 100%);
    border-radius: 1px;
  }
  .content {
    font-weight: bold;
    max-width: 632rpx;
    line-height: 50rpx;
    margin-left: 20rpx;
  }
}
.editor {
  width: 100%;
}
</style>
