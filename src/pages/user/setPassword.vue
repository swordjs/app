<template>
  <view class="setPassword">
    <view class="form">
      <i-form>
        <i-field required label="请输入密码">
          <i-input
            type="password"
            placeholder="请至少输入6位的登陆密码"
            v-model="password"
          ></i-input>
        </i-field>
      </i-form>
      <view class="submit" @click="handleSubmit">
        <i-button size="large" round>确定重置</i-button>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { ref } from "@vue/reactivity";
// api
import { resetPassword } from "../../api/user";
export default {
  setup() {
    const password = ref<string>("");
    // 提交密码
    const handleSubmit = async () => {
      // 校验密码合法性
      if (password.value.length >= 6) {
        uni.showLoading({
          title: "设置中...",
          mask: true
        })
        const resetResult = await resetPassword({
          password: password.value,
        });
        uni.hideLoading();
        if (resetResult.success) {
          // 清空全部缓存
          uni.clearStorageSync();
          uni.showModal({
            title: "提示",
            content: "密码已重置成功，您需要重新登陆",
            showCancel: false,
            success: ({ confirm }) => {
              if (confirm) {
                uni.reLaunch({
                  url: "/pages/index/index",
                });
              }
            },
          });
        }
      } else {
        uni.showToast({
          title: "密码不合法",
          icon: "none",
        });
      }
    };

    return {
      password,
      handleSubmit,
    };
  },
};
</script>

<style>
page {
  background: #f6f7f9;
}
</style>
<style lang="scss">
.form {
  margin-top: 20rpx;
}
.submit {
  width: 690rpx;
  margin: 60rpx auto;
}
</style>
