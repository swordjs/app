<template>
  <view class="explanationBox">
    <view class="top">
      <i-navigation-bar />
      <view class="title">{{ data.questionID[0].title }}</view>
    </view>
    <view class="card">
      <!-- 用户信息 -->
      <view class="user" @click="handleUser(data.userID[0]._id)">
        <image :src="data.userID[0].avatar" class="headPicture" mode=""></image>
        <view class="uerContent">
          <view class="nickName">{{ data.userID[0].nickname }}</view>
          <view class="authentication">{{ data.userID[0].sign }}</view>
        </view>
      </view>
      <view class="content">
        <robin-editor
          v-model="data.content"
          :header="false"
          previewMode
        ></robin-editor>
      </view>
    </view>
    <view class="bottom" :class="{ left: !isSelf }">
      <view class="like" @click="handleLike">
        <i-icon
          :color="isAdoption && '#EA4D4D'"
          :name="isAdoption ? 'heart-2-fill' : 'heart-2-line'"
          @click="handleLike"
        ></i-icon>
        <text>{{ isAdoption ? "已采纳" : "采纳" }}</text>
      </view>
      <view class="contentRight">
        <view class="star">
          <!-- 收藏/修改回答 -->
          <template v-if="!isSelf">
            <i-icon
              @click="handleCollect"
              :color="isCollect && '#EA4D4D'"
              :name="isCollect ? 'star-smile-fill' : 'star-smile-line'"
            ></i-icon>
          </template>
          <template v-else>
            <i-icon @click="handleEdit" name="edit-box-line"></i-icon>
          </template>
        </view>
        <!-- 评论 -->
        <!-- <i-icon @click="handleComment" name="message-2-line"></i-icon> -->
      </view>
      <!-- button按钮，查看自己的题解/写题解 -->
      <view class="button" v-if="!isSelf">
        <template v-if="!explanationIDBySelf">
          <i-button
            @click="handleWrite"
            customStyle="background-color: #5671E8;border-color: #5671E8;width: 100px; line-height:37px;"
            round
            >写题解</i-button
          >
        </template>
        <!-- 查看自己的题解 -->
        <template v-else>
          <i-button
            @click="handleExplanationDetailBySelf"
            customStyle="background-color: #5671E8;border-color: #5671E8;width: 170px; line-height:37px;"
            round
            >查看自己的题解</i-button
          >
        </template>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { ref, computed } from "vue";
