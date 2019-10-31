<template>
	<!-- 密码登录页面 -->
	<view class="psssword-login-wrapper">
		<!-- 顶部导航条开始 -->
		<uni-nav-bar left-icon="back" @click-left="back" title="密码登录" background-color="-webkit-linear-gradient(left, #FFB709, #FE9402);linear-gradient(left, #FFB709, #FE9402)"
		 color="#fff" fixed="true">
		</uni-nav-bar>
		<!-- 顶部导航条结束 -->
		<view class="psssword-login-bj"></view>
		<view class="psssword-login-content">
			<view class="psssword-desc">需要发送短信验证的手机号码为：</view>
			<view class="psssword-iphone">{{userPhone}}</view>
			<view class="code-area">
				<input class="uni-input code-input" placeholder="请输入密码" placeholder-class="code-placeholder" :password="showPassword"
				 v-model="passwd" />
				<view class="eye-img-container" @tap="changeType()">
					<image class="eye-img" :src="imageSrc" mode=""></image>
				</view>
			</view>
			<view class="password-pwd-area">
				<view class="psssword-pwd-txt1" @tap="forgetPassword()">忘记密码</view>
				<view class="psssword-pwd-txt2" @tap="safeMessageLogin()">通过短信验证登录</view>
			</view>
			<button class="uni-button next-step" @tap="pwdLogin()" :class="{activeBtn : btnShow}" :disabled="isNextSend">
				登 录
			</button>
		</view>
		<view class="login-txt2" @tap="customerPhone()"  >遇到问题？请<text class="login-sp2">联系客服</text></view>
	</view>
</template>

