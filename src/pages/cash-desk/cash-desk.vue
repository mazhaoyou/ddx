<template>
	<!-- 收银台页面 -->
	<view class="cash-desk-wrapper">
		<view class="indent-area">
			<view class="indent-txt">订单金额</view>
			<view class="indent-money">
				¥
				<text class="money-num">{{ payMoney }}</text>
			</view>
		</view>
		<view class="payment-area">
			<view class="payment-content">选择支付方式</view>
			<view class="weixin-payment">
				<image class="weixin-img" src="../../static/payment/weixin_logo.png" mode=""></image>
				<text class="payment-txt">微信支付</text>
			</view>
			<view class="zhifubao-payment">
				<image class="zhifubao-img" src="../../static/payment/zhifubao_logo.png" mode=""></image>
				<text class="payment-txt">支付宝支付</text>
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
				payMoney: "0" // 应该支付的金额
			}
		},
		onLoad(prams) {
			this.payMoney = prams.payMoney;
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	.cash-desk-wrapper {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		flex: 1;
		background-color: #fff;
	}
	.indent-area {
		width: 100%;
		height: 102upx;
		border-top: 1upx solid #E6E6E6;
		background-color: #F5F5F5;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-content: center;
	}
	.indent-txt {
		height: 102upx;
		line-height: 102upx;
		font-size: 32upx;
		color: #666;
		font-family: PingFang-SC-Medium;
		font-weight: 500;
		margin-left: 33upx;
	}
	.indent-money {
		height: 102upx;
		line-height: 102upx;
		font-size: 40upx;
		color: #FA503D;
		font-family: PingFang-SC-Medium;
		font-weight: 500;
		margin-right: 25upx;
		.money-num {
			margin-left: 10upx;
		}
	}
	.payment-area {
		width: 100%;
		height: 500upx;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}
	.payment-content {
		width: 688upx;
		height: 89upx;
		border-bottom: 1upx solid #E5E5E5;
		line-height: 89upx;
		color: #999;
		font-size: 32upx;
		font-family: PingFang-SC-Regular;
		text-align: left;
		font-weight: 400;
	}
	.weixin-payment, .zhifubao-payment {
		width: 688upx;
		height: 99upx;
		border-bottom: 1upx solid #E5E5E5;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-content: center;
	}
	.weixin-img, .zhifubao-img {
		display: block;
		width: 45upx;
		height: 45upx;
		align-self: center;
	}
	.payment-txt {
		height: 99upx;
		line-height: 99upx;
		color: #666;
		font-size: 32upx;
		font-family: PingFang-SC-Regular;
		margin-left: 20upx;
	}
</style>