import {
  getExplanationsByID,
  adoptionQuestionExplanation,
  collectQuestionExplanation,
} from "../../api/questionExplanation";
import { checkExplanationByUser } from "../../api/questionExplanation";
import { checkIDInCollect } from "../../api/collect";
import notLogin from "../../util/notLogin";
type IPageParams = {
  id: string;
  questionID: string;
};
export default {
  onShow() {
    this.getUserID();
    this.getExplanationIDBySelf();
  },
  onLoad(target: IPageParams) {
    if (target.id && target.questionID) {
      this.id = target.id;
      this.questionID = target.questionID;
      this.getExplanationData();
    }
  },
  onShareAppMessage() {
    return {
      title: `${this.data.userID[0].nickname}解答了[${this.data.questionID[0].title}]，快来围观吧~`,
    };
  },
  setup() {
    const id = ref("");
    const questionID = ref("");
    const explanationIDBySelf = ref<string | boolean>("");
    const userID = ref<string>("");
    // 获取最新的userID
    const getUserID = () => {
      userID.value = uni.getStorageSync("uni_id");
    };
    // 查询自身是否解答过这道题了
    const getExplanationIDBySelf = async () => {
      // 判断是否登录
      if (userID.value === "") return false;
      const result = await checkExplanationByUser({
        _id: questionID.value,
      });
      if (result.success) {
        explanationIDBySelf.value = result.data === null ? false : result.data;
      }
    };
    const data = ref<{
      userAgreed?: string[];
      questionID?: {
        title: string;
      };
      userID?: {
        _id: string;
        collect: string[];
      }[];
      _id?: string;
    }>({
      userID: [],
      userAgreed: [],
    });
    const isSelf = computed(() => {
      return userID.value === data.value.userID[0]?._id;
    });
    // 是否已采纳
    const isAdoption = ref<boolean>(false);
    // 是否已收藏
    const isCollect = ref<boolean>(false);
    const handleBack = () => {
      uni.navigateBack({
        delta: 1,
      });
    };
    const getExplanationData = async () => {
      uni.showLoading({
        title: "获取题解中...",
        mask: true,
      });
      const result = await getExplanationsByID({
        id: id.value,
      });
      uni.hideLoading();
      if (result.success) {
        data.value = result.data[0];
        // 查询题解赞同列表中是否有自己
        isAdoption.value = data.value.userAgreed.some(
          (u) => u === uni.getStorageSync("uni_id")
        );
        // 查看自己的用户信息收藏夹中是否存在此题解
        const isCollectResult = await checkIDInCollect({
          id: data.value._id,
        });
        if (isCollectResult.success) {
          isCollect.value = isCollectResult.data;
        }
      }
    };

    // 采纳/赞同题解
    const handleLike = async () => {
      uni.showLoading({
        title: `${isAdoption.value ? "取消采纳中..." : "采纳中..."}`,
        mask: true,
      });
      const result = await adoptionQuestionExplanation({
        _id: id.value,
      });
      uni.hideLoading();
      if (result.success) {
        uni.showToast({
          title: "操作成功",
          icon: "none",
        });
        isAdoption.value = !isAdoption.value;
      }
    };

    // 收藏题解
    const handleCollect = async () => {
      uni.showLoading({
        title: `${isCollect.value ? "取消采纳中..." : "采纳中..."}`,
        mask: true,
      });
      const result = await collectQuestionExplanation({
        _id: id.value,
      });
      uni.hideLoading();
      if (result.success) {
        uni.showToast({
          title: "操作成功",
          icon: "none",
        });
        isCollect.value = !isCollect.value;
      }
    };
    // 修改回答
    const handleEdit = () => {
      uni.navigateTo({
        url: `/pages/question/writeQuestion?explanationID=${data.value._id}&title=${data.value.questionID[0].title}`,
      });
    };
    const handleUser = (_id: string) => {
      uni.navigateTo({
        url: `/pages/user/index?userID=${_id}`,
      });
    };
    // 写题解
    const handleWrite = () => {
      // 判断是否登录
      notLogin(async () => {
        uni.navigateTo({
          url: `/pages/question/writeQuestion?questionID=${questionID.value}&title=${data.value.questionID[0].title}`,
        });
      });
    };

    // 查看自己的题解
    const handleExplanationDetailBySelf = () => {
      uni.navigateTo({
        url: `/pages/question/questionExplanationDetail?id=${explanationIDBySelf.value}&questionID=${questionID.value}`,
      });
    };
    // 评论
    const handleComment = () => {
      uni.showToast({
        title: "正在开发中,尽情期待...",
        icon: "none",
      });
    };
    return {
      id,
      getUserID,
      isSelf,
      questionID,
      data,
      isAdoption,
      explanationIDBySelf,
      isCollect,
      getExplanationData,
      getExplanationIDBySelf,
      handleBack,
      handleLike,
      handleComment,
      handleCollect,
      handleWrite,
      handleUser,
      handleExplanationDetailBySelf,
      handleEdit,
    };
  },
};
</script>

<style>
page {
  background-color: #f6f7f9;
}
</style>
<style lang="scss" scoped>
@import "../../util/common.scss";

.explanationBox {
  .top {
    display: inline-block;
    width: 100%;
    height: 416rpx;
    background: url(../../static/question/explanationTop.png) no-repeat center /
      100%;

    .navigationBar {
      width: calc(100% - 80rpx);
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: calc(50rpx + 30rpx) 40rpx auto 40rpx;

      .back {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 14rpx;
        height: 26rpx;
      }
    }

    .title {
      width: 666rpx;
      min-height: 58rpx;
      margin: 0 auto;
      margin-bottom: 30rpx;
      color: #fff;
      font-size: 32rpx;
      margin-top: 50rpx;
      @include text-ellipsis(2);
    }
  }

  .card {
    width: 666rpx;
    min-height: 978rpx;
    margin: 0 auto;
    background-color: #fff;
    transform: translateY(-90rpx);
    border-radius: 8px;
    overflow: hidden;
    .user {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-left: 32rpx;
      margin-top: 30rpx;

      .headPicture {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
      }

      .uerContent {
        margin-left: 24rpx;

        .nickName {
          max-width: 400rpx;
          @include text-ellipsis;
          font-size: 28rpx;
          color: #5454a1;
        }

        .authentication {
          font-size: 20rpx;
          color: #ffac61;
        }
      }
    }
    .content {
      width: 614rpx;
      margin: 0 auto;
      margin-top: 40rpx;
    }
  }
  .bottom {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 98rpx;
    position: fixed;
    bottom: 0;
    background-color: #fff;

    .like {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 28rpx;
      margin-left: 30rpx;
      text {
        margin-left: 10rpx;
      }
    }
    .contentRight {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-right: 30rpx;
      .star {
        // margin-right: 50rpx;
      }
    }
    // 不同状态下的样式变化
    &.left {
      justify-content: flex-start;
      .contentRight {
        margin-left: 40rpx;
      }
      .button {
        position: absolute;
        right: 30rpx;
        align-self: flex-end;
      }
    }
  }
}
</style>
