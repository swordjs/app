<template>
  <view class="questionDetail">
    <view class="top">
      <!-- 顶部的bar -->
      <i-navigation-bar />
      <view class="title">
        {{ detailData.title || "" }}
      </view>
      <view class="info">
        <view class="tags">
          <view class="tag" v-for="tag in detailData.tagID" :key="tag._id">{{
            tag.name
          }}</view>
        </view>
        <view class="browse">
          <image src="../../static/question/eyes.png"></image>
          <view class="content">{{ detailData.pageView || "0" }}人已浏览</view>
        </view>
      </view>
    </view>

    <view class="main">
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
      <swiper
        :current="tabCurrent"
        @change="handleSwiperChange"
        :style="{ height: swiperHeight + 'px' }"
      >
        <swiper-item @touchmove.stop>
          <scroll-view
            @scrolltolower="handleExplanationTolower"
            :scroll-y="true"
            style="height: 100%"
            v-if="explanations.length !== 0"
          >
            <view
              @click="handleExplanationCard(explanation)"
              class="itemCard"
              v-for="explanation in explanations"
              :key="explanation._id"
            >
              <view class="itemCardTop">
                <image
                  class="headPicture"
                  :src="explanation.userID[0].avatar"
                  mode="scaleToFill"
                ></image>
                <view class="nickname">{{
                  explanation.userID[0].nickname
                }}</view>
              </view>
              <view class="itemBody">
                <!-- 可能有图片 -->
                <!-- <view class="images">
                <image
                  src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1441836571,2166773131&fm=26&gp=0.jpg"
                  mode="scaleToFill"
                ></image>
              </view> -->
                <view class="itemMain">
                  {{ removeHtmlTag(explanation.content) }}
                </view>
              </view>
            </view>
          </scroll-view>
          <template v-else>
            <view style="margin-top: 25%">
              <commonFill title="还没有人解答oh，快来成为第一个吧!" />
            </view>
          </template>
        </swiper-item>
      </swiper>
    </view>
    <!-- 操作栏 -->
    <view class="bottom">
      <!-- 写题解 -->
      <template v-if="!explanationIDBySelf">
        <i-button
          @click="handleWrite"
          customStyle="background-color: #5671E8;border-color: #5671E8;width: 100px; line-height:37px;"
          round
          >写题解</i-button
        >
      </template>
      <!-- 查看自己的题解 -->
      <template v-else>
        <i-button
          @click="handleExplanationCard({ _id: explanationIDBySelf })"
          customStyle="background-color: #5671E8;border-color: #5671E8;width: 170px; line-height:37px;"
          round
          >查看自己的题解</i-button
        >
      </template>
    </view>
  </view>
</template>

