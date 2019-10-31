var Time = {
	// 获取当前时间戳
	getUnix: function() {
		var date = new Date();
		return date.getTime();
	},
	// 获取今天0点0分0秒的时间戳
	getTodayUnix: function() {
		var date = new Date();
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
		return date.getTime();
	},
	// 获取今年1月1日0点0分0秒的时间戳
	getYearUnix: function() {
		var date = new Date();
		date.setMonth(0);
		date.setDate(1);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
		return date.getTime();
	},
	// 获取标准年月日
	getLastDate: function(time) {
		var date =  time ? new Date(time) : new Date();
		var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
		var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
		return {
			cross: date.getFullYear() + '-' + month + "-" + day,
			oblique: date.getFullYear() + '/' + month + "/" + day
		};
	},
	// 转换时间
	getFormatTime: function(timestamp) {
		var now = this.getUnix(); //当前时间戳
		var today = this.getTodayUnix(); //今天0点时间戳
		var year = this.getYearUnix(); //今年0点时间戳
		var timer = (now - timestamp) / 1000; // 转换为秒级时间戳
		var tip = '';

		if(timer <= 0) {
			tip = '刚刚';
		} else if(Math.floor(timer / 60) <= 0) {
			tip = '刚刚';
		} else if(timer < 3600) {
			tip = Math.floor(timer / 60) + '分钟前';
		} else if(timer >= 3600 && (timestamp - today >= 0)) {
			tip = Math.floor(timer / 3600) + '小时前';
		} else if(timer / 86400 <= 31) {
			tip = Math.ceil(timer / 86400) + '天前';
		} else {
			tip = this.getLastDate(timestamp).cross;
		}
		return tip;
	},
	// 计算剩余开始时间的天数
	getDaysNum(currentTime, endTime){
		//计算出相差天数
		let dateDiff = Number(endTime) - Number(currentTime);
		// console.log(dateEnd.getTime(),dateBegin.getTime())
		let days=parseInt(dateDiff/(24*3600*1000));
		//计算出小时数
		let leave1=dateDiff%(24*3600*1000);    //计算天数后剩余的毫秒数
		let hours=Math.floor(leave1/(3600*1000));
		//计算相差分钟数
		let leave2=leave1%(3600*1000);       //计算小时数后剩余的毫秒数
		let minutes=Math.floor(leave2/(60*1000)) < 10 ? '0' + Math.floor(leave2/(60*1000)) : Math.floor(leave2/(60*1000));
		//计算相差秒数
		let leave3=leave2%(60*1000);      //计算分钟数后剩余的毫秒数
		let seconds=Math.round(leave3/1000) < 10 ? '0' + Math.round(leave3/1000) : Math.round(leave3/1000);
		let time = {
			days,
			hours,
			minutes,
			seconds
		};
		return time;
	},
	getPoorMs(faultDate, completeTime){
		let stime = Date.parse(new Date(faultDate));
		let etime = Date.parse(new Date(completeTime));
		let usedTime = etime - stime; //两个时间戳相差的毫秒数
		return usedTime;
	}
};

Vue.directive('time', {
	bind: function(el, binding) {
		console.log("time:"+binding.value);
		el.innerHTML = Time.getFormatTime(binding.value);
		el.timeout = setInterval(function() {
			el.innerHTML = Time.getFormatTime(binding.value);
		}, 60000);
	},
	unbind: function(el) {
		clearinterval(el.meout);
		delete el.timeout;
	}

});
// module.exports.Time = Time;
let aa = {
	fn: function(){
		console.log(1)
	}
}
module.exports = {
	time: Time
}