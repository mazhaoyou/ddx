<template>
	<!-- 竞拍活动-商品信息  @mazy
	* 使用说明
	* 1.引入组件
	* 2.参数 autoplay：是否自动播放 默认自动播放 
	* interval:自动切换时间间隔默认 5000ms  
	* warningStatus：1为绿色 2为黄色 3为红色 0 为灰色 -1 其他不显示禁参加 默认为1 
	* attentionStatus 是否收藏 1 未收藏 2 已收藏 0为不显示
	* -->
	<view class="goods-info" :style="{ marginTop: statusHeight + 'px' }">
		<!-- #ifdef APP-PLUS -->
		<!-- <view class="status-bar"></view> -->
		<!-- #endif -->
		<!--商品轮播图 -->
		<view class="goods-slideshow">
			<swiper class="goods-slideshow-swiper" @change="swiperChange" :autoplay="autoplay" :interval="interval" :duration="duration" :circular="circular">
				<swiper-item v-for="(item, index) in imgList" :key="index"><image :src="item.imgUrl"></image></swiper-item>
			</swiper>
			<!-- 自定义swiper指示器 -->

			<view class="swiper-dots">
				<text class="num">{{ swiperCurrent + 1 }}</text>
				<text class="sign">/</text>
				<text class="num">{{ swiperLength }}</text>
			</view>
			<view class="swiper-lockdown" v-if="warningStatus == 0">
				<view class="swiper-lockdown-tip"><image src="../../static/auction/lock.png" mode=""></image></view>
				<text class="swiper-lockdown-num">5.00</text>
			</view>
			<view class="swiper-lock" v-if="warningStatus == 1">
				<view class="swiper-lock-tip"><image src="../../static/auction/unlock.png" mode=""></image></view>
				<text class="swiper-lock-num">5.00</text>
			</view>
			<view class="swiper-locking" v-if="warningStatus == 2">
				<view class="swiper-locking-tip"><image src="../../static/auction/unlock.png" mode=""></image></view>
				<text class="swiper-lock-num">5.00</text>
			</view>
			<view class="swiper-locked" v-if="warningStatus == 3">
				<view class="swiper-locked-tip"><image src="../../static/auction/unlock.png" mode=""></image></view>
				<text class="swiper-lock-num">5.00</text>
			</view>
		</view>
		<!-- 商品名称 -->
		<view class="goods-title uni-ellipsis">{{ goodsName }}</view>
		<view class="affiche-list">
			<view class="affiche-list-item">
				<image src="../../static/auction/pledge.png" mode=""></image>
				<text>正品保障</text>
			</view>
			<view class="affiche-list-item distance">
				<image src="../../static/auction/publicity.png" mode=""></image>
				<text>公开透明</text>
			</view>
			<view class="affiche-list-item distance">
				<image src="../../static/auction/direct-purchasing.png" mode=""></image>
				<text>直购返豆100%</text>
			</view>
		</view>
		<!-- <view class="collect" @tap="setAttention" v-if="isAttention == 1"><image src="../../static/auction/not_collection.png" mode=""></image></view>
		<view class="collect" @tap="setAttention" v-if="isAttention == 2"><image src="../../static/auction/collection.png" mode=""></image></view>
		<view class="back" @tap="goback"><image src="../../static/auction/back.png" mode=""></image></view> -->
	</view>
</template>

