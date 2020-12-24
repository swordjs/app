<template>
	<view class="userBox">
		<view class="top">
			<!-- 顶部的bar -->
			<view class="navigationBar">
				<image class="back" src="../../static/common/back.png" />
				<view class="title">我的</view>
			</view>
			<!-- 头像和昵称 -->
			<view class="user">
				<image class="headPicture" src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1441836571,2166773131&fm=26&gp=0.jpg"
				 mode="scaleToFill"></image>
				<view class="info">
					<view class="nickname">前端剑指题解<image class="auth" src="../../static/user/auth.png" mode=""></image>
					</view>
					<view class="sign">个性签名：每日一练，finghting！</view>
				</view>
			</view>
			<!-- 卡片 -->
			<view class="card">
				<!-- 粉丝数(k) -->
				<view class="fans">87K</view>
				<view class="fansTip">粉丝数奇高，大佬跑不掉了～</view>
				<!-- 详细信息 -->
				<view class="bottom">
					<view class="item left">出过<text>2.4k</text>道题目</view>
					<view class="item right">解答<text>100</text>次题解</view>
				</view>
				<!-- 被采纳 -->
				<view class="adopt">
					被采纳过1.3k次
				</view>
			</view>
		</view>
		<view class="tab">
			<Tabs :lineScale="0.3" lineColor="#526EE7" lineRadius="4rpx" activeColor="#526EE7" :bold="false"
			 :scroll="false" v-model="tabCurrent" :tabs="tabs"></Tabs>
		</view>
		<!-- 以下是swiper -->
		<view class="questionSwiper">
			<swiper :current="tabCurrent" @change="handleSwiperChange" :style="{height: swiperHeight + 'px'}">
				<swiper-item>
					1
				</swiper-item>
				<swiper-item>
					2
				</swiper-item>
				<swiper-item>
					3
				</swiper-item>
				<swiper-item>
					4
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import {
		ref
	} from "vue";
	import Tabs from "../../components/v-tabs/v-tabs.vue"
	export default {
		setup() {
			// 计算屏幕高度 - tab的高度 - 导航栏的高度 = swiper高度
			const swiperHeight = uni.getSystemInfoSync().screenHeight - 38;
			const tabCurrent = ref(0);
			const tabs = ref(['已发布', '已解答', '我的收藏', '我的浏览']);
			const handleSwiperChange = (e) => {
				tabCurrent.value = e.detail.current;
			}
			return {
				tabCurrent,
				tabs,
				swiperHeight,
				handleSwiperChange
			}
		},
		components: {
			Tabs
		}
	}
</script>

<style lang="scss" scoped>
	.userBox {
		.top {
			display: inline-block;
			position: relative;
			width: 100%;
			height: 474rpx;
			background: url(../../static/user/userBackground.png) no-repeat center / 100%;

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
					right: 50%;
					transform: translateY(-50%);
					width: 14rpx;
					height: 26rpx;
				}

				.title {
					font-size: 36rpx;
					color: #fff;
				}
			}

			.user {
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
						color: #E7ECFD;
						opacity: .7;
					}
				}
			}

			.card {
				position: absolute;
				bottom: -97rpx;
				left: 50%;
				transform: translateX(-50%);
				width: 690rpx;
				height: 252rpx;
				background: url(../../static/user/card.png) no-repeat center / 100%;
				box-shadow: 0px 3px 10px 0px rgba(101, 118, 181, 0.16);

				.fans {
					font-size: 60rpx;
					color: #384AF6;
					margin-top: 24rpx;
					text-align: center;
					font-weight: bold;
				}

				.fansTip {
					font-size: 24rpx;
					text-align: center;
					color: #7E84C0;
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
						color: #6573FF;

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
					background: linear-gradient(270deg, #6AB7FD 0%, #676BF6 100%);
					border-radius: 100px 0px 0px 100px;
					font-size: 20rpx;
					color: #E4F1FD;
				}
			}
		}

		.tab {
			margin-top: 112rpx;
		}
	}
</style>
