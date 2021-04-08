<template>
  <view class="writeBox">
    <view class="card">
      <view class="vertical"></view>
      <view class="content">
        {{ questionInfo.title }}
      </view>
    </view>
    <view class="editor" v-show="writeType === 'RichText'">
      <!-- 撰写答案 -->
      <robin-editor
        ref="editor"
        class="editor"
        width="690"
        :muiltImage="true"
        :header="false"
      ></robin-editor>
    </view>
    <!-- MarkDown编辑 -->
    <view class="markDownEditor" v-show="writeType === 'MarkDown'">
      <robin-editor
        :header="false"
        ref="markDownEditor"
        class="editor"
        width="690"
        :autoHideToolbar="true"
      >
      </robin-editor>
    </view>
    <view class="controlMenu">
      <!-- 切换撰写状态 -->
      <view class="changeWriteType" @click="changeWriteType">
        <i-icon
          @click="changeWriteType"
          name="arrow-left-right-line"
          color="#0069fa"
          size="38rpx"
        ></i-icon>
      </view>
      <view class="submit" @click="handleSaveEditor">
        <i-icon
          @click="handleSaveEditor"
          name="check-line"
          color="#fff"
          size="50rpx"
        ></i-icon>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
// api
import { uploadFileToCloudStorage } from "../../api/common";
import { addQuestionExplanation } from "../../api/questionExplanation";
import { removeHtmlTag } from "../../util/common";
import * as marked from "marked";
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
    // 撰写答案的类型，富文本/MarkDown
    const writeType = ref<"RichText" | "MarkDown">("RichText");
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
    // 切换撰写答案类型
    const changeWriteType = () => {
      writeType.value =
        writeType.value === "RichText" ? "MarkDown" : "RichText";
      if (writeType.value === "RichText") {
        uni.showToast({
          title: "您已切换为富文本",
          icon: "none",
        });
      } else {
        uni.showToast({
          title: "您已切换为MarkDown",
          icon: "none",
        });
      }
    };
    const beforeUploadImage = async (img, callback) => {
      const res = await uploadFileToCloudStorage({
        filePath: img,
        cloudPath: "img",
      });
      if (res.success) {
        callback(res.data.fileID);
      }
    };
    return {
      changeWriteType,
      writeType,
      questionInfo,
      beforeUploadImage,
    };
  },
  methods: {
    async handleSaveEditor() {
      let content = "";
      switch (this.writeType) {
        case "RichText":
          break;
        case "MarkDown":
          break;
      }
      // 获取编辑器引用
      const editor = this.$refs.editor;
      editor.editorCtx.getContents({
        success: async ({ html }: { html: string }) => {
          return;
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
.markDownEditor {
  width: 690rpx;
  margin: 0 auto;
  border-radius: 8px;
  margin-top: 10rpx;
  background: #fff;
  editor {
    padding: 20rpx;
  }
}
.controlMenu {
  width: 690rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 30rpx;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  .changeWriteType {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 96rpx;
    height: 96rpx;
    border: 2rpx solid #0069fa;
    border-radius: 50%;
    box-shadow: 0px 4px 11px 0px rgba(38, 46, 99, 0.15);
    &:active {
      opacity: 0.7;
    }
  }
  .submit {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100rpx;
    height: 100rpx;
    background: #0069fa;
    border-radius: 50%;
    margin-left: 20rpx;
    box-shadow: 0px 4px 11px 0px rgba(38, 46, 99, 0.15);
    &:active {
      opacity: 0.7;
    }
  }
}
</style>
