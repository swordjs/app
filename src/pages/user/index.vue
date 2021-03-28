<template>
  <view class="userBox">
    <view class="top">
      <!-- 顶部的bar -->
      <i-navigation-bar />
      <!-- 头像和昵称 -->
      <view class="user">
        <image
          class="headPicture"
          :src="userInfo.avatar"
          mode="scaleToFill"
        ></image>
        <view class="info">
          <view class="nickname"
            >{{ userInfo.nickname }}
            <image
              v-if="isCertification"
              class="auth"
              src="../../static/user/auth.png"
              mode=""
            ></image>
          </view>
          <view class="sign">个性签名：{{ userInfo.sign }}</view>
        </view>
        <!-- 关注/编辑 -->
        <view v-if="!isSelf" class="followOrEdit" @click="handleCardButton">
          <i-icon
            v-if="!attentionUser"
            size="35rpx"
            color="#FFDB86"
            name="add-line"
          >
          </i-icon>
          <text>{{ attentionUser ? "取消关注" : "关注" }}</text>
        </view>
      </view>
      <!-- 卡片 -->
      <view class="card">
        <!-- 粉丝数(k) -->
        <view class="fans">{{userInfo.fansCount}}</view>
        <view class="fansTip">粉丝数奇高，大佬跑不掉了～</view>
        <!-- 详细信息 -->
        <view class="bottom">
          <view class="item left">出过<text>2.4k</text>道题目</view>
          <view class="item right">解答<text>100</text>次题解</view>
        </view>
        <!-- 被采纳 -->
        <view class="adopt"> 被采纳过1.3k次 </view>
      </view>
    </view>
    <view class="tab">
      <Tabs
        :lineScale="0.3"
        lineColor="#526EE7"
        lineRadius="4rpx"
        activeColor="#526EE7"
        :bold="false"
        :scroll="false"
        v-model="tabCurrent"
        :tabs="tabs"
      ></Tabs>
    </view>
    <!-- 以下是swiper -->
    <view class="questionSwiper">
      <swiper
        :current="tabCurrent"
        @change="handleSwiperChange"
        :style="{ height: swiperHeight + 'px' }"
      >
        <swiper-item>
          <view class="itemCard">
            <view class="itemCardTop">
              <image
                class="headPicture"
                src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1441836571,2166773131&fm=26&gp=0.jpg"
                mode="scaleToFill"
              ></image>
              <view class="nickname">前端每日3+1</view>
            </view>
            <view class="itemBody">
              <!-- 可能有图片 -->
              <view class="images">
                <image
                  src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1441836571,2166773131&fm=26&gp=0.jpg"
                  mode="scaleToFill"
                ></image>
                <image
                  src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1441836571,2166773131&fm=26&gp=0.jpg"
                  mode="scaleToFill"
                ></image>
                <image
                  src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1441836571,2166773131&fm=26&gp=0.jpg"
                  mode="scaleToFill"
                ></image>
              </view>
              <view class="main">
                这是一道大题目，把考点拆成了4个小项；需要侯选人用递归算法实现（限制15行代码以内实现；限制时间10分钟内完成）归算法实现…
              </view>
            </view>
          </view>
          <view class="itemCard">
            <view class="itemCardTop">
              <image
                class="headPicture"
                src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1441836571,2166773131&fm=26&gp=0.jpg"
                mode="scaleToFill"
              ></image>
              <view class="nickname">前端每日3+1</view>
            </view>
            <view class="itemBody">
              <!-- 可能有图片 -->
              <view class="images">
                <image
                  src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1441836571,2166773131&fm=26&gp=0.jpg"
                  mode="scaleToFill"
                ></image>
                <image
                  src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1441836571,2166773131&fm=26&gp=0.jpg"
                  mode="scaleToFill"
                ></image>
                <image
                  src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1441836571,2166773131&fm=26&gp=0.jpg"
                  mode="scaleToFill"
                ></image>
              </view>
              <view class="main">
                这是一道大题目，把考点拆成了4个小项；需要侯选人用递归算法实现（限制15行代码以内实现；限制时间10分钟内完成）归算法实现…
              </view>
            </view>
          </view>
          <view class="itemCard">
            <view class="itemCardTop">
              <image
                class="headPicture"
                src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1441836571,2166773131&fm=26&gp=0.jpg"
                mode="scaleToFill"
              ></image>
              <view class="nickname">前端每日3+1</view>
            </view>
            <view class="itemBody">
              <!-- 可能有图片 -->
              <view class="images">
                <image
                  src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1441836571,2166773131&fm=26&gp=0.jpg"
                  mode="scaleToFill"
                ></image>
                <image
                  src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1441836571,2166773131&fm=26&gp=0.jpg"
                  mode="scaleToFill"
                ></image>
                <image
                  src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1441836571,2166773131&fm=26&gp=0.jpg"
                  mode="scaleToFill"
                ></image>
              </view>
              <view class="main">
                这是一道大题目，把考点拆成了4个小项；需要侯选人用递归算法实现（限制15行代码以内实现；限制时间10分钟内完成）归算法实现…
              </view>
            </view>
          </view>
        </swiper-item>
        <swiper-item> 2 </swiper-item>
        <swiper-item> 3 </swiper-item>
        <swiper-item> 4 </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script lang="ts">
