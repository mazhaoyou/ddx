<!--	
	骨架屏-商品
	薛毅飞 
-->
<template>
	<view>
		<view class="skeleton-box" v-for="(item, index) in goodLIst" :key="index">
			<view class="skeleton skeleton-left"></view>
			<view class="skeleton-right">
				<view class="skeleton skeleton-top"></view>
				<view class="skeleton-middle">
					<view class="skeleton skeleton-countdown"></view>
					<view class="skeleton skeleton-time"></view>
				</view>
				<view class="skeleton-bottom">
					<view class="skeleton skeleton-price"></view>
					<view class="skeleton skeleton-btn"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				goodLIst: [{},{},{},{},{}]
			};
		}
	}
</script>

<style>
	/* 骨架屏 */
	.skeleton{
		background-color: #F1F2F3;
		border-radius: 3px;
	}
	.skeleton-box{
		width: 750upx;
		background-color: #fff;
		padding: 28upx;
		flex-direction: row;
		border-bottom-width: 20upx;
		border-style: solid;
		border-color: #F0F0F0;
	}
	.skeleton-left{
		width: 140upx;
		height: 155upx;
		margin-right: 30upx;
	}
	.skeleton-right{
		width: 534px;
		flex-direction: column;
	}
	.skeleton-top{
		flex: 1;
	}
	.skeleton-middle,
	.skeleton-bottom{
		margin-top: 25upx;
		flex: 1;
		flex-direction: row;
		justify-content: space-between;
	}
	.skeleton-countdown{
		width: 240upx;
	}
	.skeleton-time{
		width: 240upx;
	}
	.skeleton-price{
		width: 350upx;
	}
	.skeleton-btn{
		width: 150upx;
	}
</style>
