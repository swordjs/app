<template>
	<view class="loginBox">
		<button open-type="getUserInfo" @getuserinfo="handleUserInfo" style="margin-top: 100px;" withCredentials>获取用户信息</button>
	</view>
</template>

<script>
	import {
		defineComponent
	} from "vue";
	export default defineComponent({
		setup() {
			const handleUserInfo = () => {
				uni.getUserInfo({
					success: ({userInfo}) => {
						uni.login({
							provider: 'weixin',
							success(res) {
								uniCloud.callFunction({
									name: "application",
									data: {
										route: `api/user/loginByWechat/${res.code}`,
										method: "POST",
										params: {
											gender: userInfo.gender,
											avatar: userInfo.avatarUrl,
											nickname: userInfo.nickName
										}
									}
								});
							},
							fail(err) {
								uni.showToast({
									title: "微信登录失败",
									icon: "none"
								})
							}
						})
					},
					fail: () => {
						console.log("未授权");
					}
				})
			}
			return {
				handleUserInfo
			};
		},
	});
</script>

<style lang="scss" scoped>
</style>
