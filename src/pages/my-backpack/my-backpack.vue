<template>
	<!-- 我的背包页面 -->
	<view class="my-backpack-wrapper">
		<!-- banner头部开始 -->
		<view class="header-banner-area"></view>
		<!-- banner头部结束 -->
		<!-- 背包区域开始 -->
		<view class="my-backpack-area">
			<view class="my-backpack-banner">
				<text class="banner-title">我的背包</text>
			</view>
			<view class="box">
				<view class="column">
					<text class="item"></text>
					<text class="item"></text>
				</view>
				<view class="column">
					<text class="item"></text>
					<text class="item"></text>
				</view>
			</view>
			
			<view class="my-backpack-list-area">
				<view class="my-backpack-list" v-for="(item, index) in itemList" :key="index">
					<view class="list-left">
						<image class="list-left-img" :src="item.itemPicUrl" mode=""></image>
					</view>
					<view class="list-middle">
						<view class="list-middle-top">{{item.itemName}} x<text class="list-middle-top-num">{{item.itemNum}}</text></view>
						<view class="list-middle-bottom">{{item.itemIntroduction}}</view>
					</view>
					<view class="list-right" @tap="handleBtnClick(index)">
						<text class="right-txt">{{btnArr[index]}}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 背包区域结束 -->
		
		<!-- 弹窗区域开始 -->
		<view>
			<neil-modal :show="isModalShow">
				<view class="modal">
					<view class="modal-bj" v-for="(item, index) in itemList" :key="index" v-if="item.isShow">
						<view class="modal-title">{{item.itemName}}</view>
						<view class="modal-content">
							<view class="modal-content-top">
								<view class="modal-content-img">
									<image class="modal-img-pic" :src="item.itemPicUrl" mode=""></image>
									<view class="modal-desc">{{item.itemName}} x<text class="modal-desc-num">{{item.itemNum}}</text></view>
								</view>
							</view>
							<view class="modal-txt1">{{item.itemDesc}}</view>
							<view class="btn-area">
								<view class="modal-btn1" @tap="closeModal(index)">{{btnTxt1[index]}}</view>
								<view class="modal-btn2" v-if="item.isBtnTxt2 == true" @tap="handleViewClick(index)">{{btnTxt2[index]}}</view>
							</view>
						</view>
					</view>
					
				</view>
			</neil-modal>
		</view>
		<!-- 弹窗区域结束 -->
		
	</view>
</template>

