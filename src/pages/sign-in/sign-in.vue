<template>
	<view class="container">
		<!-- 签到页面内容结束开始 -->
		<view class="container-bj"></view>
		<view class="mask">
			<view class="modal1">
				<view class="modal-bj"><view class="modal-title">每日签到</view></view>
				<view class="modal-content">
					<navigator class="modal-btn" url="../sign-rule/sign-rule">签到规则</navigator>
					<view class="modal-sign">
						累计签到
						<text class="sign-num">{{ nowCount }}</text>
						天
					</view>
					<view class="modal-surplus">
						距离下一奖励还有
						<text class="modal-surplus-num">{{ dayCount }}</text>
						天，加油哦！
					</view>
					<view class="modal-block-group">
						<view
							class="modal-cold"
							v-for="(item, index) in newObj"
							:key="index"
							@tap="modalDayMinSelect(index, item.date, item.signinStatus)"
							:class="[index === 6 ? 'modal-last' : '', (item.signinStatus == '1' && item.state) ? 'style' : '', {'style': !item.state}]"
						>
							<view class="">
								<view class="cold-top" :class="index === 6 ? 'last-top' : ''">
									第
									<text class="top-num" v-text="weeks[index]"></text>
									天
								</view>
								<view class="cold-middle-img"><image class="cold-middle" :class="index === 6 ? 'last-middle' : ''" src="../../static/welfare_agency/popup_bean.png" mode=""></image></view>
								<view class="cold-bottom" :class="index === 6 ? 'last-bottom' : ''">
									+
									<text class="bottom-num">{{ item.gsNum }}</text>
									银豆
								</view>
							</view>

							<!-- 遮罩层签到成功开始 -->
							<view class="min-mask-area" v-if="item.signinStatus == 1">
								<image class="min-mask-img" src="../../static/welfare_agency/popup_right.png" mode=""></image>
							</view>
							<!-- 遮罩层签到成功结束 -->
							<!-- 遮罩层签到补签开始 -->
							<view class="min-mask-area" v-if="item.signinStatus == 2"><view class="min-mask-word" @tap="handleSignIn(index, item.signinStatus)">补签</view></view>
							<!-- 遮罩层签到补签结束 -->
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 签到页面内容结束 -->

		<!-- 补签弹窗开始 -->
		<view class="tanchuang">
			<view class="mask-pupop" v-if="showSignIn"></view>
			<view class="show-sign-content" v-if="showSignIn">
				<view class="show-sign-word">
					<view class="show-sign-desc">确定要补签吗？</view>
					<view class="show-sign-button">
						<view class="show-sign-btn1" @tap="closeSign()">以后再说</view>
						<view class="show-sign-btn2" @tap="signInClick()">补签</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 补签弹窗结束 -->

		<!-- 连续签到弹窗开始 -->
		<view class="tanchuang">
			<view class="mask-pupop" v-if="showContinuity"></view>
			<view class="continuity-modal" v-if="showContinuity">
				<view class="symbol-logo" @tap="handleCloseButton()">X</view>
				<view class="continuity-modal-content">
					<view class="continuity-content-area" v-if="cumulativeSign">
						<view class="continuity-explain">
							<view class="continuity-content-top">累计签到奖励</view>
							<view class="continuity-content-text">
								您已累计签到
								<text class="continuity-num">7</text>
								天，恭喜获得以下奖励：
							</view>
						</view>
						<view class="continuity-content-middle">
							<view class="continuity-middle-left" v-for="(item, index) in cumulativeSignList" :key="index">
								<image class="continuity-img" :src="item.giftPicUrl" mode=""></image>
								<view class="continuity-txt" v-if="item.gsName">
									{{item.gsName}}x
									<text class="continuity-txt-num">{{item.gsNum}}</text>
								</view>
								<view class="continuity-txt" v-else>{{item.itemName}}</view>
							</view>
						</view>
						<view class="continuity-content-bottom"><view class="continuity-bottom-btn" @tap="handleAcceptButton()">果断收下</view></view>
					</view>
					
					<view class="continuity-content-area" v-else>
						<view class="continuity-explain">
							<view class="continuity-content-top">连续签到奖励</view>
							<view class="continuity-content-text">
								您已连续签到
								<text class="continuity-num">7</text>
								天，恭喜获得以下奖励：
							</view>
						</view>
						<view class="continuity-content-middle">
							<view class="continuity-middle-left" v-for="(item, index) in continuationSignList" :key="index">
								<image class="continuity-img" :src="item.giftPicUrl" mode=""></image>
								<view class="continuity-txt" v-if="item.gsName">
									{{item.gsName}}x
									<text class="continuity-txt-num">{{item.gsNum}}</text>
								</view>
								<view class="continuity-txt" v-else>{{item.itemName}}</view>
							</view>
							<!-- <view class="continuity-middle-right">
								<image class="continuity-pic" :src="item.giftPicUrl" mode=""></image>
								<view class="continuity-txt">{{item.itemName}}</view>
							</view> -->
						</view>
						<view class="continuity-content-bottom"><view class="continuity-bottom-btn" @tap="handleAcceptButton()">果断收下</view></view>
					</view>
					
				</view>
			</view>
		</view>
		<!-- 连续签到弹窗结束 -->
	</view>
