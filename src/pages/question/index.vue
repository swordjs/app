<template>
  <view class="questionBox">
    <view class="item" v-for="item in areaList" :key="item._id">
      <image :src="item.iconPath" mode="aspectFit"></image>
      <view class="name">{{ item.name }}</view>
    </view>
  </view>
</template>

<script>
// api
import { getQuestionAreaList } from "../../api/question";
import { reactive, ref } from "vue";
export default {
  setup() {
    // 分类列表
    const areaList = ref([]);
    // 获取题目专区
    const getListData = async () => {
      uni.showLoading({
        title: "加载中",
        icon: "none",
      });
      const result = await getQuestionAreaList();
      uni.hideLoading();
      if (result.success) {
        areaList.value = result.data;
      }
    };
    getListData();
    return {
      areaList,
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
.questionBox {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  width: 690rpx;
  margin: 0 auto;
  margin-top: 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
  padding-bottom: 50rpx;
  .item {
    width: 33.33%;
    text-align: center;
    margin-top: 50rpx;
    image {
      width: 88rpx;
      height: 88rpx;
    }
    .name {
      font-size: 24rpx;
      color: #666666;
    }
  }
}
</style>
