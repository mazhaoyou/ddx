<template>
	<!-- 晒单评价页面 -->
	<view class="evaluation-list-wrapper">
		<view class="evaluation-list-area">
			<view class="border-side"></view>
		</view>
		<view class="evaluation-list-content">
			<view class="evaluation-list-title">
				<image class="evaluation-list-img" src="../../static/evaluation_list/evaluation_small_img.png" mode=""></image>
				<view class="evaluation-list-txt">描述评分</view>
				<uni-rate :value="mark" :size="23" :max="5" :margin="0" color="#bbb" active-color="#FB6C19" :is-fill="false"
				 @change="onChange" />
			</view>
			<view class="evaluation-list-comment">
				<textarea class="input-info" v-model="desc" @input="descInput" ref="count" placeholder="审核通过的精彩评论，将被其他小伙伴看到哦！"
				 maxlength="50" placeholder-style="line-height: 36upx; color: #999; font-size: 24upx;" />
				<view class="word-num"><text>已输入:{{ remnant }}</text>/50</view>
			</view>
			<view class="evaluation-list-upload">
				<text class="upload-txt">上传图片</text>
			</view>
			
			<view class="feedback-body feedback-uploader feedback-content">
				<view class="uni-uploader">
					<view class="uni-uploader-body uploader-body">
						<view class="uni-uploader__files">
							<block v-for="(image,index) in imageList" :key="index">
								<view class="uni-uploader__file" style="position: relative;">
									<image class="uni-uploader__img" :src="image" @tap="previewImage(index)"></image>
									<view class="close-view" @click="close(index)">-</view>
								</view>
							</block>
							<view class="uni-uploader__input-box" v-if="imageList.length < 3">
								<view class="uni-uploader__input"  @tap="chooseImg"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		
			<view class="uploader-desc">
				<text class="upload-explain">可添加3张图片（总大小在10M以下）</text>
			</view>
			<view class="bottom-btn-area">
				<view class="btn-area" @tap="relEvaluation()" >发布评价</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniRate from '@/components/uni-rate/uni-rate.vue'
	import uploader from '@/common/unpload-img/unpload-img.js';
	export default {
		components: {
			uniRate
		},
		data() {
			return {
				desc: "", // 输入框中的内容
				remnant: 0, // 输入字数统计
				imageList: [],
				sendDate: {
                    score: 0,
                    content: "",
                    contact: ""
                },
				mark: "", //星星评分
				token: "", //用户标识
				orderId: "", //订单编号
				imgUrl: "" //图片地址的url
			}
		},
		onLoad(prams) {
			this.orderId = prams.orderId;
			this.token = this.$storage.isAuthed();
			let deviceInfo = {
                appid: plus.runtime.appid,
                imei: plus.device.imei, //设备标识
                p: plus.os.name === "Android" ? "a" : "i", //平台类型，i表示iOS平台，a表示Android平台。
                md: plus.device.model, //设备型号
                app_version: plus.runtime.version,
                plus_version: plus.runtime.innerVersion, //基座版本号
                os: plus.os.version,
                net: "" + plus.networkinfo.getCurrentType()
            }
            this.sendDate = Object.assign(deviceInfo, this.sendDate);
		},
		methods: {
			onChange(e) { // 星星评分
				let mark = e.value;
				this.mark = mark;
			},
			previewImage(index) { //预览图片
                uni.previewImage({
                    urls: this.imageList,
					current:this.imageList[index]
                });
            },
			chooseImg() { //选择图片
				let _this = this;
				let token = this.$storage.isAuthed();
				let imgNum = 1;
				let imgSrcUrl = this.$api.addOrderEvaluateImg;
				let formData = {
					base64Str: '',
					token: token
				}
				let imgFileName = 'evaluationImg'
				/* 
				* 	备注:
				* 	imgNum:为上传图片张数
				* 	imgSrcUrl:为上传图片接口
				* 	formData为:上传图片其他参数
				* 	imgFileName: 为上传图片存放图片文件的名
				*  */
				uploader.chooseAndUpload(imgNum,imgSrcUrl,formData,imgFileName)
					.then( res => {
						// console.log(JSON.stringify(res));
						res = res[0];
						if(res.code == '0001') {
							let imgSrc = res.data.imgUrl;
							_this.imageList = _this.imageList.concat(imgSrc);
							for(let i = 0; i < _this.imageList.length; i++) {
								_this.imgUrl = _this.imageList[i];
							}
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
			close(index){
				uni.showModal({
					title: '小冠优选',
					content: '是否要删除改图片',
					success: (res) => {
						if (res.confirm) {
							this.imageList.splice(index, 1);
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
                
            },
			relEvaluation() { //发布评论
				if(this.checkCommentInfo()) {
					let evaluateData = {
						token: this.token,
						orderId: this.orderId,
						mark: this.mark,
						comment: this.desc,
						imgList: [
							{
								imgUrl: this.imgUrl
							}
						]
					};
					this.upLoadComment(evaluateData);
				}
			},
			upLoadComment(data) { //上传评论信息
				let that = this;
				this.$api.addOrderEvaluate(data).then(res => {
					res = res.data;
					if (res.code == '0001') {
						uni.showToast({
							title: "评论发布成功",
							icon: "success"
						});
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						});
					}
				})
				.catch(err => {
					uni.showToast({
						title: '通信有问题，请稍后重试!',
						icon: "none"
					});
				});
				uni.navigateTo({
					url: '../publish-success/publish-success?orderId=' + this.orderId
				});
			},
			descInput() { //输入框中的input事件
				var txtVal = this.desc.length; //desc 是设置v-model的值
				this.remnant = txtVal; //显示输入多少字数
			},
			checkCommentInfo() { //校验信息是否填写
				if(!this.mark) {
					uni.showToast({
						title: '请填写评分',
						icon: "none"
					});
					return false;
				}else if(!this.desc) {
					uni.showToast({
						title: '请填写评论',
						icon: "none"
					});
					return false;
				}
				return true;
			}
		},
		watch: {
			desc(curVal, oldVal) { // 监听文本域输入框的字数限制
				if(curVal.length >= 50) {
					this.remnant = 50;
					this.desc = curVal.substring(0, 50);
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.evaluation-list-wrapper {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		background-color: #FFFFFF;
		position: relative;
	}
	.evaluation-list-area {
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
	.evaluation-list-content {
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-content: center;
		.evaluation-list-title {
			width: 100%;
			height: 47upx;
			margin: 32upx 0;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-content: center;
		}
	}
	.evaluation-list-img {
		display: block;
		width: 47upx;
		height: 47upx;
		margin-left: 28upx;
		margin-right: 10upx;
	}
	.evaluation-list-txt {
		height: 47upx;
		line-height: 47upx;
		margin-right: 12upx;
		font-size: 28upx;
		color: #333;
		font-family: PingFang-SC-Regular;
	}
	.evaluation-list-comment {
		width: 100%;
		min-height: 258upx;
		height: auto;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-content: center;
		position: relative;
	}
	.input-info {
		width: 690upx;
		min-height: 258upx;
		height: auto;
		padding: 0 15upx;
		padding-top: 12upx;
		font-size: 24upx;
		line-height: 36upx;
		color: #272727;
		text-align: left;
		background-color: #EEEEEE;
		border: 1upx solid #D8D8D8;
		box-sizing: border-box;
	}
	.word-num {
		padding: 0 30upx;
		font-size: 24upx;
		font-family: PingFang-SC-Regular;
		font-weight: 500;
		line-height: 24upx;
		text-align: right;
		color: #999;
		position: absolute;
		bottom: 20upx;
		right: 30upx;
	}
	.evaluation-list-upload {
		width: 100%;
		height: 28upx;
		margin-top: 40upx;
		margin-bottom: 24upx;
		.upload-txt {
			display: block;
			font-size: 28upx;
			line-height: 28upx;
			color: #333;
			font-family: PingFang-SC-Regular;
			padding-left: 32upx;
		}
	}
	.close-view{
        text-align: center;
		line-height:14px;
		height: 32upx;
		width: 32upx;
		border-radius: 50%;
		background: #FFA50D;
		color: #FFFFFF;
		position: absolute;
		top: -12upx;
		right: -8upx;
		font-size: 24upx;
    }
	.uploader-body {
		margin-top: 0;
	}
	.feedback-content {
		padding: 0;
		padding: 0 30upx;
	}
	.uni-uploader__input-box {
		width: 200upx;
		height: 200upx;
		border-radius: 10upx;
		box-sizing: border-box;
		margin: 0;
		margin-bottom: 10upx;
		background: url("~@/static/evaluation_list/evaluation_photo.png") no-repeat;
		background-position: center center;
		background-size: 55upx 45upx;
	}
	.uni-uploader__input-box:before, .uni-uploader__input-box:after {
		background-color: #fff;
	}
	.uni-uploader__input-box:before,.uni-uploader__input-box:after {
		width: 0;
		height: 0;
	}
	.uni-uploader__img {
		display: block;
		width: 200upx;
		height: 200upx;
		border-radius: 10upx;
	}
	.uploader-desc {
		width: 100%;
		height: 24upx;
		margin-bottom: 55upx;
		.upload-explain {
			display: block;
			padding-left: 30upx;
			font-size: 24upx;
			color: #999;
			line-height: 24upx;
			font-family: PingFang-SC-Regular;
		}
	}
	.bottom-btn-area {
		width: 100%;
		height: 80upx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-content: center;
		.btn-area {
			width: 600upx;
			height: inherit;
			background: linear-gradient(left, #FFC20B, #FE9402);
			background: -webkit-linear-gradient(left, #FFC20B, #FE9402);
			font-size: 32upx;
			color: #FEFEFE;
			line-height: 80upx;
			text-align: center;
			font-family: PingFang-SC-Medium;
			font-weight: 500;
			border-radius: 80upx;
		}
	}
</style>
