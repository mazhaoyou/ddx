<template>
	<!-- 签到页面 -->
	<view class="">
		<!-- 弹窗区域开始 -->
		<view class="tanchuang">
			<view class="mask" v-if="show"></view>
			<view class="modal1" v-if="show">
				<view class="modal-bj"><view class="modal-title">每日签到</view></view>
				<view class="modal-content">
					<navigator class="modal-btn" url="../sign-rule/sign-rule">签到规则</navigator>
					<view class="modal-sign">
						累计签到
						<text class="sign-num">2</text>
						天
					</view>
					<view class="modal-surplus">
						距离下一奖励还有
						<text>4</text>
						天，加油哦！
					</view>
					<view class="modal-block-group">
						<view class="modal-cold" v-for="(item, index) in modalDataGroup" :key="index" @tap="modalDayMinSelect(index)" :class="index === 6 ? 'modal-last' : ''">
							<view class="cold-top">
								第
								<text class="top-num">{{ item.modalDay }}</text>
								天
							</view>
							<image class="cold-middle" :src="item.modalUrl" mode=""></image>
							<view class="cold-bottom">
								+
								<text class="bottom-num">{{ item.modalBeanNum }}</text>
								银豆
							</view>
							<!-- 遮罩层签到成功开始 -->
							<view class="min-mask-area" v-if="item.isSign == true">
								<image class="min-mask-img" src="../../static/welfare_agency/popup_right.png" mode=""></image>
							</view>
							<!-- 遮罩层签到成功结束 -->
							<!-- 遮罩层签到补签开始 -->
							<view class="min-mask-area" v-if="item.isSign == false" @tap="handleSignModal()">
								<view class="min-mask-word">补签</view>
							</view>
							<!-- 遮罩层签到补签结束 -->
						</view>
					</view>
				</view>
			</view>
		</view>
			
	
		<!-- 弹窗区域结束 -->
		
		<!-- 补签签到弹窗开始 -->
		<view class="tanchuang">
			<view class="mask" @tap="setMaskShowSign" v-if="show_sign"></view>
			<view class="sign-modal" @tap="setMaskShowSign" v-if="show_sign">
				<view class="sign-text">确定要补签吗？</view>
				<view class="sign-btn-area">
					<view class="sign-btn-left" @tap="handleSignCancel()">以后再说</view>
					<view class="sign-btn-right" @tap="handleSignConfirm()">补签</view>
				</view>
			</view>
		</view>
		<!-- 补签签到弹窗结束 -->
		
		<!-- 连续签到弹窗开始 -->
		<view class="tanchuang">
			<view class="mask" @tap="setMask()" v-if="show_continuity"></view>
			<view class="continuity-modal" @tap="setMask()" v-if="show_continuity">
				<view class="symbol-logo" @tap="handleCloseButton()">X</view>
				<view class="continuity-modal-content">
					<view class="continuity-content-area">
						<view class="continuity-content-top">连续签到奖励</view>
						<view class="continuity-content-text">您已连续签到<text class="continuity-num">7</text>天，恭喜获得以下奖励：</view>
						<view class="continuity-content-middle">
							<view class="continuity-middle-left">
								<image class="continuity-img" src="../../static/welfare_agency/popup_bean.png" mode=""></image>
								<view class="continuity-txt">银豆x<text class="continuity-txt-num">4</text></view>
							</view>
							<view class="continuity-middle-right">
								<image class="continuity-pic" src="../../static/welfare_agency/sign_author.png" mode=""></image>
								<view class="continuity-txt">初出茅庐</view>
							</view>
						</view>
						<view class="continuity-content-bottom">
							<view class="continuity-bottom-btn" @tap="handleAcceptButton()">果断收下</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 连续签到弹窗结束 -->
	</view>
</template>

<script>

