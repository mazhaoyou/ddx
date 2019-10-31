<template>
	<view class="honor-achievement-wrapper">
		<!-- 导航开始 -->
		<view class="nav-area"></view>
		<!-- 导航结束 -->
		<!-- 个人信息开始 -->
		<view class="info">
			<view class="info-user">
				<view class="info-user-head">
					<image class="head-portrait" :src="honorAchievementData.headPicUrl"></image>
				</view>
				<view class="info-user-content">
					<view class="info-name">
						<text class="info-name-text">{{ honorAchievementData.nickname }}</text>
						<view class="info-vip">
							<text>VIP</text>
							{{ vipLeave }}
						</view>
					</view>
					<view class="info-title">
						<text>{{ honorAchievementData.titleName }}</text>
						<text class="info-title-text" @tap="changeTitle">更换称号</text>
					</view>
				</view>
			</view>
			<view class="vip">
				<view class="vipNow vipBox">
					<text class="vipNow-top">{{ honorAchievementData.levelDataLeast }}</text>
					<text>VIP</text>
					{{ vipLeave }}
				</view>
				<view class="vipIntegral">
					<text class="vipIntegral-top" :style="{ left: infoStyle.topLeft }">{{ honorAchievementData.experience }}</text><!-- 用户经验值的left值 -->
					<view class="vipIntegral-box">
						<view class="vipIntegral-total" :style="{ width: infoStyle.totalWidth }">
							<!-- 升级经验条的宽度 -->
							<view class="vipIntegral-user" :style="{ width: infoStyle.userWidth }"></view><!-- 用户经验值 -->
						</view>
					</view>
				</view>
				<view class="vipNext vipBox">
					<text class="vipNext-top">{{ honorAchievementData.levelDataMost }}</text>
					<text>VIP</text>
					{{ honorAchievementData.nextLevel }}
				</view>
				<view class="vipTips">
					<view class="vipTips-icon" :style="{ marginLeft: infoStyle.iconLeft }"></view>
					<view class="vipTips-main">
						经验值获取加速度{{ honorAchievementData.speedRatio }}%，
						<text>{{ honorAchievementData.levelNeed }}</text>
						分即可升级
					</view>
				</view>
			</view>
		</view>
		<!-- 个人信息结束 -->
		<!-- 礼包开始 -->
		<view class="package">
			<view class="week package-li" @tap="openWeekPackage" :class="honorAchievementData.receiveWeek == '1' ? 'style' : ''">
				<view class="package-title">
					<text class="title1">周</text>
					<text class="title2">礼</text>
					<text class="title3">包</text>
				</view>
				<image v-if="honorAchievementData.receiveWeek == 0" src="../../static/honor_achievement/week.png"></image>
				<image v-else src="../../static/honor_achievement/unselect.png"></image>
				<!-- <view class="package-num" v-if="honorAchievementData.receiveWeek == 0">1</view> -->
			</view>
			<view class="month package-li" @tap="openMonthPackage" :class="honorAchievementData.receiveMonth == '1' ? 'style' : ''">
				<view class="package-title">
					<text class="title1">月</text>
					<text class="title2">礼</text>
					<text class="title3">包</text>
				</view>
				<image v-if="honorAchievementData.receiveMonth == 0" src="../../static/honor_achievement/month.png"></image>
				<image v-else src="../../static/honor_achievement/unselect.png"></image>
				<!-- <view class="package-num" v-if="honorAchievementData.receiveMonth == 0">1</view> -->
			</view>
		</view>
		<!-- 礼包结束 -->
		<!-- VIP等级滑动 -->
		<view class="vipInfo">
			<view class="vipInfo-box" @tap="headPortrait(receiveReach)">
				<view class="vipInfo-bigbox">
					<text class="bigbox-vip">
						VIP{{ vipActiveShow }}
					</text>
				</view>
			</view>
			<view class="vipInfo-ul">
				<!-- 头部滑动大图区域头像框 -->
				<swiper class="swiper-info" :indicator-dots="swiper.indicatorDots" :autoplay="swiper.autoplay" :circular="swiper.circular"
				 :current="vipActive" display-multiple-items="4" @change="change">
					<swiper-item></swiper-item>
					<swiper-item></swiper-item>
					<swiper-item v-for="(item, index) in giftReachList" :key="index" :class="'vipInfo-li' + (index == vipActive ? ' vipInfo-active' : '')">
						<view v-if="index > vipLeave - 1" class="vipInfo-filter">
							<image :src="item.levelDataPicUrl"></image>
						</view>
						<view v-else>
							<image :src="item.levelDataPicUrl"></image>
						</view>
					</swiper-item>
					<swiper-item></swiper-item>
				</swiper>
			</view>
			<view class="test">
				<!-- 中间区域的滑动 -->
				<swiper :indicator-dots="swiper.indicatorDots" :autoplay="swiper.autoplay" :circular="swiper.circular" :current="vipActive"
				 display-multiple-items="6" @change="change" class="test-swiper">
					<swiper-item></swiper-item>
					<swiper-item></swiper-item>
					<swiper-item></swiper-item>
					<swiper-item v-for="(item, index) in giftReachList" :key="index" :class="'test-leave' + (index < vipLeave ? ' hasPowr' : ' noPowr')">
						<view v-if="index != giftReachList.length - 1" :class="'test-line' + (index == vipLeave - 1 ? ' filterLine' : '')"></view>
						<view :class="index == vipLeave - 1 ? 'original-point' : ''" :style="{left: progressSmall.topLeft}"></view>
						<!-- 圆形小远点 -->
						<view :class="index == vipLeave - 1 ? 'progress-line' : ''" :style="{width: progressSmall.userWidth}"></view>
						<!-- 黄色经验值的进度条 -->
						<view class="test-num">{{ item.levelDataName }}</view>
						<text>{{ item.levelDataLeast }}</text>
					</swiper-item>
					<swiper-item></swiper-item>
					<swiper-item></swiper-item>
				</swiper>
			</view>
		</view>
		<!-- VIP等级滑动结束-->
		<!-- 等级权益开始 -->
		<view class="equity" v-for="(item, index) in giftReachList" :key="index" v-if="index == vipLeave - 1">
			<view class="equity-icon"></view>
			<view class="equity-content">
				<view class="equity-top">
					<image src="../../static/honor_achievement/marks1.png" class="equity-top-left"></image>
					<text>等级权益</text>
					<image src="../../static/honor_achievement/marks2.png" class="equity-top-right"></image>
				</view>
				<view class="equity-line"></view>
				<view class="equity-li" v-for="(list, i) in item.benefitList" :key="i">
					<view class="equity-li-img">
						<image :src="list.levelImg"></image>
					</view>
					<view class="equity-li-text">
						<view>{{ list.levelName }}</view>
						<text>{{ list.levelDesc }}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 等级权益结束 -->
		<!-- 礼包弹框开始 -->
		<neil-modal :show="packageWeekShow">
			<view class="showPack">
				<view class="showPack-title" v-if="honorAchievementData.receiveWeek == 0"> {{ giftListGroup.giftName }}</view>
				<view class="showPack-content">
					<view class="showPack-text">
						恭喜你可领取
						<text>VIP{{ vipLeave }}</text>
						礼包!
					</view>
					<view class="showPick-area">
						<view class="showPick-content" v-for="(item, index) in giftListGroup.giftList" :key="index">
							<view class="showPick-pic">
								<image class="showPick-img" :src="item.levelImg"></image>
							</view>
							<view class="showPick-word">{{ item.gsName }}×{{ item.gsNum }}</view>
						</view>
					</view>
					<view class="showPack-btn" @tap="closeWeekPackage()">立即领取</view>
				</view>
			</view>
		</neil-modal>
		<!-- 礼包弹框结束 -->
		<!-- 礼包弹框开始 -->
		<neil-modal :show="packageMonthShow">
			<view class="showPack">
				<view class="showPack-title" v-if="honorAchievementData.receiveMonth == 0">月礼包</view>
				<view class="showPack-content">
					<view class="showPack-text">
						恭喜你可领取
						<text>VIP{{ vipLeave }}</text>
						礼包!
					</view>
					<view class="showPick-area">
						<view class="showPick-content" v-for="(item, index) in giftListGroup.giftList" :key="index">
							<view class="showPick-pic">
								<image class="showPick-img" :src="item.levelImg"></image>
							</view>
							<view class="showPick-word">{{ item.gsName }}×{{ item.gsNum }}</view>
						</view>
					</view>
					<view class="showPack-btn" @tap="closeMonthPackage()">立即领取</view>
				</view>
			</view>
		</neil-modal>
		<!-- 礼包弹框结束 -->
		<!-- 达成礼包弹窗开始 -->
		<neil-modal :show="headPortraitShow">
			<view class="showPack">
				<view class="showPack-title" v-if="receiveReach == 0">达成礼包</view>
				<view class="showPack-content">
					<view class="showPack-text">
						恭喜你可领取
						<text>VIP{{ vipLeave }}</text>
						礼包!
					</view>
					<view class="showPick-area">
						<view class="showPick-content" v-for="(item, index) in giftListGroup.giftList" :key="index">
							<view class="showPick-pic">
								<image class="showPick-img" :src="item.levelImg"></image>
							</view>
							<view class="showPick-word">{{ item.gsName }}×{{ item.gsNum }}</view>
						</view>
					</view>
					<view class="showPack-btn" @tap="closeHeadPortrit()">立即领取</view>
				</view>
			</view>
		</neil-modal>
		<!-- 达成礼包弹窗结束 -->
		<!-- 称号弹框开始 -->
		<neil-modal :show="titleShow">
			<view class="title">
				<view class="title-head">荣誉称号</view>
				<view class="title-content">

					<view class="new-title-info">
						<view class="new-title-pic">
							<image class="new-title-img" :src="honorAchievementData.headPicUrl" mode=""></image>
						</view>
						<view class="new-title-name">{{ honorAchievementData.nickname }}</view>
						<view class="new-title-bj">
							<view class="new-title-picture">
								<view class="new-title-desc">称号：<text class="new-title-word">{{ honorAchievementData.titleName }}</text></view>
							</view>
						</view>
					</view>
					<view class="title-ul">
						<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y">
							<view v-for="(item, index) in titleList" :key="index" :class="'title-li' + (index == activeTitle ? ' activeTitle' : '')"
							 @tap="editTitle(index)">
								<text>{{ item.titleName }}</text>
								<image src="../../static/honor_achievement/active.png" v-if="index == activeTitle"></image>
							</view>
						</scroll-view>
						<view class="title-btn-area">
							<view class="title-btn1" @tap="closeTitle()">取消</view>
							<view class="title-btn2" @tap="confirmTitle()">确定</view>
						</view>
					</view>
					<!-- <view class="title-btn" @tap="closeTitle()">关闭</view>
					<view class="title-btn" @tap="closeTitle()">关闭</view> -->
				</view>
			</view>
		</neil-modal>
		<!-- 称号弹框结束 -->
	</view>
