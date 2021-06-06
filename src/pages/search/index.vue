<template>
  <view class="container">
    <view class="search-container">
      <!-- 搜索框 -->
      <view class="search-container-bar">
        <uni-search-bar
          ref="searchBar"
          style="flex: 1; border: none"
          bgColor="#fff"
          radius="100"
          v-model="searchText"
          :focus="true"
          :placeholder="hotWorld"
          clearButton="auto"
          cancelButton="always"
          @clear="clear"
          @cancel="cancel"
        />
      </view>
    </view>
    <view class="search-body" v-if="!associativeShow">
      <!-- 搜索历史 -->
      <view class="word-container" v-if=  "localSearchList.length">
        <view class="word-container_header">
          <text class="word-container_header-text">搜索历史</text>
          <i-icon
            v-if="!localSearchListDel"
            color="#999999"
            size="35rpx"
            name="delete-bin-line"
            @click="localSearchListDel = true"
          />
          <view
            v-if="localSearchListDel"
            class="flex-center flex-row"
            style="font-weight: 500; justify-content: space-between"
          >
            <text
              style="
                font-size: 22rpx;
                color: #666;
                padding-top: 4rpx;
                padding-bottom: 4rpx;
                padding-right: 20rpx;
              "
              @click="handleClearLocalSearchList"
              >全部删除</text
            >
            <text
              style="
                font-size: 22rpx;
                color: #c0402b;
                padding-top: 4rpx;
                padding-bottom: 4rpx;
                padding-left: 20rpx;
              "
              @click="localSearchListDel = false"
              >完成</text
            >
          </view>
        </view>

        <view class="word-container_body">
          <view
            class="flex-center flex-row word-container_body-text"
            v-for="(word, index) in localSearchList"
            :key="index"
            @click="handleClickLocalSearchItem(word, index)"
          >
            <text class="word-display" :key="word">{{ word }}</text>
            <i-icon
              v-if="localSearchListDel"
              color="#999999"
              size="35rpx"
              name="close-line"
            />
          </view>
        </view>
      </view>
      <!-- 搜索发现 -->
      <view class="word-container">
        <view class="word-container_header">
          <view class="flex-center flex-row">
            <text class="word-container_header-text">搜索发现</text>
            <i-icon
              name="loader-3-line"
              color="#999999"
              size="35rpx"
              style="margin-left: 10rpx"
              @click="getNetHotList(true)"
            ></i-icon>
          </view>
        </view>
        <view class="word-container_body">
          <template>
            <template>
              <text
                v-for="(word, index) in netHotList"
                class="word-container_body-text"
                :key="index"
                @click="handleClickLocalSearchItem(word.content)"
                >{{ word.content }}</text
              >
            </template>
          </template>
        </view>
      </view>
    </view>
    <!-- 搜索联想 -->
    <view class="search-associative" v-else>
      <view
        v-for="(item, index) in associativeList"
        :key="index"
        class="search-associative-item"
        @click="handleClickAssociative(item)"
      >
        <view class="area">前端</view>
        <text class="content">{{ item.title }}</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
const localSearchListKey = "__local_search_history"; //	本地历史存储字段名
// 公共方法
import { arrUnique, debounce } from "../../util/common";
// api
import {
  search,
  addSearchLog as addLog,
  getHotSearchWordList,
} from "../../api/search";
import { watch, ref, computed } from "vue";

