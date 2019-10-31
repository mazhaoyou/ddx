<template>
	<!-- 银豆明细页面-->
	<view class="container">
		<view class="silver-bean">
			<text class="silver-bean-name">银豆总数</text>
			<text class="silver-bean-num">{{ silverCount }}</text>
			<text class="silver-bean-tip">银豆领取后30天到期，到期当天23:59:59扣除银豆</text>
		</view>
		<view class="silver-bean-list" v-for="(item, index) in detailList" :key="index">
			<view class="silver-bean-list-num">{{ item.useableCount }}银豆</view>
			<view class="silver-bean-list-info">
				<text class="expiration-info" v-if="(item.endTime - item.createTime)<= 3 * 24 * 60 * 60 * 1000 && (item.endTime - item.createTime) >= 0">{{ item.createTime | getExpirationTime(item.endTime) }}</text>
				<text class="expiration-info-ac" v-else-if="(item.endTime - item.createTime) <= 10 * 24 * 60 * 60 * 1000 && (item.endTime - item.createTime) > 3 * 24 * 60 * 60 * 1000">{{ item.createTime | getExpirationTime(item.endTime) }}</text>
				<text class="expiration-info-last" v-else>{{ item.createTime | getExpirationTime(item.endTime) }}</text>
				<text class="expiration-time">{{ item.createTime | formatDate(1) }}</text>
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
			detailList: [], //明细列表
			silverCount: "", //银豆总数
			token: "" //用户的token
		};
	},
	onLoad() {
		// 获取token，没有跳转到登录页面
		this.token = this.$storage.isAuthed();
		if(this.token) {
			let silverDetailList = {
				token: this.token
			};
			this.getSilverDetailList(silverDetailList);
		};
	},
	onReady() {
		
	},
	methods: {
		getSilverDetailList(data) {
			//获取缓存
			let that = this;
			let silverDetail = that.$storage.getStorage('silverDetailList');
			this.detailList = silverDetail;
			this.$api.getSilverBeanDetailList(data).then(res => {
				res = res.data;
				if (res.code == '0001') {
					let detail = res.data;
					that.silverCount = detail.silverCount;
					// 对比缓存跟请求数据是否相同，如果不相等则重新缓存
					if (!that.$util.contrastArray(detail.detailList, silverDetail)) {
						that.detailList = detail.detailList;
						that.$storage.setStorage('silverDetailList', detail.detailList);
					}
				} else {
					uni.showToast({
						title: res.message,
						icon: 'none'
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

<style lang="scss">
.silver-bean {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin: 28upx;
	height: 214upx;
	padding: 20upx 0;
	background: linear-gradient(-90deg, rgba(116, 174, 255, 1) 0%, rgba(77, 159, 255, 1) 99%);
	border-radius: 20upx;
	&-name {
		font-size: 28upx;
		font-family: PingFang-SC-Medium;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		text-shadow: 0px 2upx 8upx rgba(49, 135, 255, 0.29);
	}
	&-num {
		font-size: 68upx;
		font-family: HelsinkiDEMO-Regular;
		font-weight: 400;
		color: rgba(255, 255, 255, 1);
		text-shadow: 0px 4px 13px rgba(49, 135, 255, 0.29);
		margin-top: 36upx;
	}
	&-tip {
		font-size: 24upx;
		font-family: PingFang-SC-Medium;
		font-weight: 500;
		color: rgba(254, 254, 254, 1);
		opacity: 0.5;
		margin-top: 30upx;
	}
}
.silver-bean-list {
	margin: 30upx  36upx 0 36upx;
	padding-bottom: 30upx;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	border-bottom: 2upx solid #f3f3f3;

	&-num {
		font-size: 32upx;
		font-family: PingFang-SC-Bold;
		color: rgba(51, 51, 51, 1);
	}
	&-info {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		.expiration-time {
			display: flex;
			justify-content:flex-end;
			margin-top: 16upx;
			font-size: 24upx;
			font-family: PingFang-SC-Medium;
			font-weight: 500;
			color: rgba(153, 153, 153, 1);
		}
		.expiration-info {
			display: flex;
			justify-content:flex-end;
			font-size: 24upx;
			font-weight: 500;
			color: rgba(250, 80, 61, 1);
		}
		.expiration-info-ac {
			display: flex;
			justify-content:flex-end;
			color: rgba(255, 145, 27, 1);
			font-size: 24upx;
		}
		.expiration-info-last {
			display: flex;
			justify-content:flex-end;
			color: rgba(153, 153, 153, 1);
			font-size: 24upx;
			
		}
	}
}

.silver-bean-list:nth-last-child(1) {
	border-bottom: 0;
}
</style>
