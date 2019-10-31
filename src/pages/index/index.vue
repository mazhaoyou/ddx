<template>
	<!-- 首页 -->
	<view class="container">
		<view class="pure_top status-bar"></view>
		<!-- banner-start -->
		<view class="banner-container" >
			<banner :carouselList = "carouselList" ></banner>
		</view>
		<!-- banner-end -->
		<!-- icon-结束 -->
		<view class="index-icon-list">
			<view class="index-icon-list-item" @tap="toCategory($event, 'navigateTo', '../welfare-agency/welfare-agency')">
				<image src="../../static/index/welfare_room.png" mode=""></image>
				<text>福利社</text>
			</view>
			<view class="index-icon-list-item" @tap="toCategory($event, 'switchTab', '/pages/auction/auction')">
				<image src="../../static/index/new_field.png" mode=""></image>
				<text>新手场</text>
			</view>
			<view class="index-icon-list-item" @tap="toCategory($event, 'navigateTo', '../lucky-draw/lucky-draw')">
				<image src="../../static/index/lucky_draw.png" mode=""></image>
				<text>幸运抽奖</text>
			</view>
			<view class="index-icon-list-item" @tap="toCategory($event, 'navigateTo', '../my-backpack/my-backpack')">
				<image src="../../static/index/my_backpack.png" mode=""></image>
				<text>我的背包</text>
			</view>
			<view class="index-icon-list-item" @tap="toCategory($event, 'navigateTo', '../honor-achievement/honor-achievement')">
				<image src="../../static/index/achievement.png" mode=""></image>
				<text>荣誉成就</text>
			</view>
		</view>
		<!-- icon-结束 -->
		<view class="interspace"></view>
		<!-- 推荐活动 -->
		<view class="passlove-project">
			<view class="passlove-project-title">
				<image src="../../static/index/recommend_icon.png" mode=""></image>
				<text>推荐活动</text>
			</view>
			<scroll-view class="slider" scroll-x="true">
				<view class="slider-items" v-for="(task, index) in tasks" :key="index">
					<view class="content" v-if="task.activityState == 2" @tap="skipDetails(task.activityState, task.activityId)">
						<text class="identifying">进行中</text>
						<image :src="task.goodsThumbnail" lazy-load class="img"></image>
						<text class="desc">{{ task.goodsName }}</text>
						<view class="content-price">
							<text class="content-price-market uni-ellipsis">市场价:¥{{ task.marketPrice }}</text>
							<view class="content-price-bid uni-ellipsis">
								<view class="bid-img"><image src="../../static/index/auctioning.png" mode=""></image></view>
								<text class="bid-price">¥ {{ task.currentPrice }}</text>
							</view>
						</view>
					</view>
					<!-- 即将开始 -->
					<view class="content" v-else @tap="skipDetails(task.activityState, task.id)">
						<text class="identify">即将开始</text>
						<image :src="task.goodsThumbnail" lazy-load class="img"></image>
						<text class="desc">{{ task.goodsName }}</text>
						<view class="content-price">
							<text class="content-price-market">市场价:¥{{ task.marketPrice }}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 通知 -->
		<view class="inform"><image src="../../static/index/inform.jpg" mode=""></image></view>
		<!-- 好运榜、最近成交 -->
		<view class="luck-recently">
			<view :class="{ tabview: true, act: curructindex == 1 }" @tap="handletab(1)"><text>好运榜单</text></view>
			<view :class="{ tabviewRecently: true, act1: curructindex == 2 }" @tap="handletab(2)"><text>最近拍中</text></view>
		</view>
		<view class="tabdiv" v-show="curructindex == 1"><luck-list :activityList="luckList"></luck-list></view>
		<view class="tabdiv" v-show="curructindex == 2"><recently-auction :recentlyAuction="recentlyAuction"></recently-auction></view>

		<!-- 福豆信息 -->
		<view class="index-melon-info"><melon-info></melon-info></view>

		<!-- 新人礼包弹窗 -->
		<view class="new-package-dialog" v-if="packageFlag" @touchmove.stop.prevent><new-package></new-package></view>

		<!-- 新人福豆领取成功 -->
		<view class="success-collect-dialog" v-if="successFlag" @touchmove.stop.prevent><success-collection></success-collection></view>
		<view><uni-load-more :status="status" :content-text="contentText" /></view>
	</view>
