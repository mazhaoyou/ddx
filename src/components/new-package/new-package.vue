<template>
	<!-- 
	* 	新人礼包弹窗 
	* 	wux
	* -->
	<view class="new-package" v-if="newPackageFlag">
		<!-- 遮罩层 -->
		<view class="new-package-mask"></view>
		<view class="new-package-container">
			<!-- 内容部分 -->
			<view class="new-package-content">
				<view class="new-package-num">10</view>
				<view class="content-tips">
					<text class="new-package-text">请确定您竞拍的时候，弹药充足！小冠君奉上10福豆。</text>
					<view class="collect-immediately" @tap="collectImmediately()">立即领取</view>
				</view>
			</view>
			<!-- 底部关闭按钮 -->
			<!-- <view class="close-dialog" @tap="closeDialog()">
				<text class="close-dialog-img"></text>
			</view> -->
		</view>
	</view>

</template>

<script>
	export default {
		props: {

		},
		data() {
			return {

			}
		},
		computed: {
			newPackageFlag() {
				return this.$store.state.packageFlag;
			}
		},
		methods: {
			/* 关闭弹窗 */
			closeDialog() {
				this.$store.commit('changePackageFlag', false);
				setTimeout(() => {
					uni.showTabBar();
				}, 300)
			},
			/* 立即领取礼品 */
			collectImmediately() {
				this.$store.commit('changePackageFlag', false);
				uni.showTabBar();
				uni.switchTab({
					url: '../../pages/auction/auction',
					success(e) {
						uni.setStorage({
							key: 'noviceField',
							data: 1
						});
						var pages = getCurrentPages();
						var page = pages[pages.length - 1];
						var currentWebview = page.$getAppWebview();
						currentWebview.reload();
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.new-package {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 1500;
		transition: visibility 200ms ease-in;
		visibility: visible;

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
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			transition: transform 0.3s;
			width: 750upx;
			transition: opacity 200ms ease-in;
		}

		&-content {
			position: relative;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			align-items: center;
			color: #303133;
			font-size: 36upx;
			width: 100%;
			height: 636upx;
			box-sizing: border-box;
			background: url('~@/static/index/new_package_back.png') no-repeat;
			background-size: contain;
			background-position: center;

			& .new-package-num {
				position: absolute;
				left: 200upx;
				top: 178upx;
				width: 116uupx;
				height: 80uupx;
				font-size: 106upx;
				font-family: PingFang-SC-Heavy;
				font-weight: 800;
				color: rgba(254, 244, 217, 1);
				text-shadow: 1upx 5upx 0upx rgba(255, 86, 19, 1);
			}

			& .content-tips {
				padding-bottom: 40upx;
				display: flex;
				flex-direction: column;
				align-items: center;
				text-align: center;
			}

			& .new-package-text {
				display: block;
				width: 468upx;
				font-size: 32upx;
				font-family: PingFang-SC-Medium;
				font-weight: 500;
				color: rgba(254, 245, 193, 1);
				line-height: 52upx;
				text-align: center;
				padding-bottom: 42upx;
			}

			& .collect-immediately {
				width: 253upx;
				height: 75upx;
				line-height: 70upx;
				text-align: center;
				font-size: 32upx;
				font-family: PingFang-SC-Bold;
				font-weight: bold;
				color: rgba(255, 255, 255, 1);
				background: linear-gradient(90deg, rgba(255, 203, 43, 1), rgba(255, 146, 0, 1));
				border-radius: 37upx;
			}
		}

		.close-dialog {
			position: absolute;
			width: 100upx;
			height: 100upx;
			display: flex;
			align-items: center;
			justify-content: center;
			left: 330upx;
			bottom: -114upx;
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
</style>
