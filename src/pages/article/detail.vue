<template>
  <div class="explanationBox">
    <div class="top">
      <i-navigation-bar />
      <div class="title">{{ data?.title }}</div>
    </div>
    <div class="card">
      <!-- 用户信息 -->
      <div class="user" @click="handleUser(data?.userID[0]._id)">
        <img :src="data ? data.userID[0].avatar : ''" class="headPicture" mode />
        <div class="userContent">
          <div class="nickName">{{ data ? data.userID[0].nickname : '' }}</div>
          <div class="authentication">{{ data ? data.userID[0].sign : '' }}</div>
        </div>
      </div>
      <div class="content">
        <robin-editor :value="data ? data.content : ''" :header="false" prediv-mode></robin-editor>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import { getArticleByID, ResGetArticleByID } from '../../api/article';

type PageParams = {
  id: string;
};

const id = ref('');
const data = ref<ResGetArticleByID>();

onLoad((e: PageParams) => {
  if (e.id) {
    id.value = e.id;
    getData();
  }
});

const getData = async () => {
  uni.showLoading({
    title: '获取文章中...',
    mask: true
  });
  const result = await getArticleByID({
    id: id.value
  });
  uni.hideLoading();
  if (result.success) {
    data.value = result.data;
  }
};
const handleUser = (_id: string) => {
  uni.navigateTo({
    url: `/pages/user/index?userID=${_id}`
  });
};
</script>

<style>
page {
  background-color: #f6f7f9;
}
</style>
<style lang="scss" scoped>
@import '../../util/common.scss';

.explanationBox {
  .top {
    display: inline-block;
    width: 100%;
    height: 416rpx;
    background: url(../../static/question/explanationTop.png) no-repeat center / 100%;

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

      .userContent {
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
