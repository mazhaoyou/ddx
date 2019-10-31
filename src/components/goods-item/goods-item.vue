<template>
	<view>
		<view 
			class="goods-item" 
			hover-class="goods-item-hover"
			v-for="(item, index) in goodsList" 
			:key="item.activity_id" 
		>
			<view class="goods-item-img">
				<image :src="item.goods_thumbnail"></image>
				<text class="goods-remaining" v-if="current !== 2 && item.consumption_bean">委托剩余{{ item.consumption_bean }}福豆</text>
				<text class="goods-consumption" v-if="current !== 2 && item.commission_bean">已消耗{{ item.commission_bean }}福豆</text>
				<text class="goods-activity-name" v-if="current !== 2">女神节</text>
				<view class="suspended-price suspended-price-not" v-if="current !== 2 && item.warning_percentage < 80">
					<text>{{ item.forbidden_price }}</text>
					<view></view>
				</view>
				<view class="suspended-price suspended-price-will" v-if="current !== 2 && item.warning_percentage > 80 && item.warning_percentage < 100">
					<text>{{ item.forbidden_price }}</text>
					<view></view>
				</view>
				<view class="suspended-price suspended-price-has" v-if="current !== 2 && item.warning_percentage == 100">
					<text>{{ item.forbidden_price }}</text>
					<view></view>
				</view>
				<view class="activity_clinch_del" v-if="current == 2"></view>
			</view>
			<view class="goods-item-info">
				<view class="goods-item-title">
					<text>{{ item.goods_name }}</text>
					<view v-if="current == 1" :class="[item.attention_status==1?'collection':'' ]" @click="clickCollection"></view>
				</view>
				<!-- 正在热拍-start -->
				<view class="goods-item-countdown" v-if="current == 0">
					出价倒计时
					<text>{{item.count_down}}</text>
					秒
				</view>
				<view class="goods-item-price" v-if="current == 0">
					<view>
						<text class="goods-current-name">当前价:</text>
						<text class="goods-current-price">{{ item.current_price }}</text>
						<text class="goods-market-price">{{ item.market_price }}</text>
					</view>
					<button class="goods-pat-btn" type="default" disabled="true" plain="true">马上拍</button>
				</view>
				<!-- 正在热拍-end -->
				<!-- 即将开始-start -->
				<view class="goods-item-opening" v-if="current == 1">
					<view>
						<text>距离开场</text>
						<view class="opening-countdown">
							<view></view>
							<text>00:30:08</text>
						</view>
					</view>
					<text>{{ item.start_time }}</text>
				</view>
				<view class="goods-item-purchase" v-if="current == 1">直购价：￥{{ item.market_price }}</view>
				<!-- 即将开始-end -->
				<!-- 往期成交-start -->
				<view class="goods-item-clinch" v-if="current == 2">
					<text>成交人：{{ item.clinch_deal_people }}</text>
					<view>
						成交价：
						<text>{{ item.clinch_deal_valence }}</text>
					</view>
				</view>
				<view class="goods-item-clinch-time" v-if="current == 2">
					<text>成交时间:{{ item.clinch_deal_time }}</text>
					<text>{{ item.market_price }}</text>
				</view>
				<!-- 往期成交-end -->
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	props: ['goodsList', 'current'],
	computed: {
		suspension(percentage) {
			return function(percentage) {
				console.log(percentage);
				let suspensionClass = null;
			};
		}
	}
};
</script>

