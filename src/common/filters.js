/* 
	毫秒转为正常格式时间过滤器 
	编写过滤器传入需要的时间格式，例如：yyyy-MM-dd hh:mm:ss或者yyyy年MM月dd日
	注意：月MM必须大写，目的为了区分月与分，其他都为小写
	时间格式定义：
		参数为0格式：yyyy-MM-dd hh:mm:ss 
		参数为1格式：yyyy-MM-dd 
		参数为2格式：hh:mm:ss 
		参数为3格式：yyyy年MM月dd日 hh时mm分ss秒
		参数为4格式：yyyy年MM月dd日 
		参数为5格式：hh时mm分ss秒
		参数为6格式：yyyy年MM月 
		参数为7格式：yyyy
		参数为8格式：yyyy/MM/dd 
*/
let formatDate = (date, fmt) => {
	var date = new Date(parseInt(date));

	if (fmt == 0) {
		fmt = "yyyy-MM-dd hh:mm:ss"
	} else if (fmt == 1) {
		fmt = "yyyy-MM-dd"
	} else if (fmt == 2) {
		fmt = "hh:mm:ss"
	} else if (fmt == 3) {
		fmt = "yyyy年MM月dd日 hh时mm分ss秒"
	} else if (fmt == 4) {
		fmt = "yyyy年MM月dd日"
	} else if (fmt == 5) {
		fmt = "hh时mm分ss秒"
	} else if (fmt == 6) {
		fmt = "yyyy年MM月"
	} else if (fmt == 7) {
		fmt = "yyyy"
	} else if (fmt == 8) {
		fmt = "yyyy/MM/dd"
	}
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	let o = {
		'M+': date.getMonth() + 1,
		'd+': date.getDate(),
		'h+': date.getHours(),
		'm+': date.getMinutes(),
		's+': date.getSeconds()
	};
	for (let k in o) {
		if (new RegExp(`(${k})`).test(fmt)) {
			let str = o[k] + '';
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
		}
	}
	return fmt;
};

/* 一位数两位数转换 */
let padLeftZero = (str) => {
	return ('00' + str).substr(str.length);
};

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
	获取发送消息时间过滤器
	还用过滤器就可以实现转换
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

/* 计算剩余过期时间的差值 */
const getExpirationTime = (currentTime, endTime) => {
	//计算出相差天数
	var dateDiff = Number(endTime) - Number(currentTime);
	var days = parseInt(dateDiff / (24 * 3600 * 1000));
	//计算出小时数
	var leave1 = dateDiff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
	var hours = Math.floor(leave1 / (3600 * 1000));
	//计算相差分钟数
	var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
	var minutes = Math.floor(leave2 / (60 * 1000)) < 10 ? '0' + Math.floor(leave2 / (60 * 1000)) : Math.floor(leave2 / (
		60 * 1000));
	//计算相差秒数
	var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
	var seconds = Math.round(leave3 / 1000) < 10 ? '0' + Math.round(leave3 / 1000) : Math.round(leave3 / 1000);
	var tip = "";
	if (dateDiff >= 24 * 60 * 60 * 1000) {
		tip = days + "天后过期";
	} else if (dateDiff <= 24 * 60 * 60 * 1000 && dateDiff > 60 * 60 * 1000) {
		tip = hours + "小时后过期";
	} else if (dateDiff <= 35999999 && dateDiff >= 60 * 1000) {
		tip = minutes + "分钟后过期";
	} else {
		tip = seconds + "秒后过期";
	}
	return tip;
}

export {
	formatDate,
	getFormatTime,
	getExpirationTime
}
