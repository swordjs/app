<template>
  <view class="explanationBox">
    <view class="top">
      <i-navigation-bar />
      <view class="title">{{ data.questionID[0].title }}</view>
    </view>
    <view class="card">
      <!-- 用户信息 -->
      <view class="user">
        <image :src="data.userID[0].avatar" class="headPicture" mode=""></image>
        <view class="uerContent">
          <view class="nickName">{{ data.userID[0].nickname }}</view>
          <view class="authentication">Dcloud2021插件大赛，冲鸭！</view>
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
    <view class="bottom">
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
          <!-- 收藏 -->
          <i-icon
            @click="handleCollect"
            :color="isCollect && '#EA4D4D'"
            :name="isCollect ? 'star-smile-fill' : 'star-smile-line'"
          ></i-icon>
        </view>
        <!-- 评论 -->
        <i-icon @click="handleComment" name="message-2-line"></i-icon>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { ref } from "vue";
import {
  getExplanationsByID,
  adoptionQuestionExplanation,
  collectQuestionExplanation,
} from "../../api/questionExplanation";
import { checkIDInCollect } from "../../api/collect";
type IPageParams = {
  id: string;
};
export default {
  onLoad(target: IPageParams) {
    if (target.id) {
      this.id = target.id;
      this.getExplanationData();
    }
  },
  onShareAppMessage(){
    return {
      title: `${this.data.userID[0].nickname}解答了[${this.data.questionID[0].title}]，快来围观吧~`
    }
  },
  setup() {
    const id = ref("");
    const data = ref<{
      userAgreed?: string[];
      userID?: {
        collect: string[];
      }[];
      _id?: string;
    }>({
      userAgreed: [],
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
        console.log(data.value);
        // 查看自己的用户信息收藏夹中是否存在此题解
        const isCollectResult = await checkIDInCollect({
          id: data.value._id
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

    // 评论
    const handleComment = () => {
      uni.showToast({
        title: "正在开发中,尽情期待...",
        icon: "none",
      });
    };
    return {
      id,
      data,
      isAdoption,
      isCollect,
      getExplanationData,
      handleBack,
      handleLike,
      handleComment,
      handleCollect,
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
      height: 88rpx;
      margin: 0 auto;
      color: #fff;
      font-size: 32rpx;
      margin-top: 50rpx;
      @include text-ellipsis(2);
    }
  }

  .card {
    position: relative;
    top: -120rpx;
    width: 666rpx;
    height: 978rpx;
    margin: 0 auto;
    background-color: #fff;
    // transform: translateY(-180rpx);
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
      justify-content: space-between;
      align-items: center;
      margin-right: 30rpx;
      .star {
        margin-right: 50rpx;
      }
    }
  }
}
</style>
