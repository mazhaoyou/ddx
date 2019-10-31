<template>
	<!-- 订单详情页面 -->
	<view class="order-details-wrapper">
		<view class="order-details-area">
			<view class="border-side"></view>
		</view>
		<!-- 订单编号区域开始 -->
		<view class="order-details-number">
			<view class="order-number-num">
				订单编号：
				<text class="order-num">AC{{ goodsDetail.orderNo }}</text>
			</view>
			<view class="order-status">{{ orderStatus }}</view>
		</view>
		<!-- 订单编号区域结束 -->
		<!-- 物流信息区域开始 -->
		<view class="wuliu-area" v-if="orderStatu == 2" @tap="wuLiuInfo()">
			<view class="wuliu-word">物流信息：</view>
			<view class="wuliu-desc" v-for="(item, index) in logistics" :key="index">
				<view class="wuliu-content">{{ item.acceptStation }}</view>
				<view class="wuliu-time">{{ item.acceptTime }}</view>
			</view>
			<view class="wuliu-desc" v-if="logistics.length == 0">
				<view class="wuliu-content">此单没有物流信息！</view>
			</view>
			<view class="wuliu-arrow">
				<image class="wuliu-arrow-img" src="../../static/confirm_order/arrow_right.png" mode=""></image>
			</view>
		</view>
		<!-- 物流信息区域结束 -->
		<!-- 彩条区域开始 -->
		<view class="strip-bj"></view>
		<!-- 彩条区域结束 -->
		<!-- 收货地址区域开始 -->
		<view class="address-content" @tap="updateAddress()">
			<view class="address-icon">
				<image class="address-icon-img" src="../../static/confirm_order/address_icon.png" @tap="handleIcon()" mode=""></image>
			</view>
			<view class="address-information">
				<view class="name-info">
					{{ goodsDetail.consigneeName }}
					<text class="phone-info">{{ goodsDetail.consigneePhone }}</text>
				</view>
				<view class="address-info">{{ goodsDetail.consigneeAddress }}</view>
			</view>
			<view class="address-right-arrow">
				<image class="arrow-right-img" src="../../static/confirm_order/arrow_right.png" mode=""></image>
			</view>
		</view>
		<!-- 收货地址区域结束 -->
		<!-- 彩条区域开始 -->
		<view class="strip-bj"></view>
		<!-- 彩条区域结束 -->
		<!-- 商品展示区域开始 -->
		<view class="product-area">
			<view class="product-show">
				<image class="show-img" :src="goodsDetail.goodsThumbnail" mode=""></image>
				<view class="show-desc">
					<view class="show-desc-title">
						<text class="show-desc-name">{{ goodsDetail.goodsName }}</text>
					</view>
					<view class="show-original-price">市场价格：¥<text class="paddl">{{ goodsDetail.marketPrice }}</text></view>
					<view class="show-auction-price">竞购价格：<text class="paddl color-price">¥</text><text class="paddl color-price">{{ goodsDetail.dealPrice }}</text></view>
				</view>
			</view>
		</view>
		<!-- 商品展示区域结束 -->
		<!-- 创建时间区域开始 -->
		<view class="establish-time-area">
			<view class="establish-area">
				<text class="establish">创建时间</text>
				<view class="establish-time">{{ goodsDetail.createTime | formatDate(0) }}</view>
			</view>
		</view>
		<!-- 创建时间区域结束 -->
		<!-- 商品价格区域开始 -->
		<view class="express-fee">
			<view class="express-area">
				<text class="cost">商品价格</text>
				<view class="cost-price">¥<text class="paddl">{{ goodsDetail.goods_price }}</text></view>
			</view>
		</view>
		<!-- 商品价格区域结束 -->
		<!-- 快递区域开始 -->
		<view class="express-fee">
			<view class="express-area">
				<text class="cost">快递费</text>
				<view class="cost-price">¥<text class="paddl">{{ goodsDetail.freight }}</text></view>
			</view>
		</view>
		<!-- 快递区域结束 -->
		<!-- 订单备注开始 -->
		<view class="order-remark-container">
			<view class="order-remark-content">
				<view>订单备注</view>
				<view>
					<textarea class="" v-model="textArea" auto-height="true" :disabled="orderStatu !== 0" placeholder="请填写备注信息" placeholder-class="textarea-style"/>
				</view>
			</view>
		</view>
		<!-- 订单备注结束 -->
		<!-- 需要付款区域开始 -->
		<view class="payment-area">
			<view class="payment-txt">{{isPayment}}付款：</view>
			<view class="payment-price">¥<text class="payment-num">{{ goodsDetail.payPrice }}</text></view>
		</view>
		<!-- 需要付款区域结束 -->
		<view class="blank-area">
			<view class="blank-field"></view>
		</view>
		<!-- 底部区域开始 -->
		<view class="bottom-area">
			<view class="bottom-field">
				<view class="bottom-right">
					<view class="bottom-right-right" v-if="orderStatu == 0" @tap="goPay" >去付款</view>
					<view class="bottom-right-left" v-if="orderStatu == 0 || orderStatu == 1" @tap="canceOrder" >取消订单</view>
					<view class="bottom-right-right" v-if="orderStatu == 2" @tap="confirmGoods" >确认收货</view>
					<view class="bottom-right-right" v-if="orderStatu == 3" @tap="evaluation" >晒单评价</view>
					<view class="bottom-right-left" v-if="orderStatu == 3 || orderStatu == 6" @tap="deleteOrder" >删除订单</view>
				</view>
				<view class="bottom-left" v-if="orderStatu == 0">
					<view class="left-top">付款剩余时间</view>
					<view class="left-bottom">
						<text v-if=" time.h !== '00' ">{{ time.h }}时</text>
						<text v-if=" time.m !== '00' ">{{ time.m }}分</text>
						<text>{{ time.s }}秒</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部区域结束 -->
	</view>
