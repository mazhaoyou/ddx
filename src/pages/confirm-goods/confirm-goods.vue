<template>
	<!-- 确认收货页面 -->
	<view class="confirm-goods-wrapper">
		<view class="confirm-goods-area">
			<view class="border-side"></view>
		</view>
		<view class="confirm-goods-content">
			<image class="confirm-goods-img" src="../../static/confirm_goods/confirm_goods.png" mode=""></image>
			<view class="confirm-goods-txt">交易成功！</view>
			<view class="direct-purchasing" v-if="returnBeans">您在竞拍中消耗的<text class="beans-num">{{ returnBeans }}金豆</text>已退还至账户余额中</view>
			<view class="confirm-goods-desc">请小主评论下此次的购物体验吧~</view>
			<view class="confirm-goods-btn">
				<view class="btn-left" @tap="returnHomePage" >返回首页</view>
				<view class="btn-right" @tap="immediateEvaluation" >立即评价</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {
			
		},
		data() {
			return {
				beansNum: "", // 返还金豆数量
				orderId: "", //订单编号
				returnBeans: "", //返还的金豆
			}
		},
		onLoad(prams) {
			this.orderId = prams.orderId;
			this.returnBeans = prams.returnBeans;
		},
		methods: {
			returnHomePage() {
				uni.switchTab({
					url: '../index/index'
				})
			},
			immediateEvaluation() {
				uni.navigateTo({
					url: '../evaluation-list/evaluation-list?orderId=' + this.orderId
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.confirm-goods-wrapper {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		background-color: #FFFFFF;
		position: relative;
	}
	.confirm-goods-area {
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
	.confirm-goods-content {
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-content: center;
	}
	.confirm-goods-img {
		display: block;
		width: 133upx;
		height: 150upx;
		margin-top: 134upx;
		align-self: center;
	}
	.confirm-goods-txt {
		width: 100%;
		height: 32upx;
		line-height: 32upx;
		margin-top: 32upx;
		margin-bottom: 26upx;
		font-size: 32upx;
		color: #333;
		font-family: PingFang-SC-Medium;
		font-weight: 500;
		text-align: center;
	}
	.confirm-goods-desc {
		width: 100%;
		height: 24upx;
		line-height: 24upx;
		margin-bottom: 205upx;
		font-size: 24upx;
		color: #999;
		font-family: PingFang-SC-Medium;
		font-weight: 500;
		text-align: center;
	}
	.confirm-goods-btn {
		width: 100%;
		height: 80upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-content: center;
	}
	.btn-left {
		width: 302upx;
		height: 80upx;
		border: 2upx solid #FF911B;
		box-sizing: border-box;
		border-radius: 80upx;
		line-height: 80upx;
		text-align: center;
		font-size: 32upx;
		color: #FF911B;
		margin-left: 51upx;
	}
	.btn-right {
		width: 302upx;
		height: 80upx;
		border-radius: 80upx;
		line-height: 80upx;
		text-align: center;
		font-size: 32upx;
		color: #FEFEFE;
		margin-right: 51upx;
		background: linear-gradient(left, #FFC20B, #FE9402);
		background: -webkit-linear-gradient(left, #FFC20B, #FE9402);
	}
	.direct-purchasing {
		width: 100%;
		height: 28upx;
		line-height: 28upx;
		margin-bottom: 25upx;
		font-size: 28upx;
		color: #666;
		font-family: PingFang-SC-Medium;
		font-weight: 500;
		text-align: center;
		.beans-num {
			color: #FF911B;
		}
	}
</style>
