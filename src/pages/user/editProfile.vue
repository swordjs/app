<template>
  <view class="profile">
    <view class="form">
      <i-form>
        <i-field label="头像">
          <image
            @click="handleUploadAvatar"
            :src="form.avatar"
            class="avatar"
            mode="scaleToFill"
          ></image>
          <i-icon
            @click="handleUploadAvatar"
            name="arrow-drop-right-line"
          ></i-icon>
        </i-field>
        <i-field label="昵称">
          <i-input
            type="text"
            :value="form.nickname"
            placeholder="请输入昵称"
          ></i-input>
        </i-field>
        <i-field label="签名">
          <i-input
            type="text"
            :value="form.sign"
            placeholder="请输入签名"
          ></i-input>
        </i-field>
        <i-field label="性别">
          <radio-group @change="handleSexChange">
            <radio :value="1" :checked="form.gender === 1">男</radio>
            <radio :value="2" :checked="form.gender === 2">女</radio>
          </radio-group>
        </i-field>
      </i-form>
    </view>
    <kpsImageCutter
      @ok="handleCutterOk"
      @cancel="handleCutterCancel"
      :url="imageCutterUrl"
      :fixed="true"
      :width="100"
      :height="100"
    ></kpsImageCutter>
    <view class="save" @click="handleSubmit">确定</view>
  </view>
</template>

<script lang="ts">
import { ref, reactive, computed } from "vue";
// api
import { getUserBaseContentByUserID, updateUserProfile } from "../../api/user";
import {
  uploadFileToCloudStorage,
  checkContentSecurity,
} from "../../api/common";
type ProfileForm = {
  gender: number,
  sign: string,
  nickname: string,
  avatar: string
}
export default {
  onLoad(){
    this.getUserProfile();
  },
  setup() {
    const imageCutterUrl = ref("http://tmp/koQnNmJQVm1d8632e4c3e52991392a713dbfbadb5fff.jpeg");
    const form = ref<ProfileForm>({
      gender: -1,
      sign: "",
      nickname: "",
      avatar: "",
    });
    const showPicker = ref(false);
    const handleUploadAvatar = () => {
      uni.showActionSheet({
        itemList: ["上传图片"],
        success: async ({ tapIndex }) => {
          switch (tapIndex) {
            case 0:
              uni.chooseImage({
                count: 1,
                success: async (e) => {
                  imageCutterUrl.value = e.tempFilePaths[0];
                  console.log(imageCutterUrl.value)
                },
              });
              break;
          }
        },
      });
    };
    const handleSexChange = (e) => {
      form.value.gender = Number(e.target.value);
    };
    const userID = uni.getStorageSync("uni_id");
    const getUserProfile = async () => {
      uni.showLoading({
        title: "获取资料中...",
      });
      const userInfo = await getUserBaseContentByUserID({
        userID,
      });
      uni.hideLoading();
      if (userInfo.success) {
        const {avatar,nickname,sign,gender} = userInfo.data[0];
        form.value = {
          avatar,
          nickname,
          sign,
          gender
        }
      }
    };
    const submitActive = computed(() => {
      return Object.values(form).filter((i) => i === "").length === 0;
    });
    // 检查昵称和签名中是否有违规字段
    const check = async () => {
      const toast = (label) => {
        uni.hideLoading();
        uni.showToast({
          title: `您的${label}含有违规词汇`,
          icon: "none",
        });
      };
      // 指定一个检查字典，字典循环完就代表检查完毕
      const checkList = {
        签名: form.sign,
        昵称: form.nickname,
      };
      for (let key in checkList) {
        const result = await checkContentSecurity({
          content: checkList[key],
        });
        if (result.success && !result.result) {
          toast(key);
          return false;
        }
      }
      return true;
    };
    const handleSubmit = async () => {
      if (submitActive.value) {
        uni.showLoading({
          title: "保存中...",
          mask: true,
        });
        // 检查敏感词汇
        if (await check()) {
          const updateData = await updateUserProfile({
            sign: form.sign,
            avatar: form.avatar,
            gender: form.gender,
            nickname: form.nickname,
          });
          if (updateData.success) {
            uni.hideLoading();
            uni.setStorageSync("userInfo", {
              avatarUrl: form.avatar,
              nickName: form.nickname,
            });
            uni.showModal({
              title: "提示",
              content: "保存成功",
              showCancel: false,
              confirmText: "好的",
              success: () => {
                uni.navigateBack({
                  delta: 1,
                });
              },
            });
          }
        }
      } else {
        uni.showToast({
          title: "您有空未填写",
          icon: "none",
        });
      }
    };
    const handleCutterCancel = () => {
      imageCutterUrl.value = "";
    };
    const handleCutterOk = () => {
      console.log(imageCutterUrl.value)
      uploadFileToCloudStorage({
        filePath: imageCutterUrl.value,
        cloudPath: "avatar",
      }).then((res) => {
        form.avatar = res.data.fileID;
        imageCutterUrl.value = "";
      });
    };
    return {
      imageCutterUrl,
      showPicker,
      form,
      handleSubmit,
      handleUploadAvatar,
      handleSexChange,
      handleCutterCancel,
      handleCutterOk,
      getUserProfile,
    };
  },
};
</script>

<style>
page {
  background-color: #f7f7f7;
}
</style>
<style lang="scss" scoped>
.profile {
  .form {
    width: 690rpx;
    background-color: #fff;
    margin: 16rpx auto;
    border-radius: 8px;

    .avatar {
      position: absolute;
      width: 80rpx;
      height: 80rpx;
      right: 88rpx;
      border-radius: 50%;
      overflow: hidden;
    }
    input {
      text-align: end;
      font-size: 28rpx;
    }

    radio-group {
      font-size: 28rpx;
      radio:last-child {
        margin-left: 58rpx;
      }
    }

    .value {
      margin-right: 25rpx;
      font-size: 28rpx;

      &.empty {
        color: #666666;
      }
    }
  }

  .save {
    position: absolute;
    bottom: 40rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 600rpx;
    line-height: 96rpx;
    background-color: #0069fa;
    box-shadow: 0px 4px 8px 0px rgba(36, 63, 101, 0.2);
    border-radius: 24px;
    color: #fff;
    font-size: 32rpx;
    text-align: center;
    &:active {
      opacity: 0.7;
    }
  }
}
</style>
