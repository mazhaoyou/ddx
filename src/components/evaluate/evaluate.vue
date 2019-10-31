<template>
	<!-- 
	* 	竞拍商品评价
	* 	wux
	* 	evaluateListData 评论数据
	* 	evaluateCount 评论数量
	*  -->
	<view class="evaluate-container">
		<view class="evaluate-header" @tap="evaluateMore()" >
			<view>
				<text>评价</text>
				<text>({{evaluateCount}})</text>
			</view>
			<view class="evaluate-more" >
				更多
			</view>
		</view>

		<view class="evaluate-body" v-for="(item,index) in evaluateListData" :key="index" v-if="index<1">
			<view class="evaluate-body-portrait">
				<view class="portrait-box">
					<image lazy-load :src="item.headPicUrl" mode=""></image>
				</view>
				<view class="custom-level">
					LV{{item.levelDataName}}
				</view>
			</view>
			<view class="evaluate-body-content">
				<view class="evaluate-name-time">
					<text>{{item.nickname}}</text>
					<text>{{item.evaluateTime | formatDate(4)}}</text>
				</view>
				<view class="star-area">
					<image class="star-img" v-for="(star, i) in item.imgArr" :key="i" :src="star" mode=""></image>
				</view>
				<view class="evaluate-text">
					<text>{{item.comment}}</text>
				</view>
				<view class="evaluate-img">
					<view v-for="(item1,index) in item.imgList" :key="index">
						<image :src="item1.imgUrl" mode=""  @tap="clickBigPic(item.imgList, i)"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			evaluateListData: {
				type: Array,
				default() {
					return [];
				}
			},
			evaluateCount: {
				type:Number,
				default: 0
			},
			
		},
		data() {
			return {
              evaluateList:this.evaluateListData,
			  activityId:"0"
			}
		},
		onLoad(option) {
			this.activityId = option.activityId;
		},
		methods: {
			evaluateMore() {
				uni.navigateTo({
					url: '../../pages/evaluate-list/evaluate-list?activityId=' + this.activityId
				})
			},
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
		},
		watch: {
			evaluateListData() { //监听数组集合的发生改变
				for (let i = 0; i < this.evaluateListData.length; i++) {
					let arr = [];
					for (let j = 0; j < this.evaluateListData[i].mark; j++) {
						arr.push('../../static/evaluate_list/solid_star.png') //添加全星
					}
					for (let k = 0; k < 5- this.evaluateListData[i].mark; k++) {
						arr.push('../../static/evaluate_list/hollow_star.png') //添加空星
					}
					this.$set(this.evaluateListData[i],'imgArr',arr); //给原数组新增imgArr属性，属性值为数组arr
				}
			}
		}
	}
</script>

<style lang="scss">
	.evaluate-header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 32upx 50upx;
		border-bottom: 2upx solid #F2F4F5;

		>view:nth-child(1) {
			font-size: 32upx;
			font-family: PingFang-SC-Medium;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);

			>text:nth-last-child(1) {
				font-size: 32upx;
				font-family: PingFangSC-Regular;
				font-weight: 400;
				color: rgba(255, 145, 27, 1);
			}
		}

		.evaluate-more {
			display: inline-block;
			font-size: 24upx;
			line-height: 30upx;
			font-family: PingFangSC-Regular;
			font-weight: 400;
			color: rgba(102, 102, 102, 1);
			padding-right: 24upx;
			background: url('~@/static/auction/right_more.png') no-repeat center right;
			background-size: 20%;
		}
	}

	.evaluate-body {
		padding: 28upx 50upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;

		&-portrait {
			width: 112upx;

			.custom-level {
				width: 90upx;
				height: 24upx;
				line-height: 24upx;
				margin-top: 8upx;
				border: 1upx solid rgba(255, 145, 27, 1);
				border-radius: 12upx;
				font-size: 20upx;
				font-family: PingFangSC-Medium;
				font-weight: 500;
				color: rgba(255, 145, 27, 1);
				text-align: center;
				background-color: #FDF5E8;
			}
		}

		&-content {
			flex: 1;

			.evaluate-text {
				line-height: 36upx;
				font-size: 24upx;
				font-family: PingFangSC-Regular;
				font-weight: 400;
				color: rgba(102, 102, 102, 1);
			}
		}
	}

	.portrait-box {
		width: 100upx;
		height: 100upx;
		border-radius: 50%;

		image {
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}
	}

	.evaluate-name-time {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 12upx 0;

		>text:nth-child(1) {
			font-size: 28upx;
			font-family: PingFangSC-Regular;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
		}

		>text:nth-last-child(1) {
			font-size: 24upx;
			font-family: PingFangSC-Regular;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
		}
	}
	
	.star-area {
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


	.evaluate-img {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		view {
			margin: 16upx 10upx 16upx 0;
			image {
				max-width:176upx;
				height:134upx;
			}
		}
	}
</style>
