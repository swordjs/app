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
        ref="RichText"
        class="editor"
        :value="questionInfo.content"
        width="690"
        :muiltImage="true"
        :header="false"
      ></robin-editor>
    </view>
    <!-- MarkDown编辑 -->
    <view class="markDownEditor" v-show="writeType === 'MarkDown'">
      <robin-editor
        :header="false"
        ref="MarkDown"
        :value="questionInfo.content"
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
import {
  getExplanationsByID,
  addQuestionExplanation,
  updateQuestionExplanation,
} from "../../api/questionExplanation";
import { removeHtmlTag } from "../../util/common";
import { checkContentSecurity } from "../../api/common";
import * as marked from "marked";
interface IPageParams {
  id: string;
  questionID: string;
  title: string;
  explanationID?: string;
}
export default defineComponent({
  onLoad(params: IPageParams) {
    if (params.questionID) this.questionInfo.questionID = params.questionID;
    if (params.title) this.questionInfo.title = params.title;
    // 如果是修改题解会传入一个题解的ID
    if (params.explanationID) {
      this.questionInfo.explanationID = params.explanationID;
      // 设置标题
      uni.setNavigationBarTitle({
        title: "修改题解",
      });
      // 根据题解ID获取题解内容
      this.getExplanationData();
    }
  },
  mounted() {
    // 因为uniapp的vue3bug，我不能直接通过props传递函数，因为函数在template中是undefined，等待官方解决...
    this.$refs.RichText.setImageUploader(this.beforeUploadImage);
  },
  setup() {
    // 撰写答案的类型，富文本/MarkDown
    const writeType = ref<"RichText" | "MarkDown">("RichText");
    // 题目信息
    const questionInfo = ref<{
      id?: string;
      title: string;
      questionID: string;
      explanationID?: string;
      content: string;
    }>({
      id: "",
      title: "",
      questionID: "",
      explanationID: null,
      content: "",
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
    const getExplanationData = async () => {
      uni.showLoading({
        title: "获取题解中...",
        mask: true,
      });
      const result = await getExplanationsByID({
        id: questionInfo.value.explanationID,
      });
      uni.hideLoading();
      if (result.success) {
        questionInfo.value.content = result.data[0].content;
      }
    };
    return {
      changeWriteType,
      writeType,
      questionInfo,
      beforeUploadImage,
      getExplanationData,
    };
  },
  methods: {
    async handleSaveEditor() {
      switch (this.writeType) {
        case "RichText":
          break;
        case "MarkDown":
          break;
      }
      // 获取编辑器引用
      const editor = this.$refs[this.writeType];
      editor.editorCtx.getContents({
        success: async ({ html }: { html: string }) => {
          if (removeHtmlTag(html) === "") {
            uni.showToast({
              title: "请填写题解内容oh~",
              icon: "none",
            });
          } else {
            // 如果是MarkDown需要转换
            if (this.writeType === "MarkDown") {
              html = marked(html);
            }
            // 是否是 【修改问题】
            const isEdit: boolean = this.questionInfo.explanationID !== null;
            uni.showLoading({
              mask: true,
            });
            let func = null;
            switch (isEdit) {
              case true:
                func = updateQuestionExplanation;
                break;
              default:
                func = addQuestionExplanation;
                break;
            }
            // 检查内容是否安全（仅文字）
            const checkResult = await checkContentSecurity({
              content: html
            })
            if(checkResult.success && !checkResult.data){
              // 如果校验失败，则提示
              uni.hideLoading();
              uni.showToast({
                title: "您提交的内容中有敏感字符",
                icon: "none"
              });
              return;
            }
            // 提交内容
            const result = await func({
              _id: isEdit
                ? this.questionInfo.explanationID
                : this.questionInfo.questionID,
              content: html,
            });
            uni.hideLoading();
            if (result.success) {
              const explanationID = isEdit
                ? this.questionInfo.explanationID
                : result.data._id;
              // 题解详情页面
              uni.redirectTo({
                url: `/pages/question/questionExplanationDetail?id=${explanationID}&questionID=${this.questionInfo.questionID}`,
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
  .changeWriteType {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 96rpx;
    height: 96rpx;
    border: 2rpx solid #0069fa;
    border-radius: 50%;
    background: #fff;
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
