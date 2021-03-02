<template>
	<view class="i-mask" hover-stop-propagation  @tap="click" @touchmove.stop.prevent="() => {}" :class="{
		'i-mask-zoom': zoom,
		'i-mask-show': show
	}">
		<slot />
	</view>
</template>

<script>
	export default {
		name: "i-mask",
		props: {
			// 是否显示遮罩
			show: {
				type: Boolean,
				default: false
			},
			// 层级z-index
			zIndex: {
				type: [Number, String],
				default: ''
			},
			// 用户自定义样式
			customStyle: {
				type: Object,
				default () {
					return {}
				}
			},
			// 遮罩的动画样式， 是否使用使用zoom进行scale进行缩放
			zoom: {
				type: Boolean,
				default: true
			},
			// 遮罩的过渡时间，单位为ms
			duration: {
				type: [Number, String],
				default: 300
			},
			// 是否可以通过点击遮罩进行关闭
			maskClickAble: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				zoomStyle: {
					transform: ''
				},
				scale: 'scale(1.2, 1.2)'
			}
		},
		watch: {
			show(n) {
				if(n && this.zoom) {
					// 当展示遮罩的时候，设置scale为1，达到缩小(原来为1.2)的效果
					this.zoomStyle.transform = 'scale(1, 1)';
				} else if(!n && this.zoom) {
					// 当隐藏遮罩的时候，设置scale为1.2，达到放大(因为显示遮罩时已重置为1)的效果
					this.zoomStyle.transform = this.scale;
				}
			}
		},
		computed: {
			
		},
		methods: {
			click() {
				if (!this.maskClickAble) return;
				this.$emit('click');
			},
			maskStyle() {
				console.log(1)
				let style = {};
				style.backgroundColor = "rgba(0, 0, 0, 0.6)";
				if(this.show) style.zIndex = this.zIndex ? this.zIndex : 99999;
				else style.zIndex = -1;
				style.transition = `all ${this.duration / 1000}s ease-in-out`;
				// 判断用户传递的对象是否为空，不为空就进行合并
				if (Object.keys(this.customStyle).length) style = { 
					...style,
					...this.customStyle
				};
				console.log(style)
				return style;
			}
		}
	}
</script>

<style lang="scss" scoped>
 	
	.i-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
		width: 750rpx;
		height: 100vh;
		transition: transform 0.3s;
	}

	.i-mask-show {
		opacity: 1;
		background-color:rgba(0, 0, 0, 0.5) ;
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
		transition:all 0.2s ease-in-out
	}
	
	.i-mask-zoom {
		transform: scale(1.2, 1.2);
	}
</style>
