// 搭配uniCloud.httpclient.request使用
// content: formData.getBuffer()
// header: formData.getHeaders(userHeaders)
module.exports = class FormData {
	constructor() {
		this._shouldUseCache = false
		this._cachedBuffer = null
		this._lineBreak = '\r\n'
		this._boundary =
			'------FormDataBaseBoundary' + Math.random().toString(36).substring(2)
		this.dataList = []
	}

	_addData(data) {
		this._shouldUseCache = false
		if (this.dataList.length === 0) {
			this.dataList.push(data)
			return
		}
		const lastData = this.dataList[this.dataList.length - 1],
			lastType = Buffer.isBuffer(lastData) ? 'buffer' : 'other',
			currentType = Buffer.isBuffer(data) ? 'buffer' : 'other'
		switch (`${lastType}_${currentType}`) {
			case 'buffer_buffer':
				this.dataList.push(this._lineBreak)
				this.dataList.push(data)
				break;
			case 'buffer_other':
				this.dataList.push(this._lineBreak + data)
				break;
			case 'other_buffer':
				this.dataList[this.dataList.length - 1] = lastData + '\r\n'
				this.dataList.push(data)
				break;
			case 'other_other':
				this.dataList[this.dataList.length - 1] = lastData + '\r\n' + data
				break;
			default:
				break;
		}
	}

	append(name, value, options) {
		this._addData('--' + this._boundary)
		let leading = `Content-Disposition: form-data; name="${encodeURIComponent(name)}"`
		if (Buffer.isBuffer(value)) {
			if (!options.filename || !options.contentType) {
				throw new Error('filename and contentType required')
			}
			leading += `; filename="${encodeURIComponent(options.filename)}"`
			this._addData(leading)
			this._addData(`Content-Type: ${options.contentType}`)
			this._addData('')
			this._addData(value)
		} else {
			this._addData(leading)
			this._addData('')
			this._addData(value)
		}
	}

	getHeaders(options) {
		const headers = {
			'Content-Type': 'multipart/form-data; boundary=' + this._boundary,
			// 'Content-Length': this.getBuffer().length
		}
		return Object.assign(headers, options)
	}

	getBuffer() {
		if (this._shouldUseCache) {
			return this._cachedBuffer
		}
		this._shouldUseCache = true
		let dataBuffer = Buffer.alloc(0)
		this.dataList.forEach((item) => {
			if (Buffer.isBuffer(item)) {
				dataBuffer = Buffer.concat([dataBuffer, item])
			} else {
				dataBuffer = Buffer.concat([dataBuffer, Buffer.from('' + item)])
			}
		})
		dataBuffer = Buffer.concat([dataBuffer, Buffer.from(`${this._lineBreak}--${this._boundary}--`)])
		this._cachedBuffer = dataBuffer
		return dataBuffer
	}
}