import { ref, computed } from "vue";
import {
  getUserContentByID,
  getFansCountByUser,
  postFollow,
} from "../../api/user";
import iIcon from "../../components/i-uniapp/i-icon/i-icon.vue";
type UserInfo = {
  nickname: string;
  avatar: string;
  sign: string;
  role: string[];
  fansCount: number | string;
};
export default {
  components: { iIcon },
  onLoad(event: { userID: string }) {
    this.userID = event.userID;
    this.getUserInfo();
    this.getFans();
  },
  setup() {
    // 是否关注了用户
    const attentionUser = ref<boolean>(false);
    const userInfo = ref<UserInfo>({
      nickname: "",
      avatar: "../../static/index/user.png",
      sign: "",
      role: [],
	  fansCount: "--"
    });
    const userID = ref<string>("");
    // 计算屏幕高度 - tab的高度 - 导航栏的高度 = swiper高度
    const swiperHeight = uni.getSystemInfoSync().screenHeight - 38;
    const tabCurrent = ref(0);
    const tabs = ref(["已发布", "已解答", "我的收藏", "我的浏览"]);
    // 判断是否是认证状态
    const isCertification = computed(() => {
      return userInfo.value.role?.some((r: string) => r === "admin");
    });
    // 判断进入的是否是自己的页面
    const isSelf = computed(() => {
      return userID.value === uni.getStorageSync("uni_id");
    });
    const handleSwiperChange = (e) => {
      tabCurrent.value = e.detail.current;
    };
    // 处理用户卡片上的按钮逻辑
    const handleCardButton = async () => {
      uni.showLoading({
        title: `${attentionUser.value ? "取消关注中..." : "关注中..."}`,
        mask: true,
      });
      // 点击关注
      const followResult = await postFollow({
        targetID: userID.value,
      });
      uni.hideLoading();
      if (followResult.success) {
        uni.showToast({
          title: `${attentionUser.value ? "取消关注" : "关注"}成功`,
          icon: "none",
        });
        attentionUser.value = !attentionUser.value;
      }
    };
    // 获取粉丝数
    const getFans = async () => {
      const result = await getFansCountByUser({
        userID: userID.value,
      });
      if (result.success) {
		userInfo.value.fansCount = result.data.length;
      }
    };
    const getUserInfo = async () => {
      uni.showLoading({
        title: "加载用户信息中",
        mask: true,
      });
      const result = await getUserContentByID({
        userID: userID.value,
      });
      uni.hideLoading();
      if (result.success) {
        userInfo.value = result.data;
        // 判断此信息是否是本人，如果不是本人，则查询本人和此人的粉丝关联，如果是本人，则就不需要查询
        if (!isSelf.value) {
          const selfResult = await getUserContentByID({
            userID: uni.getStorageSync("uni_id"),
          });
          if (selfResult.success) {
            if (selfResult.data.followers) {
              attentionUser.value = selfResult.data.followers.some(
                (f: any) => f === userID.value
              );
            }
          }
        }
      }
    };
    return {
      attentionUser,
      isSelf,
      userInfo,
      userID,
      isCertification,
      tabCurrent,
      tabs,
      swiperHeight,
      getFans,
      getUserInfo,
      handleCardButton,
      handleSwiperChange,
    };
  },
};
</script>

