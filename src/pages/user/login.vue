<template>
  <view class="loginBox">
    <!-- 顶部的背景 -->
    <view class="topBox">
      <!-- hello world -->
      <view class="title"></view>
      <view class="titleMask"></view>
    </view>
    <!-- Form -->
    <view class="formBox">
      <!-- 用户名 -->
      <view
        :class="[
          'formItem',
          {
            focus: !checkPhoneError && formFocusIndex === 0,
            error: checkPhoneError,
          },
        ]"
      >
        <view class="formLabel">手机号</view>
        <input
          @input="handlePhoneChange"
          @blur="handleCheckPhone"
          @focus="formFocusIndex = 0"
          placeholder="请输入手机号"
          placeholder-style="color: #BEC4D2;"
          maxlength="11"
          v-model="loginData.phone"
          type="number"
        />
        <!-- finish图标在输入手机号完成之后就会显示 -->
        <i-icon
          v-if="/^1[3456789]\d{9}$/.test(loginData.phone.trim())"
          name="check-line"
          color="#0067F5"
          class="label"
        ></i-icon>
      </view>
      <view
        :class="[
          'formItem',
          {
            focus: formFocusIndex === 1,
          },
        ]"
      >
        <view class="formLabel">验证码</view>
        <view class="codeContent">
          <!-- 获取验证码 -->
          <input
            type="number"
            maxlength="6"
            @focus="formFocusIndex = 1"
            placeholder="请输入验证码"
            v-model="loginData.code"
            placeholder-style="color: #BEC4D2;"
          />
          <view
            :class="[
              'getCode',
              {
                disabled: codeInfo.count,
              },
            ]"
            @click="handleCode"
            >{{ codeInfo.count ? `${codeInfo.count}s后` : "获取验证码" }}</view
          >
        </view>
      </view>
    </view>

    <!-- submit -->
    <view class="submitBox">
      <i-button
        size="large"
        round
        customStyle="border:none;background:#5671E8;box-shadow: 0px 4px 8px 0px rgba(36,63,101,0.2);border-radius: 24px;"
        @click="handleLogin"
      >
        {{ !isBind ? "登录/注册" : "立即绑定" }}
      </i-button>
    </view>
    <!-- 其他登录方式 -->
    <view class="other" v-if="!isBind">
      <view class="desc">其他登录方式</view>
      <view class="itemList">
        <!-- #ifdef MP-WEIXIN -->
        <view class="item" @click="handleWechat">
          <image src="../../static/user/wechat.png"></image>
        </view>
        <!-- #endif -->
        <!-- #ifdef MP-QQ -->
        <button open-type="getUserInfo" @getuserinfo="handleQQ">
          <view class="item">
            <image src="../../static/user/qq.png"></image>
          </view>
        </button>
        <!-- #endif -->
      </view>
    </view>
  </view>
