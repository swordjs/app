<template>
  <view class="questionDetail">
    <view class="top">
      <!-- 顶部的bar -->
      <view class="navigationBar">
        <image
          class="back"
          @click="handleBack"
          src="../../static/common/back.png"
        />
        <view class="navigationBarTitle">详情</view>
      </view>
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
              <view class="nickname">{{ explanation.userID[0].nickname }}</view>
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
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script lang="ts">
import Tabs from "../../components/v-tabs/v-tabs.vue";
import { ref } from "vue";
// api
import {
  getQuestionDetailByID,
  postAddPageView,
  getExplanationsByQuestionID,
} from "../../api/questionExplanation";
interface IPageParams {
  id: string;
}
export default {
  onLoad(params: IPageParams) {
    this.id = params.id;
    this.handleGetDetailData();
    this.handleGetQuestionExplanation();
    // 调用增加浏览量的方法
    this.handleAddPageView();
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
    const detailData = ref({});
    const explanations = ref([]);
    const id = ref<string>("");
    // 计算屏幕高度 - tab的高度 - 导航栏的高度 = swiper高度
    const swiperHeight = uni.getSystemInfoSync().screenHeight - 251;
    const tabCurrent = ref(0);
    const tabs = ref(["解答"]);
    function handleSwiperChange(e) {
      tabCurrent.value = e.detail.current;
    }
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
      uni.showLoading({ title: "获取题解列表...", mask: true });
      const explanationData = await getExplanationsByQuestionID({
        questionID: id.value,
        limit: pageConfig.limit,
        page: pageConfig.page,
      });
      uni.hideLoading();
      if (explanationData.success) {
        explanations.value = explanations.value.concat(explanationData.data);
      }
    };
    // 去除标签
    const removeHtmlTag = (htmlStr: string) => {
      return htmlStr.replace(/<[^>]+>/ig, "");
    }
    // 跳转到题解详情页面
    const handleExplanationCard = (target: {_id: string}) => {
      uni.navigateTo({
        url: `/pages/question/questionExplanationDetail?id=${target._id}`
      })
    }
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
      detailData,
      explanations,
      swiperHeight,
      tabCurrent,
      tabs,
      removeHtmlTag,
      handleSwiperChange,
      handleGetDetailData,
      handleGetQuestionExplanation,
      handleExplanationCard,
      handleAddPageView,
      handleBack,
    };
  },
  components: {
    Tabs,
  },
};
</script>

<style lang="scss">
.questionDetail {
  height: 100vh;
  overflow-y: hidden;
  .top {
    display: inline-block;
    position: relative;
    width: 100%;
    height: 396rpx;
    background: linear-gradient(360deg, #809bf5 0%, #506be6 100%);

    .navigationBar {
      width: calc(100% - 80rpx);
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: calc(50rpx + 30rpx) 40rpx auto 40rpx;

      .back {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 14rpx;
        height: 26rpx;
      }

      .navigationBarTitle {
        font-size: 36rpx;
        color: #fff;
      }
    }

    .title {
      width: 666rpx;
      margin: 0 auto;
      font-size: 32rpx;
      color: #fff;
      margin-top: 54rpx;
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
