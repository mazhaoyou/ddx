<template>
	<!-- 追加委托组件 
	* entrustFlag底部菜单显示开关变量，未开始竞拍：0，正在拍：1
	* 
	* -->
	<view class="bottom-area">
		<view class="entrust-beans-area" v-if="entrustFlag == 1">
			<view class="beans-content">
				<view class="beans-text" v-if="consumption>0">
					消耗：
					<text class="beans-num">{{ consumption }}</text>
				</view>
				<view class="beans-remaining">
					委托剩余：
					<text class="remaining-num">{{ silverRest + goldRest }}</text>
					<view class="beans-area">
						<view class="bracket">（</view>
						<text class="remaining-num">{{ silverRest }}</text>
						<image class="beans-bean" src="../../static/auction/silver_bean.png" mode=""></image>
						<text class="remaining-num golden-num">{{ goldRest }}</text>
						<image class="beans-bean" src="../../static/auction/golden_bean.png" mode=""></image>
						<view class="bracket">）</view>
					</view>
				</view>
				<!-- 				<view class="arrow-down"><image class="arrow-down-img" @tap="handleArrowDown()" src="../../static/auction/arrow_down.png" mode=""></image></view>
 -->
			</view>
		</view>
		<view class="entrust-beans-button" v-if="entrustFlag == 1">
			<uni-number-box class="number-box" :min="0" :step="1" @change="bindChange" :value="beanCount"></uni-number-box>
			<view class="btn-switch">
				<view class="btn-switch-left" @tap="cancelDelegate">取消委托</view>
				<view class="btn-switch-right" @tap="handleAddEntrust()">追加委托</view>
			</view>
		</view>
		<view class="entrust-beans-button" v-if="entrustFlag == 0">
			<uni-number-box :numBoxWidth="numBoxWidth" class="number-box details-number-box" :min="0" :step="1" @change="bindChange" :value="beanCount"></uni-number-box>
			<view class="btn-switch"><view class="btn-switch-middle" @tap="handleEntrustBidding()">委托竞拍</view></view>
		</view>
	</view>
</template>

<script>
import uniNumberBox from '@/components/uni-number-box/uni-number-box.vue';