<script>
export default {
	name: 'goodsInfo',
	props: {
		imgList: {
			type: Array,
			default() {
				return [];
			}
		},
		autoplay: {
			type: Boolean,
			default: true
		},
		interval: {
			type: Number,
			default: 5000
		},
		duration: {
			type: Number,
			default: 2000
		},
		circular: {
			type: Boolean,
			default: true
		},
		warningStatus: {
			type: Number,
			default: 0
		},
		attention: {
			type: Boolean,
			default: false
		},
		goodsName: {
			type: String,
			default: '...'
		},
		attentionStatus: {
			type: Number,
			default: 0
		},
		isStatusBar: {
			//是否计算状态栏高度
			type: Boolean,
			default: true
		},
		activityId:{
			type:String,
			default:""
		}
	},
	data() {
		return {
			swiperCurrent: 0, //当前轮播图索引
			swiperLength: 0, //轮播图总数
			isAttention: 1
		};
	},
	onLoad() {
		this.isAttention = this.attentionStatus;
	},
	computed: {
		statusHeight() {
			//计算状态栏高度
			let height = 0;
			// #ifdef APP-PLUS
			if (this.isStatusBar) {
				height = uni.upx2px(44) + plus.navigator.getStatusbarHeight();
			}
			// #endif
			return height;
		}
	},
	methods: {
		swiperChange(e) {
			const index = e.detail.current;
			this.swiperCurrent = index;
			this.swiperLength = this.imgList.length;

			//this.titleNViewBackground = this.carouselList[index].background;
		},
	
		goback() {
			uni.navigateBack({
				delta: 1
			});
		},
		/* 关注 */
		setAttention() {
			let data = {
				token: this.$storage.isAuthed(),
				activityId: this.activityId
			};
			this.$api
				.setFocusState()
				.then(res => {
					res = res.data;
					if (res.code == '0001') {
						this.isAttention = res.data.whetherAttention;
					} else {
						uni.showToast({
							title: res.message
						});
					}
				})
				.catch(err => {
					uni.showToast({
						title: '服务异常'
					});
				});
		}
	}
};
</script>

