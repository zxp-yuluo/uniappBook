<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			uni.setStorageSync('tempBooks','')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url("./static/font/iconfont.css");
	html,
	body,
	page {
		height: 100%;
	}
	body {
		font-family: "PingFang SC", "DroidSansFallback", sans-serif;
	}
</style>