<script>
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue'
	import uniIcon from '@/components/uni-icon/uni-icon.vue'

	export default {
		components: {
			uniNavBar,
			uniIcon
		},
		data() {
			return {
				userPhone: '',
				imageSrc: require("../../static/set_password/eye_close.png"),
				showPassword: true, // 显示密码
				passwd: "", //密码
				btnShow: false, // 按钮登录时的颜色高亮
				isNextSend: true // 控制登录的按钮是否可点击
			};
		},
		onLoad: function(prams) {

			// 获取到用户手机号
			this.userPhone = prams.phone;
		},
		methods: {
			/* 
			 * 点击左上角返回
			 *  */
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			/* 
			 * 密码明码暗码检测
			 *  */
			changeType() {
				this.showPassword = !this.showPassword;
				this.imageSrc = this.imageSrc == require("../../static/set_password/eye_close.png") ? require(
					"../../static/set_password/eye_open.png") : require("../../static/set_password/eye_close.png");
			},
			/* 
			 * 忘记密码，传入funType参数为2 
			 * */
			forgetPassword() {
				uni.navigateTo({
					url: '../retireve-password/retireve-password?phone=' + this.userPhone + '&funType=' + 2
				});
			},
			/* 
			 * 通过短信登录 
			 * */
			safeMessageLogin() {
				uni.navigateTo({
					url: '../safe-message-verify/safe-message-verify?phone=' + this.userPhone
				});
			},
			/* 
			 * 点击密码登录 
			 * */
			pwdLogin() {
				if (this.checkPassword()) {
					uni.showLoading({
						title: '正在登录',
						mask: true
					});
					let _this = this;
					let data = {
						phone: _this.userPhone,
						password: _this.passwd
					}

					_this.$api
						.passwordLogin(data)
						.then(res => {
							uni.hideLoading();
							res = res.data;
							let message = res.message;
							if (res.code == '0001') {
								let userData = res.data;
								let userDataList = {
									newHeadImg: userData.headPicUrl,
									newUserId: userData.userId,
									newNickName: userData.nickName,
									newToken: userData.token,
									userPhone: userData.phone,
									wechatStatus: userData.wechatStatus
								}

								// 缓存用户信息
								_this.$storage.setStorage('userPhone',userDataList.userPhone,2);
								_this.$storage.setStorage('wechatStatus',userDataList.wechatStatus,2);
								_this.$storage.setStorage('headImg', userDataList.newHeadImg,2);
								_this.$storage.setStorage('nickName', userDataList.newNickName,2);
								_this.$storage.setStorage('userId', userDataList.newUserId,2);
								_this.$storage.setStorage('token', userDataList.newToken,2);


								uni.showToast({
									title: message,
									icon: 'success',
									duration: 2000
								});
								uni.switchTab({
									url: '../index/index'
								});
							} else {
								uni.showToast({
									title: message,
									icon: 'none',
									duration: 2000
								});
							}
						})
						.catch(error => {
							uni.hideLoading();
							uni.showToast({
								title: '服务异常',
								icon: 'none'
							});
						})
				}
			},
			/* 
			 * 密码校验 
			 * */
			checkPassword() {
				let pwd = this.passwd;
				var Reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/;

				if (!(pwd.length >= 6 && pwd.length <= 16)) {
					uni.showToast({
						title: '密码长度需为6到16个字符，使用英文字母、数字的组合',
						icon: 'none',
						duration: 2000
					});
					return false;
				}

				if (!Reg.test(pwd)) {
					uni.showToast({
						title: '密码长度需为6到16个字符，使用英文字母、数字的组合',
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				return true;
			},
			/* 
			* 拨打客服电话 
			* */
			customerPhone() {
				let customPhone = this.$storage.getStorage('customerPhone',2);
				if('' != customPhone && null != customPhone && undefined != customPhone ) {
					uni.makePhoneCall({
						phoneNumber: customPhone  //仅为示例
					});
				}
			}
		},
		watch: {
			/* 
			 * 监听密码是否为空，为空时登录按钮置空
			 *  */
			passwd() {
				if ('' == this.passwd || null == this.passwd || undefined == this.passwd) {
					this.btnShow = false
					this.isNextSend = true
				} else {
					this.btnShow = true
					this.isNextSend = false
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.psssword-login-wrapper {
		width: 100%;
		min-height: 592upx;
		height: calc(592upx + var(--status-bar-height));
		z-index: -1;

		&:after {
			content: '';
			width: 100%;
			height: calc(592upx + var(--status-bar-height));
			height: 592upx;
			position: absolute;
			top: 0;
			right: 0;
			z-index: -1;
			border-radius: 0 0 10% 10%;
			background: linear-gradient(left, #FFB709, #FE9402);
			background: -webkit-linear-gradient(left, #FFB709, #FE9402);
		}
	}

	.psssword-login-bj {
		height: 100%;
		margin: 32upx 15upx 0 15upx;
		background: url('~@/static/message_verify/message_verify.png') no-repeat;
		background-size: 730upx 574upx;
	}

	.psssword-login-content {
		width: 690upx;
		height: 666upx;
		background: #fff;
		border-radius: 8upx;
		position: relative;
		margin: 0 auto;
		margin-top: -390upx;
		box-shadow: 2px 2px 14px 0px rgba(191, 191, 191, 0.46);

		.psssword-desc {
			height: 32upx;
			line-height: 32upx;
			color: #666;
			font-size: 32upx;
			padding-top: 90upx;
			padding-left: 32upx;
		}

		.psssword-iphone {
			height: 32upx;
			line-height: 32upx;
			color: #666;
			font-size: 32upx;
			padding-top: 40upx;
			padding-left: 32upx;
		}
	}

	.code-area {
		width: 622upx;
		height: 86upx;
		border-radius: 86upx;
		border: 1upx solid #E5E5E5;
		box-sizing: border-box;
		font-size: 32upx;
		margin: 0 auto;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 96upx;
		padding-left: 26upx;

		.code-input {
			width: 380upx;
			height: 66upx;
			border-radius: 66upx;
			padding-top: 0;
			padding-bottom: 0;
			margin: 10upx 0;
			border: none;
		}

		.eye-img-container {
			height: 80%;
			display: flex;
			align-items: center;
		}

		.eye-img {
			display: inline-block;
			width: 40upx;
			height: 30upx;
			margin: auto 0;
			margin-right: 35upx;

		}

		.code-placeholder {
			text-align: left;
			color: #ccc;
		}
	}

	.password-pwd-area {
		width: 100%;
		height: 28upx;
		color: #FF911B;
		line-height: 32upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 36upx;

		.psssword-pwd-txt1 {
			padding-left: 32upx;
			text-align: left;
		}

		.psssword-pwd-txt2 {
			padding-right: 36upx;
			text-align: right;
		}
	}

	.next-step {
		width: 620upx;
		height: 84upx;
		background-color: #E5E5E5;
		border-radius: 84upx;
		border: none;
		color: #999;
		line-height: 84upx;
		text-align: center;
		margin-top: 80upx;
	}

	.activeBtn {
		color: #fff;
		background: linear-gradient(left, #FFB709, #FE9402);
		background: -webkit-linear-gradient(left, #FFB709, #FE9402);
	}

	.uni-button:after {
		border: none;
	}

	uni-button[disabled][type=primary] {
		background-color: #E5E5E5;
	}

	.login-txt2 {
		width: 100%;
		height: 24upx;
		padding-top: 390upx;
		padding-bottom: 240upx;
		line-height: 24upx;
		color: #666666;
		font-size: 24upx;
		text-align: center;

		.login-sp2 {
			display: inline-block;
			padding-left: 10upx;
			color: #FA503D;
		}
	}
</style>
