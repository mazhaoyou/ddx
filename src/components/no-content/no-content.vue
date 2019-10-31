<template>
	<view class="no-content" v-if="isShow">
		<image class="no-content-img" src="../../static/public/no_content.png"></image>
		<text class="no-content-text">{{text}}</text>
		<text class="no-content-desc">{{desc}}</text>
	</view>
</template>

<script>
	export default {
		props: ['isShow', 'text', 'desc']
	}
</script>

<style lang="scss" scoped>
	.no-content{
		width: 750upx;
		position: fixed;
		left: 0;
		top: 350upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.no-content-img{
		width: 263upx;
		height: 228upx;
	}
	.no-content-text{
		font-size: 32upx;
		line-height: 50upx;
		color: #333;
		text-align: center;
	}
	.no-content-desc{
		font-size: 28upx;
		line-height: 50upx;
		color: #666;
		text-align: center;
	}
</style>
