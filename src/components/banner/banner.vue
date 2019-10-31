<template>
	<!-- 
	* 轮播页面 
	* imgUrl 轮播图url
	* jumpType 跳转类型 0无跳转 1内链 2外链
	* connectUrl 跳转链接
	* -->
	<view>
		<view class="banner-section">
			<swiper class="banner-section-swiper" indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
			 :duration="duration" :circular="circular">
				<swiper-item v-for="(item, index) in carouselList" :key="index" class="banner-section-item">
					<image :src="item.imgUrl" @tap="onClickItem(index,item.jumpType,item.connectUrl)"></image>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			carouselList: {
				type: Array,
				default () {
					return [];
				}
			}
		},
		data() {
			return {
				autoplay: true, //是否自动切换
				interval: 2000, //自动切换时间间隔
				duration: 500, //滑动动画时长
				circular: true, //是否采用衔接滑动
				current: 0, //当前所在滑块的 index
			}
		},
		methods: {
			onClickItem(index,type,url) {
				if(type == 1) {
					// 跳转到非tarBar页面
					uni.navigateTo({
						url: url
					})
				} else if(type == 2) {
					// 跳转到外部链接
					uni.navigateTo({
						url: '../../pages/banner-external-link/banner-external-link?externalLink=' + url
					})
				} else if(type == 3) {
					// 跳转到tabBar页面
					uni.switchTab({
						url: url
					})
				}
			},
		},
	}
</script>

<style lang="scss" scoped>
	/* banner */
	.banner-section {
		padding: 0 24upx;
		margin-top: -126upx;
		/*  #ifdef  APP-PLUS  */
		margin-top: calc(-126upx - var(--status-bar-height));
		/*  #endif  */
		box-sizing: border-box;
		width: 100%;
		height: 314upx;

		&-swiper {
			position: relative;
			height: 314upx;
			z-index: 1;
			overflow: hidden;
			border-radius: 10upx;
		}

		&-item {
			image {
				width: 100%;
				height: 314upx;
				max-width: 100%;
				border-radius: 10upx;
				padding: 0;
				margin: 0;
				overflow: hidden;
			}
		}
	}
</style>
