<template>
  <view class="explanationBox">
    <view class="top">
      <view class="navigationBar">
        <image
          class="back"
          @click="handleBack"
          src="../../static/common/back.png"
        />
      </view>
      <view class="title"
        >用递归算法实现，数组长度为5且元素的随机数在2-32间不重复的值间不重复的值</view
      >
    </view>
    <view class="card"> </view>
    <view class="bottom"> </view>
  </view>
</template>

<script lang="ts">
import { ref } from "vue";
import { getExplanationsByID } from "../../api/question";
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
  setup() {
    const id = ref("");
    const data = ref({});
    const handleBack = () => {
      uni.navigateBack({
        delta: 1,
      });
    };
    const getExplanationData = async () => {
      uni.showLoading({
        title: "获取中...",
        mask: true
      });
      const result = await getExplanationsByID({
        id: id.value,
      });
      uni.hideLoading();
      if (result.success) {
        data.value = result.data;
      }
    };
    return {
      id,
      data,
      getExplanationData,
      handleBack,
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
      margin: 0 auto;
      color: #fff;
      font-size: 32rpx;
      margin-top: 60rpx;
    }
  }

  .card {
    width: 666rpx;
    height: 978rpx;
    margin: 0 auto;
    background-color: #fff;
    transform: translateY(-150rpx);
    border-radius: 8px;
  }
  .bottom {
    width: 100%;
    height: 98rpx;
    position: fixed;
    bottom: 0;
    background-color: #fff;
  }
}
</style>
