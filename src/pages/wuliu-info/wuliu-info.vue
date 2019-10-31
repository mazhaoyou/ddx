<template>
	<view class="content">
		<ali :waybilldata="waybilldata" :waybillList="waybillList" :information="information"></ali>
	</view>
</template>

<script>
import ali from "@/components/wuliu-step/wuliu-step.vue";

export default {
	components: {
		ali
	},
	data() {
		return {
			waybilldata: {}, //返回的数据集合
			information: {}, // 物流数据集合
			waybillList: [], //轨迹列表
			token: "" ,//用户的token
			orderId: "" //订单编号
		};
	},
	onLoad(prams) {
		this.orderId = prams.orderId;
		this.token = this.$storage.isAuthed();
		if(this.token) {
			let wuliuData = {
				token: this.token,
				orderId: this.orderId
			}
			this.getWuliuInfo(wuliuData);
		}
	},
	methods: {
		getWuliuInfo(data) { // 获取物流信息集合
			let that = this;
			this.$api.getLogistics(data).then(res => {
				res = res.data;
				if (res.code == '0001') {
					let waybill = res.data;
					that.waybilldata = waybill;
					that.$set(that.information, "waybillNum", that.waybilldata.waybillNum);
					that.$set(that.information, "carrierName", that.waybilldata.carrierName);
					that.$set(that.information, "carrierPhone", that.waybilldata.carrierPhone);
					that.$set(that.information, "orderNo", that.waybilldata.orderNo);
					that.waybillList = that.waybilldata.waybillList;
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
	}
};
</script>

<style>
.content {
	width: 100%;
	height: 100%;
	background-color: #fff;
}
</style>
