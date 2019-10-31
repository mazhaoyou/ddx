<template>
	<!-- 抽奖页面 待完善
	* 	tablist[]：tab也列表 
	* 	winningListData: 中奖名单数据
	* 	lotteryRulesList：	抽奖规则数据
	* 	myPrizelist：我的奖品列表数据
	* 	winingInfo:	获奖信息
	*  -->
	<view class="conbox">
		<view class="container">
			<!-- 顶部活动标题部分 -->
			<view class="header">
				<view class="header-title">
					<view class="header-title-content">母亲节送礼</view>
				</view>
				<view class="header-text">
					您还有
					<text>{{ chishu }}</text>
					次免费抽奖机会
				</view>
			</view>
			<!-- 抽奖转盘部分 -->
			<view class="main">
				<view class="canvas-container">
					<view :animation="animationData" class="canvas-content" id="zhuanpano" style="">
						<!-- 中间分割线部分 -->
						<view class="canvas-line">
							<view class="canvas-litem" v-for="(item, index1) in goodList" :key="index1" :style="[{ transform: 'rotate(' + item.lineTurn + ')' }]"></view>
						</view>
						<!-- 奖品部分 -->
						<view class="canvas-list">
							<view class="canvas-back">
								<view class="canvas-circle"></view>
								<view class="canvas-item" :style="[{ zIndex: index2 }]" v-for="(iteml, index2) in goodList" :key="index2">
									<view class="canvas-item-text" :style="[{ transform: 'rotate(' + iteml.turn + ')' }]">
										<text>{{ iteml.goodsName }}</text>
										<image class="canvas-item-text-lucky_draw" :src="iteml.goodsThumbnail"></image>
									</view>
								</view>
							</view>
						</view>
					</view>
					<!-- 幸运抽奖-未中奖组件部分 -->
					<no-prize-dialog></no-prize-dialog>
					<!--幸运抽奖-中奖组件部分 -->
					<winning-prize-dialog :winingInfo="winingInfo"></winning-prize-dialog>
					<view @tap="playReward" v-if="condition==1" class="canvas-btn"><text>开&nbsp;始\n抽&nbsp;奖</text></view>
					<view v-if="condition==2" class="canvas-btn"><text>开&nbsp;始\n抽&nbsp;奖</text></view>
				</view>
			</view>

			<!-- 底部菜单选项卡-中奖名单-抽奖规则-我的奖品 -->
			<view class="luck-draw">
				<view class="luck-draw-tabs">
					<view v-for="(item, index) in tablistTitle" :key="index" :class="{ 'tab-item': true, active: activeIndex == index }"
					 @tap="clickTab(index)">
						{{ item }}
						<view class="luck-draw-icon left-top-icon"></view>
						<view class="luck-draw-icon right-bottom-icon"></view>
					</view>
				</view>
				<view class="luck-draw-container">
					<!-- 左上角与右上角图标 -->
					<view class="luck-draw-icon left-top-icon"></view>
					<view class="luck-draw-icon right-bottom-icon"></view>
					<!-- 选项卡内容展示部分 -->
					<view class="tabdiv" v-show="activeIndex == 0">
						<winning-list :winningListData="lotteryTabList.winningListData"></winning-list>
					</view>
					<view class="tabdiv" v-show="activeIndex == 1">
						<lottery-rules :lotteryRulesList="lotteryTabList.lotteryRulesList"></lottery-rules>
					</view>
					<view class="tabdiv" v-show="activeIndex == 2">
						<my-prize-list :myPrizelist="lotteryTabList.myPrizelist"></my-prize-list>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import winningList from '@/components/winning-list/winning-list';
	import lotteryRules from '@/components/lottery-rules/lottery-rules';
	import myPrizeList from '@/components/my-prize-list/my-prize-list';
	import noPrizeDialog from '@/components/no-prize-dialog/no-prize-dialog';
	import winningPrizeDialog from '@/components/winning-prize-dialog/winning-prize-dialog';
	export default {
		components: {
			winningList,
			lotteryRules,
			myPrizeList,
			noPrizeDialog,
			winningPrizeDialog
		},
		data() {
			return {
				tablistTitle: ['中奖名单', '抽奖规则', '我的奖品'], // 底部抽奖选项卡列表数据
				activeIndex: 0, //默认索引
				goodList: [], //goodsType : 0 未中奖 1 福豆  2 实物
				awardsList: [], // 存放奖品数据
				animationData: {},
				chishu: '', // 抽奖次数
				winingInfo: {
					prizeType: '', //奖品类型
					prizeName: '', // 奖品名称
					prizeThumbnail: '', // 奖品缩略图
					prizeNo: '' //奖品编号
				},
				mold: 1,
				lotteryTabList: {
					myPrizelist: [], //我的奖品
					lotteryRulesList: '', //抽奖规则
					winningListData: [] //中奖名单
				},
				token: '',
				condition: 1, //控制点击抽奖按钮能否点击,1为可点击，2为不可点击
			};
		},
		onLoad: function() {
			this.token = this.$storage.getStorage('token', 2);
			// 获取奖品列表
			this.initdata(this.token);
			this.drawAwardRoundel(this.goodList);
			//初始化渲染中奖名单
			this.lookWinList();
		},
		onReady: function(e) {},
		methods: {
			/*
			 * 点击中奖名单、抽奖规则、我的奖品选项卡
			 *  */
			clickTab(index) {
				this.activeIndex = index;
				// 中奖名单
				if (this.activeIndex == 0) {
					this.lookWinList();
				}
				// 抽奖规则
				if (this.activeIndex == 1) {
					let ruleData = {
						informationType: 4
					}
					this.lookLotteryRules(ruleData);
				}
				// 我的奖品
				if (this.activeIndex == 2) {
					let prizeData = {
						token: this.$storage.isAuthed()
					};
					this.lookMyPrizes(prizeData);
				}
			},
			/*
			 * 初始化抽奖数据
			 * */
			initdata(data) {
				let _this = this;
				/* 查询抽奖奖品列表 */
				let lotteryPrizesList = _this.$storage.getStorage('lotteryPrizesList');
				_this.goodList = lotteryPrizesList;

				_this.$api
					.getLotteryGoodsList(data)
					.then(res => {
						res = res.data;
						let message = res.message;
						if (res.code == '0001') {
							let dataList = res.data;
							_this.chishu = dataList.lotteryCount;
							// 对比缓存跟请求数据是否相同、如果不相等则重新缓存
							if (!_this.$util.contrastArray(dataList.goodList, lotteryPrizesList)) {
								_this.goodList = dataList.goodList;
								_this.$storage.setStorage('lotteryPrizesList', dataList.goodList);
							}
							// 画转盘
						} else {
							uni.showToast({
								title: message,
								icon: 'none',
								duration: 2000
							});
						}
					})
					.catch(err => {
						uni.showToast({
							title: '服务异常'
						});
					});
			},
			/*
			 * 画抽奖圆盘
			 *
			 * */
			drawAwardRoundel(goodList) {
				let _this = this;
				// 拿到奖品列表goodList
				let awardsList = [];
				// 每份奖品所占角度
				let turnNum = (1 / goodList.length) * 360; // 文字旋转 turn 值
				/*给每一项添加 旋转角度*/
				_this.goodList.forEach((item, index) => {
					_this.$set(item, 'turn', index * turnNum + 'deg'); //每个奖品块旋转的角度
					_this.$set(item, 'lineTurn', index * turnNum + turnNum / 2 + 'deg'); //奖品分割线的旋转角度
				});
			},
			/*
			 * 发起抽奖，点击抽奖开始按钮
			 *
			 * */
			playReward: function(e) {
				let _this = this;

				if (this.chishu == 0) {
					uni.showToast({
						title: '您今天已经没有抽奖次数了。',
						icon: 'none'
					});
					return;
				}

				// 判断是否中奖及中奖后的数据
				let token = this.$storage.isAuthed();
				if (token) {
					let data = {
						token: token
					}
					this.judgeLottery(data);
				} else {
					return;
				}

				// 抽奖转盘旋转 
				var awardsNum = _this.goodList;
				var runNum = 4; //旋转8周
				var duration = 4000; //时长

				// 旋转角度
				_this.runDeg = _this.runDeg || 0;
				let preDeg = _this.runDeg;
				_this.runDeg = _this.runDeg + (360 - (_this.runDeg % 360)) + (360 * runNum - (360 / awardsNum.length)) +
					1;
				//创建动画
				if (process.env.VUE_APP_PLATFORM == 'h5') {
					// document.styleSheets[0]
					document.getElementById('zhuanpano').style = 'animation:rotate_before 4s 0ms ease forwards;';
					if (document.styleSheets[0].cssRules.length > 0) {
						Array.from(document.styleSheets[0].cssRules).forEach(function(element, index) {
							if (element.name == 'rotate_before') {
								// 删除上次插入的动画
								document.styleSheets[0].deleteRule(index);
							}
						});
					}
					// 插入定义的动画
					document.styleSheets[0].insertRule('@keyframes rotate_before{from{ transform: rotate(' + preDeg +
						'deg); }to{ transform: rotate(' + _this.runDeg + 'deg);}}', 8);
				} else {
					var animationRun = uni.createAnimation({
						duration: duration,
						timingFunction: 'ease'
					});
					animationRun.rotate(_this.runDeg).step();
					_this.animationData = animationRun.export();
				}
				// 中奖提示
				_this.chishu = _this.chishu - 1;
				_this.condition = 2;
			},
			/* 
			 * 判断是否抽到奖品
			 *  */
			judgeLottery(data) {
				let _this = this;
				this.$api.lottery(data)
					.then(res => {
						res = res.data;
						if (res.code == '0001') {
							let goodsData = res.data;
							_this.winingInfo.prizeName = goodsData.goodName;
							_this.winingInfo.prizeThumbnail = goodsData.goodsThumbnail;
							_this.winingInfo.prizeType = goodsData.goodsType;
							_this.winingInfo.prizeNo = goodsData.detailsId;
							/* 商品类型  
							 * 	1  实体商品  
							 * 	2  虚拟商品  
							 * 	3  点豆卡 
							 * 	4 谢谢惠顾
							 * 	 5 福豆 
							 * */
							if (1 == _this.winingInfo.prizeType || 2 == _this.winingInfo.prizeType || 3 == _this.winingInfo.prizeType || 1 ==
								_this.winingInfo.prizeType || 5 == _this.winingInfo.prizeType) {
								setTimeout(
									function() {
										_this.$store.commit('changeWinFlag', true);
										_this.condition = 1;
									}.bind(_this),
									4000
								);
							} else if (4 == _this.winingInfo.prizeType) {
								setTimeout(
									function() {
										_this.$store.commit('changePrizeFlag', true);
										_this.condition = 1;
									}.bind(_this),
									4000
								);
							}
						} else {
							uni.showToast({
								title: res.message,
								icon: 'none',
								duration: 2000
							});
						}
					})
					.catch(err => {
						uni.showToast({
							title: '网络异常',
							icon: 'none',
							duration: 2000
						});
					})

			},
			/*
			 * 查询中奖名单
			 * */
			lookWinList() {
				let _this = this;
				let winningList = _this.$storage.getStorage('winningList');
				_this.lotteryTabList.winningListData = winningList;
				_this.$api
					.getHappyNewsList()
					.then(res => {
						res = res.data;
						if (res.code == '0001') {
							let dataList = res.data;
							// 对比缓存跟请求数据是否相同、如果不相等则重新缓存
							if (!_this.$util.contrastArray(dataList, winningList)) {
								_this.lotteryTabList.winningListData = dataList;
								_this.$storage.setStorage('winningList', dataList);
							}
						} else {
							uni.showToast({
								title: res.message,
								icon: 'none',
								duration: 2000
							});
						}
					})
					.catch(err => {
						uni.showToast({
							title: '服务异常',
							icon: 'none',
							duration: 2000
						});
					});
			},
			/*
			 * 查看抽奖规则
			 * */
			lookLotteryRules(data) {
				let _this = this;
				let lotteryRules = this.$storage.getStorage("lotteryRulesList", 2);
				_this.lotteryTabList.lotteryRulesList = lotteryRules;
				this.$api.getInformation(data)
					.then(res => {
						res = res.data;
						if (res.code == '0001') {
							let rulesData = res.data;
							if (!_this.$util.contrastArray(rulesData.information, lotteryRules)) {
								_this.lotteryTabList.lotteryRulesList = rulesData.information;
								_this.$storage.setStorage('lotteryRulesList', rulesData.information, 2);
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
					})
			},
			/*
			 * 查询我的奖品
			 * */
			lookMyPrizes(data) {
				let _this = this;
				/* 查询我的奖品缓存 */
				let myPrizesLsit = _this.$storage.getStorage('myPrizes');
				_this.lotteryTabList.myPrizelist = myPrizesLsit;
				_this.$api
					.getMyPrizeList(data)
					.then(res => {
						res = res.data;
						if (res.code == '0001') {
							let dataList = res.data;
							// 对比缓存跟请求数据是否相同、如果不相等则重新缓存
							if (!_this.$util.contrastArray(dataList.prizeList, myPrizesLsit)) {
								_this.lotteryTabList.myPrizelist = dataList.prizeList;
								_this.$storage.setStorage('myPrizes', dataList.prizeList);
							}
						} else {
							uni.showToast({
								title: res.message,
								icon: 'none',
								duration: 2000
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
		watch: {
			goodList() {
				this.drawAwardRoundel(this.goodList);
			}
		}
	};
</script>
<style lang="scss" scoped>
	.conbox {
		width: 750upx;
		height: 100vh;
		overflow-x: hidden;
		overflow-y: scroll;
		background: -moz-linear-gradient(top, #fdb218, #f68714);
		background: -webkit-linear-gradient(top, #fdb218, #f68714);
		background: linear-gradient(top, #fdb218, #f68714);
	}

	.container,
	image.cont {
		width: 750upx;
		min-height: 100vh;
		height: auto;
		position: relative;
	}

	image.cont {
		height: 100%;
		position: absolute;
		z-index: 0;
	}

	image.caidai {
		position: absolute;
		top: 0;
		left: 0;
		width: 750upx;
		height: 1024upx;
	}

	/* 头部标题部分 */
	.header {
		padding-left: 54upx;
		padding-right: 54upx;
		margin-bottom: 40upx;
	}

	.header-title {
		width: 100%;
		height: 214upx;
		display: flex;
		align-items: center;
		background: url(~@/static/lucky_draw/background_header_title.png) no-repeat;
		background-size: contain;

		&-content {
			width: 487upx;
			height: 89upx;
			margin: 0 auto;
			text-align: center;
			font-size: 93upx;
			font-family: PingFang-SC-Heavy;
			font-weight: 800;
			color: rgba(255, 255, 255, 1);
			text-shadow: 0upx 14upx 0upx rgba(179, 94, 11, 0.86);
		}
	}

	.header-text {
		text-align: center;
		color: #ffffff;
		font-size: 28upx;

		>text {
			color: #fa503d;
			font-size: 40upx;
		}
	}

	/* 转盘部分 */

	.canvas-container {
		margin: 0 auto;
		position: relative;
		width: 674upx;
		height: 674upx;
		background: url(~@/static/lucky_draw/circle.png) no-repeat;
		background-size: cover;
		border-radius: 50%;
	}

	.canvas {
		width: 100%;
		height: 100%;
		display: block !important;
		border-radius: 50%;
	}

	.canvas-content {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 1;
		display: block;
		width: 674upx;
		height: 674upx;
		border-radius: inherit;
	}

	.canvas-element {
		position: relative;
		z-index: 1;
		width: inherit;
		height: inherit;
		border-radius: 50%;
	}

	.canvas-list {
		position: absolute;
		left: 0;
		top: 0;
		width: inherit;
		height: inherit;
		z-index: 9999;
	}

	// 中间部分背景色
	.canvas-back {
		position: relative;
		left: 70upx;
		top: 70upx;
		width: 536upx;
		height: 536upx;
		border-radius: 50%;
		background: #ffd277;
	}

	// 转盘内部背景色
	.canvas-circle {
		position: absolute;
		left: 50upx;
		top: 50upx;
		width: 432upx;
		height: 432upx;
		border-radius: 50%;
		background: #ffe4b5;
	}

	.canvas-item {
		position: absolute;
		left: 0;
		top: 0;
		width: 540upx;
		height: 540upx;
		border-radius: 50%;
		color: #e4370e;
		/* text-shadow: 0 1upx 1upx rgba(255, 255, 255, 0.6); */
	}

	.canvas-item-text {
		// width: 130upx;
		position: relative;
		display: block;
		padding-top: 14upx;
		margin: 0 auto;
		text-align: center;
		-webkit-transform-origin: 50% 270upx;
		transform-origin: 50% 270upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #e8482d;
	}

	.canvas-item-text text {
		font-size: 24upx;
		font-family: PingFang-SC-Medium;
		font-weight: 500;
		color: rgba(232, 72, 45, 1);
	}

	.canvas-item-text-lucky_draw {
		width: 50upx;
		height: 50upx;
		padding-top: 40upx;
	}

	/* 分隔线 */
	.canvas-line {
		position: absolute;
		left: 0;
		top: 0;
		width: inherit;
		height: inherit;
		z-index: 99999;
	}

	.canvas-litem {
		position: absolute;
		left: 336upx;
		top: 70upx;
		width: 3upx;
		height: 250upx;
		background-color: rgba(228, 55, 14, 0.4);
		overflow: hidden;
		-webkit-transform-origin: 50% 270upx;
		transform-origin: 50% 270upx;
	}

	/**  
* 抽奖按钮  
*/
	.canvas-btn {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 400;
		left: 250upx;
		top: 208upx;
		width: 178upx;
		height: 220upx;
		background: url(~@/static/lucky_draw/luck_draw.png) no-repeat;
		background-size: 100%;
		text-align: center;

		>text {
			display: block;
			padding-top: 30upx;
			font-size: 40upx;
			line-height: 50upx;
			font-family: PingFang-SC-Bold;
			font-weight: bold;
			color: rgba(255, 255, 255, 1);
		}
	}

	.canvas-btn.disabled {
		pointer-events: none;
	}

	.canvas-btn.disabled::after {
		border-bottom-color: #b07a7b;
	}

	// 底部菜单选项卡部分
	.luck-draw {
		padding-bottom: 94upx;
	}

	.luck-draw-tabs {
		height: 80upx;
		margin-top: 50upx;
		margin-bottom: 20upx;
		font-size: 32upx;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		box-sizing: border-box;
		align-items: center;

		.tab-item {
			width: 200upx;
			height: 56upx;
			text-align: center;
			font-family: PingFang-SC-Medium;
			font-weight: 500;
			color: rgba(0, 0, 0, 1);
			line-height: 56upx;
			background: rgba(255, 255, 255, 1);
			border: 3upx solid rgba(34, 42, 85, 1);
			border-radius: 56upx;
			position: relative;

			.luck-draw-icon {
				position: absolute;
				width: 38upx;
				height: 16upx;
				border: 1px solid #333;
			}

			.left-top-icon {
				left: 15upx;
				top: 6upx;
				border-right: 0;
				border-bottom: 0;
				border-top-left-radius: 50upx;
			}

			.right-bottom-icon {
				right: 10upx;
				bottom: 6upx;
				border-top: 0;
				border-left: 0;
				border-bottom-right-radius: 50upx;
			}
		}

		.tab-item.active {
			position: relative;
			color: #ffffff;
			background: rgba(250, 80, 61, 1);

			.luck-draw-icon {
				border-color: #ffffff;
			}
		}
	}

	.luck-draw-container {
		padding: 20upx 32upx;
		position: relative;

		.luck-draw-icon {
			position: absolute;

			border: {
				style: solid;
				width: 2upx;
				color: #000000;
			}
		}

		.left-top-icon {
			width: 42upx;
			height: 38upx;
			left: 20upx;
			top: 0;
			border-right: 0;
			border-bottom: 0;
			border-top-left-radius: 10upx;
		}

		.right-bottom-icon {
			width: 62upx;
			height: 56upx;
			right: 16upx;
			bottom: 0;
			border-left: 0;
			border-top: 0;
			border-bottom-right-radius: 10upx;
		}
	}
</style>
