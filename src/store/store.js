import Vue from 'vue'
import Vuex from 'vuex'
import api from "common/http/index.js"
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		beanInfo: {
			auction_count: 0, //有效竞拍次数
			goldCount: 0, // 金豆数量 
			sliverCount: 0 ,//银豆数量
			quotaCount:0,
			cardCount:0
		},
		noPrizeFlag: false,	//抽奖未获奖弹窗开关变量
		winPrizeFlag:false,	//抽奖获奖弹窗开关变量
		packageFlag: false,	//首页新人礼包开关变量
		collectionFlag: false,	// 新人获取福豆后提示去完善资料弹窗开关变量
	},
	mutations: {
		changeData(state, obj) { // store中的数据只能通过commit mutation来改变
			state.beanInfo = obj
		},
		changePrizeFlag(state, obj) { 
			state.noPrizeFlag = obj
		},
		changeWinFlag(state,obj) {
			state.winPrizeFlag = obj
		},
		changePackageFlag(state,obj) {
			state.packageFlag = obj;
		},
		changeCollectionFlag(state,obj) {
			state.collectionFlag = obj;
		}
	},
	actions: {
		/* 获取福豆信息、竞拍次数 */
		beanAuction(context) {
			let data = {
				token: 'www222333444wwww'
			};
			api.getBeanInfo(data)
				.then(res => {
					if (res.data.code == "0001") {
						context.commit('changeData', res.data.data)
					} else {

					}
				})
				.catch(err => {
					this.loading = false;
					console.log('request fail', err);
				});

		},



	}
})

export default store
