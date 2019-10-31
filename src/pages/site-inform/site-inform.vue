<template>
	<!-- 站内通知页面 -->
	<view class="site-inform-wrapper">
		<!-- 一像素的顶部线开始 -->
		<view class="site-inform-area">
			<view class="border-side"></view>
		</view>
		<!-- 一像素的顶部线结束 -->
		<view class="site-inform-content">
			<!-- 消息列表开始 -->
			<view class="inform-list" v-for="(item, index) in messageList" :key="item.id">
				<view class="inform-time">{{item.sendTime | getFormatTime}} </view>
				<view class="inform-message" :class="{ 'inform-message-status': item.status == 1 }" @tap="lookMessageDetail(item.id, item.messageNo, item.messageTitle, item.messageContent, item.sendTime, index)">
					<view class="inform-txt">{{ item.messageTitle }}</view>
					<view class="inform-word">{{ item.messageContent }}</view>
				</view>
			</view>
			<!-- 消息列表结束 -->
			<view>
				<uni-load-more :status="status" :content-text="contentText" />
			</view>
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
				messageList: [], //消息列表
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: 'Hi,这是我的底线啦！'
				},
				status: 'more' //上拉加载下拉刷新状态
			};
		},
		onLoad() {
			// 获取token，没有跳转到登录页面
			// 获取站内通知消息列表

			let data = {
				token: this.$storage.isAuthed(),
				start: this.page,
				len: this.len
			};
			this.getNotifiList(data);
		},
		onShow() {},
		onPullDownRefresh() {
			// console.log('下拉刷新');
			let data = {
				token: this.$storage.isAuthed(),
				start: 1,
				len: this.len
			};
			this.getNotifiList(data);
		},
		onReachBottom() {
			this.status = 'loading';
			// console.log('上拉加载');
			let data = {
				token: this.$storage.isAuthed(),
				start: this.page,
				len: this.len
			};
			this.getNotifiList(data);
		},
		methods: {
			/*
			 * 获取站内通知消息列表
			 *  */
			getNotifiList(data) {
				let systemMessageList = this.$storage.getStorage('systemMessageList');
				if (this.page == 1) {
					this.messageList = systemMessageList;
				}
				let _this = this;
				this.$api
					.getSystemMessageList(data)
					.then(res => {
						res = res.data;
						if (res.code == '0001') {
							uni.stopPullDownRefresh();
							let msgList = res.data.list;
							if (_this.page == 1) {
								// 对比缓存跟请求数据是否相同、如果不相等则重新缓存
								if (!_this.$util.contrastArray(msgList, systemMessageList)) {
									_this.messageList = msgList;
									_this.$storage.setStorage('systemMessageList', msgList);
								}
							} else {
								_this.messageList = _this.messageList.concat(msgList);
							}
							if (msgList.length >= 10) {
								_this.page++;
								_this.status = 'more';
							} else if (msgList.length < 10) {
								_this.status = 'noMore';
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

			/*
			 * 站内通知消息详情
			 *  */
			lookMessageDetail(id, no, title, content, time, index) {
				this.messageList[index].status = 1;

				let sendTime = time;
				uni.navigateTo({
					url: '../site-inform-details/site-inform-details?messageId=' +
						id +
						'&messageNo=' +
						no +
						'&messageTitle=' +
						title +
						'&messageContent=' +
						content +
						'&sendTime=' +
						sendTime
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.site-inform-wrapper {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		flex: 1;
		background-color: #f2f4f5;
	}

	.site-inform-area {
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
			background-color: #f2f4f5;
			position: fixed;
			top: 0;
			left: 0;
		}
	}

	.site-inform-content {
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-content: center;
	}

	.inform-list {
		width: 690upx;
		height: auto;
		padding: 0 30upx 30upx;
		background-color: #f2f4f5;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-content: center;
	}

	.inform-time {
		padding: 0 30upx;
		height: 50upx;
		border-radius: 50upx;
		margin-top: 30upx;
		margin-bottom: 30upx;
		align-self: center;
		text-align: center;
		line-height: 50upx;
		font-size: 24upx;
		color: #fff;
		background:rgba(36,36,36,0.13);
	}

	.inform-message {
		width: 690upx;
		height: auto;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-content: center;
		background:rgba(255,255,255,1);
		box-shadow:  0upx 6upx 26upx 0upx rgba(0, 0, 0, 0.05);
		border-radius: 14upx;
	}

	.inform-txt {
		height: 32upx;
		line-height: 32upx;
		padding-left: 40upx;
		color: #333;
		font-size: 32upx;
		font-weight: 800;
		font-family: PingFangSC-Medium;
		margin-top: 36upx;
		margin-bottom: 40upx;
	}

	.inform-word {
		width: 610upx;
		height: auto;
		line-height: 32upx;
		font-size: 24upx;
		color: #666;
		padding: 0 40upx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2; //规定几行显示省略号
		-webkit-box-orient: vertical;
		margin-bottom: 36upx;
	}

	.blank-area {
		width: 100%;
		height: auto;
		min-height: 284upx;
		background-color: #f2f4f5;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}

	.blank-img {
		display: block;
		width: 80upx;
		height: 104upx;
		margin-top: 120upx;
		margin-bottom: 16upx;
	}

	.blank-txt {
		width: 100%;
		height: 24upx;
		line-height: 24upx;
		color: #999;
		font-size: 24upx;
		text-align: center;
		margin-bottom: 20upx;
	}

	.inform-message-status {
		background-color: #ebeced;
	}

	.loading-text {
		height: 80upx;
		line-height: 80upx;
		font-size: 30upx;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}
</style>
