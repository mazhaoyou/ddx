<template>
	<!-- 竞拍-未开始
	* wux
	* -->
	<view class="auction-details">
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
			::activityId="auctionData.activityId"
		></goods-info>
		<!--成交信息-->
		<view class="clinch-deal">
			<view class="timer-bg">
				<image src="../../static/auction/timing.png" mode=""></image>
				<text class="clinch-deal-mark uni-ellipsis">13:00:00</text>
			</view>
			<view class="current-info">
				<view class="current-info-portrait"><image src="../../static/auction/portrait.png" mode=""></image></view>
				<view class="bidders-goods-info">
					<view class="bidders-info">
						<view class="bidders-info-name">即将开始</view>
						<view class="bidders-info-signature uni-ellipsis">提前委托，别让宝贝被抢走了哦！</view>
					</view>
					<view class="current-goodsinfo">
						<view class="current-price">
							￥
							<text class="current-price-num">0.00</text>
						</view>
						<view class="goods-price">
							<text class="goods-price-info">商品价格:</text>
							<text class="goods-price-num">¥{{ auctionData.marketPrice }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="direct-purchase">活动开始后，才可以直购哦！</view>
		</view>
		<view class="direct-purchase-info">
			<view class="postage-info">竞购邮费:10元（直购免邮）</view>
			<view class="harvest-address" @tap="getLocation">
				<text class="uni-ellipsis">送至:{{ auctionData.address }}</text>
				<image src="../../static/auction/location.png" class="harvest-img" mode=""></image>
			</view>
		</view>
		<view class="border-mark"></view>
		<!-- 商品详情-竞拍规则-往期成交 -->
		<view class="auction-tab-list"><auction-tab :tablist="tablist" :pastUser="forwardList" :ismark="false"></auction-tab></view>
		<!-- 委托竞拍底部菜单 -->
		<view class="auction-entrusts">
			<additional-entrust
				:entrustFlag="entrustFlag"
				:eachIncrease="auctionData.eachIncrease"
				:activityId="auctionData.activityId"
				@entrustFlag="getEntrust"
			></additional-entrust>
		</view>
		<view class="border-mark"></view>
		<!-- 评价 -->
		<block v-if="evaluateCount != 0">
			<view class="evaluate"><evaluate :evaluateListData="evaluateList" :evaluateCount="evaluateCount"></evaluate></view>
			<view class="border-mark"></view>
		</block>
		<!-- 商品详情 -->
		<view><commodity-details :commodityDetails="goodsDetailsImgs"></commodity-details></view>
		<!-- 城市选择 -->
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
import cityPicker from '@/components/city-picker/city-picker.vue';
export default {
	components: {
		goodsInfo,
		auctionTab,
		additionalEntrust,
		commodityDetails,
		evaluate,
		cityPicker
	},
	data() {
		return {
			themeColor: '#FE9402', //收获地址按钮主题色
			cityPickerValue: [0, 0, 1],
			region: {
				label: '', ////收货地址值
				value: []
			},
			warningState: 0,
			whetherAttention: 0,
			/*商品信息 */
			auctionData: {
				goodsName: '摩飞 (MR9088)多功能锅料理锅 富士白久多功能锅料理锅',
				imgList: [{ imgUrl: 'https://img13.360buyimg.com/n2/s240x240_jfs/t10675/253/1344769770/66891/92d54ca4/59df2e7fN86c99a27.jpg!q70.jpg' }]
			},
			goods_name: '摩飞 (MR9088)多功能锅料理锅 富士白久多功能锅料理锅',
			warning_status: 3,
			attention_status: 1,
			harvestAdd: '北京', //收获地址
			entrustFlag: 0, //是否已委托,
			evaluateList: [], //评价列表数据
			evaluateCount: 0, //评论数量
			goodsDetailsImgs: [
				'https://img30.360buyimg.com/sku/jfs/t1/17359/1/14127/165787/5ca5cd7eEe53ccde3/cbcf7533f1b39681.jpg',
				'https://img30.360buyimg.com/sku/jfs/t1/17412/7/14212/155753/5ca5cd7eE7fd0561d/10cdc63cc6308a90.jpg'
			], //商品详情
			imgList: [{ imgUrl: 'https://img13.360buyimg.com/n2/s240x240_jfs/t10675/253/1344769770/66891/92d54ca4/59df2e7fN86c99a27.jpg!q70.jpg' }],
			tablist: [
				{
					label: '往期成交'
				},
				{
					label: '竞拍规则'
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
					currentPrice: 300,
					city: '上海'
				}
			]
		};
	},
	onLoad(option) {
		let activityData = {
			activityId: option.activityId,
			token: this.$storage.getStorage('token', 2)
		};
		this.activityDetails(activityData);
		let forwardData = {
			start: '1',
			activityId: option.activityId,
			len: '10'
		};
		this.forwardLists(forwardData);
		let data = {
			token: this.$storage.getStorage('token', 0),
			start: '1',
			activityId: option.activityId,
			len: '1'
		};
		this.loadEvaluateData(data);
		this.goodsDetailsImg(activityData);
	},
	methods: {
		/* 获取评价数据 */
		loadEvaluateData(data) {
			let _this = this;
			// 缓存评价列表数据
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
		/* 获取底部菜单组件传递值 */
		getEntrust(msg) {
			this.entrustFlag = msg;
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

<style lang="scss" scoped>
page {
	background: red;
	min-height: 100%;
	background: #ffffff;
}

.auction-details {
	padding-bottom: 154upx;
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
		background: url('~@/static/auction/timerbg.png');
		background-size: 100% 100%;
		width: 420upx;
		height: 72upx;
		padding-bottom: 4upx;

		image {
			display: block;
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
		align-items: center;

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
		background: linear-gradient(108deg, rgba(181, 180, 180, 1), rgba(196, 196, 196, 1));
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
	justify-content: flex-end;
	margin-left: 20upx;
	max-width: 260upx;

	&-name {
		font-size: 32upx;
		font-family: PingFang-SC-Bold;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		margin-bottom: 20upx;
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
		margin-bottom: 20upx;

		&-number-box {
			font-weight: bold;
			font-size: 50upx;
		}
	}

	.goods-price {
		&-info {
			font-family: PingFangSC-Regular;
			color: rgba(102, 102, 102, 1);
		}
		&-num {
			font-size: 24upx;
			font-family: PingFangSC-Regular;
			font-weight: 500;
			text-decoration: line-through;
			color: rgba(102, 102, 102, 1);
		}
	}
}

.direct-purchase-info {
	display: flex;
	margin: 30upx 24upx;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	font-size: 24px;
	font-family: PingFang-SC-Regular;
	color: rgba(102, 102, 102, 1);

	image {
		width: 32upx;
		height: 32upx;
		margin-right: 12upx;
	}

	.postage-info {
		display: flex;
		align-items: center;
		font-size: 24upx;
	}

	.harvest-address {
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: 24upx;
		font-family: PingFang-SC-Regular;
		color: rgba(102, 102, 102, 1);
		text {
			display: inline-block;
			max-width: 300upx;
			flex-wrap: nowrap;
			padding-top: 4upx;
		}

		.harvest-img {
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
}

.border-mark {
	width: 100%;
	height: 18upx;
	background: rgba(242, 244, 245, 1);
}
</style>
