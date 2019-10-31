<template>
	<!-- 福豆规则页面 -->
	<view class="beans-rule-wrapper">
		<!-- 一像素的顶部线开始 -->
		<view class="beans-detail-area">
			<view class="border-side"></view>
		</view>
		<!-- 一像素的顶部线结束 -->
		<!-- 内容展示区域开始 -->
		<view class="beans-rule-content">
			<rich-text :nodes="breansRulesList"></rich-text>
		</view>
		<!-- 内容展示区域结束 -->
	</view>
</template>

<script>
	export default {
		components: {
			
		},
		data() {
			return {
				breansRulesList: "" // 福豆规则
			}
		},
		onLoad() {
			let ruleData = {
				informationType: 2
			}
			this.beansRoules(ruleData);
		},
		onReady() {
			
		},
		methods: {
			beansRoules(data) {
				let that = this;
				let breansRoules = this.$storage.getStorage("breansRoulesList", 2);
				that.breansRulesList = breansRoules;
				this.$api.getInformation(data).then(res => {
					res = res.data;
					if (res.code == '0001') {
						let rulesData = res.data;
						if (!that.$util.contrastArray(rulesData.information, breansRoules)) {
							that.breansRulesList = rulesData.information;
							that.$storage.setStorage('breansRoulesList', rulesData.information, 2);
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
	.beans-rule-wrapper {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		background-color: #fff;
	}
	.beans-detail-area {
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
	.beans-rule-content {
		width: 700upx;
		height: auto;
		padding: 25upx 25upx;
		line-height: 46upx;
	}
</style>
