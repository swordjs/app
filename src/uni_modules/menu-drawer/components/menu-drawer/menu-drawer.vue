<template>
  <view class="drawerBox">
    <!-- 主要内容 -->
    <view
      :class="[
        'main',
        {
          hide: !show,
        },
      ]"
    >
      <!-- 模糊窗口承载的内容 -->
      <view class="mainBox">
        <!-- 个人信息 -->
        <view class="userInfo" @click="handleLogin">
          <!-- 头像 -->
          <view class="avatar">
            <image
              :src="!isLogin ? '../../../../static/index/user.png' : user.avatarUrl"
            />
          </view>
          <!-- 昵称 -->
          <view class="info">
            <view class="nickname">{{ !isLogin ? '未登录' : user.nickName }}</view>
          </view>
        </view>
        <!-- 菜单 -->
        <view v-if="isLogin" class="menu border">
          <view class="menuItem" @click="handleClickItem('/pages/user/index')">
            <i-icon name="file-text-fill" color="#FFCC5C"></i-icon>
            <text>我的资料</text>
          </view>
          <view class="menuItem" @click="handleClickItem('/pages/user/applicationQuestionRole')">
            <i-icon name="vip-crown-fill" color="#FFCC5C"></i-icon>
            <text>申请认证出题人</text>
          </view>
        </view>
        <view class="menu" @click="handleClickItem('/pages/user/setting')">
          <view class="menuItem">
            <i-icon name="settings-2-fill" color="#FFCC5C"></i-icon>
            <text>设置</text>
          </view>
          <view class="menuItem" @click="handleClickItem('/pages/common/webview?url=https://www.yinzhuoei.com/index.php/archives/515/')">
            <i-icon name="shield-star-fill" color="#FFCC5C"></i-icon>
            <text>关于剑指题解</text>
          </view>
        </view>
      </view>
      <!-- 伸缩按钮 -->
      <view class="rowToggle" @click.stop="handleToggle">
        <i-icon
          @click="handleToggle"
          :class="{
            hide: !show,
          }"
          :name="`arrow-${show ? 'left' : 'right'}-s-line`"
          color="#FFCC5C"
        ></i-icon>
      </view>
    </view>
    <!-- 蒙层 -->
    <view class="mask" @click="handleToggle" v-if="show"> </view>
  </view>
</template>
<script lang='ts'>
import { defineComponent, ref, watch } from "vue";
export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Object,
      default: {
        nickName: "",
        avatarUrl: "",
      },
    },
    isLogin: {
      type: Boolean
    }
  },
  setup(props, { emit }) {
    console.log(props.user);
    const handleToggle = () => {
      emit("change");
    };
    // 跳转URL
    const handleClickItem = (url: string) => {
      uni.navigateTo({
        url
      })
    }
    const handleLogin = () => {
      // 如果未登录
      if(!props.isLogin){
        uni.navigateTo({
          url: "/pages/user/login",
        });
      }
    }
    return {
      handleToggle,
      handleClickItem,
      handleLogin
    };
  },
});
</script>
<style lang="scss" scoped>
@import "../../../../util/common.scss";

.drawerBox {
  .main {
    z-index: 999;
    position: absolute;
    left: 0;
    top: 0;
    transition: left 0.3s;
    &.hide {
      left: -552rpx;
    }
    .rowToggle {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      position: absolute;
      top: 108rpx;
      right: -30rpx;
      background: rgba(74, 95, 255, 0.82);
      .hide {
        margin-left: 40rpx;
        transform: translateY(-3rpx);
      }
    }
    .mainBox {
      width: 552rpx;
      height: 100vh;
      background: rgba(74, 95, 255, 0.82);
      backdrop-filter: blur(5px);
      overflow: hidden;
      .userInfo {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin: 100rpx 50rpx 0 50rpx;
        padding-bottom: 40rpx;
        border-bottom: 2rpx solid #5e6dff;
        .avatar {
          width: 112rpx;
          height: 112rpx;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #d9dcff;
          image {
            width: 100%;
            height: 100%;
          }
        }
        .info {
          margin-left: 32rpx;
          .nickname {
            width: 238rpx;
            font-size: 34rpx;
            color: #fff;
            @include text-ellipsis;
          }
        }
      }
      .menu {
        margin-left: 50rpx;
        margin-right: 50rpx;
        .menuItem {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-top: 60rpx;
          margin-left: 20rpx;
          text {
            color: #fff;
            margin-left: 30rpx;
            font-size: 28rpx;
          }
        }
        &.border {
          padding-bottom: 60rpx;
          border-bottom: 2rpx solid #5e6dff;
        }
      }
    }
  }
  .mask {
    z-index: 998;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
  }
}
</style>