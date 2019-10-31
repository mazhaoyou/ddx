<!--	
	竞拍列表页-H5
	薛毅飞 
-->
<template>
	<view class="uni-tab-bar">
		<!-- 可滑动导航-start -->
		<scroll-view 
			id="nav-bar" 
			class="uni-swiper-tab" 
			scroll-x 
			scroll-with-animation
			:scroll-left="scrollLeft"
		>
			<view 
				v-for="(item,index) in tabBars" 
				:key="item.id" 
				:class="['swiper-tab-list',tabCurrentIndex==index ? 'active' : '']" 
				:id="'tab'+index"
				@click="changeTab(index)"
			>
				<image
					:src="tabImg[index]"
				></image>
				<text>{{item.name}}</text>
			</view>
		</scroll-view>
		<!-- 可滑动导航-end -->
		<uni-segmented-control 
			:current="current" 
			:values="items" 
			@clickItem="onClickItem"
		></uni-segmented-control>
		<!-- 下拉刷新组件 -->
		<mix-pulldown-refresh 
			ref="mixPulldownRefresh" 
			:top="246" 
			@refresh="refreshList"
			@setEnableScroll="setEnableScroll"
		>
			<swiper 
				class="swiper-box" 
				:duration="duration" 
				:current="tabCurrentIndex" 
				@change="changeTab"
			>
				<swiper-item 
					v-for="tabItem in tabBars" 
					:key="tabItem.id"
				>
					<scroll-view 
						class="panel-scroll-box" 
						enable-back-to-top="true"
						v-for="(item, index) in tabItem.listArr" 
						:key="item.activity_id"
						scroll-y v-show="current === index"
						@scrolltolower="index!==0?loadList():''"
					>
						<goods-item 
							:goodsList="item.list" 
							:current="current"
						></goods-item>
						<mix-load-more v-if="index !== 0" :status="item.loadMoreStatus"></mix-load-more>
					</scroll-view>
				</swiper-item>
			</swiper>
		</mix-pulldown-refresh>
	</view>
</template>

