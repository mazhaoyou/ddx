<template>
	<!-- 买豆记录页面 -->
	<view class="buy-beans-history-wrapper">
		<!-- 一像素的顶部线开始 -->
		<view class="beans-detail-area">
			<view class="border-side"></view>
		</view>
		<!-- 一像素的顶部线结束 -->
		<!-- 没有数据时显示的画面开始 -->
			<view class="null-data-show" v-if="newDetailList == null">
			<image class="null-data-img" src="../../static/about_us/about_logo.png" mode=""></image>
		</view>
		<!-- 没有数据的时候显示的画面结束 -->
		<!-- 购买买豆历史记录开始 -->
		<view class="buy-history-area" v-else v-for="(item, index) in newDetailList" :key="index">
			<view class="buy-history-content">
				<view class="buy-history-list">
					<view class="history-list-top">
						<view class="list-desc-up">
							<view class="desc-up-left">{{item.changeDesc}}<text class="up-left-exist" v-if="item.beanType == 0">(<text v-if="item.payChannel==1">微信支付</text><text
									 v-if="item.payChannel==2">支付宝支付</text> {{item.beanValue}}元)</text></view>
							<view class="desc-up-right">+<text>{{item.beanCount}}</text><text v-if="item.beanType==0">金豆</text><text v-if="item.beanType==1">银豆</text></view>
						</view>
					</view>
					<view class="history-list-bottom">
						<view class="list-bottom-left">{{item.changeTime | formatDate(1)}}</view>
						<!-- <view class="list-bottom-right" v-if="item.isPresent">（{{item.present}}）</view> -->
					</view>
				</view>
			</view>
		</view>
		<!-- 购买买豆历史记录结束 -->
		<view>
			<uni-load-more :status="status" :content-text="contentText" />
		</view>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				page: 1, //查询起始页数	
				len: 10, //查询数量
				newDetailList: [], //明细列表
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: 'Hi,这是我的底线啦！'
				},
				status: 'more', //上拉加载下拉刷新状态
				token: "", //用户标识
			}
		},
		onLoad() {
			// 获取token，没有跳转到登录页面
			this.token = this.$storage.isAuthed();
			if (this.token) {
				let data = {
					token: this.token,
					start: this.page,
					len: this.len,
					type: 2 //变动类型  1获取 0消费 2购买福豆
				}
				this.buyBeansHistory(data);
			}
		},
		onPullDownRefresh() {
			// console.log('下拉刷新');
			let data = {
				token: this.token,
				start: 1,
				len: this.len,
				type: 2 
			};
			this.buyBeansHistory(data);
		},
		onReachBottom() {
			this.status = 'loading'
			// console.log('上拉加载');
			let data = {
				token: this.token,
				start: this.page,
				len: this.len,
				type: 2 
			};
			this.buyBeansHistory(data);
		},
		methods: {
			/* 
			 * 买豆记录 
			 * */
			buyBeansHistory(data) {
				let buyBeanHistoryData = this.$storage.getStorage("buyBeanHistoryData");
				if (this.page == 1) {
					this.newDetailList = buyBeanHistoryData;
				}
				let _this = this;
				this.$api.getBeanDetailList(data)
					.then(res => {
						res = res.data;
						if (res.code == '0001') {
							uni.stopPullDownRefresh();
							let detailList = res.data.detailList;
							if (_this.page == 1) {
								// 对比缓存跟请求数据是否相同、如果不相等则重新缓存
								if (!_this.$util.contrastArray(detailList, buyBeanHistoryData)) {
									_this.newDetailList = detailList;
									_this.$storage.setStorage('buyBeanHistoryData', detailList);
								}
							} else {
								_this.newDetailList = _this.newDetailList.concat(detailList)
							}
							if (detailList.length >= 10) {
								_this.page++;
								_this.status = "more"
							} else if (detailList.length < 10) {
								_this.status = "noMore"
							}
							
						} else {
							uni.showToast({
								title: res.message,
								icon: 'none',
								duration: 2000
							});
						}
					})
					.catch(err => {
						uni.showToast({
							title: '服务异常',
							icon: 'none',
							duration: 2000
						});
					})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.buy-beans-history-wrapper {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
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

	.null-data-show {
		width: 100%;
		height: 100%;
		// background-color: red;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.null-data-img {
		display: block;
		width: 200upx;
		height: 200upx;
		background-color: lime;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-left: -100upx;
		margin-top: -100upx;
	}

	.buy-history-area {
		width: 100%;
		height: auto;
	}

	.buy-history-content {
		padding: 0 30upx;
		height: auto;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}

	.buy-history-list {
		width: 690upx;
		height: 118upx;
		border-bottom: 1upx solid #F3F3F3;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}

	.list-desc-up {
		width: 100%;
		height: 28upx;
		margin-top: 30upx;
		margin-bottom: 20upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.desc-up-left {
		height: 28upx;
		color: #333;
		font-size: 28upx;
		line-height: 28upx;
		margin-left: 20upx;
		text-align: center;
		font-family: PingFang-SC-Medium;
	}

	.up-left-exist {
		display: inline-block;
		font-size: 24upx;
		line-height: 28upx;
		color: #999;
		height: 28upx;
		font-family: PingFang-SC-Medium;
		padding-left: 35upx;
	}

	.desc-up-right {
		height: 28upx;
		color: #FA503D;
		font-size: 28upx;
		line-height: 28upx;
		text-align: center;
		margin-right: 20upx;
		font-family: PingFang-SC-Medium;
	}

	.history-list-bottom {
		width: 100%;
		height: 24upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.list-bottom-left {
		height: 24upx;
		font-size: 24upx;
		margin-left: 20upx;
		color: #999;
		line-height: 24upx;
		font-family: PingFang-SC-Medium;
	}

	.list-bottom-right {
		height: 24upx;
		font-size: 24upx;
		color: #999;
		line-height: 24upx;
		font-family: PingFang-SC-Medium;
	}

	.newslist {
		padding: 10px;
		line-height: 60px;
		font-size: 28px;
	}

	.loading {
		text-align: center;
		line-height: 80px;
	}
</style>
