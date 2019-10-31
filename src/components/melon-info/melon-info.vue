<template>
	<!-- 福豆信息组件 -->
	<view class="container">
		<view class="melon-info auction-num" @tap="showAuctionNum()">
			<image src="../../static/index/melon_Info.png" class="auction-num-img" mode=""></image>
			<text class="num-symbol uni-ellipsis">
				{{ auction_count }}
				<text class="num-name">次</text>
			</text>

			<!-- <image src="../../static/index/symbol.png" class="auction-num-symbol"></image>-->
		</view>
		<view class="melon-info bean-num">
			<image src="../../static/index/bean_num.png" class="auction-num-img" mode=""></image>
			<text class="num-symbol uni-ellipsis">{{ beanNum }}</text>
			<!-- <image src="../../static/index/symbol.png" class="auction-num-symbol"></image>-->
		</view>
		<!-- 竞拍次数弹窗 -->
		<view class="auction-frequency" @touchmove.stop.prevent :class="{'auction-frequency-show':auctionFlag}">
			<view class="auction-frequency-mask"></view>
			<view class="auction-frequency-container">
				<view class="auction-frequency-content">
					<!-- 右上角关闭按钮 -->
					<!-- <view class="close-dialog" @tap="closeAuctionDialog()">
						<text class="close-dialog-img">X</text>
					</view> -->
					<!-- 标题 -->
					<view class="auction-frequency-title">竞拍次数</view>
					<view class="auction-card">
						<view class="auction-card-box opportunity">
							<view class="opportunity-img">
								<image src="../../static/index/auction_card_head_1.png.png" mode=""></image>
							</view>
							<view class="auction-text opportunity-text">
								您今天还有<text>{{quotaCount}}</text>次拍中商品的机会。
							</view>
						</view>
						<view class="auction-card-box  frequency">
							<view class="frequency-img">
								<image src="../../static/index/auction_card_head_2.png" mode=""></image>
								<text>竞拍卡×{{cardCount}}</text>
							</view>
							<view class="auction-text frequency-text">
								您有<text>{{cardCount}}</text>张竞拍卡，可用于绑定竞拍活动，增加拍中机会。
							</view>
						</view>
						<view class="auction-card-box auction-card-confirm">
							<view class="auction-card-btn" @tap="closeAuctionDialog()">
								<view class="card-btn-icon"></view>
								朕知道了
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'melon-info',
		data() {
			return {
				auctionFlag: false //竞拍次数开关变量
			};
		},
		computed: {
			melonInfo() {
				return this.$store.state.beanInfo;
			},
			/* 福豆余量 */
			beanNum() {
				return parseInt(this.melonInfo.sliverCount) + parseInt(this.melonInfo.goldCount);
			},
			/*竞拍次数 */
			auction_count() {
				if (parseInt(this.melonInfo.quotaCount) > 0 && parseInt(this.melonInfo.cardCount) > 0) {
					return this.melonInfo.cardCount + '+' + this.melonInfo.quotaCount;
				} else if (this.melonInfo.cardCount) {
					return this.melonInfo.cardCount;
				} else if (this.melonInfo.quotaCount) {
					return this.melonInfo.quotaCount;
				} else {
					return 0;
				}
			},
			quotaCount() {
				if (parseInt(this.melonInfo.quotaCount) > 0) {
					return this.melonInfo.quotaCount;
				} else {
					return 0;
				}
			},
			cardCount() {
				if (parseInt(this.melonInfo.cardCount) > 0) {
					return this.melonInfo.cardCount;
				} else {
					return 0;
				}
			}
		},
		mounted() {
			//console.log('auction_count=' + this.melonInfo.quotaCount);
		},
		methods: {
			/* 
			 * 显示竞拍次数
			 *  */
			showAuctionNum() {
				this.auctionFlag = true;
				uni.hideTabBar();
			},
			/* 
			 * 关闭 竞拍次数遮罩层
			 * 
			 * */
			closeAuctionDialog() {
				this.auctionFlag = false;
				setTimeout(() => {
					uni.showTabBar();
				}, 300)
			}
		}
	};
</script>

