<template>
	<!-- 福利社页面 -->
	<view class="welfare-agency-wrapper">
		<!-- banner头部开始 -->
		<view class="header-banner-area"></view>
		<!-- banner头部结束 -->
		<!-- 常规任务开始 -->
		<view class="task-area">
			<text class="task-desc">常规任务</text>
			<image class="task-dog" src="../../static/welfare_agency/task_dog.png" mode=""></image>
		</view>
		<view class="" v-for="(item, index) in routineWork" :key="index">
			<view class="task-li-area" :class="index == 1 ? 'task-li-inviation' : ''">
				<view class="task-left-area">
					<image class="sign-in-img" :src="item.taskPic" mode=""></image>
				</view>
				<view class="task-middle-area">
					<view class="middle-top">
						<text class="middle-top-desc">{{ item.taskName }}</text>
						<view class="middle-top-sp">{{ item.gsDesc }}</view>
					</view>
					<view class="middle-bottom">
						<view class="middle-bottom-desc">
							{{ item.taskDesc }}
							<text v-if="item.shareuserCount != ''">{{ item.shareuserCount }}次，快去喊小伙伴加入吧</text>
						</view>
					</view>
				</view>
				<view class="task-right-area" @tap="routineClick(index)"><text class="right-txt">{{ routineArr[index] }}</text></view>
			</view>
		</view>
		<!-- 常规任务结束 -->
		<!-- 新手任务开始 -->
		<view class="new-area">
			<view class="new-area-mar">
				<view :class="{ tabview: true, act:activeIndex==2 }" @tap="handletab(1)"><text>新手任务</text></view>
				<view :class="{ tabviewReach: true, act1:activeIndex==2 }" @tap="handletab(2)"><text>达成福利</text></view>
			</view>
		</view>
		<!-- 新手任务结束 -->
		<!-- 新手任务的list区域开始 -->
		<view class="task-lists-group" v-if="activeIndex == 1">
			<view class="block-tap-left"></view>
			<view class="block-bottom-right"></view>
			<view class="progress-area">
				<view class="progress-aa"><text class="progress-text" :style="{ width: getWidthLength }"></text></view>
				<view class="task-progress">
					已完成
					<text class="complete-progress">{{ greenHandFC }}</text>
					/
					<text class="total-progress">{{ greenHandCount }}</text>
				</view>
			</view>
			<view class="task-li-area li-area" v-for="(item, index) in greenHandTask" :key="index">
				<view class="task-left-area">
					<image class="sign-in-img" :src="item.taskPic" mode=""></image>
				</view>
				<view class="task-middle-area">
					<view class="middle-top">
						<text class="middle-top-desc top-li-desc">{{ item.taskName }}</text>
						<view class="middle-top-sp">{{ item.gsDesc }}</view>
					</view>
					<view class="middle-bottom">
						<text class="middle-bottom-desc bottom-area-desc">{{ item.taskDesc }}</text>
					</view>
				</view>
				<view class="task-right-area task-right-color" :class="[item.taskStatus == '2' ? 'task-right-color-blue' : '', item.taskStatus == '1' ? 'task-right-color-pink' : '']">
					<!-- <text class="right-txt">{{ btnArr[index] }}</text> -->
					<text class="right-txt" :class="item.taskStatus == '2' ? 'style' : ''" @tap="handleBtnClick(item.taskStatus, index)"
					 v-text="greenHandT(item.taskStatus, index)"></text>
					<view class="right-mark" v-if="item.taskStatus == '1'"></view>
				</view>
			</view>
		</view>

		<view class="task-lists-group" v-if="activeIndex == 2">
			<view class="block-tap-left"></view>
			<view class="block-bottom-right"></view>
			<view class="progress-area">
				<view class="progress-aa"><text class="progress-text" :style="{ width: reachWidthLength }"></text></view>
				<view class="task-progress">
					已完成
					<text class="complete-progress">{{ reachFinishCount }}</text>
					/
					<text class="total-progress">{{ reachCount }}</text>
				</view>
			</view>
			<view class="task-li-area li-area" v-for="(item, index) in reachTask" :key="index">
				<view class="task-left-area">
					<image class="sign-in-img" :src="item.taskPic" mode=""></image>
				</view>
				<view class="task-middle-area">
					<view class="middle-top">
						<text class="middle-top-desc top-li-desc">{{ item.taskName }}</text>
						<view class="middle-top-sp">{{ item.gsDesc }}</view>
					</view>
					<view class="middle-centre" v-if="item.taskSchedule != '0' && item.taskCount != '1'">
						<view class="progress-bb">
							<text class="progress-text-middle" :style="{ width: item.reachSmallWidth }"></text>
							<text class="progress-num-percent">{{ item.taskSchedule }}/{{ item.taskCount }}</text>
						</view>
					</view>
					<view class="middle-bottom">
						<text class="middle-bottom-desc bottom-area-desc">{{ item.taskDesc }}</text>
					</view>
				</view>
				<view class="task-right-area task-right-color" :class="[item.taskStatus == '2' ? 'task-right-color-blue' : '', item.taskStatus == '1' ? 'task-right-color-pink' : '']">
					<!-- <text class="right-txt">{{ btnArr[index] }}</text> -->
					<text class="right-txt" :class="item.taskStatus == '2' ? 'style' : ''" @tap="handleReachClick(item.taskStatus, index)"
					 v-text="reachT(item.taskStatus, index)"></text>
					<view class="right-mark" v-if="item.taskStatus == '1'"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {

		},
		data() {
			return {
				activeIndex: '1', //tab选项卡的切换
				greenHandTask: [], //新手任务
				greenHandFC: "", //新手已完成任务
				greenHandCount: "", //新手总任务
				getWidthLength: "", //新手任务的长度
				btnArr: ["去完善", "去竞拍", "去充值", "去直购", "去认证", "去观看"],
				reachArr: ["去竞拍", "去竞拍", "去竞拍", "去竞拍", "去竞拍", "去竞拍"],
				routineArr: ["去签到", "分享"],
				reachTask: [], //达成福利
				reachFinishCount: "", //达成福利已完成任务
				reachCount: "", //达成福利总任务
				reachWidthLength: "", //达成福利任务的长度
				token: "", //用户的token
				routineWork: [], // 常规任务
				taskId: "" //任务id
			};
		},
		onLoad() {
			this.token = this.$storage.getStorage('token',2);
			/*
			获取福利社列表
			token：非必须 用户标识
			type：必须 任务类型 0 单次任务 1周期任务 2新手任务
			*/
			let greenHandData = { // 新手任务
				token: this.token,
				type: 2
			};
			this.getWelfareClub(greenHandData);
			let grooveData = { // 常规任务
				token: this.token,
				type: 1
			};
			this.getGrooveClub(grooveData);
			let reachData = { // 达成福利
				token: this.token,
				type: 0
			};
			this.getReachTask(reachData);
		},
		methods: {
			handletab(val) { //tab选项卡切换
				this.activeIndex = val;
			},
			greenHandT(status, index) { //新手任务按钮文字
				if (status === '1') {
					return '领取奖励'
				} else if (status === '2') {
					return '已领取'
				} else {
					return this.btnArr[index]
				}
			},
			reachT(status, index) { //达成福利按钮文字
				if (status === '1') {
					return '领取奖励'
				} else if (status === '2') {
					return '已领取'
				} else {
					return this.reachArr[index]
				}
			},
			getWelfareClub(data) { //新手任务
				//获取缓存
				let that = this;
				let newHandTask = that.$storage.getStorage('greenHandTask');
				this.greenHandTask = newHandTask;
				this.$api.getWelfareClubList(data).then(res => {
						res = res.data;
						if (res.code == '0001') {
							let newHand = res.data;
							// that.greenHandTask = newHand.taskList; //新手任务的列表数据
							// console.log(that.greenHandTask)
							for(let i = 0; i < that.greenHandTask.length; i++) {
								that.taskId = that.greenHandTask[i].taskId;
							}
							that.greenHandFC = newHand.finishCount; //新手任务已经完成的任务数
							that.greenHandCount = newHand.taskCount; //新手任务总的任务数
							that.getWidthLength = uni.upx2px((that.greenHandFC * 450) / that.greenHandCount) + "px"; //新手任务的长度占比
							// 对比缓存跟请求数据是否相同，如果不相等则重新缓存
							if (!that.$util.contrastArray(newHand.taskList, newHandTask)) {
								that.greenHandTask = newHand.taskList;
								that.$storage.setStorage('greenHandTask', newHand.taskList);
							}
						} else {
							uni.showToast({
								title: res.message,
								icon: 'none',
								duration: 3000
							});
						}
					})
					.catch(err => {
						uni.showToast({
							title: '服务异常',
							icon: 'none',
							duration: 3000
						});
					});
			},
			getGrooveClub(data) { //常规任务
				let that = this;
				//获取缓存
				let routineList = that.$storage.getStorage('routineList');
				that.routineWork = routineList;
				this.$api.getWelfareClubList(data).then(res => {
						res = res.data;
						if (res.code == '0001') {
							let routine = res.data;
							for(let i = 0; i < that.routineWork.length; i++) {
								that.taskId = that.routineWork[i].taskId;
							}
							// 对比缓存跟请求数据是否相同，如果不相等则重新缓存
							if (!that.$util.contrastArray(routine.taskListss, routineList)) {
								that.routineWork = routine.taskListss;
								that.$storage.setStorage('routineList', routine.taskListss);
							}
						} else {
							uni.showToast({
								title: res.message,
								icon: 'none',
								duration: 3000
							});
						}
					})
					.catch(err => {
						uni.showToast({
							title: '服务异常',
							icon: 'none',
							duration: 3000
						});
					});
			},
			getReachTask(data) { //达成福利
				let that = this;
				// 获得缓存
				let reachMission = that.$storage.getStorage('reachTask');
				that.reachTask = reachMission;
				this.$api.getWelfareClubList(data).then(res => {
						res = res.data;
						if (res.code == '0001') {
							let reach = res.data;
							for(let i = 0; i < that.reachTask.length; i++) {
								that.taskId = that.reachTask[i].taskId;
							}
							that.reachFinishCount = reach.finishCount; //达成福利已经完成的任务数
							that.reachCount = reach.taskCount; //达成福利总的任务数
							that.reachWidthLength = uni.upx2px((that.reachFinishCount * 450) / that.reachCount) + "px"; //达成福利的长度占比
							reach.taskLists.map((arr) => { //遍历数组对象
								let reachSmallfinC = arr.taskSchedule; // 达成福利子任务已完成任务
								let reachSmallCount = arr.taskCount; // 达成福利子任务总任务
								let reachSmallWidth = uni.upx2px((reachSmallfinC * 290) / reachSmallCount) + "px"; // 达成福利子任务的长度
								that.$set(arr, 'reachSmallWidth', reachSmallWidth);
							})
							//对比缓存跟请求数据是否相同，如果不相等则重新缓存
							if (!that.$util.contrastArray(reach.taskLists, reachMission)) {
								that.reachTask = reach.taskLists;
								that.$storage.setStorage('reachTask', reach.taskLists);
							}
						} else {
							uni.showToast({
								title: res.message,
								icon: 'none',
								duration: 3000
							});
						}
					})
					.catch(err => {
						uni.showToast({
							title: '服务异常',
							icon: 'none',
							duration: 3000
						});
					});
			},
			receiveTaskGift(data, index) { //领取奖励
				//获取缓存
				let that = this;
				this.$api.receiveTaskGift(data).then(res => {
						res = res.data;
						if (res.code == '0001') {
							that.reachTask[index].taskStatus = '2';
							that.greenHandTask[index].taskStatus = '2';
							let award = res.data;
							uni.showToast({
								title: '领取成功',
								icon: 'success',
								duration: 3000
							})
						} else {
							uni.showToast({
								title: res.message,
								icon: 'none',
								duration: 3000
							});
						}
					})
					.catch(err => {
						uni.showToast({
							title: '服务异常'
						});
					});
			},
			routineClick(index) { // 常规任务
				if (index == 0) {
					// 去签到的按钮显示弹窗与否
					uni.navigateTo({
						url: '../sign-in/sign-in',
						animationType: 'fade-in',
						animationDuration: 300
					});
				};
				if (index == 1) {
					uni.navigateTo({
						url: '../invite-friends/invite-friends',
						animationType: 'fade-in',
						animationDuration: 300
					});
				}
			},
			handleBtnClick(status, index) { // 新手任务的领取奖励
				if (status == '1') {
					let award = { // 领取奖励
						token: this.token,
						taskId: this.taskId
					};
					this.receiveTaskGift(award, index);
				} else if (status == '2') {
					return false;
				} else {
					switch (index) {
						case 0:
							uni.navigateTo({
								url: "../edit-information/edit-information"
							})
							break;
						case 1:
							uni.switchTab({
								url: "../auction/auction"
							})
							break;
						case 2:
							uni.switchTab({
								url: "../buy-beans/buy-beans"
							})
							break;
						case 3:
							uni.switchTab({
								url: "../auction/auction"
							})
							break;
						case 4:
							uni.navigateTo({
								url: "../real-name/real-name"
							})
							break;
						case 5:
							uni.navigateTo({
								url: "../welfare-explain/welfare-explain"
							})
							break;
					}
				}

			},
			handleReachClick(status, index) { //达成任务的领取奖励
				if (status == '1') {
					let award = { // 领取奖励
						token: this.token,
						taskId: this.taskId
					};
					this.receiveTaskGift(award, index);
				} else if (status == '2') {
					return false;
				} else {
					uni.switchTab({
						url: "../auction/auction"
					})
				}
			},
			onNavigationBarButtonTap() {
				// 添加自定义按钮 按钮的点击事件需要在页面监听onNavigationBarButtonTap事件
				uni.navigateTo({
					url: '../welfare-explain/welfare-explain'
				});
			}
		},
		computed: {}
	};
