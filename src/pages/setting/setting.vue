<template>
	<!-- 设置页面 -->
	<view class="setting-wrapper">
		<view class="setting-area">
			<view class="border-side"></view>
		</view>
		<view class="setting-list">
			<view class="list">
				<view class="list-left">
					<image class="left-img" src="../../static/setting/shouji_logo.png" mode=""></image>
					<text class="left-title">登录手机号</text>
				</view>
				<view class="list-right"><text class="right-phone">{{minePhone}}</text></view>
			</view>

			<view class="list" @tap="changePwd()">
				<view class="list-left">
					<image class="left-img" src="../../static/setting/password_logo.png" mode=""></image>
					<text class="left-title">修改密码</text>
				</view>
				<view class="list-right">
					<image class="arrow-right" src="../../static/setting/arrow_right.png" mode=""></image>
				</view>
			</view>

			<view class="list bb">
				<view class="list-left">
					<image class="left-img" src="../../static/setting/weixin_logo.png" mode=""></image>
					<text class="left-title">微信号</text>
				</view>
				<view class="list-right" v-if="weixinStatus == 0" @tap="bindWeChat('weixin')">
					<text class="right-title">未绑定</text>
					<image class="arrow-right" src="../../static/setting/arrow_right.png" mode=""></image>
				</view>
				<view class="list-right" v-if="weixinStatus == 1">
					<text class="right-title">已绑定</text>
					<image class="arrow-right" src="../../static/setting/arrow_right.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="mb"></view>
		<view class="setting-list">
			<view class="list">
				<view class="list-left">
					<image class="left-img" src="../../static/setting/app_icons_logo.png" mode=""></image>
					<text class="left-title">版本升级</text>
				</view>
				<view class="list-right">
					<text class="right-title">当前版本{{versionNum}}</text>
					<image class="arrow-right" src="../../static/setting/arrow_right.png" mode=""></image>
				</view>
			</view>

			<view class="list" @tap="clearStorage()">
				<view class="list-left">
					<image class="left-img" src="../../static/setting/clear_cache.png" mode=""></image>
					<text class="left-title">清除缓存</text>
				</view>
				<view class="list-right">
					<text class="right-title">{{ memorySpace }}</text>
					<image class="arrow-right" src="../../static/setting/arrow_right.png" mode=""></image>
				</view>
			</view>

			<view class="list bb">
				<view class="list-left">
					<image class="left-img" src="../../static/setting/logo.png" mode=""></image>
					<text class="left-title">关于我们</text>
				</view>
				<view class="list-right" @tap="handleSetting()">
					<image class="arrow-right" src="../../static/setting/arrow_right.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="mb"></view>
		<view class="log-out" @tap="logOut()"><text class="log-out-title">退出登录</text></view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				memorySpace: 0,
				userPhone: '',
				openid: '', //微信openid
				weixinStatus: 0, //微信绑定状态
				versionNum: 0, //版本号
				token: '', //token判断登录状态
			};
		},
		onLoad() {
			this.userPhone = this.$storage.getStorage('userPhone', 2);
			this.weixinStatus = this.$storage.getStorage('wechatStatus', 2);
			this.token = this.$storage.isAuthed();
			let _this = this;
			this.$storage
				.getMemorySpace()
				.then(res => {
					_this.memorySpace = res;
				})
				.catch(e => {
					console.log('获取缓存信息失败');
				});
		},
		onReady() {
			this.versionNum = plus.runtime.version;
		},
		methods: {
			clearStorage() {
				let _this = this;
				uni.showModal({
					title: '小冠优选',
					content: '是否清除所有缓存?',
					confirmColor: "#FF9C00",
					success: function(res) {
						if (res.confirm) {
							_this.$storage.clearStorage(1);
							_this.memorySpace = 0.0;
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});

			},
			/*
			 * 跳转关于我们页面
			 * */
			handleSetting() {
				uni.navigateTo({
					url: '../about-us/about-us'
				});
			},
			/*
			 * 修改密码 ,传入funType参数为 3
			 * */
			changePwd() {
				uni.navigateTo({
					url: '../retireve-password/retireve-password?phone=' + this.userPhone + '&funType=' + 3
				});
			},
			/* 
			 * 微信绑定 
			 * */
			bindWeChat(provider) {
				let _this = this;
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				//第三方登录
				uni.login({
					provider: provider, //第三方平台为微信
					success: loginRes => {
						loginRes = loginRes.authResult;
						let loginInfo = {
							access_token: loginRes.access_token,
							expires_in: loginRes.expires_in,
							refresh_token: loginRes.refresh_token,
							openid: loginRes.openid,
							scope: loginRes.scope,
							unionid: loginRes.unionid
						}

						//案例直接获取用户信息，一般不是在APP端直接获取用户信息，比如微信，获取一个code，传递给后端，后端再去请求微信服务器获取用户信息
						uni.getUserInfo({
							provider: provider,
							success: infoRes => {
								uni.hideLoading();
								// console.log('用户信息：' + JSON.stringify(infoRes.userInfo));
								let userInfo = infoRes.userInfo;
								// 缓存获取到的微信用户信息
								_this.$storage.setStorage('weixinUserInfo', userInfo)
								_this.openid = userInfo.openId;
								console.log(_this.openid);
								// 传入获取微信绑定接口微信用户信息
								let token = _this.$storage.isAuthed();
								if (token) {
									let wxUserInfo = {
										"token": token,
										"openid": userInfo.openId
									}
									// 获取微信是否绑定小冠优选库里对应的手机号
									_this.getWxBindStatus(wxUserInfo);
								}
							}
						});
					},
					fail: e => {
						uni.hideLoading();
						uni.showToast({
							title: "获取微信登录失败",
							icon: 'none',
							duration: 2000
						})
						console.log('fail: ' + JSON.stringify(e));
					}
				});
			},
			/* 
			 * 获取微信是否绑定小冠优选库里对应的手机号 
			 * 传值openid
			 * */
			getWxBindStatus(data) {
				let _this = this;
				_this.$api.bindingWechat(data)
					.then(res => {
						res = res.data;
						if (res.code == '0001') { // 微信已绑定安全，直接登录
							_this.weixinStatus = 1;
							uni.showToast({
								title: res.message,
								icon: 'success',
								duration: 2000
							});
						} else {
							uni.showToast({
								title: res.message,
								icon: 'none',
								duration: 2000
							})
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
			 * 退出登录 
			 * */
			logOut() {
				let _this = this;
				uni.showModal({
					title: '小冠优选',
					content: '确定退出?',
					confirmColor: "#FF9C00",
					success: function(res) {
						if (res.confirm) {
							_this.confirmLogOut();
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			/* 
			 * 确认退出登录 
			 * */
			confirmLogOut() {
				let data = {
					token: this.token
				}
				let _this = this;
				this.$api.logout(data)
					.then(res => {
						res = res.data;
						if (res.code == '0001') {
							uni.redirectTo({
								url: '../login/login'
							});
							
							_this.$storage.clearCloneStorage('token');
							_this.$storage.clearCloneStorage('userPhone');
							_this.$storage.clearCloneStorage('headImg');
							_this.$storage.clearCloneStorage('userPhone');
							_this.$storage.clearCloneStorage('nickName');

						} else {
							uni.showToast({
								title: res.message,
								icon: 'none',
								duration: 2000
							})
						}
					})
					.catch(err => {
						uni.showToast({
							title: '网路异常，请稍后操作',
							icon: 'none',
							duration: 2000
						});
					})
			}
		},
		computed: {
			/* 
			 * 手机号码*显示问题
			 *  */
			minePhone() {
				var reg = /(\d{3})\d{4}(\d{4})/;
				//$1是第一个小括号里的 ,$2是第2个小括号里的 
				return this.userPhone.replace(reg, "$1****$2")
			}
		}
	};
</script>

<style lang="scss" scoped>
	.setting-wrapper {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		background-color: #fff;
		position: relative;

		.setting-area {
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

		.mb {
			width: 100%;
			height: 20upx;
			background-color: #f5f5f5;
		}

		.setting-list {
			width: 100%;
			height: auto;
			background-color: #fff;

			.list {
				height: 112upx;
				margin-left: 35upx;
				margin-right: 30upx;
				border-bottom: 1upx solid #E5E5E5;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
			}

			.bb {
				border-bottom: none;
			}
		}
	}

	.list-left {
		width: 50%;
		height: 112upx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;

		.left-img {
			display: block;
			width: 45upx;
			height: 45upx;
		}

		.left-title {
			height: 112upx;
			margin-left: 14upx;
			color: #333;
			font-size: 32upx;
			line-height: 112upx;
		}
	}

	.list-right {
		width: 100%;
		height: 112upx;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;

		.right-phone {
			height: 32upx;
			line-height: 32upx;
			color: #999;
			font-size: 32upx;
			margin-right: 40upx;
		}

		.arrow-right {
			display: block;
			width: 22upx;
			height: 38upx;
		}

		.right-title {
			height: 32upx;
			line-height: 32upx;
			color: #999;
			font-size: 32upx;
			margin-right: 25upx;
		}
	}

	.log-out {
		width: 100%;
		height: 112upx;
		background-color: #fff;
		border-bottom: 1upx solid #e5e5e5;

		.log-out-title {
			width: 100%;
			height: 112upx;
			display: block;
			text-align: center;
			line-height: 112upx;
			color: #ff911b;
			font-size: 32upx;
		}
	}
</style>
