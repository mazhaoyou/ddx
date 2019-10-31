<template>
	<!-- 
	* 	注册页面，Html过度页面
	* 	作者：wux
	* 	网易云盾滑块验证码验证
	* 	短信验证码、语音验证码
	*  -->
	<view>
		<view>
			<web-view :src="htmlUrl"></web-view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {
		
		},
		data() {
			return {
				htmlUrl: ''
			};
		},
		onLoad(parms) {
			// 手机号及同盾号及微信openid
			let userPhone = parms.phone;
			let tongdunNo = parms.tongdunNo;
			let openid = parms.openid;
			
			this.htmlUrl = '../../hybrid/html/verify-code.html?phone=' + userPhone + '&tongdunNo=' + tongdunNo + '&openid=' + openid
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">

</style>
