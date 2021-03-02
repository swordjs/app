<template>
	<button :disabled="disabled" @click="click" :class="[
      customClass,
      'i-button',
      `i-button--${type}`,
      `i-button--${size}`,
      `${plain ? 'i-button--plain' : ''}`,
      `${round ? 'i-button--round' : ''}`,
	  `${shadow ? 'i-button--shadow' : ''}`,
      `${square ? 'i-button--square' : ''}`,
      `${disabled ? 'i-button--disabled' : ''}`,
      `${block ? 'i-button--block' : ''}`
    ]"
	 :style="customStyle">
		<slot class="title" />
	</button>
</template>

<script>
	import {
		defineComponent
	} from "vue";
	export default defineComponent({
		props: {
			type: {
				type: String,
				default: "primary",
			},
			customClass: {
				type: String,
				default: "",
			},
			customStyle: {
				type: String,
				default: "",
			},
			plain: {
				type: Boolean,
				default: false,
			},
			size: {
				type: String,
				default: "normal",
			},
			round: {
				type: Boolean,
				default: false,
			},
			square: {
				type: Boolean,
				default: false,
			},
			disabled: {
				type: Boolean,
				default: false,
			},
			block: {
				type: Boolean,
				default: false,
			},
			hairline: {
				type: Boolean,
				default: false,
			},
			shadow: {
				type: Boolean,
				default: true
			}
		},
		setup(props, {
			emit
		}) {
			const click = () => {
				emit("click");
			};
			return {
				click,
			};
		},
	});
</script>

<style lang="scss" scoped>
	@import "@/components/i-uniapp/css/style.components.scss";

	button {
		padding-left: 0;
		padding-right: 0;
		margin-left: 0;
		margin-right: 0;
	}

	.i-button {
		position: relative;
		display: inline-block;
		box-sizing: border-box;
		line-height: 88rpx;
		border-radius: 4rpx;
		border-width: 2rpx;
		border-style: solid;
		color: #fff;
		text-align: center;
		cursor: pointer;
		font-size: 32rpx;

		&:active {
			opacity: 0.8;
		}

		&--default {
			color: $i-content--color;
			background-color: #fff;
			border-color: #c0c4cc;
		}

		// button主题色
		&--primary {
			background-color: $i-type--primary;
			border-color: $i-type--primary;
		}

		&--success {
			background-color: $i-type--success;
			border-color: $i-type--success;
		}


		&--error {
			background-color: $i-type--danger;
			border-color: $i-type--danger;
		}

		&--warnning {
			background-color: $i-type--warning;
			border-color: $i-type--danger;
		}

		// -尺寸
		&--normal {
			display: inline-block !important;
			padding: 0 30rpx;
			font-size: 28rpx;
		}

		// 大号按钮
		&--large {
			width: 100%;
			line-height: 100rpx;
		}

		// 小号
		&--small {
			display: inline-block !important;
			line-height: 64rpx;
			padding: 0 16rpx;
			font-size: 24rpx;
		}

		&--mini {
			display: inline-block !important;
			line-height: 48rpx;
			padding: 0 8rpx;
			font-size: 20rpx;
		}

		// 是否为朴素按钮
		&--plain {
			background-color: transparent;
			box-shadow: none;

			// 朴素按钮下字体颜色变换
			&.i-button--primary {
				color: $i-type--primary;
				border-color: $i-type--primary;
			}

			&.i-button--success {
				color: $i-type--success;
				border-color: $i-type--success;
			}

			&.i-button--error {
				color: $i-type--danger;
				border-color: $i-type--danger;
			}

			&.i-button--warnning {
				color: $i-type--warning;
				border-color: $i-type--warning;
			}

			&.i-button--default {
				// 朴素按钮下的类型默认情况，不用设置具体的border-color，因为默认按钮有具体颜色
				color: $i-content--color;
			}
		}

		// 圆角&方形按钮
		&--round {
			border-radius: 48rpx;
		}

		&--square {
			border-radius: 0;
		}

		// 按钮禁用状态
		&--disabled {
			cursor: not-allowed;
			border: none;
		}

		// 块级元素
		&--block {
			display: block;
		}

		&--shadow {
			box-shadow: 0px 4px 8px 0px rgba(36, 63, 101, 0.2);
		}

		// 是否显示0.5px的边框
		&--hairline {
			border-width: 1rpx;
		}
	}
</style>
