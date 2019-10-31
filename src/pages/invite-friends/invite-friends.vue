<template>
	<!-- 我的邀请、邀请好友页面 -->
	<view class="invite-friends-wrapper">
		<!-- 邀请好友页面的顶部开始 -->
		<view class="status-bar-bar"></view>
		<view class="buy-bean-wrapper">
			<view class="bean-header-title">
				<view class="title-middle">邀请好友</view>
			</view>
		</view>
		<view class="invite-friends-main">
			<!-- <view class="main-top"></view> -->
			<view class="main-middle" @tap="immediateInvit(inviteInfo.rechargeBeanStatus,inviteInfo.inviteUrl)">
				立即邀请
				<view class="main-middle-left"></view>
			</view>
			<view class="score-top">
				<image src="../../static/invite/score_left.png" class="score-top-left"></image>
				<text class="score-desc">我的战绩</text>
				<image src="../../static/invite/score_right.png" class="score-top-right"></image>
			</view>
			<view class="score-content">
				<view class="score-content-left">
					<view class="content-left-top">{{inviteInfo.inviteCount}}</view>
					<view class="content-left-bottom">累计邀请好友</view>
				</view>
				<view class="score-content-middle"></view>
				<view class="score-content-right">
					<view class="content-right-left">
						<view class="content-right-top">{{inviteInfo.beanCount}}</view>
						<view class="content-right-bottom">累计获得福豆</view>
					</view>
					<view class="content-right-right">
						<view class="content-right-top">{{inviteInfo.expCount}}</view>
						<view class="content-right-bottom">经验值友</view>
					</view>
				</view>
			</view>
			<view class="score-top">
				<image src="../../static/invite/score_left.png" class="score-top-left"></image>
				<text class="score-desc">活动规则</text>
				<image src="../../static/invite/score_right.png" class="score-top-right"></image>
			</view>
			<view class="desc-content">
				<view class="desc-content-top">
					<view class="desc-word">
						<rich-text :nodes="inviteRulesList"></rich-text>
					</view>
				</view>
			</view>
		</view>
		<!-- 生成邀请好友海报开始 -->
		<view class="flex-row-c-c modalView" @touchmove.stop.prevent :class="qrShow?'show':''" @tap="hideQr()" >
			<view class="flex-column">
				<view class="backgroundColor-white  border-radius-10px">
					<image :src="poster.finalPath" mode="widthFix" class="posterImage"></image>
				</view>
				<view class="flex-row marginTop1vh">
					<view class="flex-row-btn" @tap.prevent.stop="saveImage()">保存图片</view>
					<view class="flex-row-btn" @tap.prevent.stop="share()">分享图片</view>
					<!-- <view class="close-modal" @tap="hideQr()">X</view> -->
				</view>
			</view>
		</view>
		<view class="hideCanvasView">
			<canvas class="hideCanvas" canvas-id="default_PosterCanvasId" :style="{width: (poster.width||0) + 'px', height: (poster.height||0) + 'px'}"></canvas>
		</view>
		<!-- 生成邀请好友海报结束 -->
	</view>
</template>