</template>
<script>
var temp = new Date();
// console.log(temp);
export default {
	components: {},
	data() {
		return {
			showSignIn: false, //补签弹窗的显示与否
			showContinuity: false, //连续签到弹窗的显示与否
			nowCount: '', //当前累加次数
			dayCount: '', //距离下次奖励天数
			signinList: [], //签到记录列表，必回7个签到记录，按时间顺序排列
			isActive: -1, // 控制index值的起始值
			output: [], // 返回的数据与图片url地址，天数的整合
			token: '' ,//用户token
			initIndex: -1,
			gsNum: "" ,//银豆数量
			weeks: [],
            months: [],
            day: 0,
            date: 0,
            month: 0,
            d: 0,
            today: '',
            flag: 0,
			newObj: [],
			cumulativeSignList: [], //累计签到奖励数组
			continuationSignList: [] ,//连续签到奖励数组
			cumulativeSign: "",
			continuationSign: ""
		};
	},
	onLoad() {
		//获取用户的token，没有则跳转登录页面
		this.token = this.$storage.isAuthed();
		if(this.token) {
			let signData = {
				token: this.token
			};
			this.getSignInPage(signData);
		}
	},
	onReady() {
		this.d = new Date(); //当前日期
		this.day = this.d.getDay(); //周几
		this.date = this.d.getDate(); //几号
		this.month = this.d.getMonth() + 1; //月
		var timestr = this.month + "月" + this.date + "日";
		this.today = timestr;
		this.flag = this.formatDateSignIn(this.d);
		this.getResult(this.d);
		var ctime = parseInt(this.d.getFullYear().toString() + this.month.toString() + this.date.toString());
		
	},
	methods: {
		getMonDate: function(test) { //计算每一个月的第一天
			if (test.getDay() == 1)
				return test;
			if (test.getDay() == 0)
				test.setDate(test.getDate() - 6);
			else
				test.setDate(test.getDate() - test.getDay() + 1);
			return test;
		},
		getDayName: function(day) {// 0-6转换成中文名称
			var day = parseInt(day);
			if (isNaN(day) || day < 0 || day > 6)
				return false;
			var weekday = ["七", "一", "二", "三", "四", "五", "六"];
			return weekday[day];
		},
		getResult: function(time, a) {
			var timeobj = this.getMonDate(time); // timeobj是当前星期一的日期对象
			var temTime = new Date(timeobj.getTime()); //当前当前星期一对象转换成时间戳
			var arr = [];
			var week = [];
			var dayss = new Date();
			for (var i = 0; i < 7; i++) {
				var time1 = new Date(temTime.getTime());
				var time2 = dayss.getTime();
				var result = time1 <= time2;
				var ymd = this.formatDateSignIn(temTime);
				// arr.push({'dayss':temTime.getDate(),'daystate':false}); //一周几号
				arr.push({
					'date': ymd,
					'state': result,
					'showDate': temTime.getDate()
				});
				week.push(this.getDayName(temTime.getDay())); //一周 周几
				temTime.setDate(temTime.getDate() + 1);
			}
			this.weeks = week;
			this.months = arr;
			// console.log(this.months);
		},
		getTimes: function(temp2) {
			var m = temp2.getMonth() + 1;
			var d = temp2.getDate();
			if (m < 10) {
				m = "0" + m;
			}
			if (d < 10) {
				d = "0" + d;
			}
			this.today = m + "月" + d + "日";
		},
		formatDateSignIn: function(date) {
			var year = date.getFullYear();
			var months = date.getMonth() + 1;
			var month = (months < 10 ? '0' + months : months).toString();
			var day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()).toString();
			return year + month + day;
		},
		getSignInPage(data) {// 获取签到页面的数据
			let that = this;
			this.$api.getSigninPage(data).then(res => {
				res = res.data;
				if (res.code == '0001') {
					let resData = res.data;
					that.nowCount = resData.nowCount;
					that.dayCount = resData.dayCount;
					that.signinList = resData.signinList;
					for (let i = 0; i < that.signinList.length; i++) {
						that.gsNum = that.signinList[i].gsNum;
					}
					for(let i = 0; i < that.signinList.length; i++) { //对数据进行整合
						that.newObj.push(Object.assign(that.signinList[i], that.months[i]))
					}
					// console.log(that.newObj)
				} else {
					uni.showToast({
						title: res.message,
						icon: "none"
					});
				}
			})
			.catch(err => {
				uni.showToast({
					title: '服务异常',
					icon: "none"
				});
			});
		},
		handleSignIn(index, signinStatus) {//页面显示补签两字的点击事件
			if(signinStatus == 3) {
				uni.showToast({
					title: '您没有补签卡,无法补签',
					icon: "none"
				});
			} else {
				this.initIndex = index;
				this.showSignIn = true;
			}
		},
		signInClick() {// 弹窗的补签按钮
			// 将状态改为signinStatus == 1
			let data = {
				token: this.$storage.isAuthed,
				index: this.initIndex
			};
			this.$api.getSignin(data).then(res => { //签到接口
				res = res.data;
				if (res.code == '0001') {
					uni.showToast({
						title: "补签成功",
						icon: "success"
					});
					this.$set(this.signinList[this.initIndex], "signinStatus", 1);
				} else {
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
				}
			})
			.catch(err => {
				uni.showToast({
					title: '服务异常',
					icon: 'none'
				});
			});
			this.showSignIn = false;
		},
		closeSign() { //补签页面弹窗关闭
			this.showSignIn = false;
		},
		handleCloseButton() { //x号的按钮
			uni.showToast({
				title: '领取未成功',
				icon: 'none'
			});
			this.showContinuity = false;
		},
		handleAcceptButton() { //果断收下按钮
			this.showContinuity = false;
			let data = {
				token: this.token,
				index: this.initIndex
			};
			this.$api.getSignin(data).then(res => {
				res = res.data;
				let message = res.message;
				if (res.code == '0001') {
					uni.showToast({
						title: '领取成功',
						icon: 'success'
					});
				} else {
					uni.showToast({
						title: message,
						icon: 'none'
					});
				}
			})
			.catch(err => {
				uni.showToast({
					title: '服务异常',
					icon: 'none'
				});
			});
		},
		modalDayMinSelect(index, date, signinStatus) {// 弹窗里面的签到1-7天数的点击事件
			this.isActive = index;
			//将状态改为signinStatus == 1
			this.flag = this.months[index].date;
			var year = date.substring(0, 4);
			var month = date.substring(4, 6);
			var day = date.substring(6, 8);
			var str = month + "月" + day + "日";
			this.today = str;
			// console.log(date)
			// console.log(year+ "-" + month + "-" + day)
			if(signinStatus == 0) {
				let data = {
					token: this.token,
					index: this.isActive
				};
				this.$api.getSignin(data).then(res => { //签到接口
					res = res.data;
					let message = res.message;
					if (res.code == '0001') {
						console.log(res.data, "344")
						res = res.data;
						this.cumulativeSign = res.cumulativeSign;
						this.continuationSign = res.continuationSign;
						this.continuationSignList = res.continuationSignList;
						this.cumulativeSignList = res.cumulativeSignList;
						this.showContinuity = true;
						// uni.showToast({
						// 	title: "签到成功",
						// 	icon: "success"
						// });
						this.$set(this.signinList[this.isActive], "signinStatus", 1);
					} else {
						uni.showToast({
							title: message,
							icon: 'none'
						});
					}
				})
				.catch(err => {
					uni.showToast({
						title: '服务异常',
						icon: 'none'
					});
				});
			}
			if (this.dayCount == 0 && index == 6 && signinStatus == 0) {
				this.showContinuity = true;
			}
		}
	}
};
</script>

