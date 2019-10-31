<!-- 
	name：我的
	developers：薛毅飞 
-->
<template>
	<view id="mine">
		<!-- 个人信息-start -->
		<image class="mine-background" src="../../static/mine/mine-background.png"></image>
		<view class="mine-info">
			<view class="mine-head-img" @tap="skipLogin">
				<image class="mine-portrait" :src="personalInfo.headPicUrl"></image>
				<image class="mine-portrait-box" :src="personalInfo.frameUrl"></image>
			</view>
			<view class="mine-info-describe">
				<view class="bean-number fortunella-venosa">
					<text>{{ beanInfo.goldCount }}</text>
					<view class="bean-name">
						<text>金豆</text>
						<image src="../../static/mine/gold_bean.png"></image>
					</view>
				</view>
				<view class="mine-info-middle">
					<view class="mine-nickname" @tap="handleEditInfo()">
						<text>{{ personalInfo.nickname }}</text>
						<image src="../../static/mine/nickname_editor.png"></image>
					</view>
					<view class="mine-progress">
						<view class="mine-level">{{ personalInfo.levelDataName }}</view>
						<view class="progress-total"><view class="progress-complete" :style="{ width: personalInfo.completeProgress + '%' }"></view></view>
						<text class="progress-desc">{{ personalInfo.completeProgress }}%</text>
					</view>
				</view>
				<view class="bean-number silver-bean">
					<text>{{ beanInfo.sliverCount }}</text>
					<view class="bean-name">
						<text>银豆</text>
						<image src="../../static/mine/silver_bean.png"></image>
					</view>
				</view>
			</view>
		</view>
		<!-- 个人信息-end -->
		<!-- 活动-start -->
		<view class="mine-grid-5 mine-activity">
			<view class="mine-grid-5-list" v-for="(item, index) in activityList" :key="index" @tap="intoActivity(index)">
				<image :src="item.url"></image>
				<view class="activity-mes">
					<text :class="{ 'have-mes': item.haveMes }">{{ item.title }}</text>
					<view class="mes-number" v-if="item.haveMes">{{ item.haveMes }}</view>
				</view>
			</view>
		</view>
		<!-- 活动-end -->
		<!-- 订单-start -->
		<view class="mine-title mine-order-title">我的订单</view>
		<view class="mine-grid-5 mine-order">
			<view class="mine-grid-5-list" v-for="(item, index) in orderList" :key="index" @tap="skipMyOrder(index)">
				<view class="order-mes">
					<image :src="item.url"></image>
					<view class="mes-number" v-if="item.haveMes">{{ item.haveMes }}</view>
				</view>
				<text>{{ item.title }}</text>
			</view>
		</view>
		<!-- 订单-end -->
		<image class="mine-activity-img" :src="activityImg"></image>
		<!-- 其他服务-start -->
		<view class="mine-title mine-other-services">其他服务</view>
		<view class="uni-grid-9 other-services">
			<view
				v-for="(item, index) in servicesList"
				:key="index"
				@tap="handleGridClick(item.linkUrl,item.name)"
				:hover-class="item.title ? 'uni-grid-9-item-hover' : ''"
				class="uni-grid-9-item"
			>
			<block v-if="item.name == 'real-name'">
				<image :src="verified == 1 ? verifyUrl : item.url" class="uni-grid-9-image"></image>
				<text class="uni-grid-9-text">{{ verified == 1 ?  verifName + '(已认证)': item.title  }}</text>
			</block>
			<block v-else>
				<image :src="item.url" class="uni-grid-9-image"></image>
				<text class="uni-grid-9-text">{{ item.title }}</text>
			</block>
			</view>
		</view>
		<!-- 其他服务-end -->
	</view>
</template>