</template>
<script>
import banner from '@/components/banner/banner.vue';
import melonInfo from '@/components/melon-info/melon-info.vue';
import luckList from '@/components/luck-list/luck-list.vue';
import recentlyAuction from '@/components/recently-auction/recently-auction.vue';
import newPackage from '@/components/new-package/new-package.vue';
import successCollection from '@/components/success-collection/success-collection.vue';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
export default {
	components: {
		banner,
		melonInfo,
		luckList,
		recentlyAuction,
		newPackage,
		successCollection,
		uniLoadMore
	},
	data() {
		return {
			luckList: [], //获取好运榜列表
			recentlyAuction: [], //获取最近成交列表
			title: 'nav-dot',
			curructindex: '1',
			carouselList: [],
			ificList: [
				{
					id: 1,
					name: '福利社',
					img: '/static/index/welfare_room.png'
				},
				{
					id: 2,
					name: '新手场',
					img: '/static/index/lucky_draw.png'
				},
				{
					id: 3,
					name: '幸运抽奖',
					img: '/static/index/lucky_draw.png'
				},
				{
					id: 4,
					name: '我的背包',
					img: '/static/index/my_backpack.png'
				},
				{
					id: 5,
					name: '荣誉成就',
					img: '/static/index/achievement.png'
				}
			],
			tasks: [] /* 推荐活动 */,
			contentText: {
				contentdown: '上拉加载更多',
				contentrefresh: '加载中',
				contentnomore: '没有更多'
			},
			reload: false,
			status: 'more'
		};
	},
	computed: {
		packageFlag() {
			return this.$store.state.packageFlag;
		},
		successFlag() {
			return this.$store.state.collectionFlag;
		}
	},
	onLoad(option) {
		const _this = this;
		// 新人红包显示，缓存状态newUserPackageStatus:newUserStatus;
		let newUserPackageStatus = _this.$storage.getStorage('newUserPackageStatus', 2);
		if ('newUserStatus' != newUserPackageStatus) {
			_this.$store.commit('changePackageFlag', true);
			_this.$storage.setStorage('newUserPackageStatus', 'newUserStatus', 2);
		}
		// 新人注册成功后领取福豆并完善资料
		// this.$store.commit('changeCollectionFlag', true);
		if (_this.packageFlag == true || _this.successFlag == true) {
			uni.hideTabBar();
		} else {
			uni.showTabBar();
		}
		let data = {
			aiType: '1'
		};
		_this.getBanner(data);
		_this.getRecommend(data);
		setInterval(() => {
			_this.getRecommend(data);
		}, 5000);

		//_this.$storage.setStorage("token","1111")
	},

	onReady() {
		this.$store.dispatch('beanAuction');
		let recentDeal = {
			token: this.$storage.getStorage('token', 2),
			activity_type: 0,
			start: 1,
			len: 10
		};
		this.getRecentDeal(recentDeal);
		this.setStyle(1, true, '9');
		this.getGoodLuckList();
		//this.$storage.clearStorage(2);
		// 获取客服电话,传值0
		let data = {
			informationType: 0
		}
		this.getCustomerPhone(data);
	},
	onPullDownRefresh() {
		this.reload = true;
		let recentDeal = {
			token: this.$storage.getStorage('token', 2),
			activity_type: 0,
			start: 1,
			len: 10
		};
		this.getRecentDeal(recentDeal);
	},
	onReachBottom() {
		this.status = 'more';
		let recentDeal = {
			token: this.$storage.getStorage('token', 2),
			activity_type: 0,
			start: 1,
			len: 10
		};
		this.getRecentDeal(recentDeal);
	},
	onShow() {
		uni.pageScrollTo({
			scrollTop: 0,
			duration: 300
		});
	},
	methods: {
		/* 
		* 获取客服电话并缓存 
		* */
		getCustomerPhone(data){
			let _this = this;
			this.$api.getInformation(data)
				.then(res => {
					res = res.data;
					if(res.code == '0001') {
						res = res.data;
						let customerPhone = res.information;
						// 测试过程中现将客服电话写死18812345678
						_this.$storage.setStorage('customerPhone','18812345678',2);
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
				})
		},
		/*
		 * 获得首页banner图
		 */
		getBanner(data) {
			let _this = this;
			// #ifdef APP-PLUS
			let bannerImg = _this.$storage.getStorage('bannerImg');
			let netImgUrl = _this.$storage.getStorage('netImgUrl');
			_this.carouselList = bannerImg;
			// #endif

			this.$api
				.banner(data)
				.then(res => {
					res = res.data;
					if (res.code == '0001') {
						let imgList = res.data.imgList;
						// #ifdef APP-PLUS
						_this.$storage.setStorage('netImgUrl', imgList);
						if (!_this.$util.contrastArray(imgList, netImgUrl)) {
							// #endif
							_this.carouselList = imgList;
							// #ifdef APP-PLUS
							_this.$storage.setStorageImg('bannerImg', 'imgUrl', imgList);
						}
						// #endif
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
		/* 获得最近成交数据 */
		getRecentDeal(data) {
			let that = this;
			this.status = 'loading';
			/* 获得缓存 */
			let recentList = that.$storage.getStorage('activityList');
			this.recentlyAuction = recentList;
			this.$api
				.getRecentDealList(data)
				.then(res => {
					uni.stopPullDownRefresh();
					that.reload = false;
					that.status = 'noMore';
					res = res.data;

					if (res.code == '0001') {
						let realData = res.data;
						//this.status = 'loading';
						// 对比缓存跟请求数据是否相同、如果不相等则重新缓存
						if (!that.$util.contrastArray(realData.activityList, recentList)) {
							that.recentlyAuction = realData.activityList;
							that.$storage.setStorage('activityList', realData.activityList);
						}
					} else {
						uni.showToast({
							title: res.message
						});
					}
				})
				.catch(err => {
					that.status = 'noMore';
					uni.showToast({
						title: '服务异常'
					});
				});
		},
		//获取好运榜列表
		getGoodLuckList() {
			let that = this;
			let goodluckList = that.$storage.getStorage('goodluckList');
			that.luckList = goodluckList;
			this.$api
				.getGoodLuckList()
				.then(res => {
					res = res.data;
					if (res.code == '0001') {
						let luckList = res.data;
						if (!that.$util.contrastArray(luckList.activityList, goodluckList)) {
							that.luckList = luckList.activityList;
							that.$storage.setStorage('goodluckList', luckList.activityList);
						}
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
				})
				.catch(err => {
					that.status = 'noMore';
					uni.showToast({
						title: '服务异常'
					});
				});
		},
		/* 获得推荐活动列表 */
		getRecommend() {
			let _this = this;
			let recommendList = _this.$storage.getStorage('recommendList');
			_this.tasks = recommendList;
			_this.$api
				.getRecommendList()
				.then(res => {
					res = res.data;
					if (res.code == '0001') {
						let recommendData = res.data;
						if (!_this.$util.contrastArray(recommendData.activityList, recommendList)) {
							_this.tasks = recommendData.activityList;
							_this.$storage.setStorage('recommendList', recommendData.activityList);
						}
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
				})
				.catch(err => {
					uni.showToast({
						title: '服务异常'
					});
				});
		},
		/* 跳转分类 */
		toCategory(e, type, url) {
			if( '../my-backpack/my-backpack' == url || '../honor-achievement/honor-achievement' == url ) {
				// 判断是否是登录状态
				let token  = this.$storage.isAuthed();
				if(!token) {
					return;
				}
			}
			if (type == 'switchTab') {
				uni.switchTab({
					url: url,
					success(e) {
						uni.setStorage({
							key: 'noviceField',
							data: 1
						});
						var pages = getCurrentPages();
						var page = pages[pages.length - 1];
						var currentWebview = page.$getAppWebview();
						currentWebview.reload();
					}
				});
			} else if (type == 'navigateTo') {
				uni.navigateTo({
					url: url
				});
			}
		},
		/* 跳转商品详情 */
		skipDetails(type, id) {
			if (type == 2) {
				uni.navigateTo({
					url: '../auction-detailsing/auction-detailsing',
					animationType: 'slide-in-right',
					animationDuration: 300
				});
			} else if (type == 1) {
				uni.navigateTo({
					url: '../auction-details/auction-details',
					animationType: 'slide-in-right',
					animationDuration: 300
				});
			}
		},
		/**
		 * 修改导航栏buttons
		 * index[number] 修改的buttons 下标索引，最右边索引为0
		 * show[boolean] 显示还是隐藏角标或者红点
		 * text[string] 需要修改的角标的text 内容 ，如果定义redDot 此参数无效 ，如果定义badgeText请设置具体，如果不用输入
		 */
		setStyle(index, show, text) {
			let pages = getCurrentPages();
			let page = pages[pages.length - 1];
			// #ifdef APP-PLUS
			let currentWebview = page.$getAppWebview();
			if (show) {
				if (index === 0) {
					currentWebview.showTitleNViewButtonRedDot({
						index: index,
						text: text
					});
				} else {
					currentWebview.setTitleNViewButtonBadge({
						index: index,
						text: text
					});
				}
			} else {
				if (index === 0) {
					currentWebview.hideTitleNViewButtonRedDot({
						index: index
					});
				} else {
					currentWebview.removeTitleNViewButtonBadge({
						index: index
					});
				}
			}

			// #endif
		},
		handletab(val) {
			this.curructindex = val;
		}
	},
	onNavigationBarButtonTap(e) {
		// 判断是否是登录状态
		let token  = this.$storage.isAuthed();
		if(token) {
			if (e.index === 0) {
				uni.navigateTo({
					url: '../sign-in/sign-in',
					animationType: 'fade-in'
				});
			} else {
				uni.navigateTo({
					url: '../site-inform/site-inform'
				});
			}
			this.setStyle(e.index, false);
		}
	}
};
</script>
<style lang="scss" scoped>
.pure_top {
	width: 100%;
	min-height: 220upx;
	height: calc(220upx + var(--status-bar-height));
	z-index: -1;
	overflow: hidden;

	&:after {
		content: '';
		width: 100%;
		min-height: 220upx;
		height: calc(220upx + var(--status-bar-height));
		position: absolute;
		top: 0;
		right: 0;
		z-index: -1;
		border-radius: 0 0 30% 30%;
		background: -webkit-linear-gradient(left, #ffc400, #ff9b1d);
		/*background: rgba(255, 155, 29, 1);*/
	}
}

/* icon */
.index-icon-list {
	padding: 16upx 26upx 16upx 26upx;
	min-height: 100upx;
	display: flex;

	&-item {
		display: flex;
		width: 20%;
		justify-content: center;
		align-items: center;
		flex-flow: column;

		image {
			width: 88upx;
			height: 88upx;
		}

		text {
			margin-top: 20upx;
		}
	}
}

.interspace {
	height: 18upx;
	background: #f2f4f5;
}

.passlove-project {
	margin-top: 24upx;

	&-title {
		display: flex;
		justify-content: center;
		align-items: center;

		image {
			height: 42upx;
			width: 42upx;
		}

		text {
			margin-left: 5upx;
			color: #333333;
			font-size: 32upx;
		}
	}

	.slider {
		display: flex;
		white-space: nowrap;
		width: 100%;
		min-height: 260upx;
		&-items {
			display: inline-block;
			width: 40%;
			margin-left: 26upx;
			margin-bottom: 20upx;
			padding: 0 10upx;
		}
	}
}

.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin-top: 24upx;
	padding: 0 16upx;
	flex: 1;
	background: rgba(248, 248, 248, 1);
	box-shadow: 0px 1px 1px 0px rgba(248, 248, 248, 1);

	.identifying {
		margin-left: -16upx;
		align-self: flex-start;
		color: #fff;
		min-height: 32upx;
		line-height: 32upx;
		position: relative;
		padding-right: 15px;
		background: linear-gradient(to right, #fa503d, #fd8b59);
		// border-radius: 0 1px 1px 0;
		font-size: 16upx;
		padding: 0 20upx 0 10upx;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);

		&:after {
			width: 0;
			height: 0;
			content: '';
			left: auto;
			right: 0;
			top: 0;
			position: absolute;
			display: block;
			border-top: 16upx solid transparent;
			border-bottom: 16upx solid transparent;
			border-right: 12upx solid rgba(248, 248, 248, 1);
		}
	}

	.identify {
		align-self: flex-start;
		color: #fff;
		min-height: 32upx;
		line-height: 32upx;
		position: relative;
		padding-right: 15px;
		background: #cccccc;
		// border-radius: 0 1px 1px 0;
		font-size: 16upx;
		padding: 0 20upx 0 10upx;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		margin-left: -16upx;

		&:after {
			width: 0;
			height: 0;
			content: '';
			left: auto;
			right: 0;
			top: 0;
			position: absolute;
			display: block;
			border-top: 16upx solid transparent;
			border-bottom: 16upx solid transparent;
			border-right: 12upx solid rgba(248, 248, 248, 1);
		}
	}

	text {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		max-width: 100%;
	}

	.img {
		margin-top: 20upx;
		width: 100%;
		max-height: 130upx;
		max-width: 130upx;
	}

	.desc {
		font-size: 28upx;
		font-family: PingFang-SC-Medium;
		font-weight: 500;
		color: #333333;
		margin-top: 16upx;
		max-width: 100%;
		width: 100%;
	}

	&-price {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 42upx;
		margin-bottom: 18upx;
		justify-content: space-between;
		align-items: center;

		&-market {
			display: flex;
			align-items: flex-start;
			font-size: 20upx;
			max-width: 48%;
			color: #999999;
			text-decoration: line-through;
		}

		&-bid {
			display: flex;
			align-items: center;
			font-size: 16upx;
			padding-right: 10upx;
			height: inherit;
			color: #fff;
			max-width: 48%;
			background: linear-gradient(left, rgba(255, 163, 1, 1), rgba(255, 191, 61, 1));
			border-radius: 3upx;

			.bid-img {
				background: #ffffff;
				margin-left: 1upx;
				padding: 6upx 8upx;
				image {
					width: 24upx;
					height: 20upx;
					align-self: center;
				}
			}

			.bid-price {
				margin-left: 8upx;
				font-family: PingFang-SC-Medium;
				font-weight: 700;
				font-size: 20upx;
			}
		}
	}
}

.inform {
	padding: 0 16upx;

	image {
		height: 140upx;
		width: 100%;
		max-width: 100%;
	}
}

.luck-recently {
	position: relative;
	width: 100%;
	height: 104upx;
	box-sizing: border-box;
	color: #fff;
	font-size: 32px;
	font-family: PingFangSC-Medium;
	font-weight: 500;
	padding: 0 16upx;
}

.tabview {
	width: 46%;
	height: 104upx;
	line-height: 104upx;
	display: flex;
	position: absolute;
	top: 0upx;
	left: 14upx;
	justify-content: center;
	align-items: center;
	background: url('~@/static/index/luckbg.png');
	background-size: 100%;
	background-position: center center;
	background-repeat: no-repeat;
}

.act {
	width: 54%;
	height: 104upx;
	font-size: 32upx;
	background: url('~@/static/index/luckbg_active.png');
	background-size: 100%;
	background-position: center center;
	text-shadow: 2px 0px 8px rgba(239, 117, 5, 0.55);
}

.tabviewRecently {
	display: flex;
	width: 46%;
	height: 104upx;
	position: absolute;
	top: 0upx;
	right: 20upx;
	line-height: 104upx;
	background: url('~@/static/index/recentlybg.png');
	background-size: 100%;
	background-position: center center;
	background-repeat: no-repeat;
	justify-content: center;
	align-items: center;
}

.act1 {
	width: 54%;
	height: 104upx;
	font-size: 32upx;
	background: url('~@/static/index/recentlybg_active.png');
	background-size: 100%;
	background-position: center center;
	text-shadow: 2upx 0px 8upx rgba(239, 117, 5, 0.55);
}

// 		background: linear-gradient(135deg, transparent 50upx, #FF9502 0) top right;
// 	}

.tabdiv {
	width: 100%;
}

.index-melon-info {
	position: fixed;
	bottom: 120upx;
	right: 26upx;
	z-index: 99;
}

.newslist {
	padding: 10px;
	line-height: 60px;
	font-size: 28px;
}

.loading {
	text-align: center;
	line-height: 80px;
}

// .sign-modal-content {
// 	height: 100vh;
// 	position: absolute;
// 	top: 0;
// 	left: 0;
// 	right: 0;
// 	bottom: 0;
// 	z-index: 9999;
// }
//
</style>
