<template>
  <view class="setting">
    <view class="item" @click="url('/pages/user/editProfile')">
      <text>绑定手机/绑定第三方账号</text>
      <i-icon style="margin-right: 15rpx;" name="arrow-right-s-line"></i-icon>
    </view>
    <view class="item">
      <text>当前版本</text>
      <text class="value">{{ currentVersion }}</text>
    </view>
  </view>
</template>

<script>
export default {
  setup() {
    // 获取当前版本
    const currentVersion = uni.getAccountInfoSync().miniProgram.version;
    const url = (value) => {
      uni.navigateTo({
        url: value,
      });
    };
    return {
      currentVersion,
      url,
    };
  },
};
</script>

<style>
page {
  background-color: #f7f7f7;
}
</style>
<style lang="scss">
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 690rpx;
  height: 100rpx;
  background-color: #fff;
  box-shadow: 0px 4px 12px 0px rgba(39, 66, 102, 0.09);
  border-radius: 8px;
  margin: 20rpx auto;

  text {
    font-size: 28rpx;
    margin-left: 30rpx;
  }

  .value {
    font-size: 28rpx;
    color: #bcbdc3;
    margin-right: 30rpx;
  }
}
</style>