<script>
import api from '@/common/http/index.js';
export default {
	data() {
		return {
			activityImg: '', //活动图
			verified: '', //实名认证状态
			verifyUrl:'../../static/mine/other_services8.png', //已实名图片
			verifName:'', //实名姓名
			// 个人信息
			personalInfo: {
				headPicUrl: '../../static/mine/head_portrait.png', //头像
				frameUrl: '../../static/mine/head_portrait.png', //头像框
				nickname: '', //昵称
				levelDataName: 0, //等级
				completeProgress: 0 //资料完成百分比
			},
			//我的活动
			activityList: [
				{
					url: '../../static/mine/mine-activity3.png',
					title: '正在拍',
					name: 'biddingCount'
				},
				{
					url: '../../static/mine/mine-activity4.png',
					title: '我拍中',
					name: 'wonCount'
				},
				{
					url: '../../static/mine/mine-activity5.png',
					title: '未拍中',
					name: 'failedCount'
				},
				{
					url: '../../static/mine/mine-activity2.png',
					title: '已关注',
					name: 'concernedCount'
				},
				{
					url: '../../static/mine/mine-activity1.png',
					title: '已委托',
					name: 'commissionedCount'
				}
			],
			//我的订单
			orderList: [
				{
					url: '../../static/mine/mine-order1.png',
					title: '待付款',
					name: 'notPay'
				},
				{
					url: '../../static/mine/mine-order2.png',
					title: '待发货',
					name: 'notDeliver'
				},
				{
					url: '../../static/mine/mine-order3.png',
					title: '待收货',
					name: 'notReceipt'
				},
				{
					url: '../../static/mine/mine-order4.png',
					title: '待评价',
					name: 'notComment'
				},
				{
					url: '../../static/mine/mine-order5.png',
					title: '全部订单'
				}
			],
			//其他服务
			servicesList: [
				{
					url: '../../static/mine/other_services1.png',
					title: '我的邀请',
					hoverClass: true,
					linkUrl: '../invite-friends/invite-friends',
					name: ''
				},
				{
					url: '../../static/mine/other_services2.png',
					title: '消息中心',
					hoverClass: true,
					linkUrl: '../site-inform/site-inform',
					name: ''
				},
				{
					url: '../../static/mine/other_services3.png',
					title: '客服电话',
					hoverClass: true,
					linkUrl: '',
					name: 'customer-phone'
				},
				{
					url: '../../static/mine/other_services4.png',
					title: '我的背包',
					hoverClass: true,
					linkUrl: '../my-backpack/my-backpack',
					name: ''
				},
				{
					url: '../../static/mine/other_services5.png',
					title: '收货地址',
					hoverClass: true,
					linkUrl: '../shipping-address/shipping-address',
					name: ''
				},
				{
					url: '../../static/mine/other_services6.png',
					title: '实名认证领福豆',
					hoverClass: true,
					linkUrl: '../real-name/real-name',
					name: 'real-name'
				},
				{
					url: '../../static/mine/other_services7.png',
					title: '荣誉成就',
					hoverClass: true,
					linkUrl: '../honor-achievement/honor-achievement',
					name: ''
				},
				{
					url: '',
					title: '',
					hoverClass: false,
					name: ''
				},
				{
					url: '',
					title: '',
					hoverClass: false,
					name: ''
				}
			]
		};
	},
	computed: {
		/* 福豆信息 */
		beanInfo() {
			return this.$store.state.beanInfo;
		}
	},
	onLoad() {
		this.getData();
	},
	methods: {
		handleEditInfo() {
			// 跳转编辑资料页面
			// 判断是否是登录状态
			let token  = this.$storage.isAuthed();
			if(token) {
				uni.navigateTo({
					url: '../edit-information/edit-information'
				});
			}
		},
		handleGridClick(url,type) {
			let _this = this;
			if('customer-phone' == type && '' == url) {
				let customPhone = _this.$storage.getStorage('customerPhone',2);
				if('' != customPhone && null != customPhone && undefined != customPhone ) {
					uni.makePhoneCall({
						phoneNumber: customPhone  //仅为示例
					});
				}
				return;
			} else if('real-name' == type && 1 == this.verified) {
				return;
			} else if('real-name' == type && 2 == this.verified) {
				uni.showToast({
					title: '对不起，您的实名认证未通过，请联系客服重新提交认证信息。客服电话：010-68000000',
					icon: 'none',
					duration: 2000
				})
				return;
			} else {
				// 判断是否是登录状态
				let token  = this.$storage.isAuthed();
				if(token) {
					uni.navigateTo({
						url: url
					});
				}
			}
			
		},
		skipLogin() {
			let token = this.$storage.getStorage('token',2);
			if(token) {
				// 跳转编辑资料页面
				uni.navigateTo({
					url: '../edit-information/edit-information'
				});
			} else {
				uni.navigateTo({
					url: '../login/login'
				})
			}
		},
		skipMyOrder(index) {
			const that = this;
			uni.setStorage({
				key: 'orderIndex',
				data: index
			});
			uni.navigateTo({
				url: '/pages/my-order/my-order',
				success(res) {
					that.orderList[index].haveMes = 0;
				}
			});
		},
		intoActivity(index) {
			//进入活动页
			const that = this;
			uni.setStorage({
				key: 'biddingIndex',
				data: index
			});
			uni.navigateTo({
				url: '/pages/my-bidding/my-bidding',
				success(res) {
					that.activityList[index].haveMes = 0;
				}
			});
		},
		getData() {
			this.getAdvertisingImg();
			this.getUserInfo();
		},
		getUserInfo() { // 获取用户信息
			const that = this;
			let data = {
				token: that.$store.isAuthed
			};
			api.getMyInfoList(data)
				.then(res => {
					uni.stopPullDownRefresh();
					res = res.data;
					if( res.code == "0001" ){
						res = res.data;
						that.personalInfo.nickname = res.nickname;
						that.personalInfo.headPicUrl = res.headPicUrl;
						that.personalInfo.frameUrl = res.frameUrl;
						that.personalInfo.levelDataName = res.levelDataName || that.personalInfo.levelDataName;
						that.personalInfo.completeProgress = res.experience || that.personalInfo.completeProgress;
						that.verified = res.verified;
						that.verifName = res.name;
						that.activityList.forEach(function(item, index){
							that.$set(item, 'haveMes', res[item.name]);
						});
						that.orderList.forEach(function(item, index){
							if( item.name ){
								that.$set(item, 'haveMes', res[item.name]);
							};
						});
					}else{
						uni.showToast({
							title: res.message,
							duration: 3000
						});
					};
				})
				.catch(err => {
					uni.stopPullDownRefresh();
					console.log('获取用户信息='+JSON.stringify(err));
				})
		},
		getAdvertisingImg() { // 获取广告图
			const that = this;
			let data = {
				aiType: 5
			};
			api.banner(data)
				.then(res => {
					res = res.data;
					if( res.code == "0001" ){
						res = res.data;
						that.activityImg = res.imgList[0].imgUrl;
					}else{
						uni.showToast({
							title: res.message,
							duration: 3000
						});
					};
				})
				.catch(err => {
					console.log('获取广告图='+JSON.stringify(err));
				})
		}
	},
	onPullDownRefresh() { //下拉刷新
		this.getData();
	},
	onTabItemTap(e) { //点击我的tab
		if( e.index == 4 ) this.getData();
	},
	onNavigationBarButtonTap(e) { //点击设置
		// 判断是否是登录状态
		let token  = this.$storage.isAuthed();
		if(token) {
			uni.navigateTo({
				url: '../setting/setting'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
#mine {
	background: $color-grey;
}
/* 我的-个人信息-start */
.mine-background {
	width: 100%;
	min-height: 242upx;
	height: calc(242upx + var(--status-bar-height));
	background: $color-white;
}
.mine-head-img {
	@include middle;
	position: relative;
	margin-top: -142upx;
	image {
		width: 166upx;
		height: 161upx;
	}
	.mine-portrait-box {
		position: absolute;
	}
}
.mine-info {
	border-bottom: 1px solid #f7f7f7;
	padding-bottom: 50upx;
	background: $color-white;
}
.mine-info-describe {
	display: flex;
	padding-top: 15upx;
}
.bean-number {
	width: 200upx;
	@include middle;
	flex-wrap: wrap;
	> text {
		width: 100%;
		font-size: $font-size-40;
		font-weight: bold;
		color: $color-orange;
		line-height: 68upx;
		text-align: center;
	}
}
.bean-name {
	@include middle;
	width: 100%;
	text {
		font-size: $font-size-28;
		font-weight: 500;
		color: $color-black;
		line-height: 35upx;
	}
	image {
		width: 25upx;
		height: 26upx;
		margin-left: 5upx;
	}
}
.mine-info-middle {
	width: 350upx;
}
.mine-nickname {
	@include middle;
	text {
		font-size: $font-size-32;
		font-weight: bold;
		color: $color-black;
		line-height: 47upx;
	}
	image {
		width: 21upx;
		height: 23upx;
		margin-left: 17upx;
	}
}
.mine-progress {
	position: relative;
	@include middle;
}
.mine-level {
	border: 1px solid #dc4900;
	font-size: $font-size-20;
	line-height: 30upx;
	color: $color-white;
	font-weight: bold;
	width: 30upx;
	height: 30upx;
	border-radius: 17upx;
	background: #fd7f25;
	box-shadow: -2upx -2upx 0upx #f76518 inset;
	position: relative;
	z-index: 2;
	right: -10upx;
	@include middle;
}
.progress-total {
	width: 90upx;
	height: 20upx;
	background: rgba(255, 202, 118, 1);
	border: 1px solid rgba(244, 148, 3, 0.91);
	border-radius: 0 11upx 11upx 0;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	margin-left: -2upx;
	position: relative;
	padding: 0 2upx 0 10upx;
	view {
		width: 0;
		height: 15upx;
		background: linear-gradient(90deg, rgba(255, 152, 42, 1), rgba(255, 127, 42, 1));
		border-radius: 0 8px 8px 0;
		transition: 1s;
	}
}
.progress-desc {
	font-size: $font-size-20;
	font-weight: 800;
	color: $color-orange;
	line-height: 47upx;
	margin-left: 10upx;
}
.uni-progress-bar,
.uni-progress-inner-bar {
	border-radius: 0 5px 5px 0;
}
.uni-progress-info {
	font-size: 20px;
	font-weight: 800;
	color: $color-orange;
	line-height: 47upx;
}
/* 我的-个人信息-end */
/* 我的活动-start */
.mine-grid-5 {
	display: flex;
	padding: 40upx 20upx 32upx;
	background: $color-white;
}
.mine-grid-5-list {
	flex: 1;
	box-sizing: border-box;
	position: relative;
	@include middle;
	flex-wrap: wrap;
	image {
		width: 82upx;
		height: 82upx;
	}
	text {
		width: 100%;
		height: 34upx;
		font-size: $font-size-24;
		font-weight: 500;
		color: $color-black;
		line-height: 34upx;
		text-align: center;
	}
	.activity-mes {
		width: 100%;
		position: relative;
		margin-top: 15upx;
		text-align: center;
	}
	.have-mes {
		background: rgba(255, 233, 179, 0.67);
		border-radius: 17upx;
		padding: 0 15upx;
	}
	.mes-number {
		position: absolute;
		width: 30upx;
		height: 30upx;
		background: rgba(229, 0, 18, 1);
		border-radius: 50%;
		font-size: $font-size-20;
		font-weight: 800;
		color: $color-white;
		line-height: 30upx;
		text-align: center;
	}
}
.mine-activity {
	margin-bottom: 17upx;
	.mes-number {
		top: -15upx;
		right: 10upx;
	}
}
/* 我的活动-end */
/* 我的订单-start */
.mine-title {
	font-size: $font-size-28;
	font-weight: 800;
	color: $color-black;
	line-height: 27upx;
	background: $color-white;
	padding: 26upx 0 0 26upx;
}
.mine-order {
	padding: 30upx 20upx 45upx;
	.mine-grid-5-list {
		image {
			width: 50upx;
			height: 50upx;
		}
		text {
			margin-top: 15upx;
		}
		.order-mes {
			position: relative;
			.mes-number {
				top: -5upx;
				left: -15upx;
			}
		}
	}
}
/* 我的活动-end */
.mine-activity-img {
	width: 100%;
	height: 152upx;
	display: block;
}
/* 其他服务-start */
.mine-other-services {
	padding-bottom: 14upx;
}
.other-services {
	background: $color-white;
}
.uni-grid-9 {
	border: 0;
}
.uni-grid-9-item {
	border-color: #f7f7f7;
}
.uni-grid-9-item-hover {
	background: #f1f1f1;
}
.uni-grid-9-item:nth-of-type(7),
.uni-grid-9-item:nth-of-type(8),
.uni-grid-9-item:nth-of-type(9) {
	border-bottom: 0;
}
.uni-grid-9-image {
	width: 80upx;
	height: 80upx;
}
.uni-grid-9-text {
	font-size: $font-size-26;
	font-weight: 500;
	color: $color-black;
	line-height: 1.5;
}
/* 其他服务-end */
</style>