<style lang="scss" scoped>
	.container {
		display: flex;
		flex-direction: column;

		.melon-info {
			display: flex;
			width: 156upx;
			height: 44upx;
			align-items: center;
			background: rgba(255, 214, 100, 0.7);
			border-radius: 22upx;
			font-size: 28upx;
			color: rgba(255, 255, 255, 1);
			text-shadow: 0 2upx 0 rgba(181, 105, 0, 0.6);
			font-weight: bold;

			.num-symbol {
				display: flex;
				justify-content: center;
				flex: 1;
				flex-wrap: nowrap;
				max-width: 90upx;
			}
		}

		.bean-num {
			margin-top: 20upx;
		}

		.auction-num {
			&-img {
				height: 60upx;
				width: 60upx;
				margin-left: -6upx;
			}

			/* 	&-symbol {
			height: 30upx;
			width: 30upx;
			margin-right: 10upx;
		} */
		}

		.num-name {
			font-size: 26upx;
			margin-right: 6upx;
		}
	}

	// 竞拍次数弹窗部分
	.auction-frequency {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 9998;
		transition: visibility 200ms ease-in;
		visibility: hidden;

		&.auction-frequency-show {
			visibility: visible;
		}

		&-mask {
			display: block;
			position: absolute;
			z-index: 1000;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.8);
			transition: opacity 200ms ease-in;
		}

		&-container {
			position: absolute;
			z-index: 1010;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			transition: transform 0.3s;
			width: 564upx;
			transition: opacity 200ms ease-in;
		}

		&-content {
			position: relative;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			color: #303133;
			font-size: 36upx;
			width: 100%;
			height: 794upx;
			box-sizing: border-box;
			background: #ffffff;
			border-radius: 36upx;
			box-shadow: 0px 12upx 0px 0px rgba(53, 123, 235, 1);

			.close-dialog {
				position: absolute;
				width: 100upx;
				height: 100upx;
				top: -140upx;
				right: -50upx;
				border-radius: 50%;
				background: transparent;

				&-img {
					display: block;
					width: 57upx;
					height: 57upx;
					text-align: center;
					line-height: 57upx;
					border-radius: 50%;
					color: #ffffff;
					font-size: 40upx;
					font-weight: 100;
					border: 2upx solid #ffffff;
				}
			}
		}
	}

	.auction-frequency-title {
		position: absolute;
		top: -70upx;
		left: 136upx;
		width: 282upx;
		height: 92upx;
		line-height: 72upx;
		text-align: center;
		font-size: 44upx;
		font-family: PingFang-SC-Heavy;
		font-weight: 700;
		color: rgba(255, 255, 255, 1);
		background: url('~@/static/index/auction_card_back_1.png') no-repeat;
		background-size: contain;
	}

	.auction-card {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;

		&-box {
			flex: 1;
			text-align: center;
			width: 100%;
		}

		&-confirm {
			display: flex;
			align-items: center;
			justify-content: center;

			.auction-card-btn {
				position: relative;
				width: 254upx;
				height: 68upx;
				line-height: 68upx;
				background: #FFA200;
				border: 4upx solid #222A55;
				border-radius: 68upx;
				font-size: 32upx;
				font-family: PingFang-SC-Heavy;
				font-weight: 800;
				color: rgba(255, 255, 255, 1);
			}
		}
	}

	.auction-text {
		padding: 0 34upx;
		margin-top: 20upx;
		font-size: 28upx;
		font-family: PingFang-SC-Bold;
		font-weight: bold;
		color: rgba(10, 63, 136, 1);

		>text {
			font-size: 32upx;
			font-family: PingFang-SC-Bold;
			font-weight: bold;
			color: #FFA200;
			line-height: 50upx;
		}
	}

	.card-btn-icon {
		position: absolute;
		left: 16upx;
		top: 6upx;
		width: 62upx;
		height: 24upx;
		border-top-left-radius: 23upx;
		border: 3upx solid rgba(244, 252, 255, 1) {
			right: 0;
			bottom: 0
		};
	}

	.opportunity {
		padding-top: 84upx;

		&-img {
			width: 140upx;
			height: 140upx;
			border-radius: 50%;
			margin: 0 auto;
			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.frequency {
		padding-top: 64upx;

		&-img {
			position: relative;
			width: 152upx;
			height: 158upx;
			line-height: 100upx;
			margin: 0 auto;
			display: flex;
			justify-content: center;
			align-items: center;
			background: url('~@/static/index/auction_card_back_2.png') no-repeat;
			background-size: contain;

			image {
				width: 66upx;
				height: 80upx;
				margin-bottom: 34upx;
			}

			text {
				position: absolute;
				left: 14upx;
				top: 74upx;
				display: block;
				text-align: center;
				font-size: 28upx;
				font-family: PingFang-SC-Medium;
				font-weight: 500;
				color: rgba(255, 234, 0, 1);
			}
		}
	}
</style>
