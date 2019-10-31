<template>
	<!-- 抽奖规则
	* wux
	* lotteryRulesList 抽奖规则数据
	*  -->
	<!-- 抽奖规则数据 -->
	<view>
		<view class="lottery-rules">
			<view class="lottery-rules-list">
				<rich-text :nodes="lotteryRulesList"></rich-text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			lotteryRulesList: {
				type: String,
				default () {
					return '';
				}
			}
		},
		data() {
			return {

			}
		}
	}
</script>

<style lang="scss">
	.lottery-rules {
		width: 687upx;
		padding: 20upx 0;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 7upx;

		&-list {
			line-height: 46upx;
			padding: 0 36upx;
		}
	}
</style>
