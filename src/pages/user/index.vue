<template>
  <view class="userBox">
    <view class="top">
      <!-- 顶部的bar -->
      <i-navigation-bar
        @onReady="navigationBarReady"
        :sticky="navigationBarSticky"
      >
        <template v-if="navigationBarSticky">
          {{ userInfo.nickname }}
        </template>
      </i-navigation-bar>
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
          <view class="sign">{{ userInfo.sign }}</view>
        </view>
        <!-- 关注/编辑 -->
        <view v-if="!isSelf" class="follow" @click="handleCardButton">
          <i-icon
            @click="handleCardButton"
            v-if="!attentionUser"
            size="35rpx"
            color="#FFDB86"
            name="add-line"
          >
          </i-icon>
          <text>{{ attentionUser ? "取消关注" : "关注" }}</text>
        </view>
        <view v-else class="edit" @click="handleEditProfile">
          <i-icon
            @click="handleEditProfile"
            v-if="!attentionUser"
            size="30rpx"
            style="margin-right: 10rpx;"
            color="#FFDB86"
            name="pencil-fill"
          >
          </i-icon>
          <text>编辑</text>
        </view>
      </view>
      <!-- 卡片 -->
      <view class="card">
        <!-- 粉丝数(k) -->
        <view class="fans">{{ userInfo.fansCount }}</view>
        <view class="fansTip">粉丝数奇高，大佬跑不掉了～</view>
        <!-- 详细信息 -->
        <view class="bottom">
          <view class="item left"
            >出过<text>{{ userInfo.publishCount }}</text
            >道题目</view
          >
          <view class="item right"
            >解答<text>{{ userInfo.explanationCount }}</text
            >次题解</view
          >
        </view>
        <!-- 被采纳 -->
        <view class="adopt"> 被采纳过{{ userInfo.likeCount }}次 </view>
      </view>
    </view>
    <!-- 将tab和列表作为一个view去展示，统一吸顶 -->
    <view>
      <!-- 这块top值减去14的原因是，tab本来有一个marginTop的值，需要减去 -->
      <view
        class="tab"
        :style="{
          position: 'sticky',
          top: navigationBarHeight - 15 + 'px',
        }"
      >
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
            <scroll-view
              :style="{ height: swiperHeight + 'px' }"
              :scroll-y="scrollOpen && listInfo.publishList.data.length !== 0"
              @scrolltolower="handleScrollTolower(listInfo.publishList)"
            >
              <view
                class="itemCard"
                @click="handleClickQuestion(item._id)"
                v-for="item in listInfo.publishList.data"
                :key="item._id"
              >
                <!-- <view class="itemCardTop">
              <image
                class="headPicture"
                src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1441836571,2166773131&fm=26&gp=0.jpg"
                mode="scaleToFill"
              ></image>
              <view class="nickname">前端每日3+1</view>
            </view> -->
                <view class="itemBody">
                  <!-- 可能有图片 -->
                  <!-- <view class="images">
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
              </view> -->
                  <view class="main">
                    <view class="mainTitle">{{ item.title }}</view>
                    <view class="mainContent">{{ item.content }}</view>
                    <!-- 时间 -->
                    <view class="mainCreateTime">
                      <i-icon
                        size="30rpx"
                        name="time-line"
                        color="#666666"
                      ></i-icon>
                      <text>{{
                        dayjs(item.createDate).format("YYYY-MM-DD HH:mm")
                      }}</text>
                    </view>
                  </view>
                </view>
              </view>
              <template v-if="listInfo.publishList.data.length === 0">
                <view style="margin-top: 25%">
                  <commonFill title="暂无已发布数据" />
                </view>
              </template>
            </scroll-view>
          </swiper-item>
          <swiper-item>
            <scroll-view
              :style="{ height: swiperHeight + 'px' }"
              :scroll-y="
                scrollOpen && listInfo.explanationList.data.length !== 0
              "
              @scrolltolower="handleScrollTolower(listInfo.explanationList)"
            >
              <view
                class="itemCard"
                @click="handleExplanation(item._id, item.questionID[0]._id)"
                v-for="item in listInfo.explanationList.data"
                :key="item._id"
              >
                <view class="itemCardTop">
                  <image
                    class="headPicture"
                    :src="item.questionID[0].publishUserID[0].avatar"
                    mode="scaleToFill"
                  ></image>
                  <view class="nickname">{{
                    item.questionID[0].publishUserID[0].nickname
                  }}</view>
                </view>
                <view class="itemBody">
                  <!-- 可能有图片 -->
                  <!-- <view class="images">
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
              </view> -->
                  <view class="main">
                    <view class="mainTitle">{{ item.title }}</view>
                    <view class="mainContent">{{
                      removeHtmlTag(item.content)
                    }}</view>
                  </view>
                </view>
              </view>
              <template v-if="listInfo.explanationList.data.length === 0">
                <view style="margin-top: 25%">
                  <commonFill title="暂无已解答数据" />
                </view>
              </template>
            </scroll-view>
          </swiper-item>
        </swiper> </view
    ></view>
  </view>
