<template>
  <view
    class="indexBox"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <!-- 顶部背景 -->
    <view class="topBox">
      <!-- 头像 -->
      <image
        @click="handleClickUser"
        v-if="isLogin"
        class="headPicture"
        :src="user.avatarUrl"
        mode="scaleToFill"
      ></image>
      <image
        @click="handleClickUser"
        v-else
        class="headPicture"
        src="../../static/index/user.png"
      ></image>
      <!-- 欢迎语和昵称 -->
      <view
        class="hello"
        :style="{
          opacity: isLogin ? 1 : 0,
        }"
        >Hello,</view
      >
      <!-- 如果未登录显示未登录 -->
      <button
        hover-class="none"
        v-if="!isLogin"
        class="getUserButton"
        @click="handleClickUser"
      >
        <view class="nickname">未登录</view>
      </button>
      <view v-else class="nickname">{{ user.nickName }}!</view>
      <!-- 搜索框 -->
      <view class="search">
        <input
          maxlength="15"
          placeholder="搜索功能暂未开放，团队加急赶制中..."
          placeholder-style="color: #C3C5D4;"
          type="text"
        />
        <image class="icon" src="../../static/index/search.png"></image>
      </view>
    </view>
    <!-- banner -->
    <view class="banner">
      <image
        src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c7e81452-9d28-4486-bedc-5dbf7c8386a5/d9120b07-0203-4b86-93ba-72fdcd2df843.png"
      />
    </view>
    <!-- 专区和动态 -->
    <view class="menu">
      <!-- 专区 -->
      <view
        class="menumain question"
        @click="handleUrl('/pages/question/index')"
      >
        <view class="title">题库专区</view>
        <view class="content"> 最近的[前端练习题]有更新 </view>
      </view>
      <!-- 动态 -->
      <view
        class="menumain dynamic"
        @click="handleUrl('/pages/common/noRelease')"
      >
        <view class="title">动态</view>
        <view class="content"> 您的等级暂未解锁此功能 </view>
        <!-- 头像组 -->
        <view class="headPictureList">
          <image
            :style="{ zIndex: index, left: index * 15 + 'px' }"
            :key="index"
            v-for="(i, index) in 3"
            class="headPicture"
            src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1441836571,2166773131&fm=26&gp=0.jpg"
            mode="scaleToFill"
          ></image>
        </view>
      </view>
    </view>
    <!-- 社区 -->
    <view class="community" @click="handleUrl('/pages/common/noRelease')">
      <view class="title">社区</view>
      <view class="content">您的等级暂未解锁此功能</view>
    </view>
    <!-- 推荐文章 -->
    <view class="article" @click="handleUrl('/pages/common/noRelease')">
      <view class="title">推荐文章</view>
      <view class="articleList">
        <view class="articleListItem">
          <view class="articleListItemTitle">
            您的等级暂未解锁此功能
          </view>
          <!-- 头像 -->
          <view class="bottom">
            <image
              class="headPicture"
              src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1441836571,2166773131&fm=26&gp=0.jpg"
              mode="scaleToFill"
            ></image>
            <view class="right">
              <view class="nickname"></view>
              <view class="date"></view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <menu-drawer :show="drawerShow" @change="drawerShow = !drawerShow" :user="user" :isLogin="isLogin"/>
  </view>
</template>

