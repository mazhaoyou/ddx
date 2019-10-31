<template>
	<!-- 我的邀请页面 已废弃-->
	<view class="my-invitation-wrapper">
		<!-- 一像素的顶部线开始 -->
		<view class="my-invitation-area">
			<view class="border-side"></view>
		</view>
		<!-- 一像素的顶部线结束 -->
		<view class="my-invitation-content">
			<view class="my-invitation-main" v-for="(item, index) in userList" :key="index">
				<view class="my-invitaiton-pic">
					<image class="my-invitaiton-circleImg" v-if="!item.frameUrl" :src="item.headPicUrl" mode=""></image>
					<image class="my-invitaiton-img" v-if="!item.headPicUrl" :src="item.frameUrl" mode=""></image>
				</view>
				<view class="my-invitation-desc">
					<view class="desc-title">
						<view class="desc-name">{{item.verifiedStatus}}</view>
						<view class="desc-time">{{item.registerTime}}</view>
					</view>
					<view class="desc-beans">
						<view class="express-desc">经验值<text class="num-desc color-desc">+</text><text class="num-desc">{{item.exp}}</text></view>
						<view class="beans-desc-num">福豆<text class="num-desc color-desc">+</text><text class="num-desc">{{item.bean}}</text></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {

		},
		data() {
			return {
				userList: [] //受邀用户列表
			}
		},
		onLoad() {
			// 获取token，没有跳转到登录页面
			// let token = this.$storage.isAuthed();
			let token = 'TOKEN:d14f25fb-7c54-4ecd-a55e-994222e679cf';
			if (token) {
				var data = {
					token: token
				};
				this.getInviteList(data);
			}
		},
		onReady() {

		},
		methods: {
			/* 
			 * 获取邀请记录列表 
			 * */
			getInviteList(data) {
				let _this = this;
				this.$api.getInviteList(data)
					.then(res => {
						res = res.data;
						if (res.code == "0001") {
							let dataList = res.data.userList
							_this.userList = dataList;
						} else {
							uni.showToast({
								title: res.messsage,
								icon: "none"
							})
						}
					}).catch(err => {
						uni.showToast({
							title: "服务异常",
							icon: "none"
						})
					});
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
		width: 700upx;
		height: 178upx;
		background-color: #fff;
		margin: 0 25upx;
		border-bottom: 1upx solid #F2F4F5;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-content: center;
	}

	.my-invitaiton-pic {
		width: 114upx;
		height: 178upx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-content: center;
	}

	.my-invitaiton-img {
		display: block;
		width: 114upx;
		height: 110upx;
		align-self: center;
		border-radius: 50%;
	}

	.my-invitaiton-circleImg {
		display: block;
		width: 106upx;
		height: 106upx;
		border-radius: 50%;
		align-self: center;
	}

	.my-invitation-desc {
		flex: 1;
		margin-left: 20upx;
		height: 178upx;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-content: center;
	}

	.desc-title {
		height: 32upx;
		margin-top: 52upx;
		margin-bottom: 25upx;
		line-height: 32upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-content: center;
	}

	.desc-name {
		color: #333;
		font-size: 32upx;
		font-weight: 500;
		font-family: PingFang-SC-Medium;
	}

	.desc-time {
		color: #666;
		font-size: 24upx;
		font-family: PingFang-SC-Regular;
		font-weight: 500;
	}

	.desc-beans {
		height: 24upx;
		line-height: 24upx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-content: center;
	}

	.express-desc {
		height: 24upx;
		font-size: 24upx;
		line-height: 24upx;
		color: #666;
		font-family: PingFang-SC-Regular;
		font-weight: 500;
	}

	.num-desc {
		color: #FA503D;
	}

	.color-desc {
		margin-left: 20upx;
	}

	.beans-desc-num {
		height: 24upx;
		font-size: 24upx;
		line-height: 24upx;
		color: #666;
		font-family: PingFang-SC-Regular;
		font-weight: 500;
		margin-left: 50upx;
	}
</style>