export default {
  onReachBottom() {
    // 触底判断是否有关键词且是否能够进行下一页
    if (this.searchText) {
      if (
        this.associativeList.length <
        this.associativeConfig.page * this.associativeConfig.limit
      ) {
        uni.showToast({
          title: "再往下就没有啦~",
          icon: "none",
          position: "bottom",
        });
      } else {
        // ++页数并且进行调用搜索
        this.associativeConfig.page++;
        this.handleSearch({
          pagination: true
        });
      }
    }
  },
  setup() {
    const searchText = ref<string>("");
    // 默认热搜词, 如果没有输入即回车，则搜索热词，但是不会加入搜索记录
    const hotWorld = ref<string>("请搜索你感兴趣的内容");
    // 关联结果分页配置项
    const associativeConfig = ref<{
      limit: number;
      page: number;
    }>({
      limit: 20,
      page: 1,
    });
    const associativeList = ref<Array<any>>([]);
    // 搜索发现（热搜数组）
    const netHotList = ref<Array<any>>([]);
    const getNetHotList = async (initiative: boolean = false) => {
      // 如果是主动调用，则显示加载框
      if (initiative) {
        uni.showLoading({
          title: "获取最新热搜中...",
          mask: true,
        });
      }
      const wordResult = await getHotSearchWordList();
      uni.hideLoading();
      if (wordResult.success) {
        netHotList.value = wordResult.data;
        if (netHotList.value.length === 0 && initiative) {
          uni.showToast({
            title: "暂无热搜oh，请稍等再试试吧～",
            icon: "none",
          });
        }
      }
    };
    getNetHotList(); // 获取热搜词
    // 本地搜索记录
    const localSearchList = ref<Array<any>>(
      uni.getStorageSync(localSearchListKey)
    );
    const localSearchListDel = ref<boolean>(false);
    // 是否显示词法关联结果内容
    const associativeShow = computed(() => {
      return searchText.value && associativeList.value.length;
    });
    watch(
      searchText,
      debounce(async () => {
        // 每次关键词的变化，页数都设置为1
        associativeConfig.value.page = 1;
        if (searchText.value) {
          await handleSearch({
            key: searchText.value,
          });
        } else {
          associativeList.value = [];
          getApp().globalData.searchText = "";
        }
      }, 300)
    );
    // 搜索核心函数
    const handleSearch = async (params?: {
      key?: string;
      pagination?: boolean;
    }) => {
      const res = await search({
        searchText: params?.key || searchText.value,
        limit: associativeConfig.value.limit,
        page: associativeConfig.value.page,
      });
      uni.hideLoading();
      if (res.success) {
        associativeList.value = params?.pagination
          ? associativeList.value.concat(res.data)
          : res.data;
      }
    };

    // 清空搜索
    const clear = () => {
      searchText.value = "";
    };
    // 取消搜索
    const cancel = () => {
      uni.hideKeyboard();
      getApp().globalData.searchText = searchText.value;
      searchText.value = "";
      uni.navigateBack({
        delta: 1,
      });
    };
    // 获取DeviceID
    const getDeviceId = () => {
      return new Promise((resolve, reject) => {
        const uniId = uni.getStorageSync("uni_id");
        // 如果未登陆
        if (!uniId) {
          resolve({
            id:
              uni.getSystemInfoSync().system +
              "_" +
              Math.random().toString(36).substr(2),
            isDeviceID: true,
          });
        } else {
          // 登陆返回uniID
          resolve({
            id: uniId,
            isDeviceID: false,
          });
        }
      });
    };
    // 添加搜索记录
    const addSearchLog = (value: string) => {
      // 在此处存搜索记录，如果登录则需要存 user_id，若未登录则存device_id
      getDeviceId().then(async ({ id, isDeviceID }) => {
        await addLog({
          content: value,
          [isDeviceID ? "device_id" : "user_id"]: id,
        });
      });
    };
    // 处理本地搜索记录的函数
    const localSearchListManage = (word: string) => {
      let list = uni.getStorageSync(localSearchListKey);
      if (list.length) {
        //
        localSearchList.value.unshift(word);
        // 去重复
        arrUnique(localSearchList.value);
        if (localSearchList.value.length > 10) {
          localSearchList.value.pop();
        }
      } else {
        // 第一次就设置一个默认值
        localSearchList.value = [word];
      }
      // 存储
      uni.setStorageSync(localSearchListKey, localSearchList.value);
    };
    // 点击联想结果
    const handleClickAssociative = (item: any) => {
      // 将此关键词纳入库
      addSearchLog(searchText.value);
      // 处理本地搜索记录
      localSearchListManage(searchText.value);
      // 跳转页面到具体页面
      uni.navigateTo({
        url: `/pages/question/questionDetail?id=${item._id}`,
      });
    };
    // 删除某一个搜索历史
    const handleDeleteLocalSearchListItem = (index: number) => {
      // 本地数组删除
      localSearchList.value.splice(index, 1);
      // 本地缓存重新赋值
      uni.setStorageSync(localSearchListKey, localSearchList.value);
      // 如果本地搜索数组为空，则就取消编辑状态
      if (localSearchList.value.length === 0) {
        localSearchListDel.value = false;
      }
    };
    // 点击本地的搜索历史item项
    const handleClickLocalSearchItem = (word: string, index: number) => {
      // 判断是否是可编辑状态，如果是编辑状态，则就删除
      if (localSearchListDel.value) {
        handleDeleteLocalSearchListItem(index);
      } else {
        // 给搜索框赋值
        searchText.value = word;
      }
    };
    // 清空本地搜索结果
    const handleClearLocalSearchList = () => {
      uni.showModal({
        content: "确认清空搜索历史吗？",
        confirmText: "删除",
        confirmColor: "red",
        cancelColor: "#808080",
        success: (res) => {
          if (res.confirm) {
            localSearchListDel.value = false;
            localSearchList.value = [];
            uni.removeStorageSync(localSearchListKey);
          }
        },
      });
    };

    return {
      associativeList,
      netHotList,
      localSearchList,
      associativeShow,
      associativeConfig,
      hotWorld,
      searchText,
      localSearchListDel,
      handleSearch,
      clear,
      cancel,
      getNetHotList,
      handleClickAssociative,
      handleClickLocalSearchItem,
      handleClearLocalSearchList,
      handleDeleteLocalSearchListItem,
    };
  },
  created() {
    // uni.onKeyboardHeightChange((res) => {
    //   this.keyBoardPopup = res.height !== 0;
    // });
    // this.searchText = getApp().globalData.searchText;
  },
};
</script>

