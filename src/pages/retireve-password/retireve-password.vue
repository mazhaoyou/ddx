<template>
	<!-- 
	* 	忘记密码、修改密码页面 
	* 	作者：wux
	* 	手机号校验
	* 	新密码修改
	* -->
	<view class="unsafe-message-wrapper">
		<!-- 顶部导航条开始 -->
		<uni-nav-bar left-icon="back" @click-left="back" title="重置密码" background-color="-webkit-linear-gradient(left, #FFB709, #FE9402);linear-gradient(left, #FFB709, #FE9402)"
		 color="#fff" fixed="true">
		</uni-nav-bar>
		<!-- 顶部导航条结束 -->
		<!-- 输入框区域开始 -->
		<view class="unsafe-message-bj"></view>
		<view class="unsafe-message-content">
			<view class="unsafe-desc">需要发送短信验证的手机号码为：</view>
			<view class="unsafe-iphone">{{userPhone}}</view>
			<view class="code-area">
				<input class="uni-input code-input" type="number" maxlength="6" placeholder="请输入验证码" placeholder-class="code-placeholder" v-model="userVerify" />
				<button class="uni-button code-btn" type="primary" @tap="sendCode()" :disabled="!isSend" :class="{'code-btn-active': isSend}">
					{{verifyCode}}
				</button>
			</view>
			<view class="set-password-area">
				<view class="set-password-safe-area">
					<input class="uni-input password-input" :password="showPassword" placeholder="请输入您要设置的密码" placeholder-class="password-placeholder"
					 v-model="passwd" />
					<view class="eye-img-container" @tap="changeType()" >
						<image class="eye-img" :src="imageSrc" mode="" ></image>
					</view>
				</view>
			</view>
			<button class="uni-button next-step" @tap="modifyComplete()" :class="{activeBtn : btnShow}" :disabled="isNextSend">
				完 成
			</button>
		</view>
		<!-- 输入框区域结束 -->
		<!-- 问题区域开始 -->
		<view class="login-txt2" @tap="customerPhone()" >遇到问题？请<text class="login-sp2">联系客服</text></view>
		<!-- 问题区域结束 -->
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
				verifyCode: '获取验证码',
				timer: null,
				userVerify: '', //验证码
				passwd: '', //密码
				isSend: true, // 按钮完成的颜色高亮
				btnShow: false, // 按钮完成的颜色高亮
				isNextSend: true, // 控制完成的按钮是否可点击
				imageSrc: require('../../static/set_password/eye_close.png'),
				showPassword: true, // 显示密码
				funType:'' //忘记密码：2，修改密码：3
			};
		},
		onLoad: function(prams) {
			// 获取用户手机号
			this.userPhone = prams.phone;
			// 获取忘记密码与修改密码参数
			this.funType = prams.funType;
		},
		methods: {
			/* 
			 * 点击返回
			 *  */
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			/* 
			 * 明码与暗码的切换
			 *  */
			changeType() {
				this.showPassword = !this.showPassword;
				this.imageSrc =
					this.imageSrc == require('../../static/set_password/eye_close.png') ?
					require('../../static/set_password/eye_open.png') :
					require('../../static/set_password/eye_close.png');
			},
			/* 
			 * 点击获取验证码按钮 
			 * */
			sendCode() {
				if ('' !=  this.userPhone && null != this.userPhone && undefined != this.userPhone) {
					const count = 60;
					let times = 60;
					if (!this.timer) {
						this.isSend = false; // 按钮禁用
						this.getCode(); // 调用发送短信的方法
						this.timer = setInterval(() => { // 倒计时;
							if (times > 0 && times <= count) {
								this.verifyCode = times-- + 's后重新发送'
							} else {
								this.isSend = true; // 按钮可用
								this.verifyCode = '获取验证码';
								clearInterval(this.timer);
								this.timer = null;
							}
						}, 1000);
					}
				}
			},
			/* 
				获取验证码
			 */
			getCode() {
				let _this = this;
				let data = {
					phone: _this.userPhone,
					yidunCode: '',
					codeType: 1,
					functionType: _this.funType
				}
				// 调用获取验证码
				this.$api
					.getVerificationCode(data)
					.then(res => {
						res = res.data;
						let message = res.message;
						if (res.code == '0001') {
							uni.showToast({
								title: message,
								icon: 'success',
								duration: 2000
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
						uni.showToast({
							title: '服务异常',
							icon: 'none',
							duration: 2000
						});
					})
			},
			/* 
			 * 校验验证码是否为空
			 *  */
			checkVerifyCode() {
				if (null == this.userVerify || '' == this.userVerify || undefined == this.userVerify) {
					uni.showToast({
						title: '请您输入正确的验证码',
						icon: 'none',
						duration: 2000
					})
					return false;
				}
				return true;
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
			 * 点击完成修改密码按钮
			 * */
			modifyComplete() {
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				let token = this.$storage.getStorage("token");
				if (this.checkVerifyCode() && this.checkPassword()) {
					let data = {
						phone: this.userPhone,
						verificationCode: this.userVerify,
						newPassword: this.passwd,
						functionType: this.funType,
						token: token
					};
					this.$api
						.modifyPassword(data)
						.then(res => {
							uni.hideLoading();
							res = res.data;
							let message = res.message;
							if (res.code == '0001') {
								uni.showToast({
									title: message,
									icon: 'success',
									duration: 2000
								});

								
								if(this.funType == 2) {	//忘记密码
									uni.switchTab({
										url: '../index/index'
									})
								} else if(this.funType == 3) { //修改密码
									uni.navigateTo({
										url: '../setting/setting'
									})
								}

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
			 * 监听密码为空时完成按钮置为灰色
			 *  */
			passwd() {
				if ('' == this.passwd || null == this.passwd || undefined == this.passwd) {
					this.btnShow = false;
					this.isNextSend = true;
				} else {
					this.btnShow = true;
					this.isNextSend = false;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.unsafe-message-wrapper {
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

	.unsafe-message-bj {
		height: 100%;
		margin: 32upx 15upx 0 15upx;
		background: url('~@/static/message_verify/message_verify.png') no-repeat;
		background-size: 730upx 574upx;
	}

	.unsafe-message-content {
		width: 690upx;
		background: #fff;
		border-radius: 8upx;
		position: relative;
		margin: -390upx auto 0;
		padding-bottom: 60upx;
		box-shadow: 2px 2px 14px 0px rgba(191, 191, 191, 0.46);

		.unsafe-desc {
			height: 32upx;
			line-height: 32upx;
			color: #666;
			font-size: 32upx;
			padding-top: 90upx;
			padding-left: 32upx;
		}

		.unsafe-iphone {
			height: 32upx;
			line-height: 32upx;
			color: #666;
			font-size: 32upx;
			padding-top: 40upx;
			padding-left: 32upx;
		}
	}

	/* +++++短信验证码部分开始+++++++ */
	.code-area {
		width: 622upx;
		height: 86upx;
		border-radius: 86upx;
		border: 1upx solid #E5E5E5;
		box-sizing: border-box;
		font-size: 32upx;
		line-height: 86upx;
		margin: 0 auto;
		display: flex;
		flex-direction: row;
		justify-content: center;
		margin-top: 96upx;
		padding-left: 26upx;

		.code-input {
			width: 380upx;
			height: 66upx;
			border-top-left-radius: 66upx;
			border-bottom-left-radius: 66upx;
			border: none;
			padding-top: 0;
			padding-bottom: 0;
			margin-top: 10upx;
		}

		.code-placeholder {
			text-align: left;
			color: #ccc;
		}

		.code-btn {
			width: 230upx;
			height: 66upx;
			background-color: #F5F5F5;
			border-radius: 66upx;
			border: none;
			font-size: 26upx;
			line-height: 66upx;
			color: #999;
			text-align: center;
			margin-top: 10upx;
			margin-right: 10upx;
		}

		.code-btn-active {
			color: #fff;
			background: linear-gradient(left, #FFB709, #FE9402);
			background: -webkit-linear-gradient(left, #FFB709, #FE9402);
		}

		.uni-button:after {
			border: none;
		}
	}

	/* +++++++++短信验证码结束+++++++++ */
	/* ++++++++++新密码开始 ++++++++++++*/
	.set-password-area {
		width: 622upx;
		height: 86upx;
		margin: 40upx auto 0;

		.set-password-safe-area {
			width: 622upx;
			height: 86upx;
			border: 1upx solid #e5e5e5;
			box-sizing: border-box;
			border-radius: 86upx;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;

			.password-input {
				width: 380upx;
				height: 66upx;
				border-top-left-radius: 66upx;
				border-bottom-left-radius: 66upx;
				border: none;
				padding-top: 0;
				padding-bottom: 0;
				margin: 10upx 0;
				margin-left: 20upx;
			}

			.password-placeholder {
				height: 66upx;
				text-align: left;
				color: #ccc;
				line-height: 66upx;
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
				margin-right: 35upx;
			}
		}
	}

	/* ++++++++++新密码结束 +++++++++++++*/

	.next-step {
		width: 620upx;
		height: 84upx;
		background-color: #E5E5E5;
		border-radius: 84upx;
		border: none;
		color: #999;
		line-height: 84upx;
		text-align: center;
		margin-top: 60upx;
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

	/* ++++++++问题区域开始++++++++ */
	.login-txt2 {
		width: 100%;
		height: 24upx;
		padding-top: 300upx;
		padding-bottom: 200upx;
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

	/* ++++++++问题区域结束++++++++ */
</style>
