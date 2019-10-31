<template>
	<!-- 
	* login页面的开始 
	*
	* -->
	<view class="login-wrapper">
		<!-- 顶部导航条开始 -->
		<!-- <uni-nav-bar title="登录/注册" background-color="-webkit-linear-gradient(left, #FFB709, #FE9402);linear-gradient(left, #FFB709, #FE9402)"
		 color="#fff" fixed="true"></uni-nav-bar> -->
		<!-- 顶部导航条结束 -->
		<!-- 输入框区域开始 -->
		<view class="login-area-bj">
			<view class="login-desc1">
				加入百万
				<text class="desc-sp1">竞拍</text>
				会员
			</view>
			<view class="login-desc2">
				白菜价
				<text class="desc-sp2">抢货啦！</text>
			</view>
			<image class="login-dog" src="../../static/login/login_dog.png" mode=""></image>
			<view class="login-content">
				<input class="uni-input iphone-input" type="number" placeholder-class="iphone-placeholder" maxlength="11"
				 placeholder="请输入手机号" v-model="userPhone" />
				<button class="uni-button next-step" @tap="nextStep()" :class="{ activeBtn: btnShow }" :disabled="isNextSend">下一步</button>
			</view>
			<!-- 输入框区域结束 -->
			<!-- 底部区域开始 -->
			<view class="login-bottom">
				<view class="login-txt1">
					点击下一步，表示您同意小冠优选的
					<text class="login-sp1">《使用协议》</text>
				</view>
				<view class="login-txt2" @tap="customerPhone()">
					遇到问题？请
					<text class="login-sp2">联系客服</text>
				</view>
				<view class="oauth-area" v-if="isShowOauth">
					<view class="login-way">
						<text class="login-line"></text>
						<text class="line-text">其他登录方式</text>
						<text class="login-line"></text>
					</view>
					<view class="login-weixin" v-if="showProvider.weixin" @tap="oauthLogin('weixin')">
						<image class="wenxin-img" src="../../static/login/weixin_login.png" mode="scaleToFill"></image>
						<view class="wenxin-desc">使用微信账号登录</view>
					</view>
				</view>
			</view>
			<!-- 底部区域结束 -->
		</view>
		<!-- 输入框区域结束 -->
		<!-- 弹出层开始 -->
		<view>
			<neil-modal :show="show">
				<view class="modal">
					<view class="modal-txt1">抱歉,您的账户因涉嫌不安全行为被冻结。如有疑问,请联系客服:</view>
					<view class="modal-tel">010-25236589</view>
					<button class="modal-confirm" @tap="closeModal">确定</button>
				</view>
			</neil-modal>
		</view>
		<!-- 弹出层结束 -->
		<!-- <view v-if="!hideFMCanvas"><canvas canvas-id="tdcanvas"></canvas></view> -->
	</view>
	<!-- login页面的结束 -->
</template>

