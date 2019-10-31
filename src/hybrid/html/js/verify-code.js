
/* 获取url地址函数 */
function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] == variable) {
			return pair[1];
		}
	}
	return (false);
}


/* toast弹框显示 */
function showToast(msg) {
	var toastText = document.querySelector("#showToast");
	var toastDiv = document.querySelector("#toast_div");
	if (!isEmpty(msg)) {
		toastText.innerText = msg;
		toastDiv.style.display = "block";
		setTimeout(function() {
			toastDiv.style.display = "none";
		}, 2000);
	}
}

/* 判断页面信息是否为空 */
function isEmpty(value) {
	var regu = "^[ ]+$";
	var re = new RegExp(regu);
	if (re.test(value) || value == null || value == undefined || value.length == 0) {
		return true;
	}
	return false;
}