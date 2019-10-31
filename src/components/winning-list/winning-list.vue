<template>
	<!-- 中奖名单
	* wux
	* 奖品列表数据winningListData
	*  -->
	<!-- 中奖名单列表 -->
	<view>
		<view class="winning-list">
			<view class="winning-list-li" v-for="(item,index) in winningListData" :key="index">
				<view class="li-box">
					<view class="li-box-img">
						<image :src="item.headPicUrl" mode=""></image>
					</view>
					<text class="li-box-name uni-ellipsis">{{item.nickname}}</text>
				</view>
				<text class="winning">抽中</text>
				<text class="frize uni-ellipsis">{{item.goodsName}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			winningListData: {
				type: Array,
				default () {
					return [];
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
	$padding-32:32upx;

	.winning-list {
		width: 687upx;
		min-height: 200upx;
		padding: 20upx 0; 
		background: rgba(255, 255, 255, 0.2);
		border-radius: 7upx;
	}

	.winning-list-li {
		line-height: 60upx;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: space-between;

		text {
			display: inline-block;
		}

		text.winning {
			padding: 0 20upx;
			text-align: center;
			font-size: 28upx;
			font-family: PingFang-SC-Medium;
			font-weight: 500;
			color: rgba(0, 0, 0, 1);
		}

		text.frize {
			flex: 1;
			text-align: right;
			padding-right: $padding-32;
			font-size: 24upx;
			font-family: PingFang-SC-Bold;
			font-weight: bold;
			color: rgba(250, 80, 61, 1);
		}
	}

	.li-box {
		flex: 1;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		padding-left: $padding-32;

		&-img {
			width: 38upx;
			height: 38upx;
			margin-right: $padding-32;
			border-radius: 50%;

			image {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}

		&-name {
			max-width: 180upx;
			font-size: 24upx;
			font-family: PingFang-SC-Medium;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
			line-height: 41upx;
		}
	}
</style>
