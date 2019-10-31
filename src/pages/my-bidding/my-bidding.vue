<!--	
	我的竞拍活动
	薛毅飞 
-->
<template>
	<view class="my-bidding">
		<view class="tabBars">
			<view
				class="tabBars-item"
				v-for="(item, index) in tabBars"
				:key="index"
				:class="[ current == index ? 'tabBars-item-acitve' : '' ]"
				@tap="tabBarsTap(index)"
			>{{item.text}}</view>
			<view class="tabBars-active" ref="tabBarsActive" :style="{left: tabBarsLeft + 'px'}"></view>
		</view>
		<!-- 下拉刷新组件 -->
		<mix-pulldown-refresh 
			ref="mixPulldownRefresh" 
			:top="84" 
			@refresh="refreshList"
		>
			<swiper class="swiper-box" :current="current" @change="changeTab">
				<swiper-item v-for="(item, index) in tabBars" :key="index">
					<scroll-view class="panel-scroll-box">
						<my-goods-item :goodsList="item.goodsList"></my-goods-item>
					</scroll-view>
				</swiper-item>
			</swiper>
		</mix-pulldown-refresh>
	</view>
</template>

<script>
	import mixPulldownRefresh from '@/components/mix-pulldown-refresh/mix-pulldown-refresh';
	let windowWidth = uni.upx2px(750);
	export default {
		components: {
			mixPulldownRefresh,
		},
		data() {
			return {
				tabBarsLeft: 0,
				current: 0,
				tabBars: [
					{
						text: "正在拍",
						id: "getMyBiddingList"
					},
					{
						text: "我拍中",
						id: "getMyWonBidList"
					},
					{
						text: "未拍中",
						id: "getMyFailedBidList"
					},
					{
						text: "已关注",
						id: "getMyConcernedBidList"
					},
					{
						text: "已委托",
						id: "getMyCommissionBidList"
					}
				],
				items: [
					{
						"activity_id": 2,
						"act_icon": "",
						"goods_thumbnail": "https://img10.360buyimg.com/n2/s240x240_jfs/t1/18637/30/1292/71267/5c10d443E6e9cfa06/f79444f7043e6be1.jpg!q70.jpg",
						"goods_name": "戴森(Dyson) 吹风机 Supersonic 电吹风",
						"market_price": 2950.00,
						"forbidden_price": 5.00,
						"warning_percentage": 100,
						"consumption_bean": 25,
						"commission_bean": 125,
						"count_down": "09",
						"current_price": 12.93
					},
					{
						"activity_id": 1, //活动id
						"act_icon": "", //活动角标缩略图url
						"goods_thumbnail": "https://img13.360buyimg.com/n2/s240x240_jfs/t10675/253/1344769770/66891/92d54ca4/59df2e7fN86c99a27.jpg!q70.jpg", //缩略图
						"goods_name": "Apple iPhone X", //商品名称
						"market_price": 6199.00, //市场价
						"forbidden_price": 5.00, //禁赛价
						"warning_percentage": 20, //预警百分比
						"consumption_bean": 25, //消耗
						"commission_bean": 125, //委托
						"count_down": "08", //倒计时
						"current_price": 1.88 //当前价
					}
				]
			}
		},
		onLoad(option) {
			const self = this;
			//获取可用宽
			// #ifdef APP-PLUS
			windowWidth = uni.getSystemInfoSync().windowWidth;
			// #endif
			//获取页面参
			console.log(option.index)
			if( option.index ) self.current = option.index;
			//设置当前选中tab
			self.tabBarsLeft = (windowWidth / 5) * self.current + (windowWidth / 5 / 3.5);
			
			for( let i = 0; i < self.tabBars.length; i++ ){
				self.tabBars[i].goodsList = self.items;
			};
		},
		methods: {
			tabBarsTap(index) {
				const self = this;
				if( self.current !== index ){
					self.tabBarsLeft = (windowWidth / 5) * index + (windowWidth / 5 / 3.5);
					self.current = index;
					self.loadList();
				}
			},
			async changeTab(e){
				const self = this;
				self.tabBarsTap(e.target.current);
			},
			refreshList() {
				setTimeout(function(){
					self.$refs.mixPulldownRefresh && self.$refs.mixPulldownRefresh.endPulldownRefresh();
				},1000);
			},
			loadList() {
				const self = this;
				console.log(self.$api)
			},
			getElSize(id) { //得到元素的size
				return new Promise((res, rej) => {
					uni.createSelectorQuery().select("#" + id).fields({
						size: true,
						scrollOffset: true
					}, (data) => {
						res(data);
					}).exec();
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	view,
	uni-page,
	uni-page-body,
	.my-bidding,
	.panel-scroll-box{
		height: 100%;
	}
	.my-bidding .swiper-box{
		height: calc(100% - 84upx);
	}
	.tabBars{
		height: 84upx;
		background: $color-grey;
		display: flex;
		position: relative;
	}
	.tabBars-item{
		flex: 1;
		font-size: $font-size-28;
		line-height: 76upx;
		color: $color-black;
		text-align: center;
		&.tabBars-item-acitve{
			color: $color-orange;
		}
	}
	.tabBars-active{
		width: 66upx;
		height: 8upx;
		background: $color-orange;
		border-radius: 4upx;
		position: absolute;
		bottom: 0;
		left: 40upx;
		transition: .3s;
	}
	
	
</style>
