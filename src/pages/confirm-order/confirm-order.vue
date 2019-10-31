<template>
	<!-- 订单确认页面 -->
	<view class="confirm-order-wrapper">
		<!-- 收货地址编辑区域开始  -->
		<view class="address-area">
			<view class="border-side"></view>
		</view>
		<view class="address-content" @tap="modifyAddress()">
			<view class="address-icon">
				<image class="address-icon-img" src="../../static/confirm_order/address_icon.png" mode=""></image>
			</view>
			<view class="address-information">
				<view class="name-info">
					{{ shippingAddress.receiverName }}
					<text class="phone-info">{{ shippingAddress.receiverPhone }}</text>
				</view>
				<view class="address-info">{{ shippingAddress.pctAddr }}{{ shippingAddress.detailAddr }}</view>
			</view>
			<view class="address-right-arrow">
				<image class="arrow-right-img" src="../../static/confirm_order/arrow_right.png" mode=""></image>
			</view>
		</view>
		<!-- 收货地址编辑区域结束 -->
		<!-- 彩条区域开始 -->
		<view class="strip-bj"></view>
		<!-- 彩条区域结束 -->
		<!-- 商品展示区域开始 -->
		<view class="product-area">
			<view class="product-show">
				<image class="show-img" :src="goodsInfo.goodsThumbnail" mode=""></image>
				<view class="show-desc">
					<view class="show-desc-title">
						<text class="show-desc-name">{{ goodsInfo.goodsName }}</text>
					</view>
					<view class="show-original-price">市场价格：¥<text class="paddl">{{ goodsInfo.marketPrice }}</text></view>
					<view class="show-auction-price">竞购价格：<text class="paddl color-price">¥</text><text class="paddl color-price">{{ goodsInfo.dealPrice }}</text></view>
				</view>
			</view>
		</view>
		<!-- 商品展示区域结束 -->
		<!-- 快递区域开始 -->
		<view class="express-fee">
			<view class="express-area">
				<text class="cost">快递费</text>
				<view class="cost-price">¥<text class="paddl">{{ confirmList.freight }}</text></view>
			</view>
		</view>
		<!-- 快递区域结束 -->
		<!-- 订单备注开始 -->
		<view class="order-remark-container">
			<view class="order-remark-content">
				<view>订单备注</view>
				<view>
					<textarea class="" v-model="desc" auto-height="true"  placeholder="请填写备注信息" placeholder-class="textarea-style"/>
				</view>
			</view>
		</view>
		<!-- 订单备注结束 -->
		<view class="blank-area">
			<view class="blank-field"></view>
		</view>
		<!-- 底部区域开始 -->
		<view class="bottom-area">
			<view class="bottom-field">
				<view class="bottom-left">
					合计金额：<text class="bottom-symbol">¥</text><text class="bottom-money">{{ payMoney }}</text>
				</view>
				<view class="bottom-right" @tap="handleConfirmOrder()">提交订单</view>
			</view>
		</view>
		<!-- 底部区域结束 -->
		
		<!-- 弹出层开始 -->
		<view>
			<neil-modal :show="show">
				<view class="modal-confirm">
					<view class="modal-icon">
						<text class="modal-txt">收货信息确认</text>
					</view>
					<view class="modal-content">
						<view class="modal-bj"></view>
						<view class="modal-name">
							<view class="modal-title">收货人</view>
							<text class="modal-colon">：</text>
							<view class="modal-word">{{ shippingAddress.receiverName }}</view>
						</view>
						<view class="modal-tel">
							<view class="modal-title">电话</view>
							<text class="modal-colon">：</text>
							<view class="modal-phone">{{ shippingAddress.receiverPhone }}</view>
						</view>
						<view class="modal-addr">
							<view class="modal-title">地址</view>
							<text class="modal-colon">：</text>
							<view class="modal-address">{{ shippingAddress.pctAddr }}{{ shippingAddress.detailAddr }}</view>
						</view>
						<view class="modal-explain">
							<text class="modal-sp">根据国家规定，收货人需填写真实信息。不实的信息或将导致您无法正常收货。</text>
						</view>
						<view class="modal-btn-area">
							<view class="btn-left" @tap="handleCancel()">取消</view>
							<view class="btn-right" @tap="confirmPay()" >确定</view>
						</view>
					</view>
				</view>
			</neil-modal>
		</view>
		<!-- 弹出层结束 -->
		
	</view>
