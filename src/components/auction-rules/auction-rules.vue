<template>
	<!--
	*  竞拍规则
	* auctionRulesList为竞拍规则数据
	*  -->
	<view class="auction-rules-container">
		<view class="rules-list">
			<rich-text :nodes="auctionRulesList"></rich-text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {

		},
		data() {
			return {
				auctionRulesList: ''
			}
		},
		onReady() {
			let ruleData = {
				informationType: 1
			}
			this.lookAuctionRoules(ruleData);
		},
		methods: {
			lookAuctionRoules(data) {
				let _this = this;
				let auctionRoules = this.$storage.getStorage("auctionRoulesList", 2);
				_this.auctionRulesList = auctionRoules;
				this.$api.getInformation(data)
					.then(res => {
						res = res.data;
						if (res.code == '0001') {
							let rulesData = res.data;
							if (!_this.$util.contrastArray(rulesData.information, auctionRoules)) {
								_this.auctionRulesList = rulesData.information;
								_this.$storage.setStorage('auctionRoulesList', rulesData.information, 2);
							}
						} else {
							uni.showToast({
								title: res.message
							});
						}
					})
					.catch(err => {
						uni.showToast({
							title: '服务异常'
						});
					})
			}
		}
	}
</script>

<style lang="scss">
	$padding34:34upx;

	.auction-rules-container {
		display: flex;
		flex: 1;
		flex-direction: column;
		padding: 0 $padding50 $padding34;
		border-top: 1upx solid #E5E5E5;
	}

	.rules-list {
		padding-top: $padding34;
		line-height: 46upx;
		&-title {
			font-size: 28upx;
			font-family: PingFangSC-Medium;
			font-weight: 500;
			color: rgba(255, 145, 27, 1);
			padding-top: $padding34;
		}

		&-content {
			font-size: 28upx;
			font-family: PingFangSC-Regular;
			font-weight: 400;
			color: rgba(102, 102, 102, 1);
			line-height: 46upx;
			padding-top: $padding34;
		}
	}
</style>
