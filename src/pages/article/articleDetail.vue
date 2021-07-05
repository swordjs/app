<template>
  <view class="explanationBox">
    <view class="top">
      <i-navigation-bar />
      <view class="title">{{ data.title }}</view>
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
  </view>
</template>

<script lang="ts">
import { ref } from "vue";
import { getArticleByID } from "../../api/article";

type IPageParams = {
  id: string;
};
export default {
  onLoad(target: IPageParams) {
    if (target.id) {
      this.id = target.id;
      this.getData();
    }
  },
  onShareAppMessage() {
    return {
      title: ``,
    };
  },
  setup() {
    const id = ref("");
    const data = ref<{}>({});
    const getData = async () => {
      uni.showLoading({
        title: "获取文章中...",
        mask: true,
      });
      const result = await getArticleByID({
        id: id.value,
      });
      uni.hideLoading();
      if (result.success) {
        data.value = result.data[0];
      }
    };

    const handleUser = (_id: string) => {
      uni.navigateTo({
        url: `/pages/user/index?userID=${_id}`,
      });
    };

    return {
      id,
      data,
      getData,
      handleUser,
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
    padding-bottom: 30rpx;
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
}
</style>
