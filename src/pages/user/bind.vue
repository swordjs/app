<template>
  <view class="setting">
    <view class="item" @click="handleBindMobile">
      <text>绑定手机</text>
      <text class="value">
        {{ isBindMobile ? "绑定成功" : "去绑定" }}
      </text>
    </view>
    <!-- #ifdef MP-WEIXIN -->
    <view class="item" @click="bindService('weixin')">
      <text>绑定微信</text>
      <text class="value">
        {{ userInfo.wx_openid ? "绑定成功" : "去绑定" }}
      </text>
    </view>
    <!-- #endif -->
    <!-- #ifdef MP-QQ -->
    <view class="item" @click="bindService('qq')">
      <text>绑定QQ</text>
      <text class="value">
        {{ userInfo.qq_openid ? "绑定成功" : "去绑定" }}
      </text>
    </view>
    <!-- #endif -->
  </view>
</template>

<script lang="ts">
import { computed, ref } from "vue";
// api
import { getUserBaseContentByUserID } from "../../api/user";
import { bindQQ, bindWechat } from "../../api/login";
type UserInfo = {
  mobile: string,
  mobile_confirmed: number
}
export default {
  onShow() {
    this.getUserInfo();
  },
  setup() {
    const userInfo = ref<UserInfo>({
      mobile: "",
      mobile_confirmed: 0
    });
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
    // 绑定
    const bindService = (provider: "weixin" | "qq") => {
      let bindFunc: Function;
      switch (provider) {
        case "weixin":
          bindFunc = bindWechat;
          break;
        case "qq":
          bindFunc = bindQQ;
          break;
      }
      uni.login({
        provider,
        async success(res) {
          // 传入用户信息和code
          uni.showLoading({
            title: "绑定中...",
            mask: true,
          });
          // 这里判断是登录/还是注册，如果是注册，默认调接口绑定一个角色Normal
          const bindData = await bindFunc({
            code: res.code,
          });
          uni.hideLoading();
          // 存储返回的token以及用户信息，id等
          if (bindData.success) {
            getUserInfo();
          }
        },
        fail() {
          uni.showToast({
            title: "微信登录失败",
            icon: "none",
          });
        },
      });
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
      bindService,
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
