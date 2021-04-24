<template>
<view v-show="url" class="ksp-image-cutter">
	<canvas :style="{width: target.width + 'px', height: target.height + 'px'}" canvas-id="target"></canvas>
	<view class="body">
		<image v-if="url" class="image" @load="imageLoad" :style="{left: image.left + 'px', top: image.top + 'px', width: image.width + 'px', height: image.height + 'px'}" :src="url"></image>
		<view v-if="mask.show" class="mask"></view>
		<view @touchstart="touchStart($event, 'plank')" @touchmove="touchMove" @touchend="touchEnd" @touchcancel="touchCancel"  class="plank">
			<view class="frame" @touchstart="touchStart($event, 'frame')" @touchstart.stop.prevent="touchHandle" :style="{left: frame.left + 'px', top: frame.top + 'px', width: frame.width + 'px', height: frame.height + 'px'}">
				<canvas v-if="mask.show" class="canvas" :style="{width: frame.width + 'px', height: frame.height + 'px'}" canvas-id="canvas"></canvas>
				<view class="rect"></view>
				<view class="line-one"></view>
				<view class="line-two"></view>
				<view class="line-three"></view>
				<view class="line-four"></view>
				<view @touchstart="touchStart($event, 'left')" @touchstart.stop.prevent="touchHandle" class="frame-left"></view>
				<view @touchstart="touchStart($event, 'right')" @touchstart.stop.prevent="touchHandle" class="frame-right"></view>
				<view @touchstart="touchStart($event, 'top')" @touchstart.stop.prevent="touchHandle" class="frame-top"></view>
				<view @touchstart="touchStart($event, 'bottom')" @touchstart.stop.prevent="touchHandle" class="frame-bottom"></view>
				<view @touchstart="touchStart($event, 'left-top')" @touchstart.stop.prevent="touchHandle" class="frame-left-top"></view>
				<view @touchstart="touchStart($event, 'left-bottom')" @touchstart.stop.prevent="touchHandle" class="frame-left-bottom"></view>
				<view @touchstart="touchStart($event, 'right-top')" @touchstart.stop.prevent="touchHandle" class="frame-right-top"></view>
				<view @touchstart="touchStart($event, 'right-bottom')" @touchstart.stop.prevent="touchHandle" class="frame-right-bottom"></view>
			</view>
		</view>
	</view>
	<view class="toolbar">
		<button @tap="oncancle" class="btn-cancel">返回</button>
		<button @tap="onok" class="btn-ok">确定</button>
	</view>
</view>
</template>

