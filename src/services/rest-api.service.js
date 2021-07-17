export const uploadFile = async (file, url, onProgress) => {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest()

		if (onProgress) xhr.upload.addEventListener('progress', onProgress)

		xhr.upload.addEventListener('error', () => {
			reject(new Error('Upload errored'))
		})
		xhr.upload.addEventListener('abort', () => reject(new Error('Upload aborted.')))
		xhr.addEventListener('load', () => {
			if (xhr.status >= 400) {
				return reject(new Error(`${xhr.status} - Upload failed. ${xhr.responseText}. ${xhr.response}`))
			}
			resolve()
		})

		xhr.open('PUT', url)
		xhr.send(file)
	})
}
