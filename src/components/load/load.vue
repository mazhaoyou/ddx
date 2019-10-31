<!--	
	加载中
	薛毅飞 
-->
<template>
	<div class="loading-animation" v-if="isLoading">
		<image class="loading-animation-icon" src="../../static/loading.gif"></image>
	</div>
</template>

<script>
export default{
	props: ['isLoading']
}
</script>

<style lang="scss" scoped>
	.loading-animation{
		width: 200px;
		height: 200px;
		background-color: rgba(0, 0, 0, .4);
		justify-content: center;
		align-items: center;
		border-radius: 10px;
		position: fixed;
		left: 275px;
		top: 400px;
	}
	.loading-animation-icon{
		width: 200px;
		height: 200px;
	}
</style>
