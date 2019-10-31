<template>
	<!-- 评价列表页面 -->
	<view class="evaluate-list-wrapper">
		<view class="evaluate-list-area">
			<view class="border-side"></view>
			<view class="evaluate-list-field">
				<view class="evaluate-list" v-for="(item, index) in evaluateList" :key="index">
					<view class="evaluate-list-left">
						<image class="list-left-img" v-if="!item.frameUrl" :src="item.headPicUrl" mode=""></image>
						<!-- <image class="list-left-img" v-if="item.frameUrl" :src="item.headPicUrl" mode=""></image> -->
						<view class="left-level">LV<text class="left-level-num">{{ item.levelDataName }}</text></view>
					</view>
					<view class="evaluate-list-right">
						<view class="list-right-area-info">
							<view class="list-user-name">{{ item.nickname }}</view>
							<view class="list-comment-time">{{ item.evaluateTime | formatDate(4)}}</view>
						</view>
						<view class="list-right-area-star">
							<image class="star-img" v-for="(star, i) in item.imgArr" :key="i" :src="star" mode=""></image>
						</view>
						<view class="list-right-area-comment">
							{{ item.comment }}
						</view>
						<view class="list-right-area-pic" v-if="item.imgList">
							<view class="comment-show-pic" v-for="(pic, i) in item.imgList" :key="i">
								<image class="comment-show-img" :src="pic.imgUrl" mode="" @tap="clickBigPic(item.imgList, i)"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view>
			<uni-load-more :status="status" :content-text="contentText" />
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
				start: 1, // 查询起始页数
				len: 10, // 查询数量
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: 'Hi,这是我的底线啦！'
				},
				status: 'more', //上拉加载下拉刷新状态
				evaluateList: [], //返回数据集合数组
				picList: [], //图片集合
				token: "", // 用户标识
				activityId: "", //活动id
			}
		},
		onLoad(prams) {
			this.activityId = prams.activityId;
			// 获取token，没有跳转到登录页面
			this.token = this.$storage.isAuthed();
			//获取晒单评价的列表
			if (this.token) {
				let evaluateData = {
					token: this.token,
					activityId: this.activityId,
					start: this.start,
					len: this.len
				};
				this.getEvaluateData(evaluateData);
			}
		},
		onPullDownRefresh() {
			// console.log('下拉刷新');
			let evaluateData = {
				token: this.token,
				activityId: this.activityId,
				start: 1,
				len: this.len
			};
			this.getEvaluateData(evaluateData);
		},
		onReachBottom() {
			this.status = 'loading'
			// console.log('上拉加载');
			let evaluateData = {
				token: this.token,
				activityId: this.activityId,
				start: this.start,
				len: this.len
			};
			this.getEvaluateData(evaluateData);
		},
		methods: {
			clickBigPic(list, index) { // 点击评论处图片
				let imgList = [];
				list.forEach((item) => {
					imgList.push(item.imgUrl);
				});
				let current = imgList[index];
				uni.previewImage({
					current: current,
					urls: imgList
				});
			},
			getEvaluateData(data) { //获取评价列表的数据
				let that = this;
				this.$api.getEvaluateList(data).then(res => {
						res = res.data;
						if (res.code == '0001') {
							uni.stopPullDownRefresh();
							let resData = res.data;
							let msgList = resData.evaluateList;
							// that.evaluateList = msgList;
							if (that.start == 1) {
								that.evaluateList = msgList;
								that.evaluateList.forEach(function(item) {
									that.picList.push({
										imgList: item.imgList
									});
								});

							} else {
								that.evaluateList = that.evaluateList.concat(msgList);
								that.evaluateList.forEach(function(item) {
									that.picList.push({
										imgList: item.imgList
									})
								});
							}
							if (msgList.length >= 10) {
								that.start++;
								that.status = "more"
							} else if (msgList.length < 10) {
								that.status = "noMore"
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
			evaluateList() { //监听数组集合的发生改变
				for (let i = 0; i < this.evaluateList.length; i++) {
					let arr = [];
					for (let j = 0; j < this.evaluateList[i].mark; j++) {
						arr.push('../../static/evaluate_list/solid_star.png') //添加全星
					}
					for (let k = 0; k < 5- this.evaluateList[i].mark; k++) {
						arr.push('../../static/evaluate_list/hollow_star.png') //添加空星
					}
					this.$set(this.evaluateList[i],'imgArr',arr); //给原数组新增imgArr属性，属性值为数组arr
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.evaluate-list-wrapper {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		background-color: #fff;
	}

	.evaluate-list-area {
		width: 100%;
		height: inherit;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		position: relative;

		.border-side {
			width: 100%;
			height: 1upx;
			background-color: #F2F4F5;
			position: fixed;
			left: 0;
			top: 0;
		}

		.evaluate-list-field {
			width: 700upx;
			height: inherit;
			padding: 0 25upx;

			.evaluate-list {
				width: 100%;
				height: auto;
				border-bottom: 1upx solid #F2F4F5;
				display: flex;
				flex-direction: row;
				justify-items: flex-start;
			}
		}
	}

	.evaluate-list-left {
		width: 100upx;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;

		.list-left-img {
			display: block;
			width: 100upx;
			height: 100upx;
			margin-top: 40upx;
		}

		.circle-photo {
			display: block;
			width: 88upx;
			height: 88upx;
			margin-top: 40upx;
			border-radius: 50%;
		}

		.left-level {
			width: 90upx;
			height: 28upx;
			border-radius: 28upx;
			border: 1upx solid #FF911B;
			box-sizing: border-box;
			background-color: #FDF5E8;
			margin-top: 10upx;
			color: #FF911B;
			font-size: 20upx;
			line-height: 28upx;
			text-align: center;

			.left-level-num {
				color: #FF911B;
			}
		}
	}

	.evaluate-list-right {
		margin-left: 25upx;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		flex: 1;

		.list-right-area-info {
			width: 100%;
			height: 26upx;
			margin-top: 45upx;
			margin-bottom: 16upx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;

			.list-user-name {
				height: 26upx;
				line-heihgt: 26upx;
				color: #333;
				font-size: 26upx;
				font-family: PingFangSC-Regular;
				font-weight: 400;
			}

			.list-comment-time {
				height: 26upx;
				line-heihgt: 26upx;
				font-size: 24upx;
				color: #999;
				font-family: PingFangSC-Regular;
				font-weight: 400;

			}
		}
	}

	.list-right-area-star {
		width: 100%;
		height: 24upx;
		margin-bottom: 10upx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;

		.star-img {
			width: 24upx;
			height: 24upx;
			display: block;
			margin-right: 6upx;
		}
	}

	.list-right-area-comment {
		width: 100%;
		height: auto;
		margin-bottom: 20upx;
		font-size: 24upx;
		line-height: 32upx;
		color: #666;
		text-align: justify;
		font-family: PingFangSC-Regular;
		// overflow : hidden;
		// text-overflow: ellipsis;
		// display: -webkit-box;
		// -webkit-line-clamp: 2;
		// -webkit-box-orient: vertical;
	}

	.list-right-area-pic {
		width: 100%;
		height: auto;
		margin-bottom: 32upx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		flex-wrap: wrap;

		.comment-show-img {
			display: block;
			width: 174upx;
			height: 134upx;
			margin-right: 16upx;
			margin-bottom: 16upx;
		}
	}

	//遮罩层
	.mask {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background-color: #000;
		z-index: 50;
		transition: all 1s;
	}

	.close-btn {
		width: 60upx;
		height: 60upx;
		position: fixed;
		top: 40upx;
		right: 40upx;
		text-align: center;
		color: #F2F4F5;
		font-size: 40upx;
		line-height: 60upx;
		font-weight: bold;
		font-family: PingFangSC-Regular;
		border: 1upx solid #F2F4F5;
		box-sizing: border-box;
		border-radius: 50%;
		z-index: 52;
	}

	.click-big-pic {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 300upx;
		width: 200upx;
		min-height: 200upx;
		min-width: 200upx;
		width: 100%;
		height: 100%;
		z-index: 51;
	}

	.loading-text {
		height: 80upx;
		line-height: 80upx;
		font-size: 30upx;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}
</style>
