import { ApiURL } from '../config';

export const getUploadUrl = async () => {
	const resp = await fetch(`${ApiURL}/upload`);
	const { url } = await resp.json();
	return url;
};

export const uploadFile = async (file, onProgress) => {
	const url = await getUploadUrl();

	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();

		if (onProgress) xhr.upload.addEventListener('progress', onProgress);

		xhr.upload.addEventListener('load', resolve);
		xhr.upload.addEventListener('error', reject);
		xhr.upload.addEventListener('abort', reject);

		xhr.open('PUT', url);
		xhr.send(file);
	});
};