<style lang="scss">
.goods-slideshow {
	display: flex;
	position: relative;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	width: 100%;
	height: 340upx;
	// margin-top: calc(44upx + var(--status-bar-height));
	&-swiper {
		width: 100%;
		text-align: center;
	}
	image {
		max-height: 340upx;
		max-width: 100%;
		vertical-align: middle;
	}
	.swiper-dots {
		display: flex;
		position: absolute;
		right: 30upx;
		bottom: 30upx;
		width: 72upx;
		height: 36upx;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4MzlBNjE0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk4MzlBNjA0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3RUNERkE0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3RUNERkI0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gh5BPAAACTUlEQVR42uzcQW7jQAwFUdN306l1uWwNww5kqdsmm6/2MwtVCp8CosQtP9vg/2+/gY+DRAMBgqnjIp2PaCxCLLldpPARRIiFj1yBbMV+cHZh9PURRLQNhY8kgWyL/WDtwujjI8hoE8rKLqb5CDJaRMJHokC6yKgSCR9JAukmokIknCQJpLOIrJFwMsBJELFcKHwM9BFkLBMKFxNcBCHlQ+FhoocgpVwwnv0Xn30QBJGMC0QcaBVJiAMiec/dcwKuL4j1QMsVCXFAJE4s4NQA3K/8Y6DzO4g40P7UcmIBJxbEesCKWBDg8wWxHrAiFgT4fEGsB/CwIhYE+AeBAAdPLOcV8HRmWRDAiQVcO7GcV8CLM8uCAE4sQCDAlHcQ7x+ABQEEAggEEAggEEAggEAAgQACASAQQCCAQACBAAIBBAIIBBAIIBBAIABe4e9iAe/xd7EAJxYgEGDeO4j3EODp/cOCAE4sYMyJ5cwCHs4rCwI4sYBxJ5YzC84rCwKcXxArAuthQYDzC2JF0H49LAhwYUGsCFqvx5EF2T07dMaJBetx4cRyaqFtHJ8EIhK0i8OJBQxcECuCVutxJhCRoE0cZwMRyRcFefa/ffZBVPogePihhyCnbBhcfMFFEFM+DD4m+ghSlgmDkwlOgpAl4+BkkJMgZdk4+EgaSCcpVX7bmY9kgXQQU+1TgE0c+QJZUUz1b2T4SBbIKmJW+3iMj2SBVBWz+leVfCQLpIqYbp8b85EskIxyfIOfK5Sf+wiCRJEsllQ+oqEkQfBxmD8BBgA5hVjXyrBNUQAAAABJRU5ErkJggg==);
		background-size: 100% 100%;
		.num {
			width: 36upx;
			height: 36upx;
			border-radius: 50px;
			font-size: 24upx;
			color: #fff;
			text-align: center;
			line-height: 36upx;
		}
		.sign {
			position: absolute;
			top: 0;
			left: 50%;
			line-height: 36upx;
			font-size: 12upx;
			color: #fff;
			transform: translateX(-50%);
		}
	}

	.swiper-lockdown {
		display: flex;
		position: absolute;
		width: 124upx;
		height: 50upx;
		left: 30upx;
		bottom: 30upx;
		background: $color-lockdown;
		border-radius: 24upx;
		justify-content: flex-start;
		align-items: center;
		&-tip {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 50upx;
			width: 50upx;
			border-radius: 50%;
			background: $color-lockdowns;
			image {
				width: 22upx;
				height: 30upx;
			}
		}
		&-num {
			margin-left: 6upx;
			color: #fff;
			font-size: 26upx;
			font-weight: bold;
		}
	}
	.swiper-lock {
		display: flex;
		position: absolute;
		width: 124upx;
		height: 50upx;
		left: 30upx;
		bottom: 30upx;
		background: $color-lock;
		border-radius: 24upx;
		justify-content: flex-start;
		align-items: center;
		&-tip {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 50upx;
			width: 50upx;
			border-radius: 50%;
			background: $color-locks;
			image {
				width: 30upx;
				height: 30upx;
			}
		}
		&-num {
			margin-left: 6upx;
			color: #fff;
			font-size: 26upx;
			font-weight: bold;
		}
	}
	.swiper-locked {
		display: flex;
		position: absolute;
		width: 124upx;
		height: 50upx;
		left: 30upx;
		bottom: 30upx;
		background: $color-locked;
		border-radius: 24upx;
		justify-content: flex-start;
		align-items: center;
		&-tip {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 50upx;
			width: 50upx;
			border-radius: 50%;
			background: $color-lockeds;
			image {
				width: 30upx;
				height: 30upx;
			}
		}
		&-num {
			margin-left: 6upx;
			color: #fff;
			font-size: 26upx;
			font-weight: bold;
		}
	}
	.swiper-locking {
		display: flex;
		position: absolute;
		width: 124upx;
		height: 50upx;
		left: 30upx;
		bottom: 30upx;
		background: $color-locking;
		border-radius: 24upx;
		justify-content: flex-start;
		align-items: center;
		&-tip {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 50upx;
			width: 50upx;
			border-radius: 50%;
			background: $color-lockings;
			image {
				width: 30upx;
				height: 30upx;
			}
		}
		&-num {
			margin-left: 6upx;
			color: #fff;
			font-size: 26upx;
			font-weight: bold;
		}
	}
}
.goods-title {
	margin: 28upx 36upx 0 36upx;
	font-size: 32upx;
	font-family: PingFangSC-Regular;
	font-weight: bold;
	color: rgba(51, 51, 51, 1);
}
.affiche-list {
	margin: 24upx 36upx 0 36upx;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	&-item {
		display: flex;
		align-items: center;
		font-size: 24upx;
		font-family: PingFang-SC-Regular;
		font-weight: 500;
		color: rgba(102, 102, 102, 1);
		image {
			width: 32upx;
			height: 32upx;
		}
		text {
			margin-left: 10upx;
		}
	}
	.distance {
		margin-left: 40upx;
	}
}
.collect {
	position: fixed;
	top: calc(22upx + var(--status-bar-height));
	right: 30upx;
	image {
		height: 40upx;
		width: 40upx;
	}
	z-index: 5;
}
.back {
	height: 80upx;
	width: 80upx;
	position: fixed;
	top: calc(22upx + var(--status-bar-height));
	left: 30upx;
	image {
		height: 40upx;
		width: 24upx;
	}
	z-index: 5;
}
</style>
