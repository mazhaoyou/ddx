<template>
	<!-- 未中奖弹窗显示组件
	* wux
	* noPrizeFlag为true显示，为false隐藏
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
				<view class="luck-not-logo">
					<image src="../../static/lucky_draw/luck_not_logo.png" mode=""></image>
				</view>
				<view class="luck-not-text">对不起，运气似乎放假去了</view>
			</view>
			<!-- 确定按钮 -->
			<view class="luck-draw-btn" @tap="closeDialog()">确&nbsp;定</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {

		},
		data() {
			return {

			};
		},
		computed: {
			isShow() {
				return this.$store.state.noPrizeFlag;
			}
		},
		methods: {
			/* 关闭弹窗 */
			closeDialog() {
				this.$store.commit('changePrizeFlag', false);
			}
		}
	};
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
			background: rgba(0, 0, 0, 0.8);
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
			height: 750upx;
			padding-top: 150upx;
			box-sizing: border-box;
			background: url('~@/static/lucky_draw/luck_not_back.png') no-repeat;
			background-size: cover;
			background-position: center;

			.close-dialog {
				position: absolute;
				width: 100upx;
				height: 100upx;
				top: 134upx;
				right: 0;
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

	.luck-not-logo {
		width: 164upx;
		height: 244upx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.luck-head-title {
		position: absolute;
		top: 144upx;
		left: 164upx;
		width: 360upx;
		height: 98upx;
		background: url('~@/static/lucky_draw/no_prize.png') no-repeat;
		background-size: contain;
	}
	
	.luck-not-text {
		font-size: 32upx;
		font-family: PingFang-SC-Bold;
		font-weight: bold;
		color: rgba(255, 160, 9, 1);
		line-height: 62upx;
	}

	.luck-draw-btn {
		position: absolute;
		bottom: -80upx;
		left: 208upx;
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