</template>
<script lang="ts">
type LoginData = {
  phone: string;
  code: string;
};
import { defineComponent, reactive, ref, computed, watchEffect } from "vue";
// api
import {
  sendSms,
  loginBySms,
  loginByWechat,
  loginByQQ,
  bindMobile,
} from "../../api/login";
export default defineComponent({
  onLoad(e: { from: string; bind: string }) {
    if (e?.from === "1") {
      this.isFrom = true;
    }
    if (e?.bind === "1") {
      this.isBind = true;
    }
  },
  setup() {
    const toast = (title) => {
      uni.showToast({
        title,
        icon: "none",
        position: "bottom",
      });
    };
    // 判断登录是否是需要是绑定功能，如果是，就展示绑定的逻辑
    const isBind = ref<boolean>(false);
    // 判断登录页面是否是从其他页面进入的，如果是，则登录成功后不会进入首页，而会后退
    const isFrom = ref<boolean>(false);
    // 获取验证码
    const codeInfo = reactive({
      timer: null,
      count: 0,
    });
    // 表单第几项被聚焦
    const formFocusIndex = ref(null);
    // 登录的Form表单
    const loginData = reactive<LoginData>({
      phone: "",
      code: "",
    });
    // 手机号验证是否出错
    const checkPhoneError = ref(false);
    // 是否可以触发登录
    const loginButtonControl = computed(() => {
      if (!/^1[3456789]\d{9}$/.test(loginData.phone.trim())) {
        return false;
      } else {
        return loginData.code.length === 6;
      }
    });
    // blur之后检测手机号输入
    const handleCheckPhone = () => {
      if (loginData.phone.trim() !== "") {
        return (checkPhoneError.value = !/^1[3456789]\d{9}$/.test(
          loginData.phone
        ));
      }
    };
    // 手机号输入框变化
    const handlePhoneChange = () => {
      if (checkPhoneError.value) {
        if (loginData.phone.trim() === "") {
          checkPhoneError.value = false;
        } else {
          handleCheckPhone();
        }
      }
    };
    const handleCode = async () => {
      // 是否为空和判断手机号是否合法
      if (loginData.phone.trim() === "") {
        toast("手机号为空");
      } else if (!/^1[3456789]\d{9}$/.test(loginData.phone.trim())) {
        toast("手机号不合法");
      } else if (!codeInfo.count) {
        uni.showLoading({
          title: "获取中...",
        });
        const result = await sendSms({
          phone: loginData.phone.trim(),
          type: isBind.value ? "bind" : "login",
        });
        uni.hideLoading();
        if (result.success) {
          codeInfo.count = 59;
        }
      }
    };
    const setInfo = async (loginData, userInfo) => {
      uni.setStorageSync("uni_id_token", loginData.data.token);
      uni.setStorageSync("uni_id", loginData.data.uid);
      uni.setStorageSync("userInfo", userInfo);
      if (isFrom.value) {
        // 回退
        uni.navigateBack({
          delta: 1,
        });
      } else {
        // 跳转到首页
        uni.redirectTo({
          url: "/pages/index/index",
        });
      }
    };
    const handleLogin = async () => {
      if (loginButtonControl.value) {
        // 登录
        if (!isBind.value) {
          let surroundings = "";
          // #ifdef MP-WEIXIN
          surroundings = "微信";
          // #endif
          // #ifdef MP-QQ
          surroundings = "QQ";
          // #endif
          // 需要提示一个弹窗，如果用户之前只用了微信/QQ登录使用，那么用手机号直接登录会新建一个账号，指引用户仍使用QQ/微信登录然后去设置页面绑定手机号
          uni.showModal({
            title: "贴心提示",
            content: `如果您之前只用了${surroundings}登录且未绑定手机号，那么您直接使用手机号登录会自动注册一个新号。所以为了保证您的数据互通，请使用您之前${surroundings}登录方式登录成功之后在【设置】中绑定手机后，才可以直接使用手机号登录享受数据互通。`,
            cancelText: "取消",
            confirmColor: "登录/注册",
            success: async (res) => {
              if (res.confirm) {
                uni.showLoading({
                  title: "登录中...",
                  mask: true,
                });
                const loginResult = await loginBySms({
                  phone: loginData.phone.trim(),
                  code: loginData.code,
                });

                uni.hideLoading();
                if (loginResult.success) {
                  // 存储token以及个人信息等
                  setInfo(loginResult, {
                    nickName: loginResult.data.userInfo.nickname,
                    avatarUrl: loginResult.data.userInfo.avatar,
                  });
                } else {
                  toast("登录失败，请稍后再试");
                }
              }
            },
          });
        } else {
          // 绑定
          uni.showLoading({
            title: "绑定中",
            mask: true,
          });
          const bindResult = await bindMobile({
            uid: uni.getStorageSync("uni_id"),
            mobile: loginData.phone.trim(),
            code: loginData.code,
          });
          uni.hideLoading();
          if (bindResult.success) {
            uni.showModal({
              title: "提示",
              showCancel: false,
              content: "绑定手机号成功，您可以使用手机号登录啦！",
              success: (res: { confirm: boolean }) => {
                if (res.confirm) {
                  uni.navigateBack({
                    delta: 1,
                  });
                }
              },
            });
          }
        }
      } else {
        toast("请确认手机号和验证码是否合法");
      }
    };
    // 微信登录
    const handleWechat = () => {
      wx.getUserProfile({
        desc: "用于完善用户资料",
        success: ({ userInfo }) => {
          uni.login({
            provider: "weixin",
            async success(res) {
              // 传入用户信息和code
              uni.showLoading({
                title: "微信登录中...",
                mask: true,
              });
              // 这里判断是登录/还是注册，如果是注册，默认调接口绑定一个角色Normal
              const loginData = await loginByWechat(userInfo, res);
              uni.hideLoading();
              // 存储返回的token以及用户信息，id等
              if (loginData.success && loginData.data.code === 0) {
                setInfo(loginData, userInfo);
              }
            },
            fail() {
              uni.showToast({
                title: "微信登录失败",
                icon: "none",
              });
            },
          });
        },
      });
    };
    // QQ登录
    const handleQQ = ({ detail }) => {
      const info = detail.userInfo;
      if (info) {
        uni.login({
          async success(res) {
            if (res.code) {
              console.log(res.code);
              uni.showLoading({
                title: "QQ登录中",
                mask: true,
              });
              console.log(res);
              // 调用QQ登录接口
              const loginData = await loginByQQ(info, res);
              uni.hideLoading();
              if (loginData.success) {
                setInfo(loginData, info);
              }
            }
          },
          fail() {
            uni.showToast({
              title: "QQ登录失败",
              icon: "none",
            });
          },
        });
      }
    };
    watchEffect(() => {
      if (codeInfo.count === 59) {
        codeInfo.timer = setInterval(() => {
          codeInfo.count--;
        }, 1000);
      } else if (codeInfo.count === 0) {
        clearInterval(codeInfo.timer);
      }
    });
    return {
      isBind,
      isFrom,
      loginData,
      codeInfo,
      checkPhoneError,
      loginButtonControl,
      formFocusIndex,
      handlePhoneChange,
      handleCode,
      handleCheckPhone,
      handleLogin,
      handleWechat,
      handleQQ,
    };
  },
});
</script>
<style lang="scss" scoped>
@keyframes helloWorld {
  0% {
    transform: translateX(38rpx);
  }
  10% {
    transform: translateX(calc(38rpx * 2));
  }
  20% {
    transform: translateX(calc(38rpx * 3));
  }
  30% {
    transform: translateX(calc(38rpx * 4));
  }
  40% {
    transform: translateX(calc(38rpx * 5));
  }
  50% {
    transform: translateX(calc(38rpx * 6));
  }
  60% {
    transform: translateX(calc(38rpx * 7));
  }
  70% {
    transform: translateX(calc(38rpx * 8));
  }
  80% {
    transform: translateX(calc(38rpx * 9));
  }
  90% {
    transform: translateX(calc(38rpx * 10));
  }
}
.topBox {
  width: 100%;
  height: 346rpx;
  background: url("../../static/user/topBackground.png") no-repeat 158rpx 0 /
    560rpx 346rpx;
  margin-top: calc(var(--status-bar-height) + 64rpx);
  overflow: hidden;

  .title {
    position: relative;
    width: 420rpx;
    height: 64rpx;
    background: url(../../static/user/helloworld.png) no-repeat center / 420rpx
      64rpx;
    margin-top: 176rpx;
    margin-left: 68rpx;

    &::after {
      content: "";
      position: absolute;
      bottom: -22rpx;
      width: 58rpx;
      height: 12rpx;
      background: #4f6be6;
    }

    &::before {
      content: "";
      position: absolute;
      bottom: -22rpx;
      left: 60rpx;
      width: 12rpx;
      height: 12rpx;
      background: #a6b6f3;
    }
  }
  .titleMask {
    transform: translateX(420rpx);
    position: absolute;
    width: 420rpx;
    height: 64rpx;
    top: 285rpx;
    left: 68rpx;
    background: #fff;
    animation: helloWorld 11s;
  }
}

