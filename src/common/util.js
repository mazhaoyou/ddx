function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	var hour = parseInt(time / 3600)
	time = time % 3600
	var minute = parseInt(time / 60)
	time = time % 60
	var second = time

	return ([hour, minute, second]).map(function(n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}

function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}
var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function(milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function(dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function(number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDay()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};
/* 判断json数组是否相等 */
const contrastArray = (array1, array2) => {
	if (!array1 || !array2) {
		return false;
	}
	if (array1.length != array2.length) {
		return false;
	}
	if (JSON.stringify(array1) != JSON.stringify(array2)) {
		return false;
	}
	for (var i = 0, l = array1.length - 1; i < l; i++) {
		if (Array.isArray(array1) && Array.isArray(array2)) {
			if (!array1[i] === (array2[i])) {
				return false;
			}
		}
	}
	return true;
}
/*
 * JSON数组去重
 * @param: [array] json Array
 * @param: [string] 唯一的key名，根据此键名进行去重
 */

const uniqueArray = (array, key) => {
	let rarray = [];
	let tjson = {};
	array.map(function(item) {
		if (typeof item == 'object') {
			if (!tjson[item[key]]) {
				tjson[item[key]] = true;
				rarray.push(item);
			}
		} else {
			if (!tjson[item]) {
				tjson[item] = true;
				rarray.push(item);
			}
		}
	})
	return rarray;
}

/* 获取当前时间戳 */
const getUnix = () => {
	var date = new Date();
	return date.getTime();
}

/* 获取今天0点0分0秒的时间戳 */
const getTodayUnix = () => {
	var date = new Date();
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);
	date.setMilliseconds(0);
	return date.getTime();
}

/* 获取今年1月1日0点0分0秒的时间戳 */
const getYearUnix = () => {
	var date = new Date();
	date.setMonth(0);
	date.setDate(1);
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);
	date.setMilliseconds(0);
	return date.getTime();
}

/* 获取标准年月日 */
const getLastDate = (time) => {
	var date = new Date(parseInt(time));
	var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
	var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
	return date.getFullYear() + '/' + month + "/" + day;
}

/* 
	转换消息时间直接调用此函数
	调用此方法就可以转换
*/
const getFormatTime = (timestamp) => {
	var now = getUnix(); //当前时间戳
	var today = getTodayUnix(); //今天0点时间戳
	var year = getYearUnix(); //今年0点时间戳
	var timer = (now - timestamp) / 1000; // 转换为秒级时间戳
	var tip = '';

	if (timer <= 0) {
		tip = '刚刚';
	} else if (Math.floor(timer / 60) <= 0) {
		tip = '刚刚';
	} else if (timer < 3600) {
		tip = Math.floor(timer / 60) + '分钟前';
	} else if (timer >= 3600 && (timestamp - today >= 0)) {
		tip = Math.floor(timer / 3600) + '小时前';
	} else if (timer / 86400 <= 31) {
		tip = Math.ceil(timer / 86400) + '天前';
	} else {
		tip = getLastDate(timestamp);
	}
	return tip;
}

module.exports = {
	formatTime,
	formatLocation,
	dateUtils,
	contrastArray,
	uniqueArray,
	getFormatTime
}