<script>
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
	import uniIcon from '@/components/uni-icon/uni-icon.vue';
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	import FMAgent from '../../common/fmsdk/fm-1.5.1.js';

	export default {
		components: {
			uniNavBar,
			uniIcon,
			neilModal
		},
		data() {
			return {
				hideFMCanvas: true,
				globalData: {
					userInfo: null,

					/* _fmOpt配置信息
					 * 填入对应partnerCode和appName
					 */
					_fmOpt: {
						partnerCode: 'xiaoguanyx',
						appName: 'xiaoguanyx_web'
						// 生产环境开启该选项
						// env: "PRODUCTION"
					}
				},
				show: false, // 弹窗的显示与否
				userPhone: '', // 手机号
				isShowOauth: false, // 是否展示其他的登录方式
				showProvider: {
					weixin: false,
					qq: false,
					sinaweibo: false,
					xiaomi: false
				},
				btnShow: false, // 按钮下一步的颜色高亮
				pageUrl: false, // 路径跳转的页面控制
				isNextSend: true, // 控制下一步的按钮是否可点击
				blackBox: '', //同盾号
				openid: '' //微信openid

			};
		},
		onShow() {},
		onLoad(options) {

			// 通过微信openid判断用户初次进入登录页面还是通过点击微信登录按钮后跳转到微信绑定
			if ('' != options.openid && null != options.openid && undefined != options.openid) {
				this.openid = options.openid;
				this.isShowOauth = false;
				// 当新用户用微信登录进入时
				uni.setNavigationBarTitle({
					title: '微信绑定'
				});
			} else {
				//APP显示第三方登录
				// #ifdef APP-PLUS
				this.isShowOauth = true;
				// #endif
				this.getProvider();
			}

			let fmagent = new FMAgent(this.globalData._fmOpt); // 这里需要传入一些必要配置
			let that = this.$mp.page;
			let _this = this;
			fmagent.getInfo({
				page: that, // 请传入FMAgent所在的Page对象
				openid: '', // 请传入加密的用户openid
				unionid: '',
				success: function(res) {
					// 成功回调，res为blackbox字符
					_this.blackBox = res;
				},
				fail: function(res) {
					// 失败回调，res为各种exception对象
				},
				complete: function(res) {}
			});
		},
		methods: {
			/* 
			 * 判断新老用户方法
			 *  */
			getNewOldUser(data) {
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				let _this = this;
				this.$api
					.judgeNewOldUser(data)
					.then(res => {
						uni.hideLoading();
						res = res.data;
						let message = res.message;
						if (res.code == '0001') {
							let data = res.data;
							let tongdunNo = data.tongdunNo;
							let status = data.status;
							let phone = _this.userPhone;
							// status 老用户状态 2新号 0封号 1正常 
							// 账号被封
							if (status == 0) {
								_this.show = true;
							}
							// 老用户，进入短信登录界面
							if (status == 1) {
								uni.navigateTo({
									url: '../safe-message-verify/safe-message-verify?phone=' + phone + '&openid=' + _this.openid
								})
							}
							// 新用户，进入验证码验证界面
							if (status == 2) {
								uni.navigateTo({
									url: '../verify-unsafe/verify-unsafe?phone=' + phone + "&tongdunNo=" + tongdunNo + '&openid=' + _this.openid
								});
							}
						} else {
							uni.showToast({
								title: message,
								icon: 'none',
								duration: 2000
							})
						}
					})
					.catch(err => {
						uni.hideLoading();
						uni.showToast({
							title: '服务异常',
							icon: 'none',
							duration: 2000
						});
					});
			},
			/* 
			 * 点击导航左上角返回 
			 * */
			back() {
				uni.switchTab({
					url: '/pages/mine/mine'
				});
			},
			/*
			 *  点击下一步 
			 *  判断新老用用户及账号是否封号
			 * */
			nextStep() {
				if (!this.userPhone) {
					this.isNextSend = true;
					uni.showToast({
						title: '手机号不能为空',
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				if (!/^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/.test(this.userPhone)) {
					this.isNextSend = true;
					uni.showToast({
						title: '手机号格式不正确',
						icon: 'none',
						duration: 2000
					});
					return false;
				}

				// 手机号、同盾号、微信openid
				let data = {
					phone: this.userPhone,
					blackBox: this.blackBox,
					openid: this.openid
				};
				// 判断新老用户及安全状态
				this.getNewOldUser(data);
			},
			/* 
			 * 关闭账号被冻结弹窗 
			 * */
			closeModal() {
				this.show = false;
			},
			/* 
			 * 使用微信账号登录 
			 * */
			oauthLogin(provider) {
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
								// 传入获取微信绑定接口微信用户信息
								let wxUserInfo = {
									"openid": userInfo.openId,
									"headPic": userInfo.avatarUrl,
									"nickName": userInfo.nickName
								}
								// 获取微信是否绑定小冠优选库里对应的手机号
								_this.getWxBindStatus(wxUserInfo);
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
				_this.$api.getWechatBiddingStatus(data)
					.then(res => {
						res = res.data;
						let message = res.message;
						if (res.code == '0001') { // 微信已绑定安全，直接登录
							let userInfoList = res.data;
							// 缓存用户头像、昵称、用户userid、token
							_this.$storage.setStorage('headImg', userInfoList.headPicUrl, 2);
							_this.$storage.setStorage('nickName', userInfoList.nickName, 2);
							_this.$storage.setStorage('userId', userInfoList.userId, 2);
							_this.$storage.setStorage('token', userInfoList.token, 2);
							_this.$storage.setStorage('userPhone', userInfoList.phone, 2);
							_this.$storage.setStorage('wechatStatus', userInfoList.wechatStatus, 2);
							uni.showToast({
								title: message,
								icon: 'success',
								duration: 2000
							});
							uni.switchTab({
								url: '../index/index'
							})
						} else if (res.code == '1002') { // 微信未绑定，不安全
							// 弹窗提示此用户已成禁用状态
							_this.show = true;
						} else if (res.code == '1003') { // 新用户
							// 新用户跳转到登录页面走注册逻辑
							uni.reLaunch({
								url: '/pages/login/login?openid=' + _this.openid
							});

						} else {
							uni.showToast({
								title: message,
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
			 * 获取第三方登录服务
			 * */
			getProvider() {
				uni.getProvider({
					service: 'oauth',
					success: res => {
						console.log(res.provider)
						let len = res.provider.length;
						for (let i = 0; i < len; i++) {
							//有服务才显示按钮图标
							this.showProvider[res.provider[i]] = true;
						}
						if (res.provider.length == 0) {
							this.isShowOauth = false;
						}
					}
				});
			},
			/* 
			 * 过滤微信昵称特殊字符 
			 * */
			rexTest(str) {
				//	var patrn = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im;  
				let patrn = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/g;
				if (!patrn.test(str)) { // 如果包含特殊字符返回false
					return false;
				}
				return true;
			},
			/* 
			 * 拨打客服电话 
			 * */
			customerPhone() {
				let customPhone = this.$storage.getStorage('customerPhone', 2);
				if ('' != customPhone && null != customPhone && undefined != customPhone) {
					uni.makePhoneCall({
						phoneNumber: customPhone //仅为示例
					});
				}
			}
		},
		watch: {
			userPhone() {
				// 监听手机行的位数是否是11位
				if (this.userPhone.length === 11) {
					this.btnShow = true;
					this.isNextSend = false;
				} else {
					this.btnShow = false;
					this.isNextSend = true;
				}
			}
		},
		computed: {}
	};
</script>

<style lang="scss" scoped>
	.login-wrapper {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		flex: 1;
		background: linear-gradient(left, #ffb709, #fe9402);
		background: -webkit-linear-gradient(left, #ffb709, #fe9402);
		background-size: 100% 100%;
	}

	.login-area-bj {
		height: 100%;
		margin: 128upx 20upx 0 20upx;
		background: url('~@/static/login/login_background.png') no-repeat;
		background-size: 710upx 725upx;
	}

	.login-desc1 {
		padding-top: 130upx;
		padding-left: 10upx;
		height: 54upx;
		line-height: 54upx;
		font-family: PingFang-SC-Bold;
		color: #fff;
		font-size: 48upx;

		.desc-sp1 {
			font-size: 54upx;
			line-height: 54upx;
			font-weight: bold;
		}
	}

	.login-desc2 {
		padding-top: 42upx;
		padding-left: 10upx;
		height: 70upx;
		line-height: 70upx;
		font-family: PingFang-SC-Bold;
		color: #fff;
		font-size: 70upx;
		font-weight: bold;

		.desc-sp2 {
			font-size: 48upx;
			line-height: 48upx;
		}
	}

	.login-dog {
		width: 300upx;
		height: 284upx;
		display: inline-block;
		position: relative;
		margin-left: 420upx;
		margin-top: -168upx;
		z-index: 50;
	}

	.login-content {
		width: 690upx;
		height: 450upx;
		align-content: center;
		border-radius: 8upx;
		background-color: #fff;
		z-index: 100;
		position: relative;
		margin-top: -55upx;
		margin-left: 10upx;
		padding: 125upx 35upx 0 35upx;
		box-sizing: border-box;

		.iphone-input {
			height: 84upx;
			border: 1upx solid #e5e5e5;
			border-radius: 86upx;
			font-size: 32upx;
			line-height: 32upx;
			color: #333333;
			padding-left: 46upx;
			box-sizing: border-box;
		}

		.iphone-placeholder {
			height: 84upx;
			text-align: left;
			font-size: 32upx;
			color: #e5e5e5;
			line-height: 84upx;
			box-sizing: border-box;
		}

		.invalid-feedback {
			width: 100%;
			height: 24upx;
			text-align: left;
			color: red;
			line-height: 24upx;
			margin-top: 10upx;
		}

		.next-step {
			width: 620upx;
			height: 84upx;
			background-color: #e5e5e5;
			border-radius: 84upx;
			border: none;
			color: #999999;
			line-height: 84upx;
			text-align: center;
			margin-top: 66upx;
			margin-bottom: 86upx;
		}

		.activeBtn {
			color: #fff;
			background: linear-gradient(left, #ffb709, #fe9402);
			background: -webkit-linear-gradient(left, #ffb709, #fe9402);
		}

		.uni-button:after {
			border: none;
		}

		uni-button[disabled][type='primary'] {
			background-color: #e5e5e5;
		}
	}

	.login-bottom {
		width: 100%;
		height: 608upx;

		.login-txt1 {
			with: 100%;
			height: 24upx;
			margin-top: 45upx;
			line-height: 24upx;
			color: #ffefd1;
			font-size: 24upx;
			text-align: center;

			.login-sp1 {
				display: inline-block;
				color: #fa503d;
			}
		}

		.login-txt2 {
			width: 100%;
			height: 24upx;
			margin-top: 158upx;
			line-height: 24upx;
			color: #ffefd1;
			font-size: 24upx;
			text-align: center;

			.login-sp2 {
				display: inline-block;
				padding-left: 10upx;
				color: #fa503d;
			}
		}

		.oauth-area {
			width: 100%;
			min-height: auto;
			height: auto;

			.login-way {
				height: 24px;
				line-height: 24px;
				margin-top: 35upx;
				text-align: center;

				.login-line {
					display: inline-block;
					width: 240upx;
					border-top: 2upx solid #ffe4b2;
					margin: 0 10upx;
				}

				.line-text {
					color: #ffefd1;
					vertical-align: middle;
					vertical-align: -10upx;
				}
			}

			.login-weixin {
				width: 422upx;
				height: 90upx;
				background-color: #fff;
				margin: 0 auto;
				margin-top: 70upx;
				display: flex;
				flex-direction: row;
				align-items: center;
				border-radius: 5upx;

				.wenxin-img {
					display: inline-block;
					width: 49upx;
					height: 40upx;
					padding-left: 50upx;
					padding-right: 20upx;
				}

				.wenxin-desc {
					font-size: 32upx;
					color: #999999;
					font-family: PingFang-SC-Medium;
				}
			}
		}
	}

	.modal {
		height: 404upx;
		background-color: #fff;
		border-radius: 16upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 90upx;

		.modal-txt1 {
			width: 446upx;
			margin: 0 auto;
			text-align: left;
			font-size: 28upx;
			color: #333333;
			line-height: 1.5;
		}

		.modal-tel {
			width: 100%;
			height: 36upx;
			text-align: center;
			font-size: 36upx;
			color: #333333;
			line-height: 36upx;
			padding-top: 40upx;
		}

		.modal-confirm {
			width: 386upx;
			height: 80upx;
			background: linear-gradient(left, #ffb709, #fe9402);
			background: -webkit-linear-gradient(left, #ffb709, #fe9402);
			border-radius: 80upx;
			border: none;
			color: #fff;
			line-height: 80upx;
			text-align: center;
			margin-top: 66upx;
		}
	}
</style>