<style lang="scss" scoped>
.userBox {
  .top {
    display: inline-block;
    position: relative;
    width: 100%;
    height: 474rpx;
    background: url(../../static/user/userBackground.png) no-repeat center /
      100%;

    .user {
      position: relative;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: calc(100% - 50rpx - 32rpx);
      margin: 0 auto;
      margin-top: 60rpx;

      .headPicture {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        border: 2px solid #fff;
      }

      .info {
        width: 400rpx;
        margin-left: 24rpx;

        .nickname {
          font-size: 32rpx;
          color: #fff;
          font-weight: bold;

          .auth {
            width: 32rpx;
            height: 32rpx;
            margin-left: 12rpx;
          }
        }

        .sign {
          font-size: 24rpx;
          margin-top: 8rpx;
          color: #e7ecfd;
          opacity: 0.7;
        }
      }
      .followOrEdit {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        justify-content: center;
        align-items: center;
        background: #4e5bf6;
        border-radius: 13px;
        font-size: 24rpx;
        color: #e4e5ff;
        padding: 8rpx 24rpx;
        text {
          //   margin-right: 6rpx;
        }
        &:active {
          opacity: 0.7;
        }
      }
    }

    .card {
      position: relative;
      margin: 0 auto;
      margin-top: 40rpx;
      width: 690rpx;
      height: 252rpx;
      background: url(../../static/user/card.png) no-repeat center / 100%;
      box-shadow: 0px 3px 10px 0px rgba(101, 118, 181, 0.16);
      overflow: hidden;

      .fans {
        font-size: 60rpx;
        color: #384af6;
        margin-top: 24rpx;
        text-align: center;
        font-weight: bold;
      }

      .fansTip {
        font-size: 24rpx;
        text-align: center;
        color: #7e84c0;
        margin-top: 2rpx;
      }

      .bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .item {
          width: 50%;
          text-align: center;
          font-size: 24rpx;
          margin-top: 32rpx;
          color: #6573ff;

          text {
            font-weight: bold;
            font-size: 28rpx;
          }
        }

        .left {
          border-right: 2rpx solid rgba(101, 115, 255, 0.1);
        }
      }

      .adopt {
        position: absolute;
        right: 0;
        top: 20rpx;
        padding: 10rpx 20rpx;
        background: linear-gradient(270deg, #6ab7fd 0%, #676bf6 100%);
        border-radius: 100px 0px 0px 100px;
        font-size: 20rpx;
        color: #e4f1fd;
      }
    }
  }

  .tab {
    margin-top: 28rpx;
  }
  .questionSwiper {
    .itemCard {
      padding: 30rpx;
      &:not(:first-child) {
        border-top: 2rpx solid #f1f3fc;
      }
      .itemCardTop {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .headPicture {
          width: 64rpx;
          height: 64rpx;
          border-radius: 50%;
          border: 2px solid #fff;
        }
        .nickname {
          font-size: 28rpx;
          margin-left: 16rpx;
        }
      }
      .itemBody {
        .images {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-top: 20rpx;
          image {
            width: 216rpx;
            height: 162rpx;
            border-radius: 15rpx;
            &:not(:first-child) {
              margin-left: 22rpx;
            }
          }
        }
        .main {
          width: 690rpx;
          color: #666666;
          font-size: 28rpx;
          margin-top: 20rpx;
        }
      }
    }
  }
}
</style>