<style>
page {
  /* #ifndef APP-NVUE */
  height: 100%;
  /* #endif */
  flex: 1;
}
</style>

<style lang="scss" scoped>
@import "../../util/common.scss";

$search-bar-height: 52px;
$word-container_header-height: 72rpx;

.container {
  /* #ifndef APP-NVUE */
  height: 100%;
  /* #endif */
  flex: 1;
  background-color: #f7f7f7;
}

.search-body {
  background-color: #fff;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}

@mixin uni-flex {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
}

@mixin words-display {
  font-size: 26rpx;
  color: #666;
}

.flex-center {
  @include uni-flex;
  justify-content: center;
  align-items: center;
}

.flex-row {
  @include uni-flex;
  flex-direction: row;
}

.uni-searchbar {
  padding-left: 0;
}

.uni-searchbar__box {
  border-width: 0;
}
.uni-input-placeholder {
  font-size: 28rpx;
}

.search-container {
  height: $search-bar-height;
  @include uni-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: #fff;

  @at-root {
    #{&}-bar {
      @include uni-flex;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      background: #fff;
    }
  }
}

.search-associative {
  // position: absolute;
  // top: $search-bar-height;
  // left: 0;
  // right: 0;
  // bottom: 0;
  background-color: #fff;
  margin-top: 10rpx;
  padding-left: 10rpx;
  padding-right: 10rpx;
  .search-associative-item {
    width: 690rpx;
    margin: 0 auto;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    font-size: 28rpx;
    padding: 15rpx 0;
    border-bottom: 2rpx solid #f6f6f6;
    &:not(:first-child) {
      margin-top: 20rpx;
    }
    .area {
      color: #fff;
      font-size: 24rpx;
      background: linear-gradient(270deg, #ffd398 0%, #ffa85f 100%);
      border-radius: 2px;
      padding: 2rpx 16rpx;
    }
    .content {
      width: 550rpx;
      margin-left: 20rpx;
      @include text-ellipsis(2);
    }
  }
}

.search-icons {
  padding: 16rpx;
}

.word-display {
  @include words-display;
}

.word-container {
  padding: 20rpx;

  @at-root {
    #{&}_header {
      @include uni-flex;
      height: $word-container_header-height;
      line-height: $word-container_header-height;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      @at-root {
        #{&}-text {
          color: #3e3e3e;
          font-size: 30rpx;
          font-weight: bold;
        }
      }
    }

    #{&}_body {
      @include uni-flex;
      flex-wrap: wrap;
      flex-direction: row;

      @at-root {
        #{&}-text {
          @include uni-flex;
          @include words-display;
          justify-content: center;
          align-items: center;
          background-color: #f6f6f6;
          padding: 10rpx 20rpx;
          margin: 20rpx 30rpx 0 0;
          border-radius: 30rpx;
          /* #ifndef APP-NVUE */
          box-sizing: border-box;
          /* #endif */
          text-align: center;
        }

        #{&}-info {
          /* #ifndef APP-NVUE */
          display: block;
          /* #endif */
          flex: 1;
          text-align: center;
          font-size: 26rpx;
          color: #808080;
          margin-top: 20rpx;
        }
      }
    }
  }
}
</style>
