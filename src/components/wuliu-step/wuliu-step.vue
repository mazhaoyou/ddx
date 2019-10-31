<template>
	<view class="ali">
		<view class="" v-if="waybillList">
			<view class="order-details-area">
				<view class="border-side"></view>
			</view>
			<!-- 订单编号区域开始 -->
			<view class="order-details-number">
				<view class="order-word">
					订单编号：
					<text class="order-num">{{ information.orderNo }}</text>
				</view>
			</view>
			<!-- 订单编号区域结束 -->
			<view class="info-content">
				<view class="info-img">
					<view class="info-img-circle">
						<image class="wuliu-img" src="../../static/wuliu/car.png" mode=""></image>
					</view>
				</view>
				<view class="wuliu-content">
					<view class="wuliu-info">
						<view class="wuliu-desc">快递单号：<i></i></view>
						<view class="wuliu-desc1">{{ information.waybillNum }}</view>
					</view>
					<view class="wuliu-info">
						<view class="wuliu-desc">国内承运人：<i></i></view>
						<view class="wuliu-desc1">{{ information.carrierName }}</view>
					</view>
					<view class="wuliu-info">
						<view class="wuliu-desc">客服电话：<i></i></view>
						<view class="wuliu-desc1">{{ information.carrierPhone }}</view>
					</view>
				</view>
			</view>
			<view class="ali_state">
				<block v-for="(item,i) in waybillList" :key="i">
					<view class="State_Four">
						<view class="FourBox">
							<text class="line" :class="[i == 0?'noline':'']"></text>
							<text class="ali_top_icon" style="margin: 0 0;" v-if="i == waybillList.length -1">发</text>
							<text class="ali_top_icon" :class="[item.status == 3?'isOk':'']" style="margin: 0 0;" v-else-if="Type(item.status) == true && i!= waybillList.length-1">{{item.status | Type}}</text>
							<view class="ali_top_icons" style="margin: 0 0;" v-else>
								<text class="line" :class="[i == 0?'noline':'']"></text>
								<text class="ali_top_iconss"></text>
								<text class="line" :class="[i == 0?'noline':'']"></text>
							</view>
							<text class="line" :class="[i == waybillList.length -1?'noline':'']"></text>
						</view>
						<view class="remark">
							<text class="a14" v-if="i == waybillList.length-1">已发货</text>
							<text class="a14" v-else>{{item.acceptStation}}</text>
							<text class="a12" style="padding-top: 10upx;">{{item.acceptTime}}</text>
						</view>
					</view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ["group", "waybillList", "information"],
		data() {
			return {

			}
		},
		onLoad() {

		},
		//过滤返回关键字
		filters: {
			Type(item) {
				let Info;
				if (item == 3) {
					Info = "收";
				} else {
					Info = "";
				}
				return Info
			}
		},
		methods: {
			//判断哪个该展示关键字--还是默认
			Type(item) {
				let Info;
				if (item == 3) {
					Info = true;
				} else {
					Info = false;
				}
				return Info
			}
		},
	}
</script>

<style lang="scss" scoped>
	.isOk {
		background: rgba(251, 110, 97, 1) !important;
	}

	.ali_top_iconss {
		width: 12upx;
		height: 12upx;
		display: block;
		background-color: #666;
		padding-right: 2upx;
		border-radius: 50%;
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
	}

	.border-side {
		width: 100%;
		height: 1upx;
		background-color: #F2F4F5;
		position: fixed;
		top: 0;
		left: 0;
	}

	.order-details-number {
		height: 78upx;
		background-color: #fff;
		border-bottom: 1upx solid #F0F0F0;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-content: center;
		padding: 0 48upx;
	}

	.order-word {
		height: 78upx;
		color: #666;
		font-size: 24upx;
		line-height: 78upx;
		font-family: PingFang-SC-Regular;
		font-weight: 400;
	}

	.info-content {
		height: 200upx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-content: center;
		border-bottom: 1upx solid #EBECED;
		background-color: #fff;
		margin-bottom: 20upx;
		padding: 0 48upx;
	}

	.info-img {
		width: 130upx;
		height: 200upx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin-right: 60upx;
	}

	.info-img-circle {
		width: 130upx;
		height: 130upx;
		display: flex;
		justify-content: center;
		align-content: center;
		background: rgba(242, 244, 245, 1);
		border-radius: 50%;
	}

	.wuliu-img {
		width: 80upx;
		height: 60upx;
		display: block;
		align-self: center;
	}

	.wuliu-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-content: center;
	}

	.wuliu-info {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-content: center;
		margin-bottom: 14upx;
	}

	.wuliu-desc {
		width: 160upx;
		height: 24upx;
		text-align: justify;
		line-height: 24upx;
		font-size: 24upx;
		font-family: PingFang-SC-Medium;
		font-weight: 400;
		color: #666;
	}

	.wuliu-desc i {
		display: inline-block;
		/* padding-left: 100%; */
		width: 100%;
	}

	.wuliu-desc:after {
		content: " ";
		display: inline-block;
		width: 100%;
	}

	.wuliu-desc1 {
		flex: 1;
		line-height: 24upx;
		font-size: 24upx;
		font-family: PingFang-SC-Medium;
		font-weight: 400;
		color: #666;
	}

	.noline {
		background-color: #fff !important;
	}

	.State_Four {
		display: flex;
		/* border: 1upx solid red; */
	}

	.FourBox {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-right: 24upx;
	}

	.line {
		width: 2upx;
		display: flex;
		flex-direction: column;
		flex: 1;
		background-color: #999;
	}

	/* ============= */
	.remark {
		display: flex;
		flex-direction: column;
		width: 90%;
		padding: 24upx 0;
	}

	.ali_top_icons {
		width: 46upx;
		height: 46upx;
		display: block;
		background-color: #FFF;
		border-radius: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		align-content: center;
	}

	.ali_top_icon {
		width: 46upx;
		height: 46upx;
		display: block;
		background-color: #83AECF;
		color: #fff;
		font-size: 28upx;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.ali_top_icon image {
		width: 24upx;
		height: 24upx;
		z-index: 99;
	}

	/* ========公共========= */
	.a14 {
		font-size: 28upx;
		color: #000000;
	}

	.a12 {
		font-size: 24upx;
		color: #999;
	}

	.ali {
		width: 100%;
		/* border: 1upx solid #F76260; */
		background-color: #F2F4F5;
		display: flex;
		flex: 1;
		flex-direction: column;
		margin-bottom: 24upx;;
	}

	.ali_state {
		padding: 0 48upx;
		background-color: #fff;
	}
</style>