</template>

<script>
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
	import uniIcon from '@/components/uni-icon/uni-icon.vue';
	import neilModal from '@/components/neil-modal/neil-modal.vue';

	export default {
		components: {
			uniNavBar,
			uniIcon,
			neilModal
		},
		data() {
			return {
				token: "", //用户标识
				vipLeave: 0, //用户VIP等级  从1开始计算
				vipActive: 0, // 用户查看的VIP等级  从0计算
				vipActiveShow: 0,
				scrollTop: 0,
				activeTitle: 1, //更换称号，选中的称号
				honorAchievementData: {}, //荣誉成就页面数据
				packageWeekShow: false, //礼包弹框状态
				packageMonthShow: false, //月礼包弹窗状态
				headPortraitShow: false, //等级任务达成礼包
				titleShow: false, //称号弹框状态
				swiper: {
					indicatorDots: false,
					autoplay: false,
					circular: false
				},
				infoStyle: { // 大的进度条
					userWidth: 0, // 用户经验值条的宽度
					totalWidth: 0, // 升级经验条的宽度
					topLeft: 0, // 用户经验值的left值
					iconLeft: 0 // 三角形角标的left值
				},
				progressSmall: { //等级的圆形点
					userWidth: 0, // 用户经验值条的宽度
					topLeft: 0 // 用户经验值的left值
				},
				titleList: [], //称号的数组
				giftReachList: {}, //返回等级1-15的数据集合
				gradeList: [], // 等级权益数组集合
				giftListGroup: {} ,//礼包详情展示效果
				receiveReach: "" // 达成任务的领取状态
			};
		},
		onLoad() {
			this.token = this.$storage.isAuthed();
			if (this.token) {
				let data = {
					token: this.token
				};
				this.getData(data);
				let honorDataList = {
					token: this.token
				}
				this.honorList(honorDataList);
				let giftInfo = {
					token: this.token
				}
				this.getGiftInfo(giftInfo);
			}
		},
		onReady() {

		},
		methods: {
			//获取1-15等级的分类
			getGiftInfo(data) {
				let that = this;
				this.$api.getGiftInfo(data).then(res => {
					res = res.data;
					if (res.code == '0001') {
						res = res.data;
						that.giftReachList = res.giftReach;
						for(let i = 0; i < that.giftReachList.length; i++) {
							that.receiveReach = that.giftReachList[i].receiveReach;
						}
					} else {
						uni.showToast({
							title: res.message,
							icon: "none",
							duration: 2000
						})
					}
				}).catch(err => {
					uni.showToast({
						title: '服务异常',
						icon: "none",
						duration: 2000
					});
				});
			},
			//获取荣誉成就页面的用户数据
			getData(data) {
				let that = this;
				this.$api.honor(data).then(res => {
					res = res.data;
					if (res.code == '0001') {
						res = res.data;
						that.honorAchievementData = res;
						that.vipLeave = res.levelDataName; //用户等级
						that.vipActive = res.levelDataName - 1; //用户查看的VIP等级  从0计算
						that.vipActiveShow = res.levelDataName; //用户等级
						let totalNeed = that.honorAchievementData.levelDataMost - that.honorAchievementData.levelDataLeast; //每一级总共需要的升级经验值
						let upNeed = that.honorAchievementData.levelNeed; //升级所需要的经验
						let experience = that.honorAchievementData.experience - that.honorAchievementData.levelDataLeast; //此时在进度条中的进度值的位置

						that.infoStyle.userWidth = uni.upx2px((experience * 500) / totalNeed) + 'px'; //用户经验值条的宽度
						that.infoStyle.totalWidth = uni.upx2px((upNeed * 500) / totalNeed) + 'px'; //升级经验条的宽度
						that.infoStyle.topLeft = uni.upx2px((experience * 500) / totalNeed - 30) + 'px'; //用户经验值的left值
						that.infoStyle.iconLeft = uni.upx2px((upNeed * 500) / totalNeed - 14) + 'px'; //三角形角标的left值

						that.progressSmall.userWidth = uni.upx2px((experience * 125) / totalNeed) + 'px'; //用户经验值条的宽度
						that.progressSmall.topLeft = uni.upx2px((experience * 125) / totalNeed - 12) + 'px'; //用户经验值的left值
					} else {
						uni.showToast({
							title: res.message,
							icon: "none",
							duration: 2000
						})
					}
				}).catch(err => {
					uni.showToast({
						title: '服务异常',
						icon: "none",
						duration: 2000
					});
				});
			},
			//获取荣誉称号的数据
			honorList(data) {
				let that = this;
				this.$api.honorList(data).then(res => {
					res = res.data;
					if (res.code == '0001') {
						res = res.data;
						that.titleList = res.titleList;
					} else {
						uni.showToast({
							title: res.message,
							icon: "none",
							duration: 2000
						})
					}
				}).catch(err => {
					uni.showToast({
						title: '服务异常',
						icon: "none",
						duration: 2000
					});
				});
			},
			// 添加自定义按钮 按钮的点击事件需要在页面监听onNavigationBarButtonTap事件
			onNavigationBarButtonTap() {
				uni.navigateTo({
					url: '/pages/exp-history/exp-history'
				});
			},
			// VIP等级切换
			change(e) {
				this.vipActive = e.detail.current;
				this.vipActiveShow = this.vipActive + 1;
			},
			//打开更换称号
			changeTitle() {
				this.titleShow = true;
			},
			// 选择称号的名字
			editTitle(index) {
				this.activeTitle = index;
			},
			//关闭更换称号弹框
			closeTitle() {
				this.titleShow = false;
			},
			//确定提交改变称号
			confirmTitle() {
				let data = {
					token: this.token,
					titleId: this.activeTitle
				}
				this.$api.setHonoraryTitle(data).then(res => {
					res = res.data;
					if (res.code == '0001') {
						uni.showToast({
							title: "修改称号成功",
							icon: "success",
							duration: 2000
						})
					} else {
						uni.showToast({
							title: res.message,
							icon: "none",
							duration: 2000
						})
					}
				}).catch(err => {
					uni.showToast({
						title: '服务异常',
						icon: "none",
						duration: 2000
					});
				});
				this.honorAchievementData.titleName = this.titleList[this.activeTitle].titleName;
				this.titleShow = false;
			},
			// 打开周礼包弹框
			openWeekPackage() {
				this.packageWeekShow = true;
				let data = {
					giftId: this.levelDataGiftWeek,
					token: this.$storage.getStorage('token', 2)
				};
				let that = this;
				this.$api.getGiftInfoByGiftId(data).then(res => {
					res = res.data;
					if (res.code == '0001') {
						that.giftListGroup = res.data;
					} else {
						uni.showToast({
							title: res.message,
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
			},
			// 立即领取周礼包并关闭周礼包弹框
			closeWeekPackage() {
				this.packageWeekShow = false;
				let data = {
					token: this.token,
					giftId: this.levelDataGiftWeek,
					giftType: 1
				};
				this.$api.receiveGift(data).then(res => {
					res = res.data;
					if (res.code == '0001') {
						console.log(res)
						uni.showToast({
							title: "领取成功",
							icon: "success",
							duration: 2000
						})
					} else {
						uni.showToast({
							title: res.message,
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
			},
			// 打开月礼包弹框
			openMonthPackage() {
				this.packageMonthShow = true;
				let data = {
					giftId: this.levelDataGiftMonth,
					token: this.$storage.getStorage('token', 2)
				};
				let that = this;
				this.$api.getGiftInfoByGiftId(data).then(res => {
					res = res.data;
					if (res.code == '0001') {
						that.giftListGroup = res.data;
					} else {
						uni.showToast({
							title: res.message,
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
			},
			// 立即领取月礼包并关闭月礼包弹框
			closeMonthPackage() {
				this.packageMonthShow = false;
				let data = {
					token: this.token,
					giftId: this.levelDataGiftMonth,
					giftType: 2
				};
				this.$api.receiveGift(data).then(res => {
					res = res.data;
					if (res.code == '0001') {
						console.log(res)
						uni.showToast({
							title: "领取成功",
							icon: "success",
							duration: 2000
						})
					} else {
						uni.showToast({
							title: res.message,
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
			},
			//VIP头像区域点击
			headPortrait(status) {
				if(status == 3) {
					// 没有达成改等级无法领取奖励
					uni.showToast({
						title: "您经验值未达到改等级经验！",
						icon: "none",
						duration: 2000
					})
				} else if (status == 0){
					this.headPortraitShow = true;
					let data = {
						giftId: this.giftReachList.giftId,
						token: this.$storage.getStorage('token', 2)
					};
					let that = this;
					this.$api.getGiftInfoByGiftId(data).then(res => {
						res = res.data;
						if (res.code == '0001') {
							that.giftListGroup = res.data;
						} else {
							uni.showToast({
								title: res.message,
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
			},
			// 领取达成礼包奖励并关闭弹窗
			closeHeadPortrit() {
				this.headPortraitShow = false;
				let data = {
					token: this.token,
					giftId: this.giftReachList.giftId,
					giftType: 3
				};
				this.$api.receiveGift(data).then(res => {
					res = res.data;
					let message = res.message;
					if (res.code == '0001') {
						console.log(res)
						uni.showToast({
							title: "领取成功",
							icon: "success",
							duration: 2000
						})
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
	};
</script>

<style lang="scss" scoped>
	.honor-achievement-wrapper {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		background: #668ff6;
		background-size: 100% 100%;
	}

	// 导航开始
	.nav-area {
		z-index: 100;
		width: 100%;
		min-height: 220upx;
		height: calc(220upx + var(--status-bar-height));
		background: #2c2c8d;
		border-radius: 0 0 50% 50%;
	}

	// 导航结束
	// 个人信息开始
	.info {
		width: 689upx;
		height: 279upx;
		background: rgba(253, 215, 83, 1);
		border: 3upx solid rgba(34, 59, 141, 1);
		box-shadow: 0upx -12upx 0 0 rgba(244, 174, 39, 1) inset;
		border-radius: 37upx;
		z-index: 101;
		margin-top: -236rpx;

		.info-user {
			width: 640upx;
			height: 98upx;
			margin: 24upx 0 0 37upx;
			display: flex;
			flex-direction: row;

			.info-user-head {
				@include middle;
				position: relative;

				image {
					width: 96upx;
					height: 98upx;
				}

				.head-portrait-box {
					position: absolute;
				}
			}

			.info-user-content {
				margin-left: 18upx;

				.info-name {
					display: flex;
					flex-direction: row;

					.info-name-text {
						font-family: PingFang-SC-Bold;
						font-weight: bold;
						font-size: 36upx;
						color: #0a3f88;
						margin: 15upx 12upx 12upx 0;
					}

					.info-vip {
						width: 80upx;
						height: 24upx;
						border-radius: 8upx;
						text-align: center;
						line-height: 24upx;
						color: #fff;
						font-size: 20upx;
						font-family: PingFang-SC-Medium;
						background-color: #4FC1FC;
						border: 2upx solid #222a55;
						// box-sizing: border-box;
						margin-top: 20upx;
					}
				}

				.info-title {
					font-size: 28upx;
					color: #0a3f88;

					.info-title-text {
						font-size: 20upx;
						color: #0a3f88;
						margin: 11upx 0 0 9upx;
						opacity: 0.5;
					}
				}
			}
		}

		.vip {
			margin: 40upx 0 0 15upx;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;

			.vipBox {
				width: 80upx;
				height: 29upx;
				border: 2upx solid rgba(34, 42, 85, 1);
				border-radius: 12upx;
				text-align: center;
				line-height: 26upx;
				position: relative;
				font-size: 20upx;
				z-index: 2;
				color: #fff;
			}

			.vipNow {
				box-shadow: 0upx -3upx 0 0upx rgba(34, 143, 199, 1) inset;
				background: #4fc1fc;

				.vipNow-top {
					position: absolute;
					top: 36upx;
					left: 0;
					font-size: 24upx;
					font-weight: bold;
				}
			}

			.vipIntegral {
				width: 500upx;
				height: 13upx;
				border: 3upx solid #243d8f;
				margin: 10upx 0 0 -10upx;
				position: relative;
				z-index: 1;

				.vipIntegral-top {
					font-size: 24upx;
					font-family: PingFang-SC-Bold;
					font-weight: bold;
					position: absolute;
					top: -38upx;
					left: 60upx;
					color: #fff;
				}

				.vipIntegral-total {
					width: 400upx;
					height: 13upx;
					background: #fff;
					position: relative;

					.vipIntegral-user {
						width: 0;
						height: 13upx;
						display: inline-block;
						border-radius: 16upx;
						position: absolute;
						top: 0;
						left: 0;
						background: #6dbff7;
						/* Old browsers */
						background: -moz-linear-gradient(135deg, #6dbff7 33%, #5db7f6 34%, #5db7f6 59%, #6dbff7 60%);
						/* FF3.6+ */
						background: -webkit-gradient(linear, left bottom, right top, color-stop(33%, #6dbff7), color-stop(34%, #5db7f6), color-stop(59%, #5db7f6), color-stop(60%, #6dbff7));
						/* Chrome,Safari4+ */
						background: -webkit-linear-gradient(135deg, #6dbff7 33%, #5db7f6 34%, #5db7f6 59%, #6dbff7 60%);
						/* Chrome10+,Safari5.1+ */
						background: -o-linear-gradient(135deg, #6dbff7 33%, #5db7f6 34%, #5db7f6 59%, #6dbff7 60%);
						/* Opera 11.10+ */
						background: -ms-linear-gradient(135deg, #6dbff7 33%, #5db7f6 34%, #5db7f6 59%, #6dbff7 60%);
						/* IE10+ */
						background: linear-gradient(135deg, #6dbff7 33%, #5db7f6 34%, #5db7f6 59%, #6dbff7 60%);
						/* W3C */
						filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#6DBFF7', endColorstr='#6DBFF7', GradientType=1);
						/* IE6-9 fallback on horizontal gradient */
						background-size: 40upx 20upx;
					}
				}
			}

			.vipNext {
				box-shadow: 0upx -3upx 0upx 0upx rgba(178, 35, 82, 1) inset;
				background-color: #FF4D79;
				margin-left: -10upx;

				.vipNext-top {
					position: absolute;
					top: 36upx;
					left: 10upx;
					font-size: 24upx;
					font-weight: bold;
				}
			}

			.vipTips {
				width: 500upx;
				height: 50upx;
				margin-left: 76upx;

				.vipTips-icon {
					border-style: solid;
					border-width: 0 14upx 14upx 14upx;
					border-color: transparent transparent #fff transparent;
					opacity: 0.60;
					width: 0px;
					height: 0px;
					margin-left: 386upx;
				}

				.vipTips-main {
					height: 32upx;
					background: #fff;
					box-shadow: 2upx 3upx 5upx 0 rgba(223, 132, 2, 0.43);
					opacity: 0.60;
					border-radius: 32upx;
					font-size: 24upx;
					line-height: 32upx;
					color: #0a3f88;
					text-align: center;

					text {
						font-weight: bold;
					}
				}
			}
		}
	}

	//礼包
	.package {
		display: flex;
		flex-direction: row;
		margin-top: 72upx;
		width: 100%;

		.week {
			margin: 0 48upx;
		}

		.package-li {
			width: 297upx;
			height: 133upx;
			background: #2c2c8d;
			border: 3upx solid #18214f;
			border-radius: 11upx;
			color: #fff;
			font-size: 28upx;
			text-align: center;
			font-family: PingFang-SC-Bold;
			font-weight: bold;
			position: relative;
			box-shadow: 3upx 3upx 3upx  #668FF6 inset, -3upx -3upx 3upx  #668FF6 inset;

			.package-title {
				width: 214upx;
				height: 70upx;
				margin: -25upx 0 0 42upx;
				display: flex;
				flex-direction: row;
				line-height: 46upx;
				background: url('~@/static/honor_achievement/packTitle.png') no-repeat;
				background-size: 100% 100%;

				.title1 {
					transform: rotate(-15deg);
					margin-left: 70upx;
				}

				.title2 {
					line-height: 40upx;
				}

				.title3 {
					transform: rotate(15deg);
				}
			}

			image {
				display: inline-block;
				width: 96upx;
				height: 101upx;
				margin-top: -22upx;
			}

			.package-num {
				width: 45upx;
				height: 45upx;
				color: #fff;
				font-size: 32upx;
				text-align: center;
				line-height: 45upx;
				background: #ff4d79;
				border: 3upx solid #222a55;
				box-shadow: 0 -3upx 0 0 #b22352 inset;
				border-radius: 50%;
				position: absolute;
				top: -15upx;
				right: -15upx;
			}
		}
	}

	// VIP等级滑动
	.vipInfo {
		width: 100%;
		height: 390upx;
		position: relative;
		margin-top: 83upx;

		.vipInfo-box {
			width: 100%;
			height: 254upx;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-content: center;
			align-items: center;

			.vipInfo-bigbox {
				width: 230upx;
				height: 254upx;
				background-color: #fff;
				border: 3upx solid #28287f;
				box-sizing: border-box;
				border-radius: 30upx;
				align-self: center;
				position: absolute;
				top: 0;
				left: 50%;
				transform: translateX(-50%);
			}

			.bigbox-vip {
				display: inline-block;
				position: absolute;
				bottom: 10upx;
				width: 230upx;
				text-align: center;
				font-size: 32upx;
				font-weight: 400;
				font-family: PingFang-SC-Bold;
				line-height: 32upx;
			}
		}

		.vipInfo-ul {
			width: 100%;
			height: 210upx !important;
			position: absolute;
			top: 0upx;
			left: 0upx;

			.swiper-info {
				height: 200upx !important;
			}

			.vipInfo-li {
				width: 180upx;
				height: 200upx !important;
				margin: 65upx 0 0 -60upx;
				// transition: 1s all;

				.vipInfo-filter image {
					-webkit-filter: grayscale(100%);
					/* Chrome, Safari, Opera */
					filter: grayscale(100%);
				}

				image {
					display: block;
					width: 120upx;
					height: 120upx;
				}
			}

			.vipInfo-active {
				margin: 20upx 0 0 -90upx;
				// transition: 1s all;

				image {
					display: block;
					width: 180upx;
					height: 180upx;
				}
			}
		}

		// 滑动VIP等级
		.test {
			width: 100%;
			height: 100upx!important;
			position: absolute;
			top: 290upx;
			left: 0upx;
			.test-swiper {
				height: 100upx!important;
			}
			.test-leave {
				width: 200upx;
				height: 66upx!important;
				margin-left: -33upx;
				position: relative;

				text {
					display: inline-block;
					color: #fff;
					width: 66upx;
					height: 66upx;
					display: block;
					text-align: center;
					line-height: 40upx;
					font-size: 24upx;
				}

				.test-line {
					width: 100%;
					height: 6upx;
					margin: 0upx;
					position: absolute;
					top: 30upx;
				}

				.progress-line {
					width: 50upx;
					height: 6upx;
					margin: 0upx;
					position: absolute;
					top: 30upx;
				}

				.test-num {
					width: 60upx;
					height: 60upx;
					border-radius: 50%;
					text-align: center;
					line-height: 60upx;
					font-size: 32upx;
					color: #fff;
					text-shadow: 0px 3px 2px rgba(192, 158, 41, 0.75);
					position: relative;
					z-index: 2;
				}
			}

			.hasPowr {
				.test-num {
					background: #fdd753;
					border: 3upx solid #feefb9;
				}

				.test-line {
					background: #f3ad27;
				}

				.progress-line {
					background-color: #f3ad27;
				}

				.original-point {
					width: 12upx;
					height: 12upx;
					border-radius: 50%;
					background-color: #F3AD27;
					position: absolute;
					top: 27upx;
					left: -6upx;
				}

				.filterLine {
					background: #ffffff;
				}
			}

			.noPowr {
				.test-num {
					background: #d9d9d9;
					border: 3upx solid #ebeaea;
				}

				.test-line {
					background: #ffffff;
				}
			}
		}
	}

	.equity {
		width: 100%;
		margin-bottom: 40upx;

		.equity-icon {
			border-style: solid;
			border-width: 0 35upx 35upx 35upx;
			border-color: transparent transparent #28287f transparent;
			margin-left: 342upx;
			width: 0px;
			height: 0px;
		}

		.equity-content {
			background: #2c2c8d;
			width: 678upx;
			border: 3px solid #28287f;
			border-radius: 5upx;
			margin-left: 32upx;

			.equity-top {
				width: 400upx;
				height: 40upx;
				margin: 20upx 0 0 230upx;
				display: flex;
				flex-direction: row;
				color: white;
				font-size: 32upx;
				line-height: 40upx;

				image {
					width: 22upx;
					height: 17upx;
				}

				text {
					margin: 0 18upx;
				}

				.equity-top-right {
					margin-top: 20upx;
				}
			}

			.equity-line {
				width: 608upx;
				height: 1upx;
				background: rgba(255, 255, 255, 1);
				opacity: 0.2;
				margin: 25upx 0 30upx 35upx;
			}

			.equity-li {
				width: 608upx;
				height: auto;
				margin: 0 0 33upx 35upx;
				display: flex;
				flex-direction: row;

				.equity-li-img {
					width: 74upx;
					height: 84upx;
					background: url('~@/static/honor_achievement/polygon.png') no-repeat;
					background-size: 100% 100%;
					margin-right: 27upx;
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-content: center;

					image {
						display: block;
						width: 45upx;
						height: 45upx;
						align-self: center;
					}
				}

				.equity-li-text {
					color: #fff;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-content: center;
					
					view {
						font-size: 32upx;
						// line-height: 1.2;
					}

					text {
						display: inline-block;
						opacity: 0.6;
						font-size: 24upx;
						// line-height: 1.2;
						margin-top: 11upx;
					}
				}
			}
		}
	}

	.title {
		width: 560upx;
		padding-bottom: 15upx;
		margin: 0 auto;

		.title-head {
			width: 283upx;
			height: 86upx;
			margin: 0 auto;
			font-size: 40upx;
			color: white;
			text-align: center;
			line-height: 74upx;
			background: url('~@/static/backpack/pic_title.png') no-repeat;
			background-size: 100% 100%;
			position: relative;
			z-index: 2;
		}

		.new-title-info {
			width: 100%;
			height: auto;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			align-content: center;
		}

		.new-title-pic {
			width: 100%;
			height: 100upx;
			margin-top: 36upx;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-content: center;

			.new-title-img {
				display: block;
				width: 100upx;
				height: 100upx;
				align-self: center;
			}
		}

		.new-title-name {
			margin-top: 10upx;
			width: 100%;
			height: 24upx;
			font-size: 24upx;
			line-height: 24upx;
			color: #333;
			text-align: center;
		}

		.new-title-bj {
			width: 100%;
			height: 82upx;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-content: center;

			.new-title-picture {
				width: 338upx;
				height: 82upx;
				background: url('~@/static/honor_achievement/new_title_bj.png') no-repeat;
				background-size: 100% 100%;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-content: center;
				position: relative;
			}
		}

		.new-title-desc {
			width: 338upx;
			position: absolute;
			bottom: 26upx;
			color: #fff;
			font-size: 20upx;
			text-align: center;
		}

		.new-title-word {
			display: inline-block;
			font-size: 24upx;
		}

		.title-content {
			width: 560upx;
			min-height: 1000upx;
			background: #fffefb;
			box-shadow: 0 -12upx 0 0 #357beb inset;
			border-radius: 40upx;
			margin-top: -26upx;

			.title-ul {
				margin: 16upx 20upx;

				.scroll-Y {
					max-height: 600upx;
				}

				.title-li {
					width: 226upx;
					height: 64upx;
					background: #3887ff;
					border: 3upx solid #223b8d;
					box-sizing: border-box;
					box-shadow: 0px -10upx 0px 0px #1369be inset;
					border-radius: 7upx;
					// margin: 20upx 0 15upx 35upx;
					margin: 16upx;
					float: left;
					text-align: center;
					line-height: 54upx;
					color: white;
					font-size: 24upx;
					font-family: PingFangSC-Regular;
					font-weight: 400;
				}

				.activeTitle {
					background: #ffa200;
					box-shadow: 0px -8upx 0px 0px #d97407 inset, 0px -6upx 0px 0px #b22352 inset;
					position: relative;

					image {
						width: 40upx;
						height: 40upx;
						position: absolute;
						top: -10upx;
						right: -10upx;
					}
				}
			}
			
			.title-btn-area {
				width: 100%;
				min-height: 60upx;
				margin: 30upx auto;
				display: flex;
				flex-direction: row;
				justify-content: space-around;
				align-content: center;
			}

			.title-btn1 {
				width: 160upx;
				height: 60upx;
				background: #38adff;
				border: 3upx solid #222a55;
				box-sizing: border-box;
				box-shadow: 0 -6upx 0 0 #1369be inset;
				border-radius: 30upx;
				text-align: center;
				line-height: 54upx;
				color: white;
				font-size: 27upx;
				font-weight: 500;
				// margin: 30upx auto;
			}
			
			.title-btn2 {
				width: 160upx;
				height: 60upx;
				background: #FFA200;
				border: 3upx solid #222a55;
				box-sizing: border-box;
				box-shadow: 0 -6upx 0 0 #D97407 inset;
				border-radius: 30upx;
				text-align: center;
				line-height: 54upx;
				color: white;
				font-size: 27upx;
				font-weight: 500;
				// margin: 30upx auto;
			}
		}
	}

	.showPack {
		width: 560upx;
		padding-bottom: 15upx;
		margin: 0 auto;

		.showPack-title {
			width: 283upx;
			height: 93upx;
			margin: 0 auto;
			font-size: 40upx;
			color: white;
			text-align: center;
			line-height: 75upx;
			background: url('~@/static/backpack/pic_title.png') no-repeat;
			background-size: 100% 100%;
			position: relative;
			z-index: 2;
		}

		.showPack-content {
			width: 560upx;
			background: #fffefb;
			box-shadow: 0 -12upx 0 0 #357beb inset;
			border-radius: 40upx;
			margin-top: -20upx;
			padding-bottom: 30upx;

			.showPack-text {
				text-align: center;
				padding: 62upx 0 22upx 0;
				font-size: 32upx;
				font-family: PingFang-SC-Bold;
				font-weight: bold;
				color: #0a3f88;

				text {
					font-size: 44upx;
					font-family: PingFang-SC-Heavy;
					font-weight: 800;
					color: #ef6e03;
				}
			}
			
			.showPick-area {
				width: 100%;
				height: 152upx;
				margin-top: 24upx;
				display: flex;
				flex-direction: row;
				justify-content: space-around;
				align-content: center;
				.showPick-content {
					width:145upx;
					height: 152upx;
					background-color: #3887ff;
					border-radius: 10upx;
					box-shadow: 0px -8upx 0px 0px #1369be inset;
					border: 3upx solid #2c2c8d;
					box-sizing: border-box;
					display: flex;
					flex-direction: column;
					justify-content: flex-start;
					align-content: center;
				}
			}
			.showPick-pic {
				width: 100%;
				height: 80upx;
				margin-top: 15upx;
				margin-bottom: 10upx;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-content: center;
				.showPick-img {
					display: block;
					width: 80upx;
					height: 80upx;
				}
			}
			.showPick-word {
				width: 100%;
				text-align: center;
				font-size: 28upx;
				line-height: 28upx;
				font-family: PingFang-SC-Medium;
				font-weight: 600;
				color: #ffea00;
				-webkit-text-stroke: 1upx #253a81;
				text-stroke: 1upx #253a81; 
			}
			
			.showPack-btn {
				width: 253upx;
				height: 67upx;
				text-align: center;
				line-height: 61upx;
				color: white;
				font-size: 27upx;
				font-weight: 500;
				margin: 0 auto;
				margin-top: 52upx;
				margin-bottom: 30upx;
				background: #ffa200;
				border: 3upx solid #222a55;
				box-shadow: 0 -6upx 0 0 #d97407 inset, 0 -6upx 0 0 #b22352 inset;
				border-radius: 33upx;
			}
		}
	}

	//让div处于不可点击的状态
	.style {
		pointer-events: none;
	}
</style>
