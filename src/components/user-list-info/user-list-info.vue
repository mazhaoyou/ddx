<template>
	<!-- 往期成交-用户列表信息
	* wux
	* 使用说明
	* 1.引入组件
	* 2.pastUser 用户列表数据
	*  -->
	<view class="user-info-container">
		<view class="past-user-info">
			<text class="user-title">用户</text>
			<text class="right-money">成交价</text>
			<text class="right-con">消耗</text>
			<text class="purchase-time">成交时间</text>
		</view>
		<block v-for="(item, index) in pastUsers" :key="index">
			<view class="past-user-list">
				<view class="left-user-info">
					<view class="user-head-portrait"><image :src="item.headPicUrl" mode=""></image></view>
					<text>{{ item.nickname }}</text>
				</view>
				<view class="transaction-price">
					<text>¥</text>
					<text>{{ item.successfulTradePrice }}</text>
				</view>
				<view class="consume">
					<text>{{ item.returnBeans }}</text>
					<text>豆</text>
				</view>
				<view class="closing-time">{{ item.successfulTradeTime | formatDate(4) }}</view>
			</view>
		</block>
	</view>
</template>

<script>
export default {
	props: {
		pastUser: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	data() {
		return {};
	},
	computed: {
		pastUsers() {
			return this.pastUser;
		}
	}
};
</script>

<style lang="scss">
.user-info-container {
	display: flex;
	padding: 0 $padding50;
	flex: 1;
	flex-direction: column;
	border-top: 1px solid #E5E5E5;
	.past-user-info {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: center;
		margin-top: 16upx;
		margin-bottom: 20upx;
		font-size: 24upx;
		line-height: 36upx;
		font-weight: 500;
		font-family: PingFangSC-Regular;
		color: #333333;
	
		.user-title {
			display: inline-block;
			width: 35%;
			text-align: left;
		}
		.right-money {
			display: inline-block;
			width: 20%;
			text-align: left;
		}
		.right-con {
			display: inline-block;
			width: 15%;
			text-align: left;
		}
		.purchase-time {
			display: inline-block;
			width: 30%;
			text-align: right;
		}
	}
}

.past-user-list {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: space-between;
	align-content: center;
	padding-top: 16upx;
	font-size: 24upx;
	line-height: 36upx;
	font-weight: 500;
	font-size: 24upx;
	font-family: PingFangSC-Regular;
	
	.left-user-info {
		width: 35%;
		display: flex;
		flex-direction: row;
		align-items: center;
		color: #333;
		text-align: center;
		text {
			display: inline-block;
			font-size: 24upx;
			font-family: PingFangSC-Regular;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
			max-width: 150upx;
			overflow: hidden;
		}
	}
	
	.transaction-price {
		width: 20%;
		text-align: left;
		color: #fa503d;
		align-self: center;
	}

	.consume {
		width: 15%;
		text-align: left;
		color: #fa503d;
		align-self: center;
	}

	.closing-time {
		width: 30%;
		text-align: right;
		color: #666666;
		font-size: 24upx;
		align-self: center;
	}
	
}

.user-head-portrait {
	width: 58upx;
	height: 58upx;
	border-radius: 50%;
	margin-right:26upx;
	image {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
}
</style>
