import sha1 from './sha1.js';
/* 加密所需秘钥 */
const secretKey = "lVHtuCOfgXffjNQt";
export default {
	config: {
		/* 请求接口通用地址 */
		baseUrl: "http://124.193.68.233:81/mock/14",
		header: {
			'Content-Type': 'application/json;charset=UTF-8',
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data: {},
		method: "post",
		dataType: "json",
		responseType: "text",
		success() {},
		fail() {},
		complete() {}
	},
	interceptor: {
		request: null,
		response: null
	},
	request(options) {
		if (!options) {
			options = {}
		}
		options.baseUrl = options.baseUrl || this.config.baseUrl
		options.dataType = options.dataType || this.config.dataType
		options.url = options.baseUrl + options.url
		options.method = options.method || this.config.method
		let [timestamp, jsonKey] = [_currentTime(), jsonSort(options.data)];
		let shaStr = timestamp + "&" + jsonKey + secretKey;
		/* sha1加密 */
		let secretStr = sha1.hex_sha1(shaStr);
		/* 封装请求数据 */
		let reqStr = {
			"timestamp": timestamp,
			"signature": secretStr,
			"data": options.data
		}
		options.data = reqStr;

		return new Promise((resolve, reject) => {
			let _config = null

			options.success = (response) => {
				let statusCode = response.statusCode;
				response.config = _config;
				if (process.env.NODE_ENV === 'development') {
					if (statusCode === 200) {
						//console.log("【" + _config.requestId + "】 结果：" + JSON.stringify(response.data))
					}
				}
				if (this.interceptor.response) {
					let newResponse = this.interceptor.response(response)
					if (newResponse) {
						response = newResponse;
					}
				}
				// 统一的响应日志记录

				//_reslog(response)
				if (statusCode === 200) { //成功
					resolve(response);
				} else {
					reject(response)
				}
			}
			options.fail = (response) => {
				 uni.showToast({
					title: '网络异常，请检查网络',
					position:'bottom'
				})
			}

			_config = Object.assign({}, this.config, options)
			_config.requestId = new Date().getTime()

			if (this.interceptor.request) {
				this.interceptor.request(_config)
			}

			// 统一的请求日志记录
			//_reqlog(_config)

			if (process.env.NODE_ENV === 'development') {
				//console.log("【" + _config.requestId + "】 地址：" + _config.url)
				if (_config.data) {
					//console.log("【" + _config.requestId + "】 参数：" + JSON.stringify(_config.data))
				}
			}
			uni.request(_config);
		});
	},
	get(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'GET'
		return this.request(options)
	},
	post(url, data, options) {
		if (!options) {
			options = {}
		}
		options.data = data
		options.method = 'POST'
		return this.request(options)
	}
}

/* 加密方法 */
const encrypt = (data) => {
	var sha = sha1.hex_sha1(data);
	return sha;
}
/* 根据请求参数获得key，并且通过升序排序 */
const jsonSort = (data) => {
	let arr = [];
	for (var key in data) {
		arr.push(key.toLowerCase())
	}
	arr.sort();
	let str = '';
	for (var i in arr) {

		str += arr[i] + "&";
	}
	return str;
}
/* 获得当前时间 
 *以getTime形式返回
 */
const _currentTime = () => {
	var timestamp = new Date().getTime();
	return timestamp;
}

/**
 * 日志记录
 */
function _reqlog(req) {
	if (process.env.NODE_ENV === 'development') {
		console.log("【" + req.requestId + "】 地址：" + req.url)
		if (req.data) {
			console.log("【" + req.requestId + "】 请求参数：" + JSON.stringify(req.data))
		}
	}
}

/**
 * 响应接口日志记录
 */
function _reslog(res) {
	console.log(JSON.stringify(res));
	let _statusCode = res.statusCode;
	console.log(_statusCode)
	if (process.env.NODE_ENV === 'development') {
		console.log("【" + res.config.requestId + "】 地址：" + res.config.url)
		if (res.config.data) {
			console.log("【" + res.config.requestId + "】 请求参数：" + JSON.stringify(res.config.data))
		}
		console.log("【" + res.config.requestId + "】 响应结果：" + JSON.stringify(res))
	} 
	//TODO 除了接口服务错误外，其他日志调接口异步写入日志数据库
	switch (_statusCode) {
		case 200:
			break;
		case 401:
			break;
		case 404:
			break;
		case 500:
		case 304:
			uni.showModal({
				title: '更新提示',
				content: '是否选择更新',
				success: (showResult) => {}
			})
			break;
		default:
			break;
	}
}


export {
	jsonSort,
	encrypt,
	_currentTime

}
