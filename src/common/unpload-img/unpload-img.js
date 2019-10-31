/*
	封装图片上传功能
	使用前先new 一下
	所有方法均返回 promise 对象 可使用then() 写后续业务 或 使用 async await
	服务端返回示例
	{
		"code":"0001",
		"msg":"上传成功",
		"data":"http://www.test.com/uploads/20190227/f2824d2d4dc38f30699f816226b4a578.jpg"
	}
	choose	选择图片
		参数 num 为要选择的图片数量
	uploadOne 上传一张图片
		参数 path  选择成功后返回的 缓存文件图片路径
	upload  上传多张图片
		参数 path_arr 选择图片成功后 返回的图片路径数组
	chooseAndUpload  选择图片并上传
		参数 num 为要选择的图片数量
		
*/
var Uploader =  {
	constructor() {
		
	},
	choose(num) {
		return new Promise((resolve, reject) => {
			uni.chooseImage({
				sourceType: ["camera", "album"], //拍照、相册
				sizeType: ['original', 'compressed'], // 指定图片是原图还是压缩图，默认二者都有
				count: num, //上传图片数目
				success(res) {
					// console.log(res);
					// 缓存文件路径
					resolve(res.tempFilePaths)
				},
				fail(err) {
					console.log(err)
					reject(err)
				}
			})
		})

	},
	uploadOne(path,img_src_url,form_data,img_file_name) {
		return new Promise((resolve, reject) => {
			uni.showLoading({
				title:'上传中'
			})
			uni.uploadFile({
				url: img_src_url, //仅为示例，非真实的接口地址
				filePath: path,
				name: img_file_name,
				formData: form_data,
				header:{"Content-Type": "multipart/form-data","token":form_data.token},
				success: (uploadFileRes) => {
					// console.log(uploadFileRes.data);
					if("string"===typeof uploadFileRes.data){
						resolve(JSON.parse(uploadFileRes.data))
					}else{
						resolve( uploadFileRes.data)
					}
				},
				complete() {
					uni.hideLoading()
				}
			});
		})
	},
	upload(path_arr,img_src_url,form_data,img_file_name) {
		let num = path_arr.length;
		return new Promise(async (resolve, reject) => {
			let img_urls = []
			for (let i = 0; i < num; i++) {
				let img_url = await this.uploadOne(path_arr[i],img_src_url,form_data,img_file_name);
				// console.log(img_url)
				img_urls.push(img_url)
			};
			resolve(img_urls)
		})


	},
	// 在上传图片对应界面调用此方法
	chooseAndUpload(num,img_src_url,form_data,img_file_name) {
		return new Promise(async (resolve, reject) => {
			let path_arr = await this.choose(num);
			let img_urls = await this.upload(path_arr,img_src_url,form_data,img_file_name);
			// console.log(img_urls)
			resolve(img_urls);
		})

	}
}
export default Uploader;