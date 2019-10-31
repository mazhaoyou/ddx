<template>
	<!-- 帮助页面 -->
	<view class="assist-wrapper">
		<!-- 帮助页面的轮播开始 -->
		<view class="banner-section" @click="openVirtual">
			<swiper class="banner-section-swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration" :circular="circular">
				<swiper-item class="banner-section-item" v-for="(item, index) in imgUrlList" :key="index">
					<image class="banner-img" :src="item.imgUrl" mode="scaleToFill"></image>
				</swiper-item>
			</swiper>
		</view>
		<!-- 帮助页面的轮播结束 -->
		<!-- 问题循环问题列表开始 -->
		<view class="" v-for="(item, index) in helpList" :key="index">
			<view class="order-problem">
				<view class="order-title">
					<image class="order-img" :src="item.faqTypeIcon" mode=""></image>
					<view class="order-txt">{{ item.faqTypeName }}</view>
				</view>
			</view>
			<view class="order-content-area">
				<view class="content-area">
					<view class="content-list">
						<view class="list-desc" v-for="(list, i) in item.issueList" :key="i">
							<uni-collapse  :accordion="true" @change="handleHelpClick(index, i)">
								<uni-collapse-item :title="list.question" :show-animation="true" :open="list.isOpen" :thumb="list.isOpen ? activeImg : thumb" :color="list.isOpen ? activeColor : color">
									<view style="padding: 20upx 0 20upx 70upx; line-height: 1.5; color: #999;">
										{{ list.answer }}
									</view>
								</uni-collapse-item>
							</uni-collapse>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 题循环问题列表结束 -->
		<!-- 底部区域开始 -->
		<view class="bottom-area">
			<view class="bottom-text">没有找到帮助</view>
			<view class="bottom-btn" @tap="customerPhone()">联系客服</view>
		</view>
		<!-- 底部区域结束 -->
		<!-- 买豆页面公司logo开始 -->
		<view class="company-area">
			<image class="company-logo" src="../../static/assist/company_logo.png" mode=""></image>
		</view>
		<!-- 买豆页面公司logo结束 -->
	</view>
</template>

