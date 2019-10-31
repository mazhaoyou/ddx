<!--	
	虚拟场
	薛毅飞 
-->
<template>
	<view class="auction-details" @touchmove.stop.prevent="moveHandle">
		<goods-info
			:imgList="auctionData.imgList"
			:autoplay="true"
			:interval="5000"
			:duration="2000"
			:warning="true"
			:attention="true"
			:warningStatus="warningState"
			:goodsName="auctionData.goodsName"
			:attentionStatus="whetherAttention"
			:isStatusBar="false"
		></goods-info>
		<!--成交信息-->
		<view class="clinch-deal">
			<view class="timer-bg">
				<image src="../../static/auction/timing.png" mode=""></image>
				<text class="clinch-deal-mark uni-ellipsis">00:04</text>
			</view>
			<view class="current-info">
				<view class="current-info-portrait"><image src="../../static/auction/portrait.png" mode=""></image></view>
				<view class="bidders-goods-info">
					<view class="bidders-info">
						<view class="bidders-info-name">我是捡漏王</view>
						<view class="bidders-info-location">
							<image src="../../static/auction/location.png" mode=""></image>
							<text class="">北京</text>
						</view>
						<view class="bidders-info-signature uni-ellipsis">当一天和尚撞一天钟当一天和尚撞一天钟</view>
					</view>
					<view class="current-goodsinfo">
						<view class="current-price">
							￥
							<text class="current-price-num">3.90</text>
						</view>
						<view class="goods-price">
							<text class="goods-price-info">商品价格:</text>
							<text class="goods-price-num">¥1098.00</text>
						</view>
					</view>
				</view>
			</view>
			<view class="direct-purchase">直购¥1098.00（返还48个金豆）</view>
		</view>
		<view class="direct-purchase-info">
			<view class="postage-info">竞购邮费：10元（直购免邮）</view>
			<view class="countdown">
				送至：
				<text class="countdown-address">北京</text>
				<image class="countdown-img" src="../../static/auction/location.png" mode=""></image>
			</view>
		</view>
		<view class="border-mark"></view>
		<view class="auction-tab-list"><auction-tab :tablist="tablist" :pastUser="forwardList" :recentlyUser="bidderList"></auction-tab></view>
		<view :class="['fixed-button-area', buttonAreaVirtual]"><view class="fixed-button-txt">1点豆竞拍</view></view>
		<!-- 委托竞拍底部菜单 -->
		<view class="auction-entrusts"><additional-entrust :entrustFlag="entrustFlag"></additional-entrust></view>
		<view class="border-mark"></view>
		<!-- 评价 -->
		<view class="evaluate"><evaluate :evaluateListData="evaluateList" :evaluateCount="evaluateCount"></evaluate></view>
		<view class="border-mark"></view>
		<!-- 引导 -->
		<view class="virtual-field">
			<view class="virtual-box" :style="{transform: 'translateX('+ distance +')'}">
				<view :class="['virtual',item.name]" v-for="(item, index) in list" :key="index">
					<view class="virtual-direct-purchase" v-if=" index == 2 ">
						<view>直购¥1098.00（返还48个金豆）</view>
					</view>
					<view v-if=" index == 3 " class="virtual-bounced">
						<image class="virtual-goods" src="../../static/virtual_field/virtual_bounced.png"></image>
						<image class="virtual-order" src="../../static/virtual_field/virtual_order.png" @click="placeOrder"></image>
					</view>
					<image class="virtual-arrow" :src="item.orderUrl"></image>
					<text class="virtual-desc">{{item.desc}}</text>
					<view class="virtual-buttons">
						<button plain="true" class="previous-step" v-if="index == 1 || index == 2" @click="previouStep(index)">上一步</button>
						<button plain="true" v-if="index == 0 || index == 1 || index == 2" @click="enterNext(index)">下一步</button>
						<button plain="true" v-if="index == 3" @click="complete">完成</button>
					</view>
					<view class="virtual-entrust" v-if=" index == 1 ">
						<view>委托竞拍</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import goodsInfo from '@/components/goods-info/goods-info';