</template>

<script>
	import neilModal from '@/components/neil-modal/neil-modal.vue'
	
	export default {
		components: {
			neilModal
		},
		data() {
			return {
				show: false, // 弹窗的显示与否
				freight: "", // 运费
				dealPrice: "" ,// 成交价
				confirmList: {}, //返回数据集合
				shippingAddress: {}, //地址信息集合
				goodsInfo: {}, //商品信息集合
				activityId: "", //活动主键 当订单类型为2时，该字段为抽奖活动主键detailsId
				orderType: "" ,// 订单类型 0竞拍 1直购 2抽奖
				desc: "" // 备注区域的文字
			}
		},
		onLoad(prams) {
			// 获取token，没有跳转到登录页面
			this.activityId = prams.activityId;
			this.orderType = prams.orderType;
			var data = {
				token: this.$storage.isAuthed(),
				activityId: this.activityId,
				orderType: this.orderType
			};
			this.confirmData(data);
		},
		computed: {
			payMoney: function() {
				return parseFloat(this.freight) + parseFloat(this.dealPrice);
			}
		},
		methods: {
			confirmData(data) {
				let that = this;
				this.$api.confirmOrder(data).then(res => {
					res = res.data;
					if (res.code == '0001') {
						let resData = res.data;
						that.confirmList = resData;
						that.shippingAddress = that.confirmList.shippingAddress;
						that.goodsInfo = that.confirmList.goodsInfo;
						that.freight = that.confirmList.freight;
						that.dealPrice = that.confirmList.goodsInfo.dealPrice;
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 2000
						});
					}
				})
				.catch(err => {
					uni.showToast({
						title: '服务异常',
						icon: "none",
						duration: 2000
					});
				});
			},
			modifyAddress(){
				uni.navigateTo({
					url: '../shipping-address/shipping-address'
				})
			},
			handleConfirmOrder() {
				this.show = true
			},
			handleCancel() {
				this.show = false
			},
			confirmPay() {
				this.show = false;
				uni.navigateTo({
					url: '../cash-desk/cash-desk?payMoney=' + this.payMoney
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.confirm-order-wrapper {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		background-color: #F2F4F5;
		position: relative;
	}
	.address-area {
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
		.address-content {
			width: 100%;
			height: auto;
			background-color: #fff;
			padding: 32upx 0;
			display: flex;
			flex-direction: row;
			justify-content: cneter;
			align-items: center;
			position: relative;
		.address-icon {
			width: 20upx;
			height: 100%;
			padding-left: 28upx;
			.address-icon-img {
				display: block;
				width: 20upx;
				height: 28upx;
			}
		}
		.address-information {
			width: 100%;
			margin-left: 20upx;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			flex: 1;
			.name-info {
				height: 46upx;
				line-height: 46upx;
				color: #333;
				font-size: 28upx;
				text-align: left;
				font-family: PingFang-SC-Medium;
				font-weight: 500;
				.phone-info {
					display: inline-block;
					padding-left: 40upx;
				}
			}
			.address-info {
				line-height: 32upx;
				font-size: 24upx;
				color: #666666;
				overflow: hidden;
				text-overflow: ellipsis; 
				display: -webkit-box;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
			}
		}
		.address-right-arrow {
			width: 50upx;
			height: 100%;
			padding-right: 28upx;
			display: flex;
			flex-direction: row;
			justify-content: flex-end;
			.arrow-right-img {
				display: block;
				width: 16upx;
				height: 30upx;
			}
		}
	}
	.strip-bj {
		width: 100%;
		height: 4upx;
		background: url('~@/static/confirm_order/strip.png') no-repeat;
		background-size: 100% 100%;
	}
	.product-area {
		width: 100%;
		height: 236upx;
		background-color: #fff;
		margin-bottom: 20upx;
		.product-show {
			height: 156upx;
			padding: 40upx 0;
			padding-left: 16upx;
			padding-right: 50upx;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			.show-img {
				width: 144upx;
				height: 156upx;
				display: block;
			}
			.show-desc {
				margin-left: 15upx;
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				flex: 1;
				.show-desc-title {
					width: 100%;
					height: 32upx;
					line-height: 32upx;
					font-size: 32upx;
					color: #333;
					margin-bottom: 36upx;
					display: flex;
					flex-direction: row;
					justify-content: flex-start;
				}
			}
		}
	}
	.show-desc-name {
		width: 500upx;
		height: 32upx;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	.show-original-price {
		width: 100%;
		height: 24upx;
		font-size: 24upx;
		line-height: 24upx;
		color: #999;
		font-family: PingFang-SC-Regular;
		margin-bottom: 32upx;
	}
	.show-auction-price {
		width: 100%;
		height: 30upx;
		line-height: 30upx;
		color: #333;
		font-size: 24upx;
		font-family: PingFang-SC-Medium;
	}
	.paddl {
		padding-left: 10upx;
	}
	.color-price {
		height: 30upx;
		color: #FA503D;
		font-size: 30upx;
		line-height: 30upx;
	}
	.express-fee {
		width: 100%;
		height: 95upx;
		background-color: #fff;
		border-bottom: 1upx solid #E6E6E6;
	}
	.express-area {
		padding: 0 28upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	.cost {
		height: 95upx;
		line-height: 95upx;
		font-size: 24upx;
		color: #272727;
		text-align: center;
	}
	.cost-price {
		height: 95upx;
		line-height: 95upx;
		font-size: 24upx;
		color: #FA503D;
		text-align: center;
	}
	
	/* 订单备注开始 */
	.order-remark-container {
		width: 100%;
		min-height: 95upx;
		height: auto;
		background-color: #fff;
		border-bottom: 1upx solid #E6E6E6;
		
		.order-remark-content {
			padding: 0 28upx;
			display: flex;
			flex-direction: row;
			align-items: center;
			
			
			> view:nth-child(1) {
				width: 16%;
				font-size:24Upx;
				font-family:PingFang-SC-Regular;
				font-weight:400;
				color:rgba(51,51,51,1);
				padding-top: 30upx;
			}
			
			> view:nth-last-child(1) {
				width: 70%;
				flex: 1;
				padding-top: 34upx;
			}
			
			textarea {
				width: 98%;
				font-size: 24upx;
				color: #272727;
				text-align: left;
				padding: 0 20upx;
			}
		}
	}
	
	.textarea-style {
		color: #CCC;
		font-size: 24upx;
	}
	/* 订单备注结束 */
	
	.blank-area {
		width: 100%;
		height: 655upx;
		background-color: #fff;
		margin-bottom: 166upx;
	}
	.blank-field {
		height: 655upx;
		padding: 0 28upx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
	}
	.bottom-area {
		width: 100%;
		height: 166upx;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 4;
	}
	.bottom-field {
		height: 166upx;
		padding: 0 28upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	.bottom-left {
		margin-top: 14upx;
		height: 86upx;
		line-height: 86upx;
		font-size: 32upx;
		font-weight: 500;
		color: #333;
		font-family: PingFang-SC-Medium;
		.bottom-symbol {
			color: #FA503D;
		}
		.bottom-money {
			color: #FA503D;
			padding-left: 20upx;
		}
	}
	.bottom-right {
		width: 326upx;
		height: 86upx;
		margin-top: 14upx;
		background: linear-gradient(left, #FFC20B, #FE9402);
		background: -webkit-linear-gradient(left, #FFC20B, #FE9402);
		border-radius: 5upx;
		line-height: 86upx;
		text-align: center;
		color: #fff;
		font-size: 32upx;
	}
	.modal-confirm {
		width: 627upx!important;
		min-height: 776upx;
		background-color: transparent;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-content: center;
	}
	.modal-icon {
		width: 435upx;
		height: 261upx;
		background: url("~@/static/confirm_order/modal_banner.png") no-repeat;
		background-size: 435upx 261upx;
		align-self: center;
		position: relative;
		z-index: 5;
	}
	.modal-txt {
		display: inline-block;
		width: 435upx;
		text-align: center;
		position: absolute;
		bottom: 52upx;
		color: #fff;
		font-size: 28upx;
		line-height: 28upx;
		font-weight: 500;
		font-family: PingFang-SC-Bold;
		z-index: 6;
	}
	.modal-content {
		width: 627upx;
		min-height: 754upx;
		background-color: #fff;
		margin-top: -150upx;
		border-radius: 16upx;
		z-index: 4;
	}
	.modal-bj {
		width: 627upx;
		height: 191upx;
		background: url("~@/static/confirm_order/modal_bj.png") no-repeat;
		background-size: 627upx 191upx;
		position: relative;
		z-index: 3;
	}
	.modal-name {
		height: 28upx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-content: center;
		margin-left: 40upx;
		margin-right: 40upx;
		margin-top: 36upx;
		font-size: 28upx;
		color: #333;
		line-height: 28upx;
		text-align: left;
		font-family: PingFang-SC-Medium;
		.modal-title {
			width: 100upx;
			text-align: justify;
			text-align-last: justify;
		}
		.modal-colon {
			margin: 0 4upx;
		}
		.modal-word {
			flex: 1;
		}
	}
	.modal-tel {
		height: 28upx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-content: center;
		margin-left: 40upx;
		margin-right: 40upx;
		margin-top: 26upx;
		font-size: 28upx;
		color: #333;
		line-height: 28upx;
		text-align: left;
		font-family: PingFang-SC-Medium;
		.modal-title {
			width: 100upx;
			text-align: justify;
			text-align-last: justify;
		}
		.modal-colon {
			margin: 0 4upx;
		}
		.modal-phone {
			flex: 1;
		}
	}
	.modal-addr {
		height: auto;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-content: center;
		margin-left: 40upx;
		margin-right: 40upx;
		margin-top: 26upx;
		font-size: 28upx;
		color: #333;
		font-family: PingFang-SC-Medium;
		.modal-title {
			width: 100upx;
			text-align: justify;
			text-align-last: justify;
			line-height: 48upx;
			align-self: center;
		}
		.modal-colon {
			margin: 0 4upx;
			align-self: center
		}
		.modal-address {
			flex: 1;
			line-height: 48upx;
		}
	}
	.modal-explain {
		width: 100%;;
		height: auto;
		margin-top: 53upx;
		line-height: 32upx;
		font-size: 24upx;
		color: #FA503D;
		font-family: PingFang-SC-Medium;
		font-weight: 500;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-content: center;
		.modal-sp {
			width: 527upx;
		}
	}
	.modal-btn-area {
		width: 100%;
		height: 84upx;
		margin: 62upx 0;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-content: center;
		.btn-left {
			width: 240upx;
			height: 84upx;
			border-radius: 84upx;
			background: #F5F5F5;
			font-size: 32upx;
			line-height: 84upx;
			text-align: center;
			color: #999;
			margin-left: 47upx;
		}
		.btn-right {
			width: 240upx;
			height: 84upx;
			border-radius: 84upx;
			background: linear-gradient(left, #FFC20B, #FE9402);
			background: -webkit-linear-gradient(left, #FFC20B, #FE9402);
			background-size: 100% 100%;
			font-size: 32upx;
			line-height: 84upx;
			text-align: center;
			color: #fff;
			margin-right: 50upx;
		}
	}
</style>