.formBox {
  width: 630rpx;
  margin: 30rpx auto;

  .formItem {
    position: relative;
    width: 100%;
    padding-bottom: 20rpx;
    margin-top: 44rpx;
    border-bottom: 1px solid #e8edf6;
    transition: border-bottom-color 0.5s;

    .formLabel {
      font-size: 28rpx;
      color: #999999;
      margin-bottom: 20rpx;
    }

    input {
      width: 450rpx;
      font-size: 28rpx;
    }

    .label {
      position: absolute;
      right: 0;
      bottom: 20rpx;
      top: 50%;
    }

    .codeContent {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: calc(100% - 36rpx);

      input {
        width: 370rpx;
        margin: 0;
        border-right: 1px solid #f2f2f2;
      }

      .getCode {
        font-size: 30rpx;
        color: #3f8cff;

        &.disabled {
          color: #999999;
        }
      }
    }

    &.focus {
      border-bottom: 1px solid #0067f5;
    }

    &.error {
      color: #ff5c5c;
      border-bottom: 1px solid #ff5c5c;
    }
  }
}

.submitBox {
  width: 630rpx;
  margin: 0 auto;
  margin-top: 224rpx;
}

.other {
  position: relative;
  text-align: center;
  margin-top: 30rpx;

  .desc {
    font-size: 24rpx;
    color: #999999;

    &::before {
      content: "";
      position: absolute;
      top: 10%;
      left: 20%;
      width: 120rpx;
      height: 2rpx;
      background: #d8d8d8;
    }

    &::after {
      content: "";
      position: absolute;
      top: 10%;
      right: 20%;
      width: 120rpx;
      height: 2rpx;
      background: #d8d8d8;
    }
  }

  .itemList {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 24rpx;

    .item {
      width: 92rpx;
      height: 92rpx;

      image {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
