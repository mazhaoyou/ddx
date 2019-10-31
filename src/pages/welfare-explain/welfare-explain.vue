<template>
	<!-- 福利说明页面 -->
	<view class="welfare-explain-wrapper">
		<!-- 一像素的顶部线开始 -->
		<view class="beans-detail-area">
			<view class="border-side"></view>
		</view>
		<!-- 一像素的顶部线结束 -->
		<view class="welfare-explain-content">
			<rich-text :nodes="welfareRulesList"></rich-text>
		</view> 
	</view>
</template>

<script>
	
	export default {
		components: {
			
		},
		data() {
			return {
				welfareRulesList: "" //福利社规则
			}
		},
		onLoad() {
			let ruleData = {
				informationType: 3
			}
			this.welfareRoules(ruleData);
		},
		methods: {
			welfareRoules(data) {
				let that = this;
				let welfareRoules = this.$storage.getStorage("welfareRoulesList", 2);
				that.welfareRulesList = welfareRoules;
				this.$api.getInformation(data).then(res => {
					res = res.data;
					if (res.code == '0001') {
						let rulesData = res.data;
						if (!that.$util.contrastArray(rulesData.information, welfareRoules)) {
							that.welfareRulesList = rulesData.information;
							that.$storage.setStorage('welfareRoulesList', rulesData.information, 2);
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
		},
		computed: {
			
		}
	}
</script>

<style lang="scss" scoped>
	.welfare-explain-wrapper {
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
	.welfare-explain-content {
		width: 700upx;
		height: auto;
		padding: 25upx 25upx;
		line-height: 46upx;
	}
</style>
