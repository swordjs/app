<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view>
			<text class="title">{{title}}</text>
			<button @click="handelTestSubmit">Test</button>
		</view>
	</view>
</template>

<script lang="ts">
	import { getTestList } from "../../api/test"
	export default {
		setup() {
			// 通过前端client查询数据
			getTestList();
			function handelTestSubmit(){
				console.log("test");
				// 执行云函数
				uniCloud.callFunction({
					name: "testPrint",
					data: {
						"test": "interface"
					}
				});
			}
			return {
				handelTestSubmit
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