</script>

<style lang="scss" scoped>
	.welfare-agency-wrapper {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		background: linear-gradient(top, #6179f5, #66a8f6);
		background: -webkit-linear-gradient(top, #6179f5, #66a8f6);
		background-size: 100% 100%;
		overflow: hidden;
	}

	// banner区域开始
	.header-banner-area {
		width: 665upx;
		height: 288upx;
		background: url('~@/static/welfare_agency/header_banner.png') no-repeat;
		background-size: 100% 100%;
	}

	// banner区域结束
	// 常规任务开始
	.task-area {
		width: 100%;
		height: 218upx;
		margin-top: -88upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;

		.task-desc {
			width: 386upx;
			height: 86upx;
			background: url('~@/static/welfare_agency/title_back.png') no-repeat;
			background-size: 386upx 86upx;
			text-align: center;
			line-height: 86upx;
			font-size: 36upx;
			color: #fff;
			font-weight: bold;
			font-family: PingFang-SC-Bold;
			margin-left: 30upx;
			margin-top: 88upx;
		}

		.task-dog {
			width: 230upx;
			height: 218upx;
			display: inline-block;
			margin-right: 34upx;
			position: relative;
			z-index: 50;
		}
	}

	.task-li-area {
		width: 690upx;
		height: 166upx;
		margin-top: -34upx;
		border-radius: 36upx;
		position: relative;
		z-index: 100;
		background-color: rgba(255, 211, 1, 1);
		border: 3upx solid rgba(34, 59, 141, 1);
		box-shadow: 0upx -6upx 0upx 0upx rgba(249, 182, 0, 1) inset;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24upx;

		.task-left-area {
			width: 108upx;
			height: 108upx;
			margin-left: 20upx;
			background: url('~@/static/welfare_agency/task_left_bj.png') no-repeat;
			background-size: 100% 100%;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;

			.sign-in-img {
				width: 50upx;
				height: 50upx;
				display: inline-block;
			}
		}

		.task-middle-area {
			margin-left: 15upx;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			flex: 1;

			.middle-top {
				margin-bottom: 12upx;
				font-family: PingFang-SC-Bold;
				font-weight: bold;
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-content: center;

				.middle-top-desc {
					display: inline-block;
					height: 36upx;
					line-height: 36upx;
					font-size: 30upx;
					color: #0a3f88;
				}

				.middle-top-sp {
					display: inline-block;
					width: 105upx;
					height: 36upx;
					border-radius: 36upx;
					background-color: #475ee6;
					opacity: 0.86;
					filter: alpha(opacity=86);
					font-size: 20upx;
					color: #ffc300;
					text-align: center;
					line-height: 36upx;
					margin-left: 16upx;
				}
			}

			.middle-centre {
				width: 290upx;
			}

			.middle-bottom {
				font-family: PingFang-SC-Bold;

				.middle-bottom-desc {
					height: 22upx;
					line-height: 22upx;
					font-size: 22upx;
					color: #0a3f88;
					text-align: left;
					white-space: nowrap;
				}
			}
		}

		.task-right-area {
			width: 150upx;
			height: 60upx;
			background: #48C7FF;
			border: 3upx solid #222A55;
			border-radius: 60upx;
			box-sizing: border-box;
			box-shadow: 0upx -6upx 0upx 0upx #1369BE inset;
			margin-right: 26upx;
			font-family: PingFang-SC-Bold;
			position: relative;

			.right-txt {
				display: block;
				width: 100%;
				height: 60upx;
				line-height: 54upx;
				font-size: 28upx;
				text-align: center;
				font-weight: bold;
				color: #fff;
			}

			.right-mark {
				width: 16upx;
				height: 16upx;
				border-radius: 50%;
				background-color: #fbb40b;
				position: absolute;
				top: -4upx;
				right: 8upx;
			}
		}
	}

	.task-li-inviation {
		margin-top: 0;
		margin-bottom: 0;
	}

	//常规任务结束
	// 新手任务开始

	.reach-task {
		width: 268upx;
		height: 76upx;
		background: #ffa200;
		border: 3upx solid #222a55;
		border-radius: 76upx;
		box-sizing: border-box;
		box-shadow: 0upx -6upx 0upx 0upx #d97407 inset;
		color: #fff;
		font-family: PingFang-SC-Bold;
		line-height: 70upx;
		font-size: 36upx;
		text-align: center;
		margin: 0 70upx;
	}

	.progress-area {
		width: 100%;
		height: 94upx;
		border-top-left-radius: 8upx;
		border-top-right-radius: 8upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.task-progress {
		height: 28upx;
		font-size: 28upx;
		line-height: 28upx;
		color: #fff;
		margin-right: 33upx;

		.complete-progress {
			display: inline-block;
			margin-left: 10upx;
		}
	}

	.progress-box {
		width: 450upx;
		margin-left: 35upx;
	}

	.new-area {
		width: 100%;
		height: 86upx;
		margin-top: 43upx;
		margin-bottom: 30upx;
	}

	.new-area-mar {
		padding: 0 30upx;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-content: center;
	}

	.tabview {
		width: 384upx;
		height: 86upx;
		background: url('~@/static/welfare_agency/green_mask.png') no-repeat;
		background-size: 384upx 86upx;
		font-size: 36upx;
		line-height: 86upx;
		font-family: PingFang-SC-Bold;
		text-align: left;
		text-indent: 101upx;
		align-self: center;
		color: #fff;
		font-weight: bold;
		// margin-right: -20upx;
	}

	.act {
		width: 336upx;
		height: 78upx;
		background: url('~@/static/welfare_agency/unselect_green_mask.png') no-repeat;
		background-size: 336upx 78upx;
		font-size: 32upx;
		line-height: 78upx;
		font-weight: 500;
		font-family: PingFang-SC-Bold;
		text-align: left;
		text-ident: 78upx;
		align-self: center;
		color: #000;
		margin-right: 80upx;
	}

	.tabviewReach {
		width: 334upx;
		height: 78upx;
		background: url('~@/static/welfare_agency/unselect_reach_mask.png') no-repeat;
		background-size: 334upx 78upx;
		color: #000;
		align-self: center;
		font-size: 32upx;
		line-height: 78upx;
		font-weight: 500;
		font-family: PingFang-SC-Medium;
		text-align: left;
		text-indent: 121upx;
		margin-left: -24upx;
	}

	.act1 {
		width: 386upx;
		height: 86upx;
		background: url('~@/static/welfare_agency/reach_mask.png') no-repeat;
		background-size: 386upx 86upx;
		font-size: 36upx;
		color: #fff;
		font-weight: bold;
		line-height: 86upx;
		text-align: left;
		text-indent: 139upx;
		margin-left: -110upx;
	}

	// 新手任务结束
	//区块区域开始
	.block-tap-left {
		width: 42upx;
		height: 38upx;
		border-top-left-radius: 6upx;
		border-top: 1upx solid #000;
		border-left: 1upx solid #000;
		box-sizing: border-box;
		position: absolute;
		top: -14upx;
		left: -14upx;
	}

	.block-bottom-right {
		width: 42upx;
		height: 38upx;
		border-bottom-right-radius: 6upx;
		border-right: 1upx solid #000;
		border-bottom: 1upx solid #000;
		box-sizing: border-box;
		position: absolute;
		bottom: -14upx;
		right: -14upx;
	}

	//区块区域结束

	// 新手任务区域列表开始
	.task-lists-group {
		width: 687upx;
		height: auto;
		border-radius: 8upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 67upx;
		background-color: #4B63DA;
		box-shadow: 0upx 17upx 35upx 0upx rgba(36, 43, 106, 0.22) inset;
		position: relative;

		.li-area {
			width: 632upx;
			margin-top: 0;
			background: rgba(96, 157, 255, 1);
			border: 3upx solid rgba(34, 59, 141, 1);
			box-shadow: 0upx -6upx 0upx 0upx rgba(19, 105, 190, 1) inset;

			.top-li-desc {
				color: #fff !important;
			}

			.bottom-area-desc {
				color: #fff !important;
			}

			.task-right-color {
				background: #ffa200;
				border: 3upx solid #222a55;
				border-radius: 60upx;
				box-sizing: border-box;
				box-shadow: 0upx -6upx 0upx 0upx #d97407 inset;
			}

			.task-right-color-pink {
				background: #ff4d79;
				border: 3upx solid #222a55;
				border-radius: 60upx;
				box-sizing: border-box;
				box-shadow: 0upx -6upx 0upx 0upx #b22352 inset;
			}

			.task-right-color-blue {
				background: #5898ff;
				border: 3upx solid #222a55;
				border-radius: 60upx;
				box-sizing: border-box;
				box-shadow: 0upx -6upx 0upx 0upx #2c69d4 inset;
			}
		}
	}

	// 新手任务区域列表结束
	// 进度条样式开始
	.progress-aa {
		width: 450upx;
		height: 20upx;
		margin-left: 35upx;
		background-color: #e3e3e3;
		border-radius: 20upx;
		border: 2upx solid #243d8f;
		// box-sizing: border-box;
		overflow: hidden;
		position: relative;
	}

	.progress-text {
		display: inline-block;
		width: 50%;
		height: 20upx;
		border-radius: 20upx;
		position: absolute;
		top: 0;
		left: 0;
		background: #ff4d79;
		/* Old browsers */
		background: -moz-linear-gradient(135deg, #ff4d79 33%, #ec4465 34%, #ec4465 59%, #ff4d79 60%);
		/* FF3.6+ */
		background: -webkit-gradient(linear, left bottom, right top, color-stop(33%, #ff4d79), color-stop(34%, #ec4465), color-stop(59%, #ec4465), color-stop(60%, #ff4d79));
		/* Chrome,Safari4+ */
		background: -webkit-linear-gradient(135deg, #ff4d79 33%, #ec4465 34%, #ec4465 59%, #ff4d79 60%);
		/* Chrome10+,Safari5.1+ */
		background: -o-linear-gradient(135deg, #ff4d79 33%, #ec4465 34%, #ec4465 59%, #ff4d79 60%);
		/* Opera 11.10+ */
		background: -ms-linear-gradient(135deg, #ff4d79 33%, #ec4465 34%, #ec4465 59%, #ff4d79 60%);
		/* IE10+ */
		background: linear-gradient(135deg, #ff4d79 33%, #ec4465 34%, #ec4465 59%, #ff4d79 60%);
		/* W3C */
		filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#FF4D79', endColorstr='#FF4D79', GradientType=1);
		/* IE6-9 fallback on horizontal gradient */
		background-size: 60upx 20upx;
	}

	.progress-bb {
		width: 290upx;
		height: 16upx;
		background-color: #e3e3e3;
		border-radius: 20upx;
		margin-bottom: 12upx;
		border: 2upx solid #243d8f;
		// box-sizing: border-box;
		overflow: hidden;
		position: relative;
		text-align: center;
		color: #333;
		font-size: 16upx;
		line-height: 16upx;
	}

	.progress-text-middle {
		display: inline-block;
		width: 0upx;
		height: 16upx;
		border-radius: 16upx;
		position: absolute;
		top: 0;
		left: 0;
		background: #ffc300;
		/* Old browsers */
		background: -moz-linear-gradient(135deg, #ffc300 33%, #f6bc41 34%, #f6bc41 59%, #ffc300 60%);
		/* FF3.6+ */
		background: -webkit-gradient(linear, left bottom, right top, color-stop(33%, #ffc300), color-stop(34%, #f6bc41), color-stop(59%, #f6bc41), color-stop(60%, #ffc300));
		/* Chrome,Safari4+ */
		background: -webkit-linear-gradient(135deg, #ffc300 33%, #f6bc41 34%, #f6bc41 59%, #ffc300 60%);
		/* Chrome10+,Safari5.1+ */
		background: -o-linear-gradient(135deg, #ffc300 33%, #f6bc41 34%, #f6bc41 59%, #ffc300 60%);
		/* Opera 11.10+ */
		background: -ms-linear-gradient(135deg, #ffc300 33%, #f6bc41 34%, #f6bc41 59%, #ffc300 60%);
		/* IE10+ */
		background: linear-gradient(135deg, #ffc300 33%, #f6bc41 34%, #f6bc41 59%, #ffc300 60%);
		/* W3C */
		filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#FFC300', endColorstr='#FFC300', GradientType=1);
		/* IE6-9 fallback on horizontal gradient */
		background-size: 60upx 20upx;
	}

	.progress-num-percent {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		text-align: center;
		z-index: 5;
	}

	// 进度条样式结束
	//让div处于不可点击的状态
	.style {
		pointer-events: none;
	}
</style>
