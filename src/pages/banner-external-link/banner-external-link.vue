<template>
	<view>
		<web-view :src="externalLink"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				externalLink: '', //跳转到外部链接
			};
		},
		onLoad(parms) {
			this.externalLink = parms.externalLink;
		}
	}
</script>

<style lang="scss">

</style>