export default {
	components: {
		
	},
	props: {
		
	},
	data() {
		return {
			show: true, // 弹窗的显示与否
			show_sign: false, // 补签弹窗的显示与否
			show_continuity: false, //连续签到弹窗的显示与否
			modalDataGroup: [
				{
					modalDay: 1,
					modalUrl: '../../static/welfare_agency/popup_bean.png',
					modalBeanNum: 1,
					isSign: true
				},
				{
					modalDay: 2,
					modalUrl: '../../static/welfare_agency/popup_bean.png',
					modalBeanNum: 1,
					isSign: true
				},
				{
					modalDay: 3,
					modalUrl: '../../static/welfare_agency/popup_bean.png',
					modalBeanNum: 1,
					isSign: false
				},
				{
					modalDay: 4,
					modalUrl: '../../static/welfare_agency/popup_bean.png',
					modalBeanNum: 2,
					isSign: true
				},
				{
					modalDay: 5,
					modalUrl: '../../static/welfare_agency/popup_bean.png',
					modalBeanNum: 2,
					isSign: false
				},
				{
					modalDay: 6,
					modalUrl: '../../static/welfare_agency/popup_bean.png',
					modalBeanNum: 2,
					isSign: false
				},
				{
					modalDay: 7,
					modalUrl: '../../static/welfare_agency/popup_bean.png',
					modalBeanNum: 5,
					isSign: false
				}
			],
			isActive: -1 // 控制index值的起始值
		};
	},
	onLoad() {},
	methods: {
		setMaskShow() {
            this.show = false;
			console.log("345")
        },
		setMaskShowSign() {
            this.show_sign = false;
        },
		setMask() {
            this.show_continuity = false;
        },
		handleSignModal() { // 补签窗口的弹窗打开与否
			this.show_sign = true
		},
		handleSignCancel() { //取消补签签到的点击事件
			this.show = false
			this.show_sign = false
		},
		handleSignConfirm() { // 确认补签签到的点击事件
			this.show_sign = false
			this.show_continuity = true
		},
		handleCloseButton() { //x号的按钮
			this.show_continuity = false
		},
		handleAcceptButton() { //果断收下按钮
			this.show = false
			this.show_sign = false
			this.show_continuity = false
		},
		modalDayMinSelect(index) {
			// 弹窗里面的签到1-7天数的点击事件
			console.log(index);
			this.isActive = index;
			this.modalDataGroup[index].isSign = true
		},
		handleClick(index) {
			this.activeIndex = index
		}
	},
	computed: {
		
	}
};
</script>

<style lang="scss" scoped>