<script>
	import neilModal from '@/components/neil-modal/neil-modal.vue';

	export default {
		components: {
			neilModal
		},
		data() {
			return {
				isModalShow: false, // 弹窗的显示与否
				itemList: [], //数据列表
				btnArr: ["查看", "使用", "使用"],
				btnTxt1: ["我在想想", "关闭", "关闭"],
				btnTxt2: ["确定使用", "去补签", "去使用"],
				isBtnTxt2: "",
				token: "" // 用户的标识
			}
		},
		onLoad() {
			// 获取token，没有跳转到登录页面
			this.token = this.$storage.isAuthed();
			if(this.token) {
				let backPackData = { // 我的背包
					token: this.token
				};
				this.getBackPack(backPackData);
			}
		},
		methods: {
			getBackPack(data) { // 获取我的背包页面数据
				let that = this;
				// 获取缓存
				let myBackpack = that.$storage.getStorage('myBackpackList');
				this.itemList = myBackpack;
				this.$api.getMyBackpackPage(data).then(res => {
					res = res.data;
					if (res.code == '0001') {
						let myBackPackList = res.data;
						//对比缓存跟请求数据是否相同、如果不相等则重新缓存
						if(!that.$util.contrastArray(myBackPackList.itemList, myBackpack)) {
							that.itemList = myBackPackList.itemList;
							that.$storage.setStorage('myBackpackList', myBackPackList.itemList);
						}
						// that.itemList = myBackPackList.itemList;
						that.itemList.map((arr) => { //遍历数组对象
							that.$set(arr, "isShow", false);
							that.$set(arr, "isBtnTxt2", true)
						});
						that.isBtnTxt2 = that.$set(that.itemList[2], "isBtnTxt2", false);// 对第三条数据的弹窗里的按钮设置为fasle
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
			onNavigationBarButtonTap(e) { 
				// 添加自定义按钮 按钮的点击事件需要在页面监听onNavigationBarButtonTap事件
				if (e.index) {
					
				} else {
					//点击历史记录按钮执行的代码
					uni.navigateTo({
						url: '/pages/backpack-history/backpack-history'
					});
				}
			},
			handleBtnClick(index) { // 按钮显示弹窗与否
				this.isModalShow = !this.isModalShow
				for(var i = 0; i < this.itemList.length; i++) {
					if(index == i) {
						this.itemList[i].isShow = true
					} else {
						this.itemList[i].isShow = false
					} 
				}
			},
			closeModal(index) { // 关闭弹窗处的关闭按钮
				this.isModalShow = false
				this.itemList[index].isShow = false
			},
			handleViewClick(index) { //弹窗里的按钮点击事件
				switch(index) {
					case 0:
						uni.navigateTo({
							url: "../modify-name/modify-name"
						});
						this.isModalShow = false
						this.itemList[0].isShow = false
						break;
					case 1:
						uni.navigateTo({
							url: "../sign-in/sign-in"
						});
						this.isModalShow = false
						this.itemList[1].isShow = false
						break;
					case 2:
						this.isModalShow = false
						this.itemList[2].isShow = false
						return false;
						break;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.my-backpack-wrapper {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		background: linear-gradient(top, #6179f5, #66a8f6);
		background: -webkit-linear-gradient(top, #6179f5, #66a8f6);
	}

	// banner区域开始
	.header-banner-area {
		width: 100%;
		height: 525upx;
		background: url('~@/static/my_backpack/my_backpack_banner.png') no-repeat;
		background-size: 100% 100%;
		// margin-top: -88upx;
		position: relative;
		z-index: 5;
	}

	// banner区域结束
	// 背包区域开始
	.my-backpack-area {
		width: 700upx;
		height: auto;
		background-color: #1D48D7;
		border: 3upx solid #223B8D;
		box-sizing: border-box;
		border-radius: 32upx;
		box-shadow: 0upx -14upx 0upx 0upx rgba(3, 46, 185, 1) inset;
		margin: 0 auto;
		margin-top: -92upx;
		margin-bottom: 56upx;
		position: relative;
		z-index: 10;
		.box {
			width: 100%;
			height: 100%;
		    display: flex;
		    flex-wrap: wrap;
		    align-content: space-between;
			position: absolute;
		}

		.column {
			width: 100%;
			height: 22upx;
		    flex-basis: 100%;
		    display: flex;
		    justify-content: space-between;
			margin: 24upx 35upx;
			.item {
				width: 22upx;
				height: 22upx;
				border-radius: 50%;
				background-color: #93C4FE;
				border: 4upx solid #223B8D;
				box-sizing: border-box;
				
			}
		}
		.my-backpack-banner {
			width: 284upx;
			height: 94upx;
			background: url('~@/static/my_backpack/backpack_bj.png') no-repeat;
			background-size: 100% 100%;
			position: absolute;
			top: 0;
			left: 50%;
			transform: translateX(-50%);
			margin-top: -60upx;
			.banner-title {
				display: block;
				width: 100%;
				height: 94upx;
				line-height: 84upx;
				font-size: 44upx;
				color: #fff;
				font-weight: 500;
				text-align: center;
				font-family: PingFangSC-Medium;
				text-shadow: 0upx 1upx 0upx rgba(205,92,1,0.98);
			}
		}
		.my-backpack-list-area {
			width: 624upx;
			height: auto;
			margin: 0 auto;
			margin-top: 66upx;
			margin-bottom: 66upx;
			.my-backpack-list {
				width: 624upx;
				height: 164upx;
				margin-bottom: 24upx;
				border: 3upx solid #223B8D;
				border-radius: 32upx;
				box-sizing: border-box;
				background-color: #619DF9;
				box-shadow: 0upx -10upx 0upx 0upx #1369BE inset;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				position: relative;
				z-index: 15;
				.list-left {
					width: 112upx;
					height: 112upx;
					margin-left: 34upx;
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
					.list-left-img {
						width: 112upx;
						height: 112upx;
						display: inline-block;
					}
				}
				.list-middle {
					margin-left: 15upx;
					display: flex;
					flex-direction: column;
					justify-content: flex-start;
					flex: 1;
					.list-middle-top {
						margin-bottom: 14upx;
						font-family: PingFangSC-Medium;
						font-weight: 500;
						display: flex;
						flex-direction: row;
						justify-content: flex-start;
						align-content: center;
						color: #fff;
						text-shadow: 2upx 3upx 0upx rgba(45,65,186,0.99);
						.list-middle-top-num {
							padding-left: 10upx;
						}
					}
					.list-middle-bottom {
						color: #fff;
						height: 24upx;
						line-height: 24upx;
						font-size: 24upx;
						font-family: PingFangSC-Regular;
						font-weight: 400;
					}
				}
				.list-right {
					width: 148upx;
					height: 56upx;
					background: #48C7FF;
					border: 3upx solid #222A55;
					border-radius: 56upx;
					box-sizing: border-box;
					box-shadow: 0upx -6upx 0upx 0upx #1369BE inset;
					margin-right: 26upx;
					font-family: PingFang-SC-Bold;
					.right-txt {
						display: block;
						width: 100%;
						height: 56upx;
						line-height: 50upx;
						font-size: 24upx;
						text-align: center;
						font-weight: bold;
						color: #fff;
					}
				}
			}
		}
	}
	// 背包区域结束
	.madal {
		width: 588upx;
		height: auto;
		background: transparent;
		border-bottom-left-radius: 36upx;
		border-bottom-right-radius: 36upx;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}
	.modal-bj {
		width: 588upx!important;
		height: auto;
		position: relative;
		z-index: 200;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		.modal-title {
			width: 268upx;
			height: 85upx;
			background: url('~@/static/my_backpack/backpack_bj.png') no-repeat;
			background-size: 268upx 85upx;
			position: relative;
			z-index: 250;
			margin-bottom: -30upx;
			color: #fff;
			font-size: 44upx;
			line-height: 75upx;
			text-align: center;
			font-falily: PingFang-SC-Heavy;
			font-weight: 800;
		}
		.modal-content {
			width: 564upx;
			height: auto;
			background: #fff;
			box-shadow: 0upx -12upx 0upx 0upx rgba(53, 123, 235, 1) inset;
			border-radius: 36upx;
			position: relative;
			z-index: 50;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			align-items: center;
			.modal-content-top {
				width: 100%;
				height: 154upx;
				margin-top: 74upx;
				margin-bottom: 40upx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				.modal-content-img {
					width: 146upx;
					height: 154upx;
					background-color: #609DFF;
					border: 3upx solid #1F3B8E;
					box-sizing: border-box;
					box-shadow: 0upx -8upx 0upx 0upx #1369BE inset;
					border-radius: 10upx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
				}
			}
		}
	}
	.modal-img-pic {
		width: 65upx;
		height: 65upx;
		display: block;
		margin-bottom: 20upx;
	}
	.modal-desc {
		height: 28upx;
		line-height: 28upx;
		font-size: 28upx;
		color: #FFEA00;
		font-family: PingFangSC-Regular;
		font-weight: bold;
		-webkit-text-stroke: 2upx #253A81;
		text-stroke: 2upx #253A81;
	}
	.modal-txt1 {
		width: 450upx;
		margin: 0 auto;
		font-size: 32upx;
		line-height: 50upx;
		color: #1A488C;
		text-align: left;
		font-family: PingFangSC-Regular;
	}
	.modal-txt2 {
		width: 450upx;
		margin: 0 auto;
		font-size: 32upx;
		line-height: 50upx;
		color: #1A488C;
		text-align: left;
		font-family: PingFangSC-Regular;
	}
	.btn-area {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		
	}
	.modal-btn2 {
		width: 164upx;
		height: 60upx;
		background-color: #FFA200;
		border: 3upx solid #222A55;
		box-sizing: border-box;
		box-shadow: 0upx -6upx 0upx 0upx #D97407 inset;
		border-radius: 60upx;
		text-align: center;
		line-height: 54upx;
		color: #fff;
		margin: 35upx 42upx 60upx 42upx;
	}
	.modal-btn1 {
		width: 164upx;
		height: 60upx;
		background-color: #38ADFF;
		border: 3upx solid #222A55;
		box-sizing: border-box;
		box-shadow: 0upx -6upx 0upx 0upx #1369BE inset;
		border-radius: 60upx;
		text-align: center;
		line-height: 54upx;
		color: #fff;
		margin: 35upx 42upx 60upx 42upx;
	}
</style>
