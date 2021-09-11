export const uploadFile = (file, url, onProgress) => {
	const xhr = new XMLHttpRequest()

	return {
		promise: new Promise((resolve, reject) => {
			if (onProgress) xhr.upload.addEventListener('progress', onProgress)

			xhr.upload.addEventListener('error', () => reject(new Error('Upload errored')))
			xhr.upload.addEventListener('abort', () => resolve({result: 'cancelled'}))
			xhr.addEventListener('load', () => {
				if (xhr.status >= 400) {
					return reject(new Error(`${xhr.status} - upload failed. ${xhr.responseText}. ${xhr.response}`))
				}
				resolve({result: 'completed'})
			})

			xhr.open('PUT', url)
			xhr.send(file)
		}),
		cancel: () => {
			return new Promise((resolve, reject) => {
				xhr.addEventListener('load', () => {
					if (xhr.status >= 400) {
						return reject(new Error(`${xhr.status} - upload cancel failed. ${xhr.responseText}. ${xhr.response}`))
					}
					resolve({result: 'completed'})
				})
				xhr.upload.addEventListener('error', () => {
					reject(new Error('error cancelling upload'))
				})
				xhr.upload.addEventListener('abort', () => resolve({result: 'cancelled'}))
				xhr.abort()
			})
		},
	}
}
