<template>
	<!-- 发布成功页面 -->
	<view class="publish-success-wrapper">
		<view class="publish-success-area">
			<view class="border-side"></view>
		</view>
		<view class="publish-success-content">
			<image class="publish-success-img" src="../../static/publish_success/publish_success.png" mode=""></image>
			<view class="publish-success-txt">评价待审核！</view>
			<view class="publish-success-desc">评价已提交，请小主耐心等候~</view>
			<view class="publish-success-btn" @tap="returnOrder()" >返回我的订单</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {
			
		},
		data() {
			return {
				orderId: "" //订单编号
			}
		},
		onLoad(prams) {
			this.orderId = prams.orderId;
		},
		methods: {
			returnOrder() {
				uni.navigateTo({
					url: '../my-order/my-order'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.publish-success-wrapper {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		background-color: #FFFFFF;
		position: relative;
	}
	.publish-success-area {
		width: 100%;
		height: 1upx;
		background-color: #fff;
		display: flex;
		flex-direction: row;
		justify-content: cneter;
		align-items: center;
		position: relative;
		.border-side {
			width: 100%;
			height: 1upx;
			background-color: #F2F4F5;
			position: fixed;
			top: 0;
			left: 0;
		}
	}
	.publish-success-content {
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-content: center;
		.publish-success-img {
			display: block;
			width: 133upx;
			height: 150upx;
			margin-top: 134upx;
			align-self: center;
		}
	}
	.publish-success-txt {
		width: 100%;
		height: 32upx;
		line-height: 32upx;
		margin-top: 32upx;
		margin-bottom: 27upx;
		font-size: 32upx;
		color: #333;
		font-family: PingFang-SC-Medium;
		font-weight: 500;
		text-align: center;
	}
	.publish-success-desc {
		width: 100%;
		height: 24upx;
		line-height: 24upx;
		margin-bottom: 237upx;
		font-size: 24upx;
		color: #999;
		font-family: PingFang-SC-Medium;
		font-weight: 500;
		text-align: center;
	}
	.publish-success-btn {
		width: 600upx;
		height: 80upx;
		line-height: 80upx;
		border-radius: 80upx;
		font-size: 32upx;
		color: #FEFEFE;
		font-family: PingFang-SC-Medium;
		font-weight: 500;
		text-align: center;
		align-self: center;
		background: linear-gradient(left, #FFC20B, #FE9402);
		background: -webkit-linear-gradient(left, #FFC20B, #FE9402);
	}
</style>
