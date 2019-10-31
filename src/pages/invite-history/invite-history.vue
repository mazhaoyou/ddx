<template>
	<!-- 
	* 我的邀请页面
	* status 邀请状态 0好友未实名 1 奖励未领取 2奖励已领取
	*  -->
	<view class="my-invitation-wrapper">
		<!-- 一像素的顶部线开始 -->
		<view class="my-invitation-area">
			<view class="border-side"></view>
		</view>
		<!-- 一像素的顶部线结束 -->
		<view class="my-invitation-content">
			<view class="my-invitation-main" v-for="(item, index) in userList" :key="index">
				<view class="my-invitation-left">
					<view class="left-date">{{ item.inviteTime | formatDate(1) }}</view>
					<view class="left-time">{{ item.inviteTime | formatDate(2) }}</view>
				</view>
				<view class="my-invitation-line">
					<view class="line-top"></view>
					<view class="line-middle"></view>
					<view class="line-bottom" v-if="index == userList.length - 1"></view>
				</view>
				<view class="my-invitation-middle">
					<view class="middle-title">
						成功邀请
						<text class="title-num">{{ item.nickname }}</text>
					</view>
					<view class="middle-desc" v-if="item.status == 1 || item.status == 2">
						<view class="desc1">
							经验值+
							<text>{{item.exp}}</text>
						</view>
						<view class="desc2">
							福豆+
							<text>{{item.bean}}</text>
						</view>
					</view>
					<view class="middle-desc" v-if="item.status == 0">
						<view class="desc-explain">好友实名后可领取奖励</view>
					</view>
				</view>
				<view class="my-invitaiton-bottom"  @tap="goReward(item.userId,index)" v-if="item.status == 1">
					<view class="bottom-btn">领取奖励</view>
				</view>
				<view class="my-invitaiton-bottom" v-if="item.status == 0">
					<view class="bottom-btn1">领取奖励</view>
				</view>
				<view class="my-invitaiton-bottom" v-if="item.status == 2">
					<view class="bottom-btn2">已领取</view>
				</view>
			</view>
			<!-- 上拉加载下拉刷新部分 -->
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
				userList: [], //受邀用户列表数据
				page: 1, //查询起始页数	
				len: 10, //查询数量
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: 'Hi,这是我的底线啦！'
				},
				status: 'more', //上拉加载下拉刷新状态
				token: '',
			}
		},
		onLoad() {
			// 获取token，没有跳转到登录页面
			this.token = this.$storage.isAuthed();
			if (this.token) {
				var data = {
					token: this.token,
					start: 1,
					len: this.len
				};
				this.getInviteList(data);
			}
			var data = new Date(parseInt('1557003905000'));
			// console.log(this.$util.formatDate(data, 'yyyy-MM-dd'))
		},
		filters: {
			// formatDate1(time) {
			// 	var data = new Date(parseInt(time));
			// 	var time = _this.$util.formatDate(data, 'yyyy-MM-dd');
			// 	return time;
			// },
			
			// formatDate2(time) {
			// 	var data = new Date(parseInt(time));
			// 	return this.$util.formatDate(data, 'hh:mm:ss');
			// }
		},
		onPullDownRefresh() {
			// console.log('下拉刷新');
			let data = {
				token: this.token,
				start: 1,
				len: this.len
			};
			this.getInviteList(data);
		},
		onReachBottom() {
			this.status = 'loading'
			// console.log('上拉加载');
			let data = {
				token: this.token,
				start: this.page,
				len: this.len
			};
			this.getInviteList(data);
		},
		methods: {
			/* 
			 * 获取邀请记录列表 
			 * */
			getInviteList(data) {
				let _this = this;
				let inviteRecord = _this.$storage.getStorage("inviteRecord");
				if (_this.page == 1) {
					_this.userList = inviteRecord;
				}
				this.$api.getInviteList(data)
					.then(res => {
						res = res.data;
						if (res.code == "0001") {
							uni.stopPullDownRefresh();
							let dataList = res.data.userList
							if (_this.page == 1) {
								// 对比缓存跟请求数据是否相同、如果不相等则重新缓存
								if (!_this.$util.contrastArray(dataList, inviteRecord)) {
									_this.userList = dataList;
									_this.$storage.setStorage('inviteRecord', dataList);
								}
							} else {
								_this.userList = _this.userList.concat(dataList)
							}
							if (dataList.length >= 10) {
								_this.page++;
								_this.status = "more"
							} else if (dataList.length < 10) {
								_this.status = "noMore"
							}
						} else {
							uni.showToast({
								title: res.messsage,
								icon: "none",
								duration: 2000
							})
						}
					}).catch(err => {
						uni.showToast({
							title: "服务异常",
							icon: "none",
							duration: 2000
						})
					});
			},
			/* 
			 * 领取奖励 
			 * */
			goReward(itemId,index) {
				let userId = itemId;
				let reward = {
					token: this.token,
					userId: userId
				}
				let _this = this;
				this.$api.receiveInviteAward(reward)
					.then(res => {
						res = res.data;
						if (res.code == '0001') {
							_this.userList[index].status = 2;
							uni.showToast({
								title: res.message,
								icon: "success",
								duration: 2000
							})
							// 领取成功后改变状态,在青丘一次邀请记录接口
							// if (_this.token) {
							// 	var data = {
							// 		token: _this.token
							// 	};
							// 	_this.getInviteList(data);
							// }
						} else {
							uni.showToast({
								title: res.messsage,
								icon: "none",
								duration: 2000
							})
						}
					})
					.catch(err => {
						uni.showToast({
							title: "服务异常",
							icon: "none",
							duration: 2000
						})
					})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.my-invitation-wrapper {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		flex: 1;
		background-color: #F2F4F5;
	}

	.my-invitation-area {
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

	.my-invitation-content {
		width: 100%;
		height: auto;
		background-color: #fff;
	}

	.my-invitation-main {
		height: 150upx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-content: center;
		padding: 10upx 25upx;
	}

	.my-invitation-left {
		width: 200upx;
		height: 150upx;
	}

	.left-date {
		width: 160upx;
		height: 24upx;
		margin-bottom: 10upx;
		font-size: 24upx;
		font-family: PingFang-SC-Regular;
		font-weight: 500;
		color: #666;
		text-align: right;
	}

	.left-time {
		width: 160upx;
		height: 24upx;
		line-height: 1.5;
		font-size: 24upx;
		font-family: PingFang-SC-Regular;
		font-weight: 500;
		color: #666;
		text-align: right;
	}

	.my-invitation-line {
		width: 20upx;
		height: 150upx;
		position: relative;
	}

	.line-top {
		width: 20upx;
		height: 20upx;
		background: #FB6E61;
		border-radius: 50%;
		position: absolute;
		top: 0;
		left: 0;
	}

	.line-middle {
		width: 4upx;
		height: 108upx;
		background: #FB6E61;
		position: absolute;
		top: 30upx;
		left: 8upx;
	}

	.line-bottom {
		width: 10upx;
		height: 10upx;
		background: #FB6E61;
		border-radius: 50%;
		position: absolute;
		bottom: 0;
		left: 5upx;
	}

	.my-invitation-middle {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-content: center;
		padding-left: 30upx;
	}

	.middle-title {
		font-size: 28upx;
		line-height: 1.5;
		font-weight: 500;
		font-family: PingFang-SC-Medium;
		color: #333;
		margin-bottom: 10upx;
	}

	.title-num {
		padding-left: 20upx;
	}

	.middle-desc {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-content: center;
	}

	.desc-explain {
		font-size: 24upx;
		line-height: 1.5;
		font-weight: 500;
		font-family: PingFang-SC-Medium;
		color: #FA503D;
	}

	.desc1 {
		font-size: 24upx;
		line-height: 1.5;
		font-weight: 500;
		font-family: PingFang-SC-Medium;
		color: #FFA200;
	}

	.desc2 {
		font-size: 24upx;
		line-height: 1.5;
		font-weight: 500;
		font-family: PingFang-SC-Medium;
		color: #FFA200;
		padding-left: 20upx;
	}

	.my-invitaiton-bottom {
		width: 110upx;
		height: 150upx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-content: center;
	}

	.bottom-btn {
		width: 110upx;
		height: 45upx;
		border: 3upx solid #222A55;
		box-sizing: border-box;
		border-radius: 7upx;
		font-size: 20upx;
		line-height: 45upx;
		color: #fff;
		background-color: #FFA200;
		text-align: center;
		align-self: center;
	}

	.bottom-btn1 {
		width: 110upx;
		height: 45upx;
		border: 3upx solid #CCCCCC;
		box-sizing: border-box;
		border-radius: 7upx;
		font-size: 20upx;
		line-height: 45upx;
		color: #999;
		background-color: #E5E5E5;
		text-align: center;
		align-self: center;
	}

	.bottom-btn2 {
		width: 110upx;
		height: 45upx;
		border-radius: 7upx;
		font-size: 20upx;
		line-height: 45upx;
		color: #999;
		background-color: #E5E5E5;
		text-align: center;
		align-self: center;
	}
</style>