<script>
	
		// <image style="width:500px;height:500px" src="http://i2.bvimg.com/684148/a04431584cf0c455.png"></image>
	import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue';
	import goodsItem from '@/components/goods-item/goods-item.vue';
	import mixPulldownRefresh from '@/components/mix-pulldown-refresh/mix-pulldown-refresh';
	import mixLoadMore from '@/components/mix-load-more/mix-load-more';
	let windowWidth = 0, 
		scrollTimer = false, 
		tabBar,
		url = 'https://www.easy-mock.com/mock/5c9c95ec62bba3393e6e7432/xgyx/';
	export default {
		components: {
			uniSegmentedControl,
			goodsItem,
			mixPulldownRefresh,
			mixLoadMore
		},
		data() {
			return {
				tabCurrentIndex: 0,
				scrollLeft: 0,
				current: 0,
				duration: 200,
				goodsUrl: "",
				loadingText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				},
				newsitems: [],
				tabImg: [],
				items: [
					{
						title: "正在热拍",
						url: "hotShot"
					},
					{
						title: "即将开始",
						url: "aboutBegin"
					},
					{
						title: "往期成交",
						url: "clinchDeal"
					}
				],
				tabBars: [],
				enableScroll: true
			}
		},
		onLoad: function() {
			const self = this;
			self.goodsUrl = url + self.items[0].url
			// 获取屏幕宽度
			windowWidth = uni.getSystemInfoSync().windowWidth;
			self.loadTabbars();
			
		},
		onPullDownRefresh() {
			this.refreshList();
		},
		methods: {
			clickCollection() { //收藏
				
			},
			onClickItem(index) {
				const self = this;
				let tabItem = self.tabBars[self.tabCurrentIndex].listArr[self.current];
				if (self.current !== index) {
					self.current = index;
					self.goodsUrl = url + self.items[index].url;
					tabItem.list = [];
					tabItem.loadMoreStatus = 0;
					self.loadList();
				};
			},
			getElSize(id) { //得到元素的size
				return new Promise((res, rej) => {
					uni.createSelectorQuery().select('#' + id).fields({
						size: true,
						scrollOffset: true
					}, (data) => {
						res(data);
					}).exec();
				});
			},
			//点击切换
			clickTab(e){
				this.duration = 0;
				this.tabCurrentIndex = e; 
			},
			//滑动切换
			async changeTab(e){
				if(scrollTimer){
					//多次切换只执行最后一次
					clearTimeout(scrollTimer);
					scrollTimer = false;
				};
				this.onClickItem(0);
				let index = e;
				//e=number为点击切换，e=object为swiper滑动切换
				if(typeof e === 'object'){
					index = e.detail.current
				}
				if(typeof tabBar !== 'object'){
					tabBar = await this.getElSize("nav-bar")
				}
				//计算宽度相关
				let tabBarScrollLeft = tabBar.scrollLeft;
				let width = 0; 
				let nowWidth = 0;
				//获取可滑动总宽度
				for (let i = 0; i <= index; i++) {
					let result = await this.getElSize('tab' + i);
					width += result.width+15;
					if(i === index){
						nowWidth = result.width;
					}
				};
				//切换icon
				if (this.tabCurrentIndex !== index) {
					this.tabImg[this.tabCurrentIndex] = this.tabBars[this.tabCurrentIndex].imgUrl;
					this.tabImg[index] = this.tabBars[index].imgUrlSelected;
				};
				this.tabCurrentIndex = index; 
				//延迟300ms,等待swiper动画结束再修改tabbar
				scrollTimer = setTimeout(()=>{
					if (width - nowWidth/2 > windowWidth / 2) {
						//如果当前项越过中心点，将其放在屏幕中心
						this.scrollLeft = width - nowWidth/2 - windowWidth / 2;
					}else{
						this.scrollLeft = 0;
					}
					
					//第一次切换tab，动画结束后需要加载数据
					let tabItem = this.tabBars[this.tabCurrentIndex];
					if(this.tabCurrentIndex !== 0 && tabItem.loaded !== true){
						this.loadList();
						tabItem.loaded = true;
					}
				}, 0);
			},
			//获取分类
			loadTabbars(){
				const self = this;
				uni.request({
					url: url + 'biddingListBar',
					method: 'POST',
					data: {},
					success: (res) => {
						res = res.data;
						if(res.code){
							res.data.forEach(item=>{
								item.listArr = [];
								for(let i = 0; i < 3; i++){
									item.listArr.push({
										list: [],
										loadMoreStatus: 0, //加载更多 0加载前，1加载中，2没有更多了
										refreshing: 0
									})
								};
							});
							self.tabBars = res.data;
							self.loadList();
							for( let [index, item] of self.tabBars.entries() ){
								index == 0 ? self.tabImg.push(item.imgUrlSelected) : self.tabImg.push(item.imgUrl);
							};
						}else{
							
						};
					},
					fail: () => {
						console.log('失败')
					}
				});
			},
			//刷新列表
			refreshList(){
				let self = this,
					tabItem;
				tabItem = self.tabBars[self.tabCurrentIndex].listArr[self.current];
				tabItem.refreshing = true;
				// #ifdef APP-PLUS
				// #endif
				console.log('下拉请求'+this.current);
				setTimeout(function(){
					uni.request({
						url: self.goodsUrl,
						method: 'POST',
						data: {},
						success: (res) => {
							res = res.data;
							if(res.code = 200){
								tabItem.list = res.data.activity_list;
								self.$refs.mixPulldownRefresh && self.$refs.mixPulldownRefresh.endPulldownRefresh();
								tabItem.refreshing = false;
								// #ifdef APP-PLUS
								uni.stopPullDownRefresh();
								// #endif
								tabItem.loadMoreStatus = 0;
							}else{
								
							};
						}
					});
				},200);
			},
			// 加载
			loadList(){
				let self = this,
					tabItem;
				tabItem = this.tabBars[this.tabCurrentIndex].listArr[this.current];
				if(tabItem.loadMoreStatus === 2) return;
				tabItem.loadMoreStatus = 1;
				console.log('上拉加载'+this.current);
				setTimeout(function(){
					uni.request({
						url: self.goodsUrl,
						method: 'POST',
						data: {},
						success: (res) => {
							res = res.data;
							if(res.code == 200){
								res.data.activity_list.forEach(item=>{
									tabItem.list.push(item);
								});
								tabItem.loadMoreStatus = tabItem.list.length > 40 ? 2: 0;
							}else{
								
							};
						}
					});
				},200);
			},
			//设置scroll-view是否允许滚动，在小程序里下拉刷新时避免列表可以滑动
			setEnableScroll(enable){
				if(this.enableScroll !== enable){
					this.enableScroll = enable;
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	/* #ifdef MP-ALIPAY */
	.swiper-tab-list {
		display: inline-block;
	}
	/* #endif */
	uni-page-body,
	.uni-tab-bar{
		height: 100%;
		background: $color-grey;
	}
	.uni-tab-bar .swiper-box{
		height: calc(100% - 246upx);
	}
	.panel-scroll-box{
		height: 100%;
	}
	// 可滑动导航-start
	.uni-swiper-tab{
		padding: 28upx;
		height: 162upx;
		box-sizing: border-box;
		border-top: 1px solid #e6e6e6;
		border-bottom: 0;
		background: $color-white;
		position: relative;
		z-index: 2;
	}
	.swiper-tab-list{
		width: 152upx;
		height: 108upx;
		background: $color-grey;
		border-radius:7px;
		text-align: center;
		padding: 14upx;
		box-sizing: border-box;
		margin-right: 15px;
		&:last-child{
			margin-right: 0;
		}
		&.active{
			background:linear-gradient(-50deg,rgba(254,148,2,1),rgba(255,194,11,1));
			text{
				color: $color-white;
			}
		}
		image{
			width: 36upx;
			height: 36upx;
			margin-bottom: 4upx;
		}
		text{
			display: block;
			font-size: $font-size-28;
			font-weight: 500;
			color: $color-black;
			line-height: 1;
			text-align: center;
		}
	}
	// 可滑动导航-end
	
	
	/* 新闻列表  emmm 仅供参考 */
	.news-item{
		width: 750upx;
		padding: 24upx 30upx;
		border-bottom-width: 1px;
		border-color: #eee;
		background-color: #fff;
	}
	.title{
		font-size: 32upx;
		color: #303133;
		line-height: 46upx;
	}
	.bot{
		flex-direction: row;
	}
	.author{
		font-size: 26upx;
		color: #aaa;
	}
	.time{
		font-size: 26upx;
		color: #aaa;
		margin-left: 20upx;
	}
	.img-list{
		flex-shrink: 0;
		flex-direction: row;
		background-color: #fff;
		width: 220upx;
		height: 140upx;
	}
	.img-wrapper{
		flex: 1;
		flex-direction: row;
		height: 140upx
	}
	.img{
		flex: 1;
	}
	.img-empty{
		height: 20upx;
	}
</style>
