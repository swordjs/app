<template>
	<view class="writeBox">
		<view class="card">
			<view class="vertical"></view>
			<view class="content">
				用递归算法实现，数组长度为5且元素的随机数在2-32间不重复的值间不重复的值
			</view>
		</view>
		<view class="editor">
			<!-- 撰写答案 -->
			<editor placeholder="请写下你对于这个题的见解…"></editor>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		}
	}
</script>

<style>
	page {
		background-color: #F6F7F9;
	}
</style>
<style lang="scss">
	.card {
		position: relative;
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		width: 650rpx;
		margin: 0 auto;
		padding: 20rpx;
		background-color: #fff;
		font-size: 30rpx;
		margin-top: 24rpx;
		border-radius: 8px;
		.vertical{
			position: absolute;
			top: 36rpx;
			left: 20rpx;
			width: 8rpx;
			height: 24rpx;
			background: linear-gradient(180deg, #91ABF6 0%, #5873E9 100%);
			border-radius: 1px;
		}
		.content{
			font-weight: bold;
			max-width: 632rpx;
			line-height: 50rpx;
			margin-left: 20rpx;
		}
	}
	.editor{
		width: 650rpx;
		height: 788rpx;
		margin: 0 auto;
		padding: 20rpx;
		background-color: #fff;
		margin-top: 20rpx;
		editor{
			height: 100%;
			font-size: 24rpx;
			font-style: normal;
		}
	}
</style>
