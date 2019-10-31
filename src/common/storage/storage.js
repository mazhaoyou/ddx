/* 
 *数据存储
 * type 不传值为1 存储 json数组格式数据，存储字符串时 type 传2
 * 
 */
const setStorage = (key, data, type = 1) => {
	let stData = data;
	if (type == 1) {
		stData = JSON.stringify(data)
	}
	uni.setStorage({
		key: key,
		data: stData,
		success: function() {
			/* uni.showModal({
				title: "缓存成功"
			}) */
		}
	})
}
/* 获取本地缓存内容 
 *type 默认为1 为1时 返回json数组
 *type为2 返回字符串 
 */
const getStorage = (key, type = 1) => {
	try {
		let data = uni.getStorageSync(key);
		if (type == 1) {
			if (data) {
				return JSON.parse(data);
			} else {
				return [];
			}
		} else if (type == 2 || type == "2") {
			if (data) {
				return data;
			} else {
				return "";
			}
		}

	} catch (e) {
		console.log(e)
		uni.showToast({
			title: "获取缓存失败"
		})
	}

}
/* 判断当前用户是否已登录 
 *已登录 返回token
 * 未登录跳转到登录页面
 */
const isAuthed = () => {
	if (getStorage('token', 2)) {
		return getStorage('token', 2);
	} else {
		uni.navigateTo({
			url: '/pages/login/login',
			animationType: 'slide-in-right'
		})
	}
}
/* 获得目前存储的keys 
 *currentSize：当前占用的空间大小, 单位：kb
 * limitSize：限制的空间大小, 单位：kb
 * 当前 storage 中所有的 key
 **/
const getStorageInfo = () => {
	try {
		const res = uni.getStorageInfoSync();
		return res;
	} catch (e) {
		uni.showModal({
			title: "获得缓存信息失败"
		})
	}

}

//计算时间差 
const daysBetween = (faultDate, completeTime) => {

	let stime = Date.parse(new Date(faultDate));
	let etime = Date.parse(new Date(completeTime));
	let usedTime = completeTime - faultDate; //两个时间戳相差的毫秒数
	let time = usedTime / 3600;
	return time;
}

/* 缓存图片  只支持以json数组形式传值
 *imgKey：要保存的图片唯一标识key
 * imgUrls：图片key，通过key获得图片
 * imgData：要存储的json数组
 */
const setStorageImg = (imgKey, imgUrls, imgData) => {
	let localImg = imgData;

	for (let [index, elem] of imgData.entries()) {
		let imgUrl = elem[imgUrls];
		uni.downloadFile({
			url: imgUrl,
			success: (res) => {
				if (res.statusCode === 200) {
					let tempFilePath = res.tempFilePath;
					saveFile(tempFilePath).then(response => {
						localImg[index][imgUrls] = response.savedFilePath;
						/* 缓存本地地址 */
						setStorage(imgKey, localImg)
					}).catch(err => {
						console.log("当前平台不支持该存储方式");

					})
				}
			}
		});
	};

};

/* 持久化保存文件 */
const saveFile = tempFilePath => {
	return new Promise((resolve, reject) => {
		uni.saveFile({
			tempFilePath: tempFilePath,
			success: (res) => {
				resolve(res);
			},
			fail(res) {
				reject(res);
			}
		});
	})
};
/* 获得缓存信息 */
const getMemorySpace = () => {
	let memory = 0;
	return new Promise((resolve, reject) => {
		uni.getSavedFileList({
			success: function(res) {
				let fileList = res.fileList;

				for (let [index, elem] of fileList.entries()) {
					memory += elem.size
				}
				memory = (memory / 1048576).toFixed(2) + 'MB';
				resolve(memory);
			}
		});
	});

}
/*获得缓存文件列表 */
const getSavedFileLists = () => {
	return new Promise((resolve, reject) => {
		uni.getSavedFileList({
			success(res) {
				resolve(res.fileList);
			}
		})
	})

}

/* 
	单个清除缓存
	
*/
const clearCloneStorage = (key) => {
	uni.removeStorage({
		key: key,
		success: function(res) {
			
		},
		fail: function(err) {
			console.log('清除缓存失败')
		}
	});
}

/* 清除缓存 
 *type为1 手动清除 type 为2 定期清除缓存的图片
 * @mzy
 */
const clearStorage = (type) => {
	if (type == 1) {
		uni.getSavedFileList({
			success(res) {
				if (res.fileList.length > 0) {
					for (let i = 0; i < res.fileList.length; i++) {
						uni.removeSavedFile({
							filePath: res.fileList[i].filePath,
							complete: function(res) {
								console.log(res);
							}
						});
					}
				}

			}
		})
		uni.clearStorage();
	} else if (type == 2) {
		getSavedFileLists().then(res => {
			res.forEach((item, index) => {
				let minute = daysBetween(item.createTime, Math.round(new Date() / 1000));
				/* 默认清除缓存时间 */
				if (minute > 24) {
					uni.removeSavedFile({
						filePath: item.filePath,
						success: function(res) {

							uni.removeStorage({
								key: "netImgUrl"
							})
						}
					});
				}
			});
		}).catch(err => {
			console.log(err);
		})
	}
}

export default {
	getStorage,
	setStorage,
	isAuthed,
	getStorageInfo,
	setStorageImg,
	getMemorySpace,
	clearStorage,
	clearCloneStorage
}
