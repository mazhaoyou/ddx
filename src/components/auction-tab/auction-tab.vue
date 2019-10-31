<template>
	<!--
	* @mazy
	*  竞拍详情中tab也切换 
	* 使用说明
	*  传入参数
	*  tablist[]：tab也列表 
	* recentlyUser[]: 最近10个竞拍者
	* pastUser[]:往期成交 最多显示10个
	*  -->
	<view>
		<view :class="{ 'my-tabs': true, 'space-between': formatBe }">
			<view v-for="(item, index) in getModelData" :key="index" class="uni-ellipsis" :class="{ 'tab-item': true, active: activeIndex == index }" @tap="tap(index)">
				{{ item.label }}
			</view>
		</view>
		<view v-if="ismark == true">
			<view class="tabdiv" v-show="activeIndex == 0"><recently-userlist :recentlyUser="recentlyUserList"></recently-userlist></view>
			<view class="tabdiv" v-show="activeIndex == 1"><auction-rules></auction-rules></view>
			<view class="tabdiv" v-show="activeIndex == 2"><user-list-info :pastUser="pastUser"></user-list-info></view>
		</view>
		<view v-if="ismark == false">
			<view class="tabdiv" v-show="activeIndex == 0"><user-list-info :pastUser="pastUser"></user-list-info></view>
			<view class="tabdiv" v-show="activeIndex == 1"><auction-rules></auction-rules></view>
		</view>
	</view>
</template>

<script>
import recentlyUserlist from '@/components/recently-userlist/recently-userlist';
import auctionRules from '@/components/auction-rules/auction-rules';
import userListInfo from '@/components/user-list-info/user-list-info';

export default {
	components: {
		recentlyUserlist,
		auctionRules,
		userListInfo
	},
	props: {
		tablist: {
			type: Array,
			default() {
				return [];
			}
		},
		initIndex: {
			type: Number
		},
		recentlyUser: {
			type: Array,
			default() {
				return [];
			}
		},
		pastUser: {
			type: Array,
			default() {
				return [];
			}
		},
		ismark: {
			type: Boolean,
			default() {
				return true;
			}
		}
	},
	data() {
		return {
			defaultInfo: {
				data: [{ label: '最近10个竞购者' }, { label: '竞拍规则' }, { label: '往期成交' }]
			},
			activeIndex: 0 //默认索引
		};
	},
	onLoad() {
		this.initActive();
	},
	onPageScroll(e){
		console.log(e)
	},
	computed: {
		getModelData() {
			return this.tablist || this.defaultInfo.data;
		},
		formatBe() {
			return this.tablist ? (this.tablist.length > 4 ? true : false) : false;
		},
		recentlyUserList() {
			return this.recentlyUser;
		}
	},
	methods: {
		tap(index) {
			if (index !== this.activeIndex) this.$emit('change', index);
			this.activeIndex = index;
		},
		/**
		 * @name 初始化activeIndex
		 */
		initActive() {
			this.activeIndex = this.initIndex || this.activeIndex;
		}
	}
};
</script>
<style lang="scss">
.my-tabs {
	height: 80upx;
	font-size: 32upx;
	color: #888888;
	display: flex;
	justify-content: space-around;
	box-sizing: border-box;
	align-items: center;
	min-width: 100%;
	overflow-x: auto;
	.tab-item {
		line-height: 40upx;
		min-width: 100upx;
		text-align: center;
		padding: 20upx 0;
		max-width: 33%;
	}
	.tab-item.active {
		position: relative;
		color: #ff911b;
	}
	.tab-item.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		border-bottom: 4upx solid #ff911b;
		animation: test ease 1 1.5s;
	}
}
.my-tabs.space-between {
	justify-content: space-between;
}
@keyframes test {
	0% {
		width: 100%;
	}
	50% {
		width: 150%;
	}
	100% {
		width: 100%;
	}
}
.tabdiv {
	width: 100vw;
	padding-bottom: 25upx;
}
</style>
