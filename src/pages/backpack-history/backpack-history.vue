<template>
	<!-- 背包历史记录页面 -->
	<view class="backpack-history-wrapper">
		<!-- 数据列表区域开始 -->
		<view class="history-table-area">
			<!-- 数据的标题开始 -->
			<view class="table-position">
				<view class="table-thead">
					<view class="table-thead-list">道具名称</view>
					<view class="table-thead-list">数量</view>
					<view class="table-thead-list">操作类型</view>
					<view class="table-thead-list">操作时间</view>
				</view>
			</view>
			<!-- 数据的标题结束 -->
			<!-- 数据内容的展示区域开始 -->
			<view style="flex: 1;">
				<view class="show-all">
					<view class="table-tbody " v-for="(item, index) in historyList" :key="index">
						<view class="table-tbody-list">{{item.logDesc}}</view>
						<view class="table-tbody-list">{{item.itemNum}}</view>
						<view class="table-tbody-list" v-text="logType(item.logType)"></view>
						<view class="table-tbody-list">{{item.createtime | formatDate(1)}}</view>
					</view>
				</view>
			</view>
			<!-- 数据内容的展示区域结束 -->
		</view>
		<!-- 数据列表区域结束 -->
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
				start: 1, //查询起始页数	
				len: 10, //查询数量
				historyList: [],
				status: 'more', //上拉加载下拉刷新状态
				token: "", //用户标识
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: 'Hi,这是我的底线啦！'
				}
			}
		},
		onLoad() {
			// 获取token，没有跳转到登录页面
			this.token = this.$storage.isAuthed();
			// 初始化列表信息
			if(this.token) {
				let backPackData = {
					token: this.token,
					start: this.start,
					len: this.len
				};
				this.getBackPack(backPackData);
			}
		},
		onPullDownRefresh: function() {
			//下拉刷新的时候请求一次数据
			let backPackData = {
				token: this.token,
				start: 1,
				len: thos.len
			};
			this.getBackPack(backPackData);
		},
		onReachBottom: function() {
			this.status = 'loading';
			let backPackData = {
				token: this.token,
				start: this.start,
				len: this.len
			};
			this.getBackPack(backPackData);
		},
		methods: {
			getBackPack(data) { // 获取背包历史数据
				let that = this;
				// 获取缓存
				let backpickList = that.$storage.getStorage('backpickList');
				if(that.start == 1) {
					this.historyList = backpickList;
				}
				this.$api.getBackpackLogList(data).then(res => {
					res = res.data;
					if (res.code == '0001') {
						uni.stopPullDownRefresh();
						let backpick = res.data;
						if(that.start == 1) {
							if(!that.$util.contrastArray(backpick.historyList, backpickList)) {
								that.historyList = backpick.historyList;
								that.$storage.setStorage('backpickList', backpick.historyList);
							}
						} else {
							that.historyList = that.historyList.concat(backpick.historyList);
						}
						if(backpick.historyList.length >= 10) {
							that.start++;
							that.status = "more"
						} else if (backpick.historyList.length < 10) {
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
			logType(type) { //操作类型
				switch(type) {
					case 0:
						return "获取道具";
						break;
					case 1:
						return "使用道具";
						break;
					case 2:
						return "获取称号";
						break;
					case 3:
						return "使用称号";
						break;
					case 4:
						return "停止使用称号";
						break;
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.backpack-history-wrapper {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		background-color: #fff;
	}
	// 数据列表区域开始
	.history-table-area {
		width: 694upx;
		height: auto;
		margin: 0 auto;
	}
	.table-position {
		width: 100%;
		height: 72upx;
		margin: 0 auto;
		position: fixed;
		left: 0;
	}
	// 数据的标题开始
	.table-thead {
		width: 694upx;
		height: 72upx;
		margin: 0 auto;
		background: linear-gradient(top, #FE9F05, #FFB109);
		background: -webkit-linear-gradient(top, #FE9F05, #FFB109);
		border: 1upx solid #FEA106;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		.table-thead-list {
			width: 25%;
			height: 72upx;
			font-size: 28upx;
			line-height: 72upx;
			text-align: center;
			color: #fff;
			font-family: PingFangSC-Regular;
			font-weight: 400;
		}
	}
	// 数据内容的展示区域开始
	.table-tbody {
		width: 100%;
		height: 116upx;
		background-color: #fff;
		border: 1upx solid #DDD;
		border-top: none;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		.table-tbody-list {
			width: 25%;
			height: 116upx;
			font-size: 24upx;
			line-height: 116upx;
			text-align: center;
			color: #333;
			font-family: PingFangSC-Regular;
			font-weight: 400;
		}
	}
	// 进入页面的时候展示数据的样式
	.show-all {
		width: 100%;
		min-height: 1160upx;
		margin-top: 72upx;
		overflow: hidden;
		clear: both;
	}
</style>