<script>
	import _app from '@/common/share-poster/app.js';
	import getSharePoster from '@/common/share-poster/QS-SharePoster.js';
	export default {
		components: {

		},
		data() {
			return {
				inviteInfo: {}, //邀请好友信息数据对象
				poster: {},
				qrShow: false, //控制海报显示影藏
				canvasId: 'default_PosterCanvasId', //canvasid
				inviteRulesList: '', //邀请规则
			}
		},
		onLoad() {
			let token = this.$storage.isAuthed();
			if (token) {
				var data = {
					token: token
				};
				this.getInviteInfo(data);
			}

			let ruleData = {
				informationType: 5
			}
			this.lookInviteRoules(ruleData);
		},
		methods: {
			/* 
			 * 立即邀请 
			 * rechargeBeanStatus 为0不可以邀请，1可以邀请
			 * */
			async immediateInvit(status, inviteUrl) {
				if (status == 0) {
					// 没有资格邀请
					uni.showToast({
						title: "您目前还没有邀请的资格，请达到要求后再试",
						icon: "none",
						duration: 2000
					})
				} else if (status == 1) {
					// 有资格邀请
					try {
						if (!this.poster.finalPath) {
							uni.showLoading({
								title: '加载中',
								mask: true
							});
							let _this = this;
							let d = await getSharePoster({
								type: 'testShareType',
								posterCanvasId: this.canvasId,
								qrCodeArray: (bgObj, type) => {
									return [{
										text: inviteUrl, //后台返回生成二维码地址
										image: 'https://wapceshi.paijl.com/pjlExternalLinks/img/login.png', //二维码中间logo
										size: 150,
										dx: 125,
										dy: 415
									}]
								},
								imagesArray: (bgObj, type) => { //接收的第一个参数为背景图片的信息, 第二个参数是自定义标识
									let dogUrl = '';
									let textUrl = '';
									let textDx = 0;
									// 由于部分图片在android与ios显示不相同需处理
									if (uni.getSystemInfoSync().platform == 'android') {
										dogUrl = 'https://wapceshi.paijl.com/pjlExternalLinks/img/dog.png'
										textUrl = 'https://wapceshi.paijl.com/pjlExternalLinks/img/back.png'
										textDx = 70;
									}

									if (uni.getSystemInfoSync().platform == 'ios') {
										dogUrl = '@/static/invite/dog.png'
										textUrl = '@/static/invite/back.png'
										textDx = 60;
									}
									return [{
											url: 'https://wapceshi.paijl.com/pjlExternalLinks/img/login.png', //海报logo
											dx: 70,
											dy: 80,
											circleSet: { // 圆形图片
												circle: false
											},
											infoCallBack(imageInfo) {
												let scale = 50 / imageInfo.height;
												return {
													dWidth: 50,
													dHeight: 50
												}
											}
										},
										{
											url: dogUrl, //背景logo
											dx: bgObj.width - 155,
											dy: 145,
											circleSet: { // 圆形图片
												circle: false
											},
											infoCallBack(imageInfo) {
												let scale = 1 / imageInfo.height;
												return {
													dWidth: 114,
													dHeight: 124
												}
											}
										},
										{
											url: textUrl, //背景墙文字
											dx: textDx,
											dy: 242,
											circleSet: { // 圆形图片
												circle: false
											},
											infoCallBack(imageInfo) {
												let scale = 130 / imageInfo.height;
												return {
													dWidth: imageInfo.width * scale,
													dHeight: 120
												}
											}
										}
									]
								},
								setCanvasWH: (bgObj, type) => { // 为动态设置画布宽高的方法，
									this.poster = bgObj;
								},
								setDraw: (obj) => {
									let {
										Context,
										bgObj,
										type
									} = obj;
									// 通过canvas画出海报上的文字及图片内容
									Context.setFillStyle('black');
									Context.setGlobalAlpha(0.3);
									Context.fillRect(0, 0, 0, 600);
									Context.setGlobalAlpha(1);
									Context.setFillStyle('white');
									let title = '小冠优选  游戏化电商'
									Context.setFontSize(22);
									Context.font = 'normal bold  PingFang-SC-Medium';
									Context.fillText(title, bgObj.width / 2 - 70, 100);
									let title1 = '优品甄选/创新会员机制/游戏购物'
									Context.setFontSize(15);
									Context.font = 'normal lighter  PingFang-SC-Medium';
									Context.fillText(title1, bgObj.width / 2 - 70, 125);
									// Context.setFontSize(45);
									// Context.strokeStyle = 'white';
									// Context.lineWidth = '5'
									// Context.strokeText("想多少钱买", bgObj.width / 2 - 100, 300);
									// Context.strokeText("你说了算！", bgObj.width / 2 - 100, 370);
									// 绘制二维码边框
									_this.drawRoundedRect(Context, 110, 400, 180, 180, 8, true, false)
									// 二维码底部文字
									let text1 = '长按图片识别二维码，'
									let text2 = '或进入应用商店搜索【小冠优选】'
									Context.setFontSize(20);
									Context.setFillStyle('white');
									Context.fillText(text1, bgObj.width - text1.length * 20 - 90, bgObj.height - 120);
									Context.fillText(text2, bgObj.width - text2.length * 20 - 50, bgObj.height - 90);
								}
							});
							this.poster.finalPath = d.poster.tempFilePath;
						}
						uni.hideLoading();
						// #ifdef APP-PLUS
							var currentWebview = this.$mp.page.$getAppWebview();
							currentWebview.setTitleNViewButtonStyle(0, {
							 "width": "0"
							});
						// #endif 
						this.qrShow = true;
					} catch (e) {
						_app.hideLoading();
						_app.showToast('加载图片失败');
						console.log(JSON.stringify(e));
					}
				}
			},
			/* 
			 * canvas 为海报画圆角矩形
			 *  */
			drawRoundedRect(ctx, x, y, width, height, r, fill, stroke) {
				ctx.save();
				ctx.beginPath();
				ctx.moveTo(x + r, y);
				ctx.arcTo(x + width, y, x + width, y + r, r);
				ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
				ctx.arcTo(x, y + height, x, y + height - r, r);
				ctx.arcTo(x, y, x + r, y, r);
				if (fill) {
					ctx.fill();
				}
				if (stroke) {
					ctx.stroke();
				}
				ctx.restore();
			},
			/* 
			 * 保存图片到本地 
			 * */
			saveImage() {
				let _this = this;
				uni.saveImageToPhotosAlbum({
					filePath: this.poster.finalPath,
					success(res) {
						_app.showToast('保存成功');
						_this.hideQr();
					}
				})
			},
			/* 
			 * 分享图片到第三方平台 
			 * */
			share() {
				// #ifdef APP-PLUS
				_app.getShare(false, false, 2, '', '', '', this.poster.finalPath, false, false);
				// #endif

				// #ifndef APP-PLUS
				_app.showToast('分享了');
				// #endif
			},
			/* 
			 * 隐藏海报 
			 * */
			hideQr() {
				this.qrShow = false;
				// #ifdef APP-PLUS
					var currentWebview = this.$mp.page.$getAppWebview();
					currentWebview.setTitleNViewButtonStyle(0, {
					 "width": "80"
					});
				// #endif 
			},
			/* 
			 * 获取邀请信息 
			 * */
			getInviteInfo(data) {
				let _this = this;
				this.$api.getInviteInfo(data)
					.then(res => {
						res = res.data;
						if (res.code == '0001') {
							_this.inviteInfo = res.data;
						}
					})
					.catch(err => {
						uni.showToast({
							title: "服务异常",
							icon: "none"
						})
					})
			},
			/*
			 * 查看抽奖规则
			 * */
			lookInviteRoules(data) {
				let _this = this;
				let inviteRoules = this.$storage.getStorage("inviteRoulesList", 2);
				_this.inviteRulesList = inviteRoules;
				this.$api.getInformation(data)
					.then(res => {
						res = res.data;
						if (res.code == '0001') {
							let rulesData = res.data;
							if (!_this.$util.contrastArray(rulesData.information, inviteRoules)) {
								_this.inviteRulesList = rulesData.information;
								_this.$storage.setStorage('inviteRoulesList', rulesData.information, 2);
							}
						} else {
							uni.showToast({
								title: res.message
							});
						}
					})
					.catch(err => {
						uni.showToast({
							title: '服务异常'
						});
					})
			},
		},
		onNavigationBarButtonTap(e) {
			//这个函数本身是有一个object类型的返回值的 。我用到的是object 当中的index 下标。 0为左侧的按钮 1为右侧的按钮
			
			if (e.index) {
				
			} else {
				//点击邀请记录按钮执行的代码
				uni.navigateTo({
					url: '../invite-history/invite-history'
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.invite-friends-wrapper {
		width: 100%;
		min-height: 100vh;
		background: #4a24a0 url('~@/static/invite/invite_bj.jpg') no-repeat;
		background-size: contain;
	}

	.status-bar-bar {
		height: var(--status-bar-height);
		background: transparent;
	}

	.buy-bean-wrapper {
		display: flex;
		justify-content: space-around;
		flex-direction: column;
		width: 100%;
		position: relative;

		.bean-header-title {
			width: 100%;
			// height: calc(49upx + var(--status-bar-height));
			height: 44upx;
			padding-top: 20upx;
			display: flex;
			align-items: center;
			display: flex;
			flex-direction: row;
			justify-content: center;
			text-align: center;
			color: #fff;

			.title-middle {
				font-size: 32upx;
				font-weight: 500;
			}
		}
	}

	.invite-friends-main {
		width: 100%;
		height: auto;
		margin-top: 540upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-content: center;
	}

	// .main-top {
	// 	width: 512upx;
	// 	height: 150upx;
	// 	margin-top: 95upx;
	// 	margin-bottom: 260upx;
	// 	background: url('~@/static/invite/main_top.png') no-repeat;
	// 	background-size: 512upx 150upx;
	// 	align-self: center;
	// }

	.main-middle {
		width: 480upx;
		height: 125upx;
		background: #FFEF1E;
		border-radius: 125upx;
		align-self: center;
		box-shadow: 0upx 7upx 8upx 1upx rgba(206, 32, 27, 0.33), 0upx -13upx 0upx 0upx rgba(253, 102, 46, 0.25) inset;
		text-align: center;
		font-size: 54upx;
		color: #B54223;
		line-height: 112upx;
		font-weight: bold;
		font-family: PingFang-SC-Heavy;
		margin-bottom: 72upx;
		position: relative;
	}

	.main-middle-left {
		width: 120upx;
		height: 50upx;
		background: url('~@/static/invite/main_top_left.png') no-repeat;
		background-size: 120upx 50upx;
		position: absolute;
		top: -10upx;
		left: 36upx;
	}

	.score-top {
		width: 100%;
		height: 32upx;
		line-height: 32upx;
		font-size: 32upx;
		color: #fff;
		text-align: center;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-content: center;
		margin-bottom: 30upx;
	}

	.score-desc {
		padding: 0 20upx;
	}

	.score-top-left {
		display: block;
		width: 37upx;
		height: 24upx;
		align-self: center;
	}

	.score-top-right {
		display: block;
		width: 37upx;
		height: 24upx;
		align-self: center;
	}

	.score-content {
		width: 671upx;
		height: 162upx;
		background: #6A46DE;
		border-radius: 20upx;
		align-self: center;
		box-shadow: 0upx 3upx 5upx 0upx rgba(74, 38, 161, 0.28), 0upx 6upx 9upx 0upx rgba(213, 213, 255, 0.31) inset;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-content: center;
		margin-bottom: 68upx;
	}

	.score-content-left {
		width: 335upx;
		height: 162upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-content: center;
	}

	.content-left-top {
		width: 100%;
		text-align: center;
		font-size: 60upx;
		line-height: 60upx;
		color: #fff;
		font-weight: bold;
		font-family: PingFang-SC-Bold;
		margin-bottom: 18upx;
	}

	.content-left-bottom {
		width: 100%;
		text-align: center;
		font-size: 24upx;
		line-height: 24upx;
		color: #D7CBFF;
		font-weight: 500;
		font-family: PingFang-SC-Bold;
	}

	.score-content-middle {
		width: 1upx;
		height: 80upx;
		background: url('~@/static/invite/score_content_middle.png') no-repeat;
		background-size: 1upx 80upx;
		align-self: center;
	}

	.score-content-right {
		width: 335upx;
		height: 162upx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-content: center;
	}

	.content-right-left {
		width: 50%;
		height: 162upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-content: center;
	}

	.content-right-top {
		width: 100%;
		text-align: center;
		font-size: 48upx;
		line-height: 60upx;
		color: #FBD502;
		font-weight: bold;
		font-family: PingFang-SC-Bold;
		margin-bottom: 18upx;
	}

	.content-right-bottom {
		width: 100%;
		text-align: center;
		font-size: 24upx;
		line-height: 24upx;
		color: #D7CBFF;
		font-weight: 500;
		font-family: PingFang-SC-Bold;
	}

	.content-right-right {
		width: 50%;
		height: 162upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-content: center;
	}

	.desc-content {
		width: 671upx;
		min-height: 200upx;
		background: #fff;
		border-radius: 20upx;
		align-self: center;
		margin-bottom: 66upx;
		box-shadow: 0upx 3upx 18upx 0upx rgba(65, 23, 160, 0.25), 0upx 5upx 0upx 0upx rgba(126, 232, 255, 0.17), 0upx 0upx 16upx 0upx rgba(115, 160, 253, 0.48) inset;
	}

	.desc-content-top {
		width: 531upx;
		min-height: 273upx;
		padding: 40upx 70upx;
		overflow-x: hidden;
		/*解决ios上滑动不流畅*/
		-webkit-overflow-scrolling: touch;
		word-wrap: break-word;
	}

	/*掩藏滚动条*/
	::-webkit-scrollbar {
		display: none !important;
	}

	.desc-word {
		line-height: 1.5;
		font-size: 30upx;
		font-family: PingFang-SC-Medium;
		font-weight: 500;
		color: #666;
		text-align: justify;
	}

	/* 生成邀请好友海报样式开始 */
	.hideCanvasView {
		position: relative;
	}

	.hideCanvas {
		position: fixed;
		top: -99999upx;
		left: -99999upx;
		z-index: -99999;
	}

	.flex-row-c-c {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		overflow-y: scroll !important;
	}

	.modalView {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
		outline: 0;
		transform: scale(3);
		perspective: 2500upx;
		background: rgba(0, 0, 0, 0.6);
		transition: all .3s ease-in-out;
		pointer-events: none;
		backface-visibility: hidden;
		z-index: 9999999;
	}

	.modalView.show {
		opacity: 1;
		transform: scale(1);
		pointer-events: auto;
	}

	.flex-column {
		display: flex;
		flex-direction: column;
	}

	.backgroundColor-white {
		width: 80vw;
	}


	.border-radius-10px {
		border-radius: 10px;
	}


	.posterImage {
		width: 100%;
		height: 100%;
		border-radius: 30upx;
	}

	.flex-row {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		position: relative;

		.flex-row-btn {
			background: #6A46DE;
			border-color: #6A46DE;
			padding: 0 40upx;
			height: 70upx;
			line-height: 70upx;
			border-radius: 70upx;
			font-size: 25upx;
			color: #fff;
		}

		.close-modal {
			position: absolute;
			left: 45%;
			bottom: -50upx;
			width: 50upx;
			height: 50upx;
			text-align: center;
			line-height: 50upx;
			border: 2upx solid #fff;
			border-radius: 50%;
			color: #fff;
		}
	}

	.marginTop1vh {
		margin-top: 1vh;
	}

	/* 生成邀请好友海报样式结束 */
</style>
