<template>
  <view class="questionListBox">
    <swiper
      @change="handleQuestionChange"
      next-margin="940rpx"
      vertical
      :style="{ height: scrollHeight + 'px' }"
    >
      <swiper-item v-for="question in dataList" :key="question._id">
        <view class="item">
          <!-- 背景卡片 -->
          <view class="topCard write">
            <!-- 标题 -->
            <view class="title" @click="handleQuestionDetail(question._id)">
              {{ question.title }}
            </view>
            <!-- 个人信息 -->
            <view class="user">
              <image
                :src="question.publishUserID[0].avatar"
                class="headPicture"
                mode=""
              ></image>
              <view class="uerContent">
                <view class="nickName">{{
                  question.publishUserID[0].nickname
                }}</view>
                <view class="authentication">官方认证出题人</view>
              </view>
              <!-- 如果是自己就看不到关注按钮，已关注就显示已关注，未关注就显示未关注 -->
              <view
                v-if="userID !== question.publishUserID[0]._id"
                class="follow"
                @click.stop="handleFollow(question.publishUserID[0]._id)"
                >关注</view
              >
            </view>
          </view>
          <!-- 详情 -->
          <view class="detail">
            <view class="title">
              问题描述<image
                class="quote"
                src="../../static/question/quote.png"
                mode=""
              ></image>
            </view>
            <view class="content">
              {{ question.content === "" && "暂无题目介绍" }}
            </view>
            <!-- 链接 -->
            <view class="link">看看其他小伙伴怎么做的吧 ></view>
          </view>
          <!-- 开始 -->
          <view class="start">Start</view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
// api
import { getQuestionListData } from "../../api/question";
import { postFollow, getUserContentByID } from "../../api/user";
interface IPageParams {
  areaID: string;
  areaName: string;
}
interface IDataList {
  _id: string;
  title: string;
  content: string;
  publishUserID: object[];
}
export default defineComponent({
  onLoad(params: IPageParams) {
    this.areaID = params.areaID;
    // 动态设置标题
    uni.setNavigationBarTitle({
      title: params.areaName,
    });
    // 获取列表
    this.handleGetData();
    // 获取关注用户的信息
    this.handleGetUserContent();
  },
  setup() {
    // 分页相关配置
    let pageConfig: {
      page: number;
      limit: number;
    } = {
      page: 1,
      limit: 10,
    };
    // 定义一个列表
    const dataList = ref<IDataList[] | []>([]);
    const areaID = ref<string>("");
    const scrollHeight: number = uni.getSystemInfoSync().screenHeight;
    const userID: string = uni.getStorageSync("uni-id");
    // 获取其关注的用户列表
    const followers = ref<string[]>([]);
    // 获取用户信息
    const handleGetUserContent = async () => {
      const userResult = await getUserContentByID();
      if(userResult.success){
        followers.value = userResult.data.followers;
        console.log(followers.value);
      }
    }
    // 根据规则获取题目列表
    const handleGetData = async () => {
      uni.showLoading({
        title: "获取题目中...",
        mask: true,
      });
      const result = await getQuestionListData({
        limit: pageConfig.limit,
        page: pageConfig.page,
        areaID: areaID.value,
        userID
      });
      uni.hideLoading();
      if (result.success) {
        dataList.value = dataList.value.concat(result.data);
        console.log(dataList.value);
      }
    };
    // 进入题解详情
    const handleQuestionDetail = (_id: string) => {
      uni.navigateTo({
        url: `/pages/question/questionDetail?id=${_id}`,
      });
    };
    const handleFollow = async (targetID: string) => {
      const token: string = uni.getStorageSync("uni-id-token");
      // 判断是否未登录
      if (token === "") {
        uni.showToast({
          title: "您暂未登录，请前去首页登录",
          icon: "none",
        });
      } else {
        uni.showLoading({
          title: "关注中...",
          mask: true,
        });
        // 调用关注的接口
        const followResult = await postFollow({
          targetID: targetID,
        });
        uni.hideLoading();
        if (followResult.success) {
          uni.showToast({
            title: "操作成功",
            icon: "none",
          });
        }
      }
    };
    const handleQuestionChange = (e) => {
      const current: number = e.detail.current;
      // 判断是当前数组的最后一个
      if (current === dataList.value.length - 1) {
        // 页数++
        pageConfig.page++;
        handleGetData();
      }
    };
    return {
      userID,
      areaID,
      dataList,
      scrollHeight,
      handleGetData,
      handleQuestionDetail,
      handleQuestionChange,
      handleFollow,
      handleGetUserContent
    };
  },
});
</script>

<style>
page {
  background-color: #f6f7f9;
}
</style>

<style lang="scss" scoped>
@import "../../util/common.scss";
.questionListBox {
  .item {
    position: relative;
    width: 672rpx;
    height: 608rpx;
    background-color: #fff;
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
    border-radius: 20rpx;
    margin: 0 auto;
    margin-top: 66rpx;

    .topCard {
      width: 100%;
      height: 320rpx;
      overflow: hidden;

      &.write {
        background: url(../../static/question/questionWriteBackrgound.png)
          no-repeat center / 100%;
      }

      &.book {
        background: url(../../static/question/questionBookBackrgound.png)
          no-repeat center / 100%;
      }

      .title {
        width: 616rpx;
        height: 100rpx;
        margin: 40rpx auto 36rpx auto;
        color: #2b2b66;
        font-size: 36rpx;
        font-weight: bold;
        line-height: 50rpx;
        @include text-ellipsis(2);
      }

      .user {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-left: 32rpx;

        .headPicture {
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
        }

        .uerContent {
          margin-left: 24rpx;

          .nickName {
            max-width: 400rpx;
            @include text-ellipsis-one;
            font-size: 28rpx;
            color: #5454a1;
          }

          .authentication {
            font-size: 20rpx;
            color: #ffac61;
          }
        }

        .follow {
          width: 88rpx;
          line-height: 40rpx;
          text-align: center;
          background: linear-gradient(180deg, #6e8cf6 0%, #412bff 100%);
          border-radius: 22rpx;
          font-size: 24rpx;
          color: #fff;
          margin-left: 24rpx;

          &:active {
            opacity: 0.8;
          }
        }
      }
    }

    .detail {
      width: 612rpx;
      margin: 0 auto;
      margin-top: 14rpx;

      .title {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        font-size: 28rpx;
        font-weight: bold;
        color: #446eea;

        .quote {
          width: 34rpx;
          height: 24rpx;
          margin-left: 10rpx;
        }
      }

      .content {
        min-height: 100rpx;
        color: #666666;
        font-size: 24rpx;
        margin-top: 20rpx;
        line-height: 34rpx;
        letter-spacing: 2rpx;
        @include text-ellipsis(3);
      }

      .link {
        text-align: center;
        font-size: 20rpx;
        color: #a8c0fe;
        margin-top: 30rpx;
        text-decoration: underline;
      }
    }

    .start {
      position: absolute;
      left: 50%;
      bottom: -44rpx;
      transform: translateX(-50%);
      width: 480rpx;
      text-align: center;
      line-height: 88rpx;
      background: linear-gradient(270deg, #ffd781 0%, #ffa75e 100%);
      box-shadow: 0px 4px 8px 0px rgba(172, 121, 71, 0.25);
      border-radius: 46rpx;
      color: #fff;
      font-size: 32rpx;

      &:active {
        opacity: 0.8;
      }
    }

    &:first-child {
      margin-top: 20rpx;
    }
  }
}
</style>