<script>
export default {
	props: {
		url: {
			type: String,
			default: ""
		},
		fixed: {
			type: Boolean,
			default: false
		},
		width: {
			type: Number,
			default: 200
		},
		height: {
			type: Number,
			default: 200
		},
		maxWidth: {
			type: Number,
			default: 1024
		},
		maxHeight: {
			type: Number,
			default: 1024
		},
		blob: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			mask: {
				show: false
			},
			frame: {
				left: 50,
				top: 50,
				width: this.width,
				height: this.height
			},
			image: {
				left: 20,
				top: 20,
				width: 300,
				height: 400
			},
			real: {
				width: 100,
				height: 100
			},
			target: {
				width: this.width,
				height: this.height
			},
			touches: [],
			type: "",
			start: {
				frame: {
					left: 0,
					top: 0,
					width: 0,
					height: 0
				},
				image: {
					left: 0,
					top: 0,
					width: 0,
					height: 0
				},
			},
			timeoutId: -1,
			context: null
		};
	},
	mounted() {
		//#ifdef H5
		this.$el.addEventListener("touchmove", (ev) => {
			ev.preventDefault();
		});
		// #endif
		this.context = uni.createCanvasContext("canvas", this);
		this.targetContext = uni.createCanvasContext("target", this);
	},
	methods: {
		imageLoad(ev) {
			this.mask.show = true;
			this.real.width = ev.detail.width;
			this.real.height = ev.detail.height;
			this.image.width = ev.detail.width;
			this.image.height = ev.detail.height;
			this.frame.width = this.width;
			this.frame.height = this.height;
			if (!this.fixed) {
				this.frame.width = this.image.width;
				this.frame.height = this.image.height;
			}
			var query = uni.createSelectorQuery().in(this);
			query.select(".body").boundingClientRect((data) => {
				var bw = data.width;
				var bh = data.height;
				var fw = this.frame.width;
				var fh = this.frame.height;
				var tw = bw * 0.8;
				var th = bh * 0.8;
				var sx = tw / fw;
				var sy = th / fh;
				var scale = sx;
				if (sx < sy) {
					scale = sy;
				}
				tw = fw * scale;
				th = fh * scale;
				var tx = (bw - tw) / 2;
				var ty = (bh - th) / 2;
				this.frame.width = tw;
				this.frame.height = th;
				this.frame.left = tx;
				this.frame.top = ty;
				
				var iw = this.image.width;
				var ih = this.image.height;
				sx = tw / iw;
				sy = th / ih;
				scale = sx;
				if (sx < sy) {
					scale = sy;
				}
				this.image.width = iw * scale;
				this.image.height = ih * scale;
				this.image.left = (bw - this.image.width) / 2;
				this.image.top = (bh - this.image.height) / 2;
				setTimeout(() => {
					this.trimImage();
				}, 100);
			}).exec();
		},
		touchHandle() {},
		touchStart(ev, type) {
			this.stopTime();
			this.mask.show = false;
			if (this.touches.length == 0) {
				this.type = type;
				this.start.frame.left = this.frame.left;
				this.start.frame.top = this.frame.top;
				this.start.frame.width = this.frame.width;
				this.start.frame.height = this.frame.height;
				this.start.image.left = this.image.left;
				this.start.image.top = this.image.top;
				this.start.image.width = this.image.width;
				this.start.image.height = this.image.height;
			}
			var touches = ev.changedTouches;
			for(var i = 0; i < touches.length; i++) {
				var touch = touches[i];
				// this.touches[touch.identifier] = touch;
				this.touches.push(touch);
			}
		},
		touchMove(ev) {
			this.stopTime();
			ev.preventDefault();
			var touches = ev.touches;
			if (this.touches.length == 1) {
				if (this.type == "plank" || this.type == "frame" || this.fixed) {
					this.moveImage(this.touches[0], touches[0]);
				} else {
					this.scaleFrame(this.touches[0], touches[0], this.type);
				}
			} else if (this.touches.length == 2 && touches.length == 2) {
				var ta = this.touches[0];
				var tb = this.touches[1];
				var tc = touches[0];
				var td = touches[1];
				if (ta.identifier != tc.identifier) {
					var temp = tc;
					tc = td;
					td = temp;
				}
				this.scaleImage(ta, tb, tc, td);
			}
		},
		touchEnd(ev) {
			this.type = "";
			this.touches = [];
			this.startTime();
		},
		touchCancel(ev) {
			this.type = "";
			this.touches = [];
			this.startTime();
		},
		startTime() {
			this.stopTime();
			this.timeoutId = setTimeout(() => {
				this.trimImage();
			}, 800);
		},
		stopTime() {
			if (this.timeoutId >= 0) {
				clearTimeout(this.timeoutId);
				this.timeoutId = -1;
			}
		},
		trimImage() {
			this.mask.show = true;
			var query = uni.createSelectorQuery().in(this);
			query.select(".body").boundingClientRect((data) => {
				var bw = data.width;
				var bh = data.height;
				var fw = this.frame.width;
				var fh = this.frame.height;
				var tw = bw * 0.8;
				var th = bh * 0.8;
				var sx = tw / fw;
				var sy = th / fh;
				var scale = sx;
				if (sx > sy) {
					scale = sy;
				}
				tw = fw * scale;
				th = fh * scale;
				var tx = (bw - tw) / 2;
				var ty = (bh - th) / 2;
				var ax = tx - this.frame.left + (this.frame.left - this.image.left) * (1 - scale);
				var ay = ty - this.frame.top + (this.frame.top - this.image.top) * (1 - scale);
				this.frame.width = tw;
				this.frame.height = th;
				this.frame.left = tx;
				this.frame.top = ty;
				this.image.width *= scale;
				this.image.height *= scale;
				this.image.left += ax;
				this.image.top += ay;
			}).exec();
			setTimeout(() => {
				var scale = this.image.width / this.real.width;
				var x = (this.frame.left - this.image.left) / scale;
				var y = (this.frame.top - this.image.top) / scale;
				var width = this.frame.width / scale;
				var height = this.frame.height / scale;
				this.context.drawImage(this.url, x, y, width, height, 0, 0, this.frame.width, this.frame.height);
				this.context.draw(false);
			}, 100);
		},
		moveImage(ta, tb) {
			var ax = tb.clientX - ta.clientX;
			var ay = tb.clientY - ta.clientY;
			this.image.left = this.start.image.left + ax;
			this.image.top = this.start.image.top + ay;
			if (this.image.left > this.frame.left) {
				this.image.left = this.frame.left;
			}
			if (this.image.top > this.frame.top) {
				this.image.top = this.frame.top;
			}
			if (this.image.left + this.image.width < this.frame.left + this.frame.width) {
				this.image.left = this.frame.left + this.frame.width - this.image.width; 
			}
			if (this.image.top + this.image.height < this.frame.top + this.frame.height) {
				this.image.top = this.frame.top + this.frame.height - this.image.height; 
			}
		},
		scaleImage(ta, tb, tc, td) {
			var x1 = ta.clientX;
			var y1 = ta.clientY;
			var x2 = tb.clientX;
			var y2 = tb.clientY;
			var x3 = tc.clientX;
			var y3 = tc.clientY;
			var x4 = td.clientX;
			var y4 = td.clientY;
			var ol = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
			var el = Math.sqrt((x3 - x4) * (x3 - x4) + (y3 - y4) * (y3 - y4));
			var ocx = (x1 + x2) / 2;
			var ocy = (y1 + y2) / 2;
			var ecx = (x3 + x4) / 2;
			var ecy = (y3 + y4) / 2;
			var ax = ecx - ocx;
			var ay = ecy - ocy;
			var scale = el / ol;
			if (this.start.image.width * scale < this.frame.width) {
				scale = this.frame.width / this.start.image.width;
			}
			if (this.start.image.height * scale < this.frame.height) {
				scale = this.frame.height / this.start.image.height;
			}
			if (this.start.image.width * scale < this.frame.width) {
				scale = this.frame.width / this.start.image.width;
			}
			this.image.left = this.start.image.left + ax - (ocx - this.start.image.left) * (scale - 1);
			this.image.top = this.start.image.top + ay - (ocy - this.start.image.top) * (scale - 1);
			this.image.width = this.start.image.width * scale;
			this.image.height = this.start.image.height * scale;
			if (this.image.left > this.frame.left) {
				this.image.left = this.frame.left;
			}
			if (this.image.top > this.frame.top) {
				this.image.top = this.frame.top;
			}
			if (this.image.left + this.image.width < this.frame.left + this.frame.width) {
				this.image.left = this.frame.left + this.frame.width - this.image.width; 
			}
			if (this.image.top + this.image.height < this.frame.top + this.frame.height) {
				this.image.top = this.frame.top + this.frame.height - this.image.height; 
			}
			
		},
		scaleFrame(ta, tb, type) {
			var ax = tb.clientX - ta.clientX;
			var ay = tb.clientY - ta.clientY;
			var x1 = this.start.frame.left;
			var y1 = this.start.frame.top;
			var x2 = this.start.frame.left + this.start.frame.width;
			var y2 = this.start.frame.top + this.start.frame.height;
			if (type == "left") {
				x1 += ax;
			} else if (type == "right") {
				x2 += ax;
			} else if (type == "top") {
				y1 += ay;
			} else if (type == "bottom") {
				y2 += ay;
			} else if (type == "left-top") {
				x1 += ax;
				y1 += ay;
			} else if (type == "left-bottom") {
				x1 += ax;
				y2 += ay;
			} else if (type == "right-top") {
				x2 += ax;
				y1 += ay;
			} else if (type == "right-bottom") {
				x2 += ax;
				y2 += ay;
			}
			if (x1 < this.image.left) {
				x1 = this.image.left;
			}
			if (y1 < this.image.top) {
				y1 = this.image.top;
			}
			if (x2 > this.image.left + this.image.width) {
				x2 = this.image.left + this.image.width;
			}
			if (y2 > this.image.top + this.image.height) {
				y2 = this.image.top + this.image.height;
			}
			this.frame.left = x1;
			this.frame.top = y1;
			this.frame.width = x2 - x1;
			this.frame.height = y2 - y1;
		},
		parseBlob(base64) {
			var arr = base64.split(',');
			var mime = arr[0].match(/:(.*?);/)[1];
			var bstr = atob(arr[1]);
			var n = bstr.length;
			var u8arr = new Uint8Array(n);
			for(var i = 0; i < n; i++) {
				u8arr[i] = bstr.charCodeAt(i);
			}
			var url = URL || webkitURL;
			return url.createObjectURL(new Blob([u8arr], {type: mime}));
		},
		onok() {
			var scale = this.image.width / this.real.width;
			var x = (this.frame.left - this.image.left) / scale;
			var y = (this.frame.top - this.image.top) / scale;
			var width = this.frame.width / scale;
			var height = this.frame.height / scale;
			var tw = width;
			var th = height;
			if (this.fixed) {
				tw = this.width / 2;
				th = this.height / 2;
			} else {
				if (tw > this.maxWidth / 2) {
					var sc = this.maxWidth / 2 / tw;
					tw = tw * sc;
					th = th * sc;
				}
				if (th > this.maxHeight / 2) {
					var sc = this.maxHeight / 2 / th;
					th = th * sc;
					tw = tw * sc;
				}
			}
			this.target.width = tw;
			this.target.height = th;
			uni.showLoading({
				title: "正在裁剪"
			});
			setTimeout(() => {
				this.targetContext.drawImage(this.url, x, y, width, height, 0, 0, tw, th);
				this.targetContext.draw(false, () => {
					uni.canvasToTempFilePath({
						canvasId: "target",
						success: (res) => {
							var path = res.tempFilePath;
							// #ifdef H5
							if (this.blob) {
								path = this.parseBlob(path);
							}
							// #endif
							this.$emit("ok", {
								path: path
							});
						},
						fail: (ev) => {
							console.log(ev);
						},
						complete: () => {
							uni.hideLoading();
						}
					}, this);
				});
			}, 100);
		},
		oncancle() {
			this.$emit("cancel");
		}
	}
}
</script>

