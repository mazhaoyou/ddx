<template>
	<!-- 中奖弹窗显示组件
	* 	wux
	* 	winPrizeFlag为true显示，为false隐藏
	* 	winingInfo：存放奖品信息
	* 	prizeName：奖品名称
	* 	prizeThumbnail：奖品缩略图
	* 	goodsType：奖品类型
	* 	prizeNo：奖品编号
	*  -->
	<view class="luck-dialog " :class="{ 'luck-dialog-show': isShow }" @touchmove.stop.prevent >
		<!-- 遮罩层 -->
		<view class="luck-dialog-mask"></view>
		<view class="luck-dialog-container">
			<view class="luck-dialog-content">
				<!-- 右上角关闭按钮 -->
				<view class="close-dialog" @tap="closeDialog()">
					<text class="close-dialog-img"></text>
				</view>
				<!-- 未中奖标题 -->
				<view class="luck-head-title"></view>
				<view class="luck-win-title">
					<text>恭喜您抽中了</text>
					<text>{{winingInfo.prizeName}}</text>
				</view>
				<view class="luck-win-img">
					<image lazy-load :src="winingInfo.prizeThumbnail" mode=""></image>
				</view>
			</view>
			<!-- 确定按钮 -->
			<view class="luck-draw-btn" @tap="acceptPrize()">
				欣然收下
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			winingInfo: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {

			}
		},
		computed: {
			isShow() {
				return this.$store.state.winPrizeFlag;
			}
		},
		methods: {
			/* 收下奖品 */
			acceptPrize() {
				let prizeType = this.winingInfo.prizeType;
				let prizeNo	= parseInt(this.winingInfo.prizeNo);
	
				if (prizeType == 1) {
					uni.navigateTo({
						url: '../../pages/confirm-order/confirm-order?activityId=' + prizeNo + '&orderType=' + 2
					});
				} 

				this.$store.commit('changeWinFlag', false);
			},
			/* 关闭弹窗 */
			closeDialog() {
				this.$store.commit('changeWinFlag', false);
			}
		}
	}
</script>

<style lang="scss">
	.luck-dialog {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 1500;
		transition: visibility 200ms ease-in;
		visibility: hidden;

		&.luck-dialog-show {
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
			background: rgba(0, 0, 0, .8);
			transition: opacity 200ms ease-in;
		}

		&-container {
			position: absolute;
			z-index: 1010;
			top: 40%;
			left: 50%;
			transform: translate(-50%, -50%);
			transition: transform 0.3s;
			width: 700upx;
			transition: opacity 200ms ease-in;
			padding-top: 30upx;
			padding-left: 20upx;
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
			height: 850upx;
			padding-top: 150upx;
			box-sizing: border-box;
			background: url('~@/static/lucky_draw/luck_win_back.png') no-repeat;
			background-size: cover;
			background-position: center;

			.close-dialog {
				position: absolute;
				width: 100upx;
				height: 100upx;
				display: flex;
				align-items: center;
				justify-content: center;
				top: 180upx;
				right: 16upx;
				border-radius: 50%;
				background: transparent;

				&-img {
					display: block;
					width: 57upx;
					height: 57upx;
					text-align: center;
					line-height: 57upx;
					border-radius: 50%;
					color: #FBB637;
					font-size: 40upx;
					background: url('~@/static/lucky_draw/close_img.png') no-repeat;
					background-size: cover;
				}
			}
		}
	}

	.luck-win-title {
		width: 460upx;
		margin-bottom: 68upx;
		padding-top: 60upx;

		text {
			display: block;
			width: 100%;
			text-align: center;
			line-height: 40upx;
			font-size: 28upx;
			font-family: PingFang-SC-Medium;
			font-weight: 500;
		}

		text:nth-last-child(1) {
			color: #FFA009;
		}
	}

	.luck-head-title {
		position: absolute;
		top: 234upx;
		left: 186upx;
		width: 338upx;
		height: 98upx;
		background: url('~@/static/lucky_draw/win_prize.png') no-repeat;
		background-size: cover;
	}

	.luck-win-img {
		width: 140upx;
		height: 140upx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.luck-draw-btn {
		position: absolute;
		bottom: -80upx;
		left: 228upx;
		width: 308upx;
		height: 108upx;
		text-align: center;
		line-height: 108upx;
		font-size: 32upx;
		font-family: PingFang-SC-Heavy;
		font-weight: 800;
		color: rgba(255, 255, 255, 1);
		background: url('~@/static/lucky_draw/lucky_ok.png') no-repeat;
		background-size: contain;
		border-radius: 40upx;
		z-index: 1010
	}
</style>
