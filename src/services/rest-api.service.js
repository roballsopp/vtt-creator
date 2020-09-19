export const uploadFile = async (file, url, onProgress) => {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();

		if (onProgress) xhr.upload.addEventListener('progress', onProgress);

		xhr.upload.addEventListener('error', reject);
		xhr.upload.addEventListener('abort', reject);
		xhr.addEventListener('load', resolve);

		xhr.open('PUT', url);
		xhr.send(file);
	});
};
