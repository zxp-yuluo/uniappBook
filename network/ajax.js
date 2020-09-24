export default (options) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: options.url,
			method: options.method || 'GET',
			data: options.data || {},
			header: options.header || {},
			success: resolve,
			fail: reject
		})
	})
}
