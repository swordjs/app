<template>
	<view class="questionListBox">
		<swiper @change="handleQuestionChange" next-margin="940rpx" vertical :style="{height: scrollHeight + 'px'}">
			<swiper-item>
				<view class="item">
					<!-- 背景卡片 -->
					<view class="topCard write">
						<!-- 标题 -->
						<view class="title">
							用递归算法实现，数组长度为5且元素的随机数在2-32间不重复的值
						</view>
						<!-- 个人信息 -->
						<view class="user">
							<image src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1441836571,2166773131&fm=26&gp=0.jpg"
							 class="headPicture" mode=""></image>
							<view class="uerContent">
								<view class="nickName">前端知识3+1</view>
								<view class="authentication">官方认证出题人</view>
							</view>
							<view class="follow">关注</view>
						</view>
					</view>
					<!-- 详情 -->
					<view class="detail">
						<view class="title">
							问题描述<image class="quote" src="../../static/question/quote.png" mode=""></image>
						</view>
						<view class="content">
							这是一道大题目，把考点拆成了4个小项；需要侯选人用递归算法实现（限制15行代码以内实现；限制时间10分钟内完成）归算法实现…
						</view>
						<!-- 链接 -->
						<view class="link">看看其他小伙伴怎么做的吧 ></view>
					</view>
					<!-- 开始 -->
					<view class="start">Start</view>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="item">
					<!-- 背景卡片 -->
					<view class="topCard book">
						<!-- 标题 -->
						<view class="title">
							用递归算法实现，数组长度为5且元素的随机数在2-32间不重复的值
						</view>
						<!-- 个人信息 -->
						<view class="user">
							<image src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1441836571,2166773131&fm=26&gp=0.jpg"
							 class="headPicture" mode=""></image>
							<view class="uerContent">
								<view class="nickName">前端知识3+1</view>
								<view class="authentication">官方认证出题人</view>
							</view>
							<view class="follow">关注</view>
						</view>
					</view>
					<!-- 详情 -->
					<view class="detail">
						<view class="title">
							问题描述<image class="quote" src="../../static/question/quote.png" mode=""></image>
						</view>
						<view class="content">
							这是一道大题目，把考点拆成了4个小项；需要侯选人用递归算法实现（限制15行代码以内实现；限制时间10分钟内完成）归算法实现…
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

<script>
	export default {
		setup() {
			const scrollHeight = uni.getSystemInfoSync().screenHeight;
			uni.setNavigationBarTitle({
				title: '前端题解'
			});

			function handleQuestionChange(e) {
				console.log(e)
			}
			return {
				scrollHeight,
				handleQuestionChange
			}
		}
	}
</script>

<style>
	page {
		background-color: #F6F7F9;
	}
</style>

<style lang="scss" scoped>
	@mixin text-ellipsis ($line) {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: $line;
		-webkit-box-orient: vertical;
	}

	@mixin text-ellipsis-one () {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

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
					background: url(../../static/question/questionWriteBackrgound.png) no-repeat center / 100%;
				}

				&.book {
					background: url(../../static/question/questionBookBackrgound.png) no-repeat center / 100%;
				}


				.title {
					width: 616rpx;
					height: 100rpx;
					margin: 40rpx auto 36rpx auto;
					color: #2B2B66;
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
							color: #5454A1;
						}

						.authentication {
							font-size: 20rpx;
							color: #FFAC61;
						}
					}

					.follow {
						width: 88rpx;
						line-height: 40rpx;
						text-align: center;
						background: linear-gradient(180deg, #6E8CF6 0%, #412BFF 100%);
						border-radius: 22rpx;
						font-size: 24rpx;
						color: #fff;
						margin-left: 24rpx;

						&:active {
							opacity: .8;
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
					color: #446EEA;

					.quote {
						width: 34rpx;
						height: 24rpx;
						margin-left: 10rpx;
					}
				}

				.content {
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
					color: #A8C0FE;
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
				background: linear-gradient(270deg, #FFD781 0%, #FFA75E 100%);
				box-shadow: 0px 4px 8px 0px rgba(172, 121, 71, 0.25);
				border-radius: 46rpx;
				color: #fff;
				font-size: 32rpx;

				&:active {
					opacity: .8;
				}

			}

			&:first-child {
				margin-top: 20rpx;
			}
		}
	}
</style>