// 弹框区域开始
.tanchuang {
	width: 100%;
    height: 100%;
}
.mask {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	background: #000;
	opacity: 0.5;
	z-index: 998;
}
		.modal1 {
			width: 588upx;
			height: 1038upx;
			background: transparent;
			border-bottom-left-radius: 36upx;
			border-bottom-right-radius: 36upx;
			position: fixed;
			top: 50%;
			left: 50%;
			margin-left: -294upx;
			margin-top: -519upx;
			background: transparent;
			z-index: 999;
			.modal-bj {
				width: 588upx;
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
				width: 564upx;
				height: 710upx;
				background: #fff;
				box-shadow: 0upx -12upx 0upx 0upx rgba(53, 123, 235, 1) inset;
				border-radius: 36upx;
				margin-top: -40upx;
				position: relative;
				z-index: 50;
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				align-items: center;
				.modal-btn {
					display: block;
					width: 100upx;
					height: 32upx;
					border: 3upx solid #222a55;
					border-radius: 8upx;
					background-color: #ffa200;
					align-self: flex-end;
					margin-top: 30upx;
					margin-right: 30upx;
					line-height: 32upx;
					color: #fff;
					text-align: center;
					font-size: 24upx;
					font-family: PingFang-SC-Medium;
				}
				.modal-sign {
					width: 100%;
					height: 40upx;
					line-height: 40upx;
					font-size: 40upx;
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
					height: 20upx;
					line-height: 20upx;
					color: #357beb;
					font-size: 20upx;
					text-align: center;
				}
				.modal-block-group {
					overflow: hidden;
					padding-top: 20upx;
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: flex-start;
					flex-wrap: wrap;
					padding: 0 40upx;
					.modal-cold {
						width: 140upx;
						height: 160upx;
						border: 3upx solid #222a55;
						box-sizing: border-box;
						border-radius: 10upx;
						background-color: #609dff;
						margin: 10upx;
						box-shadow: 0upx -6upx 0upx 0upx #357beb inset;
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
							margin-bottom: 10upx;
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
						.cold-middle {
							display: block;
							width: 64upx;
							height: 64upx;
							background-size: 100% 100%;
							align-self: center;
						}
						.cold-bottom {
							width: 100%;
							height: 24upx;
							line-height: 24upx;
							margin-top: 4upx;
							color: #ffea00;
							font-size: 24upx;
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
						width: 460upx;
						height: 164upx;
						position: relative;
						margin: 10upx;
						border-radius: 10upx;
						background: url('~@/static/welfare_agency/popup_bj.png') no-repeat;
						background-size: 460upx 160upx;
						border: 3upx solid #222a55;
						box-sizing: border-box;
						display: flex;
						flex-direction: column;
						justify-content: flex-start;
						z-index: 200;
						.last-top {
							width: 457upx;
							height: 45upx;
							border-top-left-radius: 10upx;
							border-top-right-radius: 10upx;
							background-color: #357beb;
							margin-bottom: 10upx;
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
							width: 64upx;
							height: 64upx;
							background: url('~@/static/welfare_agency/popup_bean.png') no-repeat;
							background-size: 100% 100%;
							align-self: center;
						}
						.last-bottom {
							width: 100%;
							height: 24upx;
							line-height: 24upx;
							margin-top: 4upx;
							color: #ffea00;
							font-size: 24upx;
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

// 弹窗里面的遮罩层开始
.min-mask-area {
	width: 100%;
	height: 100%;
	border-radius: 10upx;
	background: rgba(0, 0, 0, 0.55) !important;
	position: absolute;
	z-index: 350;
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
		background-color: #FFA200;
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

.max-mask-area {
	width: 100%;
	height: 100%;
	position: absolute;
	border-radius: 10upx;
	background: rgba(0, 0, 0, 0.55) !important;
	z-index: 350;
	.max-mask-img {
		display: block;
		width: 66upx;
		height: 50upx;
		position: absolute;
		bottom: 14upx;
		right: 10upx;
		z-index: 400;
	}
}
// 弹窗里面的遮罩层结束
//补签签到的弹窗开始

.sign-modal {
	width: 564upx;
	height: 334upx;
	background-color: #FFFEFB;
	box-shadow: 0upx -12upx 0upx 0upx rgba(53, 123, 235, 1) inset;
	border-radius: 36upx;
	position: fixed;
	top: 50%;
	left: 50%;
	margin-left: -282upx;
	margin-top: -167upx;
	z-index: 999;
}

.sign-text {
	width: 564upx;
	height: 32upx;
	line-height: 32upx;
	font-size: 32upx;
	font-family: PingFang-SC-Medium;
	font-weight: 500;
	margin-top: 114upx;
	margin-bottom: 60upx;
	text-align: center;
	color: #1A488C;
}
.sign-btn-area {
	width: 100%;
	height: 60upx;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-content: center;
}
.sign-btn-left {
	width: 164upx;
	height: 60upx;
	border-radius: 60upx;
	background-color: #38ADFF;
	border: 3upx solid #222A55;
	box-sizing: border-box;
	box-shadow: 0upx -6upx 0upx 0upx rgba(19, 105, 190, 1) inset;
	line-height: 54upx;
	font-size: 28upx;
	color: #fff;
	font-family: PingFang-SC-Bold;
	font-weight: 500;
	text-align: center;
	margin-left: 78upx;
}
.sign-btn-right {
	width: 164upx;
	height: 60upx;
	border-radius: 60upx;
	background-color: #FCC653;
	border: 3upx solid #222A55;
	box-sizing: border-box;
	box-shadow: 0upx -6upx 0upx 0upx rgba(217, 116, 7, 1) inset;
	line-height: 54upx;
	font-size: 28upx;
	color: #fff;
	font-family: PingFang-SC-Bold;
	font-weight: 500;
	text-align: center;
	margin-right: 78upx;
}
//补签签到的弹窗结束

//连续签到奖励的弹窗开始

.continuity-modal {
	width: 564upx;
	height: 684upx;
	background: transparent;
	border-bottom-left-radius: 36upx;
	border-bottom-right-radius: 36upx;
	// position: relative;
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
	background-color: #FFFFFF;
	box-shadow: 0upx -12upx 0upx 0upx rgba(53, 123, 235, 1) inset;
	border-radius: 36upx;
	position: absolute;
	bottom: 0;
	left: 0;
}
.continuity-content-area {
	width: 100%;
	height: 514upx;
	background-color: #FFFFFF;
	box-shadow: 0upx -12upx 0upx 0upx rgba(53, 123, 235, 1) inset;
	border-radius: 36upx;
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
	color: #0A3F88;
	align-self: center;
	margin: 55upx 0;
	.continuity-num {
		padding: 0 10upx;
		color: #EF6E03;
		font-size: 36upx;
	}
}
.continuity-content-middle {
	width: 100%;
	height: 156upx;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-content: center;
	margin-bottom: 62upx;
}
.continuity-middle-left {
	width: 150upx;
	height: 156upx;
	background: url('~@/static/welfare_agency/sign_bj.png') no-repeat;
	background-size: 100% 100%;
	margin-right: 28upx;
	display: flex;
	flex-direction:column;
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
	flex-direction:column;
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
	height: 28upx;
	line-height: 28upx;
	color: #FFEA00;
	font-family: PingFang-SC-Medium;
	font-weight: 500;
	-webkit-text-stroke: 1upx #253A81; //文字中的描边
	text-stroke: 1upx #253A81;
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
	background-color: #FCC653;
	border: 3upx solid #222A55;
	box-sizing: border-box;
	box-shadow: 0upx -6upx 0upx 0upx rgba(217, 116, 7, 1) inset;
	line-height: 60upx;
	font-size: 32upx;
	color: #fff;
	font-family: PingFang-SC-Bold;
	font-weight: 500;
	text-align: center;
}
//连续签到奖励的弹窗结束


</style>
