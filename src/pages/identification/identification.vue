<template>
	<!-- 实名验证通过页面 -->
	<view class="identification-success-wrapper">
		<!-- 顶部导航条开始 -->
		<!-- <uni-nav-bar left-icon="back" @click-left="back" title="实名认证" background-color="#FFFFFF" color="#000000" fixed="true">
		</uni-nav-bar> -->
		<!-- 顶部导航条结束 -->
		<view class="identification-success-content">
			<image class="identification-success-img" src="" mode=""></image>
			<view class="identification-success-desc">
				<text class="name">{{validateFlag?newStr:userName}}</text>
				<text class="card-id">{{validateFlag?newCard:userCardID}}</text>
			</view>
			<view class="identification-success-txt">{{textMessage}}</view>
			<view class="identification-success-explain">
				本次实名认证采用阿里云云盾身份认证服务，技术安全，数据合规，通道稳定。由阿里云为您的数据保驾护航，请放心使用。
			</view>
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
				userName: "",
				userCardID: "",
				textMessage:'',
				validateFlag: true, //验证成功失败控制身份证显示开关变量
			}
		},
		onLoad(prams) {
			// 判断ivSign不存在的情况
			let data = {};
			if(prams.ivSign) {
				data = {
					userId: prams.userId,
					ivSign: prams.ivSign
				}
			} else {
				data = {
					userId: prams.userId,
					ivSign: ''
				}
			}
			// 验签实名认证
			this.validateName(data);
			
		},
		methods: {
			/* 
			* 验签实名认证
			*  */
			validateName(data) {
				let _this = this;
				_this.$api.validateIVSIGN(data)
					.then(res => {
						res = res.data;
						let message = res.message;
						let identData = res.data;
						// 验证成功后将姓名与身份证显示到界面
						_this.userName = identData.residentIdentityCardName;
						_this.userCardID = identData.residentIdentityCardNum;
						_this.textMessage = message;
						uni.showToast({
							title: message,
							icon: 'none',
							duration: 2000
						});
						if(res.code == '0001') {
							_this.validateFlag = true;
						} else {
							_this.validateFlag = false;
						}
					})
					.catch(err => {
						uni.showToast({
							title: '服务异常',
							icon: 'none',
							duration: 2000
						});
					})
			}
		},
		computed: {
			/* 
			* 对姓名加*显示 
			* */
			newStr() {
				let newStr;
				if (this.userName.length === 2) {
					newStr = '*' + this.userName.substr(1, 1);
				} else if (this.userName.length > 2) {
					let char = '';
					for (let i = 0, len = this.userName.length - 2; i < len; i++) {
						char += '*';
					}
					newStr = this.userName.substr(0, 1) + char + this.userName.substr(-1, 1);
				} else {
					newStr = this.userName;
				}

				return newStr;
			},
			/* 
			* 身份证号码*显示问题
			*  */
			newCard() {
				return this.userCardID.replace(/(.{3}).*(.{3})/g, "$1******$2");
			}
		}
	}
</script>

<style lang="scss" scoped>
	.identification-success-wrapper {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		flex: 1;
		background-color: #fff;
	}

	.identification-success-content {
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}

	.identification-success-img {
		display: block;
		width: 388upx;
		height: 280upx;
		background: url("~@/static/identification/identification_success.png") no-repeat;
		background-size: 100% 100%;
		margin-top: 295upx;
		margin-bottom: 66upx;
	}

	.identification-success-desc {
		padding: 0 40upx;
		height: 32upx;
		text-align: center;
		font-size: 32upx;
		line-height: 32upx;
		color: #333;
		font-weight: 400;
		font-family: PingFangSC-Regular;

		.name {
			display: inline-block;
		}

		.card-id {
			display: inline-block;
			padding-left: 20upx;
		}
	}

	.identification-success-txt {
		width: 586upx;
		height: 40upx;
		margin-top: 40upx;
		margin-bottom: 72upx;
		text-align: center;
		font-size: 32upx;
		line-height: 32upx;
		color: #333;
		font-weight: 400;
		font-family: PingFangSC-Regular;
	}

	.identification-success-explain {
		width: 586upx;
		height: auto;
		margin-bottom: 550upx;
		text-align: justify;
		font-size: 28upx;
		line-height: 44upx;
		color: #666;
		font-family: PingFangSC-Regular;
	}
</style>
