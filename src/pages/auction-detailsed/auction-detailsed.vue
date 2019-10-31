<template>
	<!-- 已结束竞拍详情
	* mazy
	* -->
	<view class="auction-details">
		<goods-info
			:imgList="imgList"
			:autoplay="true"
			:interval="5000"
			:duration="2000"
			:warning="false"
			:attention="true"
			:warningStatus="-1"
			:goodsName="goodsName"
			:attentionStatus="0"
		></goods-info>
		<!--成交信息-->
		<view class="clinch-deal">
			<view class="timer-bg">
				<image src="../../static/auction/timing.png" mode=""></image>
				<text class="clinch-deal-mark uni-ellipsis">竞拍已成交</text>
			</view>
			<view class="current-info">
				<view class="current-info-portrait"><image src="../../static/auction/portrait.png" mode=""></image></view>
				<view class="bidders-goods-info">
					<view class="bidders-info">
						<view class="bidders-info-name">{{ auctionData.nickname }}</view>
						<view class="bidders-info-location">
							<image src="../../static/auction/location.png" mode=""></image>
							<text class="">{{ auctionData.city }}</text>
						</view>
						<view class="bidders-info-signature uni-ellipsis">{{ auctionData.titleName }}</view>
					</view>
					<view class="current-goodsinfo">
						<view class="current-price">
							￥
							<text class="current-price-num">3.90</text>
						</view>
						<view class="goods-price">
							<text class="goods-price-info">商品价格:</text>
							<text class="goods-price-num">¥{{ auctionData.marketPrice }}</text>
						</view>
						<view class="make-price-date uni-ellipsis">{{ auctionData.createTime }}</view>
					</view>
				</view>
			</view>
			<view class="direct-purchase" :data-activityId="1234" @tap="directPurchase($event,1)" v-if="auctionData.marketPrice">
				直购¥{{ auctionData.marketPrice }}（返还{{ auctionData.returnBeans }}个金豆）
			</view>
		</view>
		<view class="direct-purchase-info">
			<view class="postage-info">
				<image src="../../static/auction/exemption.png" mode=""></image>
				直购全宇宙包邮
			</view>
			<view class="countdown">
				直购倒计时：
				<text class="countdown-time">2天</text>
			</view>
		</view>
		<view class="border-mark"></view>
		<view class="auction-tab-list"><auction-tab :tablist="tablist" :pastUser="forwardList" :recentlyUser="bidderList"></auction-tab></view>
		<view class="border-mark"></view>
		<!-- 评价 -->
		<view class="evaluate"><evaluate :evaluateListData="evaluateList" :evaluateCount="evaluateCount"></evaluate></view>
		<view class="border-mark"></view>
		<!-- 商品详情 -->
		<view><commodity-details :commodityDetails="goodsDetailsImgs"></commodity-details></view>
	</view>
</template>