</template>

<script lang="ts">
import * as dayjs from "dayjs";
import { ref, computed } from "vue";
import {
  getUserContentByID,
  postFollow,
  getUserBaseContentByUserID,
} from "../../api/user";
import { getQuestionListByUser } from "../../api/question";
import { getExplanationsByUserID } from "../../api/questionExplanation";
import { removeHtmlTag } from "../../util/common";
type UserInfo = {
  nickname: string;
  avatar: string;
  sign: string;
  role: string[];
  fansCount: number | string;
  publishCount: number;
  explanationCount: number;
  likeCount: number;
};
type List = {
  page: number;
  limit: number;
  data: any[];
};
type ListInfo = {
  publishList: List;
  explanationList: List;
};
export default {
  onLoad(event: { userID: string }) {
    this.userID = event.userID || uni.getStorageSync("uni_id");
    this.getQuestionList({
      index: 0,
    });
    this.getQuestionList({
      index: 1,
    });
  },
  onShow(){
    this.getUserInfo();
  },
  onShareAppMessage(){
    let title: string = "";
    if(this.isSelf){
      // 如果是本人
      title = "我在剑指题解等你，一起成长！快来关注我吧~"
    }else{
      title = `向你推荐了${this.userInfo.nickname}，快来关注TA吧~`
    }
    return {
      title
    }
  },
  onPageScroll({ scrollTop }) {
    if (this.navigationBarHeight < scrollTop) {
      if (!this.navigationBarSticky) {
        this.navigationBarSticky = true;
      }
    } else {
      this.navigationBarSticky = false;
    }
    // 开启列表的滚动视图
    if (this.navigationBarAndTabHeight <= scrollTop) {
      if (!this.scrollOpen) {
        this.scrollOpen = true;
      }
    } else {
      this.scrollOpen = false;
    }
  },
  setup() {
    // 是否关注了用户
    const attentionUser = ref<boolean>(false);
    const userInfo = ref<UserInfo>({
      nickname: "",
      avatar: "../../static/index/user.png",
      sign: "",
      role: [],
      fansCount: "--",
      publishCount: 0,
      explanationCount: 0,
      likeCount: 0,
    });
    const navigationBarHeight = ref<number>(0);
    // 导航栏组件准备之后返回的信息
    const navigationBarReady = ({ height }) => {
      navigationBarHeight.value = height;
    };
    // 导航是否吸顶
    const navigationBarSticky = ref<boolean>(false);
    // 是否开启滚动视图的滑动
    const scrollOpen = ref<boolean>(false);
    // 导航栏+tab的总高度
    const navigationBarAndTabHeight = computed(() => {
      //tabHeight - tabHeightMarginTop
      // 15是tabmargin高度
      // 19是tab本身高度
      return navigationBarHeight.value + 15 + 19;
    });
    // 列表
    const listInfo = ref<ListInfo>({
      publishList: {
        page: 1,
        limit: 20,
        data: [],
      },
      explanationList: {
        page: 1,
        limit: 20,
        data: [],
      },
    });
    const userID = ref<string>("");
    // 计算屏幕高度 - navigationBarHeight - navigationBarAndTabHeight
    const swiperHeight = computed(() => {
      return (
        uni.getSystemInfoSync().screenHeight - navigationBarAndTabHeight.value
      );
    });
    const tabCurrent = ref(0);
    const tabs = ref(["已发布", "已解答"]);
    // 判断是否是认证状态
    const isCertification = computed(() => {
      return userInfo.value.role?.some((r: string) => r === "admin");
    });
    // 判断进入的是否是自己的页面
    const isSelf = computed(() => {
      return userID.value === uni.getStorageSync("uni_id");
    });

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
    // 获取列表, index为非必填参数，如果传递了，tabCurrent将无效，将通过索引来直接查询方法不通过swiperCount查询
    const getQuestionList = async (
      params?: {
        index?: number;
      }
    ) => {
      // 没传入参数或者没传入index就默认按照tab来作为index查询
      if (!params?.index) {
        params = {
          index: tabCurrent.value
        };
      }
      const functionList = [getQuestionListByUser, getExplanationsByUserID];
      const keyName: "publishList" | "explanationList" =
        params.index === 0 ? "publishList" : "explanationList";
      uni.showLoading({
        title: "加载结果中...",
        mask: true,
      });
      const result = await functionList[params.index]({
        userID: userID.value,
        limit: listInfo.value[keyName].limit,
        page: listInfo.value[keyName].page,
      });
      uni.hideLoading();
      if (result.success) {
        listInfo.value[keyName].data = listInfo.value[keyName].data.concat(
            result.data
          );
      }
    };
    const handleSwiperChange = (e) => {
      tabCurrent.value = e.detail.current;
    };
    const getUserInfo = async () => {
      uni.showLoading({
        title: "加载用户信息中",
        mask: true,
      });
      const result = await getUserContentByID({
        userID: userID.value,
      });
      console.log(result);
      uni.hideLoading();
      if (result.success) {
        const {
          userInfo: user,
          explanationCount,
          fansCount,
          questionCount,
          likeCount,
        } = result.data;
        userInfo.value = user;
        userInfo.value.fansCount = fansCount; // 粉丝
        userInfo.value.publishCount = questionCount; // 发布题目数量
        userInfo.value.explanationCount = explanationCount; // 截图数量
        userInfo.value.likeCount = likeCount; // 被采纳的数量
        // 判断此信息是否是本人，如果不是本人，则查询本人和此人的粉丝关联，如果是本人，则就不需要查询
        if (!isSelf.value) {
          const selfResult = await getUserBaseContentByUserID({
            userID: uni.getStorageSync("uni_id"),
          });
          // 查询自己用户中的关注者是否关注了此用户
          if (selfResult.success && selfResult.data[0].followers) {
            attentionUser.value = selfResult.data[0].followers.some(
              (f: string) => f === userID.value
            );
          }
        }
      }
    };
    // 点击问题列表中的卡片，进入题目详情
    const handleClickQuestion = (id: number) => {
      uni.navigateTo({
        url: `/pages/question/questionDetail?id=${id}`,
      });
    };
    // 点击题解列表中的卡片，进入题解详情
    const handleExplanation = (id: number, questionID: number) => {
      uni.navigateTo({
        url: `/pages/question/questionExplanationDetail?id=${id}&questionID=${questionID}`,
      });
    };
    // 修改资料的入口
    const handleEditProfile = () => {
      uni.navigateTo({
        url: "/pages/user/editProfile"
      })
    }
    // 列表到达底部的处理函数
    const handleScrollTolower = (item: List) => {
      // 判断其中data的长度是否已不够进行分页
      if (item.page * item.limit > item.data.length) {
        uni.showToast({
          title: "再往下就没内容啦~",
          icon: "none",
        });
      } else {
        item.page++;
        // 分页加载
        getQuestionList();
      }
    };
    return {
      dayjs,
      removeHtmlTag,
      scrollOpen,
      navigationBarSticky,
      navigationBarAndTabHeight,
      navigationBarHeight,
      attentionUser,
      navigationBarReady,
      isSelf,
      userInfo,
      listInfo,
      userID,
      isCertification,
      tabCurrent,
      tabs,
      swiperHeight,
      getUserInfo,
      getQuestionList,
      handleCardButton,
      handleSwiperChange,
      handleScrollTolower,
      handleClickQuestion,
      handleExplanation,
      handleEditProfile
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../../util/common.scss";

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
          width: 100%;
          font-size: 24rpx;
          margin-top: 8rpx;
          color: #e7ecfd;
          opacity: 0.7;
          @include text-ellipsis(2);
        }
      }
      .follow {
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
      .edit{
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        justify-content: center;
        align-items: center;
        background: #5D6AF6;
        font-size: 24rpx;
        color: #e4e5ff;
        padding: 8rpx 24rpx;
        border-radius: 13px;
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
    z-index: 2;
    margin-top: 28rpx;
    background: #fff;
  }
  .questionSwiper {
    .itemCard {
      width: 630rpx;
      padding: 30rpx;
      box-shadow: 0px 3px 10px 0px rgba(97, 108, 150, 0.2);
      border-radius: 8px;
      margin: 0 auto;
      margin-top: 20rpx;
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
          width: 100%;
          margin-top: 20rpx;
          font-size: 28rpx;
          .mainTitle {
            @include text-ellipsis(2);
          }
          .mainContent {
            color: #666666;
            font-size: 26rpx;
            margin-top: 20rpx;
            word-wrap: break-word;
            @include text-ellipsis(3);
          }
          .mainCreateTime {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            color: #666666;
            margin-top: 20rpx;
            font-size: 25rpx;
            text {
              margin-left: 10rpx;
            }
          }
        }
      }
    }
  }
}
</style>
