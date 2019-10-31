<template>
	<!-- 
	* 	实名认证，跳转到支付宝Html过度页面
	* 	作者：wux
	*  -->
	<view>
		<web-view :src="zfbUrl"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				zfbUrl:''
			};
		},
		onLoad(prams) {
			// 将参数转换成链接
			let realUrl = prams.validateUrl.replace("!","?").replace("$","=");
			if(prams) {
				this.zfbUrl = realUrl;
			}
		}
	}
</script>

<style lang="scss">

</style>
