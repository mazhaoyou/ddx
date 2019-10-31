<template>
	<!-- 冠君头条页面 -->
	<view class="headline-news-wrapper">
		<!-- 一像素的顶部线开始 -->
		<view class="headline-news-area">
			<view class="border-side"></view>
		</view>
		<!-- 一像素的顶部线结束 -->
		<view class="headline-news-content">
			<view class="headline-news-title">
				<view class="headline-news-txt">
					冠君头条标题名称冠君头条标题名称冠君头条标题名称
				</view>
				<view class="headline-news-time">
					2018/12/28 14:30
				</view>
				<view class="headline-news-word-area">
					<rich-text :nodes="nodes"></rich-text>
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
				message_title: "", //消息标题
				content_url: "", //消息内容url
				send_time: "" ,// 发送时间
				nodes: ""
			}
		},
		onLoad() {
			
		},
		onReady() {
			
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	.headline-news-wrapper {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		flex: 1;
		background-color: #fff;
	}
	.headline-news-area {
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
	.headline-news-content {
		width: 100%;
		height: auto;
	}
	.headline-news-title {
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-content: center;
	}
	.headline-news-txt {
		width: 670upx;
		height: auto;
		margin: 0 auto;
		margin-top: 36upx;
		line-height: 48upx;
		font-size: 32upx;
		color: #333;
		font-family: PingFangSC-Medium;
		font-weight: 500;
		text-align: justify;
	}
	.headline-news-time {
		width: 670upx;
		height: 28upx;
		margin: 0 auto;
		margin-top: 28upx;
		font-size: 28upx;
		color: #999;
		line-height: 28upx;
		font-family: PingFangSC-Regular;
		font-weight: 400;
	}
	.headline-news-word-area {
		width: 670upx;
		height: 2000upx;
		margin: 0 auto;
		margin-top: 45upx;
	}
</style>
