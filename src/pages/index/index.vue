<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view>
			<text class="title">{{title}}</text>
			<button @click="handelTestSubmit">Test</button>
			<button @click="handleUpload">上传</button>
		</view>
	</view>
</template>

<script lang="ts">
	import {
		getTestList
	} from "../../api/test"
	export default {
		setup() {
			// 通过前端client查询数据
			getTestList();

			function handelTestSubmit() {
				// 执行云函数
				uniCloud.callFunction({
					name: "application",
					data: {
						"route": "api/user",
						"method": "PUT"
					}
				});
			}

			function handleUpload() {
				uni.chooseImage({
					count: 1,
					success(res) {
						console.log(res);
						if (res.tempFilePaths.length > 0) {
							let filePath = res.tempFilePaths[0]
							uniCloud.uploadFile({
								filePath: filePath,
								cloudPath: 'a.jpg',
								success(r){
									console.log(r)
								}
							});
						}
					}
				});
			}
			return {
				handelTestSubmit,
				handleUpload
			}
		}
	}
</script>

<style>
	.content {
		text-align: center;
		height: 400upx;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
</style>