export default {
	name: 'additionalEntrust',
	key: '',
	components: {
		uniNumberBox
	},
	props: {
		entrustFlag: {
			type: Number,
			default: 0
		},
		eachIncrease: {
			//每次竞购所消耗点豆数
			type: Number,
			default: 1
		},
		/* 委托金豆余量 */
		entrustGold: {
			type: Number,
			default: 0
		},
		entrustSilver: {
			type: Number,
			default: 0
		},
		consumeBean:{
			type:Number,
			default:0
		},
		/* 活动id */
		activityId: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			beanCount: 100,
			consumption: 0, //消耗
			goldRest: 0, //委托剩余金豆
			silverRest: 0, //委托剩余银豆
			numBoxWidth: 0, //当为未开始竞拍是底部菜单显示
			type: 0, //请求步骤类型
			entrustTimes: 0 //委托竞购次数
		};
	},
	onLoad() {},
	onReady() {},
	methods: {
		bindChange(num) {
			this.beanCount = num;
		},
		// handleArrowDown() {
		//	向下的箭头
		// 	this.showArrow = false;
		// },
		handleAddEntrust() {
			//追加委托
			this.handleEntrustBidding();
		},
		goBugBean() {
			//跳转至买豆页
			uni.switchTab({
				url: '../../pages/buy-beans/buy-beans'
			});
		},
		handleEntrustBidding() {
			//点击委托
			let _this = this;
			let entrustDesc = '';
			const beanInfo = this.$store.state.beanInfo; //豆信息
			const beanTotal = parseInt(beanInfo.goldCount) + parseInt(beanInfo.sliverCount); //豆总和（金、银豆）
			_this.entrustTimes = parseInt(beanTotal / _this.eachIncrease);
			if (_this.entrustFlag == 0) {
				entrustDesc = '确定委托' + _this.beanCount + '福豆吗?';
			} else {
				entrustDesc = '确定追加' + _this.beanCount + '福豆吗?';
			}
			if (beanTotal == 0) {
				uni.showModal({
					content: '您目前没有福豆，需要充值吗？',
					confirmText: '确定',
					cancelText: '取消',
					success: function(res) {
						if (res.confirm) {
							_this.goBugBean();
						}
					}
				});
				return false;
			}
			if (beanTotal < _this.beanCount) {
				uni.showModal({
					content: '您只有' + beanTotal + '了，全部委托吗？',
					confirmText: '确定',
					cancelText: '取消',
					success: function(res) {
						if (res.confirm) {
							_this.beanCount = beanTotal;
							_this.requestEntrust();
						}
					}
				});
				return false;
			}
			uni.showModal({
				content: entrustDesc,
				confirmText: '确定',
				cancelText: '取消',
				success: function(res) {
					if (res.confirm) {
						_this.requestEntrust();
					}
				}
			});
		},
		requestEntrust() {
			//请求委托接口
			let _this = this;
			let data = {
				token: _this.$storage.isAuthed(),
				activityId: _this.activityId,
				entrustTimes: _this.entrustTimes,
				type: _this.type,
				entrustType: _this.entrustFlag
			};
			_this.$api
				.entrustAuction(data)
				.then(res => {
					res = res.data;
					if (res.code == '0001') {
						_this.goldRest = res.data.entrustGold;
						_this.silverRest = res.data.entrustSilver;
						_this.$emit('entrustFlag', 1);
						_this.$store.dispatch('beanAuction');
					} else if (res.code == '2006' || res.code == '2007' || res.code == '2015') {
						uni.showModal({
							content: res.message,
							confirmText: '确定',
							cancelText: '取消',
							success: function(info) {
								if (info.confirm) {
									switch (res.code) {
										case '2006':
											_this.type = 2;
											_this.requestEntrust();
											break;
										case '2007':
											_this.type = 1;
											_this.requestEntrust();
											break;
										case '2015':
											_this.goBugBean();
											break;
									}
								}
							}
						});
					} else {
						uni.showToast({
							title: res.message,
							duration: 3000
						});
					}
				})
				.catch(err => {
					console.log('委托=' + JSON.stringify(err));
				});
		},
		cancelDelegate() {
			//取消委托
			let _this = this;
			let data = {
				token: _this.$storage.isAuthed(),
				activityId: ''
			};
			uni.showModal({
				content: '确定取消委托吗?',
				confirmText: '确定',
				cancelText: '取消',
				success: function(res) {
					if (res.confirm) {
						_this.$api
							.entrustAuction(data)
							.then(res => {
								res = res.data;
								if (res.code == '0001') {
									_this.goldRest = 0;
									_this.silverRest = 0;
									_this.$emit('entrustFlag', 0);
									_this.$store.dispatch('beanAuction');
								} else {
									uni.showToast({
										title: res.message,
										duration: 3000
									});
								}
							})
							.catch(err => {
								console.log('取消委托=' + JSON.stringify(err));
							});
					}
				}
			});
		}
	},
	watch: {
		entrustGold() {
			/*某一操作重置数据*/
			this.$nextTick(() => {
				this.goldRest = this.entrustGold;
			});
		},
		entrustSilver() {
			this.$nextTick(() => {
				this.silverRest = this.entrustSilver;
			});
		},
		consumeBean (){
			this.$nextTick(() => {
				this.consumption = this.consumeBean;
			});
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	min-height: 100%;
	background: #ffffff;
}

.bottom-area {
	width: 100%;
	height: auto;
	min-height: 146upx;
	background-color: #fff;
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 999;
}
.entrust-beans-area {
	width: 100%;
	height: 70upx;
	background-color: #fff;
	border-top: 1upx solid #e5e5e5;
}
.beans-content {
	padding: 0 25upx;
	height: 70upx;
	background-color: #fff;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-content: center;
}
.beans-text {
	font-size: 24upx;
	line-height: 70upx;
	color: #333;
	font-family: PingFangSC-Regular;
	font-weight: 400;
}
.beans-remaining {
	flex: 1;
	font-size: 24upx;
	color: #333;
	line-height: 70upx;
	font-family: PingFangSC-Regular;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-content: center;
	margin-right: 20upx;
}
.beans-bean {
	display: inline-block;
	width: 20upx;
	height: 20upx;
	align-self: center;
	margin: 0 10upx;
}
.beans-area {
	height: 70upx;
	line-height: 70upx;
	color: #333;
	font-family: PingFangSC-Regular;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-content: center;
}
.bracket {
	height: 70upx;
	line-height: 70upx;
	color: #333;
	font-family: PingFangSC-Regular;
}
.remaining-num {
	height: 70upx;
	font-size: 24upx;
	line-height: 70upx;
	color: #333;
	font-family: PingFangSC-Regular;
}
.golden-num {
	margin-left: 20upx;
}
.arrow-down {
	height: 70upx;
	line-height: 70upx;
	&-img {
		display: inline-block;
		width: 28upx;
		height: 16upx;
		align-self: center;
	}
}
.entrust-beans-button {
	height: 146upx;
	background-color: #fff;
	padding: 0 25upx;
	border-top: 1upx solid #e5e5e5;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-content: center;
}
.number-box {
	height: 80upx;
	align-self: center;
}
.details-number-box {
	flex: 1;
	margin-right: 23upx;
}
.btn-switch {
	flex: 1;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
}
.btn-switch-left {
	width: 210upx;
	height: 80upx;
	background: linear-gradient(left, #c4c4c4, #b5b4b4);
	background: -webkit-linear-gradient(left, #c4c4c4, #b5b4b4);
	background-size: 100% 100%;
	line-height: 80upx;
	color: #ffffff;
	font-size: 32upx;
	font-weight: 400;
	font-family: PingFangSC-Regular;
	text-align: center;
	border-radius: 6upx;
}
.btn-switch-right {
	width: 210upx;
	height: 80upx;
	background: linear-gradient(left, #ffc20b, #fe9402);
	background: -webkit-linear-gradient(left, #ffc20b, #fe9402);
	background-size: 100% 100%;
	line-height: 80upx;
	color: #ffffff;
	font-size: 32upx;
	font-weight: 400;
	font-family: PingFangSC-Regular;
	text-align: center;
	border-radius: 6upx;
}
.btn-switch-middle {
	width: 354upx;
	height: 80upx;
	background: linear-gradient(left, #ffc20b, #fe9402);
	background: -webkit-linear-gradient(left, #ffc20b, #fe9402);
	background-size: 100% 100%;
	line-height: 80upx;
	color: #ffffff;
	font-size: 32upx;
	font-weight: 400;
	font-family: PingFangSC-Regular;
	text-align: center;
	border-radius: 6upx;
}
</style>
