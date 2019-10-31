<template>
	<!-- 签到规则页面 -->
	<view class="sign-rule-wrapper">
		<!-- 一像素的顶部线开始 -->
		<view class="sign-detail-area">
			<view class="border-side"></view>
		</view>
		<!-- 一像素的顶部线结束 -->
		<view class="sign-rule-content">
			<rich-text :nodes="signInRulesList"></rich-text>
		</view>
	</view>
</template>

<script>
	export default {
		components: {
			
		},
		data() {
			return {
				signInRulesList: "" //福利社规则
			}
		},
		onLoad() {
			let ruleData = {
				informationType: 6
			}
			this.signInRoules(ruleData);
		},
		onReady() {
			
		},
		methods: {
			signInRoules(data) {
				let that = this;
				let signInRoules = this.$storage.getStorage("signInRoulesList", 2);
				that.signInRulesList = signInRoules;
				this.$api.getInformation(data).then(res => {
					res = res.data;
					if (res.code == '0001') {
						let rulesData = res.data;
						if (!that.$util.contrastArray(rulesData.information, signInRoules)) {
							that.signInRulesList = rulesData.information;
							that.$storage.setStorage('signInRoulesList', rulesData.information, 2);
						}
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						});
					}
				})
				.catch(err => {
					uni.showToast({
						title: '服务异常',
						icon: "none"
					});
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.sign-rule-wrapper {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		background-color: #fff;
	}
	.sign-detail-area {
		width: 100%;
		height: 1upx;
		background-color: #fff;
		display: flex;
		flex-direction: row;
		justify-content: cneter;
		align-items: center;
		position: relative;
		.border-side {
			width: 100%;
			height: 1upx;
			background-color: #F2F4F5;
			position: fixed;
			top: 0;
			left: 0;
		}
	}
	.sign-rule-content {
		width: 700upx;
		height: auto;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-content: center;
		line-height: 46upx;
		padding: 25upx 25upx;
	}
</style>
