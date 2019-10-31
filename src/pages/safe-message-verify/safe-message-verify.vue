<template>
	<!-- 短信登录页面 -->
	<view class="safe-message-wrapper">
		<!-- 顶部导航条开始 -->
		<uni-nav-bar left-icon="back" @click-left="back" title="短信验证" background-color="-webkit-linear-gradient(left, #FFB709, #FE9402);linear-gradient(left, #FFB709, #FE9402)"
		 color="#fff" fixed="true">
		</uni-nav-bar>
		<!-- 顶部导航条结束 -->
		<!-- 输入框区域开始 -->
		<view class="safe-message-bj"></view>
		<view class="safe-message-content">
			<view class="safe-desc">需要发送短信验证的手机号码为：</view>
			<view class="safe-iphone">{{userPhone}}</view>
			<view class="code-area">
				<input class="uni-input code-input" type="number" placeholder="请输入验证码" placeholder-class="code-placeholder" v-model="userVerify"
				 maxlength="6" name="code" />
				<button class="uni-button code-btn" type="primary" @tap="sendCode()" :disabled="!isSend" :class="{'code-btn-active': isSend}">
					{{verifyCode}}
				</button>
			</view>
			<view class="safe-pwd" v-if="openid==''">
				<view class="safe-pwd-txt" @tap="passwordLogin()">密码登录</view>
			</view>
			<button class="uni-button next-step" @tap="clickSmsLogin()" :class="{activeBtn : btnShow}" :disabled="isNextSend">
				登 录
			</button>
		</view>
		<!-- 输入框区域结束 -->
		<!-- 问题区域开始 -->
		<view class="login-txt2" @tap="customerPhone()"  >遇到问题？请<text class="login-sp2">联系客服</text></view>
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
				userPhone: '', //手机号
				verifyCode: '发送短信验证码', //发送验证码按钮文字
				timer: null, //短信倒计时定时器变量
				userVerify: '', //输入短信验证码
				isSend: true, //控制发送短信验证码按钮可否点击
				btnShow: false, // 按钮登录的颜色高亮
				isNextSend: true ,// 控制登录的按钮是否可点击
				openid: ''//微信用户 openid
			};
		},
		onLoad: function(prams) {
			this.userPhone = prams.phone;
			this.openid = prams.openid;
		},
		methods: {
			/* 
			 * 点击返回 
			 * */
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			/*
			 点击发送验证码按钮
			  */
			sendCode() {
				if ('' !=  this.userPhone && null != this.userPhone && undefined != this.userPhone) {
					const count = 60;
					let times = 60;
					if (!this.timer) {
						this.isSend = false; // 按钮禁用
						this.getCode(); // 调用发送短信的方法
						this.timer = setInterval(() => { // 倒计时;
							if (times > 0 && times <= count) {
								this.verifyCode = times-- + '秒后重新发送'
							} else {
								this.isSend = true; // 按钮可用
								this.verifyCode = '发送短信验证码';
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
					functionType: 1
				}
				// 获取验证码
				_this.$api
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
							icon: 'none'
						});
					})
			},
			/* 
			 * 通过密码登录 
			 * */
			passwordLogin() {
				let userPhone = this.userPhone
				uni.navigateTo({
					url: '../password-login/password-login?phone=' + userPhone
				});
			},
			/* 
			 * 点击验证码登录
			 *  */
			clickSmsLogin() {
				uni.showLoading({
					title: '正在登录',
					mask: true
				});
				let _this = this;
				let data = {
					phone: _this.userPhone,
					verificationCode: _this.userVerify,
					openid:_this.openid
				}
				
				_this.$api
					.smsLogin(data)
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
							
							
							// 登录成功后缓存用户信息
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
			* 监听验证码位数是否是6位 
			* */
			userVerify() { 
				if (this.userVerify.length === 6) {
					this.btnShow = true
					this.isNextSend = false
				} else {
					this.btnShow = false
					this.isNextSend = true
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.safe-message-wrapper {
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

	// 输入框区域开始
	.safe-message-bj {
		height: 100%;
		margin: 32upx 15upx 0 15upx;
		background: url('~@/static/message_verify/message_verify.png') no-repeat;
		background-size: 730upx 574upx;
	}

	.safe-message-content {
		width: 690upx;
		height: 666upx;
		background: #fff;
		border-radius: 8upx;
		position: relative;
		margin: 0 auto;
		margin-top: -390upx;
		box-shadow: 2px 2px 14px 0px rgba(191, 191, 191, 0.46);

		.safe-desc {
			height: 32upx;
			line-height: 32upx;
			color: #666;
			font-size: 32upx;
			padding-top: 90upx;
			padding-left: 32upx;
		}

		.safe-iphone {
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
			padding-top: 0;
			padding-bottom: 0;
			margin-top: 10upx;
			border: none;
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

	.safe-pwd {
		// padding-left: 32upx;
		margin-top: 36upx;
	}
	.safe-pwd-txt {
		width: 200upx;
		height: 60upx;
		color: #FF911B;
		text-align: center;
		line-height: 60upx;
		// margin-top: 36upx;
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

	// 问题区域开始
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

	// 问题区域结束
</style>
