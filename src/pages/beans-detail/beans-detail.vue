<template>
	<!-- 福豆明细页面 -->
	<view class="beans-detail-wrapper">
		<view class="beans-detail-area">
			<view class="border-side"></view>
		</view>
		<!-- tab选项卡开始 -->
		<view class="tab-area">
			<view class="tab-list" v-for="(item, index) in list" :key="index">
				<view class="tab-list-desc" :class="{'tab-list-active-desc': num == index}" @tap="handleClick(index)">{{item.name}}</view>
			</view>
		</view>
		<!-- tab选项卡结束 -->
		<!-- 获取明细开始 -->
		<view class="tab-list-content" v-show="num == 0">
			<view class="tab-list-detail">
				<view class="list-desc" v-for="(item, index) in detailList" :key="index">
					<view class="list-desc-up">
						<view class="desc-up-left">{{item.changeDesc}}<text class="up-left-exist" v-if="item.changeType == '1'">(支付宝支付44.00元)</text></view>
						<view class="desc-up-right">+<text>{{item.beanCount}}</text><text>{{item.beanType == 0 ? '金豆' : '银豆'}}</text></view>
					</view>
					<view class="list-desc-bottom">{{ item.changeTime | formatDate(1) }}</view>
				</view>
			</view>
		</view>
		<!-- 获取明细结束 -->
		<!-- 消耗明细开始 -->
		<view class="tab-list-content" v-show="num == 1">
			<view class="tab-list-detail">
				<view class="list-desc" v-for="(item, index) in detailList" :key="index">
					<view class="list-desc-up">
						<view class="desc-up-left">{{item.changeDesc}}</view>
						<view class="desc-up-right">-<text>{{item.beanCount}}</text><text>{{item.beanType == 0 ? '金豆' : '银豆'}}</text></view>
					</view>
					<view class="list-desc-bottom">{{ item.changeTime | formatDate(1) }}</view>
				</view>
			</view>
		</view>
		<!-- 消耗明细结束 -->
		<!-- 上拉加载，下拉刷新 -->
		<view>
			<uni-load-more :status="status" :content-text="contentText" />
		</view>
		<!-- 上拉加载，下拉刷新 -->
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
				list: [
					{name: "获取明细"},
					{name: "消耗明细"}
				],
				num: 0,
				isActive: false,
				detailList: [], //返回数组集合
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: 'Hi,这是我的底线啦！'
				},
				status: 'more', //上拉加载下拉刷新状态
				start: 1, //查询起始页数	
				len: 10, //查询数量
				token: "" //用户标识
			}
		},
		onLoad() {
			// 获取token，没有跳转到登录页面
			this.token = this.$storage.isAuthed();
			if(this.token) {
				let beanDetailList1 = {
					token: this.token,
					start: this.start,
					len: this.len,
					type: "1" //变动类型  1获取 0消费 2购买福豆
				};
				this.getBeanDetail(beanDetailList1);
				let beanDetailList2 = {
					token: this.token,
					start: this.start,
					len: this.len,
					type: "0" //变动类型  1获取 0消费 2购买福豆
				};
				this.consumeBeanDetail(beanDetailList2);
			}
		},
		onPullDownRefresh() {
			console.log('刷新了');
			let beanDetailList1 = {
				token: this.token,
				start: 1,
				len: this.len,
				type: "1" //变动类型  1获取 0消费 2购买福豆
			};
			this.getBeanDetail(beanDetailList1);
			let beanDetailList2 = {
				token: this.token,
				start: 1,
				len: this.len,
				type: "0" //变动类型  1获取 0消费 2购买福豆
			};
			this.consumeBeanDetail(beanDetailList2);
		},
		onReachBottom() {
			console.log('加载');
			this.status = 'loading';
			let beanDetailList1 = {
				token: this.token,
				start: this.start,
				len: this.len,
				type: "1" //变动类型  1获取 0消费 2购买福豆
			};
			this.getBeanDetail(beanDetailList1);
			let beanDetailList2 = {
				token: this.token,
				start: this.start,
				len: this.len,
				type: "0" //变动类型  1获取 0消费 2购买福豆
			};
			this.consumeBeanDetail(beanDetailList2);
		},
		methods: {
			handleClick(index) {
				this.num = index
			},
			getBeanDetail(data) { // 获取明细
				let that = this;
				//获取缓存
				let getBean = that.$storage.getStorage('getBeanList');
				if(that.start == 1) {
					this.detailList = getBean;
				}
				this.$api.getBeanDetailList(data).then(res => {
					res = res.data;
					if (res.code == '0001') {
						uni.stopPullDownRefresh();
						let getBeanData = res.data;
						if(that.start == 1) {
							// 对比缓存跟请求数据是否相同，如果不相等则重新缓存
							if(!that.$util.contrastArray(getBeanData.detailList, getBean)) {
								that.detailList = getBeanData.detailList;
								that.$storage.setStorage('getBeanList', getBeanData.detailList);
							}
						} else {
							that.detailList = that.detailList.concat(getBeanData.detailList);
						}
						if(getBeanData.detailList.length >= 10) {
							that.start++;
							that.status = "more"
						} else if (getBeanData.detailList.length < 10) {
							that.status = "noMore"
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
				});
			},
			consumeBeanDetail(data) { // 消耗明细
				let that = this;
				//获取缓存
				let consumeBean = that.$storage.getStorage('consumeBeanList');
				if(that.start == 1) {
					this.detailList = consumeBean;
				}
				this.$api.getBeanDetailList(data).then(res => {
					res = res.data;
					if (res.code == '0001') {
						uni.stopPullDownRefresh();
						let consumeBeanData = res.data;
						if(that.start == 1) {
							// 对比缓存跟请求数据是否相同，如果不相等则重新缓存
							if(!that.$util.contrastArray(consumeBeanData.detailList, consumeBean)) {
								that.detailList = consumeBeanData.detailList;
								that.$storage.setStorage('consumeBeanList', consumeBeanData.detailList);
							}
						} else {
							that.detailList = that.detailList.concat(consumeBeanData.detailList);
						}
						if(consumeBeanData.detailList.length >= 10) {
							that.start++;
							that.status = "more";
						} else if (consumeBeanData.detailList.length < 10) {
							that.status = "noMore"
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
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.beans-detail-wrapper {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		background-color: #fff;
		position: relative;
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
	//tab选项卡区域开始
	.tab-area {
		width: 100%;
		height: 100upx;
		background-color: #FAFAFA;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-content: center;
		position: fixed;
		top: 1upx;
		left: 0;
		.tab-list {
			width: 50%;
			height: 100upx;
			display: flex;
			flex-direction: row;
			justify-content: center;
		}
	}
	.tab-list-desc {
		width: 50%;
		height: 100upx;
		line-height: 100upx;
		text-align: center;
		font-size: 30upx;
		color: #333;
		font-family: PingFang-SC-Medium;
	}
	.tab-list-active-desc {
		color: #FF911B;
		font-weight: 800;
		border-bottom: 8upx solid #FF911B;
		box-sizing: border-box;
	}
	//tab选项卡结束
	//数据展示开始
	.tab-list-content {
		width: 100%;
		height: auto;
		margin-top: 101upx;
		.tab-list-detail {
			padding: 0 30upx;
			height: auto;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
		}
	}
	.list-desc {
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
		font-family: PingFang-SC-Medium;
	}
	.list-desc-bottom {
		width: 100%;
		height: 24upx;
		font-size: 24upx;
		color: #999;
		line-height: 24upx;
		font-family: PingFang-SC-Medium;
		text-align: left;
	}
	//数据展示结束
</style>
