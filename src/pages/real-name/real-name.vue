<template>
	<!-- 实名认证页面 -->
	<view class="real-name-wrapper">
		<!-- 顶部导航条开始 -->
		<uni-nav-bar left-icon="back" @click-left="back" title="实名认证" background-color="-webkit-linear-gradient(left, #FFB709, #FE9402);linear-gradient(left, #FFB709, #FE9402)"
		 color="#fff" fixed="true">
		</uni-nav-bar>
		<!-- 顶部导航条结束 -->
		<view class="real-name-banner">
			<view class="real-name-banner-img"></view>
		</view>
		<view class="real-name-content">
			<view class="real-name-input">
				<view class="name-word">姓名</view>
				<input class="name-input" type="text" placeholder-class="name-placeholder" placeholder-style="color: #E5E5E5;font-size: 28upx;"
				 placeholder="请输入真实姓名" v-model="userName" />
				<view class="card-word">身份证号</view>
				<input class="card-input" type="idcard" maxlength="18" placeholder-class="card-placeholder" placeholder-style="color: #E5E5E5;font-size: 28upx;"
				 placeholder="请输入身份证号码" v-model="userCardID" />
				<view class="desc-word">请填写与您注册手机号对应的实名信息，您在“小冠优选”注册的手机号为：<text>{{userPhone}}</text></view>
				<button class="uni-button next-step" @tap="submitReal()" :class="{activeBtn : btnShow}" :disabled="isNextSend">
					提交
				</button>
			</view>
			<view class="real-name-desc">根据国家《网络安全法》规定，X月X日起，使用本平台服务需进行帐号实名认证。为了保障您的正常使用，请您于X月X日前完成手机号的实名验证。</view>
			<view class="help-area" @tap="customerPhone()" >遇到问题？请<text class="help-sp1">联系客服</text></view>
		</view>
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
				userPhone: '', // 注册手机号
				userName: '', // 姓名
				userCardID: '', // 身份证号
				btnShow: false, // 按钮下一步的颜色高亮
				isNextSend: true, // 控制下一步的按钮是否可点击
				token: '' //用户token
			};
		},
		onLoad: function() {
			this.token = this.$storage.isAuthed();
			this.userPhone = this.$storage.getStorage('userPhone',2);
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
			 * 提交认证，校验通过请求接口
			 *  */
			submitReal() {
				if (this.checkUserName() && this.checkUserCardID()) {
					// 获取token，没有跳转到登录页面

					let _this = this;
					let data = {
						type: 1, //验证方式0为phone，1为token
						name: _this.userName, //身份证姓名
						id: _this.userCardID, //身份证号码
						args: _this.token //验证内容
					}

					if (_this.token) {
						uni.showLoading({
							title: '加载中',
							mask: true
						});
						_this.$api.validatePIN(data)
							.then(res => {
								uni.hideLoading();
								res = res.data;
								let message = res.message;
								if (res.code == '0001') {
									let validateUrl = res.data.validateUrl;
									// console.log(validateUrl);
									// 过滤掉地址中的？及!,防止页面传参被过滤
									let realUrl = validateUrl.replace("?", "!").replace("=", "$");
									// 跳转到支付宝验证过度界面
									uni.redirectTo({
										url: "../real-name-zfb/real-name-zfb?validateUrl=" + realUrl
									});
								} else {
									uni.showToast({
										title: message,
										icon: "none",
										duration: 2000
									})
								}
							})
							.catch(err => {
								uni.hideLoading();
								uni.showToast({
									title: "服务异常",
									icon: "none",
									duration: 2000
								})
							})

					}
				}
			},
			/* 
			 * 校验姓名 
			 * */
			checkUserName() {
				let name_card = /[\u4e00-\u9fa5]{2,8}/; //姓名正则，至少含有两个中文字符
				if (!this.userName) {
					uni.showToast({
						title: '姓名不能为空',
						icon: "none",
						duration: 2000
					});
					return false;
				} else if (!name_card.test(this.userName)) {
					uni.showToast({
						title: '您输入的姓名不合法请重新输入',
						icon: "none",
						duration: 2000
					});
					return false;
				};
				return true;
			},
			/* 
			 * 校验身份证号
			 *  */
			checkUserCardID() {
				let regid_card = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
				if (!regid_card.test(this.userCardID)) {
					uni.showToast({
						title: '您输入的身份证号不合法',
						icon: "none",
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
			 * 监听身份证号为空时，提交按钮置灰
			 *  */
			userCardID() {
				if (!this.userCardID) {
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
	.real-name-wrapper {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		flex: 1;
		background: linear-gradient(left, #FFB709, #FE9402);
		background: -webkit-linear-gradient(left, #FFB709, #FE9402);
		background-size: 100% 100%;
	}

	.real-name-banner {
		width: 100%;
		height: 210upx;
		margin-top: 50upx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-content: center;

		.real-name-banner-img {
			width: 260upx;
			height: 210upx;
			background: url("~@/static/real_name/real_name.png") no-repeat;
			background-size: 260upx 210upx;
		}
	}

	.real-name-content {
		width: 100%;
		height: auto;
		margin-top: -30upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.real-name-input {
			width: 696upx;
			height: 700upx;
			background-color: #FFFFFF;
			border-radius: 8upx;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			align-items: center;
		}

		.real-name-desc {
			width: 650upx;
			height: auto;
			margin-top: 100upx;
			margin-bottom: 140upx;
		}
	}

	.name-word {
		width: 550upx;
		height: 32upx;
		line-height: 32upx;
		font-size: 32upx;
		font-family: PingFangSC-Regular;
		font-weight: 400;
		color: #333;
		margin-top: 70upx;
		margin-bottom: 30upx;
	}

	.name-input {
		width: 550upx;
		height: 86upx;
		border-radius: 86upx;
		box-sizing: border-box;
		border: 1upx solid #E5E5E5;
		text-align: left;
		font-size: 32upx;
		color: #333;
		padding-left: 46upx;
		line-height: 86upx;
	}

	.name-placeholder {
		height: 86upx;
		text-align: left;
		font-size: 32upx;
		color: #E5E5E5;
		line-height: 84upx;
		box-sizing: border-box;
	}

	.card-word {
		width: 550upx;
		height: 32upx;
		line-height: 32upx;
		font-size: 32upx;
		font-family: PingFangSC-Regular;
		font-weight: 400;
		color: #333;
		margin-top: 30upx;
		margin-bottom: 30upx;
	}

	.card-input {
		width: 550upx;
		height: 86upx;
		border-radius: 86upx;
		box-sizing: border-box;
		border: 1upx solid #E5E5E5;
		text-align: left;
		font-size: 32upx;
		color: #333;
		padding-left: 46upx;
		line-height: 86upx;
	}

	.card-placeholder {
		// width: auto;
		height: 86upx;
		text-align: left;
		font-size: 32upx;
		color: #E5E5E5;
		line-height: 84upx;
		box-sizing: border-box;
	}

	.desc-word {
		width: 550upx;
		height: auto;
		margin-top: 36upx;
		line-height: 44upx;
		font-size: 24upx;
		color: #666;
		font-family: PingFangSC-Light;
	}

	.next-step {
		width: 508upx;
		height: 84upx;
		background-color: #E5E5E5;
		border-radius: 84upx;
		border: none;
		color: #999999;
		line-height: 84upx;
		text-align: center;
		margin-top: 60upx;
		margin-bottom: 68upx;
	}

	.activeBtn {
		color: #fff;
		background: linear-gradient(left, #FFB709, #FE9402);
		background: -webkit-linear-gradient(left, #FFB709, #FE9402);
	}

	.uni-button:after {
		border: none;
		color: #fff !important;
	}

	uni-button[disabled][type=primary] {
		background-color: #E5E5E5;
	}

	uni-button[disabled]:not([type]) {
		color: #fff !important;
	}

	.real-name-desc {
		width: 650upx;
		height: auto;
		margin-top: 36upx;
		line-height: 44upx;
		font-size: 24upx;
		color: #FFEFD1;
		font-family: PingFangSC-Light;
	}

	.help-area {
		width: 100%;
		height: 24upx;
		margin-top: 40upx;
		margin-bottom: 115upx;
		line-height: 24upx;
		color: #FFEFD1;
		font-size: 24upx;
		text-align: center;

		.help-sp1 {
			display: inline-block;
			padding-left: 10upx;
			color: #FA503D;
		}
	}
</style>
