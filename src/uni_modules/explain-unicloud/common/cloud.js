function callFunction(options, config) {
	// 检查请求拦截
	if (cloud.interceptor.request && typeof cloud.interceptor.request === 'function') {
		options = cloud.interceptor.request(options)
	}

	return new Promise((reslove, reject) => {
		uniCloud.callFunction({
			name: options.cloudFunction,
			data: options
		}).then(res => {
			// 检查响应拦截
			let resInterceptor = false
			if (cloud.interceptor.response && typeof cloud.interceptor.response === 'function') {
				resInterceptor = cloud.interceptor.response(res)
			}
			if (resInterceptor) {
				reslove(resInterceptor.result)
			} else {
				reslove(res.result)
			}
		}).catch(error => {
			reject(error)
		})
	})
}

let cloud = {
	call: (service, action, params = {}, config = {}) => {
		return callFunction({
			service,
			action,
			params
		}, config)
	},
	request: (route, method, params = {}, config = {}) => {
		return callFunction({
			route,
			method,
			params
		}, config)
	},
	interceptor: {
		request: null,
		response: null
	}
}

export default cloud
