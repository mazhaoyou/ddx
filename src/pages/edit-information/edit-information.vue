<template>
	<!-- 
	* 完善资料
	* 编辑资料
	*  -->
	<view class="edit-information-wrapper">
		<!-- 一像素的顶部线开始 -->
		<view class="edit-information-area">
			<view class="border-side"></view>
		</view>
		<!-- 一像素的顶部线结束 -->
		<view class="edit-information-content">
			<view class="edit-information-list">
				<!-- 头像开始 -->
				<view class="edit-list">
					<view class="edit-li-left">头像</view>
					<view class="edit-li-middle" @tap="updateAvatar()">
						<image class="edit-author-img" :src="imgUrl" mode="aspectFill" lazy-load></image>
					</view>
					<view class="edit-li-right">
						<image class="eidt-arrow-right" src="../../static/setting/arrow_right.png" mode=""></image>
					</view>
				</view>
				<!-- 头像结束 -->
				<!-- 昵称开始 -->
				<view class="edit-list">
					<view class="edit-li-left">昵称</view>
					<view class="edit-li-middle" @tap="modifyNickname()">
						<view class="edit-li-txt">{{ nickName }}</view>
					</view>
					<view class="edit-li-right">
						<image class="eidt-arrow-right" src="../../static/setting/arrow_right.png" mode=""></image>
					</view>
				</view>
				<!-- 昵称结束 -->
				<!-- 性别开始 -->
				<view class="edit-list">
					<view class="edit-li-left">性别</view>
					<view class="edit-li-middle" @tap="modifyGender()">
						<view class="edit-li-txt">{{genderName}}</view>
					</view>
					<view class="edit-li-right">
						<image class="eidt-arrow-right" src="../../static/setting/arrow_right.png" mode=""></image>
					</view>
				</view>
				<!-- 性别结束 -->
				<!-- 出生日期开始 -->
				<view class="edit-list">
					<view class="edit-li-left">出生日期</view>
					<view class="edit-li-middle" @tap="dateBirth()">
						<view class="edit-li-txt" v-if="newYear && newMonth && newDay">{{newYear}}年{{newMonth}}月{{newDay}}日</view>
						<view class="edit-li-txt" v-else>{{birthDate}}</view>
					</view>
					<view class="edit-li-right">
						<image class="eidt-arrow-right" src="../../static/setting/arrow_right.png" mode=""></image>
					</view>
				</view>
				<!-- 出生日期结束 -->
				<!-- 实名认证开始 -->
				<!-- <view class="edit-list">
					<view class="edit-li-left">实名认证</view>
					<view class="edit-li-middle" @tap="handleRealName()">
						<view class="edit-li-txt">去认证</view>
					</view>
					<view class="edit-li-right">
						<image class="eidt-arrow-right" src="../../static/setting/arrow_right.png" mode=""></image>
					</view>
				</view> -->
				<!-- 实名认证结束 -->
			</view>
		</view>
		<!-- 昵称有改名卡弹窗开始 -->
		<view>
			<neil-modal :show="showCard">
				<view class="modal">
					<image class="edit-name-img" src="../../static/edit_information/edit_name.png" mode=""></image>
					<view class="edit-modal-txt edit-txt-center">是否确认消耗一张改名卡修改昵称？</view>
					<view class="edit-btn-area">
						<view class="edit-btn-left" @tap="cancelCard()">取消</view>
						<view class="edit-btn-right" @tap="confConsuRenameCard()">确定</view>
					</view>
				</view>
			</neil-modal>
		</view>
		<!-- 昵称有改名卡弹窗结束 -->
		<!-- 昵称无改名卡弹窗开始 -->
		<view>
			<neil-modal :show="showNoCard">
				<view class="modal">
					<image class="edit-name-img" src="../../static/edit_information/edit_name.png" mode=""></image>
					<view class="edit-modal-txt">您没有改名卡，是否愿意用50福豆购买改名卡？</view>
					<view class="edit-btn-area">
						<view class="edit-btn-left" @tap="cancelNoCard()">取消</view>
						<view class="edit-btn-right" @tap="confPurRenameCard()">确定</view>
					</view>
				</view>
			</neil-modal>
		</view>
		<!-- 昵称无改名卡弹窗结束 -->
		<!-- 性别选择弹窗开始 -->
		<view>
			<neil-modal :show="showGender">
				<view class="modal-sex">
					<view class="edit-sex-title">选择性别</view>
					<view class="edit-sex-desc">【小冠友情提示】请填写真实信息，以便我们为您推荐更适合您的产品。</view>
					<view class="edit-sex-btn">
						<view :class="{'edit-sex-select-male': true, 'edit-sex-unselect-male': curructindex == 1}" :data-gender="'男'"
						 @tap="handletab(2, $event)">
							<view :class="{'sex-select-male': true, 'sex-unselect-male': curructindex == 1}"></view>
							<view :class="{'sex-male-txt': true, 'sex-male-untxt': curructindex == 1}">男</view>
						</view>
						<view :class="{'edit-sex-select-famale': true, 'edit-sex-unselect-famale': curructindex == 2}" :data-gender="'女'"
						 @tap="handletab(1, $event)">
							<view :class="{'sex-unselect-famale': true, 'sex-select-famale': curructindex != 2}"></view>
							<view :class="{'famale-untxt': true, 'famale-txt': curructindex != 2}">女</view>
						</view>
					</view>
					<view class="confirm-btn" :data-sex="gender" @tap="handleSexSubmit">确认保存</view>
				</view>
			</neil-modal>
		</view>
		<!-- 性别选择弹窗结束 -->
		<!-- 出生日期弹窗开始 -->
		<view>
			<neil-modal :show="showBirth">
				<view class="modal-birth">
					<view class="edit-sex-title">出生日期</view>
					<view class="edit-date-desc">【小冠友情提示】请填写真实信息，以便我们为您推荐更适合您的产品。</view>
					<view class="edit-date-btn">
						<view>
							<picker-view v-if="visible" :indicator-style="indicatorStyle" :value="value" @change="changeDateBirth" class="date-select">
								<picker-view-column class="date-column">
									<view class="item" v-for="(item,index) in years" :key="index">{{item}}年</view>
								</picker-view-column>
								<picker-view-column class="date-column">
									<view class="item" v-for="(item,index) in months" :key="index">{{item}}月</view>
								</picker-view-column>
								<picker-view-column class="date-column">
									<view class="item" v-for="(item,index) in days" :key="index">{{item}}日</view>
								</picker-view-column>
							</picker-view>
						</view>
					</view>
					<view class="confirm-btn" :data-year="year" :data-month="month" :data-day="day" @tap="handleConfirmBirth($event)">确认保存</view>
				</view>
			</neil-modal>
		</view>
		<!-- 出生日期弹窗结束 -->
	</view>
