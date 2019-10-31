<template>
	<!-- 
	* 	新人福豆领取后提示去完善资料弹窗
	* 	wux
	* 	collectionFlag 为福豆领取弹窗开关变量
	* -->
	<!-- 福豆领取后弹窗 -->
	<view class="success-collect" v-if="collectionFlag">
		<!-- 遮罩层 -->
		<view class="success-collect-mask"></view>
		<view class="success-collect-container">
			<!-- 内容部分 -->
			<view class="success-collect-content">
				<view class="success-content-text">
					<text>10</text>福豆新人红包已放入您的账户，通过完善个人资料可以获得更多福豆哦！
				</view>
				<view class="success-content-btn">
					<view class="talk-later" @tap="talkLater()" >
						<view class="left-top-icon"></view>
						以后再说
					</view>
					<view class="perfect-information" @tap="perfectInformation()" >
						<view class="left-top-icon"></view>
						完善资料
					</view>
				</view>
			</view>
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
			collectionFlag() {
				return this.$store.state.collectionFlag;
			}
		},
		methods: {
			/* 以后再说 */
			talkLater() {
				this.$store.commit('changeCollectionFlag', false);
				setTimeout(() => {
					uni.showTabBar();
				}, 300)
			},
			/* 完善资料 */
			perfectInformation() {
				// 点击去完善资料时关闭当前弹窗、显示TabBar
				this.$store.commit('changeCollectionFlag', false);
				uni.showTabBar();
				// 进入编辑资料界面完善资料
				uni.navigateTo({
					url: '../../pages/edit-information/edit-information'
				})
			}
		}
	}
</script>

<style lang="scss">
	.success-collect {
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
			justify-content: center;
			align-items: center;
			color: #303133;
			font-size: 36upx;
			width: 564upx;
			height: 376upx;
			margin: 0 auto;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0upx 12upx 0upx 0upx rgba(53, 123, 235, 1);
			border-radius: 36upx;
		}
	}

	.success-content-text {
		padding: 0 20upx;
		color: #0A3F88;
		font-size: 30upx;
		line-height: 60upx;

		text {
			font-size: 40upx;
			font-family: PingFang-SC-Heavy;
			font-weight: 800;
			color: rgba(239, 110, 3, 1);
			color: #EF6E03;
			margin-right: 20upx;
		}

		+.success-content-btn {
			width: 100%;
			margin-top: 70upx;
			display: flex;
			flex-direction: row;
			justify-content: space-around;

			> view {
				position: relative;
				width: 176upx;
				height: 60upx;
				line-height: 60upx;
				text-align: center;
				border: 3upx solid rgba(34, 42, 85, 1);
				border-radius: 32upx;
				font-size: 28upx;
				font-family: PingFang-SC-Bold;
				font-weight: bold;
				color: rgba(255, 255, 255, 1);
			}

			.talk-later {
				background: #38ADFF;
				box-shadow: 0upx 6upx 0upx 0upx #38ADFF;
			}

			.perfect-information {
				background: #FCC653;
				box-shadow: 0upx 6upx 0upx 0upx #FCC653;
			}
		}
	}

	.left-top-icon {
		position: absolute;
		left: 10upx;
		top: 4upx;
		width: 60upx;
		height: 20upx;
		border-top-left-radius: 30upx;
		border: 2upx solid #ffffff {
			right: 0;
			bottom: 0
		};
	}
</style>
