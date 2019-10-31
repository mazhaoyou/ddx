<template>
	<!-- 修改昵称页面 -->
	<view class="safe-message-wrapper">
		<!-- 顶部导航条开始 -->
		<uni-nav-bar left-icon="back"
			@click-left="back"
			title="修改昵称"
			background-color="-webkit-linear-gradient(left, #FFB709, #FE9402);linear-gradient(left, #FFB709, #FE9402)"
			color="#fff"
			fixed="true"
		>
		</uni-nav-bar>
		<!-- 顶部导航条结束 -->
		<!-- 输入框区域开始 -->
		<view class="safe-message-bj"></view>
		<view class="safe-message-content">
			<view class="safe-desc">您现在的昵称是：</view>
			<view class="safe-iphone">{{ modifyName }}</view>
			<input class="code-area" type="text" maxlength="8" placeholder="请输入新的昵称" placeholder-class="iphone-placeholder" v-model="newNickname"/>
			<button class="uni-button next-step"
				@tap="confirmModify()"
				:class="{activeBtn : btnShow}"
				:disabled="isNextSend"
			>
				确定
			</button>
		</view>
		<!-- 输入框区域结束 -->
		
		<view>
			<neil-modal :show="sensWordsFlag">
				<view class="modal">
					<view class="edit-modal-txt">本平台将不定期筛查用户昵称，如发现有使用侮辱性词汇或违反《使用协议》的情况，将对当事人予以处罚</view>
					<view class="edit-btn-area">
						<view class="edit-btn-left" @tap="cancelRename()">取消</view>
						<view class="edit-btn-right" @tap="confConsuRename()">确定</view>
					</view>
				</view>
			</neil-modal>
		</view>
		<!-- 问题区域开始 -->
		<view class="login-txt2" @tap="customerPhone()"  >遇到问题？请<text class="login-sp2">联系客服</text></view>
		<!-- 问题区域结束 -->
	</view>
</template>