import auctionTab from '@/components/auction-tab/auction-tab';
import additionalEntrust from '@/components/additional-entrust/additional-entrust';
// import commodityDetails from '@/components/commodity-details/commodity-details';
import evaluate from '@/components/evaluate/evaluate';

export default {
	components: {
		goodsInfo,
		auctionTab,
		additionalEntrust,
		evaluate
	},
	data() {
		return {
			warningState: 1,
			whetherAttention: 0,
			entrustFlag: 1,
			evaluateList: [
				{
					"comment": "好激动哦！没想到花了这么点钱就拍到了。发货也很快，小冠还是挺值得信任的。",
					"evaluateTime": "2019.04.07",
					"imgList": [
						{
						"imgUrl": "https://img11.360buyimg.com/mobilecms/s350x250_jfs/t11290/85/2807772568/150679/91da7322/5cd93db4N27677413.jpg",
									},
					  {
						"imgUrl": "https://img11.360buyimg.com/mobilecms/s350x250_jfs/t28756/250/1162143213/646245/1fc1b7eb/5cd94b1cN83a4a100.png"
					  }
					],
					"mark": "5",
					"pointPraise": "88",
					"headPicUrl": "../../static/evaluate_list/use_img.png",
					"frameUrl": "",
					"nickname": "无底洞",
					"levelDataName": "4"
				},
			], //评价列表数据
			evaluateCount: 1, //评论数量
			goodsDetailsImgs: [
				'https://img30.360buyimg.com/sku/jfs/t1/17359/1/14127/165787/5ca5cd7eEe53ccde3/cbcf7533f1b39681.jpg',
				'https://img30.360buyimg.com/sku/jfs/t1/17412/7/14212/155753/5ca5cd7eE7fd0561d/10cdc63cc6308a90.jpg'
			], //商品详情
			tablist: [{ label: '最近10个竞购者' }, { label: '竞拍规则' }, { label: '往期成交' }],
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
			],
			entrust_bidding: 1,
			auctionData: {
				goodsName: '摩飞 (MR9088)多功能锅料理锅 富士白久多功能锅料理锅',
				imgList: [{ imgUrl: 'https://img13.360buyimg.com/n2/s240x240_jfs/t10675/253/1344769770/66891/92d54ca4/59df2e7fN86c99a27.jpg!q70.jpg' }]
			},
			distance: 0, //滑动距离
			list: [ //引导描述
				{
					orderUrl: "../../static/virtual_field/virtual_arrow_one.png",
					desc: "每点击一次，消耗一福豆，商品价格上涨1分钱，全场0元起拍！",
					name: "virtual-one"
				},
				{
					orderUrl: "../../static/virtual_field/virtual_arrow_two.png",
					desc: "使用【委托竞拍】，输入您想委托的福豆数，系统自动为您出豆竞价。竞拍成功，未消耗福豆自动退换至您账户。",
					name: "virtual-two"
				},
				{
					orderUrl: "../../static/virtual_field/virtual_arrow_three.png",
					desc: "没拍中？可直接购买商品，系统自动返还本轮竞拍中您消耗的全部金豆，回血再战！",
					name: "virtual-three"
				},
				{
					orderUrl: "../../static/virtual_field/virtual_arrow_four.png",
					desc: "十秒倒计时内无人竞价，最后一个出价人竞拍成功，以超低成交价获得该商品！",
					name: "virtual-four"
				}
			]
		};
	},
	onLoad(option) {
		
	},
	computed: {
		buttonAreaVirtual() {
			return parseInt(this.distance) == 0 ? 'fixed-button-virtual' : '';
		}
	},
	methods: {
		previouStep(index) { // 上一步
			let num = 750 * index - 750;
			this.distance = -uni.upx2px(num) + 'px';
		},
		enterNext(index) { // 下一步
			let num = 750 * ( index + 1 );
			this.distance = -uni.upx2px(num) + 'px';
		},
		complete() { // 完成点击
			uni.navigateBack({
				delta: 1
			});
		},
		placeOrder() { // 去下单
			
		},
		moveHandle() { //禁止蒙版下的页面滚动
			
		}
	}
};
</script>