<style scoped>
.ksp-image-cutter {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	bottom: 0;
	z-index: 1000;
}
.toolbar {
	position: absolute;
	width: 100%;
	height: 100upx;
	left: 0upx;
	bottom: 0upx;
	box-sizing: border-box;
	border-bottom: 1px solid #C0C0C0;
	background: #F8F8F8;
}
.btn-cancel {
	position: absolute;
	left: 100upx;
	top: 12upx;
	font-size: 30upx;
	line-height: 30upx;
	padding: 20upx;
	color: #333333;
}
.btn-ok {
	position: absolute;
	right: 100upx;
	top: 12upx;
	font-size: 30upx;
	line-height: 30upx;
	padding: 20upx;
	color: #333333;
}
.body {
	position: absolute;
	left: 0upx;
	right: 0upx;
	top: 0upx;
	bottom: 100upx;
	background: black;
	overflow: hidden;
}
.mask {
	position: absolute;
	left: 0upx;
	right: 0upx;
	top: 0upx;
	bottom: 0upx;
	background: black;
	opacity: 0.4;
}
.plank {
	position: absolute;
	left: 0upx;
	right: 0upx;
	top: 0upx;
	bottom: 0upx;
}
.image {
	position: absolute;
}
.frame {
	position: absolute;
}
.canvas {
	position: absolute;
	display: block;
	left: 0px;
	top: 0px;
}
.rect {
	position: absolute;
	left: -2px;
	top: -2px;
	width: 100%;
	height: 100%;
	border: 2px solid white;
}
.line-one {
	position: absolute;
	width: 100%;
	height: 1px;
	background: white;
	left: 0;
	top: 33.3%;
}
.line-two {
	position: absolute;
	width: 100%;
	height: 1px;
	background: white;
	left: 0;
	top: 66.7%;
}
.line-three {
	position: absolute;
	width: 1px;
	height: 100%;
	background: white;
	top: 0;
	left: 33.3%;
}
.line-four {
	position: absolute;
	width: 1px;
	height: 100%;
	background: white;
	top: 0;
	left: 66.7%;
}
.frame-left {
	position: absolute;
	height: 100%;
	width: 8px;
	left: -4px;
	top: 0;
}
.frame-right {
	position: absolute;
	height: 100%;
	width: 8px;
	right: -4px;
	top: 0;
}
.frame-top {
	position: absolute;
	width: 100%;
	height: 8px;
	top: -4px;
	left: 0;
}
.frame-bottom {
	position: absolute;
	width: 100%;
	height: 8px;
	bottom: -4px;
	left: 0;
}
.frame-left-top {
	position: absolute;
	width: 20px;
	height: 20px;
	left: -6px;
	top: -6px;
	border-left: 4px solid red;
	border-top: 4px solid red;
}
.frame-left-bottom {
	position: absolute;
	width: 20px;
	height: 20px;
	left: -6px;
	bottom: -6px;
	border-left: 4px solid red;
	border-bottom: 4px solid red;
}
.frame-right-top {
	position: absolute;
	width: 20px;
	height: 20px;
	right: -6px;
	top: -6px;
	border-right: 4px solid red;
	border-top: 4px solid red;
}
.frame-right-bottom {
	position: absolute;
	width: 20px;
	height: 20px;
	right: -6px;
	bottom: -6px;
	border-right: 4px solid red;
	border-bottom: 4px solid red;
}
</style>
