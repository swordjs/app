<template>
	<text @click.stop="handleClick" class="i-icon" :style="{ color, fontSize: size }">
		{{icon[name]}}
	</text>
</template>
<script>
	import icon from "./js/icon.js"
	// #ifdef APP-NVUE
	var domModule = weex.requireModule("dom");
	// 这里的CDN和css中的CDN一致
	domModule.addRule('fontFace', {
		'fontFamily': 'remixicon',
		src: "url('https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.ttf?t=1590207869815')"
	});
	// #endif
	export default {
		props: {
			name: {
				type: String,
				default: "",
			},
			color: {
				type: String,
				default: "black",
			},
			size: {
				type: String,
				default: "40rpx",
			},
		},
		data() {
			return {
				icon
			}
		},
		methods: {
			handleClick() {
				this.$emit("click")
			}
		}
	};
</script>
<style scoped>
	/* #ifndef APP-NVUE */
	@font-face {
		font-family: remixicon;
		src: url('https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.ttf?t=1590207869815') format('truetype');
	}

	/* #endif */
	.i-icon {
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: remixicon !important;
		text-decoration: none;
	}
</style>
