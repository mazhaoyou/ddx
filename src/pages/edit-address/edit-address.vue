<template>
	<!-- 编辑收货地址 -->
	<view>
		<view class="content">
			<view class="row">
				<view class="nominal">姓名</view>
				<view class="input"><input placeholder="请输入收件人姓名" type="text" v-model="name" /></view>
			</view>
			<view class="row">
				<view class="nominal">联系电话</view>
				<view class="input"><input placeholder="请输入收件人电话号码" type="number" maxlength="11" v-model="tel" /></view>
			</view>
			<view class="row">
				<view class="nominal">所在地址</view>
				<view class="input" :class="{gray:region.label=='请点击选择地址'}" @tap="chooseCity">{{ region.label }}</view>
			</view>
			<view class="row">
				<view class="nominal">详细地址</view>
				<view class="input"><textarea v-model="detailed" auto-height="true" placeholder="输入详细地址"></textarea></view>
			</view>
			<view class="row">
				<view class="nominal">设置默认地址</view>
				<view class="input switch">
					<switch color="#FFA609" :checked="isDefault" @change="isDefaultChange" />
				</view>
			</view>
		</view>
		<view class="save" @tap="save">
			<view class="btn">保存地址</view>
		</view>
		<city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValue" @onCancel="onCancel"
		 @onConfirm="onConfirm"></city-picker>
	</view>
</template>

<script>
	import cityPicker from '@/components/city-picker/city-picker.vue';
	export default {
		components: {
			cityPicker
		},
		data() {
			return {
				editType: 'edit',
				id: '',
				name: '',
				tel: '',
				detailed: '',
				isDefault: false,
				cityPickerValue: [0, 0, 1],
				themeColor: '#007AFF',
				region: {
					label: '请点击选择地址',
					value: [],
					cityCode: ''
				},
				token: ''
			};
		},
		onLoad(option) {
			//获取传递过来的参数
			// 获取token，没有跳转到登录页面
			this.token = this.$storage.isAuthed();
			let addressInfo = JSON.parse(option.item);
			if (option.type == 1) {
				this.name = addressInfo.receiverName;
				this.tel = addressInfo.receiverPhone;
				this.region.label = addressInfo.pctAddr;
				this.region.value = addressInfo.pctAddrValue;
				this.detailed = addressInfo.detailAddr;
				this.isDefault = addressInfo.isDefault;
			}


		},
		methods: {
			onCancel(e) {
				// console.log(e);
			},
			chooseCity() {
				uni.hideKeyboard();
				this.$refs.mpvueCityPicker.show();
			},
			onConfirm(e) {
				this.region = e;
				this.cityPickerValue = e.value;
				// console.log("cityPickerValue="+this.cityPickerValue)
			},
			isDefaultChange(e) {
				this.isDefault = e.detail.value;
			},
			del() {
				uni.showModal({
					title: '删除提示',
					content: '你将删除这个收货地址',
					success: res => {
						if (res.confirm) {
							uni.setStorage({
								key: 'delAddress',
								data: {
									id: this.id
								},
								success() {
									uni.navigateBack();
								}
							});
						} else if (res.cancel) {
							// console.log('用户点击取消');
						}
					}
				});
			},
			save() {
				let data = {
					name: this.name,
					head: this.name.substr(0, 1),
					tel: this.tel,
					address: {
						region: this.region,
						detailed: this.detailed
					},
					isDefault: this.isDefault
				};
				if (this.editType == 'edit') {
					data.id = this.id;
				}
				if (!data.name) {
					uni.showToast({
						title: '请输入收件人姓名',
						icon: 'none'
					});
					return;
				}
				if (!data.tel) {
					uni.showToast({
						title: '请输入收件人电话号码',
						icon: 'none'
					});
					return;
				}
				let reg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
				if (!reg.test(data.tel)) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none'
					});
					return;
				}
				if (data.address.region.value.length == 0) {
					uni.showToast({
						title: '请选择收件地址',
						icon: 'none'
					});
					return;
				}
				
				
				if (!data.address.detailed) {
					uni.showToast({
						title: '请输入收件人详细地址',
						icon: 'none'
					});
					return;
				}
				
				uni.showLoading({
					title: '正在提交'
				});

				let _this = this;
				let addData = {
					token: this.token,
					receiverName: this.name,
					receiverPhone: this.tel,
					pctAddr: this.region.label,
					pctAddrValue: this.region.value,
					detailAddr: this.detailed,
					isDefault: this.isDefault
				};
				this.$api.addSingleReceiveGoodsInfo(addData)
					.then(res => {
						res = res.data
						if (res.code == '0001') {
							uni.showToast({
								title: res.message,
								icon: 'success',
								duration: 2000
							});
							uni.navigateTo({
								url: '../shipping-address/shipping-address'
							})
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
		},

		onBackPress() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel();
				return true;
			}
		},
		onUnload() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel();
			}
		}
	};
</script>
<style lang="scss">
	.gray {
		color: #999999;
		font-weight: 400;
	}

	.save {
		view {
			display: flex;
		}

		margin: 60upx 75upx;
		display: flex;
		justify-content: center;
		align-items: center;

		.btn {
			width: 100%;
			height: 80upx;
			color: #fff;
			justify-content: center;
			align-items: center;
			background: linear-gradient(90deg, rgba(254, 148, 2, 1), rgba(255, 194, 11, 1));
			border-radius: 12upx;

			.icon {
				height: 80upx;
				color: #fff;
				font-size: 30upx;
				justify-content: center;
				align-items: center;
			}

			font-size: 30upx;
		}
	}

	.content {
		display: flex;
		flex-wrap: wrap;

		view {
			display: flex;
		}

		.row {
			width: 94%;
			margin: 0 3%;
			border-top: solid 1upx #eee;

			.nominal {
				width: 30%;
				height: 120upx;
				font-weight: 200;
				font-size: 30upx;
				align-items: center;
			}

			.input {
				width: 70%;
				padding: 20upx 0;
				align-items: center;
				font-size: 30upx;

				&.switch {
					justify-content: flex-end;
				}

				.textarea {
					margin: 20upx 0;
					min-height: 120upx;
				}
			}

			.del {
				width: 100%;
				height: 100upx;
				justify-content: center;
				align-items: center;
				font-size: 36upx;
				color: #f06c7a;
				background-color: rgba(255, 0, 0, 0.05);
				border-bottom: solid 1upx #eee;
			}
		}
	}
</style>