<script>
import goodsInfo from '@/components/goods-info/goods-info';
import auctionTab from '@/components/auction-tab/auction-tab';
import commodityDetails from '@/components/commodity-details/commodity-details';
import evaluate from '@/components/evaluate/evaluate';
export default {
	components: {
		goodsInfo,
		auctionTab,
		commodityDetails,
		evaluate
	},
	data() {
		return {
			auctionData: {},
			goodsName: '摩飞 (MR9088)多功能锅料理锅 富士白久多功能锅料理锅',
			evaluateList: [], //评价列表数据
			evaluateCount: 1, //评论数量
			goodsDetailsImgs: [
				{goodsPictureAddress:'https://img30.360buyimg.com/sku/jfs/t1/17359/1/14127/165787/5ca5cd7eEe53ccde3/cbcf7533f1b39681.jpg'},
				{goodsPictureAddress:'https://img30.360buyimg.com/sku/jfs/t1/17412/7/14212/155753/5ca5cd7eE7fd0561d/10cdc63cc6308a90.jpg'}
			], //商品轮播图
			imgList: [{ imgUrl: 'https://img13.360buyimg.com/n2/s240x240_jfs/t10675/253/1344769770/66891/92d54ca4/59df2e7fN86c99a27.jpg!q70.jpg' }],
			tablist: [{ label: '最近10个竞购者' }, { label: '竞拍规则' }, { label: '往期成交' }],
			/*往期成交列表*/
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
					currentPrice: 300,
					city: '上海'
				}
			]
		};
	},
	onLoad(option) {
		let data = {
			start: '1',
			activityId:option.activityId,
			len: '1'
		};
		this.loadEvaluateData(data);
		let auctionDetailsed = {
			activityId:option.activityId,
			snapshotId:option.snapshotId,
			token: this.$storage.getStorage('token',2)
		};
		this.getAuctionDetailsed(auctionDetailsed);
		let forwardBidderData = {};
		this.forwardBidderList(forwardBidderData);
		let forwardData = {
			start: '1',
			activityId:option.activityId,
			len: '10'
		};
		this.forwardLists(forwardData);
		let goodsDetailsImg = {
			snapshotId:option.snapshotId,
			token:this.$storage.getStorage("token",2)
		}
		this.goodsDetailsImgList(goodsDetailsImg);
	},
	onReady() {
		
	},
	methods: {
		/* 直购 */
		directPurchase(e,orderType) {
			let activityId = e.currentTarget.dataset.activityid;
			let token = this.$storage.isAuthed;
			uni.navigateTo({
				url: '../confirm-order/confirm-order?activityId=' + activityId + '&token=' + token+"&orderType="+orderType
			});
		},
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
		/* 获得商品详情 */
		getAuctionDetailsed(data) {
			let _this = this;
			_this.$api
				.getAuctionDetailsed(data)
				.then(res => {
					res = res.data;
					if (res.code == '0001') {
						_this.auctionData = res.data;
						_this.imgList = res.data.goodsImgurl;
						_this.goodsName = res.data.goodsName;
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
		/* 往期十个竞购者 */
		forwardBidderList(data) {
			let _this = this;
			_this.$api
				.getForwardBidderList(data)
				.then(res => {
					res = res.data;
					if (res.code == '0001') {
						this.bidderList = res.data.bidderList;
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
		/* 获得商品详情图 */
		goodsDetailsImgList(data) {
			this.$api.getGoodsDetailsImgList(data)
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
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background: red;
	min-height: 100%;
	background: #ffffff;
}
.clinch-deal {
	display: flex;
	flex-direction: column;
	height: 332upx;
	background: rgba(255, 255, 255, 1);
	border: 2upx solid rgba(212, 212, 212, 1);
	border-radius: 10upx;
	margin: 56upx 24upx 0 24upx;
	.timer-bg {
		margin-top: -14upx;
		display: flex;
		justify-content: center;
		align-items: center;
		align-self: center;
		background: url('~@/static/auction/timerbged.png');
		background-size: 100% 100%;
		width: 420upx;
		height: 72upx;
		padding-bottom: 8upx;
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
	.current-info {
		display: flex;
		margin: 30upx 24upx 0 24upx;
		justify-content: space-between;
		&-portrait {
			image {
				width: 100upx;
				height: 100upx;
			}
		}
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
		width: 20upx;
		height: 30upx;
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
		font-size: 30upx;
		font-family: Humanist777BT-BlackB;
		color: rgba(250, 80, 61, 1);

		&-num {
			font-weight: bold;
			font-size: 40upx;
		}
	}
	.goods-price {
		margin: 10upx 0;
		&-num {
			font-size: 24upx;
			font-family: PingFangSC-Regular;
			font-weight: 400;
			text-decoration: line-through;
			color: rgba(102, 102, 102, 1);
		}
	}
	.make-price-date {
		font-size: 24upx;
		font-family: PingFangSC-Regular;
		font-weight: 400;
		color: rgba(170, 170, 170, 1);
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
		display: flex;
		align-items: center;
	}
	.countdown-time {
		font-size: 24upx;
		font-family: PingFangSC-Regular;
		font-weight: bold;
		color: rgba(250, 80, 61, 1);
	}
}
.border-mark {
	width: 100%;
	height: 18upx;
	background: rgba(242, 244, 245, 1);
}
</style>