<style lang="scss" scoped>
.goods-item {
	background: $color-white;
	padding: 38upx 28upx;
	display: flex;
	flex-wrap: nowrap;
	margin-bottom: 1px;
	&.goods-item-hover {
		background: $color-f1f1f1;
	}
}
.goods-item-img {
	width: 140upx;
	height: 150upx;
	position: relative;
	overflow: hidden;
	margin-right: 8upx;
	image {
		width: 100%;
		height: 100%;
	}
	> text {
		position: absolute;
	}
}
.goods-remaining,
.goods-consumption {
	width: 100%;
	height: 26upx;
	background: rgba(0, 0, 0, 0.3);
	left: 0;
	font-size: 16upx;
	font-weight: 500;
	color: $color-white;
	line-height: 26upx;
	text-align: center;
}
.goods-remaining {
	bottom: 0;
}
.goods-consumption {
	bottom: 28upx;
}
.goods-activity-name {
	width: 100upx;
	background: $color-orange;
	height: 20upx;
	font-size: 13upx;
	font-weight: 500;
	line-height: 20upx;
	color: $color-white;
	text-align: center;
	right: -22upx;
	top: 16upx;
	transform: rotate(45deg);
}
.goods-item-info {
	width: calc(100% - 148upx);
	flex: 1;
	display: flex;
	flex-direction: column;
	> view {
		height: 54upx;
	}
}
.goods-item-title {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	flex-direction: row;
	text {
		width: calc(100% - 40upx);
		font-size: $font-size-32;
		font-weight: 500;
		color: $color-black;
		line-height: 1;
		@include ellipsis;
	}
	view {
		width: 30upx;
		height: 30upx;
		background: url('~@/static/auction/not_collection.png') no-repeat center center;
		background-size: 30upx 30upx;
	}
	.collection {
		background: url('~@/static/auction/collection.png') no-repeat center center;
		background-size: 30upx 30upx;
	}
}
.goods-item-countdown {
	font-size: $font-size-24;
	color: $color-666;
	font-weight: 400upx;
	display: flex;
	align-items: center;
	flex-direction: row;
	text {
		width: 90upx;
		height: 52upx;
		background: #fff5e7;
		border-radius: 26upx;
		font-size: $font-size-32;
		font-weight: 500;
		line-height: 52upx;
		color: $color-FA503D;
		text-align: center;
		margin: 0 14upx;
	}
}
.goods-item-price {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	.goods-pat-btn {
		margin: 0;
		width: 155upx;
		height: 60upx;
		background: linear-gradient(-30deg, $color-FFA50D, $color-FB6C19);
		border-radius: 30upx;
		font-size: $font-size-28;
		font-weight: 400;
		color: $color-white !important;
		line-height: 60upx;
		text-align: center;
		border: none;
		&:after {
			border: none;
		}
	}
}
.goods-current-name {
	font-size: $font-size-24;
	font-weight: 500;
	color: $color-black;
}
.goods-current-price {
	font-size: $font-size-40;
	font-weight: bold;
	color: $color-FA503D;
	margin: 0 12upx;
}
.goods-market-price {
	font-size: $font-size-24;
	font-weight: 500;
	color: $color-999;
	text-decoration: line-through;
}
.goods-item-opening {
	display: flex;
	justify-content: space-between;
	align-items: center;
	fong-size: $font-size-24;
	font-weight: 400;
	color: $color-666;
	text {
		line-height: 54upx;
	}
	> view {
		display: flex;

		text {
		}
	}
	> text {
	}
	.opening-countdown {
		width: 210upx;
		height: 54upx;
		background: rgba(255, 244, 229, 1);
		border-radius: 27upx;
		font-size: $font-size-32;
		font-weight: 500;
		color: rgba(254, 149, 35, 1);
		text-align: center;
		margin-left: 14upx;
	}
}
.goods-item-purchase {
	font-size: $font-size-24;
	font-weight: 500;
	color: $color-999;
	line-height: 54upx;
}
.goods-item-clinch {
	display: flex;
	justify-content: space-between;
	align-items: center;
	> text {
		font-size: $font-size-24;
		font-weight: 500;
		color: $color-black;
	}
	> view {
		font-size: $font-size-24;
		font-weight: 500;
		color: $color-black;
		> text {
			font-size: $font-size-40;
			font-weight: bold;
			color: $color-FA503D;
		}
	}
}
.goods-item-clinch-time {
	display: flex;
	justify-content: space-between;
	align-items: center;
	text {
		font-size: $font-size-24;
		font-weight: 400;
		color: $color-999;
	}
	text:last-child {
		text-decoration: line-through;
	}
}
.activity_clinch_del {
	width: 136upx;
	height: 116upx;
	background: url('~@/static/auction/activity_clinch_del.png') no-repeat center center;
	background-size: 100% 100%;
	position: absolute;
	left: 0;
	top: 17upx;
}
</style>
