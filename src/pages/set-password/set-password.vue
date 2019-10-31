<template>
	<!-- 设置密码页面 -->
	<view class="set-password-wrapper">
		<!-- 顶部导航条开始 -->
		<uni-nav-bar  title="设置密码" background-color="-webkit-linear-gradient(left, #FFB709, #FE9402);linear-gradient(left, #FFB709, #FE9402)"
		 color="#fff" fixed="true"></uni-nav-bar>
		<!-- 顶部导航条结束 -->
		<!-- 输入框区域开始 -->
		<view class="set-password-bj">
			<view @tap="setPwdSkip()" class="set-pwd-skip">跳 过</view>
		</view>
		<view class="set-password-content">
			<view class="set-password-area">
				<view class="set-password-safe-area">
					<input class="uni-input password-input" :password="showPassword"  placeholder="请输入您要设置的密码" placeholder-class="password-placeholder"
					  v-model="passwd" />
					<view class="eye-img-container" @tap="changeType()">
						<image class="eye-img" :src="imageSrc" mode="" ></image>
					</view>
				</view>
			</view>
			<button class="uni-button next-step" @tap="completeSetPwd()" :class="{ activeBtn: btnShow }" :disabled="isNextSend">完 成</button>
		</view>
		<!-- 输入框区域结束 -->
		<!-- 问题区域开始 -->
		<view class="login-txt2" @tap="customerPhone()"  >
			遇到问题？请
			<text class="login-sp2">联系客服</text>
		</view>
		<!-- 问题区域结束 -->
	</view>
</template>

<script>
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
	import uniIcon from '@/components/uni-icon/uni-icon.vue';

	export default {
		components: {
			uniNavBar,
			uniIcon
		},
		data() {
			return {
				userPhone: '',
				imageSrc: require('../../static/set_password/eye_close.png'),
				passwd: '',
				token:'',
				btnShow: false, // 按钮完成的颜色高亮
				showPassword: true, // 显示密码
				isNextSend: true, // 控制完成的按钮是否可点击
				perInfo: 1 //进入首页控制完善弹窗
			};
		},
		onLoad: function(prams) {
			// 用户注册的信息
			let userInfo =JSON.parse(prams.regsInfo); //用户信息
			this.userPhone = userInfo.phone;
			let newHeadImg = userInfo.headPicUrl; //用户头像
			let newNickName = userInfo.nickName; //用户名
			let newUserId = userInfo.userId; //用户id
			let newToken = userInfo.token; //token
			let wechatStatus = userInfo.wechatStatus; //微信绑定状态
			
			this.token = newToken;
			// 将用户信息进行缓存
			this.$storage.setStorage('userPhone',this.userPhone,2);
			this.$storage.setStorage('wechatStatus', wechatStatus,2);
			this.$storage.setStorage('headImg', newHeadImg,2);
			this.$storage.setStorage('nickName', newNickName,2);
			this.$storage.setStorage('userId', newUserId,2);
			this.$storage.setStorage('token', newToken,2);

		},
		methods: {
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
			*  点击完成按钮时进行设置密码
			*  */
			completeSetPwd() {
				if(this.checkPassword()) {
					uni.showLoading({
						title: '加载中',
						mask: true
					});
					let data = {
						token: this.token,
						newPassword: this.passwd
					};
					this.$api
						.setPassword(data)
						.then(res => {
							uni.hideLoading();
							res = res.data;
							let message = res.message;
							if(res.code == '0001') {
								uni.showToast({
									title: message,
									icon: 'success',
									duration:2000
								});
								// 新用户设置密码后进入首页显示 去完善资料
								this.$store.commit('changeCollectionFlag', true);
								uni.switchTab({
									url: '../index/index'
								});
								
							} else {
								uni.showToast({
									title: message,
									icon: 'none',
									duration:2000
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
						icon : 'none',
						duration: 2000
					});
					return false;
				}
			
				if (!Reg.test(pwd)) {
					uni.showToast({
						title: '密码长度需为6到16个字符，使用英文字母、数字的组合',
						icon : 'none',
						duration: 2000
					});
					return false;
				}
				return true;
			},
			/* 
			* 跳过设置密码
			*  */
			setPwdSkip() {
				// 新用户设置密码后进入首页显示 去完善资料
				this.$store.commit('changeCollectionFlag', true);
				uni.switchTab({
					url: '../index/index'
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
			* 监听密码为空时完成按钮置为灰色
			*  */
			passwd() {
				if('' == this.passwd || null == this.passwd || undefined == this.passwd) {
					this.btnShow = false;
					this.isNextSend = true;
				} else {
					this.btnShow = true;
					this.isNextSend = false;
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.set-password-wrapper {
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
			background: linear-gradient(left, #ffb709, #fe9402);
			background: -webkit-linear-gradient(left, #ffb709, #fe9402);
		}
	}

	// 输入框区域开始
	.set-password-bj {
		position: relative;
		height: 100%;
		margin: 32upx 15upx 0 15upx;
		background: url('~@/static/message_verify/message_verify.png') no-repeat;
		background-size: 730upx 574upx;
		
		> .set-pwd-skip {
			position: absolute;
			right: 20upx;
			top: 30upx;
			width: 150upx;
			height: 60upx;
			line-height: 60upx;
			text-align: center;
			font-size: 30upx;
			color: #ffffff;
			border: 1px solid #ffffff;
			border-radius: 60upx;
		}
	}

	.set-password-content {
		width: 690upx;
		height: 472upx;
		background: #fff;
		border-radius: 8upx;
		position: relative;
		margin: 0 auto;
		margin-top: -390upx;
		box-shadow: 2px 2px 14px 0px rgba(191, 191, 191, 0.46);

		.set-password-area {
			width: 622upx;
			height: 86upx;
			margin: 0 auto;
			padding-top: 114upx;

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
	}

	.next-step {
		width: 512upx;
		height: 84upx;
		background: #e5e5e5;
		border-radius: 84upx;
		border: none;
		color: #999;
		line-height: 84upx;
		text-align: center;
		margin-top: 80upx;
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

	// 输入框区域结束
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
			color: #fa503d;
		}
	}

	// 输入框区域结束
</style>
