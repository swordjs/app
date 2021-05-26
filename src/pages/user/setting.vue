<template>
  <view class="setting">
    <view class="item" @click="url('/pages/user/bind', true)">
      <text>绑定手机/绑定第三方账号</text>
      <i-icon style="margin-right: 15rpx" name="arrow-right-s-line"></i-icon>
    </view>
    <view class="item" @click="handleCheckVersion">
      <text>检查版本更新</text>
      <text class="value">{{ currentVersion }}</text>
    </view>
    <view class="logOut" @click="handleLogout" v-if="isLogin">
      <i-button type="primary" size="large" round>退出登录</i-button>
    </view>
  </view>
</template>

<script lang="ts">
import notLogin from "../../util/notLogin";
import { logout } from "../../api/login";
import { ref } from "vue";
export default {
  onShow() {
    this.isLogin = uni.getStorageSync("uni_id_token") !== "";
  },
  setup() {
    // 获取当前版本
    const currentVersion = uni.getAccountInfoSync().miniProgram.version;
    // 是否登录
    const isLogin = ref<boolean>(false);
    const url = (value, isLogin) => {
      isLogin
        ? notLogin(() => {
            uni.navigateTo({
              url: value,
            });
          })
        : uni.navigateTo({
            url: value,
          });
    };
    // 检查版本更新
    const handleCheckVersion = () => {
      const updateManager = uni.getUpdateManager();
      updateManager.onCheckForUpdate((res: { hasUpdate: boolean }) => {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function (res) {
            uni.showModal({
              title: "更新提示",
              content: "新版本已经准备好，是否重启应用？",
              success(res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate();
                }
              },
            });
          });
        } else {
          uni.showToast({
            title: "您已是最新版",
            icon: "none",
          });
        }
      });
      updateManager.onUpdateFailed(function (res) {
        // 新的版本下载失败
        uni.showToast({
          title: "版本下载失败，请重试",
          icon: "none",
        });
      });
    };
    // 退出登录
    const handleLogout = () => {
      uni.showModal({
        title: "提示",
        content: "您确定退出登陆吗？",
        success: async (res: { confirm: boolean }) => {
          if (res.confirm) {
            uni.showLoading({
              title: "退出中...",
              mask: true,
            });
            // 退出调用logout方法，取消token
            const logOutResult = await logout({
              token: uni.getStorageSync("uni_id_token"),
            });
            uni.hideLoading();
            if (logOutResult.success) {
              // 清除所有的缓存
              uni.clearStorageSync();
              // 退出到登录页面
              uni.redirectTo({
                url: "/pages/user/login",
              });
            }
          }
        },
      });
    };
    return {
      isLogin,
      currentVersion,
      handleLogout,
      handleCheckVersion,
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
.logOut {
  margin: 30rpx;
  margin-top: 45rpx;
}
</style>
