<template>
	<!-- 最近10个竞拍者列表 @mazy
	* 
	* -->
	<view class="recently-content">
		<view class="recently-info">
			<text class="user-info">用户</text>
			<text class="price-info">出价</text>
			<text class="addr-info">位置</text>
		</view>
		<view v-for="(item, index) in recentlyUser" :key="index">
			<view class="recently-user">
				<view class=" box portrait_img " >
					<image :src="item.headPicUrl" mode=""></image>
					<text class="uni-ellipsis">{{ item.nickname }}</text>
				</view> 
				<view class="box market-price">¥{{ item.price }}</view>
				<view class="box user-location">{{ item.city }}</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		recentlyUser: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	data() {
		return {};
	}
};
</script>

<style lang="scss">
.recently-content {
	display: flex;
	flex-direction: column;
	.recently-info {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-content: center;
		align-items: center;
		padding-top: 12upx;
		padding:0 $padding50;
		border-top: 1px solid #E5E5E5;
		font-size: 24upx;
		font-family: PingFangSC-Regular;
		font-weight: 500;
		color: #333;
		line-height: 36upx;
		
		.user-info {
			display: inline-block;
			padding-top: 12upx;
			width: 40%;
			text-align: left;
		}
		
		.price-info {
			display: inline-block;
			padding-top: 12upx;
			width: 30%;
			text-align: center;
		}
		
		.addr-info {
			display: inline-block;
			padding-top: 12upx;
			width: 30%;
			text-align: right;
		}
	}
}
.recently-user {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin-top: 20upx;
	padding:0 $padding50;
	.portrait_img {
		width: 40%;
		display: flex;
		align-items: center;
		image {
			width: 58upx;
			height: 58upx;
			border-radius: 100%;
			margin-right: 26upx;
		}
		text {
			font-size: 24upx;
			font-family: PingFangSC-Regular;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
			max-width: 150upx;
			overflow: hidden;
		}
	}
	.market-price {
		width: 30%;
		text-align: center;
		font-size: 24upx;
		font-family: PingFangSC-Regular;
		font-weight: 400;
		color: rgba(250, 80, 61, 1);
		align-self: center;
	}
	.user-location {
		width: 30%;
		text-align: right;
		font-size: 24upx;
		font-family: PingFangSC-Regular;
		font-weight: 400;
		color: rgba(102, 102, 102, 1);
		align-self: center;
	}
}
</style>
