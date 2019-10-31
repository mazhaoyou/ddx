<template>
	<!-- 收货地址 -->
	<view class="shipping-address-container">
		<view v-for="(item, index) in receiverList" :key="index">
			<view class="ship-address">
				<view class="ship-address-info">
					<view>
						<text class="ship-name">{{item.receiverName}}</text>
						<text class="ship-phone">{{item.receiverPhone}}</text>
					</view>
					<view class="address-info">
						<image src="../../static/public/address.png" mode=""></image>
						<text class="address-info-details">{{item.pctAddr}}{{item.detailAddr}}</text>
					</view>
				</view>
				<view class="ship-address-edit">
					<view class="default-address"  v-if="item.isDefault ==1">
						<label class="radio">
							<radio class="form-radio" value="" checked="true" color="#FFA609" />
							<text>设为默认地址</text>
						</label>
					</view>
					<view class="default-address" v-else @tap="setDefaultAdd(item.addressId,item.isDefault)" >
						<label class="radio check-false">
							<radio class="form-radio" value="" color="#FFA609"/>
							<text>设为默认地址</text>
						</label>
					</view>
					<view class="update-address" @tap="editAddress(item,1)">
						<image src="../../static/public/update_address.png" mode=""></image>
						<text>修改</text>
					</view>
					<view class="delete-address" @tap="deleteGoodsAdd(item.addressId,item.isDefault,index)">
						<image src="../../static/public/delete_address.png" mode=""></image>
						<text>删除</text>
					</view>
				</view>
			</view>
		</view>
		<view class="add-address" @tap="editAddress">新添地址</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				receiverList: [], //收货地址列表数据
				token: "", //用户唯一标识
			};
		},
		onLoad() {
			// 获取token，没有跳转到登录页面
			this.token = this.$storage.isAuthed();
			// 获取站内通知消息列表
			if (this.token) {
				let data = {
					token: this.token
				}
				this.getReceiveGoodsAdd(data);
			}
		},
		methods: {
			/* 
			 * 获取收货地址信息列表 
			 * */
			getReceiveGoodsAdd(data) {
				// 获取缓存收货地址列表数据
				let receiveGoodsAddList = this.$storage.getStorage("receiveGoodsAddList");
				this.receiverList = receiveGoodsAddList;
				let _this = this;
				this.$api.getReceiveGoodsInfoList(data)
					.then(res => {
						res = res.data;
						if (res.code == '0001') {
							let receiverList = res.data.receiverList;
							// 判断收货地址是否改变
							if (!_this.$util.contrastArray(receiverList, receiveGoodsAddList)) {
								_this.receiverList = receiverList;
								_this.$storage.setStorage('receiveGoodsAddList', receiverList);
							}
						} else {
							uni.showToast({
								title: res.message,
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
			},
			/* 
			 * 点击编辑收获地址
			 *  */
			editAddress(item, type) {
				uni.navigateTo({
					url: `../edit-address/edit-address?item=${JSON.stringify(item)}&type=${type}`
				});
			},
			/* 
			 * 设置默认收货地址状态 
			 * */
			setDefaultAdd(item,type) {
				let data = {
					addressId: item,
					token: this.token,
					isDefault: type
				}
				let _this = this;
				this.$api.setDefaultReceiveGoodsInfo(data)
					.then(res => {
						res = res.data
						if (res.code == '0001') {
							uni.showToast({
								title: res.message,
								icon: 'success',
								duration: 2000
							});
							if (_this.token) {
								let data = {
									token: _this.token
								}
								_this.getReceiveGoodsAdd(data);
							}
						} else {
							uni.showToast({
								title: res.message,
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
			},
			/* 
			* 点击删除收货地址按钮提示 
			* */
			deleteGoodsAdd(item, type,index) {
				uni.showModal({
					title: '小冠优选',
					content: '确认要删除该地址？',
					success: res => {
						if (res.confirm) {
							this.confirmDeleteGoodsAdd(item,type,index)
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			
			/* 
			 * 确认删除收货地址 
			 * */
			confirmDeleteGoodsAdd(item, type,index) {
				let data = {
					addressId: item,
					token: this.token,
					isDefault: type
				}
				let _this = this;
				this.$api.deleteSingleReceiveGoodsInfo(data)
					.then(res => {
						res = res.data;
						if (res.code == '0001') {
							  _this.receiverList.splice(index,1);
							uni.showToast({
								title: res.message,
								icon: 'success',
								duration: 2000
							});
							if (_this.token) {
								let data = {
									token: _this.token
								}
								// _this.getReceiveGoodsAdd(data);
							}
						} else {
							uni.showToast({
								title: res.message,
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
		}
	};
</script>

<style lang="scss">
	.form-radio {
		transform: scale(0.7);
	}
	.shipping-address-container {
		padding-bottom: 100upx;
	}
	.ship-address {
		display: flex;
		flex-direction: column;
		margin: 40upx 32upx 0 32upx;
		height: 250upx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0 1upx 14upx 0 rgba(51, 52, 53, 0.2);
		border-radius: 12upx;

		&-info {
			display: flex;
			justify-content: center;
			flex-direction: column;
			height: 134upx;
			background: linear-gradient(-90deg, rgba(255, 179, 3, 1), rgba(255, 166, 9, 1));
			border-top-left-radius: 12upx;
			border-top-right-radius: 12upx;
			color: #fff;
			font-size: 28upx;
			padding: 0 28upx;

			.ship-name {
				margin-right: 40upx;
			}
		}

		.address-info {
			margin-top: 22upx;
			display: flex;

			image {
				width: 20upx;
				height: 30upx;
			}

			&-details {
				margin-left: 10upx;
			}
		}

		.ship-address-edit {
			display: flex;
			height: 116upx;
			justify-content: space-between;
			align-items: center;
			padding: 0 28upx;

			image {
				height: 28upx;
				width: 28upx;
			}

			.default-address {
				text {
					color: #333333;
				}
				
				.radio {
					display: flex;
					flex-direction: row;
					align-items: center;
				}
			}

			.check-false {
				text {
					color: #999999;
				}
			}
		}
	}

	.uni-radio .uni-radio-input {
		height: 20upx;
		width: 20upx;
	}

	.add-address {
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 100upx 76upx;
		height: 80upx;
		background: linear-gradient(90deg, rgba(254, 148, 2, 1), rgba(255, 194, 11, 1));
		border-radius: 12upx;
	}
	.update-address {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-content: center;
		image {
			display: inline-block;
			width: 28upx;
			height: 28upx;
			align-self: center;
		}
		text {
			margin-left: 20upx;
			display: inline-block;
			color: #999;
			font-size: 28upx;
			line-height: 28upx;
		}
	}
	.delete-address {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-content: center;
		image {
			display: inline-block;
			width: 28upx;
			height: 28upx;
			align-self: center;
		}
		text {
			margin-left: 20upx;
			display: inline-block;
			color: #999;
			font-size: 28upx;
			line-height: 28upx;
		}
	}
</style>
