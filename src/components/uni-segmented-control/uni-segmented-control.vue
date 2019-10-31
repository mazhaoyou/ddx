<template>
	<view class="segmented-control text">
		<view v-for="(item, index) in values" class="segmented-control-item text" :key="index" @click="onClick(index, $event)">
			{{item.title}}
		</view>
		<view class="bottom-border" ref="tabActive" :style="{left: offsetLeft + 'px'}"></view>
	</view>
</template>

<script>
	let windowWidth = uni.upx2px(750);
	export default {
		name: 'uni-segmented-control',
		props: {
			current: {
				type: Number,
				default: 0
			},
			values: {
				type: Array,
				default () {
					return [];
				}
			}
		},
		data() {
			return {
				currentIndex: this.current,
				offsetLeft: ''
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
			windowWidth = uni.getSystemInfoSync().windowWidth;
			// #endif
		},
		watch: {
			current(val) {
				this.offsetLeft = (windowWidth / 3) * val + (windowWidth / 3 / 6);
				console.log((windowWidth / 3) * val , (windowWidth / 3 / 6))
				if (val !== this.currentIndex) {
					this.currentIndex = val;
				}
			}
		},
		methods: {
			onClick(index,event) {
				if (this.currentIndex !== index) {
					this.currentIndex = index;
					this.$emit('clickItem', index);
				}
			}
		},
	}
</script>

<style lang="scss">
	.segmented-control {
		display: flex;
		flex-direction: row;
		justify-content: center;
		width: 100%;
		font-size: 28upx;
		box-sizing: border-box;
		margin: 0 auto;
		overflow: hidden;
		height: 84upx;
		background: $color-grey;
		position: relative;
		z-index: 2;
	}
	.segmented-control-item {
		flex: 1;
		text-align: center;
		line-height: 60upx;
		box-sizing: border-box;
		font-size: $font-size-28;
		font-weight: 500;
		color: $color-orange;
		line-height: 84upx;
	}
	.bottom-border{
		width: 167upx;
		height: 8upx;
		background: $color-orange;
		border-radius: 4upx;
		position: absolute;
		bottom: 0;
		left: 40upx;
		transition: .3s;
	}
</style>