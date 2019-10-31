<template>
	<!-- 最近拍中组件 -->
	<view class="recently-wrapper">
		<view  v-for="(item, index) in recentlylist" :key="index">
			<view class="tabdiv-list-area" @tap="skipAuctionDetails($event)">
				<view class="tabdiv-list-left">
					<image class="tabdiv-left-img" :src="item.goodsThumbnail" lazy-load mode="" ></image>
					<image class="activity-succeed-img" src="../../static/index/activity_succeed.png" lazy-load  mode=""></image>
				</view>
				<view class="tabdiv-list-middle">
					<view class="tabdiv-middle-top">
						<view class="tabdiv-middle-top-left">{{ item.goodsName }}</view>
					</view>
					<view class="tabdiv-middle-middle">
						<view class="tabdiv-middle-middle-left">
							成交人：
							<text class="user-name">{{ item.nickname }}</text>
						</view>
						<view class="tabdiv-middle-middle-right">
							成交价：
							<text class="total-price">{{ item.dealPrice }}</text>
						</view>
					</view>
					<view class="tabdiv-middle-bottom">
						<view class="middle-bottom-time">{{ item.createTime | formatDate(0) }}</view>
						<view class="middle-bottom-price">
							¥
							<text class="original-price">{{ item.marketPrice }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
export default {
	props: {
		recentlyAuction: {
			type: Array,
			default() {
				return []
			}
		}
	},
	data() {
		return {
			
		};
	},
	onLoad() {
		console.log(this.recentlyAuction)
	},
	computed:{
		recentlylist(){
			return this.recentlyAuction;
		}
	},
	methods: {
		skipAuctionDetails(event) {
			uni.navigateTo({
				url: '../../pages/auction-detailsed/auction-detailsed'
			});
		},
		imageError: function(e) {
            console.error('image发生error事件，携带值为' + e.detail.errMsg)
        }
	}
};
</script>

<style lang="scss" scoped>
.recently-wrapper {
	width: 100%;
	min-height: 100%;
}

.tabdiv-list-area {
	height: 232upx;
	margin: 0 25upx;
	border-bottom: 1upx solid #eeeeee;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;

	.tabdiv-list-left {
		width: 154upx;
		height: 154upx;
		position: relative;
		.tabdiv-left-img {
			display: block;
			width: 100%;
			height: 100%;
			position: absolute;
			z-index: 5;
		}
		.activity-succeed-img {
			display: block;
			width: 100%;
			height: 85%;
			position: absolute;
			z-index: 10;
		}
	}

	.tabdiv-list-middle {
		margin-left: 15upx;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		flex: 1;
		.tabdiv-middle-top {
			width: 100%;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			margin-bottom: 30upx;
			font-size: 28upx;
			line-height: 28upx;
			color: #333;
			.tabdiv-middle-top-left {
				width: 450upx;
				word-break: keep-all;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}

		.tabdiv-middle-middle {
			width: 100%;
			height: 32upx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			margin-bottom: 30upx;
			text-align: center;
			.tabdiv-middle-middle-left {
				height: 32upx;
				font-size: 24upx;
				line-height: 32upx;
				color: #333;
				.user-name {
					padding-left: 10upx;
				}
			}
			.tabdiv-middle-middle-right {
				height: 32upx;
				font-size: 24upx;
				line-height: 32upx;
				color: #333;
				margin-right: 26upx;
				.total-price {
					padding-left: 10upx;
					color: #fa503d;
					font-size: 32upx;
				}
			}
		}

		.tabdiv-middle-bottom {
			width: 100%;
			height: 24upx;
			text-align: left;
			font-size: 24upx;
			line-height: 24upx;
			color: #999;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			.middle-bottom-time {
			}
			.middle-bottom-price {
				margin-right: 80upx;
				.original-price {
					padding-left: 10upx;
					text-decoration: line-through;
				}
			}
		}
	}
}
</style>