<script lang="ts">
import { reactive, ref } from "vue";
export default {
  onShareAppMessage() {
    return {
      title: `${this.user.nickName}邀请你使用剑指题解，一起快乐刷题吧~`,
    };
  },
  onShow() {
    this.handleLoadUserInfo();
  },
  setup() {
    const drawerShow = ref<boolean>(false);
    // 触摸坐标
    const startData = reactive<{
      clientX: number;
      clientY: number;
    }>({
      clientX: 0,
      clientY: 0,
    });
    // 首页展示的信息，头像/昵称等
    const user = ref({
      nickName: "",
      avatarUrl: "",
    });
    // 是否登录
    const isLogin = ref(uni.getStorageSync("uni_id_token") !== "");

    const handleLoadUserInfo = () => {
      if (isLogin.value) {
        user.value = uni.getStorageSync("userInfo");
      }
    };
    const handleUrl = (path: string) => {
      uni.navigateTo({
        url: path,
      });
    };
    // 点击user和头像
    const handleClickUser = () => {
      // 判断是否登录
      if (isLogin.value) {
        // 打开首页用户弹窗
        drawerShow.value = true;
      } else {
        // 未登录进入登录页面
        uni.navigateTo({
          url: "/pages/user/login",
        });
      }
    };
    const handleTouchStart = (e) => {
      startData.clientX = e.changedTouches[0].clientX;
      startData.clientY = e.changedTouches[0].clientY;
    };
    const handleTouchEnd = (e) => {
      const subX = e.changedTouches[0].clientX - startData.clientX;
      const subY = e.changedTouches[0].clientY - startData.clientY;
      if (Math.abs(subX) > Math.abs(subY)) {
        if (subX > 50) {
          // 右滑
          drawerShow.value = true;
        } else if (subX < -50) {
          // 左滑
          drawerShow.value = false;
        }
      }
    };
    return {
      drawerShow,
      isLogin,
      user,
      handleUrl,
      handleLoadUserInfo,
      handleClickUser,
      handleTouchStart,
      handleTouchEnd,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../../util/common.scss";

.indexBox {
  .topBox {
    position: relative;
    width: 100%;
    height: 524rpx;
    background: url(https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-0vdryl5tm4n61d8ce3/4bff3ee0-3d02-11eb-b997-9918a5dda011.png)
      no-repeat center / 100%;

    .headPicture {
      width: 70rpx;
      height: 70rpx;
      border-radius: 50%;
      margin-top: calc(var(--status-bar-height) + 40rpx);
      margin-left: 48rpx;
    }
    button::after {
      border: none;
      background-color: none;
      padding: 0;
      width: 100%;
      height: 100%;
      position: static;
    }
    .getUserButton {
      width: 240rpx;
      height: 112rpx;
      background-color: transparent;
      border: none;
      margin-left: 0;
      margin-right: 0;
      padding-left: 0;
      padding-right: 0;
      margin-top: 4rpx;
      font-size: 80rpx;
      margin-left: 48rpx;
      line-height: 0;
      text-align: start;
      color: #fff;
      .nickname {
        line-height: 112rpx;
        margin-left: 0;
      }
    }

    .hello {
      color: #fff;
      font-size: 40rpx;
      margin-top: 58rpx;
      margin-left: 48rpx;
      font-weight: lighter;
    }

    .nickname {
      width: 460rpx;
      @include text-ellipsis;
      color: #fff;
      margin-top: 4rpx;
      font-size: 75rpx;
      margin-left: 48rpx;
    }

    .search {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      position: absolute;
      bottom: -50rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 652rpx;
      height: 100rpx;
      background-color: #fff;
      box-shadow: 0px 4px 11px 0px rgba(38, 46, 99, 0.15);
      border-radius: 10px;

      input {
        width: calc(100% - 40rpx - 30rpx - 72rpx);
        margin-left: 40rpx;
        font-size: 28rpx;
      }

      .icon {
        width: 72rpx;
        height: 68rpx;

        &:active {
          opacity: 0.8;
        }
      }
    }
  }

  .banner {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 686rpx;
    height: 240rpx;
    border-radius: 15px;
    overflow: hidden;
    opacity: 0.72;
    color: #fff;
    margin: 80rpx auto 16rpx auto;
    box-shadow: 0px 4px 10px 0px rgba(76, 83, 119, 0.25);
    image {
      width: 100%;
      height: 100%;
    }
  }

  .menu {
    display: flex;
    justify-content: center;
    align-items: center;

    .menumain {
      width: 690rpx;
      height: 120rpx;

      .title {
        font-size: 32rpx;
        margin-top: 44rpx;
        margin-left: 52rpx;
        font-weight: bold;
      }

      .content {
        font-size: 24rpx;
        color: #999999;
        word-break: break-all;
        margin-left: 54rpx;
        margin-top: 4rpx;
      }
    }

    .question {
      width: 364rpx;
      height: 264rpx;
      background: url(../../static/index/indexFile.png) no-repeat center / 100%;

      .content {
        max-width: 256rpx;
      }
    }

    .dynamic {
      width: 364rpx;
      height: 264rpx;
      background: url(../../static/index/indexNews.png) no-repeat center / 100%;

      .content {
        max-width: 282rpx;
      }

      .headPictureList {
        position: relative;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-left: 46rpx;
        margin-top: 12rpx;
        height: 44rpx;

        .headPicture {
          position: absolute;
          width: 44rpx;
          height: 44rpx;
          border-radius: 50%;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }

  .community {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 690rpx;
    height: 120rpx;
    background: url(../../static/index/indexDiscuss.png) no-repeat center / 100%;
    margin: 0 auto;

    .title {
      font-size: 32rpx;
      margin-left: 30rpx;
    }

    .content {
      font-size: 24rpx;
      color: #404040;
      margin-left: 40rpx;
      color: #999999;
    }
  }

  .article {
    width: 690rpx;
    margin: 40rpx auto 28rpx auto;

    .title {
      font-size: 32rpx;
      font-weight: bold;
      color: #404040;
    }

    .articleList {
      width: 100%;

      .articleListItem {
        width: 606rpx;
        height: 190rpx;
        padding: 30rpx 42rpx 36rpx 42rpx;
        background: #ffffff;
        box-shadow: 0px 4px 11px 0px rgba(38, 46, 99, 0.15);
        border-radius: 10px;
        margin-top: 24rpx;

        .articleListItemTitle {
          font-size: 28rpx;
          word-break: break-all;
        }

        .bottom {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-top: 30rpx;

          .headPicture {
            width: 80rpx;
            height: 80rpx;
            border-radius: 50%;
          }

          .right {
            margin-left: 16rpx;

            .nickname {
              font-size: 24rpx;
              color: #666666;
            }

            .date {
              font-size: 20rpx;
              color: #999999;
            }
          }
        }
      }
    }
  }
}
</style>
