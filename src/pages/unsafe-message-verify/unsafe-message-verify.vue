<template>
	<!-- 不安全信息验证页面 -->
	<view class="unsafe-message-wrapper">
		<!-- 顶部导航条开始 -->
		<uni-nav-bar left-icon="back"
			@click-left="back"
			title="短信验证"
			background-color="-webkit-linear-gradient(left, #FFB709, #FE9402);linear-gradient(left, #FFB709, #FE9402)"
			color="#fff"
			fixed="true"
		>
		</uni-nav-bar>
		<!-- 顶部导航条结束 -->
		<!-- 输入框区域开始 -->
		<view class="unsafe-message-bj"></view>
		<view class="unsafe-message-content">
			<view class="unsafe-desc">需要发送短信验证的手机号码为：</view>
			<view class="unsafe-iphone">{{user_phone}}</view>
			<view class="code-area">
				<input class="uni-input code-input"
					focus
					placeholder="请输入验证码"
					placeholder-class="code-placeholder"
					v-model="user_verif"
					name="code"
					maxlength="6"
				/>
				<button class="uni-button code-btn"
					type="primary"
					@click="sendCode()"
					:disabled="isSend"
					:class="{'code-btn-active': isSend}"
				>
					{{verif_code}}
				</button>
			</view>
			<button class="uni-button next-step"
				@click="bindClick()"
				:class="{activeBtn : btnShow}"
				:disabled="isNextSend"
			>
				下一步
			</button>
		</view>
		<!-- 输入框区域结束 -->
		<!-- 问题区域开始 -->
		<view class="login-txt2">遇到问题？请<text class="login-sp2">联系客服</text></view>
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
				user_phone: '',
				verif_code: '获取验证码',
				timer: null,
				user_verif: '',
				url: '/apis/',
				code: '',
				isSend: true,
				btnShow: false ,// 按钮下一步的颜色高亮
				isNextSend: true // 控制下一步的按钮是否可点击
			};
		},
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			console.log(option.user_phone ,"aaaa"); //打印出上个页面传递的参数。
			this.user_phone = option.user_phone;
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			sendCode() {
				// alert(123)
				if (this.user_phone != '') {
					const count = 60;
					let times = 60;
					if (!this.timer) {
						this.isSend = false; // 按钮禁用
						this.code = this.randomCode(); // 调用随机生成随机验证码的方法
						// this.sendNote(this.user_phone, this.code); // 调用发送短信的方法
						this.timer = setInterval(() => { // 倒计时;
							if (times > 0 && times <= count) {
								this.verif_code = times-- + 's后重新发送'
							} else {
								this.isSend = true; // 按钮可用
								this.verif_code = '获取验证码';
								clearInterval(this.timer);
								this.timer = null;
							}
						}, 1000);
					}
				}
			},
			sendNote(tel, code) { // 发送短信模板
				const text = '验证码：' + code + ',您正在使用登陆功能,该验证码仅用于身份验证,在五分钟之内有效，请勿泄露给其他人使用。' //短信内容模板，已经在sms平台绑定此内容，所以会比普通的更快到达用户手机。
				let param = new URLSearchParams();
				param.append('Uid', '68wei');
				param.append('Key', 'd41d8cd98f00b204e980');
				param.append('smsMob', tel);
				param.append('smsText', text);
				this.$http.post(this.url, param, {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
					},
				}).then(function(response) {
					console.log(response)
				})
			},
			randomCode() { // 生成随机6位验证码
				let code = ""
				let code_lenght = 6

				let random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
				for (let i = 0; i < code_lenght; i++) // 随机生成6位验证码
				{
					let index = Math.floor(Math.random() * 10)
					code += random[index]
				}
				return code
			},
			bindClick() {
				uni.hideKeyboard();
				uni.navigateTo({
					url: '../set-password/set-password?user_phone=' + this.user_phone
				});
			}
		},
		watch: {
			user_verif() { // 监听验证码位数是否是6位
				console.log(this.user_verif.length)
				if (this.user_verif.length === 6) {
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
	// 输入框区域开始
	.unsafe-message-bj {
		height: 100%;
		margin: 32upx 15upx 0 15upx;
		background: url('~@/static/message_verify/message_verify.png') no-repeat;
		background-size: 730upx 574upx;
	}

	.unsafe-message-content {
		width: 690upx;
		height: 630upx;
		background: #fff;
		border-radius: 8upx;
		position: relative;
		margin: 0 auto;
		margin-top: -390upx;
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
			font-size: 20upx;
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
		uni-button[disabled][type=primary] {
			background-color: #E5E5E5;
		}
	}
	
	.next-step {
		width: 620upx;
		height: 84upx;
		background-color: #F5F5F5;
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
	// 输入框区域结束
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
