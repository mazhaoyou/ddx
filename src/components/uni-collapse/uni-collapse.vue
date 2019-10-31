<template>
	<!-- 折叠面板组件 -->
	<view class="uni-collapse">
		<slot></slot>
	</view>
</template>
<script>
	export default {
		name: 'uni-collapse',
		props: {
			accordion: { //是否开启手风琴效果
				type: [Boolean, String],
				default: false
			}
		},
		data() {
			return {}
		},
		provide() {
			return {
				collapse: this
			}
		},
		created() {
			this.childrens = []
		},
		methods: {
			onChange() {
				let activeItem = []
				this.childrens.forEach((vm, index) => {
					if (vm.isOpen) {
						activeItem.push(vm.nameSync)
					}
				})
				this.$emit('change', activeItem)
			}
		}
	}
</script>
<style>
	@charset "UTF-8";

	.uni-collapse {
		background-color: #fff;
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
	}
	
	

	
</style>