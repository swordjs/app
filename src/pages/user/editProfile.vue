<template>
  <view class="profile">
    <view class="form">
      <i-form>
        <i-field label="头像">
          <image
            :src="form.avatar"
            class="avatar"
            mode="scaleToFill"
          ></image>
        </i-field>
        <i-field label="昵称">
          <i-input
            type="text"
            v-model="form.nickname"
            placeholder="请输入昵称"
          ></i-input>
        </i-field>
        <i-field label="签名">
          <i-input
            type="text"
            v-model="form.sign"
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

    <view class="save" @click="handleSubmit">确定</view>
  </view>
</template>

<script lang="ts">
import { ref, computed } from "vue";
// api
import { getUserBaseContentByUserID, updateUserProfile } from "../../api/user";
import {
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
    const form = ref<ProfileForm>({
      gender: -1,
      sign: "",
      nickname: "",
      avatar: "",
    });
    const showPicker = ref(false);
    const handleSexChange = (e) => {
      form.value.gender = Number(e.target.value);
    };
    const userID = uni.getStorageSync("uni_id") as string;
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
      console.log(form.value)
      // 指定一个检查字典，字典循环完就代表检查完毕
      const checkList = {
        昵称: form.value.nickname,
        签名: form.value.sign,
      };
      for (let key in checkList) {
        const result = await checkContentSecurity({
          content: checkList[key],
        });
        console.log(result)
        if (result.success && result.data.errCode !== 0) {
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
            sign: form.value.sign,
            avatar: form.value.avatar,
            gender: form.value.gender,
            nickname: form.value.nickname,
          });
          if (updateData.success) {
            uni.hideLoading();
            uni.setStorageSync("userInfo", {
              avatarUrl: form.value.avatar,
              nickName: form.value.nickname,
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
    return {
      showPicker,
      form,
      handleSubmit,
      handleSexChange,
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
    position: relative;
    width: 690rpx;
    background-color: #fff;
    margin: 16rpx auto;
    border-radius: 8px;

    .avatar {
      position: absolute;
      width: 80rpx;
      height: 80rpx;
      right: 25rpx;
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