<script>
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue'
	import uniIcon from '@/components/uni-icon/uni-icon.vue'
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	
	export default {
		components: {
			uniNavBar,
			uniIcon,
			neilModal
		},
		data() {
			return {
				modifyName: '',
				newNickname: "",
				btnShow: false,// 按钮下一步的颜色高亮
				sensWordsFlag: false,//敏感词变量
				isNextSend: true ,// 控制下一步的按钮是否可点击
				itemId:'',//改名卡id
			};
		},
		onLoad(prams) {
			this.modifyName = prams.nickName;
			this.itemId = prams.itemId;
			
		},
		methods: {
			/* 
			* 点击返回键 
			* */
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			/* 
			* 点击确定去修改 
			* */
			confirmModify(){
				this.sensWordsFlag = true;
			},
			/* 
			* 点击最终确认修改昵称
			*  */
			confConsuRename() {
				uni.showLoading({
					title: '正在修改',
					mask: true
				});
				// 获取token，没有跳转到登录页面
				let token = this.$storage.isAuthed();
				let _this = this;
				if(token) {
					let data = {
						token: token,
						nickname: _this.newNickname,
						itemId: _this.itemId,
						type: 1
					}
				
					_this.$api.setNickname(data)
						.then(res => {
							uni.hideLoading();
							res = res.data;
							let message = res.message;
							if(res.code == '0001') {
								uni.showToast({
									title: message,
									icon: 'success',
									duration: 2000
								});
								this.$storage.setStorage('nickName',this.newNickname,2);
								uni.redirectTo({
									url: '../edit-information/edit-information?newNickname=' + this.newNickname
								})
							} else {
								uni.showToast({
									title: message,
									icon: 'none',
									duration: 2000
								});
							}
						})
						.catch(err => {
							uni.hideLoading();
							uni.showToast({
								title: '服务异常',
								icon: 'none',
								duration: 2000
							});
						});
				}
			},
			/* 
			* 点击取消修改昵称 
			* */
			cancelRename(){
				this.sensWordsFlag = false;
			},
			/* 
			* 拨打客服电话 
			* */
			customerPhone() {
				let customPhone = this.$storage.getStorage('customerPhone',2);
				if('' != customPhone && null != customPhone && undefined != customPhone ) {
					uni.makePhoneCall({
						phoneNumber: customPhone  //仅为示例
					});
				}
			}
		},
		watch: {
			newNickname() { // 对新名字进行校验
				var reg = /^[\u4E00-\u9FA5A-Za-z0-9_]{2,8}$/;
				if (reg.test(this.newNickname)) {
					this.btnShow = true
					this.isNextSend = false
				} else {
					this.btnShow = false
					this.isNextSend = true
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.safe-message-wrapper {
		width: 100%;
		min-height: 592upx;
		height: calc(592upx + var(--status-bar-height));
		z-index: -1;
		&:after {
			content: '';
			width: 100%;
		    height: calc(592upx + var(--status-bar-height));
			height: 592upx;
			position: absolute;
			top: 0;
			right: 0;
			z-index: -1;
			border-radius: 0 0 10% 10%;
			background: linear-gradient(left, #FFB709, #FE9402);
			background: -webkit-linear-gradient(left, #FFB709, #FE9402);
		}
	}
	// 输入框区域开始
	.safe-message-bj {
		height: 100%;
		margin: 32upx 15upx 0 15upx;
		background: url('~@/static/message_verify/message_verify.png') no-repeat;
		background-size: 730upx 574upx;
	}
	.safe-message-content {
		width: 690upx;
		height: 600upx;
		background: #fff;
		border-radius: 8upx;
		position: relative;
		margin: 0 auto;
		margin-top: -390upx;
		box-shadow:2px 2px 14px 0px rgba(191, 191, 191, 0.46);
		.safe-desc {
			height: 32upx;
			line-height: 32upx;
			color: #666;
			font-size: 32upx;
			padding-top: 90upx;
			padding-left: 32upx;
		}
		.safe-iphone {
			height: 32upx;
			line-height: 32upx;
			color: #666;
			font-size: 32upx;
			padding-top: 40upx;
			padding-left: 32upx;
		}
	}
	
	.code-area {
		width: 622upx;
		height: 86upx;
		border-radius: 86upx;
		border: 1upx solid #E5E5E5;
		box-sizing: border-box;
		font-size: 32upx;
		line-height: 86upx;
		margin: 0 auto;
		margin-top: 96upx;
		padding-left: 26upx;
		.uni-button:after {
			border: none;
		}
	}
	.iphone-placeholder {
		height: 86upx;
		text-align: left;
		font-size: 32upx;
		color: #e5e5e5;
		line-height: 86upx;
		box-sizing: border-box;
	}
	.safe-pwd-txt {
		height: 28upx;
		padding-left: 32upx;
		color: #FF911B;
		text-align: left;
		line-height: 32upx;
		margin-top: 36upx;
	}
	.next-step {
		width: 620upx;
		height: 84upx;
		background-color: #E5E5E5;
		border-radius: 84upx;
		border: none;
		color: #999;
		line-height: 84upx;
		text-align: center;
		margin-top: 60upx;
	}
	.activeBtn {
		color: #fff;
		background: linear-gradient(left, #FFB709, #FE9402);
		background: -webkit-linear-gradient(left, #FFB709, #FE9402);
	}
	.uni-button:after {
		border: none;
	}
	uni-button[disabled][type=primary] {
		background-color: #E5E5E5;
	}
	// 问题区域开始
	.login-txt2 {
		width: 100%;
		height: 24upx;
		padding-top: 300upx;
		padding-bottom: 240upx;
		line-height: 24upx;
		color: #666666;
		font-size: 24upx;
		text-align: center;
		.login-sp2 {
			display: inline-block;
			padding-left: 10upx;
			color: #FA503D;
		}
	}
	// 问题区域结束
	
	// 修改昵称弹窗样式开始
	.modal {
		width: 626upx;
		height: 312upx;
		background-color: #fff;
		border-radius: 16upx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-content: center;
	}
	
	
	.edit-modal-txt {
		width: 532upx;
		margin: 0 auto;
		line-height: 42upx;
		font-size: 28upx;
		font-family: PingFang-SC-Medium;
		color: #333;
		font-weight: 500;
		text-align: center;
		padding-top: 20upx;
	}
	
	.edit-btn-area {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-content: center;
		padding: 20upx 0;
	}
	
	.edit-btn-left {
		width: 240upx;
		height: 80upx;
		background-color: #F5F5F5;
		color: #999;
		text-align: center;
		line-height: 80upx;
		border-radius: 80upx;
		margin-left: 47upx;
	}
	
	.edit-btn-right {
		width: 240upx;
		height: 80upx;
		background: linear-gradient(left, #FFC20B, #FE9402);
		background: -webkit-linear-gradient(lrft, #FFC20B, #FE9402);
		background-size: 100% 100%;
		color: #fff;
		text-align: center;
		line-height: 80upx;
		border-radius: 80upx;
		margin-right: 47upx;
	}
	
	// 修改昵称样式弹窗结束
</style>
