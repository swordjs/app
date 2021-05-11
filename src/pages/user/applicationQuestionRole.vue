<template>
	<view class="questionBox">
		<view class="form">
			<i-form>
				<i-field required :label="`反馈${platform}号`">
					<i-input placeholder="请填写" v-model="form.contactDetails"></i-input>
				</i-field>
				<i-field required label="擅长领域">
					<i-input placeholder="前端/后端/算法/编译原理" v-model="form.filed"></i-input>
				</i-field>
				<i-field label="您的身份">
					<i-input placeholder="开发者/创业者/学生" v-model="form.identity"></i-input>
				</i-field>
				<i-field label="社交主页地址">
					<i-input placeholder="Github/知乎/掘金/博客" v-model="form.socialHomepage"></i-input>
				</i-field>
			</i-form>
			<view class="submit" @click="handleSubmit">
				<i-button size="large" round>确定提交</i-button>
			</view>
		</view>
	</view>
</template>
<script lang='ts'>
	import {
		defineComponent,
		reactive,
		ref
	} from "vue";
	import notLogin from "../../util/notLogin";
	// api
	import {
		addCertificationApplyOrder
	} from "../../api/certificationApplyOrder";
	export default defineComponent({
		onShareAppMessage() {
			return {
				imageUrl: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c7e81452-9d28-4486-bedc-5dbf7c8386a5/d9120b07-0203-4b86-93ba-72fdcd2df843.png",
				title: `快来和我一起成为剑指题解官方出题官，一起向计算机行业输送优质的题目吧！`,
			};
		},
		setup() {
			// 表单Form
			const form = reactive({
				contactDetails: "",
				filed: "",
				identity: "",
				socialHomepage: "",
			});
			let platform = ref < string > ("");
			// #ifdef MP-QQ
			platform.value = "qq";
			// #endif
			// #ifdef MP-WEIXIN
			platform.value = "微信"
			// #endif
			// 提交申请
			const handleSubmit = () => {
				// 判断是否登录
				notLogin(async () => {
					// 校验参数是否填写
					if (form.contactDetails === "" || form.filed === "") {
						uni.showToast({
							title: "您的反馈信息或者擅长领域未填写",
							icon: "none",
						});
					} else {
						uni.showLoading({
							title: "申请中...",
							mask: true,
						});
						const postResult = await addCertificationApplyOrder({
							content: {
								contactDetails: form.contactDetails,
								filed: form.filed,
								identity: form.identity,
								socialHomepage: form.socialHomepage,
							},
						});
						uni.hideLoading();
						if (postResult.success) {
							uni.showModal({
								title: "提示",
								content: "您的申请已经提交成功，请耐心等待审核。请关注剑指题解公众号或者加入交流群获取快速审核通道~",
								showCancel: false,
								confirmText: "好的",
								success: (res: {
									confirm: boolean
								}) => {
									if (res.confirm) {
										uni.redirectTo({
											url: "/pages/index/index",
										});
									}
								},
							});
						}
					}
				});
			};
			return {
				platform,
				form,
				handleSubmit,
			};
		},
	});
</script>
<style>
	page {
		background: #f6f7f9;
	}
</style>
<style lang="scss" scoped>
	.submit {
		width: 690rpx;
		margin: 60rpx auto;
	}
</style>
