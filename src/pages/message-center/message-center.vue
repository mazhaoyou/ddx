<template>
	<!-- 新的消息中心页面 -->
	<view class="new-message-center">
		<!-- 一像素的顶部线开始 -->
		<view class="message-center-area">
			<view class="border-side"></view>
		</view>
		<!-- 一像素的顶部线结束 -->
		<view class="new-message-center-wrapper">
			<view class="message-center-wrapper" @tap="handleInformClick()">
				<view class="message-center-img">
					<image class="inform-img" src="../../static/message_center/message_inform.png" mode=""></image>
				</view>
				<view class="message-center-word">
					<view class="message-center-title">
						站内通知
						<uni-badge class="badge-num" text="3" type="error" @click="bindClick"></uni-badge>
						<text class="inform-time">3分钟前</text>
					</view>
					<view class="inform-desc">
						小冠君提醒大家文明竞拍，竞拍不合规，豆豆两行小冠君提醒大家文明竞拍，竞拍不合规，豆豆两行小冠君提醒大家文明竞拍，竞拍不合规，豆豆两行小冠君提醒大家文明竞拍，竞拍不合规，豆豆两行小冠君提醒大家文明竞拍，竞拍不合规，豆豆两行小冠君提醒大家文明竞拍，竞拍不合规，豆豆两行小冠君提醒大家文明竞拍，竞拍不合规，豆豆两行小冠君提醒大家文明竞拍，竞拍不合规，豆豆两行小冠君提醒大家文明竞拍，竞拍不合规，豆豆两行小冠君提醒大家文明竞拍，竞拍不合规，豆豆两行
					</view>
					</view>
				</view>
				
				<view class="headline-content">
					<view class="headline-desc">
						<image class="headline-img" src="../../static/message_center/xinwen.png" mode=""></image>
						<view class="headline-title">冠君头条</view>
					</view>
				</view>
				<view class="headline-list-content" v-for="(item, index) in message_list" :key="index" @tap="handleliClick()">
					<view class="headline-li-content">
						<image class="headline-li-img" :src="item.type_img" mode=""></image>
						<view class="headline-li-word">
							<view class="headline-li-title">{{ item.message_title }}</view>
							<view class="headline-li-time">{{ item.message_time }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniBadge from "@/components/uni-badge/uni-badge.vue"
	
	export default {
		components: {
			uniBadge
		},
		data() {
			return {
				message_list: [
					{
						type_img: "../../static/message_center/timg.jpeg",
						message_title: "1冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称",
						message_time: "2019-05-21 12:15:54"
						
					},
					{
						type_img: "../../static/message_center/timg.jpeg",
						message_title: "2冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称",
						message_time: "2019-05-21 12:15:54"
					},
					{
						type_img: "../../static/message_center/timg.jpeg",
						message_title: "3冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称冠君头条名称",
						message_time: "2019-05-21 12:15:54"
					}
				]
			}
		},
		onLoad() {
			
		},
		onReady() {
			
		},
		methods: {
			handleInformClick() {
				uni.navigateTo({
					url: "../site-inform/site-inform"
				})
			},
			handleliClick() {
				uni.navigateTo({
					url: "../headline-news/headline-news"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.new-message-center {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		flex: 1;
		background-color: #F2F4F5;
	}
	.message-center-area {
		width: 100%;
		height: 1upx;
		background-color: #fff;
		display: flex;
		flex-direction: row;
		justify-content: cneter;
		align-items: center;
		position: relative;
		.border-side {
			width: 100%;
			height: 1upx;
			background-color: #F2F4F5;
			position: fixed;
			top: 0;
			left: 0;
		}
	}
	.new-message-center-wrapper {
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-content: center;
	}
	.message-center-wrapper {
		width: 700upx;
		height: auto;
		border-bottom: 1upx solid #F2F4F5;
		padding: 0 25upx;
		background-color: #fff;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-content: center;
	}
	.message-center-img {
		width: 105upx;
		height: auto;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-content: center;
		.inform-img {
			width: 105upx;
			height: 105upx;
			display: block;
			align-self: center;
		}
	}
	.message-center-word {
		flex: 1;
		margin-left: 24upx;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-content: center;
	}
	.message-center-title {
		height: 32upx;
		line-height: 32upx;
		margin-top: 60upx;
		margin-bottom: 24upx;
		color: #333;
		font-size: 32upx;
		font-weight: bold;
		font-family: PingFangSC-Medium;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-content: center;
		position: relative;
	}
	.inform-time {
		display: inline-block;
		color: #666;
		font-size: 24upx;
		line-height: 32upx;
		font-weight: 500;
		font-family: PingFangSC-Light;
	}
	.inform-desc {
		width: 560upx;
		height: auto;
		line-height: 36upx;
		font-size: 24upx;
		color: #666;
		font-family: PingFangSC-Light;
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		margin-bottom: 40upx;
	}
	.headline-content {
		height: 120upx;
		padding: 0 30upx;
		background-color: #F2F4F5;
	}
	.headline-desc {
		display: flex;
		flex-direction: row;
		align-content: flex-start;
		align-content: center;
		padding-top: 60upx;
	}
	.headline-img {
		width: 36upx;
		height: 36upx;
		display: block;
	}
	.headline-title {
		font-size: 32upx;
		line-height: 36upx;
		color: #333;
		font-family: PingFangSC-Medium;
		font-weight: bold;
		margin-left: 16upx;
	}
	.headline-list-content {
		width: 700upx;
		height: auto;
		margin: 0 auto;
	}
	.headline-li-content {
		width: 700upx;
		height: auto;
		margin: 0 auto;
		background-color: #fff;
		margin-bottom: 20upx;
		border-radius: 14upx;
		box-shadow: 0upx 6upx 25upx 0upx rgba(0, 0, 0, 0.05);
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-content: center;
	}
	.headline-li-img {
		display: block;
		width: 110upx;
		height: 80upx;
		align-self: center;
		margin-left: 24upx;
		margin-right: 16upx;
	}
	.headline-li-word {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-content: center;
	}
	.headline-li-title {
		width: 515upx;
		line-height: 42upx;
		font-size: 28upx;
		font-family: PingFang-SC-Medium;
		font-weight: bold;
		color: #666;
		margin-top: 55upx;
		margin-bottom: 20upx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	.headline-li-time {
		width: 515upx;
		line-height: 24upx;
		font-size: 24upx;
		font-family: PingFang-SC-Medium;
		font-weight: 500;
		color: #999;
		margin-bottom: 38upx;
		text-align: right;
	}
	.badge-num {
		position: absolute;
		top: -32upx;
		left: 130upx;
	}
</style>

