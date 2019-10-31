<template>
	<!--
	*  商品详情
	* wux
	* commodityDetails为商品详情图片数据
	*  -->
	<view class="activity-details-container">
		<view class="activity-title">
			商品详情
		</view>
		<view class="activity-img" v-for="(item,index) in commodityDetails" :key="index">
			<image :src="item.goodsPictureAddress" lazy-load mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		commodityDetails: {
			type: Array,
			default() {
				return [];
			}
		},
	},
	data() {
		return {
			
		}
	}
}
</script>
<style lang="scss">	
	.activity-details-container {
		padding: 0 $padding50;
	}
	
	.activity-title {
		color: #333333;
		font-size: 36upx;
		font-weight: 500;
		padding: 44upx 0;
	}
	
	.activity-img {
		margin-top: -5upx;
		image {
			width: 100%;
		}
	}
	
	
</style>
