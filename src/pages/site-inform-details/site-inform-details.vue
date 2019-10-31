<template>
	<view>
		<view class="details">
			<view class="details-title">
				{{messageTitle}}
			</view>
			<view class="details-time">
				{{sendTime | getFormatTime}}
			</view>
			<view class="details-content">
				{{messageContent}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				messageTitle: '', //标题
				messageContent: '', //内容
				sendTime: '', //发送
			};
		},
		onLoad(prams) {
			let messageId = prams.messageId;
			let messageNo = prams.messageNo;
			// 此处作为测试渲染，正式需要从后台调取详情接口渲染
			this.messageTitle = prams.messageTitle;
			this.messageContent = prams.messageContent;
			this.sendTime = prams.sendTime;

			let data = {
				messageNo: messageNo,
				id: messageId
			}
			// 获取站内通知消息详情
			this.getMessageDetail(data)
		},
		methods: {
			/*
			 *  获取站内通知消息详情
			 *  */
			getMessageDetail(data) {
				let _this = this;
				this.$api.getSystemMessageDetail(data)
					.then(res => {
						res = res.data;
						let message = res.message;
						if (res.code == '0001') {
							let detailList = res.data.list;
							// console.log(JSON.stringify(detailList));
							// _this.messageTitle = detailList.messageTitle;
							// _this.messageContent = detailList.messageContent;
							// _this.sendTime = detailList.sendTime;
							
						} else {
							uni.showToast({
								title: message,
								icon: 'none',
								duration: 2000
							})
						}
					})
					.catch(err => {
						uni.showToast({
							title: '服务异常',
							icon: 'none',
							duration: 2000
						});
					})
			}
		}
	}
</script>

<style lang="scss">
	.details {
		padding: 20upx;

		&-title {
			font-size: 32upx;
			font-family: PingFangSC-Medium;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
			line-height: 46upx;
		}

		&-time {
			margin: 20upx 0;
			font-size: 28upx;
			font-family: PingFangSC-Regular;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
		}

		&-content {
			font-size: 28upx;
			font-family: PingFangSC-Regular;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
			line-height: 48upx;
		}
	}
</style>
