<template>
	<!-- 幸运榜单组件 -->
	<view class="luck-wrapper">
		<view  v-for="(item, index) in activityList" :key="index">
		<view class="tabdiv-list-area" @tap="skipAuctionDetails($event)">
			<view class="tabdiv-list-left">
				<image class="list-left-tag" :src="imgUrl[index]" lazy-load></image>
				<image class="tabdiv-left-img"  :src="item.headPicUrl" lazy-load ></image>
				<!-- <image class="tabdiv-left-img" v-if="!item.frameUrl" :src="item.frameUrl" lazy-load mode=""></image> -->
			</view>
			<view class="tabdiv-list-middle">
				<view class="tabdiv-middle-top">
					<view class="tabdiv-middle-top-left">{{ item.nickname }}</view>
					<view class="tabdiv-middle-top-right">
						以
						<text class="top-right-num">{{ item.returnAmount }}</text>
						福豆拍中
					</view>
				</view>
				<view class="tabdiv-middle-bottom">{{ item.goodsName }}</view>
			</view>
			<view class="tabdiv-list-right">
				<lazy-image class="list-right-img" :realSrc="item.goodsThumbnail" :placeholdSrc="placeholderSrc"></lazy-image>
				<!-- <image class="list-right-img" :src="item.goods_thumbnail" lazy-load mode=""></image> -->
			</view>
		</view>
	</view>
	</view>
</template>

<script>
import lazyImage from '@/components/lazy-image/lazy-image';

export default {
	components:{
		lazyImage
	},
	props: {
		activityList: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	data() {
		return {
			placeholderSrc: '../../static/60x60.png',
			imgUrl: [
				"../../static/index/gold_medal.png",
				"../../static/index/silver_mwdal.png",
				"../../static/index/bronze_medal.png"
			] // 第一二三名的角标显示的url地址
		};
	},
	onLoad() {},
	onReady() {},
	methods: {
		skipAuctionDetails(event) {
			uni.navigateTo({
				url: '../../pages/auction-detailsed/auction-detailsed'
			});
		},
	}
};
</script>

<style lang="scss" scoped>
.placeholder {
	opacity: 1;
	transition: opacity 0.4s linear;
}
.luck-wrapper {
	width: 100%;
	min-height: 100%;
}

.tabdiv-list-area {
	height: 152upx;
	margin: 0 25upx;
	border-bottom: 1upx solid #eeeeee;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;

	.tabdiv-list-left {
		width: 88upx;
		height: 88upx;
		position: relative;

		.list-left-tag {
			width: 62upx;
			height: 50upx;
			display: block;
			z-index: 10;
			position: absolute;
			top: -20upx;
			left: -6upx;
		}

		.tabdiv-left-img {
			display: block;
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}
	}

	.tabdiv-list-middle {
		margin-left: 24upx;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		flex: 1;

		.tabdiv-middle-top {
			width: 100%;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			margin-bottom: 14upx;

			.tabdiv-middle-top-left {
				width: 150upx;
				font-size: 28upx;
				line-height: 28upx;
				color:rgba(51,51,51,1);
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.tabdiv-middle-top-right {
				margin-left: 24upx;
				font-size: 28upx;
				line-height: 28upx;
				color:rgba(51,51,51,1);

				.top-right-num {
					color: #fc7517;
					padding: 0 10upx;
				}
			}
		}

		.tabdiv-middle-bottom {
			width: 430upx;
			text-align: left;
			font-size: 24upx;
			margin-top: 14upx;
			color: rgb(153, 153, 153);
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	.tabdiv-list-right {
		width: 108upx;
		height: 108upx;

		.list-right-img {
			width: 100%;
			height: 100%;
			display: block;
		}
	}
}
</style>