</template>

<script>
	export default {
		components: {
			
		},
		data() {
			return {
				goodsDetail: {} ,// 商品信息集合
				orderStatu: "", //记录订单状态
				logistics: [], //快递信息集合
				textArea: "", // 备注信息
				createTime: "" ,//快照创建时间
				create: "",
				orderId: "", //订单主键
				endTime: "", //应为接口获取到的结束时间
				serverTime: "", //服务器时间
				time: {
					d: "0",
					h: "0",
					m: "0",
					s: "0"
				},
			}
		},
		onLoad(prams) {
			this.orderId = prams.orderId;
			this.orderStatu = Number(prams.orderStatus);
			// console.log(this.orderStatu)
			// this.orderStatu = 0;
			this.getGoodsDetail();
			// 重写方法，自定义格式化日期
			Date.prototype.toLocaleString = function() {
				// 补0   例如 2018/7/10 14:7:2  补完后为 2018/07/10 14:07:02
				function addZero(num) {
					if(num<10)
						return "0" + num;
					return num;
				}
				// 按自定义拼接格式返回
				return this.getFullYear() + "/" + addZero(this.getMonth() + 1) + "/" + addZero(this.getDate()) + " " +
					addZero(this.getHours()) + ":" + addZero(this.getMinutes()) + ":" + addZero(this.getSeconds());
			}
		},
		computed: {
			isPayment() {  //应付款及实付款的显示
				return this.orderStatu > 0 ? '实' : '应';
			},
			orderStatus() {  //计算订单状态
				let status;
				switch( this.orderStatu ){
					case 0:
						status = '待付款';
						break;
					case 1:
						status = '待发货';
						break;
					case 2:
						status = '待收货';
						break;
					case 3:
						status = '待评价';
						break;
					case 4:
						status = '已完成';
						break;
					case 5:
						status = '已取消';
						break;
					case 6:
						status = '已超时';
						break;
					case 7:
						status = '异常订单';
						break;
				};
				return status;
			}
		},
		watch: {
			textArea(curVal, oldVal) {
				this.textArea = curVal;
			}
		},
		methods: {
			getGoodsDetail() { // 获取订单的详细信息
				const that = this;
				let data = {
					token: that.$storage.isAuthed(),
					orderId: that.orderId
				};
				this.$api.getOrderInfo(data).then(res => {
					res = res.data;
					if (res.code == '0001') {
						let resData = res.data;
						// console.log(JSON.stringify(resData))
						that.goodsDetail = resData;
						// that.orderStatu = that.goodsDetail.orderStatus;
						that.logistics = that.goodsDetail.logistics;
						that.endTime = that.goodsDetail.endTime;
						that.serverTime = that.goodsDetail.serverTime;
						// that.createTime = that.goodsDetail.createTime;
						// let create = new Date(Number(that.goodsDetail.createTime)).toLocaleString();
						// that.createTime = create.split("/").join("-");
						that.setEndTime();
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
				})
				.catch(err => {
					uni.showToast({
						title: '服务异常'
					});
				});
			},
			setEndTime(){ //订单支付的倒计时
				let that = this;
				let interval = setInterval(function() {
					let date = that.endTime - (new Date().getTime()); //计算剩余的毫秒数
					if(date <= 0){
						clearInterval(interval);
					}else{
						that.time.d = parseInt(date / 1000 / 60 / 60 / 24 , 10); //计算剩余的天数
						that.time.h = parseInt(date / 1000 / 60 / 60 % 24 , 10); //计算剩余的小时
						that.time.h = that.time.d * 24 + that.time.h;
						if(that.time.h < 10){ 
							 that.time.h = "0" +　that.time.h
						}
						that.time.m = parseInt(date / 1000 / 60 % 60, 10);//计算剩余的分钟
						if(that.time.m < 10){
							 that.time.m = "0" +　that.time.m
						} 
						that.time.s = parseInt(date / 1000 % 60, 10);//计算剩余的秒数 
						if(that.time.s < 10){
							 that.time.s = "0" +　that.time.s
						}
						if( that.time.h == '00' && that.time.m == '00' && that.time.s == '00'){
							// 重新获取订单信息
							that.getGoodsDetail();
							that.orderStatu = 6; //联调时删除
						};
						return that.time.d+that.time.h+that.time.m+that.time.s;	
					}
				},1000);
			},
			wuLiuInfo() { // 点击物流区域跳转到详细的物流信息
				uni.navigateTo({
					url:'../wuliu-info/wuliu-info?orderId=' + this.orderId
				})
			},
			updateAddress() { // 跳转收货地址列表
				uni.navigateTo({
					url:'../shipping-address/shipping-address?orderId=' + this.orderId 
				})
			},
			goPay() { //去付款
				uni.navigateTo({
					url:'/pages/cash-desk/cash-desk?orderId=' + this.orderId + '&payMoney=' + this.goodsDetail.payPrice
				})
			},
			canceOrder() { //取消订单
				const that = this;
				uni.showModal({
					title: '小冠优选',
					content: '亲，取消后将无法再以目前的成交价购买该宝贝，确定取消订单吗？',
					success: res => {
						if (res.confirm) {
							let data = {
								orderId: that.orderId,
								orderStatus: "5"
							};
							that.$api.setOrderStatus(data)
								.then(res => {
									res = res.data;
									if (res.code == '0001') {
										uni.showToast({
											title: "取消成功",
											icon: 'success',
											duration: 2000
										});
										// 重新获取订单信息
										that.getGoodsDetail();
										this.orderStatu = 5; //联调时删除
									} else {
										uni.showToast({
											title: res.message,
											icon: 'none'
										});
									}
								})
								.catch(err => {
									uni.showToast({
										title: '服务异常'
									});
								});
						};
					}
				});
			},
			confirmGoods() { //确认收货
				const that = this;
				uni.showModal({
					title: '小冠优选',
					content: '亲，确定收货吗？',
					confirmText: '确认收货',
					success: function (res) {
						if (res.confirm) {
							let data = {
								orderId: that.orderId,
								orderStatus: "4"
							};
							that.$api.setOrderStatus(data)
								.then(res => {
									res = res.data;
									if (res.code == '0001') {
										uni.navigateTo({
											url:  "/pages/confirm-goods/confirm-goods?orderId=" + data.orderId
										});
										uni.showToast({
											title: "收货成功",
											icon: 'success',
											duration: 2000
										});
									} else {
										uni.showToast({
											title: res.message,
											icon: 'none'
										});
									}
								})
								.catch(err => {
									console.log(err)
									uni.showToast({
										title: '服务异常'
									});
								});
						};
					}
				});
			},
			evaluation() { //晒单评价
				uni.navigateTo({
					url: '/pages/evaluation-list/evaluation-list?orderId=' + this.goodsDetail.orderId + '&goodsNo=' + this.goodsDetail.goodsNo
				});
			},
			deleteOrder() { //删除订单
				const that = this;
				uni.showModal({
					title: '小冠优选',
					content: '确定删除此订单吗？',
					confirmText: '确认删除',
					success: function (res) {
						if (res.confirm) {
							let data = {
								orderId: that.orderId
							};
							that.$api.setOrderDelStatus(data)
								.then(res => {
									res = res.data;
									if( res.code == '0001' ){
										uni.showToast({
											title: "删除成功",
											duration: 2000,
											success: function() {
												setTimeout(function(){
													uni.navigateBack({
														delta: 2
													});
												},2000);
											}
										});
									}else{
										uni.showToast({
											title: res.message,
											duration: 2000
										});
									};
								})
								.catch(err => {
									uni.showToast({
										title: '服务异常'
									});
								})
						};
					},
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.order-details-wrapper {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		background-color: #F2F4F5;
		position: relative;
	}
	.order-details-area {
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
	.order-details-number {
		width: 100%;
		height: 78upx;
		background-color: #fff;
		border-bottom: 1upx solid #F0F0F0;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-content: center;
		.order-number-num {
			height: 78upx;
			color: #666;
			font-size: 24upx;
			line-height: 78upx;
			font-family: PingFang-SC-Regular;
			font-weight: 400;
			margin-left: 27upx;
		}
		.order-status {
			height: 78upx;
			color: #FF911B;
			font-size: 24upx;
			line-height: 78upx;
			font-family: PingFang-SC-Regular;
			font-weight: 400;
			margin-right: 25upx;
		}
	}
	.wuliu-area {
		width: 100%;
		height: auto;
		background-color: #fff;
		padding: 32upx 0;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-content: center;
	}
	.wuliu-word {
		font-size: 28upx;
		line-height: 32upx;
		color: #666;
		font-weight: 500;
		font-family: PingFang-SC-Regular;
		margin-left: 27upx;
	}
	.wuliu-desc {
		flex: 1;
	}
	.wuliu-content {
		line-height: 32upx;
		font-size: 28upx;
		font-family: PingFang-SC-Regular;
		font-weight: 500;
		color: #666;
		margin-bottom: 14upx;
	}
	.wuliu-time {
		line-height: 20upx;
		font-size: 20upx;
		font-family: PingFang-SC-Regular;
		font-weight: 500;
		color: #999;
	}
	.wuliu-arrow {
		width: 50upx;
		padding-right: 28upx;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-self: center;
	}
	.wuliu-arrow-img {
		display: block;
		width: 16upx;
		height: 30upx;
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
	.establish-time-area {
		width: 100%;
		height: 95upx;
		background-color: #fff;
		border-bottom: 1upx solid #E6E6E6;
	}
	.establish-area {
		padding: 0 28upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	.establish {
		height: 95upx;
		line-height: 95upx;
		font-size: 24upx;
		color: #272727;
	}
	.establish-time {
		height: 95upx;
		line-height: 95upx;
		font-size: 24upx;
		color: #999;
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
	
	.payment-area {
		width: 100%;
		height: 28upx;
		background-color: #fff;
		padding-top: 35upx;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-content: center;
	}
	.payment-txt {
		height: 28upx;
		line-height: 28upx;
		color: #666;
		font-size: 28upx;
		font-family:PingFang-SC-Medium;
		font-weight:500; 
	}
	.payment-price {
		height: 28upx;
		line-height: 28upx;
		color: #FA503D;
		font-size: 28upx;
		font-family:PingFang-SC-Medium;
		font-weight:500; 
		padding-right: 27upx;
		.payment-num {
			padding-left: 10upx;
		}
	}
	.blank-area {
		width: 100%;
		height: 318upx;
		background-color: #fff;
		margin-bottom: 166upx;
	}
	.blank-field {
		height: 318upx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
	}
	.bottom-area {
		width: 100%;
		height: 172upx;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 4;
		border-top: 1px solid #f0f0f0;
	}
	.bottom-field {
		height: 172upx;
		padding-left: 27upx;
		padding-right: 27upx;
		padding-top: 13upx;
		display: flex;
		flex-direction: row-reverse;
		justify-content: space-between;
	}
	.bottom-left {
		// width: 180upx;
		height: 85upx;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-content: center;
		.left-top {
			height: 36upx;
			line-height: 36upx;
			color: #666;
			font-size: 28upx;
			font-family:PingFang-SC-Medium;
			font-weight:500;
			text-align: center;
		}
		.left-bottom {
			height: 36upx;
			margin-top: 10upx;
			line-height: 36upx;
			color: #333;
			font-size: 32upx;
			font-family:PingFang-SC-Medium;
			font-weight:500;
			display: flex;
			justify-content: center;
		}
	}
	.bottom-right {
		width: 387upx;
		height: 85upx;
		display: flex;
		flex-direction: row-reverse;
		justify-content: space-between;
		align-content: center;
		.bottom-right-left {
			width: 183upx;
			height: 85upx;
			background: linear-gradient(left, #C4C4C4, #B5B4B4);
			background: -webkit-linear-gradient(left, #C4C4C4, #B5B4B4);
			border-radius: 5upx;
			font-size: 32upx;
			line-height: 85upx;
			color: #fff;
			font-weight: 500;
			font-family: PingFang-SC-Medium;
			text-align: center;
		}
		.bottom-right-right {
			width: 183upx;
			height: 85upx;
			background: linear-gradient(left, #FFC20B, #FE9402);
			background: -webkit-linear-gradient(left, #FFC20B, #FE9402);
			border-radius: 5upx;
			font-size: 32upx;
			line-height: 85upx;
			color: #fff;
			font-weight: 500;
			font-family: PingFang-SC-Medium;
			text-align: center;
		}
	}
</style>
