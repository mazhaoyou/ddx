<template>
	<!-- 关于我们页面 -->
	<view class="about-us-wrapper">
		<view class="border-top"></view>
		<!-- logo 区域开始 -->
		<view class="logo-area">
			<image class="logo-img" src="../../static/about_us/about_logo.png" mode=""></image>
		</view>
		<!-- logo 区域结束 -->
		<!-- 简介介绍开始 -->
		<view class="about-us-area">
			<view class="about-us-title">小冠优选</view>
			<view class="about-us-desc1">
				北京冠瑞通电子商务科技股份有限公司是一家新型互联网科技公司，公司以互联网相关技术开发、自有电子商务平台运营业务为主。公司依托自行研发的电子商务交易、大数据分析、人工智能监测及风险控制等领域的产品平台，建立面向电商企业、互联网消费者的服务平台。
			</view>
			<view class="about-us-desc2">
				2018年，冠瑞通公司倾力打造“小冠优选”趣味电商平台，旨在通过创新的技术和模式推动用户的消费体验和生活品质的双重升级。团队将“品质和趣味”的理念融入电商运营中，形成“以用户体验为核心”的电商思维。通过优品甄选、创新会员机制、游戏竞拍等丰富场景，开创了个人购物的全新应用模式，实现了娱乐性针对个人用户的购物的移动应用。“小冠优选”APP致力于为中高端用户提供更省心，更丰富，更有探索性的网购体验。
			</view>
		</view>
		<!-- 简介介绍结束 -->
		
	</view>
</template>

<script>

	export default {
		components: {
		},
		data() {
			return {
				
			};
		},
		onLoad() {},
		methods: {
			
		}
	};
</script>

<style lang="scss" scoped>
	.about-us-wrapper {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		background-color: #fff;
	}
	.border-top {
		width: 100%;
		border-top: 1upx solid #E5E5E5;
		position: fixed;
		top: 0;
		left: 0;
		box-sizing: border-box;
	}
	.logo-area {
		width: 100%;
		height: 226upx;
		margin-top: 114upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.logo-img {
			width: 226upx;
			height: 226upx;
			display: block;
		}
	}
	.about-us-area {
		margin-top: 65upx;
		margin-bottom: 262upx;
		padding: 0 40upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.about-us-title {
			width: 100%;
			height: 48upx;
			text-align: center;
			line-height: 48upx;
			color: #333;
			font-size: 48upx;
			font-family: PingFang-SC-Bold;
			font-weight: bold;
			margin-bottom: 45upx;
		}
		.about-us-desc1 {
			width: 100%;
			line-height: 46upx;
			font-size: 28upx;
			text-align: justify;
			text-justify: inter-ideograph;/*IE*/
			color: #666;
			text-indent: 40upx;
		}
		.about-us-desc2 {
			width: 100%;
			line-height: 46upx;
			font-size: 28upx;
			text-align: justify;
			text-justify: inter-ideograph;/*IE*/
			color: #666;
			text-indent: 40upx;
			margin-top: 50upx;
		}
	}
</style>
