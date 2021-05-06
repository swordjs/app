<template>
  <view class="setting">
    <view class="item" @click="handleBindMobile">
      <text>绑定手机</text>
      <text class="value">
        {{ isBindMobile ? "绑定成功" : "去绑定" }}
      </text>
    </view>
    <!-- #ifdef MP-WEIXIN -->
    <view class="item">
      <text>绑定微信</text>
      <text class="value">
        {{ userInfo.wx_openid ? "绑定成功" : "去绑定" }}
      </text>
    </view>
    <!-- #endif -->
    <!-- #ifdef MP-QQ -->
    <view class="item">
      <text>绑定QQ</text>
      <text class="value">
        {{ userInfo.qq_openid ? "绑定成功" : "去绑定" }}
      </text>
    </view>
    <!-- #endif -->
  </view>
</template>

<script>
import { computed, ref } from "vue";
// api
import { getUserBaseContentByUserID } from "../../api/user";
export default {
  onShow() {
    this.getUserInfo();
  },
  setup() {
    const userInfo = ref({});
    // 获取用户信息
    const getUserInfo = async () => {
      uni.showLoading({
        title: "初始化中...",
        mask: true,
      });
      const userData = await getUserBaseContentByUserID({
        userID: uni.getStorageSync("uni_id"),
      });
      uni.hideLoading();
      if (userData.success) {
        userInfo.value = userData.data[0];
      }
    };
    // 是否绑定
    const isBindMobile = computed(() => {
      return userInfo.value.mobile && userInfo.value.mobile_confirmed === 1;
    });
    // 点击绑定手机
    const handleBindMobile = () => {
      if (!isBindMobile.value) {
        // 跳转登录页面绑定
        uni.navigateTo({
          url: "/pages/user/login?from=1&bind=1",
        });
      }
    };
    const url = (value) => {
      uni.navigateTo({
        url: value,
      });
    };
    return {
      userInfo,
      getUserInfo,
      isBindMobile,
      handleBindMobile,
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