<style lang="scss">
page {
	min-height: 100%;
	background: #ffffff;
}
uni-page-wrapper{
	overflow: hidden;
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
		image {
			width: 42upx;
			height: 42upx;
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
	}
	.countdown-img {
		display: flex;
		width: 20upx;
		height: 24upx;
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
// 引导
.virtual-field{
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 100000;
	width: 100%;
	height: 100vh;
	background: rgba(0, 0, 0, .8);
	overflow: hidden;
}
.virtual-box{
	width: 3000upx;
	display: flex;
	flex-direction: row;
	height: 100%;
	transition: .3s;
}
.fixed-button-virtual{
	z-index: 100001;
}
.virtual-entrust{
	background: #FFF;
	padding: 5px;
	border-radius: 5px;
	position: absolute;
	bottom: 24upx;
	right: 14upx;
	view{
		width: 354upx;
		height: 80upx;
		background: linear-gradient(90deg,#FFC20B,#FE9402);
		border-radius: 5px;
		font-size: $font-size-32;
		line-height: 80upx;
		color: $color-white;
		text-align: center;
	}
}
.virtual-direct-purchase{
	background: #FFF;
	padding: 10px;
	border-radius: 5px;
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	// top: 770upx;
	bottom: 35%;
	left: 96upx;
	view{
		background:linear-gradient(90deg, #FF7A24, #F64635);
		width: 520upx;
		height: 70upx;
		opacity: 0.85;
		border-radius: 11upx;
		font-size: $font-size-28;
		font-weight:400;
		color: #fff;
		line-height: 70upx;
		text-align: center;
	}
}
.virtual{
	width: 100%;
	height: 100%;
	position: relative;
	display: flex;
	flex-direction: column;
	text{
		font-size: $font-size-32;
		line-height: 60upx;
		color: $color-white;
		font-weight: 400;
		// position: absolute;
	}
	.virtual-arrow{
		position: initial;
		// position: absolute;
	}
	.virtual-buttons{
		width: 100%;
		// position: absolute;
		left: 0;
		display: flex;
		justify-content: center;
	}
	button{
		width: 280upx;
		height: 80upx;
		background: linear-gradient(90deg,#FFC20B,#FE9402);
		border-radius: 5px;
		border: none;
		font-size: $font-size-32;
		line-height: 80upx;
		color: $color-white;
		transition: .05s;
	}
	.previous-step{
		background: transparent;
		border: 1px solid $color-white;
	}
}
.virtual-one{
	justify-content: flex-end; 
	text{
		margin: 0 175upx 150upx 33upx;
	}
	.virtual-arrow{
		position: absolute;
		width: 147upx;
		height: 47upx;
		left: 410upx;
		bottom: 330upx;
	}
	.virtual-buttons{
		margin-bottom: 150upx;
		// bottom: 150upx;
	}
}
.virtual-two{
	justify-content: flex-end; 
	text{
		margin: 0 70upx;
		position: absolute;
		bottom: 250upx;
	}
	.virtual-arrow{
		width: 61upx;
		height: 137upx;
		position: absolute;
		left: 540upx;
		bottom: 150upx;
	}
	.virtual-buttons{
		position: absolute;
		bottom: 460upx;
	}
}
.virtual-three{
	justify-content: flex-end; 
	text{
		margin: 0 70upx 50upx 70upx;
	}
	.virtual-arrow{
		width: 107upx;
		height: 115upx;
		margin: 0 0 20upx 355upx;
	}
	.virtual-buttons{
		top: 1200upx;
		margin-bottom: 50upx;
	}
}
.virtual-four{
	justify-content: center;
	text{
		margin:0 70upx;
	}
	.virtual-arrow{
		width: 68upx;
		height: 93upx;
		margin-left: 530upx;
	}
	.virtual-buttons{
		padding-top: 20upx;
	}
	.virtual-bounced{
		width: 100%;
		text-align: center;
		image:nth-of-type(1){
			width: 330px;
			height: 365px;
		}
		image:nth-of-type(2){
			width: 280upx;
			height: 80upx;
		}
	}
}
.button-hover{
	opacity: .95;
}

.goods-slideshow{
	margin-top: 0;
}
</style>