</template>

<script>
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	import uploader from '@/common/unpload-img/unpload-img.js';

	export default {
		components: {
			neilModal
		},
		data: function() {
			const date = new Date()
			const years = []
			const year = date.getFullYear()
			const months = []
			const month = date.getMonth() + 1
			const days = []
			const day = date.getDate()
			for (let i = 1900; i <= date.getFullYear(); i++) {
				years.push(i)
			}
			for (let i = 1; i <= 12; i++) {
				months.push(i)
			}
			for (let i = 1; i <= 31; i++) {
				days.push(i)
			}
			return {
				imgUrl: "",
				nickName: "",
				gender: "男",
				genderName: '',
				birthDate: "未设置",
				showCard: false, // 有改名卡弹窗的显示与否
				showNoCard: false, // 无改名卡弹窗的显示与否
				showGender: false, //性别的弹窗显示与否
				showBirth: false, //出生日期的弹窗显示与否
				title: 'picker-view',
				years,
				year,
				months,
				month,
				days,
				day,
				newYear: "",
				newMonth: "",
				newDay: "",
				value: [9999, month - 1, day - 1],
				visible: true,
				indicatorStyle: `height: ${Math.round(uni.getSystemInfoSync().screenWidth/(750/100))}px;`,
				curructindex: "2", // //tab的切换
				nicknameStatus: 1, //默认有一次修改昵称机会
				renamingCard: {}, //改名卡相关
			}
		},
		onLoad() {
			// 获取token，没有跳转到登录页面
			let token = this.$storage.isAuthed();
			if(token) {	
				let data = {
					token: token
				}
				// 获取用户信息并渲染
				this.initUserInfo(data);	
			}
		},
		methods: {
			/* 
			* 初始化用户信息
			*  */
			initUserInfo(data){
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				let _this = this;
				// 查询缓存资料
				let userInfoData = _this.$storage.getStorage('userInfoData');
				// console.log(userInfoData);
				_this.imgUrl = userInfoData.headPicUrl;
				_this.nickName = userInfoData.nickname;
				_this.renamingCard = userInfoData.renamingCard;
				if (1 == userInfoData.gender) {
					_this.curructindex = 2;
					_this.genderName = "男";
				} else if(2 == userInfoData.gender) {
					_this.curructindex = 1;
					_this.genderName = "女";
				} else {
					_this.genderName = "未设置";
				}
				if(userInfoData.birthDate) {
					let dateArr = userInfoData.birthDate.split('-');
					_this.newYear = dateArr[0];
					_this.newMonth = dateArr[1];
					_this.newDay = dateArr[2];
				}
				// 调用完善资料接口
				_this.$api.checkMate(data)
				.then(res => {
					res = res.data;
					let message = res.message;
					uni.hideLoading();
					if(res.code == '0001') {
						let userInfoList = res.data;
						// console.log(userInfoList);
						if (!_this.$util.contrastArray(userInfoList, userInfoData)) {
							// 重新渲染页面数据
							_this.imgUrl = userInfoList.headPicUrl;
							_this.nickName = userInfoList.nickname;
							_this.nicknameStatus = userInfoList.nicknameStatus;
							_this.renamingCard = userInfoList.renamingCard;
							if (1 == userInfoList.gender) {
								_this.curructindex = 2;
								_this.genderName = "男";
							} else if(2 == userInfoList.gender) {
								_this.genderName = "女";
								_this.curructindex = 1;
							} else {
								_this.genderName = "未设置";
							}
							
							if(userInfoList.birthDate) {
								let dateArr = userInfoList.birthDate.split('-');
								_this.newYear = dateArr[0];
								_this.newMonth = dateArr[1];
								_this.newDay = dateArr[2];
							}
							_this.$storage.setStorage('userInfoData', userInfoList);
							uni.showToast({
								title: message,
								icon: 'success',
								duration: 2000
							})
						}						
					} else {
						uni.showToast({
							title: message,
							icon: 'none',
							duration:2000
						})
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
			},
			/* 
			* 设置头像 
			* */
			updateAvatar(){
				let _this = this;
				// 获取token，没有跳转到登录页面
				let token = this.$storage.isAuthed();
				let imgNum = 1;
				let imgSrcUrl = this.$api.setHeadPortrait;
				let formData = {
					token: token
				}
				let imgFileName = 'portraitImg'
				/* 
				* 	备注:
				* 	imgNum:为上传图片张数
				* 	imgSrcUrl:为上传图片接口
				* 	formData:为上传图片其他参数
				* 	imgFileName: 为上传图片存放图片文件的名
				*  */
				uploader.chooseAndUpload(imgNum,imgSrcUrl,formData,imgFileName)
					.then( res => {
						// console.log(JSON.stringify(res));
						res = res[0];
						if(res.code == '0001') {
							let imgSrc = res.data.portraitImg;
							_this.imgUrl = imgSrc;
							uni.showToast({
								title: res.message,
								icon: 'success',
								duration: 2000
							})
						} else {
							uni.showToast({
								title: res.message,
								icon: 'none',
								duration: 2000
							})
						}
					})
					.catch(err => {
						console.log("上传失败")
						uni.showToast({
							title: "服务异常",
							icon: "none",
							duration: 2000
						})
					})
			},
			/* 
			 * 点击更换头像部分 
			 * */
			handleUpdateImg() {
				let _this = this;
				// 选择头像
				uni.chooseImage({
					sourceType: ["camera", "album"], //拍照、相册
					sizeType: "compressed", // 指定图片是原图还是压缩图，默认二者都有
					count: 1, //上传头像张数
					success: (res) => {
						// console.log(JSON.stringify(res.tempFilePaths));
						uni.showLoading({
							title: '正在上传',
							mask: true
						});
						// 获取token，没有跳转到登录页面
						let token = _this.$storage.isAuthed();
						// 获取头像本地路径
						const tempFilePaths = res.tempFilePaths;
						_this.imgUrl = tempFilePaths;
						// 上传头像
						if(token) {
							uni.uploadFile({
								url: 'http://192.168.8.123:7076/user/setHeadPortrait', //上传图片接口地址
								filePath: tempFilePaths[0],
								name: 'portraitImg',
								formData: {
									'token': token
								},
								header:{"Content-Type": "multipart/form-data"},
								success: (uploadFileRes) => {
									// console.log(uploadFileRes)
									uni.hideLoading();
									let res = JSON.parse(uploadFileRes.data);
									let message = res.message;
									if (res.code == '0001') {
										_this.imgUrl = res.data.portraitImg
										uni.showToast({
											title: message,
											icon: 'success',
											duration: 2000
										})
									} else {
										uni.showToast({
											title: message,
											icon: 'none',
											duration: 2000
										})
									}
								},
								error: (err) => {
									uni.hideLoading();
									uni.showToast({
										title: '服务异常',
										icon: 'none',
										duration: 2000
									})
								}
							});
						}
					}
				})
			},
			/* 
			 * 点击修改昵称的区域 
			 * */
			modifyNickname() {
				if (0 == this.nicknameStatus) { //用户还未修改过昵称，又一次免费修改昵称机会
					uni.redirectTo({
						url: '../modify-name/modify-name?nickName=' + this.nickName + "&itemId=" + this.renamingCard.itemId
					});
				} else if (this.renamingCard) { //无改名卡,消耗点豆去购买改名卡
					this.showCard = true;
				} else { //有改名卡，消耗改名卡去修改昵称
					this.showNoCard = true;
				}

			},
			/* 
			 * 确认用50点豆购买改名卡
			 *  */
			confPurRenameCard() {
				this.showNoCard = false;
				uni.redirectTo({
					url: '../buy-beans/buy-beans'
				})
			},
			/* 
			 * 取消无改名卡的使用
			 *  */
			cancelNoCard() {
				this.showNoCard = false
			},
			/* 
			 * 确认消耗一张改名卡
			 *  */
			confConsuRenameCard() {
				this.showCard = false
				uni.redirectTo({
					url: '../modify-name/modify-name?nickName=' + this.nickName + "&itemId=" + this.renamingCard.itemId
				});
			},
			/* 
			 * 取消有改名卡的使用
			 *  */
			cancelCard() {
				this.showCard = false
			},
			/* 
			 * 点击性别区域打开弹窗 
			 * */
			modifyGender() {
				this.showGender = true
			},
			/* 
			 * 性别男女的切换选择
			 *  */
			handletab(val, e) {
				this.curructindex = val;
				this.gender = e.currentTarget.dataset.gender;
			},
			/* 
			 * 提交选择男女性别 
			 * */
			handleSexSubmit(e) {
				this.gender = e.currentTarget.dataset.sex;
				// 0默认未设置，1男，2女
				let genderNum = null; 
				if ("男" == this.gender) {
					genderNum = 1;
				} else if ("女" == this.gender) {
					genderNum = 2;
				} else {
					genderNum = 0;
				}
				// 获取token，没有跳转到登录页面
				let token = this.$storage.isAuthed();
				let _this = this;
				if(token) {
					let data = {
						token: token,
						gender: genderNum
					}
					_this.$api.setGender(data)
						.then(res => {
							res = res.data;
							let message = res.message;
							if (res.code == '0001') {
								//修改页面性别展示
								_this.genderName = _this.gender;
								// 修改成功关闭弹窗
								_this.showGender = false;
								uni.showToast({
									title: message,
									icon: 'success',
									duration: 2000
								});
							} else {
								uni.showToast({
									title: message,
									icon: 'none',
									duration: 2000
								});
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
			},
			/* 
			 * 点击打开出生日期的弹窗 
			 * */
			dateBirth() {
				this.showBirth = true
			},
			/* 
			 * 出生日期的改变事件 
			 * */
			changeDateBirth(e) {
				const val = e.detail.value;
				this.year = this.years[val[0]];
				this.month = this.months[val[1]];
				this.day = this.days[val[2]];
			},
			/* 
			 * 确定出生日期的选择 
			 * */
			handleConfirmBirth(e) {
				// 拿到年月日
				let birthDateData = {
					newYear: e.currentTarget.dataset.year,
					newMonth: e.currentTarget.dataset.month,
					newDay: e.currentTarget.dataset.day
				}

				let birthDate = birthDateData.newYear + '-' + birthDateData.newMonth + '-' + birthDateData.newDay;
				// 获取token，没有跳转到登录页面
				let token = this.$storage.isAuthed();
				let _this = this;
				if(token) {
					let data = {
						token: token,
						birthDate: birthDate
					}
					_this.$api
						.setBirthDate(data)
						.then(res => {
							res = res.data;
							let message = res.message;
							if (res.code == '0001') {
								// 修改页面显示
								_this.newYear = birthDateData.newYear;
								_this.newMonth = birthDateData.newMonth;
								_this.newDay = birthDateData.newDay;
								
								//修改成功关闭弹窗
								_this.showBirth = false;
								uni.showToast({
									title: message,
									icon: 'success',
									duration: 2000
								})

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
						});
				}
			},
			/* 
			 * 点击实名认证 
			 * */
			handleRealName() {
				uni.navigateTo({
					url: "../real-name/real-name"
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.edit-information-wrapper {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		flex: 1;
		background-color: #fff;
	}

	.edit-information-area {
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

	.edit-information-content {
		width: 100%;
		height: auto;
	}

	.edit-information-list {
		width: 700upx;
		height: auto;
		padding: 0 32upx;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-content: center;
	}

	.edit-list {
		width: 100%;
		height: 110upx;
		border-bottom: 1upx solid #E5E5E5;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-content: center;
	}

	.edit-li-left {
		height: 110upx;
		line-height: 110upx;
		font-size: 32upx;
		color: #333;
	}

	.edit-li-middle {
		height: 110upx;
		flex: 1;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-content: center;
		margin-right: 16upx;
	}

	.edit-author-img {
		display: inline-block;
		width: 72upx;
		height: 72upx;
		border-radius: 50%;
		align-self: center;
	}

	.edit-li-txt {
		height: 110upx;
		font-size: 32upx;
		line-height: 110upx;
		color: #999;
	}

	.edit-li-right {
		height: 110upx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-content: center;
	}

	.eidt-arrow-right {
		display: inline-block;
		width: 22upx;
		height: 38upx;
		align-self: center;
	}

	.modal {
		width: 626upx;
		height: 512upx;
		background-color: #fff;
		border-radius: 16upx;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-content: center;
	}

	.edit-name-img {
		width: 162upx;
		height: 162upx;
		display: block;
		margin-top: 60upx;
		margin-bottom: 28upx;
		align-self: center;
	}

	.edit-modal-txt {
		width: 532upx;
		margin: 0 auto;
		line-height: 42upx;
		font-size: 28upx;
		color: #333;
		text-align: justify;
		margin-bottom: 46upx;
	}

	.edit-txt-center {
		text-align: center;
	}

	.edit-btn-area {
		width: 100%;
		height: 85upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-content: center;
	}

	.edit-btn-left {
		width: 240upx;
		height: 85upx;
		background-color: #F5F5F5;
		color: #999;
		text-align: center;
		line-height: 85upx;
		border-radius: 85upx;
		margin-left: 47upx;
	}

	.edit-btn-right {
		width: 240upx;
		height: 85upx;
		background: linear-gradient(left, #FFC20B, #FE9402);
		background: -webkit-linear-gradient(lrft, #FFC20B, #FE9402);
		background-size: 100% 100%;
		color: #fff;
		text-align: center;
		line-height: 85upx;
		border-radius: 85upx;
		margin-right: 47upx;
	}

	.modal-sex {
		width: 626upx;
		height: 558upx;
		background-color: #fff;
		border-radius: 16upx;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-content: center;
	}

	.edit-sex-title {
		width: 100%;
		height: 32upx;
		line-height: 32upx;
		color: #333;
		font-size: 32upx;
		text-align: center;
		margin-top: 40upx;
		margin-bottom: 28upx;
	}

	.edit-sex-desc {
		width: 550upx;
		line-height: 32upx;
		font-size: 24upx;
		margin: 0 auto;
		text-align: justify;
		color: #666;
		padding-bottom: 30upx;
	}

	.edit-date-desc {
		width: 550upx;
		line-height: 32upx;
		font-size: 24upx;
		padding-left: 38upx;
		padding-right: 38upx;
		text-align: justify;
		color: #666;
		padding-bottom: 30upx;
		border-bottom: 1upx solid #E5E5E5;
	}

	.edit-sex-btn {
		width: 100%;
		height: 358upx;
		border-top: 1upx solid #E5E5E5;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-content: center;
	}

	.edit-date-btn {
		width: 100%;
		height: 358upx;
	}

	.edit-sex-select-male {
		// 选中男状态
		width: 172upx;
		height: 172upx;
		border-radius: 50%;
		background-color: #2D81FF;
		margin-top: 45upx;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-content: center;
	}

	.edit-sex-unselect-male {
		// 未选中男状态
		width: 172upx;
		height: 172upx;
		border-radius: 50%;
		background-color: #F5F5F5;
		margin-top: 45upx;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-content: center;
	}

	.edit-sex-select-famale {
		//选中女状态 
		width: 172upx;
		height: 172upx;
		border-radius: 50%;
		background-color: #FA503D;
		margin-top: 45upx;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-content: center;
	}

	.edit-sex-unselect-famale {
		// 未选中女状态
		width: 172upx;
		height: 172upx;
		border-radius: 50%;
		background-color: #F5F5F5;
		margin-top: 45upx;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-content: center;
	}

	.sex-select-male {
		// 选中男图片
		width: 88upx;
		height: 88upx;
		background: url("~@/static/edit_information/edit_male_select.png") no-repeat;
		background-size: 88upx 88upx;
		align-self: center;
		margin-top: 22upx;
	}

	.sex-unselect-male {
		// 未选中男状态
		width: 88upx;
		height: 88upx;
		background: url("~@/static/edit_information/edit_male_unselect.png") no-repeat;
		background-size: 88upx 88upx;
		align-self: center;
		margin-top: 22upx;
	}

	.sex-unselect-famale {
		// 未选中女状态
		width: 88upx;
		height: 88upx;
		background: url("~@/static/edit_information/edit_famale_unselect.png") no-repeat;
		background-size: 88upx 88upx;
		align-self: center;
		margin-top: 22upx;
	}

	.sex-select-famale {
		// 选中女状态
		width: 88upx;
		height: 88upx;
		background: url("~@/static/edit_information/edit_famale_select.png") no-repeat;
		background-size: 88upx 88upx;
		align-self: center;
		margin-top: 22upx;
	}

	.sex-male-txt {
		// 选中状态颜色
		width: 100%;
		height: 40upx;
		line-height: 40upx;
		font-size: 40upx;
		color: #fff;
		text-align: center;
	}

	.sex-male-untxt {
		// 未选中颜色
		width: 100%;
		height: 40upx;
		line-height: 40upx;
		font-size: 40upx;
		color: #2D81FF;
		text-align: center;
	}

	.famale-untxt {
		width: 100%;
		height: 40upx;
		line-height: 40upx;
		font-size: 40upx;
		text-align: center;
		color: #FA503D;
	}

	.famale-txt {
		width: 100%;
		height: 40upx;
		line-height: 40upx;
		font-size: 40upx;
		text-align: center;
		color: #fff;
	}

	.sex-male-selsec-txt {
		width: 100%;
		height: 40upx;
		line-height: 40upx;
		font-size: 40upx;
		color: #fff;
		text-align: center;
	}

	.confirm-btn {
		width: 100%;
		height: 112upx;
		line-height: 112upx;
		font-size: 32upx;
		color: #333;
		text-align: center;
		border-top: 1upx solid #E5E5E5;
	}

	.modal-birth {
		width: 626upx;
		height: 660upx;
		background-color: #fff;
		border-radius: 16upx;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-content: center;
	}

	.date-select {
		width: 626upx;
		height: 358upx;
		background-color: #fff;
	}

	uni-picker-view .uni-picker-view-wrapper {
		width: 100%;
	}

	.uni-picker-view-content {
		text-align: center;
	}

	uni-picker-view-column {
		text-align: center;
	}

	.uni-picker-view-group {
		width: 100%;
		text-align: center;
	}

	.uni-picker-view-mask {
		width: 100%;
		text-align: center;
	}

	.uni-picker-view-indicator {
		width: 100%;
		text-align: center;
	}

	.uni-picker-view-content {
		width: 100%;
		text-align: center;
	}

	.item {
		line-height: 100upx !important;
	}

	uni-picker-view-column {
		text-align: center;
	}

	.date-column {
		width: 100%;
		text-align: center;
	}
</style>
