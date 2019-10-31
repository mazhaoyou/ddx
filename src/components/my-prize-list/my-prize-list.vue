<template>
	<!-- 我的奖品
	* wux
	* myPrizelist我的奖品数据
	*  -->
	<!-- 我的奖品列表 -->
	<view>
		<view class="my-prize">
			<view class="my-prize-title">
				<text>奖品名称</text>
				<text>时间</text>
			</view>
			<view class="my-prize-list" v-for="(item,index) in myPrizelist" :key="index">
				<view class="prize-box">
					<text class="prize-box-name uni-ellipsis">{{item.goodsName}}</text>
					<view class="prize-box-place-order" :data-details-id="item.detailsId" @tap="placeOrder($event)" v-if="item.goodsType==1">
						下单
					</view>
				</view>
				<view class="prize-time">{{item.prizeTime | formatDate(0)}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			myPrizelist: {
				type: Array,
				default () {
					return [];
				}
			}
		},
		data() {
			return {

			}
		},
		methods: {
			placeOrder(e) {
				let detailsId = e.currentTarget.dataset.detailsId;
				if('' != detailsId || undefined != detailsId || null != detailsId) {
					uni.navigateTo({
						url:'../../pages/confirm-order/confirm-order?activityId=' + detailsId + '&orderType=' + 2
					})	
				} 
			}
		},
	}
</script>

<style lang="scss">
	.my-prize {
		width: 687upx;
		min-height: 400upx;
		padding: 20upx 0;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 7upx;
		&-title {
			height: 60upx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;

			>text {
				display: inline-block;
				flex: 1;
				text-align: center;
			}
		}

		&-list {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			padding: 10upx 20upx;

			>view {
				width: 50%;
			}

			.prize-time {
				text-align: right;
				color: #333333;
			}
		}
	}

	.prize-box {
		display: flex;
		flex-direction: row;
		flex-wrap: row;
		justify-content: space-between;
		align-items: center;

		&-name {
			color: #FA503D;
		}

		&-place-order {
			width: 120upx;
			padding: 8upx 0;
			text-align: center;
			border-radius: 10upx;
			color: #FDB218;
			background: #ffffff;
		}
	}
</style>
