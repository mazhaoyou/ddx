<template>
	<!-- 买豆页面 -->
	<view class="container">
		<!-- 买豆页面的顶部开始 -->
		<view class="status-bar-bar"></view>
		<view class="buy-bean-wrapper">
			<view class="bean-header-title">
				<view class="title-middle">充值福豆</view>
			</view>
			<view class="bean-middle-area">
				<view class="header-ellipse-desc">福豆余额</view>
				<view class="header-ellipse-number">{{ beanTotal }}</view>
				<view class="header-bottom-area">
					<view class="header-bottom">
						<view class="header-golden-bean">
							<text class="header-golden-bean-title">{{ beanInfo.goldCount }}</text>
							<image class="header-golden-bean-img" src="../../static/buy_beans/golden_bean_img.png" mode="scaleToFill"></image>
						</view>
						<view class="header-add">+</view>
						<view class="header-silver-bean" @tap="skipSilverDetail($event, '../silver-beandetail/silver-beandetail')">
							<text class="header-silver-bean-title">{{ beanInfo.sliverCount }}</text>
							<image class="header-silver-bean-img" src="../../static/buy_beans/silver_bean_img.png" mode="scaleToFill"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 买豆页面的顶部结束 -->
		<!-- 买豆页面的轮播开始 -->
		<view class="banner-section">
			<swiper class="banner-section-swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration" :circular="circular">
				<swiper-item class="banner-section-item" v-for="(item, index) in imgUrlList" :key="index">
					<image class="banner-img" :src="item.imgUrl" mode="scaleToFill"></image>
				</swiper-item>
			</swiper>
		</view>
		<!-- 买豆页面的轮播结束 -->
		<!-- 买豆页面的金豆选择开始 -->
		<view class="bean-title">
			<view class="bean-left">
				金豆开春价：¥
				<text class="bean-price">{{ chooseBean.currentPrice }}</text>
				元/个
			</view>
			<view class="bean-right">
				（原价：¥
				<text style="padding: 0 10upx;">{{ chooseBean.originalPrice }}</text>
				元/个）
			</view>
		</view>
		<view class="bean-lists">
			<view class="bean-list" v-for="(item, index) in outputData" :key="index" @tap="handleBeanList(item.beanNum, index)" :class="beanListStyle == index ? 'active' : ''">
				<view class="bean-list-number">{{ item.beanNum }}金豆</view>
				<view class="bean-list-pic"><image class="bean-list-img" :src="item.src" mode="scaleToFill"></image></view>
			</view>
		</view>
		<view class="purchase-area">
			<view class="golden-bean">
				获得:
				<text class="golden-bean-title">{{ goldenNum }}</text>
				<image class="golden-bean-img" src="../../static/buy_beans/golden_bean_img.png" mode="scaleToFill"></image>
			</view>
			<view class="golden-bean" v-if="goldenNum != 0">
				+赠送:
				<text class="golden-bean-title">{{ silverNum }}</text>
				<image class="golden-bean-img" src="../../static/buy_beans/silver_bean_img.png" mode="scaleToFill"></image>
			</view>
			<view class="golden-bean" v-if="goldenNum != 0">
				+等级满赠:
				<text class="golden-bean-title">{{ aboveNum }}</text>
				<image class="golden-bean-img" src="../../static/buy_beans/silver_bean_img.png" mode="scaleToFill"></image>
			</view>
		</view>
		<view class="pay-money">
			实付款：
			<text class="pay-money-price">¥</text>
			<text class="pay-money-price">{{ payMoney }}</text>
			<text class="pay-money-price">元</text>
		</view>
		<view class="confirm-area"><button class="conform-btn" type="default" size="mini" @tap="confirmPurchase()">确认购买</button></view>
		<!-- 买豆页面选择金豆结束 -->
		<!-- 买豆页面的规则开始 -->
		<view class="rule-area">
			<image class="rule-img" src="../../static/buy_beans/rule_tanhao.png" mode=""></image>
			<navigator class="rule-a1" url="../beans-rule/beans-rule">福豆规则</navigator>
			<text class="rule-desc1">小冠优选保障您的支付安全，请安心支付</text>
			<text class="rule-desc2">您还可以在福利社获得福豆哦～</text>
			<navigator class="rule-a2" url="../welfare-agency/welfare-agency">福利社</navigator>
		</view>
		<!-- 买豆页面的规则结束 -->
		<!-- 买豆页面公司logo开始 -->
		<view class="company-area"><image class="company-logo" src="../../static/buy_beans/company_logo.png" mode=""></image></view>
		<!-- 买豆页面公司logo结束 -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			beanListStyle: -1, // 点击区域的样式添加与否
			indicatorDots: false, // 是否显示面板指示点
			autoplay: true, // 是否自动切换
			interval: 5000, // 自动切换时间间隔
			duration: 500, // 滑动动画时长
			circular: true, // 是否采用衔接滑动
			imgUrlList: [
				{
					imgUrl: '../../static/buy_beans/bean_banner.jpg'
				},
				{
					imgUrl: '../../static/buy_beans/bean_banner.jpg'
				},
				{
					imgUrl: '../../static/buy_beans/bean_banner.jpg'
				}
			], // 轮播图的url
			payMoney: '0', // 福豆总价格
			goldenNum: '0', // 金豆数量
			silverNum: '0', // 赠送银豆数量
			aboveNum: '0', // 等级满赠银豆数量
			rechargeNum: [], //充值数量
			rechargeUrl: [
				{
					src: '../../static/buy_beans/bean_10.png'
				},
				{
					src: '../../static/buy_beans/bean_50.png'
				},
				{
					src: '../../static/buy_beans/bean_200.png'
				},
				{
					src: '../../static/buy_beans/bean_300.png'
				},
				{
					src: '../../static/buy_beans/bean_500.png'
				},
				{
					src: '../../static/buy_beans/bean_666.png'
				}
			], // 福豆购买数量区域的图片url地址
			outputData: {}, // 返回购买福豆数据与图片url地址的整合
			chooseBean: {}, //返回福豆有关信息的集合
			token: '' //用户token
		};
	},
	onLoad: function() {
		let rechargeData = {
			token: this.$storage.getStorage('token', 2)
		};
		this.getRecharge(rechargeData);
	},
	computed: {
		/* 福豆信息 */
		beanInfo() {
			return this.$store.state.beanInfo;
		},
		/* 福豆总数 */
		beanTotal() {
			return parseInt(this.beanInfo.goldCount) + parseInt(this.beanInfo.sliverCount);
		}
	},
	methods: {
		handleBeanList(beanNum, index) {
			// 将点击的元素的索引赋值给bian变量
			this.beanListStyle = index;
			this.goldenNum = beanNum; //选择购买金豆的数量

			let calculateBeansData = {
				token: this.$storage.isAuthed(),
				beanNum: this.goldenNum
			};
			this.getCalculateBeans(calculateBeansData);
		},
		skipSilverDetail(e, url) {
			// 将点击的元素的索引赋值给bian变量
			uni.navigateTo({
				url: url
			});
		},
		getRecharge(data) {
			//获取充值福豆数据
			let that = this;
			// 获取缓存
			let payBean = that.$storage.getStorage('payBeanList');
			this.outputData = payBean;
			this.$api
				.getRechargePage(data)
				.then(res => {
					res = res.data;
					if (res.code == '0001') {
						let resData = res.data;
						that.chooseBean = resData;
						that.rechargeNum = that.chooseBean.quotaList;
						let objects = [that.rechargeNum, that.rechargeUrl]; //将两个数组对象合并成为一个数组对象数据
						let output = {};
						objects.map(function(obj) {
							var keys = Object.keys(obj);
							keys.map(function(key) {
								if (!output[key]) {
									output[key] = obj[key];
								} else {
									var keyss = Object.keys(obj[key]);
									keyss.map(function(item) {
										output[key][item] = obj[key][item];
									});
								}
							});
						});
						// 对比缓存跟请求数据是否相同，如果不相等则重新缓存
						if (!that.$util.contrastArray(output, payBean)) {
							that.outputData = output;
							that.$storage.setStorage('payBeanList', output);
						}
					} else {
						uni.showToast({
							title: res.message
						});
					}
				})
				.catch(err => {
					uni.showToast({
						title: '服务异常'
					});
				});
		},
		getCalculateBeans(data) {
			//计算活动所得福豆数
			uni.showToast({
				title: '正在计算中...',
				icon: 'none'
			});
			let that = this;
			this.$api
				.calculateBeans(data)
				.then(res => {
					res = res.data;
					if (res.code == '0001') {
						uni.hideToast();
						let resData = res.data;
						that.goldenNum = resData.goldCount; //应得金豆数量
						that.silverNum = resData.silverActivity; //活动赠送银豆数量（赠送）
						that.aboveNum = resData.silverLevel; //等级满赠银豆数量（赠送）
						that.payMoney = resData.price; // 实际支付金额
					} else {
						uni.showToast({
							title: res.message
						});
					}
				})
				.catch(err => {
					uni.showToast({
						title: '服务异常'
					});
				});
		},
		confirmPurchase() {
			//确认购买的点击事件
			if (parseInt(this.goldenNum) < 10 && parseInt(this.goldenNum) >= 0) {
				uni.showToast({
					title: '请选择购买金豆数量',
					icon: 'none'
				});
			} else if (parseInt(this.goldenNum) >= 10) {
				uni.navigateTo({
					url: '../cash-desk/cash-desk?payMoney=' + this.payMoney
				});
			}
		}
	},
	watch: {},
	onNavigationBarButtonTap(e) {
		//这个函数本身是有一个object类型的返回值的 。我用到的是object 当中的index 下标。 0为左侧的按钮 1为右侧的按钮
		if (e.index) {
			//点击买豆历史按钮执行的代码
			uni.navigateTo({
				url: '../buy-beans-history/buy-beans-history'
			});
		} else {
			//点击福豆明细按钮执行的代码
			uni.navigateTo({
				url: '../beans-detail/beans-detail'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.status-bar-bar {
	height: var(--status-bar-height);
	background: #feaf33;
}

.buy-bean-wrapper {
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	width: 100%;
	height: 400upx;
	background: #feaf33 url('~@/static/buy_beans/header_bj.png');
	background-repeat: no-repeat;
	background-position: center -50upx;
	background-size: 579upx 546upx;
	position: relative;
	z-index: 9999999;

	.bean-header-title {
		width: 100%;
		height: 44upx;
		padding-top: 20upx;
		display: flex;
		align-items: center;
		display: flex;
		flex-direction: row;
		justify-content: center;
		text-align: center;
		color: #fff;

		.title-middle {
			font-size: 32upx;
			// font-weight: bold;
		}
	}
}

.bean-middle-area {
	width: 100%;
	height: auto;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;

	.header-ellipse-desc {
		color: #fff;
		font-size: 28upx;
		line-height: 68upx;
		font-family: 'Adobe Heiti Std R';
	}

	.header-ellipse-number {
		color: #fff;
		font-size: 68upx;
		line-height: 68upx;
		font-family: 'HelsinkiDEMO-Regular';
		font-weight: bolder;
	}

	.header-bottom-area {
		width: 100%;
		height: 60upx;
		margin: 26upx 0;
		display: flex;
		justify-content: center;
		flex-direction: row;

		.header-bottom {
			width: 300upx;
			height: 60upx;
			background-color: #ffefcb;
			border-radius: 30upx;
			z-index: 1;
			display: flex;
			flex-direction: row;
			justify-content: space-around;
			flex-wrap: nowrap;

			.header-golden-bean {
				font-size: 32upx;
				line-height: 60upx;
				color: #fa503d;
				text-align: center;
				font-weight: bolder;

				.header-golden-bean-title {
					margin-right: 10upx;
				}

				.header-golden-bean-img {
					display: inline-block;
					width: 26upx;
					height: 26upx;
				}
			}

			.header-add {
				display: inline-block;
				font-size: 32upx;
				font-weight: bolder;
				line-height: 60upx;
				color: #fa503d;
				text-align: center;
				margin-left: -30upx;
				margin-right: -30upx;
			}

			.header-silver-bean {
				font-size: 32upx;
				line-height: 60upx;
				color: #fa503d;
				font-weight: bolder;
				text-align: center;
				text-decoration: underline;

				.header-silver-bean-title {
					margin-right: 10upx;
				}

				.header-silver-bean-img {
					display: inline-block;
					width: 26upx;
					height: 26upx;
				}
			}
		}
	}
}

.banner-section {
	padding: 30upx 25upx 30upx 25upx;

	.banner-section-swiper {
		width: 100%;
		height: 180upx;
		position: relative;
		z-index: 1;
		overflow: hidden;
		border-radius: 20upx;

		.banner-section-item {
			width: 100%;
			height: 180upx;
		}
	}

	.banner-img {
		width: 100%;
		height: 180upx;
		max-width: 100%;
		border-radius: 20upx;
		padding: 0;
		margin: 0;
		overflow: hidden;
	}
}

.bean-title {
	width: 100%;
	height: 32upx;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	color: #333333;
	text-align: center;
	margin-bottom: 20upx;

	.bean-left {
		font-size: 24upx;
		line-height: 32upx;
		margin-left: 33upx;

		.bean-price {
			font-size: 32upx;
			font-weight: bolder;
			padding: 0 10upx;
			color: #fa503d;
		}
	}

	.bean-right {
		font-size: 24upx;
		line-height: 32upx;
		margin-right: 47upx;
	}
}

.bean-lists {
	height: 428upx;
	padding-left: 20upx;
	padding-right: 20upx;
	margin-bottom: 30upx;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	flex-wrap: wrap;

	.active {
		border: 2upx solid #feaf33 !important;
		box-sizing: border-box;
	}

	.bean-list {
		width: 214upx;
		height: 186upx;
		margin: 14upx 11upx;
		border-radius: 20upx;
		border: 1upx solid #e0e0e0;
		box-sizing: border-box;

		.bean-list-number {
			width: 100%;
			height: 32upx;
			line-height: 32upx;
			text-align: center;
			font-size: 32upx;
			color: #333333;
			padding-top: 34upx;
		}

		.bean-list-pic {
			width: 100%;
			height: 70upx;
			margin-top: 29upx;
			display: flex;
			flex-direction: row;
			justify-content: center;

			.bean-list-img {
				width: 95upx;
				height: 70upx;
				display: block;
			}
		}
	}
}

.purchase-area {
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-content: center;
	padding: 0 60upx;
	flex-wrap: wrap;
	box-sizing: border-box;

	.golden-bean {
		color: #333333;
		font-size: 24upx;
		flex-wrap: wrap;

		.golden-bean-title {
			font-size: 40upx;
			color: #fa503d;
			margin-left: 8upx;
		}

		.golden-bean-img {
			width: 26upx;
			height: 26upx;
			margin-left: 4upx;
		}
	}

	/* 	.silver-bean {
		height: 40upx;
		line-height: 40upx;
		color: #333333;
		font-size: 28upx;
		text-align: center;
		flex-wrap: wrap;
		.silver-bean-title {
			font-size: 40upx;
			line-height: 40upx;
			color: #fa503d;
		}
		.silver-bean-img {
			width: 26upx;
			height: 26upx;
			margin-left: 4upx;
		}
	} */
}

.pay-money {
	width: 100%;
	height: 28upx;
	line-height: 28upx;
	display: flex;
	flex-direction: row;
	justify-content: center;
	color: #333333;
	text-align: center;
	margin: 36upx 0;

	.pay-money-price {
		color: #fa503d;
		text-indent: 10upx;
		font-weight: bolder;
	}
}

.confirm-area {
	width: 100%;
	height: 80upx;
	display: flex;
	flex-direction: row;
	justify-content: center;
	margin-bottom: 57upx;

	.conform-btn {
		width: 420upx;
		color: #fff;
		line-height: 73upx;
		font-size: 32upx;
		border-radius: 20upx;
		background: -webkit-linear-gradient(top, #f76253, #ff8e45);
		box-shadow: 0upx -7upx 0upx 0upx rgba(255,0,0,0.2) inset;
	}
}

.rule-area {
	width: 100%;
	height: 76upx;
	display: flex;
	flex-direction: row;
	justify-content: center;
	flex-wrap: wrap;
	font-size: 24upx;
	line-height: 28upx;
	text-align: center;
	color: #999999;

	.rule-img {
		display: inline-block;
		width: 28upx;
		height: 28upx;
		margin-right: 10upx;
	}

	.rule-a1 {
		text-decoration: underline;
		color: #fa503d;
		font-size: 24upx;
		display: inline-block;
		margin-right: 10upx;
	}

	.rule-desc1 {
		margin-bottom: 20upx;
	}

	.rule-desc2 {
	}

	.rule-a2 {
		text-decoration: underline;
		color: #fa503d;
		font-size: 24upx;
		display: inline-block;
		margin-left: 10upx;
	}
}

.company-area {
	width: 100%;
	height: 90upx;
	margin-top: 66upx;
	padding-bottom: 70upx;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-content: center;
}

.company-logo {
	display: block;
	width: 460upx;
	height: 90upx;
}
</style>