<script>
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	
	export default {
		components: {
			uniCollapse,
			uniCollapseItem,
			uniList,
			uniListItem
		},
		data() {
			return {
				indicatorDots: false, // 是否显示面板指示点
				autoplay: true, // 是否自动切换
				interval: 3000, // 自动切换时间间隔
				duration: 500, // 滑动动画时长
				circular: true, // 是否采用衔接滑动
				imgUrlList: [
					{
						imgUrl: '../../static/buy_beans/bean_banner.jpg'
					},
					{
						imgUrl: '../../static/assist/header_banner.png'
					},
					{
						imgUrl: '../../static/buy_beans/bean_banner.jpg'
					}
				], // 轮播图的url
				thumb: "../../static/assist/problem.png",
				activeImg: "../../static/assist/problem_select.png",
				color: "#D3D3D3",
				activeColor: "#FF911B",
				helpList: [] ,//获取帮助的列表
			}
		},
		onLoad() {
			this.getHelpData();
		},
		methods: {
			getHelpData() { //获取帮助列表的数据
				let that = this;
				// 获得缓存
				let getHelpShow = that.$storage.getStorage('helpDataList');
				this.helpList = getHelpShow;
				this.$api.getHelpList().then(res => {
					res = res.data;
					if (res.code == '0001') {
						let resHelp = res.data;
						that.helpList.map((arr) => { // 遍历数组对象
							for(var j = 0; j < arr.issueList.length; j++) {
								that.$set(arr.issueList[j], "isOpen", false);
							}
						})	
						if(!that.$util.contrastArray(resHelp.typeList, getHelpShow)) {
							that.helpList = resHelp.typeList;
							that.$storage.setStorage('helpDataList', resHelp.typeList)
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
			},
			handleHelpClick(index, i) { // 对每一个手风琴效果的点击事件
				let helpData = this.helpList[index].issueList[i];
				this.$set(helpData, "isOpen", !helpData.isOpen);
			},
			customerPhone() { // 拨打客服电话
				let customPhone = this.$storage.getStorage('customerPhone',2);
				if('' != customPhone && null != customPhone && undefined != customPhone ) {
					uni.makePhoneCall({
						phoneNumber: customPhone  //仅为示例
					});
				}
			},
			openVirtual() { //进入虚拟场
				uni.navigateTo({
					url: "/pages/virtual-field/virtual-field"
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.assist-wrapper {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		background-color: #fff;
		position: relative;
	}
	//问题区域的开始
	.order-problem {
		width: 100%;
		height: 50upx;
		margin-bottom: 26upx;
		margin-top: 35upx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		.order-title {
			width: 700upx;
			height: 50upx;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			.order-img {
				display: inlne-block;
				width: 50upx;
				height: 50upx;
			}
			.order-txt {
				display: inline-block;
				height: 50upx;
				line-height: 50upx;
				margin-left: 16upx;
				font-size: 32upx;
				color: #333;
				font-weight: bold;
				font-family: PingFang-SC-Bold;
			}
		}
	}
	.order-content-area {
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: row;
		justify-content: center;
		.content-area {
			width: 700upx;
			height: inherit;
			border-radius: 4upx;
			background-color: #fff;
			box-shadow: 0upx -3upx 15upx 4upx rgba(226, 226, 226, 0.5);
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
		}
	}
	.content-list {
		width: 626upx;
		margin-top: 10upx;
		margin-bottom: 10upx;
		height: auto;
		align-self: center;
		.list-desc {
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			border-bottom: 2upx solid #F3F3F3;
		}
		
		.list-desc:nth-last-child(1) {
			border: 0;
		}
	}
	
	
	.uni-collapse:before {
		height: 0!important;
	}
	.uni-collapse:after {
		height: 0!important;
	}
	.change-color {
		color: #FF911B;
	}
	.bottom-area {
		width: 100%;
		height: auto;
		padding-top: 86upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		.bottom-text {
			width: 100%;
			height: 28upx;
			text-align: center;
			font-size: 28upx;
			color: #999;
			line-height: 28upx;
			margin-bottom: 30upx;
			font-family: PingFang-SC-Medium;
		}
		.bottom-btn {
			width: 420upx;
			height: 80upx;
			text-align: center;
			border-radius: 20upx;
			box-shadow: 0upx -7upx 0upx 0upx rgba(255, 0, 0, 0.2) inset;
			background: linear-gradient(left, #FF8E45, #F76253);
			background: -webkit-linear-gradient(left, #FF8E45, #F76253);
			font-size: 32upx;
			line-height: 80upx;
			color: #fff;
			font-weight: 800;
			align-self: center;
			margin-bottom: 70upx;
		}
	}
	//问题区域结束
	//公司logo标志开始
	.company-area {
		width: 100%;
		height: 78upx;
		display: flex;
		margin-bottom: 76upx;
		flex-direction: row;
		justify-content: center;
		align-content: center;
	}
	.company-logo {
		display: block;
		width: 400upx;
		height: 78upx;
	}
	//公司logo标志结束
	//轮播图的区域开始
	.banner-section {
		padding: 30upx 25upx 0 25upx;
		.banner-section-swiper {
			width: 700upx;
			height: 220upx;
			position: relative;
			z-index: 1;
			overflow: hidden;
			border-radius: 20upx;
			.banner-section-item {
				width: 100%;
				height: 220upx;
			}
		}
		.banner-img {
			width: 100%;
			height: 220upx;
			max-width: 100%;
			border-radius: 20upx;
			padding: 0;
			margin: 0;
			overflow: hidden;
		}
	}
	//轮播图区域结束
</style>
