<template>
	<!-- 经验值记录页面 -->
	<view class="exp-history-wrapper">
		<!-- 经验值信息 -->
		<view class="info">
			<view class="info-exp">{{ experience }}<text>分</text></view>
			<view class="info-level">
				<view>
					<image src="../../static/honor-achievement/VIP.png"></image>
				</view>
				<view>
					当前级别：VIP{{ levelDataName }}
				</view>
			</view>
			<view class="EXP">
				<text>VIP{{ levelDataName }}</text>
				<view class="EXP-box">
					<view class="EXP-need" :style="{ width:styleLeft }"> <!-- 最少升级的经验值宽度 -->
						<view class="EXP-has" :style="{ width:expStyleLeft }"></view> <!-- 用户经验值的宽度 -->
					</view>
				</view>
				<text>VIP{{ nextLevel }}</text>
			</view>
			<view class="news">
				<view class="news-icon" :style="{ marginLeft:iconLeft }"></view> <!-- 三角的顶点的位置 -->
				<view class="news-text">
					经验值获取加速度{{ speedRatio }}%，<text>{{ levelNeed }}</text>分即可升级
				</view>
			</view>
		</view>
		<view class="expUl">
			<view class="exp-li" v-for="(item,index) in historyList" :key="index">
				<view class="exp-li-left">
					<text class="exp-title">{{expTypeList[item.expSourceType-1]}}</text>
					<text class="exp-time">{{item.expDate | formatDate(0)}}</text>
				</view>
				<view class="exp-li-right">+{{item.expSourceNum}}分</view>
			</view>
			<view>
				<uni-load-more :status="status" :content-text="contentText" />
			</view>
		</view>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				expStyleLeft: 0, // 用户经验值条的宽度
				styleLeft: 0, // 升级经验条的宽度
				iconLeft: 0, // 三角形角标的left值
				topleft: 0, // 用户经验值的left值
				levelDataName: "", //用户等级
				levelDataMost: "", //该级的最大经验值
				levelDataLeast: "", //达到该级需要的最少经验值
				levelNeed: "", //升级所需经验
				experience: "", //用户经验值
				speedRatio: "", //经验折扣
				nextLevel: "", //用户下一等级
				historyList: [], // 经验值列表
				expTypeList: ["每日签到", "充值", "竞拍", "直购", "分享订单", "邀请好友", "实名认证"], //经验来源类型
				token: "" ,//用户标识
				start: 1, //查询起始页数	
				len: 10, //查询数量
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: 'Hi,这是我的底线啦！'
				},
				status: 'more', //上拉加载下拉刷新状态
			}
		},
		onLoad() {
			// 获取token，没有跳转到登录页面
			this.token = this.$storage.isAuthed();
			if(this.token) {
				let getData = {
					token: this.token
				}
				this.getData(getData);
				let data = {
					token: this.token,
					start: this.start,
					len: this.len
				}
				this.getList(data);
			}
		},
		onPullDownRefresh() {
			// console.log('下拉刷新');
			let data = {
				token: this.token,
				start: 1,
				len: this.len
			};
			this.getList(data);
		},
		onReachBottom() {
			this.status = 'loading'
			// console.log('上拉加载');
			let data = {
				token: this.token,
				start: this.page,
				len: this.len
			};
			this.getList(data);
		},
		methods: {
			//获取页面的用户数据
			getData(data) {
				let that = this;
				this.$api.honor(data).then(res => {
					res = res.data
					if (res.code == "0001") {
						let info = res.data;
						that.experience = info.experience;
						that.levelDataName = info.levelDataName;
						that.nextLevel = info.nextLevel;
						that.speedRatio = info.speedRatio;
						that.levelNeed = info.levelNeed;
						that.levelDataMost = info.levelDataMost;
						that.levelDataLeast = info.levelDataLeast;
						
						let totalNeed = that.levelDataMost - that.levelDataLeast; //每一级总共需要的升级经验值
						let upNeed = that.levelNeed; //升级所需要的经验值
						let userExp = that.experience - that.levelDataLeast; //此时在进度条中的进度值的位置
						that.expStyleLeft = uni.upx2px((userExp * 500) / totalNeed) + 'px';//用户经验值条的宽度
						that.styleLeft = uni.upx2px((upNeed * 500) / totalNeed) + 'px';//升级经验条的宽度
						that.iconLeft =uni.upx2px((upNeed * 500) / totalNeed -14) + 'px'; // 三角形角标的left值
					} else {
						uni.showToast({
							title: res.message,
							icon: "none",
							duration: 2000
						});
					}
				})
				.catch(err => {
					uni.showToast({
						title: '服务异常',
						icon: "none",
						duration: 2000
					});
				})
			},
			getList(data) { // 经验值记录
				let that = this;
				let exp = that.$storage.getStorage('expHistory');
				if(that.start == 1) {
					that.historyList = exp;
				}
				this.$api.expList(data).then(res => {
					res = res.data;
					if (res.code == "0001") {
						uni.stopPullDownRefresh();
						let dataList = res.data;
						if(that.start == 1) {
							// 对比缓存跟请求数据是否相同、如果不想等则重新缓存
							if(!that.$util.contrastArray(dataList.expList, exp)) {
								that.historyList = dataList.expList;
								that.$storage.setStorage('expHistory', dataList.expList);
							}
						} else {
							this.historyList = that.historyList.concat(dataList.expList);
						}
						if(dataList.expList.length >= 10) {
							that.start++;
							that.status = "more";
						} else if (dataList.expList.length < 10) {
							that.status = "noMore"
						}
					} else {
						uni.showToast({
							title: res.message,
							icon: "none",
							duration: 2000
						});
					}
				})
				.catch(err => {
					uni.showToast({
						title: '服务异常',
						icon: "none",
						duration: 2000
					});
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.exp-history-wrapper {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		background: #fff;
		background-size: 100% 100%;
	}

	.info {
		width: 100%;
		height: 285upx;
		background: linear-gradient(180deg, rgba(255, 178, 4, 1), rgba(255, 177, 5, 1));

		.info-exp {
			margin-top: 50upx;
			font-size: 48upx;
			font-family: PingFang-SC-Bold;
			font-weight: bold;
			color: #FFFFFF;
			text-align: center;

			text {
				font-size: 24upx;
				font-family: PingFang-SC-Medium;
				font-weight: 500;
			}
		}

		.info-level {
			display: flex;
			flex-direction: row;
			margin: 15upx 0 35upx;

			view {
				font-size: 21upx;
				font-family: PingFang-SC-Regular;
				font-weight: 400;
				color: #fff;
				line-height: 21upx;
				height: 21upx;

				image {
					width: 21upx;
					height: 17upx;
					margin: 0 13upx 0 275upx;
				}
			}
		}

		.EXP {
			margin-left: 50upx;
			font-size: 24upx;
			font-family: PingFang-SC-Bold;
			font-weight: bold;
			color: #fff;
			display: flex;
			flex-direction: row;

			text {
				width: 60upx;
			}

			.EXP-box {
				width: 500upx;
				height: 24upx;
				background: #FDD753;
				border-radius: 12upx;
				overflow: hidden;
				margin: 0 15upx;

				.EXP-need {
					width: 400upx;
					height: 24upx;
					background: #EEEDED;
					position: relative;
					
					.EXP-has {
		
						display: inline-block;
						width: 0upx;
						height: 24upx;
						border-radius: 24upx;
						position: absolute;
						top: 0;
						left: 0;
						background: #ea8130;
						/* Old browsers */
						background: -moz-linear-gradient(135deg, #ea8130 33%, #e66c2b 34%, #e66c2b 59%, #ea8130 60%);
						/* FF3.6+ */
						background: -webkit-gradient(linear, left bottom, right top, color-stop(33%, #ea8130), color-stop(34%, #e66c2b), color-stop(59%, #e66c2b), color-stop(60%, #ea8130));
						/* Chrome,Safari4+ */
						background: -webkit-linear-gradient(135deg, #ea8130 33%, #e66c2b 34%, #e66c2b 59%, #ea8130 60%);
						/* Chrome10+,Safari5.1+ */
						background: -o-linear-gradient(135deg, #ea8130 33%, #e66c2b 34%, #e66c2b 59%, #ea8130 60%);
						/* Opera 11.10+ */
						background: -ms-linear-gradient(135deg, #ea8130 33%, #e66c2b 34%, #e66c2b 59%, #ea8130 60%);
						/* IE10+ */
						background: linear-gradient(135deg, #ea8130 33%, #e66c2b 34%, #e66c2b 59%, #ea8130 60%);
						/* W3C */
						filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#EA8130', endColorstr='#EA8130', GradientType=1);
						/* IE6-9 fallback on horizontal gradient */
						background-size: 60upx 24upx;
					}
				}
			}
		}

		.news {
			width: 500upx;
			height: 60upx;
			margin-top: 10upx;
			margin-left: 125upx;

			.news-icon {
				border-style: solid;
				border-width: 0 14upx 14upx 14upx;
				border-color: transparent transparent #FFFFFF transparent;
				opacity: 0.61;
				width: 0px;
				height: 0px;
				margin-left: -14upx;
			}

			.news-text {
				width: 490upx;
				height: 45upx;
				background: #fff;
				opacity: 0.61;
				border-radius: 23upx;
				margin-left: 5upx;
				text-align: center;
				font-size: 24upx;
				font-family: PingFang-SC-Medium;
				font-weight: 500;
				color: #FF5105;
				line-height: 45upx;

				text {
					font-weight: 600;
				}
			}
		}
	}

	.expUl {
		width: 100%;
		display: flex;
		flex-direction: column;

		.exp-li {
			padding: 0 40upx;
			height: 130upx;
			border-bottom: 1upx solid #F3F3F3;
			display: flex;
			flex-direction: row;

			.exp-li-left {
				width: 520upx;
				display: flex;
				flex-direction: column;

				.exp-title {
					font-size: 28upx;
					font-family: PingFang-SC-Medium;
					font-weight: 500;
					color: #333333;
					margin: 35upx 0 20upx;
				}

				.exp-time {
					font-size: 24upx;
					font-family: PingFang-SC-Medium;
					font-weight: 500;
					color: #999;
				}
			}

			.exp-li-right {
				width: 150upx;
				line-height: 130upx;
				text-align: right;
				font-size: 28upx;
				font-family: PingFang-SC-Bold;
				font-weight: bold;
				color: #FA503D;
			}
		}
	}
</style>
