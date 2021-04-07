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
        ref="editor"
        class="editor"
        width="690"
        v-model="questionInfo.content"
        :muiltImage="true"
        :header="false"
      ></robin-editor>
    </view>

    <view class="submit" @click="handleSaveEditor">
      <i-icon
        @click="handleSaveEditor"
        name="check-line"
        color="#fff"
        size="45rpx"
      ></i-icon>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
// api
import { uploadFileToCloudStorage } from "../../api/common";
import { addQuestionExplanation } from "../../api/questionExplanation";
import { removeHtmlTag } from "../../util/common"
interface IPageParams {
  id: string;
  questionID: string;
  title: string;
}
export default defineComponent({
  onLoad(params: IPageParams) {
    this.questionInfo.questionID = params.questionID;
    this.questionInfo.title = params.title;
  },
  mounted() {
    // 因为uniapp的vue3bug，我不能直接通过props传递函数，因为函数在template中是undefined，等待官方解决...
    this.$refs.editor.setImageUploader(this.beforeUploadImage);
  },
  setup() {
    // 题目信息
    const questionInfo = ref<{
      id?: string;
      title: string;
      questionID: string;
    }>({
      id: "",
      title: "",
      questionID: "",
    });
    const beforeUploadImage = async (img, callback) => {
      const res = await uploadFileToCloudStorage({
        filePath: img,
        cloudPath: "img"
      });
      if(res.success){
        callback(res.data.fileID);
      }
    };
    return {
      questionInfo,
      beforeUploadImage,
    };
  },
  methods: {
    async handleSaveEditor() {
      // 获取编辑器引用
      const editor = this.$refs.editor;
      editor.editorCtx.getContents({
        success: async ({ html }: { html: string }) => {
          if (removeHtmlTag(html) === "") {
            uni.showToast({
              title: "请填写题解内容oh~",
              icon: "none",
            });
          } else {
            uni.showLoading({
              mask: true,
            });
            const addResult = await addQuestionExplanation({
              _id: this.questionInfo.questionID,
              content: html,
            });
            uni.hideLoading();
            if (addResult.success) {
              const explanationID = addResult.data._id;
              // 题解详情页面
              uni.redirectTo({
                url: `/pages/question/questionExplanationDetail?id=${explanationID}`,
              });
            }
          }
        },
      });
    },
  },
});
</script>

<style>
page {
  background-color: #f6f7f9;
}
</style>
<style lang="scss" scoped>
view {
  box-sizing: border-box;
}
.card {
  position: sticky;
  top: 0;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 680rpx;
  margin: 0 auto;
  padding: 20rpx;
  background-color: #fff;
  font-size: 30rpx;
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
  width: 690rpx;
  margin: 0 auto;
  border-radius: 8px;
  margin-top: 10rpx;
}
.submit {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100rpx;
  height: 100rpx;
  background: #0069fa;
  border-radius: 50%;
  position: fixed;
  bottom: 30rpx;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  &:active {
    opacity: 0.7;
  }
}
</style>
