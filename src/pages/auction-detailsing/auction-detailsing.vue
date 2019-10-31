<template>
	<!-- 竞拍详情-正在进行 mazy -->
	<view class="auction-details " v-cloak>
		<goods-info
			:imgList="auctionData.goodsImgurl"
			:autoplay="true"
			:interval="5000"
			:duration="2000"
			:warning="true"
			:attention="true"
			:warningStatus="warningState"
			:goodsName="auctionData.goodsName"
			:attentionStatus="whetherAttention"
			:setAttention="setAttention"
			:activityId="auctionData.activityId"
		></goods-info>
		<!--成交信息-->
		<view class="clinch-deal" v-if="auctionData.goodsName">
			<view class="timer-bg">
				<image src="../../static/auction/timing.png" mode=""></image>
				<text class="clinch-deal-mark uni-ellipsis">{{ presentInfo.countDown }}</text>
			</view>
			<view class="current-info">
				<view class="current-info-portrait">
					<view class="animation" v-if="activeUser.userId"><image src="../../static/public/success_img.png" class="animation-img" mode=""></image></view>
					<image :src="activeUser.headPicUrl" mode=""></image>
				</view>
				<view class="bidders-goods-info">
					<view class="bidders-info">
						<view class="bidders-info-name">{{ activeUser.nickname }}</view>
						<view class="bidders-info-location">
							<image src="../../static/auction/location.png" mode=""></image>
							<text class="">{{ activeUser.city }}</text>
						</view>
						<view class="bidders-info-signature uni-ellipsis">{{ activeUser.titleName }}</view>
					</view>
					<view class="current-goodsinfo">
						<view class="current-price">
							￥
							<text class="current-price-num">{{ activeUser.price }}</text>
						</view>
						<view class="goods-price">
							<text class="goods-price-info">商品价格:</text>
							<text class="goods-price-num">¥{{ auctionData.marketPrice }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="direct-purchase" @tap="directPurchase(auctionData.activityId, 1)">直购¥{{ auctionData.marketPrice }}（返还{{ presentInfo.consumerGold }}个金豆）</view>
		</view>
		<view class="direct-purchase-info">
			<view class="postage-info">竞购邮费：{{ auctionData.freight }}元（直购免邮）</view>
			<view class="countdown" @tap="getLocation">
				<text class="countdown-address uni-ellipsis">送至：{{ auctionData.address }}</text>
				<image class="countdown-img" src="../../static/auction/location.png" mode=""></image>
			</view>
		</view>
		<view class="border-mark"></view>
		<view class="auction-tab-list"><auction-tab :tablist="tablist" :pastUser="forwardList" :recentlyUser="recentlyUserList"></auction-tab></view>
		<view class="fixed-button-area" @tap="manualBidding(auctionData.activityId, auctionData.eachIncrease)"><view class="fixed-button-txt">1点豆竞拍</view></view>
		<!-- 委托竞拍底部菜单 -->
		<view class="bottom-show">
			<additional-entrust
				:entrustFlag="entrustFlag"
				:eachIncrease="auctionData.eachIncrease"
				:activityId="auctionData.activityId"
				:entrustGold="entrustGold"
				:entrustSilver="entrustSilver"
				@entrustFlag="getEntrust"
				:consumeBean="consumeBean"
			></additional-entrust>
		</view>
		<view class="border-mark"></view>
		<!-- 评价 -->
		<view class="evaluate"><evaluate :evaluateListData="evaluateList" :evaluateCount="evaluateCount" :activityId= "activityId"></evaluate></view>
		<view class="border-mark"></view>
		<!-- 商品详情 -->
		<view><commodity-details :commodityDetails="goodsDetailsImgs"></commodity-details></view>
		<!-- 拍中去下单弹窗开始 -->
		<view>
			<neil-modal :show="beatOrderFlag">
				<view class="modal">
					<view class="modal-container modal-order-back">
						<view class="modal-title"><image src="../../static/auction/beat_order_title.png" mode=""></image></view>
						<view class="modal-content">
							<view class="order-fudou">
								<view class="order-fudou-num">
									消耗福豆
									<text>{{ consumeBean }}</text>
									（ {{ consumeBeanGold }}
									<image src="../../static/auction/silver_bean.png" mode=""></image>
									{{ consumeBeanSilver }}
									<image src="../../static/auction/golden_bean.png" mode=""></image>
									）
								</view>
								<view class="order-fudou-num">
									战胜
									<text>{{ activeUser.userCount }}</text>
									个竞拍者
								</view>
							</view>
							<view class="order-img"><image src="../../static/message_center/blank_show.png" mode=""></image></view>
							<view class="order-prize">
								<view class="order-prize-text uni-ellipsis">{{ auctionData.goodsName }}</view>
								<view class="order-prize-num">
									<text>￥{{ activeUser.price }}</text>
									<text>￥{{ auctionData.marketPrice }}</text>
								</view>
							</view>
						</view>
						<view class="modal-handle-btn" @tap="directPurchase(auctionData.activityId, 0)">去下单</view>
					</view>
				</view>
			</neil-modal>
		</view>
		<!-- 拍中去下单弹窗结束 -->
		<!-- 未拍中去直购弹窗开始 -->
		<view>
			<neil-modal :show="directPurFlag">
				<view class="modal">
					<view class="modal-container modal-direct-back">
						<view class="modal-title"><image src="../../static/auction/direct_pay_title.png" mode=""></image></view>
						<view class="modal-content">
							<view class="order-fudou">
								<view class="order-fudou-title">请问需要直购吗？</view>
								<view class="order-fudou-num">
									直购价格：
									<text>￥{{ auctionData.marketPrice }}</text>
								</view>
								<view class="order-fudou-num">
									直购将返还：
									<text>{{ consumeBeanSilver }}</text>
									<image src="../../static/auction/golden_bean.png" mode=""></image>
								</view>
							</view>
							<view class="order-img"><image src="../../static/message_center/blank_show.png" mode=""></image></view>
							<view class="order-prize">
								<view class="order-prize-text uni-ellipsis">{{ auctionData.goodsName }}</view>
							</view>
						</view>
						<view class="modal-handle-btn" @tap="directPurchase(auctionData.activityId, 0)">去直购</view>
					</view>
				</view>
			</neil-modal>
		</view>
		<!-- 未拍中去直购弹窗结束 -->
		<!-- 城市选择开始 -->
		<city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValue" @onCancel="onCancel" @onConfirm="onConfirm"></city-picker>
		<!-- 城市选择结束 -->
	</view>
</template>

<script>
import goodsInfo from '@/components/goods-info/goods-info';
import auctionTab from '@/components/auction-tab/auction-tab';
import additionalEntrust from '@/components/additional-entrust/additional-entrust';
import commodityDetails from '@/components/commodity-details/commodity-details';
import evaluate from '@/components/evaluate/evaluate';
import neilModal from '@/components/neil-modal/neil-modal.vue';
import cityPicker from '@/components/city-picker/city-picker.vue';

export default {
	components: {
		goodsInfo,
		auctionTab,
		additionalEntrust,
		commodityDetails,
		evaluate,
		neilModal,
		cityPicker
	},
	data() {
		return {
			beatOrderFlag: false, //拍中订单去下单弹窗开关变量
			directPurFlag: false, //未拍中去直购弹窗开关变量
			themeColor: '#FE9402', //收获地址按钮主题色
			cityPickerValue: [0, 0, 1],
			region: {
				label: '', ////收货地址值
				value: []
			},
			warningState: 1,
			whetherAttention: 0,
			entrustFlag: 0,
			evaluateList: [], //评价列表数据
			evaluateCount: 1, //评论数量
			goodsDetailsImgs: [
				'https://img30.360buyimg.com/sku/jfs/t1/17359/1/14127/165787/5ca5cd7eEe53ccde3/cbcf7533f1b39681.jpg',
				'https://img30.360buyimg.com/sku/jfs/t1/17412/7/14212/155753/5ca5cd7eE7fd0561d/10cdc63cc6308a90.jpg'
			], //商品详情
			tablist: [
				{
					label: '最近10个竞购者'
				},
				{
					label: '竞拍规则'
				},
				{
					label: '往期成交'
				}
			],
			forwardList: [
				{
					successfulTradePrice: 3000,
					returnBeans: 30,
					successfulTradeTime: '2019-03-26',
					nickname: '晨晨',
					levelDataName: '1',
					headPicUrl: 'https://img.alicdn.com/tps/i4/TB1vh6GSwDqK1RjSZSySuuxEVXa.jpg_620x10000q100.jpg',
					frameUrl: ''
				}
			],
			/* 最近十个竞购人 */
			bidderList: [
				{
					levelDataName: 2,
					nickname: '你打野',
					headPicUrl: 'https://img.alicdn.com/tps/i4/TB1vh6GSwDqK1RjSZSySuuxEVXa.jpg_620x10000q100.jpg',
					frameUrl: '',
					pidTime: '',
					price: 300,
					city: '上海'
				}
			],
			entrust_bidding: 1,
			/*商品信息 */
			auctionData: {
				goodsName: '摩飞 (MR9088)多功能锅料理锅 富士白久多功能锅料理锅',
				imgList: [
					{
						imgUrl: 'https://img10.360buyimg.com/mobilecms/s500x500_jfs/t1/74559/24/1619/135338/5cff56fdE05c7f960/9815deff8c455a6d.jpg'
					}
				],
				marketPrice: 0
			},
			/* 当前竞拍信息 */
			presentInfo: {
				entrustGold: 0,
				entrustSilver: 0,
				consumerSilver: 0,
				consumerGold: 0
			},
			/* 最近10个竞购者 */
			userList: [],
			/* 当前用户 */
			activeUser: {},
			activityId: '0',
			/* 委托银豆余量 */
			entrustSilver: 0,
			/* 委托金豆余量 */
			entrustGold: 0,
			consumerSilver: 0,
			consumerGold: 0
		};
	},
	onLoad(option) {
		this.activityId = option.activityId;
		let activityData = {
			activityId: option.activityId,
			token: this.$storage.getStorage('token', 2)
		};
		this.activityDetails(activityData);

		let data = {
			token: this.$storage.getStorage('token', 2),
			start: '1',
			activityId: option.activityId,
			len: '1'
		};
		this.loadEvaluateData(data);

		this.goodsDetailsImg(activityData);
		let biddingInfo = {
			activityId: option.activityId,
			token: this.$storage.getStorage('token', 2),
			currentPrice: 1
		};
		this.presentBiddingInfo(biddingInfo);
		let forwardData = {
			start: '1',
			activityId: option.activityId,
			len: '10'
		};
		this.forwardLists(forwardData);
	},
	onReady() {
		let biddingInfo = {
			activityId: this.activityId,
			token: this.$storage.getStorage('token', 2),
			currentPrice: 1
		};

		setInterval(() => {
			this.presentBiddingInfo(biddingInfo);
		}, 1000);
	},
	computed: {
		/* 消耗总豆 */
		consumeBean() {
			return parseInt(this.consumerGold) + parseInt(this.consumerSilver);
		},
		consumeBeanGold() {
			return this.consumerGold;
		},
		consumeBeanSilver() {
			return this.consumerSilver;
		},
		/* 计算最近10个竞购人 */
		recentlyUserList() {
			let arr = this.userList;
			arr = this.$util.uniqueArray(arr, 'price');
			if (arr.length < 10) {
				return arr;
			} else {
				arr = arr.slice(0, 10);
				return arr;
			}
		},
	
	},
	methods: {
		/* 获取评价数据 */
		loadEvaluateData(data) {
			let _this = this;
			let getEvaluateList = _this.$storage.getStorage('evaluateList');
			_this.evaluateList = getEvaluateList;
			this.$api
				.getEvaluateList(data)
				.then(res => {
					res = res.data;
					if (res.code == '0001') {
						let evaluateList = res.data;
						let evaluateCount = evaluateList.evaluateCount;
						_this.evaluateCount = evaluateCount;
						if (!_this.$util.contrastArray(evaluateList.evaluateList, getEvaluateList)) {
							_this.evaluateList = evaluateList.evaluateList;
							_this.$storage.setStorage('getEvaluateList', evaluateList.evaluateList);
						}
					}
				})
				.catch(err => {
					uni.showToast({
						title: '服务异常'
					});
				});
		},
		/* 获得商品详情 */
		activityDetails(data) {
			let _this = this;
			this.$api
				.getActivityDetails(data)
				.then(res => {
					res = res.data;
					if (res.code == '0001') {
						_this.auctionData = res.data;
						_this.warningState = res.data.warningState;
						_this.whetherAttention = res.data.whetherAttention;
					} else {
						uni.showToast({
							title: res.message
						});
					}
				})
				.catch(err => {});
		},
		/* 获得商品详情 */
		goodsDetailsImg(data) {
			this.$api
				.getGoodsDetailsImg(data)
				.then(res => {
					res = res.data;
					if (res.code == '0001') {
						this.goodsDetailsImgs = res.data.detailsList;
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
		/* 获得当前竞拍信息 */
		presentBiddingInfo(data) {
			this.$api
				.getBiddingInfo(data)
				.then(res => {
					res = res.data;
					if (res.code == '0001') {
						let biddingInfo = res.data;
						let userList = biddingInfo.userList;
						this.presentInfo = res.data;
						// winner为拍中用户
						if (biddingInfo.winner) {
							this.activeUser = biddingInfo.winner;
							let loginUserId = this.$storage.getStorage('userId', 2);
							let acUserId = biddingInfo.winner.userId;
							if (acUserId == loginUserId) {
								this.beatOrderFlag = true;
							} else {
								this.directPurFlag = true;
							}
						} else {
							this.activeUser = userList[0];
						}
						this.userList = [...userList, ...this.userList];
						this.warningState = biddingInfo.warningState;
						this.entrustSilver = biddingInfo.entrustSilver;
						this.entrustGold = biddingInfo.entrustGold;
						this.consumerGold = biddingInfo.consumerGold;
						this.consumerSilver = biddingInfo.consumerSilver;
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
		/* 往期成交 */
		forwardLists(data) {
			this.$api
				.getForwardList(data)
				.then(res => {
					res = res.data;
					if (res.code == '0001') {
						this.forwardList = res.data.forwardList;
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
		/* 手动竞拍 */
		manualBidding(activityId, eachIncrease) {
			let biddData = {
				token: this.$storage.isAuthed(),
				activityId: activityId,
				eachIncrease: eachIncrease,
				type: 0
			};
			this.$api
				.auctionProcess(biddData)
				.then(res => {
					res = res.data;
					if (res.code == '0001') {
						this.$store.dispatch('beanAuction');
						uni.showToast({
							title: '竞拍成功'
						});
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

		/* 直购 */
		directPurchase(activityId, orderType) {
			let token = this.$storage.isAuthed();
			uni.navigateTo({
				url: '../confirm-order/confirm-order?activityId=' + activityId + '&token=' + token + '&orderType=' + orderType
			});
		},
		/* 获取底部菜单组件传递值 */
		getEntrust(msg) {
			this.entrustFlag = msg;
		},
		/* 获取当前地址 */
		getLocation() {
			this.$refs.mpvueCityPicker.show();
		},
		/* 点击收货地址弹窗确认按钮 */
		onConfirm(e) {
			this.region = e;
			this.cityPickerValue = e.value;
			this.auctionData.address = this.region.label;
			// console.log("cityPickerValue="+this.cityPickerValue)
		},
		/* 点击收货地址弹窗取消按钮 */
		onCancel(e) {
			// console.log(e);
		},
		/* 收藏点击 */
		collection() {
			let data = {
				token: this.$storage.isAuthed(),
				activityId: this.auctionData.activityId
			};
			this.$api.setFocusState(data)
				.then(res => {
					res = res.data;
					if (res.code == '0001') {
						// #ifdef APP-PLUS  
						let currentWebview = this.$mp.page.$getAppWebview();
						// #endif  
						if(currentWebview){
							if(res.data.whetherAttention==1){
								currentWebview.setTitleNViewButtonStyle(0, {
									"text": "\ue61b"
								});
							}else{
								currentWebview.setTitleNViewButtonStyle(0, {
									"text": "\ue666"
								});
							};
						};
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
		}
	},
	onNavigationBarButtonTap(option) { //原生按钮点击
		if( option.index == 0 ){
			this.collection();
		};
	}
};
</script>

<style lang="scss">
page {
	min-height: 100%;
	background: #ffffff;
}

.auction-details {
	padding-bottom: 218upx;
}

.clinch-deal {
	display: flex;
	flex-direction: column;
	height: 332upx;
	background: rgba(255, 255, 255, 1);
	border: 2upx solid rgba(253, 165, 41, 1);
	border-radius: 10upx;
	margin: 56upx 24upx 0 24upx;

	.timer-bg {
		margin-top: -14upx;
		display: flex;
		justify-content: center;
		align-items: center;
		align-self: center;
		background: url('~@/static/auction/timerbg.png') no-repeat;
		background-size: 100% 100%;
		width: 420upx;
		height: 72upx;
		padding-bottom: 4upx;

		image {
			width: 46upx;
			height: 54upx;
		}
	}

	&-mark {
		font-size: 40upx;
		font-family: PingFangSC-Medium;
		font-weight: 500;
		color: #ffffff;
		text-shadow: 5upx 0 5upx rgba(171, 170, 170, 0.32);
		margin-left: 18upx;
	}

	.direct-purchase {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 40upx 90upx 20upx 90upx;
		height: 70upx;
		background: linear-gradient(90deg, rgba(246, 70, 53, 1), rgba(255, 122, 36, 1));
		opacity: 0.85;
		border-radius: 11upx;
		font-size: 28upx;
		font-family: PingFangSC-Regular;
		font-weight: 400;
		color: rgba(255, 255, 255, 1);
	}
}
/* 当前竞拍信息 */
.current-info {
	display: flex;
	margin: 30upx 24upx 0 24upx;
	justify-content: space-between;

	&-portrait {
		position: relative;
		image {
			width: 100upx;
			height: 100upx;
			border-radius: 100%;
		}
	}

	.animation {
		top: -50upx;
		left: -36upx;
		position: absolute;
		z-index: 2;
	}
	.animation {
		animation-name: animation;
		animation: animation 3s cubic-bezier(0.66, 0.01, 1, 1) forwards;
		-webkit-animation: animation 3s alternate;
		-moz-animation: animation 3s alternate infinite;
	}
	.animation:after {
		animation-name: animation;
		animation: animation 3s cubic-bezier(0, 0, 0.36, 1) forwards;
		-webkit-animation: animation 3s alternate;
		-moz-animation: animation 3s alternate infinite;
	}
	.animation-img {
		width: 100upx;
		height: 80upx;
	}
	@-webkit-keyframes animation {
		0% {
			top: 500upx;
			left: 600upx;
		}

		100% {
			top: -50upx;
			left: -50%;
			margin-right: 200upx;
		}
	}
}

.bidders-goods-info {
	display: flex;
	justify-content: space-between;
	flex: 1;
}

.bidders-info {
	display: flex;
	flex-direction: column;
	margin-left: 20upx;
	max-width: 260upx;

	&-name {
		font-size: 32upx;
		font-family: PingFang-SC-Bold;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
	}

	&-location {
		font-size: 24upx;
		font-family: PingFang-SC-Medium;
		font-weight: 500;
		color: rgba(102, 102, 102, 1);
		margin: 16upx 0;
	}

	image {
		display: inline-block;
		width: 20upx;
		height: 24upx;
		margin-right: 12upx;
	}

	&-signature {
		font-size: 24upx;
		font-family: PingFangSC-Regular;
		font-weight: 400;
		color: rgba(250, 80, 61, 1);
	}
}

.current-goodsinfo {
	display: flex;
	flex-direction: column;
	margin-left: 20upx;
	max-width: 260upx;
	align-items: center;
	justify-content: flex-end;

	.current-price {
		font-size: 35upx;
		font-family: Humanist777BT-BlackB;
		color: rgba(250, 80, 61, 1);

		&-num {
			font-weight: bold;
			font-size: 50upx;
		}
	}

	.goods-price {
		margin: 10upx 0;

		&-info {
			color: #666666;
			font-size: 24upx;
			line-height: 24upx;
			font-family: PingFangSC-Regular;
			font-weight: 400;
		}

		&-num {
			font-size: 24upx;
			font-family: PingFangSC-Regular;
			font-weight: 400;
			text-decoration: line-through;
			color: #aaaaaa;
			margin-left: 20upx;
		}
	}
}

.direct-purchase-info {
	display: flex;
	margin: 30upx 24upx;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	font-size: 24upx;
	font-family: PingFangSC-Light;
	font-weight: bold;
	color: rgba(102, 102, 102, 1);

	image {
		width: 32upx;
		height: 32upx;
		margin-right: 12upx;
	}

	.postage-info {
		font-size: 24upx;
		color: rgba(102, 102, 102, 1);
		line-height: 24upx;
		font-family: PingFang-SC-Regular;
		font-weight: 500;
	}

	.countdown {
		font-size: 24upx;
		line-height: 24upx;
		font-family: PingFangSC-Regular;
		font-weight: 500;
		color: rgba(102, 102, 102, 1);
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-content: center;

		text {
			flex-wrap: nowrap;
			padding-top: 8upx;
		}
	}

	.countdown-img {
		display: flex;
		width: 30upx;
		height: 30upx;
		margin-left: 10upx;
		align-self: center;
		align-items: center;
	}

	.countdown-address {
		font-size: 24upx;
		line-height: 24upx;
		font-family: PingFangSC-Regular;
		font-weight: 500;
		color: rgba(102, 102, 102, 1);
	}
}

.border-mark {
	width: 100%;
	height: 18upx;
	background: rgba(242, 244, 245, 1);
}

.bottom-show {
	width: 100%;
	height: auto;
	background-color: #fff;
}

.fixed-button-area {
	width: 156upx;
	height: 156upx;
	background: url('~@/static/auction/bidding_beans.png') no-repeat;
	background-size: 100% 100%;
	position: fixed;
	bottom: 306upx;
	right: 20upx;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-content: center;
	z-index: 999;

	.fixed-button-txt {
		width: 76upx;
		height: auto;
		line-height: 42upx;
		font-size: 28upx;
		font-family: PingFang-SC-Medium;
		font-weight: 500;
		color: #fff;
		text-align: center;
		align-self: center;
	}
}

/* 拍中去下单弹窗样式开始 */
.modal {
	position: relative;
	width: 750upx;
	height: 956upx;

	&-container {
		height: 856upx;
	}

	&-order-back {
		background: url('~@/static/auction/go_order_back.png') no-repeat;
		background-size: cover;
	}

	&-direct-back {
		background: url('~@/static/auction/direct_back.png') no-repeat;
		background-size: cover;
	}

	&-title {
		position: absolute;
		top: 234upx;
		left: 218upx;
		width: 338upx;
		height: 98upx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	&-content {
		position: absolute;
		top: 340upx;
		left: 140upx;
		width: 460upx;
		height: 410upx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		view {
			text-align: center;
		}
	}
}

.order-fudou {
	font-size: 28upx;
	font-family: PingFang-SC-Medium;
	color: rgba(51, 51, 51, 1);

	&-title {
		margin-bottom: 10upx;
		height: 28upx;
		font-size: 28upx;
		font-family: PingFang-SC-Bold;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
	}

	&-num {
		padding: 10upx 0;
		font-size: 24upx;
		font-family: PingFang-SC-Medium;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);

		text {
			font-size: 40upx;
			color: #ffa009;
			font-weight: bold;
			padding: 0 10upx;
		}

		image {
			width: 24upx;
			height: 24upx;
			margin: 0 10upx;
		}
	}
}

.order-img {
	width: 100%;

	image {
		width: 140upx;
		height: 140upx;
		margin: 0 auto;
	}
}

.order-prize {
	padding-bottom: 20upx;

	&-text {
		margin-bottom: 10upx;
		font-size: 24upx;
		font-family: PingFang-SC-Medium;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
	}

	&-num {
		text:nth-child(1) {
			font-size: 40upx;
			font-family: PingFang-SC-Medium;
			font-weight: 500;
			color: rgba(255, 160, 9, 1);
			margin-right: 10upx;
		}

		text:nth-child(2) {
			font-size: 24upx;
			font-family: PingFang-SC-Medium;
			font-weight: 500;
			color: rgba(204, 76, 55, 1);
			text-decoration: line-through;
		}
	}
}

.modal-handle-btn {
	position: absolute;
	bottom: 10upx;
	left: 228upx;
	width: 308upx;
	height: 108upx;
	text-align: center;
	line-height: 108upx;
	font-size: 32upx;
	font-family: PingFang-SC-Heavy;
	font-weight: 800;
	color: rgba(255, 255, 255, 1);
	background: url('~@/static/lucky_draw/lucky_ok.png') no-repeat;
	background-size: contain;
	border-radius: 40upx;
}

/* 拍中去下单弹窗样式结束 */
</style>