<script lang="ts">
import Tabs from "../../components/v-tabs/v-tabs.vue";
import { ref } from "vue";
// api
import { getQuestionDetailByID, postAddPageView } from "../../api/question";
import {
  getExplanationsByQuestionID,
  checkExplanationByUser,
} from "../../api/questionExplanation";
import { removeHtmlTag } from "../../util/common";
import notLogin from "../../util/notLogin";
interface IPageParams {
  id: string;
}
export default {
  onShow(){
    // 每次进入页面需要查询这个题是否已做过
    this.getExplanationIDBySelf();
  },
  onLoad(params: IPageParams) {
    this.id = params.id;
    this.handleGetDetailData();
    this.handleGetQuestionExplanation();
    // 调用增加浏览量的方法
    this.handleAddPageView();
  },
  onShareAppMessage() {
    return {
      title: `剑指题解：${this.detailData.title}`,
    };
  },
  setup() {
    // 分页相关配置
    let pageConfig = ref<{
      page: number;
      limit: number;
    }>({
      page: 1,
      limit: 20,
    });
    const detailData = ref<{
      title: string;
    }>({
      title: "",
    });
    const explanations = ref([]);
    const id = ref<string>("");
    const explanationIDBySelf = ref<string | boolean>("");
    // 查询自身是否解答过这道题了
    const getExplanationIDBySelf = async () => {
      // 判断是否登录
      const userID = uni.getStorageSync("uni_id");
      if (userID === "") return false;
      const result = await checkExplanationByUser({
        _id: id.value,
      });
      if (result.success) {
        explanationIDBySelf.value = result.data === null ? false : result.data;
      }
    };
    // 计算屏幕高度 - tab的高度 - 导航栏的高度 = swiper高度 - 底部操作栏高度
    const swiperHeight = uni.getSystemInfoSync().screenHeight - 251 - 49;
    const tabCurrent = ref(0);
    const tabs = ref(["解答"]);
    const handleSwiperChange = (e) => {
      tabCurrent.value = e.detail.current;
    };
    const handleGetDetailData = async () => {
      uni.showLoading({ mask: true });
      const result = await getQuestionDetailByID({
        id: id.value,
      });
      if (result.success) {
        detailData.value = result.data[0];
      }
      uni.hideLoading();
    };
    // 获取题解列表
    const handleGetQuestionExplanation = async () => {
      uni.showLoading({ title: "加载中...", mask: true });
      const explanationData = await getExplanationsByQuestionID({
        questionID: id.value,
        limit: pageConfig.value.limit,
        page: pageConfig.value.page,
      });
      uni.hideLoading();
      if (explanationData.success) {
        explanations.value = explanations.value.concat(explanationData.data);
      }
    };
    // 题解列表触底加载
    const handleExplanationTolower = () => {
      const {page, limit} = pageConfig.value;
      if (page * limit > explanations.value.length) {
        uni.showToast({
          title: "再往下就没内容啦~",
          icon: "none",
        });
      } else {
        pageConfig.value.page++;
        // 分页加载
        handleGetQuestionExplanation();
      }
    }
    // 跳转到题解详情页面
    const handleExplanationCard = (target: { _id: string }) => {
      uni.navigateTo({
        url: `/pages/question/questionExplanationDetail?id=${target._id}&questionID=${id.value}`,
      });
    };
    // 点击写题解按钮
    const handleWrite = () => {
      // 判断是否登录
      notLogin(async () => {
        uni.navigateTo({
          url: `/pages/question/writeQuestion?questionID=${id.value}&title=${detailData.value.title}`,
        });
      });
    };
    
    const handleAddPageView = () => {
      postAddPageView({
        _id: id.value,
      });
    };
    function handleBack() {
      uni.navigateBack({
        delta: 1,
      });
    }
    return {
      id,
      explanationIDBySelf,
      detailData,
      explanations,
      swiperHeight,
      tabCurrent,
      tabs,
      removeHtmlTag,
      getExplanationIDBySelf,
      handleSwiperChange,
      handleGetDetailData,
      handleGetQuestionExplanation,
      handleExplanationCard,
      handleExplanationTolower,
      handleAddPageView,
      handleBack,
      handleWrite,
    };
  },
  components: {
    Tabs,
  },
};
</script>

<style lang="scss">
@import "../../util/common.scss";

.questionDetail {
  height: 100vh;
  overflow-y: hidden;
  .top {
    display: inline-block;
    position: relative;
    width: 100%;
    height: 396rpx;
    background: linear-gradient(360deg, #809bf5 0%, #506be6 100%);

    .title {
      width: 666rpx;
      margin: 0 auto;
      font-size: 32rpx;
      color: #fff;
      margin-top: 42rpx;
      @include text-ellipsis(2);
    }

    .info {
      position: absolute;
      bottom: 90rpx;
      left: 40rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 666rpx;
      margin: 0 auto;
      margin-top: 20rpx;

      .tags {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .tag {
          color: #fff;
          font-size: 24rpx;
          background: linear-gradient(270deg, #ffd398 0%, #ffa85f 100%);
          border-radius: 2px;
          padding: 2rpx 16rpx;
        }

        .tag:not(:last-child) {
          margin-right: 16rpx;
        }
      }

      .browse {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        image {
          width: 34rpx;
          height: 20rpx;
          margin-right: 10rpx;
        }

        .content {
          font-size: 24rpx;
          color: #fff;
        }
      }
    }
  }
  .bottom {
    width: 690rpx;
    height: 98rpx;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
  }
  .main {
    display: inline-block;
    width: 750rpx;
    background: #ffffff;
    border-radius: 25px 25px 0px 0px;
    transform: translateY(-64rpx);
    .tab {
      width: 200rpx;
      margin-top: 30rpx;
      transform: translateX(-24rpx);
    }

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
      &:last-child {
        margin-bottom: 20rpx;
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

        .itemMain {
          color: #666666;
          font-size: 28rpx;
          margin-top: 20rpx;
        }
      }
    }
  }
}
</style>
