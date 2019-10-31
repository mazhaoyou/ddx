<script>
export default {
	onLaunch: function() {
		let data = {
			appid: plus.runtime.appid,
			verSion: plus.runtime.version,
			phoneType: '',
			sid: 'ios',
			os: plus.os.name
		};
		// #ifdef APP-PLUS
		this.appUpdate(data);
		// #endif
	},
	methods: {
		/* app更新检测 */
		appUpdate(data) {
			this.$api.appUpdate(data).then(res => {
				res = res.data;
				console.log(JSON.stringify(res.data));
				if (res.code == '0001') {
					let updata = res.data;
					if (updata.updateflag == 2) {
						console.log(updata.wgtUrl);
						uni.downloadFile({
							url: updata.wgtUrl,
							success: downloadResult => {
								if (downloadResult.statusCode === 200) {
									plus.runtime.install(
										downloadResult.tempFilePath,
										{
											force: false
										},
										function() {
											console.log('install success...');
											plus.runtime.restart();
										},
										function(e) {
											console.error('install fail...');
										}
									);
								}
							}
						});
					} else if (updata.updateflag == 1) {
						
						uni.showModal({
							title: '更新提示',
							content: updata.versionDesc,
							confirmColor: '#FF9C00',
							success: function(res) {
								if (res.confirm) {
								
									plus.runtime.openURL(updata.pkgUrl);
								} else if (res.cancel) {
									plus.runtime.quit();
								}
							}
						});
					} else if (updata.updateflag == 0) {
						uni.showModal({
							title: '更新提示',
							content: updata.versionDesc,
							confirmColor: '#FF9C00',
							success: function(res) {
								if (res.confirm) {
									plus.runtime.openURL(updata.pkgUrl);
								} else if (res.cancel) {
								}
							}
						});
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
@import './common/uni.css';
/*每个页面公共css */
.status-bar {
	padding-top: var(--status-bar-height);
}
.container {
	width: 100%;
}
@font-face {
	font-family: yticon;
	font-weight: normal;
	font-style: normal;
	src: url('https://at.alicdn.com/t/font_1131764_6f5fwg7egtb.ttf') format('truetype');
}
[v-cloak] {
	display: none;
}
</style>