<style lang="scss">
.container {
	width: 100%;
	min-height: 100vh;
	background: linear-gradient(top, #659af6, #6179f5);
	background: -webkit-linear-gradient(top, #659af6, #6179f5);
	background-size: 100% 100%;
	display: flex;
	flex-direction: column;
	flex: 1;
}
.container-bj {
	width: 100%;
	height: 410upx;
	background: url('~@/static/welfare_agency/container_bj.png') no-repeat;
	background-size: 100% 410upx;
	position: fixed;
	top: 120upx;
	left: 0;
}
.modal1 {
	margin: 0 32upx 200upx 32upx;
	padding-top: 200upx;
	background: transparent;
	border-bottom-left-radius: 36upx;
	border-bottom-right-radius: 36upx;
	background: transparent;
	.modal-bj {
		width: 100%;
		height: 269upx;
		background: url('~@/static/welfare_agency/popup_banner.png') no-repeat;
		background-size: 588upx 269upx;
		position: relative;
		z-index: 100;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;

		.modal-title {
			width: 285upx;
			height: 95upx;
			background: url('~@/static/welfare_agency/title_bj.png') no-repeat;
			background-size: 285upx 95upx;
			position: relative;
			z-index: 150;
			margin-bottom: 20upx;
			color: #fff;
			font-size: 44upx;
			line-height: 95upx;
			text-align: center;
			font-falily: PingFang-SC-Heavy;
			font-weight: 800;
		}
	}

	.modal-content {
		width: 100%;
		background: #fff;
		/* 		box-shadow: 0upx -12upx 0upx 0upx rgba(53, 123, 235, 1) inset;
	 */
		border-radius: 14upx;
		margin-top: -40upx;
		position: relative;
		z-index: 50;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;

		.modal-btn {
			display: block;
			width: 114upx;
			height: 40upx;
			border: 3upx solid #222a55;
			border-radius: 8upx;
			background-color: #ffa200;
			align-self: flex-end;
			margin-top: 30upx;
			margin-right: 30upx;
			line-height: 40upx;
			color: #fff;
			text-align: center;
			font-size: 24upx;
			font-family: PingFang-SC-Medium;
		}

		.modal-sign {
			width: 100%;
			height: 32upx;
			line-height: 32upx;
			font-size: 32upx;
			text-align: center;
			color: #0a3f88;
			font-family: PingFang-SC-Bold;
			font-weight: bold;
			margin-bottom: 10upx;
			text-align: center;
			margin-top: -16upx;

			.sign-num {
				color: #ef6e03;
				padding: 0 10upx;
			}
		}

		.modal-surplus {
			width: 100%;
			height: 24upx;
			line-height: 24upx;
			color: #0a3f88;
			font-size: 24upx;
			text-align: center;
			.modal-surplus-num {
				padding: 0 10upx;
			}
		}

		.modal-block-group {
			overflow: hidden;
			padding-top: 20upx;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: flex-start;
			flex-wrap: wrap;
			.modal-cold {
				width: 190upx;
				height: 236upx;
				border-radius: 10upx;
				background-color: #609dff;
				margin: 10upx;
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				z-index: 200;
				position: relative;

				.cold-top {
					width: 100%;
					height: 45upx;
					border-top-left-radius: 10upx;
					border-top-right-radius: 10upx;
					background-color: #357beb;
					margin-bottom: 32upx;
					line-height: 45upx;
					text-align: center;
					color: #fff;
					font-size: 24upx;
					font-family: PingFang-SC-Bold;

					.top-num {
						display: inline-block;
						padding: 0 10upx;
					}
				}
				.cold-middle-img {
					width: 100%;
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-content: center;
					.cold-middle {
						display: block;
						width: 88upx;
						height: 88upx;
						background-size: 100% 100%;
						align-self: center;
					}
				}
				.cold-bottom {
					width: 100%;
					height: 28upx;
					line-height: 28upx;
					margin-top: 20upx;
					color: #ffea00;
					font-size: 28upx;
					font-weight: bold;
					text-shadow: 3upx 5upx 0upx #112772;
					font-family: PingFang-SC-Heavy;
					text-align: center;

					.bottom-num {
						padding-right: 10upx;
					}
				}
			}

			.modal-last {
				width: 100%;
				height: 236upx;
				position: relative;
				margin: 10upx 38upx 40upx 38upx;
				border-radius: 10upx;
				background: url('~@/static/welfare_agency/popup_bj.png') no-repeat;
				background-size: 626upx 236upx;
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				z-index: 200;

				.last-top {
					width: 100%;
					height: 45upx;
					border-top-left-radius: 10upx;
					border-top-right-radius: 10upx;
					background-color: #357beb;
					margin-bottom: 36upx;
					line-height: 45upx;
					text-align: center;
					color: #fff;
					font-size: 24upx;
					font-family: PingFang-SC-Bold;

					.last-top-num {
						display: inline-block;
						padding: 0 10upx;
					}
				}

				.last-middle {
					width: 88upx;
					height: 88upx;
					background: url('~@/static/welfare_agency/popup_bean.png') no-repeat;
					background-size: 100% 100%;
					align-self: center;
				}

				.last-bottom {
					width: 100%;
					height: 28upx;
					line-height: 28upx;
					margin-top: 20upx;
					color: #ffea00;
					font-size: 28upx;
					font-weight: bold;
					text-shadow: 3upx 5upx 0upx #112772;
					font-family: PingFang-SC-Heavy;
					text-align: center;

					.last-bottom-num {
						padding-right: 10upx;
					}
				}
			}
		}
	}
}

.mask {
	width: 100%;
	height: 100%;
}
.min-mask-area {
	width: 100%;
	height: 100%;
	border-radius: 10upx;
	background: rgba(0, 0, 0, 0.55) !important;
	position: absolute;
	z-index: 350;
	border: 3upx solid #222a55;
	box-sizing: border-box;

	.min-mask-img {
		display: block;
		width: 66upx;
		height: 50upx;
		position: absolute;
		bottom: 14upx;
		right: 10upx;
		z-index: 400;
	}

	.min-mask-word {
		width: 100%;
		height: 50upx;
		border-bottom-left-radius: 10upx;
		border-bottom-right-radius: 10upx;
		background-color: #ffa200;
		position: absolute;
		bottom: 0;
		left: 0;
		z-index: 400;
		font-size: 28upx;
		line-height: 50upx;
		font-family: PingFang-SC-Bold;
		font-weight: 500;
		color: #fff;
		text-align: center;
	}
}
/* 弹出框 */
.mask-pupop {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.6);
	z-index: 998;
}

//连续签到奖励的弹窗开始

.continuity-modal {
	width: 564upx;
	height: 684upx;
	background: transparent;
	border-bottom-left-radius: 36upx;
	border-bottom-right-radius: 36upx;
	position: fixed;
	top: 50%;
	left: 50%;
	margin-left: -282upx;
	margin-top: -342upx;
	z-index: 999;
}

.symbol-logo {
	width: 60upx;
	height: 60upx;
	border: 1upx solid #fff;
	border-radius: 50%;
	color: #fff;
	font-size: 40upx;
	text-align: center;
	line-height: 60upx;
	position: absolute;
	right: 0;
	top: 0;
}

.continuity-modal-content {
	width: 100%;
	height: 514upx;
	background-color: #ffffff;
	box-shadow: 0upx -12upx 0upx 0upx rgba(53, 123, 235, 1) inset;
	border-radius: 36upx;
	position: absolute;
	bottom: 0;
	left: 0;
}

.continuity-content-area {
	width: 100%;
	height: 514upx;
	background-color: #ffffff;
	box-shadow: 0upx -12upx 0upx 0upx rgba(53, 123, 235, 1) inset;
	border-radius: 36upx;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-content: center;
}
.continuity-explain {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-content: center;
}

.continuity-content-top {
	width: 344upx;
	height: 94upx;
	background: url('~@/static/welfare_agency/sign_pic.png') no-repeat;
	background-size: 100% 100%;
	align-self: center;
	margin-top: -75upx;
	line-height: 75upx;
	font-size: 44upx;
	font-family: PingFang-SC-Heavy;
	font-weight: bold;
	text-align: center;
	color: #fff;
}

.continuity-content-text {
	width: 520upx;
	height: 36upx;
	line-height: 36upx;
	font-size: 28upx;
	font-family: PingFang-SC-Bold;
	font-weight: bold;
	color: #0a3f88;
	align-self: center;
	margin: 55upx 0;

	.continuity-num {
		padding: 0 10upx;
		color: #ef6e03;
		font-size: 36upx;
	}
}

.continuity-content-middle {
	width: 100%;
	height: 156upx;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-content: center;
	margin-bottom: 62upx;
}

.continuity-middle-left {
	width: 150upx;
	height: 156upx;
	background: url('~@/static/welfare_agency/sign_bj.png') no-repeat;
	background-size: 100% 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-content: center;
}

.continuity-middle-right {
	width: 150upx;
	height: 156upx;
	background: url('~@/static/welfare_agency/sign_bj.png') no-repeat;
	background-size: 100% 100%;
	margin-left: 28upx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-content: center;
}

.continuity-img {
	display: block;
	width: 66upx;
	height: 80upx;
	align-self: center;
}

.continuity-pic {
	display: block;
	width: 66upx;
	height: 80upx;
	align-self: center;
}

.continuity-txt {
	width: 150upx;
	height: 42upx;
	line-height: 42upx;
	color: #ffea00;
	font-family: PingFang-SC-Medium;
	font-weight: 500;
	-webkit-text-stroke: 1upx #253a81; //文字中的描边
	text-stroke: 1upx #253a81;
	text-align: center;

	.continuity-txt-num {
		padding-left: 6upx;
	}
}

.continuity-content-bottom {
	width: 100%;
	height: 66upx;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-content: center;
}

.continuity-bottom-btn {
	width: 254upx;
	height: 66upx;
	border-radius: 66upx;
	background-color: #FFA200;
	border: 3upx solid #222a55;
	box-sizing: border-box;
	box-shadow: 0upx -6upx 0upx 0upx #D97407 inset;
	line-height: 60upx;
	font-size: 32upx;
	color: #fff;
	font-family: PingFang-SC-Bold;
	font-weight: 500;
	text-align: center;
}

//连续签到奖励的弹窗结束

//补签弹窗的开始
.show-sign-content {
	width: 564upx;
	height: 332upx;
	background-color: #fffefb;
	border-radius: 36upx;
	box-shadow: 0upx -12upx 0upx 0upx rgba(53, 123, 235, 1) inset;
	position: fixed;
	top: 50%;
	left: 50%;
	margin-left: -282upx;
	margin-top: -166upx;
	z-index: 999;
}
.show-sign-word {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-content: center;
}
.show-sign-desc {
	width: 100%;
	height: 32upx;
	line-height: 32upx;
	font-size: 32upx;
	color: #1a488c;
	text-align: center;
	margin: 114upx 0 60upx 0;
}
.show-sign-button {
	width: 100%;
	height: 60upx;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-content: center;
}
.show-sign-btn1 {
	width: 164upx;
	height: 60upx;
	background: #38adff;
	border-radius: 60upx;
	border: 3upx solid #222a55;
	box-sizing: border-box;
	box-shadow: 0upx -6upx 0upx 0upx rgba(19, 105, 190, 1) inset;
	line-height: 54upx;
	font-size: 28upx;
	text-align: center;
	font-family: PingFang-SC-Bold;
	font-weight: bold;
	color: #fff;
}
.show-sign-btn2 {
	width: 164upx;
	height: 60upx;
	background: #FFA200;
	border-radius: 60upx;
	border: 3upx solid #222a55;
	box-sizing: border-box;
	box-shadow: 0upx -6upx 0upx 0upx #D97407 inset;
	line-height: 54upx;
	font-size: 28upx;
	text-align: center;
	font-family: PingFang-SC-Bold;
	font-weight: bold;
	color: #fff;
}
//补签弹窗的结束

//让div处于不可点击的状态
.style {
	pointer-events: none;
}
</style>
