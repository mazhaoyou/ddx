import Vue from 'vue';
import App from './App';
import api from '@/common/http/';
import store from './store/store';
import storage from './common/storage/storage.js';
import util from './common/util.js';
import * as filters from  './common/filters.js'


Vue.prototype.$api = api;
Vue.prototype.$store = store;
Vue.prototype.$storage = storage;
Vue.prototype.$util = util;

Vue.config.productionTip = false;
App.mpType = 'app';

// 定义全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})


const app = new Vue({
	store,
	...App
})
app.$mount()
